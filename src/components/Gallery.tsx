"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { PLACEHOLDER_PRINTS } from "@/lib/constants";

// ─── Auto-scrolling marquee strip ─────────────────────────────────────────
// Edge-to-edge horizontal strip of all 14 prints (duplicated for seamless loop),
// drifting right→left continuously. Hover the area to pause via tween instance.
function Marquee({ prints }: { prints: typeof PLACEHOLDER_PRINTS }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Wait one frame so scrollWidth is measured after layout
    const id = requestAnimationFrame(() => {
      const halfWidth = track.scrollWidth / 2;
      gsap.set(track, { x: 0 });
      tweenRef.current = gsap.to(track, {
        x: -halfWidth,
        ease: "none",
        duration: 60, // very slow drift — 60s for one full loop
        repeat: -1,
      });
    });

    return () => {
      cancelAnimationFrame(id);
      tweenRef.current?.kill();
    };
  }, [prints.length]);

  const handleMouseEnter = () => tweenRef.current?.pause();
  const handleMouseLeave = () => tweenRef.current?.resume();

  // Duplicate the prints array so the loop is seamless
  const looped = [...prints, ...prints];

  return (
    <div
      className="relative w-screen overflow-hidden -mx-[calc(50vw-50%)]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={trackRef}
        className="flex gap-6"
        style={{ willChange: "transform" }}
      >
        {looped.map((print, i) => (
          <div
            key={`${print.id}-${i}`}
            className="relative shrink-0 aspect-[3/4]"
            style={{ width: "min(28vw, 320px)" }}
          >
            <Image
              src={print.src}
              alt={print.alt}
              fill
              className="object-cover pointer-events-none"
              sizes="(max-width: 640px) 60vw, 320px"
              priority={i < 4}
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

  // Bold heading reveal
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
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[1px] bg-accent/40" />

      <div className="text-center mb-16 px-4">
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

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-[1px] bg-accent/40" />
    </section>
  );
}
