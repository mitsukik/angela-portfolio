"use client";

import Image from "next/image";
import { Fragment, useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Locale } from "@/data/locale";
import { Reveal } from "../Reveal";

const MOTION_QUERY = "(prefers-reduced-motion: no-preference)";

type RegisterSection = (index: number, element: HTMLElement | null) => void;

function Section({
  index,
  register,
  children,
  divider = true,
}: {
  index: number;
  register: RegisterSection;
  children: ReactNode;
  divider?: boolean;
}) {
  return (
    <div
      ref={(element) => register(index, element)}
      className={`cf-section min-w-0${divider ? " cf-section-divider" : ""}`}
    >
      {children}
    </div>
  );
}

function SectionHeading({
  label,
  title,
  intro,
}: {
  label: string;
  title: string;
  intro?: string;
}) {
  return (
    <header className="max-w-[70ch]">
      <p className="cf-meta cf-section-label cf-accent md:whitespace-nowrap">{label}</p>
      <h2 className="cf-heading cf-h3 mt-4">{title}</h2>
      {intro && <p className="cf-body body-tc mt-8 max-w-[62ch]">{intro}</p>}
    </header>
  );
}

type EvidenceAsset = {
  src: string;
  alt: string;
};

function EvidenceImage({
  asset,
  aspect = "aspect-[16/9]",
}: {
  asset: EvidenceAsset;
  aspect?: string;
}) {
  return (
    <div className={`cf-figure-frame relative ${aspect} overflow-hidden bg-white`}>
      <Image
        src={asset.src}
        alt={asset.alt}
        fill
        unoptimized
        sizes="(min-width: 1024px) 70vw, 100vw"
        className="object-contain"
      />
    </div>
  );
}

function Evidence({
  asset,
  caption,
  aspect,
  className = "",
}: {
  asset: EvidenceAsset;
  caption: string;
  aspect?: string;
  className?: string;
}) {
  return (
    <figure className={className}>
      <EvidenceImage asset={asset} aspect={aspect} />
      <figcaption className="cf-figure-caption cf-meta mt-4">{caption}</figcaption>
    </figure>
  );
}

/**
 * Hero — one restrained image (management desktop + tablet quick-action
 * menu), not a multi-thumbnail composition like CASE02's hero. The tag row
 * and NDA note live here since both apply to the whole case, and this is
 * the first evidence a reader sees.
 */
export function CaseThreeHeroEvidence({ locale }: { locale: Locale }) {
  const zhHant = locale === "zh";
  const tags = zhHant
    ? ["企業系統", "工廠營運", "HTML／CSS／JavaScript", "已正式導入使用"]
    : ["Enterprise System", "Factory Operations", "HTML / CSS / JavaScript", "In Production"];
  return (
    <figure className="mt-12 md:mt-16">
      <ul className="mb-6 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <li key={tag} className="cf-tag">
            {tag}
          </li>
        ))}
      </ul>
      <Reveal>
        <EvidenceImage
          asset={{
            src: "/images/case03/case03-hero-desktop-tablet.webp",
            alt: "Management desktop dashboard with a tablet-style quick action menu overlaid for shop-floor operations",
          }}
        />
      </Reveal>
      <p className="cf-dim mt-4 max-w-[62ch] text-[13px] leading-6">
        {zhHant
          ? "因專案保密需求，本案例不公開客戶與工廠名稱，並已移除敏感營運資料。"
          : "Client and facility identity are withheld, and sensitive operational data has been removed, in line with this project's confidentiality requirements."}
      </p>
      {/* Round 2 recruiter-scanability: moved here from the end of Section
          04 (not duplicated) so this implementation evidence is visible
          before the reader scrolls through three sections of process and
          architecture content. */}
      <DemoCTA zhHant={zhHant} />
    </figure>
  );
}

/** `reverseDesktop` flips the desktop arrow glyph to "←" for a row that
 * reads right-to-left (the serpentine layout's second row), while mobile
 * always stays "↓" since mobile keeps a single top-to-bottom sequence. */
function FlowArrow({ reverseDesktop = false }: { reverseDesktop?: boolean }) {
  return (
    <span aria-hidden className="cf-dim flex justify-center py-1 text-lg lg:justify-center lg:pt-9 lg:text-2xl">
      <span className="lg:hidden">↓</span>
      <span className="hidden lg:inline">{reverseDesktop ? "←" : "→"}</span>
    </span>
  );
}

/** 05 — one compact node in the iteration loop: icon, step number, label,
 * one-line description. `color` tints the icon/number to match the stage's
 * ring segment; `cardRef` is optional and only used by the mobile legend
 * so its border can highlight in sync with the ring's active-stage loop
 * (see CycleRing) — the card itself never moves, only its border color. */
function LoopNode({
  index,
  label,
  desc,
  icon,
  color = "var(--cf-accent)",
  cardRef,
}: {
  index: number;
  label: string;
  desc: string;
  icon: IconName;
  color?: string;
  cardRef?: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div ref={cardRef} className="border cf-rule px-4 py-4">
      <div className="flex items-center gap-2.5">
        <span style={{ color }} className="inline-flex shrink-0">
          <Icon name={icon} size={24} />
        </span>
        <span className="cf-meta" style={{ fontSize: "0.95rem", color, opacity: 0.75 }}>
          0{index + 1}
        </span>
      </div>
      <p className="cf-body mt-2.5 text-[1.2rem] leading-7">{label}</p>
      <p className="cf-dim mt-1 text-[1rem] leading-6">{desc}</p>
    </div>
  );
}

// Arcs on a 200x200 ring (center 100,100, radius 80), each ~80° with a
// 16° gap before the next (wide enough to read as a clear break at normal
// viewing size), so the four segments look like a donut with visible
// breaks rather than one unbroken circle.
//
// Each stage's segment sits in the SAME quadrant as its label block (see
// CYCLE_LABEL_POSITION below): 01 top-left, 02 bottom-left, 03
// bottom-right, 04 top-right. With this exact spatial mapping the four
// quadrants ARE genuinely ring-adjacent in stage order — 01 meets 02
// down the left side, 02 meets 03 across the bottom, 03 meets 04 up the
// right side, 04 meets 01 back across the top — so both the one-time
// construction and the continuous loop sweep smoothly around the ring
// in true 01->02->03->04->01 order rather than jumping between
// non-adjacent quadrants.
//
// Each path's M (start) point is its "entry" end — the gap shared with
// the PREVIOUS stage in the cycle — and its arc end is its "exit" end —
// the gap shared with the NEXT stage. That makes the strokeDashoffset
// draw-in grow from the entry side toward the exit side, so each
// segment visibly leads into the next one instead of into the one
// before it.
const CYCLE_ARC_PATHS = [
  "M 88.9 20.8 A 80 80 0 0 0 20.8 88.9", // 01: top-left quadrant, entry top (from 04) -> exit left (to 02)
  "M 20.8 111.1 A 80 80 0 0 0 88.9 179.2", // 02: bottom-left quadrant, entry left (from 01) -> exit bottom (to 03)
  "M 111.1 179.2 A 80 80 0 0 0 179.2 111.1", // 03: bottom-right quadrant, entry bottom (from 02) -> exit right (to 04)
  "M 179.2 88.9 A 80 80 0 0 0 111.1 20.8", // 04: top-right quadrant, entry right (from 03) -> exit top (to 01)
];
// Each chevron sits in the gap a stage draws INTO (its exit side, per
// CYCLE_ARC_PATHS above), pointing toward the next stage: 01's chevron
// is on its left edge pointing down into 02, 02's is on its bottom edge
// pointing right into 03, 03's is on its right edge pointing up into
// 04, and 04's is on its top edge pointing left back into 01.
const CYCLE_CHEVRONS = [
  "25,97 20,105 15,97", // 01: left gap, pointing down toward 02
  "97,185 105,180 97,175", // 02: bottom gap, pointing right toward 03
  "175,103 180,95 185,103", // 03: right gap, pointing up toward 04
  "103,15 95,20 103,25", // 04: top gap, pointing left toward 01
];
// Grid placement for each stage's label block, matching its segment's
// quadrant one-to-one: 1 top-left, 2 bottom-left, 3 bottom-right, 4
// top-right. Color stays bound to stage index, so
// each label's color still matches its ring segment after the move.
const CYCLE_LABEL_POSITION = [
  "col-start-1 row-start-1 justify-self-start",
  "col-start-1 row-start-3 justify-self-start",
  "col-start-3 row-start-3 justify-self-end",
  "col-start-3 row-start-1 justify-self-end",
];
// One controlled, muted hue per stage (not a saturated rainbow): the
// existing site accent (acid) for stage 1 and the existing secondary
// accent (lavender) for stage 3 — both already-approved brand colors,
// see AGENTS.md — plus two new muted tones (blue, teal) that sit between
// them, kept at similar desaturation so the four read as one family.
// Order here is 01 lime / 02 blue / 03 lavender / 04 teal — per explicit
// stage-to-color mapping, not a rainbow progression around the ring.
const CYCLE_STAGE_COLORS = ["#e7f34b", "#6fa8e8", "#b9a7ff", "#5fc7be"];

function CycleLabel({
  index,
  label,
  desc,
  icon,
  color,
  numberRef,
  accentRef,
}: {
  index: number;
  label: string;
  desc: string;
  icon: IconName;
  color: string;
  numberRef: (el: HTMLSpanElement | null) => void;
  accentRef: (el: HTMLSpanElement | null) => void;
}) {
  return (
    <div className="max-w-[150px] text-left lg:max-w-[280px]">
      {/* Stacked icon-over-number on mobile only, not side-by-side: at the
          enlarged mobile donut size, this row's own min-content width
          (icon + non-wrapping 2-digit number) was forcing the grid's
          outer columns wider than the viewport, overflowing the page.
          Stacking removes that forced minimum without dropping any
          content — same info, just narrower footprint below `sm`. */}
      <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-2">
        <span style={{ color }} className="inline-flex shrink-0">
          <Icon name={icon} size={22} />
        </span>
        <span ref={numberRef} className="cf-meta" style={{ fontSize: "0.9rem", color, opacity: 0.6 }}>
          0{index + 1}
        </span>
      </div>
      {/* break-words: EN labels like "Continued Iteration" have long
          unbreakable words whose own width (not the icon/number row)
          was the real mobile-overflow driver — CSS Grid's automatic
          minimum track size is bounded below by the widest unbreakable
          word unless the text is allowed to break within one. */}
      <p className="cf-body mt-1.5 break-words text-[1.2rem] leading-6">{label}</p>
      <p className="cf-dim mt-1 hidden text-[1.05rem] leading-7 lg:block">{desc}</p>
      <span ref={accentRef} className="mt-2 block h-[2px] w-8" style={{ backgroundColor: color, opacity: 0 }} />
    </div>
  );
}

/**
 * A true segmented donut: four independent arc <path> segments (not one
 * circle with overlays) around a center label, each stage in its own
 * muted color.
 *
 * Three phases (motion-enabled only):
 * 1. ONE-TIME construction (ScrollTrigger, `once: true`): center label
 *    settles in, then for each stage in order (01→02→03→04) — its arc
 *    draws via strokeDasharray/dashoffset, its chevron fades to its
 *    resting dim state, then its label fades up.
 * 2. Once construction finishes, the completed ring is never hidden,
 *    reset, or redrawn again for the rest of the page's life — only
 *    intensity (stroke width / glow / opacity) changes from here on.
 * 3. A separate `repeat: -1` timeline cycles "active" highlighting
 *    through the four stages in that same order — heavier stroke + a
 *    currentColor drop-shadow glow on the segment, its chevron/number/
 *    underline brightening. A second, non-`once` ScrollTrigger
 *    pauses/resumes this SAME timeline (never restarts it, never
 *    replays construction) as the section scrolls in and out of view.
 *
 * SSR/hydration-flash guard: the <path>/<polyline> elements carry a
 * static, safely-oversized hidden strokeDasharray/opacity in JSX (not
 * just set later via JS), so the very first paint — before hydration or
 * inside a dev-only React Strict Mode double-effect-invoke — never
 * shows a flash of the complete ring that then snaps back to hidden.
 * That flash-then-reset was the actual bug in an earlier version of
 * this construction reveal, not the construction animation itself.
 * Because that hidden default now exists unconditionally in JSX (so it
 * also applies to reduced-motion users, who never enter the
 * motion-enabled branch below), an unconditional baseline correction
 * runs first, before the matchMedia branch, to put segments/chevrons
 * back in their finished resting look for that audience.
 *
 * Reduced-motion shows the finished, fully colored, non-pulsing ring
 * immediately (via that baseline correction) and never starts either
 * the construction or the loop timeline.
 */
function CycleRing({
  steps,
  centerLine1,
  centerLine2,
}: {
  steps: PipelineItem[];
  centerLine1: string;
  centerLine2: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const segRefs = useRef<Array<SVGPathElement | null>>([]);
  const chevronRefs = useRef<Array<SVGPolylineElement | null>>([]);
  const labelRefs = useRef<Array<HTMLDivElement | null>>([]);
  const numberRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const accentRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const legendRefs = useRef<Array<HTMLDivElement | null>>([]);
  const centerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    const context = gsap.context(() => {
      // Baseline correction (runs for every visitor, before the
      // motion-gated branch below): the JSX default hides segments
      // (large placeholder dasharray/dashoffset) and chevrons (opacity
      // 0) so first paint is never a flash of the complete ring. Fix
      // that back to the finished look here, unconditionally, so a
      // reduced-motion visitor — who never enters the branch that would
      // otherwise correct it — doesn't see a permanently undrawn ring.
      const segsBaseline = segRefs.current.filter((el): el is SVGPathElement => Boolean(el));
      const chevronsBaseline = chevronRefs.current.filter((el): el is SVGPolylineElement => Boolean(el));
      if (segsBaseline.length === 4) gsap.set(segsBaseline, { strokeDasharray: "none", strokeDashoffset: 0 });
      if (chevronsBaseline.length === 4) gsap.set(chevronsBaseline, { opacity: 0.6 });

      mm.add(MOTION_QUERY, () => {
        const segs = segRefs.current.filter((el): el is SVGPathElement => Boolean(el));
        const chevrons = chevronRefs.current.filter((el): el is SVGPolylineElement => Boolean(el));
        const labels = labelRefs.current.filter((el): el is HTMLDivElement => Boolean(el));
        const numbers = numberRefs.current.filter((el): el is HTMLSpanElement => Boolean(el));
        const accents = accentRefs.current.filter((el): el is HTMLSpanElement => Boolean(el));
        // Mobile legend cards stay mounted (just CSS-hidden) above `lg`;
        // animating them there is inert/harmless, so no breakpoint check
        // is needed here.
        const legends = legendRefs.current.filter((el): el is HTMLDivElement => Boolean(el));
        const center = centerRef.current;
        if (segs.length !== 4 || labels.length !== 4) return;

        if (center) gsap.set(center, { autoAlpha: 0, y: 6 });
        gsap.set(labels, { autoAlpha: 0, y: 8 });
        if (legends.length === 4) gsap.set(legends, { opacity: 0.85 });
        const lengths = segs.map((s) => s.getTotalLength());
        segs.forEach((s, i) => gsap.set(s, { strokeDasharray: lengths[i], strokeDashoffset: lengths[i] }));
        gsap.set(chevrons, { opacity: 0 });

        // Continuous active-stage loop — built once, paused, and only
        // ever played after construction finishes and while on screen.
        // This timeline is only ever played/paused, never rebuilt or
        // restarted, so resuming after a scroll-away always continues
        // from the current stage rather than resetting, and it never
        // touches strokeDasharray/dashoffset, so the completed ring it
        // highlights is never re-hidden or redrawn.
        const loopTl = gsap.timeline({ repeat: -1, paused: true, defaults: { ease: "power1.inOut" } });
        [0, 1, 2, 3].forEach((i) => {
          loopTl.addLabel(`stage${i}`);
          loopTl.to(segs[i], { strokeWidth: 22, duration: 0.25 }, `stage${i}`);
          loopTl.set(segs[i], { filter: "drop-shadow(0 0 6px currentColor)" }, `stage${i}`);
          loopTl.to(chevrons[i], { opacity: 1, duration: 0.25 }, `stage${i}`);
          loopTl.to(numbers[i], { opacity: 1, duration: 0.25 }, `stage${i}`);
          loopTl.to(accents[i], { opacity: 1, duration: 0.25 }, `stage${i}`);
          if (legends[i]) {
            loopTl.set(legends[i], { boxShadow: `0 0 0 1px ${CYCLE_STAGE_COLORS[i]}` }, `stage${i}`);
            loopTl.to(legends[i], { opacity: 1, duration: 0.25 }, `stage${i}`);
          }
          loopTl.to({}, { duration: 0.8 }); // hold at peak
          loopTl.to(segs[i], { strokeWidth: 18, duration: 0.3 });
          loopTl.set(segs[i], { filter: "none" });
          loopTl.to(chevrons[i], { opacity: 0.6, duration: 0.3 }, "<");
          loopTl.to(numbers[i], { opacity: 0.6, duration: 0.3 }, "<");
          loopTl.to(accents[i], { opacity: 0, duration: 0.3 }, "<");
          if (legends[i]) {
            loopTl.set(legends[i], { boxShadow: "none" }, "<");
            loopTl.to(legends[i], { opacity: 0.85, duration: 0.3 }, "<");
          }
        });

        let revealed = false;

        const revealTrigger = ScrollTrigger.create({
          trigger: container,
          start: "top 75%",
          once: true,
          onEnter: () => {
            const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
            if (center) tl.to(center, { autoAlpha: 1, y: 0, duration: 0.35 });
            [0, 1, 2, 3].forEach((i) => {
              tl.to(segs[i], { strokeDashoffset: 0, duration: 0.5, ease: "power1.inOut" }, i === 0 ? "-=0.05" : undefined);
              tl.to(chevrons[i], { opacity: 0.6, duration: 0.15 }, "-=0.1");
              tl.to(labels[i], { autoAlpha: 1, y: 0, duration: 0.35 }, "-=0.15");
            });
            tl.call(() => {
              revealed = true;
              if (ScrollTrigger.isInViewport(container)) loopTl.play();
            });
          },
        });

        // Independent, non-`once` visibility trigger: pauses/resumes the
        // continuous loop as the section scrolls in and out, so it never
        // animates while offscreen.
        const visibilityTrigger = ScrollTrigger.create({
          trigger: container,
          start: "top bottom",
          end: "bottom top",
          onEnter: () => revealed && loopTl.play(),
          onEnterBack: () => revealed && loopTl.play(),
          onLeave: () => loopTl.pause(),
          onLeaveBack: () => loopTl.pause(),
        });

        return () => {
          revealTrigger.kill();
          visibilityTrigger.kill();
          loopTl.kill();
          gsap.set([center, ...labels, ...segs, ...chevrons, ...numbers, ...accents, ...legends].filter(Boolean), {
            clearProps: "opacity,visibility,transform,strokeDasharray,strokeDashoffset,strokeWidth,filter,boxShadow",
          });
        };
      });
    }, container);

    return () => {
      mm.revert();
      context.revert();
    };
  }, []);

  return (
    <div className="mx-auto max-w-[560px] sm:max-w-[720px] lg:max-w-[1220px]">
      <div
        ref={containerRef}
        className="grid grid-cols-[minmax(0,1fr)_250px_minmax(0,1fr)] grid-rows-[auto_auto_auto] items-center gap-x-3 gap-y-5 sm:grid-cols-[minmax(0,1fr)_320px_minmax(0,1fr)] sm:gap-x-6 lg:grid-cols-[minmax(240px,300px)_500px_minmax(240px,300px)] lg:gap-x-14 lg:gap-y-10"
      >
        {steps.map((step, i) => (
          <div
            key={step.label}
            ref={(el) => {
              labelRefs.current[i] = el;
            }}
            className={CYCLE_LABEL_POSITION[i]}
          >
            <CycleLabel
              index={i}
              label={step.label}
              desc={step.desc}
              icon={step.icon}
              color={CYCLE_STAGE_COLORS[i]}
              numberRef={(el) => {
                numberRefs.current[i] = el;
              }}
              accentRef={(el) => {
                accentRefs.current[i] = el;
              }}
            />
          </div>
        ))}
        <div className="relative col-start-2 row-start-2 h-[250px] w-[250px] justify-self-center sm:h-[320px] sm:w-[320px] lg:h-[500px] lg:w-[500px]">
          <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
            {CYCLE_ARC_PATHS.map((d, i) => (
              <path
                key={d}
                ref={(el) => {
                  segRefs.current[i] = el;
                }}
                d={d}
                fill="none"
                stroke="currentColor"
                strokeWidth="18"
                strokeLinecap="round"
                // Safely-oversized static hidden default (real segment
                // length is ~110-115 in this viewBox) so first paint
                // never shows a flash of the complete arc before JS
                // corrects it to the exact length — see the SSR/
                // hydration-flash guard note on CycleRing above.
                style={{ color: CYCLE_STAGE_COLORS[i], strokeDasharray: 400, strokeDashoffset: 400 }}
              />
            ))}
            {CYCLE_CHEVRONS.map((points, i) => (
              <polyline
                key={points}
                ref={(el) => {
                  chevronRefs.current[i] = el;
                }}
                points={points}
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: CYCLE_STAGE_COLORS[i], opacity: 0 }}
              />
            ))}
          </svg>
          <div ref={centerRef} className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center sm:px-10 lg:px-14">
            <p
              className="cf-heading text-[1.3rem] font-medium leading-7 sm:text-[1.5rem] lg:text-[1.75rem] lg:leading-9"
              style={{ color: "var(--cf-accent)" }}
            >
              {centerLine1}
            </p>
            <p
              className="mt-1.5 text-[1rem] leading-6 sm:text-[1.1rem] lg:text-[1.2rem] lg:leading-7"
              style={{ color: "var(--cf-accent)", opacity: 0.85 }}
            >
              {centerLine2}
            </p>
          </div>
        </div>
      </div>
      {/* Compact legend: the full secondary descriptions, hidden inside
          the label blocks below `lg`, restated here so they're never
          lost on smaller screens rather than only ever showing at desktop. */}
      <div className="mt-8 space-y-3 lg:hidden">
        {steps.map((step, i) => (
          <LoopNode
            key={step.label}
            index={i}
            label={step.label}
            desc={step.desc}
            icon={step.icon}
            color={CYCLE_STAGE_COLORS[i]}
            cardRef={(el) => {
              legendRefs.current[i] = el;
            }}
          />
        ))}
      </div>
    </div>
  );
}

type IconName =
  | "document"
  | "layers"
  | "code"
  | "checkbox"
  | "revise"
  | "link"
  | "shield"
  | "factory"
  | "message"
  | "loop"
  | "swap"
  | "box"
  | "sliders"
  | "key"
  | "desktop"
  | "tablet"
  | "barcode"
  | "tap"
  | "signal";

/** Small hairline glyphs (1.3px stroke, square joins) matching the site's
 * own rule-based visual language rather than a filled icon-font look — no
 * new dependency for a set this size (see AGENTS.md on adding deps only
 * when genuinely necessary; the one existing icon precedent, VideoEvidence's
 * play/pause glyphs, is also hand-drawn inline SVG). */
function Icon({ name, className = "", size = 18 }: { name: IconName; className?: string; size?: number }) {
  const props = {
    viewBox: "0 0 20 20",
    width: size,
    height: size,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.3,
    strokeLinecap: "square" as const,
    strokeLinejoin: "miter" as const,
    "aria-hidden": true,
    className,
  };
  switch (name) {
    case "document":
      return (
        <svg {...props}>
          <rect x="5" y="3" width="10" height="14" />
          <line x1="7.5" y1="7" x2="12.5" y2="7" />
          <line x1="7.5" y1="10" x2="12.5" y2="10" />
          <line x1="7.5" y1="13" x2="12.5" y2="13" />
        </svg>
      );
    case "layers":
      return (
        <svg {...props}>
          <rect x="4" y="4" width="9" height="9" />
          <rect x="7" y="7" width="9" height="9" />
        </svg>
      );
    case "code":
      return (
        <svg {...props}>
          <polyline points="8,5 3,10 8,15" />
          <polyline points="12,5 17,10 12,15" />
        </svg>
      );
    case "checkbox":
      return (
        <svg {...props}>
          <rect x="4" y="4" width="12" height="12" />
          <polyline points="7,10.5 9,13 13.5,7.5" />
        </svg>
      );
    case "revise":
      return (
        <svg {...props}>
          <polyline points="15,6 7,6 7,14" />
          <polyline points="4,11 7,14 10,11" />
        </svg>
      );
    case "link":
      return (
        <svg {...props}>
          <rect x="2" y="8" width="6" height="6" />
          <rect x="12" y="8" width="6" height="6" />
          <line x1="8" y1="11" x2="12" y2="11" />
        </svg>
      );
    case "shield":
      return (
        <svg {...props}>
          <polygon points="10,3 16,5.5 16,10.5 10,17 4,10.5 4,5.5" />
          <polyline points="7,10 9.2,12.3 13.3,7.7" />
        </svg>
      );
    case "factory":
      return (
        <svg {...props}>
          <rect x="3" y="10" width="14" height="7" />
          <polyline points="3,10 3,6 7,8 7,5 11,7.5 11,10" />
          <line x1="14" y1="10" x2="14" y2="7" />
          <line x1="14" y1="7" x2="16" y2="7" />
        </svg>
      );
    case "message":
      return (
        <svg {...props}>
          <polygon points="3,4 17,4 17,13 8,13 5,16 5,13 3,13" />
        </svg>
      );
    case "loop":
      return (
        <svg {...props}>
          <path d="M16 6 A7 7 0 1 1 6.5 4" />
          <polyline points="4,6 6.5,4 8,7" />
        </svg>
      );
    case "swap":
      return (
        <svg {...props}>
          <polyline points="4,7 16,7" />
          <polyline points="13,4 16,7 13,10" />
          <polyline points="16,13 4,13" />
          <polyline points="7,10 4,13 7,16" />
        </svg>
      );
    case "box":
      return (
        <svg {...props}>
          <polyline points="3,7 10,4 17,7 10,10 3,7" />
          <polyline points="3,7 3,14 10,17 10,10" />
          <polyline points="17,7 17,14 10,17" />
        </svg>
      );
    case "sliders":
      return (
        <svg {...props}>
          <line x1="3" y1="5" x2="17" y2="5" />
          <line x1="3" y1="10" x2="17" y2="10" />
          <line x1="3" y1="15" x2="17" y2="15" />
          <rect x="6" y="3.5" width="3" height="3" />
          <rect x="11" y="8.5" width="3" height="3" />
          <rect x="4" y="13.5" width="3" height="3" />
        </svg>
      );
    case "key":
      return (
        <svg {...props}>
          <rect x="3" y="7" width="6" height="6" />
          <line x1="9" y1="10" x2="17" y2="10" />
          <line x1="13" y1="10" x2="13" y2="13" />
          <line x1="16" y1="10" x2="16" y2="13" />
        </svg>
      );
    case "desktop":
      return (
        <svg {...props}>
          <rect x="3" y="4" width="14" height="9" />
          <line x1="8" y1="16" x2="12" y2="16" />
          <line x1="10" y1="13" x2="10" y2="16" />
        </svg>
      );
    case "tablet":
      return (
        <svg {...props}>
          <rect x="5" y="3" width="10" height="14" />
          <line x1="9" y1="15" x2="11" y2="15" />
        </svg>
      );
    case "barcode":
      return (
        <svg {...props}>
          <line x1="4" y1="4" x2="4" y2="16" />
          <line x1="6.5" y1="4" x2="6.5" y2="16" />
          <line x1="9" y1="4" x2="9" y2="16" />
          <line x1="11.5" y1="4" x2="11.5" y2="16" />
          <line x1="14" y1="4" x2="14" y2="16" />
          <line x1="16.5" y1="4" x2="16.5" y2="16" />
        </svg>
      );
    case "tap":
      return (
        <svg {...props}>
          <rect x="5" y="12" width="10" height="4" />
          <line x1="10" y1="3" x2="10" y2="10" />
          <polyline points="7,7 10,10 13,7" />
        </svg>
      );
    case "signal":
      return (
        <svg {...props}>
          <rect x="9" y="9" width="2" height="2" />
          <line x1="10" y1="6" x2="10" y2="3" />
          <line x1="13.5" y1="7.5" x2="15.5" y2="5.5" />
          <line x1="14" y1="10" x2="17" y2="10" />
        </svg>
      );
    default:
      return null;
  }
}

/** Both Section 02's pipeline steps and Section 03's architecture items
 * carry a short secondary description (quieter than the label) restoring
 * the explanatory detail the recruiter version had, at website-appropriate
 * length — one line for a pipeline step, 1–2 short phrases for an
 * architecture item. */
type PipelineItem = { label: string; icon: IconName; desc: string };
type ArchitectureItem = { label: string; icon: IconName; desc: string[] };

/** 02 — one node in the delivery pipeline: icon, step number, label, and
 * a one-line description of what actually happens in that step, connected
 * by FlowArrow between rows. */
function PipelineNode({ index, label, desc, icon }: { index: number; label: string; desc: string; icon: IconName }) {
  return (
    <div className="flex flex-1 flex-row items-start gap-4 lg:flex-col lg:items-center lg:gap-3 lg:text-center">
      <Icon name={icon} size={26} className="cf-accent shrink-0 mt-0.5 lg:mt-0" />
      <div className="lg:flex lg:flex-col lg:items-center lg:gap-2">
        <p className="cf-meta cf-dim" style={{ fontSize: "0.95rem" }}>
          {String(index + 1).padStart(2, "0")}
        </p>
        <p className="cf-body text-[1.2rem] leading-7">{label}</p>
        <p className="cf-dim mt-1 text-[1rem] leading-6 lg:mt-0">{desc}</p>
      </div>
    </div>
  );
}

/** `reverseDesktop` renders this row as the second leg of a serpentine
 * flow: DOM/reading order stays startIndex..startIndex+n (unchanged, so
 * screen readers and tab order still go 01→10 straight through), while
 * `lg:flex-row-reverse` only flips the *visual* placement so the row
 * reads right-to-left on desktop, continuing directly from the row
 * above's rightmost node instead of wrapping back to the left edge. */
function PipelineRow({
  steps,
  startIndex,
  reverseDesktop = false,
}: {
  steps: PipelineItem[];
  startIndex: number;
  reverseDesktop?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-7 lg:items-start lg:gap-2 ${
        reverseDesktop ? "lg:flex-row-reverse" : "lg:flex-row"
      }`}
    >
      {steps.map((step, i) => (
        <Fragment key={step.label}>
          <PipelineNode index={startIndex + i} label={step.label} desc={step.desc} icon={step.icon} />
          {i < steps.length - 1 && <FlowArrow reverseDesktop={reverseDesktop} />}
        </Fragment>
      ))}
    </div>
  );
}

/** 03 — shared bordered-card shell so all three groups keep the same
 * outer footprint even though what's inside each is deliberately
 * different (sequence / grid / clustered) rather than three identical
 * bullet lists. */
function GroupCard({
  index,
  title,
  subtitle,
  children,
}: {
  index: number;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="border-b cf-rule py-6 sm:border-r sm:px-6 sm:first:pl-0 sm:last:border-r-0">
      <p className="cf-meta cf-accent" style={{ fontSize: "0.95rem" }}>
        0{index + 1}
      </p>
      <p className="cf-heading mt-4 text-[1.4rem] font-medium leading-8">{title}</p>
      <p className="cf-dim mt-2 text-[1rem] leading-6">{subtitle}</p>
      {children}
    </div>
  );
}

/** Shared icon → label → secondary-description block used by all three
 * Section 03 groups, so the hierarchy reads the same way even though the
 * outer arrangement (sequence / grid / cluster) differs per group. */
function ItemDesc({ desc }: { desc: string[] }) {
  return (
    <div className="cf-dim mt-1 text-[1rem] leading-6">
      {desc.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </div>
  );
}

/** Group A — a real operational sequence: each step follows the last, so
 * it reads top-to-bottom instead of as an unordered feature list. */
function SequenceList({ items }: { items: ArchitectureItem[] }) {
  return (
    <div className="mt-5">
      {items.map((item, i) => (
        <div key={item.label}>
          <div className="flex items-start gap-3 py-2.5">
            <Icon name={item.icon} size={24} className="cf-dim shrink-0 mt-0.5" />
            <div>
              <p className="cf-body text-[1.2rem] leading-7">{item.label}</p>
              <ItemDesc desc={item.desc} />
            </div>
          </div>
          {i < items.length - 1 && (
            <span aria-hidden className="cf-dim ml-[11px] block text-sm leading-none">
              ↓
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/** Group B — compact function chips in a 2-col grid: a system's worth of
 * back-office functions, scannable as a set rather than a sequence. */
function FunctionGrid({ items }: { items: ArchitectureItem[] }) {
  return (
    <div className="mt-5 grid grid-cols-2 gap-3">
      {items.map((item) => (
        <div key={item.label} className="flex items-start gap-3 border cf-rule px-3.5 py-3">
          <Icon name={item.icon} size={24} className="cf-dim shrink-0 mt-0.5" />
          <div>
            <p className="cf-body text-[1.2rem] leading-7">{item.label}</p>
            <ItemDesc desc={item.desc} />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Group C — devices the interface runs on, visually separated from the
 * data-integration points that feed it. */
function DeviceGroup({
  devices,
  integrationLabel,
  integration,
}: {
  devices: ArchitectureItem[];
  integrationLabel: string;
  integration: ArchitectureItem[];
}) {
  return (
    <div className="mt-5 space-y-5">
      <div className="flex flex-wrap gap-3">
        {devices.map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-2 border cf-rule px-4 py-3.5 text-center">
            <Icon name={item.icon} size={24} className="cf-dim" />
            <div>
              <p className="cf-body text-[1.2rem] leading-6">{item.label}</p>
              <ItemDesc desc={item.desc} />
            </div>
          </div>
        ))}
      </div>
      <div className="border-t cf-rule pt-4">
        <p className="cf-meta cf-dim">{integrationLabel}</p>
        <div className="mt-3 flex flex-wrap gap-3">
          {integration.map((item) => (
            <div key={item.label} className="flex items-start gap-3 border cf-rule px-3.5 py-3">
              <Icon name={item.icon} size={24} className="cf-dim shrink-0 mt-0.5" />
              <div>
                <p className="cf-body text-[1.2rem] leading-7">{item.label}</p>
                <ItemDesc desc={item.desc} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** 04 — Problem → Design Decision → Interface Evidence, one real screenshot
 * per group. Two groups only (A/B) — the third candidate evidence image was
 * confirmed to belong to a different, unrelated project and is excluded. */
function EvidenceGroup({
  letter,
  title,
  problemLabel,
  problem,
  decisionLabel,
  decision,
  asset,
  caption,
}: {
  letter: string;
  title: string;
  problemLabel: string;
  problem: string;
  decisionLabel: string;
  decision: string;
  asset: EvidenceAsset;
  caption: string;
}) {
  return (
    <div>
      <p className="cf-meta cf-accent">
        {letter} — {title}
      </p>
      <div className="mt-5 space-y-5">
        <div>
          <p className="cf-meta cf-dim">{problemLabel}</p>
          <p className="cf-body body-tc mt-2 max-w-[62ch]">{problem}</p>
        </div>
        <div>
          <p className="cf-meta cf-dim">{decisionLabel}</p>
          <p className="cf-body body-tc mt-2 max-w-[62ch]">{decision}</p>
        </div>
      </div>
      <Reveal className="mt-8 block">
        <Evidence asset={asset} caption={caption} />
      </Reveal>
    </div>
  );
}

function DemoCTA({ zhHant }: { zhHant: boolean }) {
  return (
    <div className="mt-10 border-t cf-rule pt-8">
      <a
        href="/demos/case03/demo01/demo_01.html"
        target="_blank"
        rel="noopener noreferrer"
        className="case-link group inline-flex items-center gap-3 label-mono cf-heading"
        style={{ fontSize: "1.3rem" }}
      >
        {zhHant ? "查看可操作 Prototype" : "View Interactive Prototype"}
        <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-2">
          ↗
        </span>
      </a>
      <p className="cf-dim mt-5 max-w-[58ch] text-[1.1rem]" style={{ lineHeight: 1.8 }}>
        {zhHant
          ? "原系統中經去識別化處理的部分可操作 Prototype；其餘工作流程因保密需求，以真實專案畫面呈現。"
          : "Selected sanitized prototype from the original system. Additional workflows are shown through real project screens due to confidentiality."}
      </p>
    </div>
  );
}

export function CaseThreeFinalContent({ register, locale }: { register: RegisterSection; locale: Locale }) {
  const zhHant = locale === "zh";

  const pipelineSteps: PipelineItem[] = zhHant
    ? [
        { label: "需求／現場情境", icon: "document", desc: "理解工廠流程、使用情境與系統目標" },
        { label: "UI／UX 設計", icon: "layers", desc: "整理操作流程與介面架構，建立一致的互動方式" },
        { label: "前端 Prototype", icon: "code", desc: "將設計實作成可操作介面，驗證實際互動流程" },
        { label: "客戶分階段測試", icon: "checkbox", desc: "分階段提供測試，收集回饋並驗證操作是否符合需求" },
        { label: "UX／UI 修改", icon: "revise", desc: "根據測試與回饋調整流程、介面與操作細節" },
        { label: "Backend 整合", icon: "link", desc: "與後端整合資料與操作流程，確認系統能完整運作" },
        { label: "QA", icon: "shield", desc: "檢查功能、操作流程與介面一致性，修正整合問題" },
        { label: "工廠正式使用", icon: "factory", desc: "完成整合與測試後，系統正式投入工廠作業" },
        { label: "實際使用回饋", icon: "message", desc: "從日常操作中收集回饋，找出新的使用問題" },
        { label: "持續 UX 優化", icon: "loop", desc: "依真實使用情境持續調整介面與操作流程" },
      ]
    : [
        { label: "Requirements / Context", icon: "document", desc: "Understand factory workflows, operating context, and system goals." },
        { label: "UI/UX Design", icon: "layers", desc: "Structure workflows and interfaces into a consistent interaction model." },
        { label: "Frontend Prototype", icon: "code", desc: "Turn the design into an operable interface to validate real interactions." },
        { label: "Staged Client Testing", icon: "checkbox", desc: "Test in stages, collect feedback, and validate the workflow against actual needs." },
        { label: "UX/UI Revision", icon: "revise", desc: "Refine workflows, interfaces, and interaction details based on testing and feedback." },
        { label: "Backend Integration", icon: "link", desc: "Integrate frontend flows with backend data and system behavior." },
        { label: "QA", icon: "shield", desc: "Verify functionality, workflow behavior, and interface consistency." },
        { label: "Production", icon: "factory", desc: "After integration and QA, the system entered real factory operation." },
        { label: "Real Usage Feedback", icon: "message", desc: "Collect feedback from day-to-day use and identify operational issues." },
        { label: "Post-launch UX Iteration", icon: "loop", desc: "Continue refining interfaces and workflows based on real usage." },
      ];

  const factorySequence: ArchitectureItem[] = zhHant
    ? [
        { label: "生產", icon: "factory", desc: ["生產排程", "工單執行"] },
        { label: "領料／退料", icon: "swap", desc: ["領用物料", "退料處理"] },
        { label: "作業紀錄", icon: "document", desc: ["現場作業", "進度回報"] },
        { label: "品檢", icon: "checkbox", desc: ["品質檢驗", "不良處理"] },
        { label: "包裝／入庫", icon: "box", desc: ["成品包裝", "入庫管理"] },
      ]
    : [
        { label: "Production", icon: "factory", desc: ["Production scheduling", "Work-order execution"] },
        { label: "Material Issue / Return", icon: "swap", desc: ["Material issue", "Material return"] },
        { label: "Operation Records", icon: "document", desc: ["Shop-floor operation", "Progress reporting"] },
        { label: "Quality Inspection", icon: "checkbox", desc: ["Quality inspection", "Nonconformance handling"] },
        { label: "Packaging / Inbound", icon: "box", desc: ["Finished-goods packaging", "Inbound storage"] },
      ];

  const managementFunctions: ArchitectureItem[] = zhHant
    ? [
        { label: "製令", icon: "document", desc: ["製令建立", "進度追蹤"] },
        { label: "排程／生產管理", icon: "sliders", desc: ["生產排程", "資源規劃"] },
        { label: "庫存", icon: "box", desc: ["物料庫存", "即時查詢"] },
        { label: "報表", icon: "document", desc: ["生產／品質", "庫存等報表"] },
        { label: "權限", icon: "key", desc: ["角色管理", "權限設定"] },
        { label: "系統設定", icon: "sliders", desc: ["基本資料", "系統參數"] },
      ]
    : [
        { label: "Work Orders", icon: "document", desc: ["Work-order creation", "Progress tracking"] },
        { label: "Scheduling / Production Management", icon: "sliders", desc: ["Production scheduling", "Resource planning"] },
        { label: "Inventory", icon: "box", desc: ["Material inventory", "Status lookup"] },
        { label: "Reports", icon: "document", desc: ["Production / quality", "Inventory reporting"] },
        { label: "Permissions", icon: "key", desc: ["Role management", "Permission settings"] },
        { label: "System Settings", icon: "sliders", desc: ["Master data", "System parameters"] },
      ];

  const deviceItems: ArchitectureItem[] = zhHant
    ? [
        { label: "桌面", icon: "desktop", desc: ["辦公室作業", "完整功能"] },
        { label: "工業平板", icon: "tablet", desc: ["現場操作", "耐用易用"] },
        { label: "條碼掃描", icon: "barcode", desc: ["條碼掃描", "快速輸入"] },
        { label: "現場輸入", icon: "tap", desc: ["產線現場", "即時回報"] },
      ]
    : [
        { label: "Desktop", icon: "desktop", desc: ["Office operations", "Full functionality"] },
        { label: "Industrial Tablet", icon: "tablet", desc: ["Shop-floor operation", "Field-friendly interface"] },
        { label: "Barcode / Scan", icon: "barcode", desc: ["Barcode scanning", "Fast input"] },
        { label: "Shop-floor Input", icon: "tap", desc: ["Production floor", "Real-time reporting"] },
      ];

  const integrationItems: ArchitectureItem[] = zhHant
    ? [
        { label: "ERP 資料串接", icon: "link", desc: ["業務／生產資料整合"] },
        { label: "設備 IoT 數據", icon: "signal", desc: ["設備狀態與感測資料"] },
      ]
    : [
        { label: "ERP Integration", icon: "link", desc: ["Business / production data exchange"] },
        { label: "IoT Equipment Data", icon: "signal", desc: ["Equipment state and sensor data"] },
      ];

  const architectureSubtitles = zhHant
    ? {
        factory: "涵蓋從生產到入庫的主要作業流程",
        management: "支援工廠日常營運與決策所需的管理功能",
        devices: "支援多種裝置與資料整合，滿足不同現場作業需求",
      }
    : {
        factory: "Core operational flow from production through inbound storage.",
        management: "Management functions supporting daily operations and decision-making.",
        devices: "Multiple devices and data integrations supporting different operational contexts.",
      };

  // Order is the FINAL explicit stage numbering (01 Real Use, 02
  // Feedback, 03 Continued Iteration, 04 UI/Workflow Adjustment) — note
  // 03/04 no longer match the earlier "Real Use -> Feedback ->
  // UI/Workflow Adjustment -> Continued Iteration" narrative order; this
  // is an intentional renumbering, not a mistake, per explicit direction.
  const loopSteps: PipelineItem[] = zhHant
    ? [
        { label: "實際使用", icon: "factory", desc: "工廠正式使用系統" },
        { label: "使用回饋", icon: "message", desc: "從日常操作中發現問題" },
        { label: "持續優化", icon: "loop", desc: "更新後再次投入使用" },
        { label: "介面／流程調整", icon: "revise", desc: "依實際情境修改 UX / UI" },
      ]
    : [
        { label: "Real Use", icon: "factory", desc: "System used in daily factory operations" },
        { label: "Feedback", icon: "message", desc: "Issues surfaced through day-to-day use" },
        { label: "Continued Iteration", icon: "loop", desc: "Updated experience returns to real operation" },
        { label: "UI / Workflow Adjustment", icon: "revise", desc: "Refine interfaces and workflows based on real conditions" },
      ];

  const responsibilities = zhHant
    ? ["需求理解", "使用者流程／資訊架構", "UI/UX 設計", "HTML／CSS／JavaScript Prototype", "客戶測試", "Backend 整合", "QA", "上線後 UX 優化"]
    : [
        "Requirement Understanding",
        "User Flow / Information Architecture",
        "UI/UX Design",
        "HTML / CSS / JavaScript Prototype",
        "Client Testing",
        "Backend Integration",
        "QA",
        "Post-launch UX Iteration",
      ];

  const results = zhHant
    ? [
        {
          primary: "完成 Backend 整合與 QA 後正式導入使用",
          secondary: "系統完成後端資料整合與測試，正式投入工廠生產與營運作業，而不只是停留在 Prototype 階段。",
        },
        {
          primary: "上線後持續依實際操作回饋調整流程與介面",
          secondary: "系統上線後，我持續根據現場使用情境與客戶回饋，調整操作流程與介面，讓產品更貼近真實作業需求。",
        },
        {
          primary: "完整參與從需求理解到上線後 UX iteration 的交付流程",
          secondary: "從需求理解、UI/UX、前端 Prototype、客戶測試、Backend 整合、QA，到正式上線與後續優化，完整參與產品交付生命週期。",
        },
      ]
    : [
        {
          primary: "Launched into factory use after backend integration and QA",
          secondary: "After backend data integration and testing were completed, the system entered real factory production and operational use rather than remaining a prototype.",
        },
        {
          primary: "Continued refinement based on real operational feedback",
          secondary: "After launch, I continued adjusting workflows and interfaces based on real operating conditions and client feedback so the product could better support day-to-day work.",
        },
        {
          primary: "End-to-end involvement from requirements through post-launch UX iteration",
          secondary: "I participated across the delivery lifecycle — requirements, UI/UX, frontend prototype, client testing, backend integration, QA, production launch, and continued UX refinement.",
        },
      ];

  return (
    <>
      {/* 01 — Project Background & My Role */}
      <Section index={0} register={register} divider={false}>
        <Reveal>
          <SectionHeading
            label={zhHant ? "01 — 專案背景與我的角色" : "01 — PROJECT BACKGROUND & MY ROLE"}
            title={zhHant ? "專案背景與我的角色" : "Project Background & My Role"}
          />
        </Reveal>
        <div className="cf-body body-tc mt-6 max-w-[62ch] space-y-4">
          <p>
            {zhHant
              ? "這是一套供工廠管理人員與現場人員使用的內部作業系統，涵蓋生產、物料領退、庫存、品檢與環境監測等日常營運流程，資訊量大、角色多、操作狀態複雜。"
              : "An internal operations system for factory management staff and shop-floor workers, covering production, material issue/return, inventory, quality inspection, and environmental monitoring — high information density, multiple roles, complex operating states."}
          </p>
          <p>
            {zhHant
              ? "專案並未配置專職前端工程師。PM／SA／客戶端確立了作業需求、系統規則與工廠情境；我的工作是將這些需求轉化為清楚、可操作的介面，並完成前端 UI 層的實作。"
              : "There was no dedicated frontend engineer on this project. PM, SA, and client stakeholders defined the operational requirements, system rules, and factory context. My responsibility was translating those requirements into clear, usable interfaces and implementing the frontend UI layer."}
          </p>
        </div>
        <ul className="mt-8 flex flex-wrap gap-2">
          {responsibilities.map((item) => (
            <li key={item} className="cf-tag">
              {item}
            </li>
          ))}
        </ul>
      </Section>

      {/* 02 — Real Product Delivery Workflow */}
      <Section index={1} register={register}>
        <Reveal>
          <SectionHeading
            label={zhHant ? "02 — 實際工作流程" : "02 — REAL PRODUCT DELIVERY WORKFLOW"}
            title={zhHant ? "實際工作流程" : "Real Product Delivery Workflow"}
          />
        </Reveal>
        <p className="cf-body body-tc mt-4 max-w-[62ch]">
          {zhHant
            ? "不同於單純交付視覺稿的流程，這個專案直接以可操作的 HTML／CSS／JavaScript Prototype 進行客戶分階段測試，在 Backend 整合前就先驗證操作邏輯，問題能更早被發現、更早被修正。"
            : "Rather than handing off static visuals, this project moved straight into an operable HTML/CSS/JavaScript prototype for staged client testing — validating interaction logic before backend integration, so issues surfaced and were fixed earlier."}
        </p>
        <div className="mt-10 space-y-8 border-t cf-rule pt-10">
          <PipelineRow steps={pipelineSteps.slice(0, 5)} startIndex={0} />
          {/* Bridges step 05 (end of row 1) down to step 06. Left-aligned
              on mobile, where it just continues the single vertical stack;
              right-aligned at lg+ so it sits under step 05 (row 1's
              rightmost node) — which, with row 2 rendered in serpentine
              reverseDesktop order, is exactly where step 06 (row 2's
              first DOM child, placed at the row's visual right edge) now
              starts. Row 2 then reads right-to-left: 06 → 07 → 08 → 09 →
              10, so the whole section reads as one continuous snake
              instead of two independent left-to-right rows. */}
          <div className="flex justify-start pl-1 lg:justify-end lg:pr-1">
            <span aria-hidden className="cf-dim text-lg leading-none">
              ↓
            </span>
          </div>
          <PipelineRow steps={pipelineSteps.slice(5, 10)} startIndex={5} reverseDesktop />
        </div>
      </Section>

      {/* 03 — System Architecture & Key Workflow */}
      <Section index={2} register={register}>
        <Reveal>
          <SectionHeading
            label={zhHant ? "03 — 系統架構與主要流程" : "03 — SYSTEM ARCHITECTURE & KEY WORKFLOW"}
            title={zhHant ? "系統架構與主要流程" : "System Architecture & Key Workflow"}
          />
        </Reveal>
        <div className="mt-10 grid border-t cf-rule sm:grid-cols-3">
          <GroupCard index={0} title={zhHant ? "工廠作業" : "Factory Operations"} subtitle={architectureSubtitles.factory}>
            <SequenceList items={factorySequence} />
          </GroupCard>
          <GroupCard index={1} title={zhHant ? "管理端" : "Management Functions"} subtitle={architectureSubtitles.management}>
            <FunctionGrid items={managementFunctions} />
          </GroupCard>
          <GroupCard
            index={2}
            title={zhHant ? "使用情境與整合" : "Devices & Integration Context"}
            subtitle={architectureSubtitles.devices}
          >
            <DeviceGroup
              devices={deviceItems}
              integrationLabel={zhHant ? "資料整合" : "Data Integration"}
              integration={integrationItems}
            />
          </GroupCard>
        </div>
        <p className="cf-body body-tc mt-8 max-w-[62ch]">
          {zhHant
            ? "這個專案的重點在於把 PM／SA／客戶的需求，轉化為使用者能理解、能操作的系統介面，而不是重新定義工廠的整套營運模型。"
            : "This project focused on translating PM/SA/client requirements into interfaces people could understand and operate — not on redefining the factory's entire operating model."}
        </p>
      </Section>

      {/* 04 — Real UI & Design Decisions */}
      <Section index={3} register={register}>
        <Reveal>
          <SectionHeading
            label={zhHant ? "04 — 實際介面與設計決策" : "04 — REAL UI & DESIGN DECISIONS"}
            title={zhHant ? "實際介面與設計決策" : "Real UI & Design Decisions"}
          />
        </Reveal>
        <div className="mt-10 space-y-16">
          <EvidenceGroup
            letter="A"
            title={zhHant ? "生產／現場作業" : "Production / Shop-floor Operations"}
            problemLabel={zhHant ? "問題" : "Problem"}
            problem={
              zhHant
                ? "現場作業涵蓋生產、環境監測、入庫等不同任務，各自需要處理不同資料；如果每個功能採用不同操作模式，會增加使用者在任務間切換的理解成本。"
                : "Shop-floor work spans different tasks such as production, environmental monitoring, and inbound receiving, each with different data needs. Using a different interaction model for every function would increase the cognitive cost of switching between tasks."
            }
            decisionLabel={zhHant ? "設計決策" : "Design Decision"}
            decision={
              zhHant
                ? "在多個現場功能中維持一致的篩選、表格、表單與確認操作模式，讓使用者能沿用熟悉的互動方式完成不同任務。"
                : "Across multiple operational functions, I kept filtering, tables, forms, and confirmation patterns consistent so familiar interactions could carry from one task to the next."
            }
            asset={{
              src: "/images/case03/case03-operations-collage.webp",
              alt: "Collage of multiple operational task screens sharing consistent table, form, and status patterns",
            }}
            caption={
              zhHant
                ? "不同功能的現場操作畫面，共用一致的表格、表單與狀態呈現方式。"
                : "Different operational screens share the same table, form, and status patterns."
            }
          />

          <EvidenceGroup
            letter="B"
            title={zhHant ? "倉儲／空間互動" : "Warehouse / Spatial Interaction"}
            problemLabel={zhHant ? "問題" : "Problem"}
            problem={
              zhHant
                ? "倉儲位置以儲位編號管理，單靠代碼不容易快速理解其實際空間方位。"
                : "Storage locations were managed by location codes, which alone were not an intuitive way to understand their physical position."
            }
            decisionLabel={zhHant ? "設計決策" : "Design Decision"}
            decision={
              zhHant
                ? "將實體倉儲空間轉換成可操作的向量平面圖，讓使用者能直接從視覺位置辨識與選取對應儲位。"
                : "I translated the physical storage layout into an interactive vector floorplan so users could identify and select locations spatially rather than relying on codes alone."
            }
            asset={{
              src: "/images/case03/case03-warehouse-floorplan.webp",
              alt: "Interactive vector floorplan of the physical warehouse, showing shelf zones, aisles, and storage status",
            }}
            caption={
              zhHant
                ? "入庫作業的儲位選擇畫面，使用者可直接從平面圖辨識與選取儲位。"
                : "The storage-selection step of the inbound flow — locations are chosen directly from the floorplan."
            }
          />
        </div>
      </Section>

      {/* 05 — Post-launch UX Iteration */}
      <Section index={4} register={register}>
        <Reveal>
          <SectionHeading
            label={zhHant ? "05 — 上線後 UX 優化" : "05 — POST-LAUNCH UX ITERATION"}
            title={zhHant ? "上線後 UX 優化" : "Post-launch UX Iteration"}
          />
        </Reveal>
        <div className="cf-body body-tc mt-6 max-w-[62ch] space-y-4">
          <p>{zhHant ? "系統正式導入工廠後，設計工作並沒有停在交付點。" : "Design did not stop when the system went live."}</p>
          <p>
            {zhHant
              ? "我持續根據現場操作情境與客戶回饋，釐清實際使用中的操作問題，再調整介面與流程，讓系統隨著真實使用持續優化。"
              : "I continued refining the interface and workflows based on real operating conditions and client feedback, using issues surfaced in day-to-day use to guide ongoing improvements."}
          </p>
        </div>
        <div className="mt-10 border-t cf-rule pt-10">
          <CycleRing
            steps={loopSteps}
            centerLine1={zhHant ? "上線後 UX 優化" : "Post-launch UX Iteration"}
            centerLine2={zhHant ? "持續迭代循環" : "Continuous Improvement Cycle"}
          />
        </div>
      </Section>

      {/* 06 — Results & Takeaways */}
      <Section index={5} register={register}>
        <Reveal>
          <SectionHeading
            label={zhHant ? "06 — 結果與收穫" : "06 — RESULTS & TAKEAWAYS"}
            title={zhHant ? "系統已正式導入工廠使用，並持續優化中。" : "The system is in production use at the factory, and continues to be refined."}
          />
        </Reveal>
        <ol className="mt-8 border-t cf-rule">
          {results.map((result, index) => (
            <li key={result.primary} className="border-b cf-rule py-9">
              <span className="cf-meta cf-accent" style={{ fontSize: "1rem" }}>
                0{index + 1}
              </span>
              <p className="cf-heading mt-3 max-w-[62ch] text-[1.4rem] font-medium leading-8">{result.primary}</p>
              <p className="cf-dim mt-3 max-w-[62ch] text-[1.2rem]" style={{ lineHeight: 1.8 }}>
                {result.secondary}
              </p>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}
