"use client";

import { useEffect, useRef, useState } from "react";

type Mode = "idle" | "link" | "view";

const TOUCH_QUERY = "(hover: none)";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
const FOLLOW_MS = 45; // exponential time constant of the trailing follow
const OFFSET_MS = 90; // time constant of the view-mode offset easing
const VIEW_OFFSET = 44;
const MAX_STRETCH = 0.22;

/**
 * V2 cursor accent, mounted by the V2 pages (Home, About) only — Case
 * Study pages keep the native cursor alone for this phase. Styles are in
 * custom-cursor.css, loaded globally from the root layout. The native
 * cursor is never hidden — a ring trails the real pointer, grows over
 * links/buttons, and becomes a lime label beside the pointer over
 * `[data-cursor="view"]` elements (label from `data-cursor-label`).
 *
 * Motion is frame-rate independent (exponential smoothing, not a per-frame
 * lerp) so 60Hz and 120Hz feel identical. One requestAnimationFrame loop
 * writes straight to refs — no React state per frame — and it stops itself
 * once the ring has settled. Not rendered on touch devices; under
 * prefers-reduced-motion it follows the pointer exactly (no trail, stretch
 * or offset easing).
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const outerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const query = window.matchMedia(TOUCH_QUERY);
    const sync = () => setEnabled(!query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const outer = outerRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!outer || !ring || !label) return;

    const reducedQuery = window.matchMedia(REDUCED_QUERY);
    let reduced = reducedQuery.matches;
    const onReduced = () => {
      reduced = reducedQuery.matches;
    };
    reducedQuery.addEventListener("change", onReduced);

    let mx = 0;
    let my = 0;
    let x = 0;
    let y = 0;
    let stretch = 0;
    let angle = 0;
    let offset = 0;
    let last = 0;
    let started = false;
    let mode: Mode = "idle";
    let raf = 0;
    let hitTest = false;

    const setMode = (next: Mode, text: string) => {
      if (next !== mode) {
        mode = next;
        outer.dataset.mode = next;
      }
      if (label.textContent !== text) label.textContent = text;
    };

    const resolveMode = (target: Element | null) => {
      const view = target?.closest<HTMLElement>('[data-cursor="view"]');
      if (view) return setMode("view", view.dataset.cursorLabel ?? "");
      if (target?.closest("a, button")) return setMode("link", "");
      setMode("idle", "");
    };

    const frame = (now: number) => {
      raf = 0;
      if (hitTest) {
        hitTest = false;
        resolveMode(document.elementFromPoint(mx, my));
      }
      const dt = last ? Math.min(50, now - last) : 16;
      last = now;

      const k = reduced ? 1 : 1 - Math.exp(-dt / FOLLOW_MS);
      const px = x;
      const py = y;
      x += (mx - x) * k;
      y += (my - y) * k;
      const vx = (x - px) / dt;
      const vy = (y - py) / dt;
      const speed = Math.hypot(vx, vy);
      stretch += (Math.min(speed * 0.12, MAX_STRETCH) - stretch) * 0.25;
      if (speed > 0.05) angle = Math.atan2(vy, vx);

      const view = mode === "view";
      const targetOffset = view ? VIEW_OFFSET : 0;
      offset = reduced ? targetOffset : offset + (targetOffset - offset) * (1 - Math.exp(-dt / OFFSET_MS));

      outer.style.transform = `translate3d(${x + offset}px,${y + offset}px,0)`;
      const s = view || reduced ? 0 : stretch;
      ring.style.transform = `rotate(${angle}rad) scale(${1 + s},${1 - s * 0.5}) rotate(${-angle}rad)`;

      const settled =
        Math.abs(mx - x) < 0.05 && Math.abs(my - y) < 0.05 && stretch < 0.0005 && Math.abs(targetOffset - offset) < 0.05;
      if (settled) {
        last = 0;
      } else {
        raf = requestAnimationFrame(frame);
      }
    };

    const wake = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      mx = event.clientX;
      my = event.clientY;
      if (!started) {
        // First move: snap to the pointer instead of flying in from 0,0.
        started = true;
        x = mx;
        y = my;
        outer.style.opacity = "1";
      } else if (outer.style.opacity !== "1") {
        outer.style.opacity = "1";
      }
      resolveMode(event.target as Element | null);
      wake();
    };
    const onOut = (event: MouseEvent) => {
      if (!event.relatedTarget) outer.style.opacity = "0";
    };
    const onScroll = () => {
      if (!started) return;
      hitTest = true;
      wake();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("mouseout", onOut);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("mouseout", onOut);
      window.removeEventListener("scroll", onScroll);
      reducedQuery.removeEventListener("change", onReduced);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={outerRef} className="custom-cursor" data-mode="idle" aria-hidden>
      <div className="custom-cursor-center">
        <div ref={ringRef} className="custom-cursor-ring">
          <span ref={labelRef} />
        </div>
      </div>
    </div>
  );
}
