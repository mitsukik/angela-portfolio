"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/components/design-samples/case-final/VideoEvidence";

/*
 * CASE04 §04 — the connected product journey as one real, uninterrupted
 * screen recording of the LABO65 V2 prototype (live build, phone mode, no
 * debug tools), with a chapter list that seeks the recording.
 *
 * Same Switch grammar as StateScrubber (state-scrubber-* rows: index, name,
 * detail, accent rule on the current row) so CASE04 keeps one interaction
 * vocabulary; the chapter rows are seek buttons, not tabs.
 *
 * Hierarchy (2026-10-12 polish): the recording is the chapter's primary
 * evidence — first in reading order, sized to the viewport height so the
 * whole phone plus its controls fit on screen, on its own media stage; the
 * chapter rail beside it is compact (name + timecode; the current chapter's
 * UX note expands), with matching ticks on the scrubber.
 *
 * Motion / loading rules:
 * - Never autoplays. The poster shows until the reader presses play or
 *   picks a chapter.
 * - The <video> only starts fetching metadata once the figure nears the
 *   viewport (preload "none" → "metadata"); the clip itself loads on play.
 * - Pauses when scrolled out of view; does not resume on its own.
 * - Reduced motion: picking a chapter seeks and shows that frame paused.
 * - Silent recording (no audio track), so there is nothing to caption; the
 *   chapter list is the text alternative of what the recording shows.
 */

export type JourneyChapter = { t: number; name: string; detail: string };

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export function Case04Journey({
  src,
  poster,
  duration,
  chapters,
  label,
  railLabel,
  videoLabel,
  zh,
}: {
  src: string;
  poster: string;
  /** Recording length in seconds (known at build time; used before metadata loads). */
  duration: number;
  chapters: JourneyChapter[];
  /** Accessible name of the chapter list. */
  label: string;
  /** Visible heading of the chapter rail. */
  railLabel: string;
  /** Accessible description of the recording. */
  videoLabel: string;
  zh: boolean;
}) {
  const baseId = useId();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const [near, setNear] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [t, setT] = useState(0);
  const [dur, setDur] = useState(duration);

  const active = chapters.reduce((acc, c, i) => (t + 0.05 >= c.t ? i : acc), 0);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const near = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setNear(true);
        near.disconnect();
      }
    }, { rootMargin: "400px" });
    near.observe(el);
    const view = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) videoRef.current?.pause();
    }, { threshold: 0.15 });
    view.observe(el);
    return () => {
      near.disconnect();
      view.disconnect();
    };
  }, []);

  const play = () => {
    const v = videoRef.current;
    if (!v) return;
    setStarted(true);
    v.muted = true;
    v.play().catch(() => {});
  };
  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused || v.ended) play();
    else v.pause();
  };
  const seek = (time: number, thenPlay: boolean) => {
    const v = videoRef.current;
    if (!v) return;
    setStarted(true);
    v.currentTime = Math.max(0, Math.min(time, dur - 0.05));
    setT(v.currentTime);
    if (thenPlay) play();
  };

  const playLabel = zh ? "播放操作錄影" : "Play the walkthrough";
  const pauseLabel = zh ? "暫停操作錄影" : "Pause the walkthrough";
  const replayLabel = zh ? "重新播放操作錄影" : "Replay the walkthrough";
  const ended = started && !playing && t >= dur - 0.2;

  const chapterList = (
    <ol aria-label={label} className="state-scrubber-list min-w-0 border-t cf-rule">
      {chapters.map((c, i) => {
        const current = i === active;
        return (
          <li key={c.name}>
            <button
              type="button"
              className="state-scrubber-tab"
              data-selected={current}
              aria-current={current ? "step" : undefined}
              aria-controls={`${baseId}-video`}
              onClick={() => seek(c.t, !reduced)}
            >
              <span className="state-scrubber-index cf-meta">{String(i + 1).padStart(2, "0")}</span>
              <span className="min-w-0">
                <span className="flex items-baseline justify-between gap-3">
                  <span className="state-scrubber-name cf-heading">{c.name}</span>
                  <span className="state-scrubber-protects cf-meta mt-0 shrink-0" lang="en">{fmt(c.t)}</span>
                </span>
                <span className="state-scrubber-detail cf-body">{c.detail}</span>
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );

  return (
    <div ref={rootRef} className="case04-journey case04-journey-stage state-scrubber state-scrubber--compact grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-start lg:gap-12">
      <div className="case04-journey-player mx-auto">
        <div className="case04-journey-device">
          <div className="case04-journey-screen relative w-full" style={{ aspectRatio: "640 / 1350" }}>
            <video
              ref={videoRef}
              id={`${baseId}-video`}
              className="absolute inset-0 h-full w-full object-cover"
              poster={poster}
              preload={near ? "metadata" : "none"}
              muted
              playsInline
              aria-label={videoLabel}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onEnded={() => setPlaying(false)}
              onTimeUpdate={(e) => setT(e.currentTarget.currentTime)}
              onLoadedMetadata={(e) => Number.isFinite(e.currentTarget.duration) && setDur(e.currentTarget.duration)}
            >
              <source src={src} type="video/mp4" />
            </video>
            {!started ? (
              <button type="button" onClick={play} className="case04-journey-start absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/45">
                <span aria-hidden className="case04-journey-start-disc flex h-16 w-16 items-center justify-center rounded-full">
                  <svg viewBox="0 0 16 16" width="22" height="22" fill="currentColor"><path d="M4.5 2.5v11l9.5-5.5-9.5-5.5Z" /></svg>
                </span>
                <span className="rounded-full bg-black/70 px-3.5 py-1.5 text-[0.85rem] font-medium text-white">
                  {playLabel} <span className="tabular-nums opacity-70" lang="en">{fmt(duration)}</span>
                </span>
              </button>
            ) : null}
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? pauseLabel : ended ? replayLabel : playLabel}
            className="case04-journey-toggle flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
          >
            {playing ? (
              <svg aria-hidden viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><rect x="3.5" y="2.5" width="3" height="11" /><rect x="9.5" y="2.5" width="3" height="11" /></svg>
            ) : (
              <svg aria-hidden viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M4 2.5v11l10-5.5-10-5.5Z" /></svg>
            )}
          </button>
          <div className="relative min-w-0 flex-1">
            {/* Chapter ticks on the scrubber (decorative; the chapter list is the control). */}
            <span aria-hidden className="case04-journey-ticks">
              {chapters.map((c, i) => (
                <span key={c.name} data-on={i === active ? "true" : undefined} style={{ left: `${(c.t / dur) * 100}%` }} />
              ))}
            </span>
            <input
              type="range"
              min={0}
              max={dur}
              step={0.1}
              value={Math.min(t, dur)}
              onChange={(e) => seek(Number(e.target.value), false)}
              aria-label={zh ? "錄影進度" : "Recording position"}
              aria-valuetext={`${fmt(t)} / ${fmt(dur)}`}
              className="case04-journey-range relative w-full"
            />
          </div>
          <span className="cf-meta shrink-0 tabular-nums" lang="en" aria-hidden>{fmt(t)} / {fmt(dur)}</span>
        </div>
        <p className="cf-figure-caption cf-meta mt-2" aria-live="polite">
          {String(active + 1).padStart(2, "0")} / {String(chapters.length).padStart(2, "0")} — {chapters[active].name}
        </p>
      </div>
      <div className="min-w-0">
        <p className="cf-meta case04-journey-railhead">{railLabel}</p>
        {chapterList}
      </div>
    </div>
  );
}
