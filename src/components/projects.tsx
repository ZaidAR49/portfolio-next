"use client";
import { Project } from "@/lib/models/project";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FaGithub } from "react-icons/fa";

export default function Projects({ projects }: { projects: Project[] }) {
    console.log(projects);

    const ImageSlider = ({ imgeurl, projectName }: { imgeurl: string[], projectName: string }) => {
        return (
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000 }}
                loop={true}
                className="w-full aspect-video bg-transparent rounded-[2rem] overflow-hidden"
            >
                {imgeurl.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <img
                            src={slide}
                            alt={`${projectName} preview ${index + 1}`}
                            className="w-full h-full object-cover object-center"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        );
    };
    const statusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
            case 'in progress':
                return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
            case 'suspended':
                return 'bg-red-500/20 text-red-400 border border-red-500/30';
            default:
                return 'bg-slate-500/20 text-slate-400 border border-slate-500/30';
        }
    }

    const projectCard = (project: Project, index: number) => {
        const isReversed = index % 2 !== 0;
        return (
            <div key={project.id} className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-10 lg:gap-16 mb-32 lg:mb-40 items-center`}>
                {/* Left side: Image Slider */}
                <div className="w-full lg:w-[55%] rounded-[2rem] overflow-hidden border border-slate-800 shadow-2xl relative group">
                    <div className={`absolute top-6 left-6 z-10 ${statusColor(project.status || 'Completed')} px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full backdrop-blur-md`}>
                        {project.status || 'Completed'}
                    </div>
                    <ImageSlider imgeurl={project.images} projectName={project.title} />
                </div>

                {/* Right side: Project Details */}
                <div className="w-full lg:w-[45%] flex flex-col justify-center">
                    <h3 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
                        {project.title}
                    </h3>

                    <p className="text-slate-300 text-base md:text-lg mb-10 leading-relaxed font-light">
                        {project.description}
                    </p>

                    {/* Metadata Table */}
                    <div className="bg-[#0b1221] border border-[#1e293b] rounded-3xl p-6 md:p-8 grid grid-cols-2 gap-y-8 gap-x-4 mb-10 shadow-lg">
                        <div className="flex flex-col gap-2">
                            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">Year</span>
                            <span className="text-sm md:text-base font-bold text-slate-100">{project.year}</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">Role</span>
                            <span className="text-sm md:text-base font-bold text-slate-100">{project.role}</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">Technologies</span>
                            <span className="text-sm md:text-base font-bold text-[#38bdf8]">{project.technologies}</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">Client</span>
                            <span className="text-sm md:text-base font-bold text-slate-100">{project.client}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div>
                        <a
                            href={project.github_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center gap-3 bg-[#38bdf8] hover:bg-[#0ea5e9] text-slate-950 font-bold px-8 py-3 rounded-full transition-transform hover:-translate-y-1 w-max shadow-lg shadow-[#38bdf8]/20"
                        >
                            <FaGithub className="w-5 h-5" />
                            View Code
                        </a>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <section className='flex flex-col py-24 px-4 md:px-8 lg:px-12 max-w-[1400px] mx-auto w-full'>
            <div className="flex flex-col items-center mb-24">
                <span className='text-sm text-[#38bdf8] font-bold tracking-[0.2em] uppercase mb-4'>My Work</span>
                <h2 className='text-4xl md:text-6xl font-extrabold text-slate-100 mb-6 text-center tracking-tight'>Featured Projects</h2>
                <p className='text-center text-slate-400 max-w-2xl text-lg md:text-xl font-light'>A collection of projects that showcase my passion for building robust and interactive web applications.</p>
            </div>

            <div className="flex flex-col">
                {projects.map((project, index) => projectCard(project, index))}
            </div>
        </section>
    )
}
