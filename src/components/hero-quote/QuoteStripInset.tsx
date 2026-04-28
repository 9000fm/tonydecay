"use client";

/* Q1 — INSET BRACKETS. Small gold Unicode 「 」 hugging the paragraph inline,
   close to text, scaled to match the italic serif. Two brackets only. */

const INK = "#1a1a1a";
const CREAM = "#F5ECCE";
const BLUE = "#2B5DAE";
const GOLD = "#F7C234";

export function QuoteStripInset() {
  return (
    <div
      style={{
        background: BLUE,
        border: `3px solid ${INK}`,
        boxShadow: `5px 5px 0 ${INK}`,
        padding: "24px 20px",
      }}
    >
      <div className="flex flex-col items-center gap-3 text-center lg:flex-row lg:flex-wrap lg:justify-center lg:gap-4">
        <p
          style={{
            fontFamily: "var(--font-display), serif",
            fontStyle: "italic",
            fontSize: 21,
            lineHeight: 1.25,
            color: CREAM,
            margin: 0,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-tattoo), sans-serif",
              color: GOLD,
              fontSize: 26,
              verticalAlign: "-0.08em",
              marginRight: 4,
              lineHeight: 0.6,
              fontStyle: "normal",
            }}
          >
            「
          </span>
          Worldwide shipping. 100 cream sets, hand-numbered - then gone.
          <span
            style={{
              fontFamily: "var(--font-tattoo), sans-serif",
              color: GOLD,
              fontSize: 26,
              verticalAlign: "-0.08em",
              marginLeft: 4,
              lineHeight: 0.6,
              fontStyle: "normal",
            }}
          >
            」
          </span>
        </p>
        <Signature />
      </div>
    </div>
  );
}

function Signature() {
  return (
    <div className="flex items-center gap-3">
      <span
        style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 11,
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
          height: 32,
          width: "auto",
          objectFit: "contain",
          filter: "invert(1) brightness(1.15)",
        }}
      />
    </div>
  );
}
