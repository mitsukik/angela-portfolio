import type { Metadata } from "next";
import { CaseOriginalPage } from "@/components/v3/case/legacy/CaseOriginalPage";
import { createPageMetadata } from "@/data/site-seo";

// CH03 = CASE04 (data/v3/order.ts). Imports only this case's page component.
export const metadata: Metadata = createPageMetadata("case04", "zh");

export default function CaseCh03Page() {
  return <CaseOriginalPage caseNo="04" locale="zh" />;
}
