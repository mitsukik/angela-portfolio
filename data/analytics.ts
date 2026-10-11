import { SITE_ORIGIN } from "./site-seo";

/*
 * Google Analytics 4 (Portfolio V3, approved 2026-10-10).
 *
 * Loaded only when BOTH hold:
 *  - build time: a Vercel *production* deployment (VERCEL_ENV === "production");
 *    local dev, `next start` on this machine and Vercel preview builds never
 *    render the tag;
 *  - run time: the page is served from the production host below, so a
 *    production build opened on localhost or another host sends nothing.
 * If a custom domain is added later, add its hostname to GA_HOSTS.
 */
export const GA_MEASUREMENT_ID = "G-Q42KLQ6YPR";

export const GA_HOSTS = [new URL(SITE_ORIGIN).hostname];

export const gaBuildEnabled = () => process.env.NODE_ENV === "production" && process.env.VERCEL_ENV === "production";

/*
 * Consent Mode v2 defaults. No advertising use anywhere. Analytics storage is
 * granted by default except in regions that require prior consent (EEA, UK,
 * Switzerland), where GA sends cookieless, consent-less pings only. A browser
 * Global Privacy Control signal is treated as a denial everywhere.
 */
export const CONSENT_REGIONS = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT",
  "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE", "IS", "LI", "NO", "GB", "CH",
];
