"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export function Certificate() {
  const sectionRef = useRef<HTMLElement>(null);
  const signatureRef = useRef<SVGSVGElement>(null);

  // KEEP only the signature draw animation — real motion, not a fade
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (signatureRef.current) {
        const paths = signatureRef.current.querySelectorAll("path");
        paths.forEach((path) => {
          const length = path.getTotalLength();
          gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length,
          });

          gsap.to(path, {
            strokeDashoffset: 0,
            duration: 2,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: signatureRef.current,
              start: "top 75%",
              end: "top 30%",
              scrub: 1,
            },
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 sm:py-32 bg-cream-dark text-text-dark">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[1px] bg-accent/40" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          {/* Certificate visual with signature */}
          <div className="w-full md:w-1/2 aspect-[4/5] border border-border-cream flex flex-col items-center justify-center p-8 relative">
            {/* Decorative corners */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t border-l border-accent/40" />
            <div className="absolute top-3 right-3 w-8 h-8 border-t border-r border-accent/40" />
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b border-l border-accent/40" />
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b border-r border-accent/40" />

            <span className="text-text-dark-secondary text-xs tracking-[0.3em] uppercase mb-8">
              Certificate of Authenticity
            </span>

            {/* Signature SVG — draws itself on scroll */}
            <svg
              ref={signatureRef}
              viewBox="0 0 200 60"
              className="w-48 mb-6"
              fill="none"
            >
              {/* Stylized "TDK" signature path */}
              <path
                d="M20 45 L20 15 M10 15 L30 15"
                stroke="var(--color-accent)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M40 15 L40 45 Q40 45 55 30 Q70 15 70 30 L70 45"
                stroke="var(--color-accent)"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M85 15 L85 45 M85 30 L105 15 M85 30 L105 45"
                stroke="var(--color-accent)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Underline flourish */}
              <path
                d="M10 52 Q60 48 120 52 Q150 54 190 48"
                stroke="var(--color-accent)"
                strokeWidth="1"
                strokeLinecap="round"
                opacity="0.5"
              />
            </svg>

            <span className="text-accent text-sm font-light tracking-[0.2em]">
              — / 100
            </span>
          </div>

          {/* Text content */}
          <div className="w-full md:w-1/2">
            <p className="text-accent text-xs font-medium tracking-[0.3em] uppercase mb-4">
              Authenticity
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Signed &amp; Numbered
            </h2>
            <div className="space-y-4">
              <p className="text-text-dark-secondary leading-relaxed">
                Each collection includes a hand-signed certificate of
                authenticity, individually numbered from 1/100 to 100/100. Once
                they&apos;re gone, they&apos;re gone.
              </p>
              <p className="text-text-dark-secondary text-sm">
                Only 100 sets will ever be produced.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-[1px] bg-accent/40" />
    </section>
  );
}
