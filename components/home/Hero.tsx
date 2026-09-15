"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { heroContent } from "@/data/home";
import type { Locale } from "@/data/locale";
import { getLenisInstance } from "@/components/site/lenisInstance";
import { HeroCube } from "./HeroCube";
import { HeroBackgroundShapes } from "./HeroBackgroundShapes";

// A/B/C prototype switch only — see HeroBackgroundShapes.tsx's own header
// comment. HeroCube ("cube") and the boxed Background Shapes ("shapes")
// are both the approved-to-date controls and stay fully intact either
// way; flip this one constant to compare. "shapes-full" is a visual
// experiment only (see Hero.tsx's own header comment below) — not an
// approved replacement. Not a permanent settings system — remove this
// and the losing variant(s) once a direction is picked.
const HERO_VISUAL: "cube" | "shapes" | "shapes-full" = "shapes-full";

// clamp/mapRange/easeOut ported from the connected Lovable "VER B" project's
// src/lib/scroll.ts — the exact scroll-response math used there, so the
// Hero's scroll feel matches rather than approximates it.
const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const easeOut = (t: number) => 1 - Math.pow(1 - clamp(t), 3);

const MOTION_QUERY = "(prefers-reduced-motion: no-preference)";
const POINTER_QUERY = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

/**
 * Theme correction: the opening scene now uses the shared `.scene-dark`
 * token system (same role Selected Work/Closing/Footer already use)
 * instead of hardcoded `bg-paper text-ink` + literal `ink/opacity`
 * utilities — this section was the one part of Home still on the
 * pre-V3 light treatment while the global SiteHeader above it was
 * already dark. Color-only migration: every `border-ink`/`bg-ink`/
 * `text-ink` reference below became `border-current`/`bg-current`/
 * `scene-dim-text` (which resolve through the scene's own foreground),
 * and `border-hairline` became `scene-rule` — composition, grid,
 * typography, content, spacing, motion, and GSAP are untouched.
 */
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
    // Optional: null in "shapes-full" mode, which renders no boxed
    // .hero-plane at all (see JSX below) — the scroll-driven text
    // animations below must keep running regardless, so these two are
    // checked individually at each use site rather than gating the whole
    // effect on their presence like the required refs above.
    const plane = planeRef.current;
    const planeLine = planeLineRef.current;
    if (!section || !kicker || !title || !copy || !cta) return;

    gsap.registerPlugin(ScrollTrigger);
    if (plane) gsap.set(plane, { transformPerspective: 900 });

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
            if (plane) {
              gsap.set(plane, {
                x: `${-p * 16}vw`,
                y: `${p * 20}vh`,
                scale: 1 + p * 0.5,
                opacity: 0.65 + easeOut(p) * 0.35,
              });
            }
            if (planeLine) gsap.set(planeLine, { width: `${20 + p * 80}%` });
          },
        });

        return () => {
          trigger.kill();
          const targets = [title, kicker, copy, cta, plane, planeLine].filter(Boolean) as gsap.TweenTarget[];
          gsap.set(targets, { clearProps: "all" });
        };
      });

      // Pointer response on the spatial plane — restrained perspective
      // tilt, damped out as scroll progresses via scrollDampRef, matching
      // Lovable's `(1 - p)` multiplier on the pointer-driven rotation.
      // No-op in "shapes-full" mode (no boxed plane to tilt).
      if (plane) {
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
      }
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
      className="hero-track scene-dark relative h-[130svh] md:h-[170svh]"
      aria-label={locale === "zh" ? "開場：Angela Yu 定位" : "Opening: Angela Yu positioning"}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden [contain:paint] motion-safe:sticky motion-safe:top-0">
        <div aria-hidden className="hero-grid absolute inset-0 grid grid-cols-4 md:grid-cols-12">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={`hero-grid-line border-l scene-rule ${i > 3 ? "hidden md:block" : ""}`}
              style={{ animationDelay: `${i * 35}ms` }}
            />
          ))}
        </div>

        {/* VISUAL EXPERIMENT — full-Hero background field, not the approved
            composition. Sits behind everything (DOM order + the text
            column's own z-10, no stacking-context tricks needed) and
            fills the entire sticky viewport rather than being confined to
            .hero-plane-wrap's boxed column — see HeroBackgroundShapes'
            `fill` prop for the one scale-only change this required.
            `fixed`, not `absolute` — matches About's own Background Shapes
            positioning (see AboutV2.tsx). The parent sticky wrapper's own
            `[contain:paint]` makes it the containing block for this fixed
            layer instead of the true viewport, so the rendered result is
            pixel-identical to before (this wrapper is always exactly
            viewport-sized while stuck) while the shapes layer is now
            genuinely `position: fixed`, not merely inheriting stickiness
            from an `absolute` ancestor. Pure CSS — no GSAP, no scroll
            listener — and it releases/scrolls away together with this
            wrapper once the Hero's own scroll track ends, so it still
            can't leak into Selected Work or the Footer. */}
        {HERO_VISUAL === "shapes-full" && (
          <div aria-hidden className="fixed inset-0 pointer-events-none">
            <HeroBackgroundShapes fill />
          </div>
        )}

        <div className="site-frame relative grid h-full grid-cols-1 items-center gap-6 pb-10 md:grid-cols-12 md:items-center md:gap-10 md:pb-16 lg:landscape:items-end lg:landscape:pb-[15vh]">
          <div
            className={`relative z-10 md:pb-6 ${
              HERO_VISUAL === "shapes-full" ? "md:col-span-12" : "md:col-span-6 lg:landscape:col-span-7"
            }`}
          >
            <p ref={kickerRef} className="hero-kicker type-v3-label scene-dim-text">
              {content.kicker}
            </p>

            <h1 ref={titleRef} className="hero-title type-v3-display mt-5 uppercase">
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

            <p ref={copyRef} lang={lang} className="hero-copy type-v3-body mt-7 max-w-[48ch]">
              {content.statement.map((segment, index) =>
                segment.noBreak ? (
                  <span key={index} className="whitespace-nowrap">
                    {segment.text}
                  </span>
                ) : (
                  <span key={index}>{segment.text}</span>
                ),
              )}
              <span className="mt-1 block scene-dim-text">
                {content.supportLines.join("")}
              </span>
            </p>

            <div ref={ctaRef} className="hero-cta mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
              <button
                type="button"
                onClick={handleWorkClick}
                className="interaction-destination type-v3-label group inline-flex items-center gap-3 border-b border-current py-3"
              >
                {locale === "zh" ? "精選作品" : "Selected Work"}
                <span aria-hidden className="transition-transform group-hover:translate-y-1">↓</span>
              </button>
              <p className="type-v3-label scene-dim-text">
                {locale === "zh" ? "SCROLL TO ADVANCE" : "Scroll to advance"}
              </p>
            </div>
          </div>

          {/* Mobile sizing fix: the SVG cube renders at a fixed ~250-285px
              tall regardless of viewport height (its size is driven by
              width, capped in px — see HeroCube.tsx), so the old
              vh-relative box (h-[16vh], ~112-149px across the tested
              viewports) could never contain it — h-[16vh] only ever
              bounded the *decorative grid lines* drawn directly in this
              file, which scale fine with a short box; the cube inside
              them didn't. A fixed height (320px) fixes containment, but
              a fixed *position* broke something the old vh-relative box
              got right by accident: the text column (kicker/title/copy/
              cta) is vertically centered in this h-full/100svh section,
              so at a shorter viewport it re-centers upward by exactly
              half of the height reduction (measured: 390x844 -> 390x700
              is -144px viewport height, and the heading's own top moves
              up by exactly -72px, i.e. half). A fixed top doesn't track
              that, so a short-enough viewport (390x700, one of the
              required test cases) had the fixed-position cube overlap
              the heading. top: calc(50svh - 474px) gives this box the
              same "moves half as much as the viewport" slope as the
              heading, so the gap between cube and heading stays
              constant (~26px) across every tested height instead of
              only being correct at the one height it was tuned for.
              474 solves for this element's own verified-good top at the
              390x844 reference case (getBoundingClientRect().top there
              needs to be 4px — the grid container this is positioned
              against itself starts 56px into the viewport, right after
              the sticky mobile header, so the CSS `top` value needed is
              4 - 56 = -52, and 0.5*844 - 474 = -52). Height stays a
              fixed 320px — comfortably
              containing the cube's tallest case (285px, at wider mobile
              widths where its 250px cap binds) — since containment only
              depends on this box's own size, not viewport height. */}
          {/* md:overflow-hidden — the actual tablet containment fix: the
              scroll-driven scale/translate below (up to 1.5x, -16vw/+20vh
              at full scroll) grows and shifts .hero-plane well past its
              own resting box, which the text column's 6-column half never
              accounted for. At desktop widths there's enough slack inside
              this 6-column half that the overflow never reached the other
              half; at ~768-1024px the same vw-relative transform eats a
              much larger share of a much narrower column, and the plane's
              enlarged/shifted content visibly painted over the body copy.
              Clipping the transform to this wrap's own grid-column box —
              rather than shrinking the transform, or reducing
              HeroBackgroundShapes' own density/timing — fixes the actual
              geometry problem (the plane's box didn't constrain its
              rendered content) at every width from one rule, instead of
              hand-tuning the transform's magnitude per breakpoint. Scoped
              to md: only — mobile's .hero-plane-wrap is a differently
              laid out absolute box (see the comment below) that this
              transform was never observed to escape. */}
          {HERO_VISUAL !== "shapes-full" && (
            <div className="hero-plane-wrap absolute inset-x-5 top-[calc(50svh-474px)] h-[320px] md:relative md:inset-auto md:top-auto md:col-span-6 md:h-auto md:overflow-hidden md:pb-6 lg:landscape:col-span-5">
              <div
                ref={planeRef}
                aria-hidden
                className="hero-plane relative h-full w-full md:ml-auto md:aspect-[4/5] md:max-w-[520px]"
              >
                <div className="absolute inset-0 border border-current/30" />
                {Array.from({ length: 7 }).map((_, i) => (
                  <span key={`h-${i}`} className="absolute inset-x-0 h-px bg-current/15" style={{ top: `${(i + 1) * 12.5}%` }} />
                ))}
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={`v-${i}`} className="absolute inset-y-0 w-px bg-current/15" style={{ left: `${(i + 1) * 16.66}%` }} />
                ))}
                {HERO_VISUAL === "cube" ? <HeroCube /> : <HeroBackgroundShapes />}
                <span ref={planeLineRef} className="absolute left-0 top-0 h-px bg-acid" style={{ width: "20%" }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
