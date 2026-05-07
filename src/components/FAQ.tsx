"use client";

import { useState } from "react";

/* FAQ — LIBRARY INDEX
   Color-coded catalog tabs on the left; a single index card on the right
   that 3D-flips when a new tab is pulled. Card accents recolor to match
   the picked tab's category color.

   Six categorized questions: Contents, Shipping, Timing, Payment,
   Returns (refunds + damaged merged), Vol II.
   The "official merch / not affiliated" disclaimer lives in the global
   footer — not in the FAQ. */

type AccentToken = "crimson" | "royal" | "gold" | "leaf" | "teal" | "coral";
const ACCENT_VAR: Record<AccentToken, string> = {
  crimson: "var(--color-crimson)",
  royal: "var(--color-royal)",
  gold: "var(--color-gold)",
  leaf: "var(--color-leaf)",
  teal: "var(--color-teal)",
  coral: "var(--color-coral)",
};

type FAQItem = {
  tab: string;
  roman: string;
  call: string;
  color: AccentToken;
  q: string;
  a: string;
};

const items: FAQItem[] = [
  {
    tab: "CONTENTS",
    roman: "I",
    call: "TD-001",
    color: "leaf",
    q: "What's in the set?",
    a: "Fifteen (15) A5 prints. 300gsm cream paper, signed numbered certificate, custom collector packaging. Vol.01.",
  },
  {
    tab: "SHIPPING",
    roman: "II",
    call: "TD-002",
    color: "royal",
    q: "Where do you ship?",
    a: "Worldwide via DHL Express. The advertised price ($300 USD) includes shipping — no additional fees on most routes.",
  },
  {
    tab: "TIMING",
    roman: "III",
    call: "TD-003",
    color: "gold",
    q: "How fast does it arrive?",
    a: "Production: five to seven (5–7) business days. International transit via DHL: one to two (1–2) weeks.",
  },
  {
    tab: "PAYMENT",
    roman: "IV",
    call: "TD-004",
    color: "teal",
    q: "How do I pay?",
    a: "PayPal or credit/debit via PayPal checkout. Guest checkout enabled — no PayPal account required.",
  },
  {
    tab: "RETURNS",
    roman: "V",
    call: "TD-005",
    color: "crimson",
    q: "Refunds & damaged sets?",
    a: "All sales final due to limited-edition status. If a set arrives damaged in transit, email within seven (7) days with photographs and we replace it.",
  },
  {
    tab: "NEXT VOL",
    roman: "VI",
    call: "TD-006",
    color: "coral",
    q: "Will there be a Vol. II?",
    a: "Maybe. Vol.01 is a 100-set edition — once it sells through, a Vol. II may follow with new prints. Subscribe below to be notified first.",
  },
];

const FLIP_MS = 720;

export function FAQ() {
  // step counts how many flips we've done. Rotation = step * 180deg.
  // Always increments → card always spins the same direction.
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState(0);
  const [locked, setLocked] = useState(false);

  // Two persistent faces. Outgoing face never re-renders mid-spin.
  const [faceA, setFaceA] = useState<FAQItem>(items[0]);
  const [faceB, setFaceB] = useState<FAQItem>(items[0]);

  const handlePick = (i: number) => {
    if (locked || i === picked) return;
    setLocked(true);
    setPicked(i);
    const nextStep = step + 1;
    if (nextStep % 2 === 0) setFaceA(items[i]);
    else setFaceB(items[i]);
    requestAnimationFrame(() => setStep(nextStep));
    window.setTimeout(() => setLocked(false), FLIP_MS + 40);
  };

  return (
    <section
      id="faq"
      className="relative w-full"
      style={{
        background: "#E8E2D0",
        color: "var(--color-ink)",
        borderTop: "3px solid var(--color-ink)",
        borderBottom: "3px solid var(--color-ink)",
      }}
    >
      {/* subtle horizontal rule paper bg */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0 27px, rgba(91,170,79,0.2) 27px 28px)",
        }}
      />

      <div className="relative mx-auto max-w-[1320px] px-7 pt-14 pb-16 sm:px-14 sm:pt-16 sm:pb-20">
        {/* Library masthead */}
        <div
          className="grid items-end gap-7 pb-5"
          style={{
            gridTemplateColumns: "1fr auto",
            borderBottom: "3px solid var(--color-leaf)",
            marginBottom: 32,
          }}
        >
          <div>
            <div
              className="mb-3 inline-block font-mono"
              style={{
                background: "var(--color-leaf)",
                color: "var(--color-paper)",
                border: "3px solid var(--color-ink)",
                padding: "5px 12px",
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.32em",
                boxShadow: "3px 3px 0 var(--color-ink)",
              }}
            >
              ※ INDEX · TONY DECAY
            </div>
            <h2
              className="font-display"
              style={{
                margin: 0,
                fontStyle: "italic",
                fontWeight: 700,
                fontSize: "clamp(48px, 7vw, 84px)",
                lineHeight: 0.92,
                color: "var(--color-ink)",
                letterSpacing: "-0.005em",
              }}
            >
              The <span style={{ color: "var(--color-leaf)" }}>Index</span> of Questions
            </h2>
          </div>
          <div
            className="text-right font-mono"
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.3em",
              color: "var(--color-ink-soft)",
              lineHeight: 1.6,
            }}
          >
            FAQ
            <br />
            06 ENTRIES
            <br />
            VOL.01
          </div>
        </div>

        {/* Filing cabinet body — tabs and card are TWO SEPARATE objects with a gap */}
        <div className="grid items-start gap-8 lg:grid-cols-[340px_1fr]">
          {/* TABS */}
          <div className="flex flex-col gap-2.5 pt-2">
            {items.map((it, i) => {
              const isPicked = i === picked;
              const accent = ACCENT_VAR[it.color];
              return (
                <button
                  key={it.tab}
                  onClick={() => handlePick(i)}
                  disabled={locked}
                  className="relative grid w-full overflow-hidden text-left"
                  style={{
                    gridTemplateColumns: "10px 44px 1fr",
                    alignItems: "stretch",
                    background: isPicked ? "#FBF6E5" : "#F4EEDA",
                    border: "2.5px solid var(--color-ink)",
                    cursor: locked ? "wait" : "pointer",
                    transform: isPicked ? "translateX(8px)" : "translateX(0)",
                    transition:
                      "transform .25s cubic-bezier(.4,0,.2,1), background .15s, box-shadow .2s",
                    boxShadow: isPicked
                      ? `4px 4px 0 ${accent}, 4px 4px 0 2px var(--color-ink)`
                      : "3px 3px 0 var(--color-ink)",
                    opacity: locked && !isPicked ? 0.7 : 1,
                  }}
                >
                  {/* category strip */}
                  <span
                    aria-hidden
                    style={{ background: accent, borderRight: "2px solid var(--color-ink)" }}
                  />

                  {/* roman numeral chip */}
                  <span
                    aria-hidden
                    className="font-display flex items-center justify-center"
                    style={{
                      background: isPicked ? accent : "transparent",
                      color: isPicked ? "var(--color-paper)" : "var(--color-ink)",
                      borderRight: "2px solid var(--color-ink)",
                      fontStyle: "italic",
                      fontWeight: 700,
                      fontSize: it.roman.length > 2 ? 18 : 24,
                      lineHeight: 1,
                      letterSpacing: "0.02em",
                      transition: "background .15s, color .15s",
                    }}
                  >
                    {it.roman}
                  </span>

                  {/* text block */}
                  <span className="block py-3 pr-4 pl-3.5">
                    <span
                      className="mb-0.5 block font-mono"
                      style={{
                        fontSize: 9.5,
                        fontWeight: 800,
                        letterSpacing: "0.32em",
                        color: accent,
                      }}
                    >
                      {it.tab} · {String(i + 1).padStart(2, "0")}/06
                    </span>
                    <span
                      className="font-tattoo block"
                      style={{
                        fontSize: 17,
                        lineHeight: 1.15,
                        color: "var(--color-ink)",
                        letterSpacing: "0.005em",
                      }}
                    >
                      {it.q}
                    </span>
                  </span>

                  {/* dog-eared corner */}
                  <span
                    aria-hidden
                    className="absolute"
                    style={{
                      top: 0,
                      right: 0,
                      width: 0,
                      height: 0,
                      borderTop: `14px solid ${isPicked ? accent : "var(--color-ink)"}`,
                      borderLeft: "14px solid transparent",
                      opacity: isPicked ? 1 : 0.7,
                    }}
                  />
                  {/* picked chevron */}
                  {isPicked && (
                    <span
                      aria-hidden
                      className="font-tattoo absolute"
                      style={{
                        right: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontSize: 22,
                        color: accent,
                        lineHeight: 1,
                      }}
                    >
                      ▸
                    </span>
                  )}
                </button>
              );
            })}

            {/* drawer footer label */}
            <div
              className="mt-2 text-center font-mono"
              style={{
                fontSize: 9.5,
                fontWeight: 800,
                letterSpacing: "0.32em",
                color: "var(--color-ink-soft)",
                paddingTop: 10,
                borderTop: "1.5px dashed var(--color-ink)",
              }}
            >
              ※ 06 / 06
            </div>
          </div>

          {/* INDEX CARD — flipping */}
          <div style={{ perspective: 2400 }}>
            <div
              className="relative w-full"
              style={{
                minHeight: 480,
                transformStyle: "preserve-3d",
                transform: `rotateY(${step * 180}deg)`,
                transition: `transform ${FLIP_MS}ms cubic-bezier(.66,.05,.31,1.05)`,
              }}
            >
              {/* FACE A — visible when step is even */}
              <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
                <IndexCard item={faceA} />
              </div>
              {/* FACE B — pre-rotated, visible when step is odd */}
              <div
                className="absolute inset-0"
                style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
              >
                <IndexCard item={faceB} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function IndexCard({ item }: { item: FAQItem }) {
  // Card recolors to match the picked tab's category accent.
  const accent = ACCENT_VAR[item.color];
  return (
    <div
      className="relative flex h-full w-full flex-col"
      style={{
        background: "#FBF6E5",
        border: "3px solid var(--color-ink)",
        boxShadow: `8px 8px 0 ${accent}, 8px 8px 0 3px var(--color-ink)`,
        padding: "32px 36px",
        backgroundImage: `repeating-linear-gradient(0deg, transparent 0 31px, ${accent}22 31px 32px)`,
        backgroundPosition: "0 50px",
      }}
    >
      {/* hole punch */}
      <div
        aria-hidden
        className="absolute"
        style={{
          top: 26,
          left: 26,
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: "#E8E2D0",
          border: "2px solid var(--color-ink)",
          boxShadow: "inset 1px 1px 0 rgba(0,0,0,0.18)",
        }}
      />

      {/* card header */}
      <div
        className="flex items-baseline justify-between"
        style={{
          paddingLeft: 60,
          paddingBottom: 8,
          borderBottom: "2px solid var(--color-ink)",
          marginBottom: 18,
        }}
      >
        <span
          className="font-mono"
          style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.3em",
            color: accent,
          }}
        >
          {item.tab} · {item.roman}
        </span>
        <span
          className="font-mono"
          style={{
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.28em",
            color: "var(--color-ink-soft)",
          }}
        >
          TONY DECAY · VOL.01
        </span>
      </div>

      {/* Q + A */}
      <h3
        className="font-display"
        style={{
          margin: "0 0 12px",
          fontWeight: 700,
          fontSize: "clamp(26px, 2.8vw, 34px)",
          lineHeight: 1.1,
          color: "var(--color-ink)",
          letterSpacing: "-0.005em",
        }}
      >
        {item.q}
      </h3>
      <p
        className="font-display"
        style={{
          margin: 0,
          fontSize: 16,
          lineHeight: 1.65,
          color: "var(--color-ink)",
        }}
      >
        {item.a}
      </p>

      {/* footer with stamp */}
      <div className="mt-auto flex items-end justify-between" style={{ paddingTop: 18 }}>
        <div
          className="font-mono"
          style={{
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.26em",
            color: "var(--color-ink-soft)",
            lineHeight: 1.6,
          }}
        >
          TONY DECAY
          <br />
          VOL.01
        </div>

        {/* STAMP — TONY DECAY (top) + 2026 (big stamped numeral) */}
        <div
          aria-hidden
          className="relative text-center font-mono"
          style={{
            padding: "8px 18px 6px",
            border: `3px double ${accent}`,
            transform: "rotate(-5deg)",
            color: accent,
            opacity: 0.92,
            filter: "contrast(1.05)",
          }}
        >
          <div
            style={{
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: "0.32em",
              paddingBottom: 2,
              borderBottom: `1.5px solid ${accent}`,
              marginBottom: 2,
            }}
          >
            TONY DECAY
          </div>
          <div
            className="font-display"
            style={{
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: 28,
              lineHeight: 1,
              letterSpacing: "0.06em",
            }}
          >
            2026
          </div>
        </div>
      </div>
    </div>
  );
}
