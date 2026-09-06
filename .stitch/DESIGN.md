---
name: Angela Yu Portfolio — Current State (Home V1)
colors:
  background: "#111111"
  surface: "#171717"
  foreground: "#F2F0EC"
  accent-lavender: "#B9A7FF"
  accent-yellow: "#E7F34B"
---

# Design System: Angela Yu Portfolio — CURRENT STATE (Home V1)

**Status:** Historical/current-state reference only. This document describes
what is already implemented in production. It is input context for a Home V2
exploration pass — it is **not** a constraint on that exploration. Angela has
explicitly authorized departing from any of these decisions where the new
direction calls for it (see AGENTS.md "Preference Boundaries").

## 1. Visual Theme & Atmosphere

The current Home is a single-mode dark editorial page: near-black ground
(#111111), warm off-white text (#F2F0EC), two accent colors used sparingly
and specifically (never decoratively) — a cool pale lavender for role/label
language and an acid, high-contrast yellow reserved for emphasis words and
interactive/scroll affordances. The mood is quiet, confident, restrained —
generous negative space, sharp-cornered content blocks, no shadows, no
gradients, no glassmorphism outside the nav. Personality is expressed through
typographic scale and motion timing rather than ornament.

The whole page currently commits to one background value throughout — there
is no light/dark state change between sections, and no scene-to-scene
contrast beyond the accent colors. This is the specific trait Home V2 is
being asked to break from.

## 2. Color Palette & Roles

### Primary Foundation
- **Void Black** `#111111` — page/root background, used everywhere.
- **Card Surface** `#171717` — the Selected Work media frame background, one step lighter than the page.

### Accent & Interactive
- **Pale Signal Lavender** `#B9A7FF` — eyebrow role label ("Product Designer"), used as a quiet identity marker, never as a CTA color.
- **Acid Yellow** `#E7F34B` — highest-contrast accent; reserved for headline emphasis words (複雜/直覺), the active project-number indicator, the SCROLL affordance, and focus rings. Functions as the site's "attention" color — used sparingly and always meaningfully.

### Typography & Text Hierarchy
- **Primary Text** `#F2F0EC` (warm off-white, not pure white) — full opacity for headings/active copy.
- **Muted Text** — `text-primary` at 40–70% opacity for supporting copy, inactive project numbers, dividers (`border-primary/12`).

### Functional States
- No distinct success/error/warning palette exists yet; focus-visible state reuses Acid Yellow as a 2px outline.

## 3. Typography Rules

### Hierarchy & Weights
Two parallel font stacks, chosen per script rather than one stack reused:
- **Latin:** Geist Sans (headings/body), Geist Mono (unused in Home currently).
- **Traditional Chinese (`:lang(zh-Hant)`):** Noto Sans TC, cascading automatically — no JSX branching needed.

A six-tier semantic scale exists in `app/globals.css` (Display, Heading XL,
Heading, Body Large, Body, Meta/Label), each with an independent Chinese
variant rather than reusing Latin metrics:
- `.type-display-zh` (Hero H1): 2.45rem → 5.7rem across breakpoints, weight 500, tight leading (1.08), near-zero tracking (-0.01em) — deliberately looser than the Latin display tier, which uses -0.035em.
- `.type-body-zh` (Hero support copy): 16px → 20px, weight 400, 1.75rem leading.
- `.type-body-lg-zh` (Selected Work Chinese title): 1.1rem/1.75rem, **positive** tracking (0.12em) — CJK titles here are deliberately loosened, opposite of the Latin convention.
- `.type-meta` (eyebrow/nav/tags): 12px, uppercase, 0.18em tracking (Latin only — the CJK meta variant drops uppercase/tracking since those transforms are meaningless/harmful on CJK glyphs).

### Spacing Principles
CJK body text always gets more generous line-height than its Latin
counterpart at the same tier, and tracking direction actually flips (Latin
tightens on display type, Chinese titles loosen) — an intentional,
already-validated per-script divergence worth carrying into V2 rather than
treating type as script-agnostic.

## 4. Component Stylings

### Buttons / Interactive Controls
No pill/rounded buttons in Home; interactive text (SCROLL control, project
selectors) uses uppercase micro-label styling with a translateY(-2px) hover
lift and 200ms editorial-ease color/transform transition. Nav is the one
place rounded corners are sanctioned (subtle iOS-style frosted glass).

### Cards / Containers
Main content and the Selected Work media frame use **sharp corners**
throughout — `border border-primary/12` hairlines, no shadow, no radius.
Max content width: 1600px.

### Navigation
Sticky on desktop and mobile, frosted-glass treatment, rounded (the one
exception to the sharp-corner rule).

### Domain-Specific: Selected Work Pinned Reel (KEEP as interaction foundation)
This is the component most relevant to Home V2. Current implementation
(`SelectedWork.tsx` + `useSelectedWorkSequence.ts`):
- A single sticky viewport (`position: sticky; top: 0`) pins over a tall
  scroll track built from stacked "step" divs (one per project, `min-height:
  55dvh` each) inside a CSS Grid `grid-area: 1 / 1` overlap trick.
- One GSAP timeline (`scrub: 0.55`, `ease: none`) is driven by a single
  ScrollTrigger spanning the whole track. Progress through the timeline maps
  1:1 to scroll position — fully scrubbable, fully reversible on scroll-up.
- **Image layer transition per step:** outgoing image exits `yPercent: -100`
  while fading to `opacity: 0.7`; incoming image enters from `yPercent: 100,
  opacity: 0.7, scale: 1.01` settling to `yPercent: 0, opacity: 1, scale: 1`
  — a vertical slide-and-settle, not a crossfade, with a subtle scale-in on
  arrival (1.01 → 1). z-index stacks incrementally so each new image lands
  on top.
- **Text choreography is staggered by part**, not as one block: meta label
  exits first (y:-12, 0.14s) → title (y:-32, 0.18s) → tags (y:-11, 0.14s) →
  description (y:-14, 0.16s) → CTA (y:-10, 0.12s), each offset by ~0.03s from
  the previous, all `power1.inOut`/`power1.out`. Incoming text mirrors this
  in reverse offsets, starting mid-way through the outgoing exit (~0.43 of
  the per-project interval) so in/out overlap rather than sequence cleanly.
- A row of plain project-number buttons (`01 02 03 04`) below sits outside
  the pinned frame; the active number turns Acid Yellow, others sit at 50%
  opacity. Clicking one scrolls the track to center that project's step.
- Mobile (below 1024px, or reduced-motion): the whole mechanic is disabled
  via `gsap.matchMedia`; falls back to a plain active/inactive panel swap
  with opacity-only crossfade, no pin, no scrub.

### Inputs & Forms
None present on Home.

## 5. Layout Principles

### Grid & Structure
- Max width 1600px, `px-6 sm:px-8 lg:px-10` edge padding.
- Selected Work desktop grid: `minmax(0,38fr)_minmax(0,62fr)` text/media split.

### Whitespace Strategy
Generous vertical rhythm (`py-16`/`py-20`/`pb-[80px]`), hairline dividers at
12% opacity rather than solid rules or shadows to separate zones.

### Alignment & Visual Balance
Hero is bottom/left-anchored within a near-full-viewport sticky block
(`min-h-[calc(100vh-72px)]`), text sitting low against a large empty upper
field — this "reserved upper zone" is the existing precedent for holding
space for a future spatial object, though currently nothing occupies it.

### Responsive Behavior & Touch
Desktop-only complex motion, gated by both a `min-width: 1024px` breakpoint
and `prefers-reduced-motion: no-preference` — mobile always gets the
simplified, non-pinned fallback already, never a scaled-down version of the
desktop mechanic. This precedent directly supports V2's requirement for an
intentionally distinct mobile presentation model rather than a shrunk desktop
one.

## 6. Design System Notes for Stitch Generation

### Language to Use
"Void black ground, warm off-white text, one acid-yellow accent used like a
spotlight, sharp editorial corners, hairline dividers, no shadows, no
gradients." This is the current single-mode baseline — Home V2 is explicitly
exploring departure into multi-scene light/dark contrast, so use this
language to describe the *opening/closing* scene register, not the whole
page.

### Color References
- Void Black `#111111` (dominant ground, current default)
- Card Surface `#171717`
- Warm Off-White `#F2F0EC` (primary text)
- Pale Signal Lavender `#B9A7FF` (identity/label accent)
- Acid Yellow `#E7F34B` (spotlight/emphasis accent)

### Component Prompts (current-state, for reference)
- "A full-bleed sticky project stage: one large sharp-cornered media frame on
  the right ~62% of a 1600px container, a text column on the left ~38%,
  where the image slides in vertically from below with a slight scale
  settle while the outgoing image slides up and dims, and title/meta/tag/CTA
  text staggers out and in with small vertical offsets, not a simple
  crossfade."
- "A bottom-anchored hero on a void-black field: a two-line Chinese display
  headline in warm off-white with two words picked out in acid yellow, an
  uppercase lavender-and-yellow eyebrow above it, generous empty space above
  the headline currently unused."

### Incremental Iteration
Treat this document as the *floor*, not the ceiling: preserve the per-script
typography divergence, the sharp-corner/no-shadow discipline, and the
pinned-scrub interaction logic as reusable mechanics — but the single-mode
dark palette, the empty reserved zone, and the plain 01-04 number row are
all explicitly open for reinvention in Home V2.
