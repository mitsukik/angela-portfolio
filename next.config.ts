import type { NextConfig } from "next";
import { projects } from "./data/projects";
import { caseHref, legacyCasePath } from "./data/v3/channel-routes";
import { CASE_DISPLAY_ORDER } from "./data/v3/order";

/*
 * Public CASE URL migration: every pre-migration CASE URL permanently (308)
 * redirects straight to its channel URL (data/v3/channel-routes.ts) — one hop,
 * query string preserved by Next. Covers /design-samples/case-final-NN and
 * /en/…, plus the older /work/<project-slug> links.
 */
const caseRedirects = CASE_DISPLAY_ORDER.flatMap((no) =>
  (["zh", "en"] as const).map((locale) => ({
    source: legacyCasePath(no, locale),
    destination: caseHref(no, locale),
    permanent: true,
  })),
);

const projectSlugRedirects = projects.map((p) => ({
  source: `/work/${p.slug}`,
  destination: caseHref(p.number, "zh"),
  permanent: true,
}));

const nextConfig: NextConfig = {
  async redirects() {
    return [...caseRedirects, ...projectSlugRedirects];
  },
};

export default nextConfig;
