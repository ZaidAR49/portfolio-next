"use client";

import { useState, useRef } from "react";
import { FaFileImport } from "react-icons/fa";
import { importDataAction } from "@/actions/import-action";
import { Toaster, toast } from "sonner";

export function ImportDataCard() {
    const [isImporting, setIsImporting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsImporting(true);

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const text = e.target?.result as string;
                const data = JSON.parse(text);

                await importDataAction(data);
                toast.success("Data imported successfully!");

                // Clear the input so the same file could be imported again if needed
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            } catch (error) {
                console.error("Failed to parse JSON or import data:", error);
                toast.error("Invalid file format or import error. Please try again with a valid export file.");
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            } finally {
                setIsImporting(false);
            }
        };

        reader.onerror = () => {
            console.error("Failed to read file.");
            toast.error("Failed to read the selected file.");
            setIsImporting(false);
        };

        reader.readAsText(file);
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="bg-[#121929] border border-slate-800/80 rounded-2xl p-8 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-all">
            <div className="mb-6">
                <FaFileImport className="text-blue-500 text-3xl" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Import User Data</h3>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed max-w-sm flex-1">
                Upload a previously exported JSON file to load your portfolio data into the dashboard.
            </p>

            <input
                type="file"
                accept=".json,application/json"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
            />

            <button
                onClick={handleUploadClick}
                disabled={isImporting}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg w-full max-w-[200px] transition-colors shadow-lg shadow-blue-600/20"
            >
                {isImporting ? "Uploading..." : "Upload Data"}
            </button>
            <Toaster richColors />
        </div>
    );
}
