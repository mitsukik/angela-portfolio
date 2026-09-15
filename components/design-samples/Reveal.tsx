"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const MOTION_QUERY = "(prefers-reduced-motion: no-preference)";

/**
 * Shared scroll-entrance primitive for the About/Case Study design
 * samples — a once-only label -> body resolve, the same choreography
 * already established on Case Study section entrances and Home's
 * Closing scene, factored out so all four samples share one motion
 * mechanism instead of four bespoke ones.
 */
export function Reveal({
  children,
  className = "",
  y = 22,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  delay?: number;
  as?: "div" | "section" | "article";
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add(MOTION_QUERY, () => {
        gsap.set(el, { autoAlpha: 0, y });
        const trigger = ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          once: true,
          onEnter: () => gsap.to(el, { autoAlpha: 1, y: 0, duration: 0.7, delay, ease: "power2.out" }),
        });
        return () => {
          trigger.kill();
          gsap.set(el, { clearProps: "opacity,visibility,transform" });
        };
      });
    }, el);

    return () => {
      media.revert();
      context.revert();
    };
  }, [y, delay]);

  const Element = Tag as "div";
  return (
    <Element ref={ref} className={className}>
      {children}
    </Element>
  );
}
