"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { PLACEHOLDER_PRINTS } from "@/lib/constants";

interface SplashScreenProps {
  onEnter: () => void;
}

const CIRCLE_DIAMETER = 144; // matches w-36 h-36

// Update the conic-gradient ring + counter text from a single progress object.
function renderProgress(
  value: number,
  counterEl: HTMLSpanElement | null,
  ringEl: HTMLDivElement | null
) {
  const val = Math.round(value);
  if (counterEl) counterEl.textContent = `${val}`;
  if (ringEl) {
    const deg = (value / 100) * 360;
    ringEl.style.background = `conic-gradient(from 0deg, rgba(255,255,255,0.95) ${deg}deg, transparent ${deg}deg)`;
  }
}

export function SplashScreen({ onEnter }: SplashScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const circleWrapRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const counterStackRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const growerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const imagesReady = useRef(false);

  // Preload images in background
  useEffect(() => {
    const promises = PLACEHOLDER_PRINTS.map(
      (print) =>
        new Promise<void>((resolve) => {
          const img = new window.Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.crossOrigin = "anonymous";
          img.src = print.src;
        })
    );
    Promise.all(promises).then(() => {
      imagesReady.current = true;
    });
  }, []);

  // Dramatic 4-phase loader
  useEffect(() => {
    const progress = { value: 0 };
    const onUpdate = () =>
      renderProgress(progress.value, counterRef.current, ringRef.current);

    const tl = gsap.timeline({
      onComplete: () => {
        const check = () => {
          if (imagesReady.current) setLoaded(true);
          else requestAnimationFrame(check);
        };
        check();
      },
    });

    tl.to(progress, { value: 18, duration: 0.7, ease: "power2.in", onUpdate });
    tl.to(progress, { value: 88, duration: 0.6, ease: "power1.out", onUpdate });
    tl.to(progress, { value: 96, duration: 0.7, ease: "power2.out", onUpdate });
    tl.to(progress, { value: 100, duration: 1.0, ease: "power4.out", onUpdate });

    return () => {
      tl.kill();
    };
  }, []);

  // When loaded — counter swaps to "enter"
  useEffect(() => {
    if (!loaded) return;
    const counter = counterRef.current;
    if (!counter) return;

    gsap.to(counter, {
      opacity: 0,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => {
        counter.textContent = "enter";
        counter.style.letterSpacing = "0.15em";
        counter.style.cursor = "pointer";
        gsap.to(counter, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      },
    });
  }, [loaded]);

  // Click → fade logo + counter, grow the circle, then onEnter
  const handleEnter = useCallback(() => {
    if (!loaded) return;
    const wrap = circleWrapRef.current;
    const counterStack = counterStackRef.current;
    const logo = logoRef.current;
    const grower = growerRef.current;
    if (!wrap || !counterStack || !grower) {
      onEnter();
      return;
    }

    const targetScale =
      (Math.hypot(window.innerWidth, window.innerHeight) / CIRCLE_DIAMETER) *
      1.4;

    const tl = gsap.timeline({ onComplete: onEnter });
    tl.to([logo, counterStack].filter(Boolean), {
      opacity: 0,
      duration: 0.25,
      ease: "power2.in",
    });
    tl.set(grower, { opacity: 1 }, ">-0.05");
    tl.to(
      grower,
      { scale: targetScale, duration: 1.0, ease: "power3.inOut" },
      "<"
    );
  }, [loaded, onEnter]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-bg flex items-center justify-center overflow-hidden"
    >
      {/* Stacked column: logo above, circle below, harmonious gap */}
      <div className="flex flex-col items-center gap-12">
        {/* Logo — sits above the circle, organic / hand-drawn, on its own */}
        <div
          ref={logoRef}
          className="relative w-28 h-14 select-none"
          style={{ filter: "invert(1) brightness(1.2)" }}
        >
          <Image
            src="/gallery/tonydecay-logo.png"
            alt="Tony Decay"
            fill
            priority
            className="object-contain"
          />
        </div>

        {/* Circle — just the loader system: counter / enter */}
        <div
          ref={circleWrapRef}
          className="relative w-36 h-36"
          onClick={handleEnter}
          style={{ cursor: loaded ? "pointer" : "default" }}
        >
          {/* Conic-gradient ring (loading) */}
          <div
            ref={ringRef}
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, rgba(255,255,255,0.95) 0deg, transparent 0deg)",
              mixBlendMode: "difference",
            }}
          />

          {/* Counter / enter — alone in the circle, mono is fine here */}
          <div
            ref={counterStackRef}
            className="absolute inset-0 flex items-center justify-center select-none"
          >
            <span
              ref={counterRef}
              className="text-white font-mono text-sm tabular-nums"
              style={{
                letterSpacing: "0.05em",
                mixBlendMode: "difference",
              }}
            >
              0
            </span>
          </div>

          {/* Grower — hidden until click, expands to become the cream homepage */}
          <div
            ref={growerRef}
            className="absolute inset-0 rounded-full bg-paper pointer-events-none"
            style={{ opacity: 0 }}
          />
        </div>
      </div>
    </div>
  );
}
