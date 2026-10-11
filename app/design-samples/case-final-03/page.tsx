import type { Metadata } from "next";
import { Case03Page } from "@/components/v3/case/case03/Case03Page";
import { createPageMetadata } from "@/data/site-seo";

export const metadata: Metadata = createPageMetadata("case03", "zh");

export default function CaseFinal03Page() {
  return <Case03Page locale="zh" />;
}
