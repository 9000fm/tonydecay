"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&*-_";

export function useScramble(target: string, durationMs = 380): string {
  const [display, setDisplay] = useState(target);
  const rafRef = useRef<number | null>(null);
  const prevTargetRef = useRef<string>(target);

  useEffect(() => {
    if (prevTargetRef.current === target) return;
    prevTargetRef.current = target;

    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const settled = Math.floor(progress * target.length);
      let next = "";
      for (let i = 0; i < target.length; i++) {
        if (i < settled) {
          next += target[i];
        } else if (target[i] === " ") {
          next += " ";
        } else {
          next += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      setDisplay(next);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(target);
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [target, durationMs]);

  return display;
}
