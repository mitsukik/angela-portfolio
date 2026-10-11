import type { Metadata } from "next";
import { PrivateCasePage as ReleasedCasePage } from "@/components/v3/case/released/PrivateCasePage";
import { createPageMetadata } from "@/data/site-seo";

export const metadata: Metadata = createPageMetadata("case07", "zh");

export default function Case07ZHPage() {
  return <ReleasedCasePage caseNo="07" locale="zh" />;
}
