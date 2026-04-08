"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

interface SplashScreenProps {
  onEnter: () => void;
}

// Tony's Vintage Flash palette — counter cycles through these
const FLASH_PALETTE = [
  "#02B2A8", // teal
  "#3789C9", // blue
  "#322A2A", // warm dark
  "#B00307", // crimson
  "#DF7695", // rose
];

export function SplashScreen({ onEnter }: SplashScreenProps) {
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const counter = counterRef.current;
    if (!counter) return;

    const progress = { value: 0 };
    const tween = gsap.to(progress, {
      value: 100,
      duration: 1.5,
      ease: "power2.inOut",
      onUpdate: () => {
        const val = Math.round(progress.value);
        counter.textContent = `${val}`;
        // 5 colors over 100 ticks → each color spans 20 ticks
        const idx = Math.min(
          Math.floor(val / 20),
          FLASH_PALETTE.length - 1
        );
        counter.style.color = FLASH_PALETTE[idx];
      },
      onComplete: () => {
        // Brief hold on 100, then dismiss
        gsap.delayedCall(0.25, onEnter);
      },
    });

    return () => {
      tween.kill();
    };
  }, [onEnter]);

  return (
    <div className="fixed inset-0 z-[100] bg-paper flex items-center justify-center overflow-hidden">
      <span
        ref={counterRef}
        className="font-tattoo tabular-nums leading-none select-none"
        style={{
          fontSize: "min(38vw, 38vh)",
          color: FLASH_PALETTE[0],
          letterSpacing: "-0.04em",
        }}
      >
        0
      </span>
    </div>
  );
}
