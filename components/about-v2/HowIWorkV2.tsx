"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import type { V2Stage } from "@/data/about-v2";
import type { Locale } from "@/data/locale";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const STAGE_ACCENT_CLASS = ["scene-dim-text", "text-acid", "text-lavender", "text-acid"];

const INPUT_LEGEND: Record<Locale, string> = {
  zh: "需求 · 資訊 · 流程 · 角色 · 狀態 · 限制",
  en: "Requirements · Information · Flows · Roles · States · Constraints",
};

/**
 * Shared play/pause/freeze wiring for one panel's looping GSAP timeline.
 * `build` runs once (inside a gsap.context scoped to the returned ref) and
 * must return a paused, ready-to-play timeline — this hook never rebuilds
 * it, only starts/stops/repositions it. `inView` is controlled by the
 * caller (a single section-level observer on desktop, the existing
 * per-block observer on mobile) rather than observed here, so the same
 * hook works in both contexts without creating duplicate observers.
 * Reduced-motion freezes the timeline at `restProgress` — a real, labeled
 * frame from the same authored motion, not a hand-duplicated static state.
 */
function usePanelMotion<T extends Element>(build: () => gsap.core.Timeline, restProgress: number, inView: boolean, startOffset = 0) {
  const rootRef = useRef<T | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const startedRef = useRef(false);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const context = gsap.context(() => {
      const timeline = build();
      timeline.pause();
      timelineRef.current = timeline;
    }, root);
    return () => {
      timelineRef.current = null;
      context.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline) return;
    const reducedQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    const sync = () => {
      if (reducedQuery.matches) {
        timeline.pause();
        timeline.progress(restProgress);
        return;
      }
      if (inView) {
        if (!startedRef.current) {
          startedRef.current = true;
          timeline.play(startOffset);
        } else {
          timeline.play();
        }
      } else {
        timeline.pause();
      }
    };
    sync();
    reducedQuery.addEventListener("change", sync);
    return () => reducedQuery.removeEventListener("change", sync);
  }, [inView, restProgress, startOffset]);

  return rootRef;
}

function useSectionInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, inView };
}

/* ============================================================
 * Panel 01 — UNSTRUCTURED
 * Scattered concepts drift independently (uncertain, asynchronous),
 * two nodes tentatively approach and a faint relationship attempt
 * appears — then fails to hold, and everything settles back into its
 * loose, unstructured state. Communicates "we have information, but
 * not yet its structure," not decorative floating.
 * ============================================================ */
const P1_NODES = [
  { x: 40, y: 46 },
  { x: 118, y: 26 },
  { x: 202, y: 54 },
  { x: 66, y: 138 },
  { x: 182, y: 148 },
  { x: 252, y: 92 },
];
const P1_APPROACH_A = 1; // node index that tentatively approaches...
const P1_APPROACH_B = 3; // ...this one

function UnstructuredPanel({ inView, startOffset }: { inView: boolean; startOffset: number }) {
  const nodeRefs = useRef<(SVGCircleElement | null)[]>([]);
  const lineRef = useRef<SVGLineElement | null>(null);

  const build = () => {
    const nodes = nodeRefs.current.filter((el): el is SVGCircleElement => Boolean(el));
    const line = lineRef.current;
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.1, defaults: { ease: "sine.inOut" } });

    tl.to(
      nodes,
      {
        x: () => gsap.utils.random(-9, 9),
        y: () => gsap.utils.random(-7, 7),
        duration: () => gsap.utils.random(1.1, 1.7),
        stagger: { each: 0.12, from: "random" },
      },
      "drift",
    );

    const a = nodes[P1_APPROACH_A];
    const b = nodes[P1_APPROACH_B];
    if (a && b) {
      tl.to(a, { x: 9, y: 7, duration: 0.75 }, "approach");
      tl.to(b, { x: -8, y: -6, duration: 0.75 }, "approach");
    }
    if (line) {
      tl.to(line, { opacity: 0.6, duration: 0.4 }, "approach+=0.3");
      tl.to(line, { opacity: 0, duration: 0.7 }, "fail");
    }
    tl.to(nodes, { x: 0, y: 0, duration: 1, stagger: 0.02 }, "fail");

    return tl;
  };

  // Labeled timeline: drift=0, approach≈1.96, fail≈2.71, duration≈3.81 —
  // 0.68 lands just before the tentative line's opacity peak (0.6) starts
  // declining, so reduced-motion freezes on the clearest "attempted, not
  // yet stable" frame rather than the scattered rest state.
  const rootRef = usePanelMotion<SVGSVGElement>(build, 0.68, inView, startOffset);
  const a = P1_NODES[P1_APPROACH_A];
  const b = P1_NODES[P1_APPROACH_B];

  return (
    <svg ref={rootRef} viewBox="0 0 300 200" className="h-full w-full" role="img" aria-hidden>
      <line ref={lineRef} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--scene-fg)" strokeWidth={1} strokeDasharray="4 5" opacity={0} />
      {P1_NODES.map((pt, i) => (
        <circle
          key={i}
          ref={(el) => {
            nodeRefs.current[i] = el;
          }}
          cx={pt.x}
          cy={pt.y}
          r={6}
          fill="var(--scene-fg)"
          fillOpacity={0.55}
        />
      ))}
    </svg>
  );
}

/* ============================================================
 * Panel 02 — RELATIONSHIPS
 * Three sources connect to a hub one at a time: a line draws
 * (cause), a signal travels along it (travel), and the hub responds
 * with emphasis (response) — sequential, not simultaneous, so a
 * viewer can watch relationships being discovered rather than see a
 * network appear all at once.
 * ============================================================ */
const P2_HUB = { x: 224, y: 100 };
const P2_SOURCES = [
  { x: 56, y: 46 },
  { x: 46, y: 100 },
  { x: 56, y: 154 },
];

function RelationshipsPanel({ inView, startOffset }: { inView: boolean; startOffset: number }) {
  const hubRef = useRef<SVGCircleElement | null>(null);
  const sourceRefs = useRef<(SVGCircleElement | null)[]>([]);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const dotRefs = useRef<(SVGCircleElement | null)[]>([]);

  const build = () => {
    const hub = hubRef.current;
    const sources = sourceRefs.current;
    const lines = lineRefs.current;
    const dots = dotRefs.current;
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2, defaults: { ease: "power2.inOut" } });

    P2_SOURCES.forEach((source, i) => {
      const label = `l${i}`;
      const line = lines[i];
      const dot = dots[i];
      const src = sources[i];
      if (line) {
        tl.fromTo(line, { strokeDashoffset: 240, opacity: 0.85 }, { strokeDashoffset: 0, duration: 0.55 }, label);
      }
      if (src) {
        tl.to(src, { scale: 1.15, transformOrigin: "center", duration: 0.2 }, label).to(src, { scale: 1, duration: 0.3 }, `${label}+=0.2`);
      }
      if (dot) {
        tl.fromTo(
          dot,
          { attr: { cx: source.x, cy: source.y }, opacity: 1 },
          { attr: { cx: P2_HUB.x, cy: P2_HUB.y }, duration: 0.55, ease: "power1.inOut" },
          label,
        );
        tl.to(dot, { opacity: 0, duration: 0.15 }, `${label}+=0.55`);
      }
      if (hub) {
        tl.to(hub, { scale: 1.18, transformOrigin: "center", duration: 0.22 }, `${label}+=0.5`).to(hub, { scale: 1, duration: 0.3 }, ">");
      }
    });

    tl.to({}, { duration: 0.6 }, "hold");
    tl.to(
      lines.filter((el): el is SVGLineElement => Boolean(el)),
      { opacity: 0.22, duration: 0.7 },
      "recede",
    );

    return tl;
  };

  // Labeled timeline: l0=0, l1≈1.02, l2≈2.04, hold≈3.06, recede≈3.66,
  // duration≈4.36 — 0.72 lands inside "hold," after all three
  // connections have drawn and the hub has responded to each.
  const rootRef = usePanelMotion<SVGSVGElement>(build, 0.72, inView, startOffset);

  return (
    <svg ref={rootRef} viewBox="0 0 300 200" className="h-full w-full" role="img" aria-hidden>
      {P2_SOURCES.map((source, i) => (
        <line
          key={i}
          ref={(el) => {
            lineRefs.current[i] = el;
          }}
          x1={source.x}
          y1={source.y}
          x2={P2_HUB.x}
          y2={P2_HUB.y}
          stroke="var(--acid)"
          strokeWidth={1.4}
          strokeDasharray="240 240"
          strokeDashoffset={240}
          opacity={0.85}
        />
      ))}
      {P2_SOURCES.map((source, i) => (
        <circle
          key={i}
          ref={(el) => {
            dotRefs.current[i] = el;
          }}
          cx={source.x}
          cy={source.y}
          r={2.6}
          fill="var(--acid)"
          opacity={0}
        />
      ))}
      {P2_SOURCES.map((source, i) => (
        <circle
          key={i}
          ref={(el) => {
            sourceRefs.current[i] = el;
          }}
          cx={source.x}
          cy={source.y}
          r={6}
          fill="var(--scene-fg)"
          fillOpacity={0.7}
        />
      ))}
      <circle ref={hubRef} cx={P2_HUB.x} cy={P2_HUB.y} r={8} fill="var(--acid)" />
    </svg>
  );
}

/* ============================================================
 * Panel 03 — STRUCTURE
 * Loosely placed blocks align into a root → branch → module
 * hierarchy; the root establishes itself, the main paths draw
 * downward, branches settle in sequence, and one active route at a
 * time travels root → branch → module (roles, then states) before
 * everything loosens and the organizing motion repeats.
 * ============================================================ */
const P3_ROOT = { x: 150, y: 28 };
const P3_ROW2 = [
  { x: 70, y: 100 },
  { x: 150, y: 100 },
  { x: 230, y: 100 },
];
const P3_ROW3 = [
  { x: 70, y: 172 },
  { x: 150, y: 172 },
  { x: 230, y: 172 },
];
const P3_ROUTES = [0, 2]; // roles, then states — objects stays part of the static structure

function StructurePanel({ inView, startOffset }: { inView: boolean; startOffset: number }) {
  const rootBlockRef = useRef<SVGRectElement | null>(null);
  const row2Refs = useRef<(SVGRectElement | null)[]>([]);
  const row3Refs = useRef<(SVGRectElement | null)[]>([]);
  const edgeTopRefs = useRef<(SVGLineElement | null)[]>([]);
  const edgeBottomRefs = useRef<(SVGLineElement | null)[]>([]);

  const build = () => {
    const root = rootBlockRef.current;
    const row2 = row2Refs.current;
    const row3 = row3Refs.current;
    const edgesTop = edgeTopRefs.current.filter((el): el is SVGLineElement => Boolean(el));
    const edgesBottom = edgeBottomRefs.current.filter((el): el is SVGLineElement => Boolean(el));
    const movable = [root, ...row2, ...row3].filter((el): el is SVGRectElement => Boolean(el));
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1, defaults: { ease: "power2.out" } });

    tl.fromTo(
      movable,
      { x: () => gsap.utils.random(-9, 9), y: () => gsap.utils.random(-7, 7) },
      { x: 0, y: 0, duration: 0.85, stagger: 0.04 },
      "align",
    );
    if (root) {
      tl.to(root, { scale: 1.14, transformOrigin: "center", duration: 0.22 }, "establish").to(root, { scale: 1, duration: 0.3 }, ">");
    }
    tl.fromTo(edgesTop, { strokeDashoffset: 100, opacity: 0.85 }, { strokeDashoffset: 0, duration: 0.45, stagger: 0.12 }, "draw1");
    tl.to(row2.filter((el): el is SVGRectElement => Boolean(el)), { scale: 1.1, transformOrigin: "center", duration: 0.18, stagger: 0.12 }, "draw1+=0.3").to(
      row2.filter((el): el is SVGRectElement => Boolean(el)),
      { scale: 1, duration: 0.22, stagger: 0.12 },
      ">",
    );
    tl.fromTo(edgesBottom, { strokeDashoffset: 90, opacity: 0.85 }, { strokeDashoffset: 0, duration: 0.4, stagger: 0.1 }, "draw2");

    P3_ROUTES.forEach((branch, order) => {
      const label = `route${order}`;
      const topEdge = edgesTop[branch];
      const bottomEdge = edgesBottom[branch];
      const midBlock = row2[branch];
      const leafBlock = row3[branch];
      if (topEdge) tl.to(topEdge, { stroke: "var(--lavender)", strokeWidth: 2.1, duration: 0.25 }, label);
      if (midBlock) tl.to(midBlock, { fill: "var(--lavender)", fillOpacity: 0.9, duration: 0.2 }, label);
      if (bottomEdge) tl.to(bottomEdge, { stroke: "var(--lavender)", strokeWidth: 2.1, duration: 0.25 }, `${label}+=0.22`);
      if (leafBlock) tl.to(leafBlock, { fill: "var(--lavender)", fillOpacity: 0.9, duration: 0.2 }, `${label}+=0.22`);
      tl.to(
        [topEdge, bottomEdge].filter(Boolean),
        { stroke: "var(--scene-line)", strokeWidth: 1.3, duration: 0.3 },
        `${label}+=0.55`,
      );
      tl.to(
        [midBlock, leafBlock].filter(Boolean),
        { fill: "var(--scene-fg)", fillOpacity: 0.16, duration: 0.3 },
        `${label}+=0.55`,
      );
    });

    return tl;
  };

  // Labeled timeline: align=0, establish≈1.09, draw1≈1.61, draw2≈2.79,
  // route0≈3.39, route1≈4.24, duration≈5.09 — 0.745 lands inside the
  // route0 (roles branch) lavender-highlighted window, after the full
  // hierarchy has assembled.
  const rootRef = usePanelMotion<SVGSVGElement>(build, 0.745, inView, startOffset);

  return (
    <svg ref={rootRef} viewBox="0 0 300 200" className="h-full w-full" role="img" aria-hidden>
      {P3_ROW2.map((pt, i) => (
        <line
          key={i}
          ref={(el) => {
            edgeTopRefs.current[i] = el;
          }}
          x1={P3_ROOT.x}
          y1={P3_ROOT.y + 10}
          x2={pt.x}
          y2={pt.y - 10}
          stroke="var(--scene-line)"
          strokeWidth={1.3}
          strokeDasharray="100 100"
          strokeDashoffset={100}
          opacity={0.85}
        />
      ))}
      {P3_ROW3.map((pt, i) => (
        <line
          key={i}
          ref={(el) => {
            edgeBottomRefs.current[i] = el;
          }}
          x1={P3_ROW2[i].x}
          y1={P3_ROW2[i].y + 10}
          x2={pt.x}
          y2={pt.y - 10}
          stroke="var(--scene-line)"
          strokeWidth={1.3}
          strokeDasharray="90 90"
          strokeDashoffset={90}
          opacity={0.85}
        />
      ))}
      {P3_ROW3.map((pt, i) => (
        <rect
          key={i}
          ref={(el) => {
            row3Refs.current[i] = el;
          }}
          x={pt.x - 22}
          y={pt.y - 10}
          width={44}
          height={20}
          rx={2}
          fill="var(--scene-fg)"
          fillOpacity={0.16}
        />
      ))}
      {P3_ROW2.map((pt, i) => (
        <rect
          key={i}
          ref={(el) => {
            row2Refs.current[i] = el;
          }}
          x={pt.x - 24}
          y={pt.y - 11}
          width={48}
          height={22}
          rx={2}
          fill="var(--scene-fg)"
          fillOpacity={0.16}
        />
      ))}
      <rect ref={rootBlockRef} x={P3_ROOT.x - 26} y={P3_ROOT.y - 11} width={52} height={22} rx={2} fill="var(--scene-fg)" fillOpacity={0.85} />
    </svg>
  );
}

/* ============================================================
 * Panel 04 — INTERACTION / PRODUCT EXPERIENCE
 * A simplified interface: a control is focused, pressed, the
 * content responds with a state change, a feedback indicator
 * appears, and a feedback-loop path visibly carries a signal back
 * toward the system before everything settles — action → response
 * → feedback, not bars flashing at random.
 * ============================================================ */
function InteractionPanel({ inView, startOffset }: { inView: boolean; startOffset: number }) {
  const buttonRef = useRef<SVGRectElement | null>(null);
  const contentRef = useRef<SVGRectElement | null>(null);
  const badgeRef = useRef<SVGCircleElement | null>(null);
  const loopPathRef = useRef<SVGPathElement | null>(null);
  const loopDotRef = useRef<SVGCircleElement | null>(null);

  const build = () => {
    const button = buttonRef.current;
    const content = contentRef.current;
    const badge = badgeRef.current;
    const loopPath = loopPathRef.current;
    const loopDot = loopDotRef.current;
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1, defaults: { ease: "power2.out" } });

    if (button) tl.to(button, { stroke: "var(--acid)", duration: 0.3 }, "focus");
    if (button) {
      tl.to(button, { scale: 0.93, transformOrigin: "center", duration: 0.12 }, "press").to(button, { scale: 1, duration: 0.26 }, ">");
    }
    if (content) tl.to(content, { fill: "var(--acid)", fillOpacity: 0.28, duration: 0.35 }, "press+=0.1");
    if (badge) tl.to(badge, { opacity: 1, scale: 1, transformOrigin: "center", duration: 0.3 }, "response");
    if (loopPath) tl.fromTo(loopPath, { strokeDashoffset: 230, opacity: 0.9 }, { strokeDashoffset: 0, duration: 0.7 }, "feedback");
    if (loopDot) {
      tl.fromTo(loopDot, { attr: { cx: 96, cy: 132 }, opacity: 1 }, { attr: { cx: 252, cy: 36 }, duration: 0.7, ease: "power1.inOut" }, "feedback");
      tl.to(loopDot, { opacity: 0, duration: 0.15 }, "feedback+=0.7");
    }
    if (button) tl.to(button, { stroke: "var(--scene-line)", duration: 0.4 }, "settle");
    if (content) tl.to(content, { fillOpacity: 0, duration: 0.4 }, "settle");
    if (badge) tl.to(badge, { opacity: 0, duration: 0.3 }, "settle");
    if (loopPath) tl.to(loopPath, { opacity: 0.15, duration: 0.4 }, "settle");

    return tl;
  };

  // Labeled timeline: focus=0, press=0.3, response=0.75, feedback≈1.05,
  // settle≈1.9, duration≈2.3 — 0.652 lands inside the feedback window
  // (loop path drawn, dot mid-travel) with the content/badge response
  // already visible.
  const rootRef = usePanelMotion<SVGSVGElement>(build, 0.652, inView, startOffset);

  return (
    <svg ref={rootRef} viewBox="0 0 300 200" className="h-full w-full" role="img" aria-hidden>
      <rect x={20} y={20} width={260} height={160} fill="none" stroke="var(--scene-line)" strokeWidth={1} />
      <rect x={20} y={20} width={260} height={24} fill="var(--scene-fg)" fillOpacity={0.08} />
      <rect x={20} y={44} width={60} height={136} fill="var(--scene-fg)" fillOpacity={0.05} />
      <path
        ref={loopPathRef}
        d="M 96 132 C 40 170, 260 170, 252 36"
        fill="none"
        stroke="var(--acid)"
        strokeWidth={1.3}
        strokeDasharray="230 230"
        strokeDashoffset={230}
        opacity={0.15}
      />
      <rect ref={contentRef} x={92} y={56} width={168} height={62} rx={2} fill="var(--acid)" fillOpacity={0} />
      <rect ref={buttonRef} x={200} y={150} width={60} height={22} rx={2} fill="none" stroke="var(--scene-line)" strokeWidth={1.3} />
      <circle ref={loopDotRef} cx={96} cy={132} r={2.8} fill="var(--acid)" opacity={0} />
      <circle ref={badgeRef} cx={260} cy={32} r={4.5} fill="var(--acid)" opacity={0} />
    </svg>
  );
}

const PANELS = [UnstructuredPanel, RelationshipsPanel, StructurePanel, InteractionPanel];

export function HowIWorkV2({ locale, stages }: { locale: Locale; stages: V2Stage[] }) {
  const lang = locale === "zh" ? "zh-Hant" : "en";
  const { ref: desktopRef, inView: desktopInView } = useSectionInView<HTMLDivElement>();

  return (
    <div>
      {/* Desktop: four independent panels, each with its own motion
          graphic, visible simultaneously and comparably — not a single
          scroll-scrubbed diagram. Scroll only reveals/pauses the whole
          composition; it does not carry the narrative. */}
      <div
        ref={desktopRef}
        className="site-frame hidden pb-4 pt-10 lg:motion-safe:grid lg:motion-safe:grid-cols-4 lg:motion-safe:gap-x-8"
        aria-label={locale === "zh" ? "四階段工作方式" : "Four-stage working process"}
      >
        {stages.map((stage, i) => {
          const Panel = PANELS[i];
          return (
            <div key={stage.title} className={`transition-opacity duration-700 ${desktopInView ? "opacity-100" : "opacity-45"}`}>
              <p className={`type-v3-label ${STAGE_ACCENT_CLASS[i]}`}>{stage.tag}</p>
              <div className="mt-5 aspect-[3/2]">
                <Panel inView={desktopInView} startOffset={i * 0.35} />
              </div>
              <h3 lang={lang} className="type-v3-body scene-text mt-5 text-[1rem] font-medium leading-snug">
                {stage.title}
              </h3>
              <p lang={lang} className="type-v3-body scene-dim-text mt-3">
                {stage.description}
              </p>
            </div>
          );
        })}

        <ol className="col-span-4 mt-12 flex items-center gap-3 border-t scene-rule pt-6">
          {stages.map((stage, i) => (
            <li key={stage.title} className="flex flex-1 items-center gap-3">
              <span className={`type-v3-label ${STAGE_ACCENT_CLASS[i]}`}>{stage.tag}</span>
              {i < stages.length - 1 && <span className="scene-dim-text opacity-50">→</span>}
            </li>
          ))}
        </ol>
        <p className="col-span-4 type-v3-label scene-dim-text mt-4 text-[1rem]">{INPUT_LEGEND[locale]}</p>
      </div>

      {/* Mobile / reduced-motion (lg:motion-safe:hidden picks up both the
          <lg breakpoint and prefers-reduced-motion:reduce, matching the
          established pattern elsewhere in this file): full information
          architecture, vertical progression, each stage keeps its own
          small motion graphic — same four panel components, same
          per-block IntersectionObserver strategy already approved here. */}
      <div className="site-frame space-y-16 pt-10 lg:motion-safe:hidden">
        {stages.map((stage, i) => (
          <MobileStageBlock key={stage.title} stage={stage} stageIndex={i} lang={lang} />
        ))}
        <p className="type-v3-label scene-dim-text text-[1rem]">{INPUT_LEGEND[locale]}</p>
      </div>
    </div>
  );
}

function MobileStageBlock({ stage, stageIndex, lang }: { stage: V2Stage; stageIndex: number; lang: string }) {
  const blockRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(stageIndex === 0);

  useLayoutEffect(() => {
    const el = blockRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "-40% 0px -40% 0px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Panel = PANELS[stageIndex];

  return (
    <div ref={blockRef} data-active={inView} className="grid grid-cols-1 gap-6 sm:grid-cols-[minmax(0,1fr)_180px] sm:items-center">
      <div className={`transition-opacity duration-300 ${inView ? "opacity-100" : "opacity-55"}`}>
        <p className={`type-v3-label ${STAGE_ACCENT_CLASS[stageIndex]}`}>{stage.tag}</p>
        <h3 lang={lang} className="type-v3-subheading mt-3">
          {stage.title}
        </h3>
        <p lang={lang} className="type-v3-body scene-dim-text mt-3">
          {stage.description}
        </p>
      </div>
      <div className="h-32 w-full">
        <Panel inView={inView} startOffset={0} />
      </div>
    </div>
  );
}
