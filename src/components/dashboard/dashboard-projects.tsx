"use client";
import { FaEdit, FaTrash, FaTag, FaGithub, FaSearch, FaTimes, FaLayerGroup } from "react-icons/fa";
import { MdDragIndicator } from "react-icons/md";
import { getActiveProjectsAction, deleteProjectAction, bulkUpdateProjectOrdersAction } from "@/actions/project-action";
import { getActiveUserAction } from "@/actions/user-action";
import { getActiveCategoriesAction } from "@/actions/category-action";
import { Project } from "@/lib/models/project";
import { Category } from "@/lib/models/category";
import { Suspense, useState, useEffect, useMemo } from "react";
import { Loading } from "@/components/loading";
import Link from 'next/link';
import { toast, Toaster } from "sonner";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { ImportModal } from "@/components/dashboard/import-modal";
import { GitHubImportModal } from "@/components/dashboard/github-import-modal";
import { CategoryManager } from "@/components/dashboard/category-manager";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableProjectCard({
    proj,
    handleDeleteClick,
    categories,
    isDragDisabled = false
}: {
    proj: Project;
    handleDeleteClick: (id: number) => void;
    categories: Category[];
    isDragDisabled?: boolean;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: proj.id!, disabled: isDragDisabled });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative overflow-hidden bg-surface border border-border rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md hover:border-border-hover transition-all group ${isDragging ? 'opacity-80 shadow-2xl scale-[1.02] border-primary ring-2 ring-primary/20' : ''}`}
        >
            <div 
                {...(isDragDisabled ? {} : { ...attributes, ...listeners })} 
                className={`absolute top-4 right-4 z-20 p-1.5 rounded-lg backdrop-blur-sm border border-border transition-colors shadow-sm ${
                    isDragDisabled
                        ? 'bg-surface/50 text-muted/50 cursor-not-allowed opacity-50'
                        : 'cursor-grab active:cursor-grabbing bg-surface/90 text-muted hover:text-foreground hover:bg-elevated'
                }`}
                title={isDragDisabled ? "Reordering is available when viewing 'All' projects" : "Drag to reorder"}
            >
                <MdDragIndicator size={20} />
            </div>

            {/* Background Image Layer */}
            {proj.images && (
                <div
                    className="absolute inset-0 z-0 opacity-20 dark:opacity-30 group-hover:opacity-30 dark:group-hover:opacity-40 transition-opacity duration-300"
                    style={{
                        backgroundImage: `url(${proj.images[0] || '/default-bg.jpg'})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
            )}
            {/* Overlay Layer for readability */}
            <div className="absolute inset-0 z-1 bg-surface/80 backdrop-blur-sm pointer-events-none" />

            {/* Card Content Layer */}
            <div className="relative z-10 p-6 flex flex-col justify-between h-full gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-4 pr-10 flex-wrap">
                        <span className="text-xs font-mono bg-elevated text-foreground border border-border px-2 py-1 rounded shadow-sm font-semibold">#{proj.sort_order}</span>
                        <span className={`text-xs px-2 py-1 rounded border font-bold ${
                            (() => {
                                const cleanStatus = proj.status.toLowerCase().replace(/_/g, ' ').trim();
                                switch (cleanStatus) {
                                    case 'completed':
                                        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
                                    case 'in progress':
                                        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
                                    case 'suspended':
                                        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
                                    default:
                                        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
                                }
                            })()
                        }`}>
                            {proj.status.replace(/_/g, ' ').toLowerCase()}
                        </span>
                        {/* Category badge */}
                        {(() => {
                            const cat = categories.find((c) => c.id === proj.category_id);
                            return cat ? (
                                <span className="inline-flex items-center gap-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs px-2 py-1 rounded font-bold">
                                    <FaTag size={9} />
                                    {cat.name}
                                </span>
                            ) : null;
                        })()}
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors pr-10">{proj.title}</h3>
                    <p className="text-foreground/80 dark:text-muted-foreground text-sm line-clamp-3 mb-6 font-medium leading-relaxed">{proj.description}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                    <div className="flex flex-wrap gap-2 text-primary text-xs font-mono font-medium">
                        {proj.technologies}
                        {proj.technologies.length > 3 && '...'}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <Link href={`?tab=projects&action=edit&id=${proj.id}`} className="p-2 bg-surface hover:bg-elevated text-primary border border-border rounded-lg transition-colors shadow-sm" title="Edit">
                            <FaEdit size={14} />
                        </Link>
                        <button type="button" onClick={() => { proj.id && handleDeleteClick(proj.id) }} className="p-2 bg-surface hover:bg-red-500/10 text-red-500 border border-border rounded-lg transition-colors shadow-sm" title="Delete">
                            <FaTrash size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function DashboardProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [projToDelete, setProjToDelete] = useState<number | null>(null);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isGitHubImportOpen, setIsGitHubImportOpen] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'uncategorized' | number>('all');
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        getActiveUserAction().then((u) => { if (u?.id) setUserId(u.id); });
        getActiveCategoriesAction().then((cats) => { if (cats) setCategories(cats); }).catch(() => {});
    }, []);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // 5px drag distance before activating (allows clicks)
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const fetchProjects = () => {
        setIsLoading(true);
        getActiveProjectsAction().then((data) => {
            data.sort((a: Project, b: Project) => a.sort_order - b.sort_order);
            setProjects(data);
        }).catch((error) => {
            console.error(error);
            toast.error("Failed to fetch projects");
        }).finally(() => {
            setIsLoading(false);
        });
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleDeleteClick = (id: number) => {
        setProjToDelete(id);
    }

    const handleConfirmDelete = async () => {
        if (projToDelete === null) return;
        try {
            await deleteProjectAction(projToDelete);
            toast.success("Project deleted successfully");
            fetchProjects();
        } catch (error) {
            toast.error("Failed to delete project");
            console.error(error);
        } finally {
            setProjToDelete(null);
        }
    }

    const isFiltered = selectedCategory !== 'all' || searchQuery.trim() !== "";

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        
        if (over && active.id !== over.id) {
            const oldIndex = projects.findIndex(item => item.id === active.id);
            const newIndex = projects.findIndex(item => item.id === over.id);
            
            if (oldIndex === -1 || newIndex === -1) return;

            const newItems = arrayMove(projects, oldIndex, newIndex);
            
            // Optimistically update sort_order 
            const updatedItems = newItems.map((item, index) => ({
                ...item,
                sort_order: index + 1
            }));
            
            setProjects(updatedItems);
            
            // Fire off the background update
            const updates = updatedItems.map(item => ({ id: item.id!, sort_order: item.sort_order }));
            
            toast.promise(bulkUpdateProjectOrdersAction(updates), {
                loading: 'Saving new order...',
                success: 'Order updated successfully',
                error: 'Failed to update order'
            });
        }
    };

    // Category pills data with counts
    const uncategorizedCount = useMemo(() => {
        return projects.filter(p => !p.category_id).length;
    }, [projects]);

    const categoryPills = useMemo(() => {
        const pills: Array<{ key: 'all' | 'uncategorized' | number; label: string; count: number }> = [
            { key: 'all', label: 'All', count: projects.length }
        ];

        categories.forEach(cat => {
            const count = projects.filter(p => p.category_id === cat.id).length;
            pills.push({
                key: cat.id!,
                label: cat.name,
                count
            });
        });

        if (uncategorizedCount > 0) {
            pills.push({
                key: 'uncategorized',
                label: 'Uncategorized',
                count: uncategorizedCount
            });
        }

        return pills;
    }, [categories, projects, uncategorizedCount]);

    // Filter projects by category and search
    const filteredProjects = useMemo(() => {
        let list = projects;

        if (selectedCategory === 'uncategorized') {
            list = list.filter(p => !p.category_id);
        } else if (selectedCategory !== 'all') {
            list = list.filter(p => p.category_id === selectedCategory);
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            list = list.filter(p =>
                p.title.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query) ||
                (p.technologies && p.technologies.toLowerCase().includes(query))
            );
        }

        return list;
    }, [projects, selectedCategory, searchQuery]);

    // Handle categories update from CategoryManager
    const handleCategoriesChange = (updatedCats: Category[]) => {
        setCategories(updatedCats);
        // If current selected category was deleted, reset to 'all'
        if (typeof selectedCategory === 'number' && !updatedCats.some(c => c.id === selectedCategory)) {
            setSelectedCategory('all');
        }
    };

    return (
        <>
            {isLoading ? <Loading /> :
                <div className="space-y-6">
                    {/* Category manager — collapsed by default */}
                    {userId && (
                        <CategoryManager
                            userId={userId}
                            projects={projects}
                            onCategoriesChange={handleCategoriesChange}
                        />
                    )}

                    {/* Header + Actions */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-foreground mb-1">Projects</h2>
                            <p className="text-muted">Showcase your best work</p>
                        </div>
                        <div className="flex gap-2 flex-wrap items-center">
                            <button
                                onClick={() => setIsGitHubImportOpen(true)}
                                className="inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/25 font-bold py-2 px-5 rounded-full transition-all shadow-sm"
                                title="Import project from GitHub repository"
                            >
                                <FaGithub className="w-4 h-4" />
                                Import from GitHub
                            </button>
                            <button
                                onClick={() => setIsImportOpen(true)}
                                className="bg-surface hover:bg-border text-foreground border border-border font-bold py-2 px-5 rounded-full transition-colors shadow-sm inline-block"
                            >
                                Import from other Portfolio
                            </button>
                            <Link
                                href="?tab=projects&action=new"
                                className="bg-primary hover:bg-primary-hover text-inverse font-bold py-2 px-6 rounded-full transition-colors shadow-lg inline-block"
                            >
                                Add New
                            </Link>
                        </div>
                    </div>

                    {/* Filter & Search Bar */}
                    <div className="bg-surface border border-border rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
                            {/* Category Filter Pills */}
                            <div className="flex items-center gap-2 flex-wrap overflow-x-auto pb-1 md:pb-0">
                                <span className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-1.5 mr-1">
                                    <FaLayerGroup className="text-primary text-xs" />
                                    Filter:
                                </span>
                                {categoryPills.map((pill) => {
                                    const isActive = selectedCategory === pill.key;
                                    return (
                                        <button
                                            key={String(pill.key)}
                                            type="button"
                                            onClick={() => setSelectedCategory(pill.key)}
                                            className={`group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                                                isActive
                                                    ? "bg-primary text-inverse shadow-sm scale-[1.02]"
                                                    : "bg-elevated border border-border text-muted hover:text-foreground hover:border-primary/40 hover:bg-surface"
                                            }`}
                                        >
                                            <span>{pill.label}</span>
                                            <span
                                                className={`inline-flex items-center justify-center min-w-[1.25rem] h-4.5 px-1.5 rounded-full text-[10px] font-extrabold ${
                                                    isActive
                                                        ? "bg-white/20 text-inverse"
                                                        : "bg-primary/10 text-primary group-hover:bg-primary/20"
                                                }`}
                                            >
                                                {pill.count}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Search Input */}
                            <div className="relative min-w-[220px] max-w-sm">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <FaSearch className="text-muted text-xs" />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search projects..."
                                    className="w-full bg-elevated border border-border rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm text-foreground placeholder-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery("")}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-foreground transition-colors"
                                        title="Clear search"
                                    >
                                        <FaTimes className="text-xs" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Filter Status / Reset Notice */}
                        {isFiltered && (
                            <div className="flex items-center justify-between text-xs text-muted pt-2 border-t border-border/60">
                                <span>
                                    Showing <strong className="text-foreground">{filteredProjects.length}</strong> of <strong className="text-foreground">{projects.length}</strong> projects
                                    {selectedCategory !== 'all' && (
                                        <> in <span className="text-primary font-semibold">&ldquo;{categoryPills.find(p => p.key === selectedCategory)?.label}&rdquo;</span></>
                                    )}
                                    {searchQuery.trim() && (
                                        <> matching <span className="text-primary font-semibold">&ldquo;{searchQuery.trim()}&rdquo;</span></>
                                    )}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedCategory('all');
                                        setSearchQuery('');
                                    }}
                                    className="text-primary hover:underline font-bold transition-all text-xs"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        )}
                    </div>

                    <Suspense fallback={<Loading />}>
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={filteredProjects.map(p => p.id!)}
                                strategy={rectSortingStrategy}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                                    {filteredProjects.map((proj: Project) => (
                                        <SortableProjectCard
                                            key={proj.id}
                                            proj={proj}
                                            handleDeleteClick={handleDeleteClick}
                                            categories={categories}
                                            isDragDisabled={isFiltered}
                                        />
                                    ))}
                                    {filteredProjects.length === 0 && (
                                        <div className="text-muted text-center py-12 col-span-full bg-surface rounded-2xl border border-border space-y-3">
                                            <p className="text-base font-medium text-foreground">
                                                {projects.length === 0
                                                    ? "No projects found. Add one to showcase your work!"
                                                    : "No projects match the current filter or search criteria."}
                                            </p>
                                            {isFiltered && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedCategory('all');
                                                        setSearchQuery('');
                                                    }}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 font-bold text-xs rounded-full transition-all"
                                                >
                                                    Clear filter
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </Suspense>

                    <ConfirmModal
                        isOpen={projToDelete !== null}
                        onClose={() => setProjToDelete(null)}
                        onConfirm={handleConfirmDelete}
                        title="Delete Project"
                        description="Are you sure you want to delete this project? This action cannot be undone."
                        confirmText="Delete"
                        cancelText="Cancel"
                        isDestructive={true}
                    />

                    <Toaster richColors position="bottom-center" duration={2000} />

                    <ImportModal
                        isOpen={isImportOpen}
                        onClose={() => { setIsImportOpen(false); fetchProjects(); }}
                        entityType="projects"
                    />

                    <GitHubImportModal
                        isOpen={isGitHubImportOpen}
                        onClose={() => { setIsGitHubImportOpen(false); }}
                    />
                </div>
            }
        </>
    );
}
