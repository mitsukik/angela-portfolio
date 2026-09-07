import Image from "next/image";
import type { CaseFinalFigure } from "./caseFinalMedia";

/**
 * System/flow-diagram evidence. Restrained hover/focus (subtle scale +
 * brightness lift on the image, caption resolves from 65% -> 100%
 * opacity) — never enough to make the diagram's own labels harder to
 * read. See .cf-figure in globals.css.
 */
export function EvidenceFigure({ figure }: { figure: CaseFinalFigure }) {
  return (
    <figure tabIndex={0} className="cf-figure relative aspect-[3/2] w-full outline-none">
      <div className="cf-figure-image relative h-full w-full">
        <Image src={figure.src} alt={figure.alt} fill sizes="(max-width: 1024px) 100vw, 62vw" className="object-cover" />
      </div>
      <figcaption className="cf-figure-caption cf-meta absolute bottom-3 left-3">
        {figure.figureNumber} — {figure.caption}
      </figcaption>
    </figure>
  );
}
