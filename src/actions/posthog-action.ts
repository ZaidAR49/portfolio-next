"use server";

import { cookies } from "next/headers";
import { checkAuth } from "@/lib/auth";
import { queryPostHog } from "@/lib/posthog-api";

// ─── Shared auth guard ────────────────────────────────────────────────────────

/**
 * Verifies that the caller holds a valid dashboard JWT.
 * Call this at the top of every exported action.
 */
async function requireAuth(): Promise<void> {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_code")?.value;

    if (!token) {
        throw new Error("Unauthorized");
    }

    const valid = await checkAuth(token);
    if (!valid) {
        throw new Error("Unauthorized");
    }
}

// ─── Return types ─────────────────────────────────────────────────────────────

export interface UniqueUsersResult {
    count: number;
}

export interface TotalPageviewsResult {
    count: number;
}

export interface EngagementResult {
    cvDownloads: number;
    linkedinViews: number;
}

export interface CountryBreakdownItem {
    country: string;
    visitors: number;
}

export interface ErrorRatesResult {
    totalErrors: number;
    errorRate: number; // errors per 100 pageviews (%)
}

export interface PostHogAnalyticsResult {
    uniqueUsers: UniqueUsersResult;
    totalPageviews: TotalPageviewsResult;
    engagement: EngagementResult;
    countryBreakdown: CountryBreakdownItem[];
    errorRates: ErrorRatesResult;
}

// ─── Individual query actions ─────────────────────────────────────────────────

/**
 * Returns the number of unique visitors (distinct persons) recorded in
 * PostHog over the last 30 days.
 */
export async function getUniqueUsersAction(): Promise<UniqueUsersResult> {
    await requireAuth();

    const rows = await queryPostHog<[number]>(`
        SELECT count(DISTINCT person_id) AS unique_users
        FROM events
        WHERE timestamp >= now() - INTERVAL 30 DAY
    `);

    return { count: Number(rows[0]?.[0] ?? 0) };
}

/**
 * Returns the total number of $pageview events over the last 30 days.
 */
export async function getTotalPageviewsAction(): Promise<TotalPageviewsResult> {
    await requireAuth();

    const rows = await queryPostHog<[number]>(`
        SELECT count() AS total_pageviews
        FROM events
        WHERE event = '$pageview'
          AND timestamp >= now() - INTERVAL 30 DAY
    `);

    return { count: Number(rows[0]?.[0] ?? 0) };
}

/**
 * Returns engagement counts:
 *  - CV downloads  (event: "resume_downloaded")
 *  - LinkedIn views (event: "linkedin_profile_viewed")
 *
 * Both metrics are fetched in a single query using conditional aggregation.
 */
export async function getEngagementAction(): Promise<EngagementResult> {
    await requireAuth();

    const rows = await queryPostHog<[number, number]>(`
        SELECT
            countIf(event = 'resume_downloaded')      AS cv_downloads,
            countIf(event = 'linkedin_profile_viewed') AS linkedin_views
        FROM events
        WHERE event IN ('resume_downloaded', 'linkedin_profile_viewed')
          AND timestamp >= now() - INTERVAL 30 DAY
    `);

    return {
        cvDownloads: Number(rows[0]?.[0] ?? 0),
        linkedinViews: Number(rows[0]?.[1] ?? 0),
    };
}

/**
 * Returns a ranked list of countries from which visitors arrived over the
 * last 30 days, ordered by visitor count descending.
 *
 * PostHog stores the country as the person property "$geoip_country_name"
 * or, on the event, as "$geoip_country_name".
 */
export async function getCountryBreakdownAction(): Promise<CountryBreakdownItem[]> {
    await requireAuth();

    const rows = await queryPostHog<[string, number]>(`
        SELECT
            properties.$geoip_country_name AS country,
            count(DISTINCT person_id)       AS visitors
        FROM events
        WHERE event = '$pageview'
          AND timestamp >= now() - INTERVAL 30 DAY
          AND properties.$geoip_country_name IS NOT NULL
          AND properties.$geoip_country_name != ''
        GROUP BY country
        ORDER BY visitors DESC
        LIMIT 20
    `);

    return rows.map(([country, visitors]) => ({
        country: String(country ?? "Unknown"),
        visitors: Number(visitors ?? 0),
    }));
}

/**
 * Returns the total number of captured exceptions and the error rate
 * expressed as errors per 100 pageviews.
 *
 * PostHog captures exceptions via `posthog.captureException(...)`, which
 * emits a "$exception" event.
 */
export async function getErrorRatesAction(): Promise<ErrorRatesResult> {
    await requireAuth();

    const rows = await queryPostHog<[number, number]>(`
        SELECT
            countIf(event = '$exception')  AS total_errors,
            countIf(event = '$pageview')   AS total_pageviews
        FROM events
        WHERE event IN ('$exception', '$pageview')
          AND timestamp >= now() - INTERVAL 30 DAY
    `);

    const totalErrors = Number(rows[0]?.[0] ?? 0);
    const totalPageviews = Number(rows[0]?.[1] ?? 0);
    const errorRate =
        totalPageviews > 0
            ? parseFloat(((totalErrors / totalPageviews) * 100).toFixed(2))
            : 0;

    return { totalErrors, errorRate };
}

// ─── Aggregate action (all metrics in parallel) ───────────────────────────────

/**
 * Fetches all PostHog analytics metrics in parallel and returns them as a
 * single typed object.  Prefer this over calling individual actions
 * separately when you need everything at once (e.g. on the dashboard page).
 */
export async function getAllPostHogAnalyticsAction(): Promise<PostHogAnalyticsResult> {
    await requireAuth();

    const [uniqueUsers, totalPageviews, engagement, countryBreakdown, errorRates] =
        await Promise.all([
            getUniqueUsersAction(),
            getTotalPageviewsAction(),
            getEngagementAction(),
            getCountryBreakdownAction(),
            getErrorRatesAction(),
        ]);

    return {
        uniqueUsers,
        totalPageviews,
        engagement,
        countryBreakdown,
        errorRates,
    };
}
