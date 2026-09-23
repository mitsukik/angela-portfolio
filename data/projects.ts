export type ProjectMedia = {
  src: string;
  alt: string;
};

export type ProjectSection = {
  heading: string;
  title?: string;
  body: string | string[];
  points?: string[];
  supportingLine?: string;
  principle?: string;
  media?: ProjectMedia[];
};

export type ProjectCaseStudy = {
  displayTitle?: string;
  eyebrowTitle?: string;
  projectName?: string;
  summary: string;
  metadata: Record<string, string>;
  overview: ProjectSection;
  challenge: ProjectSection;
  role: ProjectSection;
  workflow: ProjectSection;
  decisions: ProjectSection[];
  finalUI: ProjectSection;
  outcome: ProjectSection;
  learnings?: ProjectSection;
  decisionsHeading?: string;
  nextProjectLabel?: string;
  nextProjectTitle?: string;
  backToSelectedWorkLabel?: string;
};

export type ProjectStageBackground = "dark" | "light";
/** Locked V3.1 alternating layout: which side the media column sits on
 * (text-left = text col then media col; media-left = reversed) — 01/03
 * text-left, 02/04 media-left, giving the required -> <- -> <- rhythm.
 * All four use the same 50/50 column split so media reads as a
 * consistent size across every project. */
export type ProjectStageColumn = "text-left" | "media-left";
/** Vertical anchor of both columns within the stage — each project keeps
 * its own choreography without changing the locked column rhythm above. */
export type ProjectStageVertical = "top" | "middle" | "bottom";
export type ProjectAccent = "acid" | "lavender";
export type ProjectHomeVisual = "system-cover" | "web-collage" | "operations-cover" | "phone-triptych";

export type Project = {
  id: string;
  slug: string;
  number: string;
  title: string;
  chineseTitle: string;
  tags: string[];
  description: string[];
  descriptionEn: string[];
  image: string;
  /** Approved, production-optimized visual used only by Home / Selected Work. */
  homeImage?: string;
  /** Approved real evidence used by the Home / Selected Work scene. */
  homeImages?: string[];
  homeVisual?: ProjectHomeVisual;
  alt: string;
  /** Selected Work pinned-stage presentation state — alternating black/white
   * registers (01 dark, 02 light, 03 dark, 04 light) per Angela's V3
   * direction: presentation contrast between project scenes, not a
   * user-facing theme toggle. */
  stageBackground: ProjectStageBackground;
  /** Per-project spatial composition inside the shared pinned stage — one
   * system, four distinct states, locked alternating column rhythm. */
  stageColumn: ProjectStageColumn;
  stageVertical: ProjectStageVertical;
  /** Per-project spotlight accent, ported from VER B's alternating
   * acid/lavender assignment (01 acid, 02 lavender, 03 acid, 04 lavender). */
  accent: ProjectAccent;
  /** Prototype-stage placeholder year, shown next to the title in the
   * Selected Work stage — not a claimed delivery date. */
  year: string;
  /** Short bilingual category label shown beside the project index number. */
  category: { zh: string; en: string };
  /** Bilingual label for the Home / Selected Work bottom project rail —
   * a distinct, deliberately short/compact slot independent of category
   * and title (their lengths diverge per project: 01/02 read like the
   * category, 03/04 read like the full title), so it is its own explicit
   * field rather than reusing either. */
  railLabel: { zh: string; en: string };
  caseStudy: ProjectCaseStudy;
  caseStudyEn?: ProjectCaseStudy;
};

const placeholderSections = {
  overview: {
    heading: "Project Overview",
    body: "A concise overview of the product context, audience, and project scope will be added here.",
  },
  challenge: {
    heading: "Problem / Challenge",
    body: "The core user and business challenges will be documented here with supporting context.",
  },
  role: {
    heading: "My Role",
    body: "Responsibilities, collaborators, and key contributions will be outlined here.",
  },
  workflow: {
    heading: "System / Workflow",
    body: "The product structure and primary workflow will be presented here as the case study develops.",
  },
  decisions: [
    {
      heading: "Clarify the Core Journey",
      body: "The first design decision and its rationale will be explained here.",
    },
    {
      heading: "Build a Consistent System",
      body: "The second design decision and its impact will be explained here.",
    },
  ],
  finalUI: {
    heading: "Final UI / Solution",
    body: "Final interface details and supporting product screens will be added here.",
  },
  outcome: {
    heading: "Outcome / Learnings",
    body: "Project outcomes, evidence, and key learnings will be summarized here.",
  },
} satisfies Omit<Project["caseStudy"], "summary" | "metadata">;

export const projects: Project[] = [
  {
    id: "01",
    slug: "complex-system",
    number: "01",
    stageBackground: "dark",
    stageColumn: "text-left",
    stageVertical: "top",
    accent: "acid",
    year: "2025–2026",
    category: { zh: "複雜系統", en: "COMPLEX SYSTEM" },
    railLabel: { zh: "複雜系統", en: "COMPLEX SYSTEM" },
    title: "Cross-border Live Commerce Platform",
    chineseTitle: "跨境寄賣與直播電商平台",
    tags: ["UI/UX Design", "Complex System", "B2B Platform", "Workflow"],
    description: [
      "整合跨境入庫、共享庫存、多角色銷售、訂單履約與角色權限，",
      "將複雜營運流程轉化為清楚、可實作的產品系統。",
    ],
    descriptionEn: [
      "Turning cross-border receiving, shared inventory, multi-role selling,",
      "order fulfillment, and permissions into a clear, buildable product system.",
    ],
    image: "/images/case01/evidence/case01-order-list.webp",
    homeImage: "/images/home/case01-home-visual.webp",
    homeVisual: "system-cover",
    alt: "Order management interface from the Complex System case study",
    // CASE01 content source of truth is CaseOneFinalContent.tsx + the
    // CASE01 hero in CaseStudyPrototype.tsx (case01-v3). These objects are
    // still serialized into the case page, so they mirror the same
    // confirmed facts in condensed form. `metadata` is ALSO what the Home
    // Selected Work card renders (role + 3 facts); its Role is the actual
    // project role, matching the case page hero (UI/UX Designer).
    caseStudy: {
      displayTitle: "複雜系統設計",
      eyebrowTitle: "COMPLEX SYSTEM",
      projectName: "跨境寄賣與直播電商平台",
      summary: "將 Client 的商業構想，轉換成一套可實際運作的多角色電商平台。",
      metadata: {
        "角色": "UI/UX DESIGNER",
        "平台": "Responsive Web",
        "範疇": "Product Architecture · System UX · Workflow & State Design",
        "狀態": "Designed & Developed",
      },
      decisionsHeading: "關鍵設計決策",
      nextProjectLabel: "下一個專案",
      nextProjectTitle: "企業形象網站",
      backToSelectedWorkLabel: "返回精選作品",
      overview: {
        heading: "Overview",
        title: "將 Client 的商業構想，轉換成一套可實際運作的多角色電商平台",
        body: [
          "Client 希望建立一套跨境寄賣與直播電商平台，串接台灣供應商、越南當地倉儲、銷售角色與消費者。",
          "我的工作是將 Client 的商業需求整理成清楚的產品架構、操作流程、互動邏輯與介面，讓工程團隊能進一步實作。",
        ],
        supportingLine: "UI/UX Designer · 2025.05 — 2026.04 · 12 個月",
      },
      challenge: {
        heading: "The Challenge",
        title: "不只是一個線上商店",
        body: [
          "專案已有明確的商業方向，但許多實際營運規則與產品細節仍需要進一步定義。",
          "庫存、定價、訂單、履約與結算，都必須在不同角色與不同流程階段之間維持一致。",
        ],
      },
      role: {
        heading: "My Role",
        title: "UI/UX Designer",
        body: [
          "我主導 Product Architecture、Information Architecture、UX Flow、Interaction Design、State Design 與 Developer Handoff，並親自設計 Platform、Supplier、Agent Backend 與 Consumer Web Storefront。",
          "另一位 UI Designer 依既有系統延伸 Consumer Mobile 與 Streamer Backend；我與 2 位工程師直接協作，PM 於 2025 年 10 月加入，協助後期專案協調與 QA。",
        ],
      },
      workflow: {
        heading: "The Approach",
        title: "先建立產品邏輯，再進入介面設計",
        body: [
          "我依序從 Ecosystem、Product Architecture、Core Flows、Business Rules & States 到 Interface Design 建立系統。",
          "Consumer Web 前台於 2025 年 5 月完成設計，主要管理後台則於 6 月完成。",
        ],
      },
      decisions: [
        {
          heading: "共享庫存",
          body: "商品需由越南倉庫實際收貨、點貨與確認後才正式啟用；Agent 與 Streamer 共用同一批實體庫存，並需處理低庫存、可控超賣、預計到貨與庫存異動紀錄。",
        },
        {
          heading: "定價規則",
          body: "Supplier 可以設定最低售價，而銷售角色仍保有高於最低售價的定價彈性。",
        },
      ],
      finalUI: {
        heading: "From Design to Delivery",
        title: "從主要設計完成，一路支援到產品交付",
        body: [
          "主要設計完成後，我持續與工程團隊合作，補足狀態與規則、確認實作行為，並依實作狀況調整設計。",
          "當地金流合作方的處理時程較長，使整體交付時間延後；商品類型限制縮減了可上架品項，核心系統架構維持不變。",
        ],
      },
      outcome: {
        heading: "Outcome",
        title: "完成可運作的產品，而不是概念作品",
        body: "最終完成可運作的前後台系統，並交付 Client。\n\nClient 後續因商業策略調整，產品沒有正式進入商業營運，因此本案例不主張上線後 KPI。",
      },
    },
    caseStudyEn: {
      displayTitle: "Complex System",
      eyebrowTitle: "COMPLEX SYSTEM",
      projectName: "Cross-Border Consignment & Live Commerce Platform",
      summary: "Turning a client-funded business concept into a working multi-role commerce platform.",
      metadata: {
        "Role": "UI/UX DESIGNER",
        "Platform": "Responsive Web",
        "Scope": "Product Architecture · System UX · Workflow & State Design",
        "Status": "Designed & Developed",
      },
      decisionsHeading: "KEY DESIGN DECISIONS",
      nextProjectLabel: "NEXT PROJECT",
      nextProjectTitle: "Corporate Website",
      backToSelectedWorkLabel: "BACK TO SELECTED WORK",
      overview: {
        heading: "OVERVIEW",
        title: "Turning a client-funded business concept into a working multi-role commerce platform",
        body: [
          "The client wanted to build a cross-border consignment and live-commerce platform connecting suppliers in Taiwan with warehouse operations, sellers, and consumers in Vietnam.",
          "My role was to translate the business concept and client requirements into a clear product structure, workflows, interaction logic, and interfaces that the engineering team could implement.",
        ],
        supportingLine: "UI/UX Designer · May 2025 — Apr 2026 · 12 months",
      },
      challenge: {
        heading: "THE CHALLENGE",
        title: "More than an online store",
        body: [
          "The business direction was established, but many operational rules and product details still needed to be defined.",
          "Inventory, pricing, orders, fulfillment, and settlement had to remain consistent across multiple roles and stages.",
        ],
      },
      role: {
        heading: "MY ROLE",
        title: "UI/UX Designer",
        body: [
          "I led product architecture, information architecture, UX flows, interaction design, state design, and developer handoff, and personally designed the Platform, Supplier, and Agent Backends and the Consumer Web Storefront.",
          "Another UI Designer extended the established system into Consumer Mobile and the Streamer Backend. I worked directly with two engineers; a PM joined in October 2025 to support later-stage coordination and QA.",
        ],
      },
      workflow: {
        heading: "THE APPROACH",
        title: "From business rules to product structure",
        body: [
          "I structured the system across five layers: Ecosystem, Product Architecture, Core Flows, Business Rules & States, and Interface Design.",
          "The consumer-facing Web experience was completed in May 2025, followed by the core administration systems in June.",
        ],
      },
      decisions: [
        {
          heading: "Shared inventory",
          body: "Products became active only after the Vietnam warehouse physically received, counted, and verified them. Agents and Streamers sold from the same shared stock, with low-stock conditions, controlled overselling, expected arrivals, and inventory history.",
        },
        {
          heading: "Pricing rules",
          body: "Suppliers could define a minimum selling price while sellers retained flexibility above that threshold.",
        },
      ],
      finalUI: {
        heading: "FROM DESIGN TO DELIVERY",
        title: "Supporting the product through implementation",
        body: [
          "After the main design work, I continued working with engineering to clarify missing states and rules, review implementation behavior, and adjust designs.",
          "Work with the local payment provider progressed more slowly than expected, extending the timeline. Product-category restrictions reduced the range of listable items without changing the core system architecture.",
        ],
      },
      outcome: {
        heading: "OUTCOME",
        title: "A working product, without fabricated metrics",
        body: "The project resulted in a working frontend and backend system and was delivered to the Client.\n\nThe Client later changed its business strategy, so the product did not formally enter commercial operation. This case does not claim post-launch KPIs.",
      },
    },
  },
  {
    id: "02",
    slug: "corporate-website",
    number: "02",
    stageBackground: "light",
    stageColumn: "media-left",
    stageVertical: "bottom",
    accent: "lavender",
    year: "2025",
    category: { zh: "企業網站", en: "Corporate Website" },
    railLabel: { zh: "企業網站", en: "CORPORATE WEBSITE" },
    title: "Corporate Website",
    chineseTitle: "企業品牌形象網站",
    tags: ["Web Design", "UI/UX", "Responsive", "Brand"],
    description: [
      "三個真實商業網站，涵蓋資訊架構、UX/UI 設計與不同程度的前端實作，",
      "皆已正式上線。",
    ],
    descriptionEn: [
      "Three real commercial websites spanning information architecture, UX/UI design,",
      "and varying levels of frontend implementation — all live.",
    ],
    image: "/images/case02/evidence/sdx-home-desktop.webp",
    homeImage: "/images/home/case02-home-visual.webp",
    homeImages: [
      "/images/case02/evidence/sdx-home-desktop.webp",
      "/images/case02/evidence/charming-home-desktop.webp",
      "/images/case02/evidence/natex-home-desktop.webp",
    ],
    homeVisual: "web-collage",
    alt: "Three responsive brand websites from the Brand and Web Experience case study",
    caseStudy: {
      summary: "A responsive brand experience shaped around clear content and a consistent digital presence.",
      metadata: {
        "角色": "UI/UX DESIGNER",
        "平台": "Responsive Web",
        "狀態": "3 個商業網站已上線",
      },
      ...placeholderSections,
    },
    // Homepage-card metadata labels only (see ProjectScene.tsx) — this
    // project's real case content lives in CaseTwoFinalContent.tsx, not
    // here; this object exists solely so the /en homepage card doesn't
    // fall back to the zh dict's Chinese keys as literal English-route
    // labels, same fix already applied to CASE01's existing caseStudyEn.
    caseStudyEn: {
      summary: "A responsive brand experience shaped around clear content and a consistent digital presence.",
      metadata: {
        Role: "UI/UX DESIGNER",
        Platform: "Responsive Web",
        Status: "3 Live Commercial Websites",
      },
      ...placeholderSections,
    },
  },
  {
    id: "03",
    slug: "iot-system",
    number: "03",
    stageBackground: "dark",
    stageColumn: "text-left",
    stageVertical: "middle",
    accent: "acid",
    year: "2023",
    category: { zh: "製造營運", en: "Manufacturing Operations" },
    railLabel: { zh: "工廠生產與營運管理系統", en: "CONFIDENTIAL MANUFACTURING OPERATIONS SYSTEM" },
    title: "Confidential Manufacturing Operations System",
    chineseTitle: "工廠生產與營運管理系統",
    tags: ["Manufacturing", "Operations", "System UX", "Industrial UI"],
    description: [
      "整合工廠現場與管理端的操作流程，",
      "並正式導入實際工廠使用。",
    ],
    descriptionEn: [
      "Bringing shop-floor and management workflows into one system,",
      "formally deployed for use in a real factory.",
    ],
    image: "/images/case03/case03-hero-desktop-tablet.webp",
    homeImage: "/images/home/case03-home-visual.webp",
    // No homeImages/homeVisual: case03-monitoring-dashboard.webp (the
    // previous 3rd collage tile) belongs to a different, unrelated
    // client and must never render for this project. homeImage alone
    // is enough for ProjectVisual's useHomeImage path (the only one
    // Selected Work actually uses), and omitting homeVisual/homeImages
    // means there is no multi-image collage path left for this project
    // at all — not just an unused one — so that asset can't resurface
    // here even if a future call site omits useHomeImage.
    alt: "Manufacturing operations dashboard and industrial tablet interface",
    caseStudy: {
      summary: "A system experience that brings device status, data, and daily operations into one clear workflow.",
      metadata: {
        "角色": "UI/UX DESIGNER",
        "平台": "Web · Industrial Tablet",
        "狀態": "正式導入",
      },
      ...placeholderSections,
    },
    // Homepage-card metadata labels only — see the matching comment on
    // CASE02 above.
    caseStudyEn: {
      summary: "A system experience that brings device status, data, and daily operations into one clear workflow.",
      metadata: {
        Role: "UI/UX DESIGNER",
        Platform: "Web · Industrial Tablet",
        Status: "In Production",
      },
      ...placeholderSections,
    },
  },
  {
    id: "04",
    slug: "consumer-product",
    number: "04",
    stageBackground: "light",
    stageColumn: "media-left",
    stageVertical: "middle",
    accent: "lavender",
    year: "2026",
    category: { zh: "行動產品", en: "MOBILE WELLNESS PRODUCT" },
    railLabel: { zh: "行動療癒產品", en: "MOBILE WELLNESS PRODUCT" },
    title: "Mobile Wellness Product",
    chineseTitle: "行動療癒產品",
    tags: ["Mobile", "UI/UX", "Interaction", "User Flow"],
    description: [
      "根據個人資料、當下狀態與偏好，",
      "生成個人化療癒音樂的行動產品。",
    ],
    descriptionEn: [
      "Generating personalized healing audio from individual data, state, and preference —",
      "a mobile product.",
    ],
    image: "/images/case04/case04-hero-home-v5.webp",
    homeImage: "/images/home/case04-home-visual.webp",
    homeImages: [
      "/images/case04/case04-generating-v2.webp",
      "/images/case04/case04-hero-home-v5.webp",
      "/images/case04/case04-player.webp",
    ],
    homeVisual: "phone-triptych",
    alt: "Home, generation, and listening screens from a mobile wellness product",
    caseStudy: {
      summary: "A mobile wellness product focused on an intuitive journey and clear interaction patterns.",
      metadata: {
        "角色": "UI/UX DESIGNER",
        "平台": "Mobile Product",
      },
      ...placeholderSections,
    },
    // Homepage-card metadata labels only — see the matching comment on
    // CASE02 above.
    caseStudyEn: {
      summary: "A mobile wellness product focused on an intuitive journey and clear interaction patterns.",
      metadata: {
        Role: "UI/UX DESIGNER",
        Platform: "Mobile Product",
      },
      ...placeholderSections,
    },
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getNextProject(project: Project) {
  const currentIndex = projects.findIndex((item) => item.slug === project.slug);
  return projects[(currentIndex + 1) % projects.length];
}

export function getPreviousProject(project: Project) {
  const currentIndex = projects.findIndex((item) => item.slug === project.slug);
  return projects[(currentIndex - 1 + projects.length) % projects.length];
}
