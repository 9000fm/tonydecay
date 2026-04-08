"use client";

import { useState, useEffect } from "react";

export function useInventory(initialRemaining: number) {
  const [remaining, setRemaining] = useState(initialRemaining);

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch("/api/inventory");
        const data = await res.json();
        setRemaining(data.remaining);
      } catch {
        // Silent fail — keep last known value
      }
    };

    const interval = setInterval(poll, 30_000);
    return () => clearInterval(interval);
  }, []);

  return { remaining, soldOut: remaining <= 0 };
}
