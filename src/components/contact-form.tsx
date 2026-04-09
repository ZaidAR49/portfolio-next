"use client";
import { FaPaperPlane } from "react-icons/fa";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import { sendMessageAction } from "@/actions/contact-action";
export const ContactForm = () => {
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        const form = e.currentTarget;
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(form);
        const data = await sendMessageAction(formData);
        if (data.success) {
            toast.success(data.message);
            form.reset();
        } else {
            toast.error(data.message);
        }
        setLoading(false);


    };

    return (
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
            <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* Full Name */}
                    <div className="flex flex-col">
                        <label htmlFor="fullName" className="text-xs text-slate-500 dark:text-slate-400 mb-2">Full Name</label>
                        <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            required
                            minLength={2}
                            maxLength={50}
                            placeholder="John Doe"
                            className="bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#0ea5e9] dark:focus:border-sky-500"
                        />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-xs text-slate-500 dark:text-slate-400 mb-2">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="john@example.com"
                            className="bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#0ea5e9] dark:focus:border-sky-500"
                        />
                    </div>
                </div>

                {/* Subject */}
                <div className="flex flex-col">
                    <label htmlFor="subject" className="text-xs text-slate-500 dark:text-slate-400 mb-2">Subject</label>
                    <input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        minLength={2}
                        maxLength={100}
                        placeholder="Project Inquiry"
                        className="bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#0ea5e9] dark:focus:border-sky-500"
                    />
                </div>

                {/* Message */}
                <div className="flex flex-col">
                    <label htmlFor="message" className="text-xs text-slate-500 dark:text-slate-400 mb-2">Message</label>
                    <textarea
                        id="message"
                        name="message"
                        required
                        minLength={10}
                        maxLength={1000}
                        placeholder="Tell me about your project..."
                        rows={4}
                        className="bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#0ea5e9] dark:focus:border-sky-500 resize-y"
                    ></textarea>
                </div>

                {/* Submit Button */}
                {
                    loading ? (
                        <button
                            type="button"
                            className="w-full bg-[#0ea5e9] dark:bg-[#29b6f6] hover:bg-[#0284c7] dark:hover:bg-[#039be5] text-white dark:text-slate-900 font-bold text-sm py-4 rounded-xl flex items-center justify-center gap-2 mt-6"
                        >
                            Sending...
                            <FaPaperPlane className="text-sm" />
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="w-full bg-[#0ea5e9] dark:bg-[#29b6f6] hover:bg-[#0284c7] dark:hover:bg-[#039be5] text-white dark:text-slate-900 font-bold text-sm py-4 rounded-xl flex items-center justify-center gap-2 mt-6"
                        >
                            Send Message
                            <FaPaperPlane className="text-sm" />
                        </button>
                    )
                }
            </form>
            <Toaster position="bottom-right" richColors />
        </div>
    )
}
