"use client";

import { PLACEHOLDER_PRINTS } from "@/lib/constants";
import { JP } from "../JP";

/* Candidate 07 — GameManual
   Facing-page Famicom-era game manual spread. Showa game-manual
   maximalism: dense type, kanji subheads, pixelated borders, diagrams.
   The print collection presented as a 'how to play' set. */

export function GameManual() {
  const heroPrint = PLACEHOLDER_PRINTS[0];

  return (
    <>
      <section
        style={{
          background: "#ECE4D0",
          color: "var(--color-ink)",
          padding: "60px 24px",
          borderBottom: "3px solid var(--color-ink)",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* Spread */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 0,
              border: "3px solid var(--color-ink)",
              boxShadow: "10px 10px 0 var(--color-crimson)",
              background: "var(--color-paper)",
            }}
            className="td-manual-spread"
          >
            {/* LEFT PAGE — STORY */}
            <div
              style={{
                padding: "40px 32px 56px",
                borderRight: "2px solid var(--color-ink)",
                position: "relative",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  letterSpacing: "0.32em",
                  fontWeight: 800,
                  color: "var(--color-crimson)",
                  marginBottom: 8,
                }}
              >
                CHAPTER 01 · <JP en="sutōrī — story">ストーリー</JP>
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-tattoo)",
                  fontSize: "1.8rem",
                  lineHeight: 0.95,
                  marginBottom: 16,
                  letterSpacing: "0.005em",
                }}
              >
                THE COLLECTION BEGINS
              </h3>

              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 13,
                  lineHeight: 1.65,
                  textAlign: "justify",
                }}
              >
                <span
                  style={{
                    float: "left",
                    fontFamily: "var(--font-tattoo)",
                    fontSize: "3.4rem",
                    lineHeight: 0.9,
                    paddingRight: 8,
                    color: "var(--color-crimson)",
                  }}
                >
                  T
                </span>
                ony Decay set out to print 100 sets of 15 pieces. Each set ships hand-numbered,
                signed, and sealed. The plate is broken on completion of the run. There will be no
                second printing, no digital release, no derivative reproduction.
              </div>

              <div
                style={{
                  marginTop: 24,
                  padding: 16,
                  border: "2px solid var(--color-ink)",
                  background: "#f4eedd",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroPrint.src}
                  alt={heroPrint.alt}
                  style={{
                    width: "100%",
                    height: 140,
                    objectFit: "cover",
                    border: "1px solid var(--color-ink)",
                  }}
                />
                <div
                  style={{
                    marginTop: 8,
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    letterSpacing: "0.18em",
                    color: "rgba(26,26,26,0.7)",
                    textAlign: "center",
                  }}
                >
                  FIG. 01 · COLLECTION HERO
                </div>
              </div>

              <div
                style={{
                  position: "absolute",
                  bottom: 12,
                  left: 12,
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  letterSpacing: "0.18em",
                  color: "rgba(26,26,26,0.5)",
                }}
              >
                01
              </div>
            </div>

            {/* RIGHT PAGE — CONTROLS */}
            <div
              style={{
                padding: "40px 32px 56px",
                position: "relative",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  letterSpacing: "0.32em",
                  fontWeight: 800,
                  color: "var(--color-crimson)",
                  marginBottom: 8,
                }}
              >
                CHAPTER 02 · <JP en="sōsa setsumei — operation manual / how to use">操作説明</JP>
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-tattoo)",
                  fontSize: "1.8rem",
                  lineHeight: 0.95,
                  marginBottom: 16,
                  letterSpacing: "0.005em",
                }}
              >
                HOW TO HANDLE
              </h3>

              <div
                style={{
                  display: "grid",
                  gap: 12,
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  lineHeight: 1.5,
                }}
              >
                {[
                  {
                    kanji: "扱",
                    kEn: "atsukai — handling",
                    title: "HANDLING",
                    desc: "Cotton gloves. Avoid direct sun. 18-22°C ideal.",
                  },
                  {
                    kanji: "飾",
                    kEn: "kazari — display / decoration",
                    title: "DISPLAY",
                    desc: "Frame with UV-protective glass. Mat with cream cardstock.",
                  },
                  {
                    kanji: "署",
                    kEn: "sho — signature / sign",
                    title: "SIGNATURE",
                    desc: "Bottom-right corner. Pencil. Tony's hand.",
                  },
                  {
                    kanji: "番",
                    kEn: "ban — number / edition",
                    title: "EDITION",
                    desc: "Top-left margin. Stamped №__/100 in red ink.",
                  },
                ].map((row) => (
                  <div
                    key={row.title}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "44px 1fr",
                      gap: 12,
                      padding: 12,
                      border: "2px solid var(--color-ink)",
                      background: "#f4eedd",
                    }}
                  >
                    <div
                      style={{
                        background: "var(--color-ink)",
                        color: "var(--color-gold)",
                        fontFamily: "var(--font-jp)",
                        fontSize: 22,
                        textAlign: "center",
                        lineHeight: "44px",
                      }}
                    >
                      <JP en={row.kEn}>{row.kanji}</JP>
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, letterSpacing: "0.18em" }}>{row.title}</div>
                      <div style={{ marginTop: 2, opacity: 0.8 }}>{row.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  position: "absolute",
                  bottom: 12,
                  right: 12,
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  letterSpacing: "0.18em",
                  color: "rgba(26,26,26,0.5)",
                }}
              >
                02
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 16,
              textAlign: "right",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.32em",
              fontWeight: 800,
              color: "var(--color-ink)",
            }}
          >
            TURN PAGE · <JP en="tsugi no pēji — next page">次のページ</JP> →
          </div>
        </div>

        {/* Mobile stack */}
        <style>{`
          @media (max-width: 720px) {
            .td-manual-spread {
              grid-template-columns: 1fr !important;
            }
            .td-manual-spread > div:first-child {
              border-right: none !important;
              border-bottom: 2px solid var(--color-ink) !important;
            }
          }
        `}</style>
      </section>
    </>
  );
}
