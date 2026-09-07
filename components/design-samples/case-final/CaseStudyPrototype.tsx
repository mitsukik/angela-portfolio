"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import type { Project } from "@/data/projects";
import { MixedText } from "@/components/site/MixedText";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { ChapterRegister, type Chapter } from "./ChapterRegister";
import { useActiveChapter } from "./useActiveChapter";
import { ReadingSection } from "./ReadingSection";
import { EvidenceFigure } from "./EvidenceFigure";
import { ShowcaseMedia } from "./ShowcaseMedia";
import { SectionMarquee } from "./SectionMarquee";
import { CaseTransitionLink } from "./CaseTransitionLink";
import { decisionFigures, overviewFigure, showcaseFigure } from "./caseFinalMedia";

const MOTION_QUERY = "(prefers-reduced-motion: no-preference)";

const CHAPTERS: Chapter[] = [
  { number: "01", label: "概述" },
  { number: "02", label: "挑戰" },
  { number: "03", label: "角色與流程" },
  { number: "04", label: "決策" },
  { number: "05", label: "成果" },
];

/**
 * One shared architecture, two theme configurations (per composition-
 * patterns guidance): `theme` sets a single data-attribute on the
 * outer .case-final wrapper; every sub-component below stays theme-
 * agnostic and reads color from the CSS custom properties that
 * attribute switches (see .case-final rules in globals.css). No
 * component here branches on `theme` in JS.
 */
export function CaseStudyPrototype({
  theme,
  project,
  nextProject,
}: {
  theme: "dark" | "light";
  project: Project;
  nextProject: Project;
}) {
  const { caseStudy } = project;
  const displayTitle = caseStudy.displayTitle ?? project.title;
  const openingRef = useRef<HTMLDivElement | null>(null);
  const { active, registerChapter } = useActiveChapter(CHAPTERS.length);
  const chapterSectionRefs = useRef<Array<HTMLElement | null>>([]);

  useLayoutEffect(() => {
    const opening = openingRef.current;
    if (!opening) return;
    const mm = gsap.matchMedia();
    const context = gsap.context(() => {
      mm.add(MOTION_QUERY, () => {
        const eyebrow = opening.querySelector<HTMLElement>("[data-open-eyebrow]");
        const title = opening.querySelector<HTMLElement>("[data-open-title]");
        const summary = opening.querySelector<HTMLElement>("[data-open-summary]");
        const stats = opening.querySelector<HTMLElement>("[data-open-stats]");
        const targets = [eyebrow, title, summary, stats].filter((el): el is HTMLElement => Boolean(el));
        if (!targets.length) return;
        gsap.set(targets, { autoAlpha: 0, y: 18 });
        const timeline = gsap.timeline({ defaults: { ease: "power2.out" } });
        targets.forEach((el, i) => {
          timeline.to(el, { autoAlpha: 1, y: 0, duration: 0.5 }, i === 0 ? 0 : "-=0.28");
        });
        return () => {
          timeline.kill();
          gsap.set(targets, { clearProps: "opacity,visibility,transform" });
        };
      });
    }, opening);
    return () => {
      mm.revert();
      context.revert();
    };
  }, []);

  const decisions = caseStudy.decisions;

  return (
    <div className="min-h-screen">
      <SiteHeader locale="zh" page="case" />

      <main className="case-final" data-theme={theme}>
        {/* Opening */}
        <div ref={openingRef} className="mx-auto flex min-h-[92svh] max-w-[1600px] flex-col justify-end px-5 pb-16 pt-28 md:px-10 md:pb-20">
          <p data-open-eyebrow className="cf-meta cf-accent">
            {project.number} / {caseStudy.eyebrowTitle ?? displayTitle}
          </p>
          <h1 data-open-title className="cf-heading display-xl mt-5 max-w-[16ch]">
            {displayTitle}
          </h1>
          <p lang="zh-Hant" className="cf-dim mt-4 text-[1.1rem]">
            <MixedText text={caseStudy.projectName ?? project.chineseTitle} />
          </p>
          <p data-open-summary className="cf-body body-tc mt-6 max-w-[58ch]">
            {caseStudy.summary}
          </p>
          <dl data-open-stats className="mt-14 grid grid-cols-2 gap-6 border-t cf-rule pt-6 md:grid-cols-4">
            {Object.entries(caseStudy.metadata).map(([k, v]) => (
              <div key={k}>
                <dt className="cf-meta cf-dim">{k}</dt>
                <dd className="cf-heading mt-1 text-[15px]">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <div className="md:grid md:grid-cols-[3.5rem_minmax(0,1fr)] md:gap-10">
            <ChapterRegister chapters={CHAPTERS} active={active} sectionRefs={chapterSectionRefs} />

            <div className="space-y-24 py-20 md:space-y-32 md:py-28">
              {/* Chapter 01 — Overview */}
              <div
                ref={(el) => {
                  registerChapter(0)(el);
                  chapterSectionRefs.current[0] = el;
                }}
              >
                <ReadingSection
                  label={caseStudy.overview.heading}
                  title={caseStudy.overview.title}
                  paragraphs={caseStudy.overview.body as string[]}
                  supporting={caseStudy.overview.supportingLine}
                  media={<EvidenceFigure figure={overviewFigure} />}
                />
              </div>

              {/* Chapter 02 — Challenge */}
              <div
                ref={(el) => {
                  registerChapter(1)(el);
                  chapterSectionRefs.current[1] = el;
                }}
              >
                <ReadingSection
                  label={caseStudy.challenge.heading}
                  title={caseStudy.challenge.title}
                  paragraphs={caseStudy.challenge.body as string[]}
                  points={caseStudy.challenge.points}
                  supporting={caseStudy.challenge.supportingLine}
                />
              </div>

              <SectionMarquee zh="系統邏輯" en="SYSTEM LOGIC" direction="rtl" />

              {/* Chapter 03 — Role + Workflow */}
              <div
                className="space-y-24 md:space-y-32"
                ref={(el) => {
                  registerChapter(2)(el);
                  chapterSectionRefs.current[2] = el;
                }}
              >
                <ReadingSection
                  label={caseStudy.role.heading}
                  title={caseStudy.role.title}
                  paragraphs={caseStudy.role.body as string[]}
                  points={caseStudy.role.points}
                />
                <ReadingSection
                  label={caseStudy.workflow.heading}
                  title={caseStudy.workflow.title}
                  paragraphs={caseStudy.workflow.body as string[]}
                  supporting={caseStudy.workflow.supportingLine}
                />
              </div>

              <SectionMarquee zh="設計決策" en="DESIGN DECISIONS" direction="ltr" />

              {/* Chapter 04 — Decisions */}
              <div
                ref={(el) => {
                  registerChapter(3)(el);
                  chapterSectionRefs.current[3] = el;
                }}
              >
                <p className="cf-meta cf-dim mb-10">{caseStudy.decisionsHeading ?? "關鍵設計決策"}</p>
                <div className="space-y-20 md:space-y-24">
                  {decisions.map((decision, i) => {
                    const figure = decisionFigures[decision.heading];
                    return (
                      <ReadingSection
                        key={decision.heading}
                        label={`決策 0${i + 1}`}
                        title={decision.heading}
                        paragraphs={(decision.body as string).split("\n\n")}
                        supporting={decision.principle}
                        media={figure ? <EvidenceFigure figure={figure} /> : undefined}
                      />
                    );
                  })}
                </div>
              </div>

              <SectionMarquee zh="結果與學習" en="RESULT & LEARNING" direction="rtl" />

              {/* Chapter 05 — Final UI, Outcome, Learnings */}
              <div
                className="space-y-24 md:space-y-32"
                ref={(el) => {
                  registerChapter(4)(el);
                  chapterSectionRefs.current[4] = el;
                }}
              >
                <ReadingSection
                  label={caseStudy.finalUI.heading}
                  title={caseStudy.finalUI.title}
                  paragraphs={caseStudy.finalUI.body as string[]}
                  points={caseStudy.finalUI.points}
                  media={<ShowcaseMedia figure={showcaseFigure} />}
                />
                <ReadingSection
                  label={caseStudy.outcome.heading}
                  title={caseStudy.outcome.title}
                  paragraphs={(caseStudy.outcome.body as string).split("\n\n")}
                />
                {caseStudy.learnings && (
                  <ReadingSection
                    label={caseStudy.learnings.heading}
                    title={caseStudy.learnings.title}
                    paragraphs={(caseStudy.learnings.body as string).split("\n\n")}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Next project handoff */}
        <div className="border-t cf-rule px-5 py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-[1600px]">
            <p className="cf-meta cf-dim">{caseStudy.nextProjectLabel ?? "下一個專案"}</p>
            <CaseTransitionLink
              href={`/work/${nextProject.slug}`}
              className="cf-heading group mt-6 flex items-center justify-between gap-6 border-b cf-rule py-6 text-[2rem] font-medium tracking-[-0.02em] md:text-[4.5rem]"
            >
              <span>{caseStudy.nextProjectTitle ?? nextProject.title}</span>
              <span aria-hidden className="cf-accent transition-transform group-hover:translate-x-2">→</span>
            </CaseTransitionLink>
            <CaseTransitionLink
              href="/#selected-work"
              className="cf-dim group mt-10 inline-flex items-center gap-2 text-[0.75rem] font-medium uppercase tracking-[0.18em]"
            >
              <span aria-hidden>←</span>
              <span>{caseStudy.backToSelectedWorkLabel ?? "返回精選作品"}</span>
            </CaseTransitionLink>
          </div>
        </div>
      </main>

      <SiteFooter locale="zh" />
    </div>
  );
}
