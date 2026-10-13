import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CasePublicPage } from "@/components/v3/case/CasePublicPage";
import { createPageMetadata, type PublicSeoPage } from "@/data/site-seo";
import { CHANNEL_SLUGS, caseNoForChannelSlug } from "@/data/v3/channel-routes";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return CHANNEL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const no = caseNoForChannelSlug((await params).slug);
  return no ? createPageMetadata(`case${no}` as PublicSeoPage, "en") : {};
}

export default async function CaseChannelPageEn({ params }: Props) {
  const no = caseNoForChannelSlug((await params).slug);
  if (!no) notFound();
  return <CasePublicPage caseNo={no} locale="en" />;
}
