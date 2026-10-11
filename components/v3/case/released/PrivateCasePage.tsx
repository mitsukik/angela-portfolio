import type { ReactNode } from "react";
import type { Locale } from "@/data/locale";
import { v3Neighbours, v3Sequence, v3Slot } from "@/data/v3/sequence";
import { CASE03_NAV_LABELS, CASE03_NEMU } from "@/data/case-studies/case03";
import { CASE_SYSTEM_NEMU } from "@/data/case-studies/chapters";
import { CaseV3Shell, type CaseV3Chapter } from "@/components/v3/case/CaseV3Shell";
import { v3Labels } from "./labels";
import { CASE05_CHAPTERS } from "./case05/chapters";
import { CASE06_CHAPTERS } from "./case06/chapters";
import { CASE07_CHAPTERS } from "./case07/chapters";
import { Case05Article } from "./case05/Case05Article";
import { Case06Article } from "./case06/Case06Article";
import { Case07Article } from "./case07/Case07Article";
import { CASE07_SOURCE } from "./case07/data";

/*
 * CASE05–07 in the V3 CASE frame (routes app/[en/]design-samples/case-final-05…07).
 *
 * Content: verified data serialized verbatim from the original case source;
 * visual modules are the original case files (import paths only); assets are
 * byte-identical. Chapter labels/lines come from that data. The overview / end
 * Nemu lines reuse the approved case-agnostic CASE03 lines.
 */

type PrivateNo = "05" | "06" | "07";

const CHAPTERS = { "05": CASE05_CHAPTERS, "06": CASE06_CHAPTERS, "07": CASE07_CHAPTERS } as const;
const ARTICLES: Record<PrivateNo, (locale: Locale) => ReactNode> = {
  "05": (locale) => <Case05Article locale={locale} />,
  "06": (locale) => <Case06Article locale={locale} />,
  "07": (locale) => <Case07Article locale={locale} />,
};

/** Chapter label without its own "NN — " prefix (the Remote adds the number). */
const bare = (label: string) => label.replace(/^\d{2}\s+—\s+/, "");

export function PrivateCasePage({ caseNo, locale }: { caseNo: PrivateNo; locale: Locale }) {
  const seq = v3Sequence();
  const project = seq.find((p) => p.number === caseNo)!;
  const { previous, next } = v3Neighbours(project);
  const ch = `CH${caseNo}`;
  const src = CHAPTERS[caseNo][locale] as readonly { id: string; no: string; label: string; line: string }[];
  const chapters: CaseV3Chapter[] = src.map((c, k) =>
    k === 0
      ? { id: "ov", no: "00", label: CASE03_NAV_LABELS[locale].ov, line: CASE03_NEMU[locale].ov.replace("CH03", ch) }
      : { id: c.id, no: c.no, label: v3Labels(caseNo, locale)[c.no] ?? bare(c.label), line: c.line },
  );
  const base = `/design-samples/case-final-${caseNo}`;
  return (
    <div>
      <CaseV3Shell
        locale={locale}
        caseNumber={caseNo}
        channelNo={v3Slot(caseNo)}
        previousChannelNo={v3Slot(previous.number)}
        nextChannelNo={v3Slot(next.number)}
        switchHref={locale === "zh" ? `/en${base}` : base}
        chapters={chapters}
        moreLine={CASE_SYSTEM_NEMU[locale].more}
        askLine={CASE_SYSTEM_NEMU[locale].toc}
        prototypeHref={caseNo === "07" ? CASE07_SOURCE.prototype.href : undefined}
        prototypeLabel={caseNo === "07" ? CASE07_SOURCE.prototype.label[locale] : undefined}
        project={project}
        previousProject={previous}
        nextProject={next}
        publishedCount={seq.length}
      >
        {ARTICLES[caseNo](locale)}
      </CaseV3Shell>
    </div>
  );
}
