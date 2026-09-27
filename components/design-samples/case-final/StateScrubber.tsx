"use client";

import Image from "next/image";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { EvidenceTrigger, type EvidenceAsset } from "./CaseEvidenceViewer";

export type ScrubberState = {
  /** Short state name, e.g. "Generation failed". */
  name: string;
  /** What the product does in this state — one or two sentences of the
   * case's own approved copy, never invented behavior. */
  detail: string;
  /** What the state protects for the user, when the story is about that. */
  protects?: string;
  asset: EvidenceAsset;
};

/**
 * State Scrubber (Signature 2 — Switch grammar). Lets a reader step
 * through a real product state sequence in a few seconds: every state's
 * name, behavior and what it protects stay visible as a list (nothing
 * essential is hidden behind the interaction), while the evidence frame
 * switches to that state's real screen.
 *
 * WAI-ARIA tabs: click / tap, Arrow keys (both axes), Home / End. The
 * screen crossfades on the discrete token; reduced motion swaps
 * instantly. Every screen also opens in the shared evidence viewer.
 */
export function StateScrubber({
  label,
  states,
  aspect,
  footnote,
}: {
  label: string;
  states: ScrubberState[];
  /** CSS aspect-ratio of the evidence frame, e.g. "1284 / 2755". */
  aspect: string;
  footnote?: string;
}) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const baseId = useId();

  const select = (index: number, focus = false) => {
    const next = (index + states.length) % states.length;
    setActive(next);
    if (focus) tabRefs.current[next]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const moves: Record<string, number> = {
      ArrowDown: index + 1,
      ArrowRight: index + 1,
      ArrowUp: index - 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: states.length - 1,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    select(moves[event.key], true);
  };

  return (
    <div className="state-scrubber grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,17rem)] md:items-start md:gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,19rem)]">
      <div className="min-w-0">
        <div role="tablist" aria-label={label} aria-orientation="vertical" className="state-scrubber-list border-t cf-rule">
          {states.map((state, index) => {
            const selected = index === active;
            return (
              <button
                key={state.name}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${index}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => select(index)}
                onKeyDown={(event) => onKeyDown(event, index)}
                className="state-scrubber-tab"
                data-selected={selected}
              >
                <span className="state-scrubber-index cf-meta">{String(index + 1).padStart(2, "0")}</span>
                <span className="min-w-0">
                  <span className="state-scrubber-name cf-heading">{state.name}</span>
                  <span className="state-scrubber-detail cf-body">{state.detail}</span>
                  {state.protects && <span className="state-scrubber-protects cf-meta">{state.protects}</span>}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${active}`}
        className="state-scrubber-stage mx-auto w-full max-w-[17rem] md:col-start-2 md:row-span-2 md:row-start-1 md:max-w-none"
      >
        <div className="relative w-full" style={{ aspectRatio: aspect }}>
          {states.map((state, index) => (
            <div key={state.asset.src} className="state-scrubber-screen absolute inset-0" data-active={index === active} inert={index !== active}>
              <EvidenceTrigger asset={{ ...state.asset, caption: state.name }}>
                <Image src={state.asset.src} alt="" fill unoptimized sizes="(min-width: 768px) 19rem, 17rem" className="object-contain" />
              </EvidenceTrigger>
            </div>
          ))}
        </div>
        <p className="cf-figure-caption cf-meta mt-3" aria-live="polite">
          {String(active + 1).padStart(2, "0")} / {String(states.length).padStart(2, "0")} — {states[active].name}
        </p>
      </div>
      {footnote && <p className="cf-body body-tc max-w-[56ch] md:col-start-1 md:row-start-2">{footnote}</p>}
    </div>
  );
}
