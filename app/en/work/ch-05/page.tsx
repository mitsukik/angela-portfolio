import type { Metadata } from "next";
import { PrivateCasePage } from "@/components/v3/case/released/PrivateCasePage";
import { createPageMetadata } from "@/data/site-seo";

// CH05 = CASE06 (data/v3/order.ts). Imports only this case's page component.
export const metadata: Metadata = createPageMetadata("case06", "en");

export default function CaseCh05PageEn() {
  return <PrivateCasePage caseNo="06" locale="en" />;
}
