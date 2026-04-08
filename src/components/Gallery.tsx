"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { PLACEHOLDER_PRINTS } from "@/lib/constants";

// ─── Stacked-card carousel — used on all viewports ────────────────────────
// Front print sharp, next 2 cards visible behind it offset down + smaller +
// dimmer. Swipe / drag to advance.
function Carousel({ prints }: { prints: typeof PLACEHOLDER_PRINTS }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const isAnimating = useRef(false);

  useEffect(() => {
    const N = prints.length;
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const offset = (i - currentIndex + N) % N;
      let y = 0;
      let scale = 1;
      let opacity = 0;
      let zIndex = 0;

      if (offset === 0) {
        y = 0;
        scale = 1;
        opacity = 1;
        zIndex = 30;
      } else if (offset === 1) {
        y = 32;
        scale = 0.93;
        opacity = 0.55;
        zIndex = 20;
      } else if (offset === 2) {
        y = 60;
        scale = 0.86;
        opacity = 0.28;
        zIndex = 10;
      } else {
        y = 0;
        scale = 0.7;
        opacity = 0;
        zIndex = 0;
      }

      gsap.to(card, {
        y,
        scale,
        opacity,
        zIndex,
        duration: 0.55,
        ease: "power3.out",
      });
    });
  }, [currentIndex, prints.length]);

  const advance = useCallback(
    (direction: 1 | -1) => {
      if (isAnimating.current) return;
      isAnimating.current = true;
      setCurrentIndex((prev) => {
        const N = prints.length;
        return (prev + direction + N) % N;
      });
      setTimeout(() => {
        isAnimating.current = false;
      }, 560);
    },
    [prints.length]
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    dragStart.current = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
      advance(dx < 0 ? 1 : -1);
    }
  };

  return (
    <div
      className="relative mx-auto w-[min(85vw,560px)] aspect-[3/4] mt-8 mb-24 select-none cursor-grab active:cursor-grabbing"
      style={{ touchAction: "pan-y" }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        dragStart.current = null;
      }}
    >
      {prints.map((print, i) => (
        <div
          key={print.id}
          ref={(el) => {
            cardRefs.current[i] = el;
          }}
          className="absolute inset-0 overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
          style={{ opacity: 0, willChange: "transform, opacity" }}
        >
          <Image
            src={print.src}
            alt={print.alt}
            fill
            className="object-cover pointer-events-none"
            sizes="(max-width: 640px) 80vw, 560px"
            priority={i === 0}
            draggable={false}
          />
        </div>
      ))}
    </div>
  );
}

// ─── Gallery section ──────────────────────────────────────────────────────
export function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Bold heading reveal — scale-down from oversized
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { opacity: 0, scale: 1.2, y: 30 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1.0,
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

  return (
    <section
      ref={sectionRef}
      id="gallery"
      data-nav-dark="true"
      className="relative py-24 sm:py-32 bg-bg"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[1px] bg-accent/40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2
          ref={headingRef}
          className="font-display text-4xl sm:text-5xl md:text-6xl font-light text-center mb-16 tracking-tight opacity-0 text-paper"
        >
          The Collection
        </h2>

        <Carousel prints={PLACEHOLDER_PRINTS} />
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-[1px] bg-accent/40" />
    </section>
  );
}
