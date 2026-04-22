"use client";

import Image from "next/image";
import { PLACEHOLDER_PRINTS } from "@/lib/constants";

/* SELECTED WORK / 作品 — broader portfolio beyond the 15-print set.
   Responsive: 2-col grid on mobile, 4-col on desktop. Each card gets the arcade
   grammar from the homepage gallery: gold N°XX pixel tab, brand-color
   thumbtack, slight tilt. One card gets the NEW! crimson stamp. */

type Work = {
  idx: number;
  category: "FLASH" | "PRINT" | "TATTOO" | "STUDY";
  rot: number;
  featured?: boolean;
};

const WORKS: Work[] = [
  { idx: 0, category: "FLASH", rot: -2 },
  { idx: 3, category: "PRINT", rot: 1.5 },
  { idx: 6, category: "TATTOO", rot: -1 },
  { idx: 8, category: "FLASH", rot: 2 },
  { idx: 1, category: "STUDY", rot: -2.5 },
  { idx: 5, category: "PRINT", rot: 1, featured: true },
  { idx: 11, category: "FLASH", rot: -1.5 },
  { idx: 13, category: "STUDY", rot: 2.5 },
  { idx: 2, category: "PRINT", rot: -1 },
  { idx: 7, category: "TATTOO", rot: 1.5 },
  { idx: 10, category: "FLASH", rot: -2 },
  { idx: 9, category: "PRINT", rot: 2 },
];

const TACK_COLORS = [
  "var(--color-crimson)",
  "var(--color-royal)",
  "var(--color-leaf)",
  "var(--color-gold)",
];

const CATEGORIES = ["ALL", "FLASH", "PRINT", "TATTOO", "STUDY"] as const;

export function Work() {
  return (
    <section
      id="work"
      className="relative w-full overflow-hidden"
      style={{
        background: "var(--color-paper)",
        borderTop: "3px solid var(--color-ink)",
        borderBottom: "3px solid var(--color-ink)",
      }}
    >
      <div className="relative mx-auto max-w-6xl px-7 py-14 sm:px-10 sm:py-20 2xl:max-w-[1400px]">
        {/* Header */}
        <div className="relative mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <span
              className="text-[14px] sm:text-[18px] 2xl:text-[22px]"
              style={{
                fontFamily: "var(--font-mono), monospace",
                letterSpacing: "0.3em",
                fontWeight: 800,
                color: "var(--color-crimson)",
              }}
            >
              — selected
            </span>
            <h2
              className="mt-1"
              style={{
                fontFamily: "var(--font-tattoo), sans-serif",
                fontSize: "clamp(3rem, 10vw, 9rem)",
                color: "var(--color-ink)",
                lineHeight: 0.9,
                letterSpacing: "0.01em",
              }}
            >
              WORK /{" "}
              <span
                title="sakuhin — works / body of work"
                style={{
                  fontFamily: "var(--font-jp), var(--font-tattoo), sans-serif",
                  color: "var(--color-crimson)",
                }}
              >
                作品
              </span>
            </h2>
          </div>
          <span
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 10,
              letterSpacing: "0.28em",
              fontWeight: 800,
              color: "var(--color-ink-soft)",
            }}
          >
            127 PIECES CATALOGUED
          </span>
        </div>

        {/* Filter chips (visual only — no filter logic wired yet) */}
        <div className="mb-8 flex flex-wrap gap-2">
          {CATEGORIES.map((cat, i) => (
            <span
              key={cat}
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 10,
                letterSpacing: "0.24em",
                fontWeight: 800,
                padding: "6px 12px",
                background: i === 0 ? "var(--color-ink)" : "transparent",
                color: i === 0 ? "var(--color-gold)" : "var(--color-ink)",
                border: "2px solid var(--color-ink)",
                boxShadow: i === 0 ? "3px 3px 0 var(--color-crimson)" : "none",
                cursor: "pointer",
              }}
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Responsive card grid — 2 cols mobile, 3 sm, 4 lg */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-7 lg:grid-cols-4 lg:gap-8">
          {WORKS.map((w, i) => {
            const pr = PLACEHOLDER_PRINTS[w.idx];
            const label = String(w.idx + 1).padStart(2, "0");
            const useTack = i % 3 === 0;
            const tackColor = TACK_COLORS[i % TACK_COLORS.length];
            return (
              <figure
                key={`${pr.id}-${i}`}
                className="relative"
                style={{
                  transform: `rotate(${w.rot}deg)`,
                  zIndex: w.featured ? 20 : i + 1,
                }}
              >
                {/* N°XX gold pixel tab */}
                <div
                  style={{
                    position: "absolute",
                    top: -10,
                    left: 4,
                    padding: "3px 8px",
                    background: "var(--color-gold)",
                    color: "var(--color-ink)",
                    border: "2px solid var(--color-ink)",
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: 9,
                    letterSpacing: "0.18em",
                    fontWeight: 800,
                    lineHeight: 1,
                    zIndex: 3,
                    boxShadow: "2px 2px 0 var(--color-ink)",
                  }}
                >
                  N°{label}
                </div>

                {/* NEW! stamp on featured */}
                {w.featured && (
                  <svg
                    aria-hidden
                    className="pointer-events-none absolute h-[56px] w-[56px] sm:h-[72px] sm:w-[72px]"
                    style={{ top: -18, right: -18, zIndex: 4, transform: "rotate(14deg)" }}
                    viewBox="0 0 100 100"
                  >
                    <polygon
                      points="50,4 58,18 74,10 72,28 90,26 80,40 96,50 80,58 92,72 74,72 82,88 64,82 62,98 50,86 38,98 36,82 18,88 26,72 8,72 24,58 8,50 24,40 14,26 32,28 30,10 46,18"
                      fill="var(--color-crimson)"
                      stroke="var(--color-ink)"
                      strokeWidth={2.5}
                      strokeLinejoin="round"
                    />
                    <text
                      x="50"
                      y="58"
                      textAnchor="middle"
                      fontFamily="var(--font-tattoo), sans-serif"
                      fontWeight={800}
                      fontSize="22"
                      fill="var(--color-paper)"
                    >
                      NEW!
                    </text>
                  </svg>
                )}

                {/* Tape or thumbtack */}
                {!useTack && (
                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      top: -9,
                      left: "50%",
                      transform: `translateX(-50%) rotate(${i % 2 === 0 ? -4 : 4}deg)`,
                      width: 60,
                      height: 14,
                      background: "rgba(247, 194, 52, 0.55)",
                      border: "1px solid rgba(26, 26, 26, 0.28)",
                      zIndex: 2,
                    }}
                  />
                )}
                {useTack && (
                  <svg
                    aria-hidden
                    className="absolute left-1/2 -translate-x-1/2"
                    style={{ top: -12, width: 22, height: 24, zIndex: 2 }}
                    viewBox="0 0 22 24"
                  >
                    <ellipse cx="11" cy="18" rx="7" ry="2.2" fill="rgba(26,26,26,0.25)" />
                    <circle
                      cx="11"
                      cy="9"
                      r="7"
                      fill={tackColor}
                      stroke="var(--color-ink)"
                      strokeWidth="1.3"
                    />
                    <circle cx="8.5" cy="7" r="1.8" fill="rgba(255,255,255,0.55)" />
                  </svg>
                )}

                {/* Paper card + image */}
                <div
                  style={{
                    background: "#fffef8",
                    padding: 6,
                    border: "1px solid rgba(26,26,26,0.25)",
                    boxShadow: "3px 5px 10px rgba(26,26,26,0.22)",
                  }}
                >
                  <div className="relative" style={{ aspectRatio: "3 / 4" }}>
                    <Image
                      src={pr.src}
                      alt={pr.alt}
                      fill
                      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </figure>
            );
          })}
        </div>

        {/* Footer note */}
        <p
          className="mt-10 text-center"
          style={{
            fontFamily: "var(--font-display), serif",
            fontStyle: "italic",
            fontSize: 15,
            color: "var(--color-ink-soft)",
          }}
        >
          — selection from Tony&rsquo;s broader practice. more on{" "}
          <a
            href="https://www.instagram.com/tony.decay"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--color-crimson)",
              textDecoration: "underline",
              textDecorationThickness: 2,
              textUnderlineOffset: 3,
            }}
          >
            @tony.decay
          </a>
        </p>
      </div>
    </section>
  );
}
