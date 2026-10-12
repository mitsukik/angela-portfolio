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

  return (
    <div ref={rootRef} className="state-scrubber case04-journey grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,17rem)] md:items-start md:gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,19rem)]">
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
                  <span className="state-scrubber-name cf-heading">{c.name}</span>
                  <span className="state-scrubber-detail cf-body">{c.detail}</span>
                  <span className="state-scrubber-protects cf-meta" lang="en">{fmt(c.t)}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="state-scrubber-stage mx-auto w-full max-w-[17rem] max-md:order-first md:col-start-2 md:row-start-1 md:max-w-none">
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
              <button type="button" onClick={play} className="case04-journey-start absolute inset-0 flex items-end justify-center bg-black/35 pb-[18%]">
                <span className="flex items-center gap-2 rounded-full bg-[#f4f1ea] px-4 py-2.5 text-[0.85rem] font-medium text-[#111]">
                  <svg aria-hidden viewBox="0 0 16 16" width="12" height="12" fill="currentColor"><path d="M4 2.5v11l10-5.5-10-5.5Z" /></svg>
                  {playLabel}
                  <span className="tabular-nums opacity-60" lang="en">{fmt(duration)}</span>
                </span>
              </button>
            ) : null}
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? pauseLabel : ended ? replayLabel : playLabel}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black/55 text-white transition-colors hover:bg-black/70 focus-visible:bg-black/70"
          >
            {playing ? (
              <svg aria-hidden viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><rect x="3.5" y="2.5" width="3" height="11" /><rect x="9.5" y="2.5" width="3" height="11" /></svg>
            ) : (
              <svg aria-hidden viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M4 2.5v11l10-5.5-10-5.5Z" /></svg>
            )}
          </button>
          <input
            type="range"
            min={0}
            max={dur}
            step={0.1}
            value={Math.min(t, dur)}
            onChange={(e) => seek(Number(e.target.value), false)}
            aria-label={zh ? "錄影進度" : "Recording position"}
            aria-valuetext={`${fmt(t)} / ${fmt(dur)}`}
            className="case04-journey-range min-w-0 flex-1"
          />
          <span className="cf-meta shrink-0 tabular-nums" lang="en" aria-hidden>{fmt(t)} / {fmt(dur)}</span>
        </div>
        <p className="cf-figure-caption cf-meta mt-2" aria-live="polite">
          {String(active + 1).padStart(2, "0")} / {String(chapters.length).padStart(2, "0")} — {chapters[active].name}
        </p>
      </div>
    </div>
  );
}
