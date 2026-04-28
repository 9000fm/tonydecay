"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const INK = "#1a1a1a";
const PAPER = "#f0ebdc";
const GOLD = "#F7C234";
const CRIMSON = "#d7322e";
const ROYAL = "#2b5dae";
const TEAL = "#3cb5b5";
const LEAF = "#5baa4f";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/* STACKED SECTION ANCHORS — each card pinned via ScrollTrigger with
   pinSpacing:false. The next card enters from below and lifts the
   current one off the top edge as scroll continues — true "push" not
   "cover". Robust to viewport changes via ScrollTrigger.refresh on
   ResizeObserver. */

type AnchorCard = {
  num: string;
  title: string;
  subtitle: string;
  body: string;
  bg: string;
  fg: string;
  accent: string;
};

const CARDS: AnchorCard[] = [
  {
    num: "N°01",
    title: "HERO",
    subtitle: "Splash · gallery bloom · audio",
    body: "Tony's name lands first. Cream paper, gold accents, a single hand-letter title set in Anton. Splash counter is gone — replaced by a single tap-to-enter beat.",
    bg: PAPER,
    fg: INK,
    accent: CRIMSON,
  },
  {
    num: "N°02",
    title: "GALLERY",
    subtitle: "15 prints · arcade tabs",
    body: "All 15 prints from Tony Decay Collection Vol. 01 — fanned out, edge-tabbed, each one numbered. Click for fullscreen reveal (see /lab/pixel-gallery).",
    bg: ROYAL,
    fg: PAPER,
    accent: GOLD,
  },
  {
    num: "N°03",
    title: "PRODUCT",
    subtitle: "$300 · all-in · 100 sets",
    body: "What you actually buy: pack of 15, signed, numbered, shipped worldwide. No hidden fees. One price tag, big and honest.",
    bg: GOLD,
    fg: INK,
    accent: CRIMSON,
  },
  {
    num: "N°04",
    title: "ARTIST",
    subtitle: "About Tony · process · marks",
    body: "The maker behind the prints. Hand-letter typography, Sugimori-inspired Pokémon energy, Lima-grown tattoo flash heritage.",
    bg: CRIMSON,
    fg: PAPER,
    accent: GOLD,
  },
  {
    num: "N°05",
    title: "FAQ",
    subtitle: "Letters · format · shipping",
    body: "What people actually ask. Editorial format, two columns, no fake urgency. Answers feel like Tony wrote them — because he did.",
    bg: TEAL,
    fg: INK,
    accent: CRIMSON,
  },
  {
    num: "N°06",
    title: "CONTACT",
    subtitle: "Reach Tony · ship me a letter",
    body: "Soft close. Email + IG. No popup. No newsletter coercion. The site ends quiet, the way good things do.",
    bg: LEAF,
    fg: INK,
    accent: PAPER,
  },
];

export default function LabStackedAnchorsPage() {
  const stackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stack = stackRef.current;
    if (!stack) return;
    const cards = Array.from(stack.querySelectorAll<HTMLElement>("[data-card]"));
    if (!cards.length) return;

    const triggers: ScrollTrigger[] = [];

    cards.forEach((card, i) => {
      const next = cards[i + 1];
      const t = ScrollTrigger.create({
        trigger: card,
        start: "top top",
        endTrigger: next ?? card,
        end: next ? "top top" : "bottom top",
        pin: true,
        pinSpacing: false,
        invalidateOnRefresh: true,
      });
      triggers.push(t);
    });

    const ro = new ResizeObserver(() => ScrollTrigger.refresh());
    ro.observe(document.body);

    return () => {
      triggers.forEach((t) => t.kill());
      ro.disconnect();
    };
  }, []);

  return (
    <main style={{ background: "#0a0a0a", color: PAPER, minHeight: "100vh" }}>
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
              color: GOLD,
              textDecoration: "none",
              padding: "4px 10px",
              border: `1px solid ${GOLD}`,
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
            LAB / STACKED ANCHORS · push · scrub
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-14 sm:px-10">
        <h1
          style={{
            fontFamily: "var(--font-tattoo), sans-serif",
            fontSize: "clamp(2.4rem, 7vw, 4.5rem)",
            color: PAPER,
            lineHeight: 0.95,
          }}
        >
          STACKED
          <br />
          <span style={{ color: GOLD }}>ANCHORS</span>
        </h1>
        <p
          className="mt-4 max-w-md"
          style={{
            fontFamily: "var(--font-display), serif",
            fontStyle: "italic",
            fontSize: 16,
            lineHeight: 1.55,
            color: "rgba(240,235,220,0.78)",
          }}
        >
          Each card pins at the top, the next one pushes it up. Try resizing the window mid-scroll —
          it should still line up.
        </p>
        <p
          className="mt-6"
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.32em",
            fontWeight: 800,
            color: GOLD,
          }}
        >
          ↓ KEEP SCROLLING
        </p>
      </section>

      {/* THE STACK */}
      <div ref={stackRef} style={{ position: "relative" }}>
        {CARDS.map((c, i) => (
          <section
            key={c.num}
            data-card
            style={{
              position: "relative",
              minHeight: "100svh",
              height: "100svh",
              background: c.bg,
              color: c.fg,
              borderTop: `2px solid ${INK}`,
              padding: "clamp(28px, 5vw, 64px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              overflow: "hidden",
              zIndex: i + 1,
            }}
          >
            {/* Top row: index + title */}
            <div className="flex items-start justify-between gap-6">
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: 11,
                    letterSpacing: "0.4em",
                    fontWeight: 800,
                    color: c.fg,
                    opacity: 0.6,
                  }}
                >
                  TONY DECAY / ANCHOR
                </div>
                <h2
                  className="mt-2"
                  style={{
                    fontFamily: "var(--font-tattoo), sans-serif",
                    fontSize: "clamp(4rem, 14vw, 9rem)",
                    color: c.fg,
                    lineHeight: 0.85,
                    letterSpacing: "0.005em",
                  }}
                >
                  {c.title}
                </h2>
                <div
                  className="mt-2"
                  style={{
                    fontFamily: "var(--font-display), serif",
                    fontStyle: "italic",
                    fontSize: 17,
                    color: c.fg,
                    opacity: 0.78,
                  }}
                >
                  {c.subtitle}
                </div>
              </div>
              <div
                style={{
                  fontFamily: "var(--font-arcade), sans-serif",
                  fontSize: "clamp(2rem, 5vw, 3rem)",
                  color: c.accent,
                  letterSpacing: "0.04em",
                  textShadow: `2px 2px 0 ${c.fg}`,
                  whiteSpace: "nowrap",
                }}
              >
                {c.num}
              </div>
            </div>

            {/* Bottom row: body + footer */}
            <div className="flex items-end justify-between gap-6">
              <p
                className="max-w-md"
                style={{
                  fontFamily: "var(--font-display), serif",
                  fontStyle: "italic",
                  fontSize: "clamp(15px, 1.6vw, 19px)",
                  lineHeight: 1.5,
                  color: c.fg,
                  opacity: 0.88,
                }}
              >
                {c.body}
              </p>
              <span
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 10,
                  letterSpacing: "0.32em",
                  fontWeight: 800,
                  color: c.fg,
                  opacity: 0.55,
                  whiteSpace: "nowrap",
                }}
              >
                {String(i + 1).padStart(2, "0")} / {String(CARDS.length).padStart(2, "0")}
              </span>
            </div>
          </section>
        ))}
      </div>

      {/* AFTER STACK */}
      <section
        className="mx-auto max-w-3xl px-6 py-24 sm:px-10"
        style={{ borderTop: "1px dashed rgba(240,235,220,0.25)" }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.32em",
            fontWeight: 800,
            color: "rgba(240,235,220,0.5)",
          }}
        >
          STACK COMPLETE / regular flow resumes here
        </p>
      </section>
    </main>
  );
}
