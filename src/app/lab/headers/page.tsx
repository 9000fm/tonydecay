"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useRef, useState } from "react";
import { CheckoutProvider } from "@/hooks/useCheckout";
import { PLACEHOLDER_PRINTS } from "@/lib/constants";

const STAR_POINTS =
  "50,0 57,14 70,4 68,20 86,16 78,32 96,38 80,48 96,62 76,64 84,82 64,76 66,96 50,84 34,96 36,76 16,82 24,64 4,62 20,48 4,38 22,32 14,16 32,20 30,4 43,14";

/* ============== Top nav — back to /lab + title ============== */

function LabSubHeader({ title }: { title: string }) {
  return (
    <header
      className="sticky top-0 z-40 w-full"
      style={{
        background: "#0a0a0a",
        borderBottom: "1px solid rgba(240,235,220,0.18)",
      }}
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
          {title}
        </span>
      </div>
    </header>
  );
}

function SectionLabel({ tag, name, desc }: { tag: string; name: string; desc: string }) {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-14 pb-6 sm:px-10">
      <div
        style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 12,
          letterSpacing: "0.32em",
          fontWeight: 800,
          color: "rgba(240,235,220,0.55)",
          marginBottom: 10,
        }}
      >
        {tag} &nbsp;·&nbsp; {name}
      </div>
      <p
        style={{
          fontFamily: "var(--font-display), serif",
          fontSize: 16,
          lineHeight: 1.55,
          color: "rgba(240,235,220,0.82)",
          maxWidth: 820,
        }}
      >
        {desc}
      </p>
    </div>
  );
}

/* ============== H1 — scroll model prototype (interactive) ==============
   A mini phone-frame that scrolls internally. Marquee shows at top. Once the
   user scrolls past threshold, marquee disappears and a compact sticky bar
   (burger · mini TONY DECAY · BUY) replaces it. Scroll back to top → marquee
   returns. */

function H1ScrollPrototype() {
  const [scrollY, setScrollY] = useState(0);
  const frameRef = useRef<HTMLDivElement>(null);
  const THRESHOLD = 120;
  const pastThreshold = scrollY > THRESHOLD;

  return (
    <section>
      <SectionLabel
        tag="H1"
        name="SCROLL MODEL — MARQUEE ↔ COMPACT HEADER"
        desc="Interactive prototype. Scroll inside the phone frame. Top: pink marquee. Scroll a couple of units down → marquee slides up + a compact sticky bar takes over with burger / mini TONY DECAY / BUY. Scroll back to very top → marquee returns, compact hides."
      />
      <div className="mx-auto max-w-6xl px-6 pb-10 sm:px-10">
        <div
          ref={frameRef}
          onScroll={(e) => setScrollY(e.currentTarget.scrollTop)}
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 380,
            height: 680,
            margin: "0 auto",
            background: "#ECE4D0",
            border: "3px solid #1a1a1a",
            borderRadius: 14,
            overflowY: "auto",
            boxShadow: "8px 8px 0 rgba(26,26,26,0.4)",
          }}
        >
          {/* Pink marquee — shows when at top */}
          <div
            style={{
              position: "sticky",
              top: 0,
              zIndex: 10,
              height: 32,
              background: "#F2A2BC",
              borderBottom: "3px solid #1a1a1a",
              overflow: "hidden",
              transform: pastThreshold ? "translateY(-100%)" : "translateY(0)",
              transition: "transform 350ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            <div
              className="flex h-full shrink-0 items-center whitespace-nowrap"
              style={{ animation: "marquee-scroll 20s linear infinite" }}
            >
              {Array.from({ length: 8 }).flatMap((_, i) => [
                <span
                  key={`ws-${i}`}
                  className="shrink-0 px-3"
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: 10,
                    letterSpacing: "0.28em",
                    fontWeight: 800,
                    color: "#1a1a1a",
                  }}
                >
                  WORLDWIDE SHIPPING
                </span>,
                <span key={`st-${i}`} className="shrink-0 px-3">
                  ★
                </span>,
                <span
                  key={`lm-${i}`}
                  className="shrink-0 px-3"
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: 10,
                    letterSpacing: "0.28em",
                    fontWeight: 800,
                    color: "#1a1a1a",
                  }}
                >
                  LIMITED 100
                </span>,
                <span key={`st2-${i}`} className="shrink-0 px-3">
                  ★
                </span>,
              ])}
            </div>
          </div>

          {/* Compact header — replaces marquee past threshold */}
          <div
            style={{
              position: "sticky",
              top: 0,
              zIndex: 9,
              marginTop: pastThreshold ? -32 : -32,
              height: 54,
              background: "#ECE4D0",
              borderBottom: "2px solid #1a1a1a",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 14px",
              opacity: pastThreshold ? 1 : 0,
              transform: pastThreshold ? "translateY(0)" : "translateY(-100%)",
              transition: "opacity 350ms ease, transform 350ms cubic-bezier(0.22, 1, 0.36, 1)",
              pointerEvents: pastThreshold ? "auto" : "none",
            }}
          >
            {/* burger */}
            <span
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 11,
                letterSpacing: "0.3em",
                fontWeight: 800,
                color: "#1a1a1a",
              }}
            >
              ≡ MENU
            </span>
            {/* mini title */}
            <span
              style={{
                fontFamily: "var(--font-tattoo), sans-serif",
                fontSize: 22,
                color: "#1a1a1a",
                letterSpacing: "0.02em",
                lineHeight: 1,
              }}
            >
              TONY <span style={{ color: "#d7322e", fontSize: 14 }}>の</span>{" "}
              <span style={{ color: "#d7322e" }}>DECAY</span>
            </span>
            {/* BUY */}
            <button
              style={{
                padding: "6px 14px",
                background: "#F7C234",
                border: "2px solid #1a1a1a",
                fontFamily: "var(--font-tattoo), sans-serif",
                fontSize: 15,
                letterSpacing: "0.02em",
                color: "#1a1a1a",
                boxShadow: "2px 2px 0 #d7322e",
                cursor: "pointer",
                lineHeight: 1,
              }}
            >
              BUY
            </button>
          </div>

          {/* Masthead (scrolls with page) */}
          <div style={{ padding: "20px 18px 12px" }}>
            <div
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 9,
                letterSpacing: "0.3em",
                fontWeight: 800,
                color: "#d7322e",
                marginBottom: 4,
              }}
            >
              VOL.01 · JUNE 2026 · $300
            </div>
            <h1
              style={{
                fontFamily: "var(--font-tattoo), sans-serif",
                fontSize: 46,
                lineHeight: 0.88,
                letterSpacing: "0.01em",
                color: "#1a1a1a",
              }}
            >
              TONY <span style={{ color: "#d7322e", fontSize: 20 }}>の</span>{" "}
              <span style={{ color: "#d7322e" }}>DECAY</span>
            </h1>
            <p
              style={{
                fontFamily: "var(--font-display), serif",
                fontStyle: "italic",
                fontSize: 12,
                color: "rgba(26,26,26,0.65)",
                marginTop: 6,
              }}
            >
              - 15 prints, 100 collector sets, hand-numbered on cream paper.
            </p>
          </div>

          {/* Fake gallery cards */}
          <div
            style={{
              padding: "12px 18px 40px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 10,
            }}
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
              const print = PLACEHOLDER_PRINTS[i % PLACEHOLDER_PRINTS.length];
              return (
                <div
                  key={i}
                  style={{
                    position: "relative",
                    aspectRatio: "3 / 4",
                    background: "#fffef8",
                    border: "2px solid #1a1a1a",
                    boxShadow: "2px 2px 0 #1a1a1a",
                  }}
                >
                  <Image
                    src={print.src}
                    alt={print.alt}
                    fill
                    sizes="100px"
                    className="object-cover"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div
          className="mx-auto mt-5 max-w-md text-center"
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.28em",
            fontWeight: 800,
            color: "rgba(240,235,220,0.55)",
          }}
        >
          scrollY: {Math.round(scrollY)}px · threshold: {THRESHOLD}px ·{" "}
          {pastThreshold ? "COMPACT HEADER" : "MARQUEE"}
        </div>
      </div>
    </section>
  );
}

/* ============== H2 — starburst combos (6 variants) ============== */

function StarV1({ size = 160 }: { size?: number }) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg
      viewBox="0 20 100 100"
      width={size}
      height={size}
      style={{ transform: "rotate(10deg)", filter: "drop-shadow(3px 3px 0 #1a1a1a)" }}
    >
      <polygon
        points={STAR_POINTS}
        fill="#F7C234"
        stroke="#1a1a1a"
        strokeWidth={2.25}
        strokeLinejoin="round"
      />
      <text
        x="50"
        y="36"
        textAnchor="middle"
        fontFamily="var(--font-jp), var(--font-tattoo), sans-serif"
        fontWeight={900}
        fontSize="22"
        fill="#1a1a1a"
      >
        予約
      </text>
      <text
        x="50"
        y="56"
        textAnchor="middle"
        fontFamily="var(--font-tattoo), sans-serif"
        fontWeight={700}
        fontSize="15"
        letterSpacing="0.03em"
        fill="#d7322e"
        stroke="#ECE4D0"
        strokeWidth="0.6"
        paintOrder="stroke"
      >
        ORDER NOW
      </text>
      <text
        x="50"
        y="76"
        textAnchor="middle"
        fontFamily="var(--font-mono), monospace"
        fontWeight={800}
        fontSize="10"
        letterSpacing="0.16em"
        fill="#1a1a1a"
      >
        VOL.01
      </text>
      <title>V1 · current (yellow / 予約 / ORDER NOW / VOL.01) — {uid}</title>
    </svg>
  );
}

function StarV2NewYellow({ size = 160 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      style={{ transform: "rotate(-8deg)", filter: "drop-shadow(3px 3px 0 #1a1a1a)" }}
    >
      <polygon
        points={STAR_POINTS}
        fill="#F7C234"
        stroke="#1a1a1a"
        strokeWidth={2.25}
        strokeLinejoin="round"
      />
      <text
        x="50"
        y="46"
        textAnchor="middle"
        fontFamily="var(--font-jp), var(--font-tattoo), sans-serif"
        fontWeight={900}
        fontSize="30"
        fill="#1a1a1a"
      >
        新作
      </text>
      <text
        x="50"
        y="68"
        textAnchor="middle"
        fontFamily="var(--font-tattoo), sans-serif"
        fontWeight={700}
        fontSize="18"
        letterSpacing="0.04em"
        fill="#d7322e"
        stroke="#ECE4D0"
        strokeWidth="0.5"
        paintOrder="stroke"
      >
        NEW
      </text>
    </svg>
  );
}

function StarV3Crimson({ size = 160 }: { size?: number }) {
  return (
    <svg
      viewBox="0 20 100 100"
      width={size}
      height={size}
      style={{ transform: "rotate(12deg)", filter: "drop-shadow(3px 3px 0 #1a1a1a)" }}
    >
      <polygon
        points={STAR_POINTS}
        fill="#d7322e"
        stroke="#1a1a1a"
        strokeWidth={2.25}
        strokeLinejoin="round"
      />
      <text
        x="50"
        y="40"
        textAnchor="middle"
        fontFamily="var(--font-jp), var(--font-tattoo), sans-serif"
        fontWeight={900}
        fontSize="22"
        fill="#F7C234"
      >
        予約
      </text>
      <text
        x="50"
        y="60"
        textAnchor="middle"
        fontFamily="var(--font-tattoo), sans-serif"
        fontWeight={700}
        fontSize="15"
        letterSpacing="0.03em"
        fill="#ECE4D0"
      >
        ORDER NOW
      </text>
      <text
        x="50"
        y="78"
        textAnchor="middle"
        fontFamily="var(--font-mono), monospace"
        fontWeight={800}
        fontSize="10"
        letterSpacing="0.16em"
        fill="#F7C234"
      >
        VOL.01
      </text>
    </svg>
  );
}

/* V4 · COIN — proper coin stamp with beveled rim, milled edge (tick marks),
   arc text top + bottom, and a big TD monogram center. No ORDER NOW text. */
function StarV4Circle({ size = 160 }: { size?: number }) {
  const uid = useId().replace(/:/g, "");
  const arcTopId = `coin-arc-top-${uid}`;
  const arcBotId = `coin-arc-bot-${uid}`;
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      style={{ transform: "rotate(-3deg)", filter: "drop-shadow(3px 3px 0 #1a1a1a)" }}
    >
      <defs>
        {/* Top arc — text reads left→right along upper inner rim */}
        <path id={arcTopId} d="M 20,50 A 30,30 0 0,1 80,50" fill="none" />
        {/* Bottom arc — flipped so text reads left→right along lower inner rim */}
        <path id={arcBotId} d="M 22,55 A 28,28 0 0,0 78,55" fill="none" />
        <radialGradient id={`coin-shade-${uid}`} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFE066" />
          <stop offset="55%" stopColor="#F7C234" />
          <stop offset="100%" stopColor="#C98F1A" />
        </radialGradient>
      </defs>

      {/* Outer thick rim */}
      <circle cx="50" cy="50" r="46" fill="#1a1a1a" />
      {/* Coin body with radial shade for metal feel */}
      <circle
        cx="50"
        cy="50"
        r="43"
        fill={`url(#coin-shade-${uid})`}
        stroke="#1a1a1a"
        strokeWidth={1}
      />

      {/* Milled edge — 36 tick marks around the rim */}
      <g stroke="#1a1a1a" strokeWidth={0.8}>
        {Array.from({ length: 36 }).map((_, i) => {
          const angle = (i * 360) / 36;
          const rad = (angle * Math.PI) / 180;
          const x1 = 50 + Math.cos(rad) * 43;
          const y1 = 50 + Math.sin(rad) * 43;
          const x2 = 50 + Math.cos(rad) * 46;
          const y2 = 50 + Math.sin(rad) * 46;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
      </g>

      {/* Inner dashed raised ring (beveled edge) */}
      <circle
        cx="50"
        cy="50"
        r="35"
        fill="none"
        stroke="#1a1a1a"
        strokeWidth={0.8}
        strokeDasharray="1.5 1.5"
        opacity={0.6}
      />

      {/* Arc text — TOP */}
      <text
        fontFamily="var(--font-mono), monospace"
        fontSize="6.5"
        fontWeight={800}
        letterSpacing="0.32em"
        fill="#1a1a1a"
      >
        <textPath href={`#${arcTopId}`} startOffset="50%" textAnchor="middle">
          LIMITED EDITION
        </textPath>
      </text>

      {/* Center monogram — big TD */}
      <text
        x="50"
        y="59"
        textAnchor="middle"
        fontFamily="var(--font-tattoo), sans-serif"
        fontWeight={700}
        fontSize="34"
        fill="#1a1a1a"
        letterSpacing="0.02em"
        style={{ filter: "drop-shadow(1px 1px 0 rgba(26,26,26,0.3))" }}
      >
        TD
      </text>

      {/* Arc text — BOTTOM */}
      <text
        fontFamily="var(--font-mono), monospace"
        fontSize="5.5"
        fontWeight={800}
        letterSpacing="0.32em"
        fill="#1a1a1a"
      >
        <textPath href={`#${arcBotId}`} startOffset="50%" textAnchor="middle">
          VOL.01 · 2026 · 100 SETS
        </textPath>
      </text>
    </svg>
  );
}

function StarV5Ticket({ size = 160 }: { size?: number }) {
  return (
    <div
      style={{
        position: "relative",
        width: size * 1.2,
        height: size * 0.9,
        transform: "rotate(-6deg)",
        filter: "drop-shadow(3px 3px 0 #1a1a1a)",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#F7C234",
          border: "3px solid #1a1a1a",
          clipPath:
            "polygon(0% 20%, 6% 15%, 0% 10%, 0% 0%, 100% 0%, 100% 10%, 94% 15%, 100% 20%, 100% 80%, 94% 85%, 100% 90%, 100% 100%, 0% 100%, 0% 90%, 6% 85%, 0% 80%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "12px 24px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-jp), var(--font-tattoo), sans-serif",
            fontSize: 24,
            fontWeight: 900,
            color: "#1a1a1a",
          }}
        >
          予約
        </span>
        <span
          style={{
            fontFamily: "var(--font-tattoo), sans-serif",
            fontSize: 22,
            letterSpacing: "0.04em",
            color: "#d7322e",
            lineHeight: 0.95,
          }}
        >
          ORDER NOW
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 9,
            letterSpacing: "0.26em",
            fontWeight: 800,
            color: "#1a1a1a",
            marginTop: 2,
          }}
        >
          VOL.01
        </span>
      </div>
    </div>
  );
}

function StarV6Minimal({ size = 160 }: { size?: number }) {
  return (
    <svg
      viewBox="0 20 100 100"
      width={size}
      height={size}
      style={{ transform: "rotate(6deg)", filter: "drop-shadow(3px 3px 0 #1a1a1a)" }}
    >
      <polygon
        points={STAR_POINTS}
        fill="#F7C234"
        stroke="#1a1a1a"
        strokeWidth={2.25}
        strokeLinejoin="round"
      />
      <text
        x="50"
        y="52"
        textAnchor="middle"
        fontFamily="var(--font-tattoo), sans-serif"
        fontWeight={700}
        fontSize="16"
        letterSpacing="0.04em"
        fill="#d7322e"
        stroke="#ECE4D0"
        strokeWidth="0.6"
        paintOrder="stroke"
      >
        ORDER NOW
      </text>
      <text
        x="50"
        y="70"
        textAnchor="middle"
        fontFamily="var(--font-mono), monospace"
        fontWeight={800}
        fontSize="10"
        letterSpacing="0.22em"
        fill="#1a1a1a"
      >
        VOL.01
      </text>
    </svg>
  );
}

function VariantTile({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#ECE4D0",
        border: "2px solid rgba(26,26,26,0.4)",
        padding: 24,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
      }}
    >
      <div
        style={{ minHeight: 180, display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        {children}
      </div>
      <span
        style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 10,
          letterSpacing: "0.3em",
          fontWeight: 800,
          color: "rgba(26,26,26,0.7)",
        }}
      >
        {name}
      </span>
    </div>
  );
}

function H2StarburstCombos() {
  return (
    <section>
      <SectionLabel
        tag="H2"
        name="STARBURST COMBOS"
        desc="Six starburst treatments for the ORDER NOW stamp. V1 is the current live version (yellow / 予約 / ORDER NOW / VOL.01 with cropped-top popup). Others explore different shapes, colors, content weight."
      />
      <div
        className="mx-auto max-w-6xl px-6 pb-10 sm:px-10"
        style={{
          display: "grid",
          gap: 20,
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        }}
      >
        <VariantTile name="V1 · CURRENT (CROPPED)">
          <StarV1 />
        </VariantTile>
        <VariantTile name="V2 · NEW! YELLOW (REF #83)">
          <StarV2NewYellow />
        </VariantTile>
        <VariantTile name="V3 · CRIMSON INVERSION">
          <StarV3Crimson />
        </VariantTile>
        <VariantTile name="V4 · COIN (TD MONOGRAM)">
          <StarV4Circle />
        </VariantTile>
        <VariantTile name="V5 · TICKET STUB">
          <StarV5Ticket />
        </VariantTile>
        <VariantTile name="V6 · MINIMAL">
          <StarV6Minimal />
        </VariantTile>
      </div>
    </section>
  );
}

/* ============== H3 — BUY CTA combos (6 variants) ============== */

function BuyV1Block({ label = "BUY" }: { label?: string }) {
  return (
    <button
      style={{
        padding: "14px 28px",
        background: "#F7C234",
        border: "3px solid #1a1a1a",
        fontFamily: "var(--font-tattoo), sans-serif",
        fontSize: 28,
        letterSpacing: "0.02em",
        color: "#1a1a1a",
        boxShadow: "5px 5px 0 #d7322e, 5px 5px 0 2px #1a1a1a",
        cursor: "pointer",
        lineHeight: 1,
      }}
    >
      {label}
    </button>
  );
}

function BuyV2Pill({ label = "BUY →" }: { label?: string }) {
  return (
    <button
      style={{
        padding: "14px 30px",
        background: "#d7322e",
        border: "2px solid #1a1a1a",
        fontFamily: "var(--font-mono), monospace",
        fontSize: 14,
        letterSpacing: "0.2em",
        fontWeight: 800,
        color: "#ECE4D0",
        borderRadius: 999,
        boxShadow: "3px 3px 0 #1a1a1a",
        cursor: "pointer",
        lineHeight: 1,
      }}
    >
      {label}
    </button>
  );
}

function BuyV3Stamp({ label = "BUY" }: { label?: string }) {
  return (
    <div
      style={{
        position: "relative",
        transform: "rotate(-6deg)",
        filter: "drop-shadow(3px 3px 0 #1a1a1a)",
      }}
    >
      <svg width="140" height="140" viewBox="0 0 100 100">
        <polygon
          points={STAR_POINTS}
          fill="#F7C234"
          stroke="#1a1a1a"
          strokeWidth={2.25}
          strokeLinejoin="round"
        />
        <text
          x="50"
          y="58"
          textAnchor="middle"
          fontFamily="var(--font-tattoo), sans-serif"
          fontWeight={700}
          fontSize="26"
          letterSpacing="0.04em"
          fill="#d7322e"
          stroke="#ECE4D0"
          strokeWidth="0.6"
          paintOrder="stroke"
        >
          {label}
        </text>
      </svg>
    </div>
  );
}

function BuyV4Pixel({ label = "BUY" }: { label?: string }) {
  return (
    <button
      style={{
        padding: "14px 26px",
        background: "#1a1a1a",
        border: "3px solid #1a1a1a",
        fontFamily: "var(--font-mono), monospace",
        fontSize: 15,
        letterSpacing: "0.3em",
        fontWeight: 800,
        color: "#F7C234",
        boxShadow: "4px 4px 0 #d7322e, 4px 4px 0 2px #1a1a1a",
        cursor: "pointer",
        lineHeight: 1,
      }}
    >
      ▸ {label}
    </button>
  );
}

function BuyV5Taped({ label = "BUY" }: { label?: string }) {
  return (
    <div
      style={{
        position: "relative",
        background: "#fffef8",
        padding: "12px 24px",
        border: "1px solid rgba(26,26,26,0.3)",
        boxShadow: "3px 4px 10px rgba(26,26,26,0.3)",
        transform: "rotate(-2deg)",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -7,
          left: "50%",
          transform: "translateX(-50%) rotate(-4deg)",
          width: 46,
          height: 12,
          background: "rgba(247,194,52,0.6)",
          border: "1px solid rgba(26,26,26,0.28)",
        }}
      />
      <span
        style={{
          fontFamily: "var(--font-tattoo), sans-serif",
          fontSize: 32,
          letterSpacing: "0.03em",
          color: "#1a1a1a",
          lineHeight: 1,
        }}
      >
        {label}
      </span>
    </div>
  );
}

function BuyV6OrderNow() {
  return <BuyV1Block label="ORDER NOW" />;
}

function H3BuyCombos() {
  return (
    <section>
      <SectionLabel
        tag="H3"
        name="BUY CTA COMBOS"
        desc="Six treatments for the right-side CTA that pairs with the burger on the left. BUY vs ORDER NOW wording × block / pill / stamp / pixel / taped / block-order. Pick a winner to wire into the new header."
      />
      <div
        className="mx-auto max-w-6xl px-6 pb-10 sm:px-10"
        style={{
          display: "grid",
          gap: 20,
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        }}
      >
        <VariantTile name="V1 · YELLOW BLOCK 'BUY'">
          <BuyV1Block />
        </VariantTile>
        <VariantTile name="V2 · CRIMSON PILL">
          <BuyV2Pill />
        </VariantTile>
        <VariantTile name="V3 · STAMP STAR">
          <BuyV3Stamp />
        </VariantTile>
        <VariantTile name="V4 · PIXEL ARCADE">
          <BuyV4Pixel />
        </VariantTile>
        <VariantTile name="V5 · TAPED CARD">
          <BuyV5Taped />
        </VariantTile>
        <VariantTile name="V6 · BLOCK 'ORDER NOW'">
          <BuyV6OrderNow />
        </VariantTile>
      </div>
    </section>
  );
}

/* ============== H4 — burger combos (5 variants) ============== */

function BurgerV1Icon() {
  return (
    <button
      aria-label="Menu"
      style={{
        width: 48,
        height: 48,
        background: "transparent",
        border: "2px solid #1a1a1a",
        borderRadius: 4,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
        padding: 10,
      }}
    >
      <span style={{ width: "100%", height: 2, background: "#1a1a1a" }} />
      <span style={{ width: "100%", height: 2, background: "#1a1a1a" }} />
      <span style={{ width: "100%", height: 2, background: "#1a1a1a" }} />
    </button>
  );
}

function BurgerV2MenuText() {
  return (
    <button
      style={{
        padding: "12px 18px",
        background: "transparent",
        border: "2px solid #1a1a1a",
        fontFamily: "var(--font-mono), monospace",
        fontSize: 12,
        letterSpacing: "0.3em",
        fontWeight: 800,
        color: "#1a1a1a",
        cursor: "pointer",
        lineHeight: 1,
      }}
    >
      MENU
    </button>
  );
}

function BurgerV3Unicode() {
  return (
    <button
      style={{
        width: 52,
        height: 48,
        background: "transparent",
        border: "none",
        fontFamily: "var(--font-tattoo), sans-serif",
        fontSize: 32,
        color: "#1a1a1a",
        cursor: "pointer",
        lineHeight: 1,
      }}
    >
      ≡
    </button>
  );
}

function BurgerV4NumberedStamp() {
  return (
    <button
      style={{
        padding: "10px 14px",
        background: "#d7322e",
        border: "2px solid #1a1a1a",
        fontFamily: "var(--font-tattoo), sans-serif",
        fontSize: 18,
        letterSpacing: "0.02em",
        color: "#ECE4D0",
        boxShadow: "3px 3px 0 #1a1a1a",
        cursor: "pointer",
        lineHeight: 1,
      }}
    >
      ≡ MENU
    </button>
  );
}

function BurgerV5Taped() {
  return (
    <div
      style={{
        position: "relative",
        background: "#fffef8",
        padding: "10px 16px",
        border: "1px solid rgba(26,26,26,0.3)",
        boxShadow: "3px 4px 8px rgba(26,26,26,0.25)",
        transform: "rotate(1deg)",
        cursor: "pointer",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -6,
          left: "50%",
          transform: "translateX(-50%) rotate(-3deg)",
          width: 34,
          height: 10,
          background: "rgba(60,181,181,0.55)",
          border: "1px solid rgba(26,26,26,0.28)",
        }}
      />
      <span
        style={{
          fontFamily: "var(--font-display), serif",
          fontStyle: "italic",
          fontSize: 16,
          color: "#1a1a1a",
        }}
      >
        ≡ menu
      </span>
    </div>
  );
}

function H4BurgerCombos() {
  return (
    <section>
      <SectionLabel
        tag="H4"
        name="BURGER COMBOS"
        desc="Five burger/MENU treatments for the left-hand slot. Classic icon / mono text / unicode / stamped pill / taped card. Pair winner with the BUY CTA winner from H3."
      />
      <div
        className="mx-auto max-w-6xl px-6 pb-16 sm:px-10"
        style={{
          display: "grid",
          gap: 20,
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        }}
      >
        <VariantTile name="V1 · THREE-LINE ICON">
          <BurgerV1Icon />
        </VariantTile>
        <VariantTile name="V2 · 'MENU' MONO">
          <BurgerV2MenuText />
        </VariantTile>
        <VariantTile name="V3 · ≡ UNICODE">
          <BurgerV3Unicode />
        </VariantTile>
        <VariantTile name="V4 · STAMPED PILL">
          <BurgerV4NumberedStamp />
        </VariantTile>
        <VariantTile name="V5 · TAPED CARD">
          <BurgerV5Taped />
        </VariantTile>
      </div>
    </section>
  );
}

/* ============== H5 — TOP STAMP ALTS ==============
   Replacement options for the top-right corner stamp on the featured
   print (currently FeaturedStickerNew, a 28-point starburst with 新作!).
   The bottom-left 100-SETS sticker is also a starburst, so the cover has
   two stars stacked on it. These are 4 non-star alternatives. */

type StampVariant = "S1" | "S2" | "S3" | "S4";

const STAMP_VARIANTS: { id: StampVariant; name: string; blurb: string }[] = [
  {
    id: "S1",
    name: "RIBBON FLAG",
    blurb:
      "2-tail diagonal banner / pennant. Crimson body, ink stroke, drop-shadow. Reads as a magazine cover-flag — sits clean next to a starburst without competing.",
  },
  {
    id: "S2",
    name: "ROUND POSTAGE",
    blurb:
      "Circle with milled-tick rim (16 ticks) and a thin inner double-rule. Suggests a stamped-and-numbered postal mark — fits the editorial / collector vocab.",
  },
  {
    id: "S3",
    name: "MANGA BUBBLE",
    blurb:
      "Jagged-edge speech bubble (10 spike points). Pure manga callout. Ties to Tony's Sugimori-Pokémon DNA, contrasts with a plain starburst on the bottom.",
  },
  {
    id: "S4",
    name: "WASHI TAPE",
    blurb:
      "Angled paper-tape strip with torn semicircular edges. Handwritten Anton callout. Makes the cover feel scrapbooked — tape grammar already approved (V02).",
  },
];

function StampRibbonFlag({ text }: { text: string }) {
  return (
    <svg
      viewBox="0 0 200 110"
      width="180"
      height="99"
      aria-hidden
      style={{
        transform: "rotate(8deg)",
        filter: "drop-shadow(4px 4px 0 #1a1a1a)",
      }}
    >
      {/* Pennant: rect body + V-tail on right */}
      <path
        d="M4 14 L160 14 L196 55 L160 96 L4 96 Z"
        fill="#d7322e"
        stroke="#1a1a1a"
        strokeWidth="3"
        strokeLinejoin="miter"
      />
      {/* Inner cream rule */}
      <path
        d="M12 22 L154 22 L184 55 L154 88 L12 88 Z"
        fill="none"
        stroke="#F5ECCE"
        strokeWidth="1.5"
        strokeDasharray="2 3"
      />
      <text
        x="86"
        y="63"
        textAnchor="middle"
        fontFamily="var(--font-tattoo), sans-serif"
        fontWeight={900}
        fontSize="34"
        fill="#F5ECCE"
        letterSpacing="0.04em"
      >
        {text}
      </text>
    </svg>
  );
}

function StampRoundPostage({ text }: { text: string }) {
  /* 16 milled ticks around the perimeter. */
  const ticks = Array.from({ length: 16 });
  return (
    <svg
      viewBox="0 0 120 120"
      width="150"
      height="150"
      aria-hidden
      style={{
        transform: "rotate(-12deg)",
        filter: "drop-shadow(4px 4px 0 #1a1a1a)",
      }}
    >
      <circle cx="60" cy="60" r="54" fill="#d7322e" stroke="#1a1a1a" strokeWidth="3" />
      <circle cx="60" cy="60" r="46" fill="none" stroke="#F5ECCE" strokeWidth="1.5" />
      <circle
        cx="60"
        cy="60"
        r="42"
        fill="none"
        stroke="#F5ECCE"
        strokeWidth="0.8"
        strokeDasharray="2 2"
      />
      {ticks.map((_, i) => {
        const a = (i / 16) * Math.PI * 2;
        const x1 = 60 + Math.cos(a) * 50;
        const y1 = 60 + Math.sin(a) * 50;
        const x2 = 60 + Math.cos(a) * 56;
        const y2 = 60 + Math.sin(a) * 56;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#1a1a1a"
            strokeWidth="2"
            strokeLinecap="square"
          />
        );
      })}
      <text
        x="60"
        y="58"
        textAnchor="middle"
        fontFamily="var(--font-tattoo), sans-serif"
        fontWeight={900}
        fontSize="24"
        fill="#F5ECCE"
        letterSpacing="0.04em"
      >
        {text}
      </text>
      <text
        x="60"
        y="78"
        textAnchor="middle"
        fontFamily="var(--font-mono), monospace"
        fontWeight={800}
        fontSize="8"
        fill="#F5ECCE"
        letterSpacing="0.32em"
      >
        VOL · 01
      </text>
    </svg>
  );
}

function StampMangaBubble({ text }: { text: string }) {
  /* 10-spike jagged bubble. */
  return (
    <svg
      viewBox="0 0 140 120"
      width="170"
      height="146"
      aria-hidden
      style={{
        transform: "rotate(10deg)",
        filter: "drop-shadow(4px 4px 0 #1a1a1a)",
      }}
    >
      <polygon
        points="70,2 86,18 104,4 100,26 124,20 112,40 138,46 116,58 132,76 108,72 116,98 92,82 84,108 70,90 56,108 48,82 24,98 32,72 8,76 24,58 2,46 28,40 16,20 40,26 36,4 54,18"
        fill="#d7322e"
        stroke="#1a1a1a"
        strokeWidth="3"
        strokeLinejoin="miter"
      />
      <text
        x="70"
        y="64"
        textAnchor="middle"
        fontFamily="var(--font-tattoo), sans-serif"
        fontWeight={900}
        fontSize="30"
        fill="#F5ECCE"
        letterSpacing="0.02em"
      >
        {text}
      </text>
      <text
        x="70"
        y="80"
        textAnchor="middle"
        fontFamily="var(--font-mono), monospace"
        fontWeight={800}
        fontSize="7"
        fill="#F5ECCE"
        letterSpacing="0.3em"
      >
        VOL · 01
      </text>
    </svg>
  );
}

function StampWashiTape({ text }: { text: string }) {
  return (
    <svg
      viewBox="0 0 220 88"
      width="200"
      height="80"
      aria-hidden
      style={{
        transform: "rotate(-9deg)",
        filter: "drop-shadow(3px 3px 0 #1a1a1a)",
      }}
    >
      {/* Torn-edge tape body — semicircle bites on each end */}
      <path
        d="M2 14
           L2 70
           Q14 64, 6 56
           Q14 48, 6 40
           Q14 34, 6 26
           Q14 20, 2 14
           Z"
        fill="#d7322e"
        opacity="0.04"
      />
      <path
        d="M10 8
           L210 8
           Q218 16, 212 24
           Q220 32, 214 40
           Q220 48, 212 56
           Q218 64, 210 72
           L10 72
           Q4 64, 8 56
           Q2 48, 8 40
           Q2 32, 8 24
           Q2 16, 10 8
           Z"
        fill="#d7322e"
        stroke="#1a1a1a"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Inner cream stripe */}
      <line
        x1="14"
        y1="22"
        x2="206"
        y2="22"
        stroke="#F5ECCE"
        strokeWidth="1"
        strokeDasharray="2 4"
      />
      <line
        x1="14"
        y1="58"
        x2="206"
        y2="58"
        stroke="#F5ECCE"
        strokeWidth="1"
        strokeDasharray="2 4"
      />
      <text
        x="110"
        y="50"
        textAnchor="middle"
        fontFamily="var(--font-tattoo), sans-serif"
        fontWeight={900}
        fontSize="32"
        fill="#F5ECCE"
        letterSpacing="0.05em"
      >
        {text}
      </text>
    </svg>
  );
}

function H5StampAlternatives() {
  const [variant, setVariant] = useState<StampVariant>("S1");
  const [label, setLabel] = useState("NEW!");
  const active = STAMP_VARIANTS.find((v) => v.id === variant)!;

  const stamp =
    variant === "S1" ? (
      <StampRibbonFlag text={label} />
    ) : variant === "S2" ? (
      <StampRoundPostage text={label} />
    ) : variant === "S3" ? (
      <StampMangaBubble text={label} />
    ) : (
      <StampWashiTape text={label} />
    );

  return (
    <section>
      <SectionLabel
        tag="H5"
        name="TOP STAMP — 4 NON-STAR ALTERNATIVES"
        desc="The featured-print top-right corner currently uses FeaturedStickerNew, a starburst with 新作!. The bottom-left 100-SETS sticker is also a starburst, so the cover has two stars on the same plate. These are 4 non-star alternatives — pick one and I'll swap FeaturedStickerNew for it. Try different label copy below."
      />
      <div className="mx-auto max-w-5xl px-6 pb-12 sm:px-10">
        {/* Variant picker */}
        <div
          className="mb-5 flex flex-wrap gap-2"
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.22em",
            fontWeight: 800,
          }}
        >
          {STAMP_VARIANTS.map((v) => {
            const on = v.id === variant;
            return (
              <button
                key={v.id}
                onClick={() => setVariant(v.id)}
                style={{
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
                {v.id} · {v.name}
              </button>
            );
          })}
        </div>

        {/* Label input */}
        <label
          className="mb-6 inline-flex items-center gap-3"
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.28em",
            fontWeight: 800,
            color: "rgba(240,235,220,0.65)",
          }}
        >
          LABEL TEXT:
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value.slice(0, 8))}
            maxLength={8}
            style={{
              padding: "4px 10px",
              background: "rgba(240,235,220,0.08)",
              border: "1px solid rgba(240,235,220,0.3)",
              color: "#f0ebdc",
              fontFamily: "var(--font-mono), monospace",
              fontSize: 12,
              letterSpacing: "0.04em",
              width: 120,
              outline: "none",
            }}
          />
        </label>

        <p
          className="mb-8"
          style={{
            fontFamily: "var(--font-display), serif",
            fontSize: 15.5,
            lineHeight: 1.55,
            color: "rgba(240,235,220,0.85)",
            maxWidth: 720,
          }}
        >
          <strong style={{ color: "#F7C234" }}>
            {active.id} · {active.name}
          </strong>{" "}
          — {active.blurb}
        </p>

        {/* Preview — mocked featured print plate with stamp at top-right */}
        <div
          className="mx-auto"
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 360,
            aspectRatio: "3 / 4",
            background: "#fffef8",
            border: "4px solid #1a1a1a",
            boxShadow: "8px 8px 0 #d7322e, 8px 8px 0 2px #1a1a1a",
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(43,93,174,0.18) 0%, transparent 35%), radial-gradient(circle at 80% 70%, rgba(215,50,46,0.14) 0%, transparent 40%)",
          }}
        >
          {/* Mock print body — abstract gallery placeholder */}
          <div
            className="absolute inset-4"
            style={{
              border: "1px dashed rgba(26,26,26,0.18)",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "flex-start",
              padding: "12px",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 9,
                letterSpacing: "0.3em",
                fontWeight: 800,
                color: "rgba(26,26,26,0.4)",
              }}
            >
              FEATURED PRINT · MOCK
            </span>
          </div>

          {/* The stamp — top-right corner, same anchor as live FeaturedStickerNew */}
          <div className="pointer-events-none absolute" style={{ top: -20, right: -20 }}>
            {stamp}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============== Page ============== */

export default function LabHeadersPage() {
  return (
    <CheckoutProvider>
      <main style={{ background: "#0a0a0a", color: "#f0ebdc", minHeight: "100vh" }}>
        <LabSubHeader title="LAB / HEADERS · scroll model + starburst + BUY + burger + stamp alts" />
        <H1ScrollPrototype />
        <H2StarburstCombos />
        <H3BuyCombos />
        <H4BurgerCombos />
        <H5StampAlternatives />
        <footer
          className="mx-auto max-w-6xl px-6 py-14 sm:px-10"
          style={{ borderTop: "1px dashed rgba(240,235,220,0.3)" }}
        >
          <p
            style={{
              fontFamily: "var(--font-display), serif",
              fontStyle: "italic",
              fontSize: 18,
              color: "rgba(240,235,220,0.75)",
              maxWidth: 620,
            }}
          >
            Pick one per row — H1 scroll model default, H2 starburst, H3 BUY, H4 burger — and I wire
            the combo into the live MagazineCover header.
          </p>
        </footer>
      </main>
    </CheckoutProvider>
  );
}
