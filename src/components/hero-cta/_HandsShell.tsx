"use client";

import type { ReactNode } from "react";
import { useId } from "react";

/* Shared shell for the POINTERS family — radial-mask rays behind, pill
   button with maximalist detail (halftone corners, inset dashed ring,
   dual ✦ asterisks, hand-drawn wavy underline). Each variant passes in
   its left + right hand / dagger render. */

export interface HandsShellProps {
  onBuy?: () => void;
  leftHand: ReactNode;
  rightHand: ReactNode;
  bubble?: string;
  accent?: string;
  /** Override the background rays with custom artwork (lab experiments). */
  rays?: ReactNode;
}

const INK = "#1a1a1a";
const CREAM = "#F5ECCE";
const CRIMSON = "#d7322e";
const GOLD = "#F7C234";
const GOLD_LIGHT = "#FFE27A";

const HALFTONE_CREAM = `radial-gradient(circle at center, ${CREAM} 26%, transparent 28%)`;

export function HandsShell({
  onBuy,
  leftHand,
  rightHand,
  bubble = "TAP!",
  accent = GOLD,
  rays,
}: HandsShellProps) {
  const uid = useId().replace(/:/g, "");
  const gradId = `rays-grad-${uid}`;
  const maskId = `rays-mask-${uid}`;

  return (
    <span
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        gap: leftHand || rightHand ? 18 : 0,
        padding: "52px 10px",
      }}
    >
      {/* Rays — if a custom slot is provided (lab), use it; otherwise the
          default radial-masked rotating sunburst. */}
      {rays ? (
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {rays}
        </span>
      ) : (
        <>
          {/* Soft golden halo — stationary radial glow behind everything */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 360,
              height: 360,
              pointerEvents: "none",
              background: `radial-gradient(circle at center, rgba(255,226,122,0.55) 0%, rgba(247,194,52,0.28) 28%, rgba(247,194,52,0.1) 55%, rgba(247,194,52,0) 75%)`,
              borderRadius: "50%",
              filter: "blur(3px)",
            }}
          />

          {/* Golden rotating beams — wide gold wedges, softly masked */}
          <svg
            aria-hidden
            viewBox="0 0 400 400"
            preserveAspectRatio="xMidYMid meet"
            className="cta-hands-rays"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 360,
              height: 360,
              pointerEvents: "none",
              opacity: 0.5,
              transformOrigin: "center",
              mixBlendMode: "screen",
            }}
          >
            <defs>
              <radialGradient id={gradId} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="white" stopOpacity="0" />
                <stop offset="28%" stopColor="white" stopOpacity="0" />
                <stop offset="46%" stopColor="white" stopOpacity="0.9" />
                <stop offset="72%" stopColor="white" stopOpacity="1" />
                <stop offset="92%" stopColor="white" stopOpacity="0.35" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </radialGradient>
              <mask id={maskId}>
                <rect x="0" y="0" width="400" height="400" fill={`url(#${gradId})`} />
              </mask>
            </defs>
            <g mask={`url(#${maskId})`}>
              {Array.from({ length: 16 }).map((_, i) => {
                const a = (i / 16) * Math.PI * 2;
                const spread = 0.08;
                /* Round so SSR and client strings match (avoids hydration
                 warnings — float math can diverge on the last decimal). */
                const x1 = (200 + Math.cos(a - spread) * 200).toFixed(2);
                const y1 = (200 + Math.sin(a - spread) * 200).toFixed(2);
                const x2 = (200 + Math.cos(a + spread) * 200).toFixed(2);
                const y2 = (200 + Math.sin(a + spread) * 200).toFixed(2);
                return (
                  <polygon
                    key={i}
                    points={`200,200 ${x1},${y1} ${x2},${y2}`}
                    fill={GOLD_LIGHT}
                    opacity="0.8"
                  />
                );
              })}
            </g>
          </svg>

          {/* Anime sparkle stars — 2 per side. Left stars use crimson so they
             stay visible against the gold rays; right stars stay gold. */}
          <span
            aria-hidden
            className="cta-hands-star"
            style={{
              position: "absolute",
              top: "20%",
              left: "14%",
              color: CRIMSON,
              fontSize: 44,
              lineHeight: 1,
              textShadow: `2px 2px 0 ${INK}, 0 0 12px ${GOLD}`,
              transform: "rotate(-12deg)",
              pointerEvents: "none",
            }}
          >
            ✦
          </span>
          <span
            aria-hidden
            className="cta-hands-star cta-hands-star-delay-2"
            style={{
              position: "absolute",
              bottom: "20%",
              left: "18%",
              color: CRIMSON,
              fontSize: 36,
              lineHeight: 1,
              textShadow: `2px 2px 0 ${INK}, 0 0 10px ${GOLD_LIGHT}`,
              transform: "rotate(8deg)",
              pointerEvents: "none",
            }}
          >
            ✦
          </span>
          <span
            aria-hidden
            className="cta-hands-star cta-hands-star-delay-1"
            style={{
              position: "absolute",
              top: "20%",
              right: "14%",
              color: GOLD,
              fontSize: 50,
              lineHeight: 1,
              textShadow: `2px 2px 0 ${INK}, 0 0 12px ${GOLD_LIGHT}`,
              transform: "rotate(16deg)",
              pointerEvents: "none",
            }}
          >
            ✦
          </span>
          <span
            aria-hidden
            className="cta-hands-star cta-hands-star-delay-3"
            style={{
              position: "absolute",
              bottom: "22%",
              right: "18%",
              color: GOLD_LIGHT,
              fontSize: 38,
              lineHeight: 1,
              textShadow: `2px 2px 0 ${INK}, 0 0 10px ${GOLD}`,
              transform: "rotate(-8deg)",
              pointerEvents: "none",
            }}
          >
            ✦
          </span>
        </>
      )}

      <span style={{ position: "relative" }}>{leftHand}</span>

      <button
        type="button"
        onClick={onBuy}
        className="cta-hands"
        style={{
          position: "relative",
          display: "inline-block",
          padding: "28px 54px 30px",
          background: CRIMSON,
          color: CREAM,
          border: `3.5px solid ${INK}`,
          borderRadius: 999,
          cursor: "pointer",
          fontFamily: "var(--font-tattoo), sans-serif",
          fontSize: "clamp(36px, 6vw, 46px)",
          letterSpacing: "0.02em",
          lineHeight: 1,
          boxShadow: `7px 7px 0 ${GOLD}, 7px 7px 0 2px ${INK}`,
          transition: "transform 120ms ease-out, box-shadow 120ms ease-out",
          overflow: "visible",
        }}
      >
        {/* Inset dashed cream ring — moulded-plastic depth */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: 5,
            borderRadius: 999,
            border: `1.5px dashed ${CREAM}`,
            opacity: 0.45,
            pointerEvents: "none",
          }}
        />

        {/* Halftone cream dot corners */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: 2,
            left: 14,
            width: 46,
            height: 20,
            backgroundImage: HALFTONE_CREAM,
            backgroundSize: "5px 5px",
            opacity: 0.4,
            pointerEvents: "none",
            borderRadius: 999,
          }}
        />
        <span
          aria-hidden
          style={{
            position: "absolute",
            bottom: 2,
            right: 14,
            width: 46,
            height: 20,
            backgroundImage: HALFTONE_CREAM,
            backgroundSize: "5px 5px",
            opacity: 0.4,
            pointerEvents: "none",
            borderRadius: 999,
          }}
        />

        {/* Speech bubble above */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: -38,
            left: "50%",
            transform: "translateX(-50%) rotate(-4deg)",
            padding: "7px 16px",
            background: CREAM,
            color: CRIMSON,
            border: `3px solid ${INK}`,
            fontFamily: "var(--font-tattoo), sans-serif",
            fontSize: 28,
            lineHeight: 1,
            letterSpacing: "0.04em",
            boxShadow: `3px 3px 0 ${INK}`,
            whiteSpace: "nowrap",
          }}
        >
          {bubble}
        </span>

        {/* Asterisks at diagonally-opposed corners */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: -12,
            right: -12,
            color: accent,
            fontSize: 36,
            lineHeight: 1,
            transform: "rotate(10deg)",
            textShadow: `1.5px 1.5px 0 ${INK}, 0 0 10px ${GOLD_LIGHT}`,
          }}
        >
          ✦
        </span>
        <span
          aria-hidden
          style={{
            position: "absolute",
            bottom: -12,
            left: -12,
            color: CREAM,
            fontSize: 30,
            lineHeight: 1,
            transform: "rotate(-14deg)",
            textShadow: `1.5px 1.5px 0 ${INK}, 0 0 10px ${GOLD}`,
            opacity: 0.95,
          }}
        >
          ✦
        </span>

        <span style={{ position: "relative" }}>COLLECT YOURS</span>

        {/* Hand-drawn wavy underline beneath the text */}
        <svg
          aria-hidden
          width="200"
          height="10"
          viewBox="0 0 200 10"
          style={{
            position: "absolute",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            pointerEvents: "none",
            opacity: 0.7,
          }}
        >
          <path
            d="M 2 6 Q 18 1 36 6 T 72 6 T 108 6 T 144 6 T 180 6 T 198 6"
            stroke={CREAM}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>

        <style>{`
          .cta-hands:hover { transform: translate(-1px, -1px); box-shadow: 8px 8px 0 ${GOLD}, 8px 8px 0 2px ${INK}; }
          .cta-hands:active { transform: translate(5px, 5px); box-shadow: 2px 2px 0 ${GOLD}, 2px 2px 0 2px ${INK}; }
          @keyframes cta-hands-spin {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
          }
.cta-hands-rays { animation: cta-hands-spin 50s linear infinite; }
          @keyframes cta-hands-twinkle {
            0%, 100% { opacity: 1; filter: brightness(1); }
            50% { opacity: 0.55; filter: brightness(1.3); }
          }
          .cta-hands-star { animation: cta-hands-twinkle 2.6s ease-in-out infinite; }
          .cta-hands-star-delay-1 { animation-delay: 0.4s; }
          .cta-hands-star-delay-2 { animation-delay: 0.9s; }
          .cta-hands-star-delay-3 { animation-delay: 1.4s; }
        `}</style>
      </button>

      <span style={{ position: "relative" }}>{rightHand}</span>
    </span>
  );
}
