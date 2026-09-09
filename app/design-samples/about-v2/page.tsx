import type { Metadata } from "next";
import { AboutV2 } from "@/components/about-v2/AboutV2";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

// Isolated About VER2 prototype — does not touch the production /about
// route (VER1) or its data/components. For Angela's in-browser review
// only; not linked from anywhere in the live site.
export const metadata: Metadata = {
  title: "關於 VER2 (Prototype) | Angela Yu",
  robots: { index: false, follow: false },
};

export default function AboutV2Page() {
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
