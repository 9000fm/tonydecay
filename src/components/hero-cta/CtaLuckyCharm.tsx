"use client";

/* D4 — LUCKY CHARM. Round medallion / coin silhouette suspended from a
   small ring / loop at the top (like a charm or capsule-toy keepsake).
   Gold outer with ink-milled rim, crimson inner coin face with Anton
   COLLECT YOURS stacked, tiny ✦ sparkles orbiting. Chain-loop at top. */

interface Props {
  onBuy?: () => void;
}

const INK = "#1a1a1a";
const CREAM = "#F5ECCE";
const CRIMSON = "#d7322e";
const CRIMSON_DARK = "#7a1310";
const GOLD = "#F7C234";
const GOLD_DEEP = "#C38A1E";

export function CtaLuckyCharm({ onBuy }: Props) {
  return (
    <div
      style={{ position: "relative", display: "inline-block", paddingTop: 16, paddingBottom: 14 }}
    >
      {/* Chain loop above */}
      <svg
        aria-hidden
        width="28"
        height="32"
        viewBox="0 0 28 32"
        style={{ position: "absolute", top: -6, left: "50%", transform: "translateX(-50%)" }}
      >
        <rect x="11" y="20" width="6" height="10" fill={GOLD_DEEP} stroke={INK} strokeWidth="1.8" />
        <ellipse cx="14" cy="12" rx="9" ry="11" fill="none" stroke={INK} strokeWidth="2.5" />
        <ellipse cx="14" cy="12" rx="5" ry="7" fill="none" stroke={GOLD} strokeWidth="1.4" />
      </svg>

      {/* Sparkle orbit accents */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: 60,
          left: -14,
          color: GOLD,
          fontFamily: "var(--font-tattoo), sans-serif",
          fontSize: 22,
          textShadow: `1px 1px 0 ${INK}`,
          transform: "rotate(-14deg)",
        }}
      >
        ✦
      </span>
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: 42,
          right: -8,
          color: CRIMSON,
          fontFamily: "var(--font-tattoo), sans-serif",
          fontSize: 18,
          textShadow: `1px 1px 0 ${INK}`,
          transform: "rotate(12deg)",
        }}
      >
        ✦
      </span>
      <span
        aria-hidden
        style={{
          position: "absolute",
          bottom: 20,
          left: -4,
          color: CRIMSON,
          fontFamily: "var(--font-tattoo), sans-serif",
          fontSize: 14,
          textShadow: `1px 1px 0 ${INK}`,
          transform: "rotate(18deg)",
        }}
      >
        ✦
      </span>
      <span
        aria-hidden
        style={{
          position: "absolute",
          bottom: 30,
          right: -12,
          color: GOLD,
          fontFamily: "var(--font-tattoo), sans-serif",
          fontSize: 16,
          textShadow: `1px 1px 0 ${INK}`,
          transform: "rotate(-8deg)",
        }}
      >
        ✦
      </span>

      {/* Main medallion */}
      <button
        type="button"
        onClick={onBuy}
        className="cta-charm"
        style={{
          position: "relative",
          marginTop: 32,
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: `radial-gradient(circle at 32% 28%, #FFE27A 0%, ${GOLD} 55%, ${GOLD_DEEP} 100%)`,
          border: `4px solid ${INK}`,
          cursor: "pointer",
          fontFamily: "inherit",
          padding: 0,
          boxShadow: `6px 6px 0 ${INK}`,
          transition: "transform 120ms ease-out, box-shadow 120ms ease-out",
          overflow: "hidden",
        }}
      >
        {/* Milled edge tick marks */}
        <svg
          aria-hidden
          viewBox="0 0 220 220"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          {Array.from({ length: 36 }).map((_, i) => {
            const a = (i / 36) * Math.PI * 2;
            const x1 = 110 + Math.cos(a) * 98;
            const y1 = 110 + Math.sin(a) * 98;
            const x2 = 110 + Math.cos(a) * 104;
            const y2 = 110 + Math.sin(a) * 104;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={INK} strokeWidth="1.5" />;
          })}
          {/* Inner ring */}
          <circle cx="110" cy="110" r="92" fill="none" stroke={INK} strokeWidth="1.5" />
        </svg>

        {/* Crimson inner face */}
        <span
          style={{
            position: "absolute",
            top: 26,
            left: 26,
            right: 26,
            bottom: 26,
            borderRadius: "50%",
            background: `radial-gradient(circle at 32% 28%, #F25448 0%, ${CRIMSON} 55%, ${CRIMSON_DARK} 100%)`,
            border: `3px solid ${INK}`,
            color: CREAM,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            boxShadow: `inset 4px 4px 0 rgba(255,255,255,0.1), inset -4px -4px 0 rgba(0,0,0,0.2)`,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 9,
              letterSpacing: "0.42em",
              fontWeight: 800,
              color: GOLD,
              lineHeight: 1,
            }}
          >
            ★ LUCKY ★
          </span>
          <span
            style={{
              fontFamily: "var(--font-tattoo), sans-serif",
              fontSize: 30,
              lineHeight: 0.9,
              letterSpacing: "0.01em",
              textShadow: `2px 2px 0 ${CRIMSON_DARK}`,
              textAlign: "center",
            }}
          >
            COLLECT
            <br />
            YOURS
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 9,
              letterSpacing: "0.42em",
              fontWeight: 800,
              color: GOLD,
              opacity: 0.85,
              lineHeight: 1,
            }}
          >
            N°01 / 100
          </span>
        </span>

        <style>{`
          .cta-charm:hover { transform: translate(-1px, -1px); box-shadow: 7px 7px 0 ${INK}; }
          .cta-charm:active { transform: translate(4px, 4px); box-shadow: 1px 1px 0 ${INK}; }
        `}</style>
      </button>
    </div>
  );
}
