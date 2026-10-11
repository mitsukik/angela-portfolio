import { projects, type Project } from "@/data/projects";
import type { CatalogCase } from "@/data/v3/catalog-types";
import { byDisplayOrder, slotLabel } from "@/data/v3/order";
import { CATALOG_CASES } from "@/components/v3/case/released/catalog";

/*
 * The V3 channel sequence — one source for CASE prev/next, the published
 * channel count and INDEX, ordered by data/v3/order.ts. CASE01–04 come from
 * data/projects.ts; CASE05–07 from the CASE05–07 catalog.
 */

/** Catalog row → the Project shape the shared shell reads (no new facts). */
export function catalogProject(row: CatalogCase): Project {
  return {
    id: row.id,
    slug: row.slug,
    number: row.number,
    year: row.year,
    category: row.category,
    title: row.title.en,
    chineseTitle: row.title.zh,
    description: [row.description.zh],
    descriptionEn: [row.description.en],
    image: row.image?.src ?? "",
    homeImage: row.navImage ?? row.image?.src,
    homeCrop: row.image?.crop,
    alt: row.title.en,
    caseStudy: { metadata: {} },
    caseStudyEn: { metadata: {} },
  } as unknown as Project;
}

export function v3Sequence(): Project[] {
  return [...projects, ...CATALOG_CASES.map(catalogProject)].sort((a, b) => byDisplayOrder(a.number, b.number));
}

/** Visible channel slot ("01"…) of a CASE in the published sequence (data/v3/order.ts). */
export function v3Slot(caseNumber: string): string {
  return slotLabel(v3Sequence().findIndex((p) => p.number === caseNumber));
}

export function v3Neighbours(project: Pick<Project, "number">): { previous: Project; next: Project } {
  const seq = v3Sequence();
  const i = seq.findIndex((p) => p.number === project.number);
  return { previous: seq[(i - 1 + seq.length) % seq.length], next: seq[(i + 1) % seq.length] };
}
