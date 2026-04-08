"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { PLACEHOLDER_PRINTS } from "@/lib/constants";

// ─── Mobile carousel ──────────────────────────────────────────────────────
// Stacked-card carousel: front print sharp + 2 cards visible behind it,
// offset down + smaller + dimmer. Swipe left/right to advance.
function MobileCarousel({ prints }: { prints: typeof PLACEHOLDER_PRINTS }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const isAnimating = useRef(false);

  // Position each card based on its offset from currentIndex
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
        y = 28;
        scale = 0.93;
        opacity = 0.55;
        zIndex = 20;
      } else if (offset === 2) {
        y = 52;
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
    // Mostly horizontal swipe over threshold
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
      advance(dx < 0 ? 1 : -1);
    }
  };

  return (
    <div
      className="relative mx-auto w-[80vw] max-w-sm aspect-[3/4] mt-8 mb-20 select-none"
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
          className="absolute inset-0 overflow-hidden shadow-[0_24px_60px_rgba(26,20,12,0.35)]"
          style={{ opacity: 0, willChange: "transform, opacity" }}
        >
          <Image
            src={print.src}
            alt={print.alt}
            fill
            className="object-cover pointer-events-none"
            sizes="80vw"
            priority={i === 0}
            draggable={false}
          />
        </div>
      ))}
    </div>
  );
}

// ─── Gallery section (desktop grid + mobile carousel) ─────────────────────
export function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const overlayState = useRef<"idle" | "full">("idle");
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mobile vs desktop branch
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Scroll-triggered reveal — motion-rich, no lazy fades
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        // Heading: scrubbed scale-down from oversized, confident reveal
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

      const items = itemRefs.current.filter(Boolean);
      if (items.length) {
        // Grid items "land" — bigger scale-up + Y, weighted ease
        gsap.fromTo(
          items,
          { opacity: 0, scale: 0.7, y: 60 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.06,
            ease: "power3.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const expand = useCallback(
    (index: number) => {
      const grid = gridRef.current;
      const item = itemRefs.current[index];
      const overlay = overlayRef.current;
      if (!grid || !item || !overlay) return;

      // Already showing exactly this item — bail
      if (activeIndex === index && overlayState.current === "full") return;

      // Kill any in-flight tweens
      gsap.killTweensOf(overlay);
      itemRefs.current.forEach((r) => {
        if (r) gsap.killTweensOf(r);
      });

      // Cross-item swap while overlay is already full → just change which image shows
      if (overlayState.current === "full") {
        // Restore the previous active item's opacity, dim the new one
        if (activeIndex !== null && itemRefs.current[activeIndex]) {
          gsap.to(itemRefs.current[activeIndex]!, {
            opacity: 0.08,
            duration: 0.3,
            ease: "power2.out",
          });
        }
        gsap.to(item, { opacity: 0, duration: 0.3 });
        setActiveIndex(index);
        return;
      }

      // Idle → full: animate overlay from source rect to fill grid
      const gridRect = grid.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();

      gsap.set(overlay, {
        display: "block",
        left: itemRect.left - gridRect.left,
        top: itemRect.top - gridRect.top,
        width: itemRect.width,
        height: itemRect.height,
        opacity: 1,
      });

      setActiveIndex(index);

      gsap.to(overlay, {
        left: 0,
        top: 0,
        width: gridRect.width,
        height: gridRect.height,
        duration: 0.85,
        ease: "expo.inOut",
        onComplete: () => {
          overlayState.current = "full";
        },
      });

      // Dim all other items
      itemRefs.current.forEach((ref, i) => {
        if (i !== index && ref) {
          gsap.to(ref, { opacity: 0.08, duration: 0.5, ease: "power2.out" });
        }
      });
      // Fade source item too — overlay sits on top
      gsap.to(item, { opacity: 0, duration: 0.3 });
    },
    [activeIndex]
  );

  const collapse = useCallback(() => {
    const grid = gridRef.current;
    const overlay = overlayRef.current;
    if (!grid || !overlay) return;
    if (activeIndex === null && overlayState.current === "idle") return;

    gsap.killTweensOf(overlay);
    itemRefs.current.forEach((r) => {
      if (r) gsap.killTweensOf(r);
    });

    const item = activeIndex !== null ? itemRefs.current[activeIndex] : null;

    if (!item) {
      gsap.set(overlay, { display: "none", opacity: 0 });
      setActiveIndex(null);
      overlayState.current = "idle";
      itemRefs.current.forEach((r) => {
        if (r) gsap.to(r, { opacity: 1, duration: 0.4 });
      });
      return;
    }

    const gridRect = grid.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    gsap.to(overlay, {
      left: itemRect.left - gridRect.left,
      top: itemRect.top - gridRect.top,
      width: itemRect.width,
      height: itemRect.height,
      duration: 0.7,
      ease: "expo.inOut",
      onComplete: () => {
        gsap.set(overlay, { display: "none", opacity: 0 });
        setActiveIndex(null);
        overlayState.current = "idle";
      },
    });

    // Restore ALL items to opacity 1
    itemRefs.current.forEach((ref) => {
      if (ref) {
        gsap.to(ref, { opacity: 1, duration: 0.5, ease: "power2.out" });
      }
    });
  }, [activeIndex]);

  const handleItemEnter = useCallback(
    (index: number) => {
      // Cancel any pending collapse
      if (leaveTimeout.current) {
        clearTimeout(leaveTimeout.current);
        leaveTimeout.current = null;
      }
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
      hoverTimeout.current = setTimeout(() => expand(index), 250);
    },
    [expand]
  );

  const handleItemLeave = useCallback(() => {
    // Cancel pending expand
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }
    // Delay collapse so moving to a sibling cell doesn't trigger flicker
    if (leaveTimeout.current) clearTimeout(leaveTimeout.current);
    leaveTimeout.current = setTimeout(() => collapse(), 80);
  }, [collapse]);

  const handleTap = useCallback(
    (index: number) => {
      if (activeIndex === index && overlayState.current === "full") {
        collapse();
      } else {
        expand(index);
      }
    },
    [activeIndex, expand, collapse]
  );

  const activePrint = activeIndex !== null ? PLACEHOLDER_PRINTS[activeIndex] : null;

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

        {isMobile ? (
          <MobileCarousel prints={PLACEHOLDER_PRINTS} />
        ) : (
          <div
            ref={gridRef}
            className="relative grid grid-cols-3 lg:grid-cols-5 gap-[2px]"
          >
            {PLACEHOLDER_PRINTS.map((print, index) => (
              <div
                key={print.id}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                className="relative cursor-pointer overflow-hidden opacity-0 aspect-[3/4]"
                onMouseEnter={() => handleItemEnter(index)}
                onMouseLeave={handleItemLeave}
                onClick={() => handleTap(index)}
              >
                <Image
                  src={print.src}
                  alt={print.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 25vw, 20vw"
                />
              </div>
            ))}

            {/* Overlay — absolutely positioned, animates from source to full grid */}
            <div
              ref={overlayRef}
              className="absolute pointer-events-none overflow-hidden hidden bg-bg"
              style={{ opacity: 0 }}
            >
              {activePrint && (
                <Image
                  src={activePrint.src}
                  alt={activePrint.alt}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              )}
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-[1px] bg-accent/40" />
    </section>
  );
}
