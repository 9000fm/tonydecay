"use client";

import { useEffect, useState } from "react";
import { MobileMenu } from "./MobileMenu";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showBurger, setShowBurger] = useState(false);

  // Burger appears after the user scrolls past the hero start
  useEffect(() => {
    let rafId: number | null = null;
    const tick = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        setShowBurger(window.scrollY > 200);
      });
    };
    tick();
    window.addEventListener("scroll", tick, { passive: true });
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", tick);
    };
  }, []);

  return (
    <>
      {/* Burger — classic 3-line stack, thick + rounded caps for character.
          Standalone fixed element, mix-blend-difference at the SVG level. */}
      <button
        onClick={() => setMenuOpen(true)}
        className="fixed top-6 right-6 sm:top-8 sm:right-8 z-50 p-3 transition-opacity duration-500"
        style={{
          opacity: showBurger ? 1 : 0,
          pointerEvents: showBurger ? "auto" : "none",
        }}
        aria-label="Open menu"
        aria-hidden={!showBurger}
      >
        <svg
          width="30"
          height="22"
          viewBox="0 0 30 22"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.8"
          strokeLinecap="round"
          style={{ mixBlendMode: "difference" }}
        >
          <line x1="3" y1="4" x2="27" y2="4" />
          <line x1="3" y1="11" x2="27" y2="11" />
          <line x1="3" y1="18" x2="27" y2="18" />
        </svg>
      </button>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
