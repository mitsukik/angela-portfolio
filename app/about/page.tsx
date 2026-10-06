import type { Metadata } from "next";
import { AboutPageV2 } from "@/components/about-page-v2/AboutPageV2";

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
    <div id="top">
      <AboutPageV2 locale="zh" />
    </div>
  );
}
