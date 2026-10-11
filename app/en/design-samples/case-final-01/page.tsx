import type { Metadata } from "next";
import { CaseOriginalPage } from "@/components/v3/case/legacy/CaseOriginalPage";
import { createPageMetadata } from "@/data/site-seo";

export const metadata: Metadata = createPageMetadata("case01", "en");

export default function CaseFinal01PageEn() {
  return <CaseOriginalPage caseNo="01" locale="en" />;
}
