"use client";

import { HandsShell } from "./_HandsShell";

/* P4 — SKELETON HAND. Bony pointing finger with carpal joints visible,
   cuff stops at the wrist where it becomes bare bone. Macabre flash. */

const INK = "#1a1a1a";
const CREAM = "#F5ECCE";

function SkeletonHand({ flip }: { flip?: boolean }) {
  return (
    <svg
      aria-hidden
      width="82"
      height="60"
      viewBox="0 0 82 60"
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
    >
      {/* Sleeve end */}
      <path
        d="M 2 14 L 16 8 L 16 52 L 2 46 Z"
        fill={INK}
        stroke={INK}
        strokeWidth="2"
        strokeLinejoin="miter"
      />
      {/* Sleeve ruffle */}
      <path d="M 14 8 L 20 4 L 22 12 L 20 14 Z" fill={INK} stroke={INK} strokeWidth="1.5" />
      <path d="M 14 52 L 20 56 L 22 48 L 20 46 Z" fill={INK} stroke={INK} strokeWidth="1.5" />

      {/* Wrist bones (radius/ulna stubs) */}
      <rect x="16" y="22" width="10" height="6" fill={CREAM} stroke={INK} strokeWidth="1.8" />
      <rect x="16" y="32" width="10" height="6" fill={CREAM} stroke={INK} strokeWidth="1.8" />

      {/* Carpals (little bones cluster) */}
      <circle cx="30" cy="24" r="3" fill={CREAM} stroke={INK} strokeWidth="1.5" />
      <circle cx="30" cy="30" r="3" fill={CREAM} stroke={INK} strokeWidth="1.5" />
      <circle cx="30" cy="36" r="3" fill={CREAM} stroke={INK} strokeWidth="1.5" />
      <circle cx="36" cy="27" r="3" fill={CREAM} stroke={INK} strokeWidth="1.5" />
      <circle cx="36" cy="33" r="3" fill={CREAM} stroke={INK} strokeWidth="1.5" />

      {/* Palm plate (metacarpal base) */}
      <path
        d="M 38 22 L 52 22 Q 56 22 56 26 L 56 34 Q 56 38 52 38 L 38 38 Z"
        fill={CREAM}
        stroke={INK}
        strokeWidth="2"
      />
      {/* Metacarpal bones */}
      <line x1="42" y1="22" x2="42" y2="38" stroke={INK} strokeWidth="1.2" />
      <line x1="47" y1="22" x2="47" y2="38" stroke={INK} strokeWidth="1.2" />
      <line x1="52" y1="22" x2="52" y2="38" stroke={INK} strokeWidth="1.2" />

      {/* Thumb (bony) */}
      <g>
        <ellipse cx="38" cy="14" rx="3" ry="4" fill={CREAM} stroke={INK} strokeWidth="1.5" />
        <ellipse cx="34" cy="10" rx="2.5" ry="3" fill={CREAM} stroke={INK} strokeWidth="1.5" />
      </g>

      {/* Curled fingers (bone segments) */}
      <g fill={CREAM} stroke={INK} strokeWidth="1.3">
        <rect x="38" y="40" width="4" height="6" rx="1" />
        <rect x="36" y="46" width="4" height="5" rx="1" />
        <rect x="43" y="40" width="4" height="6" rx="1" />
        <rect x="41" y="46" width="4" height="5" rx="1" />
        <rect x="48" y="40" width="4" height="6" rx="1" />
        <rect x="46" y="46" width="4" height="5" rx="1" />
      </g>

      {/* Pointing finger — 3 segments */}
      <rect x="54" y="26" width="8" height="8" fill={CREAM} stroke={INK} strokeWidth="1.8" rx="1" />
      <rect x="62" y="26" width="8" height="8" fill={CREAM} stroke={INK} strokeWidth="1.8" rx="1" />
      <path
        d="M 70 26 L 80 26 Q 82 26 82 30 Q 82 34 80 34 L 70 34 Z"
        fill={CREAM}
        stroke={INK}
        strokeWidth="1.8"
        strokeLinejoin="miter"
      />
      {/* Knuckle joints */}
      <circle cx="62" cy="30" r="2" fill={CREAM} stroke={INK} strokeWidth="1.2" />
      <circle cx="70" cy="30" r="2" fill={CREAM} stroke={INK} strokeWidth="1.2" />
    </svg>
  );
}

export function CtaHandsSkeleton({ onBuy }: { onBuy?: () => void }) {
  return (
    <HandsShell
      onBuy={onBuy}
      leftHand={<SkeletonHand />}
      rightHand={<SkeletonHand flip />}
      bubble="BONE!"
    />
  );
}
