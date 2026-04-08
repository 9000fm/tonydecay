"use client";

import Image from "next/image";
import { ARTIST_AVATAR } from "@/lib/constants";

export function Artist() {
  return (
    <section id="artist" className="relative py-24 sm:py-32 bg-cream text-text-dark">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[1px] bg-accent/40" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="w-28 h-28 rounded-full border border-accent/40 overflow-hidden mb-8 relative">
            <Image
              src={ARTIST_AVATAR}
              alt="Tony Decay"
              fill
              className="object-cover"
              sizes="112px"
            />
          </div>

          <p className="text-accent text-xs font-medium tracking-[0.3em] uppercase mb-4">
            The Artist
          </p>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Tony Decay
          </h2>

          <p className="text-text-dark-secondary leading-relaxed max-w-lg mb-8">
            Tattoo artist and illustrator specializing in golden age fan art.
            Every piece is drawn by hand with love for the classics that shaped a
            generation of gamers and collectors.
          </p>

          <a
            href="https://www.instagram.com/tony.decay"
            target="_blank"
            rel="noopener noreferrer"
            className="font-tattoo uppercase text-text-dark-secondary hover:text-accent transition-colors duration-300 text-sm"
            style={{ letterSpacing: "0.06em" }}
          >
            @TONY.DECAY
          </a>
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-[1px] bg-accent/40" />
    </section>
  );
}
