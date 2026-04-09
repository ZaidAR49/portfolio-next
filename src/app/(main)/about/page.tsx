import { getActiveUserAction } from '@/actions/user-action'
import { getActiveSkillsAction } from '@/actions/skill-action'
import { Skill } from '@/lib/models/skill'
import { getActiveExperiences } from '@/lib/services/experience-service'
import { Suspense } from 'react'
import { Loading } from '@/components/loading'
import { FaGithub, FaLinkedin, FaBriefcase, FaGraduationCap } from 'react-icons/fa'
import { getIconForTechnology } from '@/lib/utils/client/icon-mapper'
import { Experience } from '@/lib/models/experience'

const page = async () => {
    const user = await getActiveUserAction();
    const skills = await getActiveSkillsAction();
    const experiences = await getActiveExperiences();
    console.log(experiences);
    console.log(skills);
    const mainSkills = skills.filter((skill: Skill) => skill.type === "primary");
    const secondarySkills = skills.filter((skill: Skill) => skill.type === "secondary");

    return (
        <main className="min-h-screen pt-32 pb-24 relative z-10 w-full mt-32">
            <Suspense fallback={<Loading />}>
                <section id="aboutfirst" className='flex flex-col md:flex-row items-start gap-12 lg:gap-20 max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 w-full'>
                    {/* Left Column: Header */}
                    <div className='w-full md:w-1/3 lg:w-[30%]'>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-slate-800 dark:text-slate-100 tracking-tight">About</h1>
                    </div>

                    {/* Right Column: Content */}
                    <div className='w-full md:w-2/3 lg:w-[70%] flex flex-col gap-6 max-w-4xl'>
                        <p className='text-lg md:text-xl lg:text-2xl font-medium text-slate-800 dark:text-slate-100 leading-relaxed'>{user.about_title}</p>

                        <p className='text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-light whitespace-pre-wrap'>{user.about_description}</p>

                        <div className="flex items-center gap-6 mt-6">
                            <a
                                href={user.resume_url}
                                className="bg-[#0ea5e9] hover:bg-[#0284c7] dark:bg-[#38bdf8] dark:hover:bg-sky-400 text-white dark:text-[#0b1120] font-bold px-6 py-2.5 rounded-full text-sm transition-colors shadow-md dark:shadow-lg"
                                target="_blank"
                                rel="noreferrer"
                            >
                                download My resume
                            </a>
                            <a
                                href={user.github_url}
                                className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="GitHub"
                            >
                                <FaGithub size={26} />
                            </a>
                            <a
                                href={user.linkedin_url}
                                className="text-slate-500 hover:text-[#0a66c2] dark:text-slate-400 dark:hover:text-white transition-colors"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="LinkedIn"
                            >
                                <FaLinkedin size={26} />
                            </a>
                        </div>
                    </div>
                </section>


                <section className="flex flex-col items-center max-w-[1200px] mx-auto px-4 md:px-8 xl:px-12 w-full mt-32 md:mt-48">
                    {/* Capabilities Title */}
                    <div className="flex flex-col items-center text-center max-w-3xl mb-24">
                        <span className="text-[#0ea5e9] dark:text-[#38bdf8] text-xs font-bold tracking-[0.2em] uppercase mb-4">My Skills</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-8">Capabilities</h2>
                        <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed font-light">{user.capabilities_description}</p>
                    </div>

                    {/* Tech Stack Header */}
                    <div className="w-full justify-start mb-8">
                        <div className="border-l-2 border-[#0ea5e9] dark:border-[#38bdf8] pl-4">
                            <h3 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100">Tech Stack</h3>
                        </div>
                    </div>

                    {/* Tech Stack Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5 w-full">
                        {mainSkills.map((skill: Skill, index: number) => (
                            <div key={index} className="flex flex-col items-center justify-center gap-4 bg-white/60 dark:bg-[#0b1120]/40 backdrop-blur-md border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-[#0b1120]/80 rounded-2xl p-8 transition-all duration-300 shadow-sm dark:shadow-none group">
                                <span className="text-4xl text-slate-400 group-hover:text-[#0ea5e9] dark:group-hover:text-[#38bdf8] transition-colors">
                                    {getIconForTechnology(skill.name)}
                                </span>
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-100 tracking-wide">{skill.name}</span>
                            </div>

                        ))}
                    </div>
                    <div className="w-full justify-start mb-8 mt-12">
                        <div className="border-l-2 border-[#0ea5e9] dark:border-[#38bdf8] pl-4">
                            <h3 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100">Tools & Others</h3>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5 w-full">
                        {secondarySkills.map((skill: Skill, index: number) => (
                            <div key={index} className="flex flex-col items-center justify-center gap-4 bg-white/60 dark:bg-[#0b1120]/40 backdrop-blur-md border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-[#0b1120]/80 rounded-2xl p-8 transition-all duration-300 shadow-sm dark:shadow-none group">
                                <span className="text-4xl text-slate-400 group-hover:text-[#0ea5e9] dark:group-hover:text-[#38bdf8] transition-colors">
                                    {getIconForTechnology(skill.name)}
                                </span>
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-100 tracking-wide">{skill.name}</span>
                            </div>

                        ))}
                    </div>
                </section>
                {/* Experience Section */}
                <section className="flex flex-col items-center max-w-[1200px] mx-auto px-4 md:px-8 xl:px-12 w-full mt-32 md:mt-48 pb-32">
                    {/* Experience Title */}
                    <div className="flex flex-col items-center text-center max-w-3xl mb-24">
                        <span className="text-[#0ea5e9] dark:text-[#38bdf8] text-xs font-bold tracking-[0.2em] uppercase mb-4">My Journey</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-8">Experience & Education</h2>
                    </div>

                    <div className="relative w-full max-w-5xl mx-auto">
                        {/* Vertical line faintly visible on desktop */}
                        <div className="absolute left-6 md:left-1/2 transform md:-translate-x-1/2 h-full w-px bg-slate-200 dark:bg-slate-800/50 hidden md:block z-0"></div>

                        <div className="space-y-12 md:space-y-24 relative z-10">
                            {experiences.map((exp: Experience, index: number) => {
                                // Default layout is empty space left, content right. 
                                // To alternate, every odd index we reverse the row.
                                const isLeft = index % 2 !== 0;

                                return (
                                    <div key={exp.id} className={`relative flex flex-col md:flex-row items-center justify-between w-full ${isLeft ? 'md:flex-row-reverse' : ''}`}>

                                        {/* Empty space for alternating layout */}
                                        <div className="hidden md:block w-[45%]"></div>

                                        {/* Timeline Dot */}
                                        <div className="absolute top-10 left-0 md:top-1/2 md:left-1/2 transform md:-translate-x-1/2 md:-translate-y-1/2 w-4 h-4 rounded-full bg-[#0ea5e9] dark:bg-[#38bdf8] shadow-[0_0_15px_rgba(14,165,233,0.5)] dark:shadow-[0_0_20px_rgba(56,189,248,0.8)] z-20 border-2 border-white dark:border-[#0b1120]"></div>

                                        {/* Content Card */}
                                        <div className="w-full pl-10 md:pl-0 md:w-[45%]">
                                            <div className="bg-white/80 dark:bg-[#0b1120]/60 backdrop-blur-md border border-slate-200 dark:border-slate-800/80 rounded-2xl p-8 hover:border-[#0ea5e9]/50 dark:hover:border-[#38bdf8]/50 hover:bg-slate-50 dark:hover:bg-[#0b1120]/80 transition-all duration-300 group shadow-md dark:shadow-lg">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <span className="text-[#0ea5e9] dark:text-[#38bdf8]">
                                                        {exp.role.toLowerCase().includes('student') || exp.role.toLowerCase().includes('education') || exp.role.toLowerCase().includes('degree') || exp.role.toLowerCase().includes('university') ? (
                                                            <FaGraduationCap size={18} />
                                                        ) : (
                                                            <FaBriefcase size={18} />
                                                        )}
                                                    </span>
                                                    <span className="text-[#0ea5e9] dark:text-[#38bdf8] text-xs font-bold tracking-widest uppercase">{exp.period}</span>
                                                </div>
                                                <h3 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-[#0ea5e9] dark:group-hover:text-[#38bdf8] transition-colors">{exp.role}</h3>
                                                <div className="text-slate-600 dark:text-slate-400 text-sm mb-5 font-medium">{exp.company}</div>
                                                <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed font-light whitespace-pre-wrap">{exp.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </Suspense>
        </main>
    )
}

export default page