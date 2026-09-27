"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const COMPACT_QUERY = "(max-width: 767px)";

/**
 * System Resolve — the Home Hero glyph field. (About keeps the original
 * continuously re-rolling field, HeroBackgroundShapes.tsx, unchanged.)
 *
 * The field keeps its identity (a grid of small circle / lines / x /
 * diagonal / square / translucent glyphs, mostly neutral, rare lavender /
 * lime accents) but now has a lifecycle instead of rerolling forever:
 *
 *   1. Activity — a brief burst of independent-looking rerolls
 *      (complexity).
 *   2. Resolve — cell by cell, left to right with jitter, every glyph
 *      settles into one ordered lattice (structure).
 *   3. Rest — a sparse, calm, alternating filled/outlined lattice with a
 *      single accent node (clarity). Every timer is gone.
 *
 * One scheduler drives the whole field (not one timer per cell), and it
 * stops for good at rest. Glyphs never render inside reading areas: any
 * element matching `clearSelector` (measured by its actual text extent)
 * stays empty through every phase — the identity lives around the copy,
 * never behind it. Reduced motion shows the resolved rest state directly.
 * Mobile uses a thinned grid and a shorter lifecycle.
 */

type Kind = "empty" | "circle" | "lines" | "x" | "diagonal" | "square" | "translucent";
type ColorRole = "neutral" | "lavender" | "lime";

const BOXED_GRID_COLS = 6;
const BOXED_GRID_ROWS = 6;
const FULL_GRID_COLS = 12;
const FULL_GRID_ROWS = 10;
const BOXED_MOBILE_COLS = new Set([0, 2, 3, 5]);
const BOXED_MOBILE_ROWS = new Set([0, 2, 3, 5]);

// Activity-phase odds: emptiness dominates, the translucent block is next,
// the five linework glyphs are equally rare.
const KIND_TABLE: { kind: Kind; weight: number }[] = [
  { kind: "empty", weight: 5 },
  { kind: "translucent", weight: 3 },
  { kind: "circle", weight: 1 },
  { kind: "lines", weight: 1 },
  { kind: "x", weight: 1 },
  { kind: "diagonal", weight: 1 },
  { kind: "square", weight: 1 },
];
const COLOR_TABLE: { role: ColorRole; weight: number }[] = [
  { role: "neutral", weight: 88 },
  { role: "lavender", weight: 8 },
  { role: "lime", weight: 4 },
];

// Lifecycle timing (ms from mount). Mobile resolves faster.
const TIMING = {
  desktop: { tick: 110, activityEnd: 1300, resolveStart: 700, resolveSpan: 1500, jitter: 350, reroll: 0.14 },
  compact: { tick: 110, activityEnd: 650, resolveStart: 350, resolveSpan: 700, jitter: 200, reroll: 0.18 },
} as const;

const FADE_OUT_MS = 90;
const FADE_IN_MS = 110;
const SETTLE_MS = 260;
const CLEAR_PADDING_PX = 40;

type DensityCurve = "bookend";

function densityCurveMultiplier(curve: DensityCurve | undefined, rowFraction: number): number {
  if (curve === "bookend") return 0.5 + 1.5 * (1 - (2 * rowFraction - 1) ** 2);
  return 1;
}

function weightedPick<T extends { weight: number }>(table: T[]): T {
  const total = table.reduce((sum, t) => sum + t.weight, 0);
  let r = Math.random() * total;
  for (const entry of table) {
    r -= entry.weight;
    if (r <= 0) return entry;
  }
  return table[table.length - 1];
}

function colorVar(role: ColorRole): string {
  if (role === "lavender") return "var(--accent-lavender)";
  if (role === "lime") return "var(--acid)";
  return "currentColor";
}

type Cell = { row: number; col: number; cx: number; cy: number; eligibleMobile: boolean };

type CellEls = {
  rect: SVGRectElement | null;
  circle: SVGCircleElement | null;
  crossPath: SVGPathElement | null;
  linesPath: SVGPathElement | null;
};

function buildCells(cols: number, rows: number, fill: boolean, viewBoxHeight: number): Cell[] {
  const cells: Cell[] = [];
  const cellW = 100 / cols;
  const cellH = viewBoxHeight / rows;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      cells.push({
        row,
        col,
        cx: (col + 0.5) * cellW,
        cy: (row + 0.5) * cellH,
        eligibleMobile: fill ? row % 2 === 0 && col % 2 === 0 : BOXED_MOBILE_COLS.has(col) && BOXED_MOBILE_ROWS.has(row),
      });
    }
  }
  return cells;
}

/** The resolved lattice: every other row, every third column, alternating
 * filled and outlined nodes (a quiet nod to "states"), one lavender
 * accent node. */
function restKind(cell: Cell, rows: number, cols: number): { kind: Kind; role: ColorRole } {
  if (cell.row % 2 !== 1 || cell.col % 3 !== 1) return { kind: "empty", role: "neutral" };
  const node = (cell.row - 1) / 2 + (cell.col - 1) / 3;
  const accentRow = Math.min(5, rows - 1 - ((rows - 1) % 2 === 0 ? 1 : 0));
  const accentCol = 1 + 3 * Math.floor((cols - 2) / 3);
  if (cell.row === accentRow && cell.col === accentCol) return { kind: "translucent", role: "lavender" };
  return { kind: node % 2 === 0 ? "translucent" : "square", role: "neutral" };
}

function crossPathD(cx: number, cy: number, kind: "x" | "diagonal", scale: number): string {
  const s = 2.1 * scale;
  const a = `M ${cx - s} ${cy - s} L ${cx + s} ${cy + s}`;
  const b = `M ${cx + s} ${cy - s} L ${cx - s} ${cy + s}`;
  return kind === "x" ? `${a} ${b}` : a;
}

function linesPathD(cx: number, cy: number, scale: number): string {
  const halfW = 2.1 * scale;
  const dyStep = 1.2 * scale;
  return [-dyStep, 0, dyStep].map((dy) => `M ${cx - halfW} ${cy + dy} L ${cx + halfW} ${cy + dy}`).join(" ");
}

/** Union of an element's actual text boxes, per text node — block-level
 * children often span the full column even when their text is short. */
function contentRect(el: Element): { left: number; right: number; top: number; bottom: number } {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  let left = Infinity;
  let right = -Infinity;
  let top = Infinity;
  let bottom = -Infinity;
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!node.textContent?.trim()) continue;
    range.selectNodeContents(node);
    for (const r of Array.from(range.getClientRects())) {
      if (!r.width || !r.height) continue;
      left = Math.min(left, r.left);
      right = Math.max(right, r.right);
      top = Math.min(top, r.top);
      bottom = Math.max(bottom, r.bottom);
    }
  }
  return left === Infinity ? el.getBoundingClientRect() : { left, right, top, bottom };
}

export function SystemResolveField({
  fill = false,
  gridCols,
  gridRows,
  matchGridAspect = false,
  densityCurve,
  clearSelector,
}: {
  fill?: boolean;
  gridCols?: number;
  gridRows?: number;
  matchGridAspect?: boolean;
  densityCurve?: DensityCurve;
  /** Reading areas the field must stay out of (e.g. "[data-glyph-clear]"). */
  clearSelector?: string;
} = {}) {
  const cols = gridCols ?? (fill ? FULL_GRID_COLS : BOXED_GRID_COLS);
  const rows = gridRows ?? (fill ? FULL_GRID_ROWS : BOXED_GRID_ROWS);
  const viewBoxHeight = matchGridAspect ? (100 * rows) / cols : 100;
  const scale = fill ? Math.min(BOXED_GRID_COLS / cols, BOXED_GRID_ROWS / rows) : 1;
  const cells = buildCells(cols, rows, fill, viewBoxHeight);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const elsRef = useRef<CellEls[]>(cells.map(() => ({ rect: null, circle: null, crossPath: null, linesPath: null })));

  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const els = elsRef.current;
    const shown: Kind[] = cells.map(() => "empty");

    const applyKind = (i: number, kind: Kind, role: ColorRole, duration: number | null) => {
      const cell = cells[i];
      const { rect, circle, crossPath, linesPath } = els[i];
      const color = colorVar(role);
      shown[i] = kind;
      if (rect) {
        gsap.set(rect, kind === "translucent" ? { fill: color, fillOpacity: 0.18, stroke: "none" } : { fill: "none", fillOpacity: 1, stroke: color });
      }
      if (circle) gsap.set(circle, { stroke: color });
      if (crossPath) gsap.set(crossPath, { attr: { d: crossPathD(cell.cx, cell.cy, kind === "x" ? "x" : "diagonal", scale) }, stroke: color });
      if (linesPath) gsap.set(linesPath, { stroke: color });
      const targets: [SVGElement | null, number][] = [
        [circle, kind === "circle" ? 1 : 0],
        [crossPath, kind === "x" || kind === "diagonal" ? 1 : 0],
        [linesPath, kind === "lines" ? 1 : 0],
        [rect, kind === "square" || kind === "translucent" ? 1 : 0],
      ];
      targets.forEach(([el, opacity]) => {
        if (!el) return;
        gsap.killTweensOf(el, "opacity");
        if (duration === null) gsap.set(el, { opacity });
        else gsap.to(el, { opacity, duration: (opacity === 0 ? Math.min(duration, FADE_OUT_MS) : duration) / 1000, ease: "sine.inOut" });
      });
    };

    const compact = window.matchMedia(COMPACT_QUERY).matches;
    const reduced = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    const eligible = cells.map((cell) => !compact || cell.eligibleMobile);

    // Which cells sit inside a reading area, from real screen geometry
    // (the SVG is slice-scaled, so viewBox position alone can't tell).
    let clear: boolean[] = cells.map(() => false);
    const measureClear = () => {
      const ctm = svg.getScreenCTM();
      if (!ctm) return;
      const pad = CLEAR_PADDING_PX;
      const rects = clearSelector
        ? Array.from(document.querySelectorAll(clearSelector)).map((el) => contentRect(el))
        : [];
      clear = cells.map((cell) => {
        const x = cell.cx * ctm.a + ctm.e;
        const y = cell.cy * ctm.d + ctm.f;
        return rects.some((r) => x > r.left - pad && x < r.right + pad && y > r.top - pad && y < r.bottom + pad);
      });
    };

    // The resolved lattice ignores the mobile thinning (which only limits
    // how many cells move during activity); reading areas stay empty.
    const target = (i: number) => (!clear[i] ? restKind(cells[i], rows, cols) : { kind: "empty" as Kind, role: "neutral" as ColorRole });
    const rest = () => {
      svg.dataset.phase = "rest";
    };

    const settleAll = (duration: number | null) => {
      cells.forEach((_, i) => {
        const { kind, role } = target(i);
        if (duration === null || shown[i] !== kind) applyKind(i, kind, role, duration);
      });
    };

    measureClear();
    svg.dataset.phase = "active";

    let interval = 0;
    const settled = cells.map(() => reduced);
    if (reduced) {
      settleAll(null);
      rest();
    } else {
      const timing = compact ? TIMING.compact : TIMING.desktop;
      const start = performance.now();
      const settleAt = cells.map((cell) => {
        const colFraction = cols > 1 ? cell.col / (cols - 1) : 0;
        return timing.resolveStart + colFraction * timing.resolveSpan + Math.random() * timing.jitter;
      });

      const tick = () => {
        const now = performance.now() - start;
        let pending = 0;
        cells.forEach((cell, i) => {
          if (settled[i]) return;
          if (now >= settleAt[i]) {
            const { kind, role } = target(i);
            applyKind(i, kind, role, SETTLE_MS);
            settled[i] = true;
            return;
          }
          pending += 1;
          if (!eligible[i] || clear[i] || now > timing.activityEnd || Math.random() > timing.reroll) return;
          const rowFraction = rows > 1 ? cell.row / (rows - 1) : 0;
          const multiplier = densityCurveMultiplier(densityCurve, rowFraction);
          const table = multiplier === 1 ? KIND_TABLE : KIND_TABLE.map((e) => (e.kind === "empty" ? { ...e, weight: e.weight * multiplier } : e));
          const kind = weightedPick(table).kind;
          applyKind(i, kind, kind === "empty" ? "neutral" : weightedPick(COLOR_TABLE).role, FADE_IN_MS);
        });
        if (!pending) {
          window.clearInterval(interval);
          interval = 0;
          rest();
        }
      };
      tick();
      interval = window.setInterval(tick, timing.tick);
    }

    // Entrance animations (e.g. the Hero title rising into its mask) move
    // reading areas right after mount; measure again once they have
    // landed and correct any cell that already settled.
    const remeasureTimer = window.setTimeout(() => {
      measureClear();
      cells.forEach((_, i) => {
        if (settled[i]) {
          const { kind, role } = target(i);
          if (shown[i] !== kind) applyKind(i, kind, role, SETTLE_MS);
        } else if (clear[i] && shown[i] !== "empty") {
          applyKind(i, "empty", "neutral", FADE_OUT_MS);
        }
      });
    }, 1300);

    // Layout changes move reading areas; re-resolve the rest state
    // without replaying the lifecycle.
    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        measureClear();
        if (svg.dataset.phase === "rest") settleAll(SETTLE_MS);
      }, 150);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(resizeTimer);
      window.clearTimeout(remeasureTimer);
      window.removeEventListener("resize", onResize);
      els.forEach((cellEls) => gsap.killTweensOf(Object.values(cellEls).filter(Boolean)));
    };
    // Runs once per mount: `cells` is deterministic geometry recomputed
    // each render, and the lifecycle must never replay on a re-render
    // (e.g. a locale switch).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const preserveAspectRatio = fill ? "xMidYMid slice" : "xMidYMid meet";

  return (
    <div aria-hidden className="hero-shapes-scene absolute inset-0 flex items-center justify-center">
      <svg ref={svgRef} viewBox={`0 0 100 ${viewBoxHeight}`} className="h-full w-full" preserveAspectRatio={preserveAspectRatio}>
        {cells.map((cell, i) => (
          <g key={`${cell.row}-${cell.col}`}>
            <rect
              ref={(el) => {
                elsRef.current[i].rect = el;
              }}
              x={cell.cx - 2.1 * scale}
              y={cell.cy - 2.1 * scale}
              width={4.2 * scale}
              height={4.2 * scale}
              className="hero-shapes-cell"
              style={{ opacity: 0 }}
            />
            <circle
              ref={(el) => {
                elsRef.current[i].circle = el;
              }}
              cx={cell.cx}
              cy={cell.cy}
              r={1.7 * scale}
              className="hero-shapes-cell"
              style={{ opacity: 0 }}
            />
            <path
              ref={(el) => {
                elsRef.current[i].crossPath = el;
              }}
              d={crossPathD(cell.cx, cell.cy, "x", scale)}
              className="hero-shapes-cell"
              style={{ opacity: 0 }}
            />
            <path
              ref={(el) => {
                elsRef.current[i].linesPath = el;
              }}
              d={linesPathD(cell.cx, cell.cy, scale)}
              className="hero-shapes-cell"
              style={{ opacity: 0 }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
