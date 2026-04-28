"use client";

import Link from "next/link";
import { useState } from "react";
import { HandsShell } from "@/components/hero-cta/_HandsShell";
import { RaysKanji } from "@/components/hero-cta/rays/RaysKanji";
import { RaysDotGradient } from "@/components/hero-cta/rays/RaysDotGradient";
import { RaysOrbit } from "@/components/hero-cta/rays/RaysOrbit";
import { RaysSeigaiha } from "@/components/hero-cta/rays/RaysSeigaiha";
import { CtaFlashStamp } from "@/components/hero-cta/CtaFlashStamp";
import { CtaMagazineHype } from "@/components/hero-cta/CtaMagazineHype";
import { CtaCatalogTab } from "@/components/hero-cta/CtaCatalogTab";
import { CtaLuckyCharm } from "@/components/hero-cta/CtaLuckyCharm";

const INK = "#1a1a1a";
const CREAM = "#F5ECCE";
const CRIMSON = "#d7322e";
const GOLD = "#F7C234";

/* Dagger SVG — same as live, used to preview the ray alternatives */
function Dagger({ flip }: { flip?: boolean }) {
  return (
    <svg
      aria-hidden
      width="132"
      height="68"
      viewBox="0 0 86 44"
      style={{
        transform: flip ? "scaleX(-1)" : undefined,
        filter: "drop-shadow(2px 2px 0 rgba(0,0,0,0.35))",
      }}
    >
      <circle cx="8" cy="22" r="6" fill={GOLD} stroke={INK} strokeWidth="2" />
      <circle cx="8" cy="22" r="2" fill={INK} />
      <rect x="12" y="14" width="8" height="16" fill={GOLD} stroke={INK} strokeWidth="2" />
      <rect x="20" y="18" width="16" height="8" fill={CREAM} stroke={INK} strokeWidth="2" />
      <g stroke={INK} strokeWidth="1.2">
        <line x1="22" y1="18" x2="22" y2="26" />
        <line x1="25" y1="18" x2="25" y2="26" />
        <line x1="28" y1="18" x2="28" y2="26" />
        <line x1="31" y1="18" x2="31" y2="26" />
        <line x1="34" y1="18" x2="34" y2="26" />
      </g>
      <rect x="36" y="14" width="6" height="16" fill={CRIMSON} stroke={INK} strokeWidth="2" />
      <polygon
        points="42,14 82,22 42,30"
        fill={CREAM}
        stroke={INK}
        strokeWidth="2.5"
        strokeLinejoin="miter"
      />
      <line x1="44" y1="22" x2="80" y2="22" stroke={INK} strokeWidth="1" />
      <polyline
        points="46,18 76,21 46,22"
        fill="none"
        stroke={INK}
        strokeWidth="0.6"
        opacity="0.5"
      />
    </svg>
  );
}

type RayVariant = "R1" | "R2" | "R3" | "R4";
type CtaVariant = "D1" | "D2" | "D3" | "D4";

const RAYS: {
  id: RayVariant;
  name: string;
  blurb: string;
  chip: string;
}[] = [
  {
    id: "R1",
    name: "KANJI RADIAL",
    blurb:
      "12 kanji tokens (印·限·集·決·新·作·紙·刷·組·号·百·手) arranged around the button on cream square stamps. Slow 90s rotation, crimson + ink type. Pulls directly from the site's kanji-stamp stats badges.",
    chip: "#d7322e",
  },
  {
    id: "R2",
    name: "PAPER-DOT GRADIENT",
    blurb:
      "Pure halftone — no lines, just ~440 seeded dots forming a radial band around the button, dense near center and fading at the edges. Single crimson-accent dot scatter. Static. Matches the site's paper-dot backgrounds.",
    chip: "#1a1a1a",
  },
  {
    id: "R3",
    name: "TATTOO ORBIT",
    blurb:
      "12 tattoo-flash ornaments (✦ stars, teardrops, ink blots, mini daggers) orbit the button on a dashed ring. Ring rotates 42s; each ornament counter-rotates to stay upright. Pure tradi-flash vocabulary.",
    chip: "#F7C234",
  },
  {
    id: "R4",
    name: "SEIGAIHA WAVES",
    blurb:
      "4 concentric rings of seigaiha (Japanese wave) scallops — ink rings + one crimson outer ring — each scallop is nested 3 arcs for the traditional motif. Breathes 1 → 1.025 scale every 4s. Ties to the Katagami / JP print vocab.",
    chip: "#2B5DAE",
  },
];

const DIRECTIONS: {
  id: CtaVariant;
  name: string;
  blurb: string;
  bestIf: string;
  chip: string;
}[] = [
  {
    id: "D1",
    name: "FLASH STAMP",
    blurb:
      "Rectangular tattoo-flash badge — thick ink outline, cream paper interior, double inner rule, registration cross-marks at all 4 corners, crimson N°01 stamp tilted in the bottom-right, tiny pointing-dagger motif on the left, ED. 01/100 black chevron tab hanging off the bottom.",
    bestIf:
      "you want the button to feel most tied to printmaking, tattoo culture, and handmade editions.",
    chip: "#F5ECCE",
  },
  {
    id: "D2",
    name: "MAGAZINE HYPE",
    blurb:
      "Crimson pill CTA overlaid on a massive 16-point gold starburst drop-shadowed in ink. Tilted VOL.01 tag top-right, LIMITED! banner bottom-left, blue PRE-ORDER chip top-left, 100/100 callout bottom-right — all rotated, stacked. Chaotic cover-spread energy.",
    bestIf: "you want maximum homepage energy and a CTA that behaves like a feature graphic.",
    chip: "#d7322e",
  },
  {
    id: "D3",
    name: "CATALOG TAB",
    blurb:
      "Index-tab row — INDEX · SECT. 01 folded tab on top, crimson N°1 circle badge corner, left product-code column (TD-01 / /100), ORDER FORM · ROW 01 eyebrow, grid-dot progress row, ▸ pointer bottom-right, PAGE 01 footer note. Editorial, structured.",
    bestIf: "you want a more mature and controlled CTA that still feels fully on-brand.",
    chip: "#FFFAED",
  },
  {
    id: "D4",
    name: "LUCKY CHARM",
    blurb:
      "Round medallion on a gold chain-loop. Milled ink-tick rim, crimson inner coin face with ★ LUCKY ★ / COLLECT YOURS / N°01 / 100 stacked in cream Anton. ✦ sparkle accents orbiting outside the coin. Capsule-toy charm silhouette.",
    bestIf: "you want the CTA to feel memorable, weird, and collectible.",
    chip: "#F7C234",
  },
];

export default function LabCtaPage() {
  const [rayVariant, setRayVariant] = useState<RayVariant>("R1");
  const [ctaVariant, setCtaVariant] = useState<CtaVariant>("D1");

  const activeRay = RAYS.find((r) => r.id === rayVariant)!;
  const activeCta = DIRECTIONS.find((c) => c.id === ctaVariant)!;

  const rays =
    rayVariant === "R1" ? (
      <RaysKanji />
    ) : rayVariant === "R2" ? (
      <RaysDotGradient />
    ) : rayVariant === "R3" ? (
      <RaysOrbit />
    ) : (
      <RaysSeigaiha />
    );

  const onBuyRay = () => console.log(`buy clicked [ray ${rayVariant}]`);
  const onBuyCta = () => console.log(`buy clicked [cta ${ctaVariant}]`);

  return (
    <main style={{ background: "#0a0a0a", color: "#f0ebdc", minHeight: "100vh" }}>
      <header
        className="sticky top-0 z-40 w-full"
        style={{ background: "#0a0a0a", borderBottom: "1px solid rgba(240,235,220,0.18)" }}
      >
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-3 sm:px-10">
          <Link
            href="/lab"
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.3em",
              fontWeight: 800,
              color: "#F7C234",
              textDecoration: "none",
              padding: "4px 10px",
              border: "1px solid #F7C234",
            }}
          >
            ← /lab
          </Link>
          <span
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.28em",
              fontWeight: 800,
              color: "rgba(240,235,220,0.65)",
            }}
          >
            LAB / CTA · 4 rays + 4 directions
          </span>
        </div>
      </header>

      {/* SECTION A — RAYS */}
      <section
        className="mx-auto max-w-5xl px-6 py-10 sm:px-10 sm:py-14"
        style={{ borderBottom: "1px dashed rgba(240,235,220,0.25)" }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.4em",
            fontWeight: 800,
            color: "rgba(240,235,220,0.6)",
            marginBottom: 10,
          }}
        >
          SECTION A / 4 RAY ALTERNATIVES
        </div>

        <div
          className="mb-6 flex flex-wrap gap-2"
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.22em",
            fontWeight: 800,
          }}
        >
          {RAYS.map((v) => {
            const on = v.id === rayVariant;
            return (
              <button
                key={v.id}
                onClick={() => setRayVariant(v.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 12px",
                  background: on ? "#F7C234" : "transparent",
                  color: on ? "#1a1a1a" : "rgba(240,235,220,0.75)",
                  border: `1px solid ${on ? "#F7C234" : "rgba(240,235,220,0.3)"}`,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: "inherit",
                  letterSpacing: "inherit",
                  fontWeight: "inherit",
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    background: v.chip,
                    border: `1px solid ${on ? "#1a1a1a" : "rgba(240,235,220,0.3)"}`,
                  }}
                />
                {v.id} · {v.name}
              </button>
            );
          })}
        </div>

        <p
          style={{
            fontFamily: "var(--font-display), serif",
            fontSize: 15.5,
            lineHeight: 1.58,
            color: "rgba(240,235,220,0.88)",
            maxWidth: 720,
          }}
        >
          <strong style={{ color: "#F7C234" }}>
            {activeRay.id} · {activeRay.name}
          </strong>{" "}
          — {activeRay.blurb}
        </p>

        <div
          className="mt-10"
          style={{
            background: "#ECE4D0",
            border: "1px solid rgba(240,235,220,0.2)",
            padding: "100px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <HandsShell
            onBuy={onBuyRay}
            leftHand={<Dagger />}
            rightHand={<Dagger flip />}
            bubble="HERE!"
            accent={GOLD}
            rays={rays}
          />
        </div>
      </section>

      {/* SECTION B — CTA DIRECTIONS */}
      <section className="mx-auto max-w-5xl px-6 py-10 sm:px-10 sm:py-14">
        <div
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.4em",
            fontWeight: 800,
            color: "rgba(240,235,220,0.6)",
            marginBottom: 10,
          }}
        >
          SECTION B / 4 CTA DIRECTIONS
        </div>

        <div
          className="mb-6 flex flex-wrap gap-2"
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.22em",
            fontWeight: 800,
          }}
        >
          {DIRECTIONS.map((v) => {
            const on = v.id === ctaVariant;
            return (
              <button
                key={v.id}
                onClick={() => setCtaVariant(v.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 12px",
                  background: on ? "#F7C234" : "transparent",
                  color: on ? "#1a1a1a" : "rgba(240,235,220,0.75)",
                  border: `1px solid ${on ? "#F7C234" : "rgba(240,235,220,0.3)"}`,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: "inherit",
                  letterSpacing: "inherit",
                  fontWeight: "inherit",
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    background: v.chip,
                    border: `1px solid ${on ? "#1a1a1a" : "rgba(240,235,220,0.3)"}`,
                  }}
                />
                {v.id} · {v.name}
              </button>
            );
          })}
        </div>

        <p
          style={{
            fontFamily: "var(--font-display), serif",
            fontSize: 15.5,
            lineHeight: 1.58,
            color: "rgba(240,235,220,0.88)",
            maxWidth: 720,
          }}
        >
          <strong style={{ color: "#F7C234" }}>
            {activeCta.id} · {activeCta.name}
          </strong>{" "}
          — {activeCta.blurb}
        </p>
        <p
          className="mt-3"
          style={{
            fontFamily: "var(--font-display), serif",
            fontStyle: "italic",
            fontSize: 14,
            color: "rgba(240,235,220,0.6)",
            maxWidth: 720,
          }}
        >
          Best if: &ldquo;{activeCta.bestIf}&rdquo;
        </p>

        <div
          className="mt-10"
          style={{
            background: "#ECE4D0",
            border: "1px solid rgba(240,235,220,0.2)",
            padding: "100px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {ctaVariant === "D1" && <CtaFlashStamp onBuy={onBuyCta} />}
          {ctaVariant === "D2" && <CtaMagazineHype onBuy={onBuyCta} />}
          {ctaVariant === "D3" && <CtaCatalogTab onBuy={onBuyCta} />}
          {ctaVariant === "D4" && <CtaLuckyCharm onBuy={onBuyCta} />}
        </div>

        <p
          className="mt-8 text-center"
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.3em",
            fontWeight: 800,
            color: "rgba(240,235,220,0.45)",
          }}
        >
          ↑ click &amp; hold — check console
        </p>
      </section>
    </main>
  );
}
