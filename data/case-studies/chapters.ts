import type { Locale } from "@/data/locale";

/*
 * CASE System V3 (§4, §6) — the single chapter source for CASE01 / 02 / 04.
 * The section eyebrow, the Remote directory, the counter and the anchor ids
 * all read from here. `zh` / `en` are the page-language labels (EN reuses the
 * original /en V2 strings in title case; proper nouns untranslated). `nemu*`
 * are the approved Nemu lines, which only restate content already on the page.
 * CASE03 keeps its own approved data (case03.ts).
 */
export type CaseChapterDef = { no: string; anchor: string; zh: string; en: string; nemuZh: string; nemuEn: string };

export const CASE_SYSTEM_CHAPTERS: Record<"01" | "02" | "04", CaseChapterDef[]> = {
  "01": [
    { no: "00", anchor: "ov", zh: "專案總覽", en: "Case Overview", nemuZh: "這是 CH01 的案例。可以直接往下讀，或從這裡跳到想看的段落。", nemuEn: "This is CH01. Read straight through, or jump to a section from here." },
    { no: "01", anchor: "c1", zh: "設計挑戰", en: "The Challenge", nemuZh: "不只是線上商店：商品要從台灣送到越南倉庫，才進入共享庫存。", nemuEn: "Not just an online store: products travel from Taiwan to a warehouse in Vietnam before they reach shared inventory." },
    { no: "02", anchor: "c2", zh: "設計方法", en: "The Approach", nemuZh: "先建立產品邏輯，再進入介面。這裡是五個層次。", nemuEn: "Product logic first, interface second. Here are the five layers." },
    { no: "03", anchor: "c3", zh: "系統設計", en: "Designing the System", nemuZh: "共享庫存與定價規則，是這套系統最複雜的部分。", nemuEn: "Shared inventory and pricing rules are the most complex part of this system." },
    { no: "04", anchor: "c4", zh: "設計到交付", en: "From Design to Delivery", nemuZh: "主要設計完成後，我持續支援到產品交付。", nemuEn: "After the main design, I kept supporting the team through delivery." },
    { no: "05", anchor: "c5", zh: "成果", en: "Outcome", nemuZh: "這段是成果：可運作的產品，而不是概念作品。", nemuEn: "The outcome: a working product, not a concept." },
  ],
  "02": [
    { no: "00", anchor: "ov", zh: "專案總覽", en: "Case Overview", nemuZh: "這是 CH02 的案例：三個網站，三種產業。", nemuEn: "This is CH02: three websites, three industries." },
    { no: "01", anchor: "c1", zh: "總覽", en: "Overview", nemuZh: "先看三個專案，以及我在各專案中的角色。", nemuEn: "First, the three projects and my role in each." },
    { no: "02", anchor: "c2", zh: "從商業需求到網站架構", en: "From Business Needs to Web Structure", nemuZh: "同樣是網站，資訊的優先順序卻不一樣。", nemuEn: "Same medium, different information priorities." },
    { no: "03", anchor: "c3", zh: "專案故事", en: "Project Stories", nemuZh: "三個專案故事，依序是 SDX、Charming Clinic、NATEX。", nemuEn: "Three project stories: SDX, Charming Clinic, then NATEX." },
    { no: "04", anchor: "c4", zh: "同一原則，不同表現", en: "One Principle, Different Expressions", nemuZh: "同一個設計原則，在三個品牌上有不同表達。", nemuEn: "One design principle, expressed differently for each brand." },
    { no: "05", anchor: "c5", zh: "跨裝置設計", en: "Designing Beyond Desktop", nemuZh: "跨裝置不是縮小，而是重新安排資訊順序。", nemuEn: "Cross-device isn't shrinking. It's reordering." },
    { no: "06", anchor: "c6", zh: "我在各專案中的角色", en: "My Role Across the Projects", nemuZh: "這張表整理了我在三個專案中的交付範圍。", nemuEn: "This table shows what I delivered on each project." },
    { no: "07", anchor: "c7", zh: "反思", en: "Reflection", nemuZh: "最後，是這三個專案的反思。", nemuEn: "Finally, a reflection on all three." },
  ],
  "04": [
    // CASE04 five-section structure (Angela, 2026-10-12): 00–04, exact ZH/EN labels.
    { no: "00", anchor: "ov", zh: "專案總覽", en: "Project Overview", nemuZh: "這是 LABO65 的案例。可以先操作 App 互動原型，或往下閱讀。", nemuEn: "This is the LABO65 case. Try the interactive app prototype first, or keep reading." },
    { no: "01", anchor: "c1", zh: "設計挑戰", en: "The Challenge", nemuZh: "我接手時產品已經可以運作，問題是體驗沒有串起來。", nemuEn: "The product already worked when I joined; the experience didn't hold together." },
    { no: "02", anchor: "c2", zh: "我的角色與方法", en: "My Role & Approach", nemuZh: "這段說明我主導的部分，以及和誰一起完成。", nemuEn: "What I led, and who I worked with." },
    { no: "03", anchor: "c3", zh: "關鍵設計決策", en: "Key Design Decisions", nemuZh: "三個關鍵決策：引導式輸入、狀態導向首頁、連續的產品旅程。", nemuEn: "Three key decisions: guided input, a state-aware Home, one connected journey." },
    { no: "04", anchor: "c4", zh: "設計成果", en: "Outcome", nemuZh: "最後是實際交付的內容，以及目前的狀態。", nemuEn: "Finally, what was delivered and where it stands." },
  ],

};

/** Shared Nemu lines (§6): after the last chapter, and the directory prompt. */
export const CASE_SYSTEM_NEMU: Record<Locale, { more: string; toc: string }> = {
  zh: { more: "這個案例看完了。要換下一台嗎？", toc: "想跳到哪一段？" },
  en: { more: "That's the end of this case. Switch to the next channel?", toc: "Where would you like to jump?" },
};

export const chapterLabel = (c: CaseChapterDef, locale: Locale) => (locale === "zh" ? c.zh : c.en);
export const chapterEyebrow = (c: CaseChapterDef, locale: Locale) => `${c.no} — ${chapterLabel(c, locale)}`;
