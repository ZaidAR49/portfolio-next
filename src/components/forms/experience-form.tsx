'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { addExperienceAction, updateExperienceAction, getExperienceByIdAction } from '@/actions/experience-action';
import { getActiveUserAction } from '@/actions/user-action';
import { Experience, ExperienceSchema } from "@/lib/models/experience";
import { toast, Toaster } from 'sonner';
import { Loading } from '@/components/loading';
import Link from 'next/link';
import { FaSave } from "react-icons/fa";

export function DashboardExperienceForm({ experienceId }: { experienceId?: number }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const isEditMode = !!experienceId;
    const [activeUserId, setActiveUserId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<Experience>({
        resolver: zodResolver(ExperienceSchema),
    });

    useEffect(() => {
        getActiveUserAction().then(res => {
            if (res && res.length > 0) {
                setActiveUserId(res[0].id);
            }
            if (!isEditMode) {
                setIsLoading(false);
            }
        });

        if (experienceId) {
            getExperienceByIdAction(experienceId).then((exp) => {
                if (exp) {
                    const expData = Array.isArray(exp) ? exp[0] : exp;
                    if (expData) {
                        reset({
                            id: expData.id,
                            user_id: expData.user_id,
                            role: expData.role,
                            company: expData.company,
                            period: expData.period,
                            description: expData.description,
                        });
                    }
                }
                setIsLoading(false);
            }).catch((error) => {
                console.error(error);
                toast.error("Failed to fetch experience details");
                setIsLoading(false);
            });
        }
    }, [experienceId, reset, isEditMode]);

    const onSubmit = async (data: Experience) => {
        setIsSubmitting(true);
        setError(null);

        if (!activeUserId && !isEditMode) {
            setError("No active user found. Please activate a portfolio first.");
            toast.error("No active user found.");
            setIsSubmitting(false);
            return;
        }

        try {
            if (isEditMode) {
                data.id = experienceId;
                data.user_id = data.user_id || activeUserId || 0; 
                await updateExperienceAction(data);
                toast.success("Experience updated successfully");
            } else {
                data.user_id = activeUserId as number;
                await addExperienceAction(data);
                toast.success("Experience added successfully");
            }
            router.push('?tab=experience');
        } catch (err: any) {
            console.error("Error -->: ", err);
            setError(err.message || 'Something went wrong while submitting.');
            toast.error(`Failed to ${isEditMode ? 'update' : 'add'} experience`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {isLoading ? <Loading /> : (
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-1">{isEditMode ? 'Edit Experience' : 'Add Experience'}</h2>
                        </div>
                    </div>

                    <div className="bg-[#121929] border border-slate-800 rounded-3xl p-6 md:p-10 shadow-lg">
                        {error && <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">{error}</div>}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Role</label>
                                    <input
                                        {...register('role')}
                                        placeholder="e.g. Senior Software Engineer"
                                        className="w-full bg-[#0b1120] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                                    />
                                    {errors.role && <p className="text-red-400 text-xs mt-1">{errors.role.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Company</label>
                                    <input
                                        {...register('company')}
                                        placeholder="e.g. Google"
                                        className="w-full bg-[#0b1120] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                                    />
                                    {errors.company && <p className="text-red-400 text-xs mt-1">{errors.company.message}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Period</label>
                                    <input
                                        {...register('period')}
                                        placeholder="e.g. Sep 2025 - Present"
                                        className="w-full bg-[#0b1120] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                                    />
                                    {errors.period && <p className="text-red-400 text-xs mt-1">{errors.period.message}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Description</label>
                                <textarea
                                    {...register('description')}
                                    rows={4}
                                    placeholder="Describe your role, responsibilities, and key achievements..."
                                    className="w-full bg-[#0b1120] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                                />
                                {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
                            </div>

                            <div className="flex justify-end pt-4 gap-4">
                                <Link
                                    href="?tab=experience"
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
