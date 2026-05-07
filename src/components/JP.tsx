"use client";

/* JP — inline Japanese glyph wrapper with custom interactive tooltip.
   - Dotted crimson underline signals "hover for translation".
   - Desktop (hover-capable): tooltip follows mouse smoothly via portal.
   - Mobile / touch: tap pops the tooltip at element center for 3.5s, then
     auto-closes. No native title attribute, no default browser tooltip. */

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

interface JPProps {
  children: React.ReactNode;
  en: string;
  /** When true, skip the dotted underline. Use for display-size kanji
   *  (e.g. masthead glyphs) where the underline reads as a visual bug. */
  bare?: boolean;
}

const AUTO_CLOSE_MS = 3500;
const FOLLOW_TRANSITION = "transform 90ms linear, left 90ms linear, top 90ms linear";

// External-store hook for the touch / hover-less media query — SSR-safe,
// reactive to changes (e.g. plugging in a mouse), no setState-in-effect.
function subscribePointer(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(hover: none), (pointer: coarse)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
function getPointerSnapshot() {
  return typeof window !== "undefined"
    ? window.matchMedia("(hover: none), (pointer: coarse)").matches
    : false;
}
function getPointerServerSnapshot() {
  return false;
}

export function JP({ children, en, bare = false }: JPProps) {
  const isTouch = useSyncExternalStore(
    subscribePointer,
    getPointerSnapshot,
    getPointerServerSnapshot,
  );
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const closeTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimer.current !== null) clearTimeout(closeTimer.current);
    };
  }, []);

  // Desktop: hover + mouse-move
  const onEnter = (e: React.MouseEvent) => {
    if (isTouch) return;
    setPos({ x: e.clientX, y: e.clientY });
    setVisible(true);
  };
  const onLeave = () => {
    if (isTouch) return;
    setVisible(false);
  };
  const onMove = (e: React.MouseEvent) => {
    if (isTouch || !visible) return;
    setPos({ x: e.clientX, y: e.clientY });
  };

  // Mobile: tap pops + auto-closes
  const onClick = (e: React.MouseEvent) => {
    if (!isTouch) return;
    e.preventDefault();
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setPos({ x: rect.left + rect.width / 2, y: rect.top });
    setVisible(true);
    if (closeTimer.current !== null) clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setVisible(false), AUTO_CLOSE_MS);
  };

  return (
    <>
      <span
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onMouseMove={onMove}
        onClick={onClick}
        aria-label={en}
        style={{
          textDecoration: bare ? "none" : "underline dotted",
          textDecorationColor: bare ? undefined : "rgba(215,50,46,0.55)",
          textUnderlineOffset: bare ? undefined : 4,
          textDecorationThickness: bare ? undefined : 1.5,
          cursor: isTouch ? "pointer" : "help",
        }}
      >
        {children}
      </span>
      {visible &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="tooltip"
            style={{
              position: "fixed",
              left: pos.x,
              top: pos.y,
              transform: isTouch
                ? "translate(-50%, calc(-100% - 14px))"
                : "translate(14px, calc(-100% - 10px))",
              background: "var(--color-ink)",
              color: "var(--color-paper)",
              padding: "8px 12px",
              fontFamily: "var(--font-mono), monospace",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.06em",
              lineHeight: 1.3,
              border: "1.5px solid var(--color-gold)",
              boxShadow: "3px 3px 0 var(--color-crimson)",
              pointerEvents: "none",
              zIndex: 9999,
              maxWidth: 280,
              transition: isTouch ? "opacity 200ms ease" : FOLLOW_TRANSITION,
              willChange: "transform, left, top",
            }}
          >
            {en}
          </div>,
          document.body,
        )}
    </>
  );
}
