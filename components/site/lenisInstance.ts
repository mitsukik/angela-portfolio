import type Lenis from "lenis";

// A single global smooth-scroll instance is a legitimate singleton — not
// worth a React context provider. SmoothScroll.tsx (mounted once in the
// root layout) owns the instance and reports it here; anything that needs
// to trigger a scroll consistent with Lenis's smoothing (rather than a
// native scrollIntoView that Lenis would otherwise fight on the next
// frame) reads it from here. Null whenever Lenis isn't active (mobile,
// reduced motion, or before it's initialized) — callers must fall back to
// native scrolling in that case.
let currentLenis: Lenis | null = null;

export function setLenisInstance(instance: Lenis | null) {
  currentLenis = instance;
}

export function getLenisInstance(): Lenis | null {
  return currentLenis;
}
