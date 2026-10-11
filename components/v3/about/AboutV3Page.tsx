"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type MouseEvent } from "react";
import type { Locale } from "@/data/locale";
import { captureLanguageSwitch } from "@/components/site/navigationIntent";
import { finishLanguageFade, LANG_FADE_MS, startLanguageFade } from "@/components/home-v2/languageFade";
import { attachNemuMotion } from "../nemu/nemuMotion";
import AboutV3Desktop from "../dc/AboutV3Desktop";
import AboutV3Screen from "../dc/AboutV3Screen";

/*
 * ABOUT V3 — mounted exactly as the connected prototype does:
 * - desktop + tablet landscape (≥1024): the 1920×1080 "About V3 Desktop TV"
 *   artboard (6 chapters, each with its own motion graphic, sticky Remote),
 *   uniformly scaled to fit;
 * - tablet portrait (768–1023): AboutV3Screen layout="tablet", which mounts
 *   the motion-graphics version (AboutV3TabletMotion) — not the simplified one;
 * - mobile (<768): AboutV3Screen layout="mobile" (linear article + Floating Head).
 * Chapter animations run inside the compiled components unchanged.
 */

type Mode = { kind: "desk" | "tablet" | "mobile"; w: number; h: number };

export function AboutV3Page({ locale, summary }: { locale: Locale; summary: { title: string; lines: string[] } }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode | null>(null);
  const zh = locale === "zh";
  const prefix = zh ? "" : "/en";
  const switchHref = zh ? "/en/about" : "/about";

  useEffect(() => {
    const measure = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setMode({ kind: w >= 1024 ? "desk" : w >= 768 ? "tablet" : "mobile", w, h });
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
  const k = mode?.kind === "desk" ? Math.min(mode.w / 1920, mode.h / 1080) : 1;

  return (
    <div className="v3 v3-index cv3-fade" data-lenis-prevent>
      <div className="v3-sr">
        <h1>{summary.title}</h1>
        {!mode ? summary.lines.map((line) => <p key={line}>{line}</p>) : null}
      </div>
      {mode?.kind === "desk" ? (
        <div className="v3-index-stage">
          <div className="v3-index-board" style={{ transform: `scale(${k})`, left: (mode.w - 1920 * k) / 2, top: (mode.h - 1080 * k) / 2 }}>
            <AboutV3Desktop {...shared} />
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
