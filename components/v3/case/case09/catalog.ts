import type { CatalogCase } from "@/data/v3/catalog-types";

/*
 * CASE09 — 遠見房屋 Foresight Realtors (website + App), shown as CH08.
 *
 * Content source: ch-08-foresight-plan.md (confirmed with Angela). The EN
 * strings are draft translations of the approved ZH — no added facts —
 * pending Angela's review. Metadata follows the CASE05–07 convention
 * (Role + Platform, no status).
 */
const EVIDENCE = "/images/case09/evidence";

export const CASE09_CATALOG: CatalogCase = {
  id: "foresight-realtors",
  number: "09",
  slug: "foresight-realtors",
  year: "2022",
  title: { zh: "不動產官網與找屋 App", en: "Real Estate Website & Home-Search App" },
  category: { zh: "不動產平台", en: "Real Estate Platform" },
  description: {
    zh: "為台中在地房仲設計官網與 App，把大量物件資訊整理成跨平台一致、好搜尋、好比較的找屋體驗。",
    en: "A website and App for a Taichung real estate agency, making a large volume of listings easy to search and compare.",
  },
  meta: {
    zh: [
      { label: "角色", value: "UI/UX Front-end Designer" },
      { label: "平台", value: "Web · iOS / Android App" },
    ],
    en: [
      { label: "Role", value: "UI/UX Front-end Designer" },
      { label: "Platform", value: "Web · iOS / Android App" },
    ],
  },
  image: { src: `${EVIDENCE}/foresight-home-desktop.webp`, crop: "50% 40%" },
  navImage: `${EVIDENCE}/foresight-app-home.webp`,
  indexImage: `${EVIDENCE}/foresight-home-desktop.webp`,
};

/** Live destinations (plan §03A / §03D). */
export const CASE09_LINKS = {
  website: "https://www.foresightrealtors.com.tw/",
  appStore: "https://apps.apple.com/us/app/%E9%81%A0%E8%A6%8B%E6%88%BF%E5%B1%8B/id6444819590",
} as const;
