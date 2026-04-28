"use client";

/* D2 — MAGAZINE HYPE. Loud JP retro magazine promo unit: layered yellow
   starburst behind the main CTA pill, side callouts ("LIMITED" tag
   bottom-left, "VOL.01" tag top-right), tiny blue PRE-ORDER chip, bold
   stacked typography. Feels like a chaotic cover spread. */

interface Props {
  onBuy?: () => void;
}

const INK = "#1a1a1a";
const CREAM = "#F5ECCE";
const CRIMSON = "#d7322e";
const GOLD = "#F7C234";
const BLUE = "#2B5DAE";

function starPoints(cx: number, cy: number, rOuter: number, rInner: number, points = 14) {
  const arr: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? rOuter : rInner;
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    arr.push(`${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`);
  }
  return arr.join(" ");
}

export function CtaMagazineHype({ onBuy }: Props) {
  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        padding: "44px 48px",
      }}
    >
      {/* Gold starburst behind everything */}
      <svg
        aria-hidden
        viewBox="0 0 300 300"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) rotate(-6deg)",
          width: 360,
          height: 360,
          pointerEvents: "none",
          filter: `drop-shadow(5px 5px 0 ${INK})`,
        }}
      >
        <polygon
          points={starPoints(150, 150, 144, 98, 16)}
          fill={GOLD}
          stroke={INK}
          strokeWidth="3.5"
          strokeLinejoin="miter"
        />
      </svg>

      {/* Main pill CTA */}
      <button
        type="button"
        onClick={onBuy}
        className="cta-hype"
        style={{
          position: "relative",
          display: "inline-block",
          padding: "22px 36px 24px",
          background: CRIMSON,
          color: CREAM,
          border: `3.5px solid ${INK}`,
          borderRadius: 999,
          cursor: "pointer",
          fontFamily: "var(--font-tattoo), sans-serif",
          fontSize: "clamp(34px, 8vw, 42px)",
          letterSpacing: "0.02em",
          lineHeight: 0.92,
          boxShadow: `6px 6px 0 ${INK}`,
          transition: "transform 120ms ease-out, box-shadow 120ms ease-out",
          textAlign: "center",
        }}
      >
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: 6,
            borderRadius: 999,
            border: `1.5px dashed ${CREAM}`,
            opacity: 0.45,
            pointerEvents: "none",
          }}
        />
        <span
          style={{
            display: "block",
            fontFamily: "var(--font-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.38em",
            fontWeight: 800,
            opacity: 0.8,
            marginBottom: 4,
          }}
        >
          ★ FEATURE ★
        </span>
        COLLECT YOURS
        <style>{`
          .cta-hype:hover { transform: translate(-1px, -1px); box-shadow: 7px 7px 0 ${INK}; }
          .cta-hype:active { transform: translate(4px, 4px); box-shadow: 2px 2px 0 ${INK}; }
        `}</style>
      </button>

      {/* VOL.01 tag top-right */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: 18,
          right: 4,
          padding: "4px 10px",
          background: CREAM,
          color: INK,
          border: `2.5px solid ${INK}`,
          fontFamily: "var(--font-mono), monospace",
          fontSize: 11,
          letterSpacing: "0.28em",
          fontWeight: 800,
          lineHeight: 1,
          transform: "rotate(8deg)",
          boxShadow: `2px 2px 0 ${INK}`,
        }}
      >
        VOL.01
      </span>

      {/* LIMITED tag bottom-left */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          bottom: 22,
          left: 0,
          padding: "5px 12px",
          background: INK,
          color: GOLD,
          border: `2.5px solid ${INK}`,
          fontFamily: "var(--font-tattoo), sans-serif",
          fontSize: 18,
          letterSpacing: "0.04em",
          lineHeight: 1,
          transform: "rotate(-10deg)",
          boxShadow: `2px 2px 0 ${CRIMSON}, 2px 2px 0 4px ${INK}`,
        }}
      >
        LIMITED!
      </span>

      {/* Blue PRE-ORDER chip top-left */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: 14,
          left: 6,
          padding: "3px 9px",
          background: BLUE,
          color: CREAM,
          border: `2px solid ${INK}`,
          fontFamily: "var(--font-mono), monospace",
          fontSize: 9,
          letterSpacing: "0.3em",
          fontWeight: 800,
          lineHeight: 1,
          transform: "rotate(-12deg)",
          boxShadow: `2px 2px 0 ${INK}`,
        }}
      >
        PRE-ORDER
      </span>

      {/* 100 SETS callout bottom-right */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          bottom: 18,
          right: 4,
          padding: "3px 9px",
          background: CREAM,
          color: CRIMSON,
          border: `2px solid ${INK}`,
          fontFamily: "var(--font-mono), monospace",
          fontSize: 10,
          letterSpacing: "0.28em",
          fontWeight: 800,
          lineHeight: 1,
          transform: "rotate(6deg)",
          boxShadow: `2px 2px 0 ${INK}`,
        }}
      >
        100 / 100
      </span>
    </span>
  );
}
