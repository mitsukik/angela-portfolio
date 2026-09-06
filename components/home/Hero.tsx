"use client";

import { Fragment, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { heroContent } from "@/data/home";
import type { Locale } from "@/data/locale";
import { getLenisInstance } from "@/components/site/lenisInstance";

// Not desktop-gated (matches the site's existing convention for simple,
// cheap entrance/scroll-linked motion — see AboutHero.tsx) — only reduced
// motion turns this off.
const MOTION_QUERY = "(prefers-reduced-motion: no-preference)";

export function Hero({ locale }: { locale: Locale }) {
  const content = heroContent[locale];
  const lang = locale === "zh" ? "zh-Hant" : "en";
  const lineJoiner = locale === "zh" ? "" : " ";
  const plainHeadline = content.headlineLines
    .map((line) => line.map((segment) => segment.text).join(""))
    .join(lineJoiner);

  const sectionRef = useRef<HTMLElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const eyebrowRef = useRef<HTMLDivElement | null>(null);
  const supportRef = useRef<HTMLParagraphElement | null>(null);
  const scrollControlRef = useRef<HTMLButtonElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const eyebrow = eyebrowRef.current;
    const support = supportRef.current;
    const scrollControl = scrollControlRef.current;
    if (!section || !headline || !eyebrow || !support || !scrollControl) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      // Opening sequence: eyebrow -> headline lines (mask reveal) -> accent
      // words settle -> support copy -> SCROLL control. ~1.1s total.
      media.add(MOTION_QUERY, () => {
        const lineEls = Array.from(
          headline.querySelectorAll<HTMLElement>(".hero-line-inner"),
        );
        const accentEls = Array.from(
          headline.querySelectorAll<HTMLElement>(".hero-accent"),
        );
        if (!lineEls.length) return;

        gsap.set(lineEls, { yPercent: 100 });
        gsap.set([eyebrow, support], { autoAlpha: 0, y: 12 });
        gsap.set(scrollControl, { autoAlpha: 0, y: 8 });

        const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
        timeline
          .to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.4 })
          .to(
            lineEls,
            { yPercent: 0, duration: 0.62, stagger: 0.1 },
            "-=0.14",
          )
          .to(
            accentEls,
            { scale: 1.05, duration: 0.16, ease: "power1.out" },
            "-=0.2",
          )
          .to(accentEls, { scale: 1, duration: 0.24, ease: "power2.out" })
          .to(support, { autoAlpha: 1, y: 0, duration: 0.45 }, "-=0.32")
          .to(scrollControl, { autoAlpha: 1, y: 0, duration: 0.35 }, "-=0.18");

        return () => {
          timeline.kill();
          gsap.set([lineEls, eyebrow, support, scrollControl, accentEls], {
            clearProps: "all",
          });
        };
      });

      // Scroll response: as the user leaves Hero, the headline recedes
      // slightly, support copy fades a touch earlier/faster, and the
      // SCROLL control disappears quickly — restrained, no parallax
      // beyond a few px, readability untouched throughout.
      media.add(MOTION_QUERY, () => {
        const responseTimeline = gsap.timeline({ paused: true });
        responseTimeline
          .to(headline, { y: -26, duration: 1, ease: "none" }, 0)
          .to(eyebrow, { y: -14, autoAlpha: 0.3, duration: 1, ease: "none" }, 0)
          .to(support, { y: -40, autoAlpha: 0, duration: 0.7, ease: "none" }, 0)
          .to(
            scrollControl,
            { autoAlpha: 0, y: 10, duration: 0.25, ease: "none" },
            0,
          );

        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.3,
          animation: responseTimeline,
        });

        return () => {
          trigger.kill();
          responseTimeline.kill();
          gsap.set([headline, eyebrow, support, scrollControl], {
            clearProps: "transform,opacity,visibility",
          });
        };
      });
    }, section);

    return () => {
      media.revert();
      context.revert();
    };
  }, [locale]);

  const handleScrollClick = () => {
    const target = document.getElementById("selected-work");
    if (!target) return;
    const lenis = getLenisInstance();
    if (lenis) {
      lenis.scrollTo(target);
    } else {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    // motion-safe:pb reserves a short "stuck" distance so Selected Work's
    // solid background can rise and cover the Hero as the user scrolls,
    // rather than the two sections just ending and starting — the same
    // sticky-release mechanic already used between the About Hero and
    // "What I Do" (see AboutHero.tsx).
    <div className="relative motion-safe:pb-[10vh]">
      <section
        ref={sectionRef}
        className="relative mx-auto flex min-h-[calc(100vh-72px)] max-w-[1600px] items-end overflow-hidden px-6 pb-10 pt-16 sm:px-8 lg:px-10 lg:pb-110 motion-safe:sticky motion-safe:top-0"
      >
        {/* AmbientField disabled per Angela's review — see AboutHero.tsx
            for the same note. */}

        <div className="max-w-[980px] pb-24 sm:pb-4 md:pb-24 lg:pb-8">
          <div
            ref={eyebrowRef}
            className="mb-6 flex flex-wrap items-center gap-2 text-[16px] uppercase tracking-[0.18em] sm:text-[16px]"
          >
            <span className="text-accent-lavender">{content.eyebrow.primary}</span>
            <span className="text-primary/40">|</span>
            <span className="text-accent-yellow">{content.eyebrow.secondary}</span>
          </div>

          <h1
            ref={headlineRef}
            lang={lang}
            className="w-[min(100%,950px)] text-[2.45rem] font-[500] leading-[1.08] tracking-[-0.01em] text-primary sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.7rem]"
          >
            {/* Single accessible reading of the full headline; the masked
                spans below are presentation-only so screen readers never
                encounter fragmented text (mirrors AboutHero.tsx). */}
            <span className="sr-only">{plainHeadline}</span>
            <span aria-hidden="true" className="block">
              {content.headlineLines.map((line, lineIndex) => (
                <span key={lineIndex} className="block overflow-hidden">
                  <span className="hero-line-inner block will-change-transform">
                    {line.map((segment, segmentIndex) =>
                      segment.highlight ? (
                        <span
                          key={segmentIndex}
                          className="hero-accent inline-block text-accent-yellow"
                        >
                          {segment.text}
                        </span>
                      ) : (
                        <Fragment key={segmentIndex}>{segment.text}</Fragment>
                      ),
                    )}
                  </span>
                </span>
              ))}
            </span>
          </h1>

          <p
            ref={supportRef}
            lang={lang}
            className="mt-8 max-w-[560px] text-[16px] leading-7 text-primary/70 sm:text-[18px] md:text-[19px] lg:text-[20px]"
          >
            {content.supportLines.map((line, lineIndex) => (
              <Fragment key={lineIndex}>
                {lineIndex > 0 && <br className="hidden sm:block" />}
                {line}
              </Fragment>
            ))}
          </p>
        </div>

        <button
          ref={scrollControlRef}
          type="button"
          onClick={handleScrollClick}
          aria-label="Scroll to Selected Work"
          className="hero-scroll-control absolute bottom-6 left-1/2 right-auto flex -translate-x-1/2 flex-col items-center gap-2 text-[12px] uppercase tracking-[0.22em] text-accent-yellow sm:bottom-8 sm:left-auto sm:right-8 sm:translate-x-0 lg:right-10 lg:bottom-64"
        >
          <span className="hero-scroll-label">SCROLL</span>
          <span aria-hidden="true" className="hero-scroll-line" />
          <span aria-hidden="true" className="hero-scroll-arrow text-base leading-none">
            ↓
          </span>
        </button>
      </section>
    </div>
  );
}
