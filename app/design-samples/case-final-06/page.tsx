import type { Metadata } from "next";
import { PrivateCasePage as ReleasedCasePage } from "@/components/v3/case/released/PrivateCasePage";
import { createPageMetadata } from "@/data/site-seo";

export const metadata: Metadata = createPageMetadata("case06", "zh");

export default function Case06ZHPage() {
  return <ReleasedCasePage caseNo="06" locale="zh" />;
}
