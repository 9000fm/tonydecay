"use client";

/* D1 — FLASH STAMP. Tattoo-flash price-sticker / hand-stamped collectible
   seal. Rectangular badge with rough edge-marks, thick ink border, cream
   paper interior, distressed crimson stamp accent, small printer's
   registration marks at corners, tiny pointing dagger + edition number tab. */

interface Props {
  onBuy?: () => void;
}

const INK = "#1a1a1a";
const CREAM = "#F5ECCE";
const CREAM_SOFT = "#FFFAED";
const CRIMSON = "#d7322e";

export function CtaFlashStamp({ onBuy }: Props) {
  return (
    <button
      type="button"
      onClick={onBuy}
      className="cta-flash"
      style={{
        position: "relative",
        display: "inline-block",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: 28,
        fontFamily: "inherit",
      }}
    >
      {/* Badge body */}
      <span
        className="cta-flash__body"
        style={{
          position: "relative",
          display: "inline-block",
          padding: "26px 56px 30px",
          background: CREAM_SOFT,
          border: `4px solid ${INK}`,
          boxShadow: `6px 6px 0 ${INK}`,
          transition: "transform 120ms ease-out, box-shadow 120ms ease-out",
          textAlign: "center",
          color: INK,
        }}
      >
        {/* Inner second rule — double-frame label look */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: 6,
            border: `1.5px solid ${INK}`,
            pointerEvents: "none",
          }}
        />

        {/* Corner registration cross-marks */}
        {[
          { top: -14, left: -14 },
          { top: -14, right: -14 },
          { bottom: -14, left: -14 },
          { bottom: -14, right: -14 },
        ].map((pos, i) => (
          <svg
            key={i}
            aria-hidden
            width="22"
            height="22"
            viewBox="0 0 22 22"
            style={{ position: "absolute", ...pos }}
          >
            <line x1="11" y1="2" x2="11" y2="20" stroke={INK} strokeWidth="1.2" />
            <line x1="2" y1="11" x2="20" y2="11" stroke={INK} strokeWidth="1.2" />
            <circle cx="11" cy="11" r="3" fill="none" stroke={INK} strokeWidth="1.2" />
          </svg>
        ))}

        {/* Top mono micro-line */}
        <span
          aria-hidden
          style={{
            display: "block",
            fontFamily: "var(--font-mono), monospace",
            fontSize: 9,
            letterSpacing: "0.42em",
            fontWeight: 800,
            color: CRIMSON,
            marginBottom: 4,
          }}
        >
          ★ LIMITED RELEASE ★
        </span>

        {/* Main text */}
        <span
          style={{
            position: "relative",
            display: "block",
            fontFamily: "var(--font-tattoo), sans-serif",
            fontSize: "clamp(42px, 12vw, 54px)",
            color: INK,
            lineHeight: 0.88,
            letterSpacing: "0.01em",
          }}
        >
          COLLECT
          <br />
          YOURS
        </span>

        {/* Distressed crimson stamp overlay */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            bottom: 10,
            right: 10,
            padding: "3px 10px",
            border: `2px solid ${CRIMSON}`,
            color: CRIMSON,
            fontFamily: "var(--font-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.32em",
            fontWeight: 800,
            transform: "rotate(-6deg)",
            lineHeight: 1,
          }}
        >
          N°01
        </span>

        {/* Tiny pointing dagger motif — left */}
        <svg
          aria-hidden
          width="34"
          height="14"
          viewBox="0 0 34 14"
          style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}
        >
          <circle cx="4" cy="7" r="3" fill={INK} />
          <rect x="7" y="5" width="4" height="4" fill={CRIMSON} stroke={INK} strokeWidth="0.8" />
          <polygon
            points="11,4 32,7 11,10"
            fill={CREAM}
            stroke={INK}
            strokeWidth="1.2"
            strokeLinejoin="miter"
          />
        </svg>

        {/* Bottom edition tab */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            bottom: -12,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "3px 12px",
            background: INK,
            color: CREAM,
            fontFamily: "var(--font-mono), monospace",
            fontSize: 9,
            letterSpacing: "0.38em",
            fontWeight: 800,
            lineHeight: 1,
            clipPath: "polygon(0 0, 100% 0, 92% 100%, 8% 100%)",
          }}
        >
          ED. 01 / 100
        </span>
      </span>

      <style>{`
        .cta-flash:hover .cta-flash__body {
          transform: translate(-1px, -1px);
          box-shadow: 7px 7px 0 ${INK};
        }
        .cta-flash:active .cta-flash__body {
          transform: translate(4px, 4px);
          box-shadow: 1px 1px 0 ${INK};
        }
      `}</style>
    </button>
  );
}
