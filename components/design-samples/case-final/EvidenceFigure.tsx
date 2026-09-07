"use client";

import Image from "next/image";
import type { PointerEvent } from "react";
import type { CaseFinalFigure } from "./caseFinalMedia";

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

/**
 * System/flow-diagram evidence. Round 2: rendered full-bleed (see
 * mediaFullBleed on ReadingSection) for real spatial presence instead of
 * a small figure squeezed into the text column, plus a more obvious —
 * still professional — pointer-zone spotlight that tracks the cursor
 * across the diagram (a soft radial highlight, not a scale/brightness
 * hover alone), on top of the existing restrained scale+brightness
 * lift. Never obscures the diagram's own labels: the spotlight is a very
 * low-opacity highlight, not a mask.
 */
export function EvidenceFigure({ figure }: { figure: CaseFinalFigure }) {
  const handleMove = (event: PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = clamp((event.clientX - rect.left) / rect.width) * 100;
    const y = clamp((event.clientY - rect.top) / rect.height) * 100;
    event.currentTarget.style.setProperty("--cf-spot-x", `${x}%`);
    event.currentTarget.style.setProperty("--cf-spot-y", `${y}%`);
  };

  return (
    <figure
      tabIndex={0}
      onPointerMove={handleMove}
      className="cf-figure cf-figure-spotlight relative aspect-[16/9] w-full outline-none md:aspect-[21/10]"
    >
      <div className="cf-figure-image relative h-full w-full">
        <Image src={figure.src} alt={figure.alt} fill sizes="(max-width: 1024px) 100vw, 1600px" className="object-cover" />
      </div>
      <figcaption className="cf-figure-caption cf-meta absolute bottom-4 left-4">
        {figure.figureNumber} — {figure.caption}
      </figcaption>
    </figure>
  );
}
