"use client";

import { getLenisInstance } from "@/components/site/lenisInstance";
import type { Locale } from "@/data/locale";

export type Chapter = { number: string };

/**
 * Sticky chapter register (desktop only — mobile gets the section meta
 * label inline per section instead, avoiding persistent bottom-viewport
 * clutter on small screens). Round 3: reverted to numerals ONLY per
 * Angela's explicit correction — Round 2's "01 / 問題" combined unit
 * duplicated the section's own meta label, which already lives in the
 * content column. The descriptive label belongs there, not here.
 *
 * Accessible-language fix: the nav's own landmark label and every
 * button's label were previously hardcoded to "章節" / "Section N"
 * respectively — Chinese and English at once, on every locale, on every
 * one of the four case studies (this is the one shared component both
 * routes render). Now both follow `locale` like every other accessible
 * label in this file family.
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
  const goToChapter = (index: number) => {
    const target = sectionRefs.current[index];
    if (!target) return;
    const lenis = getLenisInstance();
    if (lenis) {
      lenis.scrollTo(target, { offset: -24 });
    } else {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const navLabel = locale === "zh" ? "章節" : "Chapters";
  const sectionLabel = (number: string) => (locale === "zh" ? `第 ${number} 節` : `Section ${number}`);

  return (
    <nav aria-label={navLabel} lang={locale === "zh" ? "zh-Hant" : "en"} className="sticky top-24 hidden self-start pl-1 md:block">
      <ol className="space-y-5">
        {chapters.map((chapter, index) => (
          <li key={chapter.number}>
            <button
              type="button"
              onClick={() => goToChapter(index)}
              aria-current={active === index ? "true" : undefined}
              aria-label={sectionLabel(chapter.number)}
              className="cf-chapter-marker block text-left"
              data-active={active === index}
            >
              {chapter.number}
              <span aria-hidden className="cf-chapter-marker-rule" />
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
