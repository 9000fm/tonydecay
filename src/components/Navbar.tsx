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
      {/* Burger — standalone fixed element, no transforms, no parent wrapper.
          mix-blend-difference at the SVG level so it auto-reacts to the bg pixel-by-pixel. */}
      <button
        onClick={() => setMenuOpen(true)}
        className="fixed top-7 right-7 sm:top-9 sm:right-9 z-50 p-3 transition-opacity duration-500"
        style={{
          opacity: showBurger ? 1 : 0,
          pointerEvents: showBurger ? "auto" : "none",
        }}
        aria-label="Open menu"
        aria-hidden={!showBurger}
      >
        <svg
          width="6"
          height="26"
          viewBox="0 0 6 26"
          fill="#ffffff"
          style={{ mixBlendMode: "difference" }}
        >
          <circle cx="3" cy="3" r="3" />
          <circle cx="3" cy="13" r="3" />
          <circle cx="3" cy="23" r="3" />
        </svg>
      </button>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
