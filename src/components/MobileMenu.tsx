"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";
import { useCheckout } from "@/hooks/useCheckout";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

// Simplified menu: WORK removed until the portfolio section is built. SHOP is
// now an action (opens checkout modal), not a scroll target.
type NavItem =
  | { label: string; kind: "anchor"; href: string }
  | { label: string; kind: "checkout" };

const NAV_ITEMS: NavItem[] = [
  { label: "ABOUT", kind: "anchor", href: "#artist" },
  { label: "SHOP", kind: "checkout" },
  { label: "FAQ", kind: "anchor", href: "#faq" },
  { label: "CONTACT", kind: "anchor", href: "#contact" },
];

const MENU_BG = "#1A1A1E";

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { dispatch } = useCheckout();

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    gsap.killTweensOf(panel);

    if (isOpen) {
      getLenis()?.stop();
      document.body.style.overflow = "hidden";

      gsap.set(panel, {
        display: "block",
        top: 0,
        left: 0,
        width: 1,
        height: 1,
        borderRadius: 0,
      });

      // Overshoot by 40px so sub-pixel rounding + URL-bar shifts never leave a right/bottom edge uncovered.
      gsap.to(panel, {
        width: window.innerWidth + 40,
        height: window.innerHeight + 40,
        duration: 0.55,
        ease: "power3.inOut",
      });
    } else {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(panel, { display: "none", width: 1, height: 1 });
          getLenis()?.start();
          document.body.style.overflow = "";
        },
      });

      tl.to(panel, {
        width: 1,
        height: 1,
        duration: 0.5,
        ease: "power3.inOut",
      });
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      getLenis()?.start();
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const handleAnchorClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    onClose();
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 550);
  };

  const handleCheckoutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
    setTimeout(() => {
      dispatch({ type: "OPEN" });
    }, 550);
  };

  return (
    <div
      ref={panelRef}
      className="fixed z-[110] hidden overflow-hidden"
      style={{
        top: 0,
        left: 0,
        width: 1,
        height: 1,
        backgroundColor: MENU_BG,
        borderRadius: 0,
      }}
    >
      {/* Content fills viewport, positioned at final layout — panel overflow:hidden masks it.
          As panel grows, content is revealed. No animation on the items themselves. */}
      <div
        className="flex flex-col items-center justify-center"
        style={{ width: "100vw", height: "100vh" }}
      >
        {/* Nav — NUMBERED STAGES (V08-B from lab). Magazine TOC feel: each row
             has a crimson Anton number + cream Anton label + mono → arrow on
             the right, separated by a thin crimson bottom rule. */}
        <nav className="flex w-full max-w-md flex-col items-stretch gap-3 px-8 sm:gap-4">
          {NAV_ITEMS.map((item, i) => {
            const label = item.label;
            const num = String(i + 1).padStart(2, "0");
            const onEnter = (e: React.MouseEvent<HTMLElement>) => {
              e.currentTarget.style.opacity = "0.6";
            };
            const onLeave = (e: React.MouseEvent<HTMLElement>) => {
              e.currentTarget.style.opacity = "1";
            };
            const rowStyle: React.CSSProperties = {
              display: "flex",
              // center (not baseline) so SHOP's <button> child aligns identically
              // to the <a> anchor rows — baseline was offsetting the SHOP arrow.
              alignItems: "center",
              gap: 16,
              padding: "10px 0",
              borderBottom: "1px solid rgba(215,50,46,0.55)",
              cursor: "pointer",
              background: "transparent",
              width: "100%",
              textDecoration: "none",
              transition: "opacity 200ms ease",
            };
            const Inner = (
              <>
                <span
                  style={{
                    fontFamily: "var(--font-tattoo), sans-serif",
                    fontSize: 36,
                    color: "var(--color-crimson)",
                    lineHeight: 1,
                    letterSpacing: "0.02em",
                    minWidth: 52,
                  }}
                >
                  {num}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-tattoo), sans-serif",
                    fontSize: 44,
                    color: "rgba(255,255,255,0.92)",
                    lineHeight: 1,
                    letterSpacing: "0.02em",
                    flex: 1,
                  }}
                  className="sm:text-5xl md:text-6xl"
                >
                  {label}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: 14,
                    color: "rgba(255,255,255,0.45)",
                    fontWeight: 800,
                  }}
                >
                  →
                </span>
              </>
            );
            if (item.kind === "checkout") {
              return (
                <button
                  key={label}
                  type="button"
                  onClick={handleCheckoutClick}
                  style={{ ...rowStyle, border: "none", borderBottom: rowStyle.borderBottom }}
                  onMouseEnter={onEnter}
                  onMouseLeave={onLeave}
                >
                  {Inner}
                </button>
              );
            }
            return (
              <a
                key={label}
                href={item.href}
                onClick={(e) => handleAnchorClick(e, item.href)}
                style={rowStyle}
                onMouseEnter={onEnter}
                onMouseLeave={onLeave}
              >
                {Inner}
              </a>
            );
          })}
        </nav>

        {/* Instagram icon */}
        <a
          href="https://www.instagram.com/tony.decay"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-20 text-white/50 transition-colors duration-300 hover:text-white"
          aria-label="Instagram"
        >
          <svg width="52" height="52" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C9.28 2 8.94 2.01 7.88 2.06C6.81 2.11 6.09 2.28 5.46 2.52C4.8 2.78 4.24 3.12 3.68 3.68C3.12 4.24 2.78 4.8 2.52 5.46C2.28 6.09 2.11 6.81 2.06 7.88C2.01 8.94 2 9.28 2 12C2 14.72 2.01 15.06 2.06 16.12C2.11 17.19 2.28 17.91 2.52 18.54C2.78 19.2 3.12 19.76 3.68 20.32C4.24 20.88 4.8 21.22 5.46 21.48C6.09 21.72 6.81 21.89 7.88 21.94C8.94 21.99 9.28 22 12 22C14.72 22 15.06 21.99 16.12 21.94C17.19 21.89 17.91 21.72 18.54 21.48C19.2 21.22 19.76 20.88 20.32 20.32C20.88 19.76 21.22 19.2 21.48 18.54C21.72 17.91 21.89 17.19 21.94 16.12C21.99 15.06 22 14.72 22 12C22 9.28 21.99 8.94 21.94 7.88C21.89 6.81 21.72 6.09 21.48 5.46C21.22 4.8 20.88 4.24 20.32 3.68C19.76 3.12 19.2 2.78 18.54 2.52C17.91 2.28 17.19 2.11 16.12 2.06C15.06 2.01 14.72 2 12 2ZM12 4.16C14.67 4.16 14.99 4.17 16.04 4.22C17.02 4.26 17.55 4.43 17.9 4.56C18.37 4.74 18.7 4.96 19.05 5.31C19.4 5.66 19.62 5.99 19.8 6.46C19.93 6.81 20.1 7.34 20.14 8.32C20.19 9.38 20.2 9.69 20.2 12.36C20.2 15.03 20.19 15.34 20.14 16.4C20.1 17.38 19.93 17.91 19.8 18.26C19.62 18.73 19.4 19.06 19.05 19.41C18.7 19.76 18.37 19.98 17.9 20.16C17.55 20.29 17.02 20.46 16.04 20.5C14.99 20.55 14.67 20.56 12 20.56C9.33 20.56 9.01 20.55 7.96 20.5C6.98 20.46 6.45 20.29 6.1 20.16C5.63 19.98 5.3 19.76 4.95 19.41C4.6 19.06 4.38 18.73 4.2 18.26C4.07 17.91 3.9 17.38 3.86 16.4C3.81 15.34 3.8 15.03 3.8 12.36C3.8 9.69 3.81 9.38 3.86 8.32C3.9 7.34 4.07 6.81 4.2 6.46C4.38 5.99 4.6 5.66 4.95 5.31C5.3 4.96 5.63 4.74 6.1 4.56C6.45 4.43 6.98 4.26 7.96 4.22C9.01 4.17 9.33 4.16 12 4.16ZM12 6.86C9.16 6.86 6.86 9.16 6.86 12C6.86 14.84 9.16 17.14 12 17.14C14.84 17.14 17.14 14.84 17.14 12C17.14 9.16 14.84 6.86 12 6.86ZM12 15C10.34 15 9 13.66 9 12C9 10.34 10.34 9 12 9C13.66 9 15 10.34 15 12C15 13.66 13.66 15 12 15ZM18.84 6.62C18.84 7.34 18.26 7.92 17.54 7.92C16.82 7.92 16.24 7.34 16.24 6.62C16.24 5.9 16.82 5.32 17.54 5.32C18.26 5.32 18.84 5.9 18.84 6.62Z" />
          </svg>
        </a>
      </div>
    </div>
  );
}
