"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { PLACEHOLDER_PRINTS } from "@/lib/constants";
import { Product } from "@/components/Product";
import { Hero } from "@/components/Hero";
import { Gallery } from "@/components/Gallery";
import { Package } from "@/components/Package";
import { Certificate } from "@/components/Certificate";
import { MarqueeBar } from "@/components/MarqueeBar";
import { AudioToggle } from "@/components/AudioToggle";
import { CheckoutProvider } from "@/hooks/useCheckout";

const P = PLACEHOLDER_PRINTS;

// Prints 1,2,3 are fixed thumbs. Featured cycles through 4–15 (indexes 3–14).
const FIXED_THUMBS = [P[0], P[1], P[2]];
const FEATURED_POOL = P.slice(3);
const FEATURED_CYCLE_MS = 7000;

const STAR_POINTS =
  "50,0 57,14 70,4 68,20 86,16 78,32 96,38 80,48 96,62 76,64 84,82 64,76 66,96 50,84 34,96 36,76 16,82 24,64 4,62 20,48 4,38 22,32 14,16 32,20 30,4 43,14";

const LAB_NAV: { id: string; label: string }[] = [
  { id: "lab-01", label: "01 · XEROX" },
  { id: "lab-02", label: "02 · TAPED" },
  { id: "lab-03", label: "03 · INK" },
  { id: "lab-04", label: "04 · MARGIN" },
  { id: "lab-05", label: "05 · GALLERY MOBILE" },
  { id: "lab-06", label: "06 · GALLERY DESKTOP" },
  { id: "lab-07", label: "07 · ARCHIVE" },
  { id: "lab-08", label: "08 · MENUS" },
];

function LabNav() {
  return (
    <nav
      className="sticky top-0 z-50 w-full"
      style={{
        background: "#0a0a0a",
        borderBottom: "1px solid rgba(240,235,220,0.18)",
      }}
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-3 gap-y-1.5 px-4 py-2 sm:px-7">
        <span
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.32em",
            fontWeight: 800,
            color: "#F7C234",
          }}
        >
          LAB /
        </span>
        {LAB_NAV.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            title={item.label}
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 10,
              letterSpacing: "0.22em",
              fontWeight: 800,
              color: "rgba(240,235,220,0.65)",
              textDecoration: "none",
              padding: "2px 6px",
              border: "1px solid rgba(240,235,220,0.2)",
              borderRadius: 2,
              transition: "all 150ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#F7C234";
              e.currentTarget.style.borderColor = "#F7C234";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(240,235,220,0.65)";
              e.currentTarget.style.borderColor = "rgba(240,235,220,0.2)";
            }}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

export default function LabPage() {
  return (
    <CheckoutProvider>
      <main style={{ background: "#0a0a0a", color: "#f0ebdc", minHeight: "100vh" }}>
        {/* Global SVG filter defs — used by XEROX wobble borders */}
        <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden>
          <defs>
            <filter id="rough-lite" x="-5%" y="-5%" width="110%" height="110%">
              <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="3" />
              <feDisplacementMap in="SourceGraphic" scale="2" />
            </filter>
            <filter id="rough-heavy" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="2" seed="7" />
              <feDisplacementMap in="SourceGraphic" scale="3.2" />
            </filter>
          </defs>
        </svg>

        <LabHeader />
        <LabNav />
        <div id="lab-01">
          <V01Xerox />
        </div>
        <div id="lab-02">
          <V02Taped />
        </div>
        <div id="lab-03">
          <V03Ink />
        </div>
        <div id="lab-04">
          <V04Margin />
        </div>
        <div id="lab-05">
          <V05GalleryStack />
        </div>
        <div id="lab-06">
          <V06GalleryDesktopArcade />
        </div>
        <div id="lab-07">
          <V07Archive />
        </div>
        <div id="lab-08">
          <V08MenuVariants />
        </div>
        <LabFooter />
      </main>
    </CheckoutProvider>
  );
}

/* ================== HEADER / FOOTER ================== */

function LabHeader() {
  return (
    <header
      className="mx-auto max-w-5xl px-7 py-14 sm:px-10 sm:py-20"
      style={{ borderBottom: "1px dashed rgba(240,235,220,0.3)" }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 11,
          letterSpacing: "0.34em",
          color: "rgba(240,235,220,0.5)",
          fontWeight: 800,
        }}
      >
        TONY DECAY / LAB / SURFACE-TREATMENT EXPERIMENTS
      </div>
      <h1
        className="mt-4"
        style={{
          fontFamily: "var(--font-tattoo), sans-serif",
          fontSize: "clamp(3rem, 10vw, 7rem)",
          color: "#f0ebdc",
          lineHeight: 0.9,
        }}
      >
        FOUR
        <br />
        FLAVORS
      </h1>
      <p
        className="mt-6 max-w-xl"
        style={{
          fontFamily: "var(--font-display), serif",
          fontStyle: "italic",
          fontSize: 18,
          lineHeight: 1.5,
          color: "rgba(240,235,220,0.75)",
        }}
      >
        Four directions for softening the grid / adding irregularness — without breaking the
        homepage. Each below is a standalone demo of the treatment. Scroll, eyeball, reply with a
        number (or combo) and I promote it.
      </p>
    </header>
  );
}

function LabFooter() {
  return (
    <footer
      className="mx-auto max-w-5xl px-7 py-14 sm:px-10 sm:py-20"
      style={{ borderTop: "1px dashed rgba(240,235,220,0.3)" }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 11,
          letterSpacing: "0.34em",
          color: "rgba(240,235,220,0.5)",
          fontWeight: 800,
        }}
      >
        NEXT
      </div>
      <p
        className="mt-4"
        style={{
          fontFamily: "var(--font-display), serif",
          fontStyle: "italic",
          fontSize: 20,
          lineHeight: 1.5,
          color: "rgba(240,235,220,0.9)",
          maxWidth: 620,
        }}
      >
        Reply with 01, 02, 03, or 04 — or mix (&ldquo;tape from 02 + margin doodles from 04&rdquo;).
        I&rsquo;ll land the lowest-risk surface first (Gallery cards usually), you review live, then
        we move on.
      </p>
    </footer>
  );
}

/* ================== VARIANT LABEL ================== */

function VariantLabel({
  num,
  name,
  desc,
  bestIf,
}: {
  num: string;
  name: string;
  desc: string;
  bestIf: string;
}) {
  return (
    <div className="mx-auto max-w-5xl px-7 pt-14 pb-6 sm:px-10">
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
        {num} &nbsp;·&nbsp; {name}
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
      <p
        className="mt-3"
        style={{
          fontFamily: "var(--font-display), serif",
          fontStyle: "italic",
          fontSize: 14,
          color: "rgba(240,235,220,0.55)",
        }}
      >
        Best if: &ldquo;{bestIf}&rdquo;
      </p>
    </div>
  );
}

/* ================== 01 · XEROX DECAY ================== */

function V01Xerox() {
  return (
    <section>
      <VariantLabel
        num="01"
        name="XEROX DECAY"
        desc="Ran-through-a-copier feel. Every ink border gains a subtle wobble (SVG roughen filter). Misregistration: the crimson drop-shadow is offset 3px/5px instead of clean 4/4. Masthead picks up faint horizontal scan-line banding. Cards alternate ±1° tilt. Halftone noise overlay at 5%."
        bestIf="I want the whole site to feel photocopied twice, not printed clean."
      />
      <div
        className="mx-auto max-w-5xl"
        style={{
          position: "relative",
          background: "#ECE4D0",
          border: "3px solid #1a1a1a",
          color: "#1a1a1a",
          padding: "48px 32px 64px",
          overflow: "hidden",
        }}
      >
        {/* Halftone noise overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(rgba(26,26,26,0.18) 0.8px, transparent 1px)",
            backgroundSize: "4px 4px",
            opacity: 0.18,
            mixBlendMode: "multiply",
          }}
          aria-hidden
        />
        {/* Scan-line banding */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent 0, transparent 3px, rgba(26,26,26,0.045) 3px, rgba(26,26,26,0.045) 4px)",
          }}
          aria-hidden
        />

        {/* Masthead with misregistered shadow */}
        <div className="relative text-center">
          <h2
            style={{
              fontFamily: "var(--font-tattoo), sans-serif",
              fontSize: "clamp(3rem, 11vw, 7rem)",
              lineHeight: 0.88,
              color: "#1a1a1a",
              textShadow: "3px 5px 0 #d7322e",
              letterSpacing: "0.02em",
              filter: "url(#rough-lite)",
            }}
          >
            TONY DECAY
          </h2>
        </div>

        {/* Card row — wobbled borders, alternating tilt */}
        <div className="relative mt-10 grid grid-cols-3 gap-6 sm:gap-8">
          {[P[1], P[5], P[11]].map((pr, i) => (
            <div
              key={pr.id}
              style={{
                transform: `rotate(${i === 1 ? 0.8 : i === 0 ? -1 : 1.2}deg)`,
                background: "#fffef8",
                padding: 10,
                filter: "url(#rough-lite)",
                border: "3px solid #1a1a1a",
                boxShadow: "3px 5px 0 #d7322e",
              }}
            >
              <div className="relative" style={{ aspectRatio: "3 / 4" }}>
                <Image src={pr.src} alt={pr.alt} fill sizes="240px" className="object-cover" />
              </div>
            </div>
          ))}
        </div>

        {/* CTA row — flat gold with wobbled border */}
        <div className="relative mt-10 flex items-center justify-center gap-5">
          <MiniStarburst variant="xerox" />
          <button
            style={{
              padding: "18px 36px",
              background: "#F7C234",
              color: "#1a1a1a",
              border: "3px solid #1a1a1a",
              fontFamily: "var(--font-tattoo), sans-serif",
              fontSize: 32,
              letterSpacing: "0.02em",
              boxShadow: "3px 5px 0 #d7322e, 3px 5px 0 2px #1a1a1a",
              lineHeight: 1,
              cursor: "pointer",
              filter: "url(#rough-lite)",
            }}
          >
            COLLECT YOURS
          </button>
        </div>
      </div>
    </section>
  );
}

/* ================== 02 · TAPED SCRAPBOOK ================== */

function V02Taped() {
  return (
    <section>
      <VariantLabel
        num="02"
        name="TAPED SCRAPBOOK"
        desc="Assembled by hand. Cards carry mixed tape placements (top-center / corner-diagonal / bottom-torn), some with thumbtacks instead of tape. One hero card gets a curled bottom-right corner. Pull-quote band held by paperclips. Section bottom deckled via SVG wave mask."
        bestIf="I want it to feel physical, not vector-perfect."
      />
      <div
        className="mx-auto max-w-5xl"
        style={{
          position: "relative",
          background: "#ECE4D0",
          color: "#1a1a1a",
          border: "3px solid #1a1a1a",
          padding: "48px 32px 80px",
          overflow: "hidden",
        }}
      >
        {/* Subtle paper fibre */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(rgba(26,26,26,0.1) 0.8px, transparent 1px)",
            backgroundSize: "6px 6px",
            opacity: 0.12,
          }}
          aria-hidden
        />

        <div className="relative grid grid-cols-3 gap-10">
          {/* Card 1 — tape top-center (familiar) */}
          <TapedCard print={P[1]} tilt={-2}>
            <div
              className="absolute left-1/2 -translate-x-1/2"
              style={{
                top: -12,
                width: 90,
                height: 20,
                background: "rgba(247,194,52,0.55)",
                border: "1px solid rgba(26,26,26,0.25)",
                transform: "rotate(-3deg)",
              }}
              aria-hidden
            />
          </TapedCard>

          {/* Card 2 — tape at corner, diagonal */}
          <TapedCard print={P[5]} tilt={1.5}>
            <div
              className="absolute"
              style={{
                top: -8,
                right: -14,
                width: 70,
                height: 20,
                background: "rgba(60,181,181,0.55)",
                border: "1px solid rgba(26,26,26,0.28)",
                transform: "rotate(34deg)",
              }}
              aria-hidden
            />
          </TapedCard>

          {/* Card 3 — thumbtack instead of tape + curled bottom-right corner */}
          <TapedCard print={P[11]} tilt={-1} curled>
            <Thumbtack top={-14} />
          </TapedCard>
        </div>

        {/* Pull-quote band held by paperclips */}
        <div className="relative mt-14 flex items-center justify-center">
          <Paperclip side="left" />
          <div
            style={{
              padding: "14px 36px",
              background: "#fffef8",
              border: "2px solid #1a1a1a",
              fontFamily: "var(--font-display), serif",
              fontStyle: "italic",
              fontSize: 22,
              color: "#1a1a1a",
              lineHeight: 1.2,
              boxShadow: "3px 4px 0 rgba(26,26,26,0.25)",
              maxWidth: 520,
              textAlign: "center",
              transform: "rotate(-0.6deg)",
            }}
          >
            &ldquo;every piece hand-pulled, signed, numbered.&rdquo;
          </div>
          <Paperclip side="right" />
        </div>

        {/* Deckled bottom edge */}
        <svg
          className="pointer-events-none absolute right-0 left-0"
          style={{ bottom: -1 }}
          viewBox="0 0 1000 24"
          preserveAspectRatio="none"
          width="100%"
          height="24"
          aria-hidden
        >
          <path
            d="M 0,24 L 0,10 C 60,2 110,22 180,14 S 320,2 420,16 S 560,4 680,18 S 820,6 960,14 L 1000,10 L 1000,24 Z"
            fill="#ECE4D0"
            stroke="#1a1a1a"
            strokeWidth="2.5"
          />
        </svg>
      </div>
    </section>
  );
}

function TapedCard({
  print,
  tilt,
  curled = false,
  children,
}: {
  print: (typeof P)[number];
  tilt: number;
  curled?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <figure
      className="relative"
      style={{
        transform: `rotate(${tilt}deg)`,
        background: "#fffef8",
        padding: "12px 12px 14px",
        border: "1px solid rgba(26,26,26,0.25)",
        boxShadow: curled
          ? "0 12px 18px -4px rgba(26,26,26,0.4)"
          : "4px 6px 14px rgba(26,26,26,0.25)",
        clipPath: curled ? "polygon(0 0, 100% 0, 100% 84%, 84% 100%, 0 100%)" : undefined,
      }}
    >
      {children}
      <div className="relative" style={{ aspectRatio: "3 / 4" }}>
        <Image src={print.src} alt={print.alt} fill sizes="240px" className="object-cover" />
      </div>
      {curled && (
        <svg
          className="pointer-events-none absolute"
          style={{ bottom: -4, right: -4, width: 72, height: 72 }}
          viewBox="0 0 72 72"
          aria-hidden
        >
          <path
            d="M 72,48 L 72,72 L 48,72 C 58,66 66,58 72,48 Z"
            fill="#e0d6bb"
            stroke="#1a1a1a"
            strokeWidth="1.5"
          />
        </svg>
      )}
    </figure>
  );
}

function Thumbtack({ top }: { top: number }) {
  return (
    <svg
      className="absolute left-1/2 -translate-x-1/2"
      style={{ top, width: 26, height: 30 }}
      viewBox="0 0 26 30"
      aria-hidden
    >
      <ellipse cx="13" cy="22" rx="9" ry="3" fill="rgba(26,26,26,0.25)" />
      <circle cx="13" cy="10" r="8" fill="#d7322e" stroke="#1a1a1a" strokeWidth="1.5" />
      <circle cx="10" cy="7" r="2" fill="rgba(255,255,255,0.55)" />
    </svg>
  );
}

function Paperclip({ side }: { side: "left" | "right" }) {
  return (
    <svg
      style={{
        width: 34,
        height: 60,
        [side === "left" ? "marginRight" : "marginLeft"]: -10,
        transform: side === "left" ? "rotate(-18deg)" : "rotate(18deg)",
        zIndex: 2,
      }}
      viewBox="0 0 34 60"
      aria-hidden
    >
      <path
        d="M 10,4 C 4,4 4,14 10,14 L 22,14 C 28,14 28,24 22,24 L 10,24 C 6,24 6,32 10,32 L 24,32"
        fill="none"
        stroke="#7c7266"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ================== 03 · INK REGISTRATION ================== */

function V03Ink() {
  return (
    <section>
      <VariantLabel
        num="03"
        name="INK REGISTRATION"
        desc="Hand-pulled silkscreen imperfection. Crimson type layer is misregistered 2px off the ink layer — the shadow doesn't align cleanly. Subtle CMYK halftone (teal + crimson dots, not just ink). Starbursts get a second, offset print layer. COLLECT YOURS drops the gloss gradient — flat gold with a slightly bled border."
        bestIf="I want it to look like it came off Tony's press, not a browser."
      />
      <div
        className="mx-auto max-w-5xl"
        style={{
          position: "relative",
          background: "#ECE4D0",
          color: "#1a1a1a",
          border: "3px solid #1a1a1a",
          padding: "48px 32px 64px",
          overflow: "hidden",
        }}
      >
        {/* CMYK halftone — teal + crimson dots */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(rgba(60,181,181,0.18) 0.9px, transparent 1.2px), radial-gradient(rgba(215,50,46,0.16) 0.8px, transparent 1.1px)",
            backgroundSize: "7px 7px, 9px 9px",
            backgroundPosition: "0 0, 3px 4px",
            mixBlendMode: "multiply",
          }}
          aria-hidden
        />

        {/* Misregistered masthead: crimson layer sits 3px under + left of the ink layer */}
        <div className="relative text-center" style={{ position: "relative" }}>
          <div
            style={{
              fontFamily: "var(--font-tattoo), sans-serif",
              fontSize: "clamp(3rem, 11vw, 7rem)",
              lineHeight: 0.88,
              letterSpacing: "0.02em",
              position: "relative",
            }}
          >
            <span
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                color: "#d7322e",
                transform: "translate(-3px, 2px)",
                mixBlendMode: "multiply",
              }}
            >
              TONY DECAY
            </span>
            <span
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                color: "#3cb5b5",
                transform: "translate(2px, -2px)",
                mixBlendMode: "multiply",
                opacity: 0.9,
              }}
            >
              TONY DECAY
            </span>
            <span style={{ color: "#1a1a1a", position: "relative" }}>TONY DECAY</span>
          </div>
        </div>

        {/* Two starbursts with double-print offset */}
        <div className="relative mt-14 flex items-center justify-center gap-14">
          <MiniStarburst variant="ink" />
          <MiniStarburst variant="ink-red" />
        </div>

        {/* Flat-gold CTA with ink-bleed border */}
        <div className="relative mt-12 flex justify-center">
          <button
            style={{
              padding: "20px 40px",
              background: "#F7C234",
              color: "#1a1a1a",
              border: "4px solid #1a1a1a",
              fontFamily: "var(--font-tattoo), sans-serif",
              fontSize: 36,
              letterSpacing: "0.02em",
              lineHeight: 1,
              cursor: "pointer",
              filter: "url(#rough-heavy)",
              boxShadow: "none",
            }}
          >
            COLLECT YOURS
          </button>
        </div>
        <p
          className="relative mt-5 text-center"
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 11,
            letterSpacing: "0.28em",
            color: "rgba(26,26,26,0.5)",
          }}
        >
          NO GLOSS / NO GRADIENT / FLAT INK
        </p>
      </div>
    </section>
  );
}

/* ================== 04 · MARGIN NOTEBOOK ================== */

function V04Margin() {
  return (
    <section>
      <VariantLabel
        num="04"
        name="MARGIN NOTEBOOK"
        desc="The composition-paper treatment already in the Artist section leaks out. Ruled lines + red margin rule run through Hero. Masthead gets a crimson handwritten annotation arrow. FAQ swaps corkboard for green graph paper. Stats values underlined in pencil. Tiny crimson doodles in gutters (banana, cartridge, star)."
        bestIf="I want it to read like a kid's 1999 notebook, not a magazine."
      />
      <div
        className="mx-auto max-w-5xl"
        style={{
          position: "relative",
          background: "#f0ebdc",
          color: "#1a1a1a",
          border: "3px solid #1a1a1a",
          padding: "48px 32px 64px 84px",
          overflow: "hidden",
        }}
      >
        {/* Horizontal rules */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent 0, transparent 31px, rgba(26,26,26,0.14) 31px, rgba(26,26,26,0.14) 32px)",
          }}
          aria-hidden
        />
        {/* Red margin rule */}
        <div
          className="pointer-events-none absolute inset-y-0"
          style={{
            left: 64,
            width: 1.5,
            background: "rgba(215,50,46,0.7)",
          }}
          aria-hidden
        />

        {/* Masthead with annotation arrow */}
        <div className="relative">
          <h2
            style={{
              fontFamily: "var(--font-tattoo), sans-serif",
              fontSize: "clamp(3rem, 10vw, 6rem)",
              lineHeight: 0.9,
              color: "#1a1a1a",
              letterSpacing: "0.01em",
            }}
          >
            TONY DECAY
          </h2>
          <svg
            className="pointer-events-none absolute"
            style={{ top: -20, right: 20, width: 180, height: 110 }}
            viewBox="0 0 180 110"
            aria-hidden
          >
            <path
              d="M 160,90 C 130,40 80,18 30,28"
              fill="none"
              stroke="#d7322e"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="5 4"
            />
            <path
              d="M 30,28 l 10,-4 m -10,4 l 6,8"
              fill="none"
              stroke="#d7322e"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <text
              x="70"
              y="14"
              fontFamily="var(--font-display), serif"
              fontStyle="italic"
              fontSize="18"
              fill="#d7322e"
            >
              this guy.
            </text>
          </svg>
        </div>

        {/* Inline: doodle row + stat sample */}
        <div className="relative mt-12 flex flex-wrap items-end gap-10">
          {/* Stat cell with pencil underline */}
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 10,
                letterSpacing: "0.3em",
                fontWeight: 800,
                color: "rgba(26,26,26,0.6)",
                marginBottom: 4,
              }}
            >
              PRINTS
            </div>
            <div
              className="relative"
              style={{
                fontFamily: "var(--font-tattoo), sans-serif",
                fontSize: 56,
                lineHeight: 1,
                color: "#1a1a1a",
              }}
            >
              15
              <svg
                className="absolute -bottom-3 left-0"
                width="100"
                height="14"
                viewBox="0 0 100 14"
                aria-hidden
              >
                <path
                  d="M 2,10 C 20,2 50,12 70,6 S 92,10 96,8"
                  fill="none"
                  stroke="#d7322e"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Doodles */}
          <Doodle variant="banana" />
          <Doodle variant="cart" />
          <Doodle variant="star" />
        </div>

        {/* Graph-paper inset with post-its */}
        <div className="relative mt-14">
          <div
            className="relative"
            style={{
              background:
                "repeating-linear-gradient(to right, transparent 0, transparent 19px, rgba(91,170,79,0.35) 19px, rgba(91,170,79,0.35) 20px), repeating-linear-gradient(to bottom, transparent 0, transparent 19px, rgba(91,170,79,0.35) 19px, rgba(91,170,79,0.35) 20px), #eef5e4",
              padding: "44px 20px 34px",
              border: "2px dashed rgba(26,26,26,0.35)",
              minHeight: 220,
              display: "flex",
              gap: 20,
              alignItems: "flex-start",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <PostIt color="#FFE066" rot={-3} q="Q.01" body="What's in the set?" />
            <PostIt color="#F2A2BC" rot={2} q="Q.02" body="Ship worldwide?" />
            <PostIt color="#9DD4FF" rot={-2} q="Q.03" body="How to pay?" />
          </div>
          <span
            className="absolute"
            style={{
              top: -10,
              left: 14,
              background: "#f0ebdc",
              padding: "0 8px",
              fontFamily: "var(--font-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.28em",
              color: "rgba(26,26,26,0.6)",
              fontWeight: 800,
            }}
          >
            FAQ / GRAPH PAPER
          </span>
        </div>
      </div>
    </section>
  );
}

function PostIt({ color, rot, q, body }: { color: string; rot: number; q: string; body: string }) {
  return (
    <div
      style={{
        background: color,
        transform: `rotate(${rot}deg)`,
        width: 170,
        minHeight: 140,
        padding: "16px 14px",
        border: "1px solid rgba(26,26,26,0.15)",
        boxShadow: "4px 5px 10px rgba(26,26,26,0.2)",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 10,
          letterSpacing: "0.3em",
          fontWeight: 800,
          color: "rgba(26,26,26,0.55)",
          marginBottom: 6,
        }}
      >
        {q}
      </div>
      <div
        style={{
          fontFamily: "var(--font-display), serif",
          fontSize: 16,
          lineHeight: 1.3,
          color: "#1a1a1a",
        }}
      >
        {body}
      </div>
    </div>
  );
}

function Doodle({ variant }: { variant: "banana" | "cart" | "star" }) {
  const stroke = "#d7322e";
  if (variant === "banana") {
    return (
      <svg width="60" height="56" viewBox="0 0 60 56" aria-hidden>
        <path
          d="M 10,8 C 4,22 4,38 18,50 C 36,52 54,38 52,22 L 48,20 C 48,34 36,46 22,44 C 12,38 10,24 14,10 Z"
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <line x1="10" y1="8" x2="14" y2="4" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  if (variant === "cart") {
    return (
      <svg width="64" height="56" viewBox="0 0 64 56" aria-hidden>
        <rect
          x="6"
          y="10"
          width="52"
          height="36"
          rx="2"
          fill="none"
          stroke={stroke}
          strokeWidth="2"
        />
        <rect x="14" y="16" width="36" height="18" fill="none" stroke={stroke} strokeWidth="1.5" />
        <line x1="20" y1="38" x2="44" y2="38" stroke={stroke} strokeWidth="1.5" />
        <line x1="20" y1="42" x2="44" y2="42" stroke={stroke} strokeWidth="1.5" />
      </svg>
    );
  }
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" aria-hidden>
      <polygon
        points="26,4 31,20 48,20 34,30 40,46 26,36 12,46 18,30 4,20 21,20"
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ================== MINI STARBURST ================== */

function MiniStarburst({ variant }: { variant: "xerox" | "ink" | "ink-red" }) {
  const size = 120;
  if (variant === "ink") {
    return (
      <div style={{ position: "relative", width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          style={{ position: "absolute", top: 2, left: -3 }}
        >
          <polygon points={STAR_POINTS} fill="#d7322e" opacity={0.9} />
        </svg>
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <polygon
            points={STAR_POINTS}
            fill="#F7C234"
            stroke="#1a1a1a"
            strokeWidth={3}
            strokeLinejoin="round"
          />
          <text
            x="50"
            y="54"
            textAnchor="middle"
            fontFamily="var(--font-tattoo), sans-serif"
            fontWeight={700}
            fontSize="12"
            fill="#1a1a1a"
          >
            ORDER NOW
          </text>
        </svg>
      </div>
    );
  }
  if (variant === "ink-red") {
    return (
      <div style={{ position: "relative", width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          style={{ position: "absolute", top: 3, left: 3 }}
        >
          <polygon points={STAR_POINTS} fill="#3cb5b5" opacity={0.85} />
        </svg>
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <polygon
            points={STAR_POINTS}
            fill="#d7322e"
            stroke="#1a1a1a"
            strokeWidth={3}
            strokeLinejoin="round"
          />
          <text
            x="50"
            y="48"
            textAnchor="middle"
            fontFamily="var(--font-tattoo), sans-serif"
            fontWeight={700}
            fontSize="14"
            fill="#f0ebdc"
          >
            100
          </text>
          <text
            x="50"
            y="62"
            textAnchor="middle"
            fontFamily="var(--font-tattoo), sans-serif"
            fontWeight={700}
            fontSize="12"
            fill="#f0ebdc"
          >
            SETS
          </text>
        </svg>
      </div>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: "url(#rough-lite)" }}>
      <polygon
        points={STAR_POINTS}
        fill="#F7C234"
        stroke="#1a1a1a"
        strokeWidth={3}
        strokeLinejoin="round"
      />
      <text
        x="50"
        y="54"
        textAnchor="middle"
        fontFamily="var(--font-tattoo), sans-serif"
        fontWeight={700}
        fontSize="12"
        fill="#1a1a1a"
      >
        ORDER NOW
      </text>
    </svg>
  );
}

/* ================== 05 · GALLERY STACK (MOBILE) ==================
   Three column variants of the mobile gallery/CTA flow:
   featured (cycles 7s) → 3 fixed thumbs (prints 1,2,3) → VIEW ALL → COLLECT YOURS
   All three columns share one cycling index for synced timing. */

function useFeaturedCycle() {
  const [featIdx, setFeatIdx] = useState(0);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setFeatIdx(Math.floor(Math.random() * FEATURED_POOL.length));
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setFeatIdx((i) => (i + 1) % FEATURED_POOL.length);
    }, FEATURED_CYCLE_MS);
    return () => clearInterval(id);
  }, []);

  return featIdx;
}

/* Layered cross-fade image — all pool prints mounted, opacity transition
   swaps between them. 800ms smooth ease. */
function SmoothFeaturedImage({
  pool,
  idx,
  sizes = "320px",
  priorityFirst = true,
}: {
  pool: typeof P;
  idx: number;
  sizes?: string;
  priorityFirst?: boolean;
}) {
  return (
    <div className="relative w-full" style={{ aspectRatio: "3 / 4" }}>
      {pool.map((pr, i) => (
        <div
          key={pr.id}
          className="absolute inset-0"
          style={{
            opacity: i === idx ? 1 : 0,
            transition: "opacity 800ms ease-in-out",
          }}
        >
          <Image
            src={pr.src}
            alt={pr.alt}
            fill
            sizes={sizes}
            className="object-cover"
            priority={priorityFirst && i === 0}
          />
        </div>
      ))}
    </div>
  );
}

/* Gameboy/Pokemon flickering pixel arrow. Points right. Uses CSS steps(1)
   animation for crunchy 2-frame flicker (no interpolation). */
function PixelArrow({ size = 28, color = "#d7322e" }: { size?: number; color?: string }) {
  const px = 4;
  const rects: [number, number][] = [
    [0, 0],
    [0, 4],
    [4, 4],
    [0, 8],
    [4, 8],
    [8, 8],
    [0, 12],
    [4, 12],
    [0, 16],
  ];
  return (
    <svg
      width={(size * 12) / 20}
      height={size}
      viewBox="0 0 12 20"
      style={{
        animation: "pixel-arrow-pulse 0.55s steps(1) infinite",
        flexShrink: 0,
        shapeRendering: "crispEdges",
      }}
      aria-hidden
    >
      <g fill={color} stroke="#1a1a1a" strokeWidth="0.6">
        {rects.map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width={px} height={px} />
        ))}
      </g>
    </svg>
  );
}

function V05GalleryStack() {
  const featIdx = useFeaturedCycle();
  const featured = FEATURED_POOL[featIdx] ?? FEATURED_POOL[0];

  return (
    <section>
      <VariantLabel
        num="05"
        name="GALLERY STACK (MOBILE)"
        desc="Mobile-column flow: rotating featured print (cycles every 7s, starts random, pulls from prints 4–15) → fixed 3 thumbs (prints 1,2,3 always) → VIEW ALL PRINTS button → COLLECT YOURS CTA. Three visual treatments of the same structure. Pick A, B, or C."
        bestIf="Decide the card/button treatment for the mobile gallery flow."
      />
      <div
        className="mx-auto max-w-5xl px-7 pb-10 sm:px-10"
        style={{
          display: "grid",
          gap: 28,
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          alignItems: "start",
        }}
      >
        <GalleryVariantEditorial featured={featured} />
        <GalleryVariantArcade pool={FEATURED_POOL} idx={featIdx} />
        <GalleryVariantScrapbook featured={featured} />
      </div>
    </section>
  );
}

function StackColumn({
  tag,
  title,
  children,
}: {
  tag: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "#ECE4D0",
        border: "2px solid #1a1a1a",
        padding: 16,
        maxWidth: 360,
        margin: "0 auto",
        width: "100%",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 10,
          letterSpacing: "0.3em",
          fontWeight: 800,
          color: "rgba(26,26,26,0.55)",
          marginBottom: 2,
        }}
      >
        {tag}
      </div>
      <div
        style={{
          fontFamily: "var(--font-tattoo), sans-serif",
          fontSize: 22,
          color: "#1a1a1a",
          letterSpacing: "0.01em",
          marginBottom: 14,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function RedArrowMini({ h = 24 }: { h?: number }) {
  return (
    <span
      aria-hidden
      style={{
        width: 0,
        height: 0,
        borderTop: `${h * 0.5}px solid transparent`,
        borderBottom: `${h * 0.5}px solid transparent`,
        borderLeft: `${h * 0.7}px solid #d7322e`,
        flexShrink: 0,
      }}
    />
  );
}

function PriceTag({ price = "$300" }: { price?: string }) {
  return (
    <div
      style={{
        position: "relative",
        padding: "6px 14px 6px 20px",
        background: "#d7322e",
        border: "2px solid #1a1a1a",
        fontFamily: "var(--font-tattoo), sans-serif",
        fontSize: 18,
        color: "#f0ebdc",
        transform: "rotate(-4deg)",
        clipPath: "polygon(12% 0%, 100% 0%, 100% 100%, 12% 100%, 0% 50%)",
        boxShadow: "2px 2px 0 #1a1a1a",
        lineHeight: 1,
        flexShrink: 0,
      }}
    >
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: 8,
          top: "50%",
          transform: "translateY(-50%)",
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#f0ebdc",
          border: "1px solid #1a1a1a",
        }}
      />
      {price}
    </div>
  );
}

/* --- Variant A: EDITORIAL (clean magazine) --- */
function GalleryVariantEditorial({ featured }: { featured: (typeof P)[number] }) {
  return (
    <StackColumn tag="A" title="EDITORIAL">
      {/* Featured plate — white frame, corner badge */}
      <figure
        className="relative"
        style={{
          background: "#fffef8",
          padding: 8,
          border: "2px solid #1a1a1a",
          boxShadow: "4px 4px 0 #1a1a1a",
        }}
      >
        <div className="relative" style={{ aspectRatio: "3 / 4" }}>
          <Image
            src={featured.src}
            alt={featured.alt}
            fill
            sizes="320px"
            className="object-cover"
          />
        </div>
        <div
          style={{
            position: "absolute",
            top: -10,
            left: -10,
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "#2b5dae",
            color: "#f0ebdc",
            border: "2px solid #1a1a1a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-tattoo), sans-serif",
            fontSize: 16,
            boxShadow: "2px 2px 0 #1a1a1a",
          }}
        >
          {String(featured.id).padStart(2, "0")}
        </div>
        <figcaption
          style={{
            marginTop: 6,
            fontFamily: "var(--font-display), serif",
            fontStyle: "italic",
            fontSize: 13,
            color: "#4a4438",
            textAlign: "center",
          }}
        >
          Print N°{String(featured.id).padStart(2, "0")} / 15
        </figcaption>
      </figure>

      {/* 3 fixed thumbs */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {FIXED_THUMBS.map((pr) => (
          <figure
            key={pr.id}
            className="relative"
            style={{
              background: "#fffef8",
              padding: 4,
              border: "1.5px solid #1a1a1a",
              boxShadow: "2px 2px 0 #1a1a1a",
            }}
          >
            <div className="relative" style={{ aspectRatio: "3 / 4" }}>
              <Image src={pr.src} alt={pr.alt} fill sizes="100px" className="object-cover" />
            </div>
            <div
              style={{
                position: "absolute",
                top: -7,
                left: -7,
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: "#d7322e",
                color: "#f0ebdc",
                border: "1.5px solid #1a1a1a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-tattoo), sans-serif",
                fontSize: 10,
                lineHeight: 1,
              }}
            >
              {String(pr.id).padStart(2, "0")}
            </div>
          </figure>
        ))}
      </div>

      {/* VIEW ALL — ghost button */}
      <button
        className="mt-4 w-full"
        style={{
          padding: "10px 14px",
          background: "transparent",
          border: "2px solid #1a1a1a",
          fontFamily: "var(--font-mono), monospace",
          fontSize: 11,
          letterSpacing: "0.28em",
          fontWeight: 800,
          color: "#1a1a1a",
          lineHeight: 1,
          cursor: "pointer",
        }}
      >
        VIEW ALL 15 PRINTS &nbsp;→
      </button>

      {/* COLLECT YOURS — current homepage style */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <RedArrowMini h={22} />
        <button
          style={{
            padding: "14px 20px",
            background: "#F7C234",
            border: "3px solid #1a1a1a",
            fontFamily: "var(--font-tattoo), sans-serif",
            fontSize: 22,
            color: "#1a1a1a",
            letterSpacing: "0.02em",
            boxShadow: "3px 4px 0 #d7322e, 3px 4px 0 2px #1a1a1a",
            lineHeight: 1,
            cursor: "pointer",
          }}
        >
          COLLECT YOURS
        </button>
        <PriceTag />
      </div>
    </StackColumn>
  );
}

/* --- Variant B: ARCADE (cartridge / pixel) — smooth cross-fade + pixel arrow --- */
function GalleryVariantArcade({ pool, idx }: { pool: typeof P; idx: number }) {
  const current = pool[idx] ?? pool[0];
  return (
    <StackColumn tag="B" title="ARCADE">
      {/* Featured with pixel corners + N°05 block label — 800ms cross-fade */}
      <div className="relative">
        <div
          className="relative w-full"
          style={{
            background: "#fffef8",
            border: "3px solid #1a1a1a",
            boxShadow: "5px 5px 0 #2b5dae, 5px 5px 0 2px #1a1a1a",
          }}
        >
          <SmoothFeaturedImage pool={pool} idx={idx} sizes="320px" />
        </div>
        <div
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            padding: "4px 8px",
            background: "#d7322e",
            color: "#f0ebdc",
            border: "2px solid #1a1a1a",
            fontFamily: "var(--font-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.18em",
            fontWeight: 800,
            lineHeight: 1,
            boxShadow: "2px 2px 0 #1a1a1a",
          }}
        >
          N°{String(current.id).padStart(2, "0")}
        </div>
      </div>

      {/* 3 cartridge thumbs */}
      <div className="mt-5 grid grid-cols-3 gap-2">
        {FIXED_THUMBS.map((pr) => (
          <div key={pr.id} className="relative">
            <div
              style={{
                position: "absolute",
                top: -9,
                left: "50%",
                transform: "translateX(-50%)",
                padding: "2px 10px",
                background: "#F7C234",
                color: "#1a1a1a",
                border: "2px solid #1a1a1a",
                fontFamily: "var(--font-mono), monospace",
                fontSize: 9,
                letterSpacing: "0.18em",
                fontWeight: 800,
                lineHeight: 1,
                zIndex: 2,
              }}
            >
              N°{String(pr.id).padStart(2, "0")}
            </div>
            <div
              style={{
                background: "#fffef8",
                border: "2px solid #1a1a1a",
                boxShadow: "2px 2px 0 #1a1a1a",
              }}
            >
              <div className="relative" style={{ aspectRatio: "3 / 4" }}>
                <Image src={pr.src} alt={pr.alt} fill sizes="100px" className="object-cover" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* VIEW ALL — pixel button */}
      <button
        className="mt-5 w-full"
        style={{
          padding: "12px 14px",
          background: "#1a1a1a",
          border: "2px solid #1a1a1a",
          fontFamily: "var(--font-mono), monospace",
          fontSize: 11,
          letterSpacing: "0.28em",
          fontWeight: 800,
          color: "#F7C234",
          lineHeight: 1,
          cursor: "pointer",
          boxShadow: "3px 3px 0 #d7322e, 3px 3px 0 2px #1a1a1a",
        }}
      >
        ▸ VIEW ALL 15
      </button>

      {/* COLLECT YOURS — flat yellow blocky — with flickering pixel arrow */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <PixelArrow size={28} />
        <button
          style={{
            padding: "14px 20px",
            background: "#F7C234",
            border: "3px solid #1a1a1a",
            fontFamily: "var(--font-tattoo), sans-serif",
            fontSize: 22,
            color: "#1a1a1a",
            letterSpacing: "0.02em",
            boxShadow: "4px 4px 0 #d7322e, 4px 4px 0 2px #1a1a1a",
            lineHeight: 1,
            cursor: "pointer",
          }}
        >
          COLLECT YOURS
        </button>
        <PriceTag />
      </div>
    </StackColumn>
  );
}

/* ================== 06 · GALLERY DESKTOP (ARCADE) ==================
   Desktop version of the arcade variant, for use in the homepage hero grid.
   Left: big featured with smooth 7s cross-fade + N°XX label.
   Right column (top→bottom): SEE ALL PRINTS → COLLECT YOURS (+ pixel arrow +
   $300 tag) → 3 fixed thumbs (01/02/03). */

function V06GalleryDesktopArcade() {
  const featIdx = useFeaturedCycle();
  const current = FEATURED_POOL[featIdx] ?? FEATURED_POOL[0];

  return (
    <section>
      <VariantLabel
        num="06"
        name="GALLERY DESKTOP (ARCADE)"
        desc="Desktop layout of the arcade direction. Big featured on left (7s smooth cross-fade, pulls prints 4–15, random start). Right column stacks: SEE ALL PRINTS → COLLECT YOURS with flickering pixel arrow + $300 tag → 3 fixed thumbs (01/02/03) at the bottom."
        bestIf="Arcade direction promoted to the desktop hero area."
      />
      <div className="mx-auto max-w-5xl px-7 pb-12 sm:px-10">
        <div
          style={{
            background: "#ECE4D0",
            border: "3px solid #1a1a1a",
            padding: 28,
          }}
        >
          <div
            className="grid gap-7"
            style={{ gridTemplateColumns: "5fr 4fr", alignItems: "stretch" }}
          >
            {/* LEFT — big featured with smooth fade */}
            <div className="relative">
              <div
                style={{
                  background: "#fffef8",
                  border: "3px solid #1a1a1a",
                  boxShadow: "7px 7px 0 #2b5dae, 7px 7px 0 2px #1a1a1a",
                }}
              >
                <SmoothFeaturedImage
                  pool={FEATURED_POOL}
                  idx={featIdx}
                  sizes="(max-width: 1024px) 50vw, 500px"
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  top: 14,
                  right: 14,
                  padding: "6px 14px",
                  background: "#d7322e",
                  color: "#f0ebdc",
                  border: "2px solid #1a1a1a",
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 13,
                  letterSpacing: "0.18em",
                  fontWeight: 800,
                  lineHeight: 1,
                  boxShadow: "3px 3px 0 #1a1a1a",
                }}
              >
                N°{String(current.id).padStart(2, "0")}
              </div>
            </div>

            {/* RIGHT — stacked right column */}
            <div className="flex flex-col justify-between gap-6">
              {/* SEE ALL PRINTS — pixel button */}
              <button
                style={{
                  padding: "18px 20px",
                  background: "#1a1a1a",
                  border: "2px solid #1a1a1a",
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 13,
                  letterSpacing: "0.3em",
                  fontWeight: 800,
                  color: "#F7C234",
                  lineHeight: 1,
                  cursor: "pointer",
                  boxShadow: "4px 4px 0 #d7322e, 4px 4px 0 2px #1a1a1a",
                  textAlign: "left",
                }}
              >
                ▸ VIEW ALL 15 PRINTS
              </button>

              {/* COLLECT YOURS + pixel arrow + $300 tag */}
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-3">
                  <PixelArrow size={42} />
                  <button
                    style={{
                      padding: "20px 24px",
                      background: "#F7C234",
                      border: "3px solid #1a1a1a",
                      fontFamily: "var(--font-tattoo), sans-serif",
                      fontSize: 30,
                      color: "#1a1a1a",
                      letterSpacing: "0.02em",
                      boxShadow: "6px 6px 0 #d7322e, 6px 6px 0 2px #1a1a1a",
                      lineHeight: 1,
                      cursor: "pointer",
                    }}
                  >
                    COLLECT YOURS
                  </button>
                </div>
                <PriceTag />
              </div>

              {/* 3 fixed thumbs with N°XX tabs */}
              <div className="grid grid-cols-3 gap-3">
                {FIXED_THUMBS.map((pr) => (
                  <div key={pr.id} className="relative">
                    <div
                      style={{
                        position: "absolute",
                        top: -10,
                        left: "50%",
                        transform: "translateX(-50%)",
                        padding: "3px 10px",
                        background: "#F7C234",
                        color: "#1a1a1a",
                        border: "2px solid #1a1a1a",
                        fontFamily: "var(--font-mono), monospace",
                        fontSize: 10,
                        letterSpacing: "0.18em",
                        fontWeight: 800,
                        lineHeight: 1,
                        zIndex: 2,
                      }}
                    >
                      N°{String(pr.id).padStart(2, "0")}
                    </div>
                    <div
                      style={{
                        background: "#fffef8",
                        border: "2px solid #1a1a1a",
                        boxShadow: "3px 3px 0 #1a1a1a",
                      }}
                    >
                      <div className="relative" style={{ aspectRatio: "3 / 4" }}>
                        <Image
                          src={pr.src}
                          alt={pr.alt}
                          fill
                          sizes="160px"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --- Variant C: SCRAPBOOK (taped / zine) --- */
function GalleryVariantScrapbook({ featured }: { featured: (typeof P)[number] }) {
  return (
    <StackColumn tag="C" title="SCRAPBOOK">
      {/* Featured polaroid with tape */}
      <figure
        className="relative"
        style={{
          background: "#fffef8",
          padding: "12px 12px 32px",
          border: "1px solid rgba(26,26,26,0.25)",
          boxShadow: "4px 6px 14px rgba(26,26,26,0.25)",
          transform: "rotate(-1.2deg)",
        }}
      >
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: -10,
            width: 84,
            height: 18,
            background: "rgba(247,194,52,0.55)",
            border: "1px solid rgba(26,26,26,0.3)",
            transform: "rotate(-3deg)",
          }}
          aria-hidden
        />
        <div className="relative" style={{ aspectRatio: "3 / 4" }}>
          <Image
            src={featured.src}
            alt={featured.alt}
            fill
            sizes="320px"
            className="object-cover"
          />
        </div>
        <figcaption
          style={{
            position: "absolute",
            bottom: 8,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: "var(--font-display), serif",
            fontStyle: "italic",
            fontSize: 14,
            color: "#4a4438",
          }}
        >
          0{featured.id} / 15
        </figcaption>
      </figure>

      {/* 3 polaroid thumbs */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        {FIXED_THUMBS.map((pr, i) => (
          <figure
            key={pr.id}
            className="relative"
            style={{
              background: "#fffef8",
              padding: "5px 5px 14px",
              border: "1px solid rgba(26,26,26,0.25)",
              boxShadow: "2px 3px 7px rgba(26,26,26,0.22)",
              transform: `rotate(${i === 0 ? -2 : i === 1 ? 1.5 : -1}deg)`,
            }}
          >
            {i === 0 ? (
              <Thumbtack top={-10} />
            ) : (
              <div
                className="absolute left-1/2 -translate-x-1/2"
                style={{
                  top: -6,
                  width: 42,
                  height: 10,
                  background: i === 1 ? "rgba(60,181,181,0.55)" : "rgba(247,194,52,0.55)",
                  border: "1px solid rgba(26,26,26,0.25)",
                  transform: `rotate(${i === 1 ? 4 : -4}deg)`,
                }}
                aria-hidden
              />
            )}
            <div className="relative" style={{ aspectRatio: "3 / 4" }}>
              <Image src={pr.src} alt={pr.alt} fill sizes="100px" className="object-cover" />
            </div>
            <figcaption
              style={{
                position: "absolute",
                bottom: 2,
                left: 0,
                right: 0,
                textAlign: "center",
                fontFamily: "var(--font-display), serif",
                fontStyle: "italic",
                fontSize: 9,
                color: "#4a4438",
              }}
            >
              0{pr.id}
            </figcaption>
          </figure>
        ))}
      </div>

      {/* VIEW ALL — handwritten underlined */}
      <div className="mt-6 text-center">
        <a
          role="button"
          tabIndex={0}
          style={{
            fontFamily: "var(--font-display), serif",
            fontStyle: "italic",
            fontSize: 18,
            color: "#1a1a1a",
            textDecoration: "underline",
            textDecorationColor: "#d7322e",
            textUnderlineOffset: 4,
            textDecorationThickness: 2,
            cursor: "pointer",
          }}
        >
          see all 15 prints &nbsp;→
        </a>
      </div>

      {/* COLLECT YOURS — same button but on a "taped card" ground */}
      <div
        className="relative mt-5"
        style={{
          background: "#fffef8",
          padding: "14px 10px",
          border: "1px solid rgba(26,26,26,0.25)",
          boxShadow: "3px 4px 10px rgba(26,26,26,0.22)",
          transform: "rotate(-0.6deg)",
        }}
      >
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: -8,
            width: 64,
            height: 14,
            background: "rgba(247,194,52,0.55)",
            border: "1px solid rgba(26,26,26,0.3)",
            transform: "rotate(-2deg)",
          }}
          aria-hidden
        />
        <div className="flex items-center justify-center gap-2">
          <RedArrowMini h={20} />
          <button
            style={{
              padding: "12px 18px",
              background: "#F7C234",
              border: "3px solid #1a1a1a",
              fontFamily: "var(--font-tattoo), sans-serif",
              fontSize: 20,
              color: "#1a1a1a",
              letterSpacing: "0.02em",
              boxShadow: "3px 3px 0 #d7322e, 3px 3px 0 2px #1a1a1a",
              lineHeight: 1,
              cursor: "pointer",
            }}
          >
            COLLECT YOURS
          </button>
          <PriceTag />
        </div>
      </div>
    </StackColumn>
  );
}

/* ================== 07 · ARCHIVE / UNUSED ==================
   Product (demoted from live when SHOP → checkout) + orphan components that
   were never wired into the homepage. Kept here for reference, not deleted. */

function V07Archive() {
  return (
    <section>
      <VariantLabel
        num="07"
        name="ARCHIVE / UNUSED"
        desc="Components no longer rendered on live. Product was demoted when SHOP became a direct checkout action. Hero/Gallery/Package/Certificate/MarqueeBar/AudioToggle are orphans from earlier rounds. Kept for reference + potential revival."
        bestIf="Audit what's not live; revive or delete later."
      />
      <div className="mx-auto max-w-5xl px-7 pb-16 sm:px-10">
        <ArchiveCard
          label="PRODUCT"
          sub="demoted 2026-04-21 — MagazineCover already carries CTA + stats"
          note="Retro cartridge-style shop spec sheet. PRESS START title, specs row (A PAPER / B SIZE / C EDITION / D SHIP), N°001/2026 label."
        >
          <Product />
        </ArchiveCard>

        <ArchiveCard
          label="HERO (legacy)"
          sub="pre-MagazineCover hero with GSAP deck-fan"
          note="10-card deck fan with cycle animation. Replaced by MagazineCover's featured+thumbs layout."
        >
          <Hero />
        </ArchiveCard>

        <ArchiveCard
          label="GALLERY (legacy)"
          sub="separate gallery component — never wired"
          note="Full-width gallery grid. Could be revived as the basis for a WORK section."
        >
          <Gallery />
        </ArchiveCard>

        <ArchiveCard
          label="PACKAGE"
          sub="earlier product/package treatment"
          note="Slightly different take on the shop section. Compare against Product above."
        >
          <Package />
        </ArchiveCard>

        <ArchiveCard
          label="CERTIFICATE"
          sub="certificate-of-authenticity artwork"
          note="Standalone cert block. Could be offered as a bonus/download to buyers post-purchase."
        >
          <Certificate />
        </ArchiveCard>

        <ArchiveCard
          label="MARQUEE BAR"
          sub="standalone marquee component"
          note="Older animated marquee. MagazineCover now has its own ticker; this one is unused."
        >
          <MarqueeBar />
        </ArchiveCard>

        <ArchiveCard
          label="AUDIO TOGGLE"
          sub="audio mute toggle — feature killed"
          note="User decision to remove audio — keeping the component in case it returns."
        >
          <AudioToggle />
        </ArchiveCard>
      </div>
    </section>
  );
}

function ArchiveCard({
  label,
  sub,
  note,
  children,
}: {
  label: string;
  sub: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        marginBottom: 48,
        border: "1px dashed rgba(240,235,220,0.3)",
        padding: 16,
      }}
    >
      <div className="mb-4 flex flex-wrap items-baseline gap-3">
        <span
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 11,
            letterSpacing: "0.3em",
            fontWeight: 800,
            color: "#F7C234",
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: "var(--font-display), serif",
            fontStyle: "italic",
            fontSize: 13,
            color: "rgba(240,235,220,0.55)",
          }}
        >
          {sub}
        </span>
      </div>
      <p
        style={{
          fontFamily: "var(--font-display), serif",
          fontSize: 14,
          lineHeight: 1.5,
          color: "rgba(240,235,220,0.75)",
          marginBottom: 14,
          maxWidth: 720,
        }}
      >
        {note}
      </p>
      <div
        style={{
          background: "#ECE4D0",
          border: "2px solid #1a1a1a",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ================== 08 · MENU VARIANTS ==================
   Four full visual previews of MobileMenu rework directions. Each mock is
   shown in a phone-frame so the menu treatment reads at real size. */

const IG_SVG_PATH =
  "M12 2C9.28 2 8.94 2.01 7.88 2.06C6.81 2.11 6.09 2.28 5.46 2.52C4.8 2.78 4.24 3.12 3.68 3.68C3.12 4.24 2.78 4.8 2.52 5.46C2.28 6.09 2.11 6.81 2.06 7.88C2.01 8.94 2 9.28 2 12C2 14.72 2.01 15.06 2.06 16.12C2.11 17.19 2.28 17.91 2.52 18.54C2.78 19.2 3.12 19.76 3.68 20.32C4.24 20.88 4.8 21.22 5.46 21.48C6.09 21.72 6.81 21.89 7.88 21.94C8.94 21.99 9.28 22 12 22C14.72 22 15.06 21.99 16.12 21.94C17.19 21.89 17.91 21.72 18.54 21.48C19.2 21.22 19.76 20.88 20.32 20.32C20.88 19.76 21.22 19.2 21.48 18.54C21.72 17.91 21.89 17.19 21.94 16.12C21.99 15.06 22 14.72 22 12C22 9.28 21.99 8.94 21.94 7.88C21.89 6.81 21.72 6.09 21.48 5.46C21.22 4.8 20.88 4.24 20.32 3.68C19.76 3.12 19.2 2.78 18.54 2.52C17.91 2.28 17.19 2.11 16.12 2.06C15.06 2.01 14.72 2 12 2ZM12 4.16C14.67 4.16 14.99 4.17 16.04 4.22C17.02 4.26 17.55 4.43 17.9 4.56C18.37 4.74 18.7 4.96 19.05 5.31C19.4 5.66 19.62 5.99 19.8 6.46C19.93 6.81 20.1 7.34 20.14 8.32C20.19 9.38 20.2 9.69 20.2 12.36C20.2 15.03 20.19 15.34 20.14 16.4C20.1 17.38 19.93 17.91 19.8 18.26C19.62 18.73 19.4 19.06 19.05 19.41C18.7 19.76 18.37 19.98 17.9 20.16C17.55 20.29 17.02 20.46 16.04 20.5C14.99 20.55 14.67 20.56 12 20.56C9.33 20.56 9.01 20.55 7.96 20.5C6.98 20.46 6.45 20.29 6.1 20.16C5.63 19.98 5.3 19.76 4.95 19.41C4.6 19.06 4.38 18.73 4.2 18.26C4.07 17.91 3.9 17.38 3.86 16.4C3.81 15.34 3.8 15.03 3.8 12.36C3.8 9.69 3.81 9.38 3.86 8.32C3.9 7.34 4.07 6.81 4.2 6.46C4.38 5.99 4.6 5.66 4.95 5.31C5.3 4.96 5.63 4.74 6.1 4.56C6.45 4.43 6.98 4.26 7.96 4.22C9.01 4.17 9.33 4.16 12 4.16ZM12 6.86C9.16 6.86 6.86 9.16 6.86 12C6.86 14.84 9.16 17.14 12 17.14C14.84 17.14 17.14 14.84 17.14 12C17.14 9.16 14.84 6.86 12 6.86ZM12 15C10.34 15 9 13.66 9 12C9 10.34 10.34 9 12 9C13.66 9 15 10.34 15 12C15 13.66 13.66 15 12 15ZM18.84 6.62C18.84 7.34 18.26 7.92 17.54 7.92C16.82 7.92 16.24 7.34 16.24 6.62C16.24 5.9 16.82 5.32 17.54 5.32C18.26 5.32 18.84 5.9 18.84 6.62Z";

function PhoneFrame({
  tag,
  title,
  children,
  bg = "#1A1A1E",
}: {
  tag: string;
  title: string;
  children: React.ReactNode;
  bg?: string;
}) {
  return (
    <div
      style={{
        background: "rgba(240,235,220,0.04)",
        border: "1px solid rgba(240,235,220,0.2)",
        padding: 16,
      }}
    >
      <div className="mb-3 flex items-baseline gap-3">
        <span
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 11,
            letterSpacing: "0.3em",
            fontWeight: 800,
            color: "#F7C234",
          }}
        >
          {tag}
        </span>
        <span
          style={{
            fontFamily: "var(--font-tattoo), sans-serif",
            fontSize: 22,
            color: "#f0ebdc",
            letterSpacing: "0.02em",
          }}
        >
          {title}
        </span>
      </div>
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "9 / 16",
          maxWidth: 320,
          margin: "0 auto",
          background: bg,
          border: "3px solid #1a1a1a",
          borderRadius: 14,
          overflow: "hidden",
          boxShadow: "6px 6px 0 rgba(26,26,26,0.4)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function IGIcon({
  size = 38,
  color = "rgba(255,255,255,0.55)",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden>
      <path d={IG_SVG_PATH} />
    </svg>
  );
}

function MenuVariantA() {
  const items = [
    { jp: "作家", en: "ABOUT", tr: "sakka — artist / maker" },
    { jp: "店", en: "SHOP", tr: "mise — shop / store" },
    { jp: "質問", en: "FAQ", tr: "shitsumon — questions" },
    { jp: "連絡", en: "CONTACT", tr: "renraku — contact / get in touch" },
  ];
  return (
    <PhoneFrame tag="A" title="JP LABEL">
      <div className="flex h-full w-full flex-col items-center justify-center gap-6 px-6">
        {items.map((item) => (
          <div key={item.en} className="flex flex-col items-center">
            <span
              title={item.tr}
              style={{
                fontFamily: "var(--font-jp), var(--font-tattoo), sans-serif",
                fontSize: 44,
                color: "rgba(255,255,255,0.92)",
                lineHeight: 1,
                letterSpacing: "0.04em",
                textDecoration: "underline dotted",
                textDecorationColor: "rgba(247,194,52,0.35)",
                textUnderlineOffset: 6,
              }}
            >
              {item.jp}
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 10,
                letterSpacing: "0.32em",
                fontWeight: 800,
                color: "rgba(255,255,255,0.5)",
                marginTop: 4,
              }}
            >
              {item.en}
            </span>
          </div>
        ))}
        <div className="mt-4">
          <IGIcon />
        </div>
      </div>
    </PhoneFrame>
  );
}

function MenuVariantB() {
  const items = ["ABOUT", "SHOP", "FAQ", "CONTACT"];
  return (
    <PhoneFrame tag="B" title="NUMBERED STAGES">
      <div className="flex h-full w-full flex-col items-stretch justify-center gap-4 px-8">
        {items.map((label, i) => (
          <div
            key={label}
            className="flex items-baseline gap-4"
            style={{ borderBottom: "1px solid rgba(215,50,46,0.4)", paddingBottom: 8 }}
          >
            <span
              style={{
                fontFamily: "var(--font-tattoo), sans-serif",
                fontSize: 34,
                color: "var(--color-crimson)",
                lineHeight: 1,
                minWidth: 44,
              }}
            >
              0{i + 1}
            </span>
            <span
              style={{
                fontFamily: "var(--font-tattoo), sans-serif",
                fontSize: 38,
                color: "rgba(255,255,255,0.92)",
                lineHeight: 1,
                letterSpacing: "0.02em",
                flex: 1,
              }}
            >
              {label}
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 11,
                color: "rgba(255,255,255,0.4)",
              }}
            >
              →
            </span>
          </div>
        ))}
        <div className="mt-4 flex justify-center">
          <IGIcon size={32} />
        </div>
      </div>
    </PhoneFrame>
  );
}

function MenuVariantC() {
  const items = [
    { en: "ABOUT", jp: "作家", bg: "#d7322e", rot: -2 },
    { en: "SHOP", jp: "店", bg: "#2b5dae", rot: 2 },
    { en: "FAQ", jp: "質問", bg: "#5baa4f", rot: 1.5 },
    { en: "CONTACT", jp: "連絡", bg: "#f7c234", rot: -1.5 },
  ];
  return (
    <PhoneFrame tag="C" title="STAMP GRID">
      <div className="flex h-full w-full flex-col items-center justify-center gap-6 px-5">
        <div
          className="grid w-full"
          style={{
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
          }}
        >
          {items.map((item) => (
            <div
              key={item.en}
              style={{
                position: "relative",
                aspectRatio: "1 / 1",
                background: item.bg,
                border: "3px solid #1a1a1a",
                boxShadow: "4px 4px 0 #1a1a1a",
                transform: `rotate(${item.rot}deg)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  fontFamily: "var(--font-jp), var(--font-tattoo), sans-serif",
                  fontSize: 96,
                  color: "rgba(26,26,26,0.22)",
                  lineHeight: 1,
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -54%)",
                }}
              >
                {item.jp}
              </span>
              <span
                style={{
                  position: "relative",
                  fontFamily: "var(--font-tattoo), sans-serif",
                  fontSize: 22,
                  color: item.bg === "#f7c234" ? "var(--color-ink)" : "var(--color-paper)",
                  letterSpacing: "0.04em",
                  lineHeight: 1,
                }}
              >
                {item.en}
              </span>
            </div>
          ))}
        </div>
        <IGIcon size={32} />
      </div>
    </PhoneFrame>
  );
}

function MenuVariantD() {
  const items = [
    { en: "ABOUT", sub: "the artist", rot: -1.5 },
    { en: "SHOP", sub: "the prints", rot: 1 },
    { en: "FAQ", sub: "the questions", rot: -0.8 },
    { en: "CONTACT", sub: "reach out", rot: 1.2 },
  ];
  return (
    <PhoneFrame tag="D" title="TAPED INDEX CARDS" bg="#1a1a1e">
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 px-6">
        {items.map((item, i) => (
          <div
            key={item.en}
            style={{
              position: "relative",
              width: "100%",
              background: "#fffef8",
              padding: "14px 18px",
              border: "1px solid rgba(26,26,26,0.25)",
              boxShadow: "3px 4px 10px rgba(0,0,0,0.4)",
              transform: `rotate(${item.rot}deg)`,
            }}
          >
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: -8,
                left: "50%",
                transform: `translateX(-50%) rotate(${i % 2 === 0 ? -3 : 3}deg)`,
                width: 80,
                height: 14,
                background: "rgba(247,194,52,0.6)",
                border: "1px solid rgba(26,26,26,0.28)",
              }}
            />
            <div className="flex items-baseline justify-between gap-3">
              <span
                style={{
                  fontFamily: "var(--font-tattoo), sans-serif",
                  fontSize: 28,
                  color: "var(--color-ink)",
                  lineHeight: 1,
                  letterSpacing: "0.02em",
                }}
              >
                {item.en}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-display), serif",
                  fontStyle: "italic",
                  fontSize: 13,
                  color: "rgba(26,26,26,0.55)",
                }}
              >
                {item.sub} →
              </span>
            </div>
          </div>
        ))}
        <div className="mt-2">
          <IGIcon size={30} />
        </div>
      </div>
    </PhoneFrame>
  );
}

function V08MenuVariants() {
  return (
    <section>
      <VariantLabel
        num="08"
        name="MENU VARIANTS"
        desc="Four full visual previews of the MobileMenu rework. Each mock is rendered inside a phone-frame so the treatment reads at real size. Same items everywhere (ABOUT / SHOP / FAQ / CONTACT + IG) — four different visual treatments. Pick a letter and I promote it."
        bestIf="Pick the menu visual direction."
      />
      <div
        className="mx-auto max-w-6xl px-7 pb-16 sm:px-10"
        style={{
          display: "grid",
          gap: 24,
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        }}
      >
        <MenuVariantA />
        <MenuVariantB />
        <MenuVariantC />
        <MenuVariantD />
      </div>
    </section>
  );
}
