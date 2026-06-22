"use client";

import Image from "next/image";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";

/* Shared building blocks for the coming-soon layout.
   Cold / solid palette. Dumb + composable. */

export const ALL_PRINTS = Array.from({ length: 15 }, (_, i) => `/gallery/${i + 1}.webp`);

export function Shell({
  children,
  className = "",
  border = true,
}: {
  children: React.ReactNode;
  className?: string;
  border?: boolean;
}) {
  return (
    <main
      className={`relative min-h-dvh w-full overflow-hidden ${className}`}
      style={{ backgroundColor: "#0b0e12" }}
    >
      {border && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-4 z-20 border sm:inset-6"
          style={{ borderColor: "rgba(150,170,190,0.14)" }}
        />
      )}
      {children}
    </main>
  );
}

export function Wordmark({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <h1
      className={`inline-flex items-center leading-none uppercase ${className}`}
      style={{
        fontFamily: "var(--font-tattoo), sans-serif",
        letterSpacing: "-0.02em",
        gap: "0.07em",
        color: "#e8edf2",
        ...style,
      }}
    >
      <span>TONY</span>
      <span
        style={{
          color: "#7f93a6",
          fontFamily: "sans-serif",
          fontSize: "0.58em",
          fontWeight: 400,
        }}
      >
        ×
      </span>
      <span>DECAY</span>
    </h1>
  );
}

export function Monogram({
  className = "",
  opacity = 0.9,
}: {
  className?: string;
  opacity?: number;
}) {
  return (
    <Image
      src="/gallery/Firma.webp"
      alt="Tony Decay"
      width={120}
      height={120}
      priority
      className={`h-auto ${className}`}
      style={{
        filter: "invert(1) brightness(1.7)",
        opacity,
        animation: "spin-y 9s linear infinite",
      }}
    />
  );
}

export function IgLink({ className = "" }: { className?: string }) {
  return (
    <a
      href="https://www.instagram.com/tony.decay"
      target="_blank"
      rel="noreferrer"
      aria-label="Tony Decay on Instagram"
      className="inline-flex items-center transition-opacity duration-200 hover:opacity-100"
      style={{ color: "#e8edf2", opacity: 0.78 }}
    >
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    </a>
  );
}

export function ComingSoon({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <p className={`font-mono uppercase ${className}`} style={{ color: "#e8edf2", ...style }}>
      <span>Coming soon</span>
      <span className="coming-dots" aria-hidden />
    </p>
  );
}

export function ShippingLine({ className = "" }: { className?: string }) {
  return (
    <p className={`font-mono uppercase ${className}`} style={{ color: "rgba(170,190,210,0.5)" }}>
      Worldwide shipping · 50 signed sets
    </p>
  );
}

const PRINT_GRADE = "brightness(0.9) contrast(1.05) saturate(0.72) hue-rotate(-6deg)";

export function PrintCard({
  src,
  className = "",
  style,
  onClick,
}: {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}) {
  // Crossfade on swap: keep the previous print underneath at full opacity, and fade
  // the NEW one in once it has actually loaded (not on mount - the webp may not be
  // decoded yet, which would make the fade finish before the image paints).
  // Adjust state during render (React's prop-change pattern) instead of an effect.
  const [front, setFront] = useState(src);
  const [back, setBack] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(true);

  if (src !== front) {
    setBack(front);
    setFront(src);
    setLoaded(false);
  }

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden border-2 ${onClick ? "cursor-pointer" : ""} ${className}`}
      style={{
        aspectRatio: "3 / 4",
        borderColor: "rgba(180,200,220,0.45)",
        boxShadow: "0 14px 30px -16px rgba(0,0,0,0.6)",
        backgroundColor: "#0b0e12",
        ...style,
      }}
    >
      {back && (
        <Image
          src={back}
          alt=""
          fill
          sizes="440px"
          className="object-cover"
          style={{ filter: PRINT_GRADE }}
        />
      )}
      <Image
        key={front}
        src={front}
        alt=""
        fill
        sizes="440px"
        className="object-cover"
        onLoad={() => setLoaded(true)}
        style={{
          filter: PRINT_GRADE,
          opacity: back && !loaded ? 0 : 1,
          transition: back ? "opacity 0.85s ease" : undefined,
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, rgba(11,14,18,0.04) 0%, rgba(11,14,18,0.3) 100%)",
          mixBlendMode: "multiply",
        }}
      />
    </div>
  );
}

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

interface TurnstileApi {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id: string) => void;
}
function turnstileApi(): TurnstileApi | undefined {
  return (globalThis as { turnstile?: TurnstileApi }).turnstile;
}

export function EmailCapture({
  className = "",
  stack = false,
}: {
  className?: string;
  stack?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot - real users never see/fill this
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  // Render the Turnstile widget once its script has loaded. No-op without a site key.
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;
    let stop = false;
    function render() {
      const ts = turnstileApi();
      if (!ts || !widgetRef.current || widgetIdRef.current) return;
      widgetIdRef.current = ts.render(widgetRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: "dark",
        callback: (t: string) => setToken(t),
        "expired-callback": () => setToken(""),
        "error-callback": () => setToken(""),
      });
    }
    render();
    let tries = 0;
    const id = setInterval(() => {
      tries += 1;
      if (stop || widgetIdRef.current || tries > 25) return clearInterval(id);
      render();
    }, 200);
    return () => {
      stop = true;
      clearInterval(id);
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || status === "loading") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website, turnstileToken: token }),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("done");
    } catch {
      setStatus("error");
      // Reset Turnstile so the retry gets a fresh, unused token.
      const ts = turnstileApi();
      if (ts && widgetIdRef.current) {
        ts.reset(widgetIdRef.current);
        setToken("");
      }
    }
  }

  if (status === "done") {
    return (
      <div className={`w-full ${className}`}>
        <p className="font-mono text-sm tracking-wide" style={{ color: "#9fb8cc" }}>
          You&apos;re on the list. We&apos;ll email you when it drops.
        </p>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {TURNSTILE_SITE_KEY && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
        />
      )}
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
        <div className={`flex w-full gap-3 ${stack ? "flex-col" : "flex-col sm:flex-row"}`}>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 border px-4 py-3 font-mono text-sm outline-none"
            style={{
              backgroundColor: "rgba(150,170,190,0.05)",
              borderColor: "rgba(150,170,190,0.3)",
              color: "#e8edf2",
            }}
          />
          {/* honeypot field - hidden from users, only bots fill it */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="absolute h-0 w-0 overflow-hidden opacity-0"
            style={{ left: "-9999px" }}
          />
          <button
            type="submit"
            disabled={status === "loading" || (Boolean(TURNSTILE_SITE_KEY) && !token)}
            className="border px-6 py-3 font-mono text-sm font-semibold tracking-[0.18em] whitespace-nowrap uppercase disabled:opacity-60"
            style={{ backgroundColor: "#e8edf2", borderColor: "#e8edf2", color: "#0b0e12" }}
          >
            {status === "loading" ? "..." : "Notify me"}
          </button>
        </div>
        {TURNSTILE_SITE_KEY && <div ref={widgetRef} className="mt-1" />}
      </form>
      {status === "error" && (
        <p className="mt-2 font-mono text-xs tracking-wide" style={{ color: "#d98a8a" }}>
          Something went wrong. Please try again.
        </p>
      )}
    </div>
  );
}
