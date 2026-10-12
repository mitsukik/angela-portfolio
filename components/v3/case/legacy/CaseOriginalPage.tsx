import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import type { Locale } from "@/data/locale";
import { projects, type Project } from "@/data/projects";
import { v3Neighbours, v3Sequence, v3Slot } from "@/data/v3/sequence";
import { CASE_CHAPTERS } from "@/data/case-studies/openings";
import { CASE_SYSTEM_CHAPTERS, CASE_SYSTEM_NEMU } from "@/data/case-studies/chapters";
import { CASE03_NAV_LABELS, CASE03_NEMU } from "@/data/case-studies/case03";
import { CaseV3Shell, type CaseV3Chapter } from "../CaseV3Shell";
import { CaseOriginalArticle } from "./CaseOriginalArticle";
import { Case01Article } from "../case01/Case01Article";
import { Case04Article } from "../case04/Case04Article";
import { Case02Article } from "../case02/Case02Article";

/*
 * Server page for CASE01 / 02 / 04 in the V3 frame.
 *
 * CASE System V3 (CASE_SYSTEM.md): a case with a unified V3 article reads its
 * chapters, labels, anchors and Nemu lines from data/case-studies/chapters.ts
 * (§4, §6) and offers its primary hero CTA as the Remote's third option (§5).
 * A case not yet on the unified article keeps the original-component path.
 */

type CaseNo = "01" | "02" | "04";

/** Production's case-specific Next Case blurb (CaseStudyPrototype: CASE01 EN only, verbatim). */
const NEXT_DESCRIPTION: Partial<Record<CaseNo, Partial<Record<Locale, string>>>> = {
  "01": { en: "Bringing brand positioning, content structure, and visual design together to create a clear, consistent digital experience." },
};

/** The case's primary hero CTA (§5) — the Remote's third option. Original destinations only. */
const PRIMARY_CTA: Partial<Record<CaseNo, { href: string; label: Record<Locale, string> }>> = {
  "01": { href: "https://case01-admin.vercel.app/", label: { zh: "操作後台原型", en: "Open Admin Prototype" } },
  "04": { href: "https://labo65-app.vercel.app/auth/login", label: { zh: "操作 App 互動原型", en: "Try the Interactive App Prototype" } },
};

const V3_ARTICLES: Partial<Record<CaseNo, (p: { locale: Locale; project: Project }) => ReactNode>> = {
  "01": (p) => <Case01Article {...p} />,
  "02": (p) => <Case02Article {...p} />,
  "04": (p) => <Case04Article {...p} />,
};

export function CaseOriginalPage({ caseNo, locale }: { caseNo: CaseNo; locale: Locale }) {
  const project = projects.find((p) => p.number === caseNo);
  if (!project) notFound();
  const v3 = V3_ARTICLES[caseNo];
  const chapters: CaseV3Chapter[] = v3
    ? CASE_SYSTEM_CHAPTERS[caseNo].map((c) => ({ id: c.anchor, no: c.no, label: locale === "zh" ? c.zh : c.en, line: locale === "zh" ? c.nemuZh : c.nemuEn }))
    : [
        { id: "ov", no: "00", label: CASE03_NAV_LABELS[locale].ov, line: CASE03_NEMU[locale].ov.replace("CH03", `CH${caseNo}`) },
        ...CASE_CHAPTERS[caseNo].map((c, i) => ({ id: `s${i + 1}`, no: c.no, label: c.label[locale], line: c.title[locale] })),
      ];
  const base = `/design-samples/case-final-${caseNo}`;
  const cta = PRIMARY_CTA[caseNo];
  return (
    <div>
      <CaseV3Shell
        locale={locale}
        caseNumber={caseNo}
        channelNo={v3Slot(caseNo)}
        previousChannelNo={v3Slot(v3Neighbours(project).previous.number)}
        nextChannelNo={v3Slot(v3Neighbours(project).next.number)}
        switchHref={locale === "zh" ? `/en${base}` : base}
        chapters={chapters}
        moreLine={v3 ? CASE_SYSTEM_NEMU[locale].more : CASE03_NEMU[locale].more}
        askLine={v3 ? CASE_SYSTEM_NEMU[locale].toc : undefined}
        prototypeHref={cta?.href}
        prototypeLabel={cta?.label[locale]}
        project={project}
        previousProject={v3Neighbours(project).previous}
        nextProject={v3Neighbours(project).next}
        publishedCount={v3Sequence().length}
        nextDescriptionOverride={NEXT_DESCRIPTION[caseNo]?.[locale]}
      >
        {v3 ? v3({ locale, project }) : <CaseOriginalArticle caseNo={caseNo} locale={locale} project={project} chapterIds={chapters.map((c) => c.id)} />}
      </CaseV3Shell>
    </div>
  );
}
