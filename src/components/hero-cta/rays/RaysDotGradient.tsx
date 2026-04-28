"use client";

/* R2 — PAPER-DOT GRADIENT. Pure halftone dot field with no lines, no
   geometry — just ink dots in a radial gradient, densest in a ring around
   the button, fading to sparse at the edges. Matches the site's paper-dot
   backgrounds. No motion — deliberate static stillness as contrast to the
   swinging daggers. */

const INK = "#1a1a1a";
const CRIMSON = "#d7322e";

export function RaysDotGradient() {
  const dots: { cx: number; cy: number; r: number; color: string; o: number }[] = [];
  const rand = mulberry32(42);

  // Ring band from ~100 to ~200px radius, ~420 dots total
  for (let i = 0; i < 440; i++) {
    const angle = rand() * Math.PI * 2;
    // Distribution biased toward middle of band via sqrt
    const t = rand();
    const rad = 100 + Math.pow(t, 0.7) * 110;
    const cx = 200 + Math.cos(angle) * rad;
    const cy = 200 + Math.sin(angle) * rad;
    const distNorm = (rad - 100) / 110;
    // Dot gets smaller + fader as it nears the outer edge
    const r = 1.6 + (1 - distNorm) * 2.2;
    const o = 0.9 - distNorm * 0.55;
    const color = rand() < 0.08 ? CRIMSON : INK;
    dots.push({ cx, cy, r, color, o });
  }

  return (
    <svg
      aria-hidden
      viewBox="0 0 400 400"
      style={{
        width: 380,
        height: 380,
        pointerEvents: "none",
      }}
    >
      {dots.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill={d.color} opacity={d.o} />
      ))}
      {/* Small hairline ring to anchor the field */}
      <circle
        cx="200"
        cy="200"
        r="108"
        fill="none"
        stroke={INK}
        strokeWidth="1"
        strokeDasharray="3 5"
        opacity="0.25"
      />
    </svg>
  );
}

function mulberry32(seed: number) {
  let t = seed;
  return function () {
    t |= 0;
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
