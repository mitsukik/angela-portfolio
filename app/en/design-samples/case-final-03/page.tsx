import type { Metadata } from "next";
import { Case03Page } from "@/components/v3/case/case03/Case03Page";
import { createPageMetadata } from "@/data/site-seo";

export const metadata: Metadata = createPageMetadata("case03", "en");

export default function CaseFinal03PageEn() {
  return <Case03Page locale="en" />;
}
