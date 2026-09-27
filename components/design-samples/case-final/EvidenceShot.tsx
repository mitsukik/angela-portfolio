import Image from "next/image";
import { EvidenceTrigger } from "./CaseEvidenceViewer";

/*
 * One screenshot. Below lg the frame scrolls horizontally at a legible
 * minimum width (the shared case-final inspectable-evidence pattern); at
 * lg+ it fits its column. Aspect ratio comes from the asset's real pixels.
 * Every shot opens in the global evidence viewer for full-size inspection
 * (the trigger button is the focus stop, so the scroll frame needs none).
 */
export function Shot({ src, alt, size, minW, caption, scrollHint }: { src: string; alt: string; size: [number, number]; minW: string; caption?: string; scrollHint?: string }) {
  return <figure className="min-w-0 max-w-full">
    <div className="cf-figure-frame min-w-0 max-w-full overflow-x-auto">
      <div className={`relative ${minW} lg:min-w-0`} style={{ aspectRatio: `${size[0]} / ${size[1]}` }}><EvidenceTrigger asset={{ src, alt, caption }}><Image src={src} alt="" fill sizes="(max-width: 1023px) 960px, 1210px" className="object-contain" /></EvidenceTrigger></div>
    </div>
    {caption && <figcaption className="cf-figure-caption cf-meta mt-3">{caption}</figcaption>}
    {scrollHint && <p className="cf-dim mt-2 text-[12px] lg:hidden">{scrollHint}</p>}
  </figure>;
}
