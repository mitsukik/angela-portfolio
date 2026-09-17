"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

type ScrollSkipEvidenceProps = {
  src: string;
  alt: string;
  caption: string;
  aspect: string;
  scrollHint: string;
  initialScrollPx?: number;
  className?: string;
};

/**
 * InspectableEvidence variant for full-page admin screenshots whose left
 * sidebar chrome (~15% of the source image) isn't the evidence — Order
 * List and Supplier Dashboard both have it. Below `lg`, where the shared
 * 70rem canvas forces horizontal scroll, this opens already scrolled past
 * that sidebar instead of defaulting to it, so the first thing visible is
 * table/dashboard content, not nav. Desktop's `lg:min-w-0` layout has no
 * overflow to scroll, so the effect is a no-op there — untouched.
 */
export function ScrollSkipEvidence({ src, alt, caption, aspect, scrollHint, initialScrollPx = 0, className = "" }: ScrollSkipEvidenceProps) {
  const frameRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || initialScrollPx <= 0) return;
    if (window.matchMedia("(min-width: 1024px)").matches) return;
    frame.scrollLeft = initialScrollPx;
  }, [initialScrollPx]);

  return (
    <figure data-evidence-entrance className={`min-w-0 max-w-full ${className}`}>
      <div ref={frameRef} className="cf-figure-frame min-w-0 max-w-full overflow-x-auto" tabIndex={0} role="group" aria-label={alt}>
        <div className={`relative ${aspect} min-w-[70rem] lg:min-w-0`}>
          <Image src={src} alt={alt} fill sizes="(max-width: 1023px) 1120px, 1600px" className="object-contain" />
        </div>
      </div>
      <figcaption className="cf-figure-caption cf-meta mt-4">{caption}</figcaption>
      <p className="cf-dim mt-2 text-[12px] lg:hidden">{scrollHint}</p>
    </figure>
  );
}
