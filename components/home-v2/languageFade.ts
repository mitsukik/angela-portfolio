/**
 * 中 / EN switch transition (V2 handoff): page content fades out over
 * .18s, the route swaps, then the new page fades in. The nav stays put.
 * Driven by one attribute on <html> so it survives the route change;
 * skipped entirely under prefers-reduced-motion.
 */
export const LANG_FADE_MS = 180;
const ATTR = "data-v2-lang-fade";

export function startLanguageFade(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const html = document.documentElement;
  html.setAttribute(ATTR, "out");
  // Never leave content hidden if the navigation is slow or fails.
  window.setTimeout(() => html.removeAttribute(ATTR), 2000);
  return true;
}

/** Called by the incoming page once it has rendered (still faded out). */
export function finishLanguageFade() {
  const html = document.documentElement;
  if (html.getAttribute(ATTR) !== "out") return;
  requestAnimationFrame(() => requestAnimationFrame(() => html.removeAttribute(ATTR)));
}
