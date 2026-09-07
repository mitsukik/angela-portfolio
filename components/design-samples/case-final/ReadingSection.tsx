"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ReactNode } from "react";

const MOTION_QUERY = "(prefers-reduced-motion: no-preference)";

/**
 * The recurring label -> title -> body -> supporting-sentence -> media
 * rhythm, reused across Overview/Challenge/Role/Workflow/Decisions/
 * Outcome. Entrance settles once (label resolves, title enters, body
 * settles, supporting sentence follows slightly, then stops — no
 * continuous motion while the section is being read) and never repeats.
 */
export function ReadingSection({
  label,
  title,
  paragraphs,
  supporting,
  points,
  media,
  className = "",
}: {
  label: string;
  title?: string;
  paragraphs: string[];
  supporting?: string;
  points?: string[];
  media?: ReactNode;
  className?: string;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const labelRef = useRef<HTMLParagraphElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const supportingRef = useRef<HTMLParagraphElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const label = labelRef.current;
    const body = bodyRef.current;
    if (!section || !label || !body) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    const context = gsap.context(() => {
      mm.add(MOTION_QUERY, () => {
        const title = titleRef.current;
        const supporting = supportingRef.current;

        gsap.set(label, { autoAlpha: 0, y: 10 });
        if (title) gsap.set(title, { autoAlpha: 0, y: 16 });
        gsap.set(body, { autoAlpha: 0, y: 16 });
        if (supporting) gsap.set(supporting, { autoAlpha: 0, y: 10 });

        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "top 82%",
          once: true,
          onEnter: () => {
            const timeline = gsap.timeline({ defaults: { ease: "power2.out" } });
            timeline.to(label, { autoAlpha: 1, y: 0, duration: 0.45 });
            if (title) timeline.to(title, { autoAlpha: 1, y: 0, duration: 0.5 }, "-=0.28");
            timeline.to(body, { autoAlpha: 1, y: 0, duration: 0.55 }, "-=0.3");
            if (supporting) timeline.to(supporting, { autoAlpha: 1, y: 0, duration: 0.4 }, "-=0.3");
          },
        });

        return () => {
          trigger.kill();
          gsap.set([label, title, body, supporting].filter(Boolean), { clearProps: "opacity,visibility,transform" });
        };
      });
    }, section);

    return () => {
      mm.revert();
      context.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className={`grid gap-10 md:grid-cols-12 ${className}`}>
      <p ref={labelRef} className="cf-meta cf-accent md:col-span-3">
        {label}
      </p>
      <div className="max-w-[64ch] md:col-span-8 md:col-start-5">
        {/* Reading-tint scope stops here, deliberately excluding media
            below — a figure has its own distinct hover language (see
            EvidenceFigure/ShowcaseMedia); hovering it must not also
            trigger the ambient paragraph-focus tint. */}
        <div className="cf-reading-block">
          {title && (
            <h3 ref={titleRef} className="cf-heading display-l text-[clamp(1.5rem,2.6vw,2.2rem)]">
              {title}
            </h3>
          )}
          <div ref={bodyRef} className={title ? "mt-5 space-y-4" : "space-y-4"}>
            {paragraphs.map((paragraph) => (
              <p key={paragraph} className="cf-body body-tc">
                {paragraph}
              </p>
            ))}
          </div>
          {supporting && (
            <p ref={supportingRef} className="cf-dim mt-6 max-w-[52ch] border-t cf-rule pt-4 text-[14px] leading-6 tracking-[0.02em]">
              {supporting}
            </p>
          )}
          {points && (
            <ul className="mt-6 grid gap-3 border-t cf-rule pt-5 sm:grid-cols-2">
              {points.map((point) => (
                <li key={point} className="cf-meta text-[12px] leading-6 normal-case tracking-normal">
                  {point}
                </li>
              ))}
            </ul>
          )}
        </div>
        {media && <div className="mt-10">{media}</div>}
      </div>
    </section>
  );
}
