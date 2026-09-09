# CURRENT STATE

- Branch: `fix/case01-decision-03-pricing`.
- Foundation tag: `v3-design-system-foundation`.
- Current task: none. **CASE01 ZH is FROZEN** (below) — responsive QA, real evidence replacement, copy proofread, and Decision 03 terminology alignment are all complete and checkpointed. No further Chinese CASE01 changes are planned unless a specific audit issue is found. CASE02 Phase 2 real evidence replacement is also implementation-complete and committed (`d2f0e5c`).
- Review routes: `/design-samples/case-final-01` (CASE01, frozen), `/design-samples/case-final-02` (CASE02, committed).
- **Continuity note:** this file was fully rewritten (not appended) by the session that did the CASE02 work, which dropped the prior history chain that used to live here (Homepage Visual Polish V3/V3.1/V3.2, the Lavender token checkpoint, About V2, CASE01 Responsive QA, CASE01 Decision 03 pricing evidence). That history isn't reconstructed here — git log and each topic branch (`fix/homepage-hero-balance-v3-2`, `fix/case01-decision-03-pricing`, etc.) remain the authoritative record per AGENTS.md's "if documentation conflicts with Git, investigate and report" rule. Flagged for Angela; not reverted.

# LATEST COMPLETION — CASE01 ZH FROZEN

CASE01 Chinese is frozen. This closes out the sequence of CASE01 ZH passes on this branch: Responsive QA & Final Freeze (`f15026c`, prior branch) → Decision 03 pricing evidence (`dde3182`) → copy proofread (`cde9249`) → this terminology correction. Do not resume polishing this route without a specific issue from a fresh audit.

## This pass: Decision 03 terminology correction

Replaced the one inaccurate phrase found during the terminology review: the body copy asserted a named "Minimum Price" field that isn't evidenced anywhere in the real UI (confirmed via exhaustive OCR across both full source screens, not just the cropped evidence). Replaced with wording that only asserts what's actually shown — "Suggested Retail Price (SRP)" (evidenced, consistent across both source screens) plus a general "price-range constraint" (matching the evidenced "價格浮動"/Price Float range mechanism, without inventing a specific field name or exposing redacted values).

- **Before:** "...但 Selling Price 必須大於或等於系統設定的 Suggested / Minimum Price。..."
- **After:** "...但 Selling Price 必須符合系統設定的建議售價（SRP）與價格區間限制。..."
- FIG.06a alt text and caption, FIG.06b, evidence images, sanitized values, section order — all unchanged.

## Freeze checklist

- ✅ Responsive QA passed (Large Desktop 1920 / 1440 / Tablet 820 / Mobile 390) — hero hierarchy, body readability, no wrap regression, no heading collision, no clipped metadata, no horizontal overflow, no layout jumps.
- ✅ Real evidence replacement complete (Decision 03 pricing placeholder → sanitized real UI, `dde3182`).
- ✅ Copy proofread complete (10 approved edits, `cde9249`).
- ✅ Decision 03 terminology aligned to evidenced UI (this pass).
- ✅ Decision 03 evidence remains correctly paired (all 15 figcaptions verified present/unchanged at every breakpoint); primary/secondary pricing composition (FIG.06a ~67% / FIG.06b ~33%) intact.
- ✅ Wide evidence (Pricing Adjustment Record table, Order Management, etc.) still uses intentional inner horizontal scroll on mobile, not page-level shrink or overflow.
- ✅ Footer/Closing reveals correctly (mobile + desktop).
- ✅ Motion unchanged — still subtle/non-essential; `prefers-reduced-motion` verified clean.
- ✅ English CASE01 untouched — `/en/design-samples/case-final-01` still renders default/dormant content, not `case01-v2`.

## Validation

- `tsc --noEmit`, `eslint`, `git diff --check`, `npm run build`: all clean, 26 routes.
- Live-browser regression (Playwright/Chromium) at 1920×1080, 1440×900, 820×1180, 390×844, both `/design-samples/case-final-01` and `/en/design-samples/case-final-01`: new sentence present at every breakpoint, old "Suggested / Minimum Price" phrase absent, all 15 captions present and correctly paired, zero horizontal overflow, zero console errors.
- Footer reveal and `prefers-reduced-motion` re-verified clean.

## Files

- `components/design-samples/case-final/CaseOneFinalContent.tsx` — one sentence (Decision 03 body copy).
- `HANDOFF.md` — this section.

---

# PRIOR COMPLETION (unrelated, still valid) — CASE01 ZH COPY PROOFREAD IMPLEMENTATION

Implemented the 10 approved copy edits from the CASE01 ZH proofread pass — wording/clarity refinements only. Structure, section order, evidence, screenshots, layout, and Decision 03's `Suggested / Minimum Price / SRP` terminology were explicitly left untouched, per the brief.

## Changes (1 in `CaseStudyPrototype.tsx`, 9 in `CaseOneFinalContent.tsx`)

- Hero summary: "...完整 Web Experience。" → "...完整產品體驗。"
- Project Overview: "Agent 與 Streamer" → "Agent（代理商）與 Streamer（直播主）"; "直播主 Storefront 購買" → "直播主的 Storefront 購買"
- Challenge point 01: reworded to name the shared data precisely ("同一套商品、庫存與訂單資料...依不同角色提供對應的資訊與操作權限")
- My Role, both paragraphs: de-Anglicized several terms (UX/UI Design→UX/UI 設計, Product Architecture→產品架構, System States→系統狀態, etc.) and smoothed the second sentence's structure
- Decision 01: "Order data" → "Order 資料" (consistency with the rest of the sentence's Chinese grammar)
- Decision 02: restructured for clearer causality ("...後才成為 Active" → "...後，才會成為 Active 狀態並進入...")
- Decision 04: reordered the clause ("當共享庫存在...改變" → "當...過程中的共享庫存發生變化")
- Outcome: "協作完成開發" → "協作完成主要功能的開發落地" (more precise about scope)
- Learnings: "System State" → "系統狀態"; restructured the trailing clause

## Explicitly not touched (per brief)

- Decision 03 body copy and its `Suggested / Minimum Price / SRP` terminology — pending separate confirmation.
- Decision 04's 3-step English micro-copy (What happened? / Why can't I continue? / What next?).
- All evidence captions (FIG. 01–09, 06a/06b) — verified unchanged.
- Section order, evidence images, layout — no local wrap adjustment was needed anywhere.

## Validation

- `tsc --noEmit`, `eslint` on both touched files, `npm run build`: all clean, 26 routes.
- Live-browser check (Playwright/Chromium) at 1440×1400 (desktop), 820×1400 (tablet), 390×1400 (mobile): all 10 new strings present in the rendered DOM, none of the old strings present in any rendered element, zero console errors, zero horizontal overflow at any width. (One methodology note: an early pass flagged 2 "old strings" as present — traced to `data/projects.ts`'s long-dormant `caseStudy.challenge`/`role` copy, which rides along as inert hydration-payload JSON inside a `<script>` tag because the whole `project` object crosses the server/client boundary as a prop; it was never visible before this edit and isn't now. Re-verified against rendered DOM only, script tags excluded.)
- Manual visual check of all 8 edited sections + Hero at mobile (tightest breakpoint): clean wrapping throughout, no clipping, no collision, no widow/orphan issues introduced.
- Caption pairing re-confirmed: all 15 figcaptions (FIG.01–09, 06a, 06b, plus the 4 section-10 captions) still attached to their correct figures, unchanged.

## Files

- `components/design-samples/case-final/CaseStudyPrototype.tsx` — Hero summary line only (isolated hunk against HEAD — this file also carries the CASE02 work below, uncommitted and untouched by this commit).
- `components/design-samples/case-final/CaseOneFinalContent.tsx` — 9 body-copy edits.
- `HANDOFF.md` — this section.

---

# LATEST COMPLETION — CASE02 PHASE 2 REAL EVIDENCE REPLACEMENT

Replaced CASE02's 12 explicit evidence placeholders with real website captures from the verified SDX, Charming Clinic, and NATEX project sources. The approved information architecture, section order, ownership boundaries, light editorial presentation, and no-motion constraint remain intact. Added a bounded three-project evidence composition to the existing CASE02 opening so the page identifies all projects visually without turning the hero into a gallery.

## Evidence placed

- SDX: homepage, services structure, and business-context evidence; desktop/mobile homepage pair.
- Charming Clinic: homepage, service discovery, booking/contact evidence; desktop/mobile homepage pair.
- NATEX: services, solution detail, credentials, partners, inquiry evidence; desktop/mobile homepage pair.
- All local evidence is stored as compressed WebP under `public/images/case02/evidence/` and is sourced from the live project URLs recorded in the Phase 2 work log.

## Validation

- `npx tsc --noEmit`: pass.
- `npm run lint`: pass.
- `git diff --check`: pass.
- `npx next build --webpack`: pass, 26 routes.
- Browser QA was performed on the CASE02 route at desktop and 390px narrow width: opening composition, SDX, Charming, NATEX, responsive evidence, no placeholder text, no page overflow, and mobile table containment were checked visually. The live browser automation session later expired due platform usage limits; the final local WebP load path was therefore additionally hardened with `unoptimized` and verified by the successful webpack build.
- No motion was added.

## Files

- `components/design-samples/case-final/CaseTwoFinalContent.tsx` — evidence compositions, real image references, concise captions/copy, responsive pairs, and opening composition export.
- `components/design-samples/case-final/CaseStudyPrototype.tsx` — renders the CASE02-only opening evidence composition.
- `public/images/case02/evidence/` — real source captures, compressed to WebP for local presentation.
- `HANDOFF.md` — current operational state.

## Protected / untouched in this pass

- Cases 01, 03–04 content and evidence.
- English CASE02 route.
- Production `/work/[slug]` routes.
- Home, About, Selected Work, SiteHeader, Footer, global design tokens, and existing motion systems.
- No Design Director preferences or permanent DNA rules were updated.

## Known issue / next action

- The captured evidence is from the verified live project URLs, not a direct Figma export. The linked Figma MCP metadata call was unavailable in this session, so no Figma-only artifact was substituted. Angela should review evidence authenticity, crop choices, readability at normal zoom, and whether the live-source captures match the intended project snapshots before any motion pass.

# PRIOR COMPLETION (unrelated, still valid, uncommitted) — CASE02 IMPLEMENTATION V1

Implemented the approved CASE02 brief as a concise multi-project Brand & Web Experience case. The page complements CASE01 by emphasizing information architecture, content direction, brand communication, responsive design, and accurately bounded frontend ownership across SDX, Charming Clinic, and NATEX.

## Architecture

1. Hero — one multi-project opening
2. Overview
3. From Business Needs to Web Structure
4. Project Stories — SDX / Charming Clinic / NATEX as compact subsections
5. One Principle, Different Expressions
6. Designing Beyond Desktop
7. My Role Across the Projects
8. Reflection

The chapter register correctly maps `02`–`08`; the Hero owns `01` and is not duplicated in the sticky register.

## Evidence status

- No verified CASE02 visual evidence was present in `public/` or found by filename search in the accessible Downloads tree.
- Every evidence location is therefore an explicit `REAL UI EVIDENCE / PENDING` placeholder. No CASE01 image, generated interface, fake research artifact, metric, or substitute UI was used.
- Placeholders are structured for later replacement with homepage hierarchy, service/navigation, trust/booking, technical capability, detail crops, and desktop/mobile pairs.

## Ownership boundaries preserved

- SDX: UX/UI Designer; no frontend or copy-production claim.
- Charming Clinic: UX/UI Designer · Frontend Support; no full frontend or copy-production claim.
- NATEX: UX/UI Designer · Frontend; content production explicitly excluded.
- The role matrix preserves Requirements / IA & Flow / UX/UI / Content Direction / Content Production / Responsive / Frontend differences.

## Files

- `components/design-samples/case-final/CaseTwoFinalContent.tsx` — new CASE02-only content composition.
- `components/design-samples/case-final/CaseStudyPrototype.tsx` — explicit `case02-v1` variant, opening content, and 7-chapter register wiring.
- `app/design-samples/case-final-02/page.tsx` — wires the Chinese review route to `case02-v1`.
- `HANDOFF.md` — current operational state.

## Validation

- `npx tsc --noEmit`: pass.
- ESLint on all CASE02-touched source files: pass.
- `git diff --check`: pass.
- `npx next build --webpack`: pass, 26 routes. Default Turbopack build is blocked in this host environment because its CSS loader cannot bind an internal port; webpack build succeeded after fetching the repository's configured Google fonts.
- Browser QA at desktop 1280×720 and mobile 390×844: pass.
- Desktop and mobile page-level horizontal overflow: none.
- Mobile role matrix: intentionally contained horizontal scroll (`327px` viewport / `736px` table), without widening the page.
- Chapter labels: `02`–`08`, all correctly paired with the requested section labels.
- Current CASE02 page: 12 explicit evidence placeholders, all labelled as pending verified project source.
- English CASE02 smoke check: unchanged default content, no overflow.
- Chinese CASE01 smoke check: title/content present, no overflow.

## Protected / untouched (as of the CASE02 pass)

- CASE01 content and evidence.
- Cases 03–04 content.
- English CASE02 implementation.
- Production `/work/[slug]` routes.
- Home, About, Selected Work, SiteHeader, Footer, and global design tokens.
- Existing motion system; no new CASE02 motion was added.

## Known issues / next action (CASE02)

- CASE02 remains visually incomplete until verified SDX, Charming Clinic, and NATEX source images are supplied or recovered. Replace placeholders only with real project evidence.
- Angela should review the information hierarchy, relative project weight, copy density, and evidence-slot sizing at `/design-samples/case-final-02` before any evidence-placement or motion pass.
- The worktree still contains unrelated pre-existing uncommitted changes documented by Git status. Preserve them.

---

# NEXT ACTION

- Angela reviews the CASE01 ZH copy edits on `fix/case01-decision-03-pricing` (route `/design-samples/case-final-01`).
- Decision 03's `Suggested / Minimum Price / SRP` terminology and the 3-step English micro-copy remain open items for CASE01, pending separate confirmation.
- CASE02 (`/design-samples/case-final-02`) separately awaits Angela's visual review before any evidence-placement pass — see above; still uncommitted.
