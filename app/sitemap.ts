import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/data/site-seo";

const PUBLIC_ROUTE_PAIRS = [
  { zh: "/", en: "/en" },
  { zh: "/about", en: "/en/about" },
  { zh: "/design-samples/case-final-01", en: "/en/design-samples/case-final-01" },
  { zh: "/design-samples/case-final-02", en: "/en/design-samples/case-final-02" },
  { zh: "/design-samples/case-final-03", en: "/en/design-samples/case-final-03" },
  { zh: "/design-samples/case-final-04", en: "/en/design-samples/case-final-04" },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_ROUTE_PAIRS.flatMap(({ zh, en }) => {
    const languages = {
      "zh-Hant": new URL(zh, SITE_ORIGIN).toString(),
      en: new URL(en, SITE_ORIGIN).toString(),
      "x-default": new URL(zh, SITE_ORIGIN).toString(),
    };

    return [
      { url: new URL(zh, SITE_ORIGIN).toString(), alternates: { languages } },
      { url: new URL(en, SITE_ORIGIN).toString(), alternates: { languages } },
    ];
  });
}
