"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const MOTION_QUERY = "(prefers-reduced-motion: no-preference)";

/**
 * Evidence-only entrance layer for Case 01. Real raster evidence is marked
 * at the figure boundary; placeholder slots intentionally stay static until
 * the real UI is supplied. One scoped batch keeps the page from accumulating
 * a trigger per paragraph or decorative element.
 */
export function EvidenceMotion({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add(MOTION_QUERY, () => {
        const evidence = root.querySelectorAll<HTMLElement>("[data-evidence-entrance]");
        if (!evidence.length) return;

        gsap.set(evidence, { autoAlpha: 0, y: 24 });
        const triggers = ScrollTrigger.batch(evidence, {
          start: "top 86%",
          once: true,
          interval: 0.08,
          batchMax: 3,
          onEnter: (elements) => {
            gsap.to(elements, {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.14,
              ease: "power3.out",
              overwrite: "auto",
            });
          },
        });

        return () => {
          triggers.forEach((trigger) => trigger.kill());
          gsap.set(evidence, { clearProps: "opacity,visibility,transform" });
        };
      });
    }, root);

    return () => {
      media.revert();
      context.revert();
    };
  }, []);

  return <div ref={rootRef}>{children}</div>;
}
