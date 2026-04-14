import { FaUsers, FaCode, FaProjectDiagram, FaBriefcase } from 'react-icons/fa';
import { getAnalysisAction } from '@/actions/analysis-action';
import { Suspense } from 'react';
import { Loading } from '@/components/loading';
import { ExportDataCard } from '@/components/dashboard/export-data-card';
import { ImportDataCard } from '@/components/dashboard/import-data-card';
import SignOutCard from '@/components/dashboard/signout-card';
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
                <ExportDataCard />

                {/* Card 2 */}
                <ImportDataCard />
                {/* Card 3 */}
                <SignOutCard />
            </div>
        </div>
    );
}
