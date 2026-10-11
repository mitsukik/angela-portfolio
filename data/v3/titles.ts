import type { Locale } from "@/data/locale";
import type { Project } from "@/data/projects";

/*
 * V3 display titles — the INDEX channel title, which the CASE bottom
 * navigation must match (CASE_SYSTEM.md §2 #9, §7.1). CASE02's approved ZH
 * channel title is 「企業品牌形象網站 ×3」 (Index V3 / IndexV3MobileScreen /
 * Work TV Channel prototypes); every other title is the project record's.
 */
const OVERRIDES: Record<string, Partial<Record<Locale, string>>> = {
  "02": { zh: "企業品牌形象網站 ×3" },
};

export function v3Title(project: Pick<Project, "number" | "title" | "chineseTitle">, locale: Locale): string {
  return OVERRIDES[project.number]?.[locale] ?? (locale === "zh" ? project.chineseTitle : project.title);
}
