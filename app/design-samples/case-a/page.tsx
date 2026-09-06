import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseA } from "@/components/design-samples/CaseA";
import { getNextProject, getProjectBySlug } from "@/data/projects";

export const metadata: Metadata = {
  title: "Design Sample — Case A",
  robots: { index: false, follow: false },
};

// Sample data source: Complex System — the most substantial existing
// project content (real overview/challenge/role/workflow/decisions/
// finalUI/outcome/learnings copy already written, not placeholder).
const SAMPLE_SLUG = "complex-system";

export default function CaseASamplePage() {
  const project = getProjectBySlug(SAMPLE_SLUG);
  if (!project) notFound();
  return <CaseA project={project} nextProject={getNextProject(project)} />;
}
