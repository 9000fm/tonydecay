"use client";

import { useRef, useCallback } from "react";

interface SplitResult {
  chars: HTMLSpanElement[];
  words: HTMLSpanElement[];
  lines: HTMLSpanElement[];
}

/**
 * Custom text splitter hook — replaces GSAP's paid SplitText plugin.
 * Wraps characters, words, and lines in <span> elements for animation.
 */
export function useSplitText(mode: "chars" | "words" | "lines" | "chars,words" = "chars,words") {
  const ref = useRef<HTMLElement>(null);
  const splitRef = useRef<SplitResult | null>(null);

  const split = useCallback(() => {
    const el = ref.current;
    if (!el) return null;

    const text = el.textContent || "";
    el.innerHTML = "";

    const chars: HTMLSpanElement[] = [];
    const words: HTMLSpanElement[] = [];

    const wordStrings = text.split(/\s+/).filter(Boolean);

    wordStrings.forEach((word, wi) => {
      const wordSpan = document.createElement("span");
      wordSpan.className = "split-word";
      wordSpan.style.display = "inline-block";
      wordSpan.style.overflow = "hidden";

      if (mode.includes("chars")) {
        word.split("").forEach((char) => {
          const charSpan = document.createElement("span");
          charSpan.className = "split-char";
          charSpan.style.display = "inline-block";
          charSpan.textContent = char;
          wordSpan.appendChild(charSpan);
          chars.push(charSpan);
        });
      } else {
        wordSpan.textContent = word;
      }

      el.appendChild(wordSpan);
      words.push(wordSpan);

      // Add space between words
      if (wi < wordStrings.length - 1) {
        const space = document.createTextNode("\u00A0");
        el.appendChild(space);
      }
    });

    splitRef.current = { chars, words, lines: [] };
    return splitRef.current;
  }, [mode]);

  const revert = useCallback(() => {
    const el = ref.current;
    if (!el || !splitRef.current) return;
    const text = el.textContent || "";
    el.innerHTML = text;
    splitRef.current = null;
  }, []);

  return { ref, split, revert, result: splitRef };
}
