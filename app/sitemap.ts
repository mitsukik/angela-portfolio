import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/data/site-seo";
import { caseHref } from "@/data/v3/channel-routes";
import { CASE_DISPLAY_ORDER } from "@/data/v3/order";

const PUBLIC_ROUTE_PAIRS = [
  { zh: "/", en: "/en" },
  { zh: "/about", en: "/en/about" },
  ...CASE_DISPLAY_ORDER.map((no) => ({ zh: caseHref(no, "zh"), en: caseHref(no, "en") })),
];

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
