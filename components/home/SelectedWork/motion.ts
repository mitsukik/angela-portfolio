"use client";

import { useEffect, useLayoutEffect, useState } from "react";

// Ported verbatim from the connected Lovable "VER B" project's
// src/lib/scroll.ts — the exact math its ProjectScene choreography is
// built on, so replicating the formulas here (rather than approximating
// them) reproduces the same motion feel.
export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
export const mapRange = (v: number, a: number, b: number) => clamp((v - a) / (b - a));
export const easeOut = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
export const mix = (a: number, b: number, t: number) => a + (b - a) * clamp(t);

// useLayoutEffect only on the client — SSR has no window/matchMedia, and
// React warns if useLayoutEffect runs during server rendering. On the
// client this still resolves synchronously before paint, which is the
// point: it lets SelectedWork's `compact` (and its height-driving style)
// settle to its real value before any sibling's own mount-time
// ScrollTrigger creation reads page geometry, instead of one guessed
// render tick later via a plain useEffect.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** Media query hook (SSR-safe) — ported from Lovable's useMedia. */
export function useMedia(query: string) {
  const [matches, setMatches] = useState(false);
  useIsomorphicLayoutEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return matches;
}
