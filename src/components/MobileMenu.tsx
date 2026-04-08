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

// Tony's print palette — pixels flash these on the way to dark
const GLITCH_COLORS = [
  "#2B5DAE", // royal
  "#F2A2BC", // coral
  "#D7322E", // crimson
  "#F7C234", // gold
  "#5BAA4F", // leaf
  "#3CB5B5", // teal
];

const FINAL_COLOR = "#0a0a0a"; // bg-bg

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

  // Build pixels in column-major order: rightmost column first, top→bottom within each column.
  // The DOM/array order = the reveal order. Each pixel gets a random glitch color baked in.
  const pixels = useMemo(() => {
    const list: {
      top: number;
      left: number;
      key: string;
      glitch: string;
    }[] = [];
    for (let c = grid.cols - 1; c >= 0; c--) {
      for (let r = 0; r < grid.rows; r++) {
        list.push({
          top: r * grid.size,
          left: c * grid.size,
          key: `${r}-${c}`,
          glitch: GLITCH_COLORS[Math.floor(Math.random() * GLITCH_COLORS.length)],
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

      // Reset each pixel to its glitch color, opacity 0
      blocks.forEach((b, i) => {
        gsap.set(b, {
          backgroundColor: pixels[i]?.glitch ?? FINAL_COLOR,
          opacity: 0,
        });
      });

      const tl = gsap.timeline();

      // Pass 1 — pixels appear in column order (right→left), each flashing its glitch color
      tl.to(blocks, {
        opacity: 1,
        duration: 0.06,
        stagger: { each: 0.0018, from: "start" },
        ease: "none",
      });

      // Pass 2 — same stagger order, slightly delayed: each pixel transitions to dark
      tl.to(
        blocks,
        {
          backgroundColor: FINAL_COLOR,
          duration: 0.18,
          stagger: { each: 0.0018, from: "start" },
          ease: "none",
        },
        "<+0.08"
      );

      tl.to(content, { opacity: 1, duration: 0.4, ease: "power2.out" }, "-=0.3");
      tl.to(
        links,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: "power2.out",
        },
        "<"
      );
    } else {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(overlay, { display: "none" });
          getLenis()?.start();
          document.body.style.overflow = "";
        },
      });

      tl.to(content, { opacity: 0, duration: 0.2, ease: "power2.in" });

      // Reverse: pixels glitch back to their flash color, then fade out
      tl.to(
        blocks,
        {
          backgroundColor: (i: number) => pixels[i]?.glitch ?? FINAL_COLOR,
          duration: 0.1,
          stagger: { each: 0.0012, from: "end" },
          ease: "none",
        },
        "-=0.05"
      );
      tl.to(
        blocks,
        {
          opacity: 0,
          duration: 0.06,
          stagger: { each: 0.0012, from: "end" },
          ease: "none",
        },
        "<+0.05"
      );
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

        {/* Socials — bigger Instagram */}
        <div className="flex items-center gap-5 mt-14">
          <a
            href="https://instagram.com/tonydecay"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 hover:text-white transition-colors duration-300"
            aria-label="Instagram"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="5" />
              <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
