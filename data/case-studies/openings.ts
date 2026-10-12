import type { Locale } from "@/data/locale";

/*
 * CASE01 / CASE02 / CASE04 openings (hero) for the V3 CASE frame — copied
 * VERBATIM from production CaseStudyPrototype.tsx (origin/main 9e3982d):
 * displayTitle / zhTitleLines, subtitle (MixedText line), opening summary
 * paragraphs, Project Information rows and CASE04's outbound links. The hero
 * evidence and CASE01 demo links are rendered by their ORIGINAL components
 * (CaseOneProductPreview, CaseOneDemoLinks, CaseTwoHeroEvidence,
 * CaseFourHeroEvidence) — not copied.
 */

export type CaseOpening = {
  title: string;
  titleLines: string[] | null;
  subtitle: string;
  summary: string[];
  /** CASE01: the first opening paragraph is the lead tier (17–18px). */
  leadFirst?: boolean;
  infoRows: { label: string; value: string; accent?: boolean }[];
  links?: { href: string; label: string }[];
};

export const CASE_OPENINGS: Record<"01" | "02" | "04", Record<Locale, CaseOpening>> = {
  "01": {
    zh: {
      title: "跨境寄賣與直播⁠電商⁠平台",
      titleLines: ["跨境寄賣與", "直播電商平台"],
      subtitle: "將客戶的商業構想，轉換成一套可實際運作的多角色電商平台",
      summary: [
        "客戶希望建立一套跨境寄賣與直播電商平台，串接台灣供應商、越南當地倉儲、銷售角色與消費者。",
        "產品需要涵蓋從商品入庫、共享庫存、定價與販售，到訂單、履約與後續結算的完整流程，並支援不同角色的操作需求。",
        "我的工作是將客戶的商業需求整理成清楚的產品架構、操作流程、互動邏輯與介面，讓工程團隊能進一步實作。",
      ],
      leadFirst: true,
      infoRows: [
        { label: "角色", value: "UI/UX Designer" },
        { label: "時程", value: "2025.05 — 2026.04 · 12 個月" },
        { label: "範疇", value: "Product Architecture · Information Architecture · UX Flow · Interaction Design · UI Design · Prototype · Developer Handoff" },
        { label: "團隊", value: "UI/UX Designer · UI Designer · 2 Engineers · PM（2025.10 加入）" },
        { label: "狀態", value: "Designed & Developed", accent: true },
      ],
    },
    en: {
      title: "Cross-border Live Commerce Platform",
      titleLines: null,
      subtitle: "Turning a client-funded business concept into a working multi-role commerce platform",
      summary: [
        "The client wanted to build a cross-border consignment and live-commerce platform connecting suppliers in Taiwan with warehouse operations, sellers, and consumers in Vietnam.",
        "The product needed to support the full journey from product intake and shared inventory to pricing, selling, ordering, fulfillment, and settlement across multiple roles.",
        "My role was to translate the business concept and client requirements into a clear product structure, workflows, interaction logic, and interfaces that the engineering team could implement.",
      ],
      leadFirst: true,
      infoRows: [
        { label: "Role", value: "UI/UX Designer" },
        { label: "Timeline", value: "May 2025 — Apr 2026 · 12 months" },
        { label: "Scope", value: "Product Architecture · Information Architecture · UX Flow · Interaction Design · UI Design · Prototype · Developer Handoff" },
        { label: "Team", value: "UI/UX Designer · UI Designer · 2 Engineers · PM (joined Oct 2025)" },
        { label: "Status", value: "Designed & Developed", accent: true },
      ],
    },
  },
  "02": {
    zh: {
      title: "品牌與網站體驗",
      titleLines: ["品牌與網站體驗"],
      subtitle: "Shun De Xing · Charming Clinic · NATEX",
      summary: ["為企業服務、醫療美容與科技產業品牌，打造清楚且值得信任的數位體驗。"],
      infoRows: [
        { label: "案例", value: "SDX · Charming Clinic · NATEX" },
        { label: "策略", value: "資訊架構" },
        { label: "設計", value: "UX/UI 設計 · 品牌溝通" },
        { label: "交付", value: "響應式網頁" },
      ],
    },
    en: {
      title: "Brand & Web Experience",
      titleLines: null,
      subtitle: "Shun De Xing · Charming Clinic · NATEX",
      summary: ["Designing clear, credible digital experiences across corporate, healthcare, and technology brands."],
      infoRows: [
        { label: "Projects", value: "SDX · Charming Clinic · NATEX" },
        { label: "Strategy", value: "Information Architecture" },
        { label: "Design", value: "UX/UI Design · Brand Communication" },
        { label: "Delivery", value: "Responsive Web" },
      ],
    },
  },
  "04": {
    zh: {
      title: "行動療癒產品",
      titleLines: null,
      subtitle: "在產品已進入開發的階段接手 UX/UI，重新整理流程、狀態與介面，讓體驗更清楚、更輕量，也更符合行動應用的使用方式。",
      summary: [
        "這是一款根據個人資料與每日輸入內容，產生個人化聲音體驗的行動產品。",
        "我加入專案時，工程師已完成一版可運作的早期產品。我接手後負責 UX/UI 重整，重新梳理核心流程、定義互動與錯誤恢復狀態，並建立可重複使用的介面規則，作為 Android-first 行動體驗的設計基礎。",
      ],
      infoRows: [
        { label: "角色", value: "UI/UX Designer" },
        { label: "公司", value: "鈁象數位行銷顧問有限公司" },
        { label: "團隊", value: "PM · Full-stack Engineer · UI/UX Designer" },
        { label: "平台", value: "Android 優先（iOS 共用核心方向）" },
        { label: "週期", value: "約 1–2 個月" },
        { label: "Web", value: "staging 版本已可使用" },
        { label: "App", value: "上架準備中" },
      ],
      // Approved narrow confidentiality exceptions (see production
      // CaseStudyPrototype.tsx): these outbound hrefs carry the real product
      // name; all portfolio copy stays anonymized. The employer's company
      // name (公司 row) is approved for public display (2026-10-12); the
      // product name is not. The App prototype opens at its login screen
      // (the V2 build pre-fills the demo account).
      links: [
        { href: "https://staging-app.labo65.com/", label: "查看 Web Staging Build ↗" },
        { href: "https://labo65-app.vercel.app/auth/login", label: "操作 App 互動原型 ↗" },
        { href: "https://labo65-landing.vercel.app/", label: "查看 Landing Page 原型 ↗" },
      ],
    },
    en: {
      title: "Mobile Wellness Product",
      titleLines: null,
      subtitle: "Took over UX/UI after development was already underway, restructuring flows, states, and interfaces into a clearer, lighter, more app-native experience.",
      summary: [
        "A mobile wellness product that generates personalized audio experiences from personal profile information and daily inputs.",
        "When I joined, an early functional version had already been built by the engineer. I took over the UX/UI redesign, restructuring the core journey, defining interaction and recovery states, and establishing a reusable interface system for an Android-first mobile experience.",
      ],
      infoRows: [
        { label: "Role", value: "UI/UX Designer" },
        { label: "Company", value: "鈁象數位行銷顧問有限公司" },
        { label: "Team", value: "PM · Full-stack Engineer · UI/UX Designer" },
        { label: "Platform", value: "Android-first (shared core direction with iOS)" },
        { label: "Timeline", value: "Approx. 1–2 months" },
        { label: "Web", value: "Staging build available" },
        { label: "App", value: "Preparing for release" },
      ],
      links: [
        { href: "https://staging-app.labo65.com/", label: "View Web Staging Build ↗" },
        { href: "https://labo65-app.vercel.app/auth/login", label: "Try the Interactive App Prototype ↗" },
        { href: "https://labo65-landing.vercel.app/", label: "View Landing Page Prototype ↗" },
      ],
    },
  },
};

/**
 * Chapter registry. `title` = each chapter's heading verbatim from the case's
 * own content component. `label` = the V3 localized chapter label (one source
 * for the section eyebrow, the Remote and the anchors — SectionLabelContext).
 * The original component labels were English on ZH routes and all-caps on EN
 * routes; ZH labels here are PROPOSED translations pending Angela's review
 * ("設計挑戰" / "Case Overview" family follow the approved CASE03 labels).
 */
export type CaseChapterSource = { no: string; label: Record<Locale, string>; title: Record<Locale, string> };

export const CASE_CHAPTERS: Record<"01" | "02" | "04", CaseChapterSource[]> = {
  "01": [
    { no: "01", label: { zh: "設計挑戰", en: "The Challenge" }, title: { zh: "不只是一個線上商店", en: "More than an online store" } },
    { no: "02", label: { zh: "設計方法", en: "The Approach" }, title: { zh: "先建立產品邏輯，再進入介面設計", en: "From business rules to product structure" } },
    { no: "03", label: { zh: "系統設計", en: "Designing the System" }, title: { zh: "讓複雜的營運規則變得容易理解", en: "Making complex operations understandable" } },
    { no: "04", label: { zh: "從設計到交付", en: "From Design to Delivery" }, title: { zh: "從主要設計完成，一路支援到產品交付", en: "Supporting the product through implementation" } },
    { no: "05", label: { zh: "成果", en: "Outcome" }, title: { zh: "完成可運作的產品，而不是概念作品", en: "A working product, without fabricated metrics" } },
  ],
  "02": [
    { no: "02", label: { zh: "總覽", en: "Overview" }, title: { zh: "三個網站，三種不同的商業情境。", en: "Three websites. Three different business contexts." } },
    { no: "03", label: { zh: "從商業需求到網站架構", en: "From Business Needs to Web Structure" }, title: { zh: "不同的業務，需要不同的資訊優先順序", en: "Different Businesses, Different Information Priorities" } },
    { no: "04", label: { zh: "專案故事", en: "Project Stories" }, title: { zh: "整理龐大的企業服務內容", en: "Organizing a Complex Corporate Offering" } },
    { no: "05", label: { zh: "同一原則，不同表現", en: "One Principle, Different Expressions" }, title: { zh: "同一個設計原則，依品牌目標形成不同表達", en: "Shared Principles, Different Expressions" } },
    { no: "06", label: { zh: "跨裝置設計", en: "Designing Beyond Desktop" }, title: { zh: "跨裝置保留正確的資訊順序與行動", en: "Designing Beyond Desktop" } },
    { no: "07", label: { zh: "我在各專案中的角色", en: "My Role Across the Projects" }, title: { zh: "相同的設計責任，不同的交付範圍", en: "My Role Across the Projects" } },
    { no: "08", label: { zh: "反思", en: "Reflection" }, title: { zh: "有效的網頁設計，不是把同一種視覺風格套用在所有地方。", en: "Effective web design isn’t about applying one visual style everywhere." } },
  ],
  "04": [
    { no: "01", label: { zh: "挑戰與我的角色", en: "The Challenge & My Role" }, title: { zh: "在既有產品上重新建立完整體驗", en: "Redesigning an Existing Product Without Starting Over" } },
    { no: "02", label: { zh: "從長問卷到引導式輸入", en: "From Long Form to Guided Input" }, title: { zh: "把一個連續問卷重新整理成分階段流程", en: "Turning One Continuous Questionnaire Into a Staged Experience" } },
    { no: "03", label: { zh: "狀態導向的產品設計", en: "Designing a State-Aware Product" }, title: { zh: "不只設計成功流程，也處理等待、失敗與返回", en: "The Experience Had to Work Beyond the Happy Path" } },
    { no: "04", label: { zh: "串連產品旅程", en: "Connecting the Product Journey" }, title: { zh: "把不同功能串成一套連續產品流程", en: "Connecting the Experience Into One Continuous Journey" } },
    { no: "05", label: { zh: "可重用系統與行動裝置限制", en: "Reusable System & Mobile Constraints" }, title: { zh: "從實際行動裝置限制建立可重複使用的設計規則", en: "Reusable Rules Shaped by Real Mobile Constraints" } },
    { no: "06", label: { zh: "交付成果", en: "Delivery" }, title: { zh: "這次重新設計完成了什麼", en: "What the Redesign Delivered" } },
  ],
};
