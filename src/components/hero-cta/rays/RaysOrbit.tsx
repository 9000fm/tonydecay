"use client";

/* R3 — TATTOO ORBIT. Tiny tattoo-flash ornaments (✦ stars, teardrops,
   ink blots, small daggers) orbit the button on a subtle dashed-ring
   path. Slow 40s rotation — each ornament counter-rotates to stay upright. */

const INK = "#1a1a1a";
const CRIMSON = "#d7322e";
const GOLD = "#F7C234";
const CREAM = "#F5ECCE";

type OrnamentKind = "star" | "drop" | "blot" | "blade";

const ORNAMENTS: OrnamentKind[] = [
  "star",
  "drop",
  "star",
  "blade",
  "blot",
  "star",
  "drop",
  "blade",
  "star",
  "blot",
  "drop",
  "star",
];

function Ornament({ kind }: { kind: OrnamentKind }) {
  switch (kind) {
    case "star":
      return (
        <g>
          <circle r="16" fill={CREAM} stroke={INK} strokeWidth="2" />
          <text
            y="6"
            textAnchor="middle"
            fontFamily="var(--font-tattoo), sans-serif"
            fontSize="20"
            fill={CRIMSON}
          >
            ✦
          </text>
        </g>
      );
    case "drop":
      return (
        <g>
          <path
            d="M 0 -14 Q 10 -4 10 6 Q 10 14 0 14 Q -10 14 -10 6 Q -10 -4 0 -14 Z"
            fill={CRIMSON}
            stroke={INK}
            strokeWidth="2"
          />
          <circle cx="-3" cy="-2" r="2" fill={CREAM} opacity="0.65" />
        </g>
      );
    case "blot":
      return (
        <g>
          <path d="M -10 -6 Q -14 -2 -10 6 Q -2 14 6 10 Q 14 2 10 -8 Q 2 -14 -10 -6 Z" fill={INK} />
          {/* satellite ink specks */}
          <circle cx="-16" cy="-10" r="2" fill={INK} />
          <circle cx="14" cy="-14" r="1.5" fill={INK} />
          <circle cx="12" cy="14" r="1.8" fill={INK} />
        </g>
      );
    case "blade":
      return (
        <g>
          {/* horizontal mini-dagger */}
          <circle cx="-14" cy="0" r="4" fill={GOLD} stroke={INK} strokeWidth="1.5" />
          <rect x="-10" y="-3" width="5" height="6" fill={CRIMSON} stroke={INK} strokeWidth="1.2" />
          <polygon
            points="-5,-3 14,0 -5,3"
            fill={CREAM}
            stroke={INK}
            strokeWidth="1.5"
            strokeLinejoin="miter"
          />
        </g>
      );
  }
}

export function RaysOrbit() {
  const count = ORNAMENTS.length;
  const radius = 168;

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
      {/* dashed orbit ring */}
      <circle
        cx="200"
        cy="200"
        r={radius}
        fill="none"
        stroke={INK}
        strokeWidth="1.5"
        strokeDasharray="4 8"
        opacity="0.45"
      />
      {/* inner hint ring */}
      <circle
        cx="200"
        cy="200"
        r={radius - 38}
        fill="none"
        stroke={INK}
        strokeWidth="1"
        strokeDasharray="1 4"
        opacity="0.3"
      />

      <g
        style={{
          animation: "rays-orbit-spin 42s linear infinite",
          transformOrigin: "200px 200px",
        }}
      >
        {ORNAMENTS.map((kind, i) => {
          const a = (i / count) * Math.PI * 2;
          const cx = 200 + Math.cos(a) * radius;
          const cy = 200 + Math.sin(a) * radius;
          return (
            <g
              key={i}
              transform={`translate(${cx} ${cy})`}
              style={{
                animation: "rays-orbit-counter 42s linear infinite",
                transformOrigin: `${cx}px ${cy}px`,
              }}
            >
              <Ornament kind={kind} />
            </g>
          );
        })}
      </g>

      <style>{`
        @keyframes rays-orbit-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes rays-orbit-counter {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
      `}</style>
    </svg>
  );
}
