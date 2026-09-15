"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Locale } from "@/data/locale";
import { MixedText } from "@/components/site/MixedText";

const MOTION_QUERY = "(prefers-reduced-motion: no-preference)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

// Ambient build-up loop: dim resting -> item 0 lights -> arrow 0 lights ->
// item 1 lights -> ... -> item N lights -> hold the complete chain briefly
// -> soft reset -> repeat. `stepIndex` counts how many of the interleaved
// [item, arrow, item, arrow, ..., item] segments are lit so far (cumulative
// — once lit, a segment stays lit until the reset), driven by a GSAP
// timeline's .call() at each step so the timing is a real authored
// sequence rather than a hand-rolled setTimeout chain. Hover/focus/click
// still work as an independent one-off preview (existing behavior),
// layered on top via a simple OR with the loop's own lit state.
function Chain({ items, accent }: { items: string[]; accent: "acid" | "lavender" }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const totalSegments = items.length * 2 - 1;

  useLayoutEffect(() => {
    const reducedQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    let timeline: gsap.core.Timeline | null = null;

    const start = () => {
      timeline?.kill();
      if (reducedQuery.matches) {
        // Reduced motion: show the fully-built, readable end state — no loop.
        setStepIndex(totalSegments);
        timeline = null;
        return;
      }
      setStepIndex(0);
      timeline = gsap.timeline({ repeat: -1, repeatDelay: 1.3 });
      for (let step = 1; step <= totalSegments; step += 1) {
        timeline.call(() => setStepIndex(step), [], "+=0.5");
      }
      timeline.to({}, { duration: 1.2 }); // hold the completed sequence
      timeline.call(() => setStepIndex(0));
    };

    start();
    reducedQuery.addEventListener("change", start);
    return () => {
      reducedQuery.removeEventListener("change", start);
      timeline?.kill();
    };
  }, [totalSegments]);

  const accentClass = accent === "acid" ? "text-acid" : "text-lavender";

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-3" role="list">
      {items.map((item, i) => {
        const itemLit = stepIndex > i * 2 || hovered === i;
        const arrowLit = stepIndex > i * 2 + 1;
        return (
          <span key={item} className="flex items-center gap-2" role="listitem">
            <button
              type="button"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              onClick={() => setHovered((prev) => (prev === i ? null : i))}
              // Reflects only the user-driven toggle (click/hover/focus),
              // not the ambient auto-play loop that also drives `itemLit`
              // visually — exposing the decorative loop's own state here
              // too would announce this button as changing "pressed" on
              // its own every second, for items the user never touched.
              aria-pressed={hovered === i}
              className={`type-v3-label rounded-none px-1 py-0.5 transition-colors duration-700 ${itemLit ? accentClass : "scene-dim-text"}`}
            >
              {item}
            </button>
            {i < items.length - 1 && (
              <svg
                aria-hidden
                width="20"
                height="8"
                viewBox="0 0 20 8"
                className={`transition-colors duration-700 ${arrowLit ? `${accentClass} opacity-90` : "scene-dim-text opacity-50"}`}
              >
                <line x1="0" y1="4" x2="15" y2="4" stroke="currentColor" strokeWidth="1" />
                <path d="M12 1 L16 4 L12 7" fill="none" stroke="currentColor" strokeWidth="1" />
              </svg>
            )}
          </span>
        );
      })}
    </div>
  );
}

export function BeyondV2({
  locale,
  heading,
  paragraphs,
  illustrationChain,
}: {
  locale: Locale;
  heading: string;
  paragraphs: string[];
  illustrationChain: string[];
}) {
  const lang = locale === "zh" ? "zh-Hant" : "en";
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add(MOTION_QUERY, () => {
        const items = section.querySelectorAll("[data-beyond-reveal]");
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: section, start: "top 75%", once: true },
          defaults: { ease: "power2.out", duration: 0.8 },
        });
        timeline.to(items, { opacity: 1, y: 0, stagger: 0.1 });
        return () => timeline.scrollTrigger?.kill();
      });
    }, section);
    return () => {
      media.revert();
      context.revert();
    };
  }, []);

  return (
    <div ref={sectionRef} className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-10">
      <div className="md:col-span-7">
        <p className="type-v3-label cf-section-label text-acid">{heading}</p>

        <div data-beyond-reveal className="mt-8 max-w-[56ch] translate-y-3 space-y-5 motion-safe:opacity-0">
          {paragraphs.map((paragraph, i) => (
            <p key={i} lang={lang} className="type-v3-body scene-dim-text">
              <MixedText text={paragraph} />
            </p>
          ))}
        </div>

        <div data-beyond-reveal className="mt-8 translate-y-3 motion-safe:opacity-0">
          <Chain items={illustrationChain} accent="lavender" />
        </div>
      </div>

      <div data-beyond-reveal className="translate-y-3 motion-safe:opacity-0 md:col-span-5">
        <div className="edge-frame relative aspect-[1518/1036] w-full overflow-hidden">
          <Image
            src="/images/about/about-personalwork01.png"
            alt={locale === "zh" ? "個人插畫作品" : "Personal illustration artwork"}
            fill
            sizes="(min-width: 768px) 40vw, 100vw"
            className="object-cover object-center"
          />
        </div>
        <p lang="en" className="type-v3-label scene-dim-text mt-4">
          Personal illustration
        </p>
      </div>

      {/* Bottom divider: same border-t + scene-rule language used for
          every other section boundary on this page, giving Beyond (the
          last section before Closing) a clear visual ending of its own
          rather than relying on the next section's top border. */}
      <div className="col-span-full mt-16 border-t scene-rule" />
    </div>
  );
}
