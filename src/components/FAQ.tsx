"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

/* eslint-disable @typescript-eslint/no-unused-vars */

const faqs = [
  {
    question: "What's included in the collection?",
    answer:
      "Each set includes 15 exclusive A5 art prints on 300gsm cream paper and a hand-signed, numbered certificate of authenticity (1/100 to 100/100). Everything comes in custom-designed collector packaging.",
  },
  {
    question: "Where do you ship to?",
    answer:
      "Worldwide via DHL. Shipping is included in the $300 price - no extra fees, no surprises.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Orders ship within 5–7 business days. International delivery via DHL typically takes 1–2 weeks depending on your location.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "PayPal and credit/debit cards through PayPal checkout. No PayPal account required - you can pay as a guest.",
  },
  {
    question: "What's your refund policy?",
    answer:
      "All sales are final due to the limited edition nature of this collection. If your order arrives damaged, contact us within 7 days with photos and we'll sort it out.",
  },
  {
    question: "Is this official merchandise?",
    answer:
      "This is original fan art by Tony Decay. Not affiliated with, endorsed by, or connected to any franchise or company.",
  },
];

function AccordionItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: (typeof faqs)[0];
  isOpen: boolean;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const content = contentRef.current;
    const inner = innerRef.current;
    if (!content || !inner) return;

    if (isOpen) {
      const height = inner.offsetHeight;
      gsap.fromTo(
        content,
        { height: 0, opacity: 0 },
        { height, opacity: 1, duration: 0.5, ease: "power3.out" }
      );
    } else {
      gsap.to(content, {
        height: 0,
        opacity: 0,
        duration: 0.35,
        ease: "power3.inOut",
      });
    }
  }, [isOpen]);

  return (
    <div className="border-b-2 border-paper/30 last:border-b-0 px-4 sm:px-6">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 sm:py-6 text-left group"
      >
        <span className="font-sans text-base sm:text-lg text-paper/80 group-hover:text-paper transition-colors duration-300 pr-6">
          {faq.question}
        </span>
        <span
          className="text-paper/40 shrink-0 relative inline-block transition-transform duration-300 ease-out"
          style={{
            width: 16,
            height: 16,
            transform: `rotate(${isOpen ? 45 : 0}deg)`,
          }}
          aria-hidden
        >
          <span
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-current"
            style={{ width: 16, height: 1.5 }}
          />
          <span
            className="absolute left-1/2 top-0 -translate-x-1/2 bg-current"
            style={{ width: 1.5, height: 16 }}
          />
        </span>
      </button>
      <div ref={contentRef} className="overflow-hidden" style={{ height: 0 }}>
        <p
          ref={innerRef}
          className="pb-6 sm:pb-7 text-paper/50 text-sm sm:text-base leading-relaxed max-w-2xl"
        >
          {faq.answer}
        </p>
      </div>
    </div>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const handleToggle = useCallback(
    (index: number) => {
      setOpenIndex(openIndex === index ? null : index);
    },
    [openIndex]
  );

  return (
    <section
      ref={sectionRef}
      id="faq"
      data-nav-dark="true"
      className="relative py-20 sm:py-28 overflow-hidden bg-bg border-b-2 border-paper"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="inline-block border-2 border-paper px-3 py-1 font-mono text-paper uppercase mb-6 sm:mb-8" style={{ fontSize: 10, letterSpacing: "0.22em" }}>
          Questions / Answers
        </div>
        <h2
          ref={headingRef}
          className="font-tattoo text-paper uppercase tracking-tighter leading-[0.82]"
          style={{ fontSize: "clamp(3rem, 12vw, 9rem)" }}
        >
          FAQ
        </h2>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-10 sm:mt-14">
        <div className="border-2 border-paper">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={faq.question}
              faq={faq}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
