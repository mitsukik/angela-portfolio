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

## Skill Routing

This section governs which tool handles which kind of work. It supplements, and does not override, the Design Direction and Preference Boundaries above.

### Design authority for this project

`design-director/SKILL.md` is the standing design authority for this Portfolio — discover, Angela reacts, refine, Angela approves, implement, critique, polish, lock.

**Design-director is required only when a task needs a NEW visual/design decision.** If the visual direction is already approved and the task is straightforward implementation, use the appropriate implementation skill directly — do not restart the Discover → React → Refine → Approve loop. This includes:
- implementing an already-defined component
- wiring an existing pattern
- responsive adaptation of an approved design
- React refactoring
- performance work
- implementing approved motion

Design-director exists for design governance, not to add approval overhead to every coding task.

The generic stack skills below are **tools design-director may reach for during Discover or Fresh Critic**, never independent competing directors:

- `design-taste-frontend` — generates aligned or boundary-expanding portfolio/landing page directions to react to
- `frontend-design` — generates options for a single component/element treatment
- `bencium-impact-designer` — generates a bold/high-risk option specifically when Angela wants one (the "boundary-expanding direction" Discover mentions)
- `ui-ux-pro-max` — reference and recommendation layer; never has final visual authority. May recommend palettes, typography pairings, layout patterns, UX patterns, interaction guidance, motion rules, and accessibility/design references — but these recommendations do not override project preferences, design-director governance, or Angela's approval.

**Never auto-stack** more than one of `design-taste-frontend` / `frontend-design` / `bencium-impact-designer` as simultaneous "primary" for the same option — design-director requests them one at a time, by name, for a specific purpose in its Discover step.

`impeccable` may be discoverable in multiple environments, but this Portfolio routes the pre-launch impeccable pass to Claude only (see CLAUDE.md) — a whole-site, cross-page coherence pass used once near pre-launch, not a per-task director.

### Other axes (may run alongside design authority, not instead of it)

- **React architecture** (`composition-patterns`) and **React performance** (`react-best-practices`) operate on a different axis than visual direction — they may run alongside whatever design-director has approved, never in place of it.
- **Motion judgment** (`animate`, `emil-design-eng`) must honor the Motion policy above (selective, purposeful, quiet sections balance loud ones, simpler on mobile, respects reduced-motion) before any GSAP implementation begins.
- **GSAP implementation** (`gsap-react`, `gsap-scrolltrigger`) and **GSAP performance** (`gsap-performance`) follow motion judgment; they don't set the motion decision themselves.
- **Audit and accessibility skills** (`improve-ui`, `web-design-guidelines`, accessibility tooling, typography) each evaluate a different quality axis. Do not run them simultaneously as one blended audit. They may and often should run sequentially — for example: improve-ui → accessibility → web-design-guidelines → typography — because each checks something the others don't. Audits normally run after implementation, as a separate pass, not simultaneously with generation.
- **Accessibility** is an independent, final-quality axis, checked after visual/implementation work. Accessibility tooling may be discoverable in Codex, but the current Portfolio routing reserves the AccessLint accessibility pass for Claude unless this policy is explicitly changed. Codex should not substitute or invoke an unrouted accessibility tool automatically.
- **Typography correctness** is mechanical and separate from the type *pairing* decision, which belongs to design-director. Typography tooling may be discoverable in Codex, but the current Portfolio routing reserves the dedicated typography enforcement pass for Claude unless this policy is explicitly changed. Codex may use `ui-ux-pro-max` typography guidance as reference within its approved route.

### Task routing

| Task | Primary | Notes |
|---|---|---|
| New page | design-director | new visual decision — consults design-taste-frontend + ui-ux-pro-max during Discover |
| Redesign | design-director | new visual decision — same loop; do not skip Angela's approval step |
| Component | design-director only if the look is undecided → composition-patterns for structure | if an approved direction already covers this component's look, skip straight to composition-patterns — no new visual decision needed |
| React refactor | composition-patterns | straightforward implementation — no design-director loop needed; add react-best-practices too if performance is also in scope |
| Performance | react-best-practices | straightforward implementation — no design-director loop needed |
| Responsive | whichever direction is already approved | straightforward implementation of an approved design — no design-director loop needed; check against the Responsive Design policy above |
| Motion (subtle) | animate / emil-design-eng | if implementing already-approved motion, no design-director loop needed; must honor the Motion policy above |
| GSAP (complex) | gsap-scrolltrigger + gsap-performance | motion judgment first, per above |
| Audit | improve-ui | web-design-guidelines for a compliance-checklist pass; run sequentially, not blended, with other audits |
| Accessibility | Claude: accesslint plugin (see CLAUDE.md). Codex: reserved for Claude by policy, not by technical availability — do not substitute | independent axis; sequential with other audits, never blended |
| Typography | Claude: typography plugin (see CLAUDE.md). Codex: reserved for Claude by policy — ui-ux-pro-max reference only within approved route | correctness only, not pairing/taste |
| Design system | `.stitch/DESIGN.md` already exists via design-md (Stitch); extract-design-md for a code-evidence doc reflecting shipped implementation | `.stitch/DESIGN.md` is explicitly historical/input-only, not a constraint |
| Figma | figma-use, then figma-generate-design only for the code→Figma direction | — |
| Pre-launch | Claude: full sequence in CLAUDE.md. Codex: improve-ui + web-design-guidelines only | sequential, never simultaneous |

### Note on ui-skills-root

`ui-skills-root`'s own CLI-based routing applies only within its own family (`create-design-md`, `improve-ui`). For this project, the Skill Routing section above takes precedence for every other task type, and its `npx ui-skills get <slug>` command should not be invoked — it would fetch an unaudited skill from the public registry mid-task.
