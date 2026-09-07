"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ReactNode } from "react";

const MOTION_QUERY = "(prefers-reduced-motion: no-preference)";

/**
 * Real point strings come in two real shapes from data/projects.ts:
 * "01  多角色協作｜同一份商業資料..." (an embedded index + label,
 * separated by the fullwidth pipe from its description) and plain short
 * tags with neither ("Product Architecture"). Parsed rather than blindly
 * re-numbered, so a summary row never shows a duplicate index and a tag
 * list never gets treated like a 3-part breakdown it isn't.
 */
function parsePoint(point: string, fallbackIndex: number) {
  const pipeIndex = point.indexOf("｜");
  if (pipeIndex === -1) return { index: null, label: point, description: null };
  const head = point.slice(0, pipeIndex).trim();
  const description = point.slice(pipeIndex + 1).trim();
  const match = head.match(/^(\d{1,2})\s+(.+)$/);
  if (match) return { index: match[1], label: match[2], description };
  return { index: String(fallbackIndex + 1).padStart(2, "0"), label: head, description };
}

/**
 * The recurring label -> title -> body -> supporting-sentence -> media
 * rhythm, reused across Overview/Challenge/Role/Workflow/Decisions/
 * Outcome. Entrance settles once (label resolves, title enters, body
 * settles, supporting sentence follows slightly, then stops — no
 * continuous motion while the section is being read) and never repeats.
 *
 * Round 2: H2 now uses .cf-h2 (clamp(1.85rem,3.6vw,3rem)/1.08 — the
 * Lovable Case A target) instead of the previous smaller inline
 * override. `strong` gives decision/key-summary sections a more
 * pronounced reading-aware hover surface than ordinary paragraphs
 * (two interaction strengths, per Angela's explicit request).
 * `mediaFullBleed` lets a section's media break out of the 64ch text
 * measure to span the full row — media should feel like part of the
 * scene, not a small figure under text.
 */
export function ReadingSection({
  label,
  title,
  paragraphs,
  supporting,
  points,
  media,
  mediaFullBleed = false,
  strong = false,
  className = "",
}: {
  label: string;
  title?: string;
  paragraphs: string[];
  supporting?: string;
  points?: string[];
  media?: ReactNode;
  mediaFullBleed?: boolean;
  strong?: boolean;
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
      <div className="max-w-[68ch] md:col-span-8 md:col-start-5">
        {/* Reading-tint scope stops here, deliberately excluding media
            below — a figure has its own distinct hover language (see
            EvidenceFigure/ShowcaseMedia); hovering it must not also
            trigger the ambient paragraph-focus tint. */}
        <div className={strong ? "cf-reading-block cf-reading-block-strong" : "cf-reading-block"}>
          {title && <h3 ref={titleRef} className="cf-heading cf-h2">{title}</h3>}
          <div ref={bodyRef} className={title ? "mt-6 space-y-4" : "space-y-4"}>
            {paragraphs.map((paragraph) => (
              <p key={paragraph} className="cf-body body-tc">
                {paragraph}
              </p>
            ))}
          </div>
          {supporting && (
            <div ref={supportingRef} className="mt-7">
              <span aria-hidden className="cf-local-rule" />
              <p className="cf-dim mt-3 max-w-[52ch] text-[14px] leading-6 tracking-[0.02em]">{supporting}</p>
            </div>
          )}
          {points && points.some((p) => p.includes("｜")) ? (
            <ul className="cf-summary-list mt-8">
              {points.map((point, i) => {
                const parsed = parsePoint(point, i);
                return (
                  <li key={point} className="cf-summary-row">
                    {parsed.index && <span className="cf-summary-index cf-accent">{parsed.index}</span>}
                    <div>
                      <p className="cf-heading text-[1.05rem] font-medium">{parsed.label}</p>
                      {parsed.description && <p className="cf-body mt-1 text-[15px] leading-6">{parsed.description}</p>}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            points && (
              <ul className="mt-7 flex flex-wrap gap-2">
                {points.map((point) => (
                  <li key={point} className="cf-tag">
                    {point}
                  </li>
                ))}
              </ul>
            )
          )}
        </div>
        {media && !mediaFullBleed && <div className="mt-12">{media}</div>}
      </div>
      {media && mediaFullBleed && <div className="md:col-span-12 md:mt-4">{media}</div>}
    </section>
  );
}
