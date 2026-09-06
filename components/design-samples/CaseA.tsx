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
 * CASE A — Editorial / spatial.
 *
 * A long-form reading experience with a strong full-viewport opening,
 * then register flips (dark/light) at major narrative beats rather than
 * per-section — Overview+Challenge as one light "problem" beat, Role+
 * Workflow dark, Decisions light, Final UI a dark full-bleed media
 * takeover, Outcome a calm light close. Media appears large between
 * text, not as small inline screenshots. Uses the real Complex System
 * data only — no invented evidence.
 */
export function CaseA({ project, nextProject }: { project: Project; nextProject: Project }) {
  const { caseStudy } = project;
  const displayTitle = caseStudy.displayTitle ?? project.title;
  const stages = flowStages(caseStudy.workflow.supportingLine);

  return (
    <main className="min-h-screen">
      {/* Opening — full-viewport title card */}
      <section className="scene-dark flex min-h-[100svh] flex-col justify-between px-5 py-16 md:px-10 md:py-20">
        <p className="label-mono scene-dim-text">
          {project.number} / {caseStudy.eyebrowTitle ?? displayTitle}
        </p>
        <div>
          <Reveal>
            <h1 className="display-xl max-w-[16ch]">{displayTitle}</h1>
            <p lang="zh-Hant" className="body-tc mt-6 max-w-[52ch] scene-dim-text">
              <MixedText text={caseStudy.projectName ?? project.chineseTitle} />
            </p>
            <p className="body-tc mt-4 max-w-[56ch]">{caseStudy.summary}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <dl className="mt-12 grid grid-cols-2 gap-6 border-t scene-rule pt-6 md:grid-cols-4">
              {Object.entries(caseStudy.metadata).map(([k, v]) => (
                <div key={k}>
                  <dt className="label-mono scene-dim-text">{k}</dt>
                  <dd className="mt-1 text-[15px]">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* Overview + Challenge — one light "problem" beat */}
      <section className="scene-light px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1600px] space-y-20 md:space-y-28">
          <Reveal className="md:grid md:grid-cols-12 md:gap-10">
            <h2 className="label-mono md:col-span-3">{caseStudy.overview.heading}</h2>
            <div className="mt-6 max-w-[64ch] md:col-span-8 md:col-start-5 md:mt-0">
              {caseStudy.overview.title && <h3 className="display-l text-[clamp(1.5rem,2.6vw,2.2rem)]">{caseStudy.overview.title}</h3>}
              <div className="body-tc mt-5 space-y-4">
                {paragraphs(caseStudy.overview.body).map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              {caseStudy.overview.supportingLine && (
                <p className="mt-6 border-t scene-rule pt-4 text-[14px] label-mono scene-dim-text">{caseStudy.overview.supportingLine}</p>
              )}
            </div>
          </Reveal>

          <Reveal className="md:grid md:grid-cols-12 md:gap-10">
            <h2 className="label-mono md:col-span-3">{caseStudy.challenge.heading}</h2>
            <div className="mt-6 max-w-[64ch] md:col-span-8 md:col-start-5 md:mt-0">
              {caseStudy.challenge.title && <h3 className="display-l text-[clamp(1.5rem,2.6vw,2.2rem)]">{caseStudy.challenge.title}</h3>}
              <div className="body-tc mt-5 space-y-4">
                {paragraphs(caseStudy.challenge.body).map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              {caseStudy.challenge.points && (
                <ul className="mt-6 grid gap-3 border-t scene-rule pt-5 sm:grid-cols-2">
                  {caseStudy.challenge.points.map((point) => (
                    <li key={point} className="label-mono text-[13px] leading-6">{point}</li>
                  ))}
                </ul>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Role + Workflow — dark beat */}
      <section className="scene-dark px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1600px] space-y-20 md:space-y-28">
          <Reveal className="md:grid md:grid-cols-12 md:gap-10">
            <h2 className="label-mono">{caseStudy.role.heading}</h2>
            <div className="mt-6 max-w-[64ch] md:col-span-8 md:col-start-5 md:mt-0">
              {caseStudy.role.title && <h3 className="display-l text-[clamp(1.5rem,2.6vw,2.2rem)]">{caseStudy.role.title}</h3>}
              <div className="body-tc mt-5 space-y-4">
                {paragraphs(caseStudy.role.body).map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal>
            <h2 className="label-mono">{caseStudy.workflow.heading}</h2>
            {stages ? (
              <div className="mt-10 flex flex-wrap items-center gap-x-2 gap-y-4 border-t scene-rule pt-8">
                {stages.map((stage, i) => (
                  <span key={stage} className="flex items-center">
                    <span className="label-mono border scene-rule px-4 py-2">{stage}</span>
                    {i < stages.length - 1 && <span aria-hidden className="mx-2 text-lavender">→</span>}
                  </span>
                ))}
              </div>
            ) : (
              <div className="body-tc mt-6 max-w-[64ch] space-y-4">
                {paragraphs(caseStudy.workflow.body).map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            )}
          </Reveal>
        </div>
      </section>

      {/* Decisions — light beat, generous rhythm */}
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

      {/* Final UI — dark full-bleed media takeover */}
      <section className="scene-dark px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1600px]">
          <Reveal className="md:grid md:grid-cols-12 md:gap-10">
            <h2 className="label-mono md:col-span-3">{caseStudy.finalUI.heading}</h2>
            <div className="mt-6 max-w-[64ch] md:col-span-8 md:col-start-5 md:mt-0">
              {caseStudy.finalUI.title && <h3 className="display-l text-[clamp(1.5rem,2.6vw,2.2rem)]">{caseStudy.finalUI.title}</h3>}
              <div className="body-tc mt-5 space-y-4">
                {paragraphs(caseStudy.finalUI.body).map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="relative mt-14 aspect-[16/9] overflow-hidden edge-frame md:mt-20">
            <ProjectVisual project={project} showTempTag className="absolute inset-0" />
          </Reveal>
        </div>
      </section>

      {/* Outcome / Learnings — calm light close */}
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
          {caseStudy.learnings && (
            <Reveal className="md:grid md:grid-cols-12 md:gap-10">
              <h2 className="label-mono md:col-span-3">{caseStudy.learnings.heading}</h2>
              <div className="mt-6 max-w-[64ch] md:col-span-8 md:col-start-5 md:mt-0 body-tc space-y-4">
                {paragraphs(caseStudy.learnings.body).map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* Next project handoff — matches Home's Closing/CTA grammar */}
      <section className="scene-dark px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1600px]">
          <p className="label-mono scene-dim-text">{caseStudy.nextProjectLabel ?? "Next Project"}</p>
          <Link
            href={`/work/${nextProject.slug}`}
            className="case-link group mt-6 inline-flex items-center justify-between gap-6 border-b scene-rule py-6 text-[2rem] font-medium tracking-[-0.02em] md:text-[4.5rem]"
          >
            <span>{caseStudy.nextProjectTitle ?? nextProject.title}</span>
            <span aria-hidden className="text-acid transition-transform group-hover:translate-x-2">→</span>
          </Link>
          <Link href="/#selected-work" className="case-link group mt-10 inline-flex items-center gap-2 label-mono scene-dim-text">
            <span aria-hidden>←</span>
            <span>{caseStudy.backToSelectedWorkLabel ?? "Back to Selected Work"}</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
