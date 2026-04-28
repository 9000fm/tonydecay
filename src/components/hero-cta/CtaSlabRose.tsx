"use client";

import { SlabShell } from "./_SlabShell";

/* A4 — SLAB ROSE. Single traditional tattoo rose peeking over the top —
   heavy black outline, layered petals, thorned stem curling. Cold beauty. */

const INK = "#1a1a1a";
const CREAM = "#F5ECCE";
const CRIMSON = "#d7322e";
const CRIMSON_DEEP = "#7a1310";
const LEAF = "#3a8b3a";

export function CtaSlabRose({ onBuy }: { onBuy?: () => void }) {
  const mascot = (
    <svg aria-hidden width="72" height="82" viewBox="0 0 72 82">
      {/* Stem */}
      <path
        d="M 36 82 Q 30 70 36 60 Q 42 50 36 40"
        stroke={INK}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      {/* Thorns */}
      <path d="M 34 70 L 28 68 L 34 66 Z" fill={INK} />
      <path d="M 38 76 L 44 74 L 38 72 Z" fill={INK} />
      <path d="M 34 56 L 28 54 L 34 52 Z" fill={INK} />

      {/* Leaves */}
      <path
        d="M 36 64 Q 14 62 8 54 Q 16 52 28 56 Q 32 58 36 64 Z"
        fill={LEAF}
        stroke={INK}
        strokeWidth="2"
        strokeLinejoin="miter"
      />
      <line x1="14" y1="56" x2="24" y2="60" stroke={INK} strokeWidth="1" opacity="0.6" />

      <path
        d="M 36 54 Q 58 52 64 44 Q 56 42 44 46 Q 40 48 36 54 Z"
        fill={LEAF}
        stroke={INK}
        strokeWidth="2"
        strokeLinejoin="miter"
      />
      <line x1="58" y1="46" x2="48" y2="50" stroke={INK} strokeWidth="1" opacity="0.6" />

      {/* Outer petals */}
      <path
        d="M 36 8 Q 12 12 10 30 Q 12 48 36 48 Q 60 48 62 30 Q 60 12 36 8 Z"
        fill={CRIMSON}
        stroke={INK}
        strokeWidth="2.5"
        strokeLinejoin="miter"
      />

      {/* Inner petals */}
      <path
        d="M 36 16 Q 18 18 16 30 Q 18 42 36 42 Q 54 42 56 30 Q 54 18 36 16 Z"
        fill={CRIMSON_DEEP}
        stroke={INK}
        strokeWidth="2"
      />
      {/* Petal folds */}
      <path
        d="M 36 22 Q 22 24 22 32 Q 24 40 36 38 Q 48 40 50 32 Q 50 24 36 22 Z"
        fill={CRIMSON}
        stroke={INK}
        strokeWidth="1.5"
      />
      <path
        d="M 36 26 Q 28 28 28 32 Q 30 36 36 34 Q 42 36 44 32 Q 44 28 36 26 Z"
        fill={CRIMSON_DEEP}
        stroke={INK}
        strokeWidth="1.2"
      />

      {/* Center bud */}
      <path d="M 32 30 Q 32 26 36 26 Q 40 26 40 30 Q 40 34 36 34 Q 32 34 32 30 Z" fill={INK} />
      <circle cx="36" cy="30" r="1" fill={CREAM} />
    </svg>
  );

  return (
    <SlabShell
      onBuy={onBuy}
      mascot={mascot}
      mascotWidth={72}
      mascotHeight={82}
      bubble="THORN"
      bubbleFont="tattoo"
    />
  );
}
