"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const faqs = [
  {
    question: "What's included in the collection?",
    answer:
      "Each collection includes 15 exclusive mini art prints and a hand-signed, numbered certificate of authenticity (1/100 to 100/100). All prints come in custom-designed craft packaging.",
  },
  {
    question: "Where do you ship to?",
    answer:
      "We ship worldwide via DHL. Shipping is included in the $300 price — no extra fees.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Orders ship within 5-7 business days. International delivery via DHL typically takes 1-2 weeks depending on your location.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept PayPal and credit/debit cards through PayPal checkout. No PayPal account required — you can pay as a guest.",
  },
  {
    question: "What's your refund policy?",
    answer:
      "All sales are final due to the limited edition nature of this collection. If your order arrives damaged, contact us within 7 days of delivery with photos. We'll work with you on a replacement or partial refund.",
  },
  {
    question: "Is this official merchandise?",
    answer:
      "This is original fan art created by Tony Decay. It is not affiliated with, endorsed by, or connected to any franchise or company. Each piece is an original artistic interpretation.",
  },
];

export function FAQ() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const itemRefs = useRef<(HTMLDetailsElement | null)[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        // Heading — scale + Y combo
        gsap.fromTo(
          headingRef.current,
          { opacity: 0, scale: 0.92, y: 40 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      const items = itemRefs.current.filter(Boolean);
      // Items slide in from the LEFT — different direction than other sections for variety
      gsap.fromTo(
        items,
        { opacity: 0, x: -40, scale: 0.95 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section ref={sectionRef} id="faq" data-nav-dark="true" className="relative py-24 sm:py-32 bg-bg-alt">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[1px] bg-accent/40" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h2
          ref={headingRef}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-16 tracking-tight opacity-0"
        >
          FAQ
        </h2>

        <div className="space-y-0 divide-y divide-border/50">
          {faqs.map((faq, index) => (
            <details
              key={faq.question}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              open={openIndex === index}
              className="group py-6 opacity-0"
              onClick={(e) => {
                e.preventDefault();
                handleToggle(index);
              }}
            >
              <summary className="flex items-center justify-between cursor-pointer list-none text-base sm:text-lg font-medium text-text-secondary hover:text-text transition-colors duration-300">
                {faq.question}
                <span
                  className={`text-accent/60 ml-4 text-lg transition-transform duration-300 ${
                    openIndex === index ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </summary>
              {openIndex === index && (
                <p className="mt-4 text-text-muted leading-relaxed text-sm">
                  {faq.answer}
                </p>
              )}
            </details>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-[1px] bg-accent/40" />
    </section>
  );
}
