import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { ShippingInfo } from "@/lib/types";
import { rateLimit, ipFromHeaders } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";

/* Creates an order row in Supabase via the create_order RPC. Checks inventory,
   generates the TD-XXX order_number, inserts with payment_status='pending'.
   Called from the shipping-form submit, BEFORE opening PayPal. */

export async function POST(req: NextRequest) {
  try {
    const ip = ipFromHeaders(req.headers);
    const rl = rateLimit(ip, { limit: 6, windowMs: 60_000 });
    if (!rl.ok) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
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

    const { data, error } = await supabaseAdmin.rpc("create_order", {
      p_product_slug: productSlug,
      p_email: shipping.email,
      p_full_name: shipping.fullName,
      p_phone: shipping.phone,
      p_address_line1: shipping.addressLine1,
      p_address_line2: shipping.addressLine2 ?? null,
      p_city: shipping.city,
      p_state: shipping.state ?? null,
      p_postal_code: shipping.postalCode,
      p_country: shipping.country,
      p_payment_method: paymentMethod,
    });

    if (error) {
      console.error("[orders/create] RPC error", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (data?.error) {
      // Business error from the RPC — e.g. 'sold_out'
      return NextResponse.json({ error: data.error }, { status: 409 });
    }

    return NextResponse.json({
      orderId: data.order_id,
      orderNumber: data.order_number,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[orders/create]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
