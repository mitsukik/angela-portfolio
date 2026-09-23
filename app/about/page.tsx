import type { Metadata } from "next";
import { AboutV2 } from "@/components/about-v2/AboutV2";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export const metadata: Metadata = {
  title: "關於 | Angela Yu",
  description: "關於資深 UI/UX 設計師 Angela Yu，以及她在複雜系統、B2B 與企業產品設計中的經驗與工作方式。",
  alternates: {
    languages: {
      "zh-Hant": "/about",
      en: "/en/about",
    },
  },
};

export default function AboutPage() {
  return (
    <div id="top" className="scene-dark min-h-screen">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <SiteHeader locale="zh" page="about" />

      <main id="main-content" tabIndex={-1}>
        <AboutV2 locale="zh" />
      </main>

      <SiteFooter locale="zh" />
    </div>
  );
}
