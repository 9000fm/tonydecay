"use client";

import { useEffect, useRef, useState } from "react";

interface SplashScreenProps {
  onEnter: () => void;
}

/* Splash flow:
   1. Dark ink bg
   2. Firma logo fades in (~1.1s)
   3. Cold terminal prompt "ENTER _" appears bottom-center (~2s)
   4. Splash WAITS for user input — click / tap / Enter / Space
   5. Random Pokemon-era pixel mask fires:
      - Phase A: cover screen black
      - Mid-transition: hide logo + prompt, make container transparent,
        call onEnter() so the hero mounts BEHIND the mask
      - Phase B: mask animates out, revealing the hero progressively
   6. After mask gone, splash is removed entirely

   Splash shows AT MOST ONCE per calendar day (local timezone) via
   localStorage key "td-splash-day". To re-show for testing:
   localStorage.removeItem("td-splash-day"); location.reload(); */

type Transition = "pixelgrid" | "staircase" | "checker" | "spiral";

/* ---------- Once-per-day gating ---------- */

function todayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function shouldShowSplash(): boolean {
  if (typeof window === "undefined") return true; // SSR — render
  try {
    return localStorage.getItem("td-splash-day") !== todayKey();
  } catch {
    return true; // private mode etc — always show
  }
}

export function markSplashShown() {
  try {
    localStorage.setItem("td-splash-day", todayKey());
  } catch {
    /* ignore */
  }
}

/* ---------- Variation 5b: Game Boy prompt (inlined into JSX) ---------- */
/* The prompt is now rendered inline as direct flex children of the splash
   centered column so logo / text / arrow share even vertical gaps. The
   bouncing arrow uses splash-gb-bounce, hard steps(1), Pokemon Red/Blue
   menu-pointer cadence. */

/* ---------- Component ---------- */

export function SplashScreen({ onEnter }: SplashScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const onEnterRef = useRef(onEnter);
  const hasRun = useRef(false);
  const dismissed = useRef(false);

  useEffect(() => {
    onEnterRef.current = onEnter;
  }, [onEnter]);

  const [logoVisible, setLogoVisible] = useState(false);
  const [promptVisible, setPromptVisible] = useState(false);
  const [transitionRunning, setTransitionRunning] = useState(false);
  const [promptExiting, setPromptExiting] = useState(false);
  const [logoExiting, setLogoExiting] = useState(false);

  function fire() {
    if (dismissed.current) return;
    dismissed.current = true;

    // Click sequence (sharp snap, then pixel-grid dissolve):
    //   0ms     logo + text + arrow snap out together (140ms steps(2))
    //   200ms   splash bg goes transparent + pixel grid takes over as the
    //           cover, then dissolves cell-by-cell to reveal the page.
    setPromptExiting(true);
    setLogoExiting(true);

    window.setTimeout(() => {
      setTransitionRunning(true);
      runTransition(
        "pixelgrid",
        overlayRef.current,
        () => {
          // Phase A done — mask fully covers the screen. Make the splash
          // container transparent + restore scroll, but DO NOT call onEnter()
          // yet — that would unmount this component (page.tsx renders
          // SplashScreen behind a !splashDone gate) and kill the in-flight
          // Phase B retract animation. Hero is already in <main>, just hidden
          // behind the slabs which now sit on top of a transparent splash.
          const html = document.documentElement;
          html.style.overflow = "";
          document.body.style.overflow = "";
          const c = containerRef.current;
          if (c) {
            c.style.backgroundColor = "transparent";
            c.style.pointerEvents = "none";
          }
        },
        () => {
          // Phase B done — slabs fully retracted, hero visible. Now safe to
          // unmount: hide container, fire onEnter() (Lenis init, splashDone).
          const c = containerRef.current;
          if (c) c.style.display = "none";
          onEnterRef.current();
        },
      );
    }, 200);
  }

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    window.scrollTo(0, 0);
    const html = document.documentElement;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    // Brief-mode for return visits same day: logo appears fast, no
    // prompt is shown, splash auto-fires the pixel-grid dissolve. First
    // visit per day still gets the full TAP TO ENTER experience.
    const isBrief = !shouldShowSplash();
    const timers: number[] = [];
    if (isBrief) {
      timers.push(window.setTimeout(() => setLogoVisible(true), 700));
      timers.push(window.setTimeout(() => fire(), 1900));
    } else {
      timers.push(window.setTimeout(() => setLogoVisible(true), 1200));
      timers.push(window.setTimeout(() => setPromptVisible(true), 2400));
    }

    const onKey = (e: KeyboardEvent) => {
      if (dismissed.current) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        fire();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      timers.forEach((t) => clearTimeout(t));
      window.removeEventListener("keydown", onKey);
      html.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  // All three stack elements (logo, text, arrow) share these visibility
  // gates so they appear/exit independently while staying in a single
  // centered flex column for symmetric spacing.
  const logoShown = logoVisible && !logoExiting;
  const promptShown = promptVisible && !transitionRunning && !promptExiting;
  // Snap exit on click — game-like, sharp. 140ms in 2 hard steps.
  const exitTransition = "transform 140ms steps(2), opacity 140ms steps(2)";

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{
        touchAction: "none",
        backgroundColor: "var(--color-ink)",
        cursor: transitionRunning ? "default" : "pointer",
      }}
      onClick={() => fire()}
      onTouchMove={(e) => e.preventDefault()}
    >
      {/* Centered stack — logo / text / arrow with even 24px vertical gaps.
          Each element controls its own visibility + drop-out so the
          staggered click-exit still works, but layout stays symmetric. */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        }}
      >
        {/* Firma logo — pure WHITE on the ink bg. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/gallery/Firma.webp"
          alt="Tony Decay"
          className="h-20 w-auto object-contain sm:h-24"
          style={{
            filter: "brightness(0) invert(1)",
            opacity: logoShown ? 1 : 0,
            // +3px X compensates for the signature's visual mass sitting
            // slightly left of its geometric center.
            transform: logoExiting ? "translate(3px, 8px)" : "translate(3px, 0)",
            transition: exitTransition,
          }}
        />

        {/* "TAP TO ENTER" — mono caps, tracked. Entrance: clip-path L→R
            wipe (no fade). Exit: snap drop with steps(2). */}
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.32em",
            lineHeight: 1,
            color: "rgba(255,255,255,0.85)",
            clipPath: promptShown ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
            opacity: promptExiting ? 0 : 1,
            transform: promptExiting ? "translateY(8px)" : "translateY(0)",
            transition: `clip-path 720ms steps(12), ${exitTransition}`,
          }}
        >
          TAP TO ENTER
        </span>

        {/* Low-poly triangle. Two nested wrappers so entrance (scaleY snap)
            and exit (drop + opacity) don't fight on the transform property,
            and the inner SVG's bounce keyframe stays unaffected.
            -3px X offset compensates for triangle visual mass tilting right. */}
        <span
          aria-hidden
          style={{
            display: "inline-block",
            transformOrigin: "center top",
            transform: promptShown ? "scaleY(1)" : "scaleY(0)",
            transition: "transform 160ms steps(2) 800ms",
            marginLeft: -4,
          }}
        >
          <span
            style={{
              display: "inline-block",
              color: "rgba(255,255,255,0.85)",
              opacity: promptExiting ? 0 : 1,
              transform: promptExiting ? "translateY(8px)" : "translateY(0)",
              transition: exitTransition,
            }}
          >
            <svg
              width={14}
              height={10}
              viewBox="0 0 14 10"
              style={{
                shapeRendering: "crispEdges",
                animation: "splash-gb-bounce 720ms steps(1) infinite",
                display: "block",
              }}
            >
              <polygon points="0,0 14,0 7,10" fill="currentColor" />
            </svg>
          </span>
        </span>
      </div>

      {/* Transition overlay host — populated by runTransition() */}
      <div
        ref={overlayRef}
        className="pixel-edge pointer-events-none absolute inset-0"
        style={{ overflow: "hidden" }}
      />
    </div>
  );
}

/* ---------- Transitions ---------- */
/* Each variant runs an IN phase (cover the screen black) and an OUT phase
   (uncover). It calls onCovered() at the end of IN so the splash can hand
   off to the hero, then onComplete() at the end of OUT. */

function runTransition(
  kind: Transition,
  host: HTMLDivElement | null,
  onCovered: () => void,
  onComplete: () => void,
) {
  if (!host) {
    onCovered();
    onComplete();
    return;
  }
  host.innerHTML = "";
  const cleanup = () => {
    host.innerHTML = "";
    onComplete();
  };
  if (kind === "pixelgrid") return runPixelGrid(host, onCovered, cleanup);
  if (kind === "staircase") return runStaircase(host, onCovered, cleanup);
  if (kind === "checker") return runCheckerboard(host, onCovered, cleanup);
  return runSpiral(host, onCovered, cleanup);
}

/* PIXEL GRID — Pokemon-battle scale-shrink dissolve. The splash already
   covers the screen, so we plant a grid of LARGE dark cells inside the
   overlay, then shrink each cell to scale 0 (vanishing to a point) at a
   delay determined by the chosen pattern. All squares, only vertical or
   line-forming patterns. Six patterns, random per visit. */

type GridPattern = "chess" | "rowCurtain" | "lineSweep" | "columnSweep" | "twinSweep" | "stripBars";
const GRID_PATTERNS: GridPattern[] = [
  "chess",
  "rowCurtain",
  "lineSweep",
  "columnSweep",
  "twinSweep",
  "stripBars",
];

function runPixelGrid(host: HTMLDivElement, onCovered: () => void, done: () => void) {
  const CELL_PX = 76; // larger blocks for Game Boy battle feel
  const TOTAL_DUR = 1500; // total dissolve time (ms)

  const w = host.clientWidth || window.innerWidth;
  const h = host.clientHeight || window.innerHeight;
  const COLS = Math.max(5, Math.ceil(w / CELL_PX));
  const ROWS = Math.max(6, Math.ceil(h / CELL_PX));

  const cellW = 100 / COLS;
  const cellH = 100 / ROWS;
  const cells: HTMLDivElement[] = [];

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement("div");
      cell.style.cssText = `position:absolute;left:${c * cellW}%;top:${r * cellH}%;width:${cellW + 0.2}%;height:${cellH + 0.2}%;background:#1a1a1a;transform-origin:center center;`;
      host.appendChild(cell);
      cells.push(cell);
    }
  }

  // Hand the cover over: cells are now solid dark covering the viewport.
  void host.offsetHeight;
  onCovered();

  // Pick a random pattern this visit.
  const pattern = GRID_PATTERNS[Math.floor(Math.random() * GRID_PATTERNS.length)];

  // Chess uses scaleY (vertical squish) from top edge, 3 visible discrete
  // frames — Pokemon GBA blinds-shut feel. Other patterns use uniform
  // scale 1→0 from center with instant snap.
  const isChess = pattern === "chess";
  const cellTransition = isChess ? "transform 120ms steps(3)" : "transform 1ms steps(1)";

  cells.forEach((cell, idx) => {
    const r = Math.floor(idx / COLS);
    const c = idx % COLS;
    const t = patternDelay(pattern, r, c, COLS, ROWS); // 0..1
    const delay = t * TOTAL_DUR;
    if (isChess) {
      // Chess: flatten DOWNWARD — cell collapses to a horizontal line at
      // its BOTTOM edge (not top). Pokemon GBA blinds-shut direction.
      cell.style.transformOrigin = "center bottom";
    }
    cell.style.transition = `${cellTransition} ${delay}ms`;
    cell.style.transform = isChess ? "scaleY(0)" : "scale(0)";
  });

  // Wait for the longest possible cell to finish (delay + transition tail).
  const tail = isChess ? 180 : 60;
  window.setTimeout(done, TOTAL_DUR + tail);
}

/* Returns a normalized delay (0..1) for a cell at (r, c) given the
   chosen pattern. 0 = vanishes first; 1 = vanishes last. */
function patternDelay(
  pattern: GridPattern,
  r: number,
  c: number,
  COLS: number,
  ROWS: number,
): number {
  switch (pattern) {
    case "chess": {
      // Two-phase scaleY squish (Pokemon GBA closing). Even (r+c even)
      // cells flatten in 0–50% of duration; odd cells flatten in
      // 50–100%. Use a position-DECORRELATED hash for jitter so cells
      // inside a phase don't fire in a diagonal sweep (which read as
      // two big triangles filling top-left → bottom-right). XOR + bit
      // shuffling breaks the row/col correlation.
      const isEven = (r + c) % 2 === 0;
      let h = (r * 73856093) ^ (c * 19349663);
      h = (h ^ (h >>> 13)) >>> 0;
      h = (Math.imul(h, 0x5bd1e995) ^ (h >>> 15)) >>> 0;
      const noise = (h % 10000) / 10000;
      return (isEven ? 0.05 : 0.55) + noise * 0.18;
    }
    case "rowCurtain": {
      // Top-down row sweep with tiny within-row L→R drift.
      const rowPart = r / Math.max(1, ROWS - 1);
      const colPart = c / Math.max(1, COLS - 1);
      return rowPart * 0.85 + colPart * 0.15;
    }
    case "lineSweep": {
      // Vertical line crosses screen L→R; whole columns shrink together.
      return c / Math.max(1, COLS - 1);
    }
    case "columnSweep": {
      // Horizontal line crosses screen TOP→DOWN; whole rows shrink together.
      return r / Math.max(1, ROWS - 1);
    }
    case "twinSweep": {
      // Two vertical lines start at left + right edges, sweep INWARD,
      // meet in the middle. distance from nearest edge → progress.
      const distFromEdge = Math.min(c, COLS - 1 - c);
      const half = (COLS - 1) / 2;
      return distFromEdge / Math.max(1, half);
    }
    case "stripBars": {
      // Vertical stripes: even columns shrink first 0–50%, odd columns
      // shrink in 50–100%. Two-phase column-based — chess riff but
      // line-forming, not checkered.
      const isEvenCol = c % 2 === 0;
      const within = r / Math.max(1, ROWS - 1);
      return (isEvenCol ? 0 : 0.5) + within * 0.5;
    }
  }
}

/* STAIRCASE — chunky black diagonal slabs sweep across the screen,
   hand off when fully covered, then sweep off the other side
   revealing the hero behind. */
function runStaircase(host: HTMLDivElement, onCovered: () => void, done: () => void) {
  const steps = 14;
  const segH = 100 / steps;
  const inDur = 350;
  const stagger = 25;
  const hold = 120;
  const outDur = 350;
  const staggerOut = 22;
  for (let i = 0; i < steps; i++) {
    const slab = document.createElement("div");
    slab.style.cssText = `position:absolute;left:0;right:0;top:${i * segH}%;height:${segH + 0.4}%;background:#1a1a1a;transform:translateX(-101%);transition:transform ${inDur}ms cubic-bezier(.7,0,.3,1);transition-delay:${i * stagger}ms;`;
    host.appendChild(slab);
  }
  void host.offsetHeight;
  Array.from(host.children).forEach((el) => {
    (el as HTMLElement).style.transform = "translateX(0)";
  });
  const inEnd = inDur + steps * stagger;
  // Hand off when last slab finishes its IN tween — screen is fully black
  window.setTimeout(onCovered, inEnd);
  window.setTimeout(() => {
    Array.from(host.children).forEach((el, i) => {
      const e = el as HTMLElement;
      e.style.transition = `transform ${outDur}ms cubic-bezier(.7,0,.3,1)`;
      e.style.transitionDelay = `${i * staggerOut}ms`;
      e.style.transform = "translateX(101%)";
    });
    window.setTimeout(done, outDur + steps * staggerOut + 80);
  }, inEnd + hold);
}

/* CHECKERBOARD — 12x8 grid of black squares pop in along a diagonal sweep,
   hand off when fully covered, then pop back out reverse-diagonally. */
function runCheckerboard(host: HTMLDivElement, onCovered: () => void, done: () => void) {
  const cols = 12;
  const rows = 8;
  const cells: HTMLDivElement[] = [];
  const cellDur = 180;
  const stagger = 20;
  const hold = 120;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement("div");
      cell.style.cssText = `position:absolute;left:${(c / cols) * 100}%;top:${(r / rows) * 100}%;width:${100 / cols + 0.2}%;height:${100 / rows + 0.2}%;background:#1a1a1a;transform:scale(0);transition:transform ${cellDur}ms steps(5);transform-origin:center;`;
      host.appendChild(cell);
      cells.push(cell);
    }
  }
  void host.offsetHeight;
  cells.forEach((cell, idx) => {
    const r = Math.floor(idx / cols);
    const c = idx % cols;
    cell.style.transitionDelay = `${(r + c) * stagger}ms`;
    cell.style.transform = "scale(1)";
  });
  const inEnd = (rows + cols) * stagger + cellDur;
  // Hand off when last cell pops in — fully covered
  window.setTimeout(onCovered, inEnd);
  window.setTimeout(() => {
    cells.forEach((cell, idx) => {
      const r = Math.floor(idx / cols);
      const c = idx % cols;
      cell.style.transitionDelay = `${(rows - r + cols - c) * stagger}ms`;
      cell.style.transform = "scale(0)";
    });
    window.setTimeout(done, (rows + cols) * stagger + cellDur + 80);
  }, inEnd + hold);
}

/* SPIRAL — single SVG path stroke-dashes a thick black square spiral
   expanding from center, hand off when path is fully drawn, then
   retract from the inside revealing the hero. */
function runSpiral(host: HTMLDivElement, onCovered: () => void, done: () => void) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("preserveAspectRatio", "xMidYMid slice");
  svg.style.cssText = "position:absolute;inset:0;width:100%;height:100%;";
  let x = 50;
  let y = 50;
  let d = `M ${x} ${y}`;
  let step = 4;
  let dir = 0; // 0=right, 1=down, 2=left, 3=up
  for (let i = 0; i < 60; i++) {
    if (dir === 0) x += step;
    else if (dir === 1) y += step;
    else if (dir === 2) x -= step;
    else y -= step;
    d += ` L ${x} ${y}`;
    if (i % 2 === 1) step += 4;
    dir = (dir + 1) % 4;
  }
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", d);
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "#1a1a1a");
  path.setAttribute("stroke-width", "9");
  path.setAttribute("stroke-linecap", "square");
  path.setAttribute("stroke-linejoin", "miter");
  svg.appendChild(path);
  host.appendChild(svg);
  const len = path.getTotalLength();
  const inDur = 600;
  const hold = 150;
  const outDur = 550;
  path.style.strokeDasharray = `${len}`;
  path.style.strokeDashoffset = `${len}`;
  path.style.transition = `stroke-dashoffset ${inDur}ms cubic-bezier(.5,0,.4,1)`;
  void path.getBoundingClientRect();
  path.style.strokeDashoffset = "0";
  // Hand off when spiral is fully drawn — screen is covered
  window.setTimeout(onCovered, inDur);
  window.setTimeout(() => {
    path.style.transition = `stroke-dashoffset ${outDur}ms cubic-bezier(.4,0,.5,1)`;
    path.style.strokeDashoffset = `-${len}`;
    window.setTimeout(done, outDur + 60);
  }, inDur + hold);
}
