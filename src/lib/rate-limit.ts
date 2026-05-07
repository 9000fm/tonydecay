// Soft per-IP guard. Real bot defense is Turnstile + PayPal anti-fraud.
// In-memory state survives only as long as a Vercel serverless instance lives,
// so attackers rotating across cold starts bypass it. Useful as a backstop for
// a single user hammering one warm instance.

const buckets = new Map<string, { count: number; resetAt: number }>();
const CLEANUP_THRESHOLD = 500;

export function rateLimit(
  ip: string,
  { limit = 20, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {},
) {
  if (process.env.NODE_ENV !== "production") {
    return { ok: true, remaining: limit };
  }

  const now = Date.now();

  if (buckets.size > CLEANUP_THRESHOLD) {
    for (const [key, b] of buckets) {
      if (b.resetAt < now) buckets.delete(key);
    }
  }

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
  const cf = h.get("cf-connecting-ip");
  if (cf) return cf.trim();
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return h.get("x-real-ip")?.trim() ?? "anon";
}
