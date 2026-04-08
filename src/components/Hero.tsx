"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);

  // Entry sequence + scroll-driven morph
  useEffect(() => {
    const logo = logoRef.current;
    const tagline = taglineRef.current;
    const cue = scrollCueRef.current;
    const section = sectionRef.current;
    if (!logo || !section) return;

    // Compute initial width as a plain px number — mobile-first sizing.
    // Mobile gets a much bigger logo (50vw, ~195px on iPhone) so it's actually
    // visible. Desktop stays compact at 14vw / 120px max.
    const isMobile = window.innerWidth < 768;
    const initialWidth = isMobile
      ? Math.min(window.innerWidth * 0.5, 220)
      : Math.min(window.innerWidth * 0.14, 120);

    // Compute initial top/left as px values too — mixing % and px in GSAP
    // tweens causes the size-jump-on-stop bug
    const initialLeft = window.innerWidth / 2;
    const initialTop = window.innerHeight / 2;

    const ctx = gsap.context(() => {
      // Initial state: centered (px values), sized for viewport
      gsap.set(logo, {
        top: initialTop,
        left: initialLeft,
        xPercent: -50,
        yPercent: -50,
        width: initialWidth,
      });

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

      // Scroll-driven morph: medium centered → top-left small
      gsap.to(logo, {
        top: 24,
        left: 24,
        xPercent: 0,
        yPercent: 0,
        width: 56,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=600",
          scrub: 0.6,
        },
      });

      // Tagline + scroll cue fade out as user scrolls into the morph
      const fadeTargets = [tagline, cue].filter(Boolean);
      if (fadeTargets.length) {
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
      {/* Tagline above the bottom */}
      <div className="absolute inset-x-0 bottom-24 flex flex-col items-center justify-center pointer-events-none">
        <div
          ref={taglineRef}
          className="font-tattoo text-ink text-xs sm:text-sm uppercase select-none"
          style={{ letterSpacing: "0.25em", opacity: 0 }}
        >
          LIMITED EDITION
        </div>
      </div>
      <div
        ref={scrollCueRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ opacity: 0 }}
      >
        <div className="w-[1px] h-10 bg-ink/30 animate-pulse" />
      </div>

      {/* Morphing logo — fixed-positioned, scroll-driven scale + position.
          mix-blend-mode: difference makes it auto-react to whatever bg is behind it.
          GSAP sets width / xPercent / yPercent in JS — do NOT set them in CSS here. */}
      <div
        ref={logoRef}
        className="fixed pointer-events-none z-[60]"
        style={{
          top: "50%",
          left: "50%",
          opacity: 0,
          mixBlendMode: "difference",
        }}
      >
        <div style={{ filter: "invert(1) brightness(1.1)" }}>
          <Image
            src="/gallery/tonydecay-logo.png"
            alt="Tony Decay"
            width={480}
            height={160}
            priority
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </section>
  );
}
