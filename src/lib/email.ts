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

// tonydecay.com verified in Resend (2026-06-22) - can send to anyone.
const FROM_EMAIL = "Tony Decay <mail@tonydecay.com>";
// mail@ is send-only (no inbox). Replies quietly land here instead.
const REPLY_TO = "flaviomanyariz@gmail.com";
// Who gets the "new signup" alert. Add Tony's email here when we have it.
const ADMIN_EMAILS = ["flaviomanyariz@gmail.com"];

const SITE = "https://tonydecay.com";
const IG_URL = "https://www.instagram.com/tony.decay";
const IG_ICON = `${SITE}/email/instagram.png`;

// --- Template builders (pure, exported so the preview page can render them) ---

export function waitlistEmailHtml(iconUrl: string = IG_ICON): string {
  return `
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
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0;padding-top:24px;border-top:1px solid rgba(150,170,190,0.14);width:100%;">
              <tr>
                <td style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;line-height:1.6;color:#c4cfda;">
                  Questions? Reply to this email, or DM
                  <a href="${IG_URL}" style="color:#e8edf2;text-decoration:none;white-space:nowrap;">
                    <img src="${iconUrl}" width="16" height="16" alt="Instagram" style="vertical-align:-3px;border:0;margin:0 2px 0 4px;"/>@tony.decay</a>
                </td>
              </tr>
              <tr>
                <td style="padding-top:20px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#7f93a6;">Tony Decay</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;
}

export function signupAlertHtml(subscriberEmail: string): string {
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0b0e12;margin:0;padding:40px 0;">
  <tr>
    <td align="center">
      <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background-color:#0b0e12;border:1px solid rgba(150,170,190,0.18);">
        <tr>
          <td style="padding:44px 40px;font-family:'Helvetica Neue',Arial,sans-serif;">
            <p style="margin:0 0 28px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#7f93a6;">New waitlist signup</p>
            <p style="margin:0 0 28px;font-size:32px;font-weight:800;letter-spacing:-0.5px;color:#e8edf2;">TONY <span style="color:#7f93a6;font-weight:400;">&#12398;</span> DECAY</p>
            <p style="margin:0 0 10px;font-size:20px;font-weight:700;line-height:1.4;">
              <a href="mailto:${subscriberEmail}" style="color:#e8edf2;text-decoration:none;word-break:break-all;">${subscriberEmail}</a>
            </p>
            <p style="margin:0;font-size:15px;line-height:1.7;color:#7f93a6;">just joined the notification list. Reply to this email to reach them directly.</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;
}

export function confirmationEmailHtml(
  order: { fullName: string; orderNumber: string },
  iconUrl: string = IG_ICON,
): string {
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0b0e12;margin:0;padding:40px 0;">
  <tr>
    <td align="center">
      <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background-color:#0b0e12;border:1px solid rgba(150,170,190,0.18);">
        <tr>
          <td style="padding:44px 40px;font-family:'Helvetica Neue',Arial,sans-serif;">
            <p style="margin:0 0 28px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#7f93a6;">Order confirmed</p>
            <p style="margin:0 0 28px;font-size:32px;font-weight:800;letter-spacing:-0.5px;color:#e8edf2;">TONY <span style="color:#7f93a6;font-weight:400;">&#12398;</span> DECAY</p>
            <p style="margin:0 0 22px;font-size:18px;font-weight:600;color:#e8edf2;">Thank you, ${order.fullName}.</p>
            <p style="margin:0 0 26px;">
              <span style="display:inline-block;padding:8px 14px;border:1px solid rgba(150,170,190,0.3);font-family:'Courier New',monospace;font-size:13px;letter-spacing:2px;color:#e8edf2;">ORDER ${order.orderNumber}</span>
            </p>
            <p style="margin:0 0 18px;font-size:15px;line-height:1.7;color:#c4cfda;">Your order is confirmed - fifteen prints, one of fifty signed sets.</p>
            <p style="margin:0 0 36px;font-size:15px;line-height:1.7;color:#c4cfda;">It ships within 5 to 7 business days via DHL. You'll receive tracking the moment it's on the way.</p>
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0;padding-top:24px;border-top:1px solid rgba(150,170,190,0.14);width:100%;">
              <tr>
                <td style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;line-height:1.6;color:#c4cfda;">
                  Questions? Reply to this email, or DM
                  <a href="${IG_URL}" style="color:#e8edf2;text-decoration:none;white-space:nowrap;">
                    <img src="${iconUrl}" width="16" height="16" alt="Instagram" style="vertical-align:-3px;border:0;margin:0 2px 0 4px;"/>@tony.decay</a>
                </td>
              </tr>
              <tr>
                <td style="padding-top:20px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#7f93a6;">Tony Decay</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;
}

export function abandonedEmailHtml(remaining: number, iconUrl: string = IG_ICON): string {
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0b0e12;margin:0;padding:40px 0;">
  <tr>
    <td align="center">
      <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background-color:#0b0e12;border:1px solid rgba(150,170,190,0.18);">
        <tr>
          <td style="padding:44px 40px;font-family:'Helvetica Neue',Arial,sans-serif;">
            <p style="margin:0 0 28px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#7f93a6;">Order unfinished</p>
            <p style="margin:0 0 28px;font-size:32px;font-weight:800;letter-spacing:-0.5px;color:#e8edf2;">TONY <span style="color:#7f93a6;font-weight:400;">&#12398;</span> DECAY</p>
            <p style="margin:0 0 18px;font-size:15px;line-height:1.7;color:#c4cfda;">You started an order but didn't finish it.</p>
            <p style="margin:0 0 32px;font-size:15px;line-height:1.7;color:#c4cfda;">The set is still available - ${remaining} of fifty remain. You can pick up where you left off whenever you're ready.</p>
            <p style="margin:0 0 36px;">
              <a href="${SITE}" style="display:inline-block;padding:14px 28px;background-color:#e8edf2;color:#0b0e12;font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;text-decoration:none;">Complete your order</a>
            </p>
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0;padding-top:24px;border-top:1px solid rgba(150,170,190,0.14);width:100%;">
              <tr>
                <td style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;line-height:1.6;color:#c4cfda;">
                  Questions? Reply to this email, or DM
                  <a href="${IG_URL}" style="color:#e8edf2;text-decoration:none;white-space:nowrap;">
                    <img src="${iconUrl}" width="16" height="16" alt="Instagram" style="vertical-align:-3px;border:0;margin:0 2px 0 4px;"/>@tony.decay</a>
                </td>
              </tr>
              <tr>
                <td style="padding-top:20px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#7f93a6;">Tony Decay</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;
}

// --- Senders ---

export async function sendConfirmationEmail(order: {
  email: string;
  fullName: string;
  orderNumber: string;
}) {
  await getResend().emails.send({
    from: FROM_EMAIL,
    to: order.email,
    replyTo: REPLY_TO,
    subject: `Order Confirmed - ${order.orderNumber}`,
    html: confirmationEmailHtml(order),
  });
}

export async function sendWaitlistEmail(email: string) {
  await getResend().emails.send({
    from: FROM_EMAIL,
    to: email,
    replyTo: REPLY_TO,
    subject: "You're on the list - Tony Decay",
    html: waitlistEmailHtml(),
  });
}

// Internal alert to the owners when someone joins the waitlist.
export async function sendSignupAlert(subscriberEmail: string) {
  await getResend().emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAILS,
    replyTo: subscriberEmail, // reply goes straight to the new subscriber
    subject: `New signup: ${subscriberEmail}`,
    html: signupAlertHtml(subscriberEmail),
  });
}

export async function sendAbandonedEmail(email: string, remaining: number) {
  await getResend().emails.send({
    from: FROM_EMAIL,
    to: email,
    replyTo: REPLY_TO,
    subject: "Still thinking about it?",
    html: abandonedEmailHtml(remaining),
  });
}
