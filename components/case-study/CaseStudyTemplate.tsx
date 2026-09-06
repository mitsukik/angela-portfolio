"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { MixedText } from "@/components/site/MixedText";
import { ProjectVisual } from "@/components/site/ProjectVisual";
import type { Project, ProjectMedia, ProjectSection } from "@/data/projects";

type SectionVariant = "narrative" | "closing";

// Section-entrance-only reveal (once, never scrubbed) — applied generically
// to every direct <section> child of .case-content-wrap in the effect
// below, so adding a new module here automatically joins the same rhythm
// without per-component wiring. Comprehension never depends on this: the
// gsap.set() that hides sections runs only after JS has confirmed GSAP is
// available, so a JS failure fails open (content stays visible), matching
// the same-effort convention used by useSelectedWorkSequence.ts.
const REVEAL_MOTION_QUERY = "(prefers-reduced-motion: no-preference)";

function getParagraphs(body: ProjectSection["body"]) {
  return Array.isArray(body) ? body : body.split("\n\n");
}

// The yellow section-label heading ("專案概述", "系統流程", "關鍵設計決策"...)
// renders real Chinese content for Complex System but generic English
// placeholder copy ("Project Overview"...) for the other three projects,
// so its treatment must switch with content language rather than being
// hardcoded — uppercase + 0.2em tracking is meaningless (and was
// rendering at 12px, below the 14px minimum for readable Chinese UI
// text) on CJK glyphs; English keeps the original treatment.
function sectionLabelClassName(isZh: boolean) {
  return isZh
    ? "text-[14px] font-medium tracking-[0.05em] text-accent-yellow"
    : "text-[12px] font-medium uppercase tracking-[0.2em] text-accent-yellow";
}

function parseFlowStages(supportingLine?: string) {
  if (!supportingLine || !supportingLine.includes("→")) return null;
  const stages = supportingLine
    .split("→")
    .map((stage) => stage.trim())
    .filter(Boolean);
  return stages.length > 1 ? stages : null;
}

function PointChips({ points }: { points: string[] }) {
  return (
    <ul className="mt-8 grid gap-3 border-t border-primary/12 pt-6 sm:grid-cols-2">
      {points.map((point) => (
        <li key={point}>
          <div tabIndex={0} className="case-point-chip text-[15px] leading-6">
            <span>{point}</span>
            <span aria-hidden="true" className="case-point-chip-marker">
              →
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

function FlowDiagram({ stages }: { stages: string[] }) {
  return (
    <div className="flow-diagram mt-10 border-t border-primary/12 pt-8">
      {stages.map((stage, index) => (
        <div key={stage} className="flow-diagram-item flex items-center">
          <span className="flow-diagram-stage">{stage}</span>
          {index < stages.length - 1 && (
            <span aria-hidden="true" className="flow-diagram-arrow">
              →
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function ContentSection({
  section,
  id,
  desktopSpacing,
  variant = "narrative",
  className = "",
  useStepTypography = false,
}: {
  section: ProjectSection;
  id: string;
  desktopSpacing: "lg:py-24" | "lg:py-28";
  variant?: SectionVariant;
  className?: string;
  useStepTypography?: boolean;
}) {
  const isClosing = variant === "closing";

  return (
    <section
      aria-labelledby={`${id}-heading`}
      className={`border-t border-primary/12 py-16 sm:py-20 lg:grid lg:grid-cols-[minmax(0,38fr)_minmax(0,62fr)] lg:gap-10 ${desktopSpacing} ${className}`}
    >
      <h2
        id={`${id}-heading`}
        lang={useStepTypography ? "zh-Hant" : undefined}
        className={sectionLabelClassName(useStepTypography)}
      >
        {section.heading}
      </h2>
      <div className={`mt-8 lg:mt-0 ${isClosing ? "max-w-[680px]" : "max-w-[760px]"}`}>
        {section.title && (
          <h3
            lang={useStepTypography ? "zh-Hant" : undefined}
            className={useStepTypography ? "type-step-title text-primary" : "text-[1.35rem] leading-[1.45] tracking-[-0.01em] text-primary sm:text-[1.6rem] lg:text-[1.6rem]"}
          >
            {section.title}
          </h3>
        )}
        <div className={`space-y-6 ${section.title ? "mt-6" : ""}`}>
          {getParagraphs(section.body).map((paragraph) => (
            <p
              key={paragraph}
              lang={useStepTypography ? "zh-Hant" : undefined}
              className={`${useStepTypography ? "type-step-body" : "text-[1.35rem] leading-[1.45] tracking-[-0.01em] sm:text-[1.6rem] lg:text-[1.6rem]"} ${isClosing ? "text-primary/90" : "text-primary/78"}`}
            >
              {paragraph}
            </p>
          ))}
        </div>
        {section.supportingLine && (
          <p className="mt-8 border-t border-primary/12 pt-6 text-[15px] leading-7 tracking-[0.08em] text-primary/60">
            {section.supportingLine}
          </p>
        )}
        {section.points && <PointChips points={section.points} />}
      </div>
    </section>
  );
}

function VisualStage({ media }: { media: ProjectMedia[] }) {
  return (
    <div className="mt-12 space-y-6 sm:mt-14 lg:mt-16 lg:space-y-10">
      {media.map((item, index) => (
        <div
          key={`${item.src}-${index}`}
          className="relative aspect-[4/3] overflow-hidden border border-primary/12 bg-surface sm:aspect-video"
        >
          <Image
            src={item.src}
            alt={item.alt}
            fill
            className="object-cover"
            sizes="(max-width: 1600px) 100vw, 1600px"
          />
        </div>
      ))}
    </div>
  );
}

function WorkflowSection({
  section,
  id,
  useDecisionTypography = false,
}: {
  section: ProjectSection;
  id: string;
  useDecisionTypography?: boolean;
}) {
  const flowStages = parseFlowStages(section.supportingLine);

  return (
    <section
      aria-labelledby={`${id}-heading`}
      className="border-t border-primary/12 py-16 sm:py-20 lg:py-28"
    >
      <div className="lg:grid lg:grid-cols-[minmax(0,38fr)_minmax(0,62fr)] lg:gap-10">
        <h2
          id={`${id}-heading`}
          lang={useDecisionTypography ? "zh-Hant" : undefined}
          className={sectionLabelClassName(useDecisionTypography)}
        >
          {section.heading}
        </h2>
        <div className="mt-8 max-w-[760px] lg:mt-0">
          {section.title && (
            <h3
              lang={useDecisionTypography ? "zh-Hant" : undefined}
              className={useDecisionTypography ? "type-step-title mt-4 md:mt-0" : "text-[1.35rem] leading-[1.45] tracking-[-0.01em] text-primary sm:text-[1.6rem] lg:text-[1.6rem]"}
            >
              {section.title}
            </h3>
          )}
          <div className={`${useDecisionTypography ? "space-y-0" : "space-y-6"} ${section.title ? "mt-6" : ""}`}>
            {useDecisionTypography ? (
              <p lang="zh-Hant" className="type-step-body mt-4 text-primary/58">
                {getParagraphs(section.body).map((paragraph) => (
                  <span key={paragraph} className="mb-4 block last:mb-0">{paragraph}</span>
                ))}
              </p>
            ) : (
              getParagraphs(section.body).map((paragraph) => (
                <p key={paragraph} className="text-[1.35rem] leading-[1.45] tracking-[-0.01em] text-primary/78 sm:text-[1.6rem] lg:text-[1.6rem]">
                  {paragraph}
                </p>
              ))
            )}
          </div>
          {!flowStages && section.supportingLine && (
            <p className="mt-8 border-t border-primary/12 pt-6 text-[15px] leading-7 tracking-[0.08em] text-primary/60">
              {section.supportingLine}
            </p>
          )}
        </div>
      </div>
      {flowStages ? (
        <FlowDiagram stages={flowStages} />
      ) : (
        section.media?.length ? <VisualStage media={section.media} /> : null
      )}
    </section>
  );
}

function BreathingSpace({ id, statement }: { id: string; statement: string }) {
  return (
    <section
      aria-labelledby={`${id}-heading`}
      className="case-breathing-space border-t border-primary/12"
    >
      <h2 id={`${id}-heading`} className="sr-only">
        Framing question
      </h2>
      <p>{statement}</p>
    </section>
  );
}

export function CaseStudyTemplate({
  project,
  nextProject,
}: {
  project: Project;
  nextProject: Project;
}) {
  const { caseStudy } = project;
  const displayTitle = caseStudy.displayTitle ?? project.title;
  const isComplexSystem = project.slug === "complex-system";
  const contentWrapRef = useRef<HTMLDivElement | null>(null);

  const breathingStatement = caseStudy.challenge.supportingLine;

  useLayoutEffect(() => {
    const wrap = contentWrapRef.current;
    if (!wrap) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add(REVEAL_MOTION_QUERY, () => {
        const sections = gsap.utils.toArray<HTMLElement>(":scope > section", wrap);
        const allAnimatedEls: HTMLElement[] = [];

        // Label -> body choreography rather than one identical fade for
        // everything: a section's direct-child <h2> (the yellow eyebrow
        // label) gets its own quick, minimal-travel lead-in; the rest of
        // the section's direct children follow as a group. Sections whose
        // heading isn't a direct child (WorkflowSection, Final UI — both
        // nest it one level deeper for their grid layout) simply fall
        // back to one group for everything, which is still correct, just
        // without the extra label emphasis.
        const triggers = sections.map((section) => {
          const children = Array.from(section.children) as HTMLElement[];
          const label = children.find((el) => el.tagName === "H2") ?? null;
          const rest = children.filter((el) => el !== label);

          gsap.set(rest, { autoAlpha: 0, y: 22 });
          if (label) gsap.set(label, { autoAlpha: 0, x: -10 });
          allAnimatedEls.push(...rest, ...(label ? [label] : []));

          return ScrollTrigger.create({
            trigger: section,
            start: "top 85%",
            once: true,
            onEnter: () => {
              const timeline = gsap.timeline();
              if (label) {
                timeline.to(label, {
                  autoAlpha: 1,
                  x: 0,
                  duration: 0.3,
                  ease: "power2.out",
                });
              }
              timeline.to(
                rest,
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.6,
                  stagger: 0.04,
                  ease: "power2.out",
                },
                label ? "-=0.12" : 0,
              );
            },
          });
        });

        // Flow diagram: stages resolve left-to-right in sequence as their
        // section enters, rather than appearing all at once — quick
        // (~1s total for an 11-stage diagram), and everything stays
        // visible afterward.
        const flowDiagram = wrap.querySelector<HTMLElement>(".flow-diagram");
        let flowTrigger: ScrollTrigger | undefined;
        const flowItems = flowDiagram
          ? Array.from(
              flowDiagram.querySelectorAll<HTMLElement>(
                ".flow-diagram-stage, .flow-diagram-arrow",
              ),
            )
          : [];

        if (flowDiagram && flowItems.length) {
          gsap.set(flowItems, { autoAlpha: 0, x: -6 });
          allAnimatedEls.push(...flowItems);
          flowTrigger = ScrollTrigger.create({
            trigger: flowDiagram,
            start: "top 88%",
            once: true,
            onEnter: () =>
              gsap.to(flowItems, {
                autoAlpha: 1,
                x: 0,
                duration: 0.32,
                stagger: 0.08,
                ease: "power1.out",
              }),
          });
        }

        return () => {
          triggers.forEach((trigger) => trigger.kill());
          flowTrigger?.kill();
          gsap.set(allAnimatedEls, { clearProps: "opacity,visibility,transform" });
        };
      });
    }, wrap);

    return () => {
      media.revert();
      context.revert();
    };
    // Re-key on project.slug: React reuses this same component instance
    // across /work/[slug] navigations (same route, different params), so
    // an empty dependency array here would only ever run once for the
    // FIRST project visited — every subsequent project's sections would
    // stay permanently hidden, since no new ScrollTrigger is ever created
    // for their actual DOM nodes. Confirmed via a real browser repro:
    // navigating complex-system -> corporate-website left 6 of 7 sections
    // stuck at opacity 0 with the old []  dependency.
  }, [project.slug]);

  return (
    <div className="min-h-screen bg-background text-primary">
      <a href="#case-content" className="skip-link">
        Skip to main content
      </a>

      <header className="border-b border-primary/12">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 sm:px-8 lg:px-10 lg:py-7">
          <Link
            href="/"
            className="link-nav text-[12px] font-bold uppercase tracking-[0.18em]"
          >
            Angela Yu
          </Link>
          <Link
            href="/#selected-work"
            className="link-nav inline-flex min-h-11 items-center text-[12px] uppercase tracking-[0.18em] text-primary/70"
          >
            Back to Work
          </Link>
        </div>
      </header>

      <main id="case-content" tabIndex={-1}>
        <article>
          <header className="relative mx-auto max-w-[1600px] px-6 pb-16 pt-16 sm:px-8 sm:pb-20 sm:pt-24 lg:px-10 lg:pb-28 lg:pt-32">
            {/* AmbientField disabled per Angela's review — see AboutHero.tsx
                for the same note. */}
            <div className="flex items-center gap-3 text-[13px] uppercase tracking-[0.18em] text-primary/60">
              <span className="text-accent-yellow">{project.number}</span>
              <span aria-hidden="true" className="text-primary/30">/</span>
              <span>{caseStudy.eyebrowTitle ?? displayTitle}</span>
            </div>

            <div className="mt-10 lg:grid lg:grid-cols-[minmax(0,62fr)_minmax(260px,38fr)] lg:gap-10">
              <div>
                <h1 className="max-w-[1050px] text-balance text-[3rem] font-medium leading-[0.98] tracking-[-0.035em] sm:text-[5rem] lg:text-[5.5rem] xl:text-[7rem]">
                  {displayTitle}
                </h1>
                <p lang="zh-Hant" className="mt-5 text-[1.2rem] tracking-[0.08em] text-accent-lavender sm:text-[1.45rem]">
                  <MixedText text={caseStudy.projectName ?? project.chineseTitle} />
                </p>
              </div>

              <p className="mt-10 max-w-[34rem] text-[18px] leading-8 text-primary/68 lg:mt-2">
                {caseStudy.summary}
              </p>
            </div>

            <dl className="mt-14 grid grid-cols-1 gap-6 border-t border-primary/12 pt-6 md:grid-cols-3 lg:mt-20">
              {Object.entries(caseStudy.metadata).map(([label, value]) => (
                <div key={label}>
                  <dt
                    lang={isComplexSystem ? "zh-Hant" : undefined}
                    className={
                      isComplexSystem
                        ? "text-[14px] tracking-[0.03em] text-primary/45"
                        : "text-[11px] uppercase tracking-[0.2em] text-primary/45"
                    }
                  >
                    {label}
                  </dt>
                  <dd className="mt-2 text-[15px] text-primary/85">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="relative mt-14 aspect-[4/3] overflow-hidden border border-primary/12 bg-surface sm:aspect-video lg:mt-20">
              <ProjectVisual project={project} priority depthOnHover className="absolute inset-0" />
            </div>
          </header>

          <div ref={contentWrapRef} className="case-content-wrap mx-auto max-w-[1600px] px-6 sm:px-8 lg:px-10">
            <ContentSection section={caseStudy.overview} id="overview" desktopSpacing="lg:py-28" useStepTypography={isComplexSystem} />
            <ContentSection section={caseStudy.challenge} id="challenge" desktopSpacing="lg:py-28" useStepTypography={isComplexSystem} />
            <ContentSection section={caseStudy.role} id="role" desktopSpacing="lg:py-24" useStepTypography={isComplexSystem} />
            <WorkflowSection section={caseStudy.workflow} id="workflow" useDecisionTypography={isComplexSystem} />

            {breathingStatement && (
              <BreathingSpace id="framing" statement={breathingStatement} />
            )}

            <section
              aria-labelledby="decisions-heading"
              className="border-t border-primary/12 py-16 sm:py-20 lg:grid lg:grid-cols-[minmax(0,38fr)_minmax(0,62fr)] lg:gap-10 lg:py-28"
            >
              <h2
                id="decisions-heading"
                lang={isComplexSystem ? "zh-Hant" : undefined}
                className={sectionLabelClassName(isComplexSystem)}
              >
                {caseStudy.decisionsHeading ?? "Key Design Decisions"}
              </h2>
              <div className="mt-8 space-y-12 lg:mt-0">
                {caseStudy.decisions.map((decision, index) => (
                  <div key={decision.heading} className="max-w-[760px] border-t border-primary/12 pt-6 first:border-0 first:pt-0 md:grid md:grid-cols-[4rem_minmax(0,1fr)] md:gap-6">
                    <p
                      lang={isComplexSystem ? "zh-Hant" : undefined}
                      className={isComplexSystem ? "type-step-number text-accent-lavender" : "text-[15px] tracking-[0.18em] text-accent-lavender"}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <div>
                      <h3
                        lang={isComplexSystem ? "zh-Hant" : undefined}
                        className={isComplexSystem ? "type-step-title mt-4 md:mt-0" : "mt-4 text-[1.6rem] font-medium tracking-[-0.02em] sm:text-[2rem] md:mt-0"}
                      >
                        {decision.heading}
                      </h3>
                      <p
                        lang={isComplexSystem ? "zh-Hant" : undefined}
                        className={isComplexSystem ? "type-step-body mt-4 text-primary/58" : "mt-4 text-[16px] leading-7 text-primary/60"}
                      >
                        {getParagraphs(decision.body).map((paragraph) => (
                          <span key={paragraph} className="mb-4 block last:mb-0">{paragraph}</span>
                        ))}
                      </p>
                      {decision.principle && (
                        <p className="case-pull-quote mt-8">{decision.principle}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section
              aria-labelledby="final-ui-heading"
              className="border-t border-primary/12 py-16 sm:py-20 lg:py-28"
            >
              <div className="lg:grid lg:grid-cols-[minmax(0,38fr)_minmax(0,62fr)] lg:gap-10">
                <h2
                  id="final-ui-heading"
                  lang={isComplexSystem ? "zh-Hant" : undefined}
                  className={sectionLabelClassName(isComplexSystem)}
                >
                  {caseStudy.finalUI.heading}
                </h2>
                <div className="mt-8 max-w-[760px] lg:mt-0">
                  {caseStudy.finalUI.title && (
                    <h3
                      lang={isComplexSystem ? "zh-Hant" : undefined}
                      className={isComplexSystem ? "type-step-title mt-4 md:mt-0" : "text-[1.35rem] leading-[1.45] tracking-[-0.01em] text-primary sm:text-[1.6rem] lg:text-[1.6rem]"}
                    >
                      {caseStudy.finalUI.title}
                    </h3>
                  )}
                  <div className={`space-y-6 ${caseStudy.finalUI.title ? "mt-6" : ""}`}>
                    {getParagraphs(caseStudy.finalUI.body).map((paragraph) => (
                      <p
                        key={paragraph}
                        lang={isComplexSystem ? "zh-Hant" : undefined}
                        className={isComplexSystem ? "type-step-body text-primary/78" : "text-[1.35rem] leading-[1.45] tracking-[-0.01em] text-primary/78 sm:text-[1.6rem] lg:text-[1.6rem]"}
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  {caseStudy.finalUI.points && <PointChips points={caseStudy.finalUI.points} />}
                </div>
              </div>

              <div className="case-takeover relative mt-14 aspect-[16/10] overflow-hidden sm:mt-16 sm:aspect-[21/9] lg:mt-20">
                <ProjectVisual project={project} showTempTag className="absolute inset-0" />
              </div>
            </section>

            <ContentSection
              section={caseStudy.outcome}
              id="outcome"
              desktopSpacing="lg:py-24"
              variant="closing"
              className="mb-8 lg:mb-12"
              useStepTypography={isComplexSystem}
            />
            {caseStudy.learnings && (
              <ContentSection
                section={caseStudy.learnings}
                id="learnings"
                desktopSpacing="lg:py-24"
                variant="closing"
                className="mb-8 lg:mb-12"
                useStepTypography={isComplexSystem}
              />
            )}
          </div>

          <nav aria-label="Case study navigation" className="border-t border-primary/12">
            <div className="mx-auto max-w-[1600px] px-6 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-28">
              <p
                lang={isComplexSystem ? "zh-Hant" : undefined}
                className={
                  isComplexSystem
                    ? "text-[14px] tracking-[0.03em] text-primary/45"
                    : "text-[11px] uppercase tracking-[0.2em] text-primary/45"
                }
              >
                {caseStudy.nextProjectLabel ?? "Next Project"}
              </p>
              <Link
                href={`/work/${nextProject.slug}`}
                className="link-cta media-hover-frame group/next relative mt-5 flex min-h-11 items-center justify-between gap-6 overflow-hidden px-2 -mx-2 text-[2rem] font-medium tracking-[-0.025em] sm:text-[3.5rem] lg:text-[5rem]"
              >
                <ProjectVisual
                  project={nextProject}
                  className="media-hover-target absolute inset-0 -z-10 opacity-0 motion-safe:transition-opacity motion-safe:duration-700 motion-safe:ease-editorial group-hover/next:opacity-70 group-focus-visible/next:opacity-70"
                />
                <span className="link-cta-label relative">
                  {caseStudy.nextProjectTitle ?? nextProject.title}
                </span>
                <span aria-hidden="true" className="link-cta-marker-right relative text-accent-yellow">→</span>
              </Link>
              <Link
                href="/#selected-work"
                lang={isComplexSystem ? "zh-Hant" : undefined}
                className={
                  isComplexSystem
                    ? "link-nav mt-14 inline-flex min-h-11 items-center gap-2 text-[14px] tracking-[0.03em] text-primary/70"
                    : "link-nav mt-14 inline-flex min-h-11 items-center gap-2 text-[12px] uppercase tracking-[0.18em] text-primary/70"
                }
              >
                <span aria-hidden="true">←</span>
                <span>{caseStudy.backToSelectedWorkLabel ?? "Back to Selected Work"}</span>
              </Link>
            </div>
          </nav>
        </article>
      </main>
    </div>
  );
}
