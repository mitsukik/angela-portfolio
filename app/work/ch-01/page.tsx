import type { Metadata } from "next";
import { CaseOriginalPage } from "@/components/v3/case/legacy/CaseOriginalPage";
import { createPageMetadata } from "@/data/site-seo";

// CH01 = CASE01 (data/v3/order.ts). Imports only this case's page component.
export const metadata: Metadata = createPageMetadata("case01", "zh");

export default function CaseCh01Page() {
  return <CaseOriginalPage caseNo="01" locale="zh" />;
}
