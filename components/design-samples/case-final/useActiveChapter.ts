"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Tracks which chapter section is currently in the "reading zone" of the
 * viewport. Uses IntersectionObserver rather than a ScrollTrigger per
 * chapter — this is discrete state (which chapter am I in), not a
 * scrubbed/animated value, so the native observer is the cheaper, lighter
 * tool and adds no extra GSAP tickers.
 */
export function useActiveChapter(chapterCount: number) {
  const [active, setActive] = useState(0);
  const refs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const elements = refs.current.filter((el): el is HTMLElement => Boolean(el));
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = elements.indexOf(visible.target as HTMLElement);
        if (index !== -1) setActive(index);
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [chapterCount]);

  // Stable per-index callbacks (created once, not one new closure per
  // render) — CaseStudyPrototype re-renders on every `active` change, and
  // a fresh ref-callback identity each time would make React detach and
  // reattach every chapter div's ref on every scroll-triggered update.
  const registerChapter = useMemo(() => {
    const callbacks: Array<(el: HTMLElement | null) => void> = [];
    return (index: number) => {
      callbacks[index] ??= (el: HTMLElement | null) => {
        refs.current[index] = el;
      };
      return callbacks[index];
    };
  }, []);

  return { active, registerChapter };
}
