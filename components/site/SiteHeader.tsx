"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/data/locale";
import { getLenisInstance } from "@/components/site/lenisInstance";
import { useHeaderThemeContext } from "@/components/site/headerTheme";

// "case" is a non-nav page (Case Study) — neither WORK nor ABOUT should
// read as active there; existing "home"/"about" behavior is unchanged.
type Page = "home" | "about" | "case";
type Variant = "dark" | "light";

function pagePath(locale: Locale, page: Page): string {
  const prefix = locale === "en" ? "/en" : "";
  if (page === "about") return `${prefix}/about`;
  return prefix || "/";
}

// Case Final's four numbered prototype routes now have a real bilingual
// pair under /en (see app/en/design-samples/case-final-0N) — same
// convention as Home and About, just added later once the Case route
// itself gained real locale-aware content (CaseStudyPrototype.tsx).
const BILINGUAL_ZH_PATH = /^(\/|\/about|\/design-samples\/case-final-0[1-4])$/;

/**
 * Bug fix history: the language switch originally derived its target
 * purely from the `page` abstraction ("home" | "about" | "case") via
 * `pagePath`, which only knew Home and About — every Case Final page
 * fell through to Home. That was fixed by reading the actual pathname
 * and staying put when no bilingual pair existed. Case Final has since
 * gained a real /en pair, so this now maps to it like Home/About always
 * did — same rule, bigger whitelist, no new locale system.
 *
 * Any route NOT in `BILINGUAL_ZH_PATH` (design-sample/comparison pages
 * with no English content, e.g. case-final-dark/light) still safely
 * stays on the exact same pathname rather than guessing a destination
 * that doesn't exist.
 */
function otherLocaleHref(pathname: string, currentLocale: Locale): string {
  if (currentLocale === "zh") {
    if (!BILINGUAL_ZH_PATH.test(pathname)) return pathname;
    return pathname === "/" ? "/en" : `/en${pathname}`;
  }
  const zhPath = pathname === "/en" ? "/" : pathname.startsWith("/en/") ? pathname.slice(3) : pathname;
  return BILINGUAL_ZH_PATH.test(zhPath) ? zhPath : pathname;
}

/**
 * Ported from the connected Lovable "VER B" project's SiteHeader/
 * LanguageSwitch — shared navigation-link behavior, language-switch pill with
 * a sliding acid thumb.
 *
 * `variant` (Round 2): the desktop header bar reads dark or light from
 * the CALLING PAGE's own fixed register (About always "dark"; a Case
 * Study page passes its own fixed theme from caseTheme.ts — currently
 * case01/03/04=dark, case02=light) — never from scroll position, and
 * never a user-facing toggle.
 *
 * Home (D1 fix): the one exception to "fixed register." Its Selected Work
 * section already alternates dark/light per pinned project (see
 * ProjectStageBackground in data/projects.ts) — previously the header
 * stayed hardcoded dark straight through, producing a hard seam under it
 * on CASE02/04's light stages. `useHeaderThemeContext` reads a live
 * variant reported by that section (via `useSyncHeaderVariant`, see
 * components/site/headerTheme.tsx) when Home wraps this tree in a
 * `HeaderThemeProvider`; it resolves to `null` everywhere else, so About
 * and every Case Study page are unaffected and keep using their plain
 * `variant` prop exactly as before.
 *
 * Three rounds (4-6) explored putting per-project context INTO this
 * shared header — inline text next to the wordmark, then a second full-
 * width band, then a composed "Project Context Bar" with real hierarchy.
 * All three were a misreading of Angela's feedback: her "header" meant
 * the Case Opening / project-introduction region below this component,
 * not SiteHeader itself. SiteHeader is back to being pure global
 * navigation on every page, Case included — no `caseContext` prop, no
 * per-page composition exception here. Project identity now lives
 * entirely in the Case Opening (see CaseStudyPrototype.tsx).
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
}: {
  locale: Locale;
  page: Page;
  variant?: Variant;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const themeCtx = useHeaderThemeContext();
  const resolvedVariant = themeCtx?.variant ?? variant;

  const homeHref = pagePath(locale, "home");
  const aboutHref = pagePath(locale, "about");
  const workHref = `${homeHref}#selected-work`;
  const switchHref = otherLocaleHref(pathname, locale);

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
        <span lang="en" className="language-switch-option" data-active="true" aria-current="true">EN</span>
      ) : (
        <Link href={switchHref} lang="en" className="language-switch-option">EN</Link>
      )}
    </div>
  );

  const navItems = [
    { label: locale === "zh" ? "作品" : "Work", href: workHref, onClick: handleWorkClick },
    { label: locale === "zh" ? "關於" : "About", href: aboutHref, active: page === "about" },
  ];

  return (
    <header data-header-variant={resolvedVariant} className="header-surface sticky top-0 z-50">
      <div className="site-frame-header flex h-14 items-center justify-between md:h-20">
        {/* lang="en" keeps this pure-Latin wordmark in the intended mono
            label font: without it, the global :lang(zh-Hant) rule (see
            globals.css) silently swaps it to the Chinese body font on
            every ZH route, same escape-hatch MixedText already uses for
            Latin runs inside Chinese copy. font-medium gives the primary
            identity mark slightly more presence than the quiet-utility
            nav beside it — the same weight already used for mobile-menu
            links, not a new value. */}
        <Link href={homeHref} lang="en" className="group type-v3-label relative py-3 font-medium header-fg">
          ANGELA YU
        </Link>

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
          {languageSwitch(resolvedVariant)}
        </nav>

        <button
          ref={triggerRef}
          type="button"
          aria-label={open ? (locale === "zh" ? "關閉選單" : "Close menu") : locale === "zh" ? "開啟選單" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
          className="menu-trigger header-fg relative z-10 flex h-11 w-11 items-center justify-center md:hidden"
        >
          <span className={`menu-line ${open ? "translate-y-0 rotate-45" : "-translate-y-1"}`} />
          <span className={`menu-line ${open ? "translate-y-0 -rotate-45" : "translate-y-1"}`} />
        </button>
      </div>

      {/* Minor-polish pass: a light scrim behind the open panel — the
          panel itself was already correct (see below), but with nothing
          dimming the rest of the page, content directly beneath the
          panel's own hairline read at full brightness, undercutting the
          "this is a navigation overlay" moment. Not a ref target, so the
          existing click-outside handler above already closes the menu
          on a scrim tap without any extra wiring. */}
      <div aria-hidden="true" className={`mobile-menu-scrim md:hidden ${open ? "mobile-menu-scrim-open" : ""}`} />

      {/* Round 4 correction: a compact website-navigation dropdown, not a
          settings/control-panel card. The earlier version repeated the
          brand and a second close control inside its own bordered,
          rounded, right-anchored card — reading as a floating dashboard
          popover. This flush, full-width panel continues directly off
          the header bar it belongs to (the header's own trigger already
          animates into a close affordance, and the brand is already
          visible above, so neither is repeated here) and reuses the
          header's own gutter (site-frame-header) instead of its own
          padding scale. Still an overlay — see .mobile-menu — so it
          never pushes page content down. */}
      <div
        ref={menuRef}
        id="mobile-navigation"
        className={`mobile-menu md:hidden ${open ? "mobile-menu-open" : ""}`}
        aria-hidden={!open}
      >
        <nav className="site-frame-header flex flex-col py-2" aria-label={locale === "zh" ? "行動版主要導覽" : "Mobile primary navigation"}>
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

        <div className="mobile-menu-meta site-frame-header flex justify-end border-t border-current/10 py-4">
          {languageSwitch(resolvedVariant)}
        </div>
      </div>
    </header>
  );
}
