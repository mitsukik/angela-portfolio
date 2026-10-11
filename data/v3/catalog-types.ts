import type { Locale } from "@/data/locale";

/*
 * Shape of a catalog row (CASE05–07) as INDEX channels and the CASE sequence
 * consume it.
 */
type Localized = Record<Locale, string>;

export type CatalogCase = {
  id: string;
  number: string;
  slug: string;
  year: string;
  title: Localized;
  category: Localized;
  description: Localized;
  meta: Record<Locale, { label: string; value: string }[]>;
  image?: { src: string; crop: string };
  navImage?: string;
  /** INDEX-only TV background + channel-strip thumbnail (no case media, Previous/Next or OG). */
  indexImage?: string;
};
