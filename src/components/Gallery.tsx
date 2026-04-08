"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { PLACEHOLDER_PRINTS } from "@/lib/constants";

// ─── Auto-scrolling marquee — simple, no pause logic ──────────────────────
// Cards are tall and touching (no gap). Auto-scrolls continuously right→left.
// Hover/tap a card → it brightens slightly, others dim slightly. No pause.
function Marquee({ prints }: { prints: typeof PLACEHOLDER_PRINTS }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const id = requestAnimationFrame(() => {
      const halfWidth = track.scrollWidth / 2;
      gsap.set(track, { x: 0 });
      tweenRef.current = gsap.to(track, {
        x: -halfWidth,
        ease: "none",
        duration: 40,
        repeat: -1,
      });
    });

    return () => {
      cancelAnimationFrame(id);
      tweenRef.current?.kill();
    };
  }, [prints.length]);

  // Duplicate prints array so the loop is seamless
  const looped = [...prints, ...prints];

  return (
    <div className="relative w-screen overflow-hidden -mx-[calc(50vw-50%)]">
      <div
        ref={trackRef}
        className="flex"
        style={{ willChange: "transform" }}
      >
        {looped.map((print, i) => (
          <div
            key={`${print.id}-${i}`}
            className="relative shrink-0 group"
            style={{
              width: "calc((70vh) * 3 / 4)",
              height: "70vh",
            }}
          >
            <Image
              src={print.src}
              alt={print.alt}
              fill
              className="object-cover transition-[filter,opacity] duration-300 group-hover:brightness-110"
              sizes="(max-width: 640px) 52vh, 60vh"
              priority={i < 3}
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Gallery section ──────────────────────────────────────────────────────
export function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { opacity: 0, scale: 1.15, y: 30 },
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
      if (subtitleRef.current) {
        gsap.fromTo(
          subtitleRef.current,
          { opacity: 0, y: 16 },
          {
            opacity: 0.6,
            y: 0,
            duration: 0.8,
            delay: 0.15,
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
      className="relative py-24 sm:py-32 bg-bg overflow-hidden"
    >
      <div className="text-center mb-12 sm:mb-16 px-4">
        <h2
          ref={headingRef}
          className="font-tattoo text-5xl sm:text-6xl md:text-7xl text-paper uppercase tracking-tight opacity-0"
        >
          VOLUME ONE
        </h2>
        <p
          ref={subtitleRef}
          className="font-tattoo text-paper/60 text-sm sm:text-base uppercase mt-3 opacity-0"
          style={{ letterSpacing: "0.3em" }}
        >
          BY TONY DECAY
        </p>
      </div>

      <Marquee prints={PLACEHOLDER_PRINTS} />
    </section>
  );
}
