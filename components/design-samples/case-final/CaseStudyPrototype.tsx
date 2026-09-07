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
const CHAPTER_COUNT = 5;
const CHAPTERS: Chapter[] = Array.from({ length: CHAPTER_COUNT }, (_, i) => ({
  number: String(i + 1).padStart(2, "0"),
}));

/**
 * One shared architecture, two theme configurations (per composition-
 * patterns guidance): `theme` sets a single data-attribute on the
 * outer .case-final wrapper; every sub-component below stays theme-
 * agnostic and reads color from the CSS custom properties that
 * attribute switches (see .case-final rules in globals.css). No
 * component here branches on `theme` in JS. SiteHeader's own `variant`
 * prop is set from the same `theme` value, so the header register
 * always matches the case it's on top of.
 *
 * Round 3: the content container now matches the header's own
 * (max-w-[1520px] px-6/10/14) so the grid genuinely aligns with the nav
 * above it, instead of two slightly different containers. The chapter
 * register is numerals-only (see ChapterRegister.tsx) — the descriptive
 * label lives with its section's own content, not duplicated in the nav.
 *
 * A per-project theme mapping for the eventual production system
 * (case01/03 dark, case02/04 light) exists in caseTheme.ts — not wired
 * in here yet; these prototype routes still pass theme explicitly so
 * both registers can be reviewed against the same real content.
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
  const { active, registerChapter } = useActiveChapter(CHAPTER_COUNT);
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
  const nextDescription = nextProject.description.join("");

  return (
    <div className="min-h-screen">
      <SiteHeader
        locale="zh"
        page="case"
        variant={theme}
        caseContext={{ number: project.number, category: project.category.zh }}
      />

      <main className="case-final" data-theme={theme}>
        {/* Opening — sized to its content (no forced min-height). */}
        <div ref={openingRef} className="mx-auto max-w-[1520px] px-6 pb-16 pt-16 md:px-10 md:pb-24 md:pt-24 lg:px-14">
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

        <div className="mx-auto max-w-[1520px] px-6 md:px-10 lg:px-14">
          <div className="md:grid md:grid-cols-[3rem_minmax(0,1fr)] md:gap-8 lg:grid-cols-[3.5rem_minmax(0,1fr)] lg:gap-12">
            <ChapterRegister chapters={CHAPTERS} active={active} sectionRefs={chapterSectionRefs} />

            {/* Main column: section meta + content + media all belong to
                this one composed system (Round 3 grid principle) — the
                chapter rail is the only other zone. */}
            <div>
              {/* Chapter 01 — Overview */}
              <div
                className="cf-section"
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
                  mediaFullBleed
                />
              </div>

              {/* Chapter 02 — Challenge */}
              <div
                className="cf-section cf-section-divider"
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
                className="cf-section cf-section-divider space-y-20 md:space-y-24"
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
                className="cf-section cf-section-divider"
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
                        mediaFullBleed
                      />
                    );
                  })}
                </div>
              </div>

              <SectionMarquee zh="結果與學習" en="RESULT & LEARNING" direction="rtl" />

              {/* Chapter 05 — Final UI, Outcome, Learnings */}
              <div
                className="cf-section cf-section-divider space-y-20 md:space-y-24"
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
                  mediaFullBleed
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

        {/* Next project — Round 3 rebuild matching the connected Lovable
            Case Study A's actual reference pattern exactly: a modest
            title on one side and a real labeled CTA (reusing the site's
            existing .case-link underline+arrow-travel interaction, not a
            bespoke effect) on the other — not a giant clickable block,
            not an isolated arrow. "返回精選作品" removed entirely, no
            replacement. */}
        <div className="border-t cf-rule px-6 py-20 md:px-10 md:py-28 lg:px-14">
          <div className="mx-auto max-w-[1520px]">
            <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div className="max-w-[46ch]">
                <p className="cf-meta cf-accent">{caseStudy.nextProjectLabel ?? "下一個專案"}</p>
                <h2 className="cf-heading cf-h3 mt-5 text-[clamp(1.75rem,3vw,2.5rem)]">
                  {caseStudy.nextProjectTitle ?? nextProject.title}
                </h2>
                {nextDescription && <p className="cf-dim body-tc mt-4">{nextDescription}</p>}
              </div>
              <CaseTransitionLink
                href={`/work/${nextProject.slug}`}
                className="case-link group inline-flex shrink-0 items-center gap-3 pb-2 label-mono cf-heading"
              >
                {caseStudy.decisionsHeading ? "查看案例" : "View case study"}
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-2">→</span>
              </CaseTransitionLink>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter locale="zh" />
    </div>
  );
}
