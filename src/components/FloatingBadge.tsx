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
  const { dispatch } = useCheckout();

  // Appear 2s after splash
  useEffect(() => {
    const badge = badgeRef.current;
    if (!badge || !visible || dismissed) return;

    const timeout = setTimeout(() => {
      gsap.to(badge, { opacity: 1, duration: 0.6, ease: "power2.out" });
    }, 2000);

    return () => clearTimeout(timeout);
  }, [visible, dismissed]);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    const badge = badgeRef.current;
    if (!badge) return;
    gsap.to(badge, {
      opacity: 0,
      duration: 0.3,
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
      className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 cursor-pointer"
      style={{ opacity: 0 }}
      onClick={handleClick}
    >
      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="absolute -top-2 -right-2 z-10 w-6 h-6 flex items-center justify-center rounded-full"
        style={{ backgroundColor: "#0D1B2D" }}
        aria-label="Dismiss"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#F0EBDC" strokeWidth="1.5" strokeLinecap="round">
          <line x1="2" y1="2" x2="8" y2="8" />
          <line x1="8" y1="2" x2="2" y2="8" />
        </svg>
      </button>

      {/* Rotating badge — larger, with dark backdrop */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28">
        {/* Dark circle backdrop so text is always readable */}
        <div
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: "#0D1B2D", opacity: 0.9 }}
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
              LIMITED EDITION &#x2022; ONLY 100 &#x2022; VOL I &#x2022; $300 &#x2022;
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
              src="/gallery/5.png"
              alt=""
              width={200}
              height={200}
              className="w-full h-full object-cover scale-[2.8]"
              style={{ objectPosition: "55% 35%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
