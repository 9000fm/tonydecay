import { NextResponse } from "next/server";
import { createPayPalOrder } from "@/lib/paypal";
import { PRICE_USD } from "@/lib/constants";

export async function POST() {
  try {
    const id = await createPayPalOrder(PRICE_USD);
    return NextResponse.json({ id });
  } catch (err) {
    console.error("create-order failed:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
