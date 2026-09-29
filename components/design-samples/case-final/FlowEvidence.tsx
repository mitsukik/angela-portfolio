"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EvidenceTrigger } from "./CaseEvidenceViewer";

const MOTION_QUERY = "(prefers-reduced-motion: no-preference)";

type FlowEvidenceProps = {
  src: string;
  alt: string;
  caption: string;
  /** Optional aspect class; by default .case01-plate sets the matted 3:2 ratio. */
  aspect?: string;
  className?: string;
  scrollHint?: string;
  /** false = static figure, for panels whose parent owns the entrance
   * (e.g. a tab panel that may be display:none when triggers are measured). */
  reveal?: boolean;
};

/**
 * Diagram-only entrance for the two CASE01 figures that actually depict a
 * left-to-right flow or state progression (Cross-border Ecosystem,
 * Inventory Status Flow) — CASE01 responsive QA's "minimal explanatory
 * motion" for Section 8 bullets 1-2. A left-to-right clip-path wipe (the
 * same technique ShowcaseMedia.tsx already uses for its one entrance
 * moment elsewhere in Case Final, not a new mechanism) reads as the
 * diagram resolving in its own reading direction, rather than a generic
 * fade — it explains sequence, it doesn't decorate. One-time, respects
 * reduced motion, adds no new visual claim: the image itself is
 * untouched, only how it arrives is different. Not used for every
 * evidence figure in this file — the shared `Evidence`/`EvidenceMotion`
 * fade still covers everything else, so this stays the exception.
 */
export function FlowEvidence({ src, alt, caption, aspect = "", className = "", scrollHint, reveal = true }: FlowEvidenceProps) {
  const frameRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame || !reveal) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add(MOTION_QUERY, () => {
        gsap.set(frame, { autoAlpha: 0, clipPath: "inset(0% 100% 0% 0%)" });
        const trigger = ScrollTrigger.create({
          trigger: frame,
          start: "top 82%",
          once: true,
          onEnter: () => {
            gsap.to(frame, { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 0.85, ease: "power2.out" });
          },
        });
        return () => {
          trigger.kill();
          gsap.set(frame, { clearProps: "opacity,visibility,clipPath" });
        };
      });
    }, frame);

    return () => {
      media.revert();
      context.revert();
    };
  }, [reveal]);

  return (
    <figure className={className}>
      <div className="min-w-0 max-w-full overflow-x-auto">
        <div ref={frameRef} className={`cf-figure-frame case01-plate relative ${aspect} min-w-[48rem] lg:min-w-0`}>
          <EvidenceTrigger asset={{ src, alt, caption }}>
            {/* Board inset by the same % on every axis, so the 3:2 diagram
                fills it exactly and every plate has identical mat margins. */}
            <span className="case01-plate-board">
              <Image src={src} alt="" fill sizes="(max-width: 1023px) 768px, 1600px" className="object-contain" />
            </span>
          </EvidenceTrigger>
        </div>
      </div>
      <figcaption className="cf-figure-caption cf-meta mt-4">{caption}</figcaption>
      {scrollHint && <p className="cf-dim mt-2 text-[12px] lg:hidden">{scrollHint}</p>}
    </figure>
  );
}
