"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import Image from "next/image";
import type { Locale } from "@/data/locale";
import { EvidenceTrigger } from "@/components/design-samples/case-final/CaseEvidenceViewer";
import { usePrefersReducedMotion } from "@/components/design-samples/case-final/VideoEvidence";

/*
 * CASE System V3 — CaseStageSelector: a row of tabs over one stage, each tab
 * a short silent loop of the real interface (the shared V3 role for CASE01's
 * "rules → product" stage; CASE01 still renders its original V2 module and
 * can migrate onto this later). Styles: `.cv3-stage*` in components/v3/v3.css.
 *
 * Behaviour (same contract as CASE01's Stage): WAI-ARIA tabs with automatic
 * activation, roving tabindex and Arrow / Home / End; only the active loop
 * plays, only while the stage is in view, restarting from its first frame on
 * every activation; inactive loops pause. A play/pause control (WCAG 2.2.2)
 * sits in the corner; a refused autoplay shows "play" instead of a frozen
 * frame. Under reduced motion no <video> mounts — the panel shows the loop's
 * final frame. Clicking the stage opens that frame in the evidence viewer.
 */

export type CaseStageItem = {
  label: string;
  /** One sentence shown under the stage while this tab is active. */
  note: string;
  /** Final frame: the reduced-motion still and the evidence-viewer image. */
  src: string;
  video: { webm: string; mp4: string; poster: string };
  alt: string;
};

const LOOP_LABEL: Record<Locale, { pause: string; play: string }> = {
  zh: { pause: "暫停示範", play: "播放示範" },
  en: { pause: "Pause demo", play: "Play demo" },
};

const isAutoplayRefusal = (error: unknown) => error instanceof DOMException && error.name === "NotAllowedError";

export function CaseStageSelector({ items, label, locale, ratio = "16 / 10" }: { items: CaseStageItem[]; label: string; locale: Locale; ratio?: string }) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const baseId = useId();
  const reducedMotion = usePrefersReducedMotion();
  const frameRef = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const [inView, setInView] = useState(false);
  const [pausedFor, setPausedFor] = useState<number | null>(null);
  const paused = pausedFor === active;

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || reducedMotion) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(frame);
    return () => observer.disconnect();
  }, [reducedMotion]);

  // The one place playback is driven; non-policy rejections (Chrome's
  // transient "paused to save power") get two quick retries.
  useEffect(() => {
    let cancelled = false;
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index !== active || !inView || paused) {
        video.pause();
        return;
      }
      video.muted = true;
      video.currentTime = 0;
      const retryOrGiveUp = (left: number) => {
        if (cancelled) return;
        if (left > 0) setTimeout(() => !cancelled && attempt(left - 1), 200);
        else setPausedFor(index);
      };
      const attempt = (left: number) => {
        video
          .play()
          .then(() => setTimeout(() => !cancelled && video.paused && retryOrGiveUp(left), 50))
          .catch((error: unknown) => {
            if (cancelled) return;
            if (isAutoplayRefusal(error)) setPausedFor(index);
            else retryOrGiveUp(left);
          });
      };
      attempt(2);
    });
    return () => {
      cancelled = true;
    };
  }, [active, inView, paused, reducedMotion]);

  useEffect(() => {
    const resume = () => {
      if (document.visibilityState !== "visible" || paused || !inView) return;
      const video = videoRefs.current[active];
      if (video?.paused) {
        video.muted = true;
        video.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", resume);
    return () => document.removeEventListener("visibilitychange", resume);
  }, [active, inView, paused]);

  const select = (index: number) => {
    setActive(index);
    setPausedFor(null); // choosing a tab asks to see it
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const moves: Record<string, number> = { ArrowRight: index + 1, ArrowDown: index + 1, ArrowLeft: index - 1, ArrowUp: index - 1, Home: 0, End: items.length - 1 };
    if (!(event.key in moves)) return;
    event.preventDefault();
    const next = (moves[event.key] + items.length) % items.length;
    select(next);
    tabRefs.current[next]?.focus();
  };

  const toggle = () => {
    if (!paused) {
      setPausedFor(active);
      return;
    }
    setPausedFor(null);
    const video = videoRefs.current[active];
    if (video) {
      video.muted = true;
      video.play().catch((error: unknown) => isAutoplayRefusal(error) && setPausedFor(active));
    }
  };

  return (
    <figure className="cv3-figure cv3-stage-figure">
      <div role="tablist" aria-label={label} className="cv3-stage-tabs cv3-list-reset" style={{ "--cv3-stage-n": items.length } as CSSProperties}>
        {items.map((item, index) => (
          <button
            key={item.src}
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            type="button"
            role="tab"
            id={`${baseId}-tab-${index}`}
            aria-selected={index === active}
            aria-controls={`${baseId}-panel-${index}`}
            tabIndex={index === active ? 0 : -1}
            onClick={() => select(index)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className="cv3-stage-tab"
          >
            <span className="cv3-stage-tab-n" lang="en">{String(index + 1).padStart(2, "0")}</span>
            <span className="cv3-stage-tab-label">{item.label}</span>
          </button>
        ))}
      </div>
      <div ref={frameRef} className="cv3-media cv3-stage" style={{ aspectRatio: ratio }}>
        {items.map((item, index) => (
          <div key={item.src} role="tabpanel" id={`${baseId}-panel-${index}`} aria-labelledby={`${baseId}-tab-${index}`} data-active={index === active} className="cv3-stage-panel">
            <EvidenceTrigger asset={{ src: item.src, alt: item.alt, caption: item.note }}>
              {reducedMotion ? (
                <Image src={item.src} alt="" fill unoptimized sizes="(min-width: 1200px) 60vw, 100vw" className="object-cover" />
              ) : (
                <video
                  ref={(element) => {
                    videoRefs.current[index] = element;
                  }}
                  className="cv3-stage-video"
                  poster={item.video.poster}
                  muted
                  loop
                  playsInline
                  disablePictureInPicture
                  preload={index === active && inView ? "auto" : "none"}
                  aria-hidden
                  tabIndex={-1}
                >
                  {/* H.264 first: some Safari builds claim VP9 and then show only the poster. */}
                  <source src={item.video.mp4} type="video/mp4" />
                  <source src={item.video.webm} type="video/webm" />
                </video>
              )}
            </EvidenceTrigger>
          </div>
        ))}
        {!reducedMotion ? (
          <button type="button" className="cv3-stage-toggle" data-paused={paused} aria-label={paused ? LOOP_LABEL[locale].play : LOOP_LABEL[locale].pause} onClick={toggle}>
            <span aria-hidden="true">
              {paused ? (
                <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor"><path d="M4 2.5v11l10-5.5-10-5.5Z" /></svg>
              ) : (
                <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor"><rect x="3.5" y="2.5" width="3" height="11" /><rect x="9.5" y="2.5" width="3" height="11" /></svg>
              )}
            </span>
          </button>
        ) : null}
      </div>
      <figcaption className="cv3-caption" aria-live="polite">{items[active].note}</figcaption>
    </figure>
  );
}
