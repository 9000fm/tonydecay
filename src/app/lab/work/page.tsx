"use client";

import Link from "next/link";
import { Work } from "@/components/Work";

const PAPER = "#f0ebdc";
const GOLD = "#F7C234";

/* Lab parking spot for the SELECTED WORK section. Pulled off the live
   homepage on 2026-04-28 — the FLASH/PRINT/TATTOO/STUDY filter wasn't
   wired up and the section duplicated the gallery's job. Kept here so
   we can revisit when there's a real broader portfolio. */

export default function LabWorkPage() {
  return (
    <main style={{ background: "#0a0a0a", color: PAPER, minHeight: "100vh" }}>
      <header
        className="sticky top-0 z-40 w-full"
        style={{ background: "#0a0a0a", borderBottom: "1px solid rgba(240,235,220,0.18)" }}
      >
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-3 sm:px-10">
          <Link
            href="/lab"
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.3em",
              fontWeight: 800,
              color: GOLD,
              textDecoration: "none",
              padding: "4px 10px",
              border: `1px solid ${GOLD}`,
            }}
          >
            ← /lab
          </Link>
          <span
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.28em",
              fontWeight: 800,
              color: "rgba(240,235,220,0.65)",
            }}
          >
            LAB / WORK · parked from home (filter TBD)
          </span>
        </div>
      </header>

      <Work />

      <footer
        className="mx-auto max-w-3xl px-6 py-16 sm:px-10"
        style={{ borderTop: "1px dashed rgba(240,235,220,0.25)" }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.32em",
            fontWeight: 800,
            color: "rgba(240,235,220,0.5)",
          }}
        >
          NOTE / pulled from homepage 2026-04-28 · FLASH/PRINT/TATTOO/STUDY filter not wired up
        </p>
      </footer>
    </main>
  );
}
