"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CONTACT_EMAIL } from "@/data/contact";
import type { Locale } from "@/data/locale";

const MOTION_QUERY = "(prefers-reduced-motion: no-preference)";

const CONTACT_LINKS = (locale: Locale) => [
  { label: "Email", value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
  { label: "LinkedIn", value: "/in/angela-yu", href: "https://www.linkedin.com/in/angela-yu" },
  { label: "Resume", value: locale === "zh" ? "PDF — 準備中" : "PDF — coming soon", href: "#contact" },
];

/**
 * Closing / Contact scene, restyled to match the connected Lovable "VER B"
 * project's Closing.tsx (display-xl "Let's build / the system.", label-mono
 * contact rows) — kept in Home per Angela's explicit standing decision,
 * since VER B's own live app currently drops this scene in favor of a
 * minimal footer only (see round-2 plan notes); this preserves the richer
 * scene using VER B's own Closing.tsx as the style/content reference.
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

  return (
    <footer id="contact" className="scene-dark relative">
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
                <a href={link.href} className="group flex items-baseline justify-between gap-6 border-t scene-rule py-5 transition-colors hover:text-acid focus-visible:text-acid">
                  <span className="label-mono">{link.label}</span>
                  <span className="text-[15px] tracking-tight">
                    {link.value}
                    <span aria-hidden className="ml-3 inline-block transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t scene-rule pt-5">
          <p className="label-mono scene-dim-text">{locale === "zh" ? "ANGELA YU — 資深產品設計師" : "Angela Yu — Senior Product Designer"}</p>
          <a href="#top" className="group label-mono scene-dim-text inline-flex items-center gap-2 transition-colors hover:text-acid focus-visible:text-acid">
            <span>{locale === "zh" ? "回到頂端" : "Back to top"}</span>
            <span aria-hidden className="transition-transform group-hover:-translate-y-1">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
