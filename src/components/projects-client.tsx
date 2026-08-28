"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/lib/models/project";
import { Category } from "@/lib/models/category";
import { ProjectCard } from "@/components/project-card";
import { CategoryFilter } from "@/components/category-filter";

interface ProjectsClientProps {
    projects: Project[];
    categories: Category[];
}

export function ProjectsClient({ projects, categories }: ProjectsClientProps) {
    const [selected, setSelected] = useState<number | null>(null);

    const filtered =
        selected === null
            ? projects
            : projects.filter((p) => p.category_id === selected);

    return (
        <>
            {/* Category filter — only render if categories exist */}
            {categories.length > 0 && (
                <CategoryFilter
                    categories={categories}
                    projects={projects}
                    selected={selected}
                    onSelect={setSelected}
                />
            )}

            {/* Animated project list */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={selected ?? "all"}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                    className="flex flex-col"
                >
                    {filtered.length > 0 ? (
                        filtered.map((project, index) => (
                            <ProjectCard key={project.id} project={project} index={index} categories={categories} />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 text-center">
                            <span className="text-5xl mb-6">🗂️</span>
                            <p className="text-foreground font-bold text-xl mb-2">No projects here yet</p>
                            <p className="text-muted text-base font-light">Check back soon or explore another category.</p>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </>
    );
}
