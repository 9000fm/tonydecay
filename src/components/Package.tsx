"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { PACKAGE_IMAGES } from "@/lib/constants";

export function Package() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading + description — scale + Y combo, no lazy fade
      gsap.fromTo(
        [headingRef.current, descRef.current],
        { opacity: 0, scale: 0.92, y: 40 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // Packaging items — big scale-up + Y stagger with parallax retained
      const items = itemRefs.current.filter(Boolean);
      items.forEach((item, i) => {
        if (!item) return;
        gsap.fromTo(
          item,
          { opacity: 0, scale: 0.85, y: 60 + i * 20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );

        // Subtle parallax on scroll
        gsap.to(item, {
          y: -20 - i * 10,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="package" className="relative py-24 sm:py-32 bg-cream text-text-dark">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[1px] bg-accent/40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2
          ref={headingRef}
          className="text-3xl sm:text-4xl md:text-5xl font-light text-center mb-4 tracking-tight opacity-0"
        >
          The Package
        </h2>
        <p
          ref={descRef}
          className="text-text-dark-secondary text-center mb-16 max-w-lg mx-auto opacity-0"
        >
          Every collection comes in custom craft packaging designed by Tony
          Decay. Each set is carefully packed and shipped worldwide via DHL.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PACKAGE_IMAGES.map((src, i) => (
            <div
              key={i}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className="aspect-square opacity-0 relative overflow-hidden group"
            >
              <Image
                src={src}
                alt={i === 0 ? "Unboxing" : i === 1 ? "Contents" : "Detail"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/60 to-transparent" />
              <span className="absolute bottom-4 left-4 text-text/70 text-xs tracking-[0.2em] uppercase">
                {i === 0 ? "Unboxing" : i === 1 ? "Contents" : "Detail"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-[1px] bg-accent/40" />
    </section>
  );
}
