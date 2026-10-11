"use client";

import Image from "next/image";
import type { Locale } from "@/data/locale";
import type { Project } from "@/data/projects";
import { CASE03_CONTENT, CASE03_MEDIA, CASE03_NAV_LABELS, CASE03_OPENING, CASE03_PROTOTYPE_URL } from "@/data/case-studies/case03";
import { EvidenceTrigger } from "@/components/design-samples/case-final/CaseEvidenceViewer";
import { VideoEvidence } from "@/components/design-samples/case-final/VideoEvidence";
import {
  CaseClosingPanel,
  CaseDecision,
  CaseDelivered,
  CaseHero,
  CaseMedia,
  CaseMetadata,
  CasePipeline,
  CaseSection,
  CaseSectionHeader,
} from "../system/CaseSystem";

/*
 * CASE03 — the approved V3 master, expressed with the shared CASE System
 * components (CASE_SYSTEM.md §7.4: named components, no visual change).
 * All copy comes from data/case-studies/case03.ts (verbatim production text);
 * all media are the original local assets through the original components:
 * - EvidenceTrigger (image viewer) on the two images production makes
 *   zoomable — the hero and Decision 01;
 * - VideoEvidence for Decision 02 with the exact production props (WebM +
 *   MP4, held poster, MP4 first, floor-plan still only under reduced motion).
 */

const eyebrow = (no: string, label: string) => `${no} — ${label}`;

export function Case03Article({ locale, project }: { locale: Locale; project: Project }) {
  const zh = locale === "zh";
  const o = CASE03_OPENING[locale];
  const c = CASE03_CONTENT[locale];
  const nav = CASE03_NAV_LABELS[locale];

  return (
    <>
      <CaseHero
        caseNumber={project.number}
        category={zh ? project.category.zh : project.category.en}
        period={o.timeline}
        label={eyebrow("00", nav.ov)}
        title={o.title}
        titleLines={o.titleLines}
        lead={o.subtitle}
      >
        <p className="cv3-summary">{o.summary}</p>
        <CaseMetadata rows={o.infoRows} />
        <div className="cv3-cta-row">
          <a href={CASE03_PROTOTYPE_URL} target="_blank" rel="noopener noreferrer" className="cv3-cta">
            {o.prototype.label.replace(/\s*↗$/, "")}
            <span aria-hidden="true" className="cv3-cta-arrow">↗</span>
          </a>
          <p className="cv3-cta-note">{o.prototype.note}</p>
        </div>
      </CaseHero>

      <CaseMedia frame="hero" heroFirst caption={o.confidentiality} ratio={`${CASE03_MEDIA.hero.width} / ${CASE03_MEDIA.hero.height}`}>
        <EvidenceTrigger asset={{ src: CASE03_MEDIA.hero.src, alt: o.heroAlt }}>
          <Image src={CASE03_MEDIA.hero.src} alt="" fill unoptimized loading="eager" sizes="(min-width: 1200px) 70vw, 100vw" className="object-contain" />
        </EvidenceTrigger>
      </CaseMedia>

      <CaseSection id="c1">
        <CaseSectionHeader eyebrow={eyebrow("01", nav.c1)} title={c.challenge.title} paragraphs={c.challenge.paragraphs} />
        <dl className="cv3-contexts">
          {c.challenge.contexts.map((ctx) => (
            <div key={ctx.label} className="cv3-context" data-tone={ctx.tone}>
              <dt>
                <span className="cv3-context-top">
                  <span className="cv3-context-label" lang="en">{ctx.label}</span>
                  <span className="cv3-context-device">{ctx.device}</span>
                </span>
                {ctx.group !== ctx.label ? <span className="cv3-context-group">{ctx.group}</span> : null}
              </dt>
              <dd lang="en">{ctx.items}</dd>
            </div>
          ))}
        </dl>
      </CaseSection>

      <CaseSection id="c2">
        <CaseSectionHeader eyebrow={eyebrow("02", nav.c2)} title={c.role.title} paragraphs={c.role.paragraphs} />
        <ol aria-label={c.role.flowLabel} className="cv3-groups cv3-list-reset">
          {c.role.groups.map((g) => (
            <li key={g.owner} className="cv3-group" data-mine={g.mine ? "true" : undefined}>
              <p className="cv3-group-owner">{g.owner}</p>
              <ol className="cv3-chips cv3-list-reset" lang="en">
                {g.steps.map((step, i) => (
                  <li key={step}>
                    {i > 0 ? <span aria-hidden="true" className="cv3-arrow">→</span> : null}
                    <span className="cv3-chip">{step}</span>
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ol>
      </CaseSection>

      <CaseSection id="c3">
        <CaseSectionHeader eyebrow={eyebrow("03", nav.c3)} title={c.decisions.heading} />

        <CaseDecision label={c.decisions.one.number} title={c.decisions.one.title}>
          {c.decisions.one.intro.map((p) => <p key={p} className="cv3-p">{p}</p>)}
          <ol aria-label={c.decisions.one.patternLabel} className="cv3-pattern cv3-list-reset" lang="en">
            {c.decisions.one.pattern.map((step, i) => (
              <li key={step}>
                {i > 0 ? <span aria-hidden="true" className="cv3-arrow">→</span> : null}
                <span className="cv3-chip">{step}</span>
              </li>
            ))}
          </ol>
          <p className="cv3-p">{c.decisions.one.outro}</p>
          <div style={{ marginTop: 8 }}>
            <CaseMedia caption={c.decisions.one.caption} ratio={`${CASE03_MEDIA.sharedPatterns.width} / ${CASE03_MEDIA.sharedPatterns.height}`}>
              <EvidenceTrigger asset={{ src: CASE03_MEDIA.sharedPatterns.src, alt: c.decisions.one.imageAlt }}>
                <Image src={CASE03_MEDIA.sharedPatterns.src} alt="" fill unoptimized sizes="(min-width: 1200px) 60vw, 100vw" className="object-contain" />
              </EvidenceTrigger>
            </CaseMedia>
          </div>
        </CaseDecision>

        <CaseDecision label={c.decisions.two.number} title={c.decisions.two.title}>
          {c.decisions.two.paragraphs.map((p) => <p key={p} className="cv3-p">{p}</p>)}
          <div style={{ marginTop: 8 }}>
            <CaseMedia caption={c.decisions.two.caption}>
              <VideoEvidence
                format="wide"
                holdPosterUntilPlaying
                mp4First
                zhHant={zh}
                asset={{
                  webm: CASE03_MEDIA.storageVideo.webm,
                  mp4: CASE03_MEDIA.storageVideo.mp4,
                  poster: CASE03_MEDIA.storageVideo.poster,
                  alt: c.decisions.two.videoAlt,
                  reducedMotion: {
                    poster: CASE03_MEDIA.storageVideo.reducedMotionPoster,
                    alt: c.decisions.two.reducedMotionAlt,
                  },
                }}
              />
            </CaseMedia>
          </div>
        </CaseDecision>
      </CaseSection>

      <CaseSection id="c4">
        <CaseSectionHeader eyebrow={eyebrow("04", nav.c4)} title={c.build.title} paragraphs={c.build.paragraphs} />
        <CasePipeline label={c.build.flowLabel} steps={c.build.steps.map((title) => ({ title }))} />
      </CaseSection>

      <CaseSection id="c5">
        <CaseSectionHeader eyebrow={eyebrow("05", nav.c5)} title={c.iteration.title} paragraphs={c.iteration.paragraphs} />
        <CaseClosingPanel label={c.iteration.postLaunchLabel}>
          <p className="cv3-p">{c.iteration.postLaunch}</p>
        </CaseClosingPanel>
        <CaseDelivered label={c.iteration.deliveredLabel} value={c.iteration.delivered} />
      </CaseSection>
    </>
  );
}
