"use client";

import { useRef } from "react";
import { TOTAL_INVENTORY } from "@/lib/constants";

export function Product() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  const features = [
    "15 A5 art prints on 300gsm paper",
    "Signed & numbered certificate",
    "Custom collector packaging",
    "Free worldwide shipping",
  ];

  return (
    <section
      ref={sectionRef}
      id="package"
      className="bg-paper border-b-2 border-ink relative py-20 sm:py-28 overflow-hidden"
    >
      {/* Heading — TONY DECAY / VOL. I (replaces THE COLLECTION) */}
      <div className="px-4 sm:px-8 overflow-hidden">
        <h2
          ref={headingRef}
          className="font-tattoo text-ink uppercase leading-[0.82] tracking-tighter"
          style={{ fontSize: "clamp(3.5rem, 16vw, 13rem)" }}
        >
          TONY DECAY
          <br />
          <span className="text-ink-soft">VOL. I</span>
        </h2>
        <div className="mt-3 sm:mt-4 inline-block border-2 border-ink px-3 py-1 font-mono text-ink uppercase" style={{ fontSize: 10, letterSpacing: "0.22em" }}>
          15 original print pieces in one collection
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div
          ref={detailsRef}
          className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20 items-start"
        >
          {/* Left — product info, fully wireframe-wrapped */}
          <div className="border-2 border-ink p-6 sm:p-8">
            <div className="inline-block border-2 border-ink px-3 py-1 font-mono text-ink uppercase mb-6" style={{ fontSize: 10, letterSpacing: "0.22em" }}>
              The Offer
            </div>

            <p className="font-sans text-ink-soft text-base sm:text-lg leading-relaxed">
              This release includes 15 original prints by Tony Decay, produced
              as a hand-printed set in a numbered edition of 100. Each set is
              sold as a complete collection for $300, with worldwide shipping
              included.
            </p>

            <div className="mt-8">
              <p className="font-mono text-ink uppercase mb-4" style={{ fontSize: 10, letterSpacing: "0.22em" }}>
                What&apos;s Included
              </p>
              <ul className="space-y-3">
                {features.map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-2 h-2 shrink-0 bg-royal" />
                    <span className="font-sans text-sm sm:text-base text-ink">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 pt-6 border-t border-ink/20">
              <p className="font-mono text-ink-faint uppercase mb-2" style={{ fontSize: 10, letterSpacing: "0.22em" }}>
                Sets Remaining
              </p>
              <div className="flex items-baseline gap-2">
                <span className="font-tattoo text-ink leading-none tracking-tight" style={{ fontSize: "clamp(3rem, 10vw, 4.5rem)" }}>
                  {TOTAL_INVENTORY}
                </span>
                <span className="font-tattoo text-ink-faint leading-none" style={{ fontSize: "clamp(1.75rem, 6vw, 2.5rem)" }}>
                  / {TOTAL_INVENTORY}
                </span>
              </div>
            </div>

            <button
              className="mt-8 w-full sm:w-auto inline-flex items-center justify-center h-12 px-10 rounded-full bg-royal text-paper font-mono uppercase hover:bg-royal-deep transition-colors duration-300"
              style={{ fontSize: 12, letterSpacing: "0.2em", fontWeight: 600 }}
            >
              Reserve Yours
            </button>
          </div>

          {/* Right — Packaging placeholder (actual set box visual TBD) */}
          <div className="relative flex items-center justify-center md:justify-end mt-12 md:mt-0 min-h-[360px] md:min-h-[440px]">
            <div className="border-2 border-ink p-8 sm:p-12 flex flex-col items-center justify-center text-center" style={{ width: "min(80vw, 380px)", aspectRatio: "3/4" }}>
              <p className="font-mono text-ink-faint uppercase" style={{ fontSize: 10, letterSpacing: "0.22em" }}>
                Collector Set
              </p>
              <p className="font-tattoo text-ink uppercase tracking-tighter mt-3" style={{ fontSize: "clamp(1.5rem, 5vw, 2.5rem)" }}>
                VOL. I
              </p>
              <p className="font-mono text-ink-faint uppercase mt-4" style={{ fontSize: 9, letterSpacing: "0.22em" }}>
                15 Prints - Custom Packaging
              </p>
              <div className="mt-6 w-12 h-px bg-ink/30" />
              <p className="font-mono text-ink-faint uppercase mt-4" style={{ fontSize: 9, letterSpacing: "0.22em" }}>
                Packaging Preview Coming Soon
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
