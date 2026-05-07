import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// Daily Vercel cron ping. Prevents Supabase free-tier auto-pause (~7-day idle).
// Auth: Vercel cron sets Authorization: Bearer ${CRON_SECRET} automatically.

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 });
  }
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const { error } = await supabaseAdmin.from("products").select("id").limit(1);
    if (error) {
      console.error("[cron/keep-alive] supabase error", error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, ts: new Date().toISOString() });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[cron/keep-alive]", message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
