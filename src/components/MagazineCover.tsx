"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { useCheckout } from "@/hooks/useCheckout";
import { PLACEHOLDER_PRINTS } from "@/lib/constants";
import { QuoteStripSvgL } from "@/components/hero-quote/QuoteStripSvgL";
import { JP } from "./JP";

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
    nEn: "in — print / seal / stamp",
    label: "PRINTS",
    value: "15",
    fill: "var(--color-crimson)",
    valueColor: "var(--color-crimson)",
  },
  {
    n: "組",
    nEn: "kumi — set / group / collection",
    label: "SETS",
    value: "100",
    fill: "var(--color-royal)",
    valueColor: "var(--color-royal)",
  },
  {
    n: "紙",
    nEn: "kami — paper",
    label: "PAPER",
    value: "CREAM",
    fill: "var(--color-leaf)",
    valueColor: "var(--color-leaf)",
  },
  {
    n: "便",
    nEn: "bin — mail / post",
    label: "SHIPS TO",
    value: "WORLD",
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
    <span
      className="relative block shrink-0"
      style={
        {
          display: "inline-block",
          width: size,
          height: size,
          filter: "drop-shadow(3px 3px 0 var(--color-ink))",
          // Outer span runs the levitate keyframe; rotate preserved via --rot
          "--rot": `${rotate}deg`,
          transform: `rotate(${rotate}deg)`,
          animation: "star-levitate 3.4s ease-in-out infinite",
        } as React.CSSProperties
      }
    >
      <button
        type="button"
        onClick={onClick}
        aria-label="Order now"
        className="group relative block h-full w-full shrink-0 hover:scale-[1.1] active:scale-[0.96]"
        style={{
          background: "transparent",
          border: "none",
          padding: 0,
          cursor: "pointer",
          // Fluid stamp-growth — smooth but not slow. Mid-range ease-out.
          transitionProperty: "transform",
          transitionDuration: "320ms",
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
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
            y="40"
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
            fontSize="13"
            letterSpacing="0.03em"
            fill="var(--color-crimson)"
            stroke="var(--color-paper)"
            strokeWidth="0.6"
            paintOrder="stroke"
          >
            PRE-ORDER
          </text>
          <text
            x="50"
            y="70"
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
    </span>
  );
}

const TICKER_TOKENS = [
  "WORLDWIDE SHIPPING",
  "★",
  "LIMITED 100",
  "★",
  "VOL.01",
  "★",
  "PRE-ORDER OPEN",
];
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
      className="h-[110px] w-[110px] lg:h-[260px] lg:w-[260px]"
      aria-hidden
      style={{
        transform: "rotate(-10deg)",
        filter: "drop-shadow(4px 4px 0 var(--color-ink))",
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

interface MagazineCoverProps {
  onOpenMenu?: () => void;
  menuOpen?: boolean;
}

export function MagazineCover({ onOpenMenu, menuOpen = false }: MagazineCoverProps) {
  const { dispatch } = useCheckout();

  const ticker = Array.from({ length: TICKER_REPEAT }).flatMap(() => TICKER_TOKENS);
  const tickerDoubled = [...ticker, ...ticker];

  // Thumbs fixed (no state). Featured pool state shuffles on client mount so
  // each session starts on a random cycling print.
  const gridIndices = DEFAULT_GRID;
  const [featuredPool, setFeaturedPool] = useState<number[]>(DEFAULT_FEATURED_POOL);
  const [featuredRotIdx, setFeaturedRotIdx] = useState(0);

  // Card shadow color rotates with the featured print so each transition
  // also swaps the brand-color shadow under the frame. Cycles through the
  // four hero brand colors.
  const CARD_SHADOW_COLORS = [
    "var(--color-crimson)",
    "var(--color-royal)",
    "var(--color-leaf)",
    "var(--color-gold)",
  ];
  const cardShadowColor = CARD_SHADOW_COLORS[featuredRotIdx % CARD_SHADOW_COLORS.length];

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
  // Sticky compact navbar only appears AFTER the masthead has fully
  // scrolled out of view, so the eyebrow / TONY DECAY title / desc never
  // sit behind the navbar mid-scroll.
  const HIDE_THRESHOLD = 480;
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
        <div className="marquee-strip flex h-full shrink-0 items-center whitespace-nowrap">
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

      {/* A-compact. Sticky replacement bar — appears past marquee threshold.
           +60% scale (minHeight 48 → 76). Three-column layout:
           [outlined MENU] · centered TONY の DECAY · [yellow ORDER NOW block].
           MENU inverts to cream-fill/ink-text when menuOpen so it stays
           visible on the dark menu overlay. */}
      <div
        className="fixed top-0 right-0 left-0 z-[80] w-full items-center"
        style={{
          background: "var(--color-paper-warm, #ECE4D0)",
          borderBottom: "2px solid var(--color-ink)",
          padding: "14px 28px",
          minHeight: 76,
          transform: pastTop ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 350ms cubic-bezier(0.22, 1, 0.36, 1)",
          willChange: "transform",
          // 3-col grid (1fr | auto | 1fr) so the centered title is viewport-
          // centered regardless of MENU / ORDER NOW widths.
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          columnGap: 16,
        }}
      >
        {/* MENU — outlined rect. Pinned to the left edge of its column.
             Explicit gridColumn so when the title is display:none on
             mobile, ORDER NOW still lands in column 3, not column 2. */}
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          style={{
            gridColumn: 1,
            justifySelf: "start",
            background: menuOpen ? "var(--color-paper)" : "transparent",
            color: "var(--color-ink)",
            border: "2px solid var(--color-ink)",
            padding: menuOpen ? "8px 14px" : "10px 20px",
            cursor: "pointer",
            fontFamily: "var(--font-mono), monospace",
            fontSize: menuOpen ? 22 : 13,
            letterSpacing: menuOpen ? "0" : "0.32em",
            fontWeight: 800,
            lineHeight: 1,
            transition: "background 200ms ease",
            minWidth: menuOpen ? 48 : undefined,
            textAlign: "center",
          }}
        >
          {menuOpen ? "✕" : "MENU"}
        </button>

        {/* Centered title — sits in the middle column, viewport-centered. */}
        <span
          aria-hidden
          className="hidden sm:inline"
          style={{
            justifySelf: "center",
            fontFamily: "var(--font-tattoo), sans-serif",
            fontSize: 34,
            color: "var(--color-ink)",
            letterSpacing: "0.02em",
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}
        >
          TONY{" "}
          <span
            style={{
              color: "var(--color-crimson)",
              fontFamily: "var(--font-jp), var(--font-tattoo), sans-serif",
              fontSize: 22,
            }}
          >
            の
          </span>{" "}
          <span style={{ color: "var(--color-crimson)" }}>DECAY</span>
        </span>

        {/* ORDER NOW — pinned to the right edge of its column. */}
        <button
          type="button"
          onClick={() => dispatch({ type: "OPEN" })}
          aria-label="Order now"
          style={{
            gridColumn: 3,
            justifySelf: "end",
            background: "var(--color-gold)",
            color: "var(--color-ink)",
            border: "2px solid var(--color-ink)",
            padding: "8px 18px",
            cursor: "pointer",
            fontFamily: "var(--font-tattoo), sans-serif",
            fontSize: 22,
            letterSpacing: "0.03em",
            lineHeight: 1,
            boxShadow: "4px 4px 0 var(--color-crimson), 4px 4px 0 2px var(--color-ink)",
          }}
        >
          ORDER NOW
        </button>
      </div>

      {/* B. Masthead — solid warm paper (no dots, clean for type). Bottom
           padding tightened so the cream area ends right after the desc. */}
      <div
        className="relative w-full"
        style={{
          background: "#ECE4D0",
          borderBottom: "3px solid var(--color-ink)",
        }}
      >
        <div
          className="relative mx-auto flex w-full max-w-[1100px] flex-col gap-3 md:flex-row md:items-start md:justify-between"
          style={{
            // Top: 3.25rem floor (52px) clears the 32px marquee with ~20px
            // breath. Tightened bottom padding kills the empty cream band
            // that previously sat between the desc and the gallery border.
            padding:
              "clamp(3.25rem, 5.5vw, 3.75rem) clamp(1rem, 2.5vw, 2.25rem) clamp(0.75rem, 1.5vw, 1.25rem)",
          }}
        >
          <div className="flex flex-col gap-3 lg:pr-[260px]">
            <div
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 13,
                letterSpacing: "0.3em",
                fontWeight: 800,
                color: "var(--color-crimson)",
              }}
            >
              VOL.01 · 100 SETS · JUNE 2026
            </div>

            <div
              className="mt-2 flex items-end md:mt-0"
              style={{ fontFamily: "var(--font-tattoo), sans-serif", lineHeight: 0.88 }}
            >
              <span
                style={{
                  color: "var(--color-ink)",
                  fontSize: "clamp(82px, 20vw, 144px)",
                }}
              >
                TONY
              </span>
              <span
                className="mx-1"
                style={{
                  color: "var(--color-crimson)",
                  fontFamily: "var(--font-jp), var(--font-tattoo), sans-serif",
                  transform: "translateY(-18%)",
                  fontSize: "clamp(38px, 8.5vw, 62px)",
                }}
              >
                の
              </span>
              <span
                style={{
                  color: "var(--color-crimson)",
                  WebkitTextStroke: "2px var(--color-ink)",
                  fontSize: "clamp(82px, 20vw, 144px)",
                }}
              >
                DECAY
              </span>
            </div>

            <div
              style={{
                fontFamily: "var(--font-display), serif",
                fontStyle: "italic",
                fontSize: 16,
                lineHeight: 1.35,
                color: "var(--color-ink-soft)",
              }}
            >
              15 original prints. Limited to 100 signed collector sets.
            </div>
          </div>

          {/* Desktop starburst — TUCKED INSIDE the cream area: smaller
              (size 200), nudged DOWN to ~54% so even mid-levitate the top
              edge stays well below the 32px marquee. No hover-z-bump —
              never reaches the marquee, never conflicts with scroll. */}
          <div
            className="hidden lg:block"
            style={{
              position: "absolute",
              // Pulled further LEFT (right offset bumped) and pushed LOWER
              // (top % up so the centerline of the stamp drops on desktop).
              right: 100,
              top: "60%",
              transform: "translateY(-50%)",
              zIndex: 10,
            }}
          >
            <JP en="yoyaku — pre-order / reservation" bare>
              <PreOrderStarburst onClick={() => dispatch({ type: "OPEN" })} size={224} />
            </JP>
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
              // Matches the NARROWEST print ratio (~0.694) so no print
              // gets chopped on top/bottom. Wider prints get tiny side
              // crop instead — decorative borders stay intact.
              aspectRatio: "1600 / 2307",
              border: "4px solid var(--color-ink)",
              background: "var(--color-paper)",
              boxShadow: `6px 6px 0 ${cardShadowColor}, 6px 6px 0 2px var(--color-ink)`,
              transition: "box-shadow 600ms ease-out",
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
            <div className="absolute -top-4 -right-4 z-10 lg:-top-7 lg:-right-7">
              <JP en="shinsaku — new release / latest work" bare>
                <FeaturedStickerNew />
              </JP>
            </div>
            {/* Desktop: 100 SETS sticker. Mobile: PRE-ORDER starburst replaces it. */}
            <div className="pointer-events-none absolute z-10 hidden lg:-bottom-16 lg:-left-16 lg:block">
              <FeaturedStickerSets />
            </div>
            {/* Mobile ORDER NOW stamp — sits lower against the print's bottom
                 edge so the body of the featured image breathes more. */}
            <div className="absolute z-10 lg:hidden" style={{ bottom: -8, left: -22 }}>
              <PreOrderStarburst
                onClick={() => dispatch({ type: "OPEN" })}
                size={176}
                rotate={-8}
              />
            </div>
          </div>

          {/* Right column: 3 thumbs on mobile (prints 1/2/3), 6 on desktop
               (adds prints 4/5/6). No number labels; aspect-ratio matches
               the print PNG so nothing gets cropped. */}
          <div className="flex flex-col gap-5 lg:gap-6">
            <div className="grid grid-cols-3 gap-4 lg:gap-5">
              {gridIndices.map((printIdx, cellIdx) => {
                const print = PLACEHOLDER_PRINTS[printIdx];
                const hideOnMobile = cellIdx >= 3;
                return (
                  <div
                    key={`${print.id}-${cellIdx}`}
                    className={`relative ${hideOnMobile ? "hidden lg:block" : ""}`}
                  >
                    <div
                      className="relative"
                      style={{
                        aspectRatio: "1600 / 2307",
                        border: "3px solid var(--color-ink)",
                        boxShadow: "3px 3px 0 var(--color-ink)",
                        background: "var(--color-paper)",
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

      {/* D. Pull-quote strip — Q2 (tiny gold SVG L-brackets), promoted from
           /lab/quote-strip with bumped sizing. */}
      <div className="mx-7 mb-6">
        <QuoteStripSvgL />
      </div>

      {/* E. CTA moved out of the cover — now lives after the PixelGallery
           (PostGalleryCta in src/app/page.tsx). */}

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
              <JP en={stat.nEn}>{stat.n}</JP>
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
