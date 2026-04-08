"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useCheckout } from "@/hooks/useCheckout";
import { trackEvent } from "./MetaPixel";

export function CheckoutModal() {
  const { state, dispatch } = useCheckout();
  const isOpen = state.step !== "idle";
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) return;

    if (isOpen) {
      trackEvent("InitiateCheckout");
      document.body.style.overflow = "hidden";

      gsap.set(overlay, { display: "flex" });
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(
        panel,
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: "power2.out" }
      );
    } else {
      document.body.style.overflow = "";

      gsap.to(panel, {
        opacity: 0,
        scale: 0.95,
        y: 20,
        duration: 0.2,
      });
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.25,
        delay: 0.1,
        onComplete: () => { gsap.set(overlay, { display: "none" }); },
      });
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[90] hidden items-center justify-center bg-black/80 backdrop-blur-sm px-4"
      onClick={() => dispatch({ type: "CLOSE" })}
    >
      <div
        ref={panelRef}
        className="bg-bg-alt border border-border/50 w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold tracking-tight">
            {state.step === "shipping" && "Shipping Information"}
            {state.step === "payment" && "Payment Method"}
            {state.step === "processing" && "Processing..."}
            {state.step === "success" && "Order Confirmed"}
            {state.step === "error" && "Something went wrong"}
          </h2>
          <button
            onClick={() => dispatch({ type: "CLOSE" })}
            className="text-text-muted hover:text-text transition-colors cursor-pointer"
            aria-label="Close"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Step content */}
        {state.step === "shipping" && (
          <p className="text-text-secondary text-sm">
            Shipping form coming soon...
          </p>
        )}

        {state.step === "payment" && (
          <p className="text-text-secondary text-sm">
            Payment options coming soon...
          </p>
        )}

        {state.step === "processing" && (
          <div className="flex flex-col items-center py-12">
            <div className="w-8 h-8 border border-accent border-t-transparent rounded-full animate-spin" />
            <p className="text-text-muted mt-4 text-sm">
              Processing your payment...
            </p>
          </div>
        )}

        {state.step === "success" && (
          <div className="text-center py-8">
            <p className="text-accent text-3xl mb-4">&#10003;</p>
            <p className="font-medium mb-2">Thank you!</p>
            <p className="text-text-secondary text-sm">
              Order {state.orderNumber} has been confirmed.
            </p>
          </div>
        )}

        {state.step === "error" && (
          <div className="text-center py-8">
            <p className="text-cta font-medium mb-2">{state.error}</p>
            <button
              onClick={() => dispatch({ type: "OPEN" })}
              className="text-accent hover:text-accent-hover underline mt-4 text-sm"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
