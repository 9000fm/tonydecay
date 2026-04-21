"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { useCheckout } from "@/hooks/useCheckout";

const REVEAL_DELAY_MS = 8000; // Hidden countdown: badge appears 8s after scroll threshold crossed

interface FloatingBadgeProps {
  visible: boolean;
}

export function FloatingBadge({ visible }: FloatingBadgeProps) {
  const badgeRef = useRef<HTMLDivElement>(null);
  const [dismissed, setDismissed] = useState(false);
  const [inDeepDive, setInDeepDive] = useState(false);
  const { dispatch } = useCheckout();

  // Scroll past ~40% of first viewport → start invisible 8s countdown. When it elapses, reveal badge.
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
      if (window.scrollY > window.innerHeight * 0.4) {
        delayId = setTimeout(reveal, REVEAL_DELAY_MS);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (delayId !== null) clearTimeout(delayId);
      window.removeEventListener("scroll", onScroll);
    };
  }, [visible, dismissed]);

  // Hide when inside the pinned deep-dive gallery so badge doesn't overlap prints
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
      y: 160,
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
      className={`fixed right-6 bottom-6 z-40 cursor-pointer sm:right-8 sm:bottom-8 ${inDeepDive ? "pointer-events-none opacity-0" : ""}`}
      style={{ transform: "translateY(160px)", transition: "opacity 300ms ease" }}
      onClick={handleClick}
    >
      {/* Dismiss button — chevron pointing down (matches slide-down dismiss) */}
      <button
        onClick={handleDismiss}
        className="absolute -top-1 -right-1 z-10 flex h-5 w-5 items-center justify-center rounded-full"
        style={{ backgroundColor: "var(--color-ink)" }}
        aria-label="Dismiss"
      >
        <svg
          width="8"
          height="5"
          viewBox="0 0 8 5"
          fill="none"
          stroke="#F0EBDC"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="1,1 4,4 7,1" />
        </svg>
      </button>

      {/* Rotating badge — dark backdrop, spinning text ring, zoomed print detail at center */}
      <div className="relative h-24 w-24 sm:h-28 sm:w-28">
        {/* Dark circle backdrop so text is always readable */}
        <div
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: "var(--color-bg)", opacity: 0.9 }}
        />
        {/* Spinning text ring */}
        <svg
          viewBox="0 0 120 120"
          className="relative h-full w-full animate-[badge-spin_20s_linear_infinite]"
        >
          <defs>
            <path id="badge-circle" d="M60,60 m-45,0 a45,45 0 1,1 90,0 a45,45 0 1,1 -90,0" />
          </defs>
          <text
            className="fill-current"
            style={{ fontSize: "10px", letterSpacing: "0.2em", fill: "#F0EBDC" }}
          >
            <textPath href="#badge-circle">
              WORLDWIDE SHIPPING &#x2022; LIMITED EDITION &#x2022; VOL. I &#x2022;
            </textPath>
          </text>
        </svg>

        {/* Center: zoomed-in print detail */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            className="h-12 w-12 overflow-hidden rounded-full sm:h-14 sm:w-14"
            style={{ border: "1.5px solid rgba(240,235,220,0.3)" }}
          >
            <Image
              src="/gallery/5.webp"
              alt=""
              width={200}
              height={200}
              unoptimized
              className="h-full w-full scale-[1.2] object-cover"
              style={{ objectPosition: "35% 50%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
