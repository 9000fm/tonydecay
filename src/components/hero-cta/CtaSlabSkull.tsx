"use client";

import { SlabShell } from "./_SlabShell";

/* A1 — SLAB SKULL. Sailor-Jerry skull peeks over the top edge. Hollow eyes,
   toothy jaw, crossed needles behind. Cold, acid, classic tradi-flash. */

const INK = "#1a1a1a";
const CREAM = "#F5ECCE";

export function CtaSlabSkull({ onBuy }: { onBuy?: () => void }) {
  const mascot = (
    <svg aria-hidden width="66" height="72" viewBox="0 0 66 72">
      {/* Crossed tattoo needles behind */}
      <g stroke={INK} strokeWidth="2" strokeLinecap="round">
        <line x1="12" y1="8" x2="56" y2="42" />
        <line x1="54" y1="8" x2="12" y2="42" />
        <circle cx="10" cy="7" r="2.5" fill={INK} />
        <circle cx="56" cy="7" r="2.5" fill={INK} />
        <circle cx="12" cy="42" r="2" fill={INK} />
        <circle cx="54" cy="42" r="2" fill={INK} />
      </g>

      {/* Cranium */}
      <path
        d="M 10 36 Q 10 14 33 14 Q 56 14 56 36 Q 56 46 52 52 L 52 58 L 48 58 L 48 62 L 44 62 L 44 58 L 40 58 L 40 62 L 36 62 L 36 58 L 30 58 L 30 62 L 26 62 L 26 58 L 22 58 L 22 62 L 18 62 L 18 58 L 14 58 L 14 52 Q 10 46 10 36 Z"
        fill={CREAM}
        stroke={INK}
        strokeWidth="2.5"
        strokeLinejoin="miter"
      />

      {/* Eye sockets */}
      <ellipse cx="22" cy="36" rx="6" ry="7" fill={INK} />
      <ellipse cx="44" cy="36" rx="6" ry="7" fill={INK} />
      {/* Eye pinpoint highlight — cold/dead */}
      <circle cx="24" cy="34" r="1.2" fill={CREAM} />
      <circle cx="46" cy="34" r="1.2" fill={CREAM} />

      {/* Nose */}
      <path d="M 33 42 L 30 52 L 33 54 L 36 52 Z" fill={INK} />

      {/* Cheek hatching */}
      <g stroke={INK} strokeWidth="1" opacity="0.6">
        <line x1="12" y1="46" x2="18" y2="52" />
        <line x1="14" y1="44" x2="20" y2="50" />
        <line x1="54" y1="46" x2="48" y2="52" />
        <line x1="52" y1="44" x2="46" y2="50" />
      </g>

      {/* Tooth grooves */}
      <line x1="22" y1="58" x2="22" y2="62" stroke={INK} strokeWidth="1.5" />
      <line x1="26" y1="58" x2="26" y2="62" stroke={INK} strokeWidth="1.5" />
      <line x1="30" y1="58" x2="30" y2="62" stroke={INK} strokeWidth="1.5" />
      <line x1="36" y1="58" x2="36" y2="62" stroke={INK} strokeWidth="1.5" />
      <line x1="40" y1="58" x2="40" y2="62" stroke={INK} strokeWidth="1.5" />
      <line x1="44" y1="58" x2="44" y2="62" stroke={INK} strokeWidth="1.5" />
    </svg>
  );

  return (
    <SlabShell
      onBuy={onBuy}
      mascot={mascot}
      mascotWidth={66}
      mascotHeight={72}
      bubble="DEAD!"
      bubbleFont="tattoo"
    />
  );
}
