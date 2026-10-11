import type { CatalogCase } from "@/data/v3/catalog-types";
import { legacyCases } from "./legacy-cases";

/*
 * CASE05–07 catalog: the rows INDEX channels and the CASE sequence read.
 * Only these three cases are listed.
 */
/** INDEX channel images (INDEX TV + thumbnail only). */
const INDEX_IMAGE: Record<string, string> = {
  "05": "/legacy-assets/case05/case05-index-tv.webp",
  "06": "/legacy-assets/case06/case06-index-tv.webp",
  "07": "/legacy-assets/case07/case07-index-tv.webp",
};

export const CATALOG_CASES: CatalogCase[] = legacyCases
  .filter((c) => ["05", "06", "07"].includes(c.number))
  .map((c) => (INDEX_IMAGE[c.number] ? { ...c, indexImage: INDEX_IMAGE[c.number] } : c));
