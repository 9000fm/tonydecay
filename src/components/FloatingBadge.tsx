"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useCheckout } from "@/hooks/useCheckout";

const REVEAL_DELAY_MS = 1500;

interface FloatingBadgeProps {
  visible: boolean;
}

export function FloatingBadge({ visible }: FloatingBadgeProps) {
  const badgeRef = useRef<HTMLDivElement>(null);
  const [dismissed, setDismissed] = useState(false);
  const [inDeepDive, setInDeepDive] = useState(false);
  const { dispatch } = useCheckout();

  useEffect(() => {
    const badge = badgeRef.current;
    if (!badge || !visible || dismissed) return;

    let revealed = false;
    let delayId: ReturnType<typeof setTimeout> | null = null;

    const reveal = () => {
      if (revealed) return;
      revealed = true;
      gsap.to(badge, { y: 0, duration: 0.7, ease: "power3.out" });
    };

    const onScroll = () => {
      if (revealed || delayId !== null) return;
      if (window.scrollY > 120) {
        delayId = setTimeout(reveal, REVEAL_DELAY_MS);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (delayId !== null) clearTimeout(delayId);
      window.removeEventListener("scroll", onScroll);
    };
  }, [visible, dismissed]);

  useEffect(() => {
    const deepDive = document.querySelector("[data-deep-dive]");
    if (!deepDive) return;

    let rafId: number | null = null;
    const tick = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const rect = deepDive.getBoundingClientRect();
        setInDeepDive(rect.top <= 10 && rect.bottom >= window.innerHeight - 10);
      });
    };
    tick();
    window.addEventListener("scroll", tick, { passive: true });
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", tick);
    };
  }, []);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    const badge = badgeRef.current;
    if (!badge) return;
    gsap.to(badge, {
      y: 180,
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => setDismissed(true),
    });
  };

  const handleClick = () => {
    dispatch({ type: "OPEN" });
  };

  if (dismissed) return null;

  return (
    <div
      ref={badgeRef}
      className={`fixed right-5 bottom-5 z-40 cursor-pointer sm:right-7 sm:bottom-7 ${
        inDeepDive ? "pointer-events-none opacity-0" : ""
      }`}
      style={{
        transform: "translateY(180px)",
        transition: "opacity 300ms ease",
        filter: "drop-shadow(4px 4px 0 var(--color-ink))",
      }}
      onClick={handleClick}
      aria-label="Order now Vol.01"
    >
      {/* Dismiss chevron — crimson pill */}
      <button
        onClick={handleDismiss}
        className="absolute -top-1 -right-1 z-20 flex h-6 w-6 items-center justify-center rounded-full"
        style={{
          backgroundColor: "var(--color-crimson)",
          border: "2px solid var(--color-ink)",
        }}
        aria-label="Dismiss"
      >
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          stroke="#F0EBDC"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="1,1 5,5 9,1" />
        </svg>
      </button>

      {/* Gold disk with ink border */}
      <div className="relative h-[112px] w-[112px] sm:h-32 sm:w-32">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "var(--color-gold)",
            border: "3px solid var(--color-ink)",
          }}
        />

        {/* Spinning ring text */}
        <svg
          viewBox="0 0 120 120"
          className="relative h-full w-full animate-[badge-spin_22s_linear_infinite]"
          aria-hidden
        >
          <defs>
            <path id="badge-circle-path" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
          </defs>
          <text
            dominantBaseline="middle"
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: "13px",
              letterSpacing: "0.06em",
              fontWeight: 900,
              fill: "var(--color-ink)",
            }}
          >
            <textPath href="#badge-circle-path" startOffset="0">
              WORLDWIDE SHIPPING · ORDER NOW ·
            </textPath>
          </text>
        </svg>

        {/* Center punch — paper disk with Firma */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            className="flex h-[56px] w-[56px] items-center justify-center overflow-hidden rounded-full sm:h-[64px] sm:w-[64px]"
            style={{
              background: "var(--color-paper)",
              border: "2px solid var(--color-ink)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/gallery/Firma.webp"
              alt=""
              style={{
                height: "70%",
                width: "auto",
                objectFit: "contain",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
