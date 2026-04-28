"use client";

/* Q3 — MID-EDGE. Two big brackets at left + right vertical centers of the
   strip, inset slightly, outside the text column. Feels like the strip is
   framed by a pair of massive quotation marks. */

const INK = "#1a1a1a";
const CREAM = "#F5ECCE";
const BLUE = "#2B5DAE";
const GOLD = "#F7C234";

export function QuoteStripMidEdge() {
  return (
    <div
      style={{
        position: "relative",
        background: BLUE,
        border: `3px solid ${INK}`,
        boxShadow: `5px 5px 0 ${INK}`,
        padding: "28px 62px",
      }}
    >
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: "50%",
          left: 10,
          transform: "translateY(-55%)",
          fontFamily: "var(--font-tattoo), sans-serif",
          color: GOLD,
          fontSize: 52,
          lineHeight: 0.6,
          textShadow: `2px 2px 0 ${INK}`,
        }}
      >
        「
      </span>
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: "50%",
          right: 10,
          transform: "translateY(-55%)",
          fontFamily: "var(--font-tattoo), sans-serif",
          color: GOLD,
          fontSize: 52,
          lineHeight: 0.6,
          textShadow: `2px 2px 0 ${INK}`,
        }}
      >
        」
      </span>

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
          Worldwide shipping. 100 cream sets, hand-numbered - then gone.
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
