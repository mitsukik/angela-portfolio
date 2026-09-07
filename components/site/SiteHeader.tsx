"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Locale } from "@/data/locale";
import { getLenisInstance } from "@/components/site/lenisInstance";

// "case" is a non-nav page (Case Study) — neither WORK nor ABOUT should
// read as active there; existing "home"/"about" behavior is unchanged.
type Page = "home" | "about" | "case";

function pagePath(locale: Locale, page: Page): string {
  const prefix = locale === "en" ? "/en" : "";
  if (page === "about") return `${prefix}/about`;
  return prefix || "/";
}

/**
 * Ported from the connected Lovable "VER B" project's SiteHeader/
 * LanguageSwitch — always-dark header (bg-ink/text-paper, not the site's
 * theme background), nav-line underline behavior, language-switch pill
 * with a sliding acid thumb, and a full-screen clip-path mobile menu.
 *
 * Two deliberate departures from the Lovable source, both explicit
 * standing decisions for this Portfolio (not points of visual polish):
 * WORK links to /#selected-work (an anchor into Home's own pinned stage)
 * rather than a standalone /work index route, and the language switch
 * navigates between this site's existing per-locale routes (/, /en, ...)
 * rather than toggling client-side state — this codebase's i18n is
 * route-based, not a single-page language context.
 */
export function SiteHeader({ locale, page }: { locale: Locale; page: Page }) {
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

  const languageSwitch = (inverse = false) => (
    <div className={`language-switch ${inverse ? "language-switch-inverse" : ""}`} role="group" aria-label="語言 / Language">
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
    <header className="sticky top-0 z-50 bg-ink text-paper">
      <div className="mx-auto flex h-16 max-w-[1520px] items-center justify-between px-6 md:h-20 md:px-10 lg:px-14">
        <Link href={homeHref} className="group label-mono relative py-3 text-paper">
          ANGELA YU
        </Link>

        <nav aria-label={locale === "zh" ? "主要導覽" : "Primary navigation"} className="hidden items-center gap-10 md:flex">
          {navItems.map((item) =>
            item.onClick ? (
              <button key={item.href} type="button" onClick={item.onClick} className="nav-line label-mono py-3 text-paper/70">
                {item.label}
              </button>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                data-status={item.active ? "active" : undefined}
                className={`nav-line label-mono py-3 ${item.active ? "text-paper" : "text-paper/70"}`}
              >
                {item.label}
              </Link>
            ),
          )}
          {languageSwitch(true)}
        </nav>

        <button
          type="button"
          aria-label={open ? (locale === "zh" ? "關閉選單" : "Close menu") : locale === "zh" ? "開啟選單" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
          className="menu-trigger relative flex h-11 w-11 items-center justify-center text-paper md:hidden"
        >
          <span className={`menu-line ${open ? "translate-y-0 rotate-45" : "-translate-y-1"}`} />
          <span className={`menu-line ${open ? "translate-y-0 -rotate-45" : "translate-y-1"}`} />
        </button>
      </div>

      <div id="mobile-navigation" className={`mobile-menu md:hidden ${open ? "mobile-menu-open" : ""}`} aria-hidden={!open}>
        <nav className="flex h-full flex-col justify-between px-5 pb-8 pt-20" aria-label={locale === "zh" ? "行動版主要導覽" : "Mobile primary navigation"}>
          <div className="border-t border-paper/20">
            {navItems.map((item, index) =>
              item.onClick ? (
                <button
                  key={item.href}
                  type="button"
                  tabIndex={open ? 0 : -1}
                  onClick={item.onClick}
                  style={{ transitionDelay: open ? `${120 + index * 70}ms` : "0ms" }}
                  className="mobile-menu-link group flex w-full items-center justify-between border-b border-paper/20 py-6 text-left"
                >
                  <span className="text-[clamp(2.5rem,13vw,4.5rem)] font-semibold uppercase leading-none">{item.label}</span>
                  <span aria-hidden className="text-2xl transition-transform group-hover:translate-x-1">↗</span>
                </button>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  tabIndex={open ? 0 : -1}
                  onClick={() => setOpen(false)}
                  style={{ transitionDelay: open ? `${120 + index * 70}ms` : "0ms" }}
                  className="mobile-menu-link group flex items-center justify-between border-b border-paper/20 py-6"
                >
                  <span className="text-[clamp(2.5rem,13vw,4.5rem)] font-semibold uppercase leading-none">{item.label}</span>
                  <span aria-hidden className="text-2xl transition-transform group-hover:translate-x-1">↗</span>
                </Link>
              ),
            )}
          </div>
          <div className="mobile-menu-meta flex items-end justify-between" style={{ transitionDelay: open ? "280ms" : "0ms" }}>
            <p className="label-mono text-paper/50">{locale === "zh" ? "資深產品設計師" : "Senior Product Designer"}</p>
            {languageSwitch(true)}
          </div>
        </nav>
      </div>
    </header>
  );
}
