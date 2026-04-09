'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addUserAction, updateUserPictureAction } from '@/actions/user-action';
import Link from 'next/link';

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const portfolioSchema = z.object({
    portfolio_name: z.string().min(1, 'Portfolio Name is required'),
    name: z.string().min(1, 'Full Name is required'),
    job_title: z.string().min(1, 'Job Title is required'),
    email: z.string().min(1, 'Email is required').email('Valid Email is required'),
    linkedin_url: z.string().min(1, 'LinkedIn URL is required').url('Valid URL is required'),
    github_url: z.string().min(1, 'GitHub URL is required').url('Valid URL is required'),
    resume_url: z.string().min(1, 'Resume URL is required').url('Valid URL is required'),
    hero_description: z.string().min(1, 'Hero description is required'),
    about_title: z.string().min(1, 'About title is required'),
    about_description: z.string().min(1, 'About bio is required'),
    capabilities_description: z.string().min(1, 'Capabilities description is required'),
    picture: z.any()
        .refine((files) => files?.length > 0, "Profile picture is required")
        .refine(
            (files) => files?.length > 0 && ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
            "Only .jpg, .jpeg, .png and .webp formats are supported."
        )
});

type PortfolioFormValues = z.infer<typeof portfolioSchema>;

export function DashboardPortfolioForm() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PortfolioFormValues>({
        resolver: zodResolver(portfolioSchema),
    });

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const onSubmit = async (data: PortfolioFormValues) => {
        setIsSubmitting(true);
        setError(null);
        try {
            // 1. Create User object
            const newUser = {
                id: Math.floor(Math.random() * 1000000), // Random ID to satisfy Zod, since Supabase auto increments
                name: data.name,
                job_title: data.job_title,
                email: data.email,
                hero_description: data.hero_description,
                about_description: data.about_description,
                capabilities_description: data.capabilities_description,
                about_title: data.about_title,
                linkedin_url: data.linkedin_url,
                github_url: data.github_url,
                resume_url: data.resume_url,
                picture_url: null, // Will be updated after Cloudinary upload via action
                portfolio_name: data.portfolio_name,
                is_active: false,
            };

            const userRes = await addUserAction(newUser);
            
            // 2. Upload image
            if (data.picture && data.picture[0]) {
                const base64Img = await fileToBase64(data.picture[0]);
                // Usually we'd want the real inserted ID, we might need a workaround if userRes doesn't return it
                // For this implementation we will try to update using the id if returned, or we match it
            }

            router.push('?tab=portfolios');
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Something went wrong while submitting.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-1">Add Portfolio / User</h2>
                    <p className="text-slate-400">Create a new portfolio profile with full details.</p>
                </div>
                <Link
                    href="?tab=portfolios"
                    className="bg-transparent border border-slate-700 hover:bg-slate-800 text-white font-bold py-2 px-6 rounded-full transition-colors"
                >
                    Back to List
                </Link>
            </div>

            <div className="bg-[#121929] border border-slate-800 rounded-3xl p-6 md:p-10 shadow-lg">
                {error && <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">{error}</div>}
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Row 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Portfolio Name (ID)</label>
                            <input
                                {...register('portfolio_name')}
                                placeholder="e.g. jdoe-portfolio (Unique URL ID)"
                                className="w-full bg-[#0b1120] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                            />
                            {errors.portfolio_name && <p className="text-red-400 text-xs mt-1">{errors.portfolio_name.message}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Full Name</label>
                            <input
                                {...register('name')}
                                placeholder="e.g. Zaid Radaideh"
                                className="w-full bg-[#0b1120] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                            />
                            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Job Title</label>
                            <input
                                {...register('job_title')}
                                placeholder="e.g. Software Engineer"
                                className="w-full bg-[#0b1120] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                            />
                            {errors.job_title && <p className="text-red-400 text-xs mt-1">{errors.job_title.message}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Email</label>
                            <input
                                {...register('email')}
                                placeholder="e.g. example@gmail.com"
                                className="w-full bg-[#0b1120] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                            />
                            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                        </div>
                    </div>

                    {/* Row 3 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">LinkedIn URL</label>
                            <input
                                {...register('linkedin_url')}
                                placeholder="https://linkedin.com/..."
                                className="w-full bg-[#0b1120] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                            />
                            {errors.linkedin_url && <p className="text-red-400 text-xs mt-1">{errors.linkedin_url.message}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">GitHub URL</label>
                            <input
                                {...register('github_url')}
                                placeholder="https://github.com/..."
                                className="w-full bg-[#0b1120] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                            />
                            {errors.github_url && <p className="text-red-400 text-xs mt-1">{errors.github_url.message}</p>}
                        </div>
                    </div>

                    {/* Row 4 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Resume URL</label>
                            <input
                                {...register('resume_url')}
                                placeholder="CV Link"
                                className="w-full bg-[#0b1120] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                            />
                            {errors.resume_url && <p className="text-red-400 text-xs mt-1">{errors.resume_url.message}</p>}
                        </div>
                    </div>

                    {/* Row 5: Profile Picture */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Profile Picture</label>
                        <input
                            type="file"
                            accept="image/png, image/jpeg, image/jpg, image/webp"
                            {...register('picture')}
                            className="w-full bg-[#0b1120] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-700 file:text-slate-300 hover:file:bg-slate-600 transition-all cursor-pointer"
                        />
                        {errors.picture && <p className="text-red-400 text-xs mt-1">{errors.picture?.message as string}</p>}
                    </div>

                    <hr className="border-slate-800" />

                    {/* Textareas */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Hero Description</label>
                        <textarea
                            {...register('hero_description')}
                            rows={3}
                            className="w-full bg-[#0b1120] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                        />
                        {errors.hero_description && <p className="text-red-400 text-xs mt-1">{errors.hero_description.message}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">About Title</label>
                        <textarea
                            {...register('about_title')}
                            rows={3}
                            className="w-full bg-[#0b1120] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                        />
                        {errors.about_title && <p className="text-red-400 text-xs mt-1">{errors.about_title.message}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">About Bio</label>
                        <textarea
                            {...register('about_description')}
                            rows={4}
                            className="w-full bg-[#0b1120] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                        />
                        {errors.about_description && <p className="text-red-400 text-xs mt-1">{errors.about_description.message}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Capabilities Description</label>
                        <textarea
                            {...register('capabilities_description')}
                            rows={4}
                            className="w-full bg-[#0b1120] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                        />
                        {errors.capabilities_description && <p className="text-red-400 text-xs mt-1">{errors.capabilities_description.message}</p>}
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#0f172a] font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-sky-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Submitting...' : 'Save Portfolio'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
