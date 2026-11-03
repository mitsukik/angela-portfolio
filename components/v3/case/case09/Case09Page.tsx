import type { Locale } from "@/data/locale";
import { caseHref } from "@/data/v3/channel-routes";
import { v3Neighbours, v3Sequence, v3Slot } from "@/data/v3/sequence";
import { CASE_SYSTEM_NEMU } from "@/data/case-studies/chapters";
import { CaseV3Shell, type CaseV3Chapter } from "@/components/v3/case/CaseV3Shell";
import { Case09Article } from "./Case09Article";
import { CASE09_CHAPTERS } from "./chapters";
import { CASE09_LINKS } from "./catalog";

/*
 * CASE09 (CH08) in the V3 CASE frame (routes app/[en/]work/ch-08). Chapters
 * and Nemu lines come from ./chapters; the Remote's third option is the live
 * website (the hero has no CTA, like CASE02).
 */
export function Case09Page({ locale }: { locale: Locale }) {
  const seq = v3Sequence();
  const project = seq.find((p) => p.number === "09")!;
  const { previous, next } = v3Neighbours(project);
  const chapters: CaseV3Chapter[] = CASE09_CHAPTERS.map((c) => ({ id: c.anchor, no: c.no, label: locale === "zh" ? c.zh : c.en, line: locale === "zh" ? c.nemuZh : c.nemuEn }));
  return (
    <div>
      <CaseV3Shell
        locale={locale}
        caseNumber="09"
        channelNo={v3Slot("09")}
        previousChannelNo={v3Slot(previous.number)}
        nextChannelNo={v3Slot(next.number)}
        switchHref={caseHref("09", locale === "zh" ? "en" : "zh")}
        chapters={chapters}
        moreLine={CASE_SYSTEM_NEMU[locale].more}
        askLine={CASE_SYSTEM_NEMU[locale].toc}
        prototypeHref={CASE09_LINKS.website}
        prototypeLabel={locale === "zh" ? "前往網站" : "Visit Website"}
        project={project}
        previousProject={previous}
        nextProject={next}
        publishedCount={seq.length}
      >
        <Case09Article locale={locale} />
      </CaseV3Shell>
    </div>
  );
}
