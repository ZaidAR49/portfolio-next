"use client";

import { useEffect } from "react";
import { FaExclamationTriangle } from "react-icons/fa";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isDestructive = true,
}: ConfirmModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div 
                className="bg-[#121929] border border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200"
                role="dialog"
                aria-modal="true"
            >
                <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-full ${isDestructive ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                        <FaExclamationTriangle className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white">{title}</h2>
                </div>
                <p className="text-slate-400 mb-6 text-sm leading-relaxed">
                    {description}
                </p>
                <div className="flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-colors font-medium text-sm"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 rounded-full font-bold text-[#0f172a] transition-all shadow-lg text-sm ${
                            isDestructive 
                                ? 'bg-red-400 hover:bg-red-500 shadow-red-500/20' 
                                : 'bg-[#38bdf8] hover:bg-[#0ea5e9] shadow-sky-500/20'
                        }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
