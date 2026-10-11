import type { Locale } from "@/data/locale";
import { projects } from "@/data/projects";
import { v3Title } from "@/data/v3/titles";
import { CATALOG_CASES } from "@/components/v3/case/released/catalog";
import { byDisplayOrder, slotLabel } from "@/data/v3/order";

/*
 * INDEX V3 channel data — built ONLY from the verified project source
 * (data/projects.ts), with the same locale + metadata rules the production
 * V2 Work Index uses (data/home-v2.ts buildWork). Nothing here is new fact:
 * title, category, year, platform, status and the one-line hook all come
 * from the project record — no invented metadata.
 *
 * CASE01–04 come from data/projects.ts and CASE05–07 from the CASE05–07
 * catalog. `no` is the permanent CASE number (routes, image overrides, crops);
 * `ch` is the visible channel slot, numbered by the presentation order in
 * data/v3/order.ts.
 *
 * `k` = the approved V3 category-tab membership per channel (prototype
 * design data, not a factual claim).
 */
const CHANNEL_TABS: Record<string, string[]> = {
  "01": ["sys", "com"],
  "02": ["web"],
  "03": ["sys"],
  "04": ["mob"],
  "05": ["sys"],
  "06": ["com", "mob"],
  "07": ["mob"],
};

/**
 * INDEX-only focal point for a channel's TV background + strip thumbnail
 * (CSS background-position). Unlisted channels stay `center`. The source
 * asset and every other surface (case page, Previous/Next, OG) are unaffected.
 */
const CHANNEL_POS: Record<string, string> = {
  "01": "50% 22%", // portrait photo: keep the presenter's head and face in frame
};

/**
 * INDEX-only TV background + strip thumbnail for public channels (approved
 * 2026-10-10). Case media, Previous/Next, OG and V2 keep their own images.
 * CASE05–07 overrides live in the CASE05–07 catalog (`indexImage`).
 */
const CHANNEL_IMAGE: Record<string, string> = {
  "02": "/images/home/case02-index-tv.webp",
};

/**
 * Phone-portrait framing of the INDEX TV only (viewport < 600px); thumbnails,
 * desktop, tablet and landscape keep `pos` / cover. CH02: the whole image as a
 * full-width band so all three websites read together (approved 2026-10-10).
 */
const CHANNEL_PHONE_FRAME: Record<string, { size: string; pos: string }> = {
  "02": { size: "100% auto", pos: "50% 18%" },
};

export type V3Channel = { no: string; ch: string; t: string; cat: string; y: string; pf: string; st: string; pub: true; k: string[]; hook: string; img?: string; pos?: string; msize?: string; mpos?: string };

export function v3Channels(locale: Locale): V3Channel[] {
  return [...publicChannels(locale), ...catalogChannels(locale)].sort((a, b) => byDisplayOrder(a.no, b.no)).map((c, i) => ({
    ...c,
    ch: slotLabel(i),
    ...(CHANNEL_IMAGE[c.no] ? { img: CHANNEL_IMAGE[c.no] } : {}),
    ...(CHANNEL_POS[c.no] ? { pos: CHANNEL_POS[c.no] } : {}),
    ...(CHANNEL_PHONE_FRAME[c.no] ? { msize: CHANNEL_PHONE_FRAME[c.no].size, mpos: CHANNEL_PHONE_FRAME[c.no].pos } : {}),
  }));
}

/** CASE05–07 from the CASE05–07 catalog. */
function catalogChannels(locale: Locale): Omit<V3Channel, "ch">[] {
  return CATALOG_CASES.map((c) => {
    const meta = Object.fromEntries(c.meta[locale].map((m) => [m.label, m.value]));
    return {
      no: c.number,
      t: c.title[locale],
      cat: c.category[locale],
      y: c.year,
      pf: meta["平台"] ?? meta.Platform ?? "",
      st: meta["狀態"] ?? meta.Status ?? "",
      pub: true as const,
      k: CHANNEL_TABS[c.number] ?? [],
      hook: c.description[locale],
      img: c.indexImage ?? c.navImage ?? c.image?.src,
    };
  });
}

function publicChannels(locale: Locale): Omit<V3Channel, "ch">[] {
  return projects.map((project) => {
    const study = locale === "en" && project.caseStudyEn ? project.caseStudyEn : project.caseStudy;
    const meta = study.metadata as Record<string, string>;
    const description = locale === "zh" ? project.description : project.descriptionEn;
    return {
      no: project.number,
      t: v3Title(project, locale),
      cat: project.category[locale],
      y: project.year,
      pf: meta["平台"] ?? meta.Platform ?? "",
      st: meta["狀態"] ?? meta.Status ?? "",
      pub: true,
      k: CHANNEL_TABS[project.number] ?? [],
      hook: description.join(locale === "zh" ? "" : " "),
    };
  });
}

/** Last visible channel slot, for "CH 01–NN" labels. */
export const v3ChannelMax = () => slotLabel(v3Channels("zh").length - 1);
