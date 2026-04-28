"use client";

/* Q2 — TINY SVG L. Small 14px gold SVG L-brackets flanking the paragraph,
   close to text. Thin stroke, no shadow. Only 2 brackets (top-left of text
   + bottom-right of text). */

const INK = "#1a1a1a";
const CREAM = "#F5ECCE";
const BLUE = "#2B5DAE";
const GOLD = "#F7C234";

export function QuoteStripSvgL() {
  return (
    <div
      style={{
        background: BLUE,
        border: `3px solid ${INK}`,
        boxShadow: `6px 6px 0 ${INK}`,
        padding: "30px 34px",
      }}
    >
      <div className="flex flex-col items-center gap-4 text-center lg:flex-row lg:flex-wrap lg:justify-center lg:gap-5">
        <div className="relative inline-block px-5">
          <Bracket position="tl" />
          <p
            style={{
              fontFamily: "var(--font-display), serif",
              fontStyle: "italic",
              fontSize: 25,
              lineHeight: 1.25,
              color: CREAM,
              margin: 0,
            }}
          >
            Worldwide shipping. 100 cream sets, hand-numbered - then gone.
          </p>
          <Bracket position="br" />
        </div>
        <Signature />
      </div>
    </div>
  );
}

function Bracket({ position }: { position: "tl" | "br" }) {
  const style: React.CSSProperties = {
    position: "absolute",
    width: 18,
    height: 18,
  };
  if (position === "tl") Object.assign(style, { top: -8, left: -6 });
  if (position === "br")
    Object.assign(style, { bottom: -8, right: -6, transform: "rotate(180deg)" });
  return (
    <svg aria-hidden viewBox="0 0 18 18" style={style}>
      <g stroke={GOLD} strokeWidth="3" strokeLinecap="square" fill="none">
        <line x1="1.5" y1="1.5" x2="1.5" y2="11" />
        <line x1="1.5" y1="1.5" x2="11" y2="1.5" />
      </g>
    </svg>
  );
}

function Signature() {
  return (
    <div className="flex items-center gap-3">
      <span
        style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 12,
          letterSpacing: "0.3em",
          fontWeight: 800,
          color: GOLD,
        }}
      >
        - SIGNED,
      </span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/gallery/Firma.webp"
        alt="Tony Decay signature"
        style={{
          height: 38,
          width: "auto",
          objectFit: "contain",
          filter: "invert(1) brightness(1.15)",
        }}
      />
    </div>
  );
}
