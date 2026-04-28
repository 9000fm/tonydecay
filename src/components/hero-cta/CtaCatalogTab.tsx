"use client";

/* D3 — CATALOG TAB. Structured index-tab feel. Top tab label (with corner
   number badge) attaches to a flat cream catalog row. Product-code tags
   on the left, grid-dot accent on the right, bottom divider strip. More
   restrained / editorial than the others. */

interface Props {
  onBuy?: () => void;
}

const INK = "#1a1a1a";
const CREAM = "#F5ECCE";
const CREAM_SOFT = "#FFFAED";
const CRIMSON = "#d7322e";

export function CtaCatalogTab({ onBuy }: Props) {
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Top tab strip — "folded over" the main block */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -14,
          left: 18,
          background: INK,
          color: CREAM,
          padding: "5px 16px 6px",
          fontFamily: "var(--font-mono), monospace",
          fontSize: 10,
          letterSpacing: "0.38em",
          fontWeight: 800,
          lineHeight: 1,
          clipPath: "polygon(0 0, 100% 0, calc(100% - 10px) 100%, 0 100%)",
          zIndex: 2,
        }}
      >
        INDEX · SECT. 01
      </div>

      {/* Corner number badge */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -22,
          right: -14,
          width: 46,
          height: 46,
          borderRadius: "50%",
          background: CRIMSON,
          color: CREAM,
          border: `3px solid ${INK}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-tattoo), sans-serif",
          fontSize: 20,
          lineHeight: 1,
          transform: "rotate(-6deg)",
          boxShadow: `3px 3px 0 ${INK}`,
          zIndex: 3,
        }}
      >
        N°1
      </div>

      <button
        type="button"
        onClick={onBuy}
        className="cta-catalog"
        style={{
          position: "relative",
          display: "block",
          padding: "24px 36px 24px 118px",
          background: CREAM_SOFT,
          border: `3px solid ${INK}`,
          boxShadow: `6px 6px 0 ${INK}`,
          cursor: "pointer",
          fontFamily: "inherit",
          textAlign: "left",
          color: INK,
          transition: "transform 120ms ease-out, box-shadow 120ms ease-out",
          minWidth: 360,
        }}
      >
        {/* Left product-code column */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: 3,
            bottom: 3,
            left: 3,
            width: 100,
            background: CREAM,
            borderRight: `2px solid ${INK}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            padding: "6px 4px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 9,
              letterSpacing: "0.3em",
              fontWeight: 800,
              color: INK,
              opacity: 0.55,
            }}
          >
            CODE
          </span>
          <span
            style={{
              fontFamily: "var(--font-tattoo), sans-serif",
              fontSize: 22,
              color: CRIMSON,
              lineHeight: 1,
              letterSpacing: "0.02em",
            }}
          >
            TD-01
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 9,
              letterSpacing: "0.3em",
              fontWeight: 800,
              color: INK,
              opacity: 0.55,
              marginTop: 4,
            }}
          >
            /100
          </span>
        </span>

        {/* Label eyebrow */}
        <span
          style={{
            display: "block",
            fontFamily: "var(--font-mono), monospace",
            fontSize: 9,
            letterSpacing: "0.38em",
            fontWeight: 800,
            color: CRIMSON,
            marginBottom: 4,
          }}
        >
          ORDER FORM · ROW 01
        </span>

        {/* Title */}
        <span
          style={{
            display: "block",
            fontFamily: "var(--font-tattoo), sans-serif",
            fontSize: "clamp(34px, 9vw, 42px)",
            lineHeight: 0.9,
            letterSpacing: "0.01em",
          }}
        >
          COLLECT YOURS
        </span>

        {/* Grid dot accent row */}
        <span
          aria-hidden
          style={{
            display: "inline-flex",
            gap: 5,
            marginTop: 8,
          }}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: i < 3 ? CRIMSON : INK,
                opacity: i < 3 ? 1 : 0.3,
              }}
            />
          ))}
        </span>

        {/* Bottom right pointer arrow */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            right: 14,
            bottom: 10,
            fontFamily: "var(--font-tattoo), sans-serif",
            fontSize: 22,
            color: INK,
            lineHeight: 1,
          }}
        >
          ▸
        </span>

        <style>{`
          .cta-catalog:hover { transform: translate(-1px, -1px); box-shadow: 7px 7px 0 ${INK}; }
          .cta-catalog:active { transform: translate(4px, 4px); box-shadow: 1px 1px 0 ${INK}; }
        `}</style>
      </button>

      {/* Bottom divider strip */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: -14,
          left: 18,
          right: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: "var(--font-mono), monospace",
          fontSize: 8,
          letterSpacing: "0.3em",
          fontWeight: 800,
          color: INK,
          opacity: 0.65,
        }}
      >
        <span>— PAGE 01 / TONY DECAY CATALOG</span>
        <span>·</span>
      </div>
    </div>
  );
}
