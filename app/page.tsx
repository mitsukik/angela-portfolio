import type { Metadata } from "next";
import { HomeV2 } from "@/components/home-v2/HomeV2";

export const metadata: Metadata = {
  title: "Angela Yu | 資深 UI/UX 設計師",
  description: "資深 UI/UX 設計師 Angela Yu 的作品集，聚焦複雜系統、B2B 與企業產品的 UX/UI 設計與落地。",
  alternates: {
    languages: {
      "zh-Hant": "/",
      en: "/en",
    },
  },
};

export default function Home() {
  return (
    <div id="top">
      <HomeV2 locale="zh" />
    </div>
  );
}
