"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { V2Capability, V2Input } from "@/data/about-v2";
import type { Locale } from "@/data/locale";

type Point = { x: number; y: number };

// Output-based color system — shared by desktop and mobile. Capabilities
// alternate between the two existing Portfolio accents: 01/03 = Acid
// Yellow, 02/04 = Lavender — the active output's accent must propagate to
// its entire relationship (border, number, surface tint, and the
// corresponding active inputs; desktop additionally colors the connected
// paths), never a mismatched pairing, and the same capability must read
// the same accent on both breakpoints.
const CAPABILITY_ACCENT = ["acid", "lavender", "acid", "lavender"] as const;

export function WhatIDoV2({
  locale,
  heading,
  inputsLabel,
  inputs,
  capabilities,
}: {
  locale: Locale;
  heading: string;
  inputsLabel: string;
  inputs: V2Input[];
  capabilities: V2Capability[];
}) {
  const lang = locale === "zh" ? "zh-Hant" : "en";
  const [selected, setSelected] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const active = hovered ?? selected;

  const toggleSelected = (index: number) => setSelected((prev) => (prev === index ? null : index));
  const isInputActive = (id: string) => active !== null && capabilities[active].inputIds.includes(id);
  const activeAccent = active !== null ? CAPABILITY_ACCENT[active] : null;

  // Desktop-only: the connecting SVG lines must terminate at each
  // capability card's real header-row position, not a fixed viewBox
  // coordinate — a card grows in normal document flow when its
  // description reveals, so its header can shift. Measuring the actual
  // DOM (via ResizeObserver, continuously) keeps the lines correct
  // through the expand/collapse transition instead of letting them
  // visibly drift to the wrong spot.
  const containerRef = useRef<HTMLDivElement | null>(null);
  // Anchored to the dot itself, not the <li> row — the row is a
  // display:flex block box with no explicit width, so it stretches to
  // fill the entire grid column (confirmed via getBoundingClientRect:
  // the row measured ~438px wide while the visible dot sits only ~7px
  // in), which put every path's start point far to the right of the
  // dot instead of touching it.
  const inputDotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [inputPoints, setInputPoints] = useState<Point[]>([]);
  const [headerPoints, setHeaderPoints] = useState<Point[]>([]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const containerRect = container.getBoundingClientRect();
      setInputPoints(
        inputDotRefs.current.map((el) => {
          if (!el) return { x: 0, y: 0 };
          const r = el.getBoundingClientRect();
          return { x: r.right - containerRect.left, y: r.top - containerRect.top + r.height / 2 };
        }),
      );
      setHeaderPoints(
        cardRefs.current.map((card) => {
          if (!card) return { x: 0, y: 0 };
          const header = card.querySelector<HTMLElement>("[data-header-row]") ?? card;
          const headerRect = header.getBoundingClientRect();
          const cardRect = card.getBoundingClientRect();
          return { x: cardRect.left - containerRect.left, y: headerRect.top - containerRect.top + headerRect.height / 2 };
        }),
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    inputDotRefs.current.forEach((el) => el && observer.observe(el));
    cardRefs.current.forEach((el) => el && observer.observe(el));
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [inputs, capabilities]);

  return (
    <div>
      <p className="type-v3-label cf-section-label text-acid">{heading}</p>

      {/* Desktop + tablet: real HTML inputs list and capability cards
          (semantic content, not SVG decoration) with a connecting-lines
          SVG measured from their live positions underneath. The active
          capability reveals its description inline via a
          grid-template-rows transition — information reveal, not a
          detached block or a tooltip. */}
      {/* xl:, not lg: — at exactly 1024px this 12-column grid's own
          11 internal column gaps at gap-x-24 (96px x 11 = 1056px)
          exceeded the whole container's ~929px width, collapsing every
          minmax(0,1fr) track to a literal 0px (confirmed via computed
          gridTemplateColumns) and letting every grid item fall back to
          its own intrinsic content width instead — a pre-existing
          structural ceiling in this grid, surfaced (not caused) by the
          larger ZH desktop body copy making the col-span-8 capability
          description wide enough to visibly overflow past it. Keeping
          the smaller gap-x-16 through the lg range and only stepping up
          to gap-x-24 at xl (1280px, comfortably wide enough for it)
          fixes the actual math without touching column count, span
          widths, or anything else about this grid's composition. */}
      <div ref={containerRef} className="relative mt-10 hidden md:grid md:grid-cols-12 md:gap-x-16 md:gap-y-8 xl:gap-x-24">
        <svg className="pointer-events-none absolute inset-0 z-0 h-full w-full" aria-hidden>
          {capabilities.map((capability, ci) => {
            const isActive = active === ci;
            const accent = CAPABILITY_ACCENT[ci];
            const to = headerPoints[ci];
            if (!to) return null;
            return capability.inputIds.map((inputId) => {
              const inputIndex = inputs.findIndex((input) => input.id === inputId);
              if (inputIndex === -1) return null;
              const from = inputPoints[inputIndex];
              if (!from) return null;
              const midX = (from.x + to.x) / 2;
              return (
                <path
                  key={`${ci}-${inputId}`}
                  d={`M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`}
                  fill="none"
                  stroke={active === null ? "var(--scene-line)" : isActive ? `var(--${accent})` : "var(--scene-line)"}
                  strokeWidth={active === null ? 1 : isActive ? 1.8 : 1}
                  strokeOpacity={active === null ? 0.5 : isActive ? 0.9 : 0.18}
                  style={{ transition: "stroke-opacity 300ms ease, stroke-width 300ms ease, stroke 300ms ease" }}
                />
              );
            });
          })}
        </svg>

        <div className="relative z-10 md:col-span-4">
          <p className="type-v3-label cf-section-label scene-dim-text">{inputsLabel}</p>
          <ul className="mt-8 space-y-10">
            {inputs.map((input, i) => {
              const on = isInputActive(input.id);
              const onColor = on && activeAccent ? `var(--${activeAccent})` : "var(--scene-fg)";
              const onTextClass = on && activeAccent ? (activeAccent === "acid" ? "text-acid" : "text-lavender") : "scene-dim-text";
              return (
                <li key={input.id} className="flex items-center gap-4">
                  <span
                    ref={(el) => {
                      inputDotRefs.current[i] = el;
                    }}
                    aria-hidden
                    className="h-[14px] w-[14px] shrink-0 rounded-full transition-colors duration-300"
                    style={{ backgroundColor: onColor, opacity: active === null ? 0.85 : on ? 1 : 0.3 }}
                  />
                  <span
                    lang={lang}
                    className={`type-v3-body text-[1rem] font-medium transition-colors duration-300 ${onTextClass}`}
                    style={{ opacity: active === null ? 0.85 : on ? 1 : 0.35 }}
                  >
                    {input.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* min-w-0: a CSS grid item defaults to min-width:auto, which lets
            its own content's intrinsic width override the track size the
            grid actually assigned it — latent since this grid was built,
            surfaced once the larger ZH desktop body copy below made the
            description paragraph wide enough to trigger it (confirmed:
            this column was rendering ~670px wide inside a track sized for
            ~590-600px, blowing the whole row past the viewport). This is
            the standard, minimal fix for that specific CSS behavior, not
            a layout redesign — it makes the column honor its own track
            width so max-w-[60ch] below can do its job (cap width, wrap
            text) instead of forcing the grid wider. */}
        <div className="relative z-10 min-w-0 space-y-5 md:col-span-8">
          {capabilities.map((capability, i) => {
            const isActive = active === i;
            const accent = CAPABILITY_ACCENT[i];
            return (
              <button
                key={capability.title}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                type="button"
                onClick={() => toggleSelected(i)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
                aria-pressed={selected === i}
                className="edge-frame block w-full px-8 py-7 text-left transition-colors duration-300"
                style={{
                  borderColor: isActive ? `var(--${accent})` : undefined,
                  backgroundColor: isActive ? `color-mix(in oklch, var(--${accent}) 14%, transparent)` : "transparent",
                }}
              >
                <span data-header-row className="flex items-baseline gap-6">
                  <span className={`type-v3-label w-14 shrink-0 text-xl ${isActive ? (accent === "acid" ? "text-acid" : "text-lavender") : "scene-dim-text"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span lang={lang} className="type-v3-subheading scene-text">
                    {capability.title}
                  </span>
                </span>
                <div className="grid transition-[grid-template-rows] duration-300 ease-out" style={{ gridTemplateRows: isActive ? "1fr" : "0fr" }}>
                  <div className="overflow-hidden">
                    <p lang={lang} className="type-v3-body scene-dim-text mt-10 max-w-[60ch]">
                      {capability.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile: inputs compact above, capabilities stacked below — tapping
          a capability highlights its relevant inputs. No SVG, no
          shrunk-desktop diagram. */}
      <div className="mt-10 md:hidden">
        <p className="type-v3-label scene-dim-text">{inputsLabel}</p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
          {inputs.map((input) => {
            const on = isInputActive(input.id);
            const onTextClass = on && activeAccent ? (activeAccent === "acid" ? "text-acid" : "text-lavender") : "scene-dim-text opacity-60";
            return (
              <span key={input.id} className={`type-v3-body text-[1rem] font-medium transition-colors duration-300 ${onTextClass}`}>
                {input.label}
              </span>
            );
          })}
        </div>

        <div className="mt-8 space-y-3">
          {capabilities.map((capability, i) => {
            const isActive = selected === i;
            const accent = CAPABILITY_ACCENT[i];
            return (
              <button
                key={capability.title}
                type="button"
                onClick={() => toggleSelected(i)}
                aria-pressed={isActive}
                className="edge-frame block w-full px-5 py-4 text-left transition-colors duration-300"
                style={{
                  borderColor: isActive ? `var(--${accent})` : undefined,
                  backgroundColor: isActive ? `color-mix(in oklch, var(--${accent}) 12%, transparent)` : "transparent",
                }}
              >
                <span className={`type-v3-label ${isActive ? (accent === "acid" ? "text-acid" : "text-lavender") : "scene-dim-text"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span lang={lang} className="type-v3-body scene-text mt-1 block text-[1rem] font-medium leading-snug">
                  {capability.title}
                </span>
                {isActive && (
                  <span lang={lang} className="type-v3-body scene-dim-text mt-2 block text-[1rem]">
                    {capability.description}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
