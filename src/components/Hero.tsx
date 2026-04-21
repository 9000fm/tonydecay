"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { PLACEHOLDER_PRINTS } from "@/lib/constants";
import { useCheckout } from "@/hooks/useCheckout";

interface HeroProps {
  splashDone?: boolean;
}

const DECK_CYCLE_MS = 5800;
const DECK_X_STEP = 24;
const DECK_Y_STEP = -9; // low vertical rise so back cards never hit the PRE-ORDER pill
const HOVER_LIFT = -32;
const DECK_SIZE = 10;
// Stable subtle tilt per card index (card keeps its angle as it cycles)
const DECK_ROTATIONS = [-1.2, 1.8, -0.6, 1.2, -1.8, 0.8, -1.0, 1.5, -1.4, 0.9];

// Pick prints client-side only to avoid hydration mismatch
const HERO_FAN_DEFAULT = PLACEHOLDER_PRINTS.slice(0, DECK_SIZE);

export function Hero({}: HeroProps) {
  const { dispatch } = useCheckout();
  const fanRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const [heroFan, setHeroFan] = useState(HERO_FAN_DEFAULT);

  // Desktop deck state — order of card indices, front (0) → back
  const [deckOrder, setDeckOrder] = useState<number[]>(() =>
    Array.from({ length: DECK_SIZE }, (_, i) => i),
  );
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const deckCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const deckFloatRef = useRef<HTMLDivElement>(null);
  const prevOrderRef = useRef<number[]>(deckOrder);
  const prevHoveredRef = useRef<number | null>(null);
  const demotingRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    // Shuffle client-side only — prevents hydration mismatch from Math.random
    const shuffled = [...PLACEHOLDER_PRINTS].sort(() => Math.random() - 0.5);
    setHeroFan(shuffled.slice(0, DECK_SIZE));
  }, []);

  // Desktop deck: initial placement (rotation set once — preserved across tweens)
  useEffect(() => {
    deckOrder.forEach((cardIdx, position) => {
      const el = deckCardRefs.current[cardIdx];
      if (!el) return;
      gsap.set(el, {
        x: position * DECK_X_STEP,
        y: position * DECK_Y_STEP,
        rotation: DECK_ROTATIONS[cardIdx] ?? 0,
        zIndex: 100 - position,
        opacity: 1,
      });
    });
    // Only on mount; subsequent changes handled by effects below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Continuous subtle float on the whole deck — gives it life between cycles
  useEffect(() => {
    if (!deckFloatRef.current) return;
    const tween = gsap.to(deckFloatRef.current, {
      y: -8,
      duration: 4.5,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: 1.2,
    });
    return () => {
      tween.kill();
    };
  }, []);

  // Auto-cycle, paused while hovered
  useEffect(() => {
    if (hoveredIdx !== null) return;
    const id = setInterval(() => {
      setDeckOrder((prev) => [...prev.slice(1), prev[0]]);
    }, DECK_CYCLE_MS);
    return () => clearInterval(id);
  }, [hoveredIdx]);

  // Animate cards when deck order changes — with exit/reenter for demoted card
  useEffect(() => {
    const prev = prevOrderRef.current;
    const curr = deckOrder;

    // Auto-cycle has a demotion (front → back). Click-to-promote does not.
    // When demoting, the other cards wait for the fade-out to finish before sliding —
    // premium sequenced feel: first fade, then push.
    const FADE_OUT = 1.2;
    const FADE_IN = 1.0;
    const hasDemotion = curr.some(
      (cardIdx, pos) => prev.indexOf(cardIdx) === 0 && pos === curr.length - 1,
    );
    const pushDelay = hasDemotion ? FADE_OUT : 0;

    curr.forEach((cardIdx, position) => {
      const el = deckCardRefs.current[cardIdx];
      if (!el) return;
      const tx = position * DECK_X_STEP;
      const ty = position * DECK_Y_STEP + (hoveredIdx === cardIdx ? HOVER_LIFT : 0);
      const tz = 100 - position;

      const prevPos = prev.indexOf(cardIdx);
      const wasDemoted = prevPos === 0 && position === curr.length - 1;

      if (wasDemoted) {
        // Slow graceful dissolve: soft fade out first, teleport to back slot, then fade in
        // while the rest of the stack pushes forward in sync. Guard hover lift while this runs.
        demotingRef.current.add(cardIdx);
        gsap
          .timeline({
            overwrite: true,
            onComplete: () => {
              demotingRef.current.delete(cardIdx);
            },
          })
          .set(el, { zIndex: 200 })
          .to(el, {
            opacity: 0,
            duration: FADE_OUT,
            ease: "power2.inOut",
          })
          .set(el, { x: tx, y: ty, zIndex: tz })
          .to(el, {
            opacity: 1,
            duration: FADE_IN,
            ease: "power2.out",
          });
      } else {
        // Non-demoted cards: wait for fade, then glide into new position together
        gsap.to(el, {
          x: tx,
          y: ty,
          zIndex: tz,
          duration: 1.1,
          delay: pushDelay + position * 0.04,
          ease: "power3.inOut",
          overwrite: "auto",
        });
      }
    });

    prevOrderRef.current = curr;
  }, [deckOrder, hoveredIdx]);

  // Hover lift — subtle, doesn't fight the order effect. Skip cards mid-demotion.
  useEffect(() => {
    const prevHover = prevHoveredRef.current;
    if (prevHover !== null && prevHover !== hoveredIdx && !demotingRef.current.has(prevHover)) {
      const el = deckCardRefs.current[prevHover];
      const position = deckOrder.indexOf(prevHover);
      if (el && position >= 0) {
        gsap.to(el, {
          y: position * DECK_Y_STEP,
          duration: 0.35,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    }
    if (hoveredIdx !== null && !demotingRef.current.has(hoveredIdx)) {
      const el = deckCardRefs.current[hoveredIdx];
      const position = deckOrder.indexOf(hoveredIdx);
      if (el && position >= 0) {
        gsap.to(el, {
          y: position * DECK_Y_STEP + HOVER_LIFT,
          duration: 0.35,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    }
    prevHoveredRef.current = hoveredIdx;
  }, [hoveredIdx, deckOrder]);

  const promoteCard = (cardIdx: number) => {
    setDeckOrder((prev) => {
      if (prev[0] === cardIdx) return prev;
      return [cardIdx, ...prev.filter((i) => i !== cardIdx)];
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (fanRef.current) {
        const cards = Array.from(fanRef.current.children) as HTMLElement[];
        // Fan opens to the RIGHT — 7 cards, tightened for cleaner mobile read
        const rotations = [-12, -8, -4, 0, 4, 8, 12];
        const xOffsets = [-26, -17, -9, 0, 9, 17, 26];
        const yOffsets = [9, 6, 3, 0, -3, -6, -9];

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
        // Subtle levitation: lower amplitude, keeps slight rotation wobble.
        gsap.to(floatRef.current, {
          y: -9,
          duration: 7,
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
      className="bg-paper relative min-h-screen overflow-hidden pt-[70px] pb-14 sm:pt-[96px] sm:pb-6"
    >
      <div className="mx-auto max-w-6xl px-2 sm:px-6">
        {/* MOBILE-only: darker cream band behind composition — starts below navbar, fades out at bottom */}
        <div
          className="pointer-events-none absolute inset-x-0 sm:hidden"
          aria-hidden
          style={{
            top: "92px",
            height: "550px",
            background:
              "radial-gradient(ellipse 55% 50% at 0% 100%, rgba(60, 40, 18, 0.16) 0%, transparent 65%), radial-gradient(ellipse 55% 50% at 100% 0%, rgba(60, 40, 18, 0.12) 0%, transparent 65%), radial-gradient(ellipse 70% 50% at 50% 45%, rgba(247, 200, 66, 0.22) 0%, transparent 70%), linear-gradient(135deg, #D8CAA6 0%, #EADCB0 45%, #EFE2B4 55%, #EADCB0 75%, #D8CAA6 100%)",
            boxShadow: "inset 0 1px 0 rgba(26,26,26,0.10)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 62%, rgba(0,0,0,0.6) 82%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, black 0%, black 62%, rgba(0,0,0,0.6) 82%, transparent 100%)",
            zIndex: 1,
          }}
        />

        {/* MOBILE-only: wordmark at top — color-reactive via difference blend + occasional subtle gold shimmer */}
        <h1
          className="font-tattoo text-ink relative z-20 w-full text-center leading-[0.9] tracking-tighter uppercase sm:hidden"
          style={{
            fontSize: "clamp(4.4rem, 22vw, 12rem)",
          }}
        >
          TONY DECAY
        </h1>

        {/* Print fan area — MOBILE only (stamp moved below) */}
        <div className="relative z-10 -mt-2 flex min-h-0 items-center justify-center sm:hidden">
          {/* Desktop stamp moved to section-level below */}
          {/* Levitating print fan */}
          <div
            ref={floatRef}
            data-hero-print
            className="relative w-[17rem] rotate-[4deg] sm:w-64 sm:rotate-0 md:w-[30rem]"
            style={{ aspectRatio: "3/4" }}
          >
            <div ref={fanRef} className="relative h-full w-full">
              {heroFan.map((print, i) => (
                <div
                  key={print.id}
                  className="border-ink absolute inset-0 overflow-hidden border-2"
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

        {/* MOBILE-only: vintage stamp — BELOW fan, ABOVE buttons (scaled ~25% smaller) */}
        <div
          className="-mt-4 mb-4 flex justify-center sm:hidden"
          style={{ position: "relative", zIndex: 25 }}
        >
          <div
            className="bg-paper relative px-9 py-4"
            style={{ boxShadow: "0 3px 14px -4px rgba(0,0,0,0.12)" }}
          >
            {/* Double border */}
            <div className="border-ink absolute inset-0 border-2" />
            <div className="border-ink/60 absolute inset-[4px] border" />
            {/* Corner 8-point stars */}
            {[
              "-top-[7px] -left-[7px]",
              "-top-[7px] -right-[7px]",
              "-bottom-[7px] -left-[7px]",
              "-bottom-[7px] -right-[7px]",
            ].map((pos) => (
              <svg
                key={pos}
                className={`absolute ${pos}`}
                viewBox="0 0 20 20"
                width="14"
                height="14"
                fill="#1A1A1A"
              >
                <polygon points="10,0 11.5,6.5 17,3 13.5,8.5 20,10 13.5,11.5 17,17 11.5,13.5 10,20 8.5,13.5 3,17 6.5,11.5 0,10 6.5,8.5 3,3 8.5,6.5" />
              </svg>
            ))}
            {/* Diamond dots top + bottom borders */}
            {["top-0 left-1/3", "top-0 left-2/3", "bottom-0 left-1/3", "bottom-0 left-2/3"].map(
              (pos) => (
                <div
                  key={pos}
                  className={`absolute ${pos} bg-ink h-[5px] w-[5px] -translate-x-1/2 rotate-45 ${pos.startsWith("top") ? "-translate-y-1/2" : "translate-y-1/2"}`}
                />
              ),
            )}
            {/* Content */}
            <div className="relative text-center">
              <p
                className="font-tattoo uppercase"
                style={{ fontSize: "1.15rem", letterSpacing: "0.30em", color: "#1A1A1A" }}
              >
                LIMITED EDITION
              </p>
              <div className="my-2 flex items-center justify-center gap-2">
                <div className="bg-ink/40 h-px w-8" />
                <svg viewBox="0 0 12 12" width="10" height="8" fill="#1A1A1A">
                  <polygon points="6,0 7,4.5 12,6 7,7.5 6,12 5,7.5 0,6 5,4.5" />
                </svg>
                <div className="bg-ink/40 h-px w-8" />
              </div>
              <p
                className="font-mono uppercase"
                style={{ fontSize: 9, letterSpacing: "0.16em", lineHeight: 1.6, color: "#4A4438" }}
              >
                15 original print collection.
                <br />
                Only 100 available.
              </p>
            </div>
          </div>
        </div>

        {/* CTAs — MOBILE only (desktop has its own in split layout) */}
        <div className="mt-0 flex flex-col items-stretch justify-center gap-3 sm:hidden">
          <button
            onClick={() => dispatch({ type: "OPEN" })}
            className="inline-flex h-12 items-center justify-center rounded-full px-10 font-sans uppercase sm:h-14 sm:px-14"
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "inset 0 0 0 3px #1A1A1A";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
            }}
            style={{
              fontSize: 13,
              letterSpacing: "0.14em",
              fontWeight: 800,
              background: "linear-gradient(135deg, #FFD55A 0%, #F7C234 55%, #E3A81F 100%)",
              color: "#1A1A1A",
              transition: "none",
            }}
          >
            COLLECT YOURS
          </button>
          <a
            href="#gallery"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#gallery")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="border-ink inline-flex h-12 items-center justify-center rounded-full border-2 px-10 font-sans uppercase sm:h-14 sm:px-14"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#1A1A1A";
              e.currentTarget.style.color = "#F0EBDC";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#1A1A1A";
            }}
            style={{ fontSize: 13, letterSpacing: "0.14em", fontWeight: 800, transition: "none" }}
          >
            VIEW THE PRINTS
          </a>
        </div>

        {/* Pokemon dialog arrow — simple dark triangle, 4-step bob */}
        <div
          className="absolute bottom-4 left-1/2 z-30 -translate-x-1/2 sm:bottom-8"
          style={{ animation: "pokemon-bounce 1.8s linear infinite" }}
          aria-hidden
        >
          <svg width="16" height="12" viewBox="0 0 16 12" fill="#1A1A1A">
            <polygon points="0,0 16,0 8,12" />
          </svg>
        </div>
      </div>

      {/* DESKTOP-only: full-width floating band — multi-layer warm gradient w/ gold glow + subtle darker vignette */}
      <div
        className="pointer-events-none absolute inset-x-0 hidden sm:block"
        aria-hidden
        style={{
          top: "96px",
          bottom: "10%",
          background:
            "radial-gradient(ellipse 45% 55% at 0% 100%, rgba(60, 40, 18, 0.18) 0%, transparent 65%), radial-gradient(ellipse 40% 50% at 100% 0%, rgba(60, 40, 18, 0.14) 0%, transparent 60%), radial-gradient(ellipse 55% 70% at 65% 50%, rgba(247, 200, 66, 0.28) 0%, transparent 70%), radial-gradient(ellipse 40% 50% at 15% 40%, rgba(255, 220, 130, 0.18) 0%, transparent 65%), linear-gradient(135deg, #D8CAA6 0%, #EADCB0 45%, #EFE2B4 55%, #EADCB0 75%, #D8CAA6 100%)",
          boxShadow: "inset 0 1px 0 rgba(26,26,26,0.10), inset 0 -1px 0 rgba(26,26,26,0.10)",
          zIndex: 1,
        }}
      />

      {/* DESKTOP-only: split layout — type left, deck right */}
      <div className="absolute inset-0 z-10 mx-auto hidden max-w-7xl grid-cols-12 items-center gap-8 px-10 pt-[96px] pb-16 sm:grid">
        {/* LEFT: type stack */}
        <div className="relative z-20 col-span-5">
          <p
            className="text-ink/60 font-mono uppercase"
            style={{ fontSize: 15, letterSpacing: "0.3em", fontWeight: 600 }}
          >
            Vol.01 — 2026
          </p>
          <h1
            className="font-tattoo text-ink mt-4 uppercase"
            style={{
              fontSize: "clamp(2.6rem, 4.8vw, 4.4rem)",
              letterSpacing: "-0.02em",
              lineHeight: 0.92,
            }}
          >
            Tony Decay
          </h1>
          <div className="bg-ink/30 mt-5 mb-4 h-px w-32" />
          <h2
            className="text-ink font-sans font-black uppercase"
            style={{
              fontSize: "clamp(3.2rem, 6vw, 5.4rem)",
              lineHeight: 0.88,
              letterSpacing: "-0.035em",
            }}
          >
            Limited
            <br />
            Edition
          </h2>
          <div className="mt-6 mb-6 flex items-center gap-4">
            <div className="bg-ink h-[3px] w-20" />
            <span
              className="text-ink/70 font-mono uppercase"
              style={{ fontSize: 14, letterSpacing: "0.22em", fontWeight: 600 }}
            >
              15 prints · 100 sets
            </span>
          </div>
          <p
            className="text-ink/70 max-w-sm font-mono"
            style={{ fontSize: 13, lineHeight: 1.55, letterSpacing: "0.01em" }}
          >
            Cream paper, hand-numbered. 100 collector sets worldwide, then gone.
          </p>
          <div className="mt-10 flex items-center gap-4">
            <button
              onClick={() => dispatch({ type: "OPEN" })}
              className="inline-flex h-14 items-center justify-center rounded-full px-12 font-sans uppercase"
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "inset 0 0 0 3px #1A1A1A";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
              }}
              style={{
                fontSize: 13,
                letterSpacing: "0.14em",
                fontWeight: 800,
                background: "linear-gradient(135deg, #FFD55A 0%, #F7C234 55%, #E3A81F 100%)",
                color: "#1A1A1A",
                transition: "none",
              }}
            >
              Collect Yours
            </button>
            <a
              href="#gallery"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#gallery")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="border-ink inline-flex h-14 items-center justify-center rounded-full border-2 px-12 font-sans uppercase"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#1A1A1A";
                e.currentTarget.style.color = "#F0EBDC";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#1A1A1A";
              }}
              style={{ fontSize: 13, letterSpacing: "0.14em", fontWeight: 800, transition: "none" }}
            >
              View the Prints
            </a>
          </div>
        </div>

        {/* RIGHT: interactive print deck — centered with type block, sized to the card (no dead space above) */}
        <div className="relative col-span-7 flex items-center justify-center">
          <div ref={deckFloatRef} data-hero-print className="relative h-[32rem] w-[24rem]">
            {heroFan.map((print, i) => {
              const position = deckOrder.indexOf(i);
              const isTop = position === 0;
              const shadow = isTop
                ? "12px 22px 45px -10px rgba(0,0,0,0.38), 0 4px 10px rgba(0,0,0,0.15)"
                : "4px 8px 18px -6px rgba(0,0,0,0.22)";
              return (
                <div
                  key={print.id}
                  ref={(el) => {
                    deckCardRefs.current[i] = el;
                  }}
                  onClick={() => promoteCard(i)}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className="border-ink absolute inset-0 cursor-pointer overflow-hidden border-2"
                  style={{
                    boxShadow: shadow,
                    backgroundColor: "#F0EBDC",
                  }}
                >
                  <Image
                    src={print.src}
                    alt={print.alt}
                    fill
                    unoptimized
                    priority={i < 2}
                    className="pointer-events-none object-cover select-none"
                    sizes="384px"
                    draggable={false}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
