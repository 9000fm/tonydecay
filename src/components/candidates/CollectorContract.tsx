"use client";

import { CandidateLabel } from "./CandidateLabel";

/* Candidate 03 — CollectorContract
   Visual mockup of the deed-of-ownership document that ships with the set.
   Stamped, signed, numbered, sealed. Document-as-section. Treats the
   purchase as a transaction with weight. */

export function CollectorContract() {
  return (
    <>
      <CandidateLabel index={3} name="COLLECTOR CONTRACT" anchor="cand-contract" />
      <section
        style={{
          background: "var(--color-ink)",
          padding: "100px 24px",
          borderBottom: "3px solid var(--color-ink)",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* Document */}
          <div
            style={{
              position: "relative",
              maxWidth: 640,
              margin: "0 auto",
              background: "var(--color-paper)",
              color: "var(--color-ink)",
              padding: "72px 64px 96px",
              border: "1px solid var(--color-ink)",
              boxShadow: "12px 12px 0 var(--color-crimson), 12px 12px 0 1px var(--color-ink)",
              overflow: "hidden",
            }}
          >
            {/* Watermark */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%) rotate(-22deg)",
                fontFamily: "var(--font-tattoo)",
                fontSize: "5rem",
                fontWeight: 900,
                color: "rgba(26,26,26,0.05)",
                letterSpacing: "0.12em",
                whiteSpace: "nowrap",
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              NO REPRINTS
            </div>

            {/* Crest */}
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div
                style={{
                  display: "inline-block",
                  width: 56,
                  height: 56,
                  border: "2px solid var(--color-ink)",
                  borderRadius: "50%",
                  fontFamily: "var(--font-tattoo)",
                  fontSize: 22,
                  lineHeight: "52px",
                  fontWeight: 900,
                  letterSpacing: "0.04em",
                }}
              >
                TD
              </div>
            </div>

            {/* Title */}
            <h2
              style={{
                textAlign: "center",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "1.75rem",
                lineHeight: 1.1,
                marginBottom: 8,
                letterSpacing: "0.01em",
              }}
            >
              CERTIFICATE OF OWNERSHIP
            </h2>
            <div
              style={{
                textAlign: "center",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.32em",
                color: "var(--color-crimson)",
                marginBottom: 40,
              }}
            >
              TONY DECAY · VOL. 01
            </div>

            {/* Body */}
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 14,
                lineHeight: 1.7,
                color: "var(--color-ink)",
              }}
            >
              <p style={{ marginBottom: 14 }}>
                The undersigned acknowledges sole receipt of one (1) of one hundred (100)
                hand-numbered, signed, and sealed printings of the Tony Decay Vol. 01 collection —
                fifteen (15) original pieces on 80lb cream cardstock, struck once, never again.
              </p>
              <p style={{ marginBottom: 14 }}>
                The undersigned further acknowledges that no reprint, second edition, digital
                release, or derivative reproduction of this volume shall be issued. The plate is
                broken on completion of the run. This document accompanies the set as proof of
                authentic ownership.
              </p>
              <p style={{ marginBottom: 14 }}>
                Resale, gift, or display rights belong to the holder. Tony retains the rights to the
                underlying art.
              </p>
            </div>

            {/* Numbered slot */}
            <div
              style={{
                marginTop: 40,
                display: "flex",
                alignItems: "baseline",
                justifyContent: "center",
                gap: 8,
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                letterSpacing: "0.18em",
              }}
            >
              <span>EDITION №</span>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontSize: 24,
                  fontWeight: 700,
                  borderBottom: "1px solid var(--color-ink)",
                  padding: "0 16px 2px",
                  minWidth: 80,
                  textAlign: "center",
                }}
              >
                ##
              </span>
              <span>OF 100</span>
            </div>

            {/* Signature row */}
            <div
              style={{
                marginTop: 56,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                gap: 32,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontStyle: "italic",
                    fontSize: 28,
                    transform: "rotate(-4deg)",
                    transformOrigin: "left bottom",
                  }}
                >
                  Tony D.
                </div>
                <div
                  style={{
                    borderTop: "1px solid var(--color-ink)",
                    marginTop: 6,
                    paddingTop: 6,
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    letterSpacing: "0.18em",
                    color: "var(--color-ink-soft)",
                  }}
                >
                  AUTHOR · SIGNATURE
                </div>
              </div>

              {/* Wax seal */}
              <svg width={84} height={84} viewBox="0 0 84 84" aria-hidden>
                <circle
                  cx={42}
                  cy={42}
                  r={36}
                  fill="var(--color-crimson)"
                  stroke="var(--color-ink)"
                  strokeWidth={1.5}
                />
                <circle
                  cx={42}
                  cy={42}
                  r={28}
                  fill="none"
                  stroke="rgba(0,0,0,0.4)"
                  strokeWidth={1}
                  strokeDasharray="2 3"
                />
                <text
                  x={42}
                  y={48}
                  textAnchor="middle"
                  fill="var(--color-paper)"
                  fontFamily="var(--font-tattoo)"
                  fontSize={20}
                  fontWeight={900}
                >
                  TD
                </text>
              </svg>
            </div>
          </div>

          <p
            style={{
              textAlign: "center",
              marginTop: 32,
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: 14,
              color: "rgba(240,235,220,0.7)",
            }}
          >
            Yours, when you collect a set.
          </p>
        </div>
      </section>
    </>
  );
}
