"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { V2Shell } from "@/data/home-v2";
import { captureLanguageSwitch } from "@/components/site/navigationIntent";
import { LANG_FADE_MS, startLanguageFade } from "./languageFade";
import { scrollToSection, scrollToTop } from "./scroll";

type Page = "home" | "about";

/**
 * V2 sticky navigation, shared by Home and About. Desktop/tablet: inline
 * row. Phone (<40rem): wordmark + language toggle + a menu button that
 * opens a floating panel (overlay — never pushes content), closed by Esc,
 * outside press or choice. On About, the About item is the current page.
 */
export function HomeNav({ content, page = "home" }: { content: V2Shell; page?: Page }) {
  const { locale, ui } = content;
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const prefix = locale === "en" ? "/en" : "";
  const homeHref = prefix || "/";
  const aboutHref = `${prefix}/about`;
  const switchHref =
    page === "about" ? (locale === "en" ? "/about" : "/en/about") : locale === "en" ? "/" : "/en";
  const onHome = page === "home";

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      const node = event.target as Node;
      if (panelRef.current?.contains(node) || triggerRef.current?.contains(node)) return;
      setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const anchor = (id: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    setOpen(false);
    scrollToSection(id);
  };

  const language = (
    <Link
      href={switchHref}
      scroll={false}
      onClick={(event) => {
        setOpen(false);
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
      className="hv2-lang"
      data-magnetic
      aria-label={locale === "zh" ? "中 EN — Switch to English" : "中 EN — 切換為中文"}
      lang={locale === "zh" ? "en" : "zh-Hant"}
    >
      <span lang="zh-Hant" className="hv2-lang-seg" data-active={locale === "zh"}>中</span>
      <span lang="en" className="hv2-lang-seg" data-active={locale === "en"}>EN</span>
    </Link>
  );

  return (
    <header className="hv2-nav" data-hv2-nav>
      <div className="hv2-nav-bar">
        {onHome ? (
          <a
            href="#top"
            lang="en"
            className="hv2-wordmark"
            onClick={(event) => {
              event.preventDefault();
              setOpen(false);
              scrollToTop();
            }}
          >
            ANGELA YU
          </a>
        ) : (
          <Link href={homeHref} lang="en" className="hv2-wordmark">
            ANGELA YU
          </Link>
        )}

        <nav aria-label={ui.navLabel} className="hv2-nav-links">
          {onHome ? (
            <a href="#selected-work" className="hv2-nav-link" data-magnetic onClick={anchor("selected-work")}>{ui.nav.work}</a>
          ) : (
            <Link href={`${homeHref}#selected-work`} className="hv2-nav-link" data-magnetic>{ui.nav.work}</Link>
          )}
          {onHome ? (
            <Link href={aboutHref} className="hv2-nav-link" data-magnetic>{ui.nav.about}</Link>
          ) : (
            <Link href={aboutHref} className="hv2-nav-link" data-current="true" aria-current="page">
              <span className="hv2-current-dot" aria-hidden />
              {ui.nav.about}
            </Link>
          )}
          <a href="#contact" className="hv2-nav-link" data-magnetic onClick={anchor("contact")}>{ui.nav.contact}</a>
        </nav>

        <div className="hv2-nav-end">
          {language}
          <button
            ref={triggerRef}
            type="button"
            className="hv2-menu-trigger"
            aria-label={open ? ui.nav.menuClose : ui.nav.menuOpen}
            aria-expanded={open}
            aria-controls="hv2-mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="hv2-menu-line" data-open={open} />
            <span className="hv2-menu-line" data-open={open} />
          </button>
        </div>
      </div>

      <div
        ref={panelRef}
        id="hv2-mobile-menu"
        className="hv2-menu"
        data-open={open}
        inert={!open}
      >
        <nav aria-label={ui.mobileNavLabel} className="hv2-menu-nav">
          {onHome ? (
            <a href="#selected-work" className="hv2-menu-link" onClick={anchor("selected-work")}>{ui.nav.work}</a>
          ) : (
            <Link href={`${homeHref}#selected-work`} className="hv2-menu-link" onClick={() => setOpen(false)}>{ui.nav.work}</Link>
          )}
          <Link
            href={aboutHref}
            className="hv2-menu-link"
            data-current={!onHome || undefined}
            aria-current={onHome ? undefined : "page"}
            onClick={() => setOpen(false)}
          >
            {ui.nav.about}
          </Link>
          <a href="#contact" className="hv2-menu-link" onClick={anchor("contact")}>{ui.nav.contact}</a>
        </nav>
      </div>
    </header>
  );
}
