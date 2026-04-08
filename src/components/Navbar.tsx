"use client";

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
        // Burger appears after the user scrolls past the hero start
        setShowBurger(window.scrollY > 200);
        // Sample under the navbar
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
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-end h-20">
          {/* Burger — top right, hidden until scroll. Hand-drawn SVG */}
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2 transition-opacity duration-500"
            style={{
              opacity: showBurger ? 1 : 0,
              pointerEvents: showBurger ? "auto" : "none",
            }}
            aria-label="Open menu"
            aria-hidden={!showBurger}
          >
            <svg
              width="34"
              height="22"
              viewBox="0 0 34 22"
              fill="none"
              stroke={isDark ? "#ffffff" : "#1A1A1A"}
              strokeWidth="2.5"
              strokeLinecap="round"
              className="transition-[stroke] duration-300"
            >
              <path d="M3 4 Q 17 5.2 31 4" />
              <path d="M3 11 Q 17 9.8 31 11" />
              <path d="M3 18 Q 17 19.4 31 18" />
            </svg>
          </button>
        </div>
      </nav>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
