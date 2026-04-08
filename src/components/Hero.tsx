"use client";

import Image from "next/image";
import { useRef } from "react";
import { PLACEHOLDER_PRINTS } from "@/lib/constants";

const FEATURED = PLACEHOLDER_PRINTS[0];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center bg-paper overflow-hidden"
    >
      <div
        className="relative w-[min(80vw,520px)] aspect-[3/4]"
        style={{ filter: "drop-shadow(0 30px 60px rgba(26,20,12,0.25))" }}
      >
        <Image
          src={FEATURED.src}
          alt={FEATURED.alt}
          fill
          sizes="(max-width: 640px) 80vw, 520px"
          className="object-cover"
          priority
        />
      </div>
    </section>
  );
}
