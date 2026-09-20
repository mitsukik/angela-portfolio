import type { Metadata } from "next";
import { AboutV2 } from "@/components/about-v2/AboutV2";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

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
    <div id="top" className="scene-dark min-h-screen">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <SiteHeader locale="en" page="about" />

      <main id="main-content" tabIndex={-1}>
        <AboutV2 locale="en" />
      </main>

      <SiteFooter locale="en" />
    </div>
  );
}
