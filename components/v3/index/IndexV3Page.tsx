"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import type { Locale } from "@/data/locale";
import type { V3Channel } from "@/data/v3/channels";
import strings from "@/data/v3/index-strings.json";
import { resumeUrl } from "@/data/contact";
import { captureLanguageSwitch } from "@/components/site/navigationIntent";
import { finishLanguageFade, LANG_FADE_MS, startLanguageFade } from "@/components/home-v2/languageFade";
import { attachNemuMotion } from "../nemu/nemuMotion";
import { laptopTv } from "../laptopTv";
import { useTvPageScroll } from "../useTvPageScroll";
import IndexV3Desktop from "../dc/IndexV3Desktop";
import IndexV3Mobile from "../dc/IndexV3Mobile";

/*
 * INDEX V3 — mounts the approved designs exactly as the connected
 * prototype does (Portfolio V3 Connected.dc.html):
 * - desktop + tablet landscape (≥1024): the 1920×1080 INDEX artboard,
 *   scaled to fit and centred (prototype `crop`) down to a readable scale,
 *   below which the Laptop TV layout adapts the board (../laptopTv.ts);
 * - tablet portrait + mobile (<1024): IndexV3MobileScreen with vw/vh.
 * Hero → Channels, the original CRT channel switch, tabs, keyboard and
 * Nemu all run inside the compiled components unchanged.
 */

type Mode = { kind: "desk"; w: number; h: number } | { kind: "mob"; w: number; h: number };

const SEG_ON_D = "background:var(--v3-lime);color:var(--v3-on-lime);border-radius:999px;padding:4px 10px";
const SEG_OFF_D = "padding:4px 10px;color:rgba(244,241,234,.6)";
const SEG_ON_M = "background:var(--v3-lime);color:var(--v3-on-lime);border-radius:999px;padding:4px 8px";
const SEG_OFF_M = "padding:4px 8px;color:rgba(244,241,234,.6)";

export function IndexV3Page({ locale, channels, chMax }: { locale: Locale; channels: V3Channel[]; chMax: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode | null>(null);
  const [startIn, setStartIn] = useState<"home" | "channels">("home");
  const stageRef = useRef<HTMLDivElement>(null);
  const zh = locale === "zh";
  const prefix = zh ? "" : "/en";
  const switchHref = zh ? "/en" : "/";

  const L = useMemo(
    () => Object.fromEntries(Object.entries(strings).filter(([k]) => !k.startsWith("_")).map(([k, v]) => [k, (v as { zh: string; en: string })[locale]])),
    [locale],
  );

  useEffect(() => {
    const measure = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setMode(w >= 1024 ? { kind: "desk", w, h } : { kind: "mob", w, h });
    };
    // Deep links from CASE "All channels" / the V2 anchor open on Channels.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of the URL hash on mount
    if (/^#(channels|selected-work)$/.test(window.location.hash)) setStartIn("channels");
    measure();
    window.addEventListener("resize", measure);
    document.documentElement.lang = zh ? "zh-Hant" : "en";
    finishLanguageFade();
    return () => window.removeEventListener("resize", measure);
  }, [zh]);

  useEffect(() => attachNemuMotion(), []);

  const onSwitchLang = (event: MouseEvent) => {
    event.preventDefault();
    if (!startLanguageFade()) {
      captureLanguageSwitch(switchHref, locale);
      router.push(switchHref, { scroll: false });
      return;
    }
    window.setTimeout(() => {
      captureLanguageSwitch(switchHref, locale);
      router.push(switchHref, { scroll: false });
    }, LANG_FADE_MS);
  };

  const shared = {
    L,
    lang: locale,
    channels,
    prefix,
    chMax,
    chMaxDigit: String(Number(chMax)),
    resumeHref: resumeUrl(locale),
    aboutHref: `${prefix}/about`,
    homeHref: prefix || "/",
    zhActive: zh ? "true" : "false",
    enActive: zh ? "false" : "true",
    switchHref,
    onSwitchLang,
    startIn,
    zhSegD: zh ? SEG_ON_D : SEG_OFF_D,
    enSegD: zh ? SEG_OFF_D : SEG_ON_D,
    zhSeg: zh ? SEG_ON_M : SEG_OFF_M,
    enSeg: zh ? SEG_OFF_M : SEG_ON_M,
  };

  const tv = mode?.kind === "desk" ? laptopTv(mode.w, mode.h, "index", locale) : null;
  useTvPageScroll(stageRef, !!tv?.pageScroll);

  return (
    <div className="v3 v3-index cv3-fade" data-lenis-prevent style={tv?.pageScroll ? { minHeight: tv.h * tv.k } : undefined}>
      {/* Crawlable / screen-reader summary (the TV UI is canvas-like). */}
      <div className="v3-sr">
        <h1>{zh ? "Angela Yu — 作品集" : "Angela Yu — Portfolio"}</h1>
        {!mode ? (
          <>
            <p>{L.heroStatement}</p>
            <ul>
              {channels.map((c) => (
                <li key={c.no}>
                  <a href={`${prefix}/work/ch-${c.ch}`}>{`CH ${c.ch} · ${c.t}`}</a>
                </li>
              ))}
              <li>
                <a href={`${prefix}/about`}>{L.navAbout}</a>
              </li>
            </ul>
          </>
        ) : null}
      </div>
      {mode?.kind === "desk" && tv ? (
        <div ref={stageRef} className="v3-index-stage" data-tv-scroll={tv.pageScroll ? "page" : undefined} style={tv.pageScroll ? { height: tv.h * tv.k } : undefined}>
          <div
            className="v3-index-board"
            data-tv-mode={tv.mode}
            style={{ ...tv.vars, width: tv.w, height: tv.h, transform: `scale(${tv.k})`, left: (mode.w - tv.w * tv.k) / 2, top: tv.pageScroll ? 0 : (mode.h - tv.h * tv.k) / 2 } as CSSProperties}
          >
            <IndexV3Desktop key={`d-${startIn}`} {...shared} dock={tv.dock} />
          </div>
        </div>
      ) : null}
      {mode?.kind === "mob" ? (
        <div className="v3-index-stage">
          <IndexV3Mobile key={`m-${startIn}`} {...shared} vw={mode.w} vh={mode.h} __hostStyle="position:absolute;inset:0" />
        </div>
      ) : null}
    </div>
  );
}
