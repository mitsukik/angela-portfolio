import { aboutV2Content } from "./about-v2";
import { closingBody, contactLabels, resumeUrl } from "./contact";
import { heroContent, type HeroSegment } from "./home";
import type { Locale } from "./locale";
import { projects } from "./projects";

/**
 * Home V2 view-model. Every fact below is READ from the existing sources
 * (data/projects.ts metadata, data/home.ts hero copy, data/about-v2.ts
 * skills + experience copy, data/contact.ts) — this file only reshapes it
 * for the V2 presentation and holds presentational UI labels. A slot whose
 * source field is empty is simply omitted (never filled with invented
 * content), e.g. a case with no status renders no status.
 */

export type HomeWorkItem = {
  id: string;
  number: string;
  title: string;
  category: string;
  year: string;
  /** Hidden in the UI when the project has no status field. */
  status?: string;
  live: boolean;
  description: string;
  /** Every real metadata pair the project carries, in source order. */
  meta: { label: string; value: string }[];
  image: { src: string; crop: string };
  href: string;
};

export type ProofCell = {
  title: string;
  /** Sub-line entries, joined visually by a separator (not read aloud). */
  items: string[];
};

export type Ui = {
  navLabel: string;
  mobileNavLabel: string;
  nav: { work: string; about: string; contact: string; menuOpen: string; menuClose: string };
  langLabel: string;
  workCta: string;
  resumeCta: string;
  workHeading: string;
  hintHover: string;
  hintTouch: string;
  previewCase: string;
  drawer: { close: string; read: string };
  marquee: { label: string; toggle: string; pauseClick: string; pauseTap: string; pausedClick: string; pausedTap: string };
  proofLabel: string;
  copyEmail: string;
  copied: string;
  cursorView: string;
  backToTop: string;
  homeLink: string;
};

const UI: Record<Locale, Ui> = {
  zh: {
    navLabel: "主要導覽",
    mobileNavLabel: "行動版主要導覽",
    nav: { work: "作品", about: "關於", contact: "聯絡", menuOpen: "開啟選單", menuClose: "關閉選單" },
    langLabel: "語言 / Language",
    workCta: "精選作品",
    resumeCta: "下載履歷",
    workHeading: "精選作品",
    hintHover: "滑過預覽 · 開啟案例閱讀",
    hintTouch: "點擊作品閱讀案例，或按預覽按鈕快速查看",
    previewCase: "快速預覽案例",
    drawer: { close: "關閉", read: "閱讀完整案例" },
    marquee: {
      label: "技能與工具",
      toggle: "暫停技能跑馬燈",
      pauseClick: "點擊暫停",
      pauseTap: "點擊暫停",
      pausedClick: "已暫停 · 點擊繼續",
      pausedTap: "已暫停 · 點擊繼續",
    },
    proofLabel: "重點數字",
    copyEmail: "複製 Email",
    copied: "已複製 ✓",
    cursorView: "查看",
    backToTop: "BACK TO TOP",
    homeLink: "← 回首頁",
  },
  en: {
    navLabel: "Primary navigation",
    mobileNavLabel: "Mobile primary navigation",
    nav: { work: "Work", about: "About", contact: "Contact", menuOpen: "Open menu", menuClose: "Close menu" },
    langLabel: "語言 / Language",
    workCta: "Selected Work",
    resumeCta: "Download Resume",
    workHeading: "Selected Work",
    hintHover: "Hover to preview · Open a case to read",
    hintTouch: "Open a case to read, or use the preview button for a quick look",
    previewCase: "Preview case",
    drawer: { close: "Close", read: "Read the full case study" },
    marquee: {
      label: "Skills and tools",
      toggle: "Pause skills ticker",
      pauseClick: "CLICK TO PAUSE",
      pauseTap: "TAP TO PAUSE",
      pausedClick: "PAUSED · CLICK TO PLAY",
      pausedTap: "PAUSED · TAP TO PLAY",
    },
    proofLabel: "At a glance",
    copyEmail: "Copy email",
    copied: "Copied ✓",
    cursorView: "View",
    backToTop: "BACK TO TOP",
    homeLink: "← HOME",
  },
};

const caseHref = (locale: Locale, number: string) =>
  `${locale === "en" ? "/en" : ""}/design-samples/case-final-${number}`;

function buildWork(locale: Locale): HomeWorkItem[] {
  return projects.map((project) => {
    // Same metadata source and locale rule the V1 Selected Work card used.
    const caseStudy = locale === "en" && project.caseStudyEn ? project.caseStudyEn : project.caseStudy;
    const meta = Object.entries(caseStudy.metadata).map(([label, value]) => ({ label, value }));
    const description = locale === "zh" ? project.description : project.descriptionEn;
    // Status is the metadata entry V1 labelled 狀態 / Status.
    const status = meta.find(({ label }) => label === "狀態" || label === "Status")?.value;
    return {
      id: project.id,
      number: project.number,
      title: locale === "zh" ? project.chineseTitle : project.title,
      category: project.category[locale],
      year: project.year,
      status,
      live: project.statusTone === "live",
      description: description.join(locale === "zh" ? "" : " "),
      meta,
      image: {
        src: project.homeImage ?? project.image,
        crop: project.homeCrop ?? "50% 50%",
      },
      href: caseHref(locale, project.number),
    };
  });
}

/** "資深 UI/UX 設計師 — 複雜系統 / B2B / 企業產品" → lead + rotating words. */
function splitKicker(kicker: string) {
  const [lead, rest = ""] = kicker.split(" — ");
  return { lead, words: rest.split(" / ").filter(Boolean) };
}

/** Proof band copy (authored by Angela, from the approved V2 reference). */
const PROOF: Record<Locale, ProofCell[]> = {
  zh: [
    { title: "近 9 年", items: ["Web", "UI/UX 與前端相關經驗"] },
    { title: "跨產品類型", items: ["B2B", "後台", "Dashboard", "Web", "Mobile"] },
    { title: "真實落地", items: ["商業網站上線", "企業系統正式導入"] },
    { title: "設計到實作", items: ["UX", "UI", "Design System", "前端協作"] },
  ],
  en: [
    { title: "~9 years", items: ["Web, UI/UX & front-end"] },
    { title: "Multi-product", items: ["B2B", "Admin", "Dashboard", "Web", "Mobile"] },
    { title: "Shipped", items: ["Live sites", "Systems in production"] },
    { title: "Design → Build", items: ["UX", "UI", "Design System", "Dev handoff"] },
  ],
};

export const v2Ui = (locale: Locale) => UI[locale];

export const v2Contact = (locale: Locale) => ({
  heading: ["Complex systems,", "designed for real use."] as [string, string],
  body: closingBody[locale],
  contactLabel: contactLabels[locale].contact,
  resumeLabel: contactLabels[locale].resume,
  resumeHref: resumeUrl(locale),
});

/** What the shared V2 shell (nav, contact, footer) needs from any page. */
export type V2Shell = { locale: Locale; ui: Ui; contact: ReturnType<typeof v2Contact> };

export type HomeV2Content = {
  locale: Locale;
  ui: Ui;
  hero: {
    eyebrowLead: string;
    eyebrowWords: string[];
    eyebrowFull: string;
    identityLines: [string, string];
    /** Segmented so 體驗 / experiences can never break across lines (V1 rule). */
    statement: HeroSegment[];
    support: string;
  };
  marquee: string[];
  work: HomeWorkItem[];
  proof: ProofCell[];
  contact: ReturnType<typeof v2Contact>;
};

export function getHomeV2Content(locale: Locale): HomeV2Content {
  const hero = heroContent[locale];
  const { lead, words } = splitKicker(hero.kicker);
  const work = buildWork(locale);

  return {
    locale,
    ui: UI[locale],
    hero: {
      eyebrowLead: lead,
      eyebrowWords: words,
      eyebrowFull: hero.kicker,
      identityLines: hero.identityLines,
      statement: hero.statement,
      support: hero.supportLines.join(""),
    },
    marquee: aboutV2Content[locale].skillGroups.flatMap((group) => group.items),
    work,
    proof: PROOF[locale],
    contact: v2Contact(locale),
  };
}
