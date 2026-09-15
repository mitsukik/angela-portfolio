import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { SelectedWork } from "@/components/home/SelectedWork/SelectedWork";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { HeaderThemeProvider } from "@/components/site/headerTheme";

export const metadata: Metadata = {
  title: "Angela Yu | 產品設計師",
  description: "常駐台灣的產品設計師 Angela Yu 的作品集首頁。",
  alternates: {
    languages: {
      "zh-Hant": "/",
      en: "/en",
    },
  },
};

export default function Home() {
  return (
    <div id="top" className="min-h-screen bg-background text-primary">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <HeaderThemeProvider>
        <SiteHeader locale="zh" page="home" />
        <main id="main-content" tabIndex={-1}>
          <Hero locale="zh" />
          <SelectedWork locale="zh" />
        </main>
      </HeaderThemeProvider>
      <SiteFooter locale="zh" />
    </div>
  );
}
