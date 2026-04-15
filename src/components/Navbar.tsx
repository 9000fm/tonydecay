"use client";

import { useEffect, useState } from "react";
import { MobileMenu } from "./MobileMenu";
import { useCheckout } from "@/hooks/useCheckout";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const { dispatch } = useCheckout();

  useEffect(() => {
    // Show nav when past hero morph zone, hide when back at hero top
    let rafId: number | null = null;
    const tick = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        setShowNav(window.scrollY > 600);
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
      {/* Cart — independent fixed element, left of burger */}
      <button
        onClick={() => dispatch({ type: "OPEN" })}
        className="fixed top-6 right-[4.5rem] sm:top-8 sm:right-[5.5rem] z-50 flex items-center justify-center w-10 h-10 transition-opacity duration-500"
        style={{
          opacity: showNav ? 1 : 0,
          pointerEvents: showNav ? "auto" : "none",
          backgroundColor: "#ffffff",
          mixBlendMode: "difference",
          animation: "blob-wobble 60s ease-in-out infinite",
          animationDelay: "-4s",
          borderRadius: "48% 52% 47% 53% / 51% 48% 52% 49%",
        }}
        aria-label="Open cart"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#000000"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
        </svg>
      </button>

      {/* Burger — independent fixed element */}
      <button
        onClick={() => setMenuOpen(true)}
        className="fixed top-6 right-6 sm:top-8 sm:right-8 z-50 flex items-center justify-center w-12 h-12 transition-opacity duration-500"
        style={{
          opacity: showNav ? 1 : 0,
          pointerEvents: showNav ? "auto" : "none",
          backgroundColor: "#ffffff",
          mixBlendMode: "difference",
          animation: "blob-wobble 60s ease-in-out infinite",
          borderRadius: "48% 52% 46% 54% / 50% 47% 53% 50%",
        }}
        aria-label="Open menu"
      >
        <svg
          width="22"
          height="16"
          viewBox="0 0 22 16"
          fill="none"
          stroke="#000000"
          strokeWidth="2.4"
          strokeLinecap="round"
        >
          <line x1="2" y1="2.5" x2="20" y2="2.5" />
          <line x1="2" y1="8" x2="20" y2="8" />
          <line x1="2" y1="13.5" x2="20" y2="13.5" />
        </svg>
      </button>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
