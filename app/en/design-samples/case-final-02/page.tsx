import type { Metadata } from "next";
import { CaseOriginalPage } from "@/components/v3/case/legacy/CaseOriginalPage";
import { createPageMetadata } from "@/data/site-seo";

export const metadata: Metadata = createPageMetadata("case02", "en");

export default function CaseFinal02PageEn() {
  return <CaseOriginalPage caseNo="02" locale="en" />;
}
