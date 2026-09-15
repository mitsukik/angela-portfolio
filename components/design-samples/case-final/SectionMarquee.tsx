/**
 * Large chapter-break punctuation, not decorative filler — used only
 * between major narrative beats (see CaseStudyPrototype). Pure CSS
 * animation (off the main thread, immune to scroll jank); direction
 * alternates per instance to avoid every break feeling identical.
 * Reduced motion collapses to one static, centered label.
 *
 * Round 2 fixes: Chinese and English now render at the SAME size (both
 * on .cf-h2-scale, differentiated only by color/weight — English is not
 * a smaller caption anymore) and the track repeats the unit enough times
 * (8, not 2) that its combined width safely exceeds any real viewport at
 * this type scale — with too few repetitions the track was narrower than
 * the viewport, so each loop showed a stretch of bare background before
 * snapping back to start, reading as "the text disappears and reappears."
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
    <span className="mx-10 flex items-baseline gap-6 whitespace-nowrap">
      <span className="cf-heading cf-marquee-scale font-semibold">{zh}</span>
      <span className="cf-dim cf-marquee-scale font-semibold">{en}</span>
    </span>
  );

  const half = Array.from({ length: 8 }, (_, i) => <span key={i}>{unit}</span>);

  return (
    <div aria-hidden="true" className="cf-marquee overflow-hidden border-y cf-rule py-8">
      <div className="cf-marquee-track" data-direction={direction}>
        <span className="flex">{half}</span>
        <span className="flex">{half}</span>
      </div>
    </div>
  );
}
