import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { ShippingInfo } from "@/lib/types";
import { rateLimit, ipFromHeaders } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";

export async function POST(req: NextRequest) {
  try {
    const ip = ipFromHeaders(req.headers);
    const rl = rateLimit(ip, { limit: 20, windowMs: 60_000 });
    if (!rl.ok) {
      const retryAfter = Math.ceil((rl.retryAfterMs ?? 60_000) / 1000);
      return NextResponse.json(
        { error: "rate_limited" },
        { status: 429, headers: { "Retry-After": String(retryAfter) } },
      );
    }

    const body = (await req.json()) as {
      shipping: ShippingInfo;
      paymentMethod?: "paypal" | "yape";
      productSlug?: string;
      turnstileToken?: string;
    };
    const { shipping, paymentMethod = "paypal", productSlug = "vol-01", turnstileToken } = body;

    const ts = await verifyTurnstile(turnstileToken, ip);
    if (!ts.ok) {
      return NextResponse.json({ error: "bot_check_failed" }, { status: 403 });
    }

    if (!shipping?.email || !shipping?.fullName) {
      return NextResponse.json({ error: "shipping incomplete" }, { status: 400 });
    }

    const result = await callCreateOrderWithRetry({
      productSlug,
      shipping,
      paymentMethod,
    });

    if (result.kind === "fetch_failed") {
      return NextResponse.json(
        { error: "couldn't reach our order service - try again in a moment" },
        { status: 503 },
      );
    }
    if (result.kind === "rpc_error") {
      console.error("[orders/create] RPC error", result.message);
      return NextResponse.json({ error: result.message }, { status: 500 });
    }
    if (result.kind === "business_error") {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }

    return NextResponse.json({
      orderId: result.data.order_id,
      orderNumber: result.data.order_number,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[orders/create]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

type CreateOrderArgs = {
  productSlug: string;
  shipping: ShippingInfo;
  paymentMethod: string;
};

type CreateOrderResult =
  | { kind: "ok"; data: { order_id: string; order_number: string } }
  | { kind: "rpc_error"; message: string }
  | { kind: "business_error"; error: string }
  | { kind: "fetch_failed" };

async function callCreateOrderWithRetry(args: CreateOrderArgs): Promise<CreateOrderResult> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const { data, error } = await supabaseAdmin.rpc("create_order", {
        p_product_slug: args.productSlug,
        p_email: args.shipping.email,
        p_full_name: args.shipping.fullName,
        p_phone: args.shipping.phone,
        p_address_line1: args.shipping.addressLine1,
        p_address_line2: args.shipping.addressLine2 ?? null,
        p_city: args.shipping.city,
        p_state: args.shipping.state ?? null,
        p_postal_code: args.shipping.postalCode,
        p_country: args.shipping.country,
        p_payment_method: args.paymentMethod,
      });

      if (error) {
        if (/fetch failed/i.test(error.message) && attempt === 0) {
          await sleep(250);
          continue;
        }
        return { kind: "rpc_error", message: error.message };
      }
      if (data?.error) {
        return { kind: "business_error", error: data.error };
      }
      return { kind: "ok", data };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (/fetch failed/i.test(msg) && attempt === 0) {
        await sleep(250);
        continue;
      }
      return { kind: "fetch_failed" };
    }
  }
  return { kind: "fetch_failed" };
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
