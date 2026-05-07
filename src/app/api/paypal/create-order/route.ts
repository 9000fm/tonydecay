import { NextRequest, NextResponse } from "next/server";
import { createPayPalOrder } from "@/lib/paypal";
import { PRICE_USD } from "@/lib/constants";
import { rateLimit, ipFromHeaders } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const rl = rateLimit(ipFromHeaders(req.headers), { limit: 30, windowMs: 60_000 });
    if (!rl.ok) {
      const retryAfter = Math.ceil((rl.retryAfterMs ?? 60_000) / 1000);
      return NextResponse.json(
        { error: "rate_limited" },
        { status: 429, headers: { "Retry-After": String(retryAfter) } },
      );
    }
    const id = await createPayPalOrder(PRICE_USD);
    return NextResponse.json({ id });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[paypal/create-order]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
