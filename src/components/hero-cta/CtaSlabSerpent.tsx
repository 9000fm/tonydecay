"use client";

import { SlabShell } from "./_SlabShell";

/* A2 — SLAB SERPENT. Snake head coiling over the top edge. Forked tongue
   out, diamond scales hatched, slit eye. Poisonous, cold. */

const INK = "#1a1a1a";
const CREAM = "#F5ECCE";
const CRIMSON = "#d7322e";
const GREEN = "#3a8b3a";

export function CtaSlabSerpent({ onBuy }: { onBuy?: () => void }) {
  const mascot = (
    <svg aria-hidden width="84" height="60" viewBox="0 0 84 60">
      {/* Coiled body */}
      <path
        d="M 4 50 Q 2 30 18 28 Q 34 26 38 40 Q 42 52 56 48 Q 68 44 70 30 Q 72 16 60 12"
        stroke={INK}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 4 50 Q 2 30 18 28 Q 34 26 38 40 Q 42 52 56 48 Q 68 44 70 30 Q 72 16 60 12"
        stroke={GREEN}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* Head */}
      <path
        d="M 54 4 Q 74 4 78 18 Q 80 28 70 32 Q 58 34 54 24 Q 50 14 54 4 Z"
        fill={GREEN}
        stroke={INK}
        strokeWidth="2.5"
        strokeLinejoin="miter"
      />

      {/* Scales hatching */}
      <g stroke={INK} strokeWidth="0.8" opacity="0.7" fill="none">
        <path d="M 58 10 L 62 14" />
        <path d="M 62 10 L 66 14" />
        <path d="M 66 10 L 70 14" />
        <path d="M 58 18 L 62 22" />
        <path d="M 62 18 L 66 22" />
        <path d="M 66 18 L 70 22" />
        <path d="M 60 26 L 64 30" />
        <path d="M 64 26 L 68 30" />
      </g>

      {/* Slit eye */}
      <ellipse cx="70" cy="14" rx="3.5" ry="4" fill={CREAM} stroke={INK} strokeWidth="1.5" />
      <ellipse cx="70" cy="14" rx="1" ry="3" fill={INK} />

      {/* Forked tongue */}
      <path
        d="M 52 18 L 38 14 L 34 10 M 38 14 L 34 18"
        stroke={CRIMSON}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />

      {/* Fang */}
      <path d="M 58 28 L 60 34 L 62 28" fill={CREAM} stroke={INK} strokeWidth="1.2" />
    </svg>
  );

  return (
    <SlabShell
      onBuy={onBuy}
      mascot={mascot}
      mascotWidth={84}
      mascotHeight={60}
      bubble="毒"
      bubbleFont="jp"
    />
  );
}
