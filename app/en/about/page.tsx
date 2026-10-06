import type { Metadata } from "next";
import { AboutPageV2 } from "@/components/about-page-v2/AboutPageV2";

export const metadata: Metadata = {
  title: "About | Angela Yu",
  description: "About Senior UI/UX Designer Angela Yu, her experience, and her approach to complex systems, B2B, and enterprise product design.",
  alternates: {
    languages: {
      "zh-Hant": "/about",
      en: "/en/about",
    },
  },
};

export default function AboutPageEn() {
  return (
    <div id="top">
      <AboutPageV2 locale="en" />
    </div>
  );
}
