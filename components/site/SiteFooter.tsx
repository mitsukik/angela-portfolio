"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CONTACT_EMAIL } from "@/data/contact";
import type { Locale } from "@/data/locale";
import { getLenisInstance } from "@/components/site/lenisInstance";

const MOTION_QUERY = "(prefers-reduced-motion: no-preference)";

const CONTACT_LINKS = (locale: Locale) => [
  { label: "Email", value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
  { label: "LinkedIn", value: "/in/angela-yu", href: "https://www.linkedin.com/in/angela-yu" },
  { label: "Resume", value: locale === "zh" ? "PDF — 準備中" : "PDF — coming soon", href: "#contact" },
];

/**
 * Closing / Contact scene, styled to match the connected Lovable "VER B"
 * project's Closing.tsx (display-xl "Let's build / the system.", label-mono
 * contact rows) — kept in Home per Angela's standing decision. The Footer
 * utility row below it is a distinct, separate layer (copyright + Back to
 * Top only), not a continuation of Closing's content.
 */
export function SiteFooter({ locale = "zh" }: { locale?: Locale }) {
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
        <div ref={closingRef} className="mx-auto flex min-h-[100svh] max-w-[1600px] flex-col justify-between px-5 py-16 md:px-10 md:py-20">
          <p className="label-mono scene-dim-text">{locale === "zh" ? "結尾 / 聯絡" : "Closing / Contact"}</p>

          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-7">
              <h2 ref={headingRef} className="display-xl">
                <span className="block">Let&apos;s build</span>
                <span className="block scene-dim-text">the system.</span>
              </h2>
              <p className="body-tc mt-8 max-w-[42ch]">
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
                    className="contact-row group relative flex items-baseline justify-between gap-6 overflow-hidden border-t scene-rule px-3 py-5 -mx-3"
                  >
                    <span aria-hidden className="contact-row-surface absolute inset-0 -z-10 bg-paper" />
                    <span className="contact-row-text label-mono">{link.label}</span>
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
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-6 px-5 py-8 md:px-10">
          <p className="label-mono scene-dim-text">© ANGELA YU 2026</p>
          <button type="button" onClick={handleBackToTop} className="group label-mono scene-dim-text inline-flex items-center gap-2 transition-colors hover:text-acid focus-visible:text-acid">
            <span>BACK TO TOP</span>
            <span aria-hidden className="transition-transform group-hover:-translate-y-1">↑</span>
          </button>
        </div>
      </footer>
    </>
  );
}
