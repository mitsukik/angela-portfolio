import type { Locale } from "./locale";

type SkillGroup = { label: string; items: string[] };
type HeadlineSegment = { text: string; highlight?: boolean };

type AboutContent = {
  headlineLines: HeadlineSegment[][];
  introParagraphs: string[];
  servicesHeading: string;
  serviceAreas: { title: string; description: string }[];
  processHeading: string;
  processStages: { title: string; description: string }[];
  processClosing: string;
  skillsHeading: string;
  skillGroups: SkillGroup[];
  beyondHeading: string;
  beyondParagraphs: string[];
  contactHeading: string;
  contactBody: string;
  contactCta: string;
};

// Skill/tool item labels are kept identical across locales (industry-standard
// English terms), matching how project tags/tools were already handled
// elsewhere in the codebase. Only group labels are translated.
const skillGroupItems = {
  productUx: [
    "Product Design",
    "UI/UX Design",
    "Interaction Design",
    "Information Architecture",
    "User Flows",
    "Wireframing",
    "Prototyping",
    "Responsive Design",
  ],
  designTools: ["Figma", "Photoshop", "Illustrator", "After Effects"],
  webImplementation: ["HTML", "CSS", "Bootstrap", "JavaScript"],
  // Intentionally kept separate from core skills — not proficient/core yet.
  currentlyExploring: ["React", "Next.js", "Tailwind CSS", "Git", "AI-assisted Development"],
};

export const aboutContent: Record<Locale, AboutContent> = {
  en: {
    headlineLines: [
      [{ text: "I design beyond screens —" }],
      [{ text: "I care about how products " }, { text: "work", highlight: true }, { text: "." }],
    ],
    introParagraphs: [
      "I’m Angela, a Product Designer with over 9 years of experience in UI/UX and digital product design, currently based in Taichung, Taiwan.",
      "My background spans UI/UX, web, and visual design. I started in web design and front-end implementation, then gradually moved into B2B platforms, IoT systems, education services, and other digital products — shifting my focus from how an interface looks to how a product is understood and used.",
      "When working with complex requirements, I start by clarifying the problem and understanding how information, flows, roles, and states connect. Rather than focusing on individual screens, I care about whether the overall experience makes sense across different scenarios — and whether the design can actually be built.",
    ],
    servicesHeading: "What I Do",
    serviceAreas: [
      {
        title: "Product & UX Design",
        description: "Starting from requirements and real use cases, I structure information, user flows, and product logic to turn ambiguous needs into clear, usable product experiences.",
      },
      {
        title: "Complex Systems",
        description: "I work with systems involving multiple roles, states, permissions, and business rules — organizing their relationships to make complex workflows easier to understand and use.",
      },
      {
        title: "Interaction & Prototyping",
        description: "From user flows and wireframes to high-fidelity prototypes, I turn product logic into interactive experiences that teams can explore, discuss, and refine before development.",
      },
      {
        title: "Web Design & Build",
        description: "My background in HTML, CSS, and web implementation helps me consider responsive behavior, interactions, and technical constraints while designing — and collaborate more effectively with developers.",
      },
    ],
    processHeading: "How I Work",
    processStages: [
      {
        title: "Understand the problem before designing the screen.",
        description: "I start by understanding business needs, user context, and existing constraints — identifying the real problem and what is still uncertain.",
      },
      {
        title: "Turn complexity into a clear structure.",
        description: "Before designing the interface, I organize information, flows, roles, and states into a structure the team can understand and align around.",
      },
      {
        title: "Turn product logic into a usable experience.",
        description: "Through wireframes, UI, and prototypes, I translate product logic into tangible interactions and interfaces.",
      },
      {
        title: "Refine through feedback and real constraints.",
        description: "I refine the solution through feedback, edge cases, and development constraints — balancing the intended experience with what can actually be built.",
      },
    ],
    processClosing:
      "Different problems need different processes. Rather than following a fixed framework, I focus on reducing uncertainty before adding more interface.",
    skillsHeading: "Skills / Tools",
    skillGroups: [
      { label: "Product & UX", items: skillGroupItems.productUx },
      { label: "Design Tools", items: skillGroupItems.designTools },
      { label: "Web & Implementation", items: skillGroupItems.webImplementation },
      { label: "Currently Exploring", items: skillGroupItems.currentlyExploring },
    ],
    beyondHeading: "Beyond Product Design",
    beyondParagraphs: [
      "Outside of product design, I’m also a long-time illustrator. Exploring composition, lighting, and visual storytelling has shaped the way I approach interface details, visual hierarchy, and the overall experience.",
      "I’m always curious about new tools and ways of working. Recently, I’ve been exploring AI-assisted development and how designers can take a more direct role in bringing ideas from design into implementation.",
    ],
    contactHeading: "Have an opportunity or project in mind?",
    contactBody:
      "I’m open to Product Design and UI/UX opportunities and collaborations. If you’re looking for a designer or have a project you’d like to discuss, I’d be happy to hear from you.",
    contactCta: "GET IN TOUCH →",
  },
  zh: {
    // Four explicit lines (not two phrases left to wrap naturally) so the
    // approved desktop composition is stable rather than width-dependent —
    // see AboutHero's locale-aware plainText join, which reads this back
    // together for screen readers. 運作 and 。 are merged into a single
    // segment (not two adjacent spans) so no line break can ever land
    // between the word and its punctuation, and so the closing punctuation
    // is part of the same acid-yellow highlighted unit as 運作.
    headlineLines: [
      [{ text: "我設計的不" }],
      [{ text: "只是畫面，" }],
      [{ text: "更在意產品如何" }],
      [{ text: "運作。", highlight: true }],
    ],
    introParagraphs: [
      "我是 Angela，一名擁有 9 年以上 UI/UX 與數位產品設計經驗的 Product Designer，目前居住於台中。",
      "我的設計背景橫跨 UI/UX、網頁與視覺設計。從早期的網頁設計與前端實作，到後來參與 B2B 後台、IoT 系統、教育服務平台與各類數位產品，我逐漸把設計的重心從「畫面如何呈現」，延伸到「產品如何被理解與使用」。",
      "面對複雜的需求，我習慣先釐清問題，整理資訊、流程、角色與不同狀態之間的關係，再開始設計介面。比起只完成一個畫面，我更在意整個流程是否合理、不同情境是否被考慮，以及設計最後能不能真正落地。",
    ],
    servicesHeading: "我的專長",
    serviceAreas: [
      {
        title: "產品與使用者體驗設計",
        description: "從需求與使用情境開始，梳理資訊架構、使用流程與產品邏輯，將模糊的需求逐步轉化為清楚、可操作的產品體驗。",
      },
      {
        title: "複雜系統設計",
        description: "處理包含多種角色、狀態、權限與商業規則的系統，整理彼此之間的關係，讓複雜的操作流程更容易理解與使用。",
      },
      {
        title: "互動與原型設計",
        description: "從 User Flow、Wireframe 到高擬真 Prototype，將產品邏輯轉化為可以實際操作與討論的體驗，協助團隊在開發前釐清流程與細節。",
      },
      {
        title: "網頁設計與實作",
        description: "具備 HTML、CSS 與網頁實作背景，讓我在設計時能同時考慮 RWD、互動行為與實作限制，也能更順暢地與工程師合作。",
      },
    ],
    processHeading: "工作方式",
    processStages: [
      {
        title: "先理解問題，而不是急著畫畫面。",
        description: "了解商業需求、使用者情境與現有條件，找出真正需要解決的問題，以及仍然存在的不確定性。",
      },
      {
        title: "把複雜的資訊整理成清楚的結構。",
        description: "在進入介面設計前，先整理資訊、流程、角色與狀態，建立團隊可以共同理解與討論的產品結構。",
      },
      {
        title: "讓產品邏輯變成可以使用的體驗。",
        description: "透過 Wireframe、UI 與 Prototype，把整理後的產品邏輯轉化為具體的互動與介面。",
      },
      {
        title: "在回饋與限制中持續調整。",
        description: "根據使用者回饋、Edge Cases 與開發限制持續調整，讓最終方案不只在設計上合理，也能實際落地。",
      },
    ],
    processClosing:
      "不同的問題需要不同的流程。比起套用固定方法，我更在意先降低不確定性，再開始增加介面。",
    skillsHeading: "技能 / 工具",
    skillGroups: [
      { label: "產品與體驗", items: skillGroupItems.productUx },
      { label: "設計工具", items: skillGroupItems.designTools },
      { label: "網頁與實作", items: skillGroupItems.webImplementation },
      { label: "持續學習中", items: skillGroupItems.currentlyExploring },
    ],
    beyondHeading: "產品設計之外",
    beyondParagraphs: [
      "除了產品設計，我也長期持續進行插畫創作。對構圖、光影與視覺敘事的探索，也影響了我處理介面細節、視覺層次與整體體驗的方式。",
      "我對新的工具與工作方式一直保持好奇，最近也開始探索 AI-assisted development，以及設計師如何更直接地參與從設計到實作的過程。",
    ],
    contactHeading: "有適合的機會，或想一起合作？",
    contactBody:
      "我目前開放 Product Design、UI/UX 相關的工作機會與合作。如果你正在尋找設計師，或有適合的專案想聊聊，歡迎與我聯絡。",
    contactCta: "GET IN TOUCH →",
  },
};
