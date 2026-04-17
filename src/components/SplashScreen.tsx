"use client";

import { useEffect, useRef } from "react";

interface SplashScreenProps {
  onEnter: () => void;
}

export function SplashScreen({ onEnter }: SplashScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const irisRef = useRef<HTMLDivElement>(null);
  const firmaRef = useRef<HTMLImageElement>(null);
  const onEnterRef = useRef(onEnter);
  const hasRun = useRef(false);
  onEnterRef.current = onEnter;

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const container = containerRef.current;
    const iris = irisRef.current;
    const firma = firmaRef.current;
    if (!container || !iris || !firma) return;

    window.scrollTo(0, 0);
    const html = document.documentElement;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    import("@/lib/gsap").then(({ gsap }) => {
      // First visit = full cinematic timing; return visit = condensed
      let isFirst = true;
      try {
        isFirst = !sessionStorage.getItem("td-visited");
        if (isFirst) sessionStorage.setItem("td-visited", "1");
      } catch { /* SSR / private mode fallback — treat as first */ }

      const D1 = isFirst ? 2.0 : 0.5;   // dark beat 1
      const DL = isFirst ? 3.0 : 1.0;    // logo hold
      const D2 = isFirst ? 2.0 : 0.5;    // dark beat 2
      const IR = isFirst ? 1.9 : 1.2;    // iris duration

      const tLogoOn = D1;
      const tLogoOff = D1 + DL;
      const tIris = tLogoOff + D2;

      gsap.set(container, { backgroundColor: "var(--color-ink)" });
      gsap.set(firma, { display: "none" });
      gsap.set(iris, { width: 0, height: 0, boxShadow: "0 0 0 0 transparent" });

      const tl = gsap.timeline({
        onComplete: () => {
          html.style.overflow = "";
          document.body.style.overflow = "";
          container.style.display = "none";
          onEnterRef.current();
        },
      });

      // Logo appears
      tl.set(firma, { display: "block" }, tLogoOn);
      // Logo pops away
      tl.set(firma, { display: "none" }, tLogoOff);
      // Container transparent + iris primes + expands
      tl.set(container, { backgroundColor: "transparent" }, tIris);
      tl.set(iris, { boxShadow: "0 0 0 100vmax var(--color-ink)" }, tIris);
      tl.to(iris, {
        width: "300vmax",
        height: "300vmax",
        duration: IR,
        ease: "power3.inOut",
      }, tIris);
    });

    return () => {
      html.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[200]"
      style={{ touchAction: "none", backgroundColor: "var(--color-ink)" }}
      onTouchMove={(e) => e.preventDefault()}
    >
      {/* Iris circle — boxShadow ink covers screen during iris phase, recedes as circle grows */}
      <div
        ref={irisRef}
        className="absolute rounded-full"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 0,
          height: 0,
        }}
      />

      {/* Firma logo — pure WHITE (filter inverts dark source to white) so it's visible on the ink/dark bg */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={firmaRef}
        src="/gallery/Firma.webp"
        alt="Tony Decay"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-20 sm:h-24 w-auto object-contain"
        style={{ display: "none", filter: "brightness(0) invert(1)" }}
      />
    </div>
  );
}
