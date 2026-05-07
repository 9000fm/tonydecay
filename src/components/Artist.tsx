"use client";

import Image from "next/image";
import { PLACEHOLDER_PRINTS } from "@/lib/constants";
import { JP } from "./JP";

const POLAROIDS = [
  { print: PLACEHOLDER_PRINTS[6], rotate: -6, top: "5%", left: "10%" },
  { print: PLACEHOLDER_PRINTS[9], rotate: 5, top: "11%", left: "52%" },
  { print: PLACEHOLDER_PRINTS[2], rotate: -3, top: "48%", left: "54%" },
  { print: PLACEHOLDER_PRINTS[11], rotate: 7, top: "54%", left: "8%" },
];

export function Artist() {
  return (
    <section
      id="artist"
      className="relative w-full overflow-hidden"
      style={{
        background: "var(--color-paper)",
      }}
    >
      {/* Lined-notebook background lines (horizontal rules) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0, transparent 31px, rgba(26,26,26,0.12) 31px, rgba(26,26,26,0.12) 32px)",
        }}
        aria-hidden
      />
      {/* Left margin red rule like composition paper */}
      <div
        className="pointer-events-none absolute inset-y-0 left-16 w-px opacity-60"
        style={{ background: "var(--color-crimson)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-7 py-16 sm:px-10 sm:py-20 2xl:max-w-[1400px]">
        {/* Editorial header — eyebrow reads as a magazine column label now,
             so "TONY DECAY" only appears once (the heading). */}
        <div className="relative mb-2 flex flex-col">
          <span
            className="text-[18px] 2xl:text-[22px]"
            style={{
              fontFamily: "var(--font-display), serif",
              fontStyle: "italic",
              color: "var(--color-crimson)",
              transform: "rotate(-2deg)",
              alignSelf: "flex-start",
            }}
          >
            — feature / <JP en="tokushū — special feature / magazine cover story">特集</JP>
          </span>
          <h2
            className="mt-1"
            style={{
              fontFamily: "var(--font-tattoo), sans-serif",
              fontSize: "clamp(3rem, 11vw, 11rem)",
              color: "var(--color-ink)",
              lineHeight: 0.88,
              letterSpacing: "0.01em",
            }}
          >
            TONY DECAY
          </h2>
          <span
            className="text-[28px] 2xl:text-[44px]"
            style={{
              fontFamily: "var(--font-jp), var(--font-tattoo), sans-serif",
              color: "var(--color-ink-soft)",
              marginTop: 4,
            }}
          >
            <JP en="Tony Decay — artist name in Japanese katakana">トニー・デケイ</JP>
          </span>
        </div>

        {/* Polaroid wall + doodles + handwritten bio */}
        <div className="relative mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[7fr_5fr] lg:gap-14">
          {/* Polaroid wall — grows on 2xl so Artist section feels right on 2K */}
          <div
            className="relative mx-auto w-full 2xl:h-[680px] 2xl:max-w-[780px]"
            style={{ height: 520, maxWidth: 620 }}
          >
            {POLAROIDS.map((p, i) => (
              <figure
                key={p.print.id}
                className="group absolute transition-transform duration-200 ease-out hover:z-30 hover:scale-[1.05] hover:rotate-0"
                style={{
                  top: p.top,
                  left: p.left,
                  transform: `rotate(${p.rotate}deg)`,
                  width: 180,
                  zIndex: i,
                }}
              >
                {/* Masking tape strip */}
                <div
                  className="absolute left-1/2 -translate-x-1/2"
                  style={{
                    top: -10,
                    width: 64,
                    height: 16,
                    background: "rgba(247, 194, 52, 0.55)",
                    border: "1px solid rgba(26,26,26,0.25)",
                    boxShadow: "1px 1px 0 rgba(26,26,26,0.15)",
                    transform: "rotate(-4deg)",
                  }}
                  aria-hidden
                />
                <div
                  style={{
                    background: "#fffef8",
                    padding: "10px 10px 36px",
                    border: "1px solid rgba(26,26,26,0.2)",
                    boxShadow: "4px 6px 14px rgba(26,26,26,0.25)",
                  }}
                >
                  <div className="relative" style={{ aspectRatio: "1 / 1" }}>
                    <Image
                      src={p.print.src}
                      alt={p.print.alt}
                      fill
                      sizes="180px"
                      className="object-cover"
                    />
                  </div>
                </div>
              </figure>
            ))}
          </div>

          {/* Handwritten bio + margin notes */}
          <div className="relative flex flex-col gap-6 lg:justify-center lg:gap-10">
            {/* Bio — illuminated manuscript dropcap (medieval-frame style):
                 crimson block, double inset hairlines, gold-dot corner
                 ornaments. Letter rendered above the ornament layer. */}
            <p
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "clamp(1.1rem, 1.6vw, 1.3rem)",
                lineHeight: 1.55,
                color: "var(--color-ink)",
              }}
            >
              <span
                style={{
                  float: "left",
                  position: "relative",
                  // Capped at ~100px so the dropcap covers max 3 lines of
                  // body text (line-height 1.55 × ~21px ≈ 32px/line × 3).
                  width: "clamp(84px, 8.5vw, 100px)",
                  height: "clamp(84px, 8.5vw, 100px)",
                  marginRight: 14,
                  marginTop: 4,
                  background: "var(--color-crimson)",
                  color: "var(--color-paper)",
                  border: "2px solid var(--color-ink)",
                  fontFamily: "var(--font-display), serif",
                  fontSize: "clamp(64px, 6.5vw, 78px)",
                  fontWeight: 700,
                  lineHeight: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "4px 4px 0 var(--color-ink)",
                }}
              >
                {/* Double inset hairlines — manuscript frame */}
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: 5,
                    border: "1px solid rgba(240,235,220,0.7)",
                    pointerEvents: "none",
                  }}
                />
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: 9,
                    border: "1px solid rgba(247,194,52,0.45)",
                    pointerEvents: "none",
                  }}
                />
                {/* Four corner ornaments — small cross + gold dot */}
                {[
                  { top: 4, left: 4 },
                  { top: 4, right: 4 },
                  { bottom: 4, left: 4 },
                  { bottom: 4, right: 4 },
                ].map((pos, i) => (
                  <svg
                    key={i}
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    style={{ position: "absolute", ...pos }}
                    aria-hidden
                  >
                    <path
                      d="M 6 1 L 6 11 M 1 6 L 11 6"
                      stroke="rgba(240,235,220,0.75)"
                      strokeWidth="1"
                      strokeLinecap="round"
                    />
                    <circle cx="6" cy="6" r="1.6" fill="var(--color-gold)" />
                  </svg>
                ))}
                <span style={{ position: "relative", zIndex: 1 }}>T</span>
              </span>
              ony Decay is a tattoo artist and illustrator. His work blends traditional flash
              iconography with a raw, hand-drawn practice — shaped by collectibles, low-tech
              graphics, and early online culture.
            </p>

            <div className="relative">
              {/* Decorative scribble arrow — desktop only (overlapped the red
                  left rule on mobile and read as a glitch). */}
              <svg
                width="42"
                height="32"
                viewBox="0 0 42 32"
                className="absolute -top-6 -left-2 hidden md:block"
                aria-hidden
              >
                <path
                  d="M 4 22 Q 14 4, 38 6"
                  fill="none"
                  stroke="var(--color-ink-soft)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M 36 4 l 3 2 m -3 -2 l 0 4"
                  fill="none"
                  stroke="var(--color-ink-soft)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <ul
                className="flex flex-col gap-1"
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 13,
                  letterSpacing: "0.08em",
                  color: "var(--color-ink)",
                }}
              >
                <li>— traditional tattoo</li>
                <li>— flash &amp; illustration</li>
                <li>— printmaking</li>
              </ul>
            </div>

            {/* Signed IG link — underline in red pencil */}
            <a
              href="https://www.instagram.com/tony.decay"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 self-start"
              style={{
                fontFamily: "var(--font-display), serif",
                fontStyle: "italic",
                fontSize: 20,
                color: "var(--color-ink)",
                textDecoration: "underline",
                textDecorationColor: "var(--color-crimson)",
                textUnderlineOffset: 4,
                textDecorationThickness: 2,
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </svg>
              @tony.decay
              <span
                className="inline-block transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden
              >
                →
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
