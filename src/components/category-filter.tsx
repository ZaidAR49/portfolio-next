"use client";
import { motion } from "framer-motion";
import { Category } from "@/lib/models/category";
import { Project } from "@/lib/models/project";

interface CategoryFilterProps {
    categories: Category[];
    projects: Project[];
    selected: number | null;
    onSelect: (id: number | null) => void;
}

export function CategoryFilter({ categories, projects, selected, onSelect }: CategoryFilterProps) {
    const totalCount = projects.length;

    const countFor = (id: number) =>
        projects.filter((p) => p.category_id === id).length;

    const pills = [
        { id: null, label: "All", count: totalCount },
        ...categories.map((c) => ({ id: c.id ?? null, label: c.name, count: countFor(c.id!) })),
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="flex items-center gap-3 flex-wrap justify-center mb-16"
        >
            {pills.map((pill) => {
                const isActive = selected === pill.id;
                return (
                    <button
                        key={String(pill.id)}
                        onClick={() => onSelect(pill.id)}
                        className={`group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold
                            transition-all duration-300 ease-smooth cursor-pointer
                            ${isActive
                                ? "bg-primary text-inverse shadow-[0_4px_20px_var(--primary-glow)] scale-[1.04]"
                                : "bg-surface/60 border border-border text-muted hover:text-foreground hover:border-primary/40 hover:scale-[1.02] hover:bg-surface/80 backdrop-blur-sm"
                            }`}
                    >
                        {/* Active glow layer */}
                        {isActive && (
                            <motion.span
                                layoutId="category-pill-glow"
                                className="absolute inset-0 rounded-full bg-primary opacity-20 blur-md -z-10"
                            />
                        )}

                        <span className="relative z-10">{pill.label}</span>

                        {/* Count badge */}
                        <span
                            className={`relative z-10 inline-flex items-center justify-center min-w-[1.4rem] h-5 px-1.5 rounded-full text-[10px] font-extrabold leading-none
                                ${isActive
                                    ? "bg-white/20 text-inverse"
                                    : "bg-primary/10 text-primary group-hover:bg-primary/20"
                                }`}
                        >
                            {pill.count}
                        </span>
                    </button>
                );
            })}
        </motion.div>
    );
}
