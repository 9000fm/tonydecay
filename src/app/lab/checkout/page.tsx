"use client";

import Link from "next/link";
import { useState } from "react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { CheckoutModalArcade } from "@/components/CheckoutModalArcade";

export default function LabCheckoutPage() {
  const [open, setOpen] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "";

  return (
    <PayPalScriptProvider options={{ clientId, currency: "USD" }}>
      <main style={{ background: "#0a0a0a", color: "#f0ebdc", minHeight: "100vh" }}>
        {/* Top bar — back to /lab */}
        <header
          className="sticky top-0 z-40 w-full"
          style={{
            background: "#0a0a0a",
            borderBottom: "1px solid rgba(240,235,220,0.18)",
          }}
        >
          <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-3 sm:px-10">
            <Link
              href="/lab"
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 11,
                letterSpacing: "0.3em",
                fontWeight: 800,
                color: "#F7C234",
                textDecoration: "none",
                padding: "4px 10px",
                border: "1px solid #F7C234",
              }}
            >
              ← /lab
            </Link>
            <span
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 11,
                letterSpacing: "0.28em",
                fontWeight: 800,
                color: "rgba(240,235,220,0.65)",
              }}
            >
              LAB / CHECKOUT · shipping + paypal sandbox
            </span>
          </div>
        </header>

        <section className="mx-auto max-w-3xl px-6 py-14 sm:px-10">
          <div
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.32em",
              fontWeight: 800,
              color: "rgba(240,235,220,0.55)",
              marginBottom: 10,
            }}
          >
            C1 &nbsp;·&nbsp; CHECKOUT MODAL · ARCADE STYLE
          </div>
          <p
            style={{
              fontFamily: "var(--font-display), serif",
              fontSize: 16,
              lineHeight: 1.55,
              color: "rgba(240,235,220,0.82)",
              maxWidth: 680,
            }}
          >
            Sandbox flow: form → PayPal Smart Button → confirmation. Hits real PayPal sandbox via{" "}
            <code style={{ color: "#F7C234" }}>/api/paypal/create-order</code> +{" "}
            <code style={{ color: "#F7C234" }}>/api/paypal/capture</code>. No live charges. No
            Supabase persistence yet. Click the button below to open the modal.
          </p>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-10"
            style={{
              padding: "18px 36px",
              background: "#F7C234",
              color: "#1a1a1a",
              border: "3px solid #1a1a1a",
              fontFamily: "var(--font-tattoo), sans-serif",
              fontSize: 40,
              letterSpacing: "0.02em",
              lineHeight: 1,
              cursor: "pointer",
              boxShadow: "8px 8px 0 #d7322e, 8px 8px 0 2px #1a1a1a",
            }}
          >
            OPEN CHECKOUT
          </button>

          {!clientId && (
            <p
              className="mt-8"
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 11,
                letterSpacing: "0.22em",
                fontWeight: 800,
                color: "#d7322e",
              }}
            >
              ⚠ NEXT_PUBLIC_PAYPAL_CLIENT_ID missing from .env.local — PayPal buttons will not load
              on step 2.
            </p>
          )}

          <div
            className="mt-14 grid gap-4"
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.04em",
              color: "rgba(240,235,220,0.75)",
              lineHeight: 1.6,
            }}
          >
            <div>
              <span style={{ color: "#F7C234" }}>✓</span> overlay has NO backdrop-blur (fixes 2K
              lag)
            </div>
            <div>
              <span style={{ color: "#F7C234" }}>✓</span> 3-step flow — shipping / payment / success
            </div>
            <div>
              <span style={{ color: "#F7C234" }}>✓</span> form validation on submit (all required,
              email regex)
            </div>
            <div>
              <span style={{ color: "#F7C234" }}>✓</span> PayPal sandbox Smart Button (credit card +
              PayPal account both supported)
            </div>
            <div>
              <span style={{ color: "rgba(240,235,220,0.35)" }}>○</span> Supabase persistence — not
              in this round
            </div>
            <div>
              <span style={{ color: "rgba(240,235,220,0.35)" }}>○</span> Resend email — not in this
              round
            </div>
          </div>
        </section>

        <CheckoutModalArcade open={open} onClose={() => setOpen(false)} />
      </main>
    </PayPalScriptProvider>
  );
}
