"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
 * LanguageSwitch — nav-line underline behavior, language-switch pill with
 * a sliding acid thumb, a full-screen clip-path mobile menu.
 *
 * `variant` (Round 2): the desktop header bar reads dark or light from
 * the CALLING PAGE's own fixed register (Home/About always "dark"; a
 * Case Study page passes its own case01/03=dark, case02/04=light theme)
 * — never from scroll position, and never a user-facing toggle. The
 * full-screen mobile menu intentionally stays dark regardless of variant
 * (matching the Lovable source, and keeping one strong, consistent
 * "reveal" moment rather than a second themed surface to maintain).
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

  const homeHref = pagePath(locale, "home");
  const aboutHref = pagePath(locale, "about");
  const workHref = `${homeHref}#selected-work`;
  const otherLocale: Locale = locale === "zh" ? "en" : "zh";
  const switchHref = pagePath(otherLocale, page);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
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
      <div className="mx-auto flex h-16 max-w-[1520px] items-center justify-between px-6 md:h-20 md:px-10 lg:px-14">
        <Link href={homeHref} className="group label-mono relative py-3 header-fg">
          ANGELA YU
        </Link>

        <nav aria-label={locale === "zh" ? "主要導覽" : "Primary navigation"} className="hidden items-center gap-10 md:flex">
          {navItems.map((item) =>
            item.onClick ? (
              <button key={item.href} type="button" onClick={item.onClick} className="nav-line label-mono py-3 header-fg-dim">
                {item.label}
              </button>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                data-status={item.active ? "active" : undefined}
                className={`nav-line label-mono py-3 ${item.active ? "header-fg" : "header-fg-dim"}`}
              >
                {item.label}
              </Link>
            ),
          )}
          {languageSwitch(variant)}
        </nav>

        <button
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

      {/* Full-screen mobile menu: intentionally always dark (ink/paper),
          independent of `variant` — one consistent reveal moment rather
          than a second themed surface. Refined per Angela's feedback:
          smaller type, no arrows, subtle dividers, rounded language
          switch, no oversized poster-style rows. */}
      <div id="mobile-navigation" className={`mobile-menu md:hidden ${open ? "mobile-menu-open" : ""}`} aria-hidden={!open}>
        <nav className="flex h-full flex-col justify-between px-6 pb-8 pt-6" aria-label={locale === "zh" ? "行動版主要導覽" : "Mobile primary navigation"}>
          <div className="flex items-center justify-between">
            <span className="label-mono text-paper/70">{locale === "zh" ? "選單" : "Menu"}</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="label-mono flex min-h-11 items-center px-2 text-paper transition-colors hover:text-acid"
            >
              {locale === "zh" ? "關閉" : "CLOSE"}
            </button>
          </div>

          <div className="border-t border-paper/12">
            {navItems.map((item, index) =>
              item.onClick ? (
                <button
                  key={item.href}
                  type="button"
                  tabIndex={open ? 0 : -1}
                  onClick={item.onClick}
                  style={{ transitionDelay: open ? `${100 + index * 60}ms` : "0ms" }}
                  className="mobile-menu-link flex w-full items-center border-b border-paper/12 py-5 text-left text-[1.5rem] font-medium tracking-[-0.01em] text-paper transition-colors hover:text-acid"
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  tabIndex={open ? 0 : -1}
                  onClick={() => setOpen(false)}
                  style={{ transitionDelay: open ? `${100 + index * 60}ms` : "0ms" }}
                  className="mobile-menu-link flex items-center border-b border-paper/12 py-5 text-[1.5rem] font-medium tracking-[-0.01em] text-paper transition-colors hover:text-acid"
                >
                  {item.label}
                </Link>
              ),
            )}
          </div>

          <div className="mobile-menu-meta flex items-center justify-between" style={{ transitionDelay: open ? "240ms" : "0ms" }}>
            <p className="label-mono text-paper/50">{locale === "zh" ? "資深產品設計師" : "Senior Product Designer"}</p>
            {languageSwitch("dark")}
          </div>
        </nav>
      </div>
    </header>
  );
}
