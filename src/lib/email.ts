import "server-only";
import { Resend } from "resend";

/* Lazy-init Resend — module-level `new Resend(undefined)` fails the build
   when RESEND_API_KEY is empty. Instantiates on first send. */
let cached: Resend | null = null;
function getResend(): Resend {
  if (cached) return cached;
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY missing");
  cached = new Resend(key);
  return cached;
}

// TODO: switch to "Tony Decay <orders@tonydecay.com>" once the domain is
// registered + verified in Resend. resend.dev only delivers to the account
// owner's verified email, so this is dev/testing only.
const FROM_EMAIL = "Tony Decay <onboarding@resend.dev>";

export async function sendConfirmationEmail(order: {
  email: string;
  fullName: string;
  orderNumber: string;
}) {
  await getResend().emails.send({
    from: FROM_EMAIL,
    to: order.email,
    subject: `Order Confirmed — ${order.orderNumber}`,
    html: `
      <h1>Thank you, ${order.fullName}!</h1>
      <p>Your order <strong>${order.orderNumber}</strong> has been confirmed.</p>
      <p>Your Tony Decay Limited Edition Collection will ship within 5-7 business days via DHL.</p>
      <p>You'll receive tracking information once your order ships.</p>
      <br/>
      <p>— Tony Decay</p>
    `,
  });
}

export async function sendAbandonedEmail(email: string, remaining: number) {
  await getResend().emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Still thinking about it?",
    html: `
      <h1>Your collection is waiting</h1>
      <p>Only <strong>${remaining}/100</strong> sets remaining.</p>
      <p>Complete your order before they're gone.</p>
      <p><a href="https://tonydecay.com">Complete your order</a></p>
      <br/>
      <p>— Tony Decay</p>
    `,
  });
}
