"use client";
import { useState, useRef, useEffect } from "react";
import { FaPlus, FaCheck, FaTimes, FaTag } from "react-icons/fa";
import { Category, CategoryType } from "@/lib/models/category";
import { addCategoryAction } from "@/actions/category-action";
import { toast } from "sonner";

interface CategorySelectFieldProps {
    categories: Category[];
    value: number | null | undefined;
    userId: number;
    type?: CategoryType;
    onChange: (id: number | null) => void;
    onCategoryCreated: (cat: Category) => void;
}

export function CategorySelectField({
    categories, value, userId, type = "project", onChange, onCategoryCreated
}: CategorySelectFieldProps) {
    const [showCreate, setShowCreate] = useState(false);
    const [newName, setNewName] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (showCreate) inputRef.current?.focus();
    }, [showCreate]);

    const handleCreate = async () => {
        const trimmed = newName.trim();
        if (!trimmed) return;
        setIsCreating(true);
        try {
            const created = await addCategoryAction(trimmed, userId, type);
            onCategoryCreated(created);
            onChange(created.id ?? null);
            toast.success(`Category "${created.name}" created`);
            setNewName("");
            setShowCreate(false);
        } catch {
            toast.error("Failed to create category");
        } finally {
            setIsCreating(false);
        }
    };


    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") { e.preventDefault(); handleCreate(); }
        if (e.key === "Escape") { setShowCreate(false); setNewName(""); }
    };

    return (
        <div className="flex flex-col gap-2">
            {/* Selector */}
            <div className="relative">
                <FaTag className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-xs pointer-events-none" />
                <select
                    value={value ?? ""}
                    onChange={(e) => {
                        const v = e.target.value;
                        if (v === "__create__") { setShowCreate(true); return; }
                        onChange(v === "" ? null : Number(v));
                    }}
                    className="w-full bg-elevated border border-border rounded-xl pl-9 pr-4 py-3 text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none cursor-pointer"
                >
                    <option value="">— No category —</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id!} className="bg-surface text-foreground">
                            {c.name}
                        </option>
                    ))}
                    <option value="__create__" className="bg-surface text-primary font-bold">
                        ＋ Create new category…
                    </option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                </div>
            </div>

            {/* Inline create input */}
            {showCreate && (
                <div className="flex gap-2 items-center animate-in fade-in slide-in-from-top-1 duration-150">
                    <input
                        ref={inputRef}
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="New category name…"
                        maxLength={100}
                        className="flex-1 bg-elevated border border-primary/50 rounded-xl px-4 py-2.5 text-foreground placeholder-muted focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
                    />
                    <button
                        type="button"
                        onClick={handleCreate}
                        disabled={isCreating || !newName.trim()}
                        className="p-2.5 bg-primary hover:bg-primary-hover text-inverse rounded-xl transition-colors disabled:opacity-40 shadow-sm"
                        title="Confirm"
                    >
                        <FaCheck size={12} />
                    </button>
                    <button
                        type="button"
                        onClick={() => { setShowCreate(false); setNewName(""); }}
                        className="p-2.5 bg-surface border border-border text-muted hover:text-foreground hover:bg-elevated rounded-xl transition-colors"
                        title="Cancel"
                    >
                        <FaTimes size={12} />
                    </button>
                </div>
            )}
        </div>
    );
}
