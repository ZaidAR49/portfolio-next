
import {
    FaChartLine, FaUsers, FaBriefcase, FaCode, FaProjectDiagram,
    FaFileExport, FaFileImport, FaSignOutAlt
} from 'react-icons/fa';
import { getAnalysisAction } from '@/actions/analysis-action';

export const metadata = {
    title: 'Dashboard - Admin Panel',
};

export default async function DashboardPage() {
    const analysis = await getAnalysisAction();
    console.log("analysis", analysis);
    const navBar = () => (
        <nav className="mt-4 flex flex-col gap-1 px-3">
            <a href="#" className="flex items-center gap-4 px-4 py-3 text-[#0ea5e9] bg-[#0ea5e9]/10 rounded-xl relative group transition-all">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#0ea5e9] rounded-r-md shadow-[0_0_10px_#0ea5e9]"></div>
                <FaChartLine className="text-lg" />
                <span className="font-semibold text-sm">Analysis</span>
            </a>
            <a href="#" className="flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all group">
                <FaUsers className="text-lg group-hover:text-amber-400 transition-colors" />
                <span className="font-semibold text-sm">Portfolios</span>
            </a>
            <a href="#" className="flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all group">
                <FaBriefcase className="text-lg group-hover:text-pink-500 transition-colors" />
                <span className="font-semibold text-sm">Experience</span>
            </a>
            <a href="#" className="flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all group">
                <FaProjectDiagram className="text-lg group-hover:text-purple-500 transition-colors" />
                <span className="font-semibold text-sm">Projects</span>
            </a>
            <a href="#" className="flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all group">
                <FaCode className="text-lg group-hover:text-blue-400 transition-colors" />
                <span className="font-semibold text-sm">Skills</span>
            </a>
        </nav>
    )
    return (
        <div className="min-h-screen pt-[104px] flex relative bg-[#0b1120]">
            {/* Sidebar */}
            <aside className="w-64 border-r border-[#1e293b] hidden lg:block bg-[#0b1120]/50 sticky top-[104px] h-[calc(100vh-104px)] overflow-y-auto">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-white mb-1">Admin Panel</h2>
                    <p className="text-sm text-slate-400">Manage your portfolio</p>
                </div>

                {navBar()}
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-8 lg:p-10 w-full max-w-[1400px] mx-auto space-y-8">

                {/* Top Stats Cards */}
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
            </main>
        </div>
    );
}

