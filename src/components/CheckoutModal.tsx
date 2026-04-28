"use client";

import { useEffect, useRef } from "react";
import { useCheckout } from "@/hooks/useCheckout";
import { CheckoutModalArcadeBody } from "./CheckoutModalArcadeBody";
import { trackEvent } from "./MetaPixel";

/* Thin bridge between the global useCheckout reducer and the checkout body.
   The reducer controls open/close (BUY buttons dispatch OPEN, overlay/X
   dispatch CLOSE). The body manages step state + API calls via its own
   useCheckoutFlow hook. Fires Meta Pixel InitiateCheckout on open. */

export function CheckoutModal() {
  const { state, dispatch } = useCheckout();
  const open = state.step !== "idle";
  const prevOpen = useRef(false);

  useEffect(() => {
    if (open && !prevOpen.current) {
      trackEvent("InitiateCheckout");
    }
    prevOpen.current = open;
  }, [open]);

  return <CheckoutModalArcadeBody open={open} onClose={() => dispatch({ type: "CLOSE" })} />;
}
