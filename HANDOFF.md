# CURRENT STATE

- Branch: `fix/case01-decision-03-pricing`. **Branch-ancestry note:** intended to branch from `fix/case01-responsive-qa` (`f0d57e9`), but `git checkout` refused because the pre-existing unrelated uncommitted files below conflict across branches, and `git stash` was unavailable in this session — so this branch was actually cut from the current tip of `fix/homepage-hero-balance-v3-2` (commit `bb99abc`) instead. Verified before proceeding: every CASE01 file (including `CaseOneFinalContent.tsx`) is byte-identical between that commit and `fix/case01-responsive-qa`, so no Homepage content leaked into this work — but the branch's git ancestry does include the Homepage V3/V3.1/V3.2 commits. Rebase onto `fix/case01-responsive-qa` before merging if a clean CASE01-only history is wanted.
- Foundation tag: `v3-design-system-foundation`.
- Current task: none. CASE01 Decision 03 — Pricing Placeholder Replacement (below) is implementation-complete, validated, and checkpointed. Angela reviews visually before merge.
- Note: this branch also carries pre-existing unrelated uncommitted work (`SiteHeader.tsx`'s Round-11 bilingual nav changes, `case-final-02/03/04` + `en/design-samples/case-final-01..04` bilingual routes, `AGENTS.md`/`CLAUDE.md` governance edits, most of `globals.css`, and Homepage's `Hero.tsx` history) — untouched and left exactly as found. `ReadingSection.tsx` also still carries one unstaged, unscoped hunk (`mt-6`→`mt-10` Section Title→Content spacing change, affects all four cases, no task record) — deliberately left out of scope. `artifacts/case01-final-real-evidence-fullpage.png` and `artifacts/case01-real-evidence-pass-fullpage.png` remain untracked from an earlier pass — not staged by this checkpoint.

# LATEST COMPLETION — CASE01 DECISION 03 PRICING EVIDENCE

Replaced Decision 03's `Slot` placeholder ("REAL UI EVIDENCE NEEDED") with real, sanitized product UI. Chinese CASE01 only — English version, other decisions, other evidence sections, and CASE01's frozen structure/content/caption were not touched.

## SOURCES

- Primary: `1-2 供貨商 -  商品管理.pdf` (`~/Downloads/媒合銷售平台系統後台 - 第一階段/`) — the Product "Price" tab, showing Unit Cost, Suggested Retail Price (SRP), Estimated Profit, and Pricing Adjustment Record. This is a single giant 15669×13063px vector canvas (one Figma page exported to PDF); located the correct frame via a downscaled overview render, then re-rendered just that region at 4x native scale using a small Quartz/CoreGraphics script (`CGContextDrawPDFPage` restricted to a target CGRect) — full-page rasterization at native resolution wasn't practical (205MP).
- Secondary: `媒合銷售平台系統後台 - 第一階段.pdf` (same Downloads folder) — an even larger 56182×86129px (~4.8B px) canvas. Located the "Price & Inventory" → invalid-state frame (profit-pool-negative validation) via a QuickLook thumbnail overview (`qlmanage -t`, efficient enough to avoid full rasterization), then rendered just that frame with the same targeted Quartz approach.
- Both source PDFs confirmed accessible; no substitution was needed.

## SANITIZATION

Redaction bars (solid, not blur) placed via pixel-precise bounding boxes from macOS's on-device Vision OCR (`VNRecognizeTextRequest` + `boundingBoxForRange:` for sub-string ranges) — not eyeballed; a first hand-estimated attempt landed on the wrong lines and was redone this way.

- **Primary (Pricing Adjustment Record table):** the 3 sample data rows (Unit Cost/Retail Price/Profit/Qty Sold/Sales Period/Sales Days/Last update values) are fully redacted. Column headers stay visible. The `USD$0.00` values in the Unit Cost/SRP/Estimated Profit calculator above are untouched — they're empty-state placeholders, not real data.
- **Secondary (invalid-state panel):** redacted every formula constant — cost multiplier (1.15X), suggested-price multiplier (3.15X), price-float percentage (80%), tax rate (8%), corporate-tax multiplier (0.0255X), and the two revenue-split percentages (31% / 69%) — plus the specific computed warning figure (-92.73). The warning's structural message ("利潤池 [redacted] < 0，該方案不可用") stays fully legible, and every `USD$0.00` placeholder is untouched, so the invalid-state logic is still completely clear.

## LAYOUT

New wrapper `<div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-8">` inside the existing `DecisionMedia`, reusing the exact `lg:grid lg:grid-cols-12` + `lg:col-span-N` grammar already established in this file's "10 — FINAL PRODUCT" section (no new layout system). Primary evidence `lg:col-span-8` (66.7%, within the requested 65–70%), secondary `lg:col-span-4` (33.3%, within 30–35%). `<InspectableEvidence>` for the primary (dense small-text UI — same component already used for Order Management/Supplier Dashboard, so it never gets forced below a readable size) and plain `<Evidence>` for the secondary (a portrait crop that needs to show its full height, not `object-cover`). Below `lg:`, both stack full-width in document order with a manual `mt-8`/`lg:mt-0` on the second one (the wrapper isn't a flex/grid container below `lg:`, so it doesn't inherit `DecisionMedia`'s own `space-y-8`).

New figure numbers `FIG. 06a` / `FIG. 06b` (not `07`/`08`/`09` — those are already used later in the same file for Decision 04's evidence; renumbering them would have touched an unrelated section). The existing `FIG. 06` sanitized Pricing & Revenue Logic diagram is unchanged, still the first item in this decision's evidence.

Removed the now-orphaned `Slot` function (its only caller was the placeholder this pass replaces) — left it in first and confirmed via `tsc`/`eslint` that removing it was safe (no other consumers) rather than leaving dead code with a lint warning.

## VALIDATION

- `tsc --noEmit`, `eslint` on the touched file, `npm run build`: all clean, 26 routes.
- Live-browser check (Chromium via Playwright) on `/design-samples/case-final-01`: zero console/page errors while scrolling through and past Decision 03. Caption verified byte-exact: "Give users flexibility without breaking the business model." — unchanged, since it's the existing `DecisionMedia principle` prop and this pass never touched it.
- Visual confirmation: primary evidence clearly shows Unit Cost / SRP / Estimated Profit / Pricing Adjustment Record; secondary clearly shows the invalid-pricing-state warning; measured column split ≈65.8% / 31.6% in the rendered page, matching the target; no layout break, no collision with surrounding sections.
- Full-page screenshot saved to `artifacts/case01-decision03-pricing-fullpage.png` (1440×18424).

## FILES

- `components/design-samples/case-final/CaseOneFinalContent.tsx` — Decision 03 media swap + `Slot` removal.
- `public/images/case01/evidence/case01-pricing-detail.png` (new) — primary evidence.
- `public/images/case01/evidence/case01-pricing-invalid-state.png` (new) — secondary evidence.
- `artifacts/case01-decision03-pricing-fullpage.png` (new) — review screenshot.

# NEXT ACTION

- Angela reviews the Decision 03 pricing evidence on `fix/case01-decision-03-pricing` before merge. English CASE01 intentionally not started.

---

# PRIOR COMPLETION (unrelated, still valid) — HOMEPAGE HERO FINAL RESPONSIVE BALANCE V3.2

Two targeted fixes to `components/home/Hero.tsx`'s `≥1024px` composition. Only 3 utility-class strings touched (6 lines); Mobile (<768) and the 768–1023 tablet range are untouched — every changed property was already `lg:`-scoped.

**1024×1366 tall-portrait tablet:** V3.1's `lg:` overrides (`items-end`, `pb-12`, `col-span-7/5`) applied at any width ≥1024 regardless of aspect ratio, so a tall portrait tablet at exactly 1024px width got Desktop's bottom-anchored treatment — same bug V3.1 fixed for 820×1180, recurring one breakpoint tier up. Fixed by rescoping those four `lg:` overrides to `lg:landscape:` (Tailwind's built-in `orientation: landscape` variant, stacked with the existing `lg:` breakpoint — no new breakpoint system, no device sniffing). Since `md:items-center`/`md:pb-16`/`md:col-span-6` are already the tablet-style base applying at 768px+, and `lg:landscape:` only overrides them when width ≥1024 **and** landscape, a tall-portrait 1024px-wide viewport now falls through and correctly keeps the tablet balance — no cascade-order risk, since `md:` (lower breakpoint tier) vs `lg:landscape:` (higher tier) is a standard, guaranteed-correct Tailwind sort, unlike stacking two competing rules at the same `lg:` tier would have been.

**1920×1080 (and all desktop-landscape) too bottom-heavy:** the shared bottom padding for the `lg:landscape:` (true desktop) bucket increased from a flat `pb-12` (48px, non-scaling) to `pb-[15vh]` (viewport-relative). Because both the text column and the plane column share the same `items-end`-aligned row, this lifts them together in one coordinated move — plane position rises with the text, no separate adjustment needed. Measured delta: +87px at 900px-tall viewports (1024×900, 1440×900) and +114px at 1920×1080 — 9.7% and 10.6% of viewport height respectively, both inside the requested 8–12% range. Bottom-anchoring (`items-end`) is preserved, not centered — still reads as the same cinematic, bottom-weighted Desktop identity, just with less dead space above it and a real mid-viewport anchor.

**Validation:** `tsc`/`eslint`/`build` clean. Regression matrix (390 / 768 / 820 / 1023 / 1024×1366 / 1024×900 / 1440 / 1920 × zh/en): zero overflow, zero console errors. Hero→Selected Work boundary re-measured with zero collision at every width, and every scroll-track height matches the unchanged `130svh`/`170svh` formula exactly (e.g. 1920×1080 → 1836px = 1080×1.7), confirming scroll architecture untouched. Zero dead-opacity windows and reduced-motion clean at both new breakpoints tested (1024×1366, 1920×1080). Mobile (390×844) and 820×1180 tablet re-measured pixel-identical (within 1px rounding) to their pre-this-task V3.1 state — confirmed unchanged, not just visually similar. Selected Work, About, and CASE01 were not touched by this pass (only `Hero.tsx` was edited).

---

# PRIOR COMPLETION (unrelated, still valid) — HOMEPAGE TABLET HERO POLISH V3.1

Tablet-only (768–1023px) rebalance of `components/home/Hero.tsx`'s first-viewport composition. Mobile (<768) and Desktop (≥1024) are provably unchanged: every touched property was already `md:`-scoped (applying 768px+), so each new tablet value got a matching `lg:` override restoring the exact prior value at 1024px+, and mobile's unprefixed base classes were never touched.

**Root cause (measured at 820×1180):** the shared `md:items-end` (bottom-anchoring, correct for desktop's wide/short aspect) left 752px of dead space above the content and pinned the CTA row 9px below the fold on a tablet's taller portrait aspect. The grid visual was also capped by its 5/12 column share, rendering at only 285×380 relative to the text column's 415px width.

**Fix (4 properties, all `md:` tablet value + `lg:` desktop-restore pair):**
- Alignment: `md:items-center` (was shared `items-end`) / `lg:items-end` restores desktop.
- Bottom padding: `md:pb-16` (was shared `pb-12`, gives the scroll cue more clearance) / `lg:pb-12` restores desktop.
- Text column: `md:col-span-6` (was shared `col-span-7`) / `lg:col-span-7` restores desktop.
- Plane column: `md:col-span-6` (was shared `col-span-5`, more grid presence) / `lg:col-span-5` restores desktop.

**Result (measured, 820×1180):** eyebrow now at 434px (was 832px — 398px sooner), plane grew to 350×462 (was 285×380), CTA now ends at 819px with 361px comfortable clearance (was 9px below the fold). Verified visually at 768×1024, 820×1180, and both sides of the 1024 boundary — composition holds across the whole tablet range, not just one device size. Both locales checked.

**Validation:** `tsc`/`eslint`/`build` clean. Regression matrix (390/768/820/1023/1024/1440 × zh/en): zero overflow, zero console errors. Hero→Selected Work boundary measured identical at every width (no collision, scroll-track height untouched). Zero dead-opacity windows across a tablet-width scroll sweep. Reduced-motion clean at tablet. Mobile (390×844) and Desktop (1440×900) geometry re-measured and confirmed byte-identical to the pre-this-task V3 state.

---

# PRIOR COMPLETION (unrelated, still valid) — HOMEPAGE VISUAL POLISH V3

## CHANGED

Four scoped mobile-only polish fixes plus one locale-correctness bug fix, all on top of the already-approved V1/V2 Homepage architecture — no scroll-architecture changes, no content rewrite, no project reordering.

## FILES TOUCHED

- `components/site/SiteHeader.tsx` — mobile header bar `h-16` → `h-14` (one Tailwind class, isolated hunk — see MOBILE HEADER DECISION). Desktop `md:h-20` untouched.
- `components/home/Hero.tsx` — mobile-only alignment and plane-visual sizing (see MOBILE HERO DECISION). Desktop explicitly preserved via added `md:items-end`.
- `components/home/SelectedWork/ProjectScene.tsx` — project-title `Head` block restructured to be locale-aware (see TITLE LOCALIZATION FIX).
- `app/globals.css` — one new rule, `.type-v3-section-heading:lang(zh-Hant)` (see LOCALE TYPOGRAPHY DECISIONS). Pure addition, isolated hunk.
- `HANDOFF.md` — this section.

All four source files had pre-existing, unrelated uncommitted work sitting in them from earlier sessions (`SiteHeader.tsx`'s Round-11 bilingual routing, `globals.css`'s Case Final/mobile-menu rules). Where my edit landed in the same hunk as that pre-existing work (`SiteHeader.tsx`'s header line), I hand-built an isolated patch against HEAD and staged it via `git apply --cached` rather than staging the whole hunk — same technique used for the CASE01/lavender checkpoints. `Hero.tsx` and `ProjectScene.tsx` had no pre-existing diff at all; staged whole. Verified via `git diff --cached --stat` (31 lines across 4 files) vs. the remaining unstaged diff (166 lines, all pre-existing/unrelated) before committing.

## MOBILE HEADER DECISION

Measured baseline: mobile header bar was exactly `h-16` (64px, the only sizing lever — no separate padding rule exists; `.header-surface` only sets colors). Reduced to `h-14` (56px). The `.menu-trigger` hamburger button stays `h-11 w-11` (44×44, WCAG-safe tap target) — verified via live measurement it still sits centered with 6px clearance top/bottom, not cramped. `.mobile-menu` dropdown (`top: 100%`, relative) automatically tracks the new shorter header with no separate fix needed — verified flush (`headerBottom === menuTop`) after the change. Desktop `md:h-20` (80px) untouched.

## MOBILE HERO DECISION

Root cause (measured, not assumed): the text column used unconditional `items-end` (bottom-anchored, no `md:` override), so identity content (eyebrow → ANGELA YU → copy → CTA) was pinned to the very bottom of the 100svh first viewport regardless of what sat above it. At baseline 390×844, this meant: a 73px dead gap between the grid visual's bottom edge (464px) and the eyebrow's top (537px), and the CTA row's bottom edge landing at 869px — 25px **below the fold**, clipped on first paint.

Fix, mobile-only (`items-center` added, desktop explicitly re-asserted via new `md:items-end` so desktop composition is provably unchanged): the identity content now centers within the first viewport instead of hugging its bottom edge. The grid visual (`hero-plane-wrap`) is shrunk on mobile only (`top-24 h-[36vh]` → `top-10 h-[16vh]`; desktop's `md:relative md:h-auto` already overrode both, so this has zero desktop effect) so it no longer competes for the same vertical space as the now-centered text — first attempt at `top-14 h-[24vh]` still overlapped the eyebrow by 23px (measured), corrected to `top-10 h-[16vh]` which clears it with 61px of clean margin.

Result (measured, 390×844): eyebrow now starts at 292px (was 537px — enters 245px sooner), CTA row now ends at 624px, fully inside the fold (was 869px, clipped). Grid visual is retained as a clearly legible, intentional band, not removed. Verified visually via screenshot at 390×844, 430×932, and desktop 1440×900 (desktop screenshot confirms zero visual change there).

## LOCALE TYPOGRAPHY DECISIONS

Added `.type-v3-section-heading:lang(zh-Hant) { font-weight: 500; letter-spacing: 0.04em; }` in `app/globals.css`, immediately after the existing `.type-v3-section-heading` rule it extends (base weight 600, tracking 0) — follows the same `:lang(zh-Hant)`-scoped-override pattern already established elsewhere in this file (`.type-step-title:lang(zh-Hant)`, `.scene-light .text-lavender`). `.type-v3-section-heading` currently has exactly one consumer (Selected Work's project title `h3`), so this is the shared project-title style already, not a new local class — no per-project special-casing. Scoping is CSS-native (`:lang()`), so an English title rendered through the same class is structurally unaffected — verified live: zh route computed `font-weight: 500, letter-spacing: 1.12px` (0.04em of the section-heading's clamp size); en route computed `font-weight: 600, letter-spacing: normal` on the same class, unchanged from baseline. 0.04em was used as-given; visual check across all four Chinese titles (2–10 characters) didn't show it as too tight or too loose, so no adjustment was needed.

## TITLE LOCALIZATION FIX

Confirmed bug: `ProjectScene.tsx`'s `Head` block rendered `project.chineseTitle` in the big heading unconditionally, regardless of `locale` — the English route showed a Chinese title under an English eyebrow. Root cause was a rendering gap, not missing data: `data/projects.ts`'s `Project` type already has both `title` (English) and `chineseTitle` for all four projects (verified: Complex System / Corporate Website / IoT System / Consumer Product — none missing), so no translation was invented.

Fix: the big heading now renders `locale === "zh" ? project.chineseTitle : project.title`; the small caption below it renders whichever of the two the heading isn't showing (`{title} · {year}` on zh, `{chineseTitle} · {year}` on en) — same bilingual-pairing convention already used elsewhere on the site (e.g. Case Opening's "01 / COMPLEX SYSTEM"), not new content. `lang` moved from an inner `<span>` onto the `h3` itself (required for the new `:lang(zh-Hant)` CSS rule to match at all — `:lang()` doesn't propagate up from a child). `MixedText` (isolates embedded Latin/numeric runs into the correct font) now wraps `chineseTitle` wherever it renders — heading or caption — matching project 03's "IoT 系統與數據儀表板", which has an embedded Latin run either way.

Verified live on all 4 projects × both locales (8 checks): zh route → Chinese heading (weight 500) + English caption; en route → English heading (weight 600, unaffected) + Chinese caption. Zero console errors.

## MEDIA ROW VISUAL CHECK

Visually inspected all four projects' mobile media rows (measured heights: Project 01 hits the `9rem`/144px floor exactly — its text column is the longest, 3-column metadata wraps to 4 lines; Projects 02–04 get 206–229px since their text is shorter). Project 01's image (laptop/dashboard photo) is a tight letterbox crop but stays clearly legible — the dashboard content and "01" marker are readable, not compressed into illegibility. Projects 02–04 have comfortable proportions. **Verdict: no change made to the 9rem floor** — it produces a tight-but-functional result for the one project that hits it, not a real problem, so per the task's own instruction ("only adjust if visual evidence shows a real problem") it was left as-is.

## VALIDATION

- `npx tsc --noEmit`: pass. `eslint` on all 4 touched source files: pass. `npm run build`: pass, 26 routes (unchanged).
- Live-browser checks (Playwright/Chromium) at 390×844, 430×932 (mobile), 1440×900 (desktop), both `/` and `/en`:
  - No horizontal overflow at any of the 6 combinations.
  - Zero console/page errors across all checks, including a `prefers-reduced-motion: reduce` pass.
  - Full 61-step opacity sweep across the pinned Selected Work stage: zero dead-opacity windows (V1 dead-scroll fix and V2 mobile crossfade both intact).
  - Reverse scroll verified explicitly: forward to Project 04 (opacity 1) → back to Project 01 (opacity 1), correct article each time.
  - `SiteFooter` reveal verified at both mobile and desktop (opacity 1, visible) — V2's stale-ScrollTrigger fix intact.
  - Mobile menu: opens correctly, sits flush under the new shorter header, hamburger tap target still 44×44.
  - Project-selector nav buttons present and functional (4 found, matching 4 projects); underlying pinned-stage motion architecture unchanged by this pass (only `ProjectScene.tsx`'s title JSX was touched, not `SelectedWork.tsx`'s scroll/selector logic).
- Isolated-commit build verification: attempted via disposable git worktree (same technique as the CASE01/lavender checkpoints) but Turbopack rejects any symlinked `node_modules` inside a git worktree outright (`Symlink [project]/node_modules is invalid, it points out of the filesystem root` — a Turbopack/worktree interaction issue, not specific to this diff; hit the identical error at two different filesystem locations). Fell back to manual hunk-isolation verification instead: confirmed each staged hunk's exact boundaries via `git diff`, confirmed `Hero.tsx`/`ProjectScene.tsx` have zero pre-existing diff to entangle with, and confirmed neither staged hunk in `SiteHeader.tsx`/`globals.css` depends on anything in the adjacent unstaged hunks (no shared identifiers, no new exports consumed).

## KNOWN ISSUES

- None found specific to this pass. The pre-existing unrelated uncommitted work noted above (SiteHeader bilingual routing, most of globals.css, governance docs, ReadingSection's spacing hunk) remains exactly as found — not evaluated or touched by this task.

## NEXT RECOMMENDED STAGE

- Angela reviews `fix/homepage-visual-polish-v3` visually (mobile 390/430, desktop 1440, both locales) before merge. Do not start a second Homepage polish pass without a specific issue from that review.

---

# PRIOR COMPLETION (unrelated, still valid) — APPROVED LAVENDER ACCENT TOKEN CHECKPOINT

- **Status: approved by Angela, checkpointed.** The root `--lavender` design token was updated from `oklch(0.78 0.11 300)` to `lab(73.0671% 21.3951 -34.7226)` — Angela's explicitly approved exact value. Site-wide scope: this is the one authoritative definition, consumed via `var(--lavender)` everywhere (Hero "YU", Selected Work lavender-accent projects, Case Final dark `--cf-accent-2`, and — once its own separate uncommitted hunk lands — Case/Selected Work light theme's shared accent). Never redefined per theme.
- **Files/hunks included:** `app/globals.css` — only the `:root` token-definition hunk (value + its explanatory comment). Verified isolated: it's the only edit in that hunk, and `--lavender` has exactly one definition site in the file (no dark/light redefinition to split). Every other `globals.css` hunk (cursor rule, CTA hover color, `.mobile-menu` redesign, `.cf-accent`/`.cf-opening-title`/`.cf-marquee-scale` Case Final rules) was left unstaged — those are separate, Case-Final-scoped consumer decisions, not the token itself.
- **Validation:** `tsc --noEmit` clean (CSS-only change); `eslint` not applicable to `.css`; `npm run build` succeeded (26 routes). Live-browser check (Playwright/Chromium): `--lavender` resolves correctly on `/`, `/about`, and `/design-samples/case-final-dark` (HTTP 200, no console errors, no horizontal overflow on any). Canvas pixel readback showed the old and new token values resolve to the **identical 8-bit sRGB pixel** (`rgb(194,167,244)`) — the change is a color-space respecification with no visible difference on standard (non-wide-gamut) displays, so this resolves the "known gap" flagged in the About V2 checkpoint below with no visual risk.

---

# PRIOR COMPLETION (unrelated, still valid) — ABOUT V2 APPROVED PRODUCTION CHECKPOINT

- **Status: approved by Angela, checkpointed.** Angela visually reviewed the About V2 production implementation (desktop + mobile, `/about` and `/en/about`) and approved it. This checkpoint commits that already-implemented, already-approved state — no design changes were made here.
- **Production routes active:** `app/about/page.tsx` and `app/en/about/page.tsx` now render `AboutV2` (`components/about-v2/AboutV2.tsx`) in place of the old `AboutSections`. Both routes confirmed live (HTTP 200) with header, footer, and content rendering correctly.
- **Files included:** `app/about/page.tsx`, `app/en/about/page.tsx` (production wiring), `components/about-v2/AboutV2.tsx`, `OpeningV2.tsx`, `HowIWorkV2.tsx`, `WhatIDoV2.tsx`, `SkillsV2.tsx`, `BeyondV2.tsx`, `data/about-v2.ts`, `app/design-samples/about-v2/page.tsx` (the isolated, noindex review prototype route Angela used to review it — kept alongside for reference, not linked from the live site).
- **Deliberately excluded — known gap, now RESOLVED:** `app/globals.css` was left entirely unstaged in this commit (no About-scoped hunks exist in it), but About V2's components consume `.text-lavender` / `var(--lavender)` directly and the root `--lavender` token was itself uncommitted at the time. That token is now checkpointed separately — see LATEST COMPLETION above — so a checkout of `f15026c`/`201d26d`/the lavender checkpoint together renders About's approved lavender shade correctly. (Turned out to be moot either way: the old and new token values resolve to the identical rendered sRGB pixel — see above.)
- `components/site/SiteHeader.tsx` was also left out — confirmed not required (its own code comment states Home/About behavior is unchanged by its pending edits).
- **Validation:** `tsc --noEmit` clean; `eslint` clean on all 9 files; `npm run build` succeeded (26 routes). Live-browser checks (Playwright/Chromium) on `/about` and `/en/about` at 1440×900 and 390×844: HTTP 200, no console/page errors, no horizontal overflow, header and footer both render. `prefers-reduced-motion: reduce` checked on `/about`: no errors; all three motion-bearing components (`OpeningV2`, `BeyondV2`, `HowIWorkV2`) gate via `gsap.matchMedia`/`window.matchMedia`.

---

# PRIOR COMPLETION (unrelated, still valid) — CASE01 RESPONSIVE QA & FINAL FREEZE

## CHANGED

Scoped, minimal fixes only — no content rewrite, no new sections, no new evidence, no storytelling change. Two typography-floor compliance fixes and one motion addition, both precisely scoped to CASE01 (`isCaseOneV2` / content only Case01 exercises) so Cases 02–04 are provably unaffected.

## FILES TOUCHED

- `components/design-samples/case-final/CaseStudyPrototype.tsx` — opening summary paragraph gets a distinct lead-tier size, gated to `isCaseOneV2`.
- `components/design-samples/case-final/ReadingSection.tsx` — `cf-summary-row` description text 15px → 16px.
- `components/design-samples/case-final/CaseOneFinalContent.tsx` — FIG.01 and FIG.04 switched from `Evidence` to the new `FlowEvidence`.
- `components/design-samples/case-final/FlowEvidence.tsx` (new) — directional entrance for the two flow/state diagrams.

## RESPONSIVE DECISIONS

- Full QA pass across Large Desktop (1920), Laptop (1440), Tablet (820), Mobile (390) found the existing responsive architecture (from the prior, uncommitted "CASE01 Real Evidence Placement Pass") already solid: `InspectableEvidence`/`TopCropEvidence`'s `overflow-x-auto` + fixed `min-w` pattern already implements the "horizontal masked viewport" rule 5 asks for — evidence text renders at a real, non-shrunk pixel size on mobile (confirmed: Order List statuses, Supplier Dashboard figures, filter labels all legible in close-up screenshots without any pinch-zoom-equivalent scaling), the user scrolls horizontally within the figure to see more columns rather than the whole page shrinking. No page-level horizontal overflow at any breakpoint (confirmed only the intentional per-figure inner scroll exists).
- Did **not** introduce a new heading-size tier split (Decision headings vs. Section headings, 20-24px vs 28-36px per the QA brief's floor values). `cf-h3` is used uniformly for both today (`clamp(1.85rem,3.6vw,3rem)` = 29.6-48px, already well above both floors) and was deliberately reviewed/tuned in an earlier round (see its own code comments). Splitting it into two visually distinct tiers now would be a hierarchy *redesign*, which conflicts directly with "Preserve the current CASE01 hierarchy... this is not a redesign pass." Documented here as an intentional non-change, not an oversight.
- Chapter register rail (numerals-only, left column) confirmed legible and non-overlapping at tablet (820px), where the two-column grid (`md:grid-cols-[3rem_minmax(0,1fr)]`) first activates.
- SiteFooter/Closing confirmed still reveals correctly on this route (no `SelectedWork`/`compact` dependency exists here, so the Homepage V2 stale-trigger class of bug doesn't apply to Case Final routes).

## EVIDENCE PRESENTATION DECISIONS

- **Order List / Order Management** (FIG.09, also reused in the Final Evidence section): kept at its existing `InspectableEvidence` treatment (native-resolution horizontal scroll, `aspect-[2048/1565]`) — table structure, filters, statuses, and row-action menu all confirmed legible at mobile without modification.
- **Streamer List + Expanded Filter**: kept as the existing context (FIG.02, clean cards, no tooltip) + detail (FIG.03, expanded filter, includes a real product tooltip) pairing — already satisfies "one context + one focused detail, not two near-identical screens." Considered re-cropping FIG.03 to avoid its open tooltip overlapping card content, but confirmed (via direct inspection of the source asset at native 2250×2950) that the tooltip is real, legitimate UX-detail evidence, not a capture artifact, and renders at the same legible relative scale on mobile as at laptop — left unchanged.
- **Checkout Out-of-stock**: kept at its existing `TopCropEvidence` portrait crop (`aspect-[6/7]`) — the backend-state → checkout-validation → consumer-feedback chain (error banner, disabled state, guidance) confirmed legible and undisturbed by any secondary evidence.
- **Supplier Dashboard**: kept at its existing `InspectableEvidence` treatment; confirmed legible (earnings, revenue chart, top-10 ranking chart with tooltip all readable) at `lg:col-span-8` desktop width and at mobile's native-scroll width — not reduced to thumbnail scale.
- **Inventory Status Flow / Shared Inventory UI**: kept as-is; confirmed legible at all four breakpoints.
- No screenshot was regenerated, re-cropped in a way that changes what portion of the source asset is used, or replaced. Only two typography values (see CHANGED) and one entrance-motion swap were touched.

## MOTION ADDED

- New `FlowEvidence` component: a one-time, left-to-right `clip-path` wipe reveal (`inset(0% 100% 0% 0%)` → `inset(0%)`, 0.85s, `power2.out`), applied only to FIG.01 (Cross-border Ecosystem — Section 8 bullet 1, "System Flow") and FIG.04 (Inventory Status Flow — bullet 2, "Inventory → Consumer State"). Reuses the exact technique `ShowcaseMedia.tsx` already established elsewhere in Case Final — no new animation mechanism introduced.
- Gated by `gsap.matchMedia("(prefers-reduced-motion: no-preference)")`: under reduced motion, no inline styles are ever applied and the figure is opacity:1/unclipped from first paint — verified directly (computed style stayed `opacity:1, clip-path:none` throughout).
- Every other evidence figure keeps its existing plain fade/translate via `EvidenceMotion` (Section 8 bullet 3) — unchanged, already present from the prior evidence-placement pass, confirmed still settling correctly (zero stuck-invisible figures after a full scroll-through, both motion preferences).
- No scroll-jacking, no parallax added, no per-card animation, no long delays — both new triggers are `once: true` and fire once per page load.

## VALIDATION

- `npx tsc --noEmit`: pass. `eslint` on all 4 touched files: pass. `npm run build`: pass, 26 routes (unchanged).
- Live-browser checks (Playwright + Chromium) at 1920×1080, 1440×900, 820×1180, 390×844:
  - No horizontal page overflow at any breakpoint (only the intentional inner-figure `overflow-x-auto` scroll exists).
  - No console errors in any pass.
  - Opening summary computed font-size: 17px (mobile) / 18px (`md:`+) for CASE01; confirmed Cases 02-04's opening summary unaffected (15.12px, unchanged, since `isCaseOneV2` is false there).
  - `cf-summary-row` description computed font-size: 16px (was 15px) for all 3 Challenge points; confirmed the `｜`-triggered code path this touches is exclusive to Case01's real content (Cases 02-04 use placeholder text with no such character — grep-verified).
  - `FlowEvidence` reveal verified mid-animation (partial `clip-path`, partial opacity right after scroll-into-view) and fully settled (`opacity:1`, `clip-path:none`) after its duration, under normal motion; verified permanently unclipped/opaque under reduced motion.
  - Full scroll-through (30 steps) under both motion preferences: zero stuck-invisible `[data-evidence-entrance]` figures.
- Manually inspected all 4 target breakpoints via full-page and targeted element screenshots (Order List, Supplier Dashboard, Streamer List/Filter, Checkout, both diagrams, opening, chapter register, final-evidence section, footer) — no heading collisions, no clipped metadata, no accidental overlap, no layout jump, captions confirmed attached to their correct figure at every breakpoint, footer/closing balanced and matches the shared `SiteFooter` used on Home/About.

## KNOWN ISSUES

- The Decision-heading vs. Section-heading size-tier distinction the QA brief's floor values imply (20-24px vs 28-36px) does not exist in the current implementation — `cf-h3` is one unified, already-reviewed scale for both. Not changed here; see RESPONSIVE DECISIONS above for the reasoning. Flagging for Angela in case she *does* want that split — it would be a deliberate hierarchy decision, not a QA-pass default.
- Pricing UI evidence (`Slot` placeholder, Decision 03): RESOLVED — see LATEST COMPLETION above. Real sanitized UI now fills this slot.
- Production `/work/[slug]` Case Study migration remains untouched and out of scope, per explicit instruction.

## FREEZE STATUS

**CASE01 Chinese version: FROZEN**, per the stated freeze condition — all major evidence remains readable at every tested breakpoint, no breakpoint breaks hierarchy, wide screenshots are intentionally handled (horizontal masked viewport, not shrink-to-illegible), motion is subtle/non-essential/reduced-motion-safe, no content changes were required, and validation passes. Do not resume polishing this route without a specific issue from a fresh audit.

# NEXT ACTION

- Angela reviews `fix/case01-responsive-qa` visually against the delivered screenshots (Large Desktop/Laptop/Tablet/Mobile) before merge.

---

# PRIOR COMPLETION (unrelated, still valid) — HOMEPAGE RESPONSIVE STRUCTURE FIX V2

- Branch `fix/home-responsive-structure-v2`, commit `92e884d`. Two confirmed P0 root-cause fixes: (A) `ProjectScene.tsx`'s mobile compact grid layout, which was causing project 01 heading/metadata, project 02 eyebrow, and project 03 metadata to visually collide with the stage chrome or media block; (B) a stale `ScrollTrigger` on Home's `SiteFooter` Closing reveal caused by `SelectedWork`'s `compact` media-query hook resolving one render tick too late. Files touched: `components/home/SelectedWork/ProjectScene.tsx`, `SelectedWork.tsx`, `motion.ts`. Full validation (tsc/eslint/build, live-browser geometry, 60-step opacity sweep, reverse scroll, project selector, reduced motion) passed. See git log for the full commit message; this branch's own HANDOFF section was superseded by CASE01's above per the "replace, don't accumulate" rule, but the work itself remains valid and is the base this branch continues from.

---

# PRIOR COMPLETION (unrelated, still valid) — CASE01 Real Evidence Placement

- Chinese CASE01 Final Real Evidence Placement Pass (implementation: `components/design-samples/case-final/CaseOneFinalContent.tsx`; review artifact: `artifacts/case01-final-real-evidence-fullpage.png`, 1440×18331). Real Order Management, Streamer List/Filter, Checkout Out-of-stock, and Supplier Dashboard evidence placed; unavailable Inventory Log placeholder removed without substitution; Pricing UI placeholder remains (no approved asset yet). This is the pass CASE01 Responsive QA above builds on and froze. English CASE01, Cases 02–04, production `/work/[slug]`, Home, About/About V2, Selected Work, SiteHeader, Footer, and the global design system were untouched by that pass.
