import type { Locale } from "@/data/locale";

/**
 * Real Case01 media evidence, mapped to the specific real-content section
 * each image actually supports — kept out of data/projects.ts so this
 * stays scoped to the prototype routes rather than changing what the
 * production Case Study template renders. Source files are never
 * modified, only referenced by their existing public/ path.
 *
 * Mapping rationale (content -> evidence, not "insert because it exists"):
 * - Overview: CE = the ecosystem diagram covering supply/sales/consumer
 *   ends — the same three-part structure the overview paragraph describes.
 * - Decision 0 "Shared inventory" (共享庫存): ISF = the inventory-state-flow
 *   diagram (physical -> digital -> decision -> consumer impact).
 * - Decision 1 "Pricing rules" (定價規則): PRL = the pricing/revenue logic
 *   diagram (pricing input -> validation -> settlement).
 * - Diagrams are the corrected *02 assets shared with the case01-v3 page
 *   (commit 6992855). The old Backend-state -> Consumer diagram (BE) is
 *   intentionally unmapped: it made inaccurate overselling / concurrency
 *   claims and has no corrected version.
 * - finalUI: the standalone showcase asset, given the stronger treatment
 *   the brief explicitly sanctions for it.
 *
 * Round 11 (bilingual Case Final): every one of these diagrams (except the
 * finalUI showcase screenshot) has a real *_eng01 asset already sitting in
 * public/images/case01/ — pre-drawn with English labels, not a translated
 * overlay. Everything below is now keyed by locale so the English route
 * shows the real English diagram, not a Chinese-labeled image with an
 * English caption bolted on. Decisions are keyed by their position in the
 * decisions array (0-3), not by heading text — the heading itself differs
 * between data/projects.ts's `caseStudy` (zh) and `caseStudyEn` (en)
 * objects, but the underlying evidence and its slot in the sequence does
 * not. Captions/alts are short descriptive labels for the image, not
 * project narrative — translated directly from the existing zh captions,
 * nothing new claimed.
 */

export type CaseFinalFigure = {
  src: string;
  alt: string;
  figureNumber: string;
  caption: string;
};

const overviewFigureByLocale: Record<Locale, CaseFinalFigure> = {
  zh: {
    src: "/images/case01/case01_CE_chi02.webp",
    alt: "跨境直播電商生態系統：供應端、銷售端、消費端的完整流程圖",
    figureNumber: "Fig. 01",
    caption: "跨境直播電商生態系統 — 供應端 · 銷售端 · 消費端",
  },
  en: {
    src: "/images/case01/case01_CE_eng02.webp",
    alt: "Cross-border live commerce ecosystem: the complete flow across supply, sales, and consumer ends",
    figureNumber: "Fig. 01",
    caption: "Cross-Border Live Commerce Ecosystem — Supply · Sales · Consumer",
  },
};

const showcaseFigureByLocale: Record<Locale, CaseFinalFigure> = {
  zh: {
    src: "/images/case01/case01_inventory_showcase_sample.webp",
    alt: "共享庫存後台介面，顯示商品列表、庫存狀態與篩選功能",
    figureNumber: "Fig. 05",
    caption: "連結實體庫存與數位商品狀態 — 共享庫存後台",
  },
  en: {
    // No dedicated *_eng01 asset for this UI screenshot (unlike the
    // diagrams above) — same real image, English caption only.
    src: "/images/case01/case01_inventory_showcase_sample.webp",
    alt: "Shared inventory backend interface, showing the product list, stock status, and filters",
    figureNumber: "Fig. 05",
    caption: "Connecting Physical Inventory with Digital Product States — Shared Inventory Backend",
  },
};

const decisionFiguresByLocale: Record<Locale, Record<number, CaseFinalFigure>> = {
  zh: {
    0: {
      src: "/images/case01/case01_ISF_chi02.webp",
      alt: "庫存狀態流程圖：實體商品流程、數位庫存建立、庫存決策機制、對消費者的影響",
      figureNumber: "Fig. 02",
      caption: "庫存狀態流程",
    },
    1: {
      src: "/images/case01/case01_PRL_chi02.webp",
      alt: "定價與收益邏輯圖：定價設定、系統驗證與收益判定、收益分配與結算",
      figureNumber: "Fig. 03",
      caption: "定價與收益邏輯",
    },
  },
  en: {
    0: {
      src: "/images/case01/case01_ISF_eng02.webp",
      alt: "Inventory state flow diagram: physical product flow, digital inventory creation, inventory decision logic, and consumer impact",
      figureNumber: "Fig. 02",
      caption: "Inventory State Flow",
    },
    1: {
      src: "/images/case01/case01_PRL_eng02.webp",
      alt: "Pricing and revenue logic diagram: pricing setup, system validation and revenue determination, revenue distribution and settlement",
      figureNumber: "Fig. 03",
      caption: "Pricing and Revenue Logic",
    },
  },
};

export function getOverviewFigure(locale: Locale): CaseFinalFigure {
  return overviewFigureByLocale[locale];
}

export function getShowcaseFigure(locale: Locale): CaseFinalFigure {
  return showcaseFigureByLocale[locale];
}

export function getDecisionFigure(locale: Locale, decisionIndex: number): CaseFinalFigure | undefined {
  return decisionFiguresByLocale[locale][decisionIndex];
}
