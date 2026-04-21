"use client";

import { useCheckout } from "@/hooks/useCheckout";
import { PLACEHOLDER_PRINTS, TOTAL_INVENTORY } from "@/lib/constants";
import Image from "next/image";

const SPECS = [
  { tag: "A", label: "PAPER", value: "300gsm" },
  { tag: "B", label: "SIZE", value: "A5 × 15" },
  { tag: "C", label: "EDITION", value: "100 SETS" },
  { tag: "D", label: "SHIP", value: "WORLDWIDE" },
];

const HIGHLIGHT = PLACEHOLDER_PRINTS[5];

export function Product() {
  const { dispatch } = useCheckout();

  return (
    <section
      id="package"
      className="relative w-full overflow-hidden"
      style={{
        background: "#152940",
        // Retro dotted grid like image 40: crosshatch dots + gradient
        backgroundImage: `
          radial-gradient(rgba(247,194,52,0.10) 1px, transparent 1.4px),
          linear-gradient(135deg, #152940 0%, #1e3a5f 50%, #0d1a2a 100%)
        `,
        backgroundSize: "10px 10px, 100% 100%",
        borderBottom: "3px solid var(--color-ink)",
        color: "var(--color-paper)",
      }}
    >
      <div className="relative mx-auto max-w-6xl px-7 py-14 sm:px-10 sm:py-20">
        {/* Top row — press start label */}
        <div className="flex items-center justify-between">
          <span
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.34em",
              fontWeight: 800,
              color: "var(--color-gold)",
            }}
          >
            N°001 / 2026
          </span>
          <span
            className="hidden sm:inline"
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.34em",
              fontWeight: 800,
              color: "var(--color-gold)",
              opacity: 0.7,
            }}
          >
            電撃 DECAY GAMES
          </span>
        </div>

        {/* Hero row — title + cartridge */}
        <div className="mt-8 grid grid-cols-1 items-center gap-10 lg:grid-cols-[5fr_7fr] lg:gap-14">
          {/* Left — retro title stack */}
          <div className="relative flex flex-col">
            <span
              style={{
                fontFamily: "var(--font-jp), var(--font-tattoo), sans-serif",
                fontSize: 18,
                color: "var(--color-coral)",
                letterSpacing: "0.08em",
                marginBottom: 4,
              }}
            >
              ★ PRESS START
            </span>
            <h2
              style={{
                fontFamily: "var(--font-tattoo), sans-serif",
                fontSize: "clamp(3.5rem, 11vw, 8rem)",
                color: "var(--color-paper)",
                lineHeight: 0.85,
                textShadow: "4px 4px 0 var(--color-crimson), 4px 4px 0 3px var(--color-ink)",
              }}
            >
              TONY
              <br />
              DECAY
            </h2>
            <span
              className="mt-4"
              style={{
                fontFamily: "var(--font-jp), var(--font-tattoo), sans-serif",
                fontSize: 22,
                color: "var(--color-gold)",
                letterSpacing: "0.08em",
              }}
            >
              トニー・デケイ 新作!
            </span>

            {/* Retro CTA arrow + button */}
            <div className="mt-8 flex items-center gap-4">
              <span
                aria-hidden
                style={{
                  width: 0,
                  height: 0,
                  borderTop: "14px solid transparent",
                  borderBottom: "14px solid transparent",
                  borderLeft: "20px solid var(--color-gold)",
                  animation: "arrow-wiggle 0.8s ease-in-out infinite alternate",
                }}
              />
              <button
                onClick={() => dispatch({ type: "OPEN" })}
                style={{
                  padding: "16px 28px",
                  background: "var(--color-gold)",
                  color: "var(--color-ink)",
                  border: "3px solid var(--color-ink)",
                  fontFamily: "var(--font-tattoo), sans-serif",
                  fontSize: 24,
                  letterSpacing: "0.04em",
                  boxShadow: "5px 5px 0 var(--color-crimson), 5px 5px 0 2px var(--color-ink)",
                  lineHeight: 1,
                  cursor: "pointer",
                }}
              >
                COLLECT YOURS
              </button>
            </div>

            <div
              className="mt-6"
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 11,
                letterSpacing: "0.28em",
                fontWeight: 800,
                color: "rgba(240,235,220,0.55)",
              }}
            >
              {TOTAL_INVENTORY} / {TOTAL_INVENTORY} CARTRIDGES REMAINING
            </div>
          </div>

          {/* Right — highlight print + NEW! stamp + price tag */}
          <div className="relative mx-auto w-full max-w-md">
            <div
              className="relative w-full"
              style={{
                aspectRatio: "3 / 4",
                border: "4px solid var(--color-paper)",
                background: "#ffffff",
                boxShadow:
                  "0 0 0 3px var(--color-ink), 8px 8px 0 var(--color-crimson), 8px 8px 0 3px var(--color-ink)",
              }}
            >
              <Image
                src={HIGHLIGHT.src}
                alt={HIGHLIGHT.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
            {/* NEW! sticker top-right */}
            <div
              className="pointer-events-none absolute"
              style={{ top: -18, right: -18, transform: "rotate(12deg)" }}
              aria-hidden
            >
              <svg width="86" height="86" viewBox="0 0 100 100">
                <polygon
                  points="50,4 58,18 74,10 72,28 90,26 80,40 96,50 80,58 92,72 74,72 82,88 64,82 62,98 50,86 38,98 36,82 18,88 26,72 8,72 24,58 8,50 24,40 14,26 32,28 30,10 46,18"
                  fill="var(--color-gold)"
                  stroke="var(--color-ink)"
                  strokeWidth={3}
                  strokeLinejoin="round"
                />
                <text
                  x="50"
                  y="58"
                  textAnchor="middle"
                  fontFamily="var(--font-tattoo), sans-serif"
                  fontWeight={700}
                  fontSize="24"
                  fill="var(--color-ink)"
                >
                  NEW!
                </text>
              </svg>
            </div>
            {/* Teal price tag on right edge */}
            <div
              className="pointer-events-none absolute"
              style={{
                top: "38%",
                right: -22,
                padding: "8px 18px 8px 26px",
                background: "var(--color-teal)",
                border: "3px solid var(--color-ink)",
                fontFamily: "var(--font-tattoo), sans-serif",
                fontSize: 22,
                color: "var(--color-ink)",
                transform: "rotate(-6deg)",
                clipPath: "polygon(12% 0%, 100% 0%, 100% 100%, 12% 100%, 0% 50%)",
                boxShadow: "3px 3px 0 var(--color-ink)",
                lineHeight: 1,
              }}
            >
              <span
                aria-hidden
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
            {/* 100 SETS ONLY — bottom-left */}
            <div
              className="pointer-events-none absolute"
              style={{
                bottom: -20,
                left: -20,
                transform: "rotate(-10deg)",
              }}
              aria-hidden
            >
              <svg width="96" height="96" viewBox="0 0 100 100">
                <polygon
                  points="50,0 57,14 70,4 68,20 86,16 78,32 96,38 80,48 96,62 76,64 84,82 64,76 66,96 50,84 34,96 36,76 16,82 24,64 4,62 20,48 4,38 22,32 14,16 32,20 30,4 43,14"
                  fill="var(--color-crimson)"
                  stroke="var(--color-ink)"
                  strokeWidth={3}
                  strokeLinejoin="round"
                />
                <text
                  x="50"
                  y="42"
                  textAnchor="middle"
                  fontFamily="var(--font-tattoo), sans-serif"
                  fontWeight={700}
                  fontSize="16"
                  fill="var(--color-paper)"
                >
                  100
                </text>
                <text
                  x="50"
                  y="58"
                  textAnchor="middle"
                  fontFamily="var(--font-tattoo), sans-serif"
                  fontWeight={700}
                  fontSize="14"
                  fill="var(--color-paper)"
                >
                  SETS
                </text>
                <text
                  x="50"
                  y="72"
                  textAnchor="middle"
                  fontFamily="var(--font-tattoo), sans-serif"
                  fontWeight={700}
                  fontSize="14"
                  fill="var(--color-paper)"
                >
                  ONLY
                </text>
              </svg>
            </div>
          </div>
        </div>

        {/* Spec cartridges — pixel-label row */}
        <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-4 sm:gap-6">
          {SPECS.map((s) => (
            <div
              key={s.tag}
              className="relative"
              style={{
                background: "var(--color-paper)",
                border: "3px solid var(--color-ink)",
                boxShadow: "5px 5px 0 var(--color-gold)",
                padding: "18px 16px 14px 48px",
              }}
            >
              {/* Pixel tag badge — square, corner rivet */}
              <div
                className="absolute flex items-center justify-center"
                style={{
                  top: -12,
                  left: -12,
                  width: 40,
                  height: 40,
                  background: "var(--color-royal)",
                  color: "var(--color-paper)",
                  border: "3px solid var(--color-ink)",
                  boxShadow: "2px 2px 0 var(--color-ink)",
                  fontFamily: "var(--font-tattoo), sans-serif",
                  fontSize: 20,
                  lineHeight: 1,
                }}
              >
                {s.tag}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 10,
                  letterSpacing: "0.3em",
                  fontWeight: 800,
                  color: "var(--color-ink-soft)",
                  marginBottom: 4,
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-tattoo), sans-serif",
                  fontSize: 22,
                  color: "var(--color-ink)",
                  lineHeight: 1,
                  letterSpacing: "0.02em",
                }}
              >
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom pixel footer line */}
        <div className="mt-10 flex items-center justify-center gap-3">
          <span
            aria-hidden
            style={{
              width: 8,
              height: 8,
              background: "var(--color-crimson)",
            }}
          />
          <span
            aria-hidden
            style={{
              width: 8,
              height: 8,
              background: "var(--color-gold)",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 10,
              letterSpacing: "0.34em",
              fontWeight: 800,
              color: "rgba(240,235,220,0.55)",
            }}
          >
            INSERT CARTRIDGE TO CONTINUE
          </span>
          <span
            aria-hidden
            style={{
              width: 8,
              height: 8,
              background: "var(--color-teal)",
            }}
          />
          <span
            aria-hidden
            style={{
              width: 8,
              height: 8,
              background: "var(--color-leaf)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
