import type { HomeV2Content } from "@/data/home-v2";

// Seconds of travel per item — keeps the loop around 50px/s whatever the
// number of skills, so the strip stays calm and readable.
const SECONDS_PER_ITEM = 4.6;

/**
 * Skills strip. The loop is a pure CSS translate (compositor only, no JS);
 * the duplicate copy is hidden from assistive tech. It pauses on hover /
 * keyboard focus; under reduced motion it becomes a static wrapped list.
 */
export function SkillsMarquee({ content }: { content: HomeV2Content }) {
  const { marquee, ui } = content;
  const list = (hidden: boolean) => (
    <ul className="hv2-marquee-list" aria-hidden={hidden || undefined}>
      {marquee.map((item) => (
        <li key={item} lang="en" className="hv2-marquee-item">
          <span>{item}</span>
          <span className="hv2-marquee-star" aria-hidden>✦</span>
        </li>
      ))}
    </ul>
  );

  return (
    <section className="hv2-marquee" aria-label={ui.marquee.label}>
      <div className="hv2-marquee-viewport">
        <div
          className="hv2-marquee-track"
          style={{ "--hv2-marquee-duration": `${Math.round(marquee.length * SECONDS_PER_ITEM)}s` } as React.CSSProperties}
        >
          {list(false)}
          {list(true)}
        </div>
      </div>
    </section>
  );
}
