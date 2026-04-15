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
      "Worldwide via DHL. Shipping is included in the $300 price — no extra fees, no surprises.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Orders ship within 5–7 business days. International delivery via DHL typically takes 1–2 weeks depending on your location.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "PayPal and credit/debit cards through PayPal checkout. No PayPal account required — you can pay as a guest.",
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
    <div className="border-t border-paper/10 last:border-b">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-6 sm:py-7 text-left group"
      >
        <span className="font-sans text-base sm:text-lg text-paper/80 group-hover:text-paper transition-colors duration-300 pr-6">
          {faq.question}
        </span>
        <span
          className="text-paper/40 text-xl shrink-0 transition-transform duration-500 ease-out"
          style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          +
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

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

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
      className="relative py-28 sm:py-36 overflow-hidden"
      style={{ backgroundColor: "#0D1B2D" }}
    >
      <div className="px-4 sm:px-8">
        <h2
          ref={headingRef}
          className="font-tattoo text-[5rem] sm:text-[8rem] md:text-[12rem] lg:text-[16rem] text-paper uppercase tracking-tighter leading-[0.78] opacity-0"
        >
          FAQ
        </h2>
      </div>

      <div className="max-w-4xl mx-auto px-6 sm:px-10 mt-12 sm:mt-16">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={faq.question}
            faq={faq}
            isOpen={openIndex === index}
            onToggle={() => handleToggle(index)}
          />
        ))}
      </div>
    </section>
  );
}
