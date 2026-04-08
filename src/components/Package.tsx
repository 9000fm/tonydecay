"use client";

import Image from "next/image";
import { PACKAGE_IMAGES } from "@/lib/constants";

export function Package() {
  return (
    <section id="package" className="relative py-24 sm:py-32 bg-cream text-text-dark">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[1px] bg-accent/40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-center mb-4 tracking-tight">
          The Package
        </h2>
        <p className="text-text-dark-secondary text-center mb-16 max-w-lg mx-auto">
          Every collection comes in custom craft packaging designed by Tony
          Decay. Each set is carefully packed and shipped worldwide via DHL.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PACKAGE_IMAGES.map((src, i) => (
            <div
              key={i}
              className="aspect-square relative overflow-hidden group"
            >
              <Image
                src={src}
                alt={i === 0 ? "Unboxing" : i === 1 ? "Contents" : "Detail"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/60 to-transparent" />
              <span className="absolute bottom-4 left-4 text-text/70 text-xs tracking-[0.2em] uppercase">
                {i === 0 ? "Unboxing" : i === 1 ? "Contents" : "Detail"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-[1px] bg-accent/40" />
    </section>
  );
}
