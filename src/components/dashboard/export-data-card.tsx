"use client";

import { useState } from "react";
import { FaFileExport } from "react-icons/fa";
import { getExportDataAction } from "@/actions/export-action";

export function ExportDataCard() {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        try {
            setIsExporting(true);
            const data = await getExportDataAction();
            
            const jsonString = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonString], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement("a");
            a.href = url;
            a.download = `portfolio-data-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Export failed:", error);
            alert("Failed to export data. Please try again.");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="bg-[#121929] border border-slate-800/80 rounded-2xl p-8 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-all">
            <div className="mb-6">
                <FaFileExport className="text-[#0ea5e9] text-3xl" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Export User Data</h3>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed max-w-sm flex-1">
                Download all your active portfolio data including skills, projects, and experiences in JSON format.
            </p>
            <button 
                onClick={handleExport}
                disabled={isExporting}
                className="bg-[#0ea5e9] hover:bg-[#0284c7] disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg w-full max-w-[200px] transition-colors shadow-lg shadow-sky-500/20"
            >
                {isExporting ? "Exporting..." : "Download Data"}
            </button>
        </div>
    );
}
