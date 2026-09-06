"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { setLenisInstance } from "./lenisInstance";

const SMOOTH_SCROLL_QUERY =
  "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

const DEFAULT_LAG_SMOOTHING_THRESHOLD = 500;
const DEFAULT_LAG_SMOOTHING_ADJUSTED_TIME = 33;

/**
 * Mounted once in the root layout so it persists across client-side
 * navigation between routes instead of being recreated per page.
 */
export function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const media = gsap.matchMedia();

    media.add(SMOOTH_SCROLL_QUERY, () => {
      const lenis = new Lenis({
        lerp: 0.1,
        wheelMultiplier: 1,
        syncTouch: false,
        anchors: false,
        stopInertiaOnNavigate: true,
        autoRaf: false,
      });
      lenisRef.current = lenis;
      setLenisInstance(lenis);

      const onTick = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(onTick);
      gsap.ticker.lagSmoothing(0);

      const onLenisScroll = () => ScrollTrigger.update();
      lenis.on("scroll", onLenisScroll);

      return () => {
        lenis.off("scroll", onLenisScroll);
        gsap.ticker.remove(onTick);
        gsap.ticker.lagSmoothing(
          DEFAULT_LAG_SMOOTHING_THRESHOLD,
          DEFAULT_LAG_SMOOTHING_ADJUSTED_TIME,
        );
        lenis.destroy();
        lenisRef.current = null;
        setLenisInstance(null);
      };
    });

    return () => {
      media.revert();
    };
  }, []);

  useLayoutEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;

    // The actual, confirmed cause of wheel scrolling getting stuck partway
    // down a page after a client-side navigation (while dragging the
    // native scrollbar still worked): Lenis caches a scroll `limit`
    // (max scrollable distance) and only recalculates it in response to
    // a `resize` event or a ResizeObserver on its content element — which
    // defaults to document.documentElement. That element's *reported*
    // size tracks the viewport, not the document's scrollable height, so
    // it never fires just because Next.js swapped in a page with
    // different content height. Confirmed by direct inspection: right
    // after navigating from Home (~3570px tall) to a Case Study
    // (~9998px tall), document.body.scrollHeight was already correct,
    // but Lenis's own `limit` stayed at Home's old ~2670px max for over
    // 3 seconds — wheel-driven scroll was silently clamped there, and
    // only an actual window resize event made it recalculate. Calling
    // resize() explicitly here forces the recalculation immediately.
    lenis.resize();

    // Next.js resets the real window scroll position on every client-side
    // navigation, but Lenis's own internal target/animated-scroll state
    // doesn't know that happened — its next wheel/touch input gets
    // smoothed relative to wherever it last thought the page was. Resync
    // after the resize() above so the fresh limit is already in effect.
    lenis.scrollTo(window.scrollY, { immediate: true });
  }, [pathname]);

  return null;
}
