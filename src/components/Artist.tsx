"use client";

import Image from "next/image";
import { PLACEHOLDER_PRINTS } from "@/lib/constants";

const POLAROIDS = [
  { print: PLACEHOLDER_PRINTS[6], rotate: -6, top: "6%", left: "4%", caption: "studio / lima" },
  {
    print: PLACEHOLDER_PRINTS[9],
    rotate: 4,
    top: "12%",
    left: "34%",
    caption: "test print — 2026",
  },
  { print: PLACEHOLDER_PRINTS[2], rotate: -3, top: "44%", left: "56%", caption: "first pull" },
  { print: PLACEHOLDER_PRINTS[11], rotate: 7, top: "52%", left: "14%", caption: "ink test" },
];

/* Inline JP glyph with hover/longpress translation tooltip. Dotted crimson
   underline signals "hover for translation". Rule across the site: every
   decorative JP character goes through this helper with a real translation. */
function JP({ children, en }: { children: React.ReactNode; en: string }) {
  return (
    <span
      title={en}
      aria-label={en}
      style={{
        textDecoration: "underline dotted",
        textDecorationColor: "rgba(215,50,46,0.45)",
        textUnderlineOffset: 4,
        cursor: "help",
      }}
    >
      {children}
    </span>
  );
}

export function Artist() {
  return (
    <section
      id="artist"
      className="relative w-full overflow-hidden"
      style={{
        background: "var(--color-paper)",
        borderTop: "3px solid var(--color-ink)",
        borderBottom: "3px solid var(--color-ink)",
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
                  <figcaption
                    className="absolute right-0 bottom-2 left-0 text-center"
                    style={{
                      fontFamily: "var(--font-display), serif",
                      fontStyle: "italic",
                      fontSize: 12,
                      color: "var(--color-ink-soft)",
                    }}
                  >
                    {p.caption}
                  </figcaption>
                </div>
              </figure>
            ))}

            {/* Hand-drawn SVG arrows + annotation */}
            <svg
              className="pointer-events-none absolute inset-0"
              viewBox="0 0 620 520"
              preserveAspectRatio="none"
              aria-hidden
            >
              <path
                d="M 170 200 Q 260 150, 340 180"
                fill="none"
                stroke="var(--color-crimson)"
                strokeWidth="2"
                strokeDasharray="6 5"
                strokeLinecap="round"
              />
              <path
                d="M 338 180 l -10 -4 m 10 4 l -5 -10"
                fill="none"
                stroke="var(--color-crimson)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <text
                x="230"
                y="138"
                fontFamily="var(--font-display), serif"
                fontStyle="italic"
                fontSize="16"
                fill="var(--color-crimson)"
              >
                new favorite
              </text>
            </svg>
          </div>

          {/* Handwritten bio + margin notes */}
          <div className="relative flex flex-col gap-6 lg:justify-center lg:gap-10">
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
                  fontFamily: "var(--font-tattoo), sans-serif",
                  fontSize: 72,
                  lineHeight: 0.8,
                  paddingRight: 10,
                  paddingTop: 4,
                  color: "var(--color-crimson)",
                }}
              >
                A
              </span>{" "}
              tattoo artist and illustrator blending traditional flash iconography with a raw,
              hand-drawn practice. The work reflects a generation shaped by collectibles, low-tech
              graphics, and early online culture.
            </p>

            <div className="relative">
              <svg
                width="42"
                height="32"
                viewBox="0 0 42 32"
                className="absolute -top-6 -left-2"
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
                <li>— hand-pulled printmaking</li>
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
