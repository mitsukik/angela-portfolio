import type { Metadata } from "next";
import { HomeV2 } from "@/components/home-v2/HomeV2";

export const metadata: Metadata = {
  title: "Angela Yu | Senior UI/UX Designer",
  description: "Portfolio of Senior UI/UX Designer Angela Yu, focused on complex systems, B2B, and enterprise UX/UI design and delivery.",
  alternates: {
    languages: {
      "zh-Hant": "/",
      en: "/en",
    },
  },
};

export default function HomeEn() {
  return (
    <div id="top">
      <HomeV2 locale="en" />
    </div>
  );
}
