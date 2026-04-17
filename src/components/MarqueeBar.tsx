"use client";

const REPEAT = 28;
const ITEMS = Array(REPEAT).fill("WORLDWIDE SHIPPING");

export function MarqueeBar() {
  const sequence = ITEMS.flatMap((item) => [item, "\u2605"]);
  const doubled = [...sequence, ...sequence];

  return (
    <div className="w-full bg-bg/40 backdrop-blur-md text-paper/80 border-b border-paper/25 overflow-hidden h-7 flex items-center">
      <div
        className="flex shrink-0 whitespace-nowrap"
        style={{ animation: "marquee-scroll 120s linear infinite" }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="font-mono uppercase px-4 shrink-0"
            style={{ fontSize: 11, letterSpacing: "0.10em" }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
