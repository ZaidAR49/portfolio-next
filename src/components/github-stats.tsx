"use client";

import { motion } from "framer-motion";
import { FiFolder, FiStar, FiGitBranch, FiCode } from "react-icons/fi";
import { GitHubStatsData } from "@/lib/services/github-service";

interface GitHubStatsProps {
  stats: GitHubStatsData | null;
}

// Color palette mapping for common programming languages
const LANGUAGE_COLORS: Record<string, { bg: string; dot: string }> = {
  TypeScript: { bg: "bg-sky-500", dot: "bg-sky-400" },
  JavaScript: { bg: "bg-amber-400", dot: "bg-amber-400" },
  Python: { bg: "bg-emerald-500", dot: "bg-emerald-400" },
  HTML: { bg: "bg-orange-500", dot: "bg-orange-400" },
  CSS: { bg: "bg-indigo-500", dot: "bg-indigo-400" },
  SCSS: { bg: "bg-pink-500", dot: "bg-pink-400" },
  PHP: { bg: "bg-purple-500", dot: "bg-purple-400" },
  "C#": { bg: "bg-green-500", dot: "bg-green-400" },
  Java: { bg: "bg-rose-500", dot: "bg-rose-400" },
  Go: { bg: "bg-cyan-500", dot: "bg-cyan-400" },
  Rust: { bg: "bg-orange-600", dot: "bg-orange-500" },
  Shell: { bg: "bg-teal-500", dot: "bg-teal-400" },
};

const DEFAULT_COLOR = { bg: "bg-primary", dot: "bg-primary" };

export function GitHubStatsSection({ stats }: GitHubStatsProps) {
  if (!stats) return null;

  const topLanguages = stats.topLanguages.slice(0, 6);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="w-full max-w-4xl mx-auto mb-16"
    >
      {/* Bento box container matching the portfolio metadata style */}
      <div className="relative bg-surface/50 border border-border backdrop-blur-md rounded-[2rem] p-6 md:p-8 shadow-sm hover:border-primary/30 transition-all duration-300">
        {/* Top: 3 Key Metrics */}
        <div className="grid grid-cols-3 divide-x divide-border/60 pb-6 border-b border-border/60 text-center">
          <div className="flex flex-col items-center gap-1.5 px-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] md:text-xs text-muted font-bold uppercase tracking-widest">
              <FiFolder className="w-3.5 h-3.5 text-primary" />
              Public Repos
            </span>
            <span className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
              {stats.publicRepos}
            </span>
          </div>

          <div className="flex flex-col items-center gap-1.5 px-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] md:text-xs text-muted font-bold uppercase tracking-widest">
              <FiStar className="w-3.5 h-3.5 text-amber-400" />
              Stars Earned
            </span>
            <span className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
              {stats.totalStars}
            </span>
          </div>

          <div className="flex flex-col items-center gap-1.5 px-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] md:text-xs text-muted font-bold uppercase tracking-widest">
              <FiGitBranch className="w-3.5 h-3.5 text-purple-400" />
              Total Forks
            </span>
            <span className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
              {stats.totalForks}
            </span>
          </div>
        </div>

        {/* Bottom: Language Distribution */}
        {topLanguages.length > 0 && (
          <div className="pt-6">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 text-[10px] md:text-xs text-muted font-bold uppercase tracking-widest">
                <FiCode className="w-3.5 h-3.5 text-primary" />
                Language Breakdown
              </span>
            </div>

            {/* Clean Progress Bar */}
            <div className="h-2.5 w-full rounded-full flex overflow-hidden bg-black/5 dark:bg-white/5 border border-border/50 p-0.5 shadow-inner mb-4">
              {topLanguages.map((lang) => {
                const colorConfig = LANGUAGE_COLORS[lang.name] || DEFAULT_COLOR;
                return (
                  <div
                    key={lang.name}
                    style={{ width: `${Math.max(lang.percent, 3)}%` }}
                    className={`${colorConfig.bg} h-full first:rounded-l-full last:rounded-r-full transition-all duration-300`}
                    title={`${lang.name}: ${lang.percent}%`}
                  />
                );
              })}
            </div>

            {/* Language Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
              {topLanguages.map((lang) => {
                const colorConfig = LANGUAGE_COLORS[lang.name] || DEFAULT_COLOR;
                return (
                  <div
                    key={lang.name}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface/60 border border-border text-xs text-foreground font-medium"
                  >
                    <span className={`w-2 h-2 rounded-full ${colorConfig.dot}`} />
                    <span>{lang.name}</span>
                    <span className="text-[11px] text-muted font-mono">{lang.percent}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
