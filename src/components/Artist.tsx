"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { ARTIST_AVATAR } from "@/lib/constants";

export function Artist() {
  const sectionRef = useRef<HTMLElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLParagraphElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const bioRef = useRef<HTMLParagraphElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Avatar — bigger scale with slight unrotate, snaps into focus
      if (avatarRef.current) {
        gsap.fromTo(
          avatarRef.current,
          { opacity: 0, scale: 0.5, rotate: -8 },
          {
            opacity: 1,
            scale: 1,
            rotate: 0,
            duration: 1.0,
            ease: "back.out(1.4)",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Text elements — scale + Y combo, staggered
      const textEls = [
        badgeRef.current,
        nameRef.current,
        bioRef.current,
        linkRef.current,
      ].filter(Boolean);

      gsap.fromTo(
        textEls,
        { opacity: 0, scale: 0.95, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="artist" className="relative py-24 sm:py-32 bg-cream text-text-dark">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[1px] bg-accent/40" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center text-center">
          {/* Avatar placeholder */}
          <div
            ref={avatarRef}
            className="w-28 h-28 rounded-full border border-accent/40 overflow-hidden mb-8 opacity-0 relative"
          >
            <Image
              src={ARTIST_AVATAR}
              alt="Tony Decay"
              fill
              className="object-cover"
              sizes="112px"
            />
          </div>

          <p
            ref={badgeRef}
            className="text-accent text-xs font-medium tracking-[0.3em] uppercase mb-4 opacity-0"
          >
            The Artist
          </p>

          <h2
            ref={nameRef}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight opacity-0"
          >
            Tony Decay
          </h2>

          <p
            ref={bioRef}
            className="text-text-dark-secondary leading-relaxed max-w-lg mb-8 opacity-0"
          >
            Tattoo artist and illustrator specializing in golden age fan art.
            Every piece is drawn by hand with love for the classics that shaped a
            generation of gamers and collectors.
          </p>

          <a
            ref={linkRef}
            href="https://instagram.com/tony.decay"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-text-dark-secondary hover:text-accent transition-colors duration-300 text-sm tracking-wider opacity-0"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="5" />
              <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
            </svg>
            @tony.decay
          </a>
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-[1px] bg-accent/40" />
    </section>
  );
}
