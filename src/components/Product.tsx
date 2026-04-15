"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { PRICE_USD, TOTAL_INVENTORY, PLACEHOLDER_PRINTS } from "@/lib/constants";

export function Product() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.fromTo(headingRef.current,
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 1, ease: "power3.out",
            scrollTrigger: { trigger: headingRef.current, start: "top 90%", toggleActions: "play none none none" } }
        );
      }
      if (detailsRef.current) {
        gsap.fromTo(detailsRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.9, delay: 0.15, ease: "power3.out",
            scrollTrigger: { trigger: detailsRef.current, start: "top 88%", toggleActions: "play none none none" } }
        );
      }
      // Scroll-triggered card fan animation — cards start stacked flat, fan out
      if (cardsRef.current) {
        const cards = Array.from(cardsRef.current.children) as HTMLElement[];
        const rotations = [-12, -6, 0, 6, 12];
        const xOffsets = [-36, -18, 0, 18, 36];
        const yOffsets = [12, 6, 0, -6, -12];

        cards.forEach((card, i) => {
          gsap.fromTo(card,
            { opacity: 0, rotation: 0, x: 0, y: 60 },
            {
              opacity: 1,
              rotation: rotations[i] || 0,
              x: xOffsets[i] || 0,
              y: yOffsets[i] || 0,
              duration: 0.9,
              delay: i * 0.08,
              ease: "power3.out",
              scrollTrigger: { trigger: cardsRef.current, start: "top 85%", toggleActions: "play none none none" },
            }
          );
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const featured = [
    PLACEHOLDER_PRINTS[0], PLACEHOLDER_PRINTS[3], PLACEHOLDER_PRINTS[6],
    PLACEHOLDER_PRINTS[9], PLACEHOLDER_PRINTS[12],
  ];

  const features = [
    "15 A5 art prints on 300gsm paper",
    "Signed & numbered certificate",
    "Custom collector packaging",
    "Free worldwide shipping",
  ];

  return (
    <section
      ref={sectionRef}
      id="package"
      className="bg-paper section-fade-to-dark relative py-24 sm:py-32 overflow-hidden"
    >
      {/* Massive brutalist heading — truly edge-to-edge */}
      <div className="px-0 overflow-hidden">
        <h2
          ref={headingRef}
          className="font-tattoo text-[6rem] sm:text-[9rem] md:text-[13rem] lg:text-[17rem] xl:text-[20rem] text-ink uppercase leading-[0.78] tracking-tighter opacity-0"
          style={{ marginLeft: "-0.04em" }}
        >
          THE
          <br />
          COLLEC
          <span className="hidden sm:inline">TION</span>
          <span className="sm:hidden">
            <br />
            TION
          </span>
        </h2>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div
          ref={detailsRef}
          className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20 items-start opacity-0"
        >
          {/* Left — product info */}
          <div>
            <p className="font-sans text-ink-soft text-base sm:text-lg leading-relaxed mb-8">
              100 numbered sets. Each hand-signed by Tony Decay, printed on
              heavyweight cream stock. Once they&apos;re gone, they&apos;re gone.
            </p>

            <div className="space-y-2.5">
              {features.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 shrink-0 rounded-full bg-ink" />
                  <span className="font-sans text-sm sm:text-base text-ink-soft">{item}</span>
                </div>
              ))}
            </div>

            <button className="mt-8 font-sans text-sm font-medium uppercase tracking-[0.15em] bg-ink text-paper px-8 py-3.5 hover:bg-royal transition-colors duration-300">
              Secure yours - ${PRICE_USD}
            </button>

            <div className="mt-12 text-center sm:text-left">
              <p className="font-tattoo text-3xl text-ink tracking-tight">
                {TOTAL_INVENTORY}/{TOTAL_INVENTORY}
              </p>
              <p className="font-mono text-[10px] text-ink-faint uppercase tracking-[0.2em] mt-1">
                sets remaining
              </p>
            </div>
          </div>

          {/* Right — fanned print cards with scroll animation */}
          <div className="relative flex justify-center md:justify-end mt-16">
            <div ref={cardsRef} className="relative w-52 sm:w-60 md:w-72" style={{ aspectRatio: "3/4" }}>
              {featured.map((print, i) => (
                <div
                  key={print.id}
                  className="absolute inset-0 overflow-hidden shadow-2xl"
                  style={{ zIndex: featured.length - i }}
                >
                  <Image
                    src={print.src}
                    alt={print.alt}
                    fill
                    className="object-cover"
                    sizes="288px"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
