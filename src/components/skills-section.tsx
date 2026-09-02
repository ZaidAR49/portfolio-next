"use client";
import React from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';
import { Skill } from '@/lib/models/skill';
import { Category } from '@/lib/models/category';
import { getIconForTechnology } from '@/lib/utils/client/icon-mapper';

interface SkillsSectionProps {
    skills: Skill[];
    categories?: Category[];
    showHeader?: boolean;
}

export default function SkillsSection({ skills, categories = [], showHeader = true }: SkillsSectionProps) {
    if (!skills || skills.length === 0) return null;

    // Group skills by category
    const skillCategories = categories.filter(c => c.type === "skill" || !c.type);

    const grouped: {
        id: number | string;
        title: string;
        subtitle: string;
        skills: Skill[];
    }[] = [];

    // 1. Group by defined categories
    for (const cat of skillCategories) {
        const catSkills = skills.filter(s => s.category_id === cat.id);
        if (catSkills.length > 0) {
            grouped.push({
                id: cat.id!,
                title: cat.name,
                subtitle: getCategorySubtitle(cat.name),
                skills: catSkills,
            });
        }
    }

    // 2. Uncategorized skills
    const uncatSkills = skills.filter(s => !s.category_id || !skillCategories.some(c => c.id === s.category_id));
    if (uncatSkills.length > 0) {
        grouped.push({
            id: 'uncategorized',
            title: grouped.length === 0 ? 'Skills & Technologies' : 'Other Technologies & Tools',
            subtitle: 'Technologies, tools and libraries I work with to build modern applications.',
            skills: uncatSkills,
        });
    }

    return (
        <section id="skills" className="w-full max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 py-12 md:py-20 relative z-10 overflow-hidden">
            {/* Ambient Background Spotlight Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-primary/15 via-primary/5 to-transparent blur-3xl pointer-events-none -z-10 rounded-full" />

            {/* Optional Section Overview Header */}
            {showHeader && (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                    className="flex flex-col items-center mb-16 lg:mb-24 text-center relative"
                >
                    <div className="inline-flex items-center justify-center space-x-2 px-4 py-1.5 rounded-full bg-surface/50 border border-border mb-6 backdrop-blur-sm shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-xs text-primary font-bold tracking-[0.2em] uppercase">My Skills</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 tracking-tight">
                        Skills & Technologies
                    </h2>
                    <p className="text-muted max-w-2xl text-lg font-light leading-relaxed">
                        A structured breakdown of the programming languages, frameworks, systems, and automation tools I work with.
                    </p>
                </motion.div>
            )}

            {/* Categorized Groups */}
            <div className="space-y-16 md:space-y-20">
                {grouped.map((group, groupIdx) => (
                    <motion.div
                        key={group.id}
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.5, delay: groupIdx * 0.08 }}
                        className="w-full space-y-6"
                    >
                        {/* Category Header */}
                        <div className="border-b border-border pb-4 space-y-1">
                            <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                                {group.title}
                            </h3>
                            <p className="text-sm md:text-base text-muted font-light max-w-3xl">
                                {group.subtitle}
                            </p>
                        </div>

                        {/* Full Width Grid of Spotlight Skill Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 w-full">
                            {group.skills.map((skill, index) => (
                                <SpotlightCard
                                    key={skill.id ?? `${group.id}-${index}`}
                                    skill={skill}
                                />
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

function SpotlightCard({ skill }: { skill: Skill }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className="group relative flex items-center gap-4 px-6 py-5 rounded-2xl bg-surface/70 dark:bg-surface/40 backdrop-blur-md border border-border hover:border-primary/50 dark:hover:border-primary/50 shadow-sm hover:shadow-[0_4px_25px_var(--primary-glow)] transition-all duration-300 cursor-default overflow-hidden"
        >
            {/* Interactive Spotlight Radial Background */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            280px circle at ${mouseX}px ${mouseY}px,
                            var(--primary-glow, rgba(14, 165, 233, 0.2)),
                            transparent 80%
                        )
                    `,
                }}
            />

            {/* Interactive Spotlight Border Highlight */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-primary/40"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            180px circle at ${mouseX}px ${mouseY}px,
                            rgba(56, 189, 248, 0.15),
                            transparent 70%
                        )
                    `,
                }}
            />

            {/* Icon on Left */}
            <div className="text-3xl md:text-4xl text-muted group-hover:text-primary transition-colors flex-shrink-0 z-10">
                {getIconForTechnology(skill.name)}
            </div>

            {/* Text on Right */}
            <span className="text-base md:text-lg font-bold text-foreground group-hover:text-primary transition-colors tracking-wide truncate z-10">
                {skill.name}
            </span>
        </motion.div>
    );
}

function getCategorySubtitle(categoryName: string): string {
    const lower = categoryName.toLowerCase();
    if (lower.includes('language')) {
        return 'Technologies and languages I work with to build modern, scalable and efficient applications.';
    }
    if (lower.includes('framework') || lower.includes('frontend')) {
        return 'Frontend and backend frameworks utilized to develop responsive, performant user experiences.';
    }
    if (lower.includes('backend') || lower.includes('database')) {
        return 'Server-side architectures, APIs, relational and non-relational database management systems.';
    }
    if (lower.includes('ai') || lower.includes('agent') || lower.includes('automation')) {
        return 'Autonomous workflows, AI agents, LLMs, workflow orchestrators and intelligent integrations.';
    }
    if (lower.includes('tool') || lower.includes('devops') || lower.includes('cloud')) {
        return 'Development tools, cloud infrastructure, CI/CD pipelines and deployment platforms.';
    }
    return 'Technologies and tools I leverage to deliver reliable, production-ready software solutions.';
}


