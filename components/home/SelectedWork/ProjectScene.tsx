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
  // The track's own trailing "tail" (see SPAN in SelectedWork.tsx) gives
  // the LAST project extra scroll after it would normally have exited, so
  // the pin doesn't release the instant it's gone. Root cause of the
  // "dead scroll" bug: exit is a *gradual* clip-path/opacity wind-down,
  // designed to be masked by the next project's content filling in during
  // the same window — for every other project that's true, but the last
  // project has no next project, so the same gradual exit just visibly
  // shrinks/crops the content away against a static, otherwise-empty
  // background for however long the window lasts. Retiming the window
  // (tried first) doesn't fix that — it only moves the empty gap later.
  // Skipping exit entirely is the actual fix: the last project holds at
  // its fully-settled resting state for the whole tail, and the handoff
  // to Closing happens via the ordinary sticky-release + native scroll
  // once the pin ends, not via this scroll-driven exit animation.
  holdExit?: boolean;
  // Mobile-only alternate render: a normal stacked block (own document
  // height, no absolute positioning, no scroll-driven opacity/clipPath/
  // transform choreography, always visible) instead of the pinned-stage
  // crossfade scene below. See SelectedWork.tsx's compact branch — the
  // pinned scene's fixed 100svh budget structurally cannot fit a real
  // hero-weight image (native ratio, near-full width) alongside full copy
  // for these projects' actual aspect ratios, which is what made CASE01/03
  // render as tiny letterboxed posters; a normal-height stacked block has
  // no such ceiling.
  stacked?: boolean;
};

// Scroll-rhythm fix (index-scroll-rhythm-v1): mobile gets a wider
// enter/exit window than desktop — not a naive isMobile * factor of the
// desktop numbers, but its own deliberately larger overlap so the
// incoming/outgoing crossfade has more physical scroll distance to
// resolve across on a fast mobile flick, reading as a continuous wipe
// rather than a snap. Desktop values are unchanged from the original
// Lovable "VER B" port.
const ENTER_WINDOW = { desktop: [-0.22, 0.16] as const, mobile: [-0.3, 0.22] as const };
const EXIT_START = 0.78;
const EXIT_END = 1.02;
const LIVE_BUFFER = 0.04;

/**
 * One project's resolved presentation state inside the shared pinned
 * Selected Work stage. Ported from the connected Lovable "VER B" project's
 * src/components/site/ProjectScene.tsx — same enter/exit windows, same
 * clip-path wipe axis (project 03 is the one horizontal wipe among four
 * otherwise-vertical ones), same bespoke per-project media transform.
 */
export function ProjectScene({ project, locale, f, still, compact, holdExit, stacked }: Props) {
  const depth = compact ? 0.55 : 1;
  const [enterStart, enterEnd] = compact ? ENTER_WINDOW.mobile : ENTER_WINDOW.desktop;
  const enter = easeOut(mapRange(f, enterStart, enterEnd));
  const exit = holdExit ? 0 : easeOut(mapRange(f, EXIT_START, EXIT_END));
  const live = holdExit ? f > enterStart - 0.1 : f > enterStart - 0.1 && f < EXIT_END + LIVE_BUFFER;

  const opacity = still ? (f >= -0.05 && (holdExit || f < 0.95) ? 1 : 0) : clamp(enter * (1 - exit) * 2.4);

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
    project.id === "01"
      ? "aspect-[1122/1402]"
      : project.id === "04"
        ? "aspect-[971/1619]"
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
  const secondaryTitle = locale === "zh" ? project.title : project.chineseTitle;
  const Head = (
    <div style={stacked ? undefined : lift(0)}>
      <p className={`type-v3-label cf-section-label whitespace-nowrap ${accentText}`}>
        {project.number} — {project.category[locale]}
      </p>
      <h2 lang={locale === "zh" ? "zh-Hant" : "en"} className="type-v3-section-heading mt-4">
        {locale === "zh" ? <MixedText text={primaryTitle} /> : primaryTitle}
      </h2>
      <p lang={locale === "zh" ? "en" : "zh-Hant"} className="type-v3-label mt-3 scene-dim-text">
        {locale === "zh" ? secondaryTitle : <MixedText text={secondaryTitle} />} · {project.year}
      </p>
    </div>
  );

  const Body = (
    <div style={stacked ? undefined : lift(0.06)} className="space-y-4">
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
        href={locale === "zh" ? `/design-samples/case-final-${project.number}` : `/en/design-samples/case-final-${project.number}`}
        className="interaction-destination group inline-flex items-center gap-3 border-b border-current/50 pb-2 type-v3-label"
      >
        {locale === "zh" ? "查看案例" : "VIEW CASE STUDY"}
        <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </Link>
    </div>
  );

  const Media = (
    <div
      className={`relative w-auto max-w-full overflow-hidden edge-frame md:h-auto md:w-full ${mediaAspect} ${mobileMediaHeight} lg:aspect-auto lg:h-full`}
    >
      <div className="absolute inset-0" style={mediaStyle}>
        <ProjectVisual
          project={project}
          priority={project.id === "01"}
          useHomeImage
          className="absolute inset-0"
        />
      </div>
      <span
        aria-hidden
        className={`absolute left-0 top-0 h-8 w-px ${accentBg}`}
        style={{ transform: `scaleY(${enter})`, transformOrigin: "top" }}
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
      className={`absolute inset-0 ${tone}`}
      style={{ ...wrapStyle, visibility: live ? "visible" : "hidden" }}
      aria-hidden={!live || opacity < 0.4}
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
