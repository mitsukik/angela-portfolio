"use client";

import Link from "next/link";
import { useState } from "react";
import type { Locale } from "@/data/locale";

type Page = "home" | "about";

function pagePath(locale: Locale, page: Page): string {
  const prefix = locale === "en" ? "/en" : "";
  if (page === "about") return `${prefix}/about`;
  return prefix || "/";
}

export function SiteHeader({ locale, page }: { locale: Locale; page: Page }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const homeHref = pagePath(locale, "home");
  const aboutHref = pagePath(locale, "about");
  const workHref = `${homeHref}#selected-work`;
  const contactHref = `${aboutHref}#contact`;
  const otherLocale: Locale = locale === "zh" ? "en" : "zh";
  const switchHref = pagePath(otherLocale, page);

  const languageSwitch = (
    <span className="inline-flex items-center gap-2 leading-none">
      {locale === "zh" ? (
        <span lang="zh-Hant" className="type-meta-zh leading-none">中</span>
      ) : (
        <Link href={switchHref} lang="zh-Hant" className="type-meta-zh leading-none transition-colors hover:text-accent-yellow">
          中
        </Link>
      )}
      <span aria-hidden="true" className="leading-none text-primary/50">/</span>
      {locale === "en" ? (
        <span className="leading-none text-primary">EN</span>
      ) : (
        <Link href={switchHref} className="leading-none transition-colors hover:text-accent-yellow">
          EN
        </Link>
      )}
    </span>
  );

  return (
    <>
      {/* DESKTOP HEADER */}
      <header className="sticky top-0 z-50 hidden border-b border-primary/8 bg-background/60 backdrop-blur-[22px] backdrop-saturate-150 lg:block">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-10 py-7 text-[16px] font-bold uppercase tracking-[0.18em] text-primary/80">
          <Link href={homeHref} className="font-bold text-primary">
            ANGELA YU
          </Link>

          <nav aria-label="Primary navigation" className="flex items-center gap-8">
            <Link href={workHref} className="link-nav">
              WORK
            </Link>

            <Link
              href={aboutHref}
              aria-current={page === "about" ? "page" : undefined}
              data-active={page === "about"}
              className="link-nav"
            >
              ABOUT
            </Link>

            {languageSwitch}
          </nav>
        </div>
      </header>

      {/* MOBILE HEADER */}
      <header className="sticky top-0 z-50 bg-background/60 backdrop-blur-[22px] backdrop-saturate-150 lg:hidden">
        <div className="relative mx-auto max-w-[1600px] px-6 py-4">
          {/* TOP BAR */}
          <div className="relative z-[70] flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-primary">
            <Link href={homeHref} className="font-medium">
              ANGELA YU
            </Link>

            <button
              type="button"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className="-m-3 flex min-h-11 items-center gap-2 px-3 font-medium text-primary transition-colors hover:text-accent-yellow"
            >
              {!isMobileMenuOpen && <span>MENU</span>}

              <span
                aria-hidden="true"
                className={`relative h-3 w-3 transition-transform duration-500 motion-reduce:transition-none
                  ease-editorial
                  ${isMobileMenuOpen ? "rotate-180" : "rotate-0"}
                `}
              >
                <span className="absolute left-[1px] top-[4px] h-px w-[7px] rotate-45 bg-current" />
                <span className="absolute right-[1px] top-[4px] h-px w-[7px] -rotate-45 bg-current" />
              </span>
            </button>
          </div>

          {/* EXPANDED GLASS MENU */}
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            aria-hidden={!isMobileMenuOpen}
            inert={!isMobileMenuOpen ? true : undefined}
            className={`absolute left-3 right-3 top-[52px] z-[60]
              rounded-[24px]
              border border-primary/12
              bg-background/68
              px-5 py-5
              backdrop-blur-[32px]
              backdrop-saturate-150
              transition-[transform,opacity] duration-500 motion-reduce:transition-none
              ease-editorial
              ${
                isMobileMenuOpen
                  ? "translate-y-0 opacity-100 pointer-events-auto"
                  : "-translate-y-6 opacity-0 pointer-events-none"
              }
            `}
          >
            <div className="flex flex-col items-end gap-5 text-[11px] uppercase tracking-[0.18em] text-primary">
              <Link
                href={workHref}
                onClick={() => setIsMobileMenuOpen(false)}
                className="link-nav -m-2 inline-flex min-h-8 items-center px-2"
              >
                WORK
              </Link>

              <Link
                href={aboutHref}
                onClick={() => setIsMobileMenuOpen(false)}
                aria-current={page === "about" ? "page" : undefined}
                data-active={page === "about"}
                className="link-nav -m-2 inline-flex min-h-8 items-center px-2"
              >
                ABOUT
              </Link>

              <div className="-m-2 inline-flex min-h-8 items-center px-2">
                {languageSwitch}
              </div>

              <Link
                href={contactHref}
                onClick={() => setIsMobileMenuOpen(false)}
                className="link-nav -m-2 inline-flex min-h-8 items-center px-2"
              >
                CONTACT
              </Link>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
