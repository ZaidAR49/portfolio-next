"use client";
import { FaEdit, FaTrash } from "react-icons/fa";
import { getActiveProjectsAction, deleteProjectAction } from "@/actions/project-action";
import { Project } from "@/lib/models/project";
import { Suspense, useState, useEffect } from "react";
import { Loading } from "@/components/loading";
import Link from 'next/link';
import { toast, Toaster } from "sonner";
import { ConfirmModal } from "@/components/ui/confirm-modal";

export function DashboardProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [projToDelete, setProjToDelete] = useState<number | null>(null);

    const fetchProjects = () => {
        setIsLoading(true);
        getActiveProjectsAction().then((data) => {
            data.sort((a: Project, b: Project) => a.sort_order - b.sort_order);
            setProjects(data);

        }).catch((error) => {
            console.error(error);
            toast.error("Failed to fetch projects");
        }).finally(() => {
            setIsLoading(false);
        });
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleDeleteClick = (id: number) => {
        setProjToDelete(id);
    }

    const handleConfirmDelete = async () => {
        if (projToDelete === null) return;
        try {
            await deleteProjectAction(projToDelete);
            toast.success("Project deleted successfully");
            fetchProjects();
        } catch (error) {
            toast.error("Failed to delete project");
            console.error(error);
        } finally {
            setProjToDelete(null);
        }
    }

    return (
        <>
            {isLoading ? <Loading /> :
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-1">Projects</h2>
                            <p className="text-slate-400">Showcase your best work</p>
                        </div>
                        <Link
                            href="?tab=projects&action=new"
                            className="bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#0f172a] font-bold py-2 px-6 rounded-full transition-colors shadow-lg shadow-sky-500/20 inline-block"
                        >
                            Add New
                        </Link>
                    </div>

                    <Suspense fallback={<Loading />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                            {projects?.map((proj: Project, index: number) => (
                                <div
                                    key={proj.id || index}
                                    className="relative overflow-hidden bg-[#121929]/60  border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:border-slate-700 transition-all gap-4 backdrop-blur-md"
                                >
                                    {proj.images && (
                                        <div
                                            className="absolute inset-0 -z-10 opacity-20"
                                            style={{
                                                backgroundImage: `url(${proj.images[0] || '/default-bg.jpg'})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                backgroundRepeat: 'no-repeat',
                                                backgroundBlendMode: 'overlay',
                                                backgroundColor: '#121929',
                                                opacity: 0.5,
                                                zIndex: -1,
                                                transition: 'all 0.3s ease-in-out',
                                            }}
                                        />
                                    )
                                    }
                                    <div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-xs font-mono text-slate-400 border border-slate-700 px-2 py-1 rounded">#{proj.sort_order}</span>
                                            <span className={`text-xs px-2 py-1 rounded border font-medium ${proj.status.toLowerCase() === 'completed'
                                                ? 'bg-[#064e3b] text-[#10b981] border-[#064e3b]'
                                                : 'bg-rose-950/50 text-rose-400 border-rose-900/50'
                                                }`}>
                                                {proj.status.toLowerCase()}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">{proj.title}</h3>
                                        <p className="text-slate-400 text-sm line-clamp-3 mb-6">{proj.description}</p>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                                        <div className="flex flex-wrap gap-2 text-[#38bdf8] text-xs font-mono">
                                            {proj.technologies}
                                            {proj.technologies.length > 3 && '...'}
                                        </div>
                                        <div className="flex items-center gap-4 flex-shrink-0 bg-[#0b1120] px-3 py-1.5 rounded-lg border border-slate-800">
                                            <Link href={`?tab=projects&action=edit&id=${proj.id}`} className="text-slate-400 hover:text-white transition-colors" title="Edit">
                                                <FaEdit size={14} />
                                            </Link>
                                            <button type="button" onClick={() => { proj.id && handleDeleteClick(proj.id) }} className="text-slate-400 hover:text-red-400 transition-colors" title="Delete">
                                                <FaTrash size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {projects.length === 0 && (
                                <div className="text-slate-400 text-center py-8 col-span-full bg-[#121929] rounded-2xl border border-slate-800">
                                    No projects found. Add one to showcase your work!
                                </div>
                            )}
                        </div>
                    </Suspense>

                    <ConfirmModal
                        isOpen={projToDelete !== null}
                        onClose={() => setProjToDelete(null)}
                        onConfirm={handleConfirmDelete}
                        title="Delete Project"
                        description="Are you sure you want to delete this project? This action cannot be undone."
                        confirmText="Delete"
                        cancelText="Cancel"
                        isDestructive={true}
                    />

                    <Toaster richColors position="bottom-center" duration={2000} />
                </div>
            }
        </>
    );
}
