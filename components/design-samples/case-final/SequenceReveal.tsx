"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const MOTION_QUERY = "(prefers-reduced-motion: no-preference)";

/**
 * Phase 4: Section 05's "what happened / why can't I continue / what's
 * next" breakdown is CASE01's clearest cause -> consequence chain — the
 * brief's named "most useful place for explanatory motion." A short,
 * one-time stagger across the three existing steps (DOM order unchanged,
 * no new columns) reinforces that reading order without touching the
 * frozen three-column layout Phase 2 already approved.
 */
export function SequenceReveal({ items }: { items: Array<[string, string]> }) {
  const listRef = useRef<HTMLOListElement | null>(null);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const steps = list.querySelectorAll<HTMLElement>("[data-sequence-step]");
    if (!steps.length) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    const context = gsap.context(() => {
      mm.add(MOTION_QUERY, () => {
        gsap.set(steps, { autoAlpha: 0, y: 16 });
        const trigger = ScrollTrigger.create({
          trigger: list,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.to(steps, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.14, ease: "power2.out" });
          },
        });

        return () => {
          trigger.kill();
          gsap.set(steps, { clearProps: "opacity,visibility,transform" });
        };
      });
    }, list);

    return () => {
      mm.revert();
      context.revert();
    };
  }, []);

  return (
    <ol ref={listRef} className="grid border-t cf-rule md:grid-cols-3">
      {items.map(([label, body], index) => (
        <li key={label} data-sequence-step className="border-b cf-rule py-6 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0">
          <p className="cf-meta cf-accent">{String(index + 1).padStart(2, "0")} / {label}</p>
          <p className="cf-body body-tc mt-4">{body}</p>
        </li>
      ))}
    </ol>
  );
}
