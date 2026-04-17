"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const DISCIPLINES = [
  "Traditional tattoo",
  "Flash design",
  "Illustration",
  "Print making",
];

export function Artist() {
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (quoteRef.current) {
        // Color shift entrance instead of opacity fade
        gsap.fromTo(
          quoteRef.current,
          { color: "rgba(240,235,220,0.15)" },
          {
            color: "rgba(240,235,220,1)",
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: quoteRef.current,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="artist"
      data-nav-dark="true"
      className="bg-bg border-b-2 border-paper relative overflow-hidden py-20 sm:py-28"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section label */}
        <div className="inline-block border-2 border-paper px-3 py-1 font-mono text-paper uppercase mb-8 sm:mb-12" style={{ fontSize: 10, letterSpacing: "0.22em" }}>
          Who / The Artist
        </div>

        {/* Wireframe card holding the quote */}
        <div className="border-2 border-paper p-6 sm:p-10 mb-10 sm:mb-14">
          <div
            ref={quoteRef}
            className="font-display italic"
            style={{
              fontSize: "clamp(1.5rem, 4.2vw, 2.8rem)",
              lineHeight: 1.18,
            }}
          >
            &ldquo;Every print is an accident I learned to love. The mistakes
            stay. That&apos;s where the soul lives.&rdquo;
          </div>
          <div className="mt-6 font-mono text-paper/60 uppercase" style={{ fontSize: 11, letterSpacing: "0.22em" }}>
            - Tony Decay
          </div>
        </div>

        {/* Bio + disciplines in two-up wireframe cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="border-2 border-paper p-6 sm:p-8">
            <p className="font-mono text-paper/60 uppercase mb-3" style={{ fontSize: 10, letterSpacing: "0.22em" }}>
              Bio
            </p>
            <p className="font-sans text-paper/85 text-base sm:text-lg leading-relaxed">
              Tony Decay is a tattoo artist and illustrator blending traditional
              tattoo flash with the iconography of a generation that grew up
              on cartridges and binders. Based between Lima and the internet,
              hand-drawn, hand-printed, no shortcuts.
            </p>
          </div>

          <div className="border-2 border-paper p-6 sm:p-8">
            <p className="font-mono text-paper/60 uppercase mb-3" style={{ fontSize: 10, letterSpacing: "0.22em" }}>
              Disciplines
            </p>
            <ul className="space-y-2 font-sans text-paper/85 text-base sm:text-lg">
              {DISCIPLINES.map((d) => (
                <li key={d} className="flex items-baseline gap-3">
                  <span className="font-mono text-paper/40" style={{ fontSize: 11 }}>
                    /
                  </span>
                  {d}
                </li>
              ))}
            </ul>

            <a
              href="https://www.instagram.com/tony.decay"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 font-mono text-paper hover:text-royal transition-colors uppercase"
              style={{ fontSize: 11, letterSpacing: "0.22em" }}
            >
              @tony.decay -&gt;
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
