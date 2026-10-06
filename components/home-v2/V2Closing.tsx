"use client";

import { useEffect, useMemo, useRef } from "react";
import { v2Contact, v2Ui, type V2Shell } from "@/data/home-v2";
import type { Locale } from "@/data/locale";
import { HomeContact, HomeFooter } from "./HomeContact";
import { initHomeMotion, initReveal } from "./motion";

/**
 * The Home V2 closing (contact block + footer row) for pages that are not
 * themselves V2 pages — the Case Studies. Same component, tokens, magnetic
 * buttons and reveal as Home / About, so the site ends identically
 * everywhere.
 */
export function V2Closing({ locale }: { locale: Locale }) {
  const shell = useMemo<V2Shell>(() => ({ locale, ui: v2Ui(locale), contact: v2Contact(locale) }), [locale]);
  const rootRef = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={rootRef} className="hv2 hv2-closing-only" data-locale={locale}>
      <HomeContact content={shell} />
      <HomeFooter content={shell} />
    </div>
  );
}
