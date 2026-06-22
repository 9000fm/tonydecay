"use client";

import Image from "next/image";
import { useState } from "react";

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
        gap: "0.16em",
        color: "#e8edf2",
        ...style,
      }}
    >
      <span>TONY</span>
      <span
        style={{
          color: "#7f93a6",
          fontFamily: "var(--font-jp), var(--font-tattoo), sans-serif",
          fontSize: "0.5em",
        }}
      >
        の
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

export function EmailCapture({
  className = "",
  stack = false,
}: {
  className?: string;
  stack?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot - real users never see/fill this
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || status === "loading") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website }),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("done");
    } catch {
      setStatus("error");
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
      <form
        onSubmit={handleSubmit}
        className={`flex w-full gap-3 ${stack ? "flex-col" : "flex-col sm:flex-row"}`}
      >
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
          disabled={status === "loading"}
          className="border px-6 py-3 font-mono text-sm font-semibold tracking-[0.18em] whitespace-nowrap uppercase disabled:opacity-60"
          style={{ backgroundColor: "#e8edf2", borderColor: "#e8edf2", color: "#0b0e12" }}
        >
          {status === "loading" ? "..." : "Notify me"}
        </button>
      </form>
      {status === "error" && (
        <p className="mt-2 font-mono text-xs tracking-wide" style={{ color: "#d98a8a" }}>
          Something went wrong. Please try again.
        </p>
      )}
    </div>
  );
}
