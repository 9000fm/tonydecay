"use client";

import { useEffect, useState } from "react";
import { MobileMenu } from "./MobileMenu";
import { useCheckout } from "@/hooks/useCheckout";
import { useScramble } from "@/hooks/useScramble";

// Each nav element is an INDEPENDENT fixed element — not nested in a shared fixed
// wrapper — so mix-blend-difference sees the page content as its backdrop.
// Firma uses scroll-detection → conditional filter + mix-blend so it:
//   - renders as natural dark signature on cream sections
//   - flips to white + mix-blend-difference over dark sections for true reactivity

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const { dispatch } = useCheckout();
  const menuLabel = useScramble(menuOpen ? "CLOSE" : "MENU");

  // Navbar elements stay hidden through the full close animation (panel covers them)
  useEffect(() => {
    if (menuOpen) {
      setNavHidden(true);
    } else if (navHidden) {
      const id = setTimeout(() => setNavHidden(false), 550);
      return () => clearTimeout(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuOpen]);

  useEffect(() => {
    let rafId: number | null = null;
    const tick = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        setAtTop(window.scrollY < 60);
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

  const navTop = atTop ? 32 : 0;

  return (
    <>
      {/* LEFT — MENU/CERRAR toggle, same pixel position always, text scramble on change */}
      <div
        className="fixed left-0 z-[120] flex h-14 items-center px-4 transition-[top] duration-500 ease-out sm:h-16 sm:px-6"
        style={{ top: navTop, mixBlendMode: "difference" }}
      >
        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="font-mono uppercase focus:outline-none"
          style={{
            color: "#ffffff",
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "0.22em",
          }}
        >
          {menuLabel}
        </button>
      </div>

      {/* CENTER — Firma, ALWAYS color-reactive (no scroll conditional).
           filter on parent forces source to pure white, mix-blend-difference inverts against backdrop on every section. */}
      {!navHidden && (
        <div
          className="pointer-events-none fixed left-1/2 z-[101] flex h-14 -translate-x-1/2 items-center transition-[top] duration-500 ease-out sm:h-16"
          style={{
            top: navTop,
            filter: "brightness(0) invert(1)",
            mixBlendMode: "difference",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/gallery/Firma.webp"
            alt="Tony Decay"
            className="h-12 w-auto object-contain sm:h-14"
          />
        </div>
      )}

      {/* RIGHT — Pre-Order white pill + mix-blend on wrapper → reads as dark pill on cream, light pill on dark (color-reactive) */}
      {!navHidden && (
        <div
          className="fixed right-0 z-[101] flex h-14 items-center px-4 transition-[top] duration-500 ease-out sm:h-16 sm:px-6"
          style={{ top: navTop, mixBlendMode: "difference" }}
        >
          <button
            onClick={() => dispatch({ type: "OPEN" })}
            className="inline-flex h-8 items-center justify-center rounded-full px-4 font-sans uppercase"
            style={{
              fontSize: 11,
              letterSpacing: "0.14em",
              fontWeight: 800,
              backgroundColor: "#ffffff",
              color: "#000000",
            }}
          >
            ORDER NOW
          </button>
        </div>
      )}

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
