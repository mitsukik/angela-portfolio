"use client";

import { useEffect, useState } from "react";

// Ported verbatim from the connected Lovable "VER B" project's
// src/lib/scroll.ts — the exact math its ProjectScene choreography is
// built on, so replicating the formulas here (rather than approximating
// them) reproduces the same motion feel.
export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
export const mapRange = (v: number, a: number, b: number) => clamp((v - a) / (b - a));
export const easeOut = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
export const mix = (a: number, b: number, t: number) => a + (b - a) * clamp(t);

/** Media query hook (SSR-safe) — ported from Lovable's useMedia. */
export function useMedia(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return matches;
}
