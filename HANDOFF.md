# CURRENT STATE

- Branch: `feat/case02-en-localization`.
- Foundation tag: `v3-design-system-foundation`.
- Current task: none. **CASE01 (ZH + EN) and CASE02 (ZH + EN) are all FROZEN.** Do not reopen discovery on either case — see the ownership/positioning/evidence sections below, which are source of truth.
- Review routes: `/design-samples/case-final-01` (CASE01 ZH), `/en/design-samples/case-final-01` (CASE01 EN), `/design-samples/case-final-02` (CASE02 ZH), `/en/design-samples/case-final-02` (CASE02 EN).
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

# WORKFLOW RULE

Do not reopen CASE01 or CASE02 discovery. Do not ask the user to repeat ownership, positioning, evidence strategy, project roles, or CASE01-vs-CASE02 differentiation — the sections above are source of truth. Preserve both cases unless a genuine bug or factual issue appears.

---

# NEXT ACTION

No active task. CASE01 and CASE02 (ZH + EN) are both complete and frozen. The natural next candidates are **CASE03 (IoT System)** and **CASE04 (Consumer Product)**, which still run on generic/placeholder content (`data/projects.ts`'s `placeholderSections`) rather than real project evidence — bringing them to the same real-evidence, localized, frozen standard as CASE01/CASE02 is the likely next body of work, pending Angela's prioritization.

Note: the worktree currently has untracked `app/design-samples/case-final-03/`, `case-final-04/`, and their `/en` counterparts, plus unrelated uncommitted changes to `AGENTS.md`, `CLAUDE.md`, `app/globals.css`, `ReadingSection.tsx`, and `SiteHeader.tsx`. These were not reviewed or authored as part of the CASE01/CASE02 work recorded above — a future session should run `git status`/`git diff` to assess their state before treating them as either in-progress work or safe to discard.
