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
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-end h-20">
          {/* Burger — three vertical dots, mix-blend-difference auto-reacts to bg */}
          <button
            onClick={() => setMenuOpen(true)}
            className="p-3 transition-opacity duration-500"
            style={{
              opacity: showBurger ? 1 : 0,
              pointerEvents: showBurger ? "auto" : "none",
              mixBlendMode: "difference",
            }}
            aria-label="Open menu"
            aria-hidden={!showBurger}
          >
            <svg
              width="6"
              height="26"
              viewBox="0 0 6 26"
              fill="#ffffff"
            >
              <circle cx="3" cy="3" r="3" />
              <circle cx="3" cy="13" r="3" />
              <circle cx="3" cy="23" r="3" />
            </svg>
          </button>
        </div>
      </nav>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
