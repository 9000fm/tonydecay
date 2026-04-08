"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { PLACEHOLDER_PRINTS } from "@/lib/constants";

interface SplashScreenProps {
  onEnter: () => void;
}

// Vintage Flash palette — extracted from Tony's actual flash sheets
const FLASH_PALETTE = [
  "#02B2A8", // teal
  "#3789C9", // blue
  "#322A2A", // warm dark
  "#B00307", // crimson
  "#DF7695", // rose
];

const FINAL_COLOR = "#322A2A"; // settle to warm dark
const PIXEL_REVEAL = 0.8; // total reveal — fast
const JITTER = 0.1; // light jitter, the wave is short so chaos is contained

export function SplashScreen({ onEnter }: SplashScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pixelRefs = useRef<HTMLDivElement[]>([]);
  const logoStackRef = useRef<HTMLDivElement>(null);
  const promptRef = useRef<HTMLSpanElement>(null);
  const growerRef = useRef<HTMLDivElement>(null);
  const [grid, setGrid] = useState({ cols: 0, rows: 0, size: 48 });
  const [loaded, setLoaded] = useState(false);
  const imagesReady = useRef(false);
  const pixelsReady = useRef(false);

  // Preload prints in background — gates the ENTER state
  useEffect(() => {
    const promises = PLACEHOLDER_PRINTS.map(
      (p) =>
        new Promise<void>((resolve) => {
          const img = new window.Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.crossOrigin = "anonymous";
          img.src = p.src;
        })
    );
    Promise.all(promises).then(() => {
      imagesReady.current = true;
      if (pixelsReady.current) setLoaded(true);
    });
  }, []);

  // Compute grid on mount + resize
  useEffect(() => {
    const compute = () => {
      const isMobile = window.innerWidth < 640;
      const size = isMobile ? 32 : 48;
      const cols = Math.ceil(window.innerWidth / size);
      const rows = Math.ceil(window.innerHeight / size);
      setGrid({ cols, rows, size });
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  // Build the pixel array — each gets a random GB glitch color + jitter
  const pixels = useMemo(() => {
    const list: {
      top: number;
      left: number;
      key: string;
      glitch: string;
      jitter: number;
    }[] = [];
    for (let r = 0; r < grid.rows; r++) {
      for (let c = 0; c < grid.cols; c++) {
        list.push({
          top: r * grid.size,
          left: c * grid.size,
          key: `${r}-${c}`,
          glitch:
            FLASH_PALETTE[Math.floor(Math.random() * FLASH_PALETTE.length)],
          jitter: Math.random() * JITTER,
        });
      }
    }
    return list;
  }, [grid]);

  // Run the reveal animation when grid is ready
  useEffect(() => {
    if (grid.cols === 0) return;
    const blocks = pixelRefs.current.filter(Boolean);
    if (blocks.length === 0) return;
    const logoStack = logoStackRef.current;

    // Reset state
    blocks.forEach((b, i) => {
      gsap.set(b, {
        opacity: 0,
        backgroundColor: pixels[i]?.glitch ?? FINAL_COLOR,
      });
    });
    if (logoStack) gsap.set(logoStack, { opacity: 0 });

    // Each pixel: independent gsap.to with computed delay (same pattern as menu)
    blocks.forEach((block, i) => {
      const p = pixels[i];
      if (!p) return;
      const colDistance = grid.cols - 1 - Math.floor(p.left / grid.size);
      const baseDelay = (colDistance / grid.cols) * PIXEL_REVEAL;
      const delay = baseDelay + p.jitter;
      gsap.to(block, {
        opacity: 1,
        duration: 0.04,
        delay,
        ease: "none",
      });
      gsap.to(block, {
        backgroundColor: FINAL_COLOR,
        duration: 0.12,
        delay: delay + 0.04,
        ease: "none",
      });
    });

    // After pixels finish, fade in logo + check if images are ready
    const total = PIXEL_REVEAL + JITTER + 0.3;
    gsap.delayedCall(total, () => {
      pixelsReady.current = true;
      if (logoStack) {
        gsap.to(logoStack, {
          opacity: 1,
          duration: 0.7,
          ease: "power2.out",
        });
      }
      if (imagesReady.current) {
        setLoaded(true);
      } else {
        const check = () => {
          if (imagesReady.current) setLoaded(true);
          else requestAnimationFrame(check);
        };
        check();
      }
    });
  }, [grid, pixels]);

  // When loaded → blink the PRESS START prompt
  useEffect(() => {
    if (!loaded || !promptRef.current) return;
    gsap.fromTo(
      promptRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: "power2.out" }
    );
    gsap.to(promptRef.current, {
      opacity: 0.3,
      duration: 0.85,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
      delay: 0.5,
    });
  }, [loaded]);

  // Click → grow transition
  const handleEnter = useCallback(() => {
    if (!loaded) return;
    const grower = growerRef.current;
    const logoStack = logoStackRef.current;
    if (!grower) {
      onEnter();
      return;
    }

    const w = window.innerWidth;
    const h = window.innerHeight;
    const diagonal = Math.hypot(w, h);
    const targetScale = (diagonal / 200) * 1.4;

    const tl = gsap.timeline({ onComplete: onEnter });
    if (logoStack) {
      tl.to(logoStack, { opacity: 0, duration: 0.25, ease: "power2.in" });
    }
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
      className="fixed inset-0 z-[100] overflow-hidden"
      onClick={handleEnter}
      style={{
        cursor: loaded ? "pointer" : "default",
        backgroundColor: FINAL_COLOR,
      }}
    >
      {/* Pixel grid — fills the entire viewport */}
      {pixels.map((p, i) => (
        <div
          key={p.key}
          ref={(el) => {
            if (el) pixelRefs.current[i] = el;
          }}
          className="absolute pointer-events-none"
          style={{
            top: p.top,
            left: p.left,
            width: grid.size,
            height: grid.size,
            opacity: 0,
            willChange: "opacity, background-color",
          }}
        />
      ))}

      {/* Logo + PRESS START prompt — center, appears after pixels finish */}
      <div
        ref={logoStackRef}
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10"
        style={{ opacity: 0 }}
      >
        <div
          className="relative w-44 h-20 mb-10 select-none"
          style={{ filter: "invert(1) brightness(1.15)" }}
        >
          <Image
            src="/gallery/tonydecay-logo.png"
            alt="Tony Decay"
            fill
            priority
            className="object-contain"
          />
        </div>
        <span
          ref={promptRef}
          className="font-tattoo text-white text-xs sm:text-sm uppercase select-none"
          style={{ letterSpacing: "0.3em", opacity: 0 }}
        >
          TAP TO ENTER
        </span>
      </div>

      {/* Grower — covers the splash on click, transitions to cream homepage */}
      <div
        ref={growerRef}
        className="absolute top-1/2 left-1/2 rounded-full bg-paper pointer-events-none z-20"
        style={{
          width: 200,
          height: 200,
          transform: "translate(-50%, -50%)",
          opacity: 0,
        }}
      />
    </div>
  );
}
