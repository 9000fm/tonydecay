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

// Vintage Flash palette — same as splash, extracted from Tony's flash sheets
const FLASH_PALETTE = [
  "#02B2A8", // teal
  "#3789C9", // blue
  "#322A2A", // warm dark
  "#B00307", // crimson
  "#DF7695", // rose
];

const FINAL_COLOR = "#322A2A"; // settle to warm dark
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

  // Build pixels in row-major order; each gets a random flash-palette glitch color baked in.
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
          glitch: FLASH_PALETTE[Math.floor(Math.random() * FLASH_PALETTE.length)],
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

        {/* Nav links — brutalist huge */}
        <nav className="flex flex-col items-center gap-1 sm:gap-2">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.href}
              ref={(el) => {
                if (el) linksRef.current[i] = el;
              }}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="font-tattoo text-5xl sm:text-6xl md:text-7xl text-white/80 hover:text-white transition-colors duration-300 uppercase leading-[0.95]"
              style={{ letterSpacing: "0.01em" }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Instagram — icon + handle below */}
        <a
          href="https://www.instagram.com/tony.decay"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-2 mt-16 text-white/70 hover:text-white transition-colors duration-300"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 2C9.28 2 8.94 2.01 7.88 2.06C6.81 2.11 6.09 2.28 5.46 2.52C4.8 2.78 4.24 3.12 3.68 3.68C3.12 4.24 2.78 4.8 2.52 5.46C2.28 6.09 2.11 6.81 2.06 7.88C2.01 8.94 2 9.28 2 12C2 14.72 2.01 15.06 2.06 16.12C2.11 17.19 2.28 17.91 2.52 18.54C2.78 19.2 3.12 19.76 3.68 20.32C4.24 20.88 4.8 21.22 5.46 21.48C6.09 21.72 6.81 21.89 7.88 21.94C8.94 21.99 9.28 22 12 22C14.72 22 15.06 21.99 16.12 21.94C17.19 21.89 17.91 21.72 18.54 21.48C19.2 21.22 19.76 20.88 20.32 20.32C20.88 19.76 21.22 19.2 21.48 18.54C21.72 17.91 21.89 17.19 21.94 16.12C21.99 15.06 22 14.72 22 12C22 9.28 21.99 8.94 21.94 7.88C21.89 6.81 21.72 6.09 21.48 5.46C21.22 4.8 20.88 4.24 20.32 3.68C19.76 3.12 19.2 2.78 18.54 2.52C17.91 2.28 17.19 2.11 16.12 2.06C15.06 2.01 14.72 2 12 2ZM12 4.16C14.67 4.16 14.99 4.17 16.04 4.22C17.02 4.26 17.55 4.43 17.9 4.56C18.37 4.74 18.7 4.96 19.05 5.31C19.4 5.66 19.62 5.99 19.8 6.46C19.93 6.81 20.1 7.34 20.14 8.32C20.19 9.38 20.2 9.69 20.2 12.36C20.2 15.03 20.19 15.34 20.14 16.4C20.1 17.38 19.93 17.91 19.8 18.26C19.62 18.73 19.4 19.06 19.05 19.41C18.7 19.76 18.37 19.98 17.9 20.16C17.55 20.29 17.02 20.46 16.04 20.5C14.99 20.55 14.67 20.56 12 20.56C9.33 20.56 9.01 20.55 7.96 20.5C6.98 20.46 6.45 20.29 6.1 20.16C5.63 19.98 5.3 19.76 4.95 19.41C4.6 19.06 4.38 18.73 4.2 18.26C4.07 17.91 3.9 17.38 3.86 16.4C3.81 15.34 3.8 15.03 3.8 12.36C3.8 9.69 3.81 9.38 3.86 8.32C3.9 7.34 4.07 6.81 4.2 6.46C4.38 5.99 4.6 5.66 4.95 5.31C5.3 4.96 5.63 4.74 6.1 4.56C6.45 4.43 6.98 4.26 7.96 4.22C9.01 4.17 9.33 4.16 12 4.16ZM12 6.86C9.16 6.86 6.86 9.16 6.86 12C6.86 14.84 9.16 17.14 12 17.14C14.84 17.14 17.14 14.84 17.14 12C17.14 9.16 14.84 6.86 12 6.86ZM12 15C10.34 15 9 13.66 9 12C9 10.34 10.34 9 12 9C13.66 9 15 10.34 15 12C15 13.66 13.66 15 12 15ZM18.84 6.62C18.84 7.34 18.26 7.92 17.54 7.92C16.82 7.92 16.24 7.34 16.24 6.62C16.24 5.9 16.82 5.32 17.54 5.32C18.26 5.32 18.84 5.9 18.84 6.62Z" />
          </svg>
          <span
            className="font-tattoo text-sm sm:text-base uppercase"
            style={{ letterSpacing: "0.06em" }}
          >
            @TONY.DECAY
          </span>
        </a>
      </div>
    </div>
  );
}
