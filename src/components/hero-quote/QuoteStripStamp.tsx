"use client";

/* Q4 — INK STAMP. Two gold outlined bracket chips flanking the text,
   styled like stamped/embossed labels, not floating brackets. The bracket
   glyph sits inside a small 2px outlined square. */

const INK = "#1a1a1a";
const CREAM = "#F5ECCE";
const BLUE = "#2B5DAE";
const GOLD = "#F7C234";

export function QuoteStripStamp() {
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
        <BracketStamp glyph="「" />
        <p
          style={{
            fontFamily: "var(--font-display), serif",
            fontStyle: "italic",
            fontSize: 21,
            lineHeight: 1.25,
            color: CREAM,
            margin: 0,
            flex: 1,
          }}
        >
          Worldwide shipping. 100 cream sets, hand-numbered - then gone.
        </p>
        <BracketStamp glyph="」" />
        <Signature />
      </div>
    </div>
  );
}

function BracketStamp({ glyph }: { glyph: string }) {
  return (
    <span
      aria-hidden
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 30,
        height: 30,
        border: `2px solid ${GOLD}`,
        color: GOLD,
        fontFamily: "var(--font-tattoo), sans-serif",
        fontSize: 22,
        lineHeight: 0.7,
        flexShrink: 0,
        boxShadow: `2px 2px 0 ${INK}`,
      }}
    >
      {glyph}
    </span>
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
