"use client";
import Link from "next/link";
import { motion } from "framer-motion";

const About = ({ title, description }: { title?: string, description?: string }) => {
    return (
        <section className="py-24 px-4 md:px-8 xl:px-12 max-w-[1600px] mx-auto w-full relative z-10 mb-20">
            {/* Subtle background glow for the about section */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[400px] bg-[#38bdf8]/5 blur-[100px] rounded-full pointer-events-none -z-10" />
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20 items-center">
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="md:col-span-4 lg:col-span-5 flex flex-col"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 mb-6 backdrop-blur-sm w-max">
                        <span className="w-2 h-2 rounded-full bg-[#0ea5e9] dark:bg-[#38bdf8]" />
                        <span className='text-xs text-[#0ea5e9] dark:text-[#38bdf8] font-bold tracking-[0.2em] uppercase'>Background</span>
                    </div>
                    <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-slate-800 to-slate-400 dark:from-white dark:to-slate-500 mb-6 tracking-tight">
                        About
                    </h2>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                    className="md:col-span-8 lg:col-span-7 flex flex-col gap-8 relative"
                >
                    {/* Glass card background for text */}
                    <div className="absolute -inset-8 bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-[2rem] backdrop-blur-sm -z-10 hidden md:block" />
                    
                    <p className="text-slate-700 dark:text-slate-200 text-2xl lg:text-3xl leading-snug font-medium tracking-tight">
                        {title}
                    </p>
                    
                    <div className="w-16 h-1 bg-gradient-to-r from-[#0ea5e9] dark:from-[#38bdf8] to-transparent rounded-full" />
                    
                    <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed font-light">
                        {description}
                    </p>

                    <div className="mt-4">
                        <Link
                            href="/about"
                            className="inline-flex items-center justify-center gap-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white font-semibold px-8 py-4 rounded-full text-sm transition-all duration-300 hover:border-[#0ea5e9]/50 dark:hover:border-[#38bdf8]/50 hover:text-[#0ea5e9] dark:hover:text-[#38bdf8] group backdrop-blur-md"
                        >
                            More about me
                            <span className="transform transition-transform group-hover:translate-x-1">→</span>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default About