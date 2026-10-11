"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Ref } from "react";
import type { Locale } from "@/data/locale";
import { CONTACT_EMAIL, contactLabels, resumeUrl } from "@/data/contact";
import { v2Ui } from "@/data/home-v2";
import { captureLanguageSwitch } from "@/components/site/navigationIntent";
import { LANG_FADE_MS, startLanguageFade } from "@/components/home-v2/languageFade";

/*
 * V3 site header (CaseV3Screen.dc.html). Nav labels reuse the approved V2
 * strings (data/home-v2.ts); "首頁 / Home" and "Email" are the V3 header's
 * own labels. Routes stay the V2 routes (`/` ↔ `/en`); the 中/EN pill swaps
 * the route with the existing 180ms content fade and keeps scroll position.
 * The email address is only ever a mailto destination, never printed.
 */
export function V3Header({
  locale,
  current,
  switchHref,
  progressRef,
}: {
  locale: Locale;
  current: "work" | "about" | "home";
  switchHref: string;
  progressRef?: Ref<HTMLDivElement>;
}) {
  const router = useRouter();
  const ui = v2Ui(locale);
  const zh = locale === "zh";
  const prefix = zh ? "" : "/en";
  const homeHref = prefix || "/";

  return (
    <header className="v3-header">
      <Link href={homeHref} className="v3-brand v3-navfx-brand" aria-label={zh ? "返回首頁" : "Back to Home"}>
        <span aria-hidden="true" className="v3-brand-led v3-navfx-led" />
        <span lang="en" className="v3-brand-name v3-navfx-name">ANGELA YU</span>
        <span aria-hidden="true" className="v3-brand-rule cv3-tab-up" />
        <span lang="en" className="v3-brand-sub cv3-tab-up">PORTFOLIO</span>
      </Link>
      <nav className="v3-nav" aria-label={ui.navLabel}>
        <Link href={homeHref} className="v3-nav-link v3-navfx cv3-tab-up" aria-current={current === "home" ? "page" : undefined}>
          {zh ? "首頁" : "Home"}
        </Link>
        <Link href={`${homeHref}#selected-work`} className="v3-nav-link v3-navfx" aria-current={current === "work" ? "page" : undefined}>
          {ui.nav.work}
        </Link>
        <Link href={`${prefix}/about`} className="v3-nav-link v3-navfx" aria-current={current === "about" ? "page" : undefined}>
          {ui.nav.about}
        </Link>
        <a href={`mailto:${CONTACT_EMAIL}`} className="v3-nav-link v3-navfx cv3-tab-up" lang="en">Email</a>
        <a href={resumeUrl(locale)} target="_blank" rel="noopener noreferrer" className="v3-nav-link v3-navfx cv3-tab-up">
          {contactLabels[locale].resume}
        </a>
        <Link
          href={switchHref}
          scroll={false}
          data-no-transition
          className="v3-lang v3-navfx-lang"
          aria-label={zh ? "中 EN — Switch to English" : "中 EN — 切換為中文"}
          lang={zh ? "en" : "zh-Hant"}
          onClick={(event) => {
            if (!startLanguageFade()) {
              captureLanguageSwitch(switchHref, locale);
              return;
            }
            event.preventDefault();
            window.setTimeout(() => {
              captureLanguageSwitch(switchHref, locale);
              router.push(switchHref, { scroll: false });
            }, LANG_FADE_MS);
          }}
        >
          <span lang="zh-Hant" className="v3-lang-seg" data-active={zh}>中</span>
          <span lang="en" className="v3-lang-seg" data-active={!zh}>EN</span>
        </Link>
      </nav>
      <div aria-hidden="true" ref={progressRef} className="v3-progress" />
    </header>
  );
}
