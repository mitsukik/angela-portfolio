"use client";

import { useEffect, useState } from "react";
import type { HomeV2Content } from "@/data/home-v2";
import { HeroBackgroundShapes } from "@/components/home/HeroBackgroundShapes";
import { scrollToSection } from "./scroll";

const ROLE_INTERVAL = 2200;
// Alternating lean per letter, in the reference's rotation set.
const LETTER_TILT = [-4, 3, -3, 4, -4, 3];

function Letters({ text, offset = 0 }: { text: string; offset?: number }) {
  return Array.from(text).map((char, index) => (
    <span
      key={index}
      className="hv2-letter"
      style={{ "--hv2-tilt": `${LETTER_TILT[(index + offset) % LETTER_TILT.length]}deg` } as React.CSSProperties}
    >
      {char}
    </span>
  ));
}

/** Cycles the existing role tags (static under reduced motion). */
function RoleWord({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (words.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIndex((value) => (value + 1) % words.length), ROLE_INTERVAL);
    return () => window.clearInterval(id);
  }, [words.length]);

  return (
    <span className="hv2-role-rotating" aria-hidden>
      <span key={index} className="hv2-role-word">{words[index]}</span>
    </span>
  );
}

export function HomeHero({ content }: { content: HomeV2Content }) {
  const { hero, ui, contact, locale } = content;
  const lang = locale === "zh" ? "zh-Hant" : "en";

  return (
    <section className="hv2-hero" data-hv2-hero aria-labelledby="hv2-name">
      {/* Background-only Hero: no project imagery and no grid lines — just
          sparse geometric marks (V1's own field, recoloured to the V2
          accents) over a soft ambient glow. */}
      <div className="hv2-hero-shapes" aria-hidden>
        <HeroBackgroundShapes fill />
      </div>
      <div className="hv2-hero-glow" aria-hidden />

      <div className="hv2-hero-inner">
        <div className="hv2-hero-copy">
          <p className="hv2-eyebrow">
            <span className="hv2-pulse" aria-hidden />
            <span className="hv2-sr">{hero.eyebrowFull}</span>
            <span aria-hidden className="hv2-eyebrow-line">
              <span lang={lang}>{hero.eyebrowLead}</span>
              <span className="hv2-eyebrow-dash"> — </span>
              <span lang={lang} className="hv2-role-static">{hero.eyebrowWords.join(" / ")}</span>
              <RoleWord words={hero.eyebrowWords} />
            </span>
          </p>

          <h1 id="hv2-name" className="hv2-name" lang="en" aria-label={hero.identityLines.join(" ")}>
            <span className="hv2-name-line" aria-hidden>
              <Letters text={hero.identityLines[0]} />
            </span>
            <span className="hv2-name-line hv2-name-line-2" aria-hidden>
              <Letters text={hero.identityLines[1]} offset={4} />
              <span className="hv2-name-bar" />
            </span>
          </h1>

          <p lang={lang} className="hv2-lede">
            {hero.statement.map((segment, index) =>
              segment.noBreak ? (
                <span key={index} className="hv2-nowrap">{segment.text}</span>
              ) : (
                <span key={index}>{segment.text}</span>
              ),
            )}
            <span className="hv2-lede-support">{hero.support}</span>
          </p>

          <div className="hv2-hero-actions">
            <a
              href="#selected-work"
              className="hv2-btn hv2-btn-lime"
              data-magnetic
              onClick={(event) => {
                event.preventDefault();
                scrollToSection("selected-work");
              }}
            >
              {ui.workCta} <span aria-hidden>↓</span>
            </a>
            <a
              href={contact.resumeHref}
              className="hv2-btn hv2-btn-outline"
              data-magnetic
              target="_blank"
              rel="noopener noreferrer"
            >
              {ui.resumeCta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
