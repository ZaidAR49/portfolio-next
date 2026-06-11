import { NextRequest, NextResponse } from "next/server";
import { getUsersCount } from '@/lib/services/user-service';

export async function GET(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await getUsersCount();
    return NextResponse.json({ message: "ok" }, { status: 200 });
}