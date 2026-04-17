"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PLACEHOLDER_PRINTS } from "@/lib/constants";

// ─── Row of prints — clean CSS auto-scroll, no JS boost (matches digeart) ───
function MarqueeRow({
  prints,
  direction,
  duration,
}: {
  prints: typeof PLACEHOLDER_PRINTS;
  direction: "left" | "right";
  duration: number;
}) {
  const sequence = [...prints, ...prints];
  const animationName =
    direction === "left" ? "marquee-scroll" : "marquee-scroll-reverse";

  return (
    <div className="overflow-hidden">
      <div
        className="flex shrink-0"
        style={{
          animation: `${animationName} ${duration}s linear infinite`,
          width: "max-content",
          willChange: "transform",
        }}
      >
        {sequence.map((print, i) => (
          <div
            key={`${print.id}-${i}`}
            className="relative shrink-0"
            style={{ width: "32vw", height: "34vh", maxHeight: 320 }}
          >
            <Image
              src={print.src}
              alt={print.alt}
              fill
              unoptimized
              className="object-cover"
              sizes="32vw"
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Scroll-locked carousel: edge tabs, no numbers ──────────────────────────
function ScrollLockDeepDive() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const totalPrints = PLACEHOLDER_PRINTS.length;
      const scrollLength = window.innerHeight * (totalPrints - 1) * 0.3;

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${scrollLength}`,
        pin: true,
        snap: {
          snapTo: 1 / (totalPrints - 1),
          duration: 0.5,
          ease: "power3.out",
        },
        onUpdate: (self) => {
          const idx = Math.min(
            totalPrints - 1,
            Math.round(self.progress * (totalPrints - 1))
          );
          setActiveIndex(idx);
        },
        invalidateOnRefresh: true,
      });

      return () => {
        trigger.kill();
      };
    });

    return () => ctx.revert();
  }, []);

  // Track slide — smooth deceleration
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    gsap.to(track, {
      x: -activeIndex * window.innerWidth,
      duration: 0.65,
      ease: "power3.out",
      overwrite: true,
    });
  }, [activeIndex]);

  return (
    <div ref={sectionRef} data-deep-dive="true" className="relative h-screen overflow-hidden bg-bg">
      {/* DESKTOP-only: big counter on the left side */}
      <div className="hidden md:flex absolute top-[15%] left-8 z-20 pointer-events-none items-baseline">
        <span
          className="font-tattoo text-paper uppercase leading-none tracking-tighter"
          style={{ fontSize: "clamp(6rem, 14vw, 12rem)" }}
        >
          {String(activeIndex + 1).padStart(2, "0")}
        </span>
        <span className="font-tattoo text-paper/50 leading-none tracking-tighter" style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}>
          /{String(PLACEHOLDER_PRINTS.length).padStart(2, "0")}
        </span>
      </div>

      {/* Track — slides horizontally, each slide contains a print card with edge tabs */}
      <div
        ref={trackRef}
        className="absolute inset-y-0 left-0 flex items-center"
        style={{ willChange: "transform" }}
      >
        {PLACEHOLDER_PRINTS.map((print, i) => (
          <div
            key={print.id}
            className="w-screen h-screen shrink-0 flex items-center justify-center"
          >
            {/* Print card wrapper — overflow visible so edge tabs extend beyond */}
            <div className="relative" style={{ width: "min(94vw, 600px)" }}>
              {/* The print card itself */}
              <div className="relative border-2 border-paper bg-bg-alt">
                <div className="relative w-full" style={{ aspectRatio: "2/3" }}>
                  <Image
                    src={print.src}
                    alt={print.alt}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="94vw"
                    draggable={false}
                  />
                </div>
                <div className="px-3 py-2 flex items-center justify-between">
                  <span className="font-mono text-paper uppercase" style={{ fontSize: 13, letterSpacing: "0.22em", fontWeight: 600 }}>
                    Print {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-paper/50 uppercase" style={{ fontSize: 11, letterSpacing: "0.22em" }}>
                    Vol. I
                  </span>
                </div>
              </div>

              {/* Edge tabs — right side, like file dividers / notebook index marks */}
              <div
                className="absolute top-0 right-0 h-full flex flex-col justify-between py-4 pointer-events-none"
                style={{ transform: "translateX(calc(100% + 4px))" }}
              >
                {PLACEHOLDER_PRINTS.map((_, j) => {
                  const isActive = j === activeIndex;
                  return (
                    <div
                      key={j}
                      className="transition-all duration-300"
                      style={{
                        width: isActive ? 22 : 10,
                        height: isActive ? 3.5 : 1.5,
                        backgroundColor: isActive ? "#F7C234" : "rgba(240,235,220,0.3)",
                        borderRadius: 1,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Gallery section ──────────────────────────────────────────────────────
export function Gallery() {
  // Split 15 prints into 3 rows of 5
  const row1 = PLACEHOLDER_PRINTS.slice(0, 5);
  const row2 = PLACEHOLDER_PRINTS.slice(5, 10);
  const row3 = PLACEHOLDER_PRINTS.slice(10, 15);

  return (
    <section
      id="gallery"
      data-nav-dark="true"
      className="relative bg-bg overflow-hidden"
    >
      {/* TEASER — 3-row marquee, no heading, no dividers between prints */}
      <div>
        <MarqueeRow prints={row1} direction="left" duration={80} />
        <MarqueeRow prints={row2} direction="right" duration={80} />
        <MarqueeRow prints={row3} direction="left" duration={80} />
      </div>

      {/* DEEP DIVE — scroll-locked horizontal scrub */}
      <ScrollLockDeepDive />
    </section>
  );
}
