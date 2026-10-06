"use client";

import { useState } from "react";
import type { HomeV2Content } from "@/data/home-v2";

// Seconds of travel per item — keeps the loop around 50px/s whatever the
// number of skills, so the strip stays calm and readable.
const SECONDS_PER_ITEM = 4.6;

/**
 * Skills strip. The loop is a pure CSS translate (compositor only, no JS);
 * the duplicate copy is hidden from assistive tech.
 *
 * WCAG 2.2.2 (Pause, Stop, Hide): the whole strip is one toggle — click,
 * tap, Enter or Space pauses / resumes it — with a quiet text cue in the
 * strip's edge fade (always shown on touch and while paused; on hover /
 * focus for pointer devices). Under reduced motion it is a static list.
 */
export function SkillsMarquee({ content }: { content: HomeV2Content }) {
  const { marquee, ui } = content;
  const [paused, setPaused] = useState(false);

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
    <section className="hv2-marquee" aria-label={ui.marquee.label} data-paused={paused}>
      <div className="hv2-marquee-viewport">
        <div
          className="hv2-marquee-track"
          style={{ "--hv2-marquee-duration": `${Math.round(marquee.length * SECONDS_PER_ITEM)}s` } as React.CSSProperties}
        >
          {list(false)}
          {list(true)}
        </div>
      </div>
      <button
        type="button"
        className="hv2-marquee-toggle"
        aria-pressed={paused}
        aria-label={ui.marquee.toggle}
        onClick={() => setPaused((value) => !value)}
      >
        <span className="hv2-marquee-cue" aria-hidden>
          <span className="hv2-cue-fine">{paused ? ui.marquee.pausedClick : ui.marquee.pauseClick}</span>
          <span className="hv2-cue-touch">{paused ? ui.marquee.pausedTap : ui.marquee.pauseTap}</span>
        </span>
      </button>
    </section>
  );
}
