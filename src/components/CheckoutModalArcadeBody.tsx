"use client";

import { useEffect } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { PRICE_USD } from "@/lib/constants";
import { useCheckoutFlow, COUNTRY_OPTIONS } from "@/hooks/useCheckoutFlow";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import { JP } from "./JP";

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

function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return "********";
  const [local, domain] = email.split("@");
  const visible = local.length <= 4 ? local.slice(0, 2) : local.slice(0, 6);
  return `${visible}********@${domain}`;
}

export function CheckoutModalArcadeBody({ open, onClose }: Props) {
  const f = useCheckoutFlow();

  // Lock pinch-zoom while the modal is open. Old Safari pinch-zooms form
  // fields and horizontal-scrolls, clipping field labels.
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
          <div className="mb-6 flex items-start justify-between gap-3">
            <div>
              <div
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 11,
                  letterSpacing: "0.36em",
                  fontWeight: 800,
                  color: MUTED,
                }}
              >
                PURCHASE ORDER
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
                  <JP en="kaikei — checkout / accounting">会計</JP>
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

          <div className="mb-8 flex items-center gap-2">
            {[
              { n: 0, label: "REVIEW", key: "review" as const },
              { n: 1, label: "SHIPPING", key: "shipping" as const },
              { n: 2, label: "PAYMENT", key: "payment" as const },
              { n: 3, label: "DONE", key: "success" as const },
            ].map((s) => {
              const active = s.n === stepIndex;
              const done = s.n < stepIndex;
              const orderConfirmed = f.step === "success";
              const clickable = done && !orderConfirmed;

              const baseStyle: React.CSSProperties = {
                flex: 1,
                padding: "8px 6px",
                background: active ? GOLD : "transparent",
                color: active ? INK : done ? INK : MUTED,
                border: `2px solid ${active || done ? INK : "rgba(26,26,26,0.28)"}`,
                boxShadow: active ? `3px 3px 0 ${INK}` : "none",
                fontFamily: "var(--font-mono), monospace",
                fontSize: 11,
                letterSpacing: "0.16em",
                fontWeight: 800,
                lineHeight: 1.15,
                textAlign: "center",
                height: 46,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              };

              if (clickable) {
                return (
                  <button
                    key={s.n}
                    type="button"
                    onClick={() => f.setStep(s.key)}
                    aria-label={`Go back to ${s.label.toLowerCase()} step`}
                    style={{
                      ...baseStyle,
                      cursor: "pointer",
                      transition: "background 140ms ease, color 140ms ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(247,194,52,0.18)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    0{s.n} · {s.label}
                  </button>
                );
              }
              return (
                <div key={s.n} style={baseStyle}>
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

              <div className="mt-7">
                <div className="mb-4">
                  {f.payError ? (
                    <span
                      style={{
                        fontFamily: "var(--font-display), serif",
                        fontStyle: "italic",
                        fontSize: 13,
                        color: CRIMSON,
                      }}
                    >
                      - {f.payError}
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
                </div>
                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => f.setStep("review")}
                    aria-label="Back to review step"
                    style={{
                      padding: "11px 22px",
                      background: GOLD,
                      color: INK,
                      border: `2px solid ${INK}`,
                      fontFamily: "var(--font-tattoo), sans-serif",
                      fontSize: 18,
                      letterSpacing: "0.04em",
                      lineHeight: 1,
                      cursor: "pointer",
                      boxShadow: `3px 3px 0 ${INK}`,
                    }}
                  >
                    ← BACK
                  </button>
                  <button
                    type="submit"
                    disabled={f.submitting}
                    style={{
                      padding: "11px 22px",
                      background: GOLD,
                      color: INK,
                      border: `2px solid ${INK}`,
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
                onError={f.paypalOnError}
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
                  - {f.payError}
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
                <span>
                  {process.env.NODE_ENV === "production"
                    ? "SECURE PAYMENT"
                    : "SANDBOX · NO REAL CHARGE"}
                </span>
              </div>
            </div>
          )}

          {f.step === "success" && (
            <div className="py-4">
              <div
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 11,
                  letterSpacing: "0.38em",
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
                  fontSize: "clamp(2.2rem, 6vw, 3rem)",
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
                  fontSize: 17,
                  color: MUTED,
                  lineHeight: 1.55,
                  maxWidth: 420,
                }}
              >
                Your order is now confirmed. A confirmation email has been sent to{" "}
                <span style={{ color: INK, fontStyle: "normal", whiteSpace: "nowrap" }}>
                  {maskEmail(f.shipping.email)}
                </span>
                . DHL tracking will be shared once the package ships. Estimated dispatch: 5 to 7
                business days.
              </p>
              {f.orderNumber && (
                <div
                  className="mt-6 inline-block"
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: 13,
                    letterSpacing: "0.26em",
                    fontWeight: 800,
                    color: INK,
                    padding: "10px 16px",
                    background: GOLD,
                    border: `2px solid ${INK}`,
                    boxShadow: `3px 3px 0 ${INK}`,
                  }}
                >
                  ORDER · {f.orderNumber}
                </div>
              )}
              <button
                type="button"
                onClick={onClose}
                className="mt-10 block"
                style={{
                  padding: "13px 26px",
                  background: "transparent",
                  color: INK,
                  border: `2px solid ${INK}`,
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 13,
                  letterSpacing: "0.3em",
                  fontWeight: 800,
                  cursor: "pointer",
                  boxShadow: `3px 3px 0 ${INK}`,
                  transition: "transform 120ms ease, box-shadow 120ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translate(1px,1px)";
                  e.currentTarget.style.boxShadow = `2px 2px 0 ${INK}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translate(0,0)";
                  e.currentTarget.style.boxShadow = `3px 3px 0 ${INK}`;
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
          - {error}
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
