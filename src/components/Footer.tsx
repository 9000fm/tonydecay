"use client";

import Link from "next/link";
import Image from "next/image";
import { useCheckout } from "@/hooks/useCheckout";
import { PRICE_USD } from "@/lib/constants";

export function Footer() {
  const { dispatch } = useCheckout();

  return (
    <footer className="relative overflow-hidden" style={{ backgroundColor: "#0D1B2D" }}>
      {/* Infinite marquee — TONY DECAY repeating */}
      <div className="py-6 overflow-hidden border-b border-paper/5">
        <div
          className="flex whitespace-nowrap"
          style={{
            animation: "marquee-scroll 20s linear infinite",
          }}
        >
          {Array.from({ length: 10 }, (_, i) => (
            <span
              key={i}
              className="font-tattoo text-paper/[0.03] text-6xl sm:text-7xl uppercase tracking-wider mx-8 shrink-0 select-none"
            >
              TONY DECAY
            </span>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-20 sm:py-28 flex flex-col items-center text-center px-4">
        <p className="text-paper/40 font-mono text-xs tracking-[0.3em] uppercase mb-4">
          Limited to 100 sets
        </p>
        <h3 className="text-paper/80 font-display text-2xl sm:text-3xl md:text-4xl font-light mb-10 tracking-tight">
          Own a piece of the collection
        </h3>
        <button
          onClick={() => dispatch({ type: "OPEN" })}
          className="font-sans text-sm font-medium tracking-[0.15em] uppercase bg-paper text-ink hover:bg-royal hover:text-paper px-12 py-4 rounded-full transition-all duration-300 hover:scale-105"
        >
          BUY NOW — ${PRICE_USD}
        </button>
      </div>

      {/* Footer content */}
      <div className="border-t border-paper/10 py-16 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">
          {/* Spinning Firma logo */}
          <div
            className="w-16 sm:w-20"
            style={{
              animation: "spin-y 8s linear infinite",
              filter: "invert(1) brightness(1.5)",
              opacity: 0.5,
            }}
          >
            <Image
              src="/gallery/Firma.png"
              alt="Tony Decay"
              width={480}
              height={160}
              className="w-full h-auto object-contain"
            />
          </div>

          {/* IG icon — big */}
          <a
            href="https://www.instagram.com/tony.decay"
            target="_blank"
            rel="noopener noreferrer"
            className="text-paper/40 hover:text-paper/80 transition-colors duration-300"
            aria-label="Instagram"
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C9.28 2 8.94 2.01 7.88 2.06C6.81 2.11 6.09 2.28 5.46 2.52C4.8 2.78 4.24 3.12 3.68 3.68C3.12 4.24 2.78 4.8 2.52 5.46C2.28 6.09 2.11 6.81 2.06 7.88C2.01 8.94 2 9.28 2 12C2 14.72 2.01 15.06 2.06 16.12C2.11 17.19 2.28 17.91 2.52 18.54C2.78 19.2 3.12 19.76 3.68 20.32C4.24 20.88 4.8 21.22 5.46 21.48C6.09 21.72 6.81 21.89 7.88 21.94C8.94 21.99 9.28 22 12 22C14.72 22 15.06 21.99 16.12 21.94C17.19 21.89 17.91 21.72 18.54 21.48C19.2 21.22 19.76 20.88 20.32 20.32C20.88 19.76 21.22 19.2 21.48 18.54C21.72 17.91 21.89 17.19 21.94 16.12C21.99 15.06 22 14.72 22 12C22 9.28 21.99 8.94 21.94 7.88C21.89 6.81 21.72 6.09 21.48 5.46C21.22 4.8 20.88 4.24 20.32 3.68C19.76 3.12 19.2 2.78 18.54 2.52C17.91 2.28 17.19 2.11 16.12 2.06C15.06 2.01 14.72 2 12 2ZM12 4.16C14.67 4.16 14.99 4.17 16.04 4.22C17.02 4.26 17.55 4.43 17.9 4.56C18.37 4.74 18.7 4.96 19.05 5.31C19.4 5.66 19.62 5.99 19.8 6.46C19.93 6.81 20.1 7.34 20.14 8.32C20.19 9.38 20.2 9.69 20.2 12.36C20.2 15.03 20.19 15.34 20.14 16.4C20.1 17.38 19.93 17.91 19.8 18.26C19.62 18.73 19.4 19.06 19.05 19.41C18.7 19.76 18.37 19.98 17.9 20.16C17.55 20.29 17.02 20.46 16.04 20.5C14.99 20.55 14.67 20.56 12 20.56C9.33 20.56 9.01 20.55 7.96 20.5C6.98 20.46 6.45 20.29 6.1 20.16C5.63 19.98 5.3 19.76 4.95 19.41C4.6 19.06 4.38 18.73 4.2 18.26C4.07 17.91 3.9 17.38 3.86 16.4C3.81 15.34 3.8 15.03 3.8 12.36C3.8 9.69 3.81 9.38 3.86 8.32C3.9 7.34 4.07 6.81 4.2 6.46C4.38 5.99 4.6 5.66 4.95 5.31C5.3 4.96 5.63 4.74 6.1 4.56C6.45 4.43 6.98 4.26 7.96 4.22C9.01 4.17 9.33 4.16 12 4.16ZM12 6.86C9.16 6.86 6.86 9.16 6.86 12C6.86 14.84 9.16 17.14 12 17.14C14.84 17.14 17.14 14.84 17.14 12C17.14 9.16 14.84 6.86 12 6.86ZM12 15C10.34 15 9 13.66 9 12C9 10.34 10.34 9 12 9C13.66 9 15 10.34 15 12C15 13.66 13.66 15 12 15ZM18.84 6.62C18.84 7.34 18.26 7.92 17.54 7.92C16.82 7.92 16.24 7.34 16.24 6.62C16.24 5.9 16.82 5.32 17.54 5.32C18.26 5.32 18.84 5.9 18.84 6.62Z" />
            </svg>
          </a>

          <div className="flex items-center gap-8 font-sans text-sm text-paper/25 tracking-wider">
            <Link href="/terms" className="hover:text-paper/50 transition-colors duration-300">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-paper/50 transition-colors duration-300">
              Privacy
            </Link>
          </div>

          <p className="text-paper/10 text-xs text-center max-w-md tracking-wider">
            Original fan art. Not affiliated with, endorsed by, or connected to
            any franchise or company.
          </p>

          <p className="text-paper/8 text-xs tracking-wider">
            &copy; {new Date().getFullYear()} Tony Decay
          </p>
        </div>
      </div>
    </footer>
  );
}
