import "server-only";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "Tony Decay <orders@tonydecay.com>";

export async function sendConfirmationEmail(order: {
  email: string;
  fullName: string;
  orderNumber: string;
}) {
  await resend.emails.send({
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
  await resend.emails.send({
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
