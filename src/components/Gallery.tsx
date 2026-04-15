"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { PLACEHOLDER_PRINTS } from "@/lib/constants";

// ─── Auto-scrolling marquee with drag interaction ─────────────────────────
// Slow auto-scroll right→left. Click/drag to scrub manually — auto-scroll
// pauses during drag and resumes with momentum after release.
function Marquee({ prints }: { prints: typeof PLACEHOLDER_PRINTS }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const halfWidthRef = useRef(0);

  const drag = useRef({
    active: false,
    startX: 0,
    startTrackX: 0,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
  });

  // Wrap x into the seamless range [−halfWidth, 0]
  const wrapX = useCallback((x: number) => {
    const hw = halfWidthRef.current;
    if (hw === 0) return x;
    let wrapped = x % hw;
    if (wrapped > 0) wrapped -= hw;
    return wrapped;
  }, []);

  // Start/resume auto-scroll from current position
  const startAutoScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const hw = halfWidthRef.current;
    if (hw === 0) return;

    tweenRef.current?.kill();

    const currentX = wrapX(gsap.getProperty(track, "x") as number);
    gsap.set(track, { x: currentX });

    // Constant speed: full loop in 90s
    const remaining = Math.abs(-hw - currentX);
    const speed = hw / 90;
    const duration = remaining / speed;

    tweenRef.current = gsap.to(track, {
      x: -hw,
      ease: "none",
      duration,
      onComplete: () => {
        gsap.set(track, { x: 0 });
        startAutoScroll();
      },
    });
  }, [wrapX]);

  // Init — delay slightly to ensure layout is settled
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const timeout = setTimeout(() => {
      halfWidthRef.current = track.scrollWidth / 3;
      gsap.set(track, { x: 0 });
      startAutoScroll();
    }, 200);

    return () => {
      clearTimeout(timeout);
      tweenRef.current?.kill();
    };
  }, [prints.length, startAutoScroll]);

  // Pointer handlers for drag
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const container = track.parentElement;
    if (!container) return;

    const onDown = (e: PointerEvent) => {
      tweenRef.current?.kill();

      const currentX = gsap.getProperty(track, "x") as number;
      drag.current = {
        active: true,
        startX: e.clientX,
        startTrackX: currentX,
        lastX: e.clientX,
        lastTime: Date.now(),
        velocity: 0,
      };

      container.setPointerCapture(e.pointerId);
      container.style.cursor = "grabbing";
    };

    const onMove = (e: PointerEvent) => {
      if (!drag.current.active) return;

      const delta = e.clientX - drag.current.startX;
      const newX = wrapX(drag.current.startTrackX + delta);
      gsap.set(track, { x: newX });

      // Track velocity (px/s)
      const now = Date.now();
      const dt = now - drag.current.lastTime;
      if (dt > 4) {
        drag.current.velocity =
          ((e.clientX - drag.current.lastX) / dt) * 1000;
        drag.current.lastX = e.clientX;
        drag.current.lastTime = now;
      }
    };

    const onUp = () => {
      if (!drag.current.active) return;
      drag.current.active = false;
      container.style.cursor = "";

      const velocity = drag.current.velocity;

      // Apply momentum if there's meaningful velocity
      if (Math.abs(velocity) > 50) {
        const currentX = gsap.getProperty(track, "x") as number;
        const momentum = velocity * 0.6;
        const targetX = wrapX(currentX + momentum);

        gsap.to(track, {
          x: targetX,
          duration: 0.8,
          ease: "power3.out",
          onComplete: startAutoScroll,
        });
      } else {
        // No momentum, just resume
        startAutoScroll();
      }
    };

    container.addEventListener("pointerdown", onDown);
    container.addEventListener("pointermove", onMove);
    container.addEventListener("pointerup", onUp);
    container.addEventListener("pointercancel", onUp);

    return () => {
      container.removeEventListener("pointerdown", onDown);
      container.removeEventListener("pointermove", onMove);
      container.removeEventListener("pointerup", onUp);
      container.removeEventListener("pointercancel", onUp);
    };
  }, [wrapX, startAutoScroll]);

  // Triple prints array for seamless loop with extra buffer
  const looped = [...prints, ...prints, ...prints];

  return (
    <div
      className="relative w-screen overflow-hidden -mx-[calc(50vw-50%)] select-none"
      style={{ cursor: "grab" }}
    >
      <div
        ref={trackRef}
        className="flex"
        style={{ willChange: "transform" }}
      >
        {looped.map((print, i) => (
          <div
            key={`${print.id}-${i}`}
            className="relative shrink-0 group -ml-px first:ml-0"
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
      className="relative py-24 sm:py-32 overflow-hidden bg-bg section-fade-to-cream"
    >
      <div className="text-center mb-12 sm:mb-16 px-0">
        <h2
          ref={headingRef}
          className="font-tattoo text-[7rem] sm:text-[12rem] md:text-[18rem] lg:text-[24rem] xl:text-[28rem] text-paper uppercase tracking-tighter leading-[0.72] opacity-0"
        >
          VOL&nbsp;I
        </h2>
        <p
          ref={subtitleRef}
          className="font-sans text-paper/60 text-sm sm:text-base uppercase mt-3 opacity-0"
          style={{ letterSpacing: "0.3em" }}
        >
          BY TONY DECAY
        </p>
      </div>

      <Marquee prints={PLACEHOLDER_PRINTS} />
    </section>
  );
}
