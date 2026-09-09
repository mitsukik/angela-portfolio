# CURRENT STATE

- Branch: `fix/home-responsive-structure-v2` (branched from `b7adfd2` on `fix/index-scroll-rhythm-v1`, which is where Index Scroll Rhythm Fix V1 lives — see the section below, still valid and unmodified by this pass).
- Foundation tag: `v3-design-system-foundation`.
- Current task: none. Homepage Responsive Structure Fix V2 (the two confirmed P0 root-cause fixes below) is complete and committed on this branch. Angela reviews visually before any further polish round.
- Files touched this pass: `components/home/SelectedWork/ProjectScene.tsx`, `components/home/SelectedWork/SelectedWork.tsx`, `components/home/SelectedWork/motion.ts`.
- Note: this branch also carries pre-existing unrelated uncommitted work (About V2, Case Final prototype rounds, SiteHeader nav changes, globals.css) from earlier in the session — untouched and left exactly as found; only the three files above were staged/committed for this task.

# LATEST COMPLETION — HOMEPAGE RESPONSIVE STRUCTURE FIX V2

## A. ProjectScene mobile compact layout (P0-D / P0-E)

- **Root cause:** on mobile, the stage grid's media item claimed a fixed `h-[32vh]` unconditionally; the sibling text item carried `min-h-0`, which strips the grid's normal content-based minimum, so its auto-sized row got whatever height was *left over* (293.9px at 390×844) regardless of whether the text's real content fit. The text column's `justify-center` was also unconditional (only the `md:`-scoped `verticalClass` variants overrode it, which don't apply below `md`), so once content exceeded that leftover budget, it overflowed symmetrically above *and* below the row — colliding with the fixed "SELECTED WORK" stage-chrome above (project 01 heading), and with the media block below/above depending on stacking order (project 01 metadata, project 02 eyebrow, project 03 metadata).
- **Fix:** the stage grid now uses an explicit two-row `grid-template-rows` on mobile, keyed to the same `textFirst` order the columns already use: the text row is `minmax(min-content,auto)` (grows to real content, never squeezed smaller) and the media row is `minmax(9rem,1fr)` (keeps a guaranteed floor but yields the remaining budget to text). Media's mobile height changed from the fixed `h-[32vh]` to `h-full` (fills whatever its now-flexible track resolves to). The text column's base `justify-center` became `justify-start` (the coherent mobile reading — there's no shared row to center within once content stacks full-width; `md:` variants for top/bottom/middle are unchanged at desktop). `md:grid-rows-none` cancels the mobile template at `md:`, restoring the original single shared-height row exactly.
- Verified via real-browser geometry (Playwright, live DOM `getBoundingClientRect`): all four confirmed collisions resolved with 5–28px of clear margin; desktop `gridTemplateRows` measured unchanged (`644px`, single row) before and after.

## B. Homepage → SiteFooter reveal (P0-B / P0-C, stale ScrollTrigger geometry)

- **Root cause:** `useMedia` (the hook backing `compact`) starts at a guessed `false` and only corrects via a plain `useEffect`, which runs *after* paint and after all `useLayoutEffect`s in the tree. `SiteFooter`'s own Closing-reveal `ScrollTrigger` is created in a `useLayoutEffect`, which therefore always runs against the stale, taller (desktop-formula) `SelectedWork` track height on an actual mobile load — before `compact` corrects and the track shrinks. GSAP's own auto-refresh only fires on a native `resize` event; a React-state-driven height change isn't one, so the cached trigger position never recalculates. On mobile, this deficit is compounded because the corrected height is *shorter*, meaning the real scrollable page becomes shorter than the trigger's stale cached start point — so `onEnter` (which sets `heading`/`details` from `autoAlpha:0`) can permanently never fire. Confirmed by temporarily reverting to the pre-fix baseline: heading/details measured stuck at `opacity:0`/`visibility:hidden` even after scrolling fully to the bottom.
- **Fix (two parts, same root cause):**
  1. `useMedia` now uses an isomorphic layout effect (`useLayoutEffect` on the client, falling back to `useEffect` only when `window` is undefined, to avoid the SSR "useLayoutEffect does nothing on the server" warning) — resolves `compact` synchronously before paint instead of one tick later.
  2. `SelectedWork.tsx` calls `ScrollTrigger.refresh()` in a `useEffect` keyed to `[compact]` — this always runs after the full commit (including any cascading re-render from part 1) has settled, so it reliably fires after the track's final height is in the DOM, recalculating every trigger on the page (including SiteFooter's) against correct geometry. Scoped to fire only when `compact` resolves/changes, not on every render.
- Verified: reveal confirmed broken on the pre-fix baseline (stashed comparison), confirmed fixed after restoring — on Home mobile (390×844, ~430×932) and Home desktop (1440); About mobile re-confirmed still correct (unchanged, since About has no `SelectedWork`/`compact` in its tree).

## C. Shared footer architecture — unchanged

- `SiteFooter` remains the single shared component for Home, About, and the active Case Final prototype line. No extraction, duplication, or Home-specific footer was introduced. Production `/work/[slug]`'s separate legacy closing in `CaseStudyTemplate.tsx` was explicitly out of scope for this task and was not touched.

# ARCHITECTURE DECISIONS

- The mobile grid-row split (`minmax(min-content,auto)` / `minmax(9rem,1fr)`) is a named, mobile-only exception inside `ProjectScene.tsx`'s own compact layout math — cancelled at `md:` via `grid-rows-none`, so it does not become a second source of truth for the shared desktop grid role.
- `ScrollTrigger.refresh()` in `SelectedWork.tsx` is intentionally narrow: keyed to `[compact]`, not called unconditionally on every render or from a global/unrelated lifecycle hook.
- Native CSS `sticky` still owns pinning; GSAP/ScrollTrigger still only supplies the scrubbed progress value — unchanged from V1.

# VALIDATION

- `npx tsc --noEmit`: pass. `eslint` on the 3 changed files: pass. `npm run build`: pass, 26 routes (unchanged).
- Live-browser geometry checks (Playwright + Chromium, driven via the diagnosed-reliable method: real wheel input for any desktop/Lenis-active check, direct `scrollTo` for mobile where Lenis is inactive) at 390×844, ~430×932, and 1440×900:
  - Project 01 heading/eyebrow vs "SELECTED WORK" chrome: no longer overlapping (~5px clearance, was ~-26px).
  - Project 01 metadata vs image: no longer overlapping (~24px clearance, was ~50px overlap).
  - Project 02 eyebrow vs image: no longer overlapping (~28px clearance, was ~8px overlap, previously sustained across most of its scroll window).
  - Project 03 metadata vs image: no longer overlapping (~24px clearance, was ~8px overlap).
  - Desktop `gridTemplateRows` unchanged (`644px`, single row) — no desktop regression.
- Full opacity sweep (60 steps, both 1440×1000 and 390×844): **zero dead windows, min(max-opacity) = 1.0** on both — V1's guarantee still holds.
- Reverse scroll (forward to project 03, back to project 01): correct article at opacity 1 in both directions.
- Project-selector nav click (bottom progress nav, index 2 → project 03): correct article at opacity 1.
- `prefers-reduced-motion: reduce` (mobile, mid-scroll): correct single active article, no errors.
- SiteFooter reveal: confirmed broken pre-fix (stashed baseline test) and fixed post-fix on Home mobile (390, ~430) and Home desktop (1440); About mobile unaffected/still correct.
- No horizontal overflow at 390, 430, or 1440. No console errors in any pass.

# KNOWN ISSUES / DEFERRED (explicitly out of scope for this task)

- Production `/work/[slug]` Case Study migration to the shared `SiteFooter`/design system — separate legacy migration, explicitly not touched.
- Hero work, Project 04 typography polish — not started, not part of this task.
- The mobile media-row floor (`9rem` / 144px) is a uniform, non-per-project constant; it hasn't been visually tuned beyond confirming it clears all four current collisions with margin — a design pass may want to adjust it once Angela reviews.

# NEXT ACTION

- Angela reviews `fix/home-responsive-structure-v2` visually on real Desktop + Mobile (the P0-D/P0-E collisions and the Home mobile Closing reveal) before any merge or further polish round.

---

# PRIOR COMPLETION (unrelated, still valid) — CASE01 Real Evidence

- Chinese CASE01 Final Real Evidence Placement Pass is complete at `/design-samples/case-final-01` (implementation: `components/design-samples/case-final/CaseOneFinalContent.tsx`; review artifact: `artifacts/case01-final-real-evidence-fullpage.png`, 1440×18331). Real Order Management, Streamer List/Filter, Checkout Out-of-stock, and Supplier Dashboard evidence placed; unavailable Inventory Log placeholder removed without substitution; Pricing UI placeholder remains (no approved asset yet). Section order/approved copy unchanged except captions/figure numbering. Chinese CASE01 body copy stays ≥16px / 1.7 line-height. English CASE01, Cases 02–04, production `/work/[slug]`, Home, About/About V2, Selected Work, SiteHeader, Footer, and the global design system were untouched by that pass. `tsc`/`lint`/`git diff --check` all passed; Desktop+Mobile QA done; no horizontal overflow; no console errors. Not committed — pending Angela's separate design-lead audit of the review artifact.
