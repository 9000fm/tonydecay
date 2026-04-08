"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { PLACEHOLDER_PRINTS } from "@/lib/constants";

interface SplashScreenProps {
  onEnter: () => void;
}

const CIRCLE_DIAMETER = 144; // matches w-36 h-36

const PROGRESSION_LABELS = [
  { threshold: 0, text: "LIMITED EDITION" },
  { threshold: 25, text: "100 SETS" },
  { threshold: 50, text: "15 PRINTS" },
  { threshold: 75, text: "MMXXVI" },
];

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

function labelForValue(value: number): string {
  let label = PROGRESSION_LABELS[0].text;
  for (const l of PROGRESSION_LABELS) {
    if (value >= l.threshold) label = l.text;
  }
  return label;
}

export function SplashScreen({ onEnter }: SplashScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const circleWrapRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const textStackRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const growerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [currentLabel, setCurrentLabel] = useState(PROGRESSION_LABELS[0].text);
  const imagesReady = useRef(false);
  const lastLabel = useRef(PROGRESSION_LABELS[0].text);

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

  // Dramatic 4-phase loader: slow build → burst → deceleration → agonizing crawl
  useEffect(() => {
    const progress = { value: 0 };
    const onUpdate = () => {
      renderProgress(progress.value, counterRef.current, ringRef.current);
      // Check if label needs to swap
      const next = labelForValue(progress.value);
      if (next !== lastLabel.current) {
        lastLabel.current = next;
        setCurrentLabel(next);
      }
    };

    const tl = gsap.timeline({
      onComplete: () => {
        const check = () => {
          if (imagesReady.current) setLoaded(true);
          else requestAnimationFrame(check);
        };
        check();
      },
    });

    // Phase 1 — slow build from zero, accelerating (anticipation)
    tl.to(progress, { value: 18, duration: 0.7, ease: "power2.in", onUpdate });
    // Phase 2 — burst forward, releasing tension
    tl.to(progress, { value: 88, duration: 0.6, ease: "power1.out", onUpdate });
    // Phase 3 — momentum draining, decelerating
    tl.to(progress, { value: 96, duration: 0.7, ease: "power2.out", onUpdate });
    // Phase 4 — agonizing crawl, max tension before arrival
    tl.to(progress, { value: 100, duration: 1.0, ease: "power4.out", onUpdate });

    return () => {
      tl.kill();
    };
  }, []);

  // Crossfade label on change
  useEffect(() => {
    const el = labelRef.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { opacity: 0, y: 4 },
      { opacity: 0.6, y: 0, duration: 0.35, ease: "power2.out" }
    );
  }, [currentLabel]);

  // When loaded — counter swaps to "enter", label fades out
  useEffect(() => {
    if (!loaded) return;
    const counter = counterRef.current;
    const label = labelRef.current;
    if (!counter) return;

    if (label) {
      gsap.to(label, { opacity: 0, duration: 0.3, ease: "power2.in" });
    }

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

  // Click → fade out text, grow the circle to cover the viewport, then onEnter
  const handleEnter = useCallback(() => {
    if (!loaded) return;
    const wrap = circleWrapRef.current;
    const text = textStackRef.current;
    const grower = growerRef.current;
    if (!wrap || !text || !grower) {
      onEnter();
      return;
    }

    const targetScale =
      (Math.hypot(window.innerWidth, window.innerHeight) / CIRCLE_DIAMETER) *
      1.4;

    const tl = gsap.timeline({ onComplete: onEnter });
    tl.to(text, { opacity: 0, duration: 0.25, ease: "power2.in" });
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
      className="fixed inset-0 z-[100] bg-bg flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Circle wrap — logo + counter live inside, ring fills around */}
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

        {/* Logo + counter stack */}
        <div
          ref={textStackRef}
          className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 select-none"
        >
          <div className="relative w-20 h-12">
            <Image
              src="/gallery/tonydecay-logo.png"
              alt="Tony Decay"
              fill
              priority
              className="object-contain"
              style={{ filter: "invert(1) brightness(1.1)" }}
            />
          </div>
          <span
            ref={counterRef}
            className="text-white font-mono text-[13px] tabular-nums"
            style={{ letterSpacing: "0.05em", mixBlendMode: "difference" }}
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

      {/* Sequential progression label below the circle */}
      <div
        ref={labelRef}
        className="font-tattoo text-white/60 text-xs uppercase mt-8 select-none"
        style={{ letterSpacing: "0.2em", opacity: 0 }}
      >
        {currentLabel}
      </div>
    </div>
  );
}
