"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { CaseFinalFigure } from "./caseFinalMedia";

const MOTION_QUERY = "(prefers-reduced-motion: no-preference)";
const POINTER_QUERY = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

/**
 * The one "showcase" moment (Final UI). Gets more presence than
 * EvidenceFigure: a one-time scroll-reveal entrance (scale + opacity,
 * strong ease-out, ~650ms — the "rare/first-time" motion tier, since it
 * appears once per reading) plus a restrained, damped pointer parallax
 * while it's in view. Distinct from EvidenceFigure's static-position
 * hover so the two media types don't read as the same effect reused.
 */
export function ShowcaseMedia({ figure }: { figure: CaseFinalFigure }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const frame = frameRef.current;
    if (!wrap || !frame) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add(MOTION_QUERY, () => {
        gsap.set(frame, { autoAlpha: 0, scale: 0.96, y: 24 });
        const trigger = ScrollTrigger.create({
          trigger: wrap,
          start: "top 80%",
          once: true,
          onEnter: () =>
            gsap.to(frame, { autoAlpha: 1, scale: 1, y: 0, duration: 0.65, ease: "power3.out" }),
        });
        return () => {
          trigger.kill();
          gsap.set(frame, { clearProps: "opacity,visibility,transform" });
        };
      });

      media.add(POINTER_QUERY, () => {
        const handleMove = (event: PointerEvent) => {
          const rect = wrap.getBoundingClientRect();
          const x = clamp((event.clientX - rect.left) / rect.width) - 0.5;
          const y = clamp((event.clientY - rect.top) / rect.height) - 0.5;
          frame.style.setProperty("--cf-pointer-rx", `${(y * -3).toFixed(2)}deg`);
          frame.style.setProperty("--cf-pointer-ry", `${(x * 4).toFixed(2)}deg`);
        };
        const handleLeave = () => {
          frame.style.setProperty("--cf-pointer-rx", "0deg");
          frame.style.setProperty("--cf-pointer-ry", "0deg");
        };
        wrap.addEventListener("pointermove", handleMove);
        wrap.addEventListener("pointerleave", handleLeave);
        return () => {
          wrap.removeEventListener("pointermove", handleMove);
          wrap.removeEventListener("pointerleave", handleLeave);
        };
      });
    }, wrap);

    return () => {
      media.revert();
      context.revert();
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative">
      <div ref={frameRef} className="cf-showcase cf-figure relative aspect-[16/10] w-full">
        <Image
          src={figure.src}
          alt={figure.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 1200px"
          className="object-cover"
        />
        <span className="cf-figure-caption cf-meta absolute bottom-4 left-4">
          {figure.figureNumber} — {figure.caption}
        </span>
      </div>
    </div>
  );
}
