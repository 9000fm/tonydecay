"use client";

import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer data-nav-dark="true" className="bg-bg">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        {/* Top row: small spinning Firma */}
        <div className="border-paper/30 flex items-center border-b-2 pb-10">
          <div
            className="w-20 shrink-0 sm:w-28 lg:w-36"
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
              className="h-auto w-full object-contain"
            />
          </div>
        </div>

        {/* Big wordmark */}
        <h2
          className="font-tattoo text-paper mt-10 leading-[0.82] tracking-tighter uppercase"
          style={{ fontSize: "clamp(3.5rem, 16vw, 12rem)" }}
        >
          TONY DECAY
        </h2>

        {/* Columns */}
        <div className="mt-12 grid grid-cols-2 gap-8 sm:gap-10 md:grid-cols-3">
          <div>
            <p
              className="text-paper/40 mb-4 font-mono uppercase"
              style={{ fontSize: 10, letterSpacing: "0.22em" }}
            >
              Explore
            </p>
            <ul className="text-paper/85 space-y-2 font-sans text-base">
              <li>
                <a href="#gallery" className="hover:text-royal transition-colors">
                  Vol. I
                </a>
              </li>
              <li>
                <a href="#artist" className="hover:text-royal transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#package" className="hover:text-royal transition-colors">
                  Shop
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-royal transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p
              className="text-paper/40 mb-4 font-mono uppercase"
              style={{ fontSize: 10, letterSpacing: "0.22em" }}
            >
              Connect
            </p>
            <ul className="text-paper/85 space-y-2 font-sans text-base">
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
                <a
                  href="mailto:contact@tonydecay.com"
                  className="hover:text-royal transition-colors"
                >
                  Email
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-royal transition-colors">
                  Notify Me
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <p
              className="text-paper/40 mb-4 font-mono uppercase"
              style={{ fontSize: 10, letterSpacing: "0.22em" }}
            >
              Legal
            </p>
            <ul className="text-paper/85 space-y-2 font-sans text-base">
              <li>
                <Link href="/terms" className="hover:text-royal transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-royal transition-colors">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="border-paper/30 mt-14 flex flex-col gap-3 border-t-2 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p
            className="text-paper/30 font-mono uppercase"
            style={{ fontSize: 9, letterSpacing: "0.22em" }}
          >
            (c) 2026 Tony Decay
          </p>
          <p className="text-paper/30 max-w-md font-sans text-xs">
            Original fan art. Not affiliated with, endorsed by, or connected to any franchise or
            company.
          </p>
        </div>
      </div>
    </footer>
  );
}
