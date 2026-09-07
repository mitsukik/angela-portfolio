"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/data/locale";
import { getLenisInstance } from "@/components/site/lenisInstance";

// "case" is a non-nav page (Case Study) — neither WORK nor ABOUT should
// read as active there; existing "home"/"about" behavior is unchanged.
type Page = "home" | "about" | "case";
type Variant = "dark" | "light";

function pagePath(locale: Locale, page: Page): string {
  const prefix = locale === "en" ? "/en" : "";
  if (page === "about") return `${prefix}/about`;
  return prefix || "/";
}

/**
 * Ported from the connected Lovable "VER B" project's SiteHeader/
 * LanguageSwitch — shared navigation-link behavior, language-switch pill with
 * a sliding acid thumb.
 *
 * `variant` (Round 2): the desktop header bar reads dark or light from
 * the CALLING PAGE's own fixed register (Home/About always "dark"; a
 * Case Study page passes its own case01/03=dark, case02/04=light theme)
 * — never from scroll position, and never a user-facing toggle.
 *
 * `caseContext` (Round 3, optional): when set, the header shows real
 * project info (number + category — never fabricated, sourced from the
 * calling page's own data) alongside the brand, so a Case page's header
 * feels composed rather than a few controls floating in an empty bar.
 * Home/About omit this and are unaffected.
 *
 * Mobile menu (Round 3): rebuilt as a compact anchored dropdown — not a
 * full-screen takeover — sized to its own content, theme-matched to
 * `variant`. Contains only brand + WORK/ABOUT + language switch + close;
 * no arrows, no extra labels.
 *
 * Two deliberate departures from the Lovable source, both explicit
 * standing decisions for this Portfolio: WORK links to /#selected-work
 * rather than a standalone /work index route, and the language switch
 * navigates between this site's existing per-locale routes rather than
 * toggling client-side state.
 */
export function SiteHeader({
  locale,
  page,
  variant = "dark",
  caseContext,
}: {
  locale: Locale;
  page: Page;
  variant?: Variant;
  caseContext?: { number: string; category: string };
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const homeHref = pagePath(locale, "home");
  const aboutHref = pagePath(locale, "about");
  const workHref = `${homeHref}#selected-work`;
  const otherLocale: Locale = locale === "zh" ? "en" : "zh";
  const switchHref = pagePath(otherLocale, page);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (menuRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
      setOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const handleWorkClick = () => {
    setOpen(false);
    const target = document.getElementById("selected-work");
    if (target) {
      const lenis = getLenisInstance();
      if (lenis) {
        lenis.scrollTo(target);
      } else {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }
    router.push(workHref);
  };

  const languageSwitch = (tone: Variant) => (
    <div className={`language-switch language-switch-${tone}`} role="group" aria-label="語言 / Language">
      <span aria-hidden className="language-switch-thumb" style={{ transform: `translateX(${locale === "en" ? "100%" : "0"})` }} />
      {locale === "zh" ? (
        <span lang="zh-Hant" className="language-switch-option" data-active="true" aria-current="true">中</span>
      ) : (
        <Link href={switchHref} lang="zh-Hant" className="language-switch-option">中</Link>
      )}
      {locale === "en" ? (
        <span className="language-switch-option" data-active="true" aria-current="true">EN</span>
      ) : (
        <Link href={switchHref} className="language-switch-option">EN</Link>
      )}
    </div>
  );

  const navItems = [
    { label: locale === "zh" ? "作品" : "Work", href: workHref, onClick: handleWorkClick },
    { label: locale === "zh" ? "關於" : "About", href: aboutHref, active: page === "about" },
  ];

  return (
    <header data-header-variant={variant} className="header-surface sticky top-0 z-50">
      <div className="site-frame-header flex h-16 items-center justify-between md:h-20">
        <div className="flex items-baseline gap-4">
          <Link href={homeHref} className="group type-v3-label relative py-3 header-fg">
            ANGELA YU
          </Link>
          {caseContext && (
            <span className="header-fg-dim hidden type-v3-label py-3 sm:inline">
              {caseContext.number} — {caseContext.category}
            </span>
          )}
        </div>

        <nav aria-label={locale === "zh" ? "主要導覽" : "Primary navigation"} className="hidden items-center gap-10 md:flex">
          {navItems.map((item) =>
            item.onClick ? (
              <button key={item.href} type="button" onClick={item.onClick} className="interaction-nav type-v3-label py-3 header-fg-dim">
                {item.label}
              </button>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                data-status={item.active ? "active" : undefined}
                className={`interaction-nav type-v3-label py-3 ${item.active ? "header-fg" : "header-fg-dim"}`}
              >
                {item.label}
              </Link>
            ),
          )}
          {languageSwitch(variant)}
        </nav>

        <button
          ref={triggerRef}
          type="button"
          aria-label={open ? (locale === "zh" ? "關閉選單" : "Close menu") : locale === "zh" ? "開啟選單" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
          className="menu-trigger header-fg relative flex h-11 w-11 items-center justify-center md:hidden"
        >
          <span className={`menu-line ${open ? "translate-y-0 rotate-45" : "-translate-y-1"}`} />
          <span className={`menu-line ${open ? "translate-y-0 -rotate-45" : "translate-y-1"}`} />
        </button>
      </div>

      {/* Compact anchored dropdown (Round 3) — not a full-screen menu.
          Theme-matched to `variant` via --hdr-panel-bg. Only brand +
          WORK/ABOUT + language switch + close; no extra labels, no
          arrows. */}
      <div
        ref={menuRef}
        id="mobile-navigation"
        className={`mobile-menu md:hidden ${open ? "mobile-menu-open" : ""}`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b border-current/10 px-5 py-4">
          <span className="mobile-menu-meta type-v3-label header-fg">ANGELA YU</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            tabIndex={open ? 0 : -1}
            aria-label={locale === "zh" ? "關閉選單" : "Close menu"}
            className="mobile-menu-meta header-fg-dim flex h-8 w-8 items-center justify-center transition-colors hover:text-acid"
          >
            <span aria-hidden className="text-lg leading-none">×</span>
          </button>
        </div>

        <nav className="px-5 py-3" aria-label={locale === "zh" ? "行動版主要導覽" : "Mobile primary navigation"}>
          {navItems.map((item) =>
            item.onClick ? (
              <button
                key={item.href}
                type="button"
                tabIndex={open ? 0 : -1}
                onClick={item.onClick}
                className="mobile-menu-link header-fg flex w-full items-center py-3 text-left text-[1.05rem] font-medium tracking-[-0.01em] transition-colors hover:text-acid"
              >
                {item.label}
              </button>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
                className="mobile-menu-link header-fg flex items-center py-3 text-[1.05rem] font-medium tracking-[-0.01em] transition-colors hover:text-acid"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="mobile-menu-meta flex justify-end border-t border-current/10 px-5 py-4">
          {languageSwitch(variant)}
        </div>
      </div>
    </header>
  );
}
