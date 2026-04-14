"use client";

import Lottie from "lottie-react";
import serverErrorAnimation from "../assets/lottie-server-error.json";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const Error = ({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) => {
    const router = useRouter();
    const lottieRef = useRef<any>(null);

    useEffect(() => {
        lottieRef.current?.setSpeed(1);
        // Log error to console or tracking service
        console.error(error);
    }, [error]);

    return (
        <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 -right-20 w-80 h-80 bg-red-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center max-w-5xl w-full mx-auto">
                <div className="flex flex-col-reverse lg:flex-row items-center justify-center gap-12 lg:gap-24 w-full">
                    
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="space-y-2">
                            <h1 className="text-8xl lg:text-9xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-400 dark:from-red-400 dark:to-orange-300 drop-shadow-sm">
                                500
                            </h1>
                            <div className="h-1.5 w-20 bg-red-500 rounded-full mx-auto lg:mx-0 shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
                                System Glitch
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-md leading-relaxed">
                                Something went wrong with our connection. Our team has been notified and we're working to fix it.
                            </p>
                        </div>

                        <div className="pt-4 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <button
                                onClick={() => reset()}
                                className="group relative px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-all duration-300 shadow-[0_10px_20px_-10px_rgba(220,38,38,0.4)] hover:shadow-[0_20px_40px_-10px_rgba(220,38,38,0.4)] active:scale-95 overflow-hidden"
                            >
                                <span className="relative z-10">Try to Reconnect</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                            </button>

                            <button
                                onClick={() => router.push("/")}
                                className="px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold rounded-2xl border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 active:scale-95"
                            >
                                Go to Home
                            </button>
                        </div>
                    </div>

                    <div className="relative group animate-in fade-in zoom-in duration-1000">
                        {/* Decorative Ring */}
                        <div className="absolute inset-0 rounded-full bg-red-500/10 blur-3xl group-hover:bg-red-500/20 transition-colors duration-500" />
                        
                        <div className="w-72 h-72 lg:w-[450px] lg:h-[450px] relative z-10 drop-shadow-2xl">
                            <Lottie
                                lottieRef={lottieRef}
                                animationData={serverErrorAnimation}
                                loop={true}
                                style={{ width: '100%', height: '100%' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Error;