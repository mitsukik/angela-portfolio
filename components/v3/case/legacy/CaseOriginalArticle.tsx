"use client";

import type { ReactNode } from "react";
import { CaseChannelLabel } from "../CaseChannel";
import type { Locale } from "@/data/locale";
import type { Project } from "@/data/projects";
import { CASE_CHAPTERS, CASE_OPENINGS } from "@/data/case-studies/openings";
import { CASE03_NAV_LABELS } from "@/data/case-studies/case03";
import { caseOneDemoItems, CaseOneFinalContent } from "@/components/design-samples/case-final/CaseOneFinalContent";
import { SectionLabelProvider } from "@/components/design-samples/case-final/SectionLabelContext";
import { CaseHeroCta, type CaseHeroCtaItem } from "../CaseHeroCta";
import { CaseOneProductPreview } from "@/components/design-samples/case-final/CaseOnePresentation";
import { CaseTwoFinalContent, CaseTwoHeroEvidence } from "@/components/design-samples/case-final/CaseTwoFinalContent";
import { CaseFourFinalContent, CaseFourHeroEvidence } from "@/components/design-samples/case-final/CaseFourFinalContent";

/*
 * CASE01 / CASE02 / CASE04 in the V3 CASE frame.
 *
 * Preservation by construction: every chapter, image, video, recording,
 * interactive module (FlowTabs, rules loops, StateScrubber, evidence viewer
 * triggers, walkthroughs) and link is rendered by the case's ORIGINAL
 * production component — nothing is re-typed. The V3 frame supplies the
 * hero layout, chapter navigation (Remote / Reading Mode / Floating Head),
 * prev/next, Contact Closing and footer; the original components are
 * themed through `.case-final[data-theme="v3"]` (V3 tokens, see v3.css).
 */

type CaseNo = "01" | "02" | "04";

const VERSION: Record<CaseNo, string> = { "01": "case01-v3", "02": "case02-v1", "04": "case04-v1" };

const CONTENT: Record<CaseNo, (p: { register: (i: number, el: HTMLElement | null) => void; locale: Locale }) => ReactNode> = {
  "01": (p) => <CaseOneFinalContent {...p} />,
  "02": (p) => <CaseTwoFinalContent {...p} />,
  "04": (p) => <CaseFourFinalContent {...p} />,
};

const HERO_EVIDENCE: Record<CaseNo, (locale: Locale) => ReactNode> = {
  "01": (locale) => <CaseOneProductPreview locale={locale} />,
  "02": (locale) => <CaseTwoHeroEvidence locale={locale} />,
  "04": (locale) => <CaseFourHeroEvidence locale={locale} />,
};

export function CaseOriginalArticle({ caseNo, locale, project, chapterIds }: { caseNo: CaseNo; locale: Locale; project: Project; chapterIds: string[] }) {
  const zh = locale === "zh";
  const o = CASE_OPENINGS[caseNo][locale];
  const version = VERSION[caseNo];
  const labels = Object.fromEntries(CASE_CHAPTERS[caseNo].map((c) => [c.no, c.label[locale]]));
  // Hero CTAs (shared CASE03 pattern): the case's prototype is the primary
  // CTA and its other original links are secondary (same hrefs and labels).
  // CASE02 has no prototype: its primary CTA jumps to the website stories on
  // this page; the three Visit Website links stay where they are.
  const heroLinks: { href: string; label: string; note?: string }[] =
    caseNo === "01" ? caseOneDemoItems(locale, true).flatMap((l) => (l.href ? [{ ...l, href: l.href }] : [])) : (o.links ?? []);
  const isPrototype = (l: { label: string }) => /原型|prototype/i.test(l.label);
  const ctas: CaseHeroCtaItem[] =
    caseNo === "02"
      ? [{ sec: chapterIds[3], label: zh ? "查看網站案例" : "Explore Websites", note: o.infoRows[0]?.value }]
      : [...heroLinks.filter(isPrototype), ...heroLinks.filter((l) => !isPrototype(l))];

  // Original components register their chapter sections; mark them for the
  // V3 frame (Remote / tracking / jumps) without changing their markup.
  const register = (i: number, el: HTMLElement | null) => {
    if (!el) return;
    el.setAttribute("data-sec", chapterIds[i + 1]);
    el.tabIndex = -1;
  };

  return (
    <>
      <section data-sec="ov" tabIndex={-1} className="cv3-hero" aria-labelledby="cv3-title">
        <p className="cv3-hero-meta">
          <span className="cv3-ch-chip" lang="en">
            <span aria-hidden="true" className="cv3-ch-chip-dot" />
            CH <CaseChannelLabel fallback={project.number} />
          </span>
          <span>{zh ? project.category.zh : project.category.en}</span>
          <span aria-hidden="true" className="cv3-meta-dash" />
          <span lang="en">{project.year}</span>
          <span aria-hidden="true" className="cv3-meta-dash" />
          <span>{`00 — ${CASE03_NAV_LABELS[locale].ov}`}</span>
        </p>
        <h1 id="cv3-title" className="cv3-h1">
          {o.titleLines ? o.titleLines.map((line) => <span key={line} className="cv3-h1-line">{line}</span>) : o.title}
        </h1>
        <p className="cv3-lead">{o.subtitle}</p>
        {o.summary.map((p, i) => (
          <p key={p} className="cv3-summary" data-lead={o.leadFirst && i === 0 ? "true" : undefined}>{p}</p>
        ))}
        <dl className="cv3-info">
          {o.infoRows.map((row) => (
            <div key={row.label}>
              <dt>{row.label}</dt>
              <dd data-accent={row.accent ? "true" : undefined}>{row.value}</dd>
            </div>
          ))}
        </dl>
        <CaseHeroCta items={ctas} />
      </section>

      <div data-sec-media="1" className="case-final cv3-original cv3-original-hero" data-theme="v3" data-content-version={version}>
        {HERO_EVIDENCE[caseNo](locale)}
      </div>

      <div className="case-final cv3-original" data-theme="v3" data-content-version={version}>
        <SectionLabelProvider labels={labels}>{CONTENT[caseNo]({ register, locale })}</SectionLabelProvider>
      </div>
    </>
  );
}
