import type { Metadata } from "next";
import { Case03Page } from "@/components/v3/case/case03/Case03Page";
import { createPageMetadata } from "@/data/site-seo";

// CH02 = CASE03 (data/v3/order.ts). Imports only this case's page component.
export const metadata: Metadata = createPageMetadata("case03", "zh");

export default function CaseCh02Page() {
  return <Case03Page locale="zh" />;
}
