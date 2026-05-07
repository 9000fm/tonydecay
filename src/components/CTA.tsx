"use client";

import { useRef } from "react";
import { JP } from "./JP";

/* CTA — TYPE-AS-IMAGE
   1968 Wim Crouwel / Total Design brutalist statement. The wordmark
   IS the visual. Mega-type fills the viewport, confronts the user
   instead of selling at them. Two ink ticker bands sandwich the type,
   scrolling in opposite directions for X-crossed motion. */

/* CTA header — merged STAMP SEAL (VOL.01 round badge) + CUT-EDGE
   RIBBON (TONY DECAY · 特集) stacked vertically. Replaces the prior
   black ink tickers. Both pieces share a single paper background and
   sit above the mega type body as the section's masthead. */
function CTAHeader() {
  return (
    <div
      style={{
        background: "var(--color-paper)",
        borderBottom: "2px solid var(--color-ink)",
      }}
    >
      {/* Top half — round VOL.01 stamp on a hairline. */}
      <div
        style={{
          padding: "32px 24px 20px",
          position: "relative",
          textAlign: "center",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "calc(50% + 4px)",
            left: 0,
            right: 0,
            height: 1,
            background: "var(--color-ink)",
            opacity: 0.3,
          }}
        />
        <div
          style={{
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 84,
            height: 84,
            borderRadius: "50%",
            background: "var(--color-gold)",
            border: "3px solid var(--color-ink)",
            boxShadow: "3px 3px 0 var(--color-ink)",
            color: "var(--color-ink)",
          }}
        >
          <div className="text-center" style={{ lineHeight: 1 }}>
            <div
              className="font-mono"
              style={{
                fontSize: 8,
                fontWeight: 800,
                letterSpacing: "0.28em",
              }}
            >
              VOL.
            </div>
            <div
              className="font-tattoo"
              style={{ fontSize: 24, fontWeight: 900, letterSpacing: "0.02em" }}
            >
              01
            </div>
          </div>
        </div>
      </div>

      {/* Bottom half — gold cut-edge ribbon with the wordmark. */}
      <div
        style={{
          padding: "8px 0 28px",
          textAlign: "center",
        }}
      >
        <div
          className="font-mono"
          style={{
            display: "inline-block",
            background: "var(--color-gold)",
            color: "var(--color-ink)",
            border: "2.5px solid var(--color-ink)",
            padding: "10px 48px",
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: "0.32em",
            clipPath:
              "polygon(16px 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 16px 100%, 0 50%)",
            boxShadow: "4px 4px 0 var(--color-ink)",
          }}
        >
          ✦ TONY DECAY ·{" "}
          <span className="font-jp" style={{ fontSize: 14 }}>
            特集
          </span>{" "}
          ✦
        </div>
      </div>
    </div>
  );
}

export function CTA({ onBuy }: { onBuy?: () => void }) {
  const sectionRef = useRef<HTMLElement>(null);

  const handleBuy = () => {
    if (onBuy) onBuy();
    else {
      const el = document.getElementById("package");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="cta"
      className="relative w-full overflow-hidden"
      style={{
        background: "var(--color-paper)",
        color: "var(--color-ink)",
        borderTop: "3px solid var(--color-ink)",
        borderBottom: "3px solid var(--color-ink)",
      }}
    >
      {/* Section masthead — VOL.01 stamp + TONY DECAY ribbon stacked. */}
      <CTAHeader />

      {/* Mega type body — fills the viewport, type IS the image */}
      <div
        style={{
          backgroundImage: "radial-gradient(rgba(26,26,26,0.22) 1.2px, transparent 1.6px)",
          backgroundSize: "9px 9px",
          padding: "clamp(40px, 8vw, 80px) clamp(16px, 4vw, 56px)",
          minHeight: "min(720px, 90vh)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div className="mx-auto w-full" style={{ maxWidth: 1280 }}>
          <h2
            className="font-tattoo"
            style={{
              margin: 0,
              fontSize: "clamp(80px, 22vw, 280px)",
              lineHeight: 0.84,
              color: "var(--color-ink)",
              letterSpacing: "-0.01em",
              textAlign: "left",
            }}
          >
            COLLECT
          </h2>
          <h2
            className="font-tattoo"
            style={{
              margin: "-4px 0 0",
              fontSize: "clamp(80px, 22vw, 280px)",
              lineHeight: 0.84,
              color: "var(--color-crimson)",
              letterSpacing: "-0.01em",
              WebkitTextStroke: "3px var(--color-ink)",
              textAlign: "left",
            }}
          >
            <JP en="を (wo) — Japanese object marker · reads 'COLLECT → YOURS'" bare>
              <span
                className="font-jp"
                style={{
                  fontSize: "0.42em",
                  color: "var(--color-ink)",
                  WebkitTextStroke: 0,
                  marginRight: "0.14em",
                  verticalAlign: "middle",
                }}
              >
                を
              </span>
            </JP>
            YOURS
          </h2>

          {/* Bottom row — ORDER NOW alone, right-aligned. */}
          <div className="mt-12 flex justify-end">
            <button
              type="button"
              onClick={handleBuy}
              className="cta-press w-full font-mono sm:w-auto"
              style={{
                padding: "16px 32px",
                background: "var(--color-ink)",
                color: "var(--color-gold)",
                border: "2px solid var(--color-ink)",
                fontSize: 16,
                fontWeight: 900,
                letterSpacing: "0.32em",
                lineHeight: 1,
                cursor: "pointer",
                whiteSpace: "nowrap",
                // Flash-stamp press animation — chunky offset shadow that
                // grows on hover and collapses on active (button physically
                // presses into its own shadow).
                boxShadow: "4px 4px 0 var(--color-crimson)",
                transition: "transform 120ms ease-out, box-shadow 120ms ease-out",
              }}
            >
              ORDER NOW →
            </button>
          </div>
        </div>
      </div>

      {/* Stamp-press animation — used by all .cta-press buttons.
          Hover: lifts -1/-1, shadow grows to 5px. Active: drops +4/+4,
          shadow shrinks to 1px (button "presses into" shadow). */}
      <style>{`
        .cta-press:hover {
          transform: translate(-1px, -1px);
          box-shadow: 5px 5px 0 var(--color-crimson) !important;
        }
        .cta-press:active {
          transform: translate(4px, 4px);
          box-shadow: 1px 1px 0 var(--color-crimson) !important;
        }
      `}</style>
    </section>
  );
}
