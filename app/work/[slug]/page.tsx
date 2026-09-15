import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getProjectBySlug, projects } from "@/data/projects";

/**
 * Legacy pre-"case-final" route. Whole-site QA (2026-09) found this
 * publicly reachable with no noindex, rendering the old CaseStudyTemplate
 * with stale naming/placeholder copy that no longer matches the current
 * case-final-0N pages (most notably CASE04, now anonymized as
 * "Confidential Mobile Wellness Product" — this route still showed the
 * pre-anonymization "Consumer Product" framing). components/design-samples/
 * CaseA.tsx and CaseB.tsx (both already noindexed, unlinked prototype
 * pages) still link here as their own internal "next project" — a
 * permanent redirect keeps those links resolving instead of 404ing.
 */
type CaseStudyPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  permanentRedirect(`/design-samples/case-final-${project.number}`);
}
