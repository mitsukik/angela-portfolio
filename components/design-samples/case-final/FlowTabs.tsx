"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { FlowEvidence } from "./FlowEvidence";

export type FlowSlide = {
  label: string;
  src: string;
  alt: string;
  caption: string;
  /** One-sentence explanation shown above the diagram. */
  note: string;
  scrollHint?: string;
};

/**
 * CASE01 system-flow switcher. md+ shows one diagram at a time behind a
 * tab row (WAI-ARIA tabs: roving tabindex, Arrow/Home/End keys); below md
 * the tab row is hidden and every diagram stacks, each keeping its own
 * horizontal scroll, so mobile never has a swipe gesture nested around a
 * scrolling diagram. Built only from existing roles (cf-meta / cf-accent /
 * cf-dim / cf-rule) — no new visual system. The whole block is one
 * data-evidence-entrance unit so EvidenceMotion fades it in once; panels
 * use FlowEvidence with reveal={false} because an inactive panel is
 * display:none when scroll triggers are measured.
 */
export function FlowTabs({ slides, label }: { slides: FlowSlide[]; label: string }) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const baseId = useId();

  const focusTab = (index: number) => {
    const next = (index + slides.length) % slides.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const moves: Record<string, number> = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: slides.length - 1 };
    if (!(event.key in moves)) return;
    event.preventDefault();
    focusTab(moves[event.key]);
  };

  return (
    <div data-evidence-entrance>
      <div role="tablist" aria-label={label} className="mb-8 hidden gap-8 border-b cf-rule md:flex">
        {slides.map((slide, index) => {
          const selected = active === index;
          return (
            <button
              key={slide.src}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${index}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${index}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={`cf-meta -mb-px border-b-2 pb-4 transition-colors duration-300 ${selected ? "cf-accent border-current" : "cf-dim border-transparent hover:text-[var(--cf-heading)]"}`}
            >
              {String(index + 1).padStart(2, "0")} {slide.label}
            </button>
          );
        })}
      </div>
      <div className="space-y-14 md:space-y-0">
        {slides.map((slide, index) => (
          <div
            key={slide.src}
            role="tabpanel"
            id={`${baseId}-panel-${index}`}
            aria-labelledby={`${baseId}-tab-${index}`}
            className={active === index ? "" : "md:hidden"}
          >
            <p className="cf-meta cf-accent mb-4 md:hidden">
              {String(index + 1).padStart(2, "0")} {slide.label}
            </p>
            <p className="cf-dim mb-6 max-w-[70ch] text-[14px] leading-6">{slide.note}</p>
            <FlowEvidence src={slide.src} alt={slide.alt} caption={slide.caption} scrollHint={slide.scrollHint} reveal={false} />
          </div>
        ))}
      </div>
    </div>
  );
}
