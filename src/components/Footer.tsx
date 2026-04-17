"use client";

import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer data-nav-dark="true" className="bg-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        {/* Top row: small spinning Firma */}
        <div className="flex items-center pb-10 border-b-2 border-paper/30">
          <div
            className="w-10 sm:w-12 shrink-0"
            style={{
              animation: "spin-y 8s linear infinite",
              filter: "invert(1) brightness(1.5)",
              opacity: 0.7,
            }}
          >
            <Image
              src="/gallery/Firma.webp"
              alt="Tony Decay"
              width={480}
              height={160}
              unoptimized
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* Big wordmark */}
        <h2
          className="font-tattoo text-paper uppercase tracking-tighter leading-[0.82] mt-10"
          style={{ fontSize: "clamp(3.5rem, 16vw, 12rem)" }}
        >
          TONY DECAY
        </h2>

        {/* Columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 mt-12">
          <div>
            <p className="font-mono text-paper/40 uppercase mb-4" style={{ fontSize: 10, letterSpacing: "0.22em" }}>
              Explore
            </p>
            <ul className="space-y-2 font-sans text-paper/85 text-base">
              <li><a href="#gallery" className="hover:text-royal transition-colors">Vol. I</a></li>
              <li><a href="#artist" className="hover:text-royal transition-colors">About</a></li>
              <li><a href="#package" className="hover:text-royal transition-colors">Shop</a></li>
              <li><a href="#faq" className="hover:text-royal transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-paper/40 uppercase mb-4" style={{ fontSize: 10, letterSpacing: "0.22em" }}>
              Connect
            </p>
            <ul className="space-y-2 font-sans text-paper/85 text-base">
              <li>
                <a
                  href="https://www.instagram.com/tony.decay"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-royal transition-colors"
                >
                  @tony.decay
                </a>
              </li>
              <li>
                <a href="mailto:contact@tonydecay.com" className="hover:text-royal transition-colors">
                  Email
                </a>
              </li>
              <li><a href="#contact" className="hover:text-royal transition-colors">Notify Me</a></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <p className="font-mono text-paper/40 uppercase mb-4" style={{ fontSize: 10, letterSpacing: "0.22em" }}>
              Legal
            </p>
            <ul className="space-y-2 font-sans text-paper/85 text-base">
              <li><Link href="/terms" className="hover:text-royal transition-colors">Terms</Link></li>
              <li><Link href="/privacy" className="hover:text-royal transition-colors">Privacy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-14 pt-6 border-t-2 border-paper/30 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <p className="font-mono text-paper/30 uppercase" style={{ fontSize: 9, letterSpacing: "0.22em" }}>
            (c) 2026 Tony Decay
          </p>
          <p className="font-sans text-paper/30 text-xs max-w-md">
            Original fan art. Not affiliated with, endorsed by, or connected to
            any franchise or company.
          </p>
        </div>
      </div>
    </footer>
  );
}
