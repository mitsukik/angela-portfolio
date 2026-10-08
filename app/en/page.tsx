import type { Metadata } from "next";
import { HomeV2 } from "@/components/home-v2/HomeV2";
import { createPageMetadata } from "@/data/site-seo";

export const metadata: Metadata = createPageMetadata("home", "en");

export default function HomeEn() {
  return (
    <div id="top">
      <HomeV2 locale="en" />
    </div>
  );
}
