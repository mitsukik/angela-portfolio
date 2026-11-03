import type { Metadata } from "next";
import { Case09Page } from "@/components/v3/case/case09/Case09Page";
import { createPageMetadata } from "@/data/site-seo";

// CH08 = CASE09 (data/v3/order.ts). Imports only this case's page component.
export const metadata: Metadata = createPageMetadata("case09", "zh");

export default function CaseCh08Page() {
  return <Case09Page locale="zh" />;
}
