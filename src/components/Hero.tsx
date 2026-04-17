"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { PLACEHOLDER_PRINTS } from "@/lib/constants";
import { useCheckout } from "@/hooks/useCheckout";

interface HeroProps {
  splashDone?: boolean;
}

// Pick prints client-side only to avoid hydration mismatch
const HERO_FAN_DEFAULT = PLACEHOLDER_PRINTS.slice(0, 7);

export function Hero({}: HeroProps) {
  const { dispatch } = useCheckout();
  const fanRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const [heroFan, setHeroFan] = useState(HERO_FAN_DEFAULT);

  useEffect(() => {
    const shuffled = [...PLACEHOLDER_PRINTS].sort(() => Math.random() - 0.5);
    setHeroFan(shuffled.slice(0, 7));
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (fanRef.current) {
        const cards = Array.from(fanRef.current.children) as HTMLElement[];
        // Fan opens to the RIGHT — 7 cards
        const rotations = [-18, -12, -6, 0, 6, 12, 18];
        const xOffsets = [-42, -28, -14, 0, 14, 28, 42];
        const yOffsets = [14, 9, 5, 0, -5, -9, -14];

        gsap.set(cards, { rotation: 0, x: 0, y: 0 });
        cards.forEach((card, i) => {
          gsap.to(card, {
            rotation: rotations[i] || 0,
            x: xOffsets[i] || 0,
            y: yOffsets[i] || 0,
            duration: 1,
            delay: 0.3 + i * 0.06,
            ease: "power3.out",
          });
        });
      }

      if (floatRef.current) {
        // Heavy hover: slow vertical float + slight rotation wobble
        gsap.to(floatRef.current, {
          y: -35,
          duration: 6,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: 1.2,
        });
        gsap.to(floatRef.current, {
          rotation: 0.25,
          duration: 8,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: 2.0,
        });
      }

    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      className="relative bg-paper overflow-hidden pt-[76px] sm:pt-[96px] pb-14 sm:pb-6 min-h-screen"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* MOBILE-only: wordmark at top */}
        <h1
          className="sm:hidden font-tattoo text-ink uppercase leading-[0.82] tracking-tighter text-center w-full relative z-20"
          style={{ fontSize: "clamp(4.5rem, 22vw, 11rem)" }}
        >
          TONY DECAY
        </h1>

        {/* MOBILE-only: vintage decorative stamp between wordmark and fan */}
        <div className="sm:hidden flex justify-center -mt-4 mb-0" style={{ position: "relative", zIndex: 25 }}>
          <div
            className="relative bg-paper px-8 py-4"
            style={{ boxShadow: "0 3px 14px -4px rgba(0,0,0,0.12)" }}
          >
            {/* Double border */}
            <div className="absolute inset-0 border-2 border-ink" />
            <div className="absolute inset-[4px] border border-ink/60" />
            {/* Corner 8-point stars */}
            {["-top-[7px] -left-[7px]", "-top-[7px] -right-[7px]", "-bottom-[7px] -left-[7px]", "-bottom-[7px] -right-[7px]"].map((pos) => (
              <svg key={pos} className={`absolute ${pos}`} viewBox="0 0 20 20" width="14" height="14" fill="#1A1A1A">
                <polygon points="10,0 11.5,6.5 17,3 13.5,8.5 20,10 13.5,11.5 17,17 11.5,13.5 10,20 8.5,13.5 3,17 6.5,11.5 0,10 6.5,8.5 3,3 8.5,6.5" />
              </svg>
            ))}
            {/* Diamond dots top + bottom borders */}
            {["top-0 left-1/3", "top-0 left-2/3", "bottom-0 left-1/3", "bottom-0 left-2/3"].map((pos) => (
              <div key={pos} className={`absolute ${pos} -translate-x-1/2 w-[5px] h-[5px] bg-ink rotate-45 ${pos.startsWith("top") ? "-translate-y-1/2" : "translate-y-1/2"}`} />
            ))}
            {/* Content */}
            <div className="relative text-center">
              <p className="font-tattoo uppercase" style={{ fontSize: "1.05rem", letterSpacing: "0.32em", color: "#1A1A1A" }}>
                LIMITED EDITION
              </p>
              <div className="flex items-center justify-center gap-2 my-2">
                <div className="w-6 h-px bg-ink/40" />
                <svg viewBox="0 0 12 12" width="7" height="7" fill="#1A1A1A"><polygon points="6,0 7,4.5 12,6 7,7.5 6,12 5,7.5 0,6 5,4.5" /></svg>
                <div className="w-6 h-px bg-ink/40" />
              </div>
              <p className="font-mono uppercase" style={{ fontSize: 8, letterSpacing: "0.14em", lineHeight: 1.5, color: "#4A4438" }}>
                15 original print collection.
                <br />
                Only 100 available.
              </p>
            </div>
          </div>
        </div>

        {/* Print fan area */}
        <div className="relative flex items-center justify-center min-h-[340px] sm:min-h-[440px] -mt-10 sm:mt-[8vh]">

          {/* Desktop stamp moved to section-level below */}
          {/* Levitating print fan */}
          <div
            ref={floatRef}
            data-hero-print
            className="relative w-[17rem] sm:w-64 md:w-[30rem] rotate-[4deg] sm:rotate-0"
            style={{ aspectRatio: "3/4" }}
          >
            <div ref={fanRef} className="relative w-full h-full">
              {heroFan.map((print, i) => (
                <div
                  key={print.id}
                  className="absolute inset-0 overflow-hidden border-2 border-ink"
                  style={{
                    zIndex: i + 1,
                    boxShadow: "2px 4px 12px -2px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.15)",
                  }}
                >
                  <Image
                    src={print.src}
                    alt={print.alt}
                    fill
                    unoptimized
                    priority={i === 2}
                    className="object-cover"
                    sizes="384px"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Desktop subtitle + supporting now stamped inside the print fan area above — nothing separate here */}

        {/* CTAs */}
        <div className="mt-10 sm:mt-[4.5rem] flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-5">
          <button
            onClick={() => dispatch({ type: "OPEN" })}
            className="inline-flex items-center justify-center h-12 sm:h-14 px-10 sm:px-14 rounded-full font-sans uppercase"
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "inset 0 0 0 3px #1A1A1A"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
            style={{ fontSize: 13, letterSpacing: "0.14em", fontWeight: 800, backgroundColor: "#F7C234", color: "#1A1A1A", transition: "none" }}
          >
            COLLECT YOURS
          </button>
          <a
            href="#gallery"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#gallery")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center justify-center h-12 sm:h-14 px-10 sm:px-14 rounded-full border-2 border-ink font-sans uppercase"
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#1A1A1A"; e.currentTarget.style.color = "#F0EBDC"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#1A1A1A"; }}
            style={{ transition: "none" }}
            style={{ fontSize: 13, letterSpacing: "0.14em", fontWeight: 800 }}
          >
            VIEW THE PRINTS
          </a>
        </div>

        {/* Pixel arrow — absolute bottom on ALL viewports */}
        <div
          className="absolute bottom-2 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center scale-100 sm:scale-150"
          style={{ gap: 0, animation: "pokemon-bounce 1.8s linear infinite" }}
          aria-hidden
        >
          <span style={{ width: 20, height: 4, animation: "arrow-colors 1.8s linear infinite" }} />
          <span style={{ width: 16, height: 4, animation: "arrow-colors 1.8s linear infinite" }} />
          <span style={{ width: 12, height: 4, animation: "arrow-colors 1.8s linear infinite" }} />
          <span style={{ width: 8, height: 4, animation: "arrow-colors 1.8s linear infinite" }} />
          <span style={{ width: 4, height: 4, animation: "arrow-colors 1.8s linear infinite" }} />
        </div>
      </div>

      {/* DESKTOP-only: vintage stamp — section-level, positioned over the print fan composition */}
      <div
        className="hidden sm:block absolute bg-paper px-10 py-5"
        style={{ top: "67%", left: "50%", transform: "translateX(-50%)", zIndex: 25, boxShadow: "4px 6px 0px rgba(0,0,0,0.18)" }}
      >
        <div className="absolute inset-0 border-2 border-ink" />
        <div className="absolute inset-[5px] border border-ink/60" />
        {["-top-[9px] -left-[9px]", "-top-[9px] -right-[9px]", "-bottom-[9px] -left-[9px]", "-bottom-[9px] -right-[9px]"].map((pos) => (
          <svg key={pos} className={`absolute ${pos}`} viewBox="0 0 20 20" width="18" height="18" fill="#1A1A1A">
            <polygon points="10,0 11.5,6.5 17,3 13.5,8.5 20,10 13.5,11.5 17,17 11.5,13.5 10,20 8.5,13.5 3,17 6.5,11.5 0,10 6.5,8.5 3,3 8.5,6.5" />
          </svg>
        ))}
        {["top-0 left-1/4", "top-0 left-1/2", "top-0 left-3/4", "bottom-0 left-1/4", "bottom-0 left-1/2", "bottom-0 left-3/4"].map((pos) => (
          <div key={pos} className={`absolute ${pos} -translate-x-1/2 w-[6px] h-[6px] bg-ink rotate-45 ${pos.startsWith("top") ? "-translate-y-1/2" : "translate-y-1/2"}`} />
        ))}
        {["left-0 top-1/3", "left-0 top-2/3", "right-0 top-1/3", "right-0 top-2/3"].map((pos) => (
          <div key={pos} className={`absolute ${pos} -translate-y-1/2 w-[6px] h-[6px] bg-ink rotate-45 ${pos.startsWith("left") ? "-translate-x-1/2" : "translate-x-1/2"}`} />
        ))}
        <div className="relative text-center">
          <p className="font-tattoo uppercase" style={{ fontSize: "1.5rem", letterSpacing: "0.36em", color: "#1A1A1A" }}>
            LIMITED EDITION
          </p>
          <div className="flex items-center justify-center gap-2 my-3">
            <div className="w-10 h-px bg-ink/40" />
            <svg viewBox="0 0 12 12" width="10" height="10" fill="#1A1A1A"><polygon points="6,0 7,4.5 12,6 7,7.5 6,12 5,7.5 0,6 5,4.5" /></svg>
            <div className="w-10 h-px bg-ink/40" />
          </div>
          <p className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: "0.18em", lineHeight: 1.6, color: "#4A4438" }}>
            15 original print collection.
            <br />
            Only 100 available.
          </p>
        </div>
      </div>

      {/* DESKTOP-only: TONY DECAY — DIRECT section child, z-30, zero parent transform contamination */}
      {/* eslint-disable-next-line jsx-a11y/heading-has-content */}
      {/* DESKTOP: Layer 1 — shadow, BEHIND prints, offset, color-reactive */}
      <h1
        aria-hidden="true"
        className="hidden sm:block absolute left-0 right-0 text-center pointer-events-none"
        style={{
          top: "0.8%",
          left: "0.5%",
          zIndex: 10,
          fontSize: "clamp(3rem, 16vw, 14rem)",
          fontFamily: "var(--font-anton)",
          color: "#ffffff",
          textTransform: "uppercase",
          letterSpacing: "-0.05em",
          lineHeight: 0.82,
          mixBlendMode: "difference",
        }}
      >
        TONY DECAY
      </h1>
      {/* DESKTOP: Layer 2 — solid ink, IN FRONT of prints */}
      <h1
        aria-hidden="true"
        className="hidden sm:block absolute left-0 right-0 text-center pointer-events-none"
        style={{
          top: "0%",
          zIndex: 30,
          fontSize: "clamp(3rem, 16vw, 14rem)",
          fontFamily: "var(--font-anton)",
          color: "#1A1A1A",
          textTransform: "uppercase",
          letterSpacing: "-0.05em",
          lineHeight: 0.82,
        }}
      >
        TONY DECAY
      </h1>
    </section>
  );
}
