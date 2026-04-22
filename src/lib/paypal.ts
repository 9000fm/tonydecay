import "server-only";

const PAYPAL_API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

export async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !secret) {
    throw new Error(
      `PayPal credentials missing: clientId=${clientId ? "set" : "MISSING"} secret=${
        secret ? "set" : "MISSING"
      }`,
    );
  }

  const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");

  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`PayPal token ${res.status} @ ${PAYPAL_API_BASE}: ${text}`);
  }
  const data = JSON.parse(text);
  if (!data.access_token) {
    throw new Error(`PayPal token response missing access_token: ${text}`);
  }
  return data.access_token;
}

export async function createPayPalOrder(amountUsd: number): Promise<string> {
  const accessToken = await getPayPalAccessToken();

  const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: amountUsd.toFixed(2),
          },
          description: "Tony Decay Limited Edition Collection",
        },
      ],
    }),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`PayPal create-order ${res.status}: ${text}`);
  }
  const data = JSON.parse(text);
  if (!data.id) {
    throw new Error(`PayPal create-order response missing id: ${text}`);
  }
  return data.id;
}

export async function capturePayPalOrder(paypalOrderId: string) {
  const accessToken = await getPayPalAccessToken();

  const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${paypalOrderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`PayPal capture ${res.status}: ${text}`);
  }
  return JSON.parse(text);
}
