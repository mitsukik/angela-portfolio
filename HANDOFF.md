# CURRENT STATE

- Branch (this repo, `/Users/angela/angela-portfolio`): `feat/case02-en-localization`.
- Foundation tag: `v3-design-system-foundation`.
- **CASE01 — COMPLETE / PRODUCTION.** Finalized, merged to `main`, deployed to Vercel Production, production smoke QA passed.
  - Production URL: https://angela-portfolio-phi.vercel.app/
  - Production SHA: `e7474c674ab92d7401019dff2455dadef3fc8750`
  - Complete: CASE01 V3 (ZH + EN), Home CASE01 card positioning, CASE04 public naming sync (行動療癒產品 / Mobile Wellness Product — no "Confidential"/"Anonymous" naming remains anywhere public-facing).
  - Verified in production: responsive QA at 1440/390, all CASE01 evidence images live, Interactive Demo link, Previous/Next nav, no broken images, no 404s, no console errors, no horizontal overflow.
  - **CASE01 is FROZEN.** Do not reopen discovery, redesign, or copy (either locale) without a specific new instruction.
- **Deployment topology (read before any git/push/deploy task):** this repo's git history is disconnected from the actual GitHub/Vercel repo (`https://github.com/mitsukik/angela-portfolio.git`) — no common commit ancestor, though file content substantially overlaps. The properly-connected clone is `/Users/angela/angela-portfolio-public` (branch `main`, tracks `origin/main`, is what Vercel Production deploys from). Production changes are migrated from this repo's committed snapshots into a clean branch off `origin/main` in that other clone, then merged/pushed from there — not pushed directly from here.
- **CASE02 ZH V2 — APPROVED / FROZEN.** Restructured into the 00–08 story architecture; see the CASE02 section below for the full breakdown. Commit: `9ebc104e1a2fba0402709567992e6ab0492c139d` — `feat(case02): restructure and freeze zh case study`.
- **CASE02 EN V2 — IMPLEMENTED / QA PASSED, not yet frozen.** Full recruiter-facing English localization of the V2 00–08 structure implemented and QA-verified (TypeScript/ESLint/production build clean, desktop + mobile visual QA passed, no layout changes required). Commit: `ed8e46472662679bc42d3f53980fee2ec77133a9` — `feat(case02): implement english v2 localization`. **Final user visual approval is still pending — do not mark EN as FROZEN yet.** See the CASE02 section below for the full breakdown.
- **Next portfolio priority: Angela's final visual approval of CASE02 EN V2, then freeze it.**
- Review routes: `/design-samples/case-final-01` (CASE01 ZH), `/en/design-samples/case-final-01` (CASE01 EN), `/design-samples/case-final-02` (CASE02 ZH), `/en/design-samples/case-final-02` (CASE02 EN), `/design-samples/case-final-03` (CASE03 ZH), `/en/design-samples/case-final-03` (CASE03 EN).
- **Continuity note:** this file was fully rewritten (not appended) to replace stale pre-freeze CASE02 status and a dropped prior history chain. Older history (Homepage Visual Polish V3/V3.1/V3.2, Lavender token checkpoint, About V2, CASE01 Responsive QA) is not reconstructed here — git log and topic branches remain the authoritative record per AGENTS.md's "if documentation conflicts with Git, investigate and report" rule.

---

# CASE02 — Brand & Web Experience

## Positioning

CASE02 is **Brand & Web Experience** — a multi-project case covering Shun De Xing / SDX, Charming Clinic, and NATEX. It complements CASE01 rather than competing with it:

- **CASE01 proves:** complex systems, workflows, data-heavy UI, multi-role/product thinking.
- **CASE02 proves:** Information Architecture, Client Requirement Discovery, UX/UI Design, Brand Communication, Content Direction, Responsive Web, Frontend execution on selected projects, and the ability to adapt across different industries.

Core story: **Different business contexts → different information priorities → adapted web experiences.**

## Status: ZH V2 — APPROVED / FROZEN

Do not change unless a real bug is found, factual information is wrong, an asset is broken, or production integration requires a technical fix. Do not reopen discovery or restructure without a specific new instruction.

**Story architecture (00–08):**
- **00 — 專案概覽** (Opening/Hero): establishes 3 real commercial websites across different industries.
- **01 — 我的角色**: contribution/responsibility matrix, **moved here from its old late position** so recruiters see scope before the stories. Chapter numbering for this case now runs 01–08 (the opening no longer implicitly owns "01" the way V1/other cases do — see the `isCaseTwoV1` branch in `CaseStudyPrototype.tsx`).
- **02 — 相同是網站，不同的是問題**: new cross-project comparison table (business context / audience need / UX priority / primary action).
- **03 — 從商業需求到資訊架構**: the existing business-needs → structure chain, reframed with explicit chain intro copy; step content unchanged from V1.
- **04A/B/C — SDX / Charming Clinic / NATEX**: each rewritten around **問題 → 設計判斷 → 設計結果** (Problem → Design Decision → Design Result). Evidence unchanged (1 video walkthrough + 1 supporting still per project, no galleries).
- **05 — 不同情境，不同設計判斷**: new cross-project UX-principle comparison table, then **3 shared principles** (清楚的資訊優先順序 / 在決策點建立信任 / 讓下一步清楚可見). Responsive is deliberately **not** listed as a shared principle here (evidence doesn't support it equally across all three — see 06).
- **06 — 響應式資訊優先順序**: kept **SDX-only**, shortened. Charming/NATEX do not have matching-page-type responsive evidence (only recoverable home-page mobile shots vs. SDX's services-page pair) — do not add a fake 3-project comparison here without new evidence.
- **07 — 從設計到實際網站**: new section connecting design decisions to delivery. Preserves verified ownership: **SDX = no frontend, Charming = partial/initial frontend support, NATEX = full frontend involvement.** Do not imply identical delivery scope across the three.
- **08 — 結語 (Takeaway)**: shortened to a concise Business Context → Information Structure → Digital Experience conclusion (two short paragraphs).

**QA passed:** ZH copy reviewed line-by-line and approved; TypeScript/targeted ESLint/production build all clean; desktop (1440) and mobile (390) visually verified, no overflow, no regressions; Section 07's 3-column divider/padding rule verified pixel-identical across columns (single shared class, not per-column magic numbers).

Evidence: real screenshots only, official live-site evidence, no fabricated UI/research/metrics/interviews/workshops/KPIs.

Motion: restrained Hero evidence entrance, `SectionHeading` reveal, evidence-unit reveal, `prefers-reduced-motion` support. No parallax / scroll-jacking / complex timelines. Unchanged from V1.

V1 freeze commit (superseded by V2, kept for history): `a09ffdb5143dacc49a315b4326d59f17e1b0210b`.
**V2 freeze commit: `9ebc104e1a2fba0402709567992e6ab0492c139d`** — `feat(case02): restructure and freeze zh case study`.

## Status: EN V2 — IMPLEMENTED / QA PASSED (final user visual approval pending — do NOT mark FROZEN yet)

Route: `/en/design-samples/case-final-02`. Uses the same renderer (`CaseTwoFinalContent.tsx`) via locale-driven content (`locale` prop, `zhHant` branching) — not a separate implementation.

Full recruiter-facing English localization of the approved ZH V2 00–08 structure, drafted section-by-section against the frozen Chinese copy, reviewed and refined by Angela through two rounds of wording edits, then implemented. Natural phrasing throughout, not literal translation — same approach as CASE01's EN pass. No metrics, research, interviews, testing, KPIs, or outcomes invented; exact delivery-scope distinctions preserved from the verified ownership facts (see "Project ownership" below).

**Delivery-scope distinctions preserved (Section 07):**
- **SDX = no frontend ownership** — "Design delivered; frontend implemented by another team."
- **Charming Clinic = initial frontend support** — "UX/UI design with initial frontend support."
- **NATEX = full frontend involvement** — "End-to-end from IA through frontend implementation."

**QA passed:** TypeScript (`tsc --noEmit`), targeted ESLint, and production build (`next build`) all clean. Desktop (1440-class) and mobile (375px) visual QA passed — walked all 8 sections on both viewports; no awkward line wraps from the longer English copy; Section 02/05 comparison tables confirmed to scroll horizontally and cleanly on mobile; Section 07's 3-column grid holds on desktop and stacks cleanly on mobile. **No layout or structure changes were required for English** — only text content changed (one exception: Section 08's English body was split into two `<p>` elements to match the ZH's existing two-paragraph pattern, not a new pattern). Chinese copy confirmed byte-identical before/after (every `zhHant ? "…"` string unchanged); CASE01 confirmed untouched.

Commit: `ed8e46472662679bc42d3f53980fee2ec77133a9` — `feat(case02): implement english v2 localization`.

**Final user visual approval is still pending.** Do not mark CASE02 EN as FROZEN until Angela explicitly confirms after her own visual review.

Old V1 EN commit (structure now superseded): `0838c55` — `feat(portfolio): add English CASE02 localization`.

## Project ownership (verified — do not broaden)

**SDX** — Role: UX/UI Designer.
Verified: direct client requirement discovery, flow/UX, information structure, UI/UX design, identified missing content, coordinated with PM to obtain required content.
Did NOT own: frontend implementation, copy production.

**Charming Clinic** — Role: UX/UI Designer · Frontend Support.
Verified: direct client requirement discovery, flow/UX, UI/UX design, identified/requested required content directly from client, initial frontend support.
Did NOT own: full frontend implementation, copy production.

**NATEX** — Role: UX/UI Designer · Frontend.
Verified: requirements, IA/flow, UX/UI, responsive design, frontend implementation.
Did NOT own: content production. NATEX has the broadest delivery scope across the three projects.

## Live website links — complete and frozen

Approved external links, label **"Visit Website ↗"**, visually secondary, open in a new tab:
- SDX → https://sdxdevelop.com/
- Charming Clinic → https://charmingvip.com/
- NATEX → https://www.natex.com.tw/

Commit: `5d8c73aa8a173eb09f73791ec43689dbcec62ac0` — `feat(portfolio): add live website links to CASE02`.

## Evidence viewer — complete and frozen

CASE02 Sections 04–06 include an approved evidence viewer: 15 real evidence images are clickable; Hero evidence remains non-interactive; native `<dialog>` shows the enlarged real screenshot; backdrop close, Escape close, keyboard activation, explicit focus restoration, focus containment, `prefers-reduced-motion` support; no new dependency.

Files: `CaseEvidenceViewer.tsx`, `CaseEvidenceViewer.module.css`, integration in `CaseTwoFinalContent.tsx`.
Commit: `a2b29c0` — `feat(portfolio): add CASE02 evidence viewer`.

**Interaction principle: inspect, not entertain.** Do not add a carousel, parallax, slider, 3D tilt, cursor effects, additional scroll animation, or complex GSAP timelines.

---

# CASE01 — Complex System

Status: **V3 Phase 2 visual composition complete; pending visual audit.** The approved 00–06 narrative, verified product story, dark editorial identity, typography, and section ownership remain locked. Phase 2 changed only evidence scale, crop, pairing, and hierarchy.

## CASE01 UI constraint (verified — durable project truth, not a one-off note)

**Corrected 2026-09-17 (second pass, same day): the template constraint applies to the BACKEND systems only — Platform Backend, Supplier Backend, Agent Backend. It does NOT apply to the Consumer Web Storefront.** An earlier same-day pass said "the Figma UI" generally, which overstated it — do not use that earlier framing. Never describe the whole CASE01 UI, or the Consumer Web Storefront specifically, as template-constrained.

Engineering planned to use an existing UI template/component framework **for the backend systems**. Backend Figma UI was intentionally simple and primarily served as functional UX/system specification rather than bespoke visual-design exploration. The **Consumer Web Storefront was designed separately** as its own front-end experience/interface — treat its evidence as genuine UX/UI design work, not template-constrained output.

**Future chats/agents must not position CASE01's backend systems as a visual-UI craftsmanship case. This does not extend to the Consumer Web Storefront.**

**CASE01 primary portfolio value:** Complex System UX / Product Architecture / Business Logic / Workflow / State Design / Developer Handoff (backend systems) plus genuine consumer-facing UX/UI design (Consumer Web Storefront).

**Team (verified 2026-09-17):** Lead Product Designer (Angela) + 1 UI Designer + 2 Engineers + PM (PM joined later, QA/coordination support).

**Ownership (verified 2026-09-17):**
- **Lead Product Designer** — Product Architecture, core UX/system direction, Platform Backend, Supplier Backend, Agent Backend, **and** Consumer Web Storefront.
- **The other UI Designer** — extended Consumer Mobile and Streamer Backend from the Lead's established architecture, interaction patterns, and design direction.

The correct claim: the designer led the product architecture and UX/system design, created functional interface specifications in Figma within the existing UI-template constraint **for the backend systems**, personally designed the Consumer Web Storefront's front-end experience separately, and collaborated directly with engineers to make the system implementable. This does **not** mean the designer was only a wireframe designer — the project still demonstrates Lead-level ownership of product structure, workflows, states, interaction logic, business rules, UX specification, cross-role consistency, and developer collaboration. `Lead Product Designer` remains the correct title.

Do not accidentally imply the designer created the underlying UI template/framework, built a custom visual-design system for the entire product (backend included), personally designed every visual detail of all surfaces (Consumer Mobile / Streamer Backend belong to the other UI Designer), owned engineering implementation styling, or delivered pixel-perfect production UI — none of that is true and none of it should appear in this case's copy. Equally, do not undersell the Consumer Web Storefront as template-constrained — it wasn't.

This clarification was reflected in ZH copy only (Sections 01, 04, 06 of `CaseOneFinalContent.tsx`, plus the Team metadata row in `CaseStudyPrototype.tsx`) on 2026-09-17, before the CASE01 Chinese freeze. **EN copy still says the pre-correction thing** (prominent "UI Design, Design Direction" in Section 01, "CORE UI & DESIGN DECISIONS" as the Section 04 label, "2 Engineers · PM" team metadata with no second designer, no backend/storefront distinction) — this needs the same correction during the English pass, which has not started. Do not treat the EN route as reflecting any of this positioning yet.

V3 structure is locked to exactly seven narrative sections: 00 Project Snapshot (case opening), 01 Project Background & My Role, 02 Cross-border Commerce Workflow, 03 System Architecture & Key States, 04 Core UI & Design Decisions, 05 Cross-touchpoint States & Exception Handling, and 06 Results & Takeaways. The prior 11 content chapters were consolidated into six body chapters; all existing real evidence remains and is attached directly to the argument it proves. Product status is "Designed & Developed" and explicitly excludes launch or post-launch KPI claims.

Current mapping: Section 03 remains conceptual only (system model + Inventory Status Flow). Section 04 now composes 04A Streamer List as context with a smaller focused filter detail; 04B Inventory Management as primary with a tightly cropped Product Inventory Log; 04C real pricing UI as primary, validation as strong secondary, and the sanitized logic diagram as support; 04D keeps the Order List at full content width with the Supplier Dashboard reduced to secondary context. Section 05 leads with the real Checkout out-of-stock state before the smaller Backend → Consumer Impact diagram, then uses one focused Return / Exchange main crop plus validation and operational-consequence details. Evidence labels use Context, Detail, System State, Validation, and Operational Evidence. Section 00 retains the small `View Interactive Demo ↗` CTA as supporting implementation evidence, never launch evidence.

Recovered source files: `1-2 供貨商 - 商品管理.pdf` from `/Users/angela/Downloads/媒合銷售平台系統後台 - 第一階段.zip`; `1-5 平台方 - 訂單管理.pdf` from `/Users/angela/Desktop/未命名檔案夾 54/媒合銷售平台系統後台 - 第一階段/`. Phase 2 focused assets under `public/images/case01/evidence/`: `case01-inventory-log-focused.png`, `case01-checkout-out-of-stock-focused.png`, `case01-return-exchange-main-focused.png`, and `case01-return-exchange-consequence.png`. These are crops of the original evidence, not generated replacement UI.

Implementation files: `CaseOneFinalContent.tsx`, `ReadingSection.tsx`, the focused evidence assets above, and `artifacts/case01-v3-phase2-visual-composition-zh-1440.png`. The approved 01 section uses an explicit `background-role` composition variant rather than a parallel global typography/layout system.

Latest validation: TypeScript `npx tsc --noEmit` passed; targeted ESLint for the two changed components passed; `npm run build -- --webpack` passed with all routes statically generated. Chinese CASE01 was rendered from the production build and captured after loading all sections and evidence. Screenshot is exactly 1440 × 15,734px, down from the Phase 1 baseline of 1440 × 20,102px (21.7% shorter) through evidence composition/cropping rather than typography reduction or story removal.

Most recent CASE01-specific fix: English evidence-image correction (separate from CASE02 history) — English CASE01 now uses the correct English versions of the CE, ISF, PRL, and BE evidence diagrams instead of the Chinese-labeled originals.
Commit: `8ef49966fa61ce09772bb9a25436de5f3e315716` — `fix(portfolio): use English evidence images in CASE01`.

Prior CASE01 ZH freeze checklist (Decision 03 terminology aligned to evidenced UI, real pricing evidence, 10-edit copy proofread, responsive QA at 1920/1440/820/390) remains valid — see git log on this file's history for detail if needed.

## Phase 3 — Responsive QA (uncommitted, continues from Codex's partial pass)

Codex started this pass and flagged two risks before hitting its usage limit; this session resumed from that point, fixed both, and found one additional overflow bug during testing. Desktop (1440, the frozen Phase 2 composition) is unchanged — every fix below is scoped to `lg:`-guarded mobile/tablet CSS or a mobile-only initial-scroll effect.

**Risk 1 (confirmed) — Section 02/03 workflow diagrams shrank to illegibility.** `FlowEvidence.tsx` (used for the CE ecosystem diagram and the ISF inventory-state diagram) had no minimum width, so at 390px the diagram rendered at ~290px CSS width with unreadable text. Fixed by wrapping the frame in the same scrollable-evidence pattern already established elsewhere in this file (`overflow-x-auto`, `tabIndex`, `role="group"`, matching `.cf-figure-frame`/`.cf-scroll-region` conventions), with `min-w-[48rem] lg:min-w-0` — legible fixed width below `lg`, byte-identical full-width `object-contain` at `lg`+. A short "scroll to see the full diagram" hint (`lg:hidden`) was added under each caption.

**Risk 2 (confirmed) — shared 64–70rem evidence min-width caused two distinct problems, fixed differently per cause:**
- *Discoverability:* every `InspectableEvidence`/`TopCropEvidence` figure (Order List, Inventory Log, Pricing Detail, Return/Exchange ×3, Checkout out-of-stock) forces a 64–70rem canvas below `lg`, so mobile shows only a ~35%-wide slice with no visual cue more exists. Added an `lg:hidden` scroll-hint caption to each (`InspectableEvidence` gained an optional `scrollHint` prop). No image assets changed; no aspect ratios changed.
- *Wasted space:* Order List and Supplier Dashboard specifically are full-page admin screenshots whose left sidebar (~15% of the source image, ~160px in the rendered 70rem canvas) is not the evidence — so the *default* scroll position opened on nav chrome instead of the table/dashboard. New client component `ScrollSkipEvidence.tsx` (a variant of `InspectableEvidence` that sets `scrollLeft` past the sidebar on mount, gated to `<lg` via `matchMedia`) now backs both. Order List opens on Status/Order ID/Customer/Payment and scrolls right to Shipping/Source/Order Date/Actions; Supplier Dashboard opens on the actual dashboard cards instead of the nav rail. No new image crops were generated — same source assets, just a different default `scrollLeft`.

**Additional bug found during this pass (not in Codex's original two, but a direct instance of the Global rule "no horizontal page overflow, no clipped titles"):** `EvidenceSection`'s section label (`CaseOneFinalContent.tsx`) and `ReadingSection`'s label both used unconditional `whitespace-nowrap`, unlike every other CASE02/03/04 section-heading component in this codebase, which already use `md:whitespace-nowrap`. Long English labels (e.g. "05 — CROSS-TOUCHPOINT STATES & EXCEPTION HANDLING") overflowed the 390px viewport (`document.documentElement.scrollWidth` measured 557px against a 390px window). Brought CASE01 in line with the existing shared pattern (`md:whitespace-nowrap`) — wraps to two lines below `md`, single line at `md`+ exactly as before. Verified no `docScrollWidth` overflow remains at 390 on both locales after the fix.

**What was NOT changed:** 04A Streamer List/Filter (TopCropEvidence top-crop already reads reasonably at the 64rem canvas — verified visually, left untouched); 04C Pricing Detail structure/order; Section 05 Return/Exchange's existing context→detail→consequence split (already matches the requested pattern, images already pre-cropped per concern); no copy, no 00–06 structure, no desktop hierarchy, no new image assets, no motion.

**Validation:** `npx tsc --noEmit` passed; targeted ESLint on `CaseOneFinalContent.tsx`, `FlowEvidence.tsx`, `ScrollSkipEvidence.tsx`, `ReadingSection.tsx` passed; `npm run build -- --webpack` passed with all routes statically generated. Verified via the built production server (port 3100) at 1920/1440/820/390 on both `/design-samples/case-final-01` and `/en/design-samples/case-final-01`: no `docScrollWidth` overflow at any width, diagrams legible without scroll on 390 (48rem canvas) and fit fully with no scroll from 820 up, Order List horizontal scroll confirmed to reach Payment/Shipping/Source/Actions, Inventory Log scroll confirmed to reach Role/Timestamp, desktop (1440/1920) pixel-equivalent to pre-Phase-3 (no scroll frames, no hint text, sidebar visible as designed).

**Still uncommitted** — same worktree caveat as before applies (see bottom of this file): these Phase 3 edits sit on top of Codex's earlier uncommitted Phase 2 work in the same two files. Nothing has been committed by this session.

## Phase 4 — Minimal Explanatory Motion (uncommitted, builds on Phase 3)

Scope was explicitly motion-only: no layout, copy, crop, responsive-behavior, section, evidence, or business-logic changes. Two pre-existing motion pieces were already in place before this phase and were left untouched: `FlowEvidence`'s clip-path wipe on the Section 02/03 diagrams, and `EvidenceMotion`'s batched fade for every evidence figure (`data-evidence-entrance`). Phase 4 filled the remaining gap — Sections 02–05 had no entrance motion at all for their own label/title/supporting text, unlike Sections 00/01/06 (`ReadingSection`), which already had a staged label→title reveal.

**New client component `EvidenceHeading.tsx`** replaces the old static `EvidenceSection` helper. It plays the identical label→title timeline `ReadingSection` already uses (same durations, easing, offsets, translateY) so all seven sections settle in with one consistent register — reused existing motion tokens rather than inventing new ones, once, `prefers-reduced-motion`-gated via the same `gsap.matchMedia` pattern used everywhere else in this file.

**New client component `SequenceReveal.tsx`** replaces the old static `Sequence` helper (Section 05's "what happened / why can't I continue / what's next" three-column breakdown) — the case's clearest cause→consequence chain and the brief's named "most useful place for explanatory motion." A short one-time 0.14s stagger across the three existing steps reinforces that reading order; the three-column layout itself is untouched.

**Two plain paragraph/text blocks gained `data-evidence-entrance`** (reusing `EvidenceMotion`'s existing batch-fade rather than writing new motion code): Section 02's workflow-sequence caption below the diagram, and Section 03's two-paragraph intro block (treated as one unit, not animated per-paragraph, since animating every label independently was explicitly out of scope).

**Section 04 required no change** — `EvidenceMotion`'s existing batch stagger already reveals evidence in DOM order (primary before detail: List before Filter, Inventory Management before Log, Pricing before Validation, Order List before Supplier Dashboard), which already satisfies "primary evidence appears first, detail follows slightly after" as a side effect of Phase 2's approved DOM order.

**Section 05's DOM order was deliberately NOT changed** to chase the brief's idealized "explanation before evidence" sequence — Phase 2 approved leading with the real Checkout out-of-stock evidence before the supporting BE diagram (strongest evidence first), and reordering content is a layout decision outside this phase's scope. Motion reinforces the existing, approved order instead of rewriting it.

**Intentionally left static:** 04A–04D evidence content/labels beyond the existing figure fade (no per-label animation); Section 05 Case 02 (Return/Exchange) — the existing generic entrance already reads clearly and a bespoke progression wasn't judged to add comprehension; Section 06's `ScopeSummary` closing grid; the Hero/Section 00 opening (already restrained via `ReadingSection`, untouched).

**Reduced motion:** every new and existing motion path shares one gate — `gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", …)`. When reduced motion is preferred, that callback never registers, so `gsap.set(..., {autoAlpha:0, y:...})` never runs and elements stay at their default (fully visible, no offset) permanently — no staged delay, nothing hidden waiting on motion. Verified by code inspection against the same pattern already carrying Sections 00/01/06 and all evidence figures through Phase 1–3; the available browser tooling in this session has no control for emulating `prefers-reduced-motion` at runtime, so this was not additionally verified via a live toggle.

**Mobile:** no changes to horizontal-scroll evidence behavior, scroll hints, or the Order List/Supplier Dashboard scroll-skip from Phase 3 — verified unchanged at 390px. New entrance motion (section label/title, Section 03 paragraph block, Section 02 caption, Section 05 sequence) is the same lightweight opacity/translateY treatment on both mobile and desktop; nothing new was added that could compete with touch-driven horizontal scrolling.

**Validation:** `npx tsc --noEmit` passed; targeted ESLint on `CaseOneFinalContent.tsx`, `EvidenceHeading.tsx`, `SequenceReveal.tsx` passed; `npm run build -- --webpack` passed with all routes statically generated. Verified visually on the dev server at 1440 and 390 (ZH): label/title reveal on Section 02, mid-stagger and settled states of the Section 05 sequence, Order List/Supplier Dashboard scroll-skip and hints unchanged, no layout shift or overlap.

## Phase 5 — Final Chinese Audit / Freeze Preparation (audit only, no content/layout changes)

Produced two review deliverables, not committed, for the Case Study lead to proofread before a separate freeze-commit request:
- `artifacts/case01-v3-phase5-zh-copy-manifest.md` — exact rendered Chinese copy (headings, paragraphs, captions, alt text, metadata, CTAs), grouped 00 through 06 plus a closing-nav appendix. Nothing rewritten.
- `artifacts/case01-v3-phase5-audit-report.md` — terminology audit, claim audit, Interactive Demo audit, structural audit, responsive/motion smoke check, reduced-motion code verification, and validation results.

**Findings (not yet fixed — copy lead's call):**
- Four terminology inconsistencies: Supplier (供應商 vs 供貨商), Agent (代理商 vs 代理公司), Warehouse (倉庫 vs 倉儲 — Section 00's opening summary vs Sections 01–02's body), and Workflow (04D's own title says 流程, its body says 工作流, one sentence apart).
- The "View Interactive Demo ↗" CTA (`CaseStudyPrototype.tsx:386`) is hardcoded English-only and doesn't branch on locale like every other CTA in that file — no "互動 Demo" shown on the ZH route. Not a claim-safety issue (doesn't imply Production/Live/Launch), just a localization gap.

**Confirmed clean:** claim audit (no formal-launch/commercial-operation/KPI/usability-test/pixel-perfect overclaims; the required "Designed & Developed, not commercially launched, no post-launch KPI claims" disclaimer is present and correctly worded in both locales); demo link target/behavior/labeling-safety; structural order (00→01→02→03→04A–D→05 Case01/Case02→06, no deprecated V1/V2 sections reachable); responsive/motion smoke check at 1440/820/390 (no overflow, no clipped headings, scroll hints and Order List scroll-skip unchanged); reduced-motion gating (`gsap.matchMedia("(prefers-reduced-motion: no-preference)")` confirmed present in every CASE01 motion file by code inspection — runtime emulation unavailable in this session's tooling, not blocking per instructions).

**Validation:** `tsc`, targeted ESLint, and `next build` all passed.

**STOPPED per instructions — nothing committed.** Next step is the Case Study lead's proofread of the copy manifest; a freeze commit will be requested separately after that.

## Positioning Correction (2026-09-17, before Chinese freeze — copy only, no layout/responsive/motion change)

Designer clarification: engineering had already decided to use an existing UI template/component framework for CASE01, so the Figma UI was intentionally kept simple. The case must present the existing screens as **functional UX / system-design evidence**, not a highly customized visual-design showcase. See "CASE01 UI constraint" above this Phase log for the full, durable statement of this — that section is the one to check in future sessions, not this changelog entry.

**Exact ZH-only changes** (EN intentionally untouched — see the constraint note above; this was explicitly scoped "before CASE01 Chinese freeze," and English copy optimization has a standing hold from Phase 5):
- Section 01, paragraph 2 (role list): reordered/revised to Product Architecture → Information Architecture → UX Flow → Interaction Design → State Design → Business Rule 定義 → Developer Handoff, with "Design Direction" dropped and UI Design demoted to its own clause ("UI Design 則在既有 Template 與元件架構的限制下進行"). `Lead Product Designer` title kept unchanged.
- Section 01: one new paragraph inserted (3rd of what is now 4) stating the template constraint and what the design phase actually focused on (product architecture, workflow, IA, System States, Validation, Edge Cases) and that Figma delivered UX/UI specification for engineering.
- Section 04 label: "核心介面與設計決策" → "核心 UX 決策與介面證據" (the H2 title beneath it was already operations/collaboration/pricing-focused and needed no change).
- Section 06: one new paragraph inserted (3rd of what is now 4) framing the project's real design challenge as product architecture/Workflow/System States/Business Rules, not a customized visual interface. The existing broader takeaway sentence was retained verbatim, per instructions, immediately after it.
- Sections 04A–04D and all evidence captions/bodies were reviewed and left untouched — none of that copy currently implies visual-design ownership (captions already say CONTEXT/DETAIL/SYSTEM STATE/VALIDATION/OPERATIONAL EVIDENCE, which was already correctly positioned from Phase 2).

`artifacts/case01-v3-phase5-zh-copy-manifest.md` has been updated in place to reflect all of the above (changed lines marked "(new)"/"(revised)"); the Phase 5 audit report's terminology findings (Supplier/Agent/Warehouse/Workflow word-choice) are untouched by this pass — still the copy lead's call, unrelated to this positioning correction.

**Validation:** `tsc`, targeted ESLint, and `next build` all passed. Verified in the live DOM (not just source) that Section 01 now renders 4 paragraphs in order, Section 04's label reads "04 — 核心 UX 決策與介面證據", and Section 06 renders 4 paragraphs in order with the new sentence third — no overflow, no layout change.

**STOPPED per instructions — nothing committed.**

## Final Factual Correction (2026-09-17, same day, before Chinese freeze — copy only)

Corrects an overstatement in the Positioning Correction above: the template constraint applies to the **backend systems only** (Platform/Supplier/Agent Backend), not the Consumer Web Storefront, which was designed separately. Also adds a previously-missing team member (1 UI Designer) to the Team metadata. See "CASE01 UI constraint" above — now updated to the corrected, precise version — for the durable statement; this entry is the changelog only.

**Exact ZH-only changes** (EN untouched, same standing hold):
- `CaseStudyPrototype.tsx` Team metadata (ZH row only): "2 Engineers · PM" → "1 UI Designer · 2 Engineers · PM". Role/Platform/Status rows unchanged.
- Section 01, paragraph 2 (role list): replaced verbatim with the designer-supplied text — same responsibility hierarchy as before, but now explicitly attributes backend UI Design to the template constraint and states the Consumer Web Storefront's front-end experience/interface was designed separately.
- Section 01, paragraph 3 (constraint statement): replaced verbatim — now says "後台開發端" (backend engineering) specifically, not a general "開發端," and adds an explicit sentence that the Consumer Web Storefront had its own separate front-end UX/UI design process.
- Section 01, paragraph 4 (ownership): replaced verbatim — "另一位設計師" → "另一位 UI Designer" (matches the new team metadata), "模式" → "Interaction Patterns." Ownership split unchanged (Lead: Platform/Supplier/Agent Backend + Consumer Web Storefront; other UI Designer: Consumer Mobile + Streamer Backend) but now made explicit as a named team role rather than an unspecified "another designer."
- Section 06: the design-challenge sentence now says "不是替**後台系統**建立一套高度客製化的視覺介面" (backend systems specifically) instead of a general "不是建立一套...視覺介面" — narrows the claim to backend, consistent with the storefront not being template-constrained.
- Section 04 label: unchanged, per instructions ("核心 UX 決策與介面證據" already correct — backend evidence demonstrates UX/workflow/IA/state/validation, consumer-facing evidence may still read as genuine UX/UI design evidence).

**Consistency audit (item 7):** searched all CASE01-specific "Designer"/"Engineer"/"PM" mentions in both files — no remaining contradiction found. The only other "Designer"/"Team" metadata rows in `CaseStudyPrototype.tsx` belong to CASE03/CASE04 (different `isCaseThreeV1`/`isCaseFourV1` branches), not CASE01.

**Validation:** `tsc`, targeted ESLint, and `next build` all passed. Verified in the live DOM: Team metadata reads "1 UI Designer · 2 Engineers · PM", Section 01 renders the four updated paragraphs in order, Section 06's third paragraph now says "後台系統" — no overflow at 1440 (`scrollWidth` 1425), no layout change.

**STOPPED per instructions — nothing committed. English still untouched.**

## Final Freeze Cleanup (2026-09-17, same day, before Chinese freeze — copy only)

Last ZH pass before freeze. Two kinds of fixes: removed a duplicate sentence, and normalized the four terminology inconsistencies the Phase 5 audit flagged (none of which required a factual correction — pure word-choice consistency).

- **Section 01, paragraph 3:** removed the trailing "Consumer Web Storefront 則依照消費者購物流程另外進行前台 UX/UI 設計" sentence — paragraph 2 already establishes that distinction, so it was redundant. Also dropped "確定" from "後台開發端確定採用" → "後台開發端採用" (tightened, no meaning change).
- **Terminology normalized** (all four Phase 5 findings resolved):
  - Supplier: 供貨商 → 供應商, at `CaseOneFinalContent.tsx` (Section 02 sequence caption, and the Supplier Dashboard alt text in 04D). 3 occurrences now read 供應商 consistently.
  - Agent: 代理商 → 代理公司, at `CaseOneFinalContent.tsx` (Section 01 paragraph 1, Section 02 sequence caption) — now matches `CaseStudyPrototype.tsx`'s existing Section 00 usage.
  - Warehouse: 越南倉儲 → 越南倉庫 at `CaseStudyPrototype.tsx` (Section 00 opening summary) — that usage is a system-role reference (paired with Supplier/Agent/Streamer/Consumer in a role list), not a warehousing-process reference, so per the rule (倉庫 = physical location/system role, 倉儲 = process only) it takes 倉庫. This was the only 倉儲 occurrence in CASE01; the term no longer appears anywhere in the case.
  - Workflow: 工作流 → 工作流程 at `CaseOneFinalContent.tsx` (04D body) — matches the "as Chinese prose" rule; DecisionBlock/Section labels using "流程" (Section 02, 04D's own title) were correct already and untouched.
- **Demo CTA localized:** `CaseStudyPrototype.tsx`'s CTA now reads `{zhHant ? "互動 Demo ↗" : "Interactive Demo ↗"}` — was hardcoded English-only before. Link target/`target`/`rel` unchanged.

**Consistency re-check:** no remaining factual or terminology contradiction found across CASE01 ZH copy.

**Validation:** `tsc`, targeted ESLint, and `next build` all passed. Verified in the live DOM on both locales: ZH CTA reads "互動 Demo ↗", EN CTA still reads "Interactive Demo ↗" (unaffected), all four terminology fixes render correctly, no overflow at 1440 (`scrollWidth` 1425).

`artifacts/case01-v3-phase5-zh-copy-manifest.md` is now the **FINAL** version — rewritten (not just patch-annotated) to the current, freeze-ready state, with a revision log at the bottom for context. This is the file for the Case Study lead's proofread.

**STOPPED per instructions — nothing committed. English still untouched.**

## Freeze Commit (2026-09-17, same day)

CASE01 ZH formally approved and frozen. Before committing, `git status`/`git diff` review found the working tree was not a clean CASE01-only diff — three files (`CaseStudyPrototype.tsx`, `ChapterRegister.tsx`, `data/projects.ts`) mixed my CASE01 edits with other already-uncommitted work. Isolated-worktree testing (not the real repo) showed that work — a Previous/Next cross-navigation feature, locale-aware accessibility labels, small CASE02/03/04 metadata-label localization, and a Home-page visual-asset feature — was load-bearing: `CaseStudyPrototype`'s `previousProject` prop is non-optional, so every one of the ten case-study route files needs it; `ChapterRegister`, `CaseTwoHeroEvidence`, and `CaseFourHeroEvidence` already require a `locale` prop; `SiteFooter` already requires `backToTopLabel`. Reverting only the 3 originally-flagged files would have broken the type graph. Angela chose to include the full validated cascade rather than force an artificial split.

**Files committed** (verified via a throwaway `git worktree` checked out at the prior HEAD, with only this exact file set copied in — `tsc`, targeted ESLint, and `next build` all passed standalone, confirming the set is both necessary and sufficient):

CASE01-exclusive: `CaseOneFinalContent.tsx`, `FlowEvidence.tsx`, `ScrollSkipEvidence.tsx` (new), `EvidenceHeading.tsx` (new), `SequenceReveal.tsx` (new), `ReadingSection.tsx`, `app/design-samples/case-final-01/page.tsx`, `app/en/design-samples/case-final-01/page.tsx`, CASE01 evidence images (see below).

Shared infrastructure required by the above: `CaseStudyPrototype.tsx`, `ChapterRegister.tsx`, `CaseTwoFinalContent.tsx`, `CaseFourFinalContent.tsx`, `VideoEvidence.tsx` (new), `components/site/SiteFooter.tsx`, `data/projects.ts`, `data/contact.ts`, and the remaining case-study route files (`app/design-samples/case-final-{02,03,04,dark,light}/page.tsx`, `app/en/design-samples/case-final-{02,03,04}/page.tsx` — the last is a new file/directory).

CASE01 evidence images: 20 new `.webp`/`-focused.png` files under `public/images/case01/` replacing 15 deleted `.png` originals (the `.webp` migration from Phase 2/3); 2 unreferenced leftover crop files (`evidence/case01-inventory-log.png`, `evidence/case01-return-exchange-detail.png`) were deliberately excluded — not referenced by any current source. CASE02 also needed 3 new poster images (`charming-walkthrough-poster.jpg`, `natex-walkthrough-poster.jpg`, `sdx-walkthrough-poster.jpg`) referenced by `VideoEvidence.tsx`/`CaseTwoFinalContent.tsx`.

**Deliberately excluded** (genuinely unrelated, confirmed by inspection, not needed for the build to pass): `AGENTS.md`, `CLAUDE.md`, `.gitignore` (a separate private/public-history housekeeping decision), `app/globals.css` (large, broad site-wide CSS work — the handful of classes CASE01 needs already exist at the prior HEAD; only a cosmetic keyboard-focus-outline enhancement is missing in isolation), `SiteHeader.tsx`, About V2, Home Hero, `.impeccable/`, `tmp/`, `public/videos/`, `public/brand/`, `public/images/about/`, `public/images/home/*.webp`, other CASE02 image churn not required by the code above, and `artifacts/` (already gitignored).

Commit message: `chore(portfolio): checkpoint validated case-study state` — not a CASE01-only message, since the commit's actual diff includes the shared infrastructure above.

**Validation:** `tsc`, targeted ESLint, and `next build` all passed — both in the real working tree and, more importantly, in the isolated verification worktree with only the committed file set present.

## CASE01 EN Freeze (2026-09-17, same day)

CASE01 EN localized from the frozen ZH master (`a83f050`, later `51f5872`), not a literal translation, across four passes:

1. **Initial localization.** Section 00 intro rewritten; Section 01 rewritten to 4 paragraphs (was 3 — EN had never received the positioning correction's new constraint paragraph); Section 02 sequence wording tightened (`Cross-border Shipment`, `Receive / Count / Scan`); Section 04 label corrected to `CORE UX DECISIONS & INTERFACE EVIDENCE`; Section 06 gained the missing 3rd paragraph (backend-vs-visual-craft framing); Team metadata corrected to `1 UI Designer · 2 Engineers · PM`.
2. **Pricing factual correction (EN half).** 04C originally said only "within the Suggested Retail Price (SRP) and price-range constraints" — under-specified. Corrected to state the verified minimum-price floor explicitly: "...but it can't go below the Supplier-defined minimum Selling Price — equal to the minimum is allowed — and must still fall within broader price-range and profitability constraints." (The ZH half of this same fix is documented in the ZH Re-freeze entry above and already committed as `fix(case01): clarify pricing floor in frozen Chinese case`.) Also tightened Section 01's storefront-ownership sentence and Section 06's closing clause per direct instruction.
3. **Final micro-copy patch.** Subtitle (`Multi Role Workflow` → `Multi-role Workflows`); removed a sentence in Section 01 paragraph 3 that repeated paragraph 2's storefront distinction; lowercased generic nouns throughout prose (product/inventory/order/consumer/shared inventory/web system) while keeping actual UI field labels, named system states (In Stock, Low Stock, etc.), and operational-state terms (Restock/Disposed/Refund/Reshipment) capitalized; Section 02, 04, and 05 titles reworded for concision; 04A/04B/04C/04D bodies tightened; Section 05 intro and sequence copy tightened.
4. **Freeze.** All four passes validated together — `tsc`, targeted ESLint, and `next build` passed; visually verified full-page at 1440 and 390 (no overflow, no heading collision, no layout/motion/responsive change at any point across all four passes).

CASE01 EN is now **FROZEN / APPROVED**. Commit: `feat(case01): finalize English case study` (see git log for hash). CASE01 is now **COMPLETE** in both locales.

---

# CASE03 — Manufacturing Operations Interface

Status: **ZH + EN V1 FROZEN / COMPLETE.**

## Positioning

Translating complex manufacturing specifications into clear, consistent interfaces for shop-floor and management operations. CASE03 intentionally uses plain-language, recruiter-facing storytelling — not technical/systems-engineering jargon — and is deliberately shorter than CASE01.

## Ownership (verified — do not broaden)

PM/System Analyst owned requirements, manufacturing workflows, business rules, and system logic.
Angela owned UI/UX translation of those specifications, information/interaction hierarchy, the visual system, desktop/tablet UI, frontend implementation, and the vector floorplan + SVG interaction.
Did NOT own: user research, client interviews, requirement definition, workflow/process design, or system/ERP/IoT architecture.

## NDA

Client identity, factory location, sensitive production data, original PM/SA flowcharts, and technical specification details are not public. Public client name: "Confidential Manufacturing Client." A source floorplan GIF asset was excluded entirely from evidence because a frame exposed "斗六倉" (a real facility name) — do not reintroduce it.

## Evidence (4 images, real screenshots only)

- Hero: management desktop + industrial tablet menu
- Section 04: operational UI pattern collage
- Section 05: warehouse spatial interface (single floorplan screenshot — a duplicate/secondary floorplan crop was evaluated and removed; do not restore it)
- Section 06: dark monitoring dashboard

## Localization

EN route uses the same frozen renderer (`CaseThreeFinalContent.tsx`) via `locale`/`zhHant` branching, not a separate build. EN copy is slightly shorter and faster to scan than ZH per the approved brief; UI screenshots remain Chinese (real evidence, not translated/fabricated). Section 07 label/heading in both locales: "07 — MY ROLE ACROSS THE SYSTEM" / "My Role Across the System" (ZH H2: 「我在這套系統中的角色」).

Commit: `084052c` — `feat(portfolio): add CASE03 manufacturing operations case`.

## Final polish (post-freeze) — complete

Public naming, finalized:
- Title: **Manufacturing Operations Interface**
- ZH title: **工廠現場與管理操作介面**
- Category: **Manufacturing Operations / 製造營運**
- Platform: **Web · Industrial Tablet**

Legacy visible naming ("IoT System" / "IoT 系統與數據儀表板") has been removed from all public-facing labels (homepage Selected Work card, `/work/iot-system`, CASE02's Next Project link). Route slug remains `/work/iot-system` intentionally — not renamed, to avoid unnecessary routing risk.

ZH + EN copy received a final recruiter-facing proofreading pass (Hero, Sections 03/05/06, Reflection). Ownership and NDA boundaries (see above) are unchanged by this polish.

Final polish commit: `f7b570e` — `fix(portfolio): polish CASE03 copy and naming`.

**Status remains FROZEN / COMPLETE.** Reopen only for production bugs or future evidence/material updates.

---

# CASE04 — LABO65

Product status: **ACTIVE / IN DEVELOPMENT.** Portfolio status: **ZH V1 FROZEN / APPROVED (2026-09-12).** Do not make further design, copy, layout, hierarchy, asset, or motion changes without a specific issue from a fresh audit. Do not claim release impact or metrics; this section remains the evidence authority for future updates.

## Freeze — 2026-09-12

CASE04 ZH V1 approved and frozen. Narrative order (Hero → Team & Role → Taking Over → UX Challenge → Design Principles → Guided Input → Async States & Recovery → Product Continuity → Stable/Flexible Brand Layer → Reflection), copy, evidence set, and hierarchy are locked.

**Confidentiality corrections made before freeze:** two issues found during final visual QA and fixed at the source-image level (no copy/layout changes required):
- A daily generation-quota counter ("成生數量 01/03") was visible in the Home screen header in 3 evidence instances (Hero, Async "Ready" state, Product Continuity "Home" state) — re-masked via in-place blur on the underlying assets.
- The login screen's brand-mask was a crude, hard-edged patch leaving a legible logo ghost — redone from the pristine 3× source with a cleaner in-place blur; now fully illegible.
- As a side effect, the Hero now uses the genuine not-yet-generated Home screen (previously an accidental byte-identical duplicate of the "Ready" evidence) — two distinct real screens instead of one reused twice.

Public evidence lives only under `public/images/case04/` (14 anonymized WebP files). Raw/high-res source PNGs (including client-identifying filenames and the no-credit/quota source) are archived outside the public and Git-tracked tree — do not restage them.

## Positioning

A mobile product UX/UI redesign taken over during active development.

Current recruiter-facing direction: "Restructuring an early-stage mobile product into a clearer, lighter, and more app-native experience while development was already in progress."

## Core design principle

少讀、少打、少滑、少等、不強迫
EN shorthand: Less reading. Less typing. Less scrolling. Less waiting. No forced steps.

## Project context

- Engineering had already been developing the product for roughly 1–2 weeks before UX/UI ownership was handed over.
- Existing technical foundations and some functional flows already existed.
- The design approach is not to restart the product from zero.
- UX/UI changes should prioritise usability impact, implementation feasibility, and development speed.
- Product is not yet released.

## Ownership boundaries

Do not claim: original product requirements defined from scratch by Angela; backend architecture; payment infrastructure / payment integration engineering; engineering implementation owned by Angela unless specifically confirmed; user research that did not happen.

Current confirmed design ownership: UX/UI redesign; flow restructuring where applicable; information hierarchy; app-native interaction direction; onboarding/registration simplification; questionnaire UX; generation/loading/failure/recovery states; Today/Home experience; player/listening-state UX; shared design system; Android-first UI with consistent iOS presentation; design decisions prepared for engineering implementation; feasibility discussion/collaboration with engineering.

## Ownership & scope clarification — 2026-09-11 (flow provenance update)

Source-of-truth clarification layered on top of the existing Project context / Ownership boundaries above — does not replace them.

### Team

Active product team:
- PM
- 1 full-stack engineer
- Angela as UI/UX Designer

### Role boundaries

**Client / PM** — product concept and business direction; requirements and scope coordination; project communication / prioritization.

**Full-stack Engineer** — translated the early client concept into the first functional UX flow / early build; owns technical implementation; frontend/backend engineering; existing technical foundations; payment integration / payment infrastructure; other engineering work unless explicitly confirmed otherwise.

**Angela — UI/UX Designer** — took over UX/UI after an early functional flow/build already existed; UX review of the existing experience; restructuring key flows where needed; information hierarchy; interaction design; app-native mobile direction; onboarding/profile setup simplification; questionnaire UX; generation/waiting/failure/recovery states; Today/Home; player/listening-state UX; shared design system; Android-first UI with consistent iOS presentation; direct feasibility collaboration with the full-stack engineer.

**Do not claim** Angela created the original product flow from scratch.

Approved framing: "The initial functional flow had already been translated from the client concept into an early build by the full-stack engineer. Angela took over the UX/UI work to simplify that experience, restructure key interactions, and build a more coherent mobile system around it."

### Early product scope

The earliest LABO65 concept was much broader and included: Home, personal energy analysis, personalized audio, healing plans, crystal-related experiences, physical LABO65 experiences, reading/knowledge content, subscription, member center.

### Product scope evolution

Crystal-related features are now removed from the current product direction. Do NOT claim Angela personally removed the crystal scope unless explicitly confirmed.

Approved framing: "The product scope evolved during development, with earlier concepts such as the crystal-related experience removed from the current app direction."

### Current product focus

The current app is increasingly focused around: account entry; personal / birth profile setup; daily state input; personalized audio generation; waiting / recovery states; listening; feedback / completion; listening history; repeat-use continuity.

### UX problem context

The product requires a substantial amount of personal input to generate personalized audio. Current source logic includes inputs such as: birth information, current needs/state, desired outcome, scene preference, natural sounds, instrument preference, other preference inputs. The system performs internal mapping/generation logic behind the scenes.

Portfolio implication: the user should not feel like they are configuring a complex AI engine or filling out one long technical form.

Approved problem statement: "LABO65 needed enough personal input to generate a meaningful result, but collecting that information risked turning the mobile experience into a long questionnaire."

Approved design challenge: "Make that complexity feel lighter without removing the information the system still needed."

Core principle unchanged: 少讀、少打、少滑、少等、不強迫

### Portfolio story direction

Complex product logic underneath → early functional flow/build → UX friction becomes visible → Angela takes over UX/UI → simplify input and interaction → add clear async / failure / recovery states → connect Home, generation, playback and history → establish a consistent mobile UI system.

Recruiter takeaway: "Angela took over an early functional product with complex input requirements, simplified how users move through it, designed missing states around asynchronous generation, and built a consistent mobile UI system in close collaboration with engineering."

### Status (reaffirmed)

CASE04 remains ACTIVE / IN DEVELOPMENT. Do not freeze final narrative yet. Do not claim release impact / metrics.

## Current UX problems identified

- Forms/flows too long
- Too much reading
- Too much scrolling
- Too much manual input
- Keyboard can cover fields/actions
- Experience feels too much like responsive web rather than a mobile app
- Generation waiting feels too passive
- Progression should not require unnecessary forced completion
- Recovery / leave-and-return states need to be clear

## Evidence log (evolving — not final section order)

1. Before / early engineering build
2. Onboarding and first-profile setup
3. Questionnaire simplification
4. Generating / in-progress / failed / ready states
5. Player / listening / completed states
6. Today / Home
7. Design system / shared components
8. Engineering constraints / feasibility decisions
9. Before → After comparisons
10. New screens and decisions added during ongoing development

**Evidence rule:** for every meaningful new design decision, record what existed before, what problem was identified, who defined the requirement, what Angela changed, why it was changed, any engineering constraint, and what was actually approved/implemented. Do not turn routine production details into portfolio evidence unless they demonstrate a meaningful UX/UI decision.

## Evidence update — 2026-09-11 (confirmed current product coverage)

Confirmed design/evidence update. This is a historical coverage snapshot; the current ZH V1 narrative and section selection are now implemented and FROZEN (see "Freeze — 2026-09-12" above).

**Current product coverage:**

01 — Account Entry
- Login
- Guest entry
- Login error
- Reset password
- Check-email confirmation
- Unregistered-email state
- Registration
- Account-created state
- Duplicate-email error
- Password validation
- Offline state

02 — Personal / Birth Profile Setup
- 4-step guided setup: Birth date → Time zone → Gender → Confirmation
- Building state
- Completed state
- Failed state
- Edit path exists

03 — Home
- Signed-in / not-yet-generated state
- Signed-in / today's soundscape available
- No-credit state
- Guest Home

04 — Today / Monthly Soundscape
- 6-step choice-based questionnaire
- Generating
- User can leave while generation continues
- Generation failure
- Offline failure
- Retry / later paths
- Player
- Pause / loop playback
- Post-listening feedback
- Listening completed
- Listening history

**Updated portfolio signals — CASE04 now has evidence for:**
1. Simplifying input-heavy flows
2. Guided multi-step task design
3. Async generation / waiting UX
4. Failure and recovery states
5. Guest / member / constrained product states
6. Playback and post-completion UX
7. Repeat-use continuity through listening history
8. A full product loop rather than isolated UI screens

**Current case story direction:**
Early engineering build → UX/UI takeover → simplify heavy and linear flows → establish guided interactions and state handling → connect onboarding, Home, generation, playback and history into a coherent mobile experience.

Core principle unchanged: 少讀、少打、少滑、少等、不強迫

Do not claim final product impact or release results yet. Product remains ACTIVE / IN DEVELOPMENT. CASE04 ZH V1 is built and FROZEN; its section structure should not be reopened without a specific issue.

## Product copy QA note (tracked — not actioned)

For later cleanup only; no product copy was changed as part of this evidence update. Check typo/terminology consistency across all current screens before any copy is finalized for CASE04 evidence use. Examples observed in current evidence: 成生/生成 inconsistency, 回来/回來 (simplified/traditional mixing), duplicated punctuation, and English annotation spelling. Resolve at copy-finalization time, not now.

## Delivery / brand constraint — 2026-09-11

Current delivery context: the product is moving quickly toward release, and UI/UX work needs to keep engineering moving rather than wait for a fully finalized visual brand — the client's final branding/art direction is still evolving.

Current visual-production approach: UX structure, interaction patterns, states, layout rules, tokens and components remain the stable layer. Some decorative/branded imagery is currently treated as a flexible, replaceable layer — AI-generated visuals may be used as provisional starting points to accelerate production, and Angela manually reviews, edits and refines those assets to fit the LABO65 UI system. Do not frame AI as owning the product design or final branding.

Approved framing: "Because the product was moving toward release before the brand direction was fully defined, I used AI-generated visuals as provisional production assets, then manually refined them to fit the evolving UI system and speed up delivery."

Design principle: "The product structure needed to stay stable even while the brand layer was still evolving."

Portfolio signal: decision-making under uncertainty / pragmatic delivery under time and branding constraints.

Do not claim: final brand ownership; completed brand strategy; that AI generated the app design; that current provisional imagery is final brand work.

CASE04 remains ACTIVE / IN DEVELOPMENT.

## Commercial confidentiality — 2026-09-11

Some LABO65 business/commercial strategy is confidential and must not appear in the public portfolio.

Default rule: if a detail is commercially sensitive and has not been explicitly approved for public use, exclude it.

Do not publicly disclose unless explicitly approved: pricing strategy; subscription/monetization strategy; credit/quota business rules; conversion targets; acquisition/go-to-market plans; commercial roadmap; unreleased business features; internal prioritization rationale tied to business strategy; proprietary market positioning/competitive strategy; client confidential commercial decisions; commercially sensitive logic inferred from internal documents.

Public CASE04 content should focus on: high-level product context; user-facing UX problems; UX/UI restructuring; interaction design; async/failure/recovery states; design-system work; app-native mobile experience; delivery constraints; collaboration with PM and engineering.

Treat internal product documents as research/source-of-truth only, not automatically public case-study content. Do not infer publishable business strategy from internal source documents or UI states. If uncertain whether a detail is business-sensitive, omit it from the public portfolio until Angela explicitly approves it.

CASE04 remains ACTIVE / IN DEVELOPMENT.

## Next action (CASE04-specific)

CASE04 ZH V1 is frozen. Future product updates should be added to this evidence log only when they are portfolio-worthy; do not expose confidential commercial strategy or claim release impact. Reopen the frozen case only for a real bug, factual error, confidentiality issue, or regression.

---

# WORKFLOW RULE

Do not reopen CASE01, CASE02, CASE03, or CASE04 (ZH V1) discovery. Do not ask the user to repeat ownership, positioning, evidence strategy, project roles, or cross-case differentiation — the sections above are source of truth. Preserve all four cases unless a genuine bug or factual issue appears.

---

# NEXT ACTION

**CASE01 is COMPLETE / PRODUCTION.** Both ZH and EN are FROZEN / APPROVED, merged to `main` in the connected clone (`/Users/angela/angela-portfolio-public`), and deployed live at https://angela-portfolio-phi.vercel.app/ (production SHA `e7474c674ab92d7401019dff2455dadef3fc8750`). Production smoke QA passed — see CURRENT STATE above for the checklist. See git log for local commit hashes; see this file's own changelog sections above for the full history (Phases 1–5, positioning correction, factual correction, final freeze cleanup, EN localization + pricing + micro-copy passes, Home/rail/CASE04-naming sync, migration to the connected clone, Production promotion). `artifacts/case01-v3-phase5-zh-copy-manifest.md` and `artifacts/case01-v3-en-final-copy-manifest.md` (both gitignored, local-only) remain the reference copy records for each locale. **Do not reopen CASE01 discovery, redesign, or copy (either locale) without a specific new instruction.**

**Next portfolio priority: CASE02 EN V2 final visual approval.** CASE02 ZH V2 is FROZEN; CASE02 EN V2 is IMPLEMENTED / QA PASSED but **not yet frozen** — pending Angela's own visual review before it can be marked FROZEN (see the CASE02 section above). Do not reopen CASE02 discovery or restructure without a specific new instruction. CASE03 and CASE04 ZH V1 remain complete and frozen. Selected Work later includes a **Foresight Realtors** case.

Note: this commit also carried necessary shared case-study infrastructure (Previous/Next cross-navigation, locale-aware a11y labels, small CASE02/03/04 metadata-label localization, a Home-page visual-asset feature) that was already uncommitted and load-bearing for CASE01's own dependency chain — see the commit message and this file's freeze-commit changelog entry for the full file list and reasoning. `AGENTS.md`, `CLAUDE.md`, `app/globals.css`, `SiteHeader.tsx`, `.impeccable/`, and other still-uncommitted files remain genuinely unrelated and were deliberately left out of that commit.
