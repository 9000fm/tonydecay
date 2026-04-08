"use client";

import Link from "next/link";
import { useCheckout } from "@/hooks/useCheckout";
import { PRICE_USD } from "@/lib/constants";

export function Footer() {
  const { dispatch } = useCheckout();

  return (
    <footer className="relative bg-cream text-text-dark">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[1px] bg-accent/40" />

      {/* Final CTA section */}
      <div className="py-24 sm:py-32 flex flex-col items-center text-center px-4">
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
      <div className="border-t border-border-cream py-10 px-4 sm:px-6">
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

          {/* Instagram — text label */}
          <a
            href="https://www.instagram.com/tony.decay"
            target="_blank"
            rel="noopener noreferrer"
            className="font-tattoo uppercase text-text-dark-secondary hover:text-text-dark transition-colors duration-300 text-sm"
            style={{ letterSpacing: "0.06em" }}
          >
            @TONY.DECAY
          </a>

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
