"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { getAboutPageContent } from "@/data/about-page-v2";
import type { Locale } from "@/data/locale";
import { CustomCursor } from "@/components/site/CustomCursor";
import { SkipLink } from "@/components/site/SkipLink";
import { HomeContact, HomeFooter } from "@/components/home-v2/HomeContact";
import { HomeNav } from "@/components/home-v2/HomeNav";
import { finishLanguageFade } from "@/components/home-v2/languageFade";
import { initHomeMotion, initReveal } from "@/components/home-v2/motion";
import { AboutBackground } from "./AboutBackground";
import { AboutHero } from "./AboutHero";
import { BeyondSection } from "./BeyondSection";
import { CapabilityGraph } from "./CapabilityGraph";
import { Lightbox } from "./Lightbox";
import { MethodStage } from "./MethodStage";
import { ToolsList } from "./ToolsList";

/**
 * Portfolio V2 About page (`/about`, `/en/about`). Shares the Home V2
 * shell (tokens, nav, contact, footer, reveal, magnetic buttons, cursor);
 * copy comes from data/about-page-v2.ts, which reads data/about-v2.ts.
 */
export function AboutPageV2({ locale }: { locale: Locale }) {
  const content = useMemo(() => getAboutPageContent(locale), [locale]);
  const rootRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [zoomed, setZoomed] = useState(false);

  useLayoutEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-Hant" : "en";
    finishLanguageFade();
  }, [locale]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const stopMotion = initHomeMotion(root);
    const stopReveal = initReveal(root);
    return () => {
      stopMotion();
      stopReveal();
    };
  }, []);

  const openZoom = useCallback((trigger: HTMLElement) => {
    triggerRef.current = trigger;
    setZoomed(true);
  }, []);
  const closeZoom = useCallback(() => setZoomed(false), []);

  return (
    <div ref={rootRef} className="hv2 av2" data-locale={locale} data-drawer={zoomed ? "open" : "closed"}>
      <div ref={pageRef} className="hv2-page">
        <SkipLink locale={locale} />
        <HomeNav content={content} page="about" />
        <main id="main-content" tabIndex={-1}>
          <AboutHero content={content} />
          <AboutBackground content={content} />
          <section className="av2-section av2-what" aria-labelledby="av2-what-title">
            <div className="av2-section-head av2-section-head-split" data-reveal="">
              <div>
                <p className="av2-eyebrow" lang={locale === "zh" ? "zh-Hant" : "en"}>{content.graph.eyebrow}</p>
                <h2 id="av2-what-title" className="av2-h2" lang={locale === "zh" ? "zh-Hant" : "en"}>
                  {content.graph.heading}
                </h2>
              </div>
              <p className="hv2-hint" lang={locale === "zh" ? "zh-Hant" : "en"}>
                <span className="hv2-hint-hover">{content.graph.hintHover}</span>
                <span className="hv2-hint-touch">{content.graph.hintTouch}</span>
              </p>
            </div>
            <CapabilityGraph content={content} />
          </section>
          <MethodStage content={content} />
          <ToolsList content={content} />
          <BeyondSection content={content} onZoom={openZoom} />
          <HomeContact content={content} />
        </main>
        <HomeFooter content={content} variant="home" />
      </div>
      <Lightbox content={content} open={zoomed} onClose={closeZoom} pageRef={pageRef} triggerRef={triggerRef} />
      <CustomCursor />
    </div>
  );
}
