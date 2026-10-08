"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";
import { getLenisInstance } from "./lenisInstance";
import { consumeLanguageSwitch, restoreTarget } from "./navigationIntent";

// Total visible transition for ordinary navigation (P0.7): the curtain
// covers the new route's first frame and reveals it over REVEAL_MS — no
// cover phase, no hold, no wordmark after the first arrival. Opening
// several cases in a row must never feel like a tax. Must match
// .route-curtain-reveal in globals.css.
const REVEAL_MS = 300;

/**
 * One reused reveal "curtain" for the first page arrival and every
 * internal navigation, so the site reads as one designed piece.
 *
 * Purely cosmetic: Next.js has already swapped the route's content by the
 * time this fires, so it never delays navigation. The reveal is a single
 * CSS keyframe animation whose first keyframe is "covered" (fill-mode
 * both), started before the new route paints — no rAF hand-off that a
 * background tab could stall, and a timeout always clears it, so content
 * can never be left covered. Language switches skip the curtain entirely
 * and keep the reader's place (see navigationIntent.ts). Fully skipped
 * under prefers-reduced-motion.
 */
export function RouteTransition() {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);
  const hasRevealed = useRef(false);
  const curtainRef = useRef<HTMLDivElement | null>(null);
  const markRef = useRef<HTMLDivElement | null>(null);
  const timeouts = useRef<number[]>([]);

  useLayoutEffect(() => {
    const curtain = curtainRef.current;
    const mark = markRef.current;
    if (!curtain || !mark) return;

    const clearPending = () => {
      timeouts.current.forEach((id) => window.clearTimeout(id));
      timeouts.current = [];
    };

    const restart = (el: HTMLElement, className: string) => {
      el.classList.remove(className);
      void el.offsetWidth;
      el.classList.add(className);
      timeouts.current.push(window.setTimeout(() => el.classList.remove(className), REVEAL_MS + 60));
    };

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!hasRevealed.current) {
      hasRevealed.current = true;
      if (reducedMotion) return;
      restart(curtain, "route-curtain-reveal");
      restart(mark, "route-curtain-mark-visible");
      return clearPending;
    }

    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    clearPending();
    mark.classList.remove("route-curtain-mark-visible");

    const languageSwitch = consumeLanguageSwitch(pathname);
    if (languageSwitch) {
      curtain.classList.remove("route-curtain-reveal");
      // Same page, other language: no curtain. Restore the reader's place
      // once the new tree — including layout-effect state such as Selected
      // Work's pinned/stacked mode — has settled.
      timeouts.current.push(
        window.setTimeout(() => {
          void import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
            if (window.location.pathname !== pathname) return;
            ScrollTrigger.refresh();
            const top = restoreTarget(languageSwitch);
            const lenis = getLenisInstance();
            if (lenis) {
              lenis.resize();
              lenis.scrollTo(top, { immediate: true, force: true });
            } else {
              window.scrollTo(0, top);
            }
            ScrollTrigger.update();
          }).catch(() => {
            if (window.location.pathname !== pathname) return;
            window.scrollTo(0, restoreTarget(languageSwitch));
          });
        }, 60),
      );
      return clearPending;
    }

    if (reducedMotion) return;
    restart(curtain, "route-curtain-reveal");
    return clearPending;
  }, [pathname]);

  return (
    <>
      <div ref={curtainRef} aria-hidden="true" className="route-curtain" />
      <div ref={markRef} aria-hidden="true" className="route-curtain-mark">
        ANGELA YU
      </div>
    </>
  );
}
