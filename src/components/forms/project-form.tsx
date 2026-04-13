'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { addProjectWithFilesAction, updateProjectWithFilesAction, getProjectByIdAction, updateProjectImagesOnlyAction, updateProjectAction } from '@/actions/project-action';
import { getActiveUserAction } from '@/actions/user-action';
import { RequestProject, RequestProjectSchema, Project } from "@/lib/models/project";
import { toast, Toaster } from 'sonner';
import { Loading } from '@/components/loading';
import Link from 'next/link';
import { FaSave, FaPlus, FaTimes } from "react-icons/fa";

export function DashboardProjectForm({ projectId }: { projectId?: number }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const isEditMode = !!projectId;
    const [activeUserId, setActiveUserId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
    const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
    const [newImageFiles, setNewImageFiles] = useState<File[]>([]);

    const MAX_IMAGES = 5;

    const {
        register,
        handleSubmit,
        formState: { errors, dirtyFields },
        reset
    } = useForm<RequestProject>({
        resolver: zodResolver(RequestProjectSchema),
    });

    useEffect(() => {
        getActiveUserAction().then(res => {
            if (res) {
                setActiveUserId(res.id);
            }
            if (!isEditMode) setIsLoading(false);
        });

        if (projectId) {
            getProjectByIdAction(projectId).then((proj) => {
                const projData = Array.isArray(proj) ? proj[0] : proj;
                if (projData) {
                    reset({
                        id: projData.id,
                        user_id: projData.user_id,
                        title: projData.title,
                        client: projData.client,
                        role: projData.role,
                        year: projData.year,
                        status: projData.status,
                        sort_order: projData.sort_order,
                        description: projData.description,
                        github_url: projData.github_url || "",
                        technologies: projData.technologies,
                        images: projData.images || [],
                    });
                    setExistingImages(projData.images || []);
                }
                setIsLoading(false);
            }).catch((err) => {
                console.error(err);
                toast.error("Failed to fetch project details");
                setIsLoading(false);
            });
        }
    }, [projectId, reset, isEditMode]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const filesArray = Array.from(e.target.files);
        const currentTotal = existingImages.length - imagesToDelete.length + newImageFiles.length;

        if (currentTotal + filesArray.length > MAX_IMAGES) {
            toast.error(`You can only have up to ${MAX_IMAGES} images maximum.`);
            return;
        }

        setNewImageFiles(prev => [...prev, ...filesArray]);

        const previews = filesArray.map(file => URL.createObjectURL(file));
        setNewImagePreviews(prev => [...prev, ...previews]);
    };

    const removeExistingImage = (url: string) => {
        setImagesToDelete(prev => [...prev, url]);
    };

    const removeNewImage = (index: number) => {
        setNewImageFiles(prev => prev.filter((_, i) => i !== index));
        setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const onSubmit = async (data: RequestProject) => {
        console.log("submit");
        setIsSubmitting(true);
        setError(null);

        if (!activeUserId && !isEditMode) {
            toast.error("No active user found.");
            setIsSubmitting(false);
            return;
        }

        try {
            if (isEditMode && projectId) {
                const hasTextChanges = Object.keys(dirtyFields).length > 0;
                const hasImageChanges = newImageFiles.length > 0 || imagesToDelete.length > 0;

                data.id = projectId;
                data.user_id = data.user_id || activeUserId || 0;

                // If NOTHING changed
                if (!hasTextChanges && !hasImageChanges) {
                    toast.info("No changes to save.");
                    setIsSubmitting(false);
                    return;
                }

                // If Both text and images changed
                if (hasTextChanges && hasImageChanges) {
                    data.images = existingImages;
                    data.new_images = newImageFiles;
                    await updateProjectWithFilesAction(data, imagesToDelete);
                }
                // If ONLY Text changed
                else if (hasTextChanges && !hasImageChanges) {
                    const projectToUpdate: Project = {
                        id: data.id,
                        user_id: data.user_id,
                        title: data.title,
                        client: data.client,
                        role: data.role,
                        year: data.year,
                        status: data.status,
                        sort_order: data.sort_order,
                        description: data.description,
                        github_url: data.github_url,
                        technologies: data.technologies
                    };
                    projectToUpdate.technologies = data.technologies
                    projectToUpdate.images = existingImages;

                    await updateProjectAction(projectToUpdate);
                }
                // If ONLY Images changed
                else if (!hasTextChanges && hasImageChanges) {
                    await updateProjectImagesOnlyAction(projectId, existingImages, newImageFiles, imagesToDelete);
                }

                toast.success("Project updated successfully");
            } else {
                data.images = existingImages;
                data.new_images = newImageFiles;
                data.user_id = activeUserId as number;
                await addProjectWithFilesAction(data);
                toast.success("Project added successfully");
            }
            router.push('?tab=projects');
        } catch (err: any) {
            console.error("Error:", err);
            setError(err.message || 'Something went wrong while submitting.');
            toast.error(`Failed to ${isEditMode ? 'update' : 'add'} project`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const activeExistingImages = existingImages.filter(img => !imagesToDelete.includes(img));
    const totalCurrentImages = activeExistingImages.length + newImagePreviews.length;

    return (
        <>
            {isLoading ? <Loading /> : (
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-1">{isEditMode ? 'Edit Project' : 'Add Project'}</h2>
                        </div>
                    </div>

                    <div className="bg-[#121929] border border-slate-800 rounded-3xl p-6 md:p-10 shadow-lg">
                        {error && <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">{error}</div>}

                        <form onSubmit={handleSubmit(onSubmit, (formErrors) => console.log("Form Validation Errors:", formErrors))} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Title</label>
                                    <input
                                        {...register('title')}
                                        placeholder="e.g. E-Commerce Platform"
                                        className="w-full bg-[#0b1120] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all"
                                    />
                                    {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Client</label>
                                    <input
                                        {...register('client')}
                                        placeholder="e.g. John Doe / Personal"
                                        className="w-full bg-[#0b1120] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all"
                                    />
                                    {errors.client && <p className="text-red-400 text-xs mt-1">{errors.client.message}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Technologies</label>
                                    <input
                                        {...register('technologies')}
                                        placeholder="e.g. React, Node.js, MongoDB (comma separated)"
                                        className="w-full bg-[#0b1120] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all"
                                    />
                                    {errors.technologies && <p className="text-red-400 text-xs mt-1">{errors.technologies.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Github Link</label>
                                    <input
                                        {...register('github_url')}
                                        placeholder="https://github.com/username/project"
                                        className="w-full bg-[#0b1120] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all"
                                    />
                                    {errors.github_url && <p className="text-red-400 text-xs mt-1">{errors.github_url.message}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Year</label>
                                    <input
                                        min={1900}
                                        max={2099}
                                        type="number"
                                        {...register('year', { valueAsNumber: true })}
                                        placeholder="YYYY"
                                        className="w-full bg-[#0b1120] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all"
                                    />
                                    {errors.year && <p className="text-red-400 text-xs mt-1">{errors.year.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Role</label>
                                    <input
                                        {...register('role')}
                                        placeholder="e.g. Full Stack Developer"
                                        className="w-full bg-[#0b1120] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all"
                                    />
                                    {errors.role && <p className="text-red-400 text-xs mt-1">{errors.role.message}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Sort Order</label>
                                    <input
                                        min={1}
                                        max={100}
                                        type="number"
                                        {...register('sort_order', { valueAsNumber: true })}
                                        placeholder="6"
                                        className="w-full bg-[#0b1120] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all"
                                    />
                                    {errors.sort_order && <p className="text-red-400 text-xs mt-1">{errors.sort_order.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Status</label>
                                    <input
                                        {...register('status')}
                                        placeholder="Completed"
                                        className="w-full bg-[#0b1120] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all"
                                    />
                                    {errors.status && <p className="text-red-400 text-xs mt-1">{errors.status.message}</p>}
                                </div>
                            </div>

                            {/* Images Section */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">Project Images (MAX {MAX_IMAGES})</label>
                                <div className="flex flex-wrap gap-4">

                                    {/* Add Image Box */}
                                    {totalCurrentImages < MAX_IMAGES && (
                                        <div className="relative w-32 h-24 border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:text-sky-400 hover:border-sky-500 transition-colors bg-[#0b1120]">
                                            <FaPlus className="mb-1" />
                                            <span className="text-xs font-semibold">Add Image</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                data-lpignore="true"
                                                onChange={handleFileChange}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                        </div>
                                    )}

                                    {/* Active Existing Images */}
                                    {activeExistingImages.map((img, i) => (
                                        <div key={`exist-${i}`} className="relative w-32 h-24 rounded-xl border border-slate-700 overflow-hidden group">
                                            <img src={img} alt="Project" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button type="button" onClick={() => removeExistingImage(img)} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg">
                                                    <FaTimes size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {/* New Image Previews */}
                                    {newImagePreviews.map((preview, i) => (
                                        <div key={`new-${i}`} className="relative w-32 h-24 rounded-xl border border-slate-700 overflow-hidden group">
                                            <img src={preview} alt="New Upload Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button type="button" onClick={() => removeNewImage(i)} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg">
                                                    <FaTimes size={12} />
                                                </button>
                                            </div>
                                            <div className="absolute top-1 right-1 bg-sky-500 text-[10px] font-bold px-1.5 rounded text-white">NEW</div>
                                        </div>
                                    ))}

                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Description</label>
                                <textarea
                                    {...register('description')}
                                    rows={5}
                                    placeholder="Briefly describe the project features and challenges..."
                                    className="w-full bg-[#0b1120] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all"
                                />
                                {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
                            </div>

                            <div className="flex justify-end pt-4 gap-4">
                                <Link
                                    href="?tab=projects"
                                    className="bg-transparent border border-slate-700 hover:bg-slate-800 text-white font-medium py-3 px-8 rounded-xl transition-colors"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#0f172a] font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-sky-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isSubmitting ? 'Submitting...' : (
                                        <>
                                            <FaSave className="text-lg" /> Save
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                        <Toaster richColors position="bottom-right" />
                    </div>
                </div>
            )}
        </>
    );
}
