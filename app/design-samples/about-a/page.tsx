import type { Metadata } from "next";
import { AboutA } from "@/components/design-samples/AboutA";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export const metadata: Metadata = {
  title: "Design Sample — About A",
  robots: { index: false, follow: false },
};

export default function AboutASamplePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader locale="zh" page="about" />
      <AboutA locale="zh" />
      <SiteFooter locale="zh" />
    </div>
  );
}
