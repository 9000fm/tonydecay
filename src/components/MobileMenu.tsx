"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_LINKS = [
  { label: "BOOKINGS", href: "#bookings" },
  { label: "ARTWORK", href: "#gallery" },
  { label: "MERCH", href: "#merch" },
  { label: "ARTIST", href: "#artist" },
  { label: "CONTACT", href: "#contact" },
];

// Game Boy 4-tone palette — pixels flash these on the way to settle
const GAMEBOY_PALETTE = [
  "#0F380F", // darkest green
  "#306230",
  "#8BAC0F",
  "#9BBC0F", // lightest yellow-green
];

const FINAL_COLOR = "#0F380F"; // settle to darkest GB green
const TOTAL_REVEAL = 0.45; // total reveal time
const JITTER_AMOUNT = 0.08; // ±80ms random offset per pixel

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const pixelRefs = useRef<HTMLDivElement[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLAnchorElement[]>([]);
  const [grid, setGrid] = useState<{ cols: number; rows: number; size: number }>({
    cols: 0,
    rows: 0,
    size: 32,
  });

  // Compute grid on mount + on resize
  useEffect(() => {
    const compute = () => {
      const isMobile = window.innerWidth < 640;
      const size = isMobile ? 24 : 32;
      const cols = Math.ceil(window.innerWidth / size);
      const rows = Math.ceil(window.innerHeight / size);
      setGrid({ cols, rows, size });
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  // Build pixels in row-major order; each gets a random GB-palette glitch color baked in.
  const pixels = useMemo(() => {
    const list: {
      top: number;
      left: number;
      key: string;
      glitch: string;
      jitter: number;
    }[] = [];
    for (let r = 0; r < grid.rows; r++) {
      for (let c = 0; c < grid.cols; c++) {
        list.push({
          top: r * grid.size,
          left: c * grid.size,
          key: `${r}-${c}`,
          glitch: GAMEBOY_PALETTE[Math.floor(Math.random() * GAMEBOY_PALETTE.length)],
          jitter: Math.random() * JITTER_AMOUNT,
        });
      }
    }
    return list;
  }, [grid]);

  // Open / close animations
  useEffect(() => {
    const overlay = overlayRef.current;
    const content = contentRef.current;
    if (!overlay || !content) return;
    const blocks = pixelRefs.current.filter(Boolean);
    const links = linksRef.current.filter(Boolean);
    if (blocks.length === 0) return;

    gsap.killTweensOf([blocks, content, links]);

    if (isOpen) {
      // Lock scroll
      getLenis()?.stop();
      document.body.style.overflow = "hidden";

      gsap.set(overlay, { display: "block" });
      gsap.set(content, { opacity: 0 });
      gsap.set(links, { opacity: 0, y: 16 });

      blocks.forEach((b, i) => {
        gsap.set(b, {
          backgroundColor: pixels[i]?.glitch ?? FINAL_COLOR,
          opacity: 0,
        });
      });

      // Per-pixel INDEPENDENT tweens — each pixel gets its own delay computed
      // from its column distance from the right edge + random jitter.
      // Independent gsap.to calls (not a timeline) so they truly run in parallel.
      blocks.forEach((block, i) => {
        const p = pixels[i];
        if (!p) return;
        const colIdx = Math.floor(p.left / grid.size);
        const colDistance = grid.cols - 1 - colIdx;
        const baseDelay = (colDistance / grid.cols) * TOTAL_REVEAL;
        const delay = baseDelay + p.jitter;
        gsap.to(block, {
          opacity: 1,
          duration: 0.04,
          delay,
          ease: "none",
        });
        gsap.to(block, {
          backgroundColor: FINAL_COLOR,
          duration: 0.12,
          delay: delay + 0.05,
          ease: "none",
        });
      });

      // Content + links fade in after the pixel reveal completes
      const contentStart = TOTAL_REVEAL + JITTER_AMOUNT + 0.05;
      gsap.to(content, {
        opacity: 1,
        duration: 0.35,
        delay: contentStart,
        ease: "power2.out",
      });
      gsap.to(links, {
        opacity: 1,
        y: 0,
        duration: 0.45,
        delay: contentStart,
        stagger: 0.05,
        ease: "power2.out",
      });
    } else {
      // Close — fast reverse glitch
      gsap.to(content, { opacity: 0, duration: 0.15, ease: "power2.in" });

      const closeReveal = 0.22;
      let maxDelay = 0;
      blocks.forEach((block, i) => {
        const p = pixels[i];
        if (!p) return;
        const colIdx = Math.floor(p.left / grid.size);
        // Reverse direction: leftmost column disappears first
        const baseDelay = (colIdx / grid.cols) * closeReveal;
        const delay = baseDelay + p.jitter * 0.4;
        if (delay > maxDelay) maxDelay = delay;
        gsap.to(block, {
          backgroundColor: p.glitch,
          duration: 0.05,
          delay: delay + 0.1, // wait for content to start fading
          ease: "none",
        });
        gsap.to(block, {
          opacity: 0,
          duration: 0.05,
          delay: delay + 0.15,
          ease: "none",
        });
      });

      // Cleanup after the slowest pixel finishes
      gsap.delayedCall(maxDelay + 0.25, () => {
        gsap.set(overlay, { display: "none" });
        getLenis()?.start();
        document.body.style.overflow = "";
      });
    }
  }, [isOpen, grid, pixels]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      getLenis()?.start();
      document.body.style.overflow = "";
    };
  }, []);

  // Escape closes menu
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    onClose();
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 600);
  };

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[90] hidden">
      {/* Pixel grid layer */}
      <div className="absolute inset-0 pointer-events-none">
        {pixels.map((p, i) => (
          <div
            key={p.key}
            ref={(el) => {
              if (el) pixelRefs.current[i] = el;
            }}
            className="absolute"
            style={{
              top: p.top,
              left: p.left,
              width: grid.size,
              height: grid.size,
              backgroundColor: FINAL_COLOR,
              opacity: 0,
              willChange: "opacity, background-color",
            }}
          />
        ))}
      </div>

      {/* Menu content */}
      <div
        ref={contentRef}
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ opacity: 0 }}
      >
        {/* Close button — large serif × */}
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-white/80 hover:text-white transition-colors p-3 select-none leading-none"
          aria-label="Close menu"
          style={{
            fontFamily: "var(--font-display), serif",
            fontSize: "44px",
            fontWeight: 300,
          }}
        >
          ×
        </button>

        {/* Nav links */}
        <nav className="flex flex-col items-center gap-3 sm:gap-4">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.href}
              ref={(el) => {
                if (el) linksRef.current[i] = el;
              }}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="font-tattoo text-3xl sm:text-4xl text-white/80 hover:text-white transition-colors duration-300 uppercase"
              style={{ letterSpacing: "0.04em" }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Instagram — text label, no SVG */}
        <a
          href="https://www.instagram.com/tony.decay"
          target="_blank"
          rel="noopener noreferrer"
          className="font-tattoo text-base sm:text-lg uppercase text-white/60 hover:text-white transition-colors duration-300 mt-14"
          style={{ letterSpacing: "0.06em" }}
        >
          @TONY.DECAY
        </a>
      </div>
    </div>
  );
}
