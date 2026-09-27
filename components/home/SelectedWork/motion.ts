"use client";

import { useEffect, useLayoutEffect, useState } from "react";

// Scroll-math helpers originally ported from the connected Lovable
// "VER B" project's src/lib/scroll.ts.
export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
export const mapRange = (v: number, a: number, b: number) => clamp((v - a) / (b - a));
export const easeOut = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
export const smooth = (t: number) => {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
};

/*
 * Selected Work stage choreography (desktop / tablet pinned stage only).
 *
 * Scene units: project i is "at rest" around sceneP === i. The incoming
 * project wipes in OVER the outgoing one along a single edge (one clean
 * line — no band of bare stage between two clips, no semi-transparent mix
 * of a dark and a light scene) during WIPE, then its copy settles. The
 * last project holds through the tail until the pin releases.
 *
 * Pacing (P0.3): SCENE_VH of scroll per project — about two-thirds of a
 * viewport, down from the original ~1.1 viewports — so a recruiter
 * reaches and scans all four projects substantially faster while every
 * project still gets a readable rest.
 */
export const WIPE: readonly [number, number] = [-0.34, 0.02];
export const SCENE_SPAN = 3.6;
export const SCENE_VH = 70;
export const TRACK_HEIGHT_VH = 100 + SCENE_SPAN * SCENE_VH;

/** Midpoint of project i's incoming wipe — where it becomes "current". */
export const handoverPoint = (i: number) => (i === 0 ? 0 : i + (WIPE[0] + WIPE[1]) / 2);

export type SceneFrame = {
  /** 0..1 wipe progress of this project (always 1 for the first). */
  enter: number;
  /** false once the next project has fully covered this one. */
  visible: boolean;
  /** 0..1 settle progress of this project's copy, per stagger delay. */
  text: (delay: number) => number;
};

/** `still` (reduced motion): the same pinned stage, but each handover is
 * an instant switch at the wipe midpoint — no wipe, no copy travel. */
export function sceneFrame(index: number, count: number, sceneP: number, still = false): SceneFrame {
  const f = sceneP - index;
  const mid = (WIPE[0] + WIPE[1]) / 2;
  const progress = (x: number) => (still ? (x >= mid ? 1 : 0) : smooth(mapRange(x, WIPE[0], WIPE[1])));
  const enter = index === 0 ? 1 : progress(f);
  const nextEnter = index < count - 1 ? progress(f - 1) : 0;
  return {
    enter,
    visible: enter > 0 && nextEnter < 1,
    text: (delay: number) =>
      index === 0 || still ? 1 : easeOut(mapRange(f, WIPE[0] + 0.12 + delay, WIPE[1] + 0.14 + delay)),
  };
}

// useLayoutEffect only on the client — SSR has no window/matchMedia. On
// the client this resolves before paint, so the compact/pinned choice
// settles before sibling ScrollTriggers measure the page.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** Media query hook (SSR-safe). */
export function useMedia(query: string) {
  const [matches, setMatches] = useState(false);
  useIsomorphicLayoutEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return matches;
}
