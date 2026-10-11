import type { Metadata } from "next";
import { PrivateCasePage as ReleasedCasePage } from "@/components/v3/case/released/PrivateCasePage";
import { createPageMetadata } from "@/data/site-seo";

export const metadata: Metadata = createPageMetadata("case05", "zh");

export default function Case05ZHPage() {
  return <ReleasedCasePage caseNo="05" locale="zh" />;
}
