"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

const MOTION_QUERY = "(prefers-reduced-motion: no-preference)";
const COMPACT_QUERY = "(max-width: 767px)";

/**
 * Hero A/B prototype, variant B, v3 — a closer behavioral match to
 * 21st.dev/uicapsule's "Background Shapes" than v2 was. Variant A
 * (HeroCube.tsx) is untouched; see Hero.tsx for the switch.
 *
 * v2 (superseded, see git history) introduced two layers the source
 * doesn't have: a separate per-cell "is this cell occupied at all"
 * probability gate ON TOP OF the shape-weight table, and one shared
 * setInterval "due-time checker" standing in for genuinely independent
 * per-cell timers. Angela's explicit correction: the occupied-gate made
 * the field read as too sparse/too designed (the source has no such
 * gate — "empty" is just one more weighted option alongside the shapes,
 * same table, same roll), and even though the shared-checker approach
 * measurably produced independent-looking timing, she wants the
 * *architecture* itself closer to source truth, not just a visual
 * approximation of it.
 *
 * v3 fixes both directly: ONE flat weighted table per cell (matching the
 * source's stated philosophy — circle/lines/x/square/diagonal: 1 each,
 * translucent: 3, empty: 5 — see KIND_TABLE) with no separate occupancy
 * probability layered on top, and every eligible cell owns a genuine
 * independent `window.setTimeout` chain (not a shared driver) — so the
 * "one shared timer is fine as long as it still looks independent"
 * optimization from v2 is gone; this really is ~36 independent timers,
 * which is still trivially cheap (setTimeout costs nothing until it
 * fires). Deliberately still plain `setTimeout`, not GSAP's delayedCall
 * (rAF-driven): this session repeatedly found GSAP's ticker stalls while
 * its tab/pane isn't visible, which would otherwise freeze every cell's
 * schedule at once rather than just delay a crossfade.
 *
 * Left-right "mirroring" is structural, not a synchronization rule: the
 * grid has an even column count so every column has a mirror column at
 * the same rows, but nothing forces a cell and its mirror to agree — per
 * Angela's explicit instruction, each keeps rolling fully independently.
 * There is deliberately no other position-based bias (no quieter center,
 * no quieter edges) — the source doesn't have one, and Angela's own
 * complaint was that v2's version of that bias made the field feel too
 * curated; title-area breathing room comes entirely from this
 * component's placement (inside .hero-plane, never over the text
 * column), not from suppressing any cell inside its own grid.
 */

type Kind = "empty" | "circle" | "lines" | "x" | "diagonal" | "square" | "translucent";
type ColorRole = "neutral" | "lavender" | "lime";

// Boxed cube/shapes variants — unchanged from source, byte-identical to
// before the `fill` mode existed.
const BOXED_GRID_COLS = 6;
const BOXED_GRID_ROWS = 6;

// `fill` (Hero full-background experiment) only: same weighted tables,
// same independent per-cell timers, same empty/translucent/glyph ratios —
// only the grid RESOLUTION increases, which is what actually restores a
// populated feel once the same 36-cell field is stretched across a full
// Hero instead of a ~520px box. Cell count goes from 36 to 120 (~3.3x);
// shape sizes are scaled down proportionally (see SHAPE_SCALE below) so
// each glyph keeps roughly the same share of its own (now smaller) cell
// instead of crowding into its neighbors.
const FULL_GRID_COLS = 12;
const FULL_GRID_ROWS = 10;

// Mobile renders fewer grid positions outright (not just lower odds on
// the same cells) — spanning the full plane either way. The boxed 6x6
// keeps its original specific 4x4 subset; `fill`'s larger, non-square
// grid generalizes the same "thin it out on narrow viewports" intent as
// an even-index rule instead (index-set literals tuned for a 6-count
// grid don't carry over to a 12x10 one).
const BOXED_MOBILE_COLS = new Set([0, 2, 3, 5]);
const BOXED_MOBILE_ROWS = new Set([0, 2, 3, 5]);

// Per-cell independent interval — no shared cadence.
const INTERVAL_MIN_MS = 1000;
const INTERVAL_MAX_MS = 5000;

// Source's stated weighting philosophy, unchanged: emptiness dominates
// (5), the subtle translucent block is next most common (3), and the
// five sharper linework glyphs are each equally rare (1 each). This is
// ONE table applied to every eligible cell on every reroll — no separate
// "is this cell occupied" gate on top of it, which is what made v2 read
// as too sparse relative to the source.
const KIND_TABLE: { kind: Kind; weight: number }[] = [
  { kind: "empty", weight: 5 },
  { kind: "translucent", weight: 3 },
  { kind: "circle", weight: 1 },
  { kind: "lines", weight: 1 },
  { kind: "x", weight: 1 },
  { kind: "diagonal", weight: 1 },
  { kind: "square", weight: 1 },
];

// Only ever scales the "empty" entry's weight — every other entry, and
// the relative proportions among the five glyph kinds, are untouched.
// `1` (the default everywhere except an explicit page-level density
// curve) returns the exact same table reference, so nothing changes for
// any existing consumer.
function kindTableWithEmptyWeight(multiplier: number): { kind: Kind; weight: number }[] {
  if (multiplier === 1) return KIND_TABLE;
  return KIND_TABLE.map((entry) => (entry.kind === "empty" ? { ...entry, weight: entry.weight * multiplier } : entry));
}

type DensityCurve = "bookend";

// Named presets, not a raw function prop: this component's own callers
// (e.g. AboutV2.tsx) can be plain server components, and a function
// can't cross the server/client boundary as a prop. Resolved to an
// actual multiplier here, where "use client" already applies.
function densityCurveMultiplier(curve: DensityCurve | undefined, rowFraction: number): number {
  if (curve === "bookend") {
    // Stronger presence at the very top/bottom, calmer through the
    // middle — 0.5x "empty" weight (more active) at the edges, 2x
    // (calmer) at the midpoint.
    return 0.5 + 1.5 * (1 - (2 * rowFraction - 1) ** 2);
  }
  return 1;
}
// Applies only when a non-empty kind is rolled — "keep accents very
// rare" — an empty cell has no color to speak of.
const COLOR_TABLE: { role: ColorRole; weight: number }[] = [
  { role: "neutral", weight: 88 },
  { role: "lavender", weight: 8 },
  { role: "lime", weight: 4 },
];

// Very short — matching the source's near-instant swaps far more than a
// deliberate crossfade. Long enough only to avoid a jarring hard pop.
const FADE_OUT_MS = 90;
const FADE_IN_MS = 110;

function weightedPick<T extends { weight: number }>(table: T[]): T {
  const total = table.reduce((sum, t) => sum + t.weight, 0);
  let r = Math.random() * total;
  for (const entry of table) {
    r -= entry.weight;
    if (r <= 0) return entry;
  }
  return table[table.length - 1];
}

// Deterministic (NOT Math.random) — used only for the very first
// composition, so server and client produce identical initial markup
// (no hydration mismatch) and the first paint doesn't flash from empty
// to populated. Every cell's *ongoing* re-rolling after mount uses real
// Math.random(), and the first real reroll is at most 5s away, so the
// full source-matched density arrives almost immediately regardless.
function seededFraction(row: number, col: number): number {
  const x = Math.sin(row * 12.9898 + col * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function colorVar(role: ColorRole): string {
  if (role === "lavender") return "var(--accent-lavender)";
  if (role === "lime") return "var(--acid)";
  return "currentColor";
}

// Immutable geometry, read (never written) by JSX. Kept separate from
// CellState below — which IS mutated, but only from the effect/ref
// callbacks, never from anything JSX reads — so nothing rendered is ever
// mutated after the fact.
type Cell = { row: number; col: number; cx: number; cy: number; eligibleMobile: boolean };

type CellState = {
  els: {
    rect: SVGRectElement | null;
    circle: SVGCircleElement | null;
    crossPath: SVGPathElement | null;
    linesPath: SVGPathElement | null;
  };
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

function buildCellState(): CellState {
  return { els: { rect: null, circle: null, crossPath: null, linesPath: null } };
}

// The "x" and "diagonal" glyphs share one <path> (a path can hold several
// disconnected subpaths); which subpath(s) it currently draws is just an
// attribute swap done while the element is faded to 0 opacity, the same
// "change it while invisible" technique the rect below uses for
// square-outline vs. translucent-fill. `scale` keeps each glyph's share
// of its own cell consistent when the grid's cell size changes (see
// SHAPE_SCALE) — it does not introduce any new shape, just resizes the
// existing ones uniformly.
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

export function HeroBackgroundShapes({
  fill = false,
  gridCols,
  gridRows,
  matchGridAspect = false,
  densityCurve,
}: {
  fill?: boolean;
  // Optional per-consumer density override for `fill` mode only (e.g.
  // About's own composition) — same weighted tables, timing, colors, and
  // undistorted-scaling behavior either way, just a different cell count.
  // Omit to get the Home full-background defaults (FULL_GRID_COLS/ROWS).
  gridCols?: number;
  gridRows?: number;
  // When true, the SVG viewBox's own height becomes 100*rows/cols instead
  // of a fixed 100 (still a square viewBox when rows===cols, so every
  // existing caller — including Home's fill call — is unaffected by
  // default). For a page-spanning field that's much taller than wide,
  // this lets the source aspect roughly track the target's, so uniform
  // "slice" scaling crops a lot less width than a square source would —
  // shapes stay undistorted either way (scaling is always uniform), this
  // only changes how much of the grid survives the crop.
  matchGridAspect?: boolean;
  // Optional named per-row density bias (see densityCurveMultiplier) — a
  // preset name rather than a callback, since a plain function prop can't
  // cross the server/client boundary and some callers (e.g. AboutV2.tsx)
  // are server components. Every glyph kind keeps the same relative odds
  // to every other kind; only the "empty" entry's weight shifts by row,
  // and cells within the same row still roll fully independently. Omit
  // for the original flat, position-agnostic table (Home and the boxed
  // variants never pass this).
  densityCurve?: DensityCurve;
} = {}) {
  const cols = gridCols ?? (fill ? FULL_GRID_COLS : BOXED_GRID_COLS);
  const rows = gridRows ?? (fill ? FULL_GRID_ROWS : BOXED_GRID_ROWS);
  const viewBoxHeight = matchGridAspect ? (100 * rows) / cols : 100;
  // Cell size shrinks as grid resolution increases from the boxed 6x6
  // baseline — shapes scale down by the same factor so each glyph keeps
  // its original ~25% share of its own cell instead of crowding its
  // neighbors, whatever cols/rows this particular consumer chose.
  const scale = fill ? Math.min(BOXED_GRID_COLS / cols, BOXED_GRID_ROWS / rows) : 1;
  // Geometry is plain and recomputed per render — deterministic and cheap,
  // and it needs no stable identity since its values never change.
  const cells = buildCells(cols, rows, fill, viewBoxHeight);
  // Mutable per-cell bookkeeping (DOM element refs) DOES need a stable
  // identity across any re-render this component's parent triggers (Hero
  // re-renders on locale change) — without that, a locale switch while
  // variant B is showing would silently null out every cell's element
  // refs and freeze the whole scene. useRef's *eager* initializer form
  // (matching HeroCube's own established ref-array pattern) — never a
  // conditional `if (!ref.current) ref.current = ...` reassignment, and
  // never aliased into a local read during render — is what keeps this
  // lint-clean: `.current` is only ever touched lazily, inside the ref
  // callbacks below and inside the effect, both of which run after render.
  const stateRef = useRef<CellState[]>(cells.map(() => buildCellState()));

  useLayoutEffect(() => {
    const state = stateRef.current;

    const applyKind = (cell: Cell, cellState: CellState, kind: Kind, role: ColorRole, immediate: boolean) => {
      const { rect, circle, crossPath, linesPath } = cellState.els;
      const color = colorVar(role);

      if (rect) {
        gsap.set(
          rect,
          kind === "translucent"
            ? { fill: color, fillOpacity: 0.18, stroke: "none" }
            : { fill: "none", fillOpacity: 1, stroke: color },
        );
      }
      if (circle) gsap.set(circle, { stroke: color });
      if (crossPath) {
        gsap.set(crossPath, { attr: { d: crossPathD(cell.cx, cell.cy, kind === "x" ? "x" : "diagonal", scale) }, stroke: color });
      }
      if (linesPath) gsap.set(linesPath, { stroke: color });

      const targets: [SVGElement | null, number][] = [
        [circle, kind === "circle" ? 1 : 0],
        [crossPath, kind === "x" || kind === "diagonal" ? 1 : 0],
        [linesPath, kind === "lines" ? 1 : 0],
        [rect, kind === "square" || kind === "translucent" ? 1 : 0],
      ];
      targets.forEach(([el, opacity]) => {
        if (!el) return;
        if (immediate) gsap.set(el, { opacity });
        else gsap.to(el, { opacity, duration: (opacity === 0 ? FADE_OUT_MS : FADE_IN_MS) / 1000, ease: "sine.inOut" });
      });
    };

    const rollKindAndRole = (rowFraction: number): { kind: Kind; role: ColorRole } => {
      const multiplier = densityCurveMultiplier(densityCurve, rowFraction);
      const kind = weightedPick(kindTableWithEmptyWeight(multiplier)).kind;
      if (kind === "empty") return { kind, role: "neutral" };
      return { kind, role: weightedPick(COLOR_TABLE).role };
    };

    const initialCompact = window.matchMedia(COMPACT_QUERY).matches;

    // Fixed, deterministic first composition (see seededFraction) — the
    // one thing every load has in common, always the calmest non-empty
    // shape (translucent) at a rate matching that shape's own share of
    // KIND_TABLE (3/13), so it never has to reproduce full kind variety
    // to still look "already settled." Genuine variety — and the source-
    // matched ~62% non-empty density — takes over from each cell's very
    // first real reroll, at most 5s later.
    const translucentShare = 3 / KIND_TABLE.reduce((sum, t) => sum + t.weight, 0);
    cells.forEach((cell, i) => {
      const eligible = !initialCompact || cell.eligibleMobile;
      const kind: Kind = eligible && seededFraction(cell.row, cell.col) < translucentShare ? "translucent" : "empty";
      applyKind(cell, state[i], kind, "neutral", true);
    });

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add(MOTION_QUERY, () => {
        const compact = window.matchMedia(COMPACT_QUERY).matches;
        const timeoutIds: number[] = [];
        let cancelled = false;

        // Genuinely independent per-cell scheduling: each eligible cell
        // gets its own recursive setTimeout chain with its own random
        // delay every time, never synchronized against any other cell or
        // any shared clock.
        cells.forEach((cell, i) => {
          if (compact && !cell.eligibleMobile) return;
          const rowFraction = rows > 1 ? cell.row / (rows - 1) : 0;
          const scheduleNext = () => {
            if (cancelled) return;
            const delay = INTERVAL_MIN_MS + Math.random() * (INTERVAL_MAX_MS - INTERVAL_MIN_MS);
            const id = window.setTimeout(() => {
              const { kind, role } = rollKindAndRole(rowFraction);
              applyKind(cell, state[i], kind, role, false);
              scheduleNext();
            }, delay);
            timeoutIds.push(id);
          };
          scheduleNext();
        });

        return () => {
          cancelled = true;
          timeoutIds.forEach((id) => window.clearTimeout(id));
        };
      });
    });

    return () => {
      media.revert();
      context.revert();
    };
    // `cells` is intentionally excluded: it's plain deterministic geometry
    // recomputed fresh (new array, identical values) on every render, and
    // this effect must run exactly once per mount, not on every re-render
    // (e.g. every locale switch) — including it would restart every
    // cell's schedule and refire the initial static composition each time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // `fill`: Hero full-background composition experiment (see Hero.tsx's
  // HERO_VISUAL "shapes-full" mode) — same weighted kind/color tables,
  // same per-cell independent timers, only the grid resolution and shape
  // scale change (see FULL_GRID_COLS/ROWS and SHAPE_SCALE above). Uniform
  // scaling only: "meet" (boxed variants, unchanged) letterboxes to stay
  // square; "slice" (fill) scales the SAME square viewBox up uniformly
  // until it covers a non-square Hero, cropping the overflow on two edges
  // instead of stretching — every glyph keeps its authored proportions
  // exactly, since x and y always scale by the same factor. This was
  // previously "none" (independent x/y stretch), which distorted circles
  // into ellipses and squares into rectangles at any non-square aspect —
  // that was the actual cause of the reported distortion, not anything
  // about the grid/weights/timing below, none of which changed.
  const preserveAspectRatio = fill ? "xMidYMid slice" : "xMidYMid meet";

  return (
    <div aria-hidden className="hero-shapes-scene absolute inset-0 flex items-center justify-center">
      <svg viewBox={`0 0 100 ${viewBoxHeight}`} className="h-full w-full" preserveAspectRatio={preserveAspectRatio} role="img">
        {cells.map((cell, i) => (
          <g key={`${cell.row}-${cell.col}`}>
            <rect
              ref={(el) => {
                stateRef.current[i].els.rect = el;
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
                stateRef.current[i].els.circle = el;
              }}
              cx={cell.cx}
              cy={cell.cy}
              r={1.7 * scale}
              className="hero-shapes-cell"
              style={{ opacity: 0 }}
            />
            <path
              ref={(el) => {
                stateRef.current[i].els.crossPath = el;
              }}
              d={crossPathD(cell.cx, cell.cy, "x", scale)}
              className="hero-shapes-cell"
              style={{ opacity: 0 }}
            />
            <path
              ref={(el) => {
                stateRef.current[i].els.linesPath = el;
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
