import type { Metadata } from "next";
import { AboutV3Page } from "@/components/v3/about/AboutV3Page";
import { getAboutPageContent } from "@/data/about-page-v2";
import { createPageMetadata } from "@/data/site-seo";

export const metadata: Metadata = createPageMetadata("about", "en");

export default function AboutPageEn() {
  // Crawlable summary from the approved About copy (the TV UI renders client-side).
  const about = getAboutPageContent("en");
  const headline = about.hero.headline.before + about.hero.headline.key + about.hero.headline.after;
  return (
    <div id="top">
      <AboutV3Page locale="en" summary={{ title: headline, lines: [about.hero.lede, about.background.text, about.background.closing].filter(Boolean) }} />
    </div>
  );
}
