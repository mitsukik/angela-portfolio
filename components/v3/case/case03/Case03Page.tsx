import { notFound } from "next/navigation";
import type { Locale } from "@/data/locale";
import { getProjectBySlug } from "@/data/projects";
import { caseHref } from "@/data/v3/channel-routes";
import { v3Neighbours, v3Sequence, v3Slot } from "@/data/v3/sequence";
import { CASE03_NAV_LABELS, CASE03_NEMU, CASE03_PROTOTYPE_URL, type Case03ChapterId } from "@/data/case-studies/case03";
import { CaseV3Shell, type CaseV3Chapter } from "../CaseV3Shell";
import { Case03Article } from "./Case03Article";

const SLUG = "iot-system";
const ORDER: Case03ChapterId[] = ["ov", "c1", "c2", "c3", "c4", "c5"];

/** CASE03 V3 page (server). Chapter registry is built from CASE03's own content. */
export function Case03Page({ locale }: { locale: Locale }) {
  const project = getProjectBySlug(SLUG);
  if (!project) notFound();
  const chapters: CaseV3Chapter[] = ORDER.map((id, i) => ({
    id,
    no: String(i).padStart(2, "0"),
    label: CASE03_NAV_LABELS[locale][id],
    line: CASE03_NEMU[locale][id],
  }));
  return (
    <div>
      <CaseV3Shell
        locale={locale}
        caseNumber={project.number}
        channelNo={v3Slot(project.number)}
        previousChannelNo={v3Slot(v3Neighbours(project).previous.number)}
        nextChannelNo={v3Slot(v3Neighbours(project).next.number)}
        switchHref={caseHref(project.number, locale === "zh" ? "en" : "zh")}
        chapters={chapters}
        moreLine={CASE03_NEMU[locale].more}
        prototypeHref={CASE03_PROTOTYPE_URL}
        project={project}
        previousProject={v3Neighbours(project).previous}
        nextProject={v3Neighbours(project).next}
        publishedCount={v3Sequence().length}
      >
        <Case03Article locale={locale} project={project} />
      </CaseV3Shell>
    </div>
  );
}
