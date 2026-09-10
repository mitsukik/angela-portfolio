"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";

const MOTION_QUERY = "(prefers-reduced-motion: no-preference)";

/**
 * One-time, mount-triggered entrance for the Hero's grouped evidence
 * thumbnails — deliberately not ScrollTrigger-based like Reveal, since
 * this content is already in view on load. Animates direct children as
 * a stagger; each child's own internal markup is untouched.
 */
export function HeroEvidenceReveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add(MOTION_QUERY, () => {
        const items = Array.from(el.children) as HTMLElement[];
        if (!items.length) return;

        gsap.set(items, { autoAlpha: 0, scale: 0.98 });
        gsap.to(items, {
          autoAlpha: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.09,
          ease: "power2.out",
        });
      });
    }, el);

    return () => {
      media.revert();
      context.revert();
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
