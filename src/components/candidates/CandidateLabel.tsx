"use client";

/* CandidateLabel — visible identifying banner above each candidate section
   so Flavio can pick which to keep. Bright gold, ink text, dashed border,
   anchor link target. Deleted in cleanup once Flavio picks a winner. */

interface CandidateLabelProps {
  index: number;
  name: string;
  anchor: string;
}

export function CandidateLabel({ index, name, anchor }: CandidateLabelProps) {
  const num = String(index).padStart(2, "0");
  return (
    <div
      id={anchor}
      style={{
        background: "var(--color-gold)",
        color: "var(--color-ink)",
        borderTop: "3px dashed var(--color-ink)",
        borderBottom: "3px dashed var(--color-ink)",
        padding: "10px 24px",
        textAlign: "center",
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: "0.32em",
        textTransform: "uppercase",
      }}
    >
      ★ CANDIDATE {num} · {name} · #{anchor} ★
    </div>
  );
}
