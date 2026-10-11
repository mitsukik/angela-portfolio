import type { Locale } from "@/data/locale";

/**
 * CASE05–07 — earlier real projects, kept out of `projects.ts` (which drives
 * the CASE01–04 records).
 *
 * Content rule: every value below comes from the original project material
 * and the approved copy, used VERBATIM — do not rewrite, strengthen, or add
 * launch / deployment / metric language. Metadata is Role + Platform, plus
 * CASE05's confirmed status (正式導入 / In Production).
 *
 * `LEGACY_CASES_ENABLED` is a legacy flag kept for compatibility; nothing
 * reads it.
 */
export const LEGACY_CASES_ENABLED = process.env.NODE_ENV !== "production";

export type LegacyCaseDevState =
  /** Index row only — no case page exists yet, so the drawer shows no link. */
  | "index-only"
  /** Case page exists. */
  | "page";

type Localized = Record<Locale, string>;

export type LegacyCase = {
  id: string;
  number: string;
  slug: string;
  /** Local development state — never rendered in production (gate above). */
  devState: LegacyCaseDevState;
  content: "draft" | "approved";
  year: string;
  title: Localized;
  category: Localized;
  /** Drawer intro: what it was + what Angela did, one or two lines. */
  description: Localized;
  /** Same label convention as CASE01–04 (角色 / 平台 / 狀態 · Role / Platform / Status). */
  meta: Record<Locale, { label: string; value: string }[]>;
  /** Same lime "live" dot rule as CASE01–04 (verified real use only). */
  statusTone?: "live";
  /** "earlier-work" = deliberately shorter case page format. */
  format: "case" | "earlier-work";
  /** Home preview (hover + drawer, 4:3 cover) — an existing reconstructed
   * asset from the case's primary slot, served from /legacy-assets.
   * `crop` is the CSS object-position. */
  image?: { src: string; crop: string };
  /** Case-footer next-project thumbnail (3:4, object-contain). Defaults to
   * `image.src`; wide boards use a 3:4 crop of the same capture. */
  navImage?: string;
  /** Restrained format marker for the index row + drawer kicker. */
  marker?: Localized;
};

// Plain literals only (no helper calls): production builds must be able to
// drop this whole array, and the bundler keeps function calls it cannot
// prove pure. Role + Platform = the same drawer pair as CASE01–04 (Platform
// from the approved case-page metadata).

export const legacyCases: LegacyCase[] = [
  {
    id: "05",
    number: "05",
    slug: "bakery-operations-system",
    devState: "page",
    content: "approved",
    format: "case",
    year: "2023",
    title: { zh: "烘焙生產與營運系統", en: "Bakery Production & Operations System" },
    // Index category distinguishes it from CASE03 (title unchanged).
    category: { zh: "生產現場 UX", en: "Production Floor UX" },
    description: {
      zh: "將原本以白板呈現的生產資訊轉為數位看板，並延伸到生產站、排程管理與跨裝置介面。設計重點放在現場可讀性，以及延續既有工作與閱讀習慣。",
      en: "Turning whiteboard-based production information into a digital production board, with station, scheduling and cross-device interfaces. The design focused on floor readability while preserving familiar working and reading patterns.",
    },
    meta: {
      zh: [{ label: "角色", value: "UI/UX Front-end Designer" }, { label: "平台", value: "大型生產看板 · Tablet · Responsive Web" }, { label: "狀態", value: "正式導入" }],
      en: [{ label: "Role", value: "UI/UX Front-end Designer" }, { label: "Platform", value: "Large Production Dashboard · Tablet · Responsive Web" }, { label: "Status", value: "In Production" }],
    },
    statusTone: "live",
    image: { src: "/legacy-assets/case05/case05-board.webp", crop: "12% 30%" },
    navImage: "/legacy-assets/case05/case05-preview-portrait.webp",
  },
  {
    id: "06",
    number: "06",
    slug: "fashion-commerce-app-cms",
    devState: "page",
    content: "approved",
    format: "case",
    year: "2020",
    // Generic public title: the brand name must not appear in the index yet.
    title: { zh: "時尚購物 App 與管理後台", en: "Fashion Commerce App & CMS" },
    category: { zh: "消費電商", en: "Consumer Commerce" },
    description: {
      zh: "為時尚品牌設計購物 App 與管理後台，涵蓋商品、會員、購物袋／結帳與後台管理。透過快速原型與 PM、客戶確認流程，並完成基礎前端頁面。",
      en: "A fashion commerce app and CMS covering products, membership, bag/checkout flows and back-office management. Rapid prototypes were used with the PM and client to confirm flows, followed by basic front-end page implementation.",
    },
    meta: {
      zh: [{ label: "角色", value: "UI/UX Front-end Designer" }, { label: "平台", value: "Mobile · Web Admin" }, { label: "狀態", value: "已上線" }],
      en: [{ label: "Role", value: "UI/UX Front-end Designer" }, { label: "Platform", value: "Mobile · Web Admin" }, { label: "Status", value: "Live" }],
    },
    image: { src: "/legacy-assets/case06/case06-ldvk-home.webp", crop: "50% 38%" },
  },
  {
    id: "07",
    number: "07",
    slug: "smart-school-bag-iot-app",
    devState: "page",
    content: "approved",
    format: "case",
    year: "2022",
    title: { zh: "智慧書包 IoT App", en: "Smart School Bag IoT App" },
    category: { zh: "IoT 行動 App", en: "IoT Mobile" },
    description: {
      zh: "以地圖、歷史紀錄、回報設定與安全範圍等狀態，整理智慧書包的家長端操作流程。",
      en: "A parent-facing smart school-bag app built around map, history, reporting settings and safe-zone states.",
    },
    // Status removed and grandparents claim dropped (Angela, 2026-10-08):
    // launch status and that audience claim are unverified.
    meta: {
      zh: [{ label: "角色", value: "UI/UX Designer" }, { label: "平台", value: "Mobile App" }],
      en: [{ label: "Role", value: "UI/UX Designer" }, { label: "Platform", value: "Mobile App" }],
    },
    image: { src: "/legacy-assets/case07/case07-home.webp", crop: "50% 18%" },
  },
];
