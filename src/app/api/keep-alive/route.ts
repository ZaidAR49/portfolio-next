import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Force dynamic rendering — this route must never be statically cached.
export const dynamic = "force-dynamic";

/**
 * GET /api/keep-alive
 *
 * Supabase Free-Tier Keep-Alive (2026 rules)
 * ------------------------------------------
 * Supabase now tracks *rolling 7-day volume* rather than a simple
 * "last-seen" timestamp. A single daily ping is flagged as low-activity
 * and can still trigger a pause warning. Each invocation of this handler
 * fires 7 sequential Supabase Data-API (PostgREST) requests so that even
 * on the Vercel Hobby plan (once-a-day cron) we stay well above the
 * 6–10 requests/day threshold.
 *
 * All requests go through @supabase/supabase-js so they hit the REST
 * gateway (counted by Supabase) instead of a raw TCP connection (which
 * is NOT counted).
 *
 * Security: protected by CRON_SECRET — supply it as the `Authorization:
 * Bearer <secret>` header. Vercel Cron injects this automatically when
 * the secret is set in the project environment. External schedulers
 * (cron-job.org, GitHub Actions, n8n) must add the header manually.
 */
export async function GET(req: NextRequest) {
    // ── 1. Auth check ────────────────────────────────────────────────────────
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ── 2. Supabase client (service-role, no session) ─────────────────────────
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return NextResponse.json(
            { ok: false, error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" },
            { status: 500 }
        );
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false },
    });

    // ── 3. Ping battery (7 Data-API requests) ────────────────────────────────
    //
    // We spread requests across multiple tables so the gateway registers
    // distinct queries rather than deduplicating identical ones.
    //
    // Tables used:   _keepalive (write + read + count)
    //                users      (read + count)
    //                projects   (read)
    //                skills     (count)
    //
    // Prerequisites (run once in Supabase SQL Editor — see SQL block below):
    //   CREATE TABLE IF NOT EXISTS public._keepalive (
    //     id INT PRIMARY KEY,
    //     last_ping TIMESTAMPTZ NOT NULL DEFAULT NOW()
    //   );
    //   INSERT INTO public._keepalive (id, last_ping) VALUES (1, NOW())
    //     ON CONFLICT (id) DO NOTHING;
    //   GRANT SELECT, INSERT, UPDATE ON TABLE public._keepalive TO service_role;

    const now = new Date().toISOString();
    const results: Record<string, unknown> = {};

    // Request 1 — write: upsert the heartbeat timestamp
    const { error: e1 } = await supabase
        .from("_keepalive")
        .upsert({ id: 1, last_ping: now });
    if (e1) return NextResponse.json({ ok: false, step: "upsert", error: e1.message }, { status: 500 });

    // Request 2 — read: confirm the row was written
    const { data: keepAliveRow, error: e2 } = await supabase
        .from("_keepalive")
        .select("id, last_ping")
        .eq("id", 1)
        .single();
    if (e2) return NextResponse.json({ ok: false, step: "select-keepalive", error: e2.message }, { status: 500 });
    results.lastPing = keepAliveRow?.last_ping;

    // Request 3 — count: exact row count on _keepalive
    const { count: keepAliveCount, error: e3 } = await supabase
        .from("_keepalive")
        .select("*", { count: "exact", head: true });
    if (e3) return NextResponse.json({ ok: false, step: "count-keepalive", error: e3.message }, { status: 500 });
    results.keepAliveCount = keepAliveCount;

    // Request 4 — read: fetch the active user row (lightweight)
    const { data: userRow, error: e4 } = await supabase
        .from("users")
        .select("id, name")
        .eq("is_active", true)
        .limit(1)
        .maybeSingle();
    if (e4) return NextResponse.json({ ok: false, step: "select-users", error: e4.message }, { status: 500 });
    results.activeUser = userRow?.name ?? null;

    // Request 5 — count: total user count
    const { count: usersCount, error: e5 } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true });
    if (e5) return NextResponse.json({ ok: false, step: "count-users", error: e5.message }, { status: 500 });
    results.usersCount = usersCount;

    // Request 6 — read: spot-check one project row
    const { data: projectRow, error: e6 } = await supabase
        .from("projects")
        .select("id, title")
        .limit(1)
        .maybeSingle();
    if (e6) return NextResponse.json({ ok: false, step: "select-projects", error: e6.message }, { status: 500 });
    results.sampleProject = projectRow?.title ?? null;

    // Request 7 — count: total skills count
    const { count: skillsCount, error: e7 } = await supabase
        .from("skills")
        .select("*", { count: "exact", head: true });
    if (e7) return NextResponse.json({ ok: false, step: "count-skills", error: e7.message }, { status: 500 });
    results.skillsCount = skillsCount;

    // ── 4. Response ───────────────────────────────────────────────────────────
    return NextResponse.json({
        ok: true,
        pingsSent: 7,
        firedAt: now,
        ...results,
    });
}
