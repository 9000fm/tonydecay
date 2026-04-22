"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { useCheckout } from "@/hooks/useCheckout";
import { PLACEHOLDER_PRINTS } from "@/lib/constants";

// Fixed thumbs: prints 1-6. First 3 always visible, last 3 show on lg+ (desktop)
// so mobile = 3 thumbs, desktop = 6 thumbs (2 rows of 3).
const DEFAULT_GRID = [0, 1, 2, 3, 4, 5];
const DEFAULT_FEATURED_POOL = [7, 1, 2, 4, 6, 9, 11, 13, 14];
const FEATURED_CYCLE_MS = 5200;

function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
// All stats share the same responsive scale so WORLDWIDE reads as tall as
// 15 / 100 / CREAM. Size tuned so WORLDWIDE fits in the 4-col desktop cell + the
// narrower 2-col mobile cell without overflow.
const DEFAULT_STAT_VALUE_CLASS = "text-[32px] sm:text-[40px] lg:text-[52px]";
const STATS = [
  {
    n: "印",
    label: "PRINTS",
    value: "15",
    fill: "var(--color-crimson)",
    valueColor: "var(--color-crimson)",
  },
  {
    n: "組",
    label: "SETS",
    value: "100",
    fill: "var(--color-royal)",
    valueColor: "var(--color-royal)",
  },
  {
    n: "紙",
    label: "PAPER",
    value: "CREAM",
    fill: "var(--color-leaf)",
    valueColor: "var(--color-leaf)",
  },
  {
    n: "便",
    label: "SHIP",
    value: "WORLDWIDE",
    fill: "var(--color-gold)",
    valueColor: "var(--color-ink)",
  },
] as const;

const PAPER_DOT_BG = "radial-gradient(rgba(26,26,26,0.22) 1.2px, transparent 1.6px)";
const PAPER_DOT_SIZE = "9px 9px";

function PreOrderStarburst({
  onClick,
  size = 140,
  rotate = 10,
}: {
  onClick: () => void;
  size?: number;
  rotate?: number;
}) {
  const uid = useId().replace(/:/g, "");
  const clipId = `star-clip-${uid}`;
  const gradId = `star-shine-${uid}`;
  const STAR_POINTS =
    "50,0 57,14 70,4 68,20 86,16 78,32 96,38 80,48 96,62 76,64 84,82 64,76 66,96 50,84 34,96 36,76 16,82 24,64 4,62 20,48 4,38 22,32 14,16 32,20 30,4 43,14";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Order now"
      className="group relative block shrink-0 transition-transform duration-150 ease-out hover:scale-[1.04] active:scale-[0.96]"
      style={{
        width: size,
        height: size,
        background: "transparent",
        border: "none",
        padding: 0,
        cursor: "pointer",
        filter: "drop-shadow(3px 3px 0 var(--color-ink))",
        transform: `rotate(${rotate}deg)`,
      }}
    >
      <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden>
        <defs>
          <clipPath id={clipId}>
            <polygon points={STAR_POINTS} />
          </clipPath>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon
          points={STAR_POINTS}
          fill="var(--color-gold)"
          stroke="var(--color-ink)"
          strokeWidth={2.25}
          strokeLinejoin="round"
        />
        <g clipPath={`url(#${clipId})`} style={{ mixBlendMode: "screen" }}>
          <rect
            x="0"
            y="-20"
            width="28"
            height="140"
            fill={`url(#${gradId})`}
            style={{
              transformOrigin: "center",
              animation: "star-shine-sweep 7s ease-in-out infinite",
            }}
          />
        </g>
        <text
          x="50"
          y="36"
          textAnchor="middle"
          fontFamily="var(--font-jp), var(--font-tattoo), sans-serif"
          fontWeight={900}
          fontSize="22"
          fill="var(--color-ink)"
        >
          予約
        </text>
        <text
          x="50"
          y="56"
          textAnchor="middle"
          fontFamily="var(--font-tattoo), sans-serif"
          fontWeight={700}
          fontSize="15"
          letterSpacing="0.03em"
          fill="var(--color-crimson)"
          stroke="var(--color-paper)"
          strokeWidth="0.6"
          paintOrder="stroke"
        >
          ORDER NOW
        </text>
        <text
          x="50"
          y="76"
          textAnchor="middle"
          fontFamily="var(--font-mono), monospace"
          fontWeight={800}
          fontSize="10"
          letterSpacing="0.16em"
          fill="var(--color-ink)"
        >
          VOL.01
        </text>
      </svg>
    </button>
  );
}

const TICKER_TOKENS = ["小学館", "★", "WORLDWIDE SHIPPING", "★", "LIMITED 100", "★"];
const TICKER_REPEAT = 10;

function FeaturedStickerNew() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="h-[120px] w-[120px] lg:h-[180px] lg:w-[180px]"
      aria-hidden
      style={{ transform: "rotate(14deg)" }}
    >
      <polygon
        points="50,4 58,18 74,10 72,28 90,26 80,40 96,50 80,58 92,72 74,72 82,88 64,82 62,98 50,86 38,98 36,82 18,88 26,72 8,72 24,58 8,50 24,40 14,26 32,28 30,10 46,18"
        fill="var(--color-crimson)"
        stroke="var(--color-ink)"
        strokeWidth={2.25}
        strokeLinejoin="round"
      />
      <text
        x="50"
        y="58"
        textAnchor="middle"
        fontFamily="var(--font-jp), var(--font-tattoo), sans-serif"
        fontWeight={900}
        fontSize="21"
        fill="var(--color-paper)"
      >
        新作!
      </text>
    </svg>
  );
}

function FeaturedStickerSets() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="h-[110px] w-[110px] lg:h-[156px] lg:w-[156px]"
      aria-hidden
      style={{
        transform: "rotate(-10deg)",
        filter: "drop-shadow(3px 3px 0 var(--color-ink))",
      }}
    >
      <polygon
        points="50,0 57,14 70,4 68,20 86,16 78,32 96,38 80,48 96,62 76,64 84,82 64,76 66,96 50,84 34,96 36,76 16,82 24,64 4,62 20,48 4,38 22,32 14,16 32,20 30,4 43,14"
        fill="var(--color-gold)"
        stroke="var(--color-ink)"
        strokeWidth={2.25}
        strokeLinejoin="round"
      />
      <text
        x="50"
        y="40"
        textAnchor="middle"
        fontFamily="var(--font-tattoo), sans-serif"
        fontWeight={700}
        fontSize="18"
        fill="var(--color-ink)"
        letterSpacing="0.02em"
      >
        100
      </text>
      <text
        x="50"
        y="56"
        textAnchor="middle"
        fontFamily="var(--font-tattoo), sans-serif"
        fontWeight={700}
        fontSize="16"
        fill="var(--color-ink)"
        letterSpacing="0.04em"
      >
        SETS
      </text>
      <text
        x="50"
        y="72"
        textAnchor="middle"
        fontFamily="var(--font-tattoo), sans-serif"
        fontWeight={700}
        fontSize="16"
        fill="var(--color-ink)"
        letterSpacing="0.04em"
      >
        ONLY
      </text>
    </svg>
  );
}

/* Pokémon menu arrow — chunky low-poly right-pointing triangle from
   Gen 1/2 dialog select cursors. Crimson fill + ink stroke. Bobs
   horizontally 4px every 0.5s via arrow-wiggle keyframe. */
function RedArrow() {
  return (
    <svg
      viewBox="0 0 60 80"
      aria-hidden
      className="h-[44px] w-[34px] shrink-0 sm:h-[60px] sm:w-[46px] lg:h-[76px] lg:w-[58px]"
      style={{
        animation: "arrow-wiggle 0.5s steps(1) infinite alternate",
        shapeRendering: "crispEdges",
      }}
    >
      {/* Low-poly stepped triangle — reads as a chunky cursor, not 1px pixel */}
      <polygon
        points="0,12 12,12 12,24 24,24 24,36 36,36 36,44 24,44 24,56 12,56 12,68 0,68"
        fill="var(--color-crimson)"
        stroke="var(--color-ink)"
        strokeWidth={2}
        strokeLinejoin="miter"
      />
    </svg>
  );
}

interface MagazineCoverProps {
  onOpenMenu?: () => void;
}

export function MagazineCover({ onOpenMenu }: MagazineCoverProps) {
  const { dispatch } = useCheckout();

  const ticker = Array.from({ length: TICKER_REPEAT }).flatMap(() => TICKER_TOKENS);
  const tickerDoubled = [...ticker, ...ticker];

  // Thumbs fixed (no state). Featured pool state shuffles on client mount so
  // each session starts on a random cycling print.
  const gridIndices = DEFAULT_GRID;
  const [featuredPool, setFeaturedPool] = useState<number[]>(DEFAULT_FEATURED_POOL);
  const [featuredRotIdx, setFeaturedRotIdx] = useState(0);

  useEffect(() => {
    // Thumbs are fixed to prints 1-6. Featured cycles through the remaining 9
    // (prints 7–15); shuffle client-side so each session starts on a random print.
    /* eslint-disable react-hooks/set-state-in-effect */
    const featuredOnly = Array.from({ length: PLACEHOLDER_PRINTS.length - 6 }, (_, i) => i + 6);
    setFeaturedPool(shuffle(featuredOnly));
    setFeaturedRotIdx(0);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (featuredPool.length <= 1) return;
    const id = setInterval(() => {
      setFeaturedRotIdx((i) => (i + 1) % featuredPool.length);
    }, FEATURED_CYCLE_MS);
    return () => clearInterval(id);
  }, [featuredPool.length]);

  // Scroll model: at the very top, pink marquee is visible. Once scrolled past
  // the threshold, marquee slides up and a compact sticky bar (MENU / mini
  // TONY の DECAY / BUY) slides in to replace it. Return to very top → marquee
  // returns, compact hides.
  const HIDE_THRESHOLD = 120;
  const [pastTop, setPastTop] = useState(false);
  const scrollRafRef = useRef<number | null>(null);
  useEffect(() => {
    const onScroll = () => {
      if (scrollRafRef.current !== null) return;
      scrollRafRef.current = requestAnimationFrame(() => {
        scrollRafRef.current = null;
        setPastTop(window.scrollY > HIDE_THRESHOLD);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (scrollRafRef.current !== null) cancelAnimationFrame(scrollRafRef.current);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section
      id="magazine"
      className="relative w-full"
      style={{
        background: "var(--color-paper)",
      }}
    >
      {/* A. Pink marquee — hides on scroll-down past threshold, returns at top. */}
      <div
        className="fixed top-0 right-0 left-0 z-[81] w-full overflow-hidden"
        style={{
          background: "#F2A2BC",
          borderBottom: "3px solid var(--color-ink)",
          height: 32,
          transform: pastTop ? "translateY(-100%)" : "translateY(0)",
          transition: "transform 350ms cubic-bezier(0.22, 1, 0.36, 1)",
          willChange: "transform",
        }}
      >
        <div
          className="flex h-full shrink-0 items-center whitespace-nowrap"
          style={{ animation: "marquee-scroll 35s linear infinite" }}
        >
          {tickerDoubled.map((token, i) => (
            <span
              key={i}
              className="font-jp shrink-0 px-3"
              style={{
                fontFamily: "var(--font-mono), var(--font-jp), sans-serif",
                fontSize: 10,
                letterSpacing: "0.28em",
                fontWeight: 800,
                color: "var(--color-ink)",
              }}
            >
              {token}
            </span>
          ))}
        </div>
      </div>

      {/* A-compact. Sticky replacement bar — appears once scrolled past the
           marquee threshold. Cream paper with ink border. MENU · mini TONY の
           DECAY · BUY. When at top (!pastTop) it's tucked above the viewport. */}
      <div
        className="fixed top-0 right-0 left-0 z-[80] flex w-full items-center justify-between"
        style={{
          background: "var(--color-paper-warm, #ECE4D0)",
          borderBottom: "2px solid var(--color-ink)",
          padding: "10px 20px",
          minHeight: 48,
          transform: pastTop ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 350ms cubic-bezier(0.22, 1, 0.36, 1)",
          willChange: "transform",
        }}
      >
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Open menu"
          style={{
            background: "transparent",
            border: "none",
            padding: "4px 6px",
            cursor: "pointer",
            fontFamily: "var(--font-mono), monospace",
            fontSize: 11,
            letterSpacing: "0.3em",
            fontWeight: 800,
            color: "var(--color-ink)",
            lineHeight: 1,
          }}
        >
          ≡ MENU
        </button>
        <span
          aria-hidden
          style={{
            fontFamily: "var(--font-tattoo), sans-serif",
            fontSize: 22,
            color: "var(--color-ink)",
            letterSpacing: "0.02em",
            lineHeight: 1,
          }}
        >
          TONY{" "}
          <span
            style={{
              color: "var(--color-crimson)",
              fontFamily: "var(--font-jp), var(--font-tattoo), sans-serif",
              fontSize: 14,
            }}
          >
            の
          </span>{" "}
          <span style={{ color: "var(--color-crimson)" }}>DECAY</span>
        </span>
        <button
          type="button"
          onClick={() => dispatch({ type: "OPEN" })}
          aria-label="Order now"
          style={{
            background: "var(--color-gold)",
            color: "var(--color-ink)",
            border: "2px solid var(--color-ink)",
            padding: "6px 14px",
            cursor: "pointer",
            fontFamily: "var(--font-tattoo), sans-serif",
            fontSize: 15,
            letterSpacing: "0.02em",
            lineHeight: 1,
            boxShadow: "2px 2px 0 var(--color-crimson)",
          }}
        >
          BUY
        </button>
      </div>

      {/* B. Masthead — solid warm paper (no dots, clean for type) */}
      <div
        className="relative w-full"
        style={{
          background: "#ECE4D0",
          borderBottom: "3px solid var(--color-ink)",
        }}
      >
        <div
          className="relative mx-auto flex w-full max-w-[888px] flex-col gap-3 md:flex-row md:items-start md:justify-between"
          style={{
            padding: "54px 28px 14px",
          }}
        >
          <div className="flex flex-col lg:pr-[236px]">
            <div
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 11,
                letterSpacing: "0.3em",
                fontWeight: 800,
                color: "var(--color-crimson)",
                marginBottom: 8,
              }}
            >
              VOL.01 · JUNE 2026 · $300
            </div>

            <div
              className="flex items-end"
              style={{ fontFamily: "var(--font-tattoo), sans-serif", lineHeight: 0.88 }}
            >
              <span
                className="text-[64px] sm:text-[92px] lg:text-[116px]"
                style={{ color: "var(--color-ink)" }}
              >
                TONY
              </span>
              <span
                className="mx-1 text-[32px] sm:text-[40px] lg:text-[48px]"
                style={{
                  color: "var(--color-crimson)",
                  fontFamily: "var(--font-jp), var(--font-tattoo), sans-serif",
                  transform: "translateY(-18%)",
                }}
              >
                の
              </span>
              <span
                className="text-[64px] sm:text-[92px] lg:text-[116px]"
                style={{
                  color: "var(--color-crimson)",
                  WebkitTextStroke: "2px var(--color-ink)",
                }}
              >
                DECAY
              </span>
            </div>

            <div
              style={{
                fontFamily: "var(--font-display), serif",
                fontStyle: "italic",
                fontSize: 18,
                color: "var(--color-ink-soft)",
                marginTop: 10,
              }}
            >
              - 15 prints, 100 collector sets, hand-numbered on cream paper.
            </div>
          </div>

          {/* Desktop starburst — z-index 10 sits BELOW the pink marquee (z-[81])
             so the crown slides behind the marquee instead of over it.
             "Peeking from behind" look. */}
          <div
            className="hidden lg:block"
            style={{
              position: "absolute",
              right: 88,
              top: 36,
              zIndex: 10,
            }}
          >
            <PreOrderStarburst onClick={() => dispatch({ type: "OPEN" })} size={200} />
          </div>
        </div>
      </div>

      {/* C. Gallery section — dotted paper, makes the photo cards pop off the bg */}
      <div
        className="relative px-7 pt-6 pb-8 sm:px-8 sm:pt-8 sm:pb-10"
        style={{
          backgroundImage: PAPER_DOT_BG,
          backgroundSize: PAPER_DOT_SIZE,
        }}
      >
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[5fr_7fr] lg:gap-6">
          {/* Featured print — auto-cycles through random pool, click to advance */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setFeaturedRotIdx((i) => (i + 1) % Math.max(1, featuredPool.length))}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setFeaturedRotIdx((i) => (i + 1) % Math.max(1, featuredPool.length));
              }
            }}
            aria-label="Show next print"
            className="relative w-full cursor-pointer select-none"
            style={{
              aspectRatio: "3 / 4",
              border: "4px solid var(--color-ink)",
              background: "#ffffff",
              boxShadow: "6px 6px 0 var(--color-crimson), 6px 6px 0 2px var(--color-ink)",
            }}
          >
            {PLACEHOLDER_PRINTS.map((print, i) => {
              const active = featuredPool[featuredRotIdx] === i;
              return (
                <Image
                  key={print.id}
                  src={print.src}
                  alt={print.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover transition-opacity duration-700 ease-out"
                  style={{ opacity: active ? 1 : 0 }}
                  priority={i === DEFAULT_FEATURED_POOL[0]}
                />
              );
            })}
            <div className="pointer-events-none absolute -top-4 -right-4 z-10 lg:-top-7 lg:-right-7">
              <FeaturedStickerNew />
            </div>
            {/* Desktop: 100 SETS sticker. Mobile: PRE-ORDER starburst replaces it. */}
            <div className="pointer-events-none absolute z-10 hidden lg:-bottom-8 lg:-left-8 lg:block">
              <FeaturedStickerSets />
            </div>
            {/* Mobile ORDER NOW stamp — positioned inside the featured's lower-
                 left, clear of the thumb row below (was bottom:-28 which made
                 it overlap the N°01 thumb). */}
            <div className="absolute z-10 lg:hidden" style={{ bottom: 32, left: -22 }}>
              <PreOrderStarburst
                onClick={() => dispatch({ type: "OPEN" })}
                size={176}
                rotate={-8}
              />
            </div>
          </div>

          {/* Right column: 3 thumbs on mobile (prints 1/2/3), 6 on desktop
               (adds prints 4/5/6) with N°XX pixel-tab labels + VIEW ALL button. */}
          <div className="flex flex-col gap-5 lg:gap-6">
            <div className="grid grid-cols-3 gap-4 lg:gap-5">
              {gridIndices.map((printIdx, cellIdx) => {
                const print = PLACEHOLDER_PRINTS[printIdx];
                const label = String(printIdx + 1).padStart(2, "0");
                const hideOnMobile = cellIdx >= 3;
                return (
                  <div
                    key={`${print.id}-${cellIdx}`}
                    className={`relative ${hideOnMobile ? "hidden lg:block" : ""}`}
                  >
                    {/* N°XX gold pixel tab on top of each thumb */}
                    <div
                      style={{
                        position: "absolute",
                        top: -12,
                        left: "50%",
                        transform: "translateX(-50%)",
                        padding: "4px 12px",
                        background: "var(--color-gold)",
                        color: "var(--color-ink)",
                        border: "2px solid var(--color-ink)",
                        fontFamily: "var(--font-mono), monospace",
                        fontSize: 11,
                        letterSpacing: "0.2em",
                        fontWeight: 800,
                        lineHeight: 1,
                        zIndex: 2,
                        boxShadow: "2px 2px 0 var(--color-ink)",
                      }}
                    >
                      N°{label}
                    </div>
                    <div
                      className="relative"
                      style={{
                        aspectRatio: "3 / 4",
                        border: "3px solid var(--color-ink)",
                        boxShadow: "3px 3px 0 var(--color-ink)",
                        background: "#ffffff",
                      }}
                    >
                      <Image
                        src={print.src}
                        alt={print.alt}
                        fill
                        sizes="(max-width: 768px) 33vw, 16vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => {
                const gallery = document.getElementById("gallery");
                if (gallery) gallery.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full"
              style={{
                padding: "18px 20px",
                background: "var(--color-ink)",
                border: "2px solid var(--color-ink)",
                fontFamily: "var(--font-mono), monospace",
                fontSize: 13,
                letterSpacing: "0.3em",
                fontWeight: 800,
                color: "var(--color-gold)",
                lineHeight: 1,
                cursor: "pointer",
                boxShadow: "4px 4px 0 var(--color-crimson), 4px 4px 0 2px var(--color-ink)",
                textAlign: "center",
              }}
            >
              ▸ VIEW ALL 15 PRINTS
            </button>
          </div>
        </div>
      </div>

      {/* D. Pull-quote strip — brackets absolute-pinned to corners so flex-wrap
           can't fling them out of place on narrow viewports. */}
      <div
        className="relative mx-7 mb-6"
        style={{
          background: "#2B5DAE",
          border: "3px solid var(--color-ink)",
          boxShadow: "5px 5px 0 var(--color-ink)",
          padding: "30px 56px 30px 56px",
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute text-[44px] lg:text-[56px]"
          style={{
            top: 2,
            left: 10,
            fontFamily: "var(--font-tattoo), sans-serif",
            color: "var(--color-gold)",
            textShadow: "2px 2px 0 var(--color-ink)",
            lineHeight: 0.7,
          }}
        >
          「
        </span>
        <div className="flex flex-col items-center gap-2 text-center lg:flex-row lg:flex-wrap lg:justify-center lg:gap-4">
          <p
            style={{
              fontFamily: "var(--font-display), serif",
              fontStyle: "italic",
              fontSize: 22,
              lineHeight: 1.2,
              color: "var(--color-paper)",
              margin: 0,
            }}
          >
            Worldwide shipping. 100 cream sets, hand-numbered - then gone.
          </p>
          <div className="flex items-center gap-3">
            <span
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 11,
                letterSpacing: "0.3em",
                fontWeight: 800,
                color: "var(--color-gold)",
              }}
            >
              - SIGNED,
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/gallery/Firma.webp"
              alt="Tony Decay signature"
              style={{
                height: 36,
                width: "auto",
                objectFit: "contain",
                filter: "invert(1) brightness(1.15)",
              }}
            />
          </div>
        </div>
        <span
          aria-hidden
          className="pointer-events-none absolute text-[44px] lg:text-[56px]"
          style={{
            bottom: 2,
            right: 10,
            fontFamily: "var(--font-tattoo), sans-serif",
            color: "var(--color-gold)",
            textShadow: "2px 2px 0 var(--color-ink)",
            lineHeight: 0.7,
          }}
        >
          」
        </span>
      </div>

      {/* E. CTA row — stacks vertically on mobile (arrow / button / price tag
           centered), horizontal on desktop. */}
      <div
        className="flex flex-col items-center gap-3 px-7 pb-8 lg:flex-row lg:flex-wrap lg:justify-center"
        style={{ marginTop: 22, columnGap: 18, rowGap: 12 }}
      >
        <RedArrow />

        <button
          onClick={() => dispatch({ type: "OPEN" })}
          className="cta-collect-pad shrink-0"
          style={{
            // clamp() — bulletproof responsive sizing, bypasses any Tailwind JIT
            // scan quirks on arbitrary-value classes. Min 52 (mobile) / max 108 (2K).
            fontSize: "clamp(52px, 10vw, 108px)",
            background: "linear-gradient(135deg, #FFD55A 0%, #F7C234 50%, #E3A81F 100%)",
            border: "3px solid var(--color-ink)",
            fontFamily: "var(--font-tattoo), sans-serif",
            letterSpacing: "0.02em",
            color: "var(--color-ink)",
            boxShadow: "8px 8px 0 var(--color-crimson), 8px 8px 0 2px var(--color-ink)",
            lineHeight: 1,
            cursor: "pointer",
          }}
        >
          COLLECT YOURS
        </button>

        <div
          className="relative lg:!p-[18px_30px_18px_42px] lg:!text-[48px]"
          style={{
            padding: "10px 18px 10px 26px",
            background: "var(--color-crimson)",
            border: "3px solid var(--color-ink)",
            fontFamily: "var(--font-tattoo), sans-serif",
            fontSize: 26,
            color: "var(--color-paper)",
            transform: "rotate(-6deg)",
            clipPath: "polygon(12% 0%, 100% 0%, 100% 100%, 12% 100%, 0% 50%)",
            boxShadow: "4px 4px 0 var(--color-ink)",
            lineHeight: 1,
            letterSpacing: "0.02em",
          }}
        >
          <span
            aria-hidden
            className="lg:!left-[16px] lg:!h-[14px] lg:!w-[14px]"
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--color-paper)",
              border: "1.5px solid var(--color-ink)",
            }}
          />
          $300
        </div>
      </div>

      {/* F. Stats strip — boxed cells, overlapping numbered badge */}
      <div
        className="grid w-full grid-cols-2 gap-4 md:grid-cols-4 md:gap-5"
        style={{
          background: "#DDD3BD",
          backgroundImage: PAPER_DOT_BG,
          backgroundSize: PAPER_DOT_SIZE,
          borderTop: "3px solid var(--color-ink)",
          padding: "28px 28px 24px",
        }}
      >
        {STATS.map((stat) => (
          <div
            key={stat.n}
            className="relative flex min-h-[120px] items-center justify-center lg:min-h-[140px]"
            style={{
              background: "#ECE4D0",
              border: "3px solid var(--color-ink)",
              boxShadow: "3px 3px 0 var(--color-ink)",
              padding: "22px 22px 18px",
            }}
          >
            <div
              className="absolute -top-5 -left-5 flex h-12 w-12 items-center justify-center text-[22px] lg:-top-6 lg:-left-6 lg:h-16 lg:w-16 lg:text-[30px]"
              style={{
                borderRadius: "50%",
                background: stat.fill,
                border: "3px solid var(--color-ink)",
                boxShadow: "2px 2px 0 var(--color-ink)",
                fontFamily: "var(--font-jp), var(--font-tattoo), sans-serif",
                fontWeight: 900,
                color: "var(--color-paper)",
                lineHeight: 1,
              }}
            >
              {stat.n}
            </div>
            <div className="flex flex-col items-center gap-1 lg:gap-2">
              <div
                className="text-[11px] lg:text-[13px]"
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  letterSpacing: "0.3em",
                  fontWeight: 800,
                  color: "var(--color-ink-soft)",
                }}
              >
                {stat.label}
              </div>
              <div
                className={DEFAULT_STAT_VALUE_CLASS}
                style={{
                  fontFamily: "var(--font-tattoo), sans-serif",
                  color: stat.valueColor,
                  lineHeight: 1,
                  letterSpacing: "0.02em",
                }}
              >
                {stat.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
