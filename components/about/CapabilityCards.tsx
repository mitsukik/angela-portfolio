"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Matches the desktop-motion gate already used by useSelectedWorkSequence.ts
// and SmoothScroll.tsx — the sticky card-accumulation interaction is
// desktop-only; tablet/mobile get a plain static layout instead.
const DESKTOP_MOTION_QUERY =
  "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

const CARD_WIDTH = 340;
const CARD_HEIGHT = 460;
const CARD_STEP = 255; // ~25% overlap between adjacent cards, edges only
const STAGE_WIDTH = CARD_STEP * 3 + CARD_WIDTH;

// One continuous optical arc — NOT a symmetrical low/high/high/low
// plateau. 02 and 03 are deliberately at different heights (03 is the
// single crest, 02 sits below it on the rising side) so the eye traces
// one curve from 01 up through 02, 03, and back down through 04, rather
// than reading four independently-offset rectangles. Y01 > Y04 > Y02 > Y03
// (larger Y = visually lower). Rotation follows the arc's tangent at each
// point rather than mirroring symmetrically, since 03 sits near the crest
// (near-neutral tangent) while 01/02/04 are on a slope.
const CARD_LAYOUT = [
  { x: 0, y: 55, rotate: -5 },
  { x: CARD_STEP, y: 15, rotate: -2 },
  { x: CARD_STEP * 2, y: 5, rotate: 1 },
  { x: CARD_STEP * 3, y: 45, rotate: 4.5 },
];

// Desktop scroll length for the whole section, and the scrub animation's
// own distance — kept in a fixed relationship so the reveal timeline
// finishes exactly as native CSS `sticky` naturally releases (section
// height minus one viewport's worth of scroll = the "stuck" window). This
// avoids both an idle stuck-but-static dead zone after the reveal
// completes and a premature release before it does. SECTION_VH must stay
// in sync with the literal `lg:min-h-[160vh]` Tailwind class below —
// Tailwind needs a static string, so this constant can't drive it directly.
const SECTION_VH = 160;
const SCRUB_VH_MULTIPLIER = (SECTION_VH - 100) / 100;

// Four solid, distinct backgrounds derived from the existing palette
// (lavender / off-white / acid-yellow direct from the design tokens, plus
// one deep muted plum mixed from lavender toward the page background) —
// no new hues, no gradients. Text color is chosen per card for contrast.
const CARD_PALETTE = [
  { background: "#B9A7FF", text: "#111111", textMuted: "rgba(17, 17, 17, 0.7)" },
  { background: "#F2F0EC", text: "#111111", textMuted: "rgba(17, 17, 17, 0.65)" },
  { background: "#E7F34B", text: "#111111", textMuted: "rgba(17, 17, 17, 0.7)" },
  { background: "#2A2140", text: "#F2F0EC", textMuted: "rgba(242, 240, 236, 0.68)" },
];

type ServiceArea = { title: string; description: string };

export function CapabilityCards({
  serviceAreas,
  lang,
  bodyClassName,
}: {
  serviceAreas: ServiceArea[];
  lang: string;
  bodyClassName: string;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add(DESKTOP_MOTION_QUERY, () => {
        const cards = cardRefs.current.filter((el): el is HTMLElement => Boolean(el));
        if (cards.length !== CARD_LAYOUT.length) return;

        // Rotation and stacking order never change with scroll — safe to
        // set once, unconditionally, regardless of current scroll position.
        cards.forEach((card, index) => {
          const layout = CARD_LAYOUT[index];
          gsap.set(card, { rotate: layout.rotate, zIndex: index + 1 });
        });

        // Card 1 is the permanent resting state — always visible,
        // never animated, for the entire section.
        const firstLayout = CARD_LAYOUT[0];
        gsap.set(cards[0], { x: firstLayout.x, y: firstLayout.y, opacity: 1, scale: 1 });

        // Cards 2-4: each reveal is a self-contained fromTo() tween, with
        // BOTH the hidden/offset "from" state and the final "to" state
        // declared as literal values here — not a separate gsap.set() call
        // made before the timeline exists, and not a plain .to() tween
        // (which lazily captures its start value from whatever the DOM
        // currently looks like the first time it renders).
        //
        // This matters specifically because of how ScrollTrigger's
        // invalidateOnRefresh works: on refresh (which GSAP triggers
        // automatically on load/resize, and which reload + browser scroll
        // restoration make more likely to coincide with this component's
        // setup than during ordinary continued scrolling), it calls
        // animation.revert().invalidate() on the timeline — wiping cards
        // back to their unstyled DOM state and marking cached tween start
        // values stale. A plain .to() tween (immediateRender defaults to
        // false) would then re-capture its "start" from that reverted,
        // unstyled state the next time it renders — silently swapping its
        // intended opacity:0/offset start for opacity:1/no-offset, so the
        // card renders wrong regardless of scroll position. .fromTo()
        // (immediateRender defaults to true) re-renders its literal,
        // explicitly-specified "from" object on every such cycle instead,
        // so the correct hidden state is always re-established before
        // ScrollTrigger applies the real scroll-derived progress on top of
        // it — this is a mechanism fix, not a timing one; it produces the
        // same correct result regardless of when a refresh happens to fire.
        const timeline = gsap.timeline({ paused: true });
        for (let index = 1; index < cards.length; index += 1) {
          const layout = CARD_LAYOUT[index];
          timeline.fromTo(
            cards[index],
            { opacity: 0, scale: 0.94, x: layout.x + 16, y: layout.y + 18 },
            { opacity: 1, scale: 1, x: layout.x, y: layout.y, duration: 1, ease: "power1.out" },
            index - 1,
          );
        }

        const scrollTrigger = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: () => `+=${Math.round(window.innerHeight * SCRUB_VH_MULTIPLIER)}`,
          scrub: 0.4,
          animation: timeline,
          invalidateOnRefresh: true,
        });

        // One explicit, synchronous, immediate re-sync right after setup —
        // not a delayed/guessed timeout. This forces ScrollTrigger to
        // re-measure and re-apply the correct progress from the actual
        // current scroll position right now, as a direct correctness
        // measure on top of the mechanism fix above (which is what makes
        // this refresh, and any other refresh, safe to call).
        scrollTrigger.refresh();

        return () => {
          scrollTrigger.kill();
          timeline.kill();
          // clearProps must name only the specific properties this effect
          // writes (transform composites + opacity + zIndex) — NOT "all".
          // GSAP's clearProps:"all" sets style.cssText = "" (see
          // node_modules/gsap/CSSPlugin.js _renderClearProps), wiping the
          // ENTIRE inline style attribute, including React's own width/
          // height/backgroundColor on this same <article> — not just the
          // properties GSAP itself set. This cleanup runs on every mount in
          // dev because React Strict Mode double-invokes effects (mount ->
          // cleanup -> mount); the second mount re-applies GSAP's own
          // properties correctly but nothing re-applies React's inline
          // style, since a bare effect re-run isn't a new commit. Naming
          // the exact properties avoids touching styles this effect never
          // set.
          cards.forEach((card) =>
            gsap.set(card, { clearProps: "transform,opacity,zIndex" }),
          );
        };
      });
    }, section);

    return () => {
      media.revert();
      context.revert();
    };
  }, []);

  const renderCardContent = (area: ServiceArea, index: number) => {
    const palette = CARD_PALETTE[index];
    return (
      <>
        <p
          className="text-[2.75rem] font-medium leading-none tracking-[-0.02em]"
          style={{ color: palette.text }}
        >
          {String(index + 1).padStart(2, "0")}
        </p>
        <h3
          lang={lang}
          className="mt-6 text-[1.65rem] font-medium tracking-[-0.02em] sm:text-[1.9rem]"
          style={{ color: palette.text }}
        >
          {area.title}
        </h3>
        <p lang={lang} className={`mt-4 ${bodyClassName}`} style={{ color: palette.textMuted }}>
          {area.description}
        </p>
      </>
    );
  };

  return (
    <section ref={sectionRef} className="lg:relative lg:min-h-[160vh]">
      {/* Tablet / mobile / desktop-reduced-motion: plain readable stack —
          no sticky, no overlap, no rotation. Same colors and radius. */}
      <div className="grid gap-6 sm:grid-cols-2 lg:motion-safe:hidden">
        {serviceAreas.map((area, index) => (
          <article
            key={area.title}
            className="rounded-[40px] p-8 sm:p-10"
            style={{ backgroundColor: CARD_PALETTE[index].background }}
          >
            {renderCardContent(area, index)}
          </article>
        ))}
      </div>

      {/* Desktop + motion-safe only: sticky stage, centered fan composition. */}
      <div className="hidden overflow-x-hidden lg:motion-safe:sticky lg:motion-safe:top-0 lg:motion-safe:flex lg:motion-safe:h-screen lg:motion-safe:items-center">
        <div className="relative mx-auto" style={{ width: STAGE_WIDTH, height: CARD_HEIGHT + 40 }}>
          {serviceAreas.map((area, index) => (
            <article
              key={area.title}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className="capability-card absolute left-0 top-0 rounded-[40px] p-10"
              style={{
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                backgroundColor: CARD_PALETTE[index].background,
              }}
            >
              {renderCardContent(area, index)}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
