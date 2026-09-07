"use client";

import { getLenisInstance } from "@/components/site/lenisInstance";

export type Chapter = { number: string; label: string };

/**
 * Sticky chapter register (desktop only — mobile gets the chapter number
 * inline per section instead, avoiding persistent bottom-viewport
 * clutter on small screens). Numerals sized for real readability
 * (~1rem/16px, per Angela's feedback that the previous sample's chapter
 * marks were too small) without becoming visually dominant next to the
 * display headings.
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
    <nav
      aria-label="章節"
      className="sticky top-24 hidden self-start pl-1 md:block"
    >
      <ol className="space-y-4">
        {chapters.map((chapter, index) => (
          <li key={chapter.number}>
            <button
              type="button"
              onClick={() => goToChapter(index)}
              aria-current={active === index ? "true" : undefined}
              className="cf-chapter-marker group flex items-baseline gap-2 text-left"
              data-active={active === index}
            >
              <span>{chapter.number}</span>
              <span className="max-w-[7rem] truncate opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                {chapter.label}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
