"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { FaTrash, FaSearch, FaTimes } from "react-icons/fa";
import { getActiveSkillsAction, deleteSkillAction, addSkillAction } from "@/actions/skill-action";
import { getActiveUserAction } from '@/actions/user-action';
import { Skill } from "@/lib/models/skill";
import { availableTechnologies, getIconForTechnology } from "@/lib/utils/client/icon-mapper";
import { toast, Toaster } from "sonner";
import { Loading } from "@/components/loading";
import { ConfirmModal } from "@/components/ui/confirm-modal";

export function DashboardSkills() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [skillToDelete, setSkillToDelete] = useState<number | null>(null);
    const [activeUserId, setActiveUserId] = useState<number | null>(null);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const fetchInitialData = () => {
        setIsLoading(true);
        Promise.all([
            getActiveSkillsAction(),
            getActiveUserAction()
        ]).then(([skillsData, usersData]) => {
            setSkills(skillsData);
            if (usersData) {
                setActiveUserId(usersData.id);
            }
        }).catch(err => {
            console.error(err);
            toast.error("Failed to load skills.");
        }).finally(() => {
            setIsLoading(false);
        });
    };

    const fetchSkills = () => {
        getActiveSkillsAction().then(data => setSkills(data)).catch(console.error);
    }

    useEffect(() => {
        fetchInitialData();
    }, []);

    const handleDeleteClick = (id: number) => {
        setSkillToDelete(id);
    }

    const handleConfirmDelete = async () => {
        if (skillToDelete === null) return;
        try {
            await deleteSkillAction(skillToDelete);
            toast.success("Skill removed");
            fetchSkills();
        } catch (error) {
            toast.error("Failed to remove skill");
            console.error(error);
        } finally {
            setSkillToDelete(null);
        }
    }

    const handleAddSkill = async (name: string, type: "primary" | "secondary") => {
        if (!activeUserId) {
            toast.error("No active user found. Please activate a portfolio first.");
            return;
        }

        if (skills.some(s => s.name.toLowerCase() === name.toLowerCase())) {
            toast.error(`${name} is already in your skills.`);
            return;
        }

        try {
            // Optimistic update visual feedback by hiding modal early
            setIsAddModalOpen(false);
            const promise = addSkillAction({ name, type, user_id: activeUserId }).then(() => {
                fetchSkills();
            });

            toast.promise(
                promise,
                {
                    loading: `Adding ${name}...`,
                    success: `${name} added securely`,
                    error: "Failed to add skill"
                }
            );
        } catch (error) {
            console.error(error);
        }
    };

    const primarySkills = skills.filter(s => s.type === "primary");
    const secondarySkills = skills.filter(s => s.type === "secondary");

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-1">Skills & Technologies</h2>
                    <p className="text-slate-400">Manage your technical arsenal</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#0f172a] font-bold py-2 px-6 rounded-full transition-colors shadow-lg shadow-sky-500/20"
                >
                    Add New
                </button>
            </div>

            {isLoading ? <Loading /> : (
                <div className="space-y-12">
                    {/* Primary Skills */}
                    <div className="space-y-4 pt-4">
                        <h3 className="text-xl font-bold text-white mb-6">Primary Skills</h3>
                        {primarySkills.length === 0 ? (
                            <p className="text-slate-500 bg-[#121929] border border-slate-800 p-6 rounded-2xl text-center">No primary skills added yet.</p>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                {primarySkills.map(skill => (
                                    <SkillCard key={skill.id!} skill={skill} onDelete={() => skill.id && handleDeleteClick(skill.id)} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Secondary Skills */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white mb-6">Secondary Skills</h3>
                        {secondarySkills.length === 0 ? (
                            <p className="text-slate-500 bg-[#121929] border border-slate-800 p-6 rounded-2xl text-center">No secondary skills added yet.</p>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                {secondarySkills.map(skill => (
                                    <SkillCard key={skill.id!} skill={skill} onDelete={() => skill.id && handleDeleteClick(skill.id)} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {isAddModalOpen && (
                <AddSkillModal
                    onClose={() => setIsAddModalOpen(false)}
                    onAddSkill={handleAddSkill}
                />
            )}

            <ConfirmModal
                isOpen={skillToDelete !== null}
                onClose={() => setSkillToDelete(null)}
                onConfirm={handleConfirmDelete}
                title="Remove Skill"
                description="Are you sure you want to remove this skill? It will no longer appear on your public profile."
                confirmText="Remove"
                cancelText="Cancel"
                isDestructive={true}
            />

            <Toaster richColors position="bottom-center" duration={2000} />
        </div>
    );
}

function SkillCard({ skill, onDelete }: { skill: Skill; onDelete: () => void }) {
    return (
        <div className="bg-[#121929] border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 relative group hover:border-[#38bdf8]/50 transition-all shadow-sm">
            <button
                onClick={onDelete}
                className="absolute top-3 right-3 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100 p-1.5 hover:bg-red-400/10 rounded-lg"
                title="Remove skill"
            >
                <FaTrash size={13} />
            </button>
            <div className="text-[40px] text-[#38bdf8]">
                {getIconForTechnology(skill.name)}
            </div>
            <span className="font-bold text-slate-200 text-[13px] text-center tracking-wide">{skill.name}</span>
        </div>
    );
}

function AddSkillModal({ onClose, onAddSkill }: { onClose: () => void; onAddSkill: (name: string, type: "primary" | "secondary") => void }) {
    const [search, setSearch] = useState('');
    const [type, setType] = useState<"primary" | "secondary">("primary");

    const filteredTech = useMemo(() => {
        if (!search) return availableTechnologies;
        const lower = search.toLowerCase();
        return availableTechnologies.filter(t => t.toLowerCase().includes(lower));
    }, [search]);

    return (
        <div className="fixed inset-0 bg-[#0b1120]/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6">
            <div
                className="bg-[#121929] border border-slate-800 flex flex-col rounded-3xl w-full max-w-4xl shadow-2xl h-[85vh] sm:h-[700px] max-h-screen"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 sm:p-8 border-b border-slate-800/80 flex-shrink-0">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">Add New Skill</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-colors"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Controls */}
                <div className="p-6 sm:px-8 sm:py-6 border-b border-slate-800/80 flex-shrink-0 space-y-6">
                    {/* Search */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <FaSearch className="text-slate-400 group-focus-within:text-sky-400 transition-colors" />
                        </div>
                        <input
                            type="text"
                            autoFocus
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search technologies..."
                            className="w-full bg-[#0b1120] border border-slate-700 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all font-medium text-[15px]"
                        />
                    </div>

                    {/* Radio */}
                    <div className="flex items-center gap-8 pl-1">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="skillType"
                                value="primary"
                                checked={type === "primary"}
                                onChange={() => setType("primary")}
                                className="w-4 h-4 text-sky-500 bg-slate-800 border-slate-600 focus:ring-sky-500 focus:ring-offset-slate-900 cursor-pointer"
                            />
                            <span className={`font-bold transition-colors ${type === "primary" ? "text-white" : "text-slate-400 group-hover:text-slate-300"}`}>Primary Skill</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="skillType"
                                value="secondary"
                                checked={type === "secondary"}
                                onChange={() => setType("secondary")}
                                className="w-4 h-4 text-sky-500 bg-slate-800 border-slate-600 focus:ring-sky-500 focus:ring-offset-slate-900 cursor-pointer"
                            />
                            <span className={`font-bold transition-colors ${type === "secondary" ? "text-white" : "text-slate-400 group-hover:text-slate-300"}`}>Secondary Skill</span>
                        </label>
                    </div>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-[#0b1120]/30 custom-scrollbar">
                    {filteredTech.length === 0 ? (
                        <div className="text-center text-slate-500 py-16 flex flex-col items-center gap-4">
                            <FaSearch size={32} className="text-slate-700" />
                            <p className="text-lg">No technologies found for "{search}"</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {filteredTech.map(tech => (
                                <button
                                    key={tech}
                                    type="button"
                                    onClick={() => onAddSkill(tech, type)}
                                    className="bg-[#121929] border border-slate-800 hover:border-sky-500 hover:bg-sky-500/10 rounded-xl p-5 flex flex-col items-center justify-center gap-3 transition-all outline-none focus:ring-2 focus:ring-sky-500 group shadow-sm hover:shadow-sky-500/10"
                                >
                                    <div className="text-4xl text-slate-400/80 group-hover:text-[#38bdf8] transition-colors">
                                        {getIconForTechnology(tech)}
                                    </div>
                                    <span className="font-bold text-slate-300 group-hover:text-white text-[13px] text-center transition-colors line-clamp-1 w-full">
                                        {tech}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #1e293b;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #334155;
                }
            `}</style>
        </div>
    );
}
