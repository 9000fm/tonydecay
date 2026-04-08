"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function Certificate() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const signatureRef = useRef<SVGSVGElement>(null);
  const badgeRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Content reveal — scale + Y combo
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, scale: 0.92, y: 50 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );

      // Heading: scrubbed scale-down — appears massive, shrinks into focus as you scroll
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { scale: 1.4 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 90%",
              end: "top 40%",
              scrub: 1,
            },
          }
        );
      }

      // Badge + heading + text reveal — slide from right + scale settle
      if (badgeRef.current && headingRef.current && textRef.current) {
        gsap.fromTo(
          [badgeRef.current, headingRef.current, textRef.current],
          { opacity: 0, x: 40, scale: 0.96 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Signature draw animation on scroll
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
        <div
          ref={contentRef}
          className="flex flex-col md:flex-row items-center gap-12 md:gap-16 opacity-0"
        >
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
            <p
              ref={badgeRef}
              className="text-accent text-xs font-medium tracking-[0.3em] uppercase mb-4 opacity-0"
            >
              Authenticity
            </p>
            <h2
              ref={headingRef}
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight opacity-0"
            >
              Signed &amp; Numbered
            </h2>
            <div ref={textRef} className="space-y-4 opacity-0">
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
