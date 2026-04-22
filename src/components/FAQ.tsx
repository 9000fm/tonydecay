"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

const faqs = [
  {
    question: "What's in the set?",
    answer:
      "15 A5 art prints on 300gsm cream paper, a hand-signed numbered certificate (x/100), and custom collector packaging.",
    color: "#FFE066",
    rotate: -4,
  },
  {
    question: "Where do you ship?",
    answer: "Worldwide via DHL. $300 includes shipping — no extra fees.",
    color: "#F2A2BC",
    rotate: 3,
  },
  {
    question: "How fast does it arrive?",
    answer:
      "Ships in 5–7 business days. DHL international usually 1–2 weeks depending on location.",
    color: "#9DD4FF",
    rotate: -2,
  },
  {
    question: "How do I pay?",
    answer: "PayPal or credit/debit via PayPal checkout (guest pay works, no account needed).",
    color: "#A8E6A3",
    rotate: 5,
  },
  {
    question: "Refunds?",
    answer:
      "All sales final due to limited edition. Damaged on arrival? Email within 7 days with photos — we'll handle it.",
    color: "#FFBE76",
    rotate: -3,
  },
  {
    question: "Is this official merch?",
    answer: "No. Original fan art by Tony Decay. Not affiliated with any franchise.",
    color: "#D4A5FF",
    rotate: 4,
  },
];

function PostItNote({
  faq,
  index,
  isOpen,
  onToggle,
}: {
  faq: (typeof faqs)[0];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const answerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const content = answerRef.current;
    const inner = innerRef.current;
    if (!content || !inner) return;
    if (isOpen) {
      const height = inner.offsetHeight;
      gsap.fromTo(
        content,
        { height: 0, opacity: 0 },
        { height, opacity: 1, duration: 0.4, ease: "power3.out" },
      );
    } else {
      gsap.to(content, {
        height: 0,
        opacity: 0,
        duration: 0.25,
        ease: "power3.inOut",
      });
    }
  }, [isOpen]);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      aria-expanded={isOpen}
      className="group relative cursor-pointer transition-transform duration-200 select-none hover:scale-[1.03] hover:rotate-0"
      style={{
        background: faq.color,
        transform: `rotate(${faq.rotate}deg)`,
        boxShadow: "6px 8px 16px rgba(26,26,26,0.22)",
        border: "1px solid rgba(26,26,26,0.12)",
        minHeight: 180,
      }}
    >
      {/* Tape strip */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          top: -14,
          width: 76,
          height: 22,
          background: "rgba(247, 194, 52, 0.6)",
          border: "1px solid rgba(26,26,26,0.25)",
          transform: "rotate(-3deg)",
        }}
        aria-hidden
      />
      {/* Click affordance — soft plus/x toggle, top-right, animates smoothly */}
      <div
        aria-hidden
        className="pointer-events-none absolute flex items-center justify-center transition-transform duration-300 ease-out group-hover:scale-110"
        style={{
          top: 14,
          right: 14,
          width: 46,
          height: 46,
          borderRadius: "50%",
          background: "var(--color-ink)",
          color: "var(--color-paper)",
          boxShadow: "3px 3px 0 rgba(26,26,26,0.3)",
          transform: isOpen ? "rotate(135deg)" : "rotate(0deg)",
          transition: "transform 420ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 200ms ease",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <line
            x1="12"
            y1="5"
            x2="12"
            y2="19"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <line
            x1="5"
            y1="12"
            x2="19"
            y2="12"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div
        className="flex w-full flex-col items-start text-left"
        style={{ padding: "24px 76px 18px 22px" }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.28em",
            fontWeight: 800,
            color: "rgba(26,26,26,0.55)",
            marginBottom: 8,
          }}
        >
          Q.{String(index + 1).padStart(2, "0")}
        </span>
        <span
          style={{
            fontFamily: "var(--font-display), serif",
            fontSize: 20,
            lineHeight: 1.25,
            color: "var(--color-ink)",
          }}
        >
          {faq.question}
        </span>
      </div>
      <div ref={answerRef} className="overflow-hidden" style={{ height: 0 }}>
        <p
          ref={innerRef}
          style={{
            padding: "0 20px 20px",
            fontFamily: "var(--font-sans), sans-serif",
            fontSize: 14,
            lineHeight: 1.55,
            color: "rgba(26,26,26,0.78)",
            margin: 0,
            borderTop: "1px dashed rgba(26,26,26,0.25)",
            paddingTop: 14,
          }}
        >
          {faq.answer}
        </p>
      </div>
    </div>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const handleToggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  return (
    <section
      id="faq"
      className="relative w-full overflow-hidden"
      style={{
        background: "#2B2A3A",
        borderBottom: "3px solid var(--color-ink)",
      }}
    >
      {/* Corkboard-style subtle texture via repeating noise pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(240,235,220,0.05) 1.5px, transparent 2px), radial-gradient(circle at 80% 70%, rgba(240,235,220,0.05) 1.5px, transparent 2px)",
          backgroundSize: "60px 60px, 80px 80px",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-7 py-14 sm:px-10 sm:py-20">
        <div className="mb-10 flex flex-col gap-2">
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
        </div>

        {/* Post-it pile */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 lg:gap-10">
          {faqs.map((faq, index) => (
            <PostItNote
              key={faq.question}
              faq={faq}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>

        <p
          className="mt-14 text-center"
          style={{
            fontFamily: "var(--font-display), serif",
            fontStyle: "italic",
            fontSize: 16,
            color: "rgba(240,235,220,0.7)",
          }}
        >
          — still stuck? drop a note below ↓
        </p>
      </div>
    </section>
  );
}
