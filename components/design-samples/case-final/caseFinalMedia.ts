/**
 * Real Case01 media evidence, mapped to the specific real-content section
 * each image actually supports — kept out of data/projects.ts so this
 * stays scoped to the prototype routes rather than changing what the
 * production Case Study template renders. Source files are never
 * modified, only referenced by their existing public/ path.
 *
 * Mapping rationale (content -> evidence, not "insert because it exists"):
 * - Overview ("跨境寄賣與直播電商平台"): CE = the ecosystem diagram
 *   ("跨境直播電商生態系統") covering supply/sales/consumer ends — the
 *   same three-part structure the overview paragraph describes.
 * - Decision "連結實體庫存與數位商品狀態": ISF = the inventory-state-flow
 *   diagram (physical -> digital -> decision -> consumer impact) — this
 *   decision is literally about that flow.
 * - Decision "在彈性定價與商業規則之間取得平衡": PRL = the pricing/revenue
 *   logic diagram (pricing input -> validation -> settlement).
 * - Decision "設計 Happy Path 之外的系統狀態": BE = the diagram showing how
 *   backend state blocks/recovers checkout — the exact "beyond happy path"
 *   states that decision describes.
 * - Decision "建立多角色協作的產品模型" intentionally has no dedicated
 *   image: its content is already the CE diagram's subject in Overview,
 *   and repeating the same image would violate "don't insert an image
 *   because it exists."
 * - finalUI: the standalone showcase asset, given the stronger treatment
 *   the brief explicitly sanctions for it.
 *
 * Only the *_chi01 variants are used — these prototypes render in
 * Traditional Chinese (matching the rest of the site's default), so the
 * *_eng01 variants are not shown per "don't mechanically show both
 * language versions unless the narrative benefits from the comparison."
 * The *_eng01 assets remain available in public/images/case01/ for a
 * future English route variant.
 */

export type CaseFinalFigure = {
  src: string;
  alt: string;
  figureNumber: string;
  caption: string;
};

export const overviewFigure: CaseFinalFigure = {
  src: "/images/case01/case01_CE_chi01.png",
  alt: "跨境直播電商生態系統：供應端、銷售端、消費端的完整流程圖",
  figureNumber: "Fig. 01",
  caption: "跨境直播電商生態系統 — 供應端 · 銷售端 · 消費端",
};

export const showcaseFigure: CaseFinalFigure = {
  src: "/images/case01/case01_inventory_showcase_sample.png",
  alt: "共享庫存後台介面，顯示商品列表、庫存狀態與篩選功能",
  figureNumber: "Fig. 05",
  caption: "連結實體庫存與數位商品狀態 — 共享庫存後台",
};

/** Keyed by the exact real (zh) decision heading in data/projects.ts. */
export const decisionFigures: Record<string, CaseFinalFigure> = {
  連結實體庫存與數位商品狀態: {
    src: "/images/case01/case01_ISF_chi01.png",
    alt: "庫存狀態流程圖：實體商品流程、數位庫存建立、庫存決策機制、對消費者的影響",
    figureNumber: "Fig. 02",
    caption: "庫存狀態流程",
  },
  在彈性定價與商業規則之間取得平衡: {
    src: "/images/case01/case01_PRL_chi01.png",
    alt: "定價與收益邏輯圖：定價設定、系統驗證與收益判定、收益分配與結算",
    figureNumber: "Fig. 03",
    caption: "定價與收益邏輯",
  },
  "設計 Happy Path 之外的系統狀態": {
    src: "/images/case01/case01_BE_chi01.png",
    alt: "後台狀態如何影響消費者體驗：庫存驗證失敗時結帳被阻止並提供恢復路徑",
    figureNumber: "Fig. 04",
    caption: "後台狀態如何影響消費者體驗",
  },
};
