"use client";

import { useRef } from "react";
import { JP } from "./JP";

/* CTA — SHOGAKUKAN ATTRACT
   Maximalist closer that echoes the MagazineCover vocabulary: warm
   masthead band, kanji JP, dotted paper bg, levitating crimson
   starburst, prints peeking from the edges, hard offset shadows
   everywhere. Giant COLLECT / YOURS wordmark anchors the section. */

type Layer = {
  src: string;
  w: number;
  rot: number;
  side: "left" | "right";
  top: string;
};

const LAYERS: Layer[] = [
  { src: "/gallery/2.webp", w: 200, rot: -8, side: "left", top: "10%" },
  { src: "/gallery/8.webp", w: 220, rot: 6, side: "right", top: "8%" },
  { src: "/gallery/12.webp", w: 180, rot: 4, side: "left", top: "58%" },
  { src: "/gallery/5.webp", w: 200, rot: -5, side: "right", top: "56%" },
];

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
      {/* warm masthead band */}
      <div
        className="relative flex items-center justify-between"
        style={{
          background: "#ECE4D0",
          borderBottom: "3px solid var(--color-ink)",
          padding: "22px 56px",
          zIndex: 5,
        }}
      >
        <span
          className="font-mono"
          style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.3em",
            color: "var(--color-crimson)",
          }}
        >
          VOL.01 · NEXT STEP / <JP en="tsugi no ippo — the next step">次の一歩</JP>
        </span>
        <span
          className="font-jp"
          style={{
            fontSize: 18,
            color: "var(--color-ink)",
            opacity: 0.7,
            letterSpacing: "0.06em",
          }}
        >
          ★{" "}
          <JP en="puresutāto — press start (Famicom-era game-start screen language)">
            プレスタート
          </JP>{" "}
          ★
        </span>
      </div>

      {/* dotted body */}
      <div
        className="relative"
        style={{
          minHeight: 680,
          backgroundImage: "radial-gradient(rgba(26,26,26,0.22) 1.2px, transparent 1.6px)",
          backgroundSize: "9px 9px",
          padding: "72px 56px 96px",
        }}
      >
        {/* Inner frame — caps the composition at 1280 so prints + wordmark
            stay grouped on ultrawide instead of flying to the viewport edges. */}
        <div className="relative mx-auto" style={{ maxWidth: 1280 }}>
          {/* edge prints */}
          {LAYERS.map((p, i) => (
            <div
              key={i}
              aria-hidden
              // Mobile shows only LAYERS[0] (top-left) + LAYERS[3] (bottom-right);
              // the other 2 polaroids hide on <lg so the title isn't crashed.
              className={`pointer-events-none absolute ${i === 1 || i === 2 ? "hidden lg:block" : ""}`}
              style={{
                top: p.top,
                [p.side]: -40,
                transform: `rotate(${p.rot}deg)`,
                width: p.w,
                aspectRatio: "3/4",
                background: "#fff",
                border: "3px solid var(--color-ink)",
                boxShadow: "5px 5px 0 var(--color-crimson), 5px 5px 0 2px var(--color-ink)",
                zIndex: 1,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
          ))}

          {/* center wordmark */}
          <div className="relative text-center" style={{ zIndex: 3 }}>
            <div
              className="mb-5 inline-block font-mono"
              style={{
                background: "var(--color-crimson)",
                color: "var(--color-paper)",
                border: "3px solid var(--color-ink)",
                padding: "5px 14px",
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.32em",
                boxShadow: "3px 3px 0 var(--color-ink)",
                transform: "rotate(-2deg)",
              }}
            >
              ★ ONE EDITION · NEVER REPRINTED ★
            </div>

            <h2
              className="font-tattoo"
              style={{
                margin: 0,
                fontSize: "clamp(72px, 16vw, 200px)",
                lineHeight: 0.84,
                color: "var(--color-ink)",
                letterSpacing: "-0.005em",
              }}
            >
              COLLECT
            </h2>
            <h2
              className="font-tattoo"
              style={{
                margin: "-4px 0 0",
                fontSize: "clamp(72px, 16vw, 200px)",
                lineHeight: 0.84,
                color: "var(--color-crimson)",
                letterSpacing: "-0.005em",
                WebkitTextStroke: "3px var(--color-ink)",
              }}
            >
              <span
                className="font-jp"
                style={{
                  fontSize: "0.42em",
                  color: "var(--color-ink)",
                  WebkitTextStroke: 0,
                  marginRight: "0.18em",
                  verticalAlign: "middle",
                }}
              >
                <JP en="wo — Japanese particle marking the direct object">を</JP>
              </span>
              YOURS
              <span
                style={{
                  color: "var(--color-gold)",
                  WebkitTextStroke: "3px var(--color-ink)",
                }}
              >
                .
              </span>
            </h2>

            <p
              className="font-display mx-auto"
              style={{
                fontStyle: "italic",
                fontSize: "clamp(18px, 1.7vw, 22px)",
                lineHeight: 1.5,
                color: "var(--color-ink-soft)",
                marginTop: 22,
                maxWidth: "40ch",
              }}
            >
              fifteen prints, signed certificate, archival packaging — sent worldwide by DHL.
            </p>

            {/* CTA cluster */}
            <div
              className="mt-10 inline-flex flex-wrap items-center justify-center"
              style={{ gap: 22 }}
            >
              <span
                aria-hidden
                className="font-tattoo"
                style={{
                  fontSize: 56,
                  color: "var(--color-crimson)",
                  transform: "rotate(-8deg)",
                  textShadow: "3px 3px 0 var(--color-ink)",
                  animation: "arrow-wiggle 0.8s ease-in-out infinite alternate",
                }}
              >
                ☞
              </span>

              <button
                onClick={handleBuy}
                className="font-tattoo relative cursor-pointer"
                style={{
                  padding: "24px 44px",
                  background: "linear-gradient(180deg, #f7c234 0%, #e0a91d 100%)",
                  color: "var(--color-ink)",
                  border: "4px solid var(--color-ink)",
                  fontSize: 36,
                  letterSpacing: "0.04em",
                  boxShadow: "8px 8px 0 var(--color-crimson), 8px 8px 0 4px var(--color-ink)",
                  lineHeight: 1,
                }}
              >
                ORDER NOW
                <span
                  aria-hidden
                  className="font-jp absolute"
                  style={{
                    top: -16,
                    right: -18,
                    fontSize: 20,
                    color: "var(--color-crimson)",
                    textShadow: "2px 2px 0 var(--color-ink)",
                    transform: "rotate(10deg)",
                  }}
                >
                  <JP en="shinsaku — new release / latest work">新作</JP>!
                </span>
              </button>

              <span
                aria-hidden
                className="font-tattoo hidden sm:inline"
                style={{
                  fontSize: 56,
                  color: "var(--color-crimson)",
                  transform: "rotate(8deg) scaleX(-1)",
                  textShadow: "3px 3px 0 var(--color-ink)",
                  animation: "arrow-wiggle 0.8s ease-in-out infinite alternate",
                }}
              >
                ☞
              </span>
            </div>

            <div
              className="mt-7 font-mono"
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.34em",
                color: "var(--color-ink-soft)",
              }}
            >
              PAYPAL · CARD · GUEST · DHL WORLDWIDE
            </div>
          </div>

          {/* big crimson levitating starburst — pinned to inner frame's top-right.
             Hidden on mobile (the giant ORDER NOW button does the same job
             without crashing into the title). */}
          <div
            className="absolute hidden lg:block"
            style={{
              right: -16,
              top: 0,
              zIndex: 2,
              filter: "drop-shadow(4px 4px 0 var(--color-ink))",
              animation: "star-levitate 3.4s ease-in-out infinite",
            }}
          >
            <JP en="yoyaku — pre-order / reservation" bare>
              <svg width="170" height="170" viewBox="0 0 100 100">
                <polygon
                  points="50,0 57,14 70,4 68,20 86,16 78,32 96,38 80,48 96,62 76,64 84,82 64,76 66,96 50,84 34,96 36,76 16,82 24,64 4,62 20,48 4,38 22,32 14,16 32,20 30,4 43,14"
                  fill="var(--color-crimson)"
                  stroke="var(--color-ink)"
                  strokeWidth={2.5}
                  strokeLinejoin="round"
                />
                <text
                  x="50"
                  y="40"
                  textAnchor="middle"
                  fontFamily="var(--font-jp)"
                  fontWeight={900}
                  fontSize="22"
                  fill="var(--color-paper)"
                >
                  予約
                </text>
                <text
                  x="50"
                  y="58"
                  textAnchor="middle"
                  fontFamily="var(--font-tattoo)"
                  fontWeight={700}
                  fontSize="14"
                  fill="var(--color-gold)"
                >
                  NOW!
                </text>
                <text
                  x="50"
                  y="72"
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize="9"
                  fontWeight={800}
                  fill="var(--color-paper)"
                  letterSpacing="0.2em"
                >
                  VOL.01
                </text>
              </svg>
            </JP>
          </div>
        </div>
      </div>
    </section>
  );
}
