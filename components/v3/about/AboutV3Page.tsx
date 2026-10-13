"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import type { Locale } from "@/data/locale";
import { captureLanguageSwitch } from "@/components/site/navigationIntent";
import { finishLanguageFade, LANG_FADE_MS, startLanguageFade } from "@/components/home-v2/languageFade";
import { attachNemuMotion } from "../nemu/nemuMotion";
import { ABOUT_TV_MIN_WIDTH, laptopTv } from "../laptopTv";
import { useTvPageScroll } from "../useTvPageScroll";
import AboutV3Desktop from "../dc/AboutV3Desktop";
import AboutV3Screen from "../dc/AboutV3Screen";

/*
 * ABOUT V3 — mounted exactly as the connected prototype does:
 * - desktop (≥1181): the 1920×1080 "About V3 Desktop TV" artboard
 *   (6 chapters, each with its own motion graphic, sticky Remote), scaled to
 *   fit down to a readable scale, below which the Laptop TV layout adapts the
 *   board (../laptopTv.ts);
 * - tablet (768–1180): AboutV3Screen layout="tablet" — narrower screens can't
 *   hold the chapter compositions at a readable size (F-01) — which mounts
 *   the motion-graphics version (AboutV3TabletMotion) — not the simplified one;
 * - mobile (<768): AboutV3Screen layout="mobile" (linear article + Floating Head).
 * Chapter animations run inside the compiled components unchanged.
 */

type Mode = { kind: "desk" | "tablet" | "mobile"; w: number; h: number };

export function AboutV3Page({ locale, summary }: { locale: Locale; summary: { title: string; lines: string[] } }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const zh = locale === "zh";
  const prefix = zh ? "" : "/en";
  const switchHref = zh ? "/en/about" : "/about";

  useEffect(() => {
    const measure = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setMode({ kind: w >= ABOUT_TV_MIN_WIDTH ? "desk" : w >= 768 ? "tablet" : "mobile", w, h });
    };
    measure();
    window.addEventListener("resize", measure);
    document.documentElement.lang = zh ? "zh-Hant" : "en";
    finishLanguageFade();
    return () => window.removeEventListener("resize", measure);
  }, [zh]);

  useEffect(() => attachNemuMotion(), []);

  const onSwitchLang = (event?: MouseEvent) => {
    event?.preventDefault();
    const go = () => {
      captureLanguageSwitch(switchHref, locale);
      router.push(switchHref, { scroll: false });
    };
    if (!startLanguageFade()) go();
    else window.setTimeout(go, LANG_FADE_MS);
  };

  const shared = { lang: locale, onSwitchLang, homeHref: prefix || "/", workHref: `${prefix || ""}/#channels` };
  const tv = mode?.kind === "desk" ? laptopTv(mode.w, mode.h, "about", locale) : null;
  useTvPageScroll(stageRef, !!tv?.pageScroll);

  return (
    <div className="v3 v3-index cv3-fade" data-lenis-prevent style={tv?.pageScroll ? { minHeight: tv.h * tv.k } : undefined}>
      <div className="v3-sr">
        <h1>{summary.title}</h1>
        {!mode ? summary.lines.map((line) => <p key={line}>{line}</p>) : null}
      </div>
      {mode?.kind === "desk" && tv ? (
        <div ref={stageRef} className="v3-index-stage" data-tv-scroll={tv.pageScroll ? "page" : undefined} style={tv.pageScroll ? { height: tv.h * tv.k } : undefined}>
          <div
            className="v3-index-board"
            data-tv-mode={tv.mode}
            style={{ ...tv.vars, width: tv.w, height: tv.h, transform: `scale(${tv.k})`, left: (mode.w - tv.w * tv.k) / 2, top: tv.pageScroll ? 0 : (mode.h - tv.h * tv.k) / 2 } as CSSProperties}
          >
            <AboutV3Desktop {...shared} dock={tv.dock} />
          </div>
        </div>
      ) : null}
      {mode && mode.kind !== "desk" ? (
        <div className="v3-index-stage">
          <AboutV3Screen {...shared} layout={mode.kind} __hostStyle="position:absolute;inset:0" />
        </div>
      ) : null}
    </div>
  );
}
