"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const [isDark, setIsDark] = useState(false);

  // Sample under-navbar dark detection — same as Navbar's logic
  useEffect(() => {
    let rafId: number | null = null;
    const tick = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const x = 48; // sample at top-left where the logo lands
        const y = 48;
        const els = document.elementsFromPoint(x, y);
        const dark = els.some((el) =>
          (el as HTMLElement).closest('[data-nav-dark="true"]')
        );
        setIsDark(dark);
      });
    };
    tick();
    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", tick);
      window.removeEventListener("resize", tick);
    };
  }, []);

  // Entry sequence + scroll-driven morph
  useEffect(() => {
    const logo = logoRef.current;
    const tagline = taglineRef.current;
    const cue = scrollCueRef.current;
    const section = sectionRef.current;
    if (!logo || !section) return;

    const ctx = gsap.context(() => {
      // Initial entry — sequential reveal
      const tl = gsap.timeline({ delay: 0.2 });
      tl.fromTo(
        logo,
        { opacity: 0 },
        { opacity: 1, duration: 0.9, ease: "power2.out" }
      );
      if (tagline) {
        tl.fromTo(
          tagline,
          { opacity: 0, y: 12 },
          { opacity: 0.7, y: 0, duration: 0.7, ease: "power2.out" },
          "-=0.3"
        );
      }
      if (cue) {
        tl.fromTo(
          cue,
          { opacity: 0 },
          { opacity: 0.5, duration: 0.6, ease: "power2.out" },
          "-=0.2"
        );
      }

      // Scroll-driven morph: big centered → top-left small (navbar slot)
      gsap.to(logo, {
        top: 24,
        left: 24,
        xPercent: 0,
        yPercent: 0,
        width: 64,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=600",
          scrub: 0.6,
        },
      });

      // Tagline + scroll cue fade out as user scrolls into the morph
      if (tagline || cue) {
        const fadeTargets = [tagline, cue].filter(Boolean);
        gsap.to(fadeTargets, {
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=200",
            scrub: 0.3,
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-paper overflow-hidden"
    >
      {/* Tagline + scroll cue, in normal flow at the bottom of the hero */}
      <div className="absolute inset-x-0 bottom-24 flex flex-col items-center justify-center pointer-events-none">
        <div
          ref={taglineRef}
          className="font-tattoo text-ink text-xs sm:text-sm uppercase select-none"
          style={{ letterSpacing: "0.25em", opacity: 0 }}
        >
          LIMITED EDITION · MMXXVI
        </div>
      </div>
      <div
        ref={scrollCueRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ opacity: 0 }}
      >
        <div className="w-[1px] h-10 bg-ink/30 animate-pulse" />
      </div>

      {/* Morphing logo — fixed-positioned, scroll-driven scale + position */}
      <div
        ref={logoRef}
        className="fixed pointer-events-none z-[60]"
        style={{
          top: "50%",
          left: "50%",
          width: "min(60vw, 480px)",
          transform: "translate(-50%, -50%)",
          opacity: 0,
        }}
      >
        <Image
          src="/gallery/tonydecay-logo.png"
          alt="Tony Decay"
          width={480}
          height={160}
          priority
          className="w-full h-auto object-contain transition-[filter] duration-300"
          style={{ filter: isDark ? "invert(1) brightness(1.1)" : "none" }}
        />
      </div>
    </section>
  );
}
