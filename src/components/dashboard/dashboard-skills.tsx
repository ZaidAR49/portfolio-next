"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { FaTrash, FaSearch, FaTimes, FaPlus, FaTag, FaFileImport, FaFolderOpen } from "react-icons/fa";
import { MdDragIndicator } from "react-icons/md";
import { getActiveSkillsAction, deleteSkillAction, addSkillAction, updateSkillAction } from "@/actions/skill-action";
import { getActiveUserAction } from '@/actions/user-action';
import { getActiveCategoriesAction } from "@/actions/category-action";
import { Skill } from "@/lib/models/skill";
import { Category } from "@/lib/models/category";
import { availableTechnologies, getIconForTechnology, technologyCategories } from "@/lib/utils/client/icon-mapper";
import { toast, Toaster } from "sonner";
import { Loading } from "@/components/loading";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { CategoryManager } from "@/components/dashboard/category-manager";
import { CategorySelectField } from "@/components/forms/category-select-field";
import { ImportModal } from "@/components/dashboard/import-modal";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragStartEvent,
    DragOverlay,
    useDraggable,
    useDroppable,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

export function DashboardSkills() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [skillToDelete, setSkillToDelete] = useState<number | null>(null);
    const [activeUserId, setActiveUserId] = useState<number | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'uncategorized' | number>('all');
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [activeDragSkill, setActiveDragSkill] = useState<Skill | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor)
    );

    const fetchInitialData = () => {
        setIsLoading(true);
        Promise.all([
            getActiveSkillsAction(),
            getActiveCategoriesAction("skill"),
            getActiveUserAction()
        ]).then(([skillsData, catsData, usersData]) => {
            setSkills(skillsData);
            if (catsData) setCategories(catsData);
            if (usersData) {
                setActiveUserId(usersData.id);
            }
        }).catch(err => {
            console.error(err);
            toast.error("Failed to load skills.");
        }).finally(() => {
            setIsLoading(false);
        });
    };

    const fetchSkills = () => {
        getActiveSkillsAction().then(data => setSkills(data)).catch(console.error);
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    const handleDeleteClick = (id: number) => {
        setSkillToDelete(id);
    };

    const handleConfirmDelete = async () => {
        if (skillToDelete === null) return;
        try {
            await deleteSkillAction(skillToDelete);
            toast.success("Skill removed");
            setSkills(prev => prev.filter(s => s.id !== skillToDelete));
        } catch (error) {
            toast.error("Failed to remove skill");
            console.error(error);
        } finally {
            setSkillToDelete(null);
        }
    };

    const handleAddSkill = async (name: string, categoryId: number | null) => {
        if (!activeUserId) {
            toast.error("No active user found. Please activate a portfolio first.");
            return;
        }

        if (skills.some(s => s.name.toLowerCase() === name.toLowerCase())) {
            toast.error(`${name} is already in your skills.`);
            return;
        }

        try {
            setIsAddModalOpen(false);
            const promise = addSkillAction({
                name,
                category_id: categoryId,
                user_id: activeUserId
            }).then(() => {
                fetchSkills();
            });

            toast.promise(
                promise,
                {
                    loading: `Adding ${name}...`,
                    success: `${name} added securely`,
                    error: "Failed to add skill"
                }
            );
        } catch (error) {
            console.error(error);
        }
    };

    const handleCategoriesChange = (updatedCats: Category[]) => {
        setCategories(updatedCats);
        if (typeof selectedCategory === 'number' && !updatedCats.some(c => c.id === selectedCategory)) {
            setSelectedCategory('all');
        }
    };

    const uncategorizedCount = useMemo(() => {
        return skills.filter(s => !s.category_id).length;
    }, [skills]);

    const categoryPills = useMemo(() => {
        const pills: { key: 'all' | 'uncategorized' | number; label: string; count: number }[] = [
            { key: 'all', label: 'All Skills', count: skills.length },
        ];

        if (uncategorizedCount > 0) {
            pills.push({ key: 'uncategorized', label: 'Uncategorized', count: uncategorizedCount });
        }

        for (const cat of categories) {
            const count = skills.filter(s => s.category_id === cat.id).length;
            pills.push({ key: cat.id!, label: cat.name, count });
        }

        return pills;
    }, [categories, skills, uncategorizedCount]);

    const filteredSkills = useMemo(() => {
        let list = [...skills];

        if (selectedCategory === 'uncategorized') {
            list = list.filter(s => !s.category_id);
        } else if (selectedCategory !== 'all') {
            list = list.filter(s => s.category_id === selectedCategory);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(s => s.name.toLowerCase().includes(q));
        }

        return list;
    }, [skills, selectedCategory, searchQuery]);

    const isFiltered = selectedCategory !== 'all' || searchQuery.trim() !== "";

    const groupedSections = useMemo(() => {
        if (selectedCategory !== 'all') return [];

        const sections: { category: Category | null; title: string; categoryId: number | null; items: Skill[] }[] = [];

        for (const cat of categories) {
            let catSkills = skills.filter(s => s.category_id === cat.id);
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                catSkills = catSkills.filter(s => s.name.toLowerCase().includes(q));
            }
            sections.push({ category: cat, title: cat.name, categoryId: cat.id!, items: catSkills });
        }

        let uncatSkills = skills.filter(s => !s.category_id);
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            uncatSkills = uncatSkills.filter(s => s.name.toLowerCase().includes(q));
        }
        if (uncatSkills.length > 0 || categories.length === 0) {
            sections.push({ category: null, title: 'Uncategorized', categoryId: null, items: uncatSkills });
        }

        return sections;
    }, [skills, categories, selectedCategory, searchQuery]);

    const handleDragStart = (event: DragStartEvent) => {
        const dragged = event.active.data.current?.skill as Skill | undefined;
        if (dragged) {
            setActiveDragSkill(dragged);
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveDragSkill(null);

        if (!over) return;

        const draggedSkill = active.data.current?.skill as Skill | undefined;
        if (!draggedSkill || !draggedSkill.id) return;

        let targetCategoryId: number | null | undefined = undefined;

        const overId = String(over.id);
        if (overId.startsWith('droppable-section-')) {
            const raw = overId.replace('droppable-section-', '');
            targetCategoryId = raw === 'uncategorized' ? null : Number(raw);
        } else if (overId.startsWith('droppable-pill-')) {
            const raw = overId.replace('droppable-pill-', '');
            if (raw === 'all') return;
            targetCategoryId = raw === 'uncategorized' ? null : Number(raw);
        }

        if (targetCategoryId !== undefined && targetCategoryId !== (draggedSkill.category_id ?? null)) {
            const updatedSkills = skills.map(s => s.id === draggedSkill.id ? { ...s, category_id: targetCategoryId } : s);
            setSkills(updatedSkills);

            const targetCatName = targetCategoryId === null
                ? "Uncategorized"
                : categories.find(c => c.id === targetCategoryId)?.name || "New Category";

            try {
                await updateSkillAction({
                    id: draggedSkill.id,
                    name: draggedSkill.name,
                    category_id: targetCategoryId,
                    user_id: activeUserId || draggedSkill.user_id,
                });
                toast.success(`Moved "${draggedSkill.name}" to "${targetCatName}"`);
            } catch (error) {
                console.error("Failed to move skill category", error);
                toast.error("Failed to move skill category");
                fetchSkills();
            }
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="space-y-8">
                {activeUserId && (
                    <CategoryManager
                        userId={activeUserId}
                        type="skill"
                        title="Manage Skill Categories"
                        items={skills}
                        itemLabel="skills"
                        onCategoriesChange={handleCategoriesChange}
                    />
                )}

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-foreground mb-1">Skills & Technologies</h2>
                        <p className="text-muted text-sm">
                            Manage technical skills &bull; <span className="text-primary font-medium">Drag and drop cards into any category to reassign</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsImportOpen(true)}
                            className="inline-flex items-center gap-2 bg-surface hover:bg-elevated border border-border text-foreground font-semibold py-2.5 px-4 rounded-xl transition-colors shadow-sm text-sm"
                        >
                            <FaFileImport size={13} className="text-primary" />
                            Import
                        </button>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-inverse font-bold py-2.5 px-6 rounded-xl transition-colors shadow-lg text-sm"
                        >
                            <FaPlus size={12} />
                            Add Skill
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar flex-1">
                            {categoryPills.map((pill) => {
                                const isActive = selectedCategory === pill.key;
                                return (
                                    <DroppableCategoryPill
                                        key={String(pill.key)}
                                        pill={pill}
                                        isActive={isActive}
                                        onClick={() => setSelectedCategory(pill.key)}
                                    />
                                );
                            })}
                        </div>

                        <div className="relative min-w-[220px]">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-xs pointer-events-none" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search skills…"
                                className="w-full bg-surface border border-border rounded-xl pl-9 pr-8 py-1.5 text-xs text-foreground placeholder-muted focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                                >
                                    <FaTimes size={10} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <Loading />
                ) : (
                    <div className="space-y-10">
                        {selectedCategory === 'all' ? (
                            groupedSections.length === 0 ? (
                                <div className="text-center py-16 bg-surface border border-border rounded-2xl p-8 space-y-4">
                                    <FaTag className="mx-auto text-muted text-3xl opacity-40" />
                                    <p className="text-muted font-medium">
                                        {skills.length === 0
                                            ? "No skills added yet. Click 'Add Skill' to get started!"
                                            : "No skills match the search query."}
                                    </p>
                                </div>
                            ) : (
                                groupedSections.map(sec => (
                                    <DroppableCategorySection
                                        key={sec.categoryId ?? 'uncategorized'}
                                        categoryId={sec.categoryId}
                                        title={sec.title}
                                        itemsCount={sec.items.length}
                                    >
                                        {sec.items.length === 0 ? (
                                            <div className="col-span-full border border-dashed border-border rounded-2xl p-8 text-center text-muted/70 text-sm bg-surface/30">
                                                <FaFolderOpen className="mx-auto mb-2 opacity-40 text-xl" />
                                                Drag skills here to assign to &ldquo;{sec.title}&rdquo;
                                            </div>
                                        ) : (
                                            sec.items.map(skill => (
                                                <DraggableSkillCard
                                                    key={skill.id!}
                                                    skill={skill}
                                                    categoryName={sec.category?.name}
                                                    onDelete={() => skill.id && handleDeleteClick(skill.id)}
                                                />
                                            ))
                                        )}
                                    </DroppableCategorySection>
                                ))
                            )
                        ) : (
                            <DroppableCategorySection
                                categoryId={selectedCategory === 'uncategorized' ? null : selectedCategory}
                                title={categoryPills.find(p => p.key === selectedCategory)?.label || "Skills"}
                                itemsCount={filteredSkills.length}
                            >
                                <div className="col-span-full flex items-center justify-between pb-1">
                                    <span className="text-xs text-muted">
                                        Drag cards to other category pills at the top to reassign.
                                    </span>
                                    {isFiltered && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedCategory('all');
                                                setSearchQuery('');
                                            }}
                                            className="text-xs text-primary hover:underline font-semibold"
                                        >
                                            Show all skills
                                        </button>
                                    )}
                                </div>

                                {filteredSkills.length === 0 ? (
                                    <div className="col-span-full border border-dashed border-border rounded-2xl p-8 text-center text-muted/70 text-sm bg-surface/30">
                                        No skills in this category. Drag any skill here or select a pill at the top.
                                    </div>
                                ) : (
                                    filteredSkills.map(skill => {
                                        const cat = categories.find(c => c.id === skill.category_id);
                                        return (
                                            <DraggableSkillCard
                                                key={skill.id!}
                                                skill={skill}
                                                categoryName={cat?.name}
                                                onDelete={() => skill.id && handleDeleteClick(skill.id)}
                                            />
                                        );
                                    })
                                )}
                            </DroppableCategorySection>
                        )}
                    </div>
                )}

                <DragOverlay>
                    {activeDragSkill && (
                        <div className="bg-surface border-2 border-primary rounded-2xl p-6 flex flex-col items-center justify-center gap-3 shadow-2xl ring-4 ring-primary/20 scale-105 rotate-2 cursor-grabbing opacity-95">
                            <div className="text-[40px] text-primary">
                                {getIconForTechnology(activeDragSkill.name)}
                            </div>
                            <span className="font-bold text-foreground text-[14px] text-center tracking-wide">
                                {activeDragSkill.name}
                            </span>
                            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                                Drop into category
                            </span>
                        </div>
                    )}
                </DragOverlay>

                {isAddModalOpen && activeUserId && (
                    <AddSkillModal
                        userId={activeUserId}
                        categories={categories}
                        onClose={() => setIsAddModalOpen(false)}
                        onAddSkill={handleAddSkill}
                        onCategoryCreated={(newCat) => setCategories(prev => [...prev, newCat])}
                    />
                )}

                <ImportModal
                    isOpen={isImportOpen}
                    onClose={() => {
                        setIsImportOpen(false);
                        fetchInitialData();
                    }}
                    entityType="skills"
                />

                <ConfirmModal
                    isOpen={skillToDelete !== null}
                    onClose={() => setSkillToDelete(null)}
                    onConfirm={handleConfirmDelete}
                    title="Remove Skill"
                    description="Are you sure you want to remove this skill? It will no longer appear on your public profile."
                    confirmText="Remove"
                    cancelText="Cancel"
                    isDestructive={true}
                />

                <Toaster richColors position="bottom-center" duration={2000} />
            </div>
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: var(--border);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: var(--border-hover);
                }
            `}</style>
        </DndContext>
    );
}

function DroppableCategorySection({
    categoryId,
    title,
    itemsCount,
    children,
}: {
    categoryId: number | null;
    title: string;
    itemsCount: number;
    children: React.ReactNode;
}) {
    const { setNodeRef, isOver } = useDroppable({
        id: `droppable-section-${categoryId ?? 'uncategorized'}`,
        data: { categoryId },
    });

    return (
        <div
            ref={setNodeRef}
            className={`space-y-4 p-4 -m-4 rounded-3xl transition-all duration-200 ${
                isOver
                    ? "bg-primary/5 border-2 border-dashed border-primary ring-4 ring-primary/10 shadow-inner"
                    : "border-2 border-transparent"
            }`}
        >
            <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-foreground">{title}</h3>
                <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full transition-colors ${
                        isOver
                            ? "bg-primary text-inverse"
                            : "bg-primary/10 text-primary border border-primary/20"
                    }`}
                >
                    {itemsCount}
                </span>
                {isOver && (
                    <span className="text-xs font-bold text-primary animate-pulse ml-auto">
                        Drop to move here
                    </span>
                )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {children}
            </div>
        </div>
    );
}

function DroppableCategoryPill({
    pill,
    isActive,
    onClick,
}: {
    pill: { key: 'all' | 'uncategorized' | number; label: string; count: number };
    isActive: boolean;
    onClick: () => void;
}) {
    const { setNodeRef, isOver } = useDroppable({
        id: `droppable-pill-${pill.key}`,
        data: { categoryId: pill.key === 'all' ? null : (pill.key === 'uncategorized' ? null : pill.key) },
        disabled: pill.key === 'all',
    });

    return (
        <button
            ref={setNodeRef}
            type="button"
            onClick={onClick}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                isOver
                    ? "bg-primary text-inverse ring-2 ring-primary shadow-md scale-105"
                    : isActive
                    ? "bg-primary text-inverse shadow-sm"
                    : "bg-surface border border-border text-muted hover:text-foreground hover:border-border-hover"
            }`}
        >
            <span>{pill.label}</span>
            <span
                className={`inline-flex items-center justify-center min-w-[1.2rem] h-4 px-1 rounded-full text-[10px] font-extrabold ${
                    isOver || isActive
                        ? "bg-inverse/20 text-inverse"
                        : "bg-elevated text-muted"
                }`}
            >
                {pill.count}
            </span>
        </button>
    );
}

function DraggableSkillCard({
    skill,
    categoryName,
    onDelete,
}: {
    skill: Skill;
    categoryName?: string;
    onDelete: () => void;
}) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `skill-${skill.id}`,
        data: { skill },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.3 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="bg-surface border border-border rounded-2xl p-6 flex flex-col items-center justify-center gap-3 relative group hover:border-primary/50 transition-all shadow-sm hover:shadow-md hover:-translate-y-1 duration-normal cursor-grab active:cursor-grabbing select-none"
        >
            <div className="absolute top-3 left-3 text-muted/40 group-hover:text-muted transition-colors pointer-events-none">
                <MdDragIndicator size={14} />
            </div>

            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                }}
                onPointerDown={(e) => e.stopPropagation()}
                className="absolute top-3 right-3 text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100 p-1.5 hover:bg-red-400/10 rounded-lg z-10"
                title="Remove skill"
            >
                <FaTrash size={12} />
            </button>

            <div className="text-[40px] text-primary transition-transform group-hover:scale-110 pointer-events-none">
                {getIconForTechnology(skill.name)}
            </div>

            <span className="font-bold text-foreground text-[14px] text-center tracking-wide pointer-events-none">
                {skill.name}
            </span>

            {categoryName && (
                <span className="text-[10px] font-semibold text-muted bg-elevated px-2.5 py-0.5 rounded-full border border-border pointer-events-none">
                    {categoryName}
                </span>
            )}
        </div>
    );
}

function AddSkillModal({
    userId,
    categories,
    onClose,
    onAddSkill,
    onCategoryCreated,
}: {
    userId: number;
    categories: Category[];
    onClose: () => void;
    onAddSkill: (name: string, categoryId: number | null) => void;
    onCategoryCreated: (cat: Category) => void;
}) {
    const [search, setSearch] = useState('');
    const [customName, setCustomName] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [activeFilterCategory, setActiveFilterCategory] = useState<string>("All");

    const techFilterCategories = useMemo(() => {
        const cats = new Set(Object.values(technologyCategories));
        return ["All", ...Array.from(cats)].sort((a, b) => {
            if (a === "All") return -1;
            if (b === "All") return 1;
            return a.localeCompare(b);
        });
    }, []);

    const filteredTech = useMemo(() => {
        let list = availableTechnologies;
        if (activeFilterCategory !== "All") {
            list = list.filter(t => technologyCategories[t] === activeFilterCategory);
        }
        if (search) {
            const lower = search.toLowerCase();
            list = list.filter(t => t.toLowerCase().includes(lower));
        }
        return list;
    }, [search, activeFilterCategory]);

    const handleCustomSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = customName.trim();
        if (!trimmed) return;
        onAddSkill(trimmed, selectedCategoryId);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-surface border border-border w-full max-w-4xl max-h-[88vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                            <FaPlus size={16} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-foreground">Add Skill or Technology</h3>
                            <p className="text-xs text-muted">Select a preset or enter a custom technology</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-muted hover:text-foreground p-2 rounded-xl hover:bg-elevated transition-colors"
                    >
                        <FaTimes size={16} />
                    </button>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
                    <div className="bg-elevated/40 border border-border/80 rounded-2xl p-4">
                        <CategorySelectField
                            value={selectedCategoryId}
                            onChange={setSelectedCategoryId}
                            userId={userId}
                            type="skill"
                            categories={categories}
                            onCategoryCreated={onCategoryCreated}
                        />
                    </div>

                    <form onSubmit={handleCustomSubmit} className="flex gap-2">
                        <input
                            type="text"
                            value={customName}
                            onChange={(e) => setCustomName(e.target.value)}
                            placeholder="Add custom technology name (e.g. LangChain, N8N, Bun)…"
                            className="flex-1 bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder-muted focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        />
                        <button
                            type="submit"
                            disabled={!customName.trim()}
                            className="bg-primary hover:bg-primary-hover disabled:opacity-40 text-inverse font-bold text-sm px-6 py-2.5 rounded-xl transition-colors shadow-sm"
                        >
                            Add Custom
                        </button>
                    </form>

                    <div className="space-y-3 border-t border-border pt-4">
                        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted">Presets & Icons</span>
                            <div className="relative min-w-[240px]">
                                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-xs pointer-events-none" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Filter presets…"
                                    className="w-full bg-surface border border-border rounded-xl pl-9 pr-3 py-1.5 text-xs text-foreground placeholder-muted focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 custom-scrollbar">
                            {techFilterCategories.map(catName => (
                                <button
                                    key={catName}
                                    type="button"
                                    onClick={() => setActiveFilterCategory(catName)}
                                    className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                                        activeFilterCategory === catName
                                            ? "bg-primary text-inverse shadow-sm"
                                            : "bg-surface text-muted hover:text-foreground border border-border"
                                    }`}
                                >
                                    {catName}
                                </button>
                            ))}
                        </div>
                    </div>

                    {filteredTech.length === 0 ? (
                        <div className="text-center py-8 text-muted text-sm">
                            No presets match your search. Use the custom input above to add it!
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                            {filteredTech.map(tech => (
                                <button
                                    key={tech}
                                    type="button"
                                    onClick={() => onAddSkill(tech, selectedCategoryId)}
                                    className="bg-surface border border-border hover:border-primary hover:bg-primary/10 rounded-xl p-4 flex flex-col items-center justify-center gap-2.5 transition-all outline-none focus:ring-2 focus:ring-primary group shadow-sm hover:shadow-md"
                                >
                                    <div className="text-3xl text-muted/80 group-hover:text-primary transition-colors">
                                        {getIconForTechnology(tech)}
                                    </div>
                                    <span className="font-bold text-muted group-hover:text-foreground text-xs text-center transition-colors line-clamp-1 w-full">
                                        {tech}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
