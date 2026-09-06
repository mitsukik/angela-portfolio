<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Angela Yu Portfolio

## Project

Personal portfolio website for Angela Yu, Product Designer based in Taiwan.

Tech stack:
- Next.js
- React
- TypeScript
- Tailwind CSS

## Design Direction

Dark Editorial + Playful Experimental Interaction + Selective Discovery.

Maintain a refined dark editorial foundation with strong typography, generous negative space, and clear hierarchy.

The portfolio should not feel overly formal, corporate, sterile, or template-like.

Personality should emerge through selective interaction, experimental motion, and small unexpected moments of discovery without weakening readability, usability, accessibility, or professional credibility.

Dark mode is a confirmed preferred foundation. It should not be interpreted as cyberpunk aesthetics, generic AI aesthetics, neon overload, excessive glassmorphism, or unnecessary gradients. Gradients are not categorically banned; avoid gradients that are unnecessary or lack a clear identity and purpose.

MINIMAL BUT NOT EMPTY.

EXPRESSIVE BUT NOT CHAOTIC.

Playfulness does not mean:
- childish
- cute by default
- colorful everywhere
- bouncy animation everywhere
- novelty over usability

The preferred interpretation is closer to:

REFINED + INTERACTIVE + UNEXPECTED.

As a conceptual heuristic, aim for roughly 70% polished/editorial, 20% interactive personality, and 10% surprise. This is not a measurable design-system rule and must not be used mechanically to justify adding effects.

The site should feel:
- minimal
- editorial
- sophisticated
- modern
- product-design focused
- visually strong without looking over-designed

Avoid:
- generic SaaS aesthetics
- excessive cards
- glassmorphism across the whole site
- unnecessary or identity-less gradients
- decorative blobs
- heavy shadows
- unnecessary animation

## Preference Boundaries

REFERENCE ≠ PREFERENCE ≠ PROJECT DNA ≠ REUSABLE PATTERN

For design exploration, visual direction, reference evaluation, preference reasoning, or design critique, consult `design-director/SKILL.md`. Keep its collaboration and evidence records separate from these Portfolio build rules; it does not authorize redesign or implementation without Angela's approval.

A reference is evidence, not an automatic preference. Keep these categories separate:

REFERENCE OBSERVATION
What the referenced site does.

PROJECT DNA
Visual decisions appropriate to a specific project or brand.

ANGELA PREFERENCE
A cross-context personal design preference.

REUSABLE PATTERN
A design or interaction idea that may be adapted elsewhere.

Promote something into a stable Angela preference only when Angela explicitly confirms it, or repeated positive evidence appears across independent contexts and is subsequently validated. Do not infer permanent preferences from a single project.

Historical traits such as exact palettes, industry imagery, font combinations, geometric decoration, retro-digital styling, button shapes, corner radii, shadow treatments, immersive footer scenes, or bilingual eyebrow labels may remain valid project or reference observations, but are not Angela-wide defaults without further validation.

## Colors

Background:
#111111

Primary text:
#F2F0EC

Purple:
#B9A7FF

Acid yellow:
#E7F34B

## Visual Rules

Main content areas, project images, and editorial sections should generally use sharp corners.

Rounded corners are acceptable for interactive navigation elements.

The navigation may use subtle iOS-style frosted glass.

## Homepage Structure

Current homepage:

1. Header
2. Hero
3. Selected Work
4. Footer / Contact

Do not add unnecessary homepage sections unless explicitly requested.

## Hero

The Hero design is approved.

Main headline:

將複雜的系統，
設計得清晰而直覺。

複雜 and 直覺 use acid yellow.

Eyebrow:

Product Designer | Based In Taiwan

Product Designer uses purple.
Based In Taiwan uses acid yellow.

Do not redesign the Hero unless explicitly requested.

## Selected Work

There are four projects:

01 Complex System
02 Corporate Website
03 IoT System
04 Consumer Product

Project data should remain data-driven.

The homepage project presentation should remain editorial and minimal.

## Responsive Design

Desktop, tablet, and mobile must all work well.

Do not simply shrink the desktop layout for mobile.

Mobile layouts should be intentionally composed for smaller screens.

## Navigation

Desktop and mobile navigation are sticky.

The navigation uses a subtle frosted-glass treatment.

Mobile navigation:
- expandable
- floating overlay
- must not push page content downward
- animated with subtle vertical movement and opacity
- chevron rotates when toggled
- expanded state does not show the word CLOSE

## Motion

Use selective, purposeful motion with clear hierarchy.

Major interaction moments should be balanced by intentionally quiet sections.

Motion may support:
- hierarchy
- storytelling
- navigation
- spatial understanding
- feedback
- personality
- discovery

Do not animate every section. Do not add effects solely for novelty. Do not interpret Angela's preference as "likes lots of animation."

Mobile motion should be simpler than desktop.

Respect prefers-reduced-motion.

## Professional Content, Expressive Shell

Angela's portfolio may present serious Product Design work such as complex systems, B2B workflows, enterprise products, IoT systems, and state-driven interfaces.

The website itself does not need to visually imitate enterprise software to demonstrate that capability. Case Study content demonstrates rigor.

The surrounding portfolio experience may demonstrate:
- visual taste
- interaction thinking
- experimentation
- frontend awareness
- personality

Case Studies should still prioritize comprehension, storytelling, readability, and accessibility.

## Approved Project Decisions

Preserve all currently approved portfolio decisions as project-specific decisions. This includes the current palette and lavender/acid-yellow accents, Hero decisions, navigation implementation, section structure, approved card interactions, current typography system, and current motion implementations.

This calibration does not invalidate or redesign those decisions.

## Working Rules

- Preserve approved design decisions.
- Make scoped changes.
- Do not redesign unrelated sections.
- Do not change typography, colors, or layout without a clear reason.
- Prefer reusable components and clean data structures.
- Keep responsive behavior intact.
- Explain significant structural changes before implementing them.
- Do not add dependencies unless they are genuinely necessary.
