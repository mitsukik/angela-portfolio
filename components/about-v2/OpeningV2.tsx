"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import type { HeadlineSegment } from "@/data/about-v2";
import type { Locale } from "@/data/locale";
import { MixedText } from "@/components/site/MixedText";

const MOTION_QUERY = "(prefers-reduced-motion: no-preference)";

const META_LINE: Record<Locale, string> = {
  zh: "SENIOR UI/UX DESIGNER · TAICHUNG, TAIWAN · 近 9 年",
  en: "SENIOR UI/UX DESIGNER · TAICHUNG, TAIWAN · NEARLY 9 YEARS",
};

export function OpeningV2({
  locale,
  headlineLines,
  introParagraphs,
}: {
  locale: Locale;
  headlineLines: HeadlineSegment[][];
  introParagraphs: string[];
}) {
  const lang = locale === "zh" ? "zh-Hant" : "en";
  const sectionRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add(MOTION_QUERY, () => {
        const items = section.querySelectorAll("[data-reveal]");
        const timeline = gsap.timeline({ defaults: { ease: "power2.out", duration: 0.8 } });
        timeline.to(items, { opacity: 1, y: 0, stagger: 0.12 });
        return () => {
          timeline.kill();
          gsap.set(items, { clearProps: "opacity,transform" });
        };
      });
    }, section);
    return () => {
      media.revert();
      context.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="site-frame pb-20 pt-32 md:pb-28 md:pt-40" aria-label={locale === "zh" ? "開場" : "Opening"}>
      <p data-reveal className="type-v3-label scene-dim-text translate-y-3 text-[1rem] motion-safe:opacity-0">
        {locale === "zh" ? "關於" : "About"}
      </p>

      <h1
        data-reveal
        lang={lang}
        className="display-l scene-text mt-6 max-w-[18ch] translate-y-3 text-balance leading-[1.1] motion-safe:opacity-0 lg:leading-tight"
      >
        {headlineLines.map((line, i) => (
          <span key={i} className="block">
            {line.map((segment, j) => (
              <span key={j} className={segment.highlight ? "text-acid" : undefined}>
                <MixedText text={segment.text} />
              </span>
            ))}
          </span>
        ))}
      </h1>

      <p data-reveal className="type-v3-label scene-dim-text mt-8 translate-y-3 motion-safe:opacity-0">
        {META_LINE[locale]}
      </p>

      <div data-reveal className="mt-12 max-w-[62ch] translate-y-3 space-y-5 motion-safe:opacity-0 md:mt-14">
        {introParagraphs.map((paragraph, i) => (
          <p key={i} lang={lang} className="type-v3-body scene-dim-text">
            <MixedText text={paragraph} />
          </p>
        ))}
      </div>
    </section>
  );
}
