import "server-only";
import { Resend } from "resend";

let cached: Resend | null = null;
function getResend(): Resend {
  if (cached) return cached;
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY missing");
  cached = new Resend(key);
  return cached;
}

// resend.dev only delivers to the account-owner's verified email until
// tonydecay.com is verified in Resend.
const FROM_EMAIL = "Tony Decay <onboarding@resend.dev>";

export async function sendConfirmationEmail(order: {
  email: string;
  fullName: string;
  orderNumber: string;
}) {
  await getResend().emails.send({
    from: FROM_EMAIL,
    to: order.email,
    subject: `Order Confirmed - ${order.orderNumber}`,
    html: `
      <h1>Thank you, ${order.fullName}!</h1>
      <p>Your order <strong>${order.orderNumber}</strong> has been confirmed.</p>
      <p>Your Tony Decay Limited Edition Collection will ship within 5-7 business days via DHL.</p>
      <p>You'll receive tracking information once your order ships.</p>
      <br/>
      <p>- Tony Decay</p>
    `,
  });
}

export async function sendWaitlistEmail(email: string) {
  await getResend().emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "You're on the list - Tony Decay",
    html: `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0b0e12;margin:0;padding:40px 0;">
  <tr>
    <td align="center">
      <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background-color:#0b0e12;border:1px solid rgba(150,170,190,0.18);">
        <tr>
          <td style="padding:44px 40px;font-family:'Helvetica Neue',Arial,sans-serif;">
            <p style="margin:0 0 28px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#7f93a6;">You're on the list</p>
            <p style="margin:0 0 32px;font-size:32px;font-weight:800;letter-spacing:-0.5px;color:#e8edf2;">TONY <span style="color:#7f93a6;font-weight:400;">&#12398;</span> DECAY</p>
            <p style="margin:0 0 18px;font-size:15px;line-height:1.7;color:#c4cfda;">Your address has been added to the Tony Decay notification list.</p>
            <p style="margin:0 0 36px;font-size:15px;line-height:1.7;color:#c4cfda;">The moment the prints are available to purchase, you'll receive a single email with a direct link to place your order. The collection is fifty signed sets, shipped worldwide.</p>
            <p style="margin:0;padding-top:24px;border-top:1px solid rgba(150,170,190,0.14);font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#7f93a6;">Tony Decay</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
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
      <p>Only <strong>${remaining}/50</strong> sets remaining.</p>
      <p>Complete your order before they're gone.</p>
      <p><a href="https://tonydecay.com">Complete your order</a></p>
      <br/>
      <p>- Tony Decay</p>
    `,
  });
}
