"use client";

import { HandsShell } from "./_HandsShell";

/* P2 — SAILOR-JERRY HAND. Chunky American tattoo-flash hand. Bold black
   outline, simple heavy shadows, small anchor tattooed on the cuff. */

const INK = "#1a1a1a";
const CREAM = "#F5ECCE";
const CRIMSON = "#d7322e";

function SailorHand({ flip }: { flip?: boolean }) {
  return (
    <svg
      aria-hidden
      width="78"
      height="70"
      viewBox="0 0 78 70"
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
    >
      {/* Sleeve/cuff */}
      <path
        d="M 2 14 L 22 10 L 22 56 L 2 52 Z"
        fill={CREAM}
        stroke={INK}
        strokeWidth="2.5"
        strokeLinejoin="miter"
      />
      {/* Cuff fold */}
      <path d="M 6 14 L 22 14 L 22 18 L 6 18 Z" fill="#d9d0a8" stroke={INK} strokeWidth="1.5" />
      {/* Anchor tattoo on the cuff */}
      <g stroke={INK} strokeWidth="1.5" fill="none" strokeLinecap="round">
        <line x1="10" y1="28" x2="10" y2="42" />
        <line x1="7" y1="30" x2="13" y2="30" />
        <path d="M 6 40 Q 10 44 14 40" />
      </g>
      {/* Shadow under cuff */}
      <rect x="2" y="48" width="20" height="4" fill={INK} opacity="0.2" />

      {/* Palm / back of hand */}
      <path
        d="M 22 14 Q 36 14 46 20 L 58 24 Q 64 26 64 30 Q 64 34 58 34 L 48 34 Q 42 34 38 38 Q 34 48 30 54 Q 22 58 18 52 Z"
        fill={CREAM}
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Knuckle line */}
      <path d="M 28 26 Q 36 26 44 24" stroke={INK} strokeWidth="2" fill="none" />
      {/* Palm shadow */}
      <path d="M 34 36 Q 40 38 44 42 Q 42 48 34 50" fill={INK} opacity="0.16" />

      {/* Thumb */}
      <path d="M 28 14 Q 20 4 30 2 Q 40 2 38 14" fill={CREAM} stroke={INK} strokeWidth="2.5" />
      <path d="M 32 8 L 34 10" stroke={INK} strokeWidth="1" opacity="0.5" />

      {/* Curled fingers */}
      <path d="M 42 40 Q 42 50 32 54" stroke={INK} strokeWidth="2" fill={CREAM} />
      <path d="M 38 42 Q 38 50 28 52" stroke={INK} strokeWidth="1.8" fill="none" />
      <path d="M 34 42 Q 34 48 24 50" stroke={INK} strokeWidth="1.5" fill="none" />

      {/* Pointing finger */}
      <path
        d="M 58 22 Q 74 20 76 28 Q 76 32 72 32 L 60 32 Q 54 32 54 26 Z"
        fill={CREAM}
        stroke={INK}
        strokeWidth="2.5"
        strokeLinejoin="miter"
      />
      {/* Fingernail */}
      <path d="M 70 24 L 74 26 L 72 30" fill={CRIMSON} stroke={INK} strokeWidth="1" />
      {/* Finger joint crease */}
      <line x1="62" y1="26" x2="62" y2="30" stroke={INK} strokeWidth="1.2" />
      <line x1="66" y1="25" x2="66" y2="30" stroke={INK} strokeWidth="1.2" />
    </svg>
  );
}

export function CtaHandsSailor({ onBuy }: { onBuy?: () => void }) {
  return (
    <HandsShell
      onBuy={onBuy}
      leftHand={<SailorHand />}
      rightHand={<SailorHand flip />}
      bubble="HERE!"
    />
  );
}
