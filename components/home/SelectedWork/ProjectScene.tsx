"use client";

import Link from "next/link";
import type { Locale } from "@/data/locale";
import type { Project } from "@/data/projects";
import { ProjectVisual } from "@/components/site/ProjectVisual";
import { MixedText } from "@/components/site/MixedText";
import { sceneFrame, type SceneFrame } from "./motion";

type Props = {
  project: Project;
  locale: Locale;
  /** Position in the Selected Work sequence (drives choreography only). */
  index: number;
  count: number;
  /** Mobile alternate render: a normal stacked block (own document
   * height, no pin, no scroll-driven clip/transform) — the pinned stage's
   * single-viewport budget cannot fit a real hero-weight image alongside
   * full copy on a phone. */
  stacked?: boolean;
};

/**
 * One project inside the Selected Work stage. Pinned (desktop/tablet): an
 * absolutely-stacked scene whose wipe/settle frames come from
 * sceneStyles() (project 03 keeps the one horizontal wipe among four
 * otherwise-vertical ones). Stacked (mobile): a normal static block.
 */
export function ProjectScene({ project, locale, index, count, stacked }: Props) {
  // First paint (SSR included) matches the stage at scroll progress 0;
  // SelectedWork then drives every later frame imperatively through the
  // same sceneStyles() so there is one source of choreography truth.
  const initial = sceneStyles(project, sceneFrame(index, count, 0));

  const caseHref = locale === "zh" ? `/design-samples/case-final-${project.number}` : `/en/design-samples/case-final-${project.number}`;
  const accentText = project.accent === "acid" ? "text-acid" : "text-lavender";
  const accentBg = project.accent === "acid" ? "bg-acid" : "bg-lavender";
  const tone = project.stageBackground === "dark" ? "scene-dark" : "scene-light";
  const description = locale === "zh" ? project.description : project.descriptionEn;
  const summary = description.join(locale === "zh" ? "" : " ");
  // CASE01 already carries a full English metadata dict (caseStudyEn) —
  // this just wasn't being read here, so the homepage card fell back to
  // the zh dict's own Chinese keys ("平台"/"範疇"/"狀態") as literal
  // labels even on /en, while the actual case-study page (a separate
  // component) localized correctly. Projects without a caseStudyEn keep
  // using their one existing metadata dict, unchanged.
  const activeCaseStudy = locale === "en" && project.caseStudyEn ? project.caseStudyEn : project.caseStudy;
  const metadataEntries = Object.entries(activeCaseStudy.metadata);
  const role = metadataEntries[0]?.[1];
  const facts = metadataEntries.slice(1, 4).map(([k, v]) => ({ k, v }));
  const mediaAspect =
    project.id === "01" || project.id === "04"
      ? "aspect-[1086/1448]"
      : "aspect-[941/1672]";
  const mobileMediaHeight =
    project.id === "01"
      ? "h-[13rem]"
      : project.id === "03"
        ? "h-[16.5rem]"
        : "h-[17rem]";

  const Meta = facts.length > 0 && (
    <dl className="grid grid-cols-3 gap-4 border-t scene-rule pt-4">
      {facts.map((fact) => (
        <div key={fact.k}>
          <dt className="type-v3-label scene-dim-text">{fact.k}</dt>
          <dd className="mt-1 text-[15px] leading-snug">{fact.v}</dd>
        </div>
      ))}
    </dl>
  );

  // Round 14: the subtitle now shares the Case Opening/Section Label's
  // exact design-system role ("NN — Title", one accent-colored run) —
  // reusing .cf-section-label directly (it holds no .case-final-scoped
  // variable, just a literal font-size/letter-spacing override, so it's
  // already safe to use outside Case) combined with the site's own
  // type-v3-label (family/transform) and the existing per-project
  // text-acid/text-lavender utility for color, rather than a duplicated
  // .selected-work-subtitle rule. Previously: a separate number + short
  // accent-bg rule + dimmed category, three visually distinct pieces —
  // not the same role Case uses. The rule/bar element is gone; Case's
  // own section label has no equivalent line, just the text run.
  // Homepage Visual Polish V3: the big heading now follows `locale`
  // (was hardcoded to chineseTitle regardless of route, so /en showed a
  // Chinese title under an English eyebrow) — data already had both
  // fields (Project.title / Project.chineseTitle), this was purely a
  // rendering gap. The other language's title keeps its existing role as
  // the small caption below, just swapped to match — same bilingual
  // pairing pattern already used elsewhere (e.g. Case Opening's
  // "01 / COMPLEX SYSTEM"), not new content. `lang` moves onto the h3
  // itself (was only on an inner span) so `.type-v3-section-heading:lang(zh-Hant)`
  // can actually match it.
  const primaryTitle = locale === "zh" ? project.chineseTitle : project.title;
  const Head = (
    <div data-scene-text="0" style={stacked ? undefined : initial.text[0]}>
      <p className={`type-v3-label cf-section-label whitespace-nowrap ${accentText}`}>
        {project.number} — {project.category[locale]}
      </p>
      <h2 lang={locale === "zh" ? "zh-Hant" : "en"} className="type-v3-section-heading mt-4">
        {locale === "zh" ? <MixedText text={primaryTitle} /> : primaryTitle}
      </h2>
      {/* Intentional sitewide cleanup: this caption used to pair the
          heading with the OTHER locale's title (e.g. showing the Chinese
          title as a caption on the English card). Replaced with a
          consistent CATEGORY · YEAR caption — same value on both locale
          cards, for every project, same visual slot/styling. */}
      <p lang="en" className="type-v3-label mt-3 scene-dim-text">
        {project.category.en} · {project.year}
      </p>
    </div>
  );

  const Body = (
    <div data-scene-text="1" style={stacked ? undefined : initial.text[1]} className="space-y-4">
      <p lang={locale === "zh" ? "zh-Hant" : "en"} className="type-v3-body max-w-[44ch]">
        {summary}
      </p>
      {role && <p className="type-v3-label scene-dim-text">{role}</p>}
      {/* Same bordered-CTA grammar as Hero's "Selected Work ↓" and the
          Closing contact rows — visible at rest (not only on hover/whole-
          card click), so it reads unambiguously as this scene's entry
          point into the Case Study rather than blending into body copy. */}
      {/* Round 9 routing correction: points into the numbered Case Final
          prototype sequence (case-final-01..04) rather than the
          production /work/[slug] route, so Home's own "查看案例" entry
          point actually reaches the reviewable prototype experience.
          Round 11: locale-prefixed (same /en convention as Home/About)
          so English Home opens the English Case, not the Chinese one. */}
      <Link
        href={caseHref}
        className="work-scene-cta interaction-destination group inline-flex items-center gap-3 border-b border-current/50 pb-2 type-v3-label"
      >
        {locale === "zh" ? "查看案例" : "View Case Study"}
        <span aria-hidden className="work-scene-arrow">→</span>
      </Link>
    </div>
  );

  const Media = (
    <div
      className={`work-scene-media relative w-auto max-w-full overflow-hidden edge-frame md:h-auto md:w-full ${mediaAspect} ${mobileMediaHeight} lg:aspect-auto lg:h-full`}
    >
      <div data-scene-media className="absolute inset-0" style={initial.media}>
        <ProjectVisual
          project={project}
          priority={project.id === "01"}
          useHomeImage
          className="work-scene-image absolute inset-0"
        />
      </div>
      {/* The whole image is a pointer shortcut into the case; the labelled
          CTA stays the one keyboard / screen-reader stop. */}
      <Link href={caseHref} tabIndex={-1} aria-hidden className="absolute inset-0" />
      <span
        aria-hidden
        data-scene-accent
        className={`pointer-events-none absolute left-0 top-0 h-8 w-px ${accentBg}`}
        style={initial.accent}
      />
    </div>
  );

  // Stacked (mobile) media: full available width, height derived purely
  // from the image's own real aspect ratio (mediaAspect already matches
  // each homeImage asset's native pixel dimensions exactly — see
  // ProjectVisual's `object-contain` path) instead of the pinned scene's
  // fixed rem height competing with that ratio. No transform/clipPath
  // choreography — this block is always at rest.
  const MediaStacked = (
    <div className={`relative w-full max-w-full overflow-hidden edge-frame ${mediaAspect}`}>
      <ProjectVisual project={project} useHomeImage className="absolute inset-0" />
      <span aria-hidden className={`absolute left-0 top-0 h-8 w-px ${accentBg}`} />
    </div>
  );

  if (stacked) {
    return (
      <article className={`${tone} border-t scene-rule first:border-t-0`}>
        <div className="site-frame flex flex-col gap-8 py-16">
          {Head}
          <div className="space-y-6">
            {Body}
            {Meta}
          </div>
          {MediaStacked}
        </div>
      </article>
    );
  }

  // V3.1 locked layout: one parameterized 50/50 grid instead of four
  // hand-coded variants, so media reads at a consistent size across all
  // four projects. stageColumn controls the ->/<- column rhythm across
  // 01-04 (text-left, media-left, text-left, media-left); stageVertical
  // is each project's own choreography and doesn't affect that rhythm.
  const textFirst = project.stageColumn === "text-left";
  // Desktop keeps its existing top/bottom/middle vertical anchor inside a
  // shared-height row (unchanged). Mobile has no such row to anchor
  // within — each block stacks full-width — so "justify-center" there was
  // never a deliberate reading of stageVertical, just what was left once
  // nothing below `md` overrode it. `justify-start` is the coherent mobile
  // reading: content begins at the top of whatever space its own row
  // resolves to, the same way every other stacked mobile section reads.
  const verticalClass =
    project.stageVertical === "top"
      ? "justify-start md:justify-start"
      : project.stageVertical === "bottom"
        ? "justify-start md:justify-end"
        : "justify-start md:justify-center md:self-center";

  // Mobile row split: the media row used to claim a fixed h-[32vh] share
  // unconditionally, leaving the text row whatever remained (293.9px at
  // 390x844) regardless of whether the text's actual content fit — with
  // min-h-0 removing the grid's usual content-based floor, it didn't, and
  // justify-center bled the overflow symmetrically into the stage-chrome
  // above and the media row below (confirmed: project 01 heading/metadata,
  // project 02 eyebrow, project 03 metadata). Explicit two-row templates,
  // keyed to the same textFirst order the columns already use, invert
  // that: the text row is `minmax(min-content, auto)` (grows to whatever
  // its real content needs, never squeezed smaller), and the media row is
  // `minmax(9rem, 1fr)` (keeps a guaranteed minimum presence but yields
  // the rest of the budget to text) — so text is accommodated naturally
  // and media only shrinks below its usual share when text genuinely
  // needs the room, rather than the two silently overlapping. Cancelled
  // at md: (`grid-rows-none`) so desktop's existing single shared-height
  // row is untouched.
  const rowsClass = textFirst
    ? "grid-rows-[minmax(min-content,auto)_minmax(9rem,1fr)]"
    : "grid-rows-[minmax(9rem,1fr)_minmax(min-content,auto)]";

  return (
    <article
      data-scene={index}
      className={`work-scene absolute inset-0 ${tone}`}
      style={{ ...initial.wrap, zIndex: index + 1 }}
      aria-hidden={initial.hidden}
    >
      <div className="site-frame flex h-full flex-col overflow-hidden pb-24 pt-28 md:pb-32 md:pt-32">
        <div className={`grid h-full min-h-0 grid-cols-1 gap-6 md:grid-cols-12 md:grid-rows-none md:gap-10 ${rowsClass}`}>
          <div
            className={`flex min-h-0 flex-col gap-6 md:col-span-6 ${
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
            className={`relative flex h-full justify-center md:col-span-6 md:h-full md:items-center lg:block ${
              textFirst ? "order-2 md:col-start-7" : "order-1 md:col-start-1"
            } ${textFirst ? "items-center" : "items-start"} ${project.stageVertical === "middle" ? "md:h-[62vh] md:self-center" : ""}`}
          >
            {Media}
          </div>
        </div>
      </div>
    </article>
  );
}

type SceneStyles = {
  wrap: React.CSSProperties;
  text: [React.CSSProperties, React.CSSProperties];
  media: React.CSSProperties;
  accent: React.CSSProperties;
  hidden: boolean;
};

/**
 * One frame of a pinned project scene, as plain style objects. Used for
 * the server/first render and — via Object.assign onto element.style —
 * for every scroll frame, without a React render. Motion stays inside the
 * token budget: copy travels 24px, media 24px along the wipe axis and
 * scales 1.04 -> 1.
 */
export function sceneStyles(project: Project, frame: SceneFrame): SceneStyles {
  const { enter, visible } = frame;
  const horizontal = project.id === "03";
  const clip = enter >= 1 ? "none" : horizontal ? `inset(0% ${(1 - enter) * 100}% 0% 0%)` : `inset(${(1 - enter) * 100}% 0% 0% 0%)`;
  const lift = (t: number): React.CSSProperties => ({
    transform: t >= 1 ? "none" : `translate3d(0, ${((1 - t) * 24).toFixed(2)}px, 0)`,
    opacity: t >= 1 ? "" : t.toFixed(3),
  });
  const travel = (1 - enter) * 24;
  return {
    wrap: { clipPath: clip, visibility: visible ? "visible" : "hidden" },
    text: [lift(frame.text(0)), lift(frame.text(0.06))],
    media: {
      transform:
        enter >= 1
          ? "none"
          : `translate3d(${horizontal ? travel.toFixed(2) : 0}px, ${horizontal ? 0 : travel.toFixed(2)}px, 0) scale(${(1.04 - 0.04 * enter).toFixed(4)})`,
    },
    accent: { transform: `scaleY(${enter.toFixed(3)})`, transformOrigin: "top" },
    hidden: !visible || enter < 0.5,
  };
}
