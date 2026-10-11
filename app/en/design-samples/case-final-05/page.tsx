import type { Metadata } from "next";
import { PrivateCasePage as ReleasedCasePage } from "@/components/v3/case/released/PrivateCasePage";
import { createPageMetadata } from "@/data/site-seo";

export const metadata: Metadata = createPageMetadata("case05", "en");

export default function Case05ENPage() {
  return <ReleasedCasePage caseNo="05" locale="en" />;
}
