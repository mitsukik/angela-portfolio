"use client";

import { useEffect, useState } from "react";

/*
 * Nemu typewriter (handoff §4): 16–32ms per character, total capped ≈1.5s.
 * Text space is reserved (hidden copy in the same grid cell) so options
 * below never move; screen readers get the full text once via the visually
 * hidden span; reduced motion shows the full line immediately.
 */
export function Typer({ text, reduce, className }: { text: string; reduce: boolean; className: string }) {
  // Callers key this component by its text, so a new line always starts at 0.
  const [typed, setN] = useState(0);
  const n = reduce ? text.length : typed;

  useEffect(() => {
    if (reduce) return;
    const step = Math.min(32, Math.max(16, 1500 / Math.max(1, text.length)));
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setN(i);
      if (i >= text.length) window.clearInterval(id);
    }, step);
    return () => window.clearInterval(id);
  }, [text, reduce]);

  return (
    <div className="v3-typer">
      <p aria-hidden="true" className={`v3-typer-line v3-typer-ghost ${className}`}>{text}</p>
      <p aria-hidden="true" className={`v3-typer-line ${className}`}>
        {text.slice(0, n)}
        {n < text.length ? <span className="v3-typer-caret" /> : null}
      </p>
      <span className="v3-sr">{text}</span>
    </div>
  );
}
