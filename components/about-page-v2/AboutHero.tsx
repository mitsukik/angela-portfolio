"use client";

import { useLayoutEffect, useRef } from "react";
import type { AboutPageContent } from "@/data/about-page-v2";
import { HeroBackgroundShapes } from "@/components/home/HeroBackgroundShapes";

/**
 * About V2 hero — the same background language as Home V2: dark, sparse
 * geometric marks, a soft pointer glow, no grid. Left: statement; right:
 * three ruled facts (the first counts up once on load).
 */
export function AboutHero({ content }: { content: AboutPageContent }) {
  const { hero, locale } = content;
  const lang = locale === "zh" ? "zh-Hant" : "en";
  const countRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = countRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const end = Number(el.dataset.count);
    const start = performance.now();
    let raf = 0;
    el.textContent = "0";
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / 1200);
      el.textContent = String(Math.round(end * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      el.textContent = String(end);
    };
  }, []);

  return (
    <section className="hv2-hero av2-hero" data-hv2-hero aria-labelledby="av2-title">
      <div className="hv2-hero-shapes" aria-hidden>
        <HeroBackgroundShapes fill />
      </div>
      <div className="hv2-hero-glow" aria-hidden />

      <div className="hv2-hero-inner av2-hero-inner">
        <div className="av2-hero-copy">
          <p className="hv2-eyebrow" lang="en">
            <span className="hv2-pulse" aria-hidden />
            <span>{hero.eyebrow}</span>
          </p>
          <h1 id="av2-title" className="av2-title" lang={lang}>
            {hero.headline.before}
            {hero.headline.key && (
              <span className="av2-title-key">
                {hero.headline.key}
                <span className="av2-title-underline" aria-hidden />
              </span>
            )}
            {hero.headline.after}
          </h1>
          <p className="av2-lede" lang={lang}>{hero.lede}</p>
        </div>

        <dl className="av2-facts" lang={lang}>
          {hero.facts.map((fact) => (
            <div key={fact.label} className="av2-fact">
              <dt>{fact.label}</dt>
              <dd className={fact.count ? "av2-fact-big" : undefined}>
                {fact.count ? (
                  <>
                    <span className="hv2-sr">{fact.value}</span>
                    <span aria-hidden>
                      {fact.count.prefix}
                      <span ref={countRef} data-count={fact.count.value}>{fact.count.value}</span>
                      {fact.count.suffix}
                    </span>
                  </>
                ) : (
                  fact.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
