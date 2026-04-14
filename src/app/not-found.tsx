"use client";

import Lottie from "lottie-react";
import notFoundErrorAnimation from "../assets/lottie-notFound-error.json";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// For not-found.tsx, we don't receive error or reset props
const NotFound = () => {
    const router = useRouter();
    const lottieRef = useRef<any>(null);

    useEffect(() => {
        lottieRef.current?.setSpeed(1);
    }, []);

    return (
        <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center max-w-5xl w-full mx-auto">
                <div className="flex flex-col-reverse lg:flex-row items-center justify-center gap-12 lg:gap-24 w-full">
                    
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="space-y-2">
                            <h1 className="text-8xl lg:text-9xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-sky-400 dark:from-blue-400 dark:to-sky-300 drop-shadow-sm">
                                404
                            </h1>
                            <div className="h-1.5 w-20 bg-blue-500 rounded-full mx-auto lg:mx-0 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
                                Lost in Space?
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-md leading-relaxed">
                                The page you're looking for has drifted out of orbit. Let's get you back to familiar territory.
                            </p>
                        </div>

                        <div className="pt-4 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <button
                                onClick={() => router.push("/")}
                                className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all duration-300 shadow-[0_10px_20px_-10px_rgba(37,99,235,0.4)] hover:shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] active:scale-95 overflow-hidden"
                            >
                                <span className="relative z-10">Back to Mission Control</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-white/20 to-blue-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                            </button>
                        </div>
                    </div>

                    <div className="relative group animate-in fade-in zoom-in duration-1000">
                        {/* Decorative Ring */}
                        <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-3xl group-hover:bg-blue-500/30 transition-colors duration-500" />
                        
                        <div className="w-72 h-72 lg:w-[450px] lg:h-[450px] relative z-10 drop-shadow-2xl">
                            <Lottie
                                lottieRef={lottieRef}
                                animationData={notFoundErrorAnimation}
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

export default NotFound;