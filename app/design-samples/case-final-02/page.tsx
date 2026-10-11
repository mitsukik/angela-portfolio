import type { Metadata } from "next";
import { CaseOriginalPage } from "@/components/v3/case/legacy/CaseOriginalPage";
import { createPageMetadata } from "@/data/site-seo";

export const metadata: Metadata = createPageMetadata("case02", "zh");

export default function CaseFinal02Page() {
  return <CaseOriginalPage caseNo="02" locale="zh" />;
}
