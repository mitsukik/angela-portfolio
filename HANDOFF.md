# PORTFOLIO HANDOFF — CURRENT STATE

Last updated: 2026-09-27
Status: PRODUCTION / VERIFIED / FROZEN

This file is the source of truth for the current portfolio state.

Before making portfolio recommendations or code changes:
1. Read this HANDOFF first.
2. Do not reopen frozen work without a concrete reason.
3. Do not assume older chat history is newer than this file.

---

# 0. LATEST COMPLETION — INTERACTION & MOTION UPGRADE (2026-09-27)

Explicitly authorized by Angela (autonomous task). Hero reopened for
interaction only — copy, typography, composition unchanged. Production commits
`83d694a` + `5e73944` + `b777667` on the public repo (`~/angela-portfolio-public`) `main`; code NOT
mirrored into this work repo (it holds unrelated uncommitted WIP in the
same files) — migrate from the public repo before any further work here.

Motion grammar (keep): Resolve / Connect / Reveal / Switch / Track / Rest.
Tokens in `app/globals.css :root` (`--motion-duration-instant…emphasis/exit`,
`--motion-distance-*`). Budget: max 1 primary + 1 supporting motion; every
animation ends in a stable state; no endless loops.

What exists now (do not regress):
- `CaseEvidenceViewer.tsx` — ONE global evidence viewer (provider in
  `CaseStudyPrototype`), used by `Shot`, `FlowEvidence`, CASE02 images,
  CASE03 images, CASE04 phone/composed evidence, State Scrubber. Fit /
  actual-size, Escape, focus return, focus trap, Lenis stopped while open.
- `ChapterRegister.tsx` — numeral rail opens into labelled index on
  hover/focus (labels read from each section's `.cf-section-label`, no
  second copy source); active rule = reading progress; mobile `03 / 05`
  control + sheet (hides while scrolling down, returns on pause/scroll up).
- Selected Work — `SCENE_VH` 70 per project (track 575vh → 352vh), single
  -edge wipe (incoming covers outgoing), styles written from one
  ScrollTrigger (no per-scroll React state). Mobile stacked (no pin); reduced motion = pinned stage
  with instant switches. Hero track 170svh → 135svh (mobile 115svh).
- Home Hero background RESTORED to pre-upgrade (commit `b777667`,
  Angela's request): `Hero.tsx` is identical to `f0daf81` except the
  shorter track (115/135svh) and renders the original
  `<HeroBackgroundShapes fill />`. System Resolve was removed entirely
  (it was that background). Do not re-apply it to the Hero.
- About background RESTORED to pre-upgrade (commit `5e73944`, Angela's
  request): `HeroBackgroundShapes.tsx` + `AboutV2.tsx` are byte-identical
  to `f0daf81` (continuous per-cell re-rolls, full strength). Do not apply
  System Resolve / clear bands / dimming to About.
- Home header tone RESTORED to the pre-upgrade rule (`SelectedWork.tsx`
  header-tone note): header takes the next project's tone 0.03 scene
  units before its wipe; mobile stacked list flips per project again via
  the original formula (progress × 4.35 + 0.25). Stage chrome (label /
  rail) still follows the wipe edge.
- About How I Work panels play once to their rest frame, replay on hover;
  Beyond chain builds once in view and stays built.
- `RouteTransition.tsx` — single 300ms CSS reveal (was ~670ms), wordmark on
  first arrival only, timeout fallback so content is never left covered.
  Language switch (`navigationIntent.ts`) skips the curtain and restores
  the same heading/figure offset (or Selected Work track progress).
- `StateScrubber.tsx` — CASE04 §03 recovery sequence (Generating → Failed,
  answers preserved → Playback error, progress preserved) as WAI-ARIA tabs.
  CASE01 not given a scrubber: its inventory states exist only as columns
  in one screenshot (would fabricate states).
- Case footer — larger Next entry (number, title, description, preview,
  stretched CTA); Previous stays quiet.
- Removed: legacy-only marquee loop (static label now), ShowcaseMedia
  pointer parallax, language-option hover jitter, CASE04 scene-card
  opacity (contrast fix). Light-surface focus ring = ink.

Known accepted a11y note unchanged: CASE02 lavender-on-paper (~1.9:1).

---

# 1. GLOBAL PORTFOLIO STATUS

Current production portfolio has passed final QA.

## FINAL STATUS

- Portfolio: PRODUCTION / VERIFIED / FROZEN
- ZH: PASS
- EN: PASS
- Desktop QA: PASS
- Tablet QA: PASS
- Mobile QA: PASS
- TypeScript: PASS
- ESLint authored source: PASS
- Production build: PASS
- Production smoke test: PASS
- CASE confidentiality review: PASS
- Global identity metadata: PASS

Current production positioning:

ZH:
資深 UI/UX 設計師

EN:
Senior UI/UX Designer

Do not globally reposition Angela as "Product Designer".

Project-specific historical role labels may still use:
- UI/UX Designer
- Product Designer
- UX/UI Designer · Frontend Support
etc.

These are project-role attributions and are not contradictions with the global Senior UI/UX Designer positioning.

---

# 2. GLOBAL POSITIONING

Primary recruiter positioning:

Senior UI/UX Designer with strong experience in:
- complex systems
- B2B products
- enterprise products
- dashboards / back-office systems
- UX/UI redesign
- interaction/state design
- implementation collaboration
- front-end-aware design execution

Do not position Angela primarily as:
- App specialist
- pure visual/UI designer
- pure Product Designer
- UX researcher
- front-end engineer

Mobile product experience is an extension of the core UI/UX positioning, not the sole identity.

---

# 3. GLOBAL METADATA — FINAL

Production metadata hotfix completed on 2026-09-20.

Commit:
`487dcb5`
`fix(meta): align portfolio identity with senior ui ux positioning`

Production values:

## ZH Home `/`

Title:
`Angela Yu | 資深 UI/UX 設計師`

Description:
`資深 UI/UX 設計師 Angela Yu 的作品集，聚焦複雜系統、B2B 與企業產品的 UX/UI 設計與落地。`

## EN Home `/en`

Title:
`Angela Yu | Senior UI/UX Designer`

Description:
`Portfolio of Senior UI/UX Designer Angela Yu, focused on complex systems, B2B, and enterprise UX/UI design and delivery.`

## ZH About `/about`

Title:
`關於 | Angela Yu`

Description:
`關於資深 UI/UX 設計師 Angela Yu，以及她在複雜系統、B2B 與企業產品設計中的經驗與工作方式。`

## EN About `/en/about`

Title:
`About | Angela Yu`

Description:
`About Senior UI/UX Designer Angela Yu, her experience, and her approach to complex systems, B2B, and enterprise product design.`

Important:
Do NOT globally replace every occurrence of "Product Designer".

CASE/project-specific role labels remain factual to each project.

There is currently no OG/Twitter metadata.
This is NOT a release blocker.
It may be added later as an optional social-sharing/SEO enhancement.

---

# 4. CASE STATUS

## CASE01 — CONTENT + VISUAL CURATION COMPLETE (2026-09-23)

Status: content rewrite and visual curation committed. No open CASE01 task.

Positioning:
Business Rules → Product Architecture → Multi-role IA → Workflow → State / Validation → Engineering Implementation.

Structure (ZH + EN, `CaseOneFinalContent.tsx` + CASE01 hero in `CaseStudyPrototype.tsx`):
Hero/Overview → 01 The Challenge → 02 The Approach → 03 Designing the System → 04 From Design to Delivery → 05 Outcome.

Curated evidence (7 visual blocks; old 03A–03E feature gallery, principle lines, Q&A block and Outcome scope strip removed — do not restore):
1. 01 — Ecosystem diagram, standalone, always visible
2. 03 — Flow switcher: Inventory Status Flow ↔ Pricing & Revenue Logic (`FlowTabs.tsx`: md+ tap/click tabs with Arrow/Home/End; mobile stacks both diagrams, no nested swipe)
3. Inventory Management — inventory list + inventory log
4. Agent–Streamer Collaboration
5. Order Management
6. After-sales State Handling (return detail: Restock / Disposed / refund / reshipment)
7. Consumer Checkout State (warning + zero-quantity / disabled Checkout excerpts)
Sections 02 / 04 / 05 carry no images. EN desktop height 16,721px → 11,243px (−32.8%), approved as-is — do not shrink further at the cost of legibility.

Diagrams: public versions are the corrected `case01_{CE,ISF,PRL}_{eng,chi}02.webp` (no "KEY DESIGN DECISION"/case eyebrows, no "seamless"/一站式, no WMS module corner, overselling not framed as prevented, minimum price "Set by Supplier" / 由供應商設定, rule ≥ 最低售價). Removed from the page: Backend-state → Consumer diagram (inaccurate overselling / concurrency claims), Supplier dashboard (placeholder KPI-like figures), pricing form, invalid-pricing screenshot, streamer filters, exchange-validation screenshot.

Legacy routes: the noindexed `/design-samples/case-final-dark` and `/case-final-light` render the legacy (non-v3) branch via `caseFinalMedia.ts`, which now points to the same corrected `*02` diagrams (decision 0 Shared inventory → ISF, decision 1 Pricing rules → PRL; the old Backend-state diagram is unmapped). The old `*01.webp` diagrams are deleted. `case01_inventory_showcase_sample.webp` is still referenced there as the legacy showcase figure (not factually incorrect; has a baked-in portfolio headline).

Locked facts:
- Role: UI/UX Designer (corrected by Angela 2026-09-23 — never use a "Lead" title for CASE01). Timeline: May 2025 — Apr 2026 · 12 months.
- Team: Angela + 1 UI Designer + 2 Engineers; PM joined Oct 2025 (later-stage coordination + QA only). NO SA — never mention one.
- Requirements came from Client meetings/verbal explanation — no PRD.
- Angela designed Platform / Supplier / Agent Backends + Consumer Web Storefront; the other UI Designer extended the system into Consumer Mobile + Streamer Backend.
- Payment delay = local payment partner slow (not a checkout/API redesign). Local registration completed; category restrictions reduced listable items.
- Outcome: Designed & Developed, working frontend + backend delivered; Client changed business strategy → no commercial operation. No KPIs.

CTAs (hero, repeated in Outcome):
- Original Engineering Demo: https://sc-demo.sdxdevelop.com/zh-tw (engineers' original implementation, used by PM/Client for review)
- Public Admin Prototype: `https://case01-admin.vercel.app/` (`PORTFOLIO_PROTOTYPE_URL` in `CaseOneFinalContent.tsx`; source `~/case01-admin`). Label "操作後台原型 ↗ / Open Admin Prototype ↗", note "為作品集展示重新建構 / Reconstructed for portfolio presentation". Shown in both Hero and Outcome (intentional). Status: publicly accessible; portfolio reconstruction / interactive prototype; supporting evidence only. Never present it as the original production deployment, and never imply full Figma-to-code fidelity or commercial launch/adoption.

Data:
`data/projects.ts` CASE01 `caseStudy` / `caseStudyEn` condensed to the confirmed facts (still serialized into page source).
Its `metadata` dict also drives the Home Selected Work card: CASE01 Role = UI/UX DESIGNER, matching the CASE01 Hero and the CASE02–04 cards.

## CASE02 — FROZEN

Positioning:
Brand / business / IA / commercial web experience.

Projects:
- SDX
- Charming
- NATEX

Purpose in portfolio:
Proves:
- translating business needs into web structure
- information architecture
- UX/UI execution
- commercial web delivery
- frontend-aware collaboration/execution

Home claim:
3 commercial websites launched.

This matches the three sub-projects shown in CASE02.

STATUS:
COMPLETE / PRODUCTION / FROZEN

Do not reopen without a concrete reason.

---

## CASE03 — PRODUCTION REWRITE COMPLETE (2026-09-27)

Status: rewritten, deployed, live QA PASS. No open CASE03 task.

Production commit: `f0daf81` `refactor(case03): sharpen production delivery story` (public repo `main`; mirrored on work branch as `026ce40`).

Positioning: CASE01 = product / system logic; CASE03 = real enterprise delivery / implementation.

Structure (ZH + EN, `CaseThreeFinalContent.tsx` + CASE03 branches in `CaseStudyPrototype.tsx`, 5 chapters):
00 Overview → 01 The Challenge (One system, two operating contexts) → 02 My Role & Approach (delivery flow grouped SA & client / owned by me / with the team) → 03 Key Design Decisions (01 Filter → Table / List → Form → Confirm; 02 storage codes → spatial floor-plan selector, full-width key evidence) → 04 From Prototype to Production → 05 Production & Iteration (one real post-launch example: tablet button relocation + flow split).

Removed (do not restore): generic lifecycle ring, 10-step pipeline, system-architecture/module inventory, hero tag row, Problem/Decision labels.

Evidence (only these three): `case03-hero-desktop-tablet.webp`, `case03-operations-collage.webp`, `case03-warehouse-floorplan.webp`. `case03-monitoring-dashboard.webp` belongs to an unrelated identifiable client — deleted from public (production now 404). Never restore.

Locked facts:
- Role: UI/UX Designer · Frontend Implementation. Timeline: 2023 — 2024. Platform: Web · Internal Operations System. Status: Deployed · In Production Use.
- No dedicated frontend engineer; Angela did UI/UX + HTML/CSS/JS frontend UI, staged client testing, revision, backend-integration/QA participation, deployment involvement, post-launch iteration.
- SA + client defined requirements, system rules and factory context. NO PM — never reintroduce one. Collaborators: SA, backend engineer(s), client/factory stakeholders, QA.
- No KPIs, no formal research/interviews claims. Client/factory identity confidential.
- Prototype CTA: `/demos/case03/demo01/demo_01.html` (sanitized single-feature demo).

Shared component: `EvidenceShot.tsx` (`Shot`) now serves CASE01 + CASE03.

Known non-blocking: Home card metadata for CASE03 (`data/projects.ts`) still says Platform "Web · Industrial Tablet" (Home not in scope of the rewrite).

---

# 5. CASE04 V3 — CURRENT APPROVED CHECKPOINT

STATUS:
PUBLIC / VERIFIED / FROZEN CURRENT CHECKPOINT

Important:
The underlying product itself is NOT finished.
Design/development is ongoing.

CASE04 is a living case study, but do not update the portfolio simply because UI visuals change.

Only reopen the public story when new evidence materially changes:
- problem
- Angela's ownership
- design decision
- key trade-off
- current outcome

---

## CASE04 PUBLIC IDENTITY

ZH:
行動療癒產品

EN:
Mobile Wellness Product

Never publicly identify the product as LABO65.

---

## CASE04 SOURCE OF TRUTH

Latest product evidence:
`LABO65 APP_20260919`

Historical Before:
`screenshots-20260908-AppUI截圖`

The Sep8 screenshots are confirmed:
engineer-built functional UI BEFORE Angela took over the UX/UI redesign.

---

## CASE04 POSITIONING

Core story:

Angela joined after an early functional product already existed.

Her contribution is the UX/UI redesign and product-design layer:

- UX restructuring
- information hierarchy
- interaction design
- state design
- recovery handling
- preservation of user effort/progress
- product continuity
- reusable interaction patterns
- engineering feasibility alignment

Do NOT imply Angela originated:
- the original product concept
- the complete business concept
- all product functionality

Approved ownership framing:

ZH:
`我加入時，產品已有可運作的早期版本；我的工作從既有基礎出發，重整 UX/UI、互動與狀態設計，並持續與工程確認實作可行性。`

EN:
`When I joined, the product already had a functional early version. I worked from that foundation to restructure the UX/UI, interaction and state design, while continuously validating feasibility with engineering.`

---

## CASE04 V3 PUBLIC ARCHITECTURE

00 — Hero

01 — Context & Role

02 — From Existing Version to a Guided Flow

03 — Interaction Decisions

04 — State-Aware Product

05 — State & Recovery Design

06 — Product Continuity

07 — Reusable Patterns & Key Trade-offs

08 — Current Outcome

Closing

Do not revert to older CASE04 architectures from previous chats/HANDOFF history.

---

## CASE04 STRONGEST STORY

The strongest senior-level proof is:

### Generation failure

Questionnaire input is preserved.

The user does not need to repeat the input flow after a failure.

### Playback failure

Soundscape/playback progress is preserved.

The user does not lose listening progress after playback failure.

Shared design principle:

`Recovery should protect effort the user has already invested.`

ZH concept:
`發生錯誤時，優先保護使用者已經投入的時間與進度。`

This is a stronger story than simply saying Angela designed error/loading states.

---

## CASE04 SECTION 02

Do NOT hardcode an exact step count into the main story.

Approved concept:

ZH:
`從一個長頁面，到分階段的引導式流程`

EN:
`From an Existing Version to a Guided Flow`

Reason:
The active product may continue changing from 7 steps to another number.

The portfolio story should remain stable.

---

## CASE04 SECTION 03

Public interaction evidence focuses on:
- slider + emotion selection
- radial desired-state selection
- scene/context cards
- optional multi-select patterns

Do NOT publicly use the proprietary intermediate-result mapping screen.

Do NOT automatically use the Step01 radar as primary portfolio evidence unless its interaction clarity is later validated.

---

## CASE04 SECTION 04

State-Aware Product evidence uses lifecycle states such as:

- Guest
- Ready
- Listening
- Completed

Do NOT use quota/commercial entitlement as the main public story.

---

## CASE04 SECTION 05

Current title:

State & Recovery Design

This is one of the strongest sections of CASE04.

Keep the parallel:

Generation failure
→ protects INPUT effort

Playback failure
→ protects LISTENING progress

Do not reduce this section back to generic:
"Async States & Recovery"
or simply:
"Error Handling"

---

## CASE04 SECTION 06

Product continuity remains structurally:

Input
→ Generate
→ Listen
→ Feedback
→ History

Do not claim observed repeat behavior.

This is a product-structure claim, not a retention claim.

---

## CASE04 SECTION 07

Reusable patterns + evidence-supported trade-offs.

Do not claim a formal:
- Design System
- token architecture
- component library
- literal shared engineering component

unless future code/evidence directly supports that claim.

Current portfolio claim is about reusable interaction/state patterns.

---

## CASE04 SECTION 08

Current Outcome.

This is NOT:
Launch Results
or
Business Results.

Supported claims include:
- redesign covers the core generation lifecycle
- state coverage extends beyond the happy path
- generation + playback have explicit recovery handling
- experience connects input → generation → playback → feedback → history
- patterns are used consistently across multiple flows

Status line must remain explicit:

EN:
`Current status: design and development are ongoing.`

Do not claim:
- launch
- retention
- conversion
- completion-rate improvement
- user satisfaction improvement
- support-ticket reduction
- revenue/business impact

without real evidence.

---

# 6. CASE04 CONFIDENTIALITY RULES

NEVER publicly expose:

- LABO65
- Five-Element / 五行
- 能量結構
- 命理結構
- chakra / 脈輪 mapping
- Hz mapping
- quota / generation allowance
- pricing
- subscription
- membership tiers
- monetization
- payment logic
- GTM
- roadmap logic
- proprietary personalization/generation logic
- commercially sensitive product strategy

Friends & Family is NOT currently part of the main public CASE04 story.

The Step04 proprietary intermediate result is NOT public evidence.

Do not casually restore archived CASE04 assets into `/public`.

## Approved narrow exception (2026-09-23): two public prototype links

Angela explicitly approved a **limited** confidentiality exception — do not
generalize it and do not treat it as blocking the same two URLs again in a
future session.

> LABO65 may be disclosed only through the approved public prototype links
> and within those prototype destinations. The CASE04 portfolio itself
> remains anonymized as 行動療癒產品 / Mobile Wellness Product.

**Publicly linked** (added to the CASE04 Hero/opening area, both locales):

- App Prototype — `https://labo65-app.vercel.app/`
- Landing Page Prototype — `https://labo65-landing.vercel.app/`

Angela explicitly accepted that:
- `labo65` is visible in the URL / href / browser status-bar preview
- the external prototype sites themselves may show LABO65 branding
- clicking either link reveals the product name

**The exception is scoped to these two URLs/hrefs only.** It does NOT permit:
- renaming CASE04 to LABO65 anywhere in the portfolio
- adding "LABO65" to CASE04 body copy, headings, or captions
- adding "LABO65" to portfolio metadata (page `<title>`, description, etc.)
- adding LABO65 branding to portfolio screenshots/evidence (separate approval required)
- restoring previously anonymized LABO65 portfolio assets
- assuming any other CASE04 confidentiality restriction has been lifted — Five-Element/五行, chakra/脈輪, Hz mapping, quota/generation allowance, pricing, subscription/membership, monetization, payment logic, and commercially sensitive strategy all remain in force unchanged

Public CASE04 identity remains unchanged: ZH 行動療癒產品 · EN Mobile Wellness Product.

Implementation: two compact `case-link` CTAs in the CASE04 Hero/opening
summary (`CaseStudyPrototype.tsx`, `isCaseFourV1` branch) — App Prototype
(`cf-accent`, primary) and Landing Page Prototype (`cf-dim`, secondary),
`target="_blank"` + `rel="noopener noreferrer"`. No new prototype section,
no CASE04 architecture/copy/evidence change beyond these two links.

---

# 7. CASE04 PUBLIC-ASSET STATUS

CASE04 V3 production asset hygiene has passed.

Current public directory contains only intentionally public-safe assets.

Old unsafe/superseded CASE04 assets were removed from the public path.

Production verification confirmed:

- current assets return successfully
- removed unsafe assets return 404
- no old direct-URL leak remains

One old unsafe asset had previously been directly reachable in production.
This was fixed during CASE04 V3 release.

Do not restore old archived assets into public without a new confidentiality review.

---

# 8. CASE04 V3 RELEASE REFERENCES

Private/work repo implementation checkpoint:

Implementation commit:
`a4eb701`
`feat(case04): ship v3 mobile product case study`

HANDOFF checkpoint:
`7045439`
`docs(portfolio): record CASE04 v3 checkpoint`

Production migration commit:
`51438b5`
`feat(case04): migrate v3 mobile product case study`

Production result:
CASE04 V3 PUBLIC / VERIFIED

---

# 9. DEPLOYMENT TOPOLOGY

Important:

The working/private repo history and production-connected repo history are disconnected.

Do NOT assume pushing the work-repo feature branch deploys production.

Established production workflow:

working/private repo
→ migrate approved changes
→ `/Users/angela/angela-portfolio-public`
→ `main`
→ push production-connected origin
→ Vercel deployment
→ production smoke test

Never force-push merely to bridge the disconnected histories.

Always inspect the production repo working tree first because other portfolio work may be pending there.

---

# 10. PORTFOLIO FREEZE RULE

As of 2026-09-20:

PORTFOLIO FREEZE QA — PASS

Do not keep polishing the portfolio simply because another visual variation is possible.

Only reopen frozen production work for:

1. factual error
2. confidentiality/privacy issue
3. broken route/asset/layout
4. meaningful recruiter/hiring-manager feedback
5. meaningful new project evidence
6. important accessibility/responsive defect
7. deliberate future portfolio strategy change

Minor visual preference alone is not enough.

---

# 11. CURRENT JOB-SEARCH PHASE

Portfolio-building phase is complete for the current cycle.

Current priority should move to:

1. job applications
2. interview preparation
3. recruiter/hiring-manager feedback
4. targeted portfolio/resume changes only when evidence supports them

Do not default back into endless portfolio polishing.

Current professional identity for job search:

`Senior UI/UX Designer`

Portfolio supporting strengths:
- complex systems
- B2B / enterprise
- UX/UI execution
- implementation awareness
- engineering collaboration
- state/recovery/system thinking
- mobile product redesign as an extension of core experience

---

# 12. AGENT RULE

For any future portfolio chat/session:

READ THIS HANDOFF FIRST.

Treat:
CASE01 = frozen
CASE02 = frozen
CASE03 = production rewrite complete (2026-09-27), frozen
CASE04 V3 = frozen current public checkpoint

Do not tell Angela an old pending task still needs doing if this HANDOFF marks it complete.

If newer evidence conflicts with this file:
1. verify the newer evidence
2. explain the conflict
3. only then update HANDOFF

Do not silently resurrect obsolete plans from old chats.

---

# 13. COPY / "AI-LIKE" LANGUAGE NOTE

Known non-blocking issue:

Some portfolio copy can feel slightly AI-polished / overly structured.

This is primarily a WRITING issue, not a visual-design issue.

Current assessment:
- overall AI feel is low/moderate, not severe
- the portfolio does NOT visually look like a generic AI-generated website
- the main signal comes from copy that is too tidy, abstract, or repeatedly uses polished UX terminology

Patterns to watch:

- repeated abstract terms such as:
  - 清楚
  - 流程
  - 狀態
  - 體驗
  - 一致性
  - 轉譯
  - 可操作
  - 可實作
  - context
  - validation
  - system state
  - key trade-off

- overly perfect section-label language
- several consecutive sentences using the same:
  Problem → Decision → Outcome
  rhythm
- generic senior-design language that could apply to many projects
- copy that explains UX theory instead of describing what Angela actually saw and did

CASE04 is currently the most likely case to feel slightly AI-polished because its structure and section language are especially systematic.

CASE01 / CASE03 generally feel more grounded because they contain more concrete operational constraints, implementation details, and real project evidence.

## IMPORTANT

This is NOT currently a release blocker.

Do NOT reopen:
- layout
- evidence
- motion
- case architecture
- responsive design
- visual design

solely because of this note.

Portfolio remains:

PRODUCTION / VERIFIED / FROZEN

Only perform a language polish pass when:
- recruiter/hiring-manager feedback indicates it matters
- Angela deliberately starts a copy-humanization pass
- a specific section reads unnaturally during interview preparation

## FUTURE COPY-HUMANIZATION RULE

If reopened, revise only the weakest ~10–20% of copy.

Do NOT rewrite the whole portfolio.

Preferred writing pattern:

「我看到什麼問題」
→
「我怎麼處理」
→
「為什麼這樣做」

Use concrete project language before UX terminology.

Prefer:

「原本所有選項都放在同一頁，第一次使用時很難知道要先看哪裡。」

over:

「重新建立清晰且具一致性的資訊層級與引導式體驗。」

Prefer:

「生成失敗後，不讓使用者重新填一次問卷。」

over:

「透過 resilient recovery pattern 保護使用者投入的 effort。」

UX terminology can remain where useful, but it should support the evidence rather than replace it.

Angela's natural explanation should be the source voice.
AI may help:
- shorten
- proofread
- organize
- translate

but should not replace Angela's own reasoning with generic UX language.

After any future language pass:
- preserve all factual claims
- preserve ownership boundaries
- preserve confidentiality rules
- preserve approved evidence
- QA ZH/EN parity
- freeze again after review
