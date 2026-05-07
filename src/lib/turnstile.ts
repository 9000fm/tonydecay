/* Cloudflare Turnstile server-side verification. Skips silently when the
   secret env var is missing so the site stays usable before the env is
   configured on Vercel. */

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(token: string | undefined, remoteIp?: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return { ok: true, skipped: true as const };
  // Dev escape: ALWAYS skip in dev. Local site key may differ from the
  // server secret (or not be set), and we don't want the bot check
  // blocking checkout testing. Production still enforces normally.
  if (process.env.NODE_ENV !== "production") {
    return { ok: true, skipped: true as const };
  }
  if (!token) return { ok: false, reason: "missing_token" as const };

  const body = new URLSearchParams();
  body.append("secret", secret);
  body.append("response", token);
  if (remoteIp) body.append("remoteip", remoteIp);

  try {
    const r = await fetch(VERIFY_URL, { method: "POST", body });
    const j = (await r.json()) as { success: boolean; "error-codes"?: string[] };
    if (!j.success) return { ok: false, reason: "verify_failed" as const, codes: j["error-codes"] };
    return { ok: true, skipped: false as const };
  } catch {
    return { ok: false, reason: "verify_threw" as const };
  }
}
