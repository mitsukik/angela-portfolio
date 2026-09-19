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
    caseStudy: {
      displayTitle: "複雜系統設計",
      eyebrowTitle: "COMPLEX SYSTEM",
      projectName: "跨境寄賣與直播電商平台",
      summary: "將台灣供應商、越南倉儲、代理公司、直播主與消費者串連在同一套商業流程中，建立從跨境入庫、共享庫存、選品銷售到訂單履約與結算的完整產品體驗。",
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
        heading: "專案概述",
        title: "從台灣商品到越南消費者的跨境銷售平台",
        body: [
          "這是一套以越南市場為核心的跨境寄賣與直播電商平台。",
          "台灣供應商將商品以寄賣方式運往越南，由當地平台與倉庫完成實際點貨、Scan 與入庫後，商品才會正式成為可銷售庫存。",
          "Agent 與直播主可以從共享商品庫中選品、設定銷售價格並建立 Campaign，再透過專屬 Storefront、Link 或 QR Code 向消費者推廣商品。",
          "消費者完成下單後，由越南平台與倉庫負責揀貨、出貨、物流追蹤與售後處理，最後再依合作關係進行定期結算。",
        ],
        supportingLine: "Supplier · Warehouse / Platform · Agent · Streamer · Consumer",
      },
      challenge: {
        heading: "問題與挑戰",
        title: "設計的不是單一後台，而是一套彼此相依的商業系統",
        body: [
          "產品同時服務供應商、平台營運與倉庫人員、代理公司、直播主與消費者。",
          "不同角色共享相同的商品、庫存與訂單資料，卻擁有不同的資訊需求、操作權限與商業目標。一個角色的操作，也可能直接改變另一個角色所看到的狀態。",
          "例如，商品從台灣寄出並不代表已經可以在線上銷售。商品必須實際抵達越南、完成點貨與 Scan 後，才能進入 Active 狀態；而同一批實體庫存又會同時被多個 Agent 與 Streamer 共用。",
          "因此，核心問題並不是「如何設計一個 Admin Dashboard」，而是如何建立一套能同步實體商品、數位庫存、銷售、訂單履約與不同角色操作的產品模型。",
        ],
        points: [
          "01  多角色協作｜同一份商業資料，需要依角色提供不同的資訊與操作權限。",
          "02  實體 × 數位庫存｜線上商品狀態必須反映越南倉庫真正收到與確認的實體商品。",
          "03  彼此連動的商業規則｜庫存、價格、Campaign、訂單與結算並不是彼此獨立的功能。",
        ],
        supportingLine: "如何將跨境實體商品、共享庫存與多角色銷售流程，整合成一套完整的數位商業體驗？",
      },
      role: {
        heading: "我的角色",
        title: "UI/UX Designer",
        body: [
          "我主導此產品從早期需求梳理到開發落地的 UX/UI Design，負責建立整體產品架構、核心操作流程與設計方向。",
          "專案初期主要只有商業概念與工程端整理的功能草稿，許多實際 Workflow、Interaction、System States、Validation 與 Edge Cases 尚未被完整定義。",
          "因此，我的工作不只是將既有規格轉化為介面，而是需要從真實 Business Flow 出發，補足未定義的產品邏輯，並主動提出庫存、訂單資訊可見度、超賣、角色權限與售後處理等尚未釐清的問題，再與團隊確認並持續完善。",
          "另一位 Designer 後續依照我建立的產品架構與設計模式，延伸 Consumer Mobile 與直播主端的設計。我同時與兩位工程師直接進行 Design Handoff、開發確認與設計調整；PM 於後期加入，主要協助專案協調與 QA。",
        ],
        points: [
          "Product Architecture",
          "System Thinking",
          "UX Flow",
          "Interaction Design",
          "State Design",
          "UI Design",
          "Design Direction",
          "Developer Handoff",
        ],
      },
      workflow: {
        heading: "系統流程",
        title: "從跨境實體商品到數位銷售流程",
        body: [
          "在進入單一功能設計前，我先將實體物流、商品狀態、共享庫存、直播銷售與訂單履約整理成一套完整的 End-to-End Flow。",
          "商品從台灣供應商出貨後，必須經過越南倉庫實際收貨、驗收與 Scan，才能成為 Active 商品並進入 Shared Inventory。",
          "Agent 與 Streamer 再從共享商品庫中選品、設定售價並建立 Campaign，消費者則透過平台或直播主 Storefront 完成購買。",
          "訂單成立後，由平台與倉庫完成履約；若發生退換貨，商品則會依實際狀況進入 Restock 或 Disposal。",
        ],
        supportingLine: "Supplier → Cross-border Shipping → Vietnam Warehouse → Inspect / Scan → Active Product → Shared Inventory → Agent / Streamer → Campaign / Storefront → Consumer Order → Fulfillment → Return / Settlement",
      },
      decisions: [
        {
          heading: "建立多角色協作的產品模型",
          body: "系統中的 Supplier、Platform / Warehouse、Agent、Streamer 與 Consumer 都參與同一條商業流程，但每個角色擁有不同的責任與資訊需求。\n\n因此，我沒有將每個角色視為彼此孤立的產品，而是先建立共用的 Product、Inventory、Order 與 Collaboration Model，再根據真實營運責任決定每個角色可以查看與操作的內容。\n\n例如，Supplier 可以查看自己的商品表現、庫存、收益與合作直播主，但商品建立與實際庫存異動仍由掌握越南實體商品狀態的平台與倉庫人員負責。",
          principle: "Shared system. Role-specific responsibilities.",
        },
        {
          heading: "連結實體庫存與數位商品狀態",
          body: "跨境寄賣讓 Inventory Management 比一般 Ecommerce 更複雜。\n\n商品從台灣寄出後，可能因運輸產生損壞或數量差異，因此只有在越南倉庫實際完成驗收與 Scan 後，商品才會進入 Active 狀態。\n\n同一批實體庫存會被多個 Agent 與 Streamer 共用，因此系統需要同時處理 In Stock、Low Stock、Sold Out、Oversold、Pre-order、Expected Arrival 與後續 Restock 等狀態。\n\nInventory Log 也需要保留庫存異動事件、操作者與時間，讓每一次變化都具有可追蹤性。",
          principle: "Inventory is not just a number — it is a changing system state.",
        },
        {
          heading: "在彈性定價與商業規則之間取得平衡",
          body: "直播主可以根據自己的受眾與銷售策略設定實際售價，但售價不得低於系統設定的建議／最低售價。\n\n因此，Pricing UI 不只是讓使用者輸入一個數字，而是需要讓使用者清楚理解目前的價格限制、設定是否有效，以及這個設定是否能進入後續銷售流程。\n\n系統同時需要處理不同角色之間的收益與結算邏輯，但 Portfolio 僅呈現產品層級的規則與 Interaction，不公開實際金額、比例或內部財務條件。",
          principle: "Give users flexibility without breaking the business model.",
        },
        {
          heading: "設計 Happy Path 之外的系統狀態",
          body: "在共享庫存的環境中，即使 Consumer 已經進入 Checkout，商品狀態仍可能因另一筆訂單而改變。\n\n因此，我補足了 Checkout 前的 Inventory Re-validation，以及 Out of Stock、Payment Failure、Order Cancellation、Return、Exchange、Refund、Restock 與 Disposal 等 Exception States。\n\n例如，若商品在 Consumer 確認訂單時已售罄，系統會阻止 Checkout、清楚指出問題商品，並引導使用者返回 Cart 更新內容後再繼續。\n\n設計的重點不只是顯示 Error，而是讓使用者清楚知道：發生了什麼、為什麼不能繼續，以及下一步可以做什麼。",
          principle: "The happy path is only one state of the product.",
        },
      ],
      finalUI: {
        heading: "最終介面與解決方案",
        title: "One ecosystem, from operations to consumer purchase",
        body: [
          "最終產品將原本分散的跨境物流、商品管理、共享庫存、直播銷售、訂單履約與售後流程，整合成一套連續的 Commerce Experience。",
          "設計涵蓋平台營運端、Supplier Backend、Agent Backend 與 Consumer Web Storefront，並讓不同角色都能在同一套 Product Model 下完成自己的核心工作。",
        ],
        points: [
          "平台營運｜Product / Inventory / Order / Return Management",
          "供應商｜Sales Monitoring / Stock / Streamer Collaboration / Settlement",
          "銷售與合作｜Product Selection / Pricing / Campaign / Link & QR",
          "消費者｜Storefront / Product Detail / Cart / Checkout / Order Tracking / Customer Support",
        ],
      },
      outcome: {
        heading: "成果",
        title: "從模糊需求建立到完整產品開發",
        body: "最終完成從平台營運、供應商、代理端到 Consumer Storefront 的完整產品設計，並與工程團隊協作完成系統開發。\n\n產品涵蓋跨境入庫、共享庫存、直播銷售、彈性定價、訂單履約、售後處理與多角色結算，形成一套可以支援完整跨境直播電商流程的 Commerce Platform。\n\n系統完成開發後，公司因商業策略調整，決定出售整體 Business，因此產品最終沒有正式進入商業營運。",
      },
      learnings: {
        heading: "學習與收穫",
        title: "複雜系統設計的核心，是讓關係變得可以理解",
        body: "這個專案讓我更深入理解，複雜系統設計並不是單純減少資訊，而是建立清楚的角色、狀態、規則與操作後果。\n\n當實體物流、數位庫存、商業規則與不同角色彼此相依時，一個看似簡單的 UI Action，背後可能同時影響倉庫庫存、直播主銷售與 Consumer Experience。\n\n因此，我開始更習慣在進入畫面設計之前先確認：誰正在操作？目前系統處於什麼狀態？有哪些 Business Rules？這個操作之後會發生什麼？\n\n好的複雜系統設計，不是隱藏複雜性，而是讓使用者知道自己在哪裡、能做什麼，以及接下來會發生什麼。",
      },
    },
    caseStudyEn: {
      displayTitle: "Complex System",
      eyebrowTitle: "COMPLEX SYSTEM",
      projectName: "Cross-Border Consignment & Live Commerce Platform",
      summary: "Connecting Taiwanese suppliers, Vietnamese warehousing, agencies, streamers, and consumers within one business flow—from cross-border receiving and shared inventory to product selection, sales, order fulfillment, and settlement.",
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
        heading: "PROJECT OVERVIEW",
        title: "A cross-border commerce platform connecting Taiwanese products with Vietnamese consumers",
        body: [
          "This platform supports cross-border consignment and live commerce for the Vietnamese market.",
          "Taiwanese Suppliers ship products to Vietnam on consignment. Products become sellable inventory only after the local Platform and Warehouse physically count, Scan, and receive them.",
          "Agents and Streamers select products from Shared Inventory, set selling prices, and create Campaigns. They then promote those products to consumers through dedicated Storefronts, Links, or QR Codes.",
          "After a Consumer places an Order, the Vietnamese Platform and Warehouse handle picking, shipping, logistics tracking, and after-sales support, followed by periodic settlement based on each partnership.",
        ],
        supportingLine: "Supplier · Warehouse / Platform · Agent · Streamer · Consumer",
      },
      challenge: {
        heading: "PROBLEM / CHALLENGE",
        title: "Designing an interdependent business system—not a standalone backend",
        body: [
          "The product serves Suppliers, Platform operators and Warehouse staff, agencies, Streamers, and Consumers.",
          "These roles share the same Product, Inventory, and Order data, but each has different information needs, permissions, and business goals. An action taken by one role can directly change the state another role sees.",
          "For example, shipping a Product from Taiwan does not mean it can be sold online. It must physically arrive in Vietnam and complete counting and Scan before becoming Active, while the same physical Inventory is shared across multiple Agents and Streamers.",
          "The core challenge was therefore not how to design an Admin Dashboard, but how to build a product model that synchronizes physical goods, digital Inventory, sales, Order fulfillment, and the actions of multiple roles.",
        ],
        points: [
          "01  Multi-role collaboration | The same business data requires different information and permissions for each role.",
          "02  Physical × digital Inventory | Online Product states must reflect the physical goods actually received and confirmed by the Vietnamese Warehouse.",
          "03  Interdependent business rules | Inventory, Pricing, Campaigns, Orders, and settlement are not isolated functions.",
        ],
        supportingLine: "How might we bring cross-border physical products, Shared Inventory, and multi-role sales workflows into one complete digital commerce experience?",
      },
      role: {
        heading: "MY ROLE",
        title: "UI/UX Designer",
        body: [
          "I led UX/UI Design from early requirement definition through development, establishing the overall Product Architecture, core workflows, and design direction.",
          "At the outset, the project consisted mainly of a business concept and engineering-led feature drafts. Many practical Workflows, Interactions, System States, Validation rules, and Edge Cases were still undefined.",
          "My role extended beyond translating existing specifications into interfaces. I worked from the actual Business Flow to define missing product logic, proactively surface unresolved issues around Inventory, Order visibility, Overselling, role permissions, and after-sales handling, and refine the system with the team.",
          "A second Designer later extended the Consumer Mobile and Streamer experiences using the Product Architecture and design patterns I established. I also worked directly with two engineers on Design Handoff, implementation reviews, and design adjustments. A PM joined later to support project coordination and QA.",
        ],
        points: [
          "Product Architecture",
          "System Thinking",
          "UX Flow",
          "Interaction Design",
          "State Design",
          "UI Design",
          "Design Direction",
          "Developer Handoff",
        ],
      },
      workflow: {
        heading: "SYSTEM / WORKFLOW",
        title: "From cross-border physical products to a digital sales workflow",
        body: [
          "Before designing individual features, I mapped physical logistics, Product states, Shared Inventory, live commerce, and Order fulfillment into one End-to-End Flow.",
          "After Taiwanese Suppliers ship their products, the Vietnamese Warehouse must physically receive, inspect, and Scan them before they become Active Products in Shared Inventory.",
          "Agents and Streamers then select products from Shared Inventory, set prices, and create Campaigns, while Consumers purchase through the Platform or a Streamer's Storefront.",
          "Once an Order is placed, the Platform and Warehouse complete fulfillment. Returned or exchanged products then move into Restock or Disposal according to their physical condition.",
        ],
        supportingLine: "Supplier → Cross-border Shipping → Vietnam Warehouse → Inspect / Scan → Active Product → Shared Inventory → Agent / Streamer → Campaign / Storefront → Consumer Order → Fulfillment → Return / Settlement",
      },
      decisions: [
        {
          heading: "Building a product model for multi-role collaboration",
          body: "Supplier, Platform / Warehouse, Agent, Streamer, and Consumer all participate in the same business flow, but each role has different responsibilities and information needs.\n\nInstead of treating each role as an isolated product, I first established shared Product, Inventory, Order, and Collaboration Models. Access and actions were then defined according to each role's real operational responsibilities.\n\nFor example, a Supplier can review their product performance, Inventory, revenue, and Streamer partnerships, while Product creation and physical Inventory changes remain with the Platform and Warehouse teams that manage the actual state of goods in Vietnam.",
          principle: "Shared system. Role-specific responsibilities.",
        },
        {
          heading: "Connecting physical Inventory with digital Product states",
          body: "Cross-border consignment makes Inventory Management more complex than standard eCommerce.\n\nProducts may be damaged or arrive in different quantities during shipping, so they become Active only after the Vietnamese Warehouse has physically inspected and Scanned them.\n\nThe same physical Inventory is shared across multiple Agents and Streamers. The system therefore needs to handle In Stock, Low Stock, Sold Out, Oversold, Pre-order, Expected Arrival, and subsequent Restock states.\n\nThe Inventory Log also records each Inventory event, operator, and timestamp so every change remains traceable.",
          principle: "Inventory is not just a number — it is a changing system state.",
        },
        {
          heading: "Balancing flexible Pricing with business rules",
          body: "Streamers can set selling prices based on their audience and sales strategy, but the price cannot fall below the system's recommended or minimum price.\n\nThe Pricing UI therefore does more than accept a number. It needs to communicate the current constraint, whether the price is valid, and whether the setup can proceed into the sales flow.\n\nThe system also handles revenue and settlement logic across roles. This portfolio presents only the product-level rules and Interactions, without disclosing actual amounts, rates, or internal financial terms.",
          principle: "Give users flexibility without breaking the business model.",
        },
        {
          heading: "Designing system states beyond the Happy Path",
          body: "With Shared Inventory, a Product's availability can change because of another Order even after a Consumer has entered Checkout.\n\nI therefore defined Inventory Re-validation before Checkout, along with Exception States for Out of Stock, Payment Failure, Order Cancellation, Return, Exchange, Refund, Restock, and Disposal.\n\nFor example, if a Product sells out while a Consumer confirms an Order, the system blocks Checkout, identifies the affected Product, and guides the Consumer back to the Cart to update it before continuing.\n\nThe goal was not simply to display an Error, but to ensure users understand what happened, why they cannot continue, and what they can do next.",
          principle: "The happy path is only one state of the product.",
        },
      ],
      finalUI: {
        heading: "FINAL UI / SOLUTION",
        title: "One ecosystem, from operations to consumer purchase",
        body: [
          "The final product brings previously fragmented cross-border logistics, Product Management, Shared Inventory, live commerce, Order fulfillment, and after-sales workflows into one continuous Commerce Experience.",
          "The design covers Platform operations, the Supplier Backend, Agent Backend, and Consumer Web Storefront, enabling every role to complete their core work within the same Product Model.",
        ],
        points: [
          "Platform Operations | Product / Inventory / Order / Return Management",
          "Supplier | Sales Monitoring / Stock / Streamer Collaboration / Settlement",
          "Sales & Collaboration | Product Selection / Pricing / Campaign / Link & QR",
          "Consumer | Storefront / Product Detail / Cart / Checkout / Order Tracking / Customer Support",
        ],
      },
      outcome: {
        heading: "OUTCOME",
        title: "From ambiguous requirements to a fully developed product",
        body: "I completed the end-to-end product design across Platform operations, Supplier and Agent experiences, and the Consumer Storefront, working with the engineering team through implementation.\n\nThe product covers cross-border receiving, Shared Inventory, live commerce, flexible Pricing, Order fulfillment, after-sales handling, and multi-role settlement—forming a Commerce Platform capable of supporting the full cross-border live-commerce flow.\n\nAfter development was completed, the company changed its business strategy and decided to sell the overall Business. As a result, the product did not proceed to commercial launch.",
      },
      learnings: {
        heading: "LEARNINGS",
        title: "The core of complex-system design is making relationships understandable",
        body: "This project deepened my understanding that designing complex systems is not simply about reducing information. It requires clear roles, states, rules, and consequences for every action.\n\nWhen physical logistics, digital Inventory, business rules, and multiple roles depend on one another, a seemingly simple UI Action can affect Warehouse Inventory, Streamer sales, and the Consumer Experience at the same time.\n\nBefore moving into interface design, I became more deliberate about asking: Who is taking this action? What state is the system in? Which Business Rules apply? What happens next?\n\nGood complex-system design does not hide complexity. It helps users understand where they are, what they can do, and what will happen next.",
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
      "整合品牌定位、內容架構與視覺設計，",
      "打造清晰且一致的企業數位體驗。",
    ],
    descriptionEn: [
      "Bringing brand positioning, content structure, and visual design together",
      "to create a clear, consistent digital presence.",
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
        "角色": "Product Designer",
        "平台": "Responsive Web",
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
        Role: "Product Designer",
        Platform: "Responsive Web",
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
      "將設備狀態、數據與操作流程整合，",
      "讓複雜資訊更容易理解與管理。",
    ],
    descriptionEn: [
      "Bringing device status, data, and operational workflows together",
      "to make complex information easier to understand and manage.",
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
        "角色": "Product Designer",
        "平台": "Web · Industrial Tablet",
      },
      ...placeholderSections,
    },
    // Homepage-card metadata labels only — see the matching comment on
    // CASE02 above.
    caseStudyEn: {
      summary: "A system experience that brings device status, data, and daily operations into one clear workflow.",
      metadata: {
        Role: "Product Designer",
        Platform: "Web · Industrial Tablet",
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
    image: "/images/case04/case04-hero-home-v2.webp",
    homeImage: "/images/home/case04-home-visual.webp",
    homeImages: [
      "/images/case04/case04-generating.webp",
      "/images/case04/case04-hero-home-v2.webp",
      "/images/case04/case04-player.webp",
    ],
    homeVisual: "phone-triptych",
    alt: "Home, generation, and listening screens from a mobile wellness product",
    caseStudy: {
      summary: "A mobile wellness product focused on an intuitive journey and clear interaction patterns.",
      metadata: {
        "角色": "Product Designer",
        "平台": "Mobile Product",
      },
      ...placeholderSections,
    },
    // Homepage-card metadata labels only — see the matching comment on
    // CASE02 above.
    caseStudyEn: {
      summary: "A mobile wellness product focused on an intuitive journey and clear interaction patterns.",
      metadata: {
        Role: "Product Designer",
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
