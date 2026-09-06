"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { heroContent } from "@/data/home";
import type { Locale } from "@/data/locale";
import { getLenisInstance } from "@/components/site/lenisInstance";

// clamp/mapRange/easeOut ported from the connected Lovable "VER B" project's
// src/lib/scroll.ts — the exact scroll-response math used there, so the
// Hero's scroll feel matches rather than approximates it.
const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const easeOut = (t: number) => 1 - Math.pow(1 - clamp(t), 3);

const MOTION_QUERY = "(prefers-reduced-motion: no-preference)";
const POINTER_QUERY = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

export function Hero({ locale }: { locale: Locale }) {
  const content = heroContent[locale];
  const lang = locale === "zh" ? "zh-Hant" : "en";

  const sectionRef = useRef<HTMLElement | null>(null);
  const kickerRef = useRef<HTMLParagraphElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const copyRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const planeRef = useRef<HTMLDivElement | null>(null);
  const planeLineRef = useRef<HTMLSpanElement | null>(null);
  // Read by the pointer handler to damp rotation out as scroll progresses
  // (Lovable's `(1 - p)` multiplier) — a ref, not state, since it's written
  // every scroll frame and must never trigger a re-render.
  const scrollDampRef = useRef(1);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const kicker = kickerRef.current;
    const title = titleRef.current;
    const copy = copyRef.current;
    const cta = ctaRef.current;
    const plane = planeRef.current;
    const planeLine = planeLineRef.current;
    if (!section || !kicker || !title || !copy || !cta || !plane || !planeLine) return;

    gsap.registerPlugin(ScrollTrigger);
    gsap.set(plane, { transformPerspective: 900 });

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      // Scroll response: p runs 0..1 across the track's own scrollable
      // distance (track height minus one viewport) — same source-of-truth
      // formula as Lovable's useTrackProgress/Hero p state, driven here via
      // ScrollTrigger instead of a raw scroll listener so it shares the
      // site's existing Lenis-synced GSAP pipeline. All transform writes
      // use GSAP's own x/y/scale/rotationX/rotationY properties (never a
      // hand-written `transform` string) so this pass and the pointer
      // handler below compose into one transform instead of overwriting
      // each other.
      media.add(MOTION_QUERY, () => {
        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => {
            const p = self.progress;
            scrollDampRef.current = 1 - p;
            gsap.set(title, { x: `${p * 3}vw`, y: `${-p * 12}vh`, scale: 1 - p * 0.28 });
            gsap.set(kicker, { opacity: 1 - p * 2.4 });
            gsap.set(copy, { opacity: 1 - p * 2.1, y: -p * 28 });
            gsap.set(cta, { opacity: 1 - p * 2.2 });
            gsap.set(plane, {
              x: `${-p * 16}vw`,
              y: `${p * 20}vh`,
              scale: 1 + p * 0.5,
              opacity: 0.65 + easeOut(p) * 0.35,
            });
            gsap.set(planeLine, { width: `${20 + p * 80}%` });
          },
        });

        return () => {
          trigger.kill();
          gsap.set([title, kicker, copy, cta, plane, planeLine], { clearProps: "all" });
        };
      });

      // Pointer response on the spatial plane — restrained perspective
      // tilt, damped out as scroll progresses via scrollDampRef, matching
      // Lovable's `(1 - p)` multiplier on the pointer-driven rotation.
      media.add(POINTER_QUERY, () => {
        const handleMove = (event: PointerEvent) => {
          const rect = section.getBoundingClientRect();
          const x = clamp((event.clientX - rect.left) / rect.width) - 0.5;
          const y = clamp((event.clientY - rect.top) / window.innerHeight) - 0.5;
          const damp = scrollDampRef.current;
          gsap.set(plane, { rotationX: y * -5 * damp, rotationY: x * 7 * damp });
        };
        const handleLeave = () => gsap.set(plane, { rotationX: 0, rotationY: 0 });
        section.addEventListener("pointermove", handleMove);
        section.addEventListener("pointerleave", handleLeave);
        return () => {
          section.removeEventListener("pointermove", handleMove);
          section.removeEventListener("pointerleave", handleLeave);
          gsap.set(plane, { clearProps: "rotationX,rotationY" });
        };
      });
    }, section);

    return () => {
      media.revert();
      context.revert();
    };
  }, [locale]);

  const handleWorkClick = () => {
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
    <section
      ref={sectionRef}
      className="hero-track relative h-[170svh] bg-paper text-ink"
      aria-label={locale === "zh" ? "開場：Angela Yu 定位" : "Opening: Angela Yu positioning"}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden motion-safe:sticky motion-safe:top-0">
        <div aria-hidden className="hero-grid absolute inset-0 grid grid-cols-4 md:grid-cols-12">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={`hero-grid-line border-l border-hairline ${i > 3 ? "hidden md:block" : ""}`}
              style={{ animationDelay: `${i * 35}ms` }}
            />
          ))}
        </div>

        <div className="relative mx-auto grid h-full max-w-[1600px] grid-cols-1 items-end gap-6 px-5 pb-10 md:grid-cols-12 md:gap-10 md:px-10 md:pb-12">
          <div className="relative z-10 md:col-span-7 md:pb-6">
            <p ref={kickerRef} className="hero-kicker label-mono text-ink/50">
              {content.kicker}
            </p>

            <h1 ref={titleRef} className="hero-title display-xl mt-5 uppercase">
              <span className="hero-title-mask block">
                <span className="hero-title-word block">{content.identityLines[0]}</span>
              </span>
              <span className="hero-title-mask block">
                <span className="hero-title-word hero-title-word-second block text-lavender">
                  {content.identityLines[1]}
                  <span className="ml-4 inline-block h-[0.14em] w-[0.55em] translate-y-[-0.28em] bg-acid align-middle" />
                </span>
              </span>
            </h1>

            <p ref={copyRef} lang={lang} className="hero-copy body-tc mt-7 max-w-[48ch]">
              {content.statement.map((segment, index) =>
                segment.noBreak ? (
                  <span key={index} className="whitespace-nowrap">
                    {segment.text}
                  </span>
                ) : (
                  <span key={index}>{segment.text}</span>
                ),
              )}
              <span className="mt-1 block text-ink/50">
                {content.supportLines.join("")}
              </span>
            </p>

            <div ref={ctaRef} className="hero-cta mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
              <button
                type="button"
                onClick={handleWorkClick}
                className="case-link label-mono group inline-flex items-center gap-3 border-b border-ink py-3"
              >
                {locale === "zh" ? "精選作品" : "Selected Work"}
                <span aria-hidden className="transition-transform group-hover:translate-y-1">↓</span>
              </button>
              <p className="label-mono text-ink/50">
                {locale === "zh" ? "SCROLL TO ADVANCE" : "Scroll to advance"}
              </p>
            </div>
          </div>

          <div className="hero-plane-wrap absolute inset-x-5 top-24 h-[36vh] md:relative md:inset-auto md:col-span-5 md:h-auto md:pb-6">
            <div
              ref={planeRef}
              aria-hidden
              className="hero-plane relative h-full w-full md:ml-auto md:aspect-[4/5] md:max-w-[520px]"
            >
              <div className="absolute inset-0 border border-ink/30" />
              {Array.from({ length: 7 }).map((_, i) => (
                <span key={`h-${i}`} className="absolute inset-x-0 h-px bg-ink/15" style={{ top: `${(i + 1) * 12.5}%` }} />
              ))}
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={`v-${i}`} className="absolute inset-y-0 w-px bg-ink/15" style={{ left: `${(i + 1) * 16.66}%` }} />
              ))}
              <span ref={planeLineRef} className="absolute left-0 top-0 h-px bg-acid" style={{ width: "20%" }} />
              <span className="absolute bottom-4 right-4 label-mono text-ink/50">
                {locale === "zh" ? "空間場域 · 01" : "Spatial field · 01"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
