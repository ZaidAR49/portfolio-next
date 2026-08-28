"use client";
import { Project } from "@/lib/models/project";
import { Category } from "@/lib/models/category";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { ProjectCard } from "@/components/project-card";

export default function Projects({ projects, categories }: { projects: Project[]; categories?: Category[] }) {
    const sorted = [...projects].sort((a, b) => a.sort_order - b.sort_order);
    const featured = sorted.slice(0, 3);

    return (
        <section id="projects" className="flex flex-col pt-12 pb-24 px-4 md:px-8 xl:px-12 max-w-[1600px] mx-auto w-full relative z-10">
            {/* Section header */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                className="flex flex-col items-center mb-24 lg:mb-32 text-center"
            >
                <div className="inline-flex items-center justify-center space-x-2 px-4 py-1.5 rounded-full bg-surface/50 border border-border mb-6 backdrop-blur-sm shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-xs text-primary font-bold tracking-[0.2em] uppercase">My Work</span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 tracking-tight">Featured Projects</h2>
                <p className="text-muted max-w-2xl text-lg font-light leading-relaxed">
                    A collection of carefully crafted projects that showcase my passion for building beautiful and robust web applications.
                </p>
            </motion.div>

            {/* Top 3 project cards */}
            <div className="flex flex-col">
                {featured.map((project, index) => (
                    <ProjectCard key={project.id} project={project} index={index} categories={categories} />
                ))}
            </div>

            {/* Show All Projects button */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="flex justify-center mt-4"
            >
                <Link
                    href="/projects"
                    className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-base overflow-hidden
                        bg-gradient-to-r from-primary to-indigo-500 text-inverse shadow-[0_4px_30px_var(--primary-glow)]
                        hover:shadow-[0_8px_40px_var(--primary-glow)] hover:-translate-y-1
                        transition-all duration-300 ease-smooth"
                >
                    {/* Shimmer overlay */}
                    <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out pointer-events-none" />
                    <span className="relative z-10">Show All Projects</span>
                    <FaArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
            </motion.div>
        </section>
    );
}
