"use client";

/* Section dividers — 5 variants. All gold/yellow, all maintain the
   tonydecay editorial vocabulary (mono caps, ink borders, JP accents).
   Stage all 5 stacked live; user picks #1-5. After pick, delete losers
   and duplicate the keeper to other section breaks. */

const INK = "#1a1a1a";
const GOLD = "#F7C234";
const CRIMSON = "#d7322e";
const PAPER = "#F0EBDC";

/* V1 — DASHED BANNER. Gold bg, ink dashed borders top+bottom, mono caps.
   Like the candidate banner pattern but tuned as a section seam. */
export function Divider01() {
  return (
    <>
      <Tag n={1} name="DASHED BANNER" />
      <div
        style={{
          background: GOLD,
          color: INK,
          borderTop: "3px dashed " + INK,
          borderBottom: "3px dashed " + INK,
          padding: "12px 24px",
          textAlign: "center",
          fontFamily: "var(--font-mono), monospace",
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: "0.32em",
        }}
      >
        ★ TONY DECAY · 特集 · VOL.01 ★
      </div>
    </>
  );
}

/* V2 — TICKER STRIP. Gold auto-scrolling marquee, like a magazine
   bottom strip. Editorial motion without flashy. */
export function Divider02() {
  const tokens = ["100 SETS", "✦", "HAND-NUMBERED", "✦", "SIGNED", "✦", "DHL WORLDWIDE", "✦"];
  return (
    <>
      <Tag n={2} name="TICKER STRIP" />
      <div
        className="relative overflow-hidden"
        style={{
          background: GOLD,
          height: 38,
          borderTop: "2px solid " + INK,
          borderBottom: "2px solid " + INK,
        }}
      >
        <div className="div2-ticker flex h-full items-center whitespace-nowrap will-change-transform">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center">
              {tokens.map((t, j) => (
                <span
                  key={`${i}-${j}`}
                  className="shrink-0 px-4 font-mono"
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: "0.32em",
                    color: t === "✦" ? CRIMSON : INK,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
        <style>{`
          @keyframes div2-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
          .div2-ticker { animation: div2-scroll 32s linear infinite; }
        `}</style>
      </div>
    </>
  );
}

/* V3 — STAMP SEAL. Single round gold seal centered on a thin ink line.
   Magazine chapter-break vibe — quiet, ceremonial. */
export function Divider03() {
  return (
    <>
      <Tag n={3} name="STAMP SEAL" />
      <div
        style={{
          background: PAPER,
          padding: "32px 24px",
          position: "relative",
          textAlign: "center",
          borderTop: "1px solid " + INK,
          borderBottom: "1px solid " + INK,
        }}
      >
        {/* horizontal hairline running through */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            height: 1,
            background: INK,
            opacity: 0.3,
          }}
        />
        {/* round stamp on top */}
        <div
          style={{
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 84,
            height: 84,
            borderRadius: "50%",
            background: GOLD,
            border: "3px solid " + INK,
            boxShadow: "3px 3px 0 " + INK,
            fontFamily: "var(--font-tattoo), sans-serif",
            color: INK,
          }}
        >
          <div className="text-center" style={{ lineHeight: 1 }}>
            <div
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 8,
                fontWeight: 800,
                letterSpacing: "0.28em",
              }}
            >
              VOL.
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: "0.02em" }}>01</div>
          </div>
        </div>
      </div>
    </>
  );
}

/* V4 — CUT-EDGE RIBBON. Gold ribbon with diagonal cut at both ends —
   like a torn paper banner / jp obi strip. */
export function Divider04() {
  return (
    <>
      <Tag n={4} name="CUT-EDGE RIBBON" />
      <div
        style={{
          background: PAPER,
          padding: "28px 0",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: GOLD,
            color: INK,
            border: "2.5px solid " + INK,
            padding: "10px 48px",
            fontFamily: "var(--font-mono), monospace",
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: "0.32em",
            clipPath:
              "polygon(16px 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 16px 100%, 0 50%)",
            boxShadow: "4px 4px 0 " + INK,
          }}
        >
          ✦ TONY DECAY · 特集 ✦
        </div>
      </div>
    </>
  );
}

/* V5 — PAGE NUMBER BAR. Gold band with magazine-spread page-number
   typography — chapter / section / page reference like a print catalog
   running header. */
export function Divider05() {
  return (
    <>
      <Tag n={5} name="PAGE NUMBER BAR" />
      <div
        style={{
          background: GOLD,
          borderTop: "3px solid " + INK,
          borderBottom: "3px solid " + INK,
          padding: "16px 28px",
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          alignItems: "center",
          gap: 24,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.32em",
            color: INK,
          }}
        >
          PG. 04
        </span>
        <span
          style={{
            fontFamily: "var(--font-tattoo), sans-serif",
            fontSize: 22,
            color: INK,
            letterSpacing: "0.04em",
            textAlign: "center",
          }}
        >
          TONY DECAY{" "}
          <span
            style={{
              fontFamily: "var(--font-jp), sans-serif",
              fontSize: 16,
              color: CRIMSON,
            }}
          >
            特集
          </span>
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.32em",
            color: INK,
          }}
        >
          VOL.01
        </span>
      </div>
    </>
  );
}

/* Identifier tag — small mono badge above each variant for picking.
   Deleted along with losing variants. */
function Tag({ n, name }: { n: number; name: string }) {
  return (
    <div
      style={{
        background: INK,
        color: GOLD,
        padding: "4px 14px",
        textAlign: "center",
        fontFamily: "var(--font-mono), monospace",
        fontSize: 9,
        fontWeight: 800,
        letterSpacing: "0.4em",
      }}
    >
      ▸ DIVIDER {String(n).padStart(2, "0")} · {name}
    </div>
  );
}
