import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyPrototype } from "@/components/design-samples/case-final/CaseStudyPrototype";
import { getNextProject, getPreviousProject, getProjectBySlug } from "@/data/projects";

export const metadata: Metadata = {
  title: "Design Sample — Case Final (Dark)",
  robots: { index: false, follow: false },
};

const SAMPLE_SLUG = "complex-system";

export default function CaseFinalDarkPage() {
  const project = getProjectBySlug(SAMPLE_SLUG);
  if (!project) notFound();
  return (
    <CaseStudyPrototype
      theme="dark"
      project={project}
      nextProject={getNextProject(project)}
      previousProject={getPreviousProject(project)}
      locale="zh"
    />
  );
}
