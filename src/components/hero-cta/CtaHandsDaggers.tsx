"use client";

import { HandsShell } from "./_HandsShell";

/* P3 — DAGGERS (daggers removed). Shell renders the glowing pill alone. */

export function CtaHandsDaggers({ onBuy }: { onBuy?: () => void }) {
  return (
    <HandsShell onBuy={onBuy} leftHand={null} rightHand={null} bubble="HERE!" accent="#F7C234" />
  );
}
