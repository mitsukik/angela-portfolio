/*
 * THE presentation order of the Portfolio V3 cases (approved 2026-10-10) —
 * the single source for INDEX channels (TV, strip, Remote, keys), the CASE
 * Previous/Next sequence (with wraparound) and every visible "CH NN" slot.
 *
 * Entries are permanent CASE numbers: routes, SEO, media and the INDEX image
 * overrides / crops stay keyed by CASE number. The visible channel slot
 * (CH01…) is the position among the cases that are actually published, so a
 * build without CASE05–07 shows CASE01/03/04/02 as CH01–04 with no gap.
 */
export const CASE_DISPLAY_ORDER = ["01", "03", "04", "05", "06", "07", "02"] as const;

const rank = (no: string) => {
  const i = (CASE_DISPLAY_ORDER as readonly string[]).indexOf(no);
  return i < 0 ? CASE_DISPLAY_ORDER.length : i;
};

/** Sort comparator by presentation order (unknown numbers last, by number). */
export const byDisplayOrder = (a: string, b: string) => rank(a) - rank(b) || a.localeCompare(b);

/** Visible channel slot label for a position (0-based) → "01". */
export const slotLabel = (index: number) => String(index + 1).padStart(2, "0");
