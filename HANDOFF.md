# CURRENT STATE

- Branch: `feat/case02-en-localization`.
- Foundation tag: `v3-design-system-foundation`.
- Current task: none. **CASE01 (ZH + EN), CASE02 (ZH + EN), and CASE03 (ZH + EN) are all FROZEN.** Do not reopen discovery on any of these cases — see the ownership/positioning/evidence sections below, which are source of truth.
- Review routes: `/design-samples/case-final-01` (CASE01 ZH), `/en/design-samples/case-final-01` (CASE01 EN), `/design-samples/case-final-02` (CASE02 ZH), `/en/design-samples/case-final-02` (CASE02 EN), `/design-samples/case-final-03` (CASE03 ZH), `/en/design-samples/case-final-03` (CASE03 EN).
- **Continuity note:** this file was fully rewritten (not appended) to replace stale pre-freeze CASE02 status and a dropped prior history chain. Older history (Homepage Visual Polish V3/V3.1/V3.2, Lavender token checkpoint, About V2, CASE01 Responsive QA) is not reconstructed here — git log and topic branches remain the authoritative record per AGENTS.md's "if documentation conflicts with Git, investigate and report" rule.

---

# CASE02 — Brand & Web Experience

## Positioning

CASE02 is **Brand & Web Experience** — a multi-project case covering Shun De Xing / SDX, Charming Clinic, and NATEX. It complements CASE01 rather than competing with it:

- **CASE01 proves:** complex systems, workflows, data-heavy UI, multi-role/product thinking.
- **CASE02 proves:** Information Architecture, Client Requirement Discovery, UX/UI Design, Brand Communication, Content Direction, Responsive Web, Frontend execution on selected projects, and the ability to adapt across different industries.

Core story: **Different business contexts → different information priorities → adapted web experiences.**

## Status: ZH — FROZEN / COMPLETE

Do not change unless a real bug is found, factual information is wrong, an asset is broken, or production integration requires a technical fix.

Approved structure (do not reorder or restructure): Hero → Overview → Business Needs → Web Structure → SDX Project Story → Charming Clinic Project Story → NATEX Project Story → Shared design principles → Responsive evidence → Contribution matrix → Reflection → section navigation.

Evidence: real screenshots only, official live-site evidence, no fabricated UI/research/metrics. Evidence crops are finalized.

Motion: restrained Hero evidence entrance, `SectionHeading` reveal, evidence-unit reveal, `prefers-reduced-motion` support. No parallax / scroll-jacking / complex timelines.

Main freeze commit: `a09ffdb5143dacc49a315b4326d59f17e1b0210b` — evidence, balance, responsive presentation, and visual structure finalized. Subsequent approved enhancements (links, viewer, EN) layered on top without reopening this.

## Status: EN — FROZEN / COMPLETE

Route: `/en/design-samples/case-final-02`. Uses the same frozen CASE02 renderer (`CaseTwoFinalContent.tsx`) via locale-driven content (`locale` prop, `zhHant` branching) — not a separate redesign or duplicate implementation.

English copy has been localized and proofread for recruiter readability (natural phrasing, not literal translation). Real project screenshots remain Chinese where the actual live sites are Chinese — do not generate fake translated screenshots.

Commit: `0838c55` — `feat(portfolio): add English CASE02 localization`.

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

Status: **ZH and EN both FROZEN.** Do not resume polishing without a specific issue from a fresh audit.

Most recent CASE01-specific fix: English evidence-image correction (separate from CASE02 history) — English CASE01 now uses the correct English versions of the CE, ISF, PRL, and BE evidence diagrams instead of the Chinese-labeled originals.
Commit: `8ef49966fa61ce09772bb9a25436de5f3e315716` — `fix(portfolio): use English evidence images in CASE01`.

Prior CASE01 ZH freeze checklist (Decision 03 terminology aligned to evidenced UI, real pricing evidence, 10-edit copy proofread, responsive QA at 1920/1440/820/390) remains valid — see git log on this file's history for detail if needed.

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

Status: **ACTIVE / IN DEVELOPMENT.** Portfolio status: **V1 case study not yet implemented** — do not build the CASE04 portfolio page, write final case-study copy, or freeze section structure until noted otherwise. This section is an active evidence log, not a frozen case record.

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

Confirmed design/evidence update. This is a coverage snapshot, not a narrative freeze — CASE04 V1 narrative and section selection are still undecided.

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

Do not claim final product impact or release results yet. Product remains ACTIVE / IN DEVELOPMENT. CASE04 is still not built as a portfolio page and section structure is still not frozen.

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

## Next action (CASE04-specific)

After the next LABO65 engineering meeting: update this evidence log with new decisions/screens, identify which changes are portfolio-worthy, and only then decide the CASE04 V1 narrative and evidence selection.

---

# WORKFLOW RULE

Do not reopen CASE01, CASE02, or CASE03 discovery. Do not ask the user to repeat ownership, positioning, evidence strategy, project roles, or cross-case differentiation — the sections above are source of truth. Preserve all three cases unless a genuine bug or factual issue appears.

---

# NEXT ACTION

No active task. CASE01, CASE02, and CASE03 (ZH + EN) are all complete and frozen. Next portfolio priority: **CASE04 (LABO65) V1**, while the product is still in active development. Selected Work later includes a **Foresight Realtors** case. A whole-site skills audit (accessibility, typography, design-guidelines, pre-launch coherence) happens only after Portfolio V1 coverage (all four case studies) is complete — do not run it early.

Note: the worktree has unrelated uncommitted changes (`AGENTS.md`, `CLAUDE.md`, `app/globals.css`, `ReadingSection.tsx`, `SiteHeader.tsx`, `.impeccable/`, `artifacts/case01-*.png`) and untracked `case-final-04`/`en/case-final-04` scaffolding, none of which were reviewed or authored as part of the CASE01/CASE02/CASE03 work recorded above. A future session should run `git status`/`git diff` to assess their state before treating them as either in-progress work or safe to discard.
