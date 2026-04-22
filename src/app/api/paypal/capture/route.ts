import { NextRequest, NextResponse } from "next/server";
import { capturePayPalOrder } from "@/lib/paypal";

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json({ error: "orderId required" }, { status: 400 });
    }
    const result = await capturePayPalOrder(orderId);
    return NextResponse.json(result);
  } catch (err) {
    console.error("capture failed:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
