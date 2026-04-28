"use client";

import Link from "next/link";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { CheckoutModal } from "@/components/CheckoutModal";
import { CheckoutProvider, useCheckout } from "@/hooks/useCheckout";

/* Preview of the live CheckoutModal. Post-promotion, the 6-variant switcher
   is gone — this page just triggers the same modal that runs on the homepage,
   wrapped in its own CheckoutProvider so we don't need to mount the whole
   homepage to exercise checkout. */

export default function LabCheckoutPage() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "";

  return (
    <PayPalScriptProvider options={{ clientId, currency: "USD" }}>
      <CheckoutProvider>
        <main style={{ background: "#0a0a0a", color: "#f0ebdc", minHeight: "100vh" }}>
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
                LAB / CHECKOUT · live preview
              </span>
            </div>
          </header>

          <OpenButton />
          <CheckoutModal />
        </main>
      </CheckoutProvider>
    </PayPalScriptProvider>
  );
}

function OpenButton() {
  const { dispatch } = useCheckout();
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "";

  return (
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
        LIVE CHECKOUT · QUIET ARCADE
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
        Same modal the homepage BUY button opens. Full path: form → PayPal sandbox → Supabase
        persistence via <code style={{ color: "#F7C234" }}>create_order</code> +{" "}
        <code style={{ color: "#F7C234" }}>confirm_payment</code> RPCs → Resend email.
      </p>

      <button
        type="button"
        onClick={() => dispatch({ type: "OPEN" })}
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
          ⚠ NEXT_PUBLIC_PAYPAL_CLIENT_ID missing — PayPal buttons won&apos;t load on step 2.
        </p>
      )}
    </section>
  );
}
