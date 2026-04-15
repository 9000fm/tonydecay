"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { PLACEHOLDER_PRINTS } from "@/lib/constants";

interface HeroProps {
  splashDone: boolean;
}

export function Hero({ splashDone }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const logoFilterRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const [resizeKey, setResizeKey] = useState(0);

  // Debounced resize
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => setResizeKey((k) => k + 1), 200);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Tagline + scroll cue appear after splash
  useEffect(() => {
    if (!splashDone) return;
    const tagline = taglineRef.current;
    const cue = scrollCueRef.current;
    const tl = gsap.timeline();
    if (tagline) {
      tl.fromTo(tagline,
        { opacity: 0, y: 12 },
        { opacity: 0.7, y: 0, duration: 0.6, ease: "power2.out" },
        0.3
      );
    }
    if (cue) {
      tl.fromTo(cue,
        { opacity: 0 },
        { opacity: 0.6, duration: 0.5, ease: "power2.out" },
        0.5
      );
    }
    return () => { tl.kill(); };
  }, [splashDone]);

  // Scroll morph: logo shrinks to top-left
  useEffect(() => {
    const logo = logoRef.current;
    const tagline = taglineRef.current;
    const cue = scrollCueRef.current;
    const section = sectionRef.current;
    if (!logo || !section || !splashDone) return;

    const isMobile = window.innerWidth < 768;
    const initialWidth = isMobile
      ? Math.min(window.innerWidth * 0.4, 180)
      : Math.min(window.innerWidth * 0.12, 100);

    const ctx = gsap.context(() => {
      gsap.set(logo, {
        top: window.innerHeight * 0.33,
        left: window.innerWidth / 2,
        xPercent: -50,
        yPercent: -50,
        width: initialWidth,
        opacity: 1,
      });

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
  }, [splashDone, resizeKey]);

  // Position logo on mount — invisible until GSAP places it
  useEffect(() => {
    const logo = logoRef.current;
    if (!logo) return;
    const isMobile = window.innerWidth < 768;
    const initialWidth = isMobile
      ? Math.min(window.innerWidth * 0.4, 180)
      : Math.min(window.innerWidth * 0.12, 100);
    gsap.set(logo, {
      top: window.innerHeight * 0.33,
      left: window.innerWidth / 2,
      xPercent: -50,
      yPercent: -50,
      width: initialWidth,
      opacity: 1,
    });
  }, [resizeKey]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[92vh] overflow-hidden bg-paper section-fade-to-dark"
    >
      {/* Single background print — atmospheric, behind everything */}
      <div className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none">
        <div
          className="w-[60vw] md:w-[30vw]"
          style={{ opacity: 0.1, mixBlendMode: "multiply" }}
        >
          <Image
            src={PLACEHOLDER_PRINTS[9]?.src || "/gallery/10.png"}
            alt=""
            width={600}
            height={800}
            className="w-full h-auto object-contain"
            draggable={false}
          />
        </div>
      </div>

      {/* Gold accent line */}
      <div
        className="absolute left-1/2 -translate-x-1/2 z-[2]"
        style={{ top: "52%", width: 60, height: 1.5, backgroundColor: "#F7C234", opacity: 0.5 }}
      />

      {/* Tagline — bottom area */}
      <div className="absolute inset-x-0 bottom-20 sm:bottom-24 flex flex-col items-center justify-center pointer-events-none px-4 z-10">
        <div ref={taglineRef} className="select-none" style={{ opacity: 0 }}>
          <p
            className="font-tattoo text-lg sm:text-2xl md:text-3xl uppercase"
            style={{ letterSpacing: "0.3em", color: "#1A1A1A" }}
          >
            LIMITED EDITION
          </p>
        </div>
      </div>

      {/* Scroll cue — pixel triangle */}
      <div
        ref={scrollCueRef}
        className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 pointer-events-none z-10"
        style={{ opacity: 0, animation: "pokemon-bounce 0.8s steps(2) infinite" }}
      >
        <div className="flex flex-col items-center" style={{ gap: 0 }}>
          <div className="bg-ink" style={{ width: 20, height: 4 }} />
          <div className="bg-ink" style={{ width: 16, height: 4 }} />
          <div className="bg-ink" style={{ width: 12, height: 4 }} />
          <div className="bg-ink" style={{ width: 8, height: 4 }} />
          <div className="bg-ink" style={{ width: 4, height: 4 }} />
        </div>
      </div>

      {/* Morphing logo — fixed, scroll-driven shrink to top-left */}
      <div
        ref={logoRef}
        className="fixed pointer-events-none z-[110]"
        style={{
          top: "50%",
          left: "50%",
          opacity: 0,
          mixBlendMode: "difference",
        }}
      >
        <div
          ref={logoFilterRef}
          style={{ filter: "invert(1) brightness(1.1)" }}
        >
          <Image
            src="/gallery/Firma.png"
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
