"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import type { Locale } from "@/data/locale";

type HeadlineSegment = { text: string; highlight?: boolean };

// Reduced-motion is the only gate here (no min-width) — matches the
// existing homepage Hero's own .hero-entrance convention in globals.css,
// which also isn't desktop-gated.
const MOTION_QUERY = "(prefers-reduced-motion: no-preference)";

// The headline enters one editorial line at a time through a clipping mask.
// yPercent keeps the travel proportional to the current responsive type size.
const LINE_DURATION = 0.75;
const LINE_STAGGER = 0.12;
const LINE_Y_PERCENT = 92;
const INTRO_START = "-=0.3";
const INTRO_DURATION = 0.65;
const INTRO_STAGGER = 0.08;
const INTRO_Y_PERCENT = 35;
const ENTRANCE_EASE = "power3.out";

export function AboutHero({
  locale,
  headlineLines,
  introParagraphs,
  introClassName,
}: {
  locale: Locale;
  headlineLines: HeadlineSegment[][];
  introParagraphs: string[];
  introClassName: string;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const h1Ref = useRef<HTMLHeadingElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);

  const lang = locale === "zh" ? "zh-Hant" : "en";
  // Chinese line breaks above are editorial (splitting single continuous
  // phrases across lines for the approved four-line composition), not word
  // boundaries — joining them with a space would read as an unnatural pause
  // to a screen reader. English line breaks are real phrase boundaries, so
  // they keep the space.
  const lineJoiner = locale === "zh" ? "" : " ";
  const plainText = headlineLines.map((line) => line.map((segment) => segment.text).join("")).join(lineJoiner);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const h1 = h1Ref.current;
    const intro = introRef.current;
    if (!section || !h1 || !intro) return;

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add(MOTION_QUERY, () => {
        const lineEls = Array.from(h1.querySelectorAll<HTMLElement>(".hero-line-inner"));
        const introEls = Array.from(
          intro.querySelectorAll<HTMLElement>(".about-intro-inner"),
        );
        if (!lineEls.length || !introEls.length) return;

        gsap.set(lineEls, { yPercent: LINE_Y_PERCENT });
        gsap.set(introEls, { yPercent: INTRO_Y_PERCENT });
        document.documentElement.removeAttribute("data-about-hero-motion");

        const timeline = gsap.timeline();
        timeline.to(lineEls, {
          yPercent: 0,
          duration: LINE_DURATION,
          stagger: LINE_STAGGER,
          ease: ENTRANCE_EASE,
        });
        timeline.to(
          introEls,
          {
            yPercent: 0,
            duration: INTRO_DURATION,
            stagger: INTRO_STAGGER,
            ease: ENTRANCE_EASE,
          },
          INTRO_START,
        );

        return () => {
          timeline.kill();
          gsap.set(lineEls, { clearProps: "all" });
          gsap.set(introEls, { clearProps: "all" });
        };
      });
    }, section);

    return () => {
      media.revert();
      context.revert();
      document.documentElement.removeAttribute("data-about-hero-motion");
    };
  }, [headlineLines]);

  return (
    <>
      {/* The FOUC-prevention script that used to live here (setting
          data-about-hero-motion="pending" before paint) now lives in
          app/layout.tsx as a next/script strategy="beforeInteractive" —
          rendering a raw <script> tag through JSX only actually executes
          during the server's initial HTML response; on every subsequent
          client-side render (including this component simply re-rendering)
          React logs "Encountered a script tag while rendering React
          component" because script elements inserted via client rendering
          are inert. beforeInteractive is Next's supported mechanism for a
          script that must run before hydration, and it's required to live
          in the root layout rather than a nested component. See the
          layout for the pathname check that scopes it to /about routes. */}
      {/* Extra bottom padding gives the sticky Hero below a bounded "stuck"
          distance before it naturally releases — see the section comment.
          Kept deliberately short (not the ~50vh this used to be): enough
          scroll for the next section to visibly rise and cover the Hero, but
          not so much that it reads as an empty dead zone before What I Do
          arrives. */}
      <div className="about-hero relative motion-safe:pb-[20vh]">
      <section
        ref={sectionRef}
        className="relative mx-auto max-w-[1600px] px-6 pb-20 pt-20 sm:px-8 sm:pb-24 sm:pt-24 md:pb-28 md:pt-28 lg:px-10 lg:pb-36 lg:pt-36 motion-safe:sticky motion-safe:top-0"
      >
        {/* AmbientField disabled here per Angela's review (read as cheap
            decorative noise rather than adding presence) — the component
            itself is kept for a future dedicated art-direction pass, not
            deleted. Removing it also eliminates one source of concurrent
            compositor work during this section's entrance animation. */}
        <div className="lg:grid lg:grid-cols-[minmax(0,68fr)_minmax(280px,32fr)] lg:items-end lg:gap-12">
          <h1
            ref={h1Ref}
            lang={lang}
            className="max-w-[1050px] text-balance text-[3.2rem] font-medium leading-[0.98] tracking-[-0.035em] sm:text-[5.2rem] lg:text-[5.5rem] xl:text-[7rem]"
          >
            {/* Single accessible reading of the full headline; the animated
                spans below are presentation-only so screen readers never
                encounter fragmented text or duplicated announcements. */}
            <span className="sr-only">{plainText}</span>
            <span aria-hidden="true" className="block">
              {headlineLines.map((line, lineIndex) => (
                <span key={lineIndex} className="block overflow-hidden">
                  <span className="hero-line-inner block will-change-transform">
                    {line.map((segment, segmentIndex) => (
                      <span
                        key={segmentIndex}
                        className={`inline-block ${segment.highlight ? "text-accent-yellow" : ""}`}
                        style={segment.highlight ? { whiteSpace: "nowrap" } : undefined}
                      >
                        {segment.text}
                      </span>
                    ))}
                  </span>
                </span>
              ))}
            </span>
          </h1>
          <div ref={introRef} className="mt-10 max-w-[34rem] lg:mb-1 lg:mt-0">
            {introParagraphs.map((paragraph, index) => (
              <div
                key={index}
                className={`overflow-hidden ${index > 0 ? "mt-4" : ""}`}
              >
                <p
                  lang={lang}
                  className={`about-intro-inner will-change-transform ${introClassName}`}
                >
                  {paragraph}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
