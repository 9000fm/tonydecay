export interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  email: string;
  fullName: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  amountUsd: number;
  createdAt: string;
  paidAt: string | null;
}

export interface Inventory {
  total: number;
  sold: number;
  remaining: number;
}

export type PaymentMethod = "paypal" | "yape";

export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";
