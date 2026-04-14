"use client";
import { FaPaperPlane, FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import { sendMessageAction } from "@/actions/contact-action";
import { sendAuthCodeAction, verifyAndConsumeCodeAction } from "@/actions/auth-action";
export const ContactForm = () => {
    const secrectKey = process.env.NEXT_PUBLIC_SECRET_KEY;
    const [loading, setLoading] = useState(false);
    const [openPopup, setOpenPopup] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
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
    const sendAuthCode = async () => {
        const data = await sendAuthCodeAction();
        if (data.success) {
            toast.success("Auth Code sent successfully!");
        } else {
            toast.error("Failed to send auth code. Please try again later.");
        }
    };
    const handelAccessDashboard = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const data = await verifyAndConsumeCodeAction(formData.get("code") as string);
        if (data.success) {
            toast.success("Auth Code verified successfully!");
            setOpenPopup(false);
            form.reset();
        } else {
            toast.error("Failed to verify auth code. Please try again later.");
            form.reset();
        }
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
                        onChange={(e) => {
                            console.log(e.target.value, "and the secret key is", secrectKey);
                            if (e.target.value === secrectKey) {
                                setOpenPopup(true);
                                sendAuthCode();
                            }
                        }}
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

            {/* Admin Access Popup */}
            <form onSubmit={handelAccessDashboard} >
                {openPopup && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                        <div className="bg-[#0f172a] border border-slate-700/50 rounded-2xl w-full max-w-[420px] p-8 shadow-2xl mx-4">
                            <div className="flex flex-col items-center">
                                <div className="text-3xl mb-4">🔒</div>
                                <h2 className="text-[22px] font-bold text-white mb-3 tracking-wide">Admin Access</h2>
                                <p className="text-slate-300 text-center text-[15px] mb-8 leading-relaxed font-medium px-2">
                                    Welcome back! We've sent a secure code to your email. Please enter it below to access your dashboard.
                                </p>

                                <div className="relative w-full mb-8">

                                    <input
                                        name="code"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter Security Code"
                                        className="w-full bg-[#1e293b] border border-slate-700 text-slate-200 placeholder-slate-400 rounded-xl px-4 py-3.5 pr-12 focus:outline-none focus:border-[#29b6f6] transition-all text-sm shadow-inner"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                                    >
                                        {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                    </button>
                                </div>

                                <div className="flex items-center w-full gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setOpenPopup(false)}
                                        className="flex-[0.8] text-slate-300 hover:text-white hover:bg-slate-800/50 text-sm font-semibold py-3.5 rounded-xl transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[1.2] bg-[#29b6f6] hover:bg-[#039be5] text-white font-bold text-sm py-3.5 px-4 rounded-xl transition-colors shadow-lg shadow-sky-500/20"
                                    >
                                        Access Dashboard
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </div>
    )
}
