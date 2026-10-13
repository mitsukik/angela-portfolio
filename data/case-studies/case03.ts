import type { Locale } from "@/data/locale";

/*
 * CASE03 — single content source for the Portfolio V3 case page.
 *
 * Every case string below is carried over VERBATIM from the production V2
 * implementation (origin/main 9e3982d): CaseThreeFinalContent.tsx (chapters,
 * captions, alt text, prototype CTA) and CaseStudyPrototype.tsx (opening
 * title, subtitle, summary, metadata rows). Paragraph splits are kept exactly
 * as authored there. Do not edit wording here without Angela's approval.
 *
 * The only V3 additions are the approved navigation labels (`navLabels`,
 * approved), the approved Shop Floor / Management grouping labels
 * (decision 4) and the Remote / Nemu UI strings (`ui`, `nemu`), whose EN is a
 * faithful translation of the approved Chinese source (decision 3).
 *
 * Media paths are the existing local production assets — never substituted.
 */

export type Case03ChapterId = "ov" | "c1" | "c2" | "c3" | "c4" | "c5";

type Localized<T> = Record<Locale, T>;

export const CASE03_PROTOTYPE_URL = "/demos/case03/demo01/demo_01.html";

export const CASE03_MEDIA = {
  hero: { src: "/images/case03/case03-hero-desktop-tablet.webp", width: 1280, height: 720 },
  sharedPatterns: { src: "/images/case03/case03-shared-interaction-patterns.webp", width: 2400, height: 1500 },
  storageVideo: {
    webm: "/videos/case03/case03-storage-interaction-2x.webm",
    mp4: "/videos/case03/case03-storage-interaction-2x.mp4",
    poster: "/images/case03/case03-storage-interaction-poster-2x.webp",
    reducedMotionPoster: "/images/case03/case03-warehouse-floorplan.webp",
  },
} as const;

/** Approved V3 chapter navigation labels. */
export const CASE03_NAV_LABELS: Localized<Record<Case03ChapterId, string>> = {
  zh: { ov: "專案總覽", c1: "設計挑戰", c2: "角色與方法", c3: "設計決策", c4: "原型到導入", c5: "導入與優化" },
  en: { ov: "Case Overview", c1: "The Challenge", c2: "Role & Approach", c3: "Key Design Decisions", c4: "From Prototype to Production", c5: "Production & Iteration" },
};

export const CASE03_OPENING: Localized<{
  title: string;
  /** Locked ZH semantic title lines (production `zhTitleLines`); null = one flowing title. */
  titleLines: string[] | null;
  subtitle: string;
  summary: string;
  infoRows: { label: string; value: string; accent?: boolean }[];
  timeline: string;
  prototype: { label: string; note: string };
  heroAlt: string;
  confidentiality: string;
}> = {
  zh: {
    title: "工廠生產與營運管理系統",
    titleLines: ["工廠生產與營運", "管理系統"],
    subtitle: "將既有工廠作業需求轉化為可在管理端與現場使用的系統介面，並完成前端 UI 實作。",
    summary: "這是一套實際導入工廠的內部營運系統，涵蓋生產、物料領退、品檢、包裝入庫與管理功能。我負責 UI/UX 設計及 HTML / CSS / JavaScript 前端介面實作，並參與客戶測試、Backend 整合與 QA。",
    infoRows: [
      { label: "角色", value: "UI/UX Designer · Frontend Implementation" },
      { label: "團隊", value: "SA · Backend Engineer · UI/UX Designer" },
      { label: "平台", value: "Web · Internal Operations System" },
      { label: "專案期間", value: "2023" },
      { label: "狀態", value: "已部署並投入實際使用", accent: true },
    ],
    timeline: "2023",
    prototype: {
      label: "查看可操作 Prototype ↗",
      note: "原系統中經去識別化處理的部分可操作 Prototype；其餘工作流程因保密需求，以真實專案畫面呈現。",
    },
    heroAlt: "管理端 Desktop 儀表板，旁邊是現場工業平板的作業選單",
    confidentiality: "因專案保密需求，本案例不公開客戶與工廠名稱，並已移除敏感營運資料。",
  },
  en: {
    title: "Confidential Manufacturing Operations System",
    titleLines: null,
    subtitle: "Translating existing factory operations into interfaces that could be used by both management and shop-floor teams — and implementing the frontend UI.",
    summary: "This internal operations system was deployed in a real factory, covering production, material handling, quality inspection, packaging, inbound storage, and management functions. I was responsible for the UI/UX design and HTML / CSS / JavaScript frontend implementation, and participated in client testing, backend integration, and QA.",
    infoRows: [
      { label: "Role", value: "UI/UX Designer · Frontend Implementation" },
      { label: "Team", value: "SA · Backend Engineer · UI/UX Designer" },
      { label: "Platform", value: "Web · Internal Operations System" },
      { label: "Timeline", value: "2023" },
      { label: "Status", value: "Deployed · In Production Use", accent: true },
    ],
    timeline: "2023",
    prototype: {
      label: "View Interactive Prototype ↗",
      note: "Selected sanitized prototype from the original system. Additional workflows are shown through real project screens due to confidentiality.",
    },
    heroAlt: "Management desktop dashboard alongside the shop-floor industrial tablet's task menu",
    confidentiality: "Client and facility identities are withheld, and sensitive operational data has been removed due to project confidentiality.",
  },
};

export type Case03Content = {
  challenge: {
    title: string;
    paragraphs: string[];
    contexts: { label: string; device: string; group: string; items: string; tone: "accent" | "secondary" }[];
  };
  role: {
    title: string;
    paragraphs: string[];
    flowLabel: string;
    groups: { owner: string; steps: string[]; mine: boolean }[];
  };
  decisions: {
    /** Section heading (production: visually hidden h2 under the 03 label). */
    heading: string;
    one: {
      number: string;
      title: string;
      intro: string[];
      patternLabel: string;
      pattern: string[];
      outro: string;
      imageAlt: string;
      caption: string;
    };
    two: {
      number: string;
      title: string;
      paragraphs: string[];
      videoAlt: string;
      reducedMotionAlt: string;
      caption: string;
    };
  };
  build: { title: string; paragraphs: string[]; flowLabel: string; steps: string[] };
  iteration: {
    title: string;
    paragraphs: string[];
    postLaunchLabel: string;
    postLaunch: string;
    deliveredLabel: string;
    delivered: string;
  };
};

export const CASE03_CONTENT: Localized<Case03Content> = {
  zh: {
    challenge: {
      title: "同一套系統，兩種不同的操作情境",
      paragraphs: [
        "管理人員透過 Desktop 掌握工單、生產與庫存等資訊；現場人員則使用工業平板完成物料、生產紀錄、品檢、包裝與入庫等日常作業。",
        "SA 與客戶已定義作業需求與系統規則。我的任務不是重新設計工廠的營運方式，而是把既有規則轉成在兩種工作情境下都能清楚理解、實際操作的介面。",
      ],
      contexts: [
        { label: "Shop Floor", device: "工業平板", group: "現場作業", items: "Production · Material · Quality · Packaging · Inbound", tone: "accent" },
        { label: "Management", device: "Desktop", group: "管理端", items: "Work Orders · Production · Inventory · Reports · Permissions", tone: "secondary" },
      ],
    },
    role: {
      title: "從需求，做到可以真正操作的介面",
      paragraphs: [
        "專案沒有專職 Frontend Engineer，因此我的工作不只停在 UI 設計。",
        "我把 SA 與客戶提出的需求整理成頁面結構、任務順序與操作流程，再以 HTML / CSS / JavaScript 做成可操作介面，讓客戶能在 Backend 整合前分階段測試並回饋。",
      ],
      flowLabel: "交付流程",
      groups: [
        { owner: "SA 與客戶定義", steps: ["Requirements"], mine: false },
        { owner: "由我負責", steps: ["Structure & Flow", "UI/UX", "Working Frontend"], mine: true },
        { owner: "與團隊協作", steps: ["Client Testing", "Backend / QA", "Production"], mine: false },
      ],
    },
    decisions: {
      heading: "關鍵設計決策",
      one: {
        number: "決策 01",
        title: "不同工序，共用一致的操作邏輯",
        intro: [
          "不同現場任務處理的資料並不相同。如果每個功能都有自己的操作方式，使用者在切換工作時就需要重新理解介面。",
          "因此我讓核心操作維持一致：",
        ],
        patternLabel: "核心操作模式",
        pattern: ["Filter", "Table / List", "Form", "Confirm"],
        outro: "內容可以不同，但篩選、閱讀資料、輸入與確認的方式保持一致，讓使用者已經理解的操作模式可以延續到其他任務。",
        imageAlt: "三張平板介面 mockup：用藥資料列表、反應資訊表單與入庫製令確認，呈現一致的篩選、表格、表單與確認模式",
        caption: "平板 mockup 呈現不同作業共用的篩選、表格、表單與確認模式。",
      },
      two: {
        number: "決策 02",
        title: "把儲位代碼轉成空間介面",
        paragraphs: [
          "倉儲位置原本主要以代碼識別；對系統而言足夠，但現場人員仍必須把編號轉換成實際空間位置。",
          "我將實體儲存區域重新繪製成視覺化平面配置，並做成可直接選取的介面。",
          "使用者不需要只靠代碼判斷，而能從畫面理解並選擇對應的實體儲位。",
        ],
        videoAlt: "入庫作業操作預覽：點選儲位查詢開啟倉儲平面圖，選取 B11 貨架的儲位，查看 B11-06-01 各層可使用與已佔用狀態，再開啟可使用儲位的存放明細並輸入放入包數",
        reducedMotionAlt: "入庫作業中的儲位選擇視窗：以實體倉儲平面圖呈現貨架、走道與樓層分頁，可直接點選儲位",
        caption: "將實體倉儲空間轉為可直接操作的數位位置選擇。",
      },
    },
    build: {
      title: "設計必須能真正進入實作",
      paragraphs: [
        "可操作的 HTML / CSS / JavaScript frontend 先用於客戶分階段測試，再依操作回饋調整，之後才進入 Backend 整合與 QA。",
        "這讓 interaction 問題能在完整系統整合前被發現，也讓設計決策從一開始就必須面對實際 implementation，而不只是靜態畫面。",
      ],
      flowLabel: "從 Prototype 到 Production",
      steps: ["Prototype", "Client Testing", "Revision", "Backend Integration", "QA"],
    },
    iteration: {
      title: "系統上線後，設計工作沒有停止",
      paragraphs: [
        "系統完成 Backend 整合與 QA 後正式導入工廠，並用於日常生產與營運。上線後，我仍持續依實際操作情境與客戶回饋調整介面與流程。",
        "本案例不主張沒有驗證資料支持的效率或營運 KPI；可以確認的成果，是一套從需求、UI/UX、可操作 frontend、客戶測試一路走到正式 production 的真實系統。",
      ],
      postLaunchLabel: "上線後調整",
      postLaunch: "導入後，現場以平板操作時發現部分按鈕位置不順手。我依回饋重新調整主要操作按鈕的位置，並將原流程拆分、新增頁面，讓每一步的操作更單純。",
      deliveredLabel: "交付",
      delivered: "Frontend Implementation · Backend Integration · QA · Production Deployment",
    },
  },
  en: {
    challenge: {
      title: "One system, two operating contexts",
      paragraphs: [
        "Management staff used desktop interfaces to monitor work orders, production, inventory, and other operational information. Shop-floor staff used industrial tablets for day-to-day tasks such as material handling, production records, quality inspection, packaging, and inbound storage.",
        "The SA and client had already defined the operational requirements and system rules. My role was not to redesign how the factory operated, but to translate those existing rules into interfaces that were clear and practical in two very different working environments.",
      ],
      contexts: [
        { label: "Shop Floor", device: "Industrial tablet", group: "Shop Floor", items: "Production · Material · Quality · Packaging · Inbound", tone: "accent" },
        { label: "Management", device: "Desktop", group: "Management", items: "Work Orders · Production · Inventory · Reports · Permissions", tone: "secondary" },
      ],
    },
    role: {
      title: "Turning requirements into something people could actually use",
      paragraphs: [
        "There was no dedicated frontend engineer on the project, so my work did not stop at UI design.",
        "I translated requirements from the SA and client into page structure, task sequence, and interaction flows, then implemented the interface in HTML, CSS, and JavaScript. This gave the client something they could operate and review in stages before backend integration.",
      ],
      flowLabel: "Delivery flow",
      groups: [
        { owner: "Defined by SA & client", steps: ["Requirements"], mine: false },
        { owner: "Owned by me", steps: ["Structure & Flow", "UI/UX", "Working Frontend"], mine: true },
        { owner: "With the team", steps: ["Client Testing", "Backend / QA", "Production"], mine: false },
      ],
    },
    decisions: {
      heading: "Key design decisions",
      one: {
        number: "Decision 01",
        title: "One interaction pattern across different tasks",
        intro: [
          "Shop-floor tasks handled very different types of data. If every function introduced a different interaction model, users would have to relearn the interface each time they switched tasks.",
          "I therefore kept the core interaction pattern consistent:",
        ],
        patternLabel: "Core interaction pattern",
        pattern: ["Filter", "Table / List", "Form", "Confirm"],
        outro: "The content changed, but filtering, reading data, entering information, and confirming actions followed the same basic logic across workflows.",
        imageAlt: "Three tablet UI mockups showing medication records, reaction input, and inbound work-order confirmation with a shared filter, table, form, and confirmation pattern",
        caption: "Tablet mockups show the shared filtering, table, form, and confirmation patterns across tasks.",
      },
      two: {
        number: "Decision 02",
        title: "Turning storage codes into a spatial interface",
        paragraphs: [
          "Storage locations were primarily identified by codes. That worked for the system, but shop-floor staff still had to translate those codes into physical locations.",
          "I redrew the storage area as a visual floor plan and implemented it as an interactive location-selection interface.",
          "Instead of relying only on codes, users could understand and select the corresponding physical storage position directly on screen.",
        ],
        videoAlt: "Inbound flow walkthrough: opening the storage selector shows the warehouse floor plan; selecting a shelf on rack B11 shows which levels of B11-06-01 are available or occupied, then an available slot opens its put-away form",
        reducedMotionAlt: "Storage-location selector in the inbound flow: the physical warehouse drawn as a floor plan with shelves, aisles, and floor tabs, selectable directly on screen",
        caption: "Translating the physical warehouse layout into a directly operable digital location selector.",
      },
    },
    build: {
      title: "The design had to work in implementation",
      paragraphs: [
        "The working HTML / CSS / JavaScript frontend was used for staged client testing before backend integration. Feedback from those sessions was incorporated before the interface moved into backend integration and QA.",
        "This allowed interaction issues to surface before full system integration and meant that design decisions had to hold up in a working implementation, not only in static screens.",
      ],
      flowLabel: "From prototype to production",
      steps: ["Prototype", "Client Testing", "Revision", "Backend Integration", "QA"],
    },
    iteration: {
      title: "The design work continued after launch",
      paragraphs: [
        "After backend integration and QA, the system was deployed into the factory and used in day-to-day production and operations. I continued refining interfaces and workflows based on real operating conditions and client feedback after launch.",
        "This case does not claim efficiency or operational KPIs without verified measurement data. The verifiable outcome is a real system that moved from requirements and UI/UX through working frontend implementation, client testing, integration, QA, and production use.",
      ],
      postLaunchLabel: "Post-launch example",
      postLaunch: "After deployment, tablet use on the shop floor showed that some action buttons were awkwardly placed. Based on that feedback, I repositioned the primary actions and split the original flow across an additional page so each step was simpler.",
      deliveredLabel: "Delivered",
      delivered: "Frontend Implementation · Backend Integration · QA · Production Deployment",
    },
  },
};

/** Nemu dialogue per chapter — ZH is the approved V3 source; EN is a faithful translation of it. */
export const CASE03_NEMU: Localized<Record<Case03ChapterId | "more", string>> = {
  zh: {
    ov: "這是 CH03 的案例。可以直接往下讀，或從這裡跳到想看的段落。",
    c1: "同一套系統，兩種操作情境：管理端的 Desktop，和現場的工業平板。",
    c2: "這個專案沒有專職前端，所以設計一路做到了可以操作的介面。",
    c3: "兩個關鍵決策。第二個是把儲位代碼變成看得懂的平面圖。",
    c4: "先讓客戶實際操作，再進入 Backend 整合。",
    c5: "上線不是結尾。這段是導入工廠之後的調整。",
    more: "這個案例看完了。要換下一台嗎？",
  },
  en: {
    ov: "This is the CH03 case. Read straight down, or jump to any section from here.",
    c1: "One system, two operating contexts: desktop for management, and industrial tablets on the shop floor.",
    c2: "This project had no dedicated frontend engineer, so the design went all the way to a working interface.",
    c3: "Two key decisions. The second turns storage codes into a floor plan people can read.",
    c4: "Let the client actually use it first, then move into backend integration.",
    c5: "Launch wasn't the end. This part covers the refinements after deployment in the factory.",
    more: "That's the end of this case. Switch to the next channel?",
  },
};
