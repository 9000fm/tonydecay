"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "@/lib/gsap";

/* FAQ — STACKED CARDS variant.
   Each Q+A is one full-viewport card. As the user scrolls, the next
   card's bottom edge meets the current card's top edge and pushes it
   off-screen (GSAP ScrollTrigger pin with pinSpacing:false — same
   pattern as /lab/stacked-anchors). Six cards = ~6 viewport-heights
   of scroll for the section. */

const faqs = [
  {
    question: "What's in the set?",
    answer:
      "15 A5 art prints on 300gsm cream paper, a hand-signed numbered certificate (x/100), and custom collector packaging.",
    bg: "#FFE066",
    fg: "#1a1a1a",
    accent: "#d7322e",
  },
  {
    question: "Where do you ship?",
    answer: "Worldwide via DHL. $300 includes shipping — no extra fees.",
    bg: "#F2A2BC",
    fg: "#1a1a1a",
    accent: "#2B5DAE",
  },
  {
    question: "How fast does it arrive?",
    answer:
      "Ships in 5–7 business days. DHL international usually 1–2 weeks depending on location.",
    bg: "#9DD4FF",
    fg: "#1a1a1a",
    accent: "#d7322e",
  },
  {
    question: "How do I pay?",
    answer: "PayPal or credit/debit via PayPal checkout (guest pay works, no account needed).",
    bg: "#A8E6A3",
    fg: "#1a1a1a",
    accent: "#d7322e",
  },
  {
    question: "Refunds?",
    answer:
      "All sales final due to limited edition. Damaged on arrival? Email within 7 days with photos — we'll handle it.",
    bg: "#FFBE76",
    fg: "#1a1a1a",
    accent: "#d7322e",
  },
  {
    question: "Is this official merch?",
    answer: "No. Original fan art by Tony Decay. Not affiliated with any franchise.",
    bg: "#D4A5FF",
    fg: "#1a1a1a",
    accent: "#1a1a1a",
  },
];

export function FAQ() {
  const stackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stack = stackRef.current;
    if (!stack) return;
    const cards = Array.from(stack.querySelectorAll<HTMLElement>("[data-faq-card]"));
    if (!cards.length) return;

    const triggers: ScrollTrigger[] = [];
    cards.forEach((card, i) => {
      const next = cards[i + 1];
      const t = ScrollTrigger.create({
        trigger: card,
        start: "top top",
        endTrigger: next ?? card,
        end: next ? "top top" : "bottom top",
        pin: true,
        pinSpacing: false,
        invalidateOnRefresh: true,
      });
      triggers.push(t);
    });

    const ro = new ResizeObserver(() => ScrollTrigger.refresh());
    ro.observe(document.body);

    return () => {
      triggers.forEach((t) => t.kill());
      ro.disconnect();
    };
  }, []);

  return (
    <section id="faq" className="relative w-full" style={{ background: "#2B2A3A" }}>
      {/* Corkboard-style subtle texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(240,235,220,0.05) 1.5px, transparent 2px), radial-gradient(circle at 80% 70%, rgba(240,235,220,0.05) 1.5px, transparent 2px)",
          backgroundSize: "60px 60px, 80px 80px",
        }}
        aria-hidden
      />

      {/* Intro */}
      <div className="relative mx-auto max-w-6xl px-7 pt-14 pb-10 sm:px-10 sm:pt-20 sm:pb-14">
        <div className="flex flex-col gap-2">
          <span
            style={{
              fontFamily: "var(--font-display), serif",
              fontStyle: "italic",
              fontSize: 18,
              color: "var(--color-gold)",
              transform: "rotate(-1.5deg)",
              alignSelf: "flex-start",
            }}
          >
            — frequently asked
          </span>
          <h2
            style={{
              fontFamily: "var(--font-tattoo), sans-serif",
              fontSize: "clamp(3rem, 11vw, 8rem)",
              color: "var(--color-paper)",
              lineHeight: 0.88,
            }}
          >
            FAQ
          </h2>
          <span
            style={{
              fontFamily: "var(--font-jp), var(--font-tattoo), sans-serif",
              fontSize: 24,
              color: "var(--color-gold)",
              marginTop: 2,
            }}
          >
            質問
          </span>
          <p
            className="mt-4"
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.32em",
              fontWeight: 800,
              color: "rgba(240,235,220,0.55)",
            }}
          >
            ↓ SCROLL · {faqs.length} CARDS
          </p>
        </div>
      </div>

      {/* THE STACK */}
      <div ref={stackRef} className="relative">
        {faqs.map((faq, i) => (
          <article
            key={faq.question}
            data-faq-card
            style={{
              position: "relative",
              minHeight: "100svh",
              height: "100svh",
              background: faq.bg,
              color: faq.fg,
              padding: "clamp(28px, 5vw, 64px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              overflow: "hidden",
              borderTop: "2px solid var(--color-ink)",
              zIndex: i + 1,
            }}
          >
            {/* Top — Q.XX number + tape strip */}
            <div className="flex items-start justify-between gap-6">
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: 11,
                    letterSpacing: "0.4em",
                    fontWeight: 800,
                    color: "rgba(26,26,26,0.5)",
                  }}
                >
                  Q.{String(i + 1).padStart(2, "0")} / {String(faqs.length).padStart(2, "0")}
                </div>
                <h3
                  className="mt-3"
                  style={{
                    fontFamily: "var(--font-display), serif",
                    fontSize: "clamp(2rem, 6vw, 4.2rem)",
                    color: faq.fg,
                    lineHeight: 1.05,
                    letterSpacing: "0.005em",
                    maxWidth: "16ch",
                  }}
                >
                  {faq.question}
                </h3>
              </div>
              {/* Sticker label — tape-strip style top right */}
              <div
                aria-hidden
                style={{
                  background: faq.accent,
                  color: "var(--color-paper)",
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 10,
                  letterSpacing: "0.3em",
                  fontWeight: 800,
                  padding: "5px 10px",
                  border: "2px solid var(--color-ink)",
                  boxShadow: "3px 3px 0 var(--color-ink)",
                  transform: "rotate(4deg)",
                  whiteSpace: "nowrap",
                }}
              >
                FAQ · 質問
              </div>
            </div>

            {/* Bottom — answer + footer */}
            <div className="flex items-end justify-between gap-6">
              <p
                className="max-w-xl"
                style={{
                  fontFamily: "var(--font-display), serif",
                  fontStyle: "italic",
                  fontSize: "clamp(17px, 1.8vw, 22px)",
                  lineHeight: 1.5,
                  color: faq.fg,
                  opacity: 0.92,
                }}
              >
                {faq.answer}
              </p>
              <div
                style={{
                  fontFamily: "var(--font-arcade), sans-serif",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  color: faq.accent,
                  letterSpacing: "0.04em",
                  textShadow: `2px 2px 0 ${faq.fg}`,
                  whiteSpace: "nowrap",
                }}
              >
                N°{String(i + 1).padStart(2, "0")}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Outro — stack complete */}
      <div className="relative mx-auto max-w-6xl px-7 py-16 sm:px-10 sm:py-24">
        <p
          className="text-center"
          style={{
            fontFamily: "var(--font-display), serif",
            fontStyle: "italic",
            fontSize: 18,
            color: "rgba(240,235,220,0.78)",
          }}
        >
          — still stuck? drop a note below ↓
        </p>
      </div>
    </section>
  );
}
