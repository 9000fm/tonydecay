"use client";

import Link from "next/link";
import { useState } from "react";
import { QuoteStripInset } from "@/components/hero-quote/QuoteStripInset";
import { QuoteStripSvgL } from "@/components/hero-quote/QuoteStripSvgL";
import { QuoteStripMidEdge } from "@/components/hero-quote/QuoteStripMidEdge";
import { QuoteStripStamp } from "@/components/hero-quote/QuoteStripStamp";
import { QuoteStripBare } from "@/components/hero-quote/QuoteStripBare";

type Variant = "Q1" | "Q2" | "Q3" | "Q4" | "Q5";

const VARIANTS: {
  id: Variant;
  name: string;
  blurb: string;
  chip: string;
}[] = [
  {
    id: "Q1",
    name: "INSET",
    blurb:
      "Small gold Unicode 「 」 hugging the paragraph inline, tight against text, sized to match the italic serif. Two brackets only.",
    chip: "#F7C234",
  },
  {
    id: "Q2",
    name: "TINY L",
    blurb:
      "Two tiny 14px gold SVG L-brackets at the top-left + bottom-right corners of the text column. Thin stroke, nothing overpowering.",
    chip: "#E3A81F",
  },
  {
    id: "Q3",
    name: "MID-EDGE",
    blurb:
      "Two big 「 」 brackets at the vertical center of the strip, one per side, framing the quote like massive pull-quote marks.",
    chip: "#FFD55A",
  },
  {
    id: "Q4",
    name: "STAMP CHIP",
    blurb:
      "Bracket glyphs each sit inside a 30×30 gold-outlined square chip flanking the text. Reads like a stamped label, not floating type.",
    chip: "#2B5DAE",
  },
  {
    id: "Q5",
    name: "BARE",
    blurb:
      "No brackets at all. Leading gold GLOBAL pill tag + trailing signature. Cleanest read, relies on the blue frame alone.",
    chip: "#F5ECCE",
  },
];

export default function LabQuoteStripPage() {
  const [variant, setVariant] = useState<Variant>("Q1");
  const active = VARIANTS.find((v) => v.id === variant)!;

  return (
    <main style={{ background: "#0a0a0a", color: "#f0ebdc", minHeight: "100vh" }}>
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
            LAB / QUOTE STRIP · 2-bracket takes · 5 variants
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-10 sm:px-10 sm:py-14">
        <div
          className="mb-8 flex flex-wrap gap-2"
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.22em",
            fontWeight: 800,
          }}
        >
          {VARIANTS.map((v) => {
            const on = v.id === variant;
            return (
              <button
                key={v.id}
                onClick={() => setVariant(v.id)}
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

        <div
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 11,
            letterSpacing: "0.32em",
            fontWeight: 800,
            color: "rgba(240,235,220,0.55)",
            marginBottom: 10,
          }}
        >
          {active.id} &nbsp;·&nbsp; {active.name}
        </div>
        <p
          style={{
            fontFamily: "var(--font-display), serif",
            fontSize: 16,
            lineHeight: 1.55,
            color: "rgba(240,235,220,0.82)",
            maxWidth: 680,
          }}
        >
          {active.blurb}
        </p>

        {/* Mobile preview (390px) */}
        <div
          className="mt-10"
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.32em",
            fontWeight: 800,
            color: "rgba(240,235,220,0.5)",
            marginBottom: 10,
          }}
        >
          MOBILE · 390px
        </div>
        <div
          style={{
            width: "100%",
            maxWidth: 390,
            background: "#ECE4D0",
            border: "1px solid rgba(240,235,220,0.25)",
            padding: "24px 20px",
          }}
        >
          {variant === "Q1" && <QuoteStripInset />}
          {variant === "Q2" && <QuoteStripSvgL />}
          {variant === "Q3" && <QuoteStripMidEdge />}
          {variant === "Q4" && <QuoteStripStamp />}
          {variant === "Q5" && <QuoteStripBare />}
        </div>

        {/* Desktop preview (~860px) */}
        <div
          className="mt-12"
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.32em",
            fontWeight: 800,
            color: "rgba(240,235,220,0.5)",
            marginBottom: 10,
          }}
        >
          DESKTOP · 880px
        </div>
        <div
          style={{
            width: "100%",
            maxWidth: 880,
            background: "#ECE4D0",
            border: "1px solid rgba(240,235,220,0.25)",
            padding: "28px",
          }}
        >
          {variant === "Q1" && <QuoteStripInset />}
          {variant === "Q2" && <QuoteStripSvgL />}
          {variant === "Q3" && <QuoteStripMidEdge />}
          {variant === "Q4" && <QuoteStripStamp />}
          {variant === "Q5" && <QuoteStripBare />}
        </div>
      </section>
    </main>
  );
}
