import type { CaseChapterDef } from "@/data/case-studies/chapters";

/*
 * CASE09 chapters 00–04 (Angela 2026-11-03: merged from the handoff's 00–07 —
 * 總覽 + 架構 → 使用者與入口; 專案故事 + 跨平台 → 設計決策; 角色 + 原型驗證 →
 * 我的角色與方法, the approved CASE05–07 label). Nemu lines name the case as
 * CH09; the shell rewrites CHnn to the visible channel slot (CH08). ZH 00 line
 * is from the plan; other lines and all EN are drafts.
 */
export const CASE09_CHAPTERS: CaseChapterDef[] = [
  { no: "00", anchor: "ov", zh: "專案總覽", en: "Project Overview", nemuZh: "這是 CH09 的案例：同一個房仲品牌，官網加 App 兩個平台。", nemuEn: "This is CH09: one real estate brand, a website and an App." },
  { no: "01", anchor: "c1", zh: "使用者與入口", en: "Audiences & Entry Points", nemuZh: "三種來訪目的，三種不同的入口。", nemuEn: "Three reasons to visit, three different entry points." },
  { no: "02", anchor: "c2", zh: "設計決策", en: "Key Design Decisions", nemuZh: "五個決策：搜尋、物件卡片、會員、App，以及跨平台。", nemuEn: "Five decisions: search, listing cards, membership, the App, and cross-platform." },
  { no: "03", anchor: "c3", zh: "我的角色與方法", en: "My Role & Approach", nemuZh: "我負責的範圍，以及用原型和客戶收斂需求的方法。", nemuEn: "What I owned, and how prototypes helped the client settle the requirements." },
  { no: "04", anchor: "c4", zh: "反思", en: "Reflection", nemuZh: "最後，是這個專案的反思。", nemuEn: "Finally, a reflection on the project." },
];
