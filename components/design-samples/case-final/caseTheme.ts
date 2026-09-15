/**
 * Case Study theme configuration — the FINAL system (no dark/light user
 * toggle, no A/B comparison). Each project has one fixed theme:
 *
 *   01 Complex System      -> dark
 *   02 Corporate Website   -> light
 *   03 IoT System          -> dark
 *   04 Consumer Product    -> dark (the real product's own UI is a dark,
 *                              moody navy/gold product — switched from
 *                              the earlier generic "light" placeholder
 *                              set before real evidence existed, so the
 *                              case page reads consistently with its
 *                              own screenshots, same as CASE01/03)
 *
 * This is prepared architecture only — production /work/[slug] does not
 * read from this yet (see CaseStudyPrototype.tsx's own doc comment).
 * Wiring it into all four production case studies is a separate,
 * deliberate migration step once the Case Final direction is approved,
 * not an automatic side effect of adding this config.
 */
import type { ProjectStageBackground } from "@/data/projects";

export const caseThemeBySlug: Record<string, ProjectStageBackground> = {
  "complex-system": "dark",
  "corporate-website": "light",
  "iot-system": "dark",
  "consumer-product": "dark",
};

export function getCaseTheme(slug: string): ProjectStageBackground {
  return caseThemeBySlug[slug] ?? "dark";
}
