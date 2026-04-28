"use client";

/* PrintSpecs — homepage spec sheet section. Combines the lab's V17 Size
   Guide (left column: A5 measurement badge + 4 size rows) with V18 Deep
   Specs (right column: 11 collector-spec rows) into a single editorial
   block. Cream paper + ink rules + crimson mono keys, same vocabulary as
   the rest of the live site.

   TODO: Tony to confirm real numbers. Current copy is the lab stub —
   paper weight, edition figures, weight, provenance month all need
   verification before launch. */

const INK = "#1a1a1a";
const CREAM = "#ECE4D0";
const CRIMSON = "#d7322e";
const GOLD = "#F7C234";

const SIZE_ROWS = [
  { k: "DIMENSIONS", v: "148 × 210 mm / 5.8 × 8.3 in (A5)" },
  { k: "FITS FRAME", v: "IKEA RIBBA 5×7″, standard A5 magnetic, any custom A5 mount" },
  { k: "SHIPS IN", v: "Rigid mailer box, foam-wrapped. No folds, no creases." },
  { k: "WEIGHT", v: "750 g / 1.65 lb packed, 15-print set" },
];

const DEEP_SPECS = [
  { k: "PAPER", v: "Fedrigoni 300gsm cream" },
  { k: "INK", v: "Pantone archival, 4-color registration" },
  { k: "EDITION", v: "100 numbered sets · 15 prints each · 1,500 total" },
  { k: "SIGNATURE", v: "Hand-signed by Tony Decay, ink" },
  { k: "NUMBERING", v: "x / 100 · stamped + handwritten" },
  { k: "CERTIFICATE", v: "Printed on 180gsm, embossed studio seal" },
  { k: "PACKAGING", v: "Rigid mailer · foam-wrap · crease-proof" },
  { k: "SHIPPING", v: "DHL worldwide, 5-7 business days" },
  { k: "PROVENANCE", v: "Studio: Lima, PE · Pulled: May 2026" },
  { k: "NO", v: "AI, reruns, digital copies, secondary market" },
];

export function PrintSpecs() {
  return (
    <section
      id="specs"
      className="relative w-full"
      style={{
        background: "var(--color-paper)",
      }}
    >
      <div className="mx-auto max-w-6xl px-7 py-14 sm:px-10 sm:py-20 2xl:max-w-[1400px]">
        {/* Header */}
        <div className="mb-10">
          <span
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.32em",
              fontWeight: 800,
              color: CRIMSON,
            }}
          >
            SPECS · 規格 · the data
          </span>
          <h2
            className="mt-2"
            style={{
              fontFamily: "var(--font-tattoo), sans-serif",
              fontSize: "clamp(2.6rem, 8vw, 5.5rem)",
              color: INK,
              lineHeight: 0.9,
              letterSpacing: "0.005em",
            }}
          >
            PRINT SPECS
          </h2>
          <p
            className="mt-3 max-w-xl"
            style={{
              fontFamily: "var(--font-display), serif",
              fontStyle: "italic",
              fontSize: 16,
              lineHeight: 1.55,
              color: "rgba(26,26,26,0.7)",
            }}
          >
            Everything you&rsquo;d ask before paying $300 — paper, edition, packaging, provenance.
            No ambiguity.
          </p>
        </div>

        {/* Two columns: size guide (left) + deep specs (right) */}
        <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-14">
          {/* LEFT — Size guide */}
          <div>
            <div
              className="mb-6"
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 10,
                letterSpacing: "0.4em",
                fontWeight: 800,
                color: "rgba(26,26,26,0.55)",
              }}
            >
              SIZE GUIDE · 寸法
            </div>

            {/* A5 badge */}
            <div
              className="relative mx-auto mb-8"
              style={{
                aspectRatio: "148 / 210",
                maxWidth: 260,
                width: "100%",
                background: "#fffef8",
                border: `4px solid ${INK}`,
                boxShadow: `8px 8px 0 ${GOLD}, 8px 8px 0 2px ${INK}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div className="text-center">
                <div
                  style={{
                    fontFamily: "var(--font-tattoo), sans-serif",
                    fontSize: 100,
                    lineHeight: 0.85,
                    color: INK,
                    letterSpacing: "0.02em",
                  }}
                >
                  A5
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: 12,
                    letterSpacing: "0.28em",
                    fontWeight: 800,
                    color: CRIMSON,
                    marginTop: 8,
                  }}
                >
                  148 × 210 mm
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display), serif",
                    fontStyle: "italic",
                    fontSize: 13,
                    color: "rgba(26,26,26,0.6)",
                    marginTop: 2,
                  }}
                >
                  5.8 × 8.3 inches
                </div>
              </div>

              {/* Dimension arrows */}
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  top: -22,
                  left: 0,
                  right: 0,
                  textAlign: "center",
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 10,
                  letterSpacing: "0.28em",
                  fontWeight: 800,
                  color: CRIMSON,
                }}
              >
                ← 148 mm →
              </span>
              <span
                aria-hidden
                className="hidden sm:inline"
                style={{
                  position: "absolute",
                  top: "50%",
                  right: -56,
                  transform: "translateY(-50%) rotate(90deg)",
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 10,
                  letterSpacing: "0.28em",
                  fontWeight: 800,
                  color: CRIMSON,
                }}
              >
                ← 210 mm →
              </span>
            </div>

            {/* Size rows */}
            <div className="flex flex-col gap-5">
              {SIZE_ROWS.map((row) => (
                <div
                  key={row.k}
                  style={{
                    borderBottom: "1px dashed rgba(26,26,26,0.3)",
                    paddingBottom: 12,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: 10,
                      letterSpacing: "0.32em",
                      fontWeight: 800,
                      color: CRIMSON,
                      marginBottom: 6,
                    }}
                  >
                    {row.k}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-display), serif",
                      fontSize: 16,
                      lineHeight: 1.45,
                      color: INK,
                    }}
                  >
                    {row.v}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Deep specs */}
          <div>
            <div
              className="mb-6"
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 10,
                letterSpacing: "0.4em",
                fontWeight: 800,
                color: "rgba(26,26,26,0.55)",
              }}
            >
              COLLECTOR SPECS · 詳細
            </div>

            <dl
              className="grid gap-x-10 gap-y-0 md:grid-cols-2"
              style={{
                background: CREAM,
                border: `2px solid ${INK}`,
                padding: "10px 22px",
              }}
            >
              {DEEP_SPECS.map((s) => (
                <div
                  key={s.k}
                  className="py-4"
                  style={{ borderBottom: "1px solid rgba(26,26,26,0.18)" }}
                >
                  <dt
                    style={{
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: 10,
                      letterSpacing: "0.32em",
                      fontWeight: 800,
                      color: CRIMSON,
                      marginBottom: 5,
                    }}
                  >
                    {s.k}
                  </dt>
                  <dd
                    style={{
                      fontFamily: "var(--font-display), serif",
                      fontStyle: "italic",
                      fontSize: 15,
                      color: INK,
                      margin: 0,
                      lineHeight: 1.45,
                    }}
                  >
                    {s.v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
