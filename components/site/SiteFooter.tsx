"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CONTACT_EMAIL, RESUME_URL_EN, RESUME_URL_ZH } from "@/data/contact";
import type { Locale } from "@/data/locale";
import { getLenisInstance } from "@/components/site/lenisInstance";

const MOTION_QUERY = "(prefers-reduced-motion: no-preference)";

// The email address itself is never shown as visible text — only the
// mailto: href carries it — so `value` stays empty and each row's arrow
// (already a separate span appended after {link.value}) is all that
// renders on the row's right side, same treatment for both links.
const CONTACT_LINKS = (locale: Locale) => [
  { label: locale === "zh" ? "聯絡我" : "CONTACT ME", value: "", href: `mailto:${CONTACT_EMAIL}` },
  { label: locale === "zh" ? "線上履歷" : "RESUME", value: "", href: locale === "zh" ? RESUME_URL_ZH : RESUME_URL_EN },
];

/**
 * Closing / Contact scene, styled to match the connected Lovable "VER B"
 * project's Closing.tsx (V3 display + mono-label semantics
 * contact rows) — kept in Home per Angela's standing decision. The Footer
 * utility row below it is a distinct, separate layer (copyright + Back to
 * Top only), not a continuation of Closing's content.
 *
 * Round 2: sized to its own content (no forced min-h-[100svh] +
 * justify-between) — that combination was what produced a large blank
 * gap between the top label and the actual heading at wide/short
 * viewports (e.g. 1920x1080), since the content doesn't naturally fill a
 * full viewport height. Generous but fixed vertical padding instead.
 */
export function SiteFooter({ locale = "zh", backToTopLabel }: { locale?: Locale; backToTopLabel?: string }) {
  const closingRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const detailsRef = useRef<HTMLUListElement | null>(null);

  useLayoutEffect(() => {
    const closing = closingRef.current;
    const heading = headingRef.current;
    const details = detailsRef.current;
    if (!closing || !heading || !details) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add(MOTION_QUERY, () => {
        // Closing resolves in two beats, not one flat fade — the large
        // statement settles first, then contact details settle a moment
        // after, echoing the same label -> body sequencing used on Case
        // Study section entrances.
        gsap.set(heading, { autoAlpha: 0, y: 26 });
        gsap.set(details, { autoAlpha: 0, y: 16 });
        const trigger = ScrollTrigger.create({
          trigger: closing,
          start: "top 88%",
          once: true,
          onEnter: () => {
            const timeline = gsap.timeline();
            timeline
              .to(heading, { autoAlpha: 1, y: 0, duration: 0.65, ease: "power2.out" })
              .to(details, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.3");
          },
        });
        return () => {
          trigger.kill();
          gsap.set([heading, details], { clearProps: "opacity,visibility,transform" });
        };
      });
    }, closing);

    return () => {
      media.revert();
      context.revert();
    };
  }, []);

  const handleBackToTop = () => {
    const lenis = getLenisInstance();
    if (lenis) {
      lenis.scrollTo(0);
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <>
      <section id="contact" className="scene-dark relative">
        <div ref={closingRef} className="site-frame py-24 md:py-32">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-7">
              {/* Hover shifts the whole statement to acid, per-line, one
                  deliberate color transition — a quiet "alive" cue on the
                  closing line without becoming playful/cute. */}
              <h2 ref={headingRef} className="closing-statement group type-v3-display cursor-default">
                <span className="closing-statement-line block transition-colors duration-300 group-hover:text-acid">
                  Let&apos;s build
                </span>
                <span className="closing-statement-line block scene-dim-text transition-colors duration-300 group-hover:text-acid">
                  the system.
                </span>
              </h2>
              <p className="type-v3-body mt-8 max-w-[42ch]">
                {locale === "zh"
                  ? "正在尋找能一起處理複雜問題的團隊。如果你的產品需要有人把混亂的流程整理成清楚的體驗，歡迎聊聊。"
                  : "Looking for a team that tackles complex problems together. If your product needs someone to turn messy workflows into a clear experience, let's talk."}
              </p>
            </div>

            <ul ref={detailsRef} className="space-y-0 md:col-span-5 md:self-end">
              {CONTACT_LINKS(locale).map((link) => (
                <li key={link.label}>
                  {/* Hover: a paper surface slides in from the left (scaleX,
                      CSS-only) behind the row's own text, which flips from
                      the scene's dim/light-on-dark tone to ink for contrast
                      against it — the "moving surface -> state change"
                      principle from re-presentation.jp's service rows,
                      adapted into this dark system instead of copying its
                      black block treatment. Reverses on leave via the same
                      transition, no JS involved. */}
                  <a
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="contact-row group relative flex items-baseline justify-between gap-6 overflow-hidden border-t scene-rule px-3 py-5 -mx-3"
                  >
                    <span aria-hidden className="contact-row-surface absolute inset-0 -z-10 bg-paper" />
                    <span className="contact-row-text type-v3-label">{link.label}</span>
                    <span className="contact-row-text text-[15px] tracking-tight">
                      {link.value}
                      <span aria-hidden className="ml-3 inline-block transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <footer className="scene-dark border-t scene-rule">
        <div className="site-frame flex items-center justify-between gap-6 py-8">
          <p className="type-v3-label scene-dim-text">© ANGELA YU 2026</p>
          {/* type-v3-label's own font-size/line-height (0.75rem * 1.4) render
              at exactly ~16.8px tall with zero padding of its own — below
              the 24px WCAG 2.5.8 (AA) target-size minimum. py-1.5/px-1
              extend the actual tappable area to ~28.8px; the matching
              negative margin cancels the layout impact, so the footer row
              and the label's own rendered size/position are unchanged. */}
          <button
            type="button"
            onClick={handleBackToTop}
            className="group type-v3-label scene-dim-text -mx-1 -my-1.5 inline-flex cursor-pointer items-center gap-2 px-1 py-1.5 transition-colors hover:text-acid focus-visible:text-acid"
          >
            <span>{backToTopLabel ?? "BACK TO TOP"}</span>
            <span aria-hidden className="transition-transform group-hover:-translate-y-1">↑</span>
          </button>
        </div>
      </footer>
    </>
  );
}
