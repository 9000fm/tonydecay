"use client";

import type { ReactNode } from "react";

/* Shared shell for the SLAB family (gold rectangle with a mascot peeking
   over the top edge, halftone dots, ✦ asterisks, hand-drawn wavy underline,
   stacked crimson + ink offset shadow). Each variant passes in its mascot
   SVG and speech-bubble text — everything else stays identical. */

export interface SlabShellProps {
  onBuy?: () => void;
  mascot: ReactNode;
  mascotWidth?: number;
  mascotHeight?: number;
  bubble?: string;
  bubbleFont?: "jp" | "tattoo";
}

const INK = "#1a1a1a";
const CREAM = "#F5ECCE";
const CRIMSON = "#d7322e";
const GOLD = "#F7C234";

const HALFTONE = `radial-gradient(circle at center, ${CRIMSON} 26%, transparent 28%)`;

export function SlabShell({
  onBuy,
  mascot,
  mascotWidth = 68,
  mascotHeight = 58,
  bubble = "LTD!",
  bubbleFont = "tattoo",
}: SlabShellProps) {
  return (
    <button
      type="button"
      onClick={onBuy}
      className="cta-slab"
      style={{
        position: "relative",
        display: "inline-block",
        padding: "28px 44px 24px",
        background: GOLD,
        color: INK,
        border: `3px solid ${INK}`,
        outline: `2px solid ${CREAM}`,
        outlineOffset: -8,
        cursor: "pointer",
        fontFamily: "var(--font-tattoo), sans-serif",
        fontSize: 34,
        letterSpacing: "0.015em",
        lineHeight: 1,
        boxShadow: `7px 7px 0 ${CRIMSON}, 7px 7px 0 2px ${INK}`,
        transition: "transform 120ms ease-out, box-shadow 120ms ease-out",
        marginTop: Math.max(38, mascotHeight - 20),
      }}
    >
      {/* Halftone corners */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: -2,
          left: -2,
          width: 56,
          height: 36,
          backgroundImage: HALFTONE,
          backgroundSize: "6px 6px",
          opacity: 0.5,
          pointerEvents: "none",
        }}
      />
      <span
        aria-hidden
        style={{
          position: "absolute",
          bottom: -2,
          right: -2,
          width: 56,
          height: 36,
          backgroundImage: HALFTONE,
          backgroundSize: "6px 6px",
          opacity: 0.5,
          pointerEvents: "none",
        }}
      />

      {/* Mascot slot — sits above the top-center edge */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: -(mascotHeight - 12),
          left: "50%",
          transform: "translateX(-50%)",
          pointerEvents: "none",
          width: mascotWidth,
          height: mascotHeight,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        {mascot}
      </span>

      {/* Speech bubble top-left */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: -22,
          left: -22,
          padding: "5px 9px",
          background: CREAM,
          border: `2.5px solid ${INK}`,
          fontFamily:
            bubbleFont === "jp"
              ? "var(--font-jp), var(--font-tattoo), sans-serif"
              : "var(--font-tattoo), sans-serif",
          fontSize: bubbleFont === "jp" ? 14 : 16,
          color: CRIMSON,
          lineHeight: 1,
          letterSpacing: "0.04em",
          transform: "rotate(-8deg)",
          boxShadow: `2px 2px 0 ${INK}`,
          whiteSpace: "nowrap",
        }}
      >
        {bubble}
      </span>

      {/* Asterisks */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: 6,
          right: 10,
          color: CRIMSON,
          fontFamily: "var(--font-tattoo), sans-serif",
          fontSize: 22,
          lineHeight: 1,
          transform: "rotate(-8deg)",
        }}
      >
        ✦
      </span>
      <span
        aria-hidden
        style={{
          position: "absolute",
          bottom: 6,
          left: 10,
          color: CRIMSON,
          fontFamily: "var(--font-tattoo), sans-serif",
          fontSize: 22,
          lineHeight: 1,
          transform: "rotate(12deg)",
        }}
      >
        ✦
      </span>

      <span style={{ position: "relative" }}>COLLECT YOURS</span>

      {/* Wavy hand-drawn underline */}
      <svg
        aria-hidden
        width="220"
        height="10"
        viewBox="0 0 220 10"
        style={{
          position: "absolute",
          bottom: 10,
          left: "50%",
          transform: "translateX(-50%)",
          pointerEvents: "none",
        }}
      >
        <path
          d="M 2 6 Q 20 1 40 6 T 80 6 T 120 6 T 160 6 T 200 6 T 218 6"
          stroke={INK}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </svg>

      <style>{`
        .cta-slab:hover { transform: translate(-1px, -1px); box-shadow: 8px 8px 0 ${CRIMSON}, 8px 8px 0 2px ${INK}; }
        .cta-slab:active { transform: translate(5px, 5px); box-shadow: 2px 2px 0 ${CRIMSON}, 2px 2px 0 2px ${INK}; }
      `}</style>
    </button>
  );
}
