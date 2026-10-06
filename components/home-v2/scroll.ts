import { getLenisInstance } from "@/components/site/lenisInstance";

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Scroll to a section below the sticky nav and hand keyboard focus to it. */
export function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  const lenis = getLenisInstance();
  // The sections' own scroll-margin-top supplies the sticky-nav offset for
  // both Lenis and native scrolling.
  if (lenis) {
    lenis.scrollTo(target, { duration: prefersReducedMotion() ? 0 : 1.1 });
  } else {
    target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
  }
  target.focus({ preventScroll: true });
}

export function scrollToTop() {
  const lenis = getLenisInstance();
  if (lenis) {
    lenis.scrollTo(0, { duration: prefersReducedMotion() ? 0 : 1.1 });
    return;
  }
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
}
