"use client";

import { useState } from "react";
import type { ShippingInfo } from "@/lib/types";

type Step = "review" | "shipping" | "payment" | "success";

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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type { Step };

function friendlyError(raw: unknown): string {
  const s = (raw instanceof Error ? raw.message : String(raw)).toLowerCase();
  if (s.includes("rate_limited")) return "too many tries - wait 30 seconds and retry";
  if (s.includes("bot_check_failed")) return "checking you're human - hold on a sec, then retry";
  if (s.includes("sold_out")) return "sold out - the last set just went";
  if (s.includes("invalid_client") || s.includes("paypal token 401"))
    return "payment service is temporarily unavailable - try again shortly";
  if (
    s.includes("fetch failed") ||
    s.includes("failed to fetch") ||
    s.includes("network") ||
    s.includes("enotfound") ||
    s.includes("econnrefused") ||
    s.includes("etimedout") ||
    s.includes("aborted")
  )
    return "couldn't reach our order service - try again in a moment";
  return "couldn't complete - please try again or email tony@tonydecay.com";
}

export function useCheckoutFlow() {
  const [step, setStep] = useState<Step>("review");
  const [shipping, setShipping] = useState<ShippingInfo>(EMPTY_SHIPPING);
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingInfo, string>>>({});
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [localOrderId, setLocalOrderId] = useState<string | null>(null);
  const [payError, setPayError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  function validateShipping() {
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
  }

  async function submitShipping(e: React.FormEvent) {
    e.preventDefault();
    if (!validateShipping()) return;
    setPayError(null);

    // Idempotency: if we already created an order this session, skip the POST
    // and resume at payment. Prevents duplicate Supabase rows on retry.
    if (localOrderId) {
      setStep("payment");
      return;
    }

    setSubmitting(true);
    try {
      const r = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shipping,
          paymentMethod: "paypal",
          productSlug: "vol-01",
          turnstileToken,
        }),
      });
      const d = await r.json();
      if (!r.ok || !d.orderId) {
        const raw = d.error || `http_${r.status}`;
        console.error("[checkout] orders/create failed", raw);
        throw new Error(raw);
      }
      setLocalOrderId(d.orderId);
      setOrderNumber(d.orderNumber);
      setStep("payment");
    } catch (err) {
      console.error("[checkout] submitShipping", err);
      setPayError(friendlyError(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function paypalCreateOrder() {
    try {
      const r = await fetch("/api/paypal/create-order", { method: "POST" });
      const j = await r.json();
      if (!j.id) throw new Error(j.error ?? "create failed");
      return j.id as string;
    } catch (err) {
      console.error("[checkout] paypalCreateOrder", err);
      setPayError(friendlyError(err));
      throw err;
    }
  }

  async function paypalOnApprove(data: { orderID: string }) {
    try {
      const r = await fetch("/api/paypal/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: data.orderID, localOrderId }),
      });
      const j = await r.json();
      if (j.error) {
        console.error("[checkout] capture", j.error);
        setPayError(friendlyError(j.error));
        return;
      }
      if (j.orderNumber) setOrderNumber(j.orderNumber);
      setStep("success");
    } catch (err) {
      console.error("[checkout] paypalOnApprove", err);
      setPayError(friendlyError(err));
    }
  }

  function paypalOnError(err: unknown) {
    console.error("[checkout] paypal SDK error", err);
    setPayError(friendlyError(err));
  }

  function reset() {
    setStep("review");
    setShipping(EMPTY_SHIPPING);
    setErrors({});
    setOrderNumber(null);
    setLocalOrderId(null);
    setPayError(null);
    setSubmitting(false);
  }

  return {
    step,
    setStep,
    shipping,
    setShipping,
    errors,
    orderNumber,
    submitting,
    payError,
    setPayError,
    submitShipping,
    paypalCreateOrder,
    paypalOnApprove,
    paypalOnError,
    reset,
    setTurnstileToken,
  };
}

export const COUNTRY_OPTIONS: readonly (readonly [string, string])[] = [
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
];
