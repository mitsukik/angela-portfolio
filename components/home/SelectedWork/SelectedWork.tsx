"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Locale } from "@/data/locale";
import { projects } from "@/data/projects";
import { getLenisInstance } from "@/components/site/lenisInstance";
import { useSyncHeaderVariant } from "@/components/site/headerTheme";
import { SCENE_SPAN, TRACK_HEIGHT_VH, WIPE, clamp, handoverPoint, sceneFrame, useMedia } from "./motion";
import { ProjectScene, sceneStyles } from "./ProjectScene";

const COUNT = projects.length;

/*
 * Shared header tone — restored to the pre-83d694a behavior.
 * Before the interaction upgrade the Home header took the NEXT project's
 * tone slightly ahead of that project's own arrival:
 *   current = clamp(floor(sceneP + 0.25)), sceneP = progress * 4.35
 * i.e. 0.03 scene units before its wipe window (f = -0.22) opened, on the
 * pinned stage AND on the mobile stacked list alike.
 * - Stacked (mobile): the stacked list is unchanged from then, so the
 *   original formula is used verbatim (LEGACY_SPAN / LEGACY_LEAD).
 * - Pinned: the same relationship to the wipe, on the new wipe window —
 *   the header flips HEADER_LEAD before WIPE[0].
 */
const LEGACY_SPAN = 4.35;
const LEGACY_LEAD = 0.25;
const HEADER_LEAD = 0.03;
const headerIndexPinned = (sceneP: number) => {
  let index = 0;
  for (let i = 1; i < COUNT; i += 1) if (sceneP >= i + WIPE[0] - HEADER_LEAD) index = i;
  return index;
};
const headerIndexStacked = (progress: number) => clamp(Math.floor(progress * LEGACY_SPAN + LEGACY_LEAD), 0, COUNT - 1);
const lastNumber = String(COUNT).padStart(2, "0");

/** Scene-unit span of each project's progress-rail segment. */
const segment = (i: number): [number, number] => [handoverPoint(i), i === COUNT - 1 ? SCENE_SPAN : handoverPoint(i + 1)];

/**
 * Selected Work. Desktop/tablet: one pinned stage where each project wipes
 * in over the previous one (see motion.ts). Every scroll frame is written
 * straight to element styles from one ScrollTrigger — no React state per
 * frame; React only re-renders when the *current* project changes (for
 * the counter, aria-current and the shared header tone).
 *
 * Mobile: a plain stacked list — no pinning, no scroll-driven
 * choreography. Reduced motion keeps the pinned stage (a stacked list
 * would blow each desktop image up to several viewports tall) but every
 * handover is an instant switch with no wipe or travel.
 */
export function SelectedWork({ locale }: { locale: Locale }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const still = useMedia("(prefers-reduced-motion: reduce)");
  const compact = useMedia("(max-width: 767px)");
  const stacked = compact;
  const [current, setCurrent] = useState(0);
  const [headerTone, setHeaderTone] = useState(projects[0].stageBackground);

  // Report the Home header tone to the shared SiteHeader (see
  // components/site/headerTheme.tsx and the header-tone note above).
  useSyncHeaderVariant(headerTone);

  // The compact/pinned choice settles after the first client render and
  // changes document height; triggers created meanwhile (e.g. the
  // Closing reveal) must re-measure against the corrected layout.
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [stacked]);

  // Stacked (mobile) header tone — the original progress formula; the
  // state only changes at the three hand-overs, never per scroll frame.
  useLayoutEffect(() => {
    if (!stacked) return;
    const track = trackRef.current;
    if (!track) return;
    gsap.registerPlugin(ScrollTrigger);
    let last = -1;
    const sync = (progress: number) => {
      const index = headerIndexStacked(progress);
      if (index === last) return;
      last = index;
      setHeaderTone(projects[index].stageBackground);
    };
    const trigger = ScrollTrigger.create({
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => sync(self.progress),
      onRefresh: (self) => sync(self.progress),
    });
    sync(trigger.progress);
    return () => trigger.kill();
  }, [stacked]);

  useLayoutEffect(() => {
    if (stacked) return;
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;
    gsap.registerPlugin(ScrollTrigger);

    const scenes = projects.map((project, i) => {
      const root = stage.querySelector<HTMLElement>(`[data-scene="${i}"]`);
      return {
        project,
        root,
        text: root ? Array.from(root.querySelectorAll<HTMLElement>("[data-scene-text]")) : [],
        media: root?.querySelector<HTMLElement>("[data-scene-media]") ?? null,
        accent: root?.querySelector<HTMLElement>("[data-scene-accent]") ?? null,
      };
    });
    const fills = Array.from(stage.querySelectorAll<HTMLElement>("[data-rail-fill]"));
    const topChrome = stage.querySelector<HTMLElement>('[data-stage-chrome="top"]');
    const bottomChrome = stage.querySelector<HTMLElement>('[data-stage-chrome="bottom"]');
    const retone = (el: HTMLElement | null, index: number) => {
      if (!el) return;
      const dark = projects[index].stageBackground === "dark";
      el.classList.toggle("scene-dark", dark);
      el.classList.toggle("scene-light", !dark);
    };
    let lastCurrent = -1;
    let lastTop = -1;
    let lastBottom = -1;
    let lastHeader = -1;

    const render = (progress: number) => {
      const sceneP = progress * SCENE_SPAN;
      scenes.forEach((scene, i) => {
        if (!scene.root) return;
        const styles = sceneStyles(scene.project, sceneFrame(i, COUNT, sceneP, still));
        Object.assign(scene.root.style, styles.wrap);
        scene.root.setAttribute("aria-hidden", String(styles.hidden));
        scene.text.forEach((el, t) => Object.assign(el.style, styles.text[t] ?? {}));
        if (scene.media) Object.assign(scene.media.style, styles.media);
        if (scene.accent) Object.assign(scene.accent.style, styles.accent);
      });
      fills.forEach((fill, i) => {
        const [a, b] = segment(i);
        fill.style.transform = `scaleX(${clamp((sceneP - a) / (b - a)).toFixed(4)})`;
      });

      // `current` (counter, aria-current, rail label) hands over at the
      // wipe midpoint. Stage chrome tone follows the wipe edge: for a
      // vertical wipe the bottom rail re-tones as soon as the edge passes
      // it, the top chrome once the edge reaches the top. The shared
      // header keeps its original lead (headerIndexPinned).
      let next = 0;
      let topTone = 0;
      let bottomTone = 0;
      const headerIndex = headerIndexPinned(sceneP);
      for (let i = 1; i < COUNT; i += 1) {
        const enter = sceneFrame(i, COUNT, sceneP, still).enter;
        const horizontal = projects[i].id === "03";
        if (sceneP >= handoverPoint(i)) next = i;
        if (enter >= (horizontal ? 0.5 : 0.92)) topTone = i;
        if (enter >= (horizontal ? 0.5 : 0.08)) bottomTone = i;
      }
      if (next !== lastCurrent) {
        lastCurrent = next;
        setCurrent(next);
      }
      if (topTone !== lastTop) {
        lastTop = topTone;
        retone(topChrome, topTone);
      }
      if (headerIndex !== lastHeader) {
        lastHeader = headerIndex;
        setHeaderTone(projects[headerIndex].stageBackground);
      }
      if (bottomTone !== lastBottom) {
        lastBottom = bottomTone;
        retone(bottomChrome, bottomTone);
      }
    };

    const trigger = ScrollTrigger.create({
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => render(self.progress),
      onRefresh: (self) => render(self.progress),
    });
    render(trigger.progress);

    return () => trigger.kill();
  }, [stacked, still]);

  const goTo = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const distance = track.offsetHeight - window.innerHeight;
    const sceneP = index === 0 ? 0 : index + 0.1;
    const top = track.getBoundingClientRect().top + window.scrollY + (sceneP / SCENE_SPAN) * distance;
    const lenis = getLenisInstance();
    if (lenis) lenis.scrollTo(top, { duration: 0.9 });
    else window.scrollTo({ top, behavior: still ? "auto" : "smooth" });
  };

  const label = locale === "zh" ? "Selected Work 作品簡報" : "Selected Work presentation";

  if (stacked) {
    return (
      <section id="selected-work" aria-label={label}>
        <div ref={trackRef}>
          <div className="site-frame scene-dark border-b scene-rule pb-3 pt-16">
            <p className="type-v3-label scene-text">SELECTED WORK</p>
          </div>
          {projects.map((project, i) => (
            <ProjectScene key={project.id} project={project} locale={locale} index={i} count={COUNT} stacked />
          ))}
        </div>
      </section>
    );
  }

  // Chrome tone classes are owned by the scroll handler after mount; the
  // markup only carries the first project's tone.
  const tone = projects[0].stageBackground === "dark" ? "scene-dark" : "scene-light";

  return (
    <section id="selected-work" aria-label={label}>
      <div ref={trackRef} data-lang-track style={{ height: `${TRACK_HEIGHT_VH}vh` }}>
        <div ref={stageRef} className="sticky top-0 h-[100svh] overflow-hidden bg-[var(--ink)]">
          {projects.map((project, i) => (
            <ProjectScene key={project.id} project={project} locale={locale} index={i} count={COUNT} />
          ))}

          {/* stage chrome — re-toned imperatively at each handover */}
          <div
            data-stage-chrome="top"
            className={`work-stage-chrome pointer-events-none absolute inset-x-0 top-0 z-20 bg-transparent px-5 pt-20 md:px-10 md:pt-24 ${tone}`}
          >
            <div className="flex items-center justify-between border-b scene-rule pb-3">
              <p className="type-v3-label scene-text">SELECTED WORK</p>
              <div className="h-[1.1rem] overflow-hidden type-v3-label scene-dim-text" aria-label={`${projects[current].number} / ${lastNumber}`}>
                <div className="work-stage-counter" style={{ transform: `translateY(-${current * 1.1}rem)` }}>
                  {projects.map((project) => (
                    <span key={project.id} className="block h-[1.1rem]">
                      {project.number} / {lastNumber}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <nav
            data-stage-chrome="bottom"
            aria-label={locale === "zh" ? "作品進度" : "Work progress"}
            className={`work-stage-chrome absolute inset-x-0 bottom-0 z-20 bg-transparent px-5 pb-6 md:px-10 md:pb-8 ${tone}`}
          >
            <ol className="flex items-end gap-2 md:gap-4">
              {projects.map((project, i) => {
                const isActive = i === current;
                return (
                  <li key={project.id} className="flex-1">
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      aria-current={isActive ? "step" : undefined}
                      className="work-rail-item group block w-full py-2 text-left"
                    >
                      <span className="relative block h-px w-full scene-rule border-t">
                        <span
                          data-rail-fill
                          className="absolute -top-px left-0 block h-[2px] w-full origin-left bg-current"
                          style={{ transform: "scaleX(0)" }}
                        />
                      </span>
                      <span className={`work-rail-label type-v3-label mt-2 block ${isActive ? "scene-text" : "scene-dim-text"}`} data-active={isActive}>
                        {project.number}
                        <span className="ml-2 hidden md:inline">{project.railLabel[locale]}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      </div>
    </section>
  );
}
