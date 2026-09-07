"use client";

import { getLenisInstance } from "@/components/site/lenisInstance";

export type Chapter = { number: string; label: string };

/**
 * Sticky chapter register (desktop only — mobile gets the chapter marker
 * inline per section instead, avoiding persistent bottom-viewport
 * clutter on small screens). Round 2: numeral + label render as one
 * always-visible unit ("01 / 問題"), not a bare numeral with a
 * hover-only label — Angela's explicit correction. ~16px, mono, active
 * chapter in acid with a short underline.
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
              className="cf-chapter-marker block text-left"
              data-active={active === index}
            >
              {chapter.number} / {chapter.label}
              <span aria-hidden className="cf-chapter-marker-rule" />
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
