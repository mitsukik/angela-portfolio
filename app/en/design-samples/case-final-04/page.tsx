import type { Metadata } from "next";
import { CaseOriginalPage } from "@/components/v3/case/legacy/CaseOriginalPage";
import { createPageMetadata } from "@/data/site-seo";

export const metadata: Metadata = createPageMetadata("case04", "en");

export default function CaseFinal04PageEn() {
  return <CaseOriginalPage caseNo="04" locale="en" />;
}
