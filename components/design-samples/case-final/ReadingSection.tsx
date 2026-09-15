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
 * The recurring meta -> title -> body -> supporting-sentence -> media
 * rhythm, reused across Overview/Challenge/Role/Workflow/Decisions/
 * Outcome. Entrance settles once (label resolves, title enters, body
 * settles, supporting sentence follows slightly, then stops — no
 * continuous motion while the section is being read) and never repeats.
 *
 * Round 3: meta now sits ABOVE the content as a single nowrap label
 * (not squeezed into its own narrow grid column — that was causing
 * wrapping and pushing the reading column too far right/narrow). All
 * reading-content hover treatment removed per Angela's explicit
 * correction — normal content blocks stay stable while reading; only
 * real interactive controls (links, buttons) keep hover/focus states.
 * H3 is weight 500 (was 600 via the shared display class).
 *
 * Case content anatomy (Angela's vocabulary): Section > Section Label
 * (`label`, above) > Section Title (`title`, the h3) > Section Content
 * (paragraphs/supporting/points/media below it). This is the one
 * authoritative Section Title -> Section Content spacing role for every
 * equivalent section in Case Final — the `bodyRef` div's `mt-10` below
 * — so every section that has both a title and content inherits it
 * here rather than each carrying its own local spacing. Internal
 * Section Content rhythm (space-y-4 between paragraphs, mt-7 to
 * `supporting`, mt-8 to `points`, mt-12/16 to `media`) is a separate,
 * untouched concern.
 */
export function ReadingSection({
  label,
  title,
  paragraphs,
  supporting,
  points,
  media,
  mediaFullBleed = false,
  className = "",
}: {
  label: string;
  title?: string;
  paragraphs: string[];
  supporting?: string;
  points?: string[];
  media?: ReactNode;
  mediaFullBleed?: boolean;
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
    <section ref={sectionRef} className={className}>
      <p ref={labelRef} className="cf-meta cf-section-label cf-accent whitespace-nowrap">
        {label}
      </p>
      <div className="mt-4 max-w-[70ch]">
        {/* cf-h3 is a visual size token, not a semantic level — this is a
            top-level section heading (sibling of the page's own h1), same
            precedent as EvidenceSection below. */}
        {title && <h2 ref={titleRef} className="cf-heading cf-h3">{title}</h2>}
        <div ref={bodyRef} className={title ? "mt-10 space-y-4" : "space-y-4"}>
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
                    {/* CASE01 responsive QA: 15px -> 16px. This description
                        is real explanatory sentence content (Challenge's
                        numbered points), not a caption/meta label, so it
                        falls under the 16px Chinese-body-text floor. */}
                    {parsed.description && <p className="cf-body mt-1 text-[16px] leading-6">{parsed.description}</p>}
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
      {media && (
        <div className={mediaFullBleed ? "mt-12 md:mt-16" : "mt-12 max-w-[70ch]"}>{media}</div>
      )}
    </section>
  );
}
