import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseB } from "@/components/design-samples/CaseB";
import { getNextProject, getProjectBySlug } from "@/data/projects";

export const metadata: Metadata = {
  title: "Design Sample — Case B",
  robots: { index: false, follow: false },
};

const SAMPLE_SLUG = "complex-system";

export default function CaseBSamplePage() {
  const project = getProjectBySlug(SAMPLE_SLUG);
  if (!project) notFound();
  return <CaseB project={project} nextProject={getNextProject(project)} />;
}
