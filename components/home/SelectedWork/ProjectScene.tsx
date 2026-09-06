"use client";

import Link from "next/link";
import type { Locale } from "@/data/locale";
import type { Project } from "@/data/projects";
import { ProjectVisual } from "@/components/site/ProjectVisual";
import { MixedText } from "@/components/site/MixedText";
import { clamp, easeOut, mapRange, mix } from "./motion";

type Props = {
  project: Project;
  locale: Locale;
  f: number; // relative progress: 0 = arriving, 1 = fully gone
  still: boolean; // reduced motion
  compact: boolean; // mobile
};

/**
 * One project's resolved presentation state inside the shared pinned
 * Selected Work stage. Ported from the connected Lovable "VER B" project's
 * src/components/site/ProjectScene.tsx — same enter/exit windows, same
 * clip-path wipe axis (project 03 is the one horizontal wipe among four
 * otherwise-vertical ones), same bespoke per-project media transform.
 */
export function ProjectScene({ project, locale, f, still, compact }: Props) {
  const depth = compact ? 0.55 : 1;
  const enter = easeOut(mapRange(f, -0.22, 0.16));
  const exit = easeOut(mapRange(f, 0.78, 1.02));
  const live = f > -0.32 && f < 1.06;

  const opacity = still ? (f >= -0.05 && f < 0.95 ? 1 : 0) : clamp(enter * (1 - exit) * 2.4);

  const wrapStyle: React.CSSProperties = still
    ? { opacity }
    : {
        opacity,
        clipPath:
          project.id === "03"
            ? `inset(0% ${(1 - enter) * 100}% 0% ${exit * 100}%)`
            : `inset(${(1 - enter) * 100}% 0% ${exit * 100}% 0%)`,
      };

  const mediaStyle: React.CSSProperties = still
    ? {}
    : project.id === "01"
      ? { transform: `translate3d(0, ${(1 - enter) * 42 - exit * 70}px, 0) scale(${mix(1.14, 1, enter) + exit * 0.05})` }
      : project.id === "02"
        ? { clipPath: `inset(0 ${(1 - enter) * 82}% 0 0)`, transform: `scale(${1.06 - enter * 0.06 - exit * 0.04})` }
        : project.id === "03"
          ? { transform: `translate3d(${exit * 80}px, ${(0.5 - clamp(f)) * 8}px, 0) scale(${1.035 - enter * 0.035})` }
          : { transform: `translate3d(${mix(-90, 0, enter) - exit * 45}px, 0, 0) scale(${mix(1.1, 1, enter)})` };

  const lift = (delay: number): React.CSSProperties =>
    still
      ? {}
      : {
          transform: `translate3d(0, ${(mix(34, 0, easeOut(mapRange(f, -0.16 + delay, 0.24 + delay))) - exit * 56) * depth}px, 0)`,
          opacity: clamp(mapRange(f, -0.16 + delay, 0.28 + delay) * (1 - exit * 1.6)),
        };

  const accentText = project.accent === "acid" ? "text-acid" : "text-lavender";
  const accentBg = project.accent === "acid" ? "bg-acid" : "bg-lavender";
  const tone = project.stageBackground === "dark" ? "scene-dark" : "scene-light";
  const description = locale === "zh" ? project.description : project.descriptionEn;
  const summary = description.join(locale === "zh" ? "" : " ");
  const metadataEntries = Object.entries(project.caseStudy.metadata);
  const role = metadataEntries[0]?.[1];
  const facts = metadataEntries.slice(1, 4).map(([k, v]) => ({ k, v }));

  const Meta = facts.length > 0 && (
    <dl className="grid grid-cols-3 gap-4 border-t scene-rule pt-4">
      {facts.map((fact) => (
        <div key={fact.k}>
          <dt className="label-mono scene-dim-text">{fact.k}</dt>
          <dd className="mt-1 text-[15px] leading-snug">{fact.v}</dd>
        </div>
      ))}
    </dl>
  );

  const Head = (
    <div style={lift(0)}>
      <p className="label-mono flex items-center gap-3">
        <span className={accentText}>{project.number}</span>
        <span aria-hidden className={`h-px w-10 ${accentBg}`} />
        <span className="scene-dim-text">{project.category[locale]}</span>
      </p>
      <h3 className="display-l mt-4 text-[clamp(1.75rem,3.3vw,3.1rem)]">
        <span lang="zh-Hant">
          <MixedText text={project.chineseTitle} />
        </span>
      </h3>
      <p className="label-mono mt-3 scene-dim-text">
        {project.title} · {project.year}
      </p>
    </div>
  );

  const Body = (
    <div style={lift(0.06)} className="space-y-4">
      <p lang={locale === "zh" ? "zh-Hant" : "en"} className="body-tc max-w-[44ch]">
        {summary}
      </p>
      {role && <p className="label-mono scene-dim-text">{role}</p>}
      {/* Same bordered-CTA grammar as Hero's "Selected Work ↓" and the
          Closing contact rows — visible at rest (not only on hover/whole-
          card click), so it reads unambiguously as this scene's entry
          point into the Case Study rather than blending into body copy. */}
      <Link
        href={`/work/${project.slug}`}
        className="case-link group inline-flex items-center gap-3 border-b border-current/50 pb-2 label-mono"
      >
        {locale === "zh" ? "查看案例" : "VIEW CASE STUDY"}
        <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </Link>
    </div>
  );

  const Media = (
    <div className="relative h-full w-full overflow-hidden edge-frame">
      <div className="absolute inset-0" style={mediaStyle}>
        <ProjectVisual project={project} priority={project.id === "01"} className="absolute inset-0" />
      </div>
      <span
        aria-hidden
        className={`absolute left-0 top-0 h-8 w-px ${accentBg}`}
        style={{ transform: `scaleY(${enter})`, transformOrigin: "top" }}
      />
    </div>
  );

  // V3.1 locked layout: one parameterized 50/50 grid instead of four
  // hand-coded variants, so media reads at a consistent size across all
  // four projects. stageColumn controls the ->/<- column rhythm across
  // 01-04 (text-left, media-left, text-left, media-left); stageVertical
  // is each project's own choreography and doesn't affect that rhythm.
  const textFirst = project.stageColumn === "text-left";
  const verticalClass =
    project.stageVertical === "top"
      ? "md:justify-start"
      : project.stageVertical === "bottom"
        ? "md:justify-end"
        : "md:justify-center md:self-center";

  return (
    <article
      className={`absolute inset-0 ${tone}`}
      style={{ ...wrapStyle, visibility: live ? "visible" : "hidden" }}
      aria-hidden={!live || opacity < 0.4}
    >
      <div className="mx-auto flex h-full max-w-[1600px] flex-col overflow-hidden px-5 pb-36 pt-28 md:px-10 md:pb-32 md:pt-32">
        <div className="grid h-full min-h-0 grid-cols-1 gap-6 md:grid-cols-12 md:gap-10">
          <div
            className={`flex min-h-0 flex-col justify-center gap-6 md:col-span-6 ${
              textFirst ? "order-1 md:col-start-1" : "order-2 md:col-start-7"
            } ${verticalClass}`}
          >
            {Head}
            <div className="space-y-6">
              {Body}
              {Meta}
            </div>
          </div>
          <div
            className={`relative h-[32vh] md:col-span-6 md:h-full ${
              textFirst ? "order-2 md:col-start-7" : "order-1 md:col-start-1"
            } ${project.stageVertical === "middle" ? "md:h-[62vh] md:self-center" : ""}`}
          >
            {Media}
          </div>
        </div>
      </div>
    </article>
  );
}
