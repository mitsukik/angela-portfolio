"use client";

import { useEffect, useId, useRef, useState } from "react";
import { getLenisInstance } from "@/components/site/lenisInstance";
import type { Locale } from "@/data/locale";

export type Chapter = { number: string };

const LABEL_PREFIX = /^\s*\d{1,2}\s*[—–-]\s*/;

/**
 * Chapter navigator — a signature interaction whose whole point is
 * clarity: where am I, what comes next, can I jump there.
 *
 * Desktop (md+): the compact numeral rail stays the resting state (Angela's
 * standing "numerals only" decision), and on hover / keyboard focus it
 * opens into a labelled index over the page. The active numeral's rule
 * doubles as a reading-progress meter for the current chapter (Track).
 *
 * Mobile (<md): a small floating "03 / 05" control that opens the same
 * labelled index. It stays out of the way while reading downward and
 * returns when the reader pauses or scrolls back up.
 *
 * Labels are read from each chapter's own rendered section label
 * (`.cf-section-label`, e.g. "03 — Designing the System"), so the index can
 * never drift from the page it describes and adds no second copy source.
 */
export function ChapterRegister({
  chapters,
  active,
  sectionRefs,
  locale,
}: {
  chapters: Chapter[];
  active: number;
  sectionRefs: React.RefObject<Array<HTMLElement | null>>;
  locale: Locale;
}) {
  const zh = locale === "zh";
  const [labels, setLabels] = useState<string[]>([]);
  const navRef = useRef<HTMLElement | null>(null);
  const pillRef = useRef<HTMLDivElement | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [pillVisible, setPillVisible] = useState(false);
  const sheetId = useId();
  const pillTriggerRef = useRef<HTMLButtonElement | null>(null);
  const sheetItemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // Read once the chapters have rendered (sections are siblings further
  // down the tree, so this runs from a task, not synchronously).
  const count = chapters.length;
  useEffect(() => {
    const id = window.setTimeout(() => {
      setLabels(
        Array.from({ length: count }, (_, index) => {
          const text = sectionRefs.current[index]?.querySelector(".cf-section-label")?.textContent ?? "";
          return text.replace(LABEL_PREFIX, "").trim();
        }),
      );
    }, 0);
    return () => window.clearTimeout(id);
  }, [count, sectionRefs]);

  // Reading progress inside the current chapter + mobile control
  // visibility. One passive scroll listener, rAF-throttled, writing a CSS
  // variable — no React render per scroll frame.
  useEffect(() => {
    let frame = 0;
    let lastY = window.scrollY;
    let idleTimer = 0;
    let visible = false;

    const setVisible = (next: boolean) => {
      if (next === visible) return;
      visible = next;
      setPillVisible(next);
    };

    const update = () => {
      frame = 0;
      const sections = sectionRefs.current.filter((el): el is HTMLElement => Boolean(el));
      if (!sections.length) return;
      const anchor = window.innerHeight * 0.4;
      const first = sections[0].getBoundingClientRect();
      const last = sections[sections.length - 1].getBoundingClientRect();
      const inside = first.top < anchor && last.bottom > anchor;

      const nav = navRef.current;
      if (nav) {
        let progress = 0;
        for (const section of sections) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= anchor && rect.bottom > anchor) {
            progress = Math.min(1, Math.max(0, (anchor - rect.top) / rect.height));
            break;
          }
        }
        nav.style.setProperty("--chapter-progress", progress.toFixed(3));
      }

      const y = window.scrollY;
      const goingDown = y > lastY + 2;
      const goingUp = y < lastY - 2;
      lastY = y;
      if (!inside) setVisible(false);
      else if (goingUp) setVisible(true);
      else if (goingDown) setVisible(false);

      window.clearTimeout(idleTimer);
      if (inside) idleTimer = window.setTimeout(() => setVisible(true), 900);
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.cancelAnimationFrame(frame);
      window.clearTimeout(idleTimer);
    };
  }, [sectionRefs]);

  // Mobile index: opens focused on the current chapter; Escape / outside
  // tap close it, and Escape returns focus to the control.
  useEffect(() => {
    if (!sheetOpen) return;
    sheetItemRefs.current[active]?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSheetOpen(false);
        pillTriggerRef.current?.focus();
      }
    };
    const onPointer = (event: PointerEvent) => {
      if (!pillRef.current?.contains(event.target as Node)) setSheetOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
    // Focus moves to the current chapter only at the moment the index opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheetOpen]);

  const goToChapter = (index: number) => {
    const target = sectionRefs.current[index];
    if (!target) return;
    // Land the chapter below the sticky header, not underneath it.
    const header = document.querySelector("header");
    const offset = -((header?.getBoundingClientRect().height ?? 0) + 24);
    const focusTarget = () => {
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    };
    const lenis = getLenisInstance();
    if (lenis) {
      lenis.scrollTo(target, { offset, onComplete: focusTarget });
    } else {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const top = target.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
      focusTarget();
    }
  };

  const navLabel = zh ? "章節" : "Chapters";
  const labelFor = (index: number) => labels[index] || (zh ? `第 ${chapters[index].number} 節` : `Section ${chapters[index].number}`);
  const lastNumber = chapters[chapters.length - 1]?.number ?? "";
  const current = Math.min(Math.max(active, 0), chapters.length - 1);

  return (
    <>
      <nav
        ref={navRef}
        aria-label={navLabel}
        lang={zh ? "zh-Hant" : "en"}
        className="cf-chapter-nav sticky top-24 z-30 hidden self-start md:block"
      >
        <ol className="cf-chapter-list">
          {chapters.map((chapter, index) => {
            const isActive = current === index;
            return (
              <li key={chapter.number}>
                <button
                  type="button"
                  onClick={() => goToChapter(index)}
                  aria-current={isActive ? "location" : undefined}
                  className="cf-chapter-marker"
                  data-active={isActive}
                >
                  <span className="cf-chapter-number">
                    {chapter.number}
                    <span aria-hidden className="cf-chapter-marker-rule" />
                  </span>
                  <span className="cf-chapter-label">
                    <span className="sr-only"> — </span>
                    <span className="cf-chapter-label-text">{labelFor(index)}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Mobile equivalent — the same index, one tap away. */}
      <div ref={pillRef} className="cf-chapter-pill md:hidden" data-visible={pillVisible || sheetOpen} lang={zh ? "zh-Hant" : "en"}>
        {sheetOpen && (
          <div id={sheetId} className="cf-chapter-sheet" role="group" aria-label={navLabel}>
            <ol>
              {chapters.map((chapter, index) => (
                <li key={chapter.number}>
                  <button
                    ref={(el) => {
                      sheetItemRefs.current[index] = el;
                    }}
                    type="button"
                    className="cf-chapter-sheet-item"
                    data-active={current === index}
                    aria-current={current === index ? "location" : undefined}
                    onClick={() => {
                      setSheetOpen(false);
                      goToChapter(index);
                    }}
                  >
                    <span className="cf-chapter-sheet-number">{chapter.number}</span>
                    <span className="cf-chapter-sheet-label">{labelFor(index)}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        )}
        <button
          ref={pillTriggerRef}
          type="button"
          className="cf-chapter-pill-trigger"
          aria-expanded={sheetOpen}
          aria-controls={sheetOpen ? sheetId : undefined}
          aria-label={`${navLabel} ${chapters[current].number} / ${lastNumber} — ${labelFor(current)}`}
          tabIndex={pillVisible || sheetOpen ? 0 : -1}
          onClick={() => setSheetOpen((value) => !value)}
        >
          <span className="cf-chapter-pill-count">
            {chapters[current].number}
            <span className="cf-chapter-pill-total"> / {lastNumber}</span>
          </span>
          <span className="cf-chapter-pill-label">{labelFor(current)}</span>
          <span aria-hidden className="cf-chapter-pill-chevron" data-open={sheetOpen} />
        </button>
      </div>
    </>
  );
}
