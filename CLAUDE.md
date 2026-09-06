@AGENTS.md

## Claude-Only Skill Routing Additions

These plugins exist only in Claude Code — Codex has no equivalent. Route these steps to Claude specifically when work is split across agents.

- **Accessibility** → `accesslint` plugin (`accessibility-scan` for one page, `accessibility-audit` for the whole site). Independent final-quality axis — run after implementation. Do not run simultaneously with `improve-ui`/`design-audit` as one blended audit; run sequentially instead, since each evaluates a different quality axis (e.g. improve-ui → accesslint → web-design-guidelines → typography).
- **Typography enforcement** → `typography` plugin. Mechanical correctness only (quotes, dashes, spacing, hierarchy) — auto-applies silently. Type *pairing/taste* decisions still belong to design-director.
- **Pre-launch whole-site coherence** → `impeccable` plugin, once, near the end. Not a per-task director — see AGENTS.md.
- **Alternate audit format** → `design-audit` plugin. Same job as `improve-ui`, different report format — use one or the other for a given pass rather than both, though either may still run sequentially alongside the other audit axes.
- **Bold/experimental option** → `bencium-impact-designer` plugin, only when design-director's Discover step specifically wants a boundary-expanding direction to show Angela. Never a default.

### Pre-launch sequence (Claude)

1. `impeccable` — whole-site coherence
2. `improve-ui` — evidence-gated findings per page
3. `accesslint` (`accessibility-audit`) — whole-site WCAG pass
4. `web-design-guidelines` — compliance checklist
5. `typography` — mechanical correctness pass
6. `review-animations` — motion quality across the final build
7. Consolidate findings, implement fixes via the relevant implementation skill — never via the audit skills themselves
