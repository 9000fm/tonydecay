"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useCheckout } from "@/hooks/useCheckout";
import { PRICE_USD } from "@/lib/constants";

export function Footer() {
  const sectionRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const { dispatch } = useCheckout();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Final CTA reveal — gentle scale + Y
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { opacity: 0, scale: 0.94, y: 40 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Footer fade — quiet scale + Y, subtle (it's the closer)
      if (footerRef.current) {
        gsap.fromTo(
          footerRef.current,
          { opacity: 0, scale: 0.97, y: 20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top 92%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={sectionRef} className="relative bg-cream text-text-dark">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[1px] bg-accent/40" />

      {/* Final CTA section */}
      <div
        ref={ctaRef}
        className="py-24 sm:py-32 flex flex-col items-center text-center px-4 opacity-0"
      >
        <p className="text-text-dark-secondary text-xs tracking-[0.3em] uppercase mb-4">
          Limited to 100 sets
        </p>
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-light mb-8 tracking-tight">
          Own a piece of the collection
        </h3>
        <button
          onClick={() => dispatch({ type: "OPEN" })}
          className="text-sm font-medium tracking-[0.15em] text-cream bg-text-dark hover:bg-accent px-10 py-4 transition-all duration-300"
        >
          BUY NOW &mdash; ${PRICE_USD}
        </button>
      </div>

      {/* Actual footer */}
      <div
        ref={footerRef}
        className="border-t border-border-cream py-10 px-4 sm:px-6 opacity-0"
      >
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-5">
          {/* Logo */}
          <span
            className="text-lg font-bold tracking-tighter"
            style={{
              WebkitTextStroke: "1px rgba(26, 26, 26, 0.4)",
              WebkitTextFillColor: "transparent",
            }}
          >
            TDK
          </span>

          {/* Social icons */}
          <div className="flex items-center gap-5 mb-2">
            <a
              href="https://instagram.com/tony.decay"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-dark-secondary hover:text-text-dark transition-colors duration-300"
              aria-label="Instagram"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
              </svg>
            </a>
          </div>

          {/* Legal links */}
          <div className="flex items-center gap-6 text-xs text-text-dark-secondary/50 tracking-wider">
            <Link href="/terms" className="hover:text-text-dark transition-colors duration-300">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-text-dark transition-colors duration-300">
              Privacy
            </Link>
          </div>

          {/* Disclaimer */}
          <p className="text-text-dark-secondary/40 text-[10px] text-center max-w-md tracking-wider">
            Original fan art. Not affiliated with, endorsed by, or connected to
            any franchise or company.
          </p>

          <p className="text-text-dark-secondary/30 text-[10px] tracking-wider">
            &copy; {new Date().getFullYear()} Tony Decay
          </p>
        </div>
      </div>
    </footer>
  );
}
