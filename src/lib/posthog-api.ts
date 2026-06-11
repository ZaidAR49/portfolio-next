/**
 * PostHog REST API helper.
 *
 * All analytics queries in this project funnel through a single HTTP call to
 * PostHog's HogQL Query endpoint.  Each query is just a different SQL string;
 * the transport layer is shared and reused.
 *
 * Endpoint: POST /api/projects/:projectId/query
 * Docs: https://posthog.com/docs/api/query
 */



/** Shape returned by the PostHog HogQL query endpoint. */
interface PostHogQueryResponse<TRow = unknown[]> {
    results: TRow[];
    columns?: string[];
    error?: string;
}

/**
 * Execute a HogQL SELECT query against PostHog and return the raw results.
 *
 * @param query  A valid HogQL (SQL-like) SELECT statement.
 * @returns      An array of result rows.  Each row is an array whose elements
 *               correspond to the selected columns in order.
 *
 * @throws       Re-throws network errors or PostHog API errors with a
 *               descriptive message so callers can handle them uniformly.
 */
export async function queryPostHog<TRow = unknown[]>(
    query: string
): Promise<TRow[]> {
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
    const projectId = process.env.POSTHOG_PROJECT_ID;
    const apiKey = process.env.Personal_API;

    if (!host || !projectId || !apiKey) {
        throw new Error(
            "Missing PostHog environment variables: NEXT_PUBLIC_POSTHOG_HOST, POSTHOG_PROJECT_ID, Personal_API"
        );
    }

    const url = `${host}/api/projects/${projectId}/query`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            query: {
                kind: "HogQLQuery",
                query,
            },
        }),
        // Disable Next.js caching so analytics data is always fresh.
        cache: "no-store",
    });

    if (!response.ok) {
        const errorText = await response.text().catch(() => response.statusText);
        throw new Error(
            `PostHog query failed (HTTP ${response.status}): ${errorText}`
        );
    }

    const data: PostHogQueryResponse<TRow> = await response.json();

    if (data.error) {
        throw new Error(`PostHog query error: ${data.error}`);
    }

    return data.results;
}
