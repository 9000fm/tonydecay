import { NextRequest, NextResponse } from "next/server";
import { capturePayPalOrder } from "@/lib/paypal";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendConfirmationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { orderId, localOrderId } = (await req.json()) as {
      orderId: string;
      localOrderId?: string;
    };
    if (!orderId) {
      return NextResponse.json({ error: "orderId required" }, { status: 400 });
    }

    const capture = await capturePayPalOrder(orderId);

    let orderNumber: string | null = null;
    let remaining: number | null = null;
    if (localOrderId) {
      const { data, error } = await supabaseAdmin.rpc("confirm_payment", {
        p_order_id: localOrderId,
        p_paypal_order_id: orderId,
      });
      if (error) {
        console.error("[paypal/capture] confirm_payment RPC error", error);
      } else if (data?.error) {
        console.error("[paypal/capture] confirm_payment business error", data.error);
      } else if (data?.success) {
        orderNumber = data.order_number;
        remaining = data.remaining;
      }
    }

    if (orderNumber && localOrderId) {
      const { data: orderRow } = await supabaseAdmin
        .from("orders")
        .select("email, full_name")
        .eq("id", localOrderId)
        .single();
      if (orderRow) {
        try {
          await sendConfirmationEmail({
            email: orderRow.email,
            fullName: orderRow.full_name,
            orderNumber,
          });
        } catch (emailErr) {
          console.error("[paypal/capture] sendConfirmationEmail failed", emailErr);
        }
      }
    }

    return NextResponse.json({ capture, orderNumber, remaining });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[paypal/capture]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
