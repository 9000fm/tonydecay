"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PLACEHOLDER_PRINTS } from "@/lib/constants";

const INK = "#1a1a1a";
const PAPER = "#f0ebdc";
const GOLD = "#F7C234";
const ROYAL = "#2b5dae";
const CRIMSON = "#d7322e";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/* MAGAZINE PAGE-FLIP — three pages stacked. Pinned container scrubs
   each page from rotateY(0) → rotateY(-170°) around its right edge,
   like a magazine page being turned. Page below is revealed.
   Mobile fallback: pages slide up instead (no perspective). */

const PAGES = [
  {
    eyebrow: "PAGE 01",
    title: "HERO",
    subtitle: "splash · paper · the name",
    body: "Tony Decay Collection Vol. 01 starts with a hand-letter title and one cream paper plane. No splash counter, no fake urgency.",
    bg: PAPER,
    fg: INK,
    accent: CRIMSON,
    image: PLACEHOLDER_PRINTS[0].src,
  },
  {
    eyebrow: "PAGE 02",
    title: "GALLERY",
    subtitle: "the 15 prints · arcade tabs",
    body: "All fifteen prints from the volume. Edge tabs, kanji stamps, click for fullscreen. The art is the page.",
    bg: ROYAL,
    fg: PAPER,
    accent: GOLD,
    image: PLACEHOLDER_PRINTS[6].src,
  },
  {
    eyebrow: "PAGE 03",
    title: "ARTIST",
    subtitle: "Tony · process · marks",
    body: "Sugimori-grade hand-letters from a Lima studio. Pokemon and tattoo flash sit at the same dinner table here.",
    bg: CRIMSON,
    fg: PAPER,
    accent: GOLD,
    image: PLACEHOLDER_PRINTS[10].src,
  },
];

export default function LabPageFlipPage() {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const pages = Array.from(stage.querySelectorAll<HTMLElement>("[data-page]"));
    if (!pages.length) return;

    const isMobile = window.matchMedia("(max-width: 640px)").matches;
    const triggers: ScrollTrigger[] = [];

    /* Container is pinned for `pages.length * 100vh` of scroll.
       Each page consumes one vh of scroll for its flip. */
    const totalScroll = pages.length;

    /* All pages start flat, stacked top-to-bottom in z-order so 1 covers 2 covers 3. */
    pages.forEach((p, i) => {
      gsap.set(p, {
        zIndex: pages.length - i,
        rotateY: 0,
        rotateZ: 0,
        y: 0,
        opacity: 1,
        force3D: true,
      });
    });

    /* Pin the stage. */
    const pinTrigger = ScrollTrigger.create({
      trigger: stage,
      start: "top top",
      end: () => `+=${window.innerHeight * totalScroll}`,
      pin: true,
      scrub: 0.4,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    });
    triggers.push(pinTrigger);

    /* One scrub timeline per page. Don't flip the LAST page (it's the
       final visible state). */
    pages.slice(0, -1).forEach((page, i) => {
      const segStart = i / totalScroll;
      const segEnd = (i + 1) / totalScroll;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: () => `top+=${window.innerHeight * i} top`,
          end: () => `top+=${window.innerHeight * (i + 1)} top`,
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      });

      if (isMobile) {
        /* Mobile: pages slide up out of the way, no perspective flip. */
        tl.fromTo(page, { y: 0 }, { y: "-100%", ease: "power2.in" });
      } else {
        /* Desktop: rotateY around right edge with a tiny rotateZ tilt
           to imply the bottom-right corner curling first. */
        tl.fromTo(
          page,
          { rotateY: 0, rotateZ: 0 },
          { rotateY: -170, rotateZ: -3, ease: "power2.in" },
        );
      }
      triggers.push(tl.scrollTrigger as ScrollTrigger);
      // segStart, segEnd reserved for future use
      void segStart;
      void segEnd;
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("resize", refresh);

    return () => {
      triggers.forEach((t) => t.kill());
      window.removeEventListener("resize", refresh);
    };
  }, []);

  return (
    <main style={{ background: "#0a0a0a", color: PAPER, minHeight: "100vh" }}>
      <header
        className="sticky top-0 z-50 w-full"
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
            LAB / MAGAZINE PAGE-FLIP · 3 pages · scroll-pinned
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
          PAGE
          <br />
          <span style={{ color: GOLD }}>FLIP</span>
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
          Scroll. Each page flips around its right edge to reveal the next, like a magazine spread
          mid-turn.
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

      {/* STAGE */}
      <div
        ref={stageRef}
        style={{
          position: "relative",
          height: "100svh",
          overflow: "hidden",
          perspective: 1600,
          background: "#0a0a0a",
        }}
      >
        {PAGES.map((p, i) => (
          <article
            key={p.title}
            data-page
            style={{
              position: "absolute",
              inset: 0,
              transformOrigin: "100% 50%",
              backfaceVisibility: "hidden",
              willChange: "transform",
              background: p.bg,
              color: p.fg,
              borderLeft: `2px solid ${INK}`,
              borderRight: `2px solid ${INK}`,
              boxShadow: "0 30px 60px rgba(0,0,0,0.45)",
              padding: "clamp(28px, 5vw, 64px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              overflow: "hidden",
            }}
          >
            {/* Top */}
            <div className="flex items-start justify-between gap-6">
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: 10,
                    letterSpacing: "0.4em",
                    fontWeight: 800,
                    color: p.fg,
                    opacity: 0.6,
                  }}
                >
                  {p.eyebrow} · TONY DECAY VOL.01
                </div>
                <h2
                  className="mt-2"
                  style={{
                    fontFamily: "var(--font-tattoo), sans-serif",
                    fontSize: "clamp(3rem, 12vw, 8rem)",
                    color: p.fg,
                    lineHeight: 0.85,
                  }}
                >
                  {p.title}
                </h2>
                <div
                  className="mt-2"
                  style={{
                    fontFamily: "var(--font-display), serif",
                    fontStyle: "italic",
                    fontSize: 16,
                    color: p.fg,
                    opacity: 0.78,
                  }}
                >
                  {p.subtitle}
                </div>
              </div>
              <div
                style={{
                  fontFamily: "var(--font-arcade), sans-serif",
                  fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
                  color: p.accent,
                  letterSpacing: "0.04em",
                  textShadow: `2px 2px 0 ${p.fg}`,
                  whiteSpace: "nowrap",
                }}
              >
                N°{String(i + 1).padStart(2, "0")}
              </div>
            </div>

            {/* Image plate */}
            <div
              className="relative mx-auto my-6 w-full max-w-md"
              style={{
                aspectRatio: "1 / 1",
                background: "#ECE4D0",
                border: `2px solid ${INK}`,
                boxShadow: "6px 6px 0 #1a1a1a",
                position: "relative",
                flex: "0 0 auto",
              }}
            >
              <Image
                src={p.image}
                alt={p.title}
                fill
                sizes="(max-width: 640px) 90vw, 480px"
                style={{ objectFit: "cover" }}
              />
            </div>

            {/* Bottom */}
            <div className="flex items-end justify-between gap-6">
              <p
                className="max-w-md"
                style={{
                  fontFamily: "var(--font-display), serif",
                  fontStyle: "italic",
                  fontSize: "clamp(15px, 1.6vw, 18px)",
                  lineHeight: 1.5,
                  color: p.fg,
                  opacity: 0.88,
                }}
              >
                {p.body}
              </p>
              <div
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 10,
                  letterSpacing: "0.32em",
                  fontWeight: 800,
                  color: p.fg,
                  opacity: 0.55,
                  whiteSpace: "nowrap",
                }}
              >
                {String(i + 1).padStart(2, "0")} / {String(PAGES.length).padStart(2, "0")}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* AFTER */}
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
          AFTER FLIP / scroll continues normally
        </p>
      </section>
    </main>
  );
}
