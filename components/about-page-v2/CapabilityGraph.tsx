"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { AboutPageContent } from "@/data/about-page-v2";

type Active = { kind: "skill" | "input"; index: number } | null;

const PARTICLES = 10; // 2 per highlighted path; the busiest card has 5 links
const TRIP_MS = 1700;

/**
 * What I Do — six inputs converge into four capabilities. No autoplay
 * (it would compete with How I Work): the graph reacts only to hover,
 * keyboard focus and taps. Path geometry is measured with batched reads
 * whenever layout changes (ResizeObserver on the graph and each card, so
 * the expand transition is followed frame by frame) and cached with its
 * length; the rAF loop runs only to move particles along highlighted
 * paths, and only while something is highlighted.
 */
export function CapabilityGraph({ content }: { content: AboutPageContent }) {
  const { graph, locale } = content;
  const lang = locale === "zh" ? "zh-Hant" : "en";
  const [active, setActive] = useState<Active>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pointerType = useRef<string>("mouse");

  const conns = graph.capabilities.flatMap((capability, s) => capability.links.map((i) => ({ i, s })));
  const isOn = (c: { i: number; s: number }) =>
    active !== null && ((active.kind === "skill" && c.s === active.index) || (active.kind === "input" && c.i === active.index));
  const onList = conns.map((c, k) => (isOn(c) ? k : -1)).filter((k) => k >= 0);
  const anyOn = onList.length > 0;
  const activeKey = onList.join(",");

  // ---- geometry: batched reads, then writes; cached lengths -------------
  const lengths = useRef<number[]>([]);
  const measure = useCallback(() => {
    const root = rootRef.current;
    const svg = svgRef.current;
    if (!root || !svg || svg.getClientRects().length === 0) return;
    const box = root.getBoundingClientRect();
    const dots = Array.from(root.querySelectorAll<HTMLElement>("[data-dot]")).map((d) => d.getBoundingClientRect());
    const heads = Array.from(root.querySelectorAll<HTMLElement>("[data-head]")).map((h) => h.getBoundingClientRect());
    const paths = Array.from(svg.querySelectorAll<SVGPathElement>("path[data-c]"));
    paths.forEach((path, k) => {
      const c = conns[k];
      const a = dots[c.i];
      const b = heads[c.s];
      if (!a || !b) return;
      const x1 = a.right - box.left + 4;
      const y1 = a.top + a.height / 2 - box.top;
      const x2 = b.left - box.left;
      const y2 = b.top + b.height / 2 - box.top;
      const dx = (x2 - x1) * 0.55;
      path.setAttribute("d", `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`);
    });
    lengths.current = paths.map((path) => path.getTotalLength());
    // conns is derived from static content; stable for this component's life.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let raf = 0;
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(() => {
        raf = 0;
        measure();
      });
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(root);
    root.querySelectorAll("[data-card]").forEach((card) => observer.observe(card));
    measure();
    document.fonts?.ready.then(schedule);
    return () => {
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [measure]);

  // ---- particles: only while a relationship is highlighted --------------
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const dots = Array.from(svg.querySelectorAll<SVGCircleElement>("circle[data-p]"));
    const hideAll = () => dots.forEach((dot) => dot.setAttribute("opacity", "0"));
    const ids = activeKey ? activeKey.split(",").map(Number) : [];
    if (!ids.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      hideAll();
      return;
    }
    const paths = Array.from(svg.querySelectorAll<SVGPathElement>("path[data-c]"));
    let raf = 0;
    const tick = (now: number) => {
      dots.forEach((dot, k) => {
        const id = ids[Math.floor(k / 2)];
        const path = id !== undefined ? paths[id] : undefined;
        const length = id !== undefined ? lengths.current[id] : 0;
        if (!path || !length) {
          dot.setAttribute("opacity", "0");
          return;
        }
        const u = (now / TRIP_MS + (k % 2) * 0.5 + Math.floor(k / 2) * 0.17) % 1;
        const point = path.getPointAtLength(u * length);
        dot.setAttribute("cx", point.x.toFixed(1));
        dot.setAttribute("cy", point.y.toFixed(1));
        dot.setAttribute("opacity", Math.sin(u * Math.PI).toFixed(3));
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      hideAll();
    };
  }, [activeKey]);

  // ---- interaction --------------------------------------------------------
  const select = (next: Exclude<Active, null>) => (event: React.MouseEvent) => {
    // Mouse: hover already shows it. Touch / pen / keyboard (detail 0): toggle.
    if (pointerType.current === "mouse" && event.detail > 0) {
      setActive(next);
      return;
    }
    setActive((current) => (current && current.kind === next.kind && current.index === next.index ? null : next));
  };
  const hover = (next: Exclude<Active, null>) => (event: React.PointerEvent) => {
    if (event.pointerType === "mouse") setActive(next);
  };
  // Keyboard focus highlights; focus that comes from a tap/click doesn't
  // (the click handler owns that, and would otherwise toggle straight off).
  const focus = (next: Exclude<Active, null>) => (event: React.FocusEvent<HTMLElement>) => {
    if (event.currentTarget.matches(":focus-visible")) setActive(next);
  };

  return (
    <div
      ref={rootRef}
      className="av2-graph"
      data-active={anyOn || undefined}
      onPointerDown={(event) => {
        pointerType.current = event.pointerType;
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") setActive(null);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setActive(null);
      }}
    >
      <svg ref={svgRef} className="av2-graph-lines" aria-hidden>
        {conns.map((c, k) => (
          <path key={k} data-c={k} data-on={isOn(c) || undefined} fill="none" />
        ))}
        {Array.from({ length: PARTICLES }).map((_, k) => (
          <circle key={k} data-p r="3.5" opacity="0" className="av2-particle" />
        ))}
      </svg>

      <div className="av2-inputs">
        <p className="av2-inputs-label" lang="en">{graph.inputsLabel}</p>
        <ul>
          {graph.inputs.map((label, i) => {
            const linked = conns.some((c) => c.i === i && isOn(c));
            return (
              <li key={label}>
                <button
                  type="button"
                  className="av2-input"
                  data-state={!anyOn ? undefined : linked ? "on" : "off"}
                  aria-pressed={active?.kind === "input" && active.index === i}
                  lang={lang}
                  onPointerEnter={hover({ kind: "input", index: i })}
                  onFocus={focus({ kind: "input", index: i })}
                  onClick={select({ kind: "input", index: i })}
                >
                  <span className="av2-input-dot" data-dot aria-hidden />
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="av2-gap" aria-hidden />

      <ul className="av2-cards">
        {graph.capabilities.map((capability, i) => {
          const expanded = active?.kind === "skill" && active.index === i;
          const linked = expanded || (active?.kind === "input" && capability.links.includes(active.index));
          const panelId = `av2-cap-${i}`;
          return (
            <li key={capability.title} className="av2-card" data-card data-state={!anyOn ? undefined : linked ? "on" : "off"}>
              <button
                type="button"
                className="av2-card-head"
                data-head
                aria-expanded={expanded}
                aria-controls={panelId}
                lang={lang}
                onPointerEnter={hover({ kind: "skill", index: i })}
                onFocus={focus({ kind: "skill", index: i })}
                onClick={select({ kind: "skill", index: i })}
              >
                <span className="av2-card-no">{String(i + 1).padStart(2, "0")}</span>
                <span className="av2-card-title">{capability.title}</span>
                <span className="av2-card-plus" aria-hidden>+</span>
              </button>
              <div id={panelId} className="av2-card-panel" data-open={expanded} aria-hidden={!expanded} inert={!expanded}>
                <div>
                  <p lang={lang}>{capability.description}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
