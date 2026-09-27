"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { CaseFinalFigure } from "./caseFinalMedia";

const MOTION_QUERY = "(prefers-reduced-motion: no-preference)";

/**
 * The one "showcase" moment (Final UI). Gets more presence than the
 * (now static, no-hover) EvidenceFigure: a one-time scroll-reveal
 * entrance (clip-path wipe + scale + opacity, strong ease-out, ~750ms —
 * the "rare/first-time" motion tier, since it appears once per reading)
 * and a drawn-in accent frame edge. No pointer parallax: evidence is for
 * inspection, so it holds still under the cursor. Shows the complete
 * source image (object-
 * contain, aspect-[3/2] matches every real asset's native ratio exactly
 * — no cropping).
 */
export function ShowcaseMedia({ figure }: { figure: CaseFinalFigure }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const edgeRef = useRef<HTMLSpanElement | null>(null);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const frame = frameRef.current;
    const edge = edgeRef.current;
    if (!wrap || !frame || !edge) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add(MOTION_QUERY, () => {
        gsap.set(frame, { autoAlpha: 0, scale: 0.92, y: 32, clipPath: "inset(6% 6% 6% 6%)" });
        gsap.set(edge, { scaleX: 0 });
        const trigger = ScrollTrigger.create({
          trigger: wrap,
          start: "top 78%",
          once: true,
          onEnter: () => {
            const timeline = gsap.timeline();
            timeline
              .to(frame, { autoAlpha: 1, scale: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)", duration: 0.75, ease: "power3.out" })
              .to(edge, { scaleX: 1, duration: 0.5, ease: "power2.out" }, "-=0.3");
          },
        });
        return () => {
          trigger.kill();
          gsap.set(frame, { clearProps: "opacity,visibility,transform,clipPath" });
          gsap.set(edge, { clearProps: "transform" });
        };
      });

    }, wrap);

    return () => {
      media.revert();
      context.revert();
    };
  }, []);

  return (
    <figure ref={wrapRef} className="relative">
      <div ref={frameRef} className="cf-showcase cf-figure-frame relative aspect-[3/2] w-full">
        <Image
          src={figure.src}
          alt={figure.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 1600px"
          className="object-contain"
        />
        <span ref={edgeRef} aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] origin-left bg-acid" />
      </div>
      <figcaption className="cf-figure-caption cf-meta mt-4">
        {figure.figureNumber} — {figure.caption}
      </figcaption>
    </figure>
  );
}
