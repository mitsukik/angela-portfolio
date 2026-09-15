import { aboutV2Content } from "@/data/about-v2";
import type { Locale } from "@/data/locale";
import { HeroBackgroundShapes } from "@/components/home/HeroBackgroundShapes";
import { OpeningV2 } from "./OpeningV2";
import { WhatIDoV2 } from "./WhatIDoV2";
import { HowIWorkV2 } from "./HowIWorkV2";
import { SkillsV2 } from "./SkillsV2";
import { BeyondV2 } from "./BeyondV2";

// VISUAL EXPERIMENT — page-level Background Shapes field, not yet an
// approved direction. Reuses HeroBackgroundShapes exactly as Home does
// (same weighted kind/color tables, same independent per-cell timers,
// same reduced-motion gate, same undistorted uniform scaling) — no props
// beyond `fill` and a calmer gridCols/gridRows than Home's own default,
// same as the original header-only version of this experiment.
//
// `fixed`, not `absolute`: the field stays visually pinned to the
// viewport while the page's own content scrolls over it — Angela's
// explicit direction, replacing the earlier "one giant field the size of
// the whole document, revealing a different vertical slice as you
// scroll" approach. Because the field is now always exactly
// viewport-sized rather than page-tall, `matchGridAspect` and the
// row-based `densityCurve` from that earlier approach no longer apply
// here (there's no "top of page" vs "bottom of page" left to distinguish
// once the background never moves) — both flags remain on
// HeroBackgroundShapes itself, unused by this call, in case a future
// scrolling variant wants them again.
//
// Plain CSS (`fixed inset-0`) was sufficient for the requested behavior
// on its own — no GSAP, no scroll listener, no JS positioning of any
// kind was needed for the pinning itself; GSAP inside HeroBackgroundShapes
// still drives only the existing per-cell opacity crossfades, unrelated
// to this component's own position.
//
// One instance for the whole page (not one per section) — a single
// mounted field covering every section's own empty space is what keeps
// this to ~80 independent timers total instead of multiplying that count
// by five separate mounted instances.
const ABOUT_GRID_COLS = 10;
const ABOUT_GRID_ROWS = 8;

// About VER2 — isolated prototype assembler. Six regions per the approved
// concept: Opening, What I Do, How I Work, Skills/Tools, Beyond Product
// Design, and the existing shared Closing (SiteFooter, composed by the
// route itself, not here — VER2 has no About-specific contact section).
export function AboutV2({ locale }: { locale: Locale }) {
  const content = aboutV2Content[locale];

  return (
    <div className="scene-dark relative">
      {/* aria-hidden, fixed inset-0: pinned to the viewport rather than
          scrolling with the page (see the file-level comment above).
          pointer-events-none so this purely decorative layer can never
          intercept a click, even over any gap between sections. */}
      <div aria-hidden className="fixed inset-0 pointer-events-none">
        <HeroBackgroundShapes fill gridCols={ABOUT_GRID_COLS} gridRows={ABOUT_GRID_ROWS} />
      </div>

      {/* Contrast-only overlay, fixed like the shapes layer so it never
          drifts out of registration with them while scrolling. Sits
          strictly between the shapes (z-index:auto) and the content
          (z-10) via z-[1] — grid size, density, shape logic, colors, and
          timing above are all untouched; this only dims what's already
          there. 0.22 is the lowest value in the requested 0.22-0.32
          range and was kept after live contrast verification (see
          report) rather than bumped further, since it already brought
          body text comfortably past WCAG AA while leaving shapes clearly
          visible in the large empty regions between sections. */}
      <div aria-hidden className="fixed inset-0 z-[1] pointer-events-none" style={{ backgroundColor: "rgba(0,0,0,0.22)" }} />

      {/* Positive z-index on the foreground, not a negative one on the
          background — the same reveal animations below apply an always-on
          Tailwind `transform` (translate-y-*), and any transformed element
          unconditionally forms its own stacking context that would paint
          above a merely-negative-z-index sibling regardless of DOM order
          (confirmed live in an earlier pass of this same experiment). This
          also keeps every section's own content above the now-fixed
          background regardless of scroll position — content stays in
          normal document flow, only the background is taken out of it. */}
      <div className="relative z-10">
        <OpeningV2 locale={locale} headlineLines={content.headlineLines} introParagraphs={content.introParagraphs} />

        <section className="site-frame border-t scene-rule py-16 md:py-24 lg:py-32" aria-labelledby="v2-what-i-do">
          <h2 id="v2-what-i-do" className="sr-only">
            {content.whatIDoHeading}
          </h2>
          <WhatIDoV2
            locale={locale}
            heading={content.whatIDoHeading}
            inputsLabel={content.inputsLabel}
            inputs={content.inputs}
            capabilities={content.capabilities}
          />
        </section>

        <section className="border-t scene-rule py-16 md:py-24 lg:motion-safe:py-0" aria-labelledby="v2-how-i-work">
          <div className="site-frame lg:motion-safe:pt-16">
            <h2 id="v2-how-i-work" className="type-v3-label cf-section-label text-lavender">
              {content.howIWorkHeading}
            </h2>
          </div>
          <HowIWorkV2 locale={locale} stages={content.stages} />
        </section>

        <section className="site-frame border-t scene-rule py-16 md:py-24" aria-labelledby="v2-skills">
          <h2 id="v2-skills" className="sr-only">
            {content.skillsHeading}
          </h2>
          <SkillsV2 locale={locale} heading={content.skillsHeading} skillGroups={content.skillGroups} />
        </section>

        <section className="site-frame border-t scene-rule py-16 md:py-24" aria-labelledby="v2-beyond">
          <h2 id="v2-beyond" className="sr-only">
            {content.beyondHeading}
          </h2>
          <BeyondV2
            locale={locale}
            heading={content.beyondHeading}
            paragraphs={content.beyondParagraphs}
            illustrationChain={content.illustrationChain}
          />
        </section>
      </div>
    </div>
  );
}
