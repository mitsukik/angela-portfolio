import Image from "next/image";
import type { CaseFinalFigure } from "./caseFinalMedia";

/**
 * System/flow-diagram evidence. Round 3: shows the COMPLETE source image
 * — every real Case01 asset is natively 3:2 (1536x1024 for the diagrams,
 * 1800x1200 for the showcase), so aspect-[3/2] + object-contain matches
 * exactly and guarantees zero cropping regardless of container width.
 * All hover/spotlight interaction removed per Angela's explicit
 * correction — evidence images are read-only content, not interactive
 * surfaces, and stay stable while reading.
 *
 * The caption sits BELOW the framed image in normal flow, not overlaid
 * on top of it — since object-contain fills the box edge-to-edge for
 * every real (exactly 3:2) asset, an absolutely-positioned caption would
 * sit directly on top of live diagram content with no guaranteed clear
 * area behind it.
 */
export function EvidenceFigure({ figure }: { figure: CaseFinalFigure }) {
  return (
    <figure>
      <div className="cf-figure-frame relative aspect-[3/2] w-full">
        <Image
          src={figure.src}
          alt={figure.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 1600px"
          className="object-contain"
        />
      </div>
      <figcaption className="cf-figure-caption cf-meta mt-4">
        {figure.figureNumber} — {figure.caption}
      </figcaption>
    </figure>
  );
}
