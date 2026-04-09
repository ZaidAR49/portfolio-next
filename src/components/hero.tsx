"use client";
import Link from 'next/link'
import Image from 'next/image'
import { User } from '@/lib/models/user';
import { Skill } from '@/lib/models/skill';
import Marquee from "react-fast-marquee";
import { getIconForTechnology } from '@/lib/utils/client/icon-mapper';
import { motion, Variants } from 'framer-motion';

export default function HeroSection({ user, skills }: { user: User, skills: Skill[] }) {
    const fadeIn: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }, // ✅ now properly typed
        },
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const skillsSlider = () => (
        <div className="mt-20 md:mt-32 w-full py-8 relative z-10 flex flex-col items-center bg-white/80 dark:bg-[#0b1120]/30 shadow-lg dark:shadow-2xl">
            {/* Top glowing scanning line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] overflow-hidden bg-slate-200 dark:bg-slate-800/30">
                <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                    className="w-[40%] h-full bg-gradient-to-r from-transparent via-[#0ea5e9] dark:via-[#38bdf8] to-transparent"
                />
            </div>

            <Marquee gradient={false} speed={40}>
                {skills.map((skill, index) => (
                    <div key={index} className="flex flex-col items-center gap-3 px-12 group cursor-pointer">
                        <span className="text-3xl text-slate-400 group-hover:text-[#0ea5e9] dark:group-hover:text-[#38bdf8] transition-all duration-300">
                            {getIconForTechnology(skill.name)}
                        </span>
                        <span className="text-[11px] font-semibold tracking-wider text-slate-500 group-hover:text-slate-800 dark:group-hover:text-slate-300 transition-colors duration-300 hidden md:block">
                            {skill.name}
                        </span>
                    </div>
                ))}
            </Marquee>

            {/* Bottom glowing scanning line */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] overflow-hidden bg-slate-200 dark:bg-slate-800/30">
                <motion.div
                    animate={{ x: ['200%', '-100%'] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                    className="w-[40%] h-full bg-gradient-to-r from-transparent via-[#0ea5e9] dark:via-[#38bdf8] to-transparent"
                />
            </div>

            {/* Subtle Down Arrow */}
            <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="absolute -bottom-16 text-[#38bdf8]/50 flex justify-center"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <polyline points="19 12 12 19 5 12"></polyline>
                </svg>
            </motion.div>
        </div>
    );

    return (
        <section className='flex flex-col relative pt-16 md:pt-24 w-full' id="hero">
            <div className="max-w-[1600px] mx-auto w-full px-4 md:px-8 xl:px-12 flex flex-col-reverse lg:flex-row items-center justify-between gap-16 lg:gap-8">
                {/* Left content */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="flex-1 flex flex-col items-center text-center lg:items-start lg:text-left z-10"
                >
                    <motion.div variants={fadeIn} className="mb-6">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0ea5e9]/10 dark:bg-[#38bdf8]/10 border border-[#0ea5e9]/20 dark:border-[#38bdf8]/20 text-[#0ea5e9] dark:text-[#38bdf8] text-sm font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(14,165,233,0.05)] dark:shadow-[0_0_20px_rgba(56,189,248,0.05)]">
                            <span className="w-2 h-2 rounded-full bg-[#0ea5e9] dark:bg-[#38bdf8] animate-pulse" />
                            {user.job_title}
                        </span>
                    </motion.div>

                    <motion.div variants={fadeIn} className="mb-6 space-y-2">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight leading-[1.1]">
                            Hi, I'm <br className="hidden lg:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-[#0ea5e9] dark:from-white dark:to-[#38bdf8] drop-shadow-sm">
                                {user.name}
                            </span>
                        </h1>
                    </motion.div>

                    <motion.p variants={fadeIn} className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-light leading-relaxed max-w-xl mb-10">
                        {user.hero_description}
                    </motion.p>

                    <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                        <Link href={user.resume_url} className="w-full sm:w-auto px-8 py-4 bg-[#0ea5e9] dark:bg-[#38bdf8] hover:bg-[#0284c7] dark:hover:bg-sky-400 text-white dark:text-slate-950 font-bold rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(14,165,233,0.3)] dark:hover:shadow-[0_8px_30px_rgba(56,189,248,0.3)] text-center flex items-center justify-center gap-2">
                            Download CV
                        </Link>
                        <Link href={'/#contact'} className="w-full sm:w-auto px-8 py-4 bg-transparent border border-slate-300 dark:border-slate-700 hover:border-[#0ea5e9] dark:hover:border-[#38bdf8] text-slate-700 dark:text-slate-300 hover:text-[#0ea5e9] dark:hover:text-[#38bdf8] font-bold rounded-full transition-all duration-300 transform hover:-translate-y-1 text-center">
                            Let's Connect
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Right profile card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                    className="flex-shrink-0 relative group z-10"
                >
                    <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-tr from-[#0ea5e9] dark:from-[#38bdf8] to-indigo-500 opacity-20 group-hover:opacity-40 blur-2xl transition duration-500" />
                    <div className="relative w-[280px] h-[360px] md:w-[320px] md:h-[420px] rounded-[2rem] bg-white/80 dark:bg-[#0b1120]/80 border border-slate-200 dark:border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl p-2 transform group-hover:-translate-y-2 transition duration-500">
                        <div className="w-full h-full rounded-[1.5rem] overflow-hidden relative bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5">
                            {user.picture_url && (
                                <Image
                                    src={"https://res.cloudinary.com/dxa0aylow/image/upload/v1769416147/qentbmtdh7xeslqkcs3a.png"}
                                    alt={user.name}
                                    fill
                                    sizes="(max-width: 768px) 280px, 320px"
                                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                    priority
                                    unoptimized
                                />
                            )}
                            {/* Glass overlay text */}
                            <div className="absolute bottom-4 inset-x-4 hidden md:flex items-center justify-center">
                                <div className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl py-3 flex items-center justify-center shadow-lg">
                                    <p className="text-white text-xs font-bold tracking-[0.2em] uppercase">{user.job_title}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {skillsSlider()}
        </section>
    )
}