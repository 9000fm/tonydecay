"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

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
        { height, opacity: 1, duration: 0.5, ease: "power3.out" },
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
    <div className="border-paper/30 border-b-2 px-4 last:border-b-0 sm:px-6">
      <button
        onClick={onToggle}
        className="group flex w-full items-center justify-between py-5 text-left sm:py-6"
      >
        <span className="text-paper/80 group-hover:text-paper pr-6 font-sans text-base transition-colors duration-300 sm:text-lg">
          {faq.question}
        </span>
        <span
          className="text-paper/40 relative inline-block shrink-0 transition-transform duration-300 ease-out"
          style={{
            width: 16,
            height: 16,
            transform: `rotate(${isOpen ? 45 : 0}deg)`,
          }}
          aria-hidden
        >
          <span
            className="absolute top-1/2 left-0 -translate-y-1/2 bg-current"
            style={{ width: 16, height: 1.5 }}
          />
          <span
            className="absolute top-0 left-1/2 -translate-x-1/2 bg-current"
            style={{ width: 1.5, height: 16 }}
          />
        </span>
      </button>
      <div ref={contentRef} className="overflow-hidden" style={{ height: 0 }}>
        <p
          ref={innerRef}
          className="text-paper/50 max-w-2xl pb-6 text-sm leading-relaxed sm:pb-7 sm:text-base"
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
    [openIndex],
  );

  return (
    <section
      ref={sectionRef}
      id="faq"
      data-nav-dark="true"
      className="bg-bg border-paper relative overflow-hidden border-b-2 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div
          className="border-paper text-paper mb-6 inline-block border-2 px-3 py-1 font-mono uppercase sm:mb-8"
          style={{ fontSize: 10, letterSpacing: "0.22em" }}
        >
          Questions / Answers
        </div>
        <h2
          ref={headingRef}
          className="font-tattoo text-paper leading-[0.82] tracking-tighter uppercase"
          style={{ fontSize: "clamp(3rem, 12vw, 9rem)" }}
        >
          FAQ
        </h2>
      </div>

      <div className="mx-auto mt-10 max-w-4xl px-4 sm:mt-14 sm:px-6">
        <div className="border-paper border-2">
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
