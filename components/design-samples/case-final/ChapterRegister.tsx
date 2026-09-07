"use client";

import { getLenisInstance } from "@/components/site/lenisInstance";

export type Chapter = { number: string };

/**
 * Sticky chapter register (desktop only — mobile gets the section meta
 * label inline per section instead, avoiding persistent bottom-viewport
 * clutter on small screens). Round 3: reverted to numerals ONLY per
 * Angela's explicit correction — Round 2's "01 / 問題" combined unit
 * duplicated the section's own meta label, which already lives in the
 * content column. The descriptive label belongs there, not here.
 */
export function ChapterRegister({
  chapters,
  active,
  sectionRefs,
}: {
  chapters: Chapter[];
  active: number;
  sectionRefs: React.RefObject<Array<HTMLElement | null>>;
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

  return (
    <nav aria-label="章節" className="sticky top-24 hidden self-start pl-1 md:block">
      <ol className="space-y-5">
        {chapters.map((chapter, index) => (
          <li key={chapter.number}>
            <button
              type="button"
              onClick={() => goToChapter(index)}
              aria-current={active === index ? "true" : undefined}
              aria-label={`Section ${chapter.number}`}
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
