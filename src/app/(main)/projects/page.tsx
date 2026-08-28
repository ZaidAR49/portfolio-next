import { getActiveProjectsAction } from "@/actions/project-action";
import { getActiveCategoriesAction } from "@/actions/category-action";
import { ProjectsClient } from "@/components/projects-client";
import { Project } from "@/lib/models/project";
import { Category } from "@/lib/models/category";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Projects | Zaid Alradaideh",
    description: "Explore all projects built by Zaid Alradaideh — full-stack web applications, tools, and more.",
};

export default async function ProjectsPage() {
    const [rawProjects, categories] = await Promise.all([
        getActiveProjectsAction(),
        getActiveCategoriesAction(),
    ]);

    const projects: Project[] = [...rawProjects].sort((a, b) => a.sort_order - b.sort_order);
    const sortedCategories: Category[] = [...categories].sort(
        (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
    );

    return (
        <section className="flex flex-col pt-28 pb-24 px-4 md:px-8 xl:px-12 max-w-[1600px] mx-auto w-full relative z-10">
            {/* Page header */}
            <div className="flex flex-col items-center mb-16 text-center">
                <div className="inline-flex items-center justify-center space-x-2 px-4 py-1.5 rounded-full bg-surface/50 border border-border mb-6 backdrop-blur-sm shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-xs text-primary font-bold tracking-[0.2em] uppercase">All Work</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 tracking-tight">
                    All Projects
                </h1>
                <p className="text-muted max-w-2xl text-lg font-light leading-relaxed">
                    Every project I&apos;ve built — from personal experiments to production-grade applications.
                </p>
            </div>

            {/* Client: category filter + animated project list */}
            <ProjectsClient projects={projects} categories={sortedCategories} />
        </section>
    );
}
