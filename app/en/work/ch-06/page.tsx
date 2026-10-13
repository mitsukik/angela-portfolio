import type { Metadata } from "next";
import { PrivateCasePage } from "@/components/v3/case/released/PrivateCasePage";
import { createPageMetadata } from "@/data/site-seo";

// CH06 = CASE07 (data/v3/order.ts). Imports only this case's page component.
export const metadata: Metadata = createPageMetadata("case07", "en");

export default function CaseCh06PageEn() {
  return <PrivateCasePage caseNo="07" locale="en" />;
}
