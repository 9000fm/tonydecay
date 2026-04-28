"use client";

import { HandsShell } from "./_HandsShell";

/* P1 — WOODBLOCK MANICULE. 19th-century printer's fist: ruffled cuff,
   dense cross-hatched shading, extended index finger. Pure engraving. */

const INK = "#1a1a1a";
const CREAM = "#F5ECCE";

function Manicule({ flip }: { flip?: boolean }) {
  return (
    <svg
      aria-hidden
      width="76"
      height="58"
      viewBox="0 0 76 58"
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
    >
      {/* Ruffled cuff */}
      <path
        d="M 2 18 L 8 14 L 10 10 L 16 8 L 20 12 L 24 8 L 28 12 L 26 20 L 28 26 L 24 32 L 28 38 L 22 44 L 18 40 L 14 44 L 10 38 L 12 32 L 8 28 L 4 22 Z"
        fill={CREAM}
        stroke={INK}
        strokeWidth="1.8"
        strokeLinejoin="miter"
      />
      {/* Cuff shadow hatching */}
      <g stroke={INK} strokeWidth="0.7" fill="none" opacity="0.85">
        <line x1="6" y1="18" x2="12" y2="24" />
        <line x1="8" y1="14" x2="14" y2="20" />
        <line x1="6" y1="22" x2="14" y2="30" />
        <line x1="8" y1="28" x2="14" y2="34" />
        <line x1="10" y1="34" x2="16" y2="40" />
        <line x1="22" y1="14" x2="26" y2="18" />
        <line x1="22" y1="20" x2="26" y2="24" />
        <line x1="22" y1="26" x2="26" y2="30" />
      </g>

      {/* Palm */}
      <path
        d="M 28 12 Q 36 10 44 14 Q 50 16 54 20 L 62 24 Q 68 26 68 30 Q 68 34 62 34 L 52 34 Q 46 34 42 38 L 38 42 Q 32 44 26 40 Q 24 36 24 30 L 24 22 Z"
        fill={CREAM}
        stroke={INK}
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Palm crease hatching */}
      <g stroke={INK} strokeWidth="0.7" fill="none" opacity="0.75">
        <path d="M 32 16 Q 38 18 44 20" />
        <path d="M 34 22 Q 40 24 46 26" />
        <path d="M 30 28 Q 36 32 42 34" />
        <line x1="28" y1="22" x2="32" y2="26" />
        <line x1="28" y1="26" x2="32" y2="30" />
        <line x1="28" y1="30" x2="32" y2="34" />
      </g>

      {/* Thumb */}
      <path d="M 30 14 Q 24 8 30 4 Q 38 4 38 14" fill={CREAM} stroke={INK} strokeWidth="1.8" />
      <path d="M 32 8 L 35 10" stroke={INK} strokeWidth="0.8" opacity="0.6" />

      {/* Curled fingers */}
      <path
        d="M 42 36 Q 42 44 34 46 M 38 36 Q 38 42 30 44 M 34 36 Q 34 40 28 42"
        stroke={INK}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Pointing index finger */}
      <path
        d="M 54 20 Q 68 18 72 26 Q 72 30 68 30 L 56 30 Q 52 30 52 24 Z"
        fill={CREAM}
        stroke={INK}
        strokeWidth="1.8"
        strokeLinejoin="miter"
      />
      {/* Finger nail */}
      <path d="M 68 22 Q 71 22 71 26" stroke={INK} strokeWidth="1" fill="none" />
      {/* Finger creases */}
      <line x1="60" y1="24" x2="62" y2="26" stroke={INK} strokeWidth="0.7" opacity="0.65" />
      <line x1="64" y1="24" x2="66" y2="26" stroke={INK} strokeWidth="0.7" opacity="0.65" />
    </svg>
  );
}

export function CtaHandsWoodblock({ onBuy }: { onBuy?: () => void }) {
  return (
    <HandsShell
      onBuy={onBuy}
      leftHand={<Manicule />}
      rightHand={<Manicule flip />}
      bubble="☞ TAP"
    />
  );
}
