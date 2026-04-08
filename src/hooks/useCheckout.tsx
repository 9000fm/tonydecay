"use client";

import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from "react";
import type { ShippingInfo, PaymentMethod } from "@/lib/types";

type CheckoutStep =
  | "idle"
  | "shipping"
  | "payment"
  | "processing"
  | "success"
  | "error";

interface CheckoutState {
  step: CheckoutStep;
  shipping: ShippingInfo | null;
  paymentMethod: PaymentMethod | null;
  orderId: string | null;
  orderNumber: string | null;
  error: string | null;
}

type CheckoutAction =
  | { type: "OPEN" }
  | { type: "SET_SHIPPING"; payload: ShippingInfo }
  | { type: "SET_PAYMENT"; payload: PaymentMethod }
  | { type: "START_PROCESSING" }
  | { type: "COMPLETE"; payload: { orderId: string; orderNumber: string } }
  | { type: "FAIL"; payload: string }
  | { type: "CLOSE" };

const initialState: CheckoutState = {
  step: "idle",
  shipping: null,
  paymentMethod: null,
  orderId: null,
  orderNumber: null,
  error: null,
};

function checkoutReducer(
  state: CheckoutState,
  action: CheckoutAction
): CheckoutState {
  switch (action.type) {
    case "OPEN":
      return { ...initialState, step: "shipping" };
    case "SET_SHIPPING":
      return { ...state, step: "payment", shipping: action.payload };
    case "SET_PAYMENT":
      return { ...state, paymentMethod: action.payload };
    case "START_PROCESSING":
      return { ...state, step: "processing" };
    case "COMPLETE":
      return {
        ...state,
        step: "success",
        orderId: action.payload.orderId,
        orderNumber: action.payload.orderNumber,
      };
    case "FAIL":
      return { ...state, step: "error", error: action.payload };
    case "CLOSE":
      return initialState;
    default:
      return state;
  }
}

const CheckoutContext = createContext<{
  state: CheckoutState;
  dispatch: Dispatch<CheckoutAction>;
} | null>(null);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(checkoutReducer, initialState);

  return (
    <CheckoutContext.Provider value={{ state, dispatch }}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return context;
}
