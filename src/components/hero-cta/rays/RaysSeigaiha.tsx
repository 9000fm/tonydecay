"use client";

/* R4 — SEIGAIHA WAVES. Concentric seigaiha (Japanese wave) ring pattern
   emanating from center — 4 rings of overlapping half-circles, ink on
   cream. Pulses scale very subtly (1 → 1.02) every 4s to suggest breathing
   without being distracting. Pulls from traditional JP print vocabulary. */

const INK = "#1a1a1a";
const CRIMSON = "#d7322e";

export function RaysSeigaiha() {
  // Ring radii (distance from center) and # of half-circles per ring
  const rings: { r: number; count: number; stroke: number; color: string }[] = [
    { r: 112, count: 12, stroke: 1.6, color: INK },
    { r: 142, count: 16, stroke: 1.8, color: INK },
    { r: 170, count: 20, stroke: 1.6, color: INK },
    { r: 194, count: 24, stroke: 1.4, color: CRIMSON },
  ];

  return (
    <svg
      aria-hidden
      viewBox="0 0 400 400"
      style={{
        width: 380,
        height: 380,
        pointerEvents: "none",
        animation: "rays-seigaiha-breathe 4s ease-in-out infinite",
        transformOrigin: "center",
      }}
    >
      {rings.map((ring, ri) => {
        // Each half-circle sits on the ring circumference, facing outward.
        // Radius of each scallop = arc-length / 2 ish; keep consistent 18px.
        const arcR = 18;
        return (
          <g key={ri}>
            {Array.from({ length: ring.count }).map((_, i) => {
              const a = (i / ring.count) * Math.PI * 2;
              const cx = 200 + Math.cos(a) * ring.r;
              const cy = 200 + Math.sin(a) * ring.r;
              // Rotate each scallop so its open side faces toward center
              const rot = (a * 180) / Math.PI + 90;
              return (
                <g key={i} transform={`translate(${cx} ${cy}) rotate(${rot})`}>
                  {/* 3 nested half-arcs = classic seigaiha motif */}
                  <path
                    d={`M -${arcR} 0 A ${arcR} ${arcR} 0 0 1 ${arcR} 0`}
                    fill="none"
                    stroke={ring.color}
                    strokeWidth={ring.stroke}
                    opacity="0.75"
                  />
                  <path
                    d={`M -${arcR * 0.7} 0 A ${arcR * 0.7} ${arcR * 0.7} 0 0 1 ${arcR * 0.7} 0`}
                    fill="none"
                    stroke={ring.color}
                    strokeWidth={ring.stroke * 0.85}
                    opacity="0.55"
                  />
                  <path
                    d={`M -${arcR * 0.4} 0 A ${arcR * 0.4} ${arcR * 0.4} 0 0 1 ${arcR * 0.4} 0`}
                    fill="none"
                    stroke={ring.color}
                    strokeWidth={ring.stroke * 0.7}
                    opacity="0.4"
                  />
                </g>
              );
            })}
          </g>
        );
      })}
      <style>{`
        @keyframes rays-seigaiha-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.025); }
        }
      `}</style>
    </svg>
  );
}
