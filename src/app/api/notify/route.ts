import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { rateLimit, ipFromHeaders } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";
import { sendWaitlistEmail, sendSignupAlert } from "@/lib/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const ip = ipFromHeaders(req.headers);
    const rl = rateLimit(ip, { limit: 10, windowMs: 60_000 });
    if (!rl.ok) {
      const retryAfter = Math.ceil((rl.retryAfterMs ?? 60_000) / 1000);
      return NextResponse.json(
        { error: "rate_limited" },
        { status: 429, headers: { "Retry-After": String(retryAfter) } },
      );
    }

    const body = (await req.json()) as {
      email?: string;
      website?: string; // honeypot
      turnstileToken?: string;
    };

    // Honeypot: bots fill the hidden "website" field. Pretend success.
    if (body.website) return NextResponse.json({ ok: true });

    const email = (body.email ?? "").trim().toLowerCase();
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "invalid_email" }, { status: 400 });
    }

    // Turnstile: enforced in prod when TURNSTILE_SECRET_KEY is set. verifyTurnstile
    // skips in dev / when the secret is unset, so the form keeps working until keys
    // are added - then a valid token becomes mandatory and bots are rejected.
    const ts = await verifyTurnstile(body.turnstileToken, ip);
    if (!ts.ok) {
      return NextResponse.json({ error: "bot_check_failed" }, { status: 403 });
    }

    const { error } = await supabaseAdmin
      .from("notify_list")
      .insert({ email, source: "coming-soon" });

    if (error) {
      // 23505 = unique violation -> already subscribed, treat as success (no resend).
      if (error.code === "23505") {
        return NextResponse.json({ ok: true, already: true });
      }
      console.error("[notify]", error.message);
      return NextResponse.json({ error: "save_failed" }, { status: 500 });
    }

    // Fire-and-forget emails - don't fail the signup if a send bounces.
    try {
      await sendWaitlistEmail(email);
    } catch (e) {
      console.error("[notify] email send failed", e instanceof Error ? e.message : e);
    }
    try {
      await sendSignupAlert(email);
    } catch (e) {
      console.error("[notify] alert send failed", e instanceof Error ? e.message : e);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[notify]", message);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
