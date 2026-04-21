"use client";

import { useEffect, useState } from "react";
import { MobileMenu } from "./MobileMenu";
import { MarqueeBar } from "./MarqueeBar";
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
        // Marquee shows while the middle of the hero print is still below the navbar.
        // Once the user has scrolled past the print's vertical midpoint, marquee hides.
        // Pick the first VISIBLE hero-print element (mobile fan and desktop deck both tag).
        const heroPrints = document.querySelectorAll<HTMLElement>("[data-hero-print]");
        let rect: DOMRect | null = null;
        for (const el of heroPrints) {
          const r = el.getBoundingClientRect();
          if (r.width > 0 && r.height > 0) {
            rect = r;
            break;
          }
        }
        if (rect) {
          // Marquee visible while 3/5 (60%) of the hero print is still below the navbar.
          // Once user scrolls past that point, marquee hides.
          setAtTop(rect.top + rect.height * 0.6 > 90);
        } else {
          setAtTop(window.scrollY < 200);
        }
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

  const navTop = atTop ? 28 : 0;

  return (
    <>
      {/* Marquee — conditional render (no fade) */}
      {!navHidden && (
        <div
          className="fixed top-0 right-0 left-0 z-[99] overflow-hidden transition-[max-height] duration-500 ease-out"
          style={{ maxHeight: atTop ? 28 : 0 }}
        >
          <MarqueeBar />
        </div>
      )}

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
              fontSize: 10,
              letterSpacing: "0.10em",
              fontWeight: 700,
              backgroundColor: "#ffffff",
              color: "#000000",
            }}
          >
            PRE-ORDER
          </button>
        </div>
      )}

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
