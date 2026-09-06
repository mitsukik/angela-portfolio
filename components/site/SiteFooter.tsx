"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CONTACT_EMAIL } from "@/data/contact";

const MOTION_QUERY = "(prefers-reduced-motion: no-preference)";

export function SiteFooter() {
  const closingRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const closing = closingRef.current;
    if (!closing) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add(MOTION_QUERY, () => {
        gsap.set(closing, { autoAlpha: 0, y: 18 });
        const trigger = ScrollTrigger.create({
          trigger: closing,
          start: "top 90%",
          once: true,
          onEnter: () =>
            gsap.to(closing, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }),
        });
        return () => {
          trigger.kill();
          gsap.set(closing, { clearProps: "opacity,visibility,transform" });
        };
      });
    }, closing);

    return () => {
      media.revert();
      context.revert();
    };
  }, []);

  return (
    <footer id="contact" className="relative border-t border-primary/12 bg-background pt-[30px]">
      {/* AmbientField disabled per Angela's review — see AboutHero.tsx for
          the same note. */}
      <div className="relative mx-auto max-w-[1600px] px-6 py-16 sm:px-8 lg:px-10 lg:py-20">
        <div ref={closingRef} className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-[2.7rem] font-medium leading-[0.95] tracking-[-0.01em] text-primary sm:text-[2.7rem] lg:text-[2.7rem]">
              LET&apos;S WORK <span className="text-accent-yellow">TOGETHER</span>.
            </h2>
            <div className="mt-6 space-y-2 text-[18px] text-primary/60 sm:text-base">
              <p>Have a project or opportunity?</p>
              <p>Let&apos;s talk.</p>
            </div>
            <a href={`mailto:${CONTACT_EMAIL}`} className="link-nav mt-8 inline-flex items-center text-[15px] uppercase tracking-[0.12em] text-primary">
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>

        <div className="mt-14 h-px w-full bg-primary/12" />
        <div className="mt-6 flex flex-col gap-4 text-[14px] uppercase tracking-[0.18em] text-primary/60 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
            <span>ANGELA YU © 2026</span>
          </div>
          <span className="text-left sm:text-right">
            <a href="#top" className="link-cta self-start gap-2 text-[14px] uppercase tracking-[0.2em] text-primary lg:self-end">
              <span className="link-cta-label">BACK TO TOP</span>
              <span aria-hidden="true" className="link-cta-marker-up">↑</span>
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
