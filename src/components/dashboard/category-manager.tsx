"use client";
import { useState, useEffect, useRef } from "react";
import { FaChevronDown, FaChevronUp, FaPlus, FaTag, FaTimes, FaExclamationTriangle, FaCheck, FaPencilAlt } from "react-icons/fa";
import { Category } from "@/lib/models/category";
import { Project } from "@/lib/models/project";
import { getCategoriesByUserIdAction, addCategoryAction, deleteCategoryAction, updateCategoryAction } from "@/actions/category-action";
import { toast } from "sonner";

interface CategoryManagerProps {
    userId: number;
    projects: Project[];
    onCategoriesChange: (cats: Category[]) => void;
}

// ─── Inline editable chip ────────────────────────────────────────────────────
function CategoryChip({
    cat,
    onDelete,
    onRename,
}: {
    cat: Category;
    onDelete: (cat: Category) => void;
    onRename: (id: number, newName: string) => Promise<void>;
}) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(cat.name);
    const [isSaving, setIsSaving] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editing) inputRef.current?.select();
    }, [editing]);

    const save = async () => {
        const trimmed = draft.trim();
        if (!trimmed || trimmed === cat.name) { setEditing(false); setDraft(cat.name); return; }
        setIsSaving(true);
        try {
            await onRename(cat.id!, trimmed);
            setEditing(false);
        } catch {
            setDraft(cat.name);
            setEditing(false);
        } finally {
            setIsSaving(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") { e.preventDefault(); save(); }
        if (e.key === "Escape") { setEditing(false); setDraft(cat.name); }
    };

    if (editing) {
        return (
            <span className="inline-flex items-center gap-1.5 bg-elevated border border-primary/50 rounded-full px-3 py-1.5">
                <input
                    ref={inputRef}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={save}
                    maxLength={100}
                    disabled={isSaving}
                    className="bg-transparent outline-none text-sm font-semibold text-foreground w-28 min-w-0"
                />
                <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); save(); }}
                    disabled={isSaving}
                    className="text-primary hover:text-primary-hover disabled:opacity-40 transition-colors"
                    title="Save"
                >
                    <FaCheck size={10} />
                </button>
                <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); setEditing(false); setDraft(cat.name); }}
                    className="text-muted hover:text-foreground transition-colors"
                    title="Cancel"
                >
                    <FaTimes size={10} />
                </button>
            </span>
        );
    }

    return (
        <span className="group inline-flex items-center gap-2 bg-elevated border border-border rounded-full px-3 py-1.5 text-sm font-semibold text-foreground">
            {cat.name}
            {/* Edit button */}
            <button
                type="button"
                onClick={() => setEditing(true)}
                className="text-muted hover:text-primary transition-colors"
                title={`Rename "${cat.name}"`}
            >
                <FaPencilAlt size={9} />
            </button>
            {/* Delete button */}
            <button
                type="button"
                onClick={() => onDelete(cat)}
                className="text-muted hover:text-red-400 transition-colors"
                title={`Delete "${cat.name}"`}
            >
                <FaTimes size={10} />
            </button>
        </span>
    );
}

// ─── CategoryManager ─────────────────────────────────────────────────────────
export function CategoryManager({ userId, projects, onCategoriesChange }: CategoryManagerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [newName, setNewName] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [pendingDelete, setPendingDelete] = useState<Category | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        getCategoriesByUserIdAction(userId)
            .then((cats) => { setCategories(cats); onCategoriesChange(cats); })
            .catch(() => toast.error("Failed to load categories"));
    }, [userId]);

    useEffect(() => {
        if (isOpen) inputRef.current?.focus();
    }, [isOpen]);

    const syncCategories = (updated: Category[]) => {
        setCategories(updated);
        onCategoriesChange(updated);
    };

    const handleAdd = async () => {
        const trimmed = newName.trim();
        if (!trimmed) return;
        setIsAdding(true);
        try {
            const created = await addCategoryAction(trimmed, userId);
            syncCategories([...categories, created]);
            setNewName("");
            toast.success(`Category "${created.name}" added`);
        } catch (e: any) {
            toast.error(e?.message?.includes("unique") ? "Category already exists" : "Failed to add category");
        } finally {
            setIsAdding(false);
        }
    };

    const handleRename = async (id: number, newName: string) => {
        try {
            const updated = await updateCategoryAction(id, newName);
            syncCategories(categories.map((c) => (c.id === id ? updated : c)));
            toast.success(`Renamed to "${updated.name}"`);
        } catch (e: any) {
            toast.error(e?.message?.includes("unique") ? "That name already exists" : "Failed to rename category");
            throw e; // re-throw so the chip resets
        }
    };

    const handleDeleteConfirm = async () => {
        if (!pendingDelete?.id) return;
        try {
            await deleteCategoryAction(pendingDelete.id);
            syncCategories(categories.filter((c) => c.id !== pendingDelete.id));
            toast.success(`"${pendingDelete.name}" deleted — affected projects are now uncategorized`);
        } catch {
            toast.error("Failed to delete category");
        } finally {
            setPendingDelete(null);
        }
    };

    const affectedCount = (cat: Category) => projects.filter((p) => p.category_id === cat.id).length;

    return (
        <div className="bg-surface border border-border rounded-2xl overflow-hidden transition-all duration-300">
            {/* Header / toggle */}
            <button
                type="button"
                onClick={() => setIsOpen((o) => !o)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-elevated transition-colors"
            >
                <div className="flex items-center gap-3">
                    <FaTag className="text-primary text-sm" />
                    <span className="font-bold text-foreground text-sm">Manage Categories</span>
                    {categories.length > 0 && (
                        <span className="inline-flex items-center justify-center min-w-[1.4rem] h-5 px-1.5 rounded-full text-[10px] font-extrabold bg-primary/10 text-primary">
                            {categories.length}
                        </span>
                    )}
                </div>
                {isOpen ? <FaChevronUp className="text-muted text-xs" /> : <FaChevronDown className="text-muted text-xs" />}
            </button>

            {/* Expanded body */}
            {isOpen && (
                <div className="px-5 pb-5 border-t border-border space-y-4 pt-4">
                    {/* Chip list */}
                    <div className="flex flex-wrap gap-2 min-h-[2rem]">
                        {categories.length === 0 && (
                            <span className="text-sm text-muted italic">No categories yet — add one below.</span>
                        )}
                        {categories.map((cat) => (
                            <CategoryChip
                                key={cat.id}
                                cat={cat}
                                onDelete={setPendingDelete}
                                onRename={handleRename}
                            />
                        ))}
                    </div>

                    {/* Inline delete confirm */}
                    {pendingDelete && (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 bg-red-500/5 border border-red-500/20 rounded-xl animate-in fade-in duration-150">
                            <FaExclamationTriangle className="text-red-400 flex-shrink-0 mt-0.5 sm:mt-0" />
                            <div className="flex-1 text-sm">
                                <p className="font-bold text-foreground">Delete &ldquo;{pendingDelete.name}&rdquo;?</p>
                                {affectedCount(pendingDelete) > 0 ? (
                                    <p className="text-muted mt-0.5">
                                        <span className="text-amber-400 font-semibold">{affectedCount(pendingDelete)} project{affectedCount(pendingDelete) > 1 ? "s" : ""}</span> will become uncategorized. Projects will not be deleted.
                                    </p>
                                ) : (
                                    <p className="text-muted mt-0.5">No projects are assigned to this category.</p>
                                )}
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                                <button type="button" onClick={() => setPendingDelete(null)} className="px-4 py-1.5 text-sm font-semibold border border-border rounded-lg hover:bg-elevated transition-colors">Cancel</button>
                                <button type="button" onClick={handleDeleteConfirm} className="px-4 py-1.5 text-sm font-bold bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-sm">Delete</button>
                            </div>
                        </div>
                    )}

                    {/* Add new */}
                    <div className="flex gap-2">
                        <input
                            ref={inputRef}
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAdd(); } }}
                            placeholder="New category name…"
                            maxLength={100}
                            className="flex-1 bg-elevated border border-border rounded-xl px-4 py-2.5 text-foreground placeholder-muted focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
                        />
                        <button
                            type="button"
                            onClick={handleAdd}
                            disabled={isAdding || !newName.trim()}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-inverse text-sm font-bold rounded-xl transition-colors shadow-sm disabled:opacity-40"
                        >
                            <FaPlus size={11} />
                            Add
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
