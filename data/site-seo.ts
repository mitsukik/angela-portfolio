import type { Metadata } from "next";
import type { Locale } from "./locale";

export const SITE_ORIGIN = "https://angela-portfolio-phi.vercel.app";
const DEFAULT_OG_IMAGE = "/images/home/case01-home-visual.webp";

const PUBLIC_PAGES = {
  home: {
    zh: {
      path: "/",
      title: "Angela Yu｜資深產品設計師／UI/UX 設計師",
      description: "Angela Yu 的產品設計作品集，聚焦 B2B、企業產品與複雜系統，將繁複流程轉化為清晰、可實作的使用體驗。",
      imageAlt: "Angela Yu 作品集精選案例：跨境電商平台介面",
    },
    en: {
      path: "/en",
      title: "Angela Yu | Senior Product Designer & UI/UX Designer",
      description: "Portfolio of Angela Yu, a senior product designer focused on B2B, enterprise products, and complex systems that turn intricate workflows into clear experiences.",
      imageAlt: "Selected portfolio case study: a cross-border commerce platform interface",
    },
    image: DEFAULT_OG_IMAGE,
    type: "website",
  },
  about: {
    zh: {
      path: "/about",
      title: "關於 Angela Yu｜資深產品設計師",
      description: "認識產品設計師 Angela Yu，以及她在複雜系統、B2B 與企業產品中的設計經驗與工作方式。",
      imageAlt: "Angela Yu 作品集精選案例：跨境電商平台介面",
    },
    en: {
      path: "/en/about",
      title: "About Angela Yu | Senior Product Designer",
      description: "About product designer Angela Yu, her experience with complex systems, B2B and enterprise products, and how she works with teams.",
      imageAlt: "Selected portfolio case study: a cross-border commerce platform interface",
    },
    image: DEFAULT_OG_IMAGE,
    type: "website",
  },
  case01: {
    zh: {
      path: "/design-samples/case-final-01",
      title: "跨境寄賣與直播電商平台｜複雜系統設計案例",
      description: "將多角色營運需求整理成清楚的電商產品架構、工作流程、狀態設計與介面，並與工程團隊合作交付。",
      imageAlt: "跨境寄賣與直播電商平台的作品集案例視覺",
    },
    en: {
      path: "/en/design-samples/case-final-01",
      title: "Cross-Border Commerce Platform | Complex Systems Case Study",
      description: "A multi-role commerce platform case study covering product architecture, workflows, state design, interfaces, and collaboration through delivery.",
      imageAlt: "Portfolio case study visual for a cross-border commerce platform",
    },
    image: "/images/home/case01-home-visual.webp",
    type: "article",
  },
  case02: {
    zh: {
      path: "/design-samples/case-final-02",
      title: "企業品牌網站設計｜響應式 UX/UI 案例",
      description: "以清楚的內容架構與一致的品牌呈現，完成三個響應式商業網站，涵蓋 UX/UI 設計與前端實作。",
      imageAlt: "三個響應式品牌網站的案例視覺",
    },
    en: {
      path: "/en/design-samples/case-final-02",
      title: "Corporate Websites | Responsive UX/UI Case Study",
      description: "Three live commercial websites shaped around clear content, consistent brand expression, responsive UX/UI, and front-end implementation.",
      imageAlt: "Case study visual showing three responsive brand websites",
    },
    image: "/images/home/case02-home-visual.webp",
    type: "article",
  },
  case03: {
    zh: {
      path: "/design-samples/case-final-03",
      title: "製造營運系統｜複雜系統 UX/UI 案例",
      description: "整理工廠現場與管理端的設備狀態、營運資料與日常操作流程，設計支援實際導入的系統體驗。",
      imageAlt: "製造營運系統的儀表板與工業平板介面案例視覺",
    },
    en: {
      path: "/en/design-samples/case-final-03",
      title: "Manufacturing Operations System | UX/UI Case Study",
      description: "A manufacturing operations system connecting device status, operational data, and daily workflows across desktop and industrial tablet interfaces.",
      imageAlt: "Case study visual showing a manufacturing dashboard and industrial tablet interface",
    },
    image: "/images/home/case03-home-visual.webp",
    type: "article",
  },
  case04: {
    zh: {
      path: "/design-samples/case-final-04",
      title: "行動療癒產品｜行動產品 UX/UI 設計案例",
      description: "重整既有行動產品的使用流程、互動狀態與恢復方式，建立更連貫的產品體驗。",
      imageAlt: "行動療癒產品的行動介面案例視覺",
    },
    en: {
      path: "/en/design-samples/case-final-04",
      title: "Mobile Wellness Product | UX/UI Case Study",
      description: "Restructuring an existing mobile product’s user flows, interaction states, and recovery paths into a more connected experience.",
      imageAlt: "Case study visual for an anonymized mobile wellness product",
    },
    image: "/images/home/case04-home-visual.webp",
    type: "article",
  },
} as const;

export type PublicSeoPage = keyof typeof PUBLIC_PAGES;

export function createPageMetadata(pageKey: PublicSeoPage, locale: Locale): Metadata {
  const page = PUBLIC_PAGES[pageKey];
  const current = page[locale];

  return {
    title: current.title,
    description: current.description,
    alternates: {
      canonical: current.path,
      languages: {
        "zh-Hant": page.zh.path,
        en: page.en.path,
        "x-default": page.zh.path,
      },
    },
    robots: { index: true, follow: true },
    openGraph: {
      type: page.type,
      title: current.title,
      description: current.description,
      url: current.path,
      siteName: "Angela Yu",
      locale: locale === "zh" ? "zh_TW" : "en_US",
      images: [{ url: page.image, alt: current.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: current.title,
      description: current.description,
      images: [page.image],
    },
  };
}
