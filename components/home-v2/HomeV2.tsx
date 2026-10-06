"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { getHomeV2Content } from "@/data/home-v2";
import type { Locale } from "@/data/locale";
import { CaseDrawer } from "./CaseDrawer";
import { HomeContact, HomeFooter } from "./HomeContact";
import { HomeHero } from "./HomeHero";
import { HomeNav } from "./HomeNav";
import { ProofStrip } from "./ProofStrip";
import { SkillsMarquee } from "./SkillsMarquee";
import { WorkIndex, WorkPreview } from "./WorkIndex";
import { CustomCursor } from "@/components/site/CustomCursor";
import { finishLanguageFade } from "./languageFade";
import { initHomeMotion, initReveal } from "./motion";

/**
 * Portfolio V2 homepage (`/` and `/en`). Presentation layer only — every
 * fact comes from data/home-v2.ts, which reads the existing project, hero,
 * about and contact sources. Case Study routes are untouched.
 */
export function HomeV2({ locale }: { locale: Locale }) {
  const content = useMemo(() => getHomeV2Content(locale), [locale]);
  const rootRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [drawer, setDrawer] = useState({ open: false, index: 0 });

  // The root layout only sets <html lang> on first load; an in-app 中 / EN
  // switch is a client navigation, so keep it in step with the locale here.
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

  const openDrawer = useCallback((index: number, trigger: HTMLElement) => {
    triggerRef.current = trigger;
    setDrawer({ open: true, index });
  }, []);
  const closeDrawer = useCallback(() => setDrawer((state) => ({ ...state, open: false })), []);

  return (
    <div ref={rootRef} className="hv2" data-locale={locale} data-drawer={drawer.open ? "open" : "closed"}>
      <div ref={pageRef} className="hv2-page">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <HomeNav content={content} />
        <main id="main-content" tabIndex={-1}>
          <HomeHero content={content} />
          <SkillsMarquee content={content} />
          <WorkIndex content={content} onOpen={openDrawer} />
          <ProofStrip content={content} />
          <HomeContact content={content} />
        </main>
        <HomeFooter content={content} />
      </div>

      <WorkPreview content={content} />
      <CaseDrawer
        content={content}
        open={drawer.open}
        index={drawer.index}
        onClose={closeDrawer}
        pageRef={pageRef}
        triggerRef={triggerRef}
      />
      <CustomCursor />
    </div>
  );
}
