import type { Locale } from "../locale";
import { CASE_DISPLAY_ORDER, slotLabel } from "./order";

/*
 * Public CASE URLs — one source for every link, canonical, hreflang, sitemap
 * entry and redirect. The URL carries the VISIBLE channel number
 * (/work/ch-02), derived from the approved presentation order in
 * data/v3/order.ts; CASE numbers stay the permanent internal IDs (media,
 * data, analytics `case_id`). Dependency-free so client components and
 * next.config.ts can import it.
 */

export type CaseNo = (typeof CASE_DISPLAY_ORDER)[number];

/** Public CASE URL slug for a CASE number: "03" → "ch-02". */
export const channelSlug = (caseNo: string): string => {
  const i = (CASE_DISPLAY_ORDER as readonly string[]).indexOf(caseNo);
  if (i < 0) throw new Error(`CASE${caseNo} has no public channel`);
  return `ch-${slotLabel(i)}`;
};

/** Public path of a CASE page: ("03", "en") → "/en/work/ch-02". */
export const caseHref = (caseNo: string, locale: Locale = "zh"): string =>
  `${locale === "en" ? "/en" : ""}/work/${channelSlug(caseNo)}`;

/** CASE number behind a public slug, or undefined when it is not a channel URL. */
export const caseNoForChannelSlug = (slug: string): CaseNo | undefined =>
  CASE_DISPLAY_ORDER.find((no) => channelSlug(no) === slug);

/** Every public channel slug, in channel order. */
export const CHANNEL_SLUGS = CASE_DISPLAY_ORDER.map((no) => channelSlug(no));

/** Pre-migration path of a CASE page — kept only as the source of permanent redirects. */
export const legacyCasePath = (caseNo: string, locale: Locale = "zh"): string =>
  `${locale === "en" ? "/en" : ""}/design-samples/case-final-${caseNo}`;
