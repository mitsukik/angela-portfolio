"use client";

import { useLayoutEffect, useState, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * 0..1 scroll progress across a pinned track's own scrollable distance.
 * Ported from the connected Lovable "VER B" project's
 * src/lib/scroll.ts useTrackProgress (progress = -top / (height -
 * viewport)) — driven here via ScrollTrigger's "top top" -> "bottom
 * bottom" span (the exact GSAP equivalent of that formula) instead of a
 * raw scroll listener, so it shares the site's existing Lenis-synced
 * GSAP pipeline (see SmoothScroll.tsx) rather than adding a second,
 * independent scroll-tracking mechanism.
 */
export function useWorkStageProgress(ref: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => setProgress(self.progress),
    });

    return () => trigger.kill();
  }, [ref]);

  return progress;
}
