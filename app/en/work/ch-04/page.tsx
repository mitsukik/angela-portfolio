import type { Metadata } from "next";
import { PrivateCasePage } from "@/components/v3/case/released/PrivateCasePage";
import { createPageMetadata } from "@/data/site-seo";

// CH04 = CASE05 (data/v3/order.ts). Imports only this case's page component.
export const metadata: Metadata = createPageMetadata("case05", "en");

export default function CaseCh04PageEn() {
  return <PrivateCasePage caseNo="05" locale="en" />;
}
