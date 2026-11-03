import type { CatalogCase } from "@/data/v3/catalog-types";
import { legacyCases } from "./legacy-cases";
import { CASE09_CATALOG } from "../case09/catalog";

/*
 * CASE05–07 + CASE09 catalog: the rows INDEX channels and the CASE sequence
 * read. Only these four cases are listed (CASE09 = 遠見房屋, its own module).
 */
/** INDEX channel images (INDEX TV + thumbnail only). */
const INDEX_IMAGE: Record<string, string> = {
  "05": "/legacy-assets/case05/case05-index-tv.webp",
  "06": "/legacy-assets/case06/case06-index-tv.webp",
  "07": "/legacy-assets/case07/case07-index-tv.webp",
};

export const CATALOG_CASES: CatalogCase[] = [
  ...legacyCases
    .filter((c) => ["05", "06", "07"].includes(c.number))
    .map((c) => (INDEX_IMAGE[c.number] ? { ...c, indexImage: INDEX_IMAGE[c.number] } : c)),
  CASE09_CATALOG,
];
