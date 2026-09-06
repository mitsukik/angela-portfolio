import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { SelectedWork } from "@/components/home/SelectedWork/SelectedWork";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export const metadata: Metadata = {
  title: "Angela Yu | Product Designer",
  description: "Minimal product designer portfolio landing page.",
  alternates: {
    languages: {
      "zh-Hant": "/",
      en: "/en",
    },
  },
};

export default function HomeEn() {
  return (
    <div id="top" className="min-h-screen bg-background text-primary">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <SiteHeader locale="en" page="home" />
      <main id="main-content" tabIndex={-1}>
        <Hero locale="en" />
        <SelectedWork locale="en" />
      </main>
      <SiteFooter locale="en" />
    </div>
  );
}
