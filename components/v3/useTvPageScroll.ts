"use client";

import { useEffect, type RefObject } from "react";
import { getLenisInstance } from "@/components/site/lenisInstance";

/*
 * Laptop TV page scroll (F-01). When the board canvas is taller than the
 * viewport, the page scrolls vertically. The board keeps its own scroller
 * (INDEX scroll-to-tune-in, ABOUT chapters), so the wheel is shared:
 *
 *   down: the page scrolls first until the board's bottom (channel strip) is
 *         in view; only a NEW gesture after that reaches the board, so one
 *         trackpad fling can't run on into a channel / chapter change
 *   up:   the board scrolls back first; at its top the page scrolls up
 *         (native scroll chaining)
 *
 * A gesture ends after GESTURE_GAP ms without wheel events.
 */
const GESTURE_GAP = 220;

export function useTvPageScroll(stageRef: RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    const stage = stageRef.current;
    if (!enabled || !stage) return;
    let pageGestureAt = -Infinity;

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return; // pinch-zoom / horizontal
      const now = performance.now();
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      const inPageGesture = now - pageGestureAt < GESTURE_GAP;
      if (e.deltaY > 0 && y < max - 1) {
        e.preventDefault();
        const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY;
        const to = Math.min(max, y + dy);
        const lenis = getLenisInstance();
        if (lenis) lenis.scrollTo(to, { immediate: true, force: true });
        else window.scrollTo(0, to);
        pageGestureAt = now;
        return;
      }
      if (e.deltaY > 0 && inPageGesture) {
        // the rest of the gesture that scrolled the page doesn't change channel / chapter
        e.preventDefault();
        pageGestureAt = now;
      }
    };

    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [stageRef, enabled]);
}
