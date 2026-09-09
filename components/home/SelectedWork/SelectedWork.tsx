"use client";

import { useRef } from "react";
import type { Locale } from "@/data/locale";
import { projects } from "@/data/projects";
import { clamp, useMedia } from "./motion";
import { useWorkStageProgress } from "./useWorkStageProgress";
import { ProjectScene } from "./ProjectScene";

// Scene units across the track — 4 projects + a 0.35 tail so the last
// project gets a readable hold window before the pin releases. Ported
// from the connected Lovable "VER B" project's WorkStage.tsx.
const SPAN = 4.35;

export function SelectedWork({ locale }: { locale: Locale }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const p = useWorkStageProgress(trackRef);
  const still = useMedia("(prefers-reduced-motion: reduce)");
  const compact = useMedia("(max-width: 767px)");

  const sceneP = p * SPAN;
  const current = clamp(Math.floor(sceneP + 0.25), 0, projects.length - 1);
  const active = projects[current];
  const stageTone = active.stageBackground;

  const goTo = (index: number) => {
    const el = trackRef.current;
    if (!el) return;
    const distance = el.offsetHeight - window.innerHeight;
    const top = el.offsetTop + ((index + 0.35) / SPAN) * distance;
    window.scrollTo({ top, behavior: still ? "auto" : "smooth" });
  };

  return (
    <section id="selected-work" aria-label={locale === "zh" ? "Selected Work 作品簡報" : "Selected Work presentation"}>
      <div
        ref={trackRef}
        style={{ height: compact ? `${projects.length * 100 + 40}svh` : `${projects.length * 130 + 55}vh` }}
      >
        <div className={`sticky top-0 h-[100svh] overflow-hidden ${stageTone === "dark" ? "scene-dark" : "scene-light"}`}>
          {projects.map((project, i) => {
            const isLast = i === projects.length - 1;
            return (
              <ProjectScene
                key={project.id}
                project={project}
                locale={locale}
                f={sceneP - i}
                still={still}
                compact={compact}
                // Root cause of the "dead scroll" gap: every project shares
                // the same exit animation, but the track's own 0.35-scene-
                // unit tail (see SPAN above) gives the last project extra
                // scroll after that exit would normally finish — so it was
                // fully faded/clipped away well before the pin actually
                // released, leaving bare background for the remainder. Only
                // the last project skips its exit entirely and holds at its
                // settled resting state through the tail (see ProjectScene).
                holdExit={isLast}
              />
            );
          })}

          {/* stage chrome */}
          <div
            className={`pointer-events-none absolute inset-x-0 top-0 z-20 px-5 pt-20 md:px-10 md:pt-24 ${
              stageTone === "dark" ? "scene-dark" : "scene-light"
            } bg-transparent`}
          >
            <div className="flex items-center justify-between border-b scene-rule pb-3">
              {/* Round 14: always "SELECTED WORK" in both locales, per
                  Angela's explicit correction — no longer 精選作品 on zh. */}
              <p className="type-v3-label scene-text">SELECTED WORK</p>
              <div className="h-[1.1rem] overflow-hidden type-v3-label scene-dim-text" aria-label={`${active.number} / 04`}>
                <div className="transition-transform duration-500" style={{ transform: `translateY(-${current * 1.1}rem)` }}>
                  {projects.map((project) => (
                    <span key={project.id} className="block h-[1.1rem]">
                      {project.number} / 0{projects.length}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <nav
            aria-label={locale === "zh" ? "作品進度" : "Work progress"}
            className={`absolute inset-x-0 bottom-0 z-20 px-5 pb-6 md:px-10 md:pb-8 ${
              stageTone === "dark" ? "scene-dark" : "scene-light"
            } bg-transparent`}
          >
            <ol className="flex items-end gap-2 md:gap-4">
              {projects.map((project, i) => {
                const local = clamp(sceneP - i);
                const isActive = i === current;
                return (
                  <li key={project.id} className="flex-1">
                    <button type="button" onClick={() => goTo(i)} aria-current={isActive ? "step" : undefined} className="group block w-full text-left">
                      <span className="relative block h-px w-full scene-rule border-t">
                        <span className="absolute inset-y-0 left-0 -top-px block h-[2px] bg-current transition-none" style={{ width: `${local * 100}%` }} />
                      </span>
                      <span className={`type-v3-label mt-2 block transition-opacity ${isActive ? "scene-text" : "scene-dim-text opacity-60 group-hover:opacity-100"}`}>
                        {project.number}
                        <span className="ml-2 hidden md:inline">{project.title}</span>
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
