import type { Metadata } from "next";
import { AboutSections } from "@/components/about/AboutSections";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export const metadata: Metadata = {
  title: "About | Angela Yu",
  description: "About Angela Yu, a Product Designer based in Taiwan.",
  alternates: {
    languages: {
      "zh-Hant": "/about",
      en: "/en/about",
    },
  },
};

export default function AboutPageEn() {
  return (
    <div id="top" className="min-h-screen bg-background text-primary">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <SiteHeader locale="en" page="about" />

      <main id="main-content" tabIndex={-1}>
        <AboutSections locale="en" />
      </main>

      <SiteFooter />
    </div>
  );
}
