"use client";

import { SlabShell } from "./_SlabShell";

/* A3 — SLAB HANNYA. Japanese demon/ogre mask (hannya) peeks over the top.
   Horned, snarling, fanged, narrowed eyes. Acid, iconic irezumi vocabulary. */

const INK = "#1a1a1a";
const CREAM = "#F5ECCE";
const CRIMSON = "#d7322e";
const HANNYA = "#e8c7a3";

export function CtaSlabHannya({ onBuy }: { onBuy?: () => void }) {
  const mascot = (
    <svg aria-hidden width="80" height="76" viewBox="0 0 80 76">
      {/* Horns */}
      <path
        d="M 14 24 L 4 4 L 16 14 Z"
        fill={CREAM}
        stroke={INK}
        strokeWidth="2"
        strokeLinejoin="miter"
      />
      <path
        d="M 66 24 L 76 4 L 64 14 Z"
        fill={CREAM}
        stroke={INK}
        strokeWidth="2"
        strokeLinejoin="miter"
      />

      {/* Face shape */}
      <path
        d="M 12 30 Q 12 14 40 14 Q 68 14 68 30 Q 68 54 56 64 L 48 70 L 40 68 L 32 70 L 24 64 Q 12 54 12 30 Z"
        fill={HANNYA}
        stroke={INK}
        strokeWidth="2.5"
        strokeLinejoin="miter"
      />

      {/* Forehead wrinkles */}
      <g stroke={INK} strokeWidth="1.5" fill="none" strokeLinecap="round">
        <path d="M 22 22 Q 26 20 30 22" />
        <path d="M 34 21 Q 40 19 46 21" />
        <path d="M 50 22 Q 54 20 58 22" />
      </g>

      {/* Narrowed angry eyes (upturned) */}
      <path d="M 20 34 L 32 30 L 30 38 L 22 38 Z" fill={INK} />
      <path d="M 60 34 L 48 30 L 50 38 L 58 38 Z" fill={INK} />
      {/* Eye gleam */}
      <circle cx="27" cy="34" r="1.2" fill={CREAM} />
      <circle cx="53" cy="34" r="1.2" fill={CREAM} />

      {/* Brow lines */}
      <path d="M 18 28 L 34 26" stroke={INK} strokeWidth="2.5" />
      <path d="M 46 26 L 62 28" stroke={INK} strokeWidth="2.5" />

      {/* Nose */}
      <path d="M 40 40 L 36 50 L 40 52 L 44 50 Z" fill={INK} opacity="0.7" />

      {/* Snarling mouth w/ fangs */}
      <path
        d="M 22 58 Q 40 72 58 58 Q 54 62 48 60 L 46 66 L 42 60 L 38 66 L 34 60 L 28 62 Z"
        fill={CRIMSON}
        stroke={INK}
        strokeWidth="2"
        strokeLinejoin="miter"
      />
      {/* Upper fangs */}
      <path d="M 32 58 L 34 66 L 36 58 Z" fill={CREAM} stroke={INK} strokeWidth="1.2" />
      <path d="M 44 58 L 46 66 L 48 58 Z" fill={CREAM} stroke={INK} strokeWidth="1.2" />

      {/* Side hatching */}
      <g stroke={INK} strokeWidth="0.8" opacity="0.6">
        <line x1="14" y1="40" x2="20" y2="46" />
        <line x1="16" y1="36" x2="22" y2="42" />
        <line x1="60" y1="46" x2="66" y2="40" />
        <line x1="58" y1="42" x2="64" y2="36" />
      </g>
    </svg>
  );

  return (
    <SlabShell
      onBuy={onBuy}
      mascot={mascot}
      mascotWidth={80}
      mascotHeight={76}
      bubble="鬼"
      bubbleFont="jp"
    />
  );
}
