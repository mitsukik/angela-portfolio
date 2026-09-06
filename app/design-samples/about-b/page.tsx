import type { Metadata } from "next";
import { AboutB } from "@/components/design-samples/AboutB";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export const metadata: Metadata = {
  title: "Design Sample — About B",
  robots: { index: false, follow: false },
};

export default function AboutBSamplePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader locale="zh" page="about" />
      <AboutB locale="zh" />
      <SiteFooter locale="zh" />
    </div>
  );
}
