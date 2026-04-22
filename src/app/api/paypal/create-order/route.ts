import { NextResponse } from "next/server";
import { createPayPalOrder } from "@/lib/paypal";
import { PRICE_USD } from "@/lib/constants";

export async function POST() {
  try {
    const id = await createPayPalOrder(PRICE_USD);
    return NextResponse.json({ id });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    // Logs the full PayPal message to your dev-server / Vercel logs
    console.error("[paypal/create-order]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
