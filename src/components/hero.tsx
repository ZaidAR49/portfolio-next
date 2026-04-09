"use client";
import Link from 'next/link'
import Image from 'next/image'
import { User } from '@/lib/models/user';
import { Skill } from '@/lib/models/skill';
import Marquee from "react-fast-marquee";
import { getIconForTechnology } from '@/lib/utils/client/icon-mapper';
import { motion } from 'framer-motion';

export default function HeroSection({ user, skills }: { user: User, skills: Skill[] }) {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const skillsSlider = () => (
        <div className="mt-20 md:mt-32 w-full max-w-[1200px] mx-auto border-y border-white/5 bg-white/[0.02] backdrop-blur-sm py-6 relative z-10">
            <Marquee gradient={false} speed={40}>
                {skills.map((skill, index) => (
                    <div key={index} className="flex flex-col items-center gap-2 px-10 group cursor-pointer">
                        <span className="text-4xl text-slate-400 group-hover:text-[#38bdf8] group-hover:scale-110 group-hover:drop-shadow-[0_0_12px_rgba(56,189,248,0.5)] transition-all duration-300">
                            {getIconForTechnology(skill.name)}
                        </span>
                        <span className="text-xs font-semibold tracking-wider text-slate-500 group-hover:text-slate-200 uppercase transition-colors duration-300 hidden md:block">
                            {skill.name}
                        </span>
                    </div>
                ))}
            </Marquee>
        </div>
    );

    return (
        <section className='flex flex-col relative pt-16 md:pt-24 w-full'>
            <div className="max-w-[1200px] mx-auto w-full px-4 md:px-8 flex flex-col-reverse lg:flex-row items-center justify-between gap-16 lg:gap-8">
                {/* Left content */}
                <motion.div 
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="flex-1 flex flex-col items-center text-center lg:items-start lg:text-left z-10"
                >
                    <motion.div variants={fadeIn} className="mb-6">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#38bdf8]/10 border border-[#38bdf8]/20 text-[#38bdf8] text-sm font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(56,189,248,0.05)]">
                            <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse" />
                            {user.job_title}
                        </span>
                    </motion.div>

                    <motion.div variants={fadeIn} className="mb-6 space-y-2">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-100 tracking-tight leading-[1.1]">
                            Hi, I'm <br className="hidden lg:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#38bdf8] drop-shadow-sm">
                                {user.name}
                            </span>
                        </h1>
                    </motion.div>

                    <motion.p variants={fadeIn} className="text-lg md:text-xl text-slate-400 font-light leading-relaxed max-w-xl mb-10">
                        {user.hero_description}
                    </motion.p>

                    <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                        <Link href={user.resume_url} className="w-full sm:w-auto px-8 py-4 bg-[#38bdf8] hover:bg-sky-400 text-slate-950 font-bold rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(56,189,248,0.3)] text-center flex items-center justify-center gap-2">
                            Download CV
                        </Link>
                        <Link href={user.linkedin_url} className="w-full sm:w-auto px-8 py-4 bg-transparent border border-slate-700 hover:border-[#38bdf8] text-slate-300 hover:text-[#38bdf8] font-bold rounded-full transition-all duration-300 transform hover:-translate-y-1 text-center">
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
                    <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-tr from-[#38bdf8] to-indigo-500 opacity-20 group-hover:opacity-40 blur-2xl transition duration-500" />
                    <div className="relative w-[280px] h-[360px] md:w-[320px] md:h-[420px] rounded-[2rem] bg-[#0b1120]/80 border border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl p-2 transform group-hover:-translate-y-2 transition duration-500">
                        <div className="w-full h-full rounded-[1.5rem] overflow-hidden relative bg-slate-900 border border-white/5">
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