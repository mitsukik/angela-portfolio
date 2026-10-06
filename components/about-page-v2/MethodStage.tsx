"use client";

import { useEffect, useRef, useState } from "react";
import type { AboutPageContent } from "@/data/about-page-v2";

const STEP_MS = 4200;
// Step 04 (PRODUCT EXPERIENCE) runs longer so its "usable" sequence completes.
const stepMs = (step: number) => (step === 3 ? 6400 : STEP_MS);

type Box = { x: number; y: number; w: number; h: number; r: number };

// Handoff target tables: [cx, cy, w, h, radius]; a value <= 1 is a fraction
// of the stage width/height, anything else is px.
const TARGETS: number[][][] = [
  [[0.18, 0.28, 14, 14, 7], [0.44, 0.17, 14, 14, 7], [0.68, 0.33, 14, 14, 7], [0.3, 0.67, 14, 14, 7], [0.56, 0.74, 14, 14, 7], [0.8, 0.58, 14, 14, 7], [0.5, 0.5, 0, 0, 0]],
  [[0.2, 0.17, 14, 14, 7], [0.2, 0.3, 14, 14, 7], [0.2, 0.43, 14, 14, 7], [0.2, 0.57, 14, 14, 7], [0.2, 0.7, 14, 14, 7], [0.2, 0.83, 14, 14, 7], [0.72, 0.5, 30, 30, 15]],
  [[0.24, 0.46, 0.2, 38, 8], [0.5, 0.46, 0.2, 38, 8], [0.76, 0.46, 0.2, 38, 8], [0.24, 0.8, 0.2, 38, 8], [0.5, 0.8, 0.2, 38, 8], [0.76, 0.8, 0.2, 38, 8], [0.5, 0.14, 0.24, 42, 8]],
];

// Step 04 dashboard layout: [x, y, w, h, color, radius]; x/y = top-left,
// all four as fractions of the stage.
type Layout = [number, number, number, number, string, number];
const HL: Layout[] = [
  [0.04, 0.05, 0.92, 0.08, "#23242a", 6], // 0 topbar
  [0.04, 0.16, 0.18, 0.79, "#1a1b20", 6], // 1 sidebar
  [0.06, 0.2, 0.14, 0.05, "#a98bf0", 4], // 2 side active
  [0.06, 0.28, 0.14, 0.035, "#34353c", 4], // 3 side item
  [0.06, 0.34, 0.14, 0.035, "#34353c", 4], // 4 side item
  [0.25, 0.16, 0.22, 0.17, "#23242a", 6], // 5 KPI 1
  [0.495, 0.16, 0.22, 0.17, "#23242a", 6], // 6 KPI 2
  [0.74, 0.16, 0.22, 0.17, "#d4f04a", 6], // 7 KPI 3
  [0.25, 0.37, 0.465, 0.58, "#1a1b20", 6], // 8 chart card
  [0.74, 0.37, 0.22, 0.45, "#1a1b20", 6], // 9 list card
  [0.76, 0.41, 0.18, 0.05, "#34353c", 4], // 10-12 rows
  [0.76, 0.5, 0.18, 0.05, "#34353c", 4],
  [0.76, 0.59, 0.18, 0.05, "#34353c", 4],
  [0.74, 0.855, 0.22, 0.095, "#d4f04a", 24], // 13 button
  ...[0.2, 0.34, 0.26, 0.42, 0.3].map(
    (bh, k): Layout => [0.29 + k * 0.08, 0.9 - bh, 0.05, bh, k === 3 ? "#a98bf0" : "#e9e7e1", 3],
  ), // 14-18 bars
];
// Node index -> HL entry in step 04.
const NODE_TO_HL = [2, 3, 4, 5, 13, 8, 0];
// Extra blocks, in render (stagger) order: behind the nodes, then in front.
const EXTRA_BACK = [1, 9];
const EXTRA_FRONT = [6, 7, 10, 11, 12, 14, 15, 16, 17, 18];

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const easeInOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const LINE_TARGETS: (number[] | null)[] = [null, [6, 6, 6, 6, 6, 6], [6, 6, 6, 0, 1, 2], null];
const NODE_BG = [
  ["#7c7d84", "#7c7d84", "#7c7d84", "#7c7d84", "#7c7d84", "#7c7d84", "transparent"],
  ["#e9e7e1", "#e9e7e1", "#e9e7e1", "#e9e7e1", "#e9e7e1", "#e9e7e1", "#d4f04a"],
  ["#a98bf0", "#2c2d34", "#2c2d34", "#a98bf0", "#2c2d34", "#2c2d34", "#e9e7e1"],
  ["#a98bf0", "#34353c", "#34353c", "#23242a", "#d4f04a", "#1a1b20", "#23242a"],
];
const LINE_COLOR = [
  Array(6).fill("#d4f04a"),
  Array(6).fill("#d4f04a"),
  ["#a98bf0", "#4a4b52", "#4a4b52", "#a98bf0", "#4a4b52", "#4a4b52"],
  Array(6).fill("#4a4b52"),
];

function target(step: number, i: number, W: number, H: number): Box {
  if (step === 3) {
    const L = HL[NODE_TO_HL[i]];
    return { x: (L[0] + L[2] / 2) * W, y: (L[1] + L[3] / 2) * H, w: L[2] * W, h: L[3] * H, r: L[5] };
  }
  const t = TARGETS[step][i];
  const fw = (v: number) => (v <= 1 ? v * W : v);
  const fh = (v: number) => (v <= 1 ? v * H : v);
  return { x: t[0] * W, y: t[1] * H, w: fw(t[2]), h: fh(t[3]), r: t[4] };
}

/**
 * How I Work — the same seven elements move from scattered inputs, to
 * relationships, to a structure, to a working dashboard (step 04 adds
 * a short "usable" sequence: bars grow, a pointer clicks, rows highlight). The one autoplaying
 * piece on the page (4.2s per step, only while in view); hovering the
 * stage or the pause button stops it. One rAF loop writes node geometry,
 * lines and progress bars straight to the DOM; React re-renders only when
 * the step changes. Reduced motion: no autoplay, no drift, instant moves.
 */
export function MethodStage({ content }: { content: AboutPageContent }) {
  const { method, graph, locale } = content;
  const lang = locale === "zh" ? "zh-Hant" : "en";
  const labels = [...graph.inputs, method.hub];
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const elapsed = useRef(0);
  const stepRef = useRef(0);
  const holdRef = useRef(false);
  const wakeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodes = Array.from(stage.querySelectorAll<HTMLElement>("[data-n]"));
    const lines = Array.from(stage.querySelectorAll<SVGLineElement>("line[data-l]"));
    const extras = Array.from(stage.querySelectorAll<HTMLElement>("[data-x]"));
    const pointer = stage.querySelector<HTMLElement>("[data-pointer]");
    const ripple = stage.querySelector<HTMLElement>("[data-ripple]");
    let step3Start = 0;
    let prevStep = -1;
    const bars = Array.from(section.querySelectorAll<HTMLElement>("[data-prog]"));
    let current: Box[] | null = null;
    let lineOpacity = 0;
    let inView = false;
    let raf = 0;
    let last = 0;

    const frame = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(64, now - last) : 16;
      last = now;
      const W = stage.clientWidth;
      const H = stage.clientHeight;
      const s = stepRef.current;

      if (!reduced && !holdRef.current) {
        elapsed.current += dt;
        if (elapsed.current >= stepMs(s)) {
          elapsed.current = 0;
          setStep((value) => (value + 1) % 4);
        }
      }
      bars.forEach((bar, i) => {
        const fill = i < s ? 1 : i === s ? (reduced ? 1 : Math.min(1, elapsed.current / stepMs(s))) : 0;
        bar.style.transform = `scaleX(${fill.toFixed(4)})`;
      });

      if (!current) current = nodes.map((_, i) => target(s, i, W, H));
      let moving = false;
      nodes.forEach((node, i) => {
        const c = current![i];
        const t = target(s, i, W, H);
        if (s === 0 && !reduced) {
          t.x += Math.sin(now / 900 + i * 1.7) * 10;
          t.y += Math.cos(now / 1100 + i * 2.3) * 8;
        }
        const k = reduced ? 1 : 0.075 + i * 0.008;
        (["x", "y", "w", "h", "r"] as const).forEach((key) => {
          c[key] += (t[key] - c[key]) * k;
          if (Math.abs(t[key] - c[key]) > 0.1) moving = true;
        });
        node.style.transform = `translate(${(c.x - c.w / 2).toFixed(1)}px,${(c.y - c.h / 2).toFixed(1)}px)`;
        node.style.width = `${c.w.toFixed(1)}px`;
        node.style.height = `${c.h.toFixed(1)}px`;
        node.style.borderRadius = `${c.r.toFixed(1)}px`;
      });

      const lt = LINE_TARGETS[s];
      lineOpacity = reduced ? (lt ? 1 : 0) : lineOpacity + ((lt ? 1 : 0) - lineOpacity) * 0.08;
      lines.forEach((line, i) => {
        const a = current![i];
        const b = current![lt ? lt[i] : 6];
        line.setAttribute("x1", a.x.toFixed(1));
        line.setAttribute("y1", a.y.toFixed(1));
        line.setAttribute("x2", b.x.toFixed(1));
        line.setAttribute("y2", b.y.toFixed(1));
        line.setAttribute("opacity", lineOpacity.toFixed(3));
      });
      // Step 04 "usable" sequence. u = ms since step 04 began, from the rAF
      // clock (keeps running while autoplay is paused); reduced motion pins
      // it at the finished dashboard.
      if (s === 3 && prevStep !== 3) step3Start = now;
      prevStep = s;
      const u = s === 3 ? (reduced ? 4000 : now - step3Start) : -1;
      extras.forEach((el, k) => {
        const index = Number(el.dataset.x);
        const L = HL[index];
        const g = u < 0 ? 0 : easeInOutCubic(clamp01((u - 250 - k * 60) / 600));
        let y = L[1];
        let h = L[3];
        if (index >= 14) {
          const b = u < 0 ? 0 : easeInOutCubic(clamp01((u - 1300 - (index - 14) * 90) / 700));
          h = 0.02 + (L[3] - 0.02) * b;
          y = 0.9 - h;
        }
        el.style.opacity = g.toFixed(3);
        el.style.width = `${(L[2] * W).toFixed(1)}px`;
        el.style.height = `${(h * H).toFixed(1)}px`;
        el.style.transform = `translate(${(L[0] * W).toFixed(1)}px,${(y * H).toFixed(1)}px) scale(${(0.85 + 0.15 * g).toFixed(4)})`;
        let color = L[4];
        if (index >= 10 && index <= 12 && u >= 3600 + (index - 10) * 330 && u < 3600 + (index - 9) * 330) color = "#a98bf0";
        if (el.dataset.color !== color) {
          el.style.background = color;
          el.dataset.color = color;
        }
      });
      const bx = 0.85 * W;
      const by = 0.9025 * H;
      if (pointer) {
        const on = !reduced && u >= 2000 && u < 5800;
        const m = easeInOutCubic(clamp01((u - 2100) / 1000));
        const sx = 0.52 * W;
        const sy = 0.72 * H;
        pointer.style.opacity = on ? "1" : "0";
        pointer.style.transform = `translate(${(sx + (bx - sx) * m).toFixed(1)}px,${(sy + (by - sy) * m).toFixed(1)}px) scale(${u >= 3200 && u < 3400 ? 0.75 : 1})`;
      }
      if (ripple) {
        const r = (u - 3200) / 600;
        const on = !reduced && r >= 0 && r <= 1;
        ripple.style.opacity = on ? String(1 - r) : "0";
        ripple.style.transform = `translate(${bx.toFixed(1)}px,${by.toFixed(1)}px) scale(${on ? 0.3 + r * 1.5 : 0.3})`;
      }

      const autoplaying = !reduced && !holdRef.current;
      const settled = !moving && Math.abs((lt ? 1 : 0) - lineOpacity) < 0.002;
      const sequence = s === 3 && !reduced && u < 6000;
      if (inView && (autoplaying || !settled || sequence || (s === 0 && !reduced))) raf = requestAnimationFrame(frame);
      else last = 0;
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) wake();
      },
      { threshold: 0.2 },
    );
    observer.observe(section);
    const resize = new ResizeObserver(wake);
    resize.observe(stage);
    wakeRef.current = wake;
    wake();
    return () => {
      observer.disconnect();
      resize.disconnect();
      if (raf) cancelAnimationFrame(raf);
      wakeRef.current = null;
    };
  }, []);

  // Mirror render state for the loop, and restart it if it had settled.
  useEffect(() => {
    stepRef.current = step;
    holdRef.current = paused || hovered;
    wakeRef.current?.();
  }, [step, paused, hovered]);

  const goTo = (index: number) => {
    elapsed.current = 0;
    setStep(index);
  };

  const onTabKey = (event: React.KeyboardEvent, index: number) => {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 };
    let next: number | null = null;
    if (event.key in keys) next = (index + keys[event.key] + 4) % 4;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = 3;
    if (next === null) return;
    event.preventDefault();
    goTo(next);
    (event.currentTarget.parentElement?.children[next] as HTMLElement | undefined)?.focus();
  };

  const current = method.steps[step];

  return (
    <section ref={sectionRef} className="av2-section av2-method" aria-labelledby="av2-method-title">
      <div className="av2-section-head" data-reveal="">
        <p className="av2-eyebrow av2-eyebrow-purple" lang={lang}>{method.eyebrow}</p>
        <h2 id="av2-method-title" className="av2-h2" lang={lang}>{method.heading}</h2>
      </div>

      <div className="av2-tabs-row">
        <div className="av2-tabs" role="tablist" aria-label={method.eyebrow}>
          {method.steps.map((s, i) => (
            <button
              key={s.number}
              type="button"
              role="tab"
              id={`av2-step-tab-${i}`}
              aria-selected={i === step}
              aria-controls="av2-step-panel"
              tabIndex={i === step ? 0 : -1}
              className="av2-tab"
              style={{ "--av2-accent": s.accent } as React.CSSProperties}
              onClick={() => goTo(i)}
              onKeyDown={(event) => onTabKey(event, i)}
            >
              <span className="av2-tab-track" aria-hidden>
                <span className="av2-tab-fill" data-prog />
              </span>
              <span className="av2-tab-label" lang="en">
                {s.number} {s.tag}
              </span>
            </button>
          ))}
        </div>
        <button
          type="button"
          className="av2-autoplay"
          aria-pressed={paused}
          aria-label={paused ? method.play : method.pause}
          onClick={() => setPaused((value) => !value)}
        >
          <span aria-hidden>{paused ? "▶" : "❚❚"}</span>
        </button>
      </div>

      <div className="av2-method-body">
        <div
          ref={stageRef}
          className="av2-stage"
          data-step={step}
          role="img"
          aria-label={`${method.stageLabel}: ${current.number} ${current.tag}`}
          onPointerEnter={(event) => event.pointerType === "mouse" && setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <svg className="av2-stage-svg" aria-hidden>
            {LINE_COLOR[step].map((color, i) => (
              <line key={i} data-l={i} stroke={color} strokeWidth="1.5" />
            ))}
          </svg>
          {EXTRA_BACK.map((index) => (
            <div key={index} data-x={index} className="av2-extra" style={{ borderRadius: HL[index][5], background: HL[index][4] }} aria-hidden />
          ))}
          {labels.map((label, i) => (
            <div
              key={label}
              data-n={i}
              className="av2-node"
              style={{ background: NODE_BG[step][i] }}
              aria-hidden
            >
              <span className="av2-node-out" lang={lang}>{label}</span>
              <span className="av2-node-in" lang={lang} data-dark={step === 2 && (i === 0 || i === 3 || i === 6) ? "true" : undefined}>
                {label}
              </span>
            </div>
          ))}
          {EXTRA_FRONT.map((index) => (
            <div key={index} data-x={index} className="av2-extra" style={{ borderRadius: HL[index][5], background: HL[index][4] }} aria-hidden />
          ))}
          <div data-ripple className="av2-ripple" aria-hidden />
          <div data-pointer className="av2-pointer" aria-hidden />
        </div>

        <div className="av2-steps" id="av2-step-panel" role="tabpanel" aria-labelledby={`av2-step-tab-${step}`}>
          {method.steps.map((s, i) => (
            <div key={s.number} className="av2-step" data-active={i === step} aria-hidden={i !== step}>
              <span className="av2-step-no" style={{ color: s.accent }} aria-hidden>{s.number}</span>
              <span className="av2-step-tag" lang="en">{s.tag}</span>
              <h3 className="av2-step-title" lang={lang}>{s.title}</h3>
              <p className="av2-step-desc" lang={lang}>{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
