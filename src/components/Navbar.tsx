"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { MobileMenu } from "./MobileMenu";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [showBurger, setShowBurger] = useState(false);

  // Detect when the navbar is overlapping a dark section + show burger after scroll
  useEffect(() => {
    let rafId: number | null = null;
    const tick = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        // Burger appears after the user scrolls past the hero
        setShowBurger(window.scrollY > 150);
        // Sample the element under a fixed point just below the navbar
        const x = window.innerWidth / 2;
        const y = 90;
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

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-center h-20">
          {/* Logo — top center */}
          <a
            href="#"
            className="select-none flex items-center"
            aria-label="Tony Decay home"
          >
            <Image
              src="/gallery/tonydecay-logo.png"
              alt="Tony Decay"
              width={240}
              height={80}
              priority
              className="h-12 sm:h-14 w-auto object-contain transition-[filter] duration-300"
              style={{ filter: isDark ? "invert(1) brightness(1.1)" : "none" }}
            />
          </a>

          {/* Burger — top right, hidden until scroll */}
          <button
            onClick={() => setMenuOpen(true)}
            className="absolute right-5 sm:right-8 top-1/2 -translate-y-1/2 flex flex-col items-end gap-[6px] p-2 group transition-opacity duration-500"
            style={{
              opacity: showBurger ? 1 : 0,
              pointerEvents: showBurger ? "auto" : "none",
            }}
            aria-label="Open menu"
            aria-hidden={!showBurger}
          >
            <span
              className="block w-8 h-[2.5px] transition-colors duration-300"
              style={{ backgroundColor: isDark ? "#ffffff" : "#1A1A1A" }}
            />
            <span
              className="block w-8 h-[2.5px] transition-colors duration-300"
              style={{ backgroundColor: isDark ? "#ffffff" : "#1A1A1A" }}
            />
            <span
              className="block w-8 h-[2.5px] transition-colors duration-300"
              style={{ backgroundColor: isDark ? "#ffffff" : "#1A1A1A" }}
            />
          </button>
        </div>
      </nav>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
