"use client";

import { useState } from "react";
import type { ShippingInfo } from "@/lib/types";

/* Shared logic for every checkout-modal variant in /lab/checkout.
   Keeps the 4 styles (arcade, broadsheet, tegata, museum, terminal) as pure
   layout/typography — the state machine and API calls live here. */

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
      if (!r.ok || !d.orderId) throw new Error(d.error || "could not create order");
      setLocalOrderId(d.orderId);
      setOrderNumber(d.orderNumber);
      setStep("payment");
    } catch (err) {
      setPayError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function paypalCreateOrder() {
    const r = await fetch("/api/paypal/create-order", { method: "POST" });
    const j = await r.json();
    if (!j.id) throw new Error(j.error ?? "create failed");
    return j.id as string;
  }

  async function paypalOnApprove(data: { orderID: string }) {
    const r = await fetch("/api/paypal/capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: data.orderID, localOrderId }),
    });
    const j = await r.json();
    if (j.error) {
      setPayError(String(j.error));
      return;
    }
    if (j.orderNumber) setOrderNumber(j.orderNumber);
    setStep("success");
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
