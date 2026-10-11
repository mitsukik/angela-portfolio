"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { getLenisInstance } from "@/components/site/lenisInstance";
import { consumeLanguageSwitch, restoreTarget } from "@/components/site/navigationIntent";

/*
 * Page Transition 01 — "Old TV CRT" (approved; source: Portfolio V3
 * Connected.dc.html → go()). Replaces the V2 RouteTransition curtain.
 *
 *   0–130    page collapses: scale(1,1) → scale(1,.012) @85% → scale(.92,.004)
 *            + brightness 4, opacity 0 — cubic-bezier(.6,0,.9,.4)
 *   110–260  scan line flicker (opacity 0→1→.35→1→.6→0, scaleX 1→.7)
 *   190–270  canvas noise at opacity .42 for 80ms (warm / cool grain)
 *   255      route changes (under cover)
 *   262–412  page expands: scale(.94,.006) → scale(1,1.015) @75% → scale(1,1),
 *            brightness 3.5 → 1 — cubic-bezier(.2,.8,.2,1), 150ms
 *   470      unlock; a route queued during the transition runs next
 *
 * Production adaptation: Next swaps routes asynchronously, so the expand
 * starts when the new route has committed (never before 262ms; fallback
 * 1.5s). Back/forward replays the cover + expand. Reduced motion: instant
 * swap, then a 150ms ease-out fade. Excluded: mailto:, tel:, Drive links,
 * /demos/, new-tab / modified clicks, other origins, same-page hashes and
 * `data-no-transition` links (language switch keeps its own 180ms fade and
 * the reader's place — logic carried over from the V2 RouteTransition).
 */

const COLLAPSE: Keyframe[] = [
  { transform: "scale(1,1)", filter: "brightness(1)" },
  { transform: "scale(1,.012)", filter: "brightness(3)", offset: 0.85 },
  { transform: "scale(.92,.004)", filter: "brightness(4)", opacity: 0 },
];
const LINE_OUT: Keyframe[] = [
  { opacity: 0, transform: "scaleX(1)" },
  { opacity: 1, offset: 0.15 },
  { opacity: 0.35, offset: 0.35 },
  { opacity: 1, offset: 0.55 },
  { opacity: 0.6, transform: "scaleX(.85)", offset: 0.8 },
  { opacity: 0, transform: "scaleX(.7)" },
];
const LINE_IN: Keyframe[] = [{ opacity: 1, transform: "scaleX(.7)" }, { opacity: 0, transform: "scaleX(1)" }];
const EXPAND: Keyframe[] = [
  { transform: "scale(.94,.006)", filter: "brightness(3.5)", opacity: 1 },
  { transform: "scale(1,1.015)", filter: "brightness(1.25)", offset: 0.75 },
  { transform: "scale(1,1)", filter: "brightness(1)", opacity: 1 },
];

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function shouldIntercept(a: HTMLAnchorElement, e: MouseEvent): string | null {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return null;
  if (a.target && a.target !== "_self") return null;
  if (a.hasAttribute("download") || a.hasAttribute("data-no-transition")) return null;
  const raw = a.getAttribute("href") || "";
  if (!raw || /^(mailto:|tel:|javascript:)/i.test(raw) || /drive\.google|\/demos\//.test(raw)) return null;
  const url = new URL(a.href, window.location.href);
  if (url.origin !== window.location.origin) return null;
  if (url.pathname === window.location.pathname) return null;
  return url.pathname + url.search + url.hash;
}

export function PageTransitionStage({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const stageRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timers = useRef<number[]>([]);
  const busy = useRef(false);
  const pend = useRef<string | null>(null);
  const awaiting = useRef<{ start: number; reducedSwap: boolean } | null>(null);
  /** Pathname a PT01 navigation is heading to: that page must open at its top. */
  const topFor = useRef<string | null>(null);
  const noiseRaf = useRef(0);
  const prevPath = useRef(pathname);

  const later = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));
  const clearAnims = () => stageRef.current?.getAnimations().forEach((a) => a.cancel());

  const noise = (dur: number) => {
    const cv = canvasRef.current;
    const c = cv?.getContext("2d");
    if (!cv || !c) return;
    const W = cv.width, H = cv.height, end = performance.now() + dur, img = c.createImageData(W, H), d = img.data;
    const tick = () => {
      for (let i = 0; i < d.length; i += 4) {
        const v = Math.random() * 255, cool = Math.random() < 0.08;
        d[i] = v * (cool ? 0.82 : 0.92);
        d[i + 1] = v * (cool ? 0.8 : 0.93);
        d[i + 2] = Math.min(255, v * (cool ? 1.05 : 1));
        d[i + 3] = 255;
      }
      c.putImageData(img, 0, 0);
      if (performance.now() < end) noiseRaf.current = requestAnimationFrame(tick);
    };
    cancelAnimationFrame(noiseRaf.current);
    tick();
  };

  const centreOrigin = () => {
    const el = stageRef.current;
    if (el) el.style.transformOrigin = `50% ${window.scrollY + window.innerHeight / 2}px`;
  };

  const unlockAt = (ms: number) =>
    later(ms, () => {
      busy.current = false;
      if (pend.current) {
        const next = pend.current;
        pend.current = null;
        go(next);
      }
    });

  const expand = useCallback(() => {
    const el = stageRef.current, line = lineRef.current, w = awaiting.current;
    awaiting.current = null;
    if (!el || !w) return;
    if (w.reducedSwap) {
      clearAnims();
      el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150, easing: "ease-out" });
      busy.current = false;
      return;
    }
    const run = () => {
      clearAnims();
      if (canvasRef.current) canvasRef.current.style.opacity = "0";
      centreOrigin();
      line?.animate(LINE_IN, { duration: 110, easing: "ease-out" });
      el.animate(EXPAND, { duration: 150, easing: "cubic-bezier(.2,.8,.2,1)" });
      unlockAt(208);
    };
    const wait = 262 - (performance.now() - w.start);
    if (wait > 0) later(wait, run);
    else run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // `go` is referenced by unlockAt before declaration via hoisted function semantics.
  function go(href: string) {
    const el = stageRef.current, line = lineRef.current;
    if (busy.current) {
      pend.current = href;
      return;
    }
    // A link to another page opens that page at its top (Back / Forward and the
    // language switch never come through here and keep their own scroll rules).
    topFor.current = new URL(href, window.location.href).pathname;
    if (!el || !line) {
      router.push(href);
      return;
    }
    busy.current = true;
    clearAnims();
    const start = performance.now();
    if (reduced()) {
      awaiting.current = { start, reducedSwap: true };
      router.push(href);
    } else {
      centreOrigin();
      el.animate(COLLAPSE, { duration: 130, easing: "cubic-bezier(.6,0,.9,.4)", fill: "forwards" });
      line.animate(LINE_OUT, { delay: 110, duration: 150 });
      later(190, () => {
        if (canvasRef.current) canvasRef.current.style.opacity = ".42";
        noise(80);
      });
      later(255, () => {
        if (canvasRef.current) canvasRef.current.style.opacity = "0";
        awaiting.current = { start, reducedSwap: false };
        router.push(href);
      });
    }
    // Fallback: never leave the page covered.
    later(1500, () => {
      if (awaiting.current) expand();
      if (busy.current && !awaiting.current) busy.current = false;
    });
  }

  // Link interception (capture phase; preventDefault lets Next <Link> stand down
  // while other click handlers — e.g. the Remote's LED press — still run).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const href = shouldIntercept(a, e);
      if (!href) return;
      e.preventDefault();
      go(href);
    };
    // Back / forward replays the transition: cover immediately, expand on commit.
    const onPop = () => {
      topFor.current = null;
      const el = stageRef.current;
      if (!el || reduced()) {
        awaiting.current = { start: performance.now() - 262, reducedSwap: true };
        return;
      }
      clearAnims();
      centreOrigin();
      el.animate(COLLAPSE, { duration: 130, easing: "cubic-bezier(.6,0,.9,.4)", fill: "forwards" });
      lineRef.current?.animate(LINE_OUT, { delay: 110, duration: 150 });
      busy.current = true;
      awaiting.current = { start: performance.now(), reducedSwap: false };
      later(1500, () => {
        if (awaiting.current) expand();
      });
    };
    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPop);
    const t = timers.current;
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPop);
      t.forEach((id) => window.clearTimeout(id));
      cancelAnimationFrame(noiseRaf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Route committed: expand (CRT) or restore the reader's place (language switch).
  useLayoutEffect(() => {
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;
    const languageSwitch = consumeLanguageSwitch(pathname);
    if (languageSwitch && !awaiting.current) {
      later(60, () => {
        void import("gsap/ScrollTrigger")
          .then(({ ScrollTrigger }) => {
            if (window.location.pathname !== pathname) return;
            ScrollTrigger.refresh();
            const top = restoreTarget(languageSwitch);
            const lenis = getLenisInstance();
            if (lenis) {
              lenis.resize();
              lenis.scrollTo(top, { immediate: true, force: true });
            } else window.scrollTo(0, top);
            ScrollTrigger.update();
          })
          .catch(() => {
            if (window.location.pathname === pathname) window.scrollTo(0, restoreTarget(languageSwitch));
          });
      });
      return;
    }
    // Root cause of CASE prev/next opening mid-page: the stage swaps the route
    // while the old page is scrolled to its bottom (where the bottom navigation
    // lives), and the persistent Lenis instance re-applies that old position
    // on commit (SmoothScroll resyncs it to window.scrollY), overriding the
    // App Router's top reset. Reset here — layout effect, before paint, while
    // the CRT stage is still collapsed — so the new page is revealed at its top.
    if (topFor.current === pathname) {
      topFor.current = null;
      const lenis = getLenisInstance();
      if (lenis) {
        lenis.resize();
        lenis.scrollTo(0, { immediate: true, force: true });
      }
      window.scrollTo(0, 0);
    }
    if (awaiting.current) expand();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      <div ref={stageRef} className="pt01-stage">
        {children}
      </div>
      <div aria-hidden="true" className="pt01-fx">
        <canvas ref={canvasRef} width={240} height={140} className="pt01-noise" />
        <div ref={lineRef} className="pt01-line" />
      </div>
    </>
  );
}
