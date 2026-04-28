"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { PLACEHOLDER_PRINTS } from "@/lib/constants";

const INK = "#1a1a1a";
const PAPER = "#f0ebdc";
const GOLD = "#F7C234";
const CRIMSON = "#d7322e";

/* N° INDEX RAIL — sticky vertical column of N°01–N°15 gold pixel tabs.
   Active state driven by IntersectionObserver. Click jumps to the print.
   Mobile: fixed bottom horizontal pill that scrolls itself to keep the
   active tab in view. */

const PRINTS = PLACEHOLDER_PRINTS;

function usePrintsObserver(els: HTMLDivElement[]) {
  const [activeIdx, setActiveIdx] = useState(0);
  useEffect(() => {
    if (!els.length) return;
    const visible = new Map<Element, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.set(e.target, e.intersectionRatio);
          else visible.delete(e.target);
        }
        if (!visible.size) return;
        let bestEl: Element | null = null;
        let bestRatio = -1;
        for (const [el, ratio] of visible) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestEl = el;
          }
        }
        if (bestEl) {
          const idx = els.findIndex((n) => n === bestEl);
          if (idx >= 0) setActiveIdx(idx);
        }
      },
      { threshold: [0.25, 0.5, 0.75], rootMargin: "-20% 0px -20% 0px" },
    );
    els.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [els]);
  return activeIdx;
}

function DesktopRail({ activeIdx }: { activeIdx: number }) {
  const onJump = (i: number) => {
    document.getElementById(`print-${i}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  return (
    <aside
      className="pointer-events-none fixed top-1/2 left-4 z-50 hidden -translate-y-1/2 sm:block"
      aria-label="Print index"
    >
      <ul
        className="pointer-events-auto flex flex-col gap-1"
        style={{
          fontFamily: "var(--font-arcade), sans-serif",
          fontSize: 13,
          letterSpacing: "0.06em",
        }}
      >
        {PRINTS.map((_, i) => {
          const on = i === activeIdx;
          return (
            <li key={i}>
              <button
                onClick={() => onJump(i)}
                aria-label={`Jump to print ${i + 1}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "4px 10px",
                  background: on ? GOLD : "rgba(240,235,220,0.06)",
                  color: on ? INK : "rgba(240,235,220,0.55)",
                  border: `1px solid ${on ? INK : "rgba(240,235,220,0.18)"}`,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: "inherit",
                  letterSpacing: "inherit",
                  fontWeight: 800,
                  lineHeight: 1,
                  boxShadow: on ? "3px 3px 0 #1a1a1a" : "none",
                  transform: on ? "translateX(6px)" : "translateX(0)",
                  transition: "transform 180ms ease, background 180ms ease, color 180ms ease",
                  minWidth: 64,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    background: on ? CRIMSON : "rgba(240,235,220,0.3)",
                  }}
                />
                N°{String(i + 1).padStart(2, "0")}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

function MobilePill({ activeIdx }: { activeIdx: number }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sc = scrollerRef.current;
    if (!sc) return;
    const tab = sc.querySelector<HTMLElement>(`[data-tab="${activeIdx}"]`);
    if (tab) {
      const targetLeft = tab.offsetLeft - sc.clientWidth / 2 + tab.clientWidth / 2;
      sc.scrollTo({ left: targetLeft, behavior: "smooth" });
    }
  }, [activeIdx]);

  const onJump = (i: number) => {
    document.getElementById(`print-${i}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <nav
      className="fixed right-0 bottom-0 left-0 z-50 sm:hidden"
      style={{
        background: "rgba(10,10,10,0.92)",
        borderTop: "1px solid rgba(240,235,220,0.2)",
        backdropFilter: "blur(6px)",
      }}
      aria-label="Print index"
    >
      <div
        ref={scrollerRef}
        className="flex gap-2 overflow-x-auto px-3 py-3"
        style={{
          fontFamily: "var(--font-arcade), sans-serif",
          fontSize: 12,
          letterSpacing: "0.06em",
          scrollbarWidth: "none",
        }}
      >
        {PRINTS.map((_, i) => {
          const on = i === activeIdx;
          return (
            <button
              key={i}
              data-tab={i}
              onClick={() => onJump(i)}
              aria-label={`Jump to print ${i + 1}`}
              style={{
                flexShrink: 0,
                padding: "6px 10px",
                background: on ? GOLD : "transparent",
                color: on ? INK : "rgba(240,235,220,0.6)",
                border: `1px solid ${on ? INK : "rgba(240,235,220,0.22)"}`,
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: "inherit",
                letterSpacing: "inherit",
                fontWeight: 800,
                lineHeight: 1,
                boxShadow: on ? "2px 2px 0 #1a1a1a" : "none",
                whiteSpace: "nowrap",
              }}
            >
              N°{String(i + 1).padStart(2, "0")}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default function LabIndexRailPage() {
  const itemsRef = useRef<HTMLDivElement[]>([]);
  const [items, setItems] = useState<HTMLDivElement[]>([]);
  const setItem = useCallback((el: HTMLDivElement | null) => {
    if (!el) return;
    if (itemsRef.current.includes(el)) return;
    itemsRef.current.push(el);
    if (itemsRef.current.length === PRINTS.length) {
      setItems([...itemsRef.current]);
    }
  }, []);
  const activeIdx = usePrintsObserver(items);

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
            LAB / N° INDEX RAIL · sticky mini-map · {activeIdx + 1}/{PRINTS.length}
          </span>
        </div>
      </header>

      <DesktopRail activeIdx={activeIdx} />
      <MobilePill activeIdx={activeIdx} />

      <section className="mx-auto max-w-3xl px-6 py-16 sm:px-10">
        <div
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.4em",
            fontWeight: 800,
            color: "rgba(240,235,220,0.6)",
          }}
        >
          INTRO
        </div>
        <h1
          className="mt-2"
          style={{
            fontFamily: "var(--font-tattoo), sans-serif",
            fontSize: "clamp(2.4rem, 7vw, 4.5rem)",
            color: PAPER,
            lineHeight: 0.95,
            letterSpacing: "0.01em",
          }}
        >
          INDEX RAIL
          <br />
          <span style={{ color: GOLD }}>N°01 → N°15</span>
        </h1>
        <p
          className="mt-5 max-w-md"
          style={{
            fontFamily: "var(--font-display), serif",
            fontStyle: "italic",
            fontSize: 16,
            lineHeight: 1.55,
            color: "rgba(240,235,220,0.78)",
          }}
        >
          Sticky vertical index on desktop, fixed horizontal pill on mobile. Highlights the print
          you&rsquo;re looking at, click to jump.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-32 sm:px-10">
        {PRINTS.map((p, i) => (
          <div
            key={p.id}
            id={`print-${i}`}
            ref={setItem}
            className="mb-20"
            style={{ scrollMarginTop: 80 }}
          >
            <div className="mb-3 flex items-baseline gap-3">
              <span
                style={{
                  fontFamily: "var(--font-arcade), sans-serif",
                  fontSize: 22,
                  color: GOLD,
                  letterSpacing: "0.05em",
                }}
              >
                N°{String(i + 1).padStart(2, "0")}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 10,
                  letterSpacing: "0.32em",
                  fontWeight: 800,
                  color: "rgba(240,235,220,0.45)",
                }}
              >
                / {PRINTS.length}
              </span>
            </div>

            <div
              style={{
                position: "relative",
                aspectRatio: "1 / 1",
                background: "#ECE4D0",
                border: `1px solid rgba(240,235,220,0.2)`,
                overflow: "hidden",
              }}
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="(max-width: 640px) 100vw, 720px"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
        ))}
      </section>

      <footer
        className="mx-auto max-w-3xl px-6 pt-10 pb-40 sm:px-10 sm:pb-32"
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
          END / SCROLL UP TO RE-CHECK THE RAIL
        </p>
      </footer>
    </main>
  );
}
