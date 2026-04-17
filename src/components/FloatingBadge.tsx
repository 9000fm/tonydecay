"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { useCheckout } from "@/hooks/useCheckout";

interface FloatingBadgeProps {
  visible: boolean;
}

export function FloatingBadge({ visible }: FloatingBadgeProps) {
  const badgeRef = useRef<HTMLDivElement>(null);
  const [dismissed, setDismissed] = useState(false);
  const [inDeepDive, setInDeepDive] = useState(false);
  const { dispatch } = useCheckout();

  // Appear after either 12 seconds of engagement OR once user scrolls past the hero —
  // whichever comes first. Premium pace, doesn't interrupt initial exploration.
  useEffect(() => {
    const badge = badgeRef.current;
    if (!badge || !visible || dismissed) return;

    let revealed = false;
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      gsap.to(badge, {
        y: 0,
        duration: 0.7,
        ease: "power3.out",
      });
    };

    const timer = setTimeout(reveal, 12000);
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.5) reveal();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [visible, dismissed]);

  // Hide when inside the pinned deep-dive gallery so badge doesn't overlap prints
  useEffect(() => {
    const deepDive = document.querySelector('[data-deep-dive]');
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
      className={`fixed z-40 cursor-pointer bottom-6 right-6 sm:bottom-8 sm:right-8 ${inDeepDive ? "opacity-0 pointer-events-none" : ""}`}
      style={{ transform: "translateY(160px)", transition: "opacity 300ms ease" }}
      onClick={handleClick}
    >
      {/* Dismiss button — chevron pointing down (matches slide-down dismiss) */}
      <button
        onClick={handleDismiss}
        className="absolute -top-1 -right-1 z-10 w-5 h-5 flex items-center justify-center rounded-full"
        style={{ backgroundColor: "var(--color-ink)" }}
        aria-label="Dismiss"
      >
        <svg width="8" height="5" viewBox="0 0 8 5" fill="none" stroke="#F0EBDC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="1,1 4,4 7,1" />
        </svg>
      </button>

      {/* Rotating badge — larger, with dark backdrop */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28">
        {/* Dark circle backdrop so text is always readable */}
        <div
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: "var(--color-bg)", opacity: 0.9 }}
        />
        {/* Spinning text ring */}
        <svg
          viewBox="0 0 120 120"
          className="relative w-full h-full animate-[badge-spin_20s_linear_infinite]"
        >
          <defs>
            <path
              id="badge-circle"
              d="M60,60 m-45,0 a45,45 0 1,1 90,0 a45,45 0 1,1 -90,0"
            />
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

        {/* Center: zoomed-in Charizard/fire detail */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden"
            style={{ border: "1.5px solid rgba(240,235,220,0.3)" }}
          >
            <Image
              src="/gallery/5.webp"
              alt=""
              width={200}
              height={200}
              unoptimized
              className="w-full h-full object-cover scale-[1.2]"
              style={{ objectPosition: "35% 50%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
