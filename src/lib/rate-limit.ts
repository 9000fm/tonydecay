/* In-memory per-IP rate limiter. Tiny belt-and-braces guard for checkout
   endpoints — keeps abusive bots off Supabase RPC and PayPal calls.

   Not a substitute for proper bot guard (Turnstile does that). Survives
   only as long as the serverless instance lives, which on Vercel is good
   enough to slow down a single attacker but won't catch coordinated waves. */

const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  ip: string,
  { limit = 6, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {},
) {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || b.resetAt < now) {
    buckets.set(ip, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }
  if (b.count >= limit) {
    return { ok: false, remaining: 0, retryAfterMs: b.resetAt - now };
  }
  b.count += 1;
  return { ok: true, remaining: limit - b.count };
}

export function ipFromHeaders(h: Headers): string {
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return h.get("x-real-ip") ?? "0.0.0.0";
}
