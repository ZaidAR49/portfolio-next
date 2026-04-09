import { FaUsers, FaCode, FaProjectDiagram, FaBriefcase, FaFileExport, FaFileImport, FaSignOutAlt } from 'react-icons/fa';
import { getAnalysisAction } from '@/actions/analysis-action';
import { Suspense } from 'react';
import { Loading } from '@/components/loading';

export async function DashboardAnalysis() {
    const analysis = await getAnalysisAction();
    return (
        <div className="space-y-8">
            {/* Top Stats Cards */}
            <Suspense fallback={<Loading />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Card 1 */}
                    <div className="bg-[#121929] border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between shadow-lg hover:border-slate-700 transition-all">
                        <div className="flex flex-col gap-2 mb-6">
                            <FaUsers className="text-[#10b981] text-xl mb-1" />
                            <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">Total Portfolios</span>
                        </div>
                        <div>
                            <h3 className="text-4xl font-extrabold text-white mb-4">{analysis.usersCount}</h3>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-slate-300 h-full w-[25%] rounded-full"></div>
                            </div>
                        </div>
                    </div>
                    {/* Card 2 */}
                    <div className="bg-[#121929] border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between shadow-lg hover:border-slate-700 transition-all">
                        <div className="flex flex-col gap-2 mb-6">
                            <FaCode className="text-[#3b82f6] text-xl mb-1" />
                            <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">Total Skills</span>
                        </div>
                        <div>
                            <h3 className="text-4xl font-extrabold text-white mb-4">{analysis.skillsCount}</h3>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-slate-300 h-full w-[80%] rounded-full"></div>
                            </div>
                        </div>
                    </div>
                    {/* Card 3 */}
                    <div className="bg-[#121929] border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between shadow-lg hover:border-slate-700 transition-all">
                        <div className="flex flex-col gap-2 mb-6">
                            <FaProjectDiagram className="text-[#a855f7] text-xl mb-1" />
                            <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">Total Projects</span>
                        </div>
                        <div>
                            <h3 className="text-4xl font-extrabold text-white mb-4">{analysis.projectsCount}</h3>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-slate-300 h-full w-[45%] rounded-full"></div>
                            </div>
                        </div>
                    </div>
                    {/* Card 4 */}
                    <div className="bg-[#121929] border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between shadow-lg hover:border-slate-700 transition-all">
                        <div className="flex flex-col gap-2 mb-6">
                            <FaBriefcase className="text-[#ec4899] text-xl mb-1" />
                            <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">Total Experiences</span>
                        </div>
                        <div>
                            <h3 className="text-4xl font-extrabold text-white mb-4">{analysis.experiencesCount}</h3>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-slate-300 h-full w-[35%] rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </Suspense>
            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 pt-10">
                {/* Card 1 */}
                <div className="bg-[#121929] border border-slate-800/80 rounded-2xl p-8 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-all">
                    <div className="mb-6">
                        <FaFileExport className="text-[#0ea5e9] text-3xl" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Export User Data</h3>
                    <p className="text-slate-400 text-sm mb-8 leading-relaxed max-w-sm flex-1">
                        Download all your active portfolio data including skills, projects, and experiences in JSON format.
                    </p>
                    <button className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold py-3 px-8 rounded-lg w-full max-w-[200px] transition-colors shadow-lg shadow-sky-500/20">
                        Download Data
                    </button>
                </div>

                {/* Card 2 */}
                <div className="bg-[#121929] border border-slate-800/80 rounded-2xl p-8 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-all">
                    <div className="mb-6">
                        <FaFileImport className="text-blue-500 text-3xl" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Import User Data</h3>
                    <p className="text-slate-400 text-sm mb-8 leading-relaxed max-w-sm flex-1">
                        Upload a previously exported JSON file to load your portfolio data into the dashboard.
                    </p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg w-full max-w-[200px] transition-colors shadow-lg shadow-blue-600/20">
                        Upload Data
                    </button>
                </div>
                <div className="bg-[#121929] border border-slate-800/80 rounded-2xl p-8 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-all">
                    <div className="mb-6 bg-red-500/10 p-4 rounded-full">
                        <FaSignOutAlt className="text-red-500 text-2xl" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Sign Out</h3>
                    <p className="text-slate-400 text-sm mb-8 leading-relaxed max-w-sm flex-1">
                        Securely end your session and return to the login screen
                    </p>
                    <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg w-full max-w-[200px] transition-colors shadow-lg shadow-red-600/20">
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
}
