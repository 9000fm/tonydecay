"use client";

import { useEffect, useRef } from "react";

interface SplashScreenProps {
  onEnter: () => void;
}

export function SplashScreen({ onEnter }: SplashScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const irisRef = useRef<HTMLDivElement>(null);
  const onEnterRef = useRef(onEnter);
  const hasRun = useRef(false);
  onEnterRef.current = onEnter;

  useEffect(() => {
    // Strict mode guard — run once
    if (hasRun.current) return;
    hasRun.current = true;

    const container = containerRef.current;
    const iris = irisRef.current;
    if (!container || !iris) return;

    // Force scroll to top + lock
    window.scrollTo(0, 0);
    const html = document.documentElement;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    // Dynamic import GSAP to avoid SSR issues
    import("@/lib/gsap").then(({ gsap }) => {
      // Iris starts at 0 — box-shadow covers entire screen in dark
      gsap.set(iris, { width: 0, height: 0 });

      // After a brief dark pause, the iris opens
      gsap.to(iris, {
        width: "300vmax",
        height: "300vmax",
        duration: 1.8,
        ease: "power3.inOut",
        delay: 0.6,
        onComplete: () => {
          html.style.overflow = "";
          document.body.style.overflow = "";
          container.style.display = "none";
          onEnterRef.current();
        },
      });
    });

    return () => {
      html.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100]"
      style={{ touchAction: "none" }}
      onTouchMove={(e) => e.preventDefault()}
    >
      {/* The iris: a circle with a massive box-shadow that covers the screen.
          As the circle grows from 0, the shadow retreats, revealing the hero. */}
      <div
        ref={irisRef}
        className="absolute rounded-full"
        style={{
          top: "33%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 0,
          height: 0,
          boxShadow: "0 0 0 100vmax #0D1B2D",
        }}
      />
    </div>
  );
}
