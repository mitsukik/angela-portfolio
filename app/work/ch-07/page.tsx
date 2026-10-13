import type { Metadata } from "next";
import { CaseOriginalPage } from "@/components/v3/case/legacy/CaseOriginalPage";
import { createPageMetadata } from "@/data/site-seo";

// CH07 = CASE02 (data/v3/order.ts). Imports only this case's page component.
export const metadata: Metadata = createPageMetadata("case02", "zh");

export default function CaseCh07Page() {
  return <CaseOriginalPage caseNo="02" locale="zh" />;
}
