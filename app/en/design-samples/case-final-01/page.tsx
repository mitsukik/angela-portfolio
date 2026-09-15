import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyPrototype } from "@/components/design-samples/case-final/CaseStudyPrototype";
import { getCaseTheme } from "@/components/design-samples/case-final/caseTheme";
import { getNextProject, getPreviousProject, getProjectBySlug } from "@/data/projects";

export const metadata: Metadata = {
  title: "Design Sample — Case 01 (Complex System) — EN",
  robots: { index: false, follow: false },
};

const SAMPLE_SLUG = "complex-system";

export default function CaseFinal01PageEn() {
  const project = getProjectBySlug(SAMPLE_SLUG);
  if (!project) notFound();
  return (
    <CaseStudyPrototype
      theme={getCaseTheme(SAMPLE_SLUG)}
      project={project}
      nextProject={getNextProject(project)}
      previousProject={getPreviousProject(project)}
      locale="en"
      contentVersion="case01-v2"
    />
  );
}
