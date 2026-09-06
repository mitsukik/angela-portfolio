import Link from "next/link";
import type { Project } from "@/data/projects";
import { ProjectVisual } from "@/components/site/ProjectVisual";
import { MixedText } from "@/components/site/MixedText";
import { Reveal } from "./Reveal";

function paragraphs(body: string | string[]) {
  return Array.isArray(body) ? body : body.split("\n\n");
}

function flowStages(supportingLine?: string) {
  if (!supportingLine?.includes("→")) return null;
  const stages = supportingLine.split("→").map((s) => s.trim()).filter(Boolean);
  return stages.length > 1 ? stages : null;
}

/**
 * CASE B — Presentation / system.
 *
 * Case Study as a sequence of discrete full-viewport scenes (echoing
 * Selected Work's own scene grammar, but each fires once on scroll-in
 * rather than a continuous pin/scrub, since this is long-form reading
 * content) with a large centered flow-diagram as the System scene's
 * visual anchor, and metadata presented as a stat grid up front. Uses
 * the real Complex System data only.
 */
export function CaseB({ project, nextProject }: { project: Project; nextProject: Project }) {
  const { caseStudy } = project;
  const displayTitle = caseStudy.displayTitle ?? project.title;
  const stages = flowStages(caseStudy.workflow.supportingLine);
  const metadataEntries = Object.entries(caseStudy.metadata);

  return (
    <main className="min-h-screen">
      {/* Cover scene — index watermark + title + stat grid */}
      <section className="scene-dark relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-5 py-24 md:px-10">
        <span aria-hidden className="pointer-events-none absolute -right-[4vw] top-1/2 -translate-y-1/2 text-[42vw] font-bold leading-none text-paper/[0.04] select-none">
          {project.number}
        </span>
        <div className="relative mx-auto w-full max-w-[1600px]">
          <Reveal className="label-mono scene-dim-text">{caseStudy.eyebrowTitle ?? displayTitle}</Reveal>
          <Reveal delay={0.08}>
            <h1 className="display-xl mt-5 max-w-[16ch]">{displayTitle}</h1>
            <p lang="zh-Hant" className="body-tc mt-6 max-w-[52ch] text-lavender">
              <MixedText text={caseStudy.projectName ?? project.chineseTitle} />
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t scene-rule pt-8 md:grid-cols-4">
              {metadataEntries.map(([k, v]) => (
                <div key={k}>
                  <dt className="label-mono scene-dim-text">{k}</dt>
                  <dd className="display-l mt-2 text-[clamp(1.1rem,1.8vw,1.6rem)]">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          {caseStudy.challenge.supportingLine && (
            <Reveal delay={0.22}>
              <p className="body-tc mt-14 max-w-[54ch] text-acid">{caseStudy.challenge.supportingLine}</p>
            </Reveal>
          )}
        </div>
      </section>

      {/* Problem scene — full-viewport light */}
      <section className="scene-light flex min-h-[100svh] flex-col justify-center px-5 py-20 md:px-10">
        <div className="mx-auto max-w-[1600px] md:grid md:grid-cols-12 md:gap-10">
          <Reveal className="md:col-span-3">
            <h2 className="label-mono">{caseStudy.challenge.heading}</h2>
          </Reveal>
          <div className="mt-8 max-w-[68ch] md:col-span-8 md:col-start-5 md:mt-0">
            {caseStudy.challenge.title && (
              <Reveal>
                <h3 className="display-l text-[clamp(1.75rem,3.2vw,2.8rem)]">{caseStudy.challenge.title}</h3>
              </Reveal>
            )}
            <Reveal delay={0.08} className="body-tc mt-6 space-y-4">
              {paragraphs(caseStudy.challenge.body).map((p) => (
                <p key={p}>{p}</p>
              ))}
            </Reveal>
            {caseStudy.challenge.points && (
              <Reveal delay={0.14}>
                <ul className="mt-8 grid gap-3 border-t scene-rule pt-6 sm:grid-cols-2">
                  {caseStudy.challenge.points.map((point) => (
                    <li key={point} className="label-mono text-[13px] leading-6">{point}</li>
                  ))}
                </ul>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* System scene — the flow diagram as the scene's visual anchor */}
      <section className="scene-dark flex min-h-[100svh] flex-col justify-center px-5 py-20 md:px-10">
        <div className="mx-auto max-w-[1600px]">
          <Reveal>
            <h2 className="label-mono">{caseStudy.workflow.heading}</h2>
            {caseStudy.role.title && <p className="label-mono mt-2 scene-dim-text">{caseStudy.role.title}</p>}
          </Reveal>
          {stages ? (
            <Reveal delay={0.1} className="mt-16 flex flex-wrap items-center justify-center gap-y-8">
              {stages.map((stage, i) => (
                <span key={stage} className="flex items-center">
                  <span className="display-l border scene-rule px-6 py-5 text-[clamp(0.95rem,1.4vw,1.25rem)]">{stage}</span>
                  {i < stages.length - 1 && <span aria-hidden className="mx-3 text-2xl text-acid md:mx-6">→</span>}
                </span>
              ))}
            </Reveal>
          ) : (
            <Reveal delay={0.1} className="body-tc mt-10 max-w-[64ch]">
              {paragraphs(caseStudy.workflow.body).map((p) => (
                <p key={p}>{p}</p>
              ))}
            </Reveal>
          )}
          <Reveal delay={0.18} className="body-tc mt-14 max-w-[62ch] scene-dim-text">
            {paragraphs(caseStudy.role.body)[0]}
          </Reveal>
        </div>
      </section>

      {/* Decisions — normal scroll, generous room per decision */}
      <section className="scene-light px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1600px]">
          <Reveal>
            <h2 className="label-mono">{caseStudy.decisionsHeading ?? "Key Design Decisions"}</h2>
          </Reveal>
          <div className="mt-12 space-y-16 md:mt-20">
            {caseStudy.decisions.map((decision, i) => (
              <Reveal key={decision.heading} delay={i * 0.04} className="border-t scene-rule pt-8 first:border-t-0 first:pt-0 md:grid md:grid-cols-12 md:gap-10">
                <p className="label-mono text-lavender md:col-span-1">{String(i + 1).padStart(2, "0")}</p>
                <div className="mt-4 max-w-[64ch] md:col-span-8 md:col-start-3 md:mt-0">
                  <h3 className="display-l text-[clamp(1.5rem,2.6vw,2.1rem)]">{decision.heading}</h3>
                  <div className="body-tc mt-4 space-y-3">
                    {paragraphs(decision.body).map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                  {decision.principle && (
                    <p className="display-l mt-6 max-w-[40ch] text-[clamp(1.1rem,1.6vw,1.4rem)] text-lavender">{decision.principle}</p>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final UI scene — dark full-viewport media takeover */}
      <section className="scene-dark flex min-h-[100svh] flex-col justify-center px-5 py-20 md:px-10">
        <div className="mx-auto max-w-[1600px]">
          <Reveal>
            <h2 className="label-mono">{caseStudy.finalUI.heading}</h2>
            {caseStudy.finalUI.title && <h3 className="display-l mt-3 text-[clamp(1.5rem,2.6vw,2.2rem)]">{caseStudy.finalUI.title}</h3>}
          </Reveal>
          <Reveal delay={0.1} className="relative mt-10 aspect-[16/9] overflow-hidden edge-frame">
            <ProjectVisual project={project} showTempTag className="absolute inset-0" />
          </Reveal>
        </div>
      </section>

      {/* Outcome + next-project handoff, one closing beat */}
      <section className="scene-light px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1600px] space-y-16">
          <Reveal className="md:grid md:grid-cols-12 md:gap-10">
            <h2 className="label-mono md:col-span-3">{caseStudy.outcome.heading}</h2>
            <div className="mt-6 max-w-[64ch] md:col-span-8 md:col-start-5 md:mt-0 body-tc space-y-4">
              {paragraphs(caseStudy.outcome.body).map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>

          <Reveal className="border-t scene-rule pt-14">
            <p className="label-mono scene-dim-text">{caseStudy.nextProjectLabel ?? "Next Project"}</p>
            <Link
              href={`/work/${nextProject.slug}`}
              className="case-link group mt-6 inline-flex items-center justify-between gap-6 border-b scene-rule py-6 text-[2rem] font-medium tracking-[-0.02em] md:text-[4.5rem]"
            >
              <span>{caseStudy.nextProjectTitle ?? nextProject.title}</span>
              <span aria-hidden className="transition-transform group-hover:translate-x-2">→</span>
            </Link>
            <Link href="/#selected-work" className="case-link group mt-10 inline-flex items-center gap-2 label-mono scene-dim-text">
              <span aria-hidden>←</span>
              <span>{caseStudy.backToSelectedWorkLabel ?? "Back to Selected Work"}</span>
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
