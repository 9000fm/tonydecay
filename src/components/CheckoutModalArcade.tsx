"use client";

import { useState } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { PRICE_USD } from "@/lib/constants";
import type { ShippingInfo } from "@/lib/types";

/* Arcade-magazine checkout modal. Self-contained — does NOT use the global
   useCheckout context (yet). Local state per step. 3 steps:
     1. shipping — form
     2. payment — PayPal Smart Button
     3. success — confirmation stamp
   No backdrop blur (kills 2K perf). Cream paper panel, thick ink border,
   crimson + gold accents. */

type Step = "shipping" | "payment" | "success";

interface Props {
  open: boolean;
  onClose: () => void;
}

const EMPTY_SHIPPING: ShippingInfo = {
  fullName: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "US",
};

const TOP_COUNTRIES = [
  ["US", "United States"],
  ["CA", "Canada"],
  ["MX", "Mexico"],
  ["PE", "Peru"],
  ["AR", "Argentina"],
  ["BR", "Brazil"],
  ["CL", "Chile"],
  ["CO", "Colombia"],
  ["UY", "Uruguay"],
  ["GB", "United Kingdom"],
  ["FR", "France"],
  ["DE", "Germany"],
  ["ES", "Spain"],
  ["IT", "Italy"],
  ["NL", "Netherlands"],
  ["PT", "Portugal"],
  ["BE", "Belgium"],
  ["SE", "Sweden"],
  ["NO", "Norway"],
  ["DK", "Denmark"],
  ["FI", "Finland"],
  ["CH", "Switzerland"],
  ["AT", "Austria"],
  ["IE", "Ireland"],
  ["PL", "Poland"],
  ["CZ", "Czechia"],
  ["JP", "Japan"],
  ["KR", "South Korea"],
  ["CN", "China"],
  ["HK", "Hong Kong"],
  ["TW", "Taiwan"],
  ["SG", "Singapore"],
  ["TH", "Thailand"],
  ["VN", "Vietnam"],
  ["ID", "Indonesia"],
  ["PH", "Philippines"],
  ["MY", "Malaysia"],
  ["IN", "India"],
  ["AU", "Australia"],
  ["NZ", "New Zealand"],
  ["ZA", "South Africa"],
  ["AE", "UAE"],
  ["IL", "Israel"],
] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CheckoutModalArcade({ open, onClose }: Props) {
  const [step, setStep] = useState<Step>("shipping");
  const [shipping, setShipping] = useState<ShippingInfo>(EMPTY_SHIPPING);
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingInfo, string>>>({});
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [payError, setPayError] = useState<string | null>(null);

  if (!open) return null;

  const validateShipping = () => {
    const e: Partial<Record<keyof ShippingInfo, string>> = {};
    if (!shipping.fullName.trim()) e.fullName = "required";
    if (!shipping.email.trim() || !EMAIL_RE.test(shipping.email)) e.email = "invalid email";
    if (!shipping.phone.trim()) e.phone = "required";
    if (!shipping.addressLine1.trim()) e.addressLine1 = "required";
    if (!shipping.city.trim()) e.city = "required";
    if (!shipping.postalCode.trim()) e.postalCode = "required";
    if (!shipping.country.trim()) e.country = "required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const stepIndex = step === "shipping" ? 1 : step === "payment" ? 2 : 3;

  return (
    <div
      // Overlay — NO backdrop-blur (kills perf). Just semi-transparent ink.
      className="fixed inset-0 z-[90] flex items-center justify-center px-4 py-8"
      style={{ background: "rgba(26,26,26,0.72)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[560px] overflow-hidden"
        style={{
          background: "#ECE4D0",
          border: "4px solid var(--color-ink)",
          boxShadow: "8px 8px 0 var(--color-crimson), 8px 8px 0 2px var(--color-ink)",
          maxHeight: "92vh",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Scroll-capable body */}
        <div className="max-h-[92vh] overflow-y-auto p-6 sm:p-8">
          {/* Header row: N°001 block · title · close */}
          <div className="mb-6 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span
                style={{
                  padding: "4px 10px",
                  background: "var(--color-gold)",
                  color: "var(--color-ink)",
                  border: "2px solid var(--color-ink)",
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 10,
                  letterSpacing: "0.22em",
                  fontWeight: 800,
                  lineHeight: 1,
                  boxShadow: "2px 2px 0 var(--color-ink)",
                }}
              >
                N°001 / 100
              </span>
            </div>
            <div className="flex-1">
              <h2
                style={{
                  fontFamily: "var(--font-tattoo), sans-serif",
                  fontSize: "clamp(2rem, 6vw, 2.8rem)",
                  color: "var(--color-ink)",
                  lineHeight: 0.9,
                  letterSpacing: "0.01em",
                  textAlign: "center",
                }}
              >
                CHECKOUT /{" "}
                <span
                  title="kaikei — checkout / accounting"
                  style={{
                    fontFamily: "var(--font-jp), var(--font-tattoo), sans-serif",
                    color: "var(--color-crimson)",
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
                width: 36,
                height: 36,
                background: "var(--color-ink)",
                color: "var(--color-paper)",
                border: "2px solid var(--color-ink)",
                cursor: "pointer",
                fontFamily: "var(--font-mono), monospace",
                fontSize: 16,
                fontWeight: 800,
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>

          {/* Step indicator */}
          <div className="mb-7 flex items-center gap-2">
            {[
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
                    background: active
                      ? "var(--color-crimson)"
                      : done
                        ? "var(--color-gold)"
                        : "transparent",
                    color: active
                      ? "var(--color-paper)"
                      : done
                        ? "var(--color-ink)"
                        : "rgba(26,26,26,0.55)",
                    border: "2px solid var(--color-ink)",
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: 9,
                    letterSpacing: "0.2em",
                    fontWeight: 800,
                    lineHeight: 1,
                    textAlign: "center",
                    boxShadow: active ? "2px 2px 0 var(--color-ink)" : "none",
                  }}
                >
                  0{s.n} · {s.label}
                </div>
              );
            })}
          </div>

          {/* Step 1 — Shipping */}
          {step === "shipping" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (validateShipping()) {
                  setStep("payment");
                }
              }}
              noValidate
            >
              <Field
                label="FULL NAME"
                value={shipping.fullName}
                onChange={(v) => setShipping({ ...shipping, fullName: v })}
                error={errors.fullName}
                placeholder="Jane Doe"
              />
              <Field
                label="EMAIL"
                type="email"
                value={shipping.email}
                onChange={(v) => setShipping({ ...shipping, email: v })}
                error={errors.email}
                placeholder="jane@email.com"
              />
              <Field
                label="PHONE"
                value={shipping.phone}
                onChange={(v) => setShipping({ ...shipping, phone: v })}
                error={errors.phone}
                placeholder="+1 555 123 4567"
              />
              <Field
                label="ADDRESS LINE 1"
                value={shipping.addressLine1}
                onChange={(v) => setShipping({ ...shipping, addressLine1: v })}
                error={errors.addressLine1}
                placeholder="123 Main St"
              />
              <Field
                label="ADDRESS LINE 2 (OPTIONAL)"
                value={shipping.addressLine2 ?? ""}
                onChange={(v) => setShipping({ ...shipping, addressLine2: v })}
                placeholder="Apt 4B"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="CITY"
                  value={shipping.city}
                  onChange={(v) => setShipping({ ...shipping, city: v })}
                  error={errors.city}
                />
                <Field
                  label="STATE / REGION"
                  value={shipping.state ?? ""}
                  onChange={(v) => setShipping({ ...shipping, state: v })}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="POSTAL CODE"
                  value={shipping.postalCode}
                  onChange={(v) => setShipping({ ...shipping, postalCode: v })}
                  error={errors.postalCode}
                />
                <FieldSelect
                  label="COUNTRY"
                  value={shipping.country}
                  onChange={(v) => setShipping({ ...shipping, country: v })}
                  options={TOP_COUNTRIES}
                />
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  style={{
                    padding: "12px 22px",
                    background: "var(--color-gold)",
                    color: "var(--color-ink)",
                    border: "3px solid var(--color-ink)",
                    fontFamily: "var(--font-tattoo), sans-serif",
                    fontSize: 22,
                    letterSpacing: "0.02em",
                    lineHeight: 1,
                    cursor: "pointer",
                    boxShadow: "4px 4px 0 var(--color-crimson), 4px 4px 0 2px var(--color-ink)",
                  }}
                >
                  CONTINUE →
                </button>
              </div>
            </form>
          )}

          {/* Step 2 — Payment */}
          {step === "payment" && (
            <div>
              {/* Order summary */}
              <div
                className="mb-5"
                style={{
                  background: "#fffef8",
                  border: "2px solid var(--color-ink)",
                  boxShadow: "3px 3px 0 var(--color-ink)",
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
                      color: "var(--color-crimson)",
                    }}
                  >
                    N°001 · VOL.01 · TONY DECAY
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-tattoo), sans-serif",
                      fontSize: 24,
                      lineHeight: 1,
                      color: "var(--color-ink)",
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
                    color: "rgba(26,26,26,0.65)",
                    lineHeight: 1.4,
                  }}
                >
                  shipping to {shipping.fullName} · {shipping.city}, {shipping.country}
                </div>
              </div>

              {/* PayPal Smart Button */}
              <div className="mb-3">
                <PayPalButtons
                  style={{ layout: "vertical", height: 48, shape: "rect" }}
                  createOrder={async () => {
                    const r = await fetch("/api/paypal/create-order", {
                      method: "POST",
                    });
                    const j = await r.json();
                    if (!j.id) throw new Error(j.error ?? "create failed");
                    return j.id;
                  }}
                  onApprove={async (data) => {
                    const r = await fetch("/api/paypal/capture", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ orderId: data.orderID }),
                    });
                    const j = await r.json();
                    if (j.error) {
                      setPayError(String(j.error));
                      return;
                    }
                    setOrderNumber(
                      j?.purchase_units?.[0]?.payments?.captures?.[0]?.id ?? data.orderID,
                    );
                    setStep("success");
                  }}
                  onError={(err) => setPayError(String(err))}
                />
              </div>

              {payError && (
                <p
                  style={{
                    fontFamily: "var(--font-display), serif",
                    fontStyle: "italic",
                    fontSize: 13,
                    color: "var(--color-crimson)",
                    marginTop: 10,
                  }}
                >
                  — {payError}
                </p>
              )}

              <div className="mt-5 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep("shipping")}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: 11,
                    letterSpacing: "0.26em",
                    fontWeight: 800,
                    color: "var(--color-ink-soft)",
                  }}
                >
                  ← BACK
                </button>
                <span
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: 10,
                    letterSpacing: "0.22em",
                    fontWeight: 800,
                    color: "rgba(26,26,26,0.5)",
                  }}
                >
                  SANDBOX · NO REAL CHARGE
                </span>
              </div>
            </div>
          )}

          {/* Step 3 — Success */}
          {step === "success" && (
            <div className="py-6 text-center">
              <svg
                aria-hidden
                className="mx-auto"
                width={96}
                height={96}
                viewBox="0 0 100 100"
                style={{
                  transform: "rotate(-8deg)",
                  filter: "drop-shadow(3px 3px 0 var(--color-ink))",
                }}
              >
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="var(--color-crimson)"
                  stroke="var(--color-ink)"
                  strokeWidth="3"
                />
                <path
                  d="M 28 52 L 45 68 L 74 38"
                  fill="none"
                  stroke="var(--color-paper)"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h3
                className="mt-4"
                style={{
                  fontFamily: "var(--font-tattoo), sans-serif",
                  fontSize: "clamp(2rem, 6vw, 3rem)",
                  color: "var(--color-ink)",
                  lineHeight: 0.9,
                }}
              >
                ORDER CONFIRMED /{" "}
                <span
                  title="chūmon kakutei — order confirmed"
                  style={{
                    fontFamily: "var(--font-jp), var(--font-tattoo), sans-serif",
                    color: "var(--color-crimson)",
                  }}
                >
                  注文確定
                </span>
              </h3>
              {orderNumber && (
                <div
                  className="mt-3"
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: 12,
                    letterSpacing: "0.22em",
                    fontWeight: 800,
                    color: "rgba(26,26,26,0.7)",
                  }}
                >
                  ORDER · {orderNumber}
                </div>
              )}
              <p
                className="mx-auto mt-4 max-w-xs"
                style={{
                  fontFamily: "var(--font-display), serif",
                  fontStyle: "italic",
                  fontSize: 15,
                  color: "rgba(26,26,26,0.7)",
                  lineHeight: 1.5,
                }}
              >
                thank you, {shipping.fullName.split(" ")[0] || "friend"}. a confirmation email is on
                its way to {shipping.email}.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6"
                style={{
                  padding: "10px 20px",
                  background: "var(--color-ink)",
                  color: "var(--color-gold)",
                  border: "2px solid var(--color-ink)",
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 11,
                  letterSpacing: "0.28em",
                  fontWeight: 800,
                  lineHeight: 1,
                  cursor: "pointer",
                  boxShadow: "3px 3px 0 var(--color-crimson)",
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

/* ------------- form helpers ------------- */

function Field({
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="mb-4 block">
      <div
        style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 10,
          letterSpacing: "0.3em",
          fontWeight: 800,
          color: "var(--color-crimson)",
          marginBottom: 5,
        }}
      >
        {label}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "10px 14px",
          background: "#fffef8",
          border: `2px solid ${error ? "var(--color-crimson)" : "var(--color-ink)"}`,
          boxShadow: error ? "2px 2px 0 var(--color-crimson)" : "2px 2px 0 var(--color-gold)",
          fontFamily: "var(--font-mono), monospace",
          fontSize: 13,
          color: "var(--color-ink)",
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
            color: "var(--color-crimson)",
            marginTop: 4,
          }}
        >
          — {error}
        </div>
      )}
    </label>
  );
}

function FieldSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly (readonly [string, string])[];
}) {
  return (
    <label className="mb-4 block">
      <div
        style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 10,
          letterSpacing: "0.3em",
          fontWeight: 800,
          color: "var(--color-crimson)",
          marginBottom: 5,
        }}
      >
        {label}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 14px",
          background: "#fffef8",
          border: "2px solid var(--color-ink)",
          boxShadow: "2px 2px 0 var(--color-gold)",
          fontFamily: "var(--font-mono), monospace",
          fontSize: 13,
          color: "var(--color-ink)",
          letterSpacing: "0.02em",
          outline: "none",
        }}
      >
        {options.map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    </label>
  );
}
