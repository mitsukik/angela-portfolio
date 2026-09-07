/**
 * Large chapter-break punctuation, not decorative filler — used only
 * between major narrative beats (see CaseStudyPrototype). Pure CSS
 * animation (off the main thread, immune to scroll jank); direction
 * alternates per instance to avoid every break feeling identical.
 * Reduced motion collapses to one static, centered label.
 */
export function SectionMarquee({
  zh,
  en,
  direction,
}: {
  zh: string;
  en: string;
  direction: "ltr" | "rtl";
}) {
  const unit = (
    <span className="mx-8 flex items-baseline gap-8 whitespace-nowrap">
      <span className="display-xl">{zh}</span>
      <span className="cf-meta cf-dim">{en}</span>
    </span>
  );

  return (
    <div aria-hidden="true" className="cf-marquee overflow-hidden border-y cf-rule py-10">
      <div className="cf-marquee-track" data-direction={direction}>
        {unit}
        {unit}
      </div>
    </div>
  );
}
