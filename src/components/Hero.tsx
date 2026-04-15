"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { PLACEHOLDER_PRINTS } from "@/lib/constants";

interface HeroProps {
  splashDone: boolean;
}

// 3-layer depth system: HERO (bold), MID (moderate), GHOST (barely there)
const COLLAGE_PRINTS = [
  // ── HERO layer: 3 large, vivid prints near Firma ──
  { idx: 6,  x: "5%",   y: "15%",  w: "48vw", maxW: 220, rot: -4,   opacity: 0.3,  speed: 0.15 },
  { idx: 9,  x: "45%",  y: "20%",  w: "50vw", maxW: 230, rot: 3,    opacity: 0.28, speed: 0.18 },
  { idx: 2,  x: "20%",  y: "38%",  w: "45vw", maxW: 210, rot: -2,   opacity: 0.32, speed: 0.12 },

  // ── MID layer: 5 medium prints around edges ──
  { idx: 0,  x: "-8%",  y: "-2%",  w: "32vw", maxW: 155, rot: -6,   opacity: 0.16, speed: 0.28 },
  { idx: 4,  x: "72%",  y: "5%",   w: "34vw", maxW: 160, rot: 5,    opacity: 0.14, speed: 0.32 },
  { idx: 7,  x: "-5%",  y: "55%",  w: "30vw", maxW: 145, rot: 7,    opacity: 0.18, speed: 0.25 },
  { idx: 11, x: "68%",  y: "50%",  w: "35vw", maxW: 165, rot: -5,   opacity: 0.15, speed: 0.3  },
  { idx: 13, x: "35%",  y: "72%",  w: "33vw", maxW: 150, rot: 3,    opacity: 0.17, speed: 0.22 },

  // ── GHOST layer: 7 tiny texture pieces, barely visible ──
  { idx: 1,  x: "80%",  y: "30%",  w: "18vw", maxW: 90,  rot: 8,    opacity: 0.06, speed: 0.4  },
  { idx: 3,  x: "55%",  y: "-5%",  w: "20vw", maxW: 95,  rot: -3,   opacity: 0.07, speed: 0.35 },
  { idx: 5,  x: "90%",  y: "65%",  w: "16vw", maxW: 80,  rot: 4,    opacity: 0.05, speed: 0.38 },
  { idx: 8,  x: "10%",  y: "80%",  w: "22vw", maxW: 100, rot: -7,   opacity: 0.06, speed: 0.42 },
  { idx: 10, x: "60%",  y: "82%",  w: "19vw", maxW: 88,  rot: 2,    opacity: 0.07, speed: 0.36 },
  { idx: 12, x: "85%",  y: "85%",  w: "15vw", maxW: 75,  rot: -4,   opacity: 0.05, speed: 0.4  },
  { idx: 14, x: "-2%",  y: "35%",  w: "17vw", maxW: 85,  rot: 6,    opacity: 0.06, speed: 0.33 },
];

export function Hero({ splashDone }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const logoFilterRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const collageRef = useRef<HTMLDivElement>(null);
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

  // Parallax on collage prints
  useEffect(() => {
    if (!splashDone || !collageRef.current || !sectionRef.current) return;
    const prints = Array.from(collageRef.current.children) as HTMLElement[];
    const ctx = gsap.context(() => {
      prints.forEach((el, i) => {
        const speed = COLLAGE_PRINTS[i]?.speed || 0.3;
        gsap.to(el, {
          yPercent: -speed * 60,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
          },
        });
      });
    });
    return () => ctx.revert();
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
      className="relative h-[92vh] overflow-hidden"
    >
      {/* Background — cream base */}
      <div className="absolute inset-0" style={{ backgroundColor: "#F0EBDC" }} />

      {/* Dense scatter — all 15 prints, chaotic, atmospheric */}
      <div ref={collageRef} className="absolute inset-0 z-[1]">
        {COLLAGE_PRINTS.map((p, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: p.x,
              top: p.y,
              width: p.w,
              maxWidth: p.maxW,
              opacity: p.opacity,
              transform: `rotate(${p.rot}deg)`,
              mixBlendMode: "multiply",
            }}
          >
            <Image
              src={PLACEHOLDER_PRINTS[p.idx]?.src || "/gallery/1.png"}
              alt=""
              width={300}
              height={400}
              className="w-full h-auto object-cover"
              draggable={false}
            />
          </div>
        ))}
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
