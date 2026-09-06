"use client";

import { Fragment, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { heroContent } from "@/data/home";
import type { Locale } from "@/data/locale";
import { getLenisInstance } from "@/components/site/lenisInstance";

// Not desktop-gated — matches the site's existing convention for simple,
// cheap entrance/scroll-linked motion (see AboutHero.tsx). Only reduced
// motion turns the assembly + scroll response off.
const MOTION_QUERY = "(prefers-reduced-motion: no-preference)";
// The spatial frame's pointer-follow tilt is a mouse/trackpad-only
// refinement (touch has no pointer position to warp toward) — same gate
// ProjectVisual.tsx's depthOnHover already uses.
const POINTER_QUERY = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

export function Hero({ locale }: { locale: Locale }) {
  const content = heroContent[locale];
  const lang = locale === "zh" ? "zh-Hant" : "en";
  const lineJoiner = locale === "zh" ? "" : " ";
  const plainStatement = content.statement.map((segment) => segment.text).join("");
  const plainIdentity = content.identityLines.join(lineJoiner === "" ? " " : lineJoiner);

  const sectionRef = useRef<HTMLElement | null>(null);
  const gridLinesRef = useRef<HTMLDivElement | null>(null);
  const identityRef = useRef<HTMLHeadingElement | null>(null);
  const eyebrowRef = useRef<HTMLDivElement | null>(null);
  const statementRef = useRef<HTMLParagraphElement | null>(null);
  const supportRef = useRef<HTMLParagraphElement | null>(null);
  const scrollControlRef = useRef<HTMLButtonElement | null>(null);
  const spatialZoneRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const gridLines = gridLinesRef.current;
    const identity = identityRef.current;
    const eyebrow = eyebrowRef.current;
    const statement = statementRef.current;
    const support = supportRef.current;
    const scrollControl = scrollControlRef.current;
    const spatialZone = spatialZoneRef.current;
    if (!section || !identity || !eyebrow || !statement || !support || !scrollControl) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      // Opening sequence: structural grid lines establish -> identity
      // (ANGELA / YU) mask-reveals line by line -> statement resolves ->
      // support copy + SCROLL settle -> spatial zone activates last, so it
      // reads as arriving into a space the rest of the scene just built.
      media.add(MOTION_QUERY, () => {
        const lineEls = Array.from(identity.querySelectorAll<HTMLElement>(".hero-line-inner"));
        const accentEls = Array.from(identity.querySelectorAll<HTMLElement>(".hero-accent"));
        const statementLineEls = Array.from(statement.querySelectorAll<HTMLElement>(".hero-line-inner"));
        const statementAccentEls = Array.from(statement.querySelectorAll<HTMLElement>(".hero-accent"));
        const gridLineEls = gridLines ? Array.from(gridLines.children) as HTMLElement[] : [];
        if (!lineEls.length || !statementLineEls.length) return;

        gsap.set(gridLineEls, { scaleX: 0, scaleY: 0, opacity: 0 });
        gsap.set(lineEls, { yPercent: 100 });
        gsap.set(statementLineEls, { yPercent: 100 });
        gsap.set(eyebrow, { autoAlpha: 0, y: 12 });
        gsap.set(support, { autoAlpha: 0, y: 12 });
        gsap.set(scrollControl, { autoAlpha: 0, y: 8 });
        if (spatialZone) gsap.set(spatialZone, { autoAlpha: 0, scale: 0.94 });

        const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
        timeline
          .to(gridLineEls, { opacity: 1, duration: 0.01 })
          .to(gridLineEls[0] ?? [], { scaleX: 1, duration: 0.5, ease: "power2.out" }, "<")
          .to(gridLineEls[1] ?? [], { scaleY: 1, duration: 0.5, ease: "power2.out" }, "<0.05")
          .to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.4 }, "-=0.2")
          .to(lineEls, { yPercent: 0, duration: 0.62, stagger: 0.1 }, "-=0.14")
          .to(accentEls, { scale: 1.05, duration: 0.16, ease: "power1.out" }, "-=0.2")
          .to(accentEls, { scale: 1, duration: 0.24, ease: "power2.out" })
          .to(statementLineEls, { yPercent: 0, duration: 0.55, stagger: 0.05 }, "-=0.3")
          .to(statementAccentEls, { scale: 1.04, duration: 0.14 }, "-=0.2")
          .to(statementAccentEls, { scale: 1, duration: 0.2 })
          .to(support, { autoAlpha: 1, y: 0, duration: 0.45 }, "-=0.35")
          .to(scrollControl, { autoAlpha: 1, y: 0, duration: 0.35 }, "-=0.18");

        if (spatialZone) {
          timeline.to(spatialZone, { autoAlpha: 1, scale: 1, duration: 0.7, ease: "power2.out" }, "-=0.5");
        }

        return () => {
          timeline.kill();
          gsap.set(
            [lineEls, statementLineEls, eyebrow, support, scrollControl, accentEls, statementAccentEls, gridLineEls, spatialZone].filter(Boolean),
            { clearProps: "all" },
          );
        };
      });

      // Idle spatial life: a slow, barely-perceptible perspective sway on
      // the reserved zone so it never reads as a static, unfinished box —
      // independent of pointer input.
      media.add(MOTION_QUERY, () => {
        if (!spatialZone) return;
        const idle = gsap.to(spatialZone, {
          "--hero-idle-ry": "2.4deg",
          "--hero-idle-rx": "-1.1deg",
          duration: 5.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
        return () => {
          idle.kill();
          gsap.set(spatialZone, { clearProps: "--hero-idle-rx,--hero-idle-ry" });
        };
      });

      // Pointer response: restrained X/Y tilt toward the cursor, scoped to
      // the whole hero so the zone reacts even when the pointer isn't
      // directly over it (an ambient presence, not a hover trick).
      media.add(POINTER_QUERY, () => {
        if (!spatialZone) return;
        const handleMove = (event: PointerEvent) => {
          const rect = section.getBoundingClientRect();
          const px = (event.clientX - rect.left) / rect.width - 0.5;
          const py = (event.clientY - rect.top) / rect.height - 0.5;
          spatialZone.style.setProperty("--hero-pointer-ry", `${(px * 6).toFixed(2)}deg`);
          spatialZone.style.setProperty("--hero-pointer-rx", `${(-py * 6).toFixed(2)}deg`);
        };
        const handleLeave = () => {
          spatialZone.style.setProperty("--hero-pointer-rx", "0deg");
          spatialZone.style.setProperty("--hero-pointer-ry", "0deg");
        };
        section.addEventListener("pointermove", handleMove);
        section.addEventListener("pointerleave", handleLeave);
        return () => {
          section.removeEventListener("pointermove", handleMove);
          section.removeEventListener("pointerleave", handleLeave);
          spatialZone.style.removeProperty("--hero-pointer-rx");
          spatialZone.style.removeProperty("--hero-pointer-ry");
        };
      });

      // Scroll response: as the user leaves Hero, identity + statement
      // compress and recede while the spatial zone gains scale and drifts
      // toward center — the zone gaining compositional weight as identity
      // recedes is the Hero -> Work handoff's visual logic, resolved fully
      // by the time Selected Work's own stage takes over. Restrained, no
      // parallax beyond a few px on text, readability untouched throughout.
      media.add(MOTION_QUERY, () => {
        const responseTimeline = gsap.timeline({ paused: true });
        responseTimeline
          .to(identity, { y: -30, scale: 0.92, transformOrigin: "left bottom", duration: 1, ease: "none" }, 0)
          .to(eyebrow, { y: -14, autoAlpha: 0.3, duration: 1, ease: "none" }, 0)
          .to(statement, { y: -30, autoAlpha: 0.25, duration: 1, ease: "none" }, 0)
          .to(support, { y: -40, autoAlpha: 0, duration: 0.7, ease: "none" }, 0)
          .to(scrollControl, { autoAlpha: 0, y: 10, duration: 0.25, ease: "none" }, 0);

        if (spatialZone) {
          responseTimeline.to(
            spatialZone,
            { scale: 1.16, y: 24, x: -12, duration: 1, ease: "none" },
            0,
          );
        }

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
          gsap.set(
            [identity, eyebrow, statement, support, scrollControl, spatialZone].filter(Boolean),
            { clearProps: "transform,opacity,visibility" },
          );
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
    <div className="relative motion-safe:pb-[10vh]">
      <section
        ref={sectionRef}
        className="hero-scene relative mx-auto flex min-h-[calc(100vh-72px)] max-w-[1600px] items-end justify-between gap-10 overflow-hidden px-6 pb-10 pt-16 sm:px-8 lg:px-10 lg:pb-28 motion-safe:sticky motion-safe:top-0"
      >
        {/* Structural grid lines — the opening scene's first assembled
            element, establishing the frame before typography arrives. */}
        <div ref={gridLinesRef} aria-hidden="true" className="hero-grid-lines pointer-events-none absolute inset-6 sm:inset-8 lg:inset-10">
          <span className="hero-grid-line-h absolute left-0 right-0 top-1/2 h-px bg-primary/10" />
          <span className="hero-grid-line-v absolute bottom-0 top-0 left-[62%] hidden w-px bg-primary/10 lg:block" />
        </div>

        <div className="max-w-[720px] pb-24 sm:pb-4 md:pb-24 lg:pb-8">
          <div
            ref={eyebrowRef}
            className="mb-6 flex flex-wrap items-center gap-2 text-[16px] uppercase tracking-[0.18em] sm:text-[16px]"
          >
            <span className="text-accent-lavender">{content.eyebrow.primary}</span>
            <span className="text-primary/40">|</span>
            <span className="text-accent-yellow">{content.eyebrow.secondary}</span>
          </div>

          <h1
            ref={identityRef}
            className="hero-identity w-fit text-[3.4rem] font-[500] leading-[0.86] tracking-[-0.02em] text-primary sm:text-[5rem] md:text-[6.2rem] lg:text-[7.4rem]"
          >
            <span className="sr-only">{plainIdentity}</span>
            <span aria-hidden="true" className="block">
              {content.identityLines.map((line, lineIndex) => (
                <span key={lineIndex} className="block overflow-hidden">
                  <span className="hero-line-inner block will-change-transform">
                    {lineIndex === 1 ? (
                      <span className="hero-accent inline-block text-accent-yellow">{line}</span>
                    ) : (
                      line
                    )}
                  </span>
                </span>
              ))}
            </span>
          </h1>

          <p
            ref={statementRef}
            lang={lang}
            className="hero-statement mt-8 w-[min(100%,620px)] overflow-hidden text-[1.3rem] font-[450] leading-[1.5] tracking-[-0.01em] text-primary sm:text-[1.55rem] lg:text-[1.7rem]"
          >
            {/* Single accessible reading; the masked span below is
                presentation-only so screen readers never see fragments. */}
            <span className="sr-only">{plainStatement}</span>
            <span aria-hidden="true" className="hero-line-inner block will-change-transform">
              {content.statement.map((segment, index) =>
                segment.highlight ? (
                  <span key={index} className="hero-accent inline-block text-accent-yellow">
                    {segment.text}
                  </span>
                ) : segment.noBreak ? (
                  <span key={index} className="inline-block whitespace-nowrap">
                    {segment.text}
                  </span>
                ) : (
                  <Fragment key={index}>{segment.text}</Fragment>
                ),
              )}
            </span>
          </p>

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

        {/* Reserved spatial zone — a plain structural frame, not a filled
            object. The future 3D/cube hero object stays on hold; this is
            the compositional placeholder that will hand off into it. */}
        <div
          ref={spatialZoneRef}
          aria-hidden="true"
          className="hero-spatial-zone relative hidden shrink-0 lg:block"
          style={{ width: "34vw", maxWidth: 420, height: "min(46vh, 460px)" }}
        >
          <div className="hero-spatial-frame absolute inset-0">
            <span className="hero-spatial-corner hero-spatial-corner-tl" />
            <span className="hero-spatial-corner hero-spatial-corner-br" />
            <span className="hero-spatial-shelf" style={{ top: "32%", transform: "translateZ(-40px)" }} />
            <span className="hero-spatial-shelf" style={{ top: "62%", transform: "translateZ(-80px)", opacity: 0.5 }} />
          </div>
        </div>

        <button
          ref={scrollControlRef}
          type="button"
          onClick={handleScrollClick}
          aria-label="Scroll to Selected Work"
          className="hero-scroll-control absolute bottom-6 left-1/2 right-auto flex -translate-x-1/2 flex-col items-center gap-2 text-[12px] uppercase tracking-[0.22em] text-accent-yellow sm:bottom-8 sm:left-auto sm:right-8 sm:translate-x-0 lg:right-10 lg:bottom-10"
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
