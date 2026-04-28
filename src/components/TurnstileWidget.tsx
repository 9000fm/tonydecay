"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

/* Invisible Cloudflare Turnstile widget. Renders a 1x1 anchor div that the
   Turnstile script attaches to, calls back with a token. Caller stashes
   the token via onToken(). If NEXT_PUBLIC_TURNSTILE_SITE_KEY is missing,
   the widget renders nothing and onToken is never called — the server
   side mirrors this with verifyTurnstile() returning ok when the secret
   is missing, so checkout still works pre-env-config. */

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: string | HTMLElement,
        params: { sitekey: string; callback: (token: string) => void; size?: string },
      ) => string;
      reset: (id?: string) => void;
    };
  }
}

interface Props {
  onToken: (token: string) => void;
}

export function TurnstileWidget({ onToken }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const renderedRef = useRef<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey) return;
    let cancelled = false;
    const tryRender = () => {
      if (cancelled) return;
      if (!window.turnstile || !ref.current) {
        window.setTimeout(tryRender, 200);
        return;
      }
      if (renderedRef.current) return;
      renderedRef.current = window.turnstile.render(ref.current, {
        sitekey: siteKey,
        size: "invisible",
        callback: (token: string) => onToken(token),
      });
    };
    tryRender();
    return () => {
      cancelled = true;
    };
  }, [siteKey, onToken]);

  if (!siteKey) return null;
  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
      />
      <div ref={ref} aria-hidden style={{ width: 0, height: 0 }} />
    </>
  );
}
