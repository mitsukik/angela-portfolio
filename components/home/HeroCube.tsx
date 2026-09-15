"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

const MOTION_QUERY = "(prefers-reduced-motion: no-preference)";

/**
 * Motion pass — this file's static geometry (below) is frozen and
 * approved; do not change GRID/UNIT/project/buildCells/SILHOUETTE/
 * ACCENT_EDGE. The earlier randomized "glitch" pulses (brief stretch/
 * tilt bursts on isolated sub-groups) were not approved and have been
 * removed entirely in favor of one continuous, calm motion: the whole
 * cube — every face, the silhouette, and the accent edge together, as
 * a single group — rotates gently between -3deg and +3deg around its
 * own center and back, on an endless sine.inOut loop. Because the SVG
 * is a flat isometric drawing rather than a real 3D object, this is a
 * plain 2D graphic rotation (CSS/SVG `rotate`, no perspective, no
 * CSS-3D) — it reads as the object tilting slightly in place, not
 * spinning.
 */

/**
 * Root cause of the previous "scattered rectangles" result: that version
 * built 27 independent CSS `transform-style: preserve-3d` boxes, each
 * with its own perspective-projected faces. Adjacent cubes' edges are
 * computed through independent 3D transform chains (translate3d + rotate
 * + perspective per element), so even though the *intended* geometry
 * lines up, floating-point/perspective differences between elements mean
 * neighboring faces don't share an exact edge on screen — that's what
 * read as "floating pieces" rather than one solid form.
 *
 * Rebuilt as flat SVG using one hand-computed TRUE isometric (parallel/
 * orthographic, not perspective) projection function applied to every
 * point. Because every vertex — across all three visible faces and all
 * 27 surface cells — is computed from the exact same formula, shared
 * edges are mathematically identical, not just visually close. This is
 * also why occlusion/z-ordering isn't needed at all: a real isometric
 * cube's three camera-facing macro-faces (top, front, right) never
 * overlap in projection — they meet exactly at shared edges — so this
 * only ever draws the genuinely visible surface, never floating
 * interior geometry.
 */
const GRID = 3;
const UNIT = 46; // one grid cell's edge length, SVG user units
const COS30 = Math.cos(Math.PI / 6);
const SIN30 = Math.sin(Math.PI / 6);

/** Isometric projection: 3D grid-space point -> 2D screen point. */
function project(x: number, y: number, z: number): [number, number] {
  const sx = (x - z) * UNIT * COS30;
  const sy = (x + z) * UNIT * SIN30 - y * UNIT;
  return [sx, sy];
}

function toPoints(corners: Array<[number, number, number]>): string {
  return corners.map(([x, y, z]) => project(x, y, z).join(",")).join(" ");
}

type Cell = { key: string; points: string; face: "top" | "front" | "right" };

function buildCells(): Cell[] {
  const cells: Cell[] = [];
  for (let a = 0; a < GRID; a++) {
    for (let b = 0; b < GRID; b++) {
      // Top face (y = GRID): grid runs over x, z.
      cells.push({
        key: `top-${a}-${b}`,
        face: "top",
        points: toPoints([
          [a, GRID, b],
          [a + 1, GRID, b],
          [a + 1, GRID, b + 1],
          [a, GRID, b + 1],
        ]),
      });
      // Front face (z = GRID): grid runs over x, y.
      cells.push({
        key: `front-${a}-${b}`,
        face: "front",
        points: toPoints([
          [a, b, GRID],
          [a + 1, b, GRID],
          [a + 1, b + 1, GRID],
          [a, b + 1, GRID],
        ]),
      });
      // Right face (x = GRID): grid runs over y, z.
      cells.push({
        key: `right-${a}-${b}`,
        face: "right",
        points: toPoints([
          [GRID, a, b],
          [GRID, a, b + 1],
          [GRID, a + 1, b + 1],
          [GRID, a + 1, b],
        ]),
      });
    }
  }
  return cells;
}

// Single restrained accent: one internal grid seam on the front face,
// near the corner nearest the viewer — not a whole cell, not a whole
// face. A plain colored stroke, no glow/filter.
const ACCENT_EDGE = toPoints([
  [2, 2, GRID],
  [2, 3, GRID],
]);

// The outer hexagonal silhouette shared by all three visible faces —
// drawn once, on top of the grid cells, with a heavier stroke so the
// object reads as one solid form first and a subdivided grid second.
const SILHOUETTE = toPoints([
  [0, GRID, 0],
  [GRID, GRID, 0],
  [GRID, 0, 0],
  [GRID, 0, GRID],
  [0, 0, GRID],
  [0, GRID, GRID],
]);

const HALF_W = GRID * UNIT * COS30;
const HALF_H = GRID * UNIT;
const PAD = 12;
const VIEW_BOX = `${-HALF_W - PAD} ${-HALF_H - PAD} ${HALF_W * 2 + PAD * 2} ${HALF_H * 2 + PAD * 2}`;

// One full cycle (-3deg -> +3deg -> -3deg) takes this long, in seconds.
const ROTATE_CYCLE_SECONDS = 10;

/**
 * The Hero's signature isometric 3x3x3 block. Nested inside the existing
 * .hero-plane (see Hero.tsx), which already supplies this element's
 * entrance animation and its own scroll/pointer-driven position — this
 * component owns only the object itself: its frozen static geometry, and
 * (see the file header comment) one continuous whole-cube rotation
 * layered on top without altering that geometry.
 */
export function HeroCube() {
  const cells = buildCells();
  const topCells = cells.filter((c) => c.face === "top");
  const frontCells = cells.filter((c) => c.face === "front");
  const rightCells = cells.filter((c) => c.face === "right");

  const rotateGroupRef = useRef<SVGGElement | null>(null);

  useLayoutEffect(() => {
    const rotateGroup = rotateGroupRef.current;
    if (!rotateGroup) return;

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      // Reduced motion never runs this block at all, so the group keeps
      // its default (no) transform — the exact frozen static markup —
      // with no separate "static mode" branch to keep in sync.
      media.add(MOTION_QUERY, () => {
        gsap.set(rotateGroup, { transformOrigin: "50% 50%", rotation: -3 });
        const tween = gsap.to(rotateGroup, {
          rotation: 3,
          duration: ROTATE_CYCLE_SECONDS / 2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });

        return () => {
          tween.kill();
          gsap.set(rotateGroup, { rotation: 0 });
        };
      });
    }, rotateGroup);

    return () => {
      media.revert();
      context.revert();
    };
  }, []);

  return (
    <div aria-hidden className="hero-cube-scene absolute inset-0 flex items-center justify-center">
      <svg
        viewBox={VIEW_BOX}
        className="hero-cube-svg h-auto w-[70%] max-w-[250px] md:w-[77%] md:max-w-[270px]"
        role="img"
      >
        <g ref={rotateGroupRef}>
          {topCells.map((cell) => (
            <polygon key={cell.key} points={cell.points} className="hero-cube-cell hero-cube-cell--top" />
          ))}
          {frontCells.map((cell) => (
            <polygon key={cell.key} points={cell.points} className="hero-cube-cell" />
          ))}
          {rightCells.map((cell) => (
            <polygon key={cell.key} points={cell.points} className="hero-cube-cell" />
          ))}
          <polygon points={SILHOUETTE} className="hero-cube-silhouette" />
          <polyline points={ACCENT_EDGE} className="hero-cube-accent" />
        </g>
      </svg>
    </div>
  );
}
