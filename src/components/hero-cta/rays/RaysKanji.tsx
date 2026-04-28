"use client";

/* R1 — KANJI RADIAL. 12 kanji tokens arranged in a spoke pattern around
   the button. Each token is a small cream square with an ink border + a
   single kanji character. Slow 90s rotation. Pulls from the katakana/kanji
   stamp vocabulary the site already uses in stats badges and seals. */

const INK = "#1a1a1a";
const CREAM = "#F5ECCE";
const CRIMSON = "#d7322e";
const GOLD = "#F7C234";

const TOKENS = [
  { char: "印", color: CRIMSON },
  { char: "限", color: INK },
  { char: "集", color: INK },
  { char: "決", color: CRIMSON },
  { char: "新", color: INK },
  { char: "作", color: INK },
  { char: "紙", color: CRIMSON },
  { char: "刷", color: INK },
  { char: "組", color: INK },
  { char: "号", color: CRIMSON },
  { char: "百", color: INK },
  { char: "手", color: INK },
];

export function RaysKanji() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 400 400"
      style={{
        width: 380,
        height: 380,
        pointerEvents: "none",
        animation: "rays-kanji-spin 90s linear infinite",
        transformOrigin: "center",
      }}
    >
      {TOKENS.map((t, i) => {
        const a = (i / TOKENS.length) * Math.PI * 2 - Math.PI / 2;
        const r = 168;
        const cx = 200 + Math.cos(a) * r;
        const cy = 200 + Math.sin(a) * r;
        const tilt = (i % 2 === 0 ? -1 : 1) * 6;
        return (
          <g
            key={i}
            transform={`translate(${cx} ${cy}) rotate(${tilt})`}
            style={{
              animation: "rays-kanji-counter 90s linear infinite",
              transformOrigin: `${cx}px ${cy}px`,
            }}
          >
            <rect
              x="-16"
              y="-16"
              width="32"
              height="32"
              fill={CREAM}
              stroke={INK}
              strokeWidth="2.5"
            />
            <rect
              x="-12"
              y="-12"
              width="24"
              height="24"
              fill="transparent"
              stroke={t.color}
              strokeWidth="1"
              opacity="0.5"
            />
            <text
              x="0"
              y="7"
              textAnchor="middle"
              fontFamily="var(--font-jp), var(--font-tattoo), sans-serif"
              fontSize="20"
              fill={t.color}
              fontWeight="700"
            >
              {t.char}
            </text>
          </g>
        );
      })}

      {/* tiny decorative ring between tokens and button */}
      <circle
        cx="200"
        cy="200"
        r="110"
        fill="none"
        stroke={INK}
        strokeWidth="1"
        strokeDasharray="2 6"
        opacity="0.4"
      />
      {/* gold accent dots between tokens */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = ((i + 0.5) / 12) * Math.PI * 2 - Math.PI / 2;
        const cx = 200 + Math.cos(a) * 138;
        const cy = 200 + Math.sin(a) * 138;
        return <circle key={i} cx={cx} cy={cy} r="2.5" fill={GOLD} opacity="0.9" />;
      })}
      <style>{`
        @keyframes rays-kanji-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes rays-kanji-counter {
          from { transform: translate(var(--x,0), var(--y,0)) rotate(0deg); }
          to { transform: translate(var(--x,0), var(--y,0)) rotate(-360deg); }
        }
      `}</style>
    </svg>
  );
}
