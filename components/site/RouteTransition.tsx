"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";

const COVER_MS = 260;
const HOLD_MS = 70;
const REVEAL_MS = 340;

type Phase = "hold" | "cover" | "reveal" | null;

/**
 * A single reused cover/reveal "curtain" for the first page arrival and
 * every internal navigation afterward — one mechanism, not a different
 * theatrical transition per route, so Home → Case Study → About reads as
 * one designed website rather than pages that happen to share CSS.
 *
 * Purely cosmetic: Next.js has already swapped the route's content by the
 * time this fires, so it never delays or blocks navigation — it only
 * covers, then reveals what's already there. Fully skipped under
 * prefers-reduced-motion. Driven entirely through direct ref/classList
 * manipulation rather than React state — this is a fire-and-forget DOM
 * animation, not something that should trigger extra renders.
 */
export function RouteTransition() {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);
  // Sentinel is set to true only once the entry reveal has actually
  // *completed* — not at the start of the attempt. React Strict Mode
  // (dev only) mounts every effect twice (mount -> cleanup -> mount): if
  // this flipped true up front, the first attempt's cleanup would cancel
  // its pending requestAnimationFrame, the second invocation would see
  // "already done" and skip re-running it, and the curtain would be
  // stranded in its fully-covering "hold" state forever. Gating on actual
  // completion means an interrupted first attempt is simply retried by
  // Strict Mode's second invocation instead of silently abandoned.
  const hasRevealed = useRef(false);
  const curtainRef = useRef<HTMLDivElement | null>(null);
  const markRef = useRef<HTMLDivElement | null>(null);
  const timeouts = useRef<number[]>([]);
  const rafId = useRef<number | null>(null);

  useLayoutEffect(() => {
    const curtain = curtainRef.current;
    const mark = markRef.current;
    if (!curtain || !mark) return;

    const clearPending = () => {
      timeouts.current.forEach((id) => window.clearTimeout(id));
      timeouts.current = [];
      if (rafId.current !== null) {
        window.cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    };

    const setPhase = (phase: Phase) => {
      curtain.classList.remove(
        "route-curtain-hold",
        "route-curtain-cover",
        "route-curtain-reveal",
      );
      if (phase) curtain.classList.add(`route-curtain-${phase}`);
    };

    // Restart the mark's fade in/out even if it's already mid-flash from a
    // previous navigation — removing then re-adding the class doesn't
    // restart a CSS animation on its own unless the browser is forced to
    // notice the removal first (a reflow read does that).
    const flashMark = () => {
      mark.classList.remove("route-curtain-mark-visible");
      void mark.offsetWidth;
      mark.classList.add("route-curtain-mark-visible");
    };

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!hasRevealed.current) {
      if (reducedMotion) {
        hasRevealed.current = true;
        return;
      }

      // Paint fully-covered first (no transition class yet), then defer to
      // the next frame before switching to the reveal animation — without
      // this the "hold" and "reveal" states could land in the same paint
      // and the browser would skip straight to the end value.
      setPhase("hold");
      flashMark();
      rafId.current = window.requestAnimationFrame(() => {
        setPhase("reveal");
        timeouts.current.push(
          window.setTimeout(() => {
            setPhase(null);
            hasRevealed.current = true;
          }, REVEAL_MS),
        );
      });
      return clearPending;
    }

    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    if (reducedMotion) return;

    clearPending();
    setPhase("cover");
    flashMark();
    timeouts.current.push(
      window.setTimeout(() => {
        setPhase("reveal");
        timeouts.current.push(window.setTimeout(() => setPhase(null), REVEAL_MS));
      }, COVER_MS + HOLD_MS),
    );

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
