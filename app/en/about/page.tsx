import type { Metadata } from "next";
import { AboutPageV2 } from "@/components/about-page-v2/AboutPageV2";
import { createPageMetadata } from "@/data/site-seo";

export const metadata: Metadata = createPageMetadata("about", "en");

export default function AboutPageEn() {
  return (
    <div id="top">
      <AboutPageV2 locale="en" />
    </div>
  );
}
