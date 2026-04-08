"use client";

export function Certificate() {
  return (
    <section className="relative py-24 sm:py-32 bg-cream-dark text-text-dark">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[1px] bg-accent/40" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-accent text-xs font-medium tracking-[0.3em] uppercase mb-4">
          Authenticity
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight">
          Signed &amp; Numbered
        </h2>
        <p className="text-text-dark-secondary leading-relaxed mb-3">
          Each collection includes a hand-signed certificate of authenticity,
          individually numbered from 1/100 to 100/100. Once they&apos;re gone,
          they&apos;re gone.
        </p>
        <p className="text-text-dark-secondary text-sm">
          Only 100 sets will ever be produced.
        </p>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-[1px] bg-accent/40" />
    </section>
  );
}
