"use client";
import { useState, useRef, useEffect } from "react";
import { FaFileImport } from "react-icons/fa";
import { importDataAction } from "@/actions/import-action";
import { Toaster, toast } from "sonner";
import { getPortfolioNamesAction } from "@/actions/user-action";

export function ImportDataCard() {
    const [portfolioNames, setPortfolioNames] = useState<string[]>([]);
    const [isImporting, setIsImporting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        getPortfolioNamesAction().then((res) => {
            const names = res.map((item: { portfolio_name: string }) => item.portfolio_name);
            console.log("Portfolio Names -->: ", names);
            setPortfolioNames(names);
        });
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsImporting(true);

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const text = e.target?.result as string;
                const data = JSON.parse(text);
                console.log("Portfolio Name -->: ", data.user.portfolio_name);
                if (portfolioNames.includes(data.user.portfolio_name)) {
                    data.user.portfolio_name = data.user.portfolio_name + "_imported";
                }

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
        <div className="bg-surface border border-border rounded-2xl p-8 flex flex-col items-center text-center shadow-md hover:shadow-lg hover:-translate-y-1 hover:border-border-hover transition-all duration-normal">
            <div className="mb-6">
                <FaFileImport className="text-primary text-3xl" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Import User Data</h3>
            <p className="text-muted text-sm mb-8 leading-relaxed max-w-sm flex-1">
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
                className="bg-primary hover:bg-primary-hover disabled:bg-muted disabled:cursor-not-allowed text-inverse font-bold py-3 px-8 rounded-lg w-full max-w-[200px] transition-colors shadow-lg"
            >
                {isImporting ? "Uploading..." : "Upload Data"}
            </button>
            <Toaster richColors />
        </div>
    );
}
