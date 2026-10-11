import type { Locale } from "@/data/locale";

/*
 * V3 localized chapter labels for CASE05–07 (by chapter number) — the one
 * source for the section eyebrow and the Remote. The legacy labels were
 * English on ZH routes and all-caps on EN routes. 02 is approved (2026-10-10);
 * the other ZH labels are proposed translations pending Angela's review
 * ("設計挑戰 / 設計決策" follow the approved CASE03 labels). Chapter structure and numbering are unchanged.
 */
const COMMON = {
  "01": { zh: "設計挑戰", en: "The Challenge" },
  "02": { zh: "我的角色與方法", en: "My Role & Approach" }, // APPROVED by Angela 2026-10-10
  "04": { zh: "設計決策", en: "Key Design Decisions" },
  "05": { zh: "成果", en: "Outcome" },
};

export const V3_CASE_LABELS: Record<"05" | "06" | "07", Record<string, Record<Locale, string>>> = {
  "05": { ...COMMON, "03": { zh: "系統流程", en: "System Flow" } },
  "06": { ...COMMON, "03": { zh: "App × CMS 流程", en: "App × CMS Flow" } },
  "07": { ...COMMON, "03": { zh: "App 架構與使用流程", en: "App Structure & User Flow" } },
};

export function v3Labels(caseNo: "05" | "06" | "07", locale: Locale): Record<string, string> {
  return Object.fromEntries(Object.entries(V3_CASE_LABELS[caseNo]).map(([no, l]) => [no, l[locale]]));
}
