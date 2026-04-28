"use client";

import { useEffect } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { PRICE_USD } from "@/lib/constants";
import { useCheckoutFlow, COUNTRY_OPTIONS } from "@/hooks/useCheckoutFlow";
import { TurnstileWidget } from "@/components/TurnstileWidget";

/* Live checkout modal body (promoted from lab A2 Quiet Arcade).
   Cream paper, thin 2px borders, single ink drop-shadow (no crimson),
   outlined step chips, ink-on-gold continue button. Hosts its own 3-step
   flow via useCheckoutFlow — parent supplies open/onClose from the
   global useCheckout reducer. */

interface Props {
  open: boolean;
  onClose: () => void;
}

const INK = "#1a1a1a";
const PAPER = "#EFE8D2";
const CREAM = "#fffef8";
const CRIMSON = "#d7322e";
const GOLD = "#F7C234";
const MUTED = "rgba(26,26,26,0.55)";

export function CheckoutModalArcadeBody({ open, onClose }: Props) {
  const f = useCheckoutFlow();

  // Lock pinch-zoom while the checkout modal is open. Old Safari (iPhone X)
  // lets the user pinch-zoom into form fields, then horizontal-scroll, which
  // visually clips field labels at the left edge.
  useEffect(() => {
    if (!open) return;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
    const prev = meta?.getAttribute("content") ?? null;
    if (meta) {
      meta.setAttribute(
        "content",
        "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
      );
    }
    return () => {
      if (meta && prev !== null) meta.setAttribute("content", prev);
    };
  }, [open]);

  if (!open) return null;

  const stepIndex =
    f.step === "review" ? 0 : f.step === "shipping" ? 1 : f.step === "payment" ? 2 : 3;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center px-4 py-8"
      style={{ background: "rgba(26,26,26,0.72)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[560px] overflow-hidden"
        style={{
          background: PAPER,
          border: `2px solid ${INK}`,
          boxShadow: `5px 5px 0 ${INK}`,
          maxHeight: "92vh",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-h-[92vh] overflow-y-auto p-7 sm:p-10">
          {/* Header */}
          <div className="mb-6 flex items-start justify-between gap-3">
            <div>
              <div
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 9,
                  letterSpacing: "0.4em",
                  fontWeight: 800,
                  color: MUTED,
                }}
              >
                PURCHASE ORDER · TONY DECAY
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-tattoo), sans-serif",
                  fontSize: "clamp(2rem, 5.5vw, 2.6rem)",
                  color: INK,
                  lineHeight: 0.9,
                  letterSpacing: "0.01em",
                  marginTop: 4,
                }}
              >
                CHECKOUT{" "}
                <span
                  style={{
                    fontFamily: "var(--font-jp), var(--font-tattoo), sans-serif",
                    color: INK,
                    opacity: 0.35,
                    fontSize: "0.75em",
                  }}
                >
                  会計
                </span>
              </h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                width: 32,
                height: 32,
                background: "transparent",
                color: INK,
                border: `1.5px solid ${INK}`,
                cursor: "pointer",
                fontFamily: "var(--font-mono), monospace",
                fontSize: 14,
                fontWeight: 800,
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>

          {/* Step indicator — outlined, gold-filled only when active */}
          <div className="mb-7 flex items-center gap-2">
            {[
              { n: 0, label: "REVIEW" },
              { n: 1, label: "SHIPPING" },
              { n: 2, label: "PAYMENT" },
              { n: 3, label: "DONE" },
            ].map((s) => {
              const active = s.n === stepIndex;
              const done = s.n < stepIndex;
              return (
                <div
                  key={s.n}
                  style={{
                    flex: 1,
                    padding: "6px 10px",
                    background: active ? GOLD : "transparent",
                    color: active ? INK : done ? INK : MUTED,
                    border: `1.5px solid ${active || done ? INK : "rgba(26,26,26,0.25)"}`,
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: 9,
                    letterSpacing: "0.22em",
                    fontWeight: 800,
                    lineHeight: 1,
                    textAlign: "center",
                  }}
                >
                  0{s.n} · {s.label}
                </div>
              );
            })}
          </div>

          {f.step === "review" && <ReviewPanel onContinue={() => f.setStep("shipping")} />}

          {f.step === "shipping" && (
            <form onSubmit={f.submitShipping} noValidate>
              <TurnstileWidget onToken={f.setTurnstileToken} />
              <QField
                label="FULL NAME"
                value={f.shipping.fullName}
                onChange={(v) => f.setShipping({ ...f.shipping, fullName: v })}
                error={f.errors.fullName}
              />
              <QField
                label="EMAIL"
                type="email"
                value={f.shipping.email}
                onChange={(v) => f.setShipping({ ...f.shipping, email: v })}
                error={f.errors.email}
              />
              <QField
                label="PHONE"
                value={f.shipping.phone}
                onChange={(v) => f.setShipping({ ...f.shipping, phone: v })}
                error={f.errors.phone}
              />
              <QField
                label="ADDRESS LINE 1"
                value={f.shipping.addressLine1}
                onChange={(v) => f.setShipping({ ...f.shipping, addressLine1: v })}
                error={f.errors.addressLine1}
              />
              <QField
                label="ADDRESS LINE 2 (OPTIONAL)"
                value={f.shipping.addressLine2 ?? ""}
                onChange={(v) => f.setShipping({ ...f.shipping, addressLine2: v })}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <QField
                  label="CITY"
                  value={f.shipping.city}
                  onChange={(v) => f.setShipping({ ...f.shipping, city: v })}
                  error={f.errors.city}
                />
                <QField
                  label="STATE / REGION"
                  value={f.shipping.state ?? ""}
                  onChange={(v) => f.setShipping({ ...f.shipping, state: v })}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <QField
                  label="POSTAL CODE"
                  value={f.shipping.postalCode}
                  onChange={(v) => f.setShipping({ ...f.shipping, postalCode: v })}
                  error={f.errors.postalCode}
                />
                <QSelect
                  label="COUNTRY"
                  value={f.shipping.country}
                  onChange={(v) => f.setShipping({ ...f.shipping, country: v })}
                />
              </div>

              <div className="mt-7 flex items-center justify-between">
                {f.payError ? (
                  <span
                    style={{
                      fontFamily: "var(--font-display), serif",
                      fontStyle: "italic",
                      fontSize: 13,
                      color: CRIMSON,
                    }}
                  >
                    — {f.payError}
                  </span>
                ) : (
                  <span
                    style={{
                      fontFamily: "var(--font-display), serif",
                      fontStyle: "italic",
                      fontSize: 13,
                      color: MUTED,
                    }}
                  >
                    ships worldwide · all prices final
                  </span>
                )}
                <button
                  type="submit"
                  disabled={f.submitting}
                  style={{
                    padding: "11px 22px",
                    background: INK,
                    color: GOLD,
                    border: `1.5px solid ${INK}`,
                    fontFamily: "var(--font-tattoo), sans-serif",
                    fontSize: 18,
                    letterSpacing: "0.04em",
                    lineHeight: 1,
                    cursor: f.submitting ? "wait" : "pointer",
                    opacity: f.submitting ? 0.6 : 1,
                    boxShadow: `3px 3px 0 ${INK}`,
                  }}
                >
                  {f.submitting ? "…" : "CONTINUE →"}
                </button>
              </div>
            </form>
          )}

          {f.step === "payment" && (
            <div>
              <div
                className="mb-5"
                style={{
                  background: "transparent",
                  border: `1.5px solid ${INK}`,
                  padding: "14px 18px",
                }}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span
                    style={{
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: 10,
                      letterSpacing: "0.28em",
                      fontWeight: 800,
                      color: MUTED,
                    }}
                  >
                    VOL.01 · TONY DECAY
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-tattoo), sans-serif",
                      fontSize: 22,
                      lineHeight: 1,
                      color: INK,
                    }}
                  >
                    ${PRICE_USD}
                  </span>
                </div>
                <div
                  className="mt-2"
                  style={{
                    fontFamily: "var(--font-display), serif",
                    fontStyle: "italic",
                    fontSize: 13,
                    color: MUTED,
                    lineHeight: 1.4,
                  }}
                >
                  shipping to {f.shipping.fullName} · {f.shipping.city}, {f.shipping.country}
                </div>
              </div>

              <PayPalButtons
                style={{ layout: "vertical", height: 46, shape: "rect" }}
                createOrder={f.paypalCreateOrder}
                onApprove={(data) => f.paypalOnApprove(data)}
                onError={(err) => f.setPayError(String(err))}
              />

              {f.payError && (
                <p
                  style={{
                    fontFamily: "var(--font-display), serif",
                    fontStyle: "italic",
                    fontSize: 13,
                    color: CRIMSON,
                    marginTop: 10,
                  }}
                >
                  — {f.payError}
                </p>
              )}

              <div
                className="mt-5 flex justify-between"
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 10,
                  letterSpacing: "0.26em",
                  fontWeight: 800,
                  color: MUTED,
                }}
              >
                <button
                  type="button"
                  onClick={() => f.setStep("shipping")}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: INK,
                    fontFamily: "inherit",
                    fontSize: "inherit",
                    letterSpacing: "inherit",
                    fontWeight: "inherit",
                  }}
                >
                  ← BACK
                </button>
                <span>SANDBOX · NO REAL CHARGE</span>
              </div>
            </div>
          )}

          {f.step === "success" && (
            <div className="py-4">
              <div
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 9,
                  letterSpacing: "0.42em",
                  fontWeight: 800,
                  color: MUTED,
                }}
              >
                ORDER CONFIRMED
              </div>
              <h3
                className="mt-3"
                style={{
                  fontFamily: "var(--font-tattoo), sans-serif",
                  fontSize: "clamp(2rem, 5.5vw, 2.8rem)",
                  color: INK,
                  lineHeight: 0.95,
                }}
              >
                Thank you, {f.shipping.fullName.split(" ")[0] || "friend"}.
              </h3>
              <p
                className="mt-4"
                style={{
                  fontFamily: "var(--font-display), serif",
                  fontStyle: "italic",
                  fontSize: 15,
                  color: MUTED,
                  lineHeight: 1.55,
                  maxWidth: 380,
                }}
              >
                We&apos;ve sent confirmation &amp; tracking details to {f.shipping.email}. Your
                prints ship within 5–7 business days via DHL.
              </p>
              {f.orderNumber && (
                <div
                  className="mt-5 inline-block"
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: 11,
                    letterSpacing: "0.28em",
                    fontWeight: 800,
                    color: INK,
                    padding: "5px 12px",
                    border: `1.5px solid ${INK}`,
                  }}
                >
                  ORDER · {f.orderNumber}
                </div>
              )}
              <button
                type="button"
                onClick={onClose}
                className="mt-7 block"
                style={{
                  padding: "10px 20px",
                  background: "transparent",
                  color: INK,
                  border: `1.5px solid ${INK}`,
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 11,
                  letterSpacing: "0.3em",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                CLOSE
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewPanel({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="pb-2">
      <div
        style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 9,
          letterSpacing: "0.4em",
          fontWeight: 800,
          color: MUTED,
        }}
      >
        ORDER SUMMARY · TONY DECAY VOL. 01
      </div>

      <div
        className="mt-4 p-5"
        style={{
          background: CREAM,
          border: `1.5px solid rgba(26,26,26,0.4)`,
        }}
      >
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <div
              style={{
                fontFamily: "var(--font-display), serif",
                fontStyle: "italic",
                fontSize: 17,
                color: INK,
                lineHeight: 1.35,
              }}
            >
              1 × set of 15 mini prints
            </div>
            <div
              className="mt-1"
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 10,
                letterSpacing: "0.28em",
                fontWeight: 800,
                color: MUTED,
              }}
            >
              CREAM PAPER · HAND-NUMBERED · ED. xx / 100
            </div>
          </div>
          <div
            style={{
              fontFamily: "var(--font-tattoo), sans-serif",
              fontSize: 30,
              color: INK,
              lineHeight: 1,
              letterSpacing: "0.01em",
              whiteSpace: "nowrap",
            }}
          >
            ${PRICE_USD}
          </div>
        </div>

        <div
          className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2"
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.24em",
            fontWeight: 800,
            color: MUTED,
          }}
        >
          <div
            className="flex justify-between border-t pt-2"
            style={{ borderColor: "rgba(26,26,26,0.18)" }}
          >
            <span>SHIPPING</span>
            <span style={{ color: INK }}>INCLUDED</span>
          </div>
          <div
            className="flex justify-between border-t pt-2"
            style={{ borderColor: "rgba(26,26,26,0.18)" }}
          >
            <span>TAXES / FEES</span>
            <span style={{ color: INK }}>INCLUDED</span>
          </div>
        </div>

        <div
          className="mt-4 flex items-baseline justify-between border-t pt-3"
          style={{ borderColor: "rgba(26,26,26,0.4)" }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 10,
              letterSpacing: "0.32em",
              fontWeight: 800,
              color: INK,
            }}
          >
            TOTAL · ALL IN
          </span>
          <span
            style={{
              fontFamily: "var(--font-tattoo), sans-serif",
              fontSize: 32,
              color: CRIMSON,
              lineHeight: 1,
              letterSpacing: "0.01em",
            }}
          >
            ${PRICE_USD}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="mt-6 w-full"
        style={{
          padding: "14px 18px",
          background: GOLD,
          color: INK,
          border: `2px solid ${INK}`,
          fontFamily: "var(--font-tattoo), sans-serif",
          fontSize: 22,
          letterSpacing: "0.02em",
          lineHeight: 1,
          cursor: "pointer",
          boxShadow: `4px 4px 0 ${INK}`,
        }}
      >
        LOOKS GOOD →
      </button>

      <p
        className="mt-4 text-center"
        style={{
          fontFamily: "var(--font-display), serif",
          fontStyle: "italic",
          fontSize: 13,
          color: MUTED,
          lineHeight: 1.45,
        }}
      >
        no signup, no cart, no nonsense — one set, one price, sent worldwide.
      </p>
    </div>
  );
}

function QField({
  label,
  value,
  onChange,
  error,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
}) {
  return (
    <label className="mb-4 block">
      <div
        style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 9,
          letterSpacing: "0.32em",
          fontWeight: 800,
          color: MUTED,
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "8px 12px",
          background: CREAM,
          border: `1.5px solid ${error ? CRIMSON : "rgba(26,26,26,0.4)"}`,
          fontFamily: "var(--font-mono), monospace",
          fontSize: 13,
          color: INK,
          letterSpacing: "0.02em",
          outline: "none",
        }}
      />
      {error && (
        <div
          style={{
            fontFamily: "var(--font-display), serif",
            fontStyle: "italic",
            fontSize: 12,
            color: CRIMSON,
            marginTop: 3,
          }}
        >
          — {error}
        </div>
      )}
    </label>
  );
}

function QSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="mb-4 block">
      <div
        style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 9,
          letterSpacing: "0.32em",
          fontWeight: 800,
          color: MUTED,
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "8px 12px",
          background: CREAM,
          border: "1.5px solid rgba(26,26,26,0.4)",
          fontFamily: "var(--font-mono), monospace",
          fontSize: 13,
          color: INK,
          outline: "none",
        }}
      >
        {COUNTRY_OPTIONS.map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    </label>
  );
}
