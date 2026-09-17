"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const MOTION_QUERY = "(prefers-reduced-motion: no-preference)";

/**
 * Phase 4: the label -> title entrance for Sections 02-05 (evidence
 * sections), mirroring ReadingSection's own label/title choreography
 * (same durations, easing, and offsets) so all seven CASE01 sections
 * settle in with one consistent register instead of Sections 00/01/06
 * animating in and 02-05 popping in instantly. Body content underneath
 * keeps its existing, separate reveal (EvidenceMotion for figures,
 * data-evidence-entrance for supporting paragraphs) — this only owns the
 * label + heading pair, once, non-repeating.
 */
export function EvidenceHeading({ label, title, children }: { label: string; title: string; children: ReactNode }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const labelRef = useRef<HTMLParagraphElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const label = labelRef.current;
    const title = titleRef.current;
    if (!section || !label || !title) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    const context = gsap.context(() => {
      mm.add(MOTION_QUERY, () => {
        gsap.set(label, { autoAlpha: 0, y: 10 });
        gsap.set(title, { autoAlpha: 0, y: 16 });

        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "top 85%",
          once: true,
          onEnter: () => {
            const timeline = gsap.timeline({ defaults: { ease: "power2.out" } });
            timeline.to(label, { autoAlpha: 1, y: 0, duration: 0.45 });
            timeline.to(title, { autoAlpha: 1, y: 0, duration: 0.5 }, "-=0.28");
          },
        });

        return () => {
          trigger.kill();
          gsap.set([label, title], { clearProps: "opacity,visibility,transform" });
        };
      });
    }, section);

    return () => {
      mm.revert();
      context.revert();
    };
  }, []);

  return (
    <section ref={sectionRef}>
      <p ref={labelRef} className="cf-meta cf-section-label cf-accent md:whitespace-nowrap">{label}</p>
      <h2 ref={titleRef} className="cf-heading cf-h3 mt-4 max-w-[70ch]">{title}</h2>
      <div className="mt-10">{children}</div>
    </section>
  );
}
