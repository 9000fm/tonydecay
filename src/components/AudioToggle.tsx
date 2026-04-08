"use client";

import { useRef, useState, useCallback } from "react";

export function AudioToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [muted, setMuted] = useState(false);
  const [started, setStarted] = useState(false);

  const start = useCallback(() => {
    if (started || !audioRef.current) return;
    audioRef.current.volume = 0.15;
    audioRef.current.play().catch(() => {
      // Autoplay blocked — silently fail
    });
    setStarted(true);
  }, [started]);

  const toggle = useCallback(() => {
    if (!audioRef.current) return;
    if (!started) {
      start();
      return;
    }
    const next = !muted;
    audioRef.current.muted = next;
    setMuted(next);
  }, [muted, started, start]);

  return (
    <>
      {/* Audio element — placeholder source, will be replaced with custom track */}
      <audio ref={audioRef} loop preload="none">
        {/* <source src="/audio/ambient.mp3" type="audio/mpeg" /> */}
      </audio>

      {/* Mute/unmute toggle — fixed bottom-right */}
      <button
        onClick={toggle}
        className="fixed bottom-5 right-5 z-50 w-10 h-10 flex items-center justify-center text-text-muted hover:text-text transition-colors duration-300"
        aria-label={muted ? "Unmute" : "Mute"}
      >
        {muted || !started ? (
          // Muted icon
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          // Playing icon
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <path d="M19.07 4.93a10 10 0 010 14.14" />
            <path d="M15.54 8.46a5 5 0 010 7.07" />
          </svg>
        )}
      </button>
    </>
  );
}
