/**
 * Language switching should feel like changing language, not like opening
 * an unrelated page (P0.5). The ZH and EN versions of every bilingual
 * route render the same component tree, so the reader's place can be
 * carried across the switch structurally:
 *
 *   - inside Home's pinned Selected Work track: the same track progress
 *     (the same project, the same stage of its wipe);
 *   - anywhere else: the same heading / figure (by document order), at the
 *     same distance from the top of the viewport;
 *   - fallback: the same share of the page.
 *
 * A module-level singleton (like lenisInstance.ts) is enough: a language
 * switch is a client-side navigation inside one JS context. RouteTransition
 * consumes the snapshot to skip the route curtain and restore position.
 */

type Snapshot = {
  to: string;
  fromLocale: "zh" | "en";
  at: number;
  track: number | null;
  anchorIndex: number;
  anchorTop: number;
  ratio: number;
};

let pending: Snapshot | null = null;
let lastSwitch: { fromLocale: "zh" | "en"; at: number } | null = null;

const ANCHOR_SELECTOR = "main :is(h1, h2, h3, figure, [data-lang-anchor])";

function anchors(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>(ANCHOR_SELECTOR)).filter(
    (el) => !el.closest("[data-lang-track]") && el.getClientRects().length > 0,
  );
}

function trackProgress(): number | null {
  const track = document.querySelector<HTMLElement>("[data-lang-track]");
  if (!track) return null;
  const rect = track.getBoundingClientRect();
  const distance = rect.height - window.innerHeight;
  if (distance <= 0 || rect.top > 0 || rect.bottom < window.innerHeight) return null;
  return Math.min(1, Math.max(0, -rect.top / distance));
}

export function captureLanguageSwitch(to: string, fromLocale: "zh" | "en") {
  const list = anchors();
  const line = window.innerHeight * 0.3;
  let anchorIndex = -1;
  let anchorTop = 0;
  list.forEach((el, i) => {
    const top = el.getBoundingClientRect().top;
    if (top <= line) {
      anchorIndex = i;
      anchorTop = top;
    }
  });
  const max = document.documentElement.scrollHeight - window.innerHeight;
  pending = {
    to,
    fromLocale,
    at: performance.now(),
    track: trackProgress(),
    anchorIndex,
    anchorTop,
    ratio: max > 0 ? window.scrollY / max : 0,
  };
  lastSwitch = { fromLocale, at: pending.at };
}

/** Returns (once) the snapshot for a language switch landing on `pathname`. */
export function consumeLanguageSwitch(pathname: string): Snapshot | null {
  const snapshot = pending;
  pending = null;
  if (!snapshot || snapshot.to !== pathname || performance.now() - snapshot.at > 5000) return null;
  return snapshot;
}

/** The locale the reader just switched away from, if that just happened —
 * lets the new page's language control slide from the old position. */
export function recentLanguageSwitchFrom(): "zh" | "en" | null {
  if (!lastSwitch || performance.now() - lastSwitch.at > 2000) return null;
  return lastSwitch.fromLocale;
}

/** Scroll target (px) that puts the reader back where they were. */
export function restoreTarget(snapshot: Snapshot): number {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (snapshot.track !== null) {
    const track = document.querySelector<HTMLElement>("[data-lang-track]");
    if (track) {
      const top = track.getBoundingClientRect().top + window.scrollY;
      return top + snapshot.track * (track.offsetHeight - window.innerHeight);
    }
  }
  const list = anchors();
  if (snapshot.anchorIndex >= 0 && snapshot.anchorIndex < list.length) {
    const el = list[snapshot.anchorIndex];
    return el.getBoundingClientRect().top + window.scrollY - snapshot.anchorTop;
  }
  return Math.round(snapshot.ratio * max);
}
