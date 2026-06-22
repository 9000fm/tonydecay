"use client";

import { useState } from "react";
import {
  ALL_PRINTS,
  ComingSoon,
  EmailCapture,
  IgLink,
  Monogram,
  PrintCard,
  ShippingLine,
  Shell,
  Wordmark,
} from "./_parts";

/* Shared coming-soon layout.
   Mobile = V1 centered stack (fixed).
   Desktop = V2 editorial split — text left, prints right. The desktop print
   ARRANGEMENT is the only thing that varies, passed in via `desktopPrints`.
   Clicking any print swaps it for a random print not currently shown. */

const MOBILE_SLOTS = [
  { rot: -7, z: 10 },
  { rot: 0, z: 20 },
  { rot: 7, z: 10 },
];

type SwapFn = (i: number) => void;

export function ComingSoonCombined({
  desktopPrints,
}: {
  desktopPrints: (prints: string[], onSwap: SwapFn) => React.ReactNode;
}) {
  // Stable default set rendered on server + client (no reshuffle flip on load).
  // Randomness lives in click-to-swap below.
  const [prints, setPrints] = useState<string[]>(() => ALL_PRINTS.slice(0, 5));

  function swap(i: number) {
    setPrints((prev) => {
      const used = new Set(prev);
      const free = ALL_PRINTS.filter((p) => !used.has(p));
      if (!free.length) return prev;
      const pick = free[Math.floor(Math.random() * free.length)];
      const next = [...prev];
      next[i] = pick;
      return next;
    });
  }

  return (
    <Shell className="flex items-center justify-center px-6 py-8 sm:px-10 sm:py-16">
      {/* MOBILE — V1 centered stack (sized to fit one screen, no scroll) */}
      <div className="flex w-full flex-col items-center text-center lg:hidden">
        <ComingSoon className="relative z-10 mb-3 text-sm tracking-[0.3em] sm:text-base" />
        <Wordmark className="relative z-10" style={{ fontSize: "clamp(2.8rem, 12vw, 8rem)" }} />

        <div className="relative z-10 mt-5 mb-5 flex items-center justify-center">
          {MOBILE_SLOTS.map((s, i) => (
            <PrintCard
              key={i}
              src={prints[i]}
              onClick={() => swap(i)}
              style={{
                width: "clamp(108px, 29vw, 200px)",
                transform: `rotate(${s.rot}deg)`,
                marginLeft: i === 0 ? 0 : "-2.5rem",
                zIndex: s.z,
              }}
            />
          ))}
        </div>

        <ShippingLine className="relative z-10 mb-5 text-[12px] tracking-[0.25em]" />
        <EmailCapture className="relative z-10 mx-auto max-w-xs" />
        <div className="relative z-10 mt-6 flex items-center gap-4">
          <Monogram className="w-[clamp(28px,5.5vw,42px)]" opacity={0.85} />
          <IgLink className="w-[clamp(17px,3.2vw,21px)]" />
        </div>
      </div>

      {/* DESKTOP — V2 editorial split */}
      <div className="mx-auto hidden w-full max-w-6xl items-center gap-16 lg:grid lg:grid-cols-2">
        {/* prints (arrangement varies) */}
        <div className="relative z-10 order-2">{desktopPrints(prints, swap)}</div>

        {/* text */}
        <div className="relative z-10 order-1 flex flex-col items-start text-left">
          <ComingSoon className="mb-4 text-sm tracking-[0.3em] sm:text-base" />
          <Wordmark style={{ fontSize: "clamp(2.6rem, 6vw, 5rem)" }} />
          <ShippingLine className="mt-5 mb-8 text-[12px] tracking-[0.25em]" />
          <EmailCapture className="max-w-md" />
          <div className="mt-10 flex items-center gap-4">
            <Monogram className="w-[clamp(32px,6vw,46px)]" opacity={0.85} />
            <IgLink className="w-[clamp(19px,2vw,23px)]" />
          </div>
        </div>
      </div>
    </Shell>
  );
}

/* ---- Desktop print arrangements ---- */

const FAN_SLOTS = [
  { rot: -7, z: 10 },
  { rot: 0, z: 20 },
  { rot: 7, z: 10 },
];

// D1 — bigger fanned trio (current), heavier
export function fannedTrio(prints: string[], onSwap: SwapFn) {
  return (
    <div className="flex items-center justify-end" style={{ marginRight: "-3rem" }}>
      {FAN_SLOTS.map((s, i) => (
        <PrintCard
          key={i}
          src={prints[i]}
          onClick={() => onSwap(i)}
          style={{
            width: "clamp(380px, 37vw, 600px)",
            transform: `rotate(${s.rot}deg)`,
            marginLeft: i === 0 ? 0 : "-7rem",
            zIndex: s.z,
          }}
        />
      ))}
    </div>
  );
}

// D2 — single hero print, big
export function singleHero(prints: string[], onSwap: SwapFn) {
  return (
    <div className="flex items-center justify-center">
      <PrintCard
        src={prints[0]}
        onClick={() => onSwap(0)}
        style={{
          width: "clamp(420px, 42vw, 640px)",
          transform: "rotate(-2deg)",
        }}
      />
    </div>
  );
}

// D3 — staggered spread, three prints offset vertically
const SPREAD_SLOTS = [
  { rot: -5, mt: "-3.5rem" },
  { rot: 3, mt: "3.5rem" },
  { rot: -2, mt: "-2rem" },
];

export function spreadTrio(prints: string[], onSwap: SwapFn) {
  return (
    <div className="flex items-center justify-center" style={{ marginLeft: "-4rem" }}>
      {SPREAD_SLOTS.map((s, i) => (
        <PrintCard
          key={i}
          src={prints[i]}
          onClick={() => onSwap(i)}
          style={{
            width: "clamp(400px, 38vw, 620px)",
            transform: `rotate(${s.rot}deg)`,
            marginLeft: i === 0 ? 0 : "-2.5rem",
            marginTop: s.mt,
            zIndex: 10 + i,
          }}
        />
      ))}
    </div>
  );
}

// D4 — oversized fan biased right, kept inside the frame
export function edgeBleed(prints: string[], onSwap: SwapFn) {
  return (
    <div className="flex items-center justify-end" style={{ marginRight: "-1.5rem" }}>
      {FAN_SLOTS.map((s, i) => (
        <PrintCard
          key={i}
          src={prints[i]}
          onClick={() => onSwap(i)}
          style={{
            width: "clamp(420px, 44vw, 660px)",
            transform: `rotate(${s.rot}deg)`,
            marginLeft: i === 0 ? 0 : "-9rem",
            zIndex: s.z,
          }}
        />
      ))}
    </div>
  );
}
