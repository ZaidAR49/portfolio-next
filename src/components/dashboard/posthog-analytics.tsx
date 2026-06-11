import { getAllPostHogAnalyticsAction } from "@/actions/posthog-action";
import type {
    CountryBreakdownItem,
    EngagementResult,
} from "@/actions/posthog-action";
import { Suspense } from "react";
import {
    FiUsers,
    FiEye,
    FiDownload,
    FiLinkedin,
    FiAlertTriangle,
} from "react-icons/fi";
import { PostHogChartsClient } from "./posthog-charts-client";

// ─── Skeleton ────────────────────────────────────────────────────────────────

export function PostHogAnalyticsSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Stat cards row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className="bg-surface border border-border rounded-2xl p-6 h-36"
                    />
                ))}
            </div>
            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="bg-surface border border-border rounded-2xl p-6 h-72 lg:col-span-2" />
                <div className="bg-surface border border-border rounded-2xl p-6 h-72" />
            </div>
        </div>
    );
}

// ─── Individual stat card ────────────────────────────────────────────────────

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    sub?: string;
    accent: string;
    barWidth: string; // e.g. "72%"
}

function StatCard({ icon, label, value, sub, accent, barWidth }: StatCardProps) {
    return (
        <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col justify-between shadow-md hover:shadow-lg hover:-translate-y-1 hover:border-border-hover transition-all duration-300">
            <div className="flex flex-col gap-2 mb-4">
                <span style={{ color: accent }} className="text-xl">
                    {icon}
                </span>
                <span className="text-xs font-bold tracking-wider text-muted uppercase">
                    {label}
                </span>
            </div>
            <div>
                <p
                    className="text-4xl font-extrabold mb-1"
                    style={{ color: "var(--text)", WebkitTextFillColor: "var(--text)", backgroundImage: "none" }}
                >
                    {value}
                </p>
                {sub && (
                    <p className="text-xs text-muted mb-3">{sub}</p>
                )}
                <div className="w-full bg-elevated h-1.5 rounded-full overflow-hidden mt-3">
                    <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: barWidth, backgroundColor: accent }}
                    />
                </div>
            </div>
        </div>
    );
}

// ─── Async server data component ─────────────────────────────────────────────

async function PostHogAnalyticsData() {
    const data = await getAllPostHogAnalyticsAction();

    const { uniqueUsers, totalPageviews, engagement, countryBreakdown, errorRates } = data;

    // Derive bar widths relative to the largest stat (capped at 100%)
    const maxCount = Math.max(
        uniqueUsers.count,
        totalPageviews.count,
        engagement.cvDownloads,
        engagement.linkedinViews,
        1, // prevent division by zero
    );
    const pct = (n: number) => `${Math.min(100, Math.round((n / maxCount) * 100))}%`;

    const errorBarWidth = errorRates.errorRate > 0
        ? `${Math.min(100, Math.round(errorRates.errorRate * 10))}%`
        : "0%";

    return (
        <div className="space-y-6">
            {/* ── Stat cards row ─────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard
                    icon={<FiUsers />}
                    label="Unique Visitors"
                    value={uniqueUsers.count.toLocaleString()}
                    accent="#0ea5e9"
                    barWidth={pct(uniqueUsers.count)}
                />
                <StatCard
                    icon={<FiEye />}
                    label="Total Pageviews"
                    value={totalPageviews.count.toLocaleString()}
                    accent="#6366f1"
                    barWidth={pct(totalPageviews.count)}
                />
                <StatCard
                    icon={<FiDownload />}
                    label="CV Downloads"
                    value={engagement.cvDownloads.toLocaleString()}
                    accent="#10b981"
                    barWidth={pct(engagement.cvDownloads)}
                />
                <StatCard
                    icon={<FiLinkedin />}
                    label="LinkedIn Views"
                    value={engagement.linkedinViews.toLocaleString()}
                    accent="#0a66c2"
                    barWidth={pct(engagement.linkedinViews)}
                />
                <StatCard
                    icon={<FiAlertTriangle />}
                    label="Error Rate"
                    value={`${errorRates.errorRate}%`}
                    sub={`${errorRates.totalErrors.toLocaleString()} total errors`}
                    accent={errorRates.errorRate > 1 ? "#ef4444" : "#94a3b8"}
                    barWidth={errorBarWidth}
                />
            </div>

            {/* ── Charts row ─────────────────────────────────────────── */}
            <PostHogChartsClient
                countryData={countryBreakdown}
                engagement={engagement}
            />
        </div>
    );
}

// ─── Public export (with Suspense boundary) ──────────────────────────────────

export async function PostHogAnalytics() {
    return (
        <div className="space-y-4">
            {/* Section heading */}
            <div className="flex items-center gap-3 mb-2">
                <div className="w-1 h-6 rounded-full bg-primary" />
                <h2
                    className="text-base font-bold tracking-wide"
                    style={{ color: "var(--text)", WebkitTextFillColor: "var(--text)", backgroundImage: "none" }}
                >
                    Live Analytics
                </h2>
                <span className="ml-auto text-xs text-muted font-medium">Last 30 days · PostHog</span>
            </div>
            <Suspense fallback={<PostHogAnalyticsSkeleton />}>
                <PostHogAnalyticsData />
            </Suspense>
        </div>
    );
}
