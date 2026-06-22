import {
  waitlistEmailHtml,
  signupAlertHtml,
  confirmationEmailHtml,
  abandonedEmailHtml,
} from "@/lib/email";

// Local-only visual preview of every transactional email. No sends fire here.
// Visit /email-preview on localhost. Icon loads from the local /public copy.
export const dynamic = "force-static";

const previews: { label: string; subject: string; html: string }[] = [
  {
    label: "Waitlist confirmation (to subscriber)",
    subject: "You're on the list - Tony Decay",
    html: waitlistEmailHtml("/email/instagram.png"),
  },
  {
    label: "New-signup alert (to you)",
    subject: "New signup: fan@example.com",
    html: signupAlertHtml("fan@example.com"),
  },
  {
    label: "Order confirmation (to buyer)",
    subject: "Order Confirmed - TD-VOL01-007",
    html: confirmationEmailHtml(
      { fullName: "Jane Doe", orderNumber: "TD-VOL01-007" },
      "/email/instagram.png",
    ),
  },
  {
    label: "Abandoned checkout (to buyer)",
    subject: "Still thinking about it?",
    html: abandonedEmailHtml(37, "/email/instagram.png"),
  },
];

export default function EmailPreviewPage() {
  return (
    <main style={{ background: "#15181d", minHeight: "100vh", padding: "32px 16px" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <h1
          style={{
            fontFamily: "monospace",
            fontSize: 13,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "#7f93a6",
            marginBottom: 24,
          }}
        >
          Email preview - localhost only, nothing is sent
        </h1>
        {previews.map((p) => (
          <section key={p.label} style={{ marginBottom: 40 }}>
            <p
              style={{ fontFamily: "monospace", fontSize: 12, color: "#c4cfda", margin: "0 0 2px" }}
            >
              {p.label}
            </p>
            <p
              style={{
                fontFamily: "monospace",
                fontSize: 11,
                color: "#7f93a6",
                margin: "0 0 10px",
              }}
            >
              Subject: {p.subject}
            </p>
            <iframe
              srcDoc={p.html}
              title={p.label}
              style={{
                width: "100%",
                height: 520,
                border: "1px solid rgba(150,170,190,0.2)",
                background: "#0b0e12",
              }}
            />
          </section>
        ))}
      </div>
    </main>
  );
}
