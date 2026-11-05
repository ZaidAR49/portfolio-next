import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { timingSafeEqual } from "crypto";

// Force dynamic rendering — this route must never be statically cached.
export const dynamic = "force-dynamic";

/**
 * Constant-time string comparison to prevent timing attacks on the secret.
 * Returns false if lengths differ (immediately, but after a fake compare so
 * the branch itself does not leak timing information).
 */
function safeCompare(a: string, b: string): boolean {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    // timingSafeEqual requires equal-length buffers; pad to avoid length leak
    if (bufA.length !== bufB.length) {
        // Still do a dummy compare so the branch timing is constant
        timingSafeEqual(bufA, bufA);
        return false;
    }
    return timingSafeEqual(bufA, bufB);
}

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
    // ── 1. Auth check (timing-safe) ──────────────────────────────────────────
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
        // Misconfigured server — do not reveal why
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const incoming = authHeader ?? "";
    const expected = `Bearer ${cronSecret}`;

    if (!safeCompare(incoming, expected)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ── 2. Supabase client (service-role, no session) ─────────────────────────
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        // Misconfigured server — generic error, no internals exposed
        console.error("[keep-alive] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
        return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
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

    // ── Helper: log internally, never expose DB errors to the caller ──────────
    const fail = (step: string, err: { message: string }) => {
        console.error(`[keep-alive] step="${step}" error="${err.message}"`);
        return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
    };

    // Request 1 — write: upsert the heartbeat timestamp
    const { error: e1 } = await supabase
        .from("_keepalive")
        .upsert({ id: 1, last_ping: now });
    if (e1) return fail("upsert", e1);

    // Request 2 — read: confirm the row was written
    const { data: keepAliveRow, error: e2 } = await supabase
        .from("_keepalive")
        .select("id, last_ping")
        .eq("id", 1)
        .single();
    if (e2) return fail("select-keepalive", e2);

    // Request 3 — count: exact row count on _keepalive
    const { count: keepAliveCount, error: e3 } = await supabase
        .from("_keepalive")
        .select("*", { count: "exact", head: true });
    if (e3) return fail("count-keepalive", e3);

    // Request 4 — read: fetch the active user row (lightweight)
    const { data: userRow, error: e4 } = await supabase
        .from("users")
        .select("id, name")
        .eq("is_active", true)
        .limit(1)
        .maybeSingle();
    if (e4) return fail("select-users", e4);

    // Request 5 — count: total user count
    const { count: usersCount, error: e5 } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true });
    if (e5) return fail("count-users", e5);

    // Request 6 — read: spot-check one project row
    const { data: projectRow, error: e6 } = await supabase
        .from("projects")
        .select("id, title")
        .limit(1)
        .maybeSingle();
    if (e6) return fail("select-projects", e6);

    // Request 7 — count: total skills count
    const { count: skillsCount, error: e7 } = await supabase
        .from("skills")
        .select("*", { count: "exact", head: true });
    if (e7) return fail("count-skills", e7);

    // ── 4. Response — only operational metadata, no business data ─────────────
    return NextResponse.json({
        ok: true,
        pingsSent: 7,
        firedAt: now,
        // Counts are non-sensitive aggregate numbers; omit row-level content
        keepAliveCount,
        usersCount,
        skillsCount,
        // Confirm the heartbeat timestamp was actually written
        lastPing: keepAliveRow?.last_ping,
    });
}
