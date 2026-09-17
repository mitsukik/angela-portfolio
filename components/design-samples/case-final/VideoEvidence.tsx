"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

export type VideoEvidenceAsset = {
  webm: string;
  mp4: string;
  poster: string;
  alt: string;
};

// SSR has no window/matchMedia, and React warns if useLayoutEffect runs
// during server rendering — same guard as Home's useMedia (see
// components/home/SelectedWork/motion.ts), kept local here rather than
// imported since case-final components stay self-contained.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Reports the live `prefers-reduced-motion` value, not a guessed default —
 * the first render always assumes "reduced" (the safe, motion-free state)
 * until this resolves synchronously before paint, matching this
 * component's other query-dependent state below.
 */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(true);

  useIsomorphicLayoutEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

/**
 * Real evidence, live-captured — a short muted walkthrough of the actual
 * public website (see HANDOFF's "Live website links" for the three URLs),
 * not a simulated or AI-generated recreation. Deliberately not wrapped in
 * CaseEvidenceViewer's click-to-enlarge: that dialog is built around a
 * single static frame, and a looping clip doesn't need the same treatment.
 *
 * Motion-avoidance rules, all defaulting to the static poster until proven
 * otherwise:
 * - `prefers-reduced-motion: reduce` never autoplays — static poster only.
 * - The `<video>` isn't mounted at all (so nothing downloads or decodes)
 *   until this figure first comes near the viewport, so three unrelated
 *   project clips never compete for bandwidth on page load.
 * - Playback itself follows a *second*, ongoing visibility check once
 *   mounted: the clip pauses whenever it scrolls out of view and resumes
 *   when it scrolls back — it doesn't just autoplay forever the moment it
 *   was first mounted (confirmed live: without this, all three clips kept
 *   decoding and playing simultaneously long after being scrolled past).
 * - A small manual control lets the user pause/resume independently of
 *   scroll position — required for autoplaying, looping content per WCAG
 *   2.2.2 (Pause, Stop, Hide) — and once used, that explicit choice wins
 *   over the automatic scroll-based play/pause until the user presses it
 *   again (scrolling away and back doesn't silently override "I paused
 *   this").
 */
export function VideoEvidence({
  asset,
  format = "landscape",
  zhHant = false,
}: {
  asset: VideoEvidenceAsset;
  format?: "landscape" | "portrait" | "crop";
  zhHant?: boolean;
}) {
  const aspect = {
    landscape: "aspect-[16/10]",
    portrait: "aspect-[4/5]",
    crop: "aspect-[4/3]",
  }[format];

  const prefersReducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);

  // One-time lazy-mount trigger: a generous rootMargin so the <video> (and
  // its network request) exists slightly before the user scrolls to it,
  // but this only ever flips true once — it decides whether to mount the
  // element at all, not whether it's currently playing (see isInView
  // below for that).
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const showVideo = isNearViewport && !prefersReducedMotion;
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Ongoing (never-disconnected) visibility check, only active once the
  // video is actually mounted — this is what pauses the clip after it's
  // scrolled out of view instead of leaving it decoding indefinitely.
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    if (!showVideo) return;
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [showVideo]);

  // Explicit user choice, independent of scroll: once set, it overrides
  // the automatic in-view play/pause until the user toggles it again.
  const [userPaused, setUserPaused] = useState(false);
  const shouldPlay = isInView && !userPaused;

  // React doesn't render `muted` as a real DOM attribute — only as a JS
  // property, applied after the element already exists — so by the time
  // it lands, the browser has often already evaluated (and rejected) the
  // `autoPlay` attribute's unmuted-looking initial state. Setting `.muted`
  // on the element directly, then calling `.play()` ourselves, is the
  // reliable path; the rejected-promise catch covers browsers that still
  // decline (e.g. a mid-navigation tab), where the poster frame already
  // showing is a fine fallback.
  //
  // Browsers also correctly pause background-tab video to save power —
  // expected, not a bug — so re-requesting play on `visibilitychange`
  // means switching back to this tab resumes the clip (unless the user
  // had explicitly paused it) instead of leaving it frozen.
  useEffect(() => {
    if (!showVideo) return;
    const el = videoRef.current;
    if (!el) return;
    el.muted = true;
    if (shouldPlay) {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
    const resume = () => {
      if (document.visibilityState === "visible" && shouldPlay) el.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", resume);
    return () => document.removeEventListener("visibilitychange", resume);
  }, [showVideo, shouldPlay]);

  const pauseLabel = zhHant ? "暫停影片" : "Pause video";
  const playLabel = zhHant ? "播放影片" : "Play video";

  return (
    <div ref={containerRef} className={`cf-figure-frame relative ${aspect} overflow-hidden bg-white`}>
      {showVideo ? (
        <>
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            poster={asset.poster}
            loop
            muted
            playsInline
            aria-label={asset.alt}
          >
            <source src={asset.webm} type="video/webm" />
            <source src={asset.mp4} type="video/mp4" />
          </video>
          <button
            type="button"
            onClick={() => setUserPaused((prev) => !prev)}
            aria-label={userPaused ? playLabel : pauseLabel}
            className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white transition-colors hover:bg-black/70 focus-visible:bg-black/70"
          >
            {userPaused ? (
              <svg aria-hidden viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                <path d="M4 2.5v11l10-5.5-10-5.5Z" />
              </svg>
            ) : (
              <svg aria-hidden viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                <rect x="3.5" y="2.5" width="3" height="11" />
                <rect x="9.5" y="2.5" width="3" height="11" />
              </svg>
            )}
          </button>
        </>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- fixed local poster frame, not an optimizable remote asset
        <img src={asset.poster} alt={asset.alt} className="absolute inset-0 h-full w-full object-cover" />
      )}
    </div>
  );
}
