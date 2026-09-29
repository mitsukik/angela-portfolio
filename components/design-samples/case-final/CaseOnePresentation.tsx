"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import type { Locale } from "@/data/locale";
import { EvidenceTrigger } from "./CaseEvidenceViewer";
import { usePrefersReducedMotion, VideoEvidence } from "./VideoEvidence";

/*
 * CASE01 recruiter presentation layer (2026-09-29). Three visual layouts
 * only, shared by every CASE01 figure so the page reads as one system:
 *
 *   A  full-width primary visual — Working Product Preview, the diagrams
 *   B  rule rail + large stage (3/9 at xl) — Business rules → Product UI
 *   C  4-column coverage row + full-width stage — System coverage
 *
 * Every stage asset is a 16:9 plate: prototype captures are full-bleed dark
 * product UI; Figma screens sit on the same #1a1a1a mat as the diagrams
 * (.case01-plate). Each stage item is labelled with its source so the
 * portfolio reconstruction is never passed off as the original build.
 * Below `sm` the stage becomes a 4:5 frame: prototype screens are cropped to
 * their key region (`focus`); Figma documents switch to a 4:5 plate of the
 * whole screen (`phoneSrc`) rather than being cut. The evidence viewer
 * still opens the full image.
 */

export const CASE01_PROTOTYPE_URL = "https://case01-admin.vercel.app/";

type Source = "prototype" | "design";

const SOURCE_LABEL: Record<Locale, Record<Source, string>> = {
  zh: { prototype: "後台原型", design: "Figma 設計稿" },
  en: { prototype: "Admin prototype", design: "Figma design" },
};

/* ---------------------------------------------------------------- A -- */

/**
 * Working Product Preview — a 14.4s muted loop (true 2x capture, no fades;
 * the last 0.45s dissolves into frame 0 so the loop has no seam) recorded from the public admin
 * prototype (inventory health filters → oversold state → inventory log →
 * delivered order's shipping details). VideoEvidence owns lazy mount, in-view play/pause, the
 * WCAG 2.2.2 pause control, and the reduced-motion poster fallback.
 */
export function CaseOneProductPreview({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  // A hairline + small marked label hands the Hero over to the product: the
  // preview reads as the case's first exhibit, not a loose image under copy.
  return (
    <figure className="mt-10 border-t cf-rule pt-5 md:mt-12 md:pt-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
        <p className="flex items-center gap-3">
          <span aria-hidden className="case01-mark" />
          <span className="cf-meta cf-accent">Working Product Preview</span>
        </p>
        <a
          href={CASE01_PROTOTYPE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="case-link cf-meta cf-accent sm:whitespace-nowrap"
        >
          {zh ? "操作後台原型 ↗" : "Explore Interactive Prototype ↗"}
        </a>
      </div>
      <div className="case01-lift">
        <VideoEvidence
          format="wide"
          surface="dark"
          holdPosterUntilPlaying
          mp4First
          zhHant={zh}
          asset={{
            webm: "/videos/case01/case01-product-preview-2x.webm",
            mp4: "/videos/case01/case01-product-preview-2x.mp4",
            // First frame of the loop (clean Inventory screen): the same image
            // before load, while buffering, on refused autoplay and under
            // reduced motion, so playback starts without a jump.
            poster: "/images/case01/prototype/case01-product-preview-poster-2x.webp",
            alt: zh
              ? "後台原型操作預覽：依庫存狀態篩選、查看超賣商品與庫存異動紀錄，再開啟已送達訂單的出貨資訊"
              : "Admin prototype walkthrough: filtering inventory by stock health, reviewing oversold items and the inventory log, then opening a delivered order's shipping details",
          }}
        />
      </div>
      <figcaption className="cf-figure-caption cf-meta mt-3">
        {zh
          ? "為作品集展示重新建構的後台原型 · 庫存狀態 → 超賣 → 異動紀錄 → 訂單出貨"
          : "Admin prototype reconstructed for portfolio presentation · Stock health → Oversold → Inventory log → Order shipping"}
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------ B + C -- */

type StageItem = {
  /** Short tab label. */
  label: string;
  /** One sentence about the rule / capability. */
  note: string;
  /** Name of the screen shown on the stage. */
  screen: string;
  source: Source;
  src: string;
  /** Larger original opened in the evidence viewer, when it exists. */
  zoomSrc?: string;
  /** 4:5 phone plate for documents that must not be cropped (Figma screens). */
  phoneSrc?: string;
  /** Horizontal focus for the 4:5 phone frame (object-position x). The 16:9
   * frame shows the whole plate, so this only matters below `sm`. */
  focus?: string;
  /** Micro-loop of the same framing as `src`; `src` is the loop's last frame. */
  video?: { webm: string; mp4: string; poster: string };
  alt: string;
};

/**
 * Shared WAI-ARIA tabs behaviour for both selectors: automatic activation,
 * roving tabindex, Arrow / Home / End (with wrap). Click and tap operate
 * everything; hover only brightens.
 */
function useStageTabs(count: number) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const baseId = useId();

  const tabProps = (index: number) => ({
    ref: (element: HTMLButtonElement | null) => {
      tabRefs.current[index] = element;
    },
    type: "button" as const,
    role: "tab",
    id: `${baseId}-tab-${index}`,
    "aria-selected": index === active,
    "aria-controls": `${baseId}-panel-${index}`,
    tabIndex: index === active ? 0 : -1,
    onClick: () => setActive(index),
    onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => {
      const moves: Record<string, number> = {
        ArrowRight: index + 1,
        ArrowDown: index + 1,
        ArrowLeft: index - 1,
        ArrowUp: index - 1,
        Home: 0,
        End: count - 1,
      };
      if (!(event.key in moves)) return;
      event.preventDefault();
      const next = (moves[event.key] + count) % count;
      setActive(next);
      tabRefs.current[next]?.focus();
    },
  });

  return { active, baseId, tabProps };
}

const LOOP_LABEL: Record<Locale, { pause: string; play: string }> = {
  zh: { pause: "暫停示範", play: "播放示範" },
  en: { pause: "Pause demo", play: "Play demo" },
};

/**
 * Only a genuine autoplay-policy refusal should surface the play control —
 * that needs an actual user gesture, so retrying is pointless.
 */
function isAutoplayRefusal(error: unknown) {
  return error instanceof DOMException && error.name === "NotAllowedError";
}

/**
 * One 16:9 frame (4:5 below `sm`) with every panel stacked, so switching is
 * a 200ms cross-fade (instant under reduced motion) with no layout shift;
 * inactive panels are visibility:hidden, leaving the accessibility tree and
 * the tab order.
 *
 * Panels with a `video` micro-loop (Angela, 2026-09-29: continuous looping
 * is intended here): only the active loop plays, and only while the stage
 * is in view. It restarts from its first frame whenever its rule becomes
 * active or the stage re-enters the viewport, then loops natively; every
 * inactive loop is paused. A small play/pause control (WCAG 2.2.2) sits in
 * the corner; if the browser refuses autoplay (e.g. power saving) the
 * control shows "play" instead of leaving a frozen frame. Choosing another
 * rule clears a pause — selecting a rule asks to see it. Under reduced
 * motion no <video> mounts; the panel shows the loop's final frame.
 *
 * Bug fix (2026-09-29): the default-active rule (index 0) could appear
 * permanently static on first scroll-in. Confirmed live: Chrome can reject
 * the very first play() of a freshly-inserted muted, video-only element
 * with `AbortError: "...paused to save power"` — a transient decision by
 * the browser, unrelated to autoplay policy, and nothing else was
 * re-triggering play() for that same rule afterward. The restart (seek)
 * and the play attempt are now one effect (no ordering ambiguity between
 * them), and any rejection that isn't a real NotAllowedError gets a couple
 * of quick automatic retries before falling back to the manual control —
 * a stale retry for a rule the viewer has since switched away from is a
 * no-op via the `cancelled` flag, so rapid switching still never flashes
 * the play button (the original, still-valid reason non-policy errors were
 * ignored outright before this fix).
 */
function Stage({ items, active, baseId, sizes, locale }: { items: StageItem[]; active: number; baseId: string; sizes: string; locale: Locale }) {
  const reducedMotion = usePrefersReducedMotion();
  const frameRef = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const [inView, setInView] = useState(false);
  // Paused by the viewer (or refused autoplay) — tied to one rule, so a
  // different active rule is never paused.
  const [pausedFor, setPausedFor] = useState<number | null>(null);
  const paused = pausedFor === active;
  const hasVideo = items.some((item) => item.video);
  const showControl = Boolean(items[active].video) && !reducedMotion;

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || !hasVideo || reducedMotion) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(frame);
    return () => observer.disconnect();
  }, [hasVideo, reducedMotion]);

  // The single place playback (and the restart-from-first-frame that goes
  // with it) is driven — see the bug-fix note above the component doc.
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

      const retryOrGiveUp = (retriesLeft: number) => {
        if (cancelled) return;
        if (retriesLeft > 0) {
          setTimeout(() => {
            if (!cancelled) attempt(retriesLeft - 1);
          }, 200);
        } else {
          // Exhausted retries on something other than a policy refusal —
          // still surface the manual control rather than leaving a
          // silently frozen frame with a control that claims it's playing.
          setPausedFor(index);
        }
      };
      const attempt = (retriesLeft: number) => {
        video
          .play()
          .then(() => {
            // A resolved promise doesn't guarantee real playback under
            // aggressive power-saving — confirmed live: play() can resolve
            // and the element stays paused with no rejection at all. Treat
            // "resolved but still paused" the same as a rejection.
            setTimeout(() => {
              if (!cancelled && video.paused) retryOrGiveUp(retriesLeft);
            }, 50);
          })
          .catch((error: unknown) => {
            if (cancelled) return;
            if (isAutoplayRefusal(error)) {
              setPausedFor(index);
            } else {
              retryOrGiveUp(retriesLeft);
            }
          });
      };
      attempt(2);
    });
    return () => {
      cancelled = true;
    };
  }, [active, inView, paused, reducedMotion]);

  // Chrome can also pause an already-playing background-tab video outright
  // (same power-saving behavior); resume once the tab is visible again,
  // unless the viewer explicitly paused it themselves. Same pattern as
  // VideoEvidence.tsx's own visibilitychange handling.
  useEffect(() => {
    const resume = () => {
      if (document.visibilityState !== "visible" || paused || !inView) return;
      const video = videoRefs.current[active];
      if (video && video.paused) {
        video.muted = true;
        video.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", resume);
    return () => document.removeEventListener("visibilitychange", resume);
  }, [active, inView, paused]);

  const toggle = () => {
    if (!paused) {
      setPausedFor(active);
      return;
    }
    setPausedFor(null);
    // Called inside the click so a gesture-gated browser allows it.
    const video = videoRefs.current[active];
    if (video) {
      video.muted = true;
      video.play().catch((error: unknown) => {
        if (isAutoplayRefusal(error)) setPausedFor(active);
      });
    }
  };

  return (
    <div ref={frameRef} className="cf-figure-frame case01-stage case01-lift relative aspect-[4/5] sm:aspect-[16/9]">
      {items.map((item, index) => {
        const objectPosition = `${item.focus ?? "50%"} 50%`;
        return (
          <div
            key={item.src}
            role="tabpanel"
            id={`${baseId}-panel-${index}`}
            aria-labelledby={`${baseId}-tab-${index}`}
            data-active={index === active}
            className="case01-stage-panel absolute inset-0"
          >
            <EvidenceTrigger asset={{ src: item.zoomSrc ?? item.src, alt: item.alt, caption: item.screen }}>
              {item.video && !reducedMotion ? (
                <video
                  ref={(element) => {
                    videoRefs.current[index] = element;
                  }}
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition }}
                  poster={item.video.poster}
                  muted
                  loop
                  playsInline
                  disablePictureInPicture
                  // Nothing downloads until the stage is in view, and then only the active loop.
                  preload={index === active && inView ? "auto" : "none"}
                  aria-hidden
                  tabIndex={-1}
                >
                  {/* H.264 first: plays everywhere; some Safari builds claim
                      WebM/VP9 support and then leave only the poster. */}
                  <source src={item.video.mp4} type="video/mp4" />
                  <source src={item.video.webm} type="video/webm" />
                </video>
              ) : (
                <>
                  {item.phoneSrc && <Image src={item.phoneSrc} alt="" fill sizes="100vw" className="object-cover sm:hidden" />}
                  <Image
                    src={item.src}
                    alt=""
                    fill
                    sizes={sizes}
                    className={`object-cover ${item.phoneSrc ? "hidden sm:block" : ""}`}
                    style={{ objectPosition }}
                  />
                </>
              )}
            </EvidenceTrigger>
          </div>
        );
      })}
      {showControl && (
        <button type="button" className="case01-loop-toggle" data-paused={paused} aria-label={paused ? LOOP_LABEL[locale].play : LOOP_LABEL[locale].pause} onClick={toggle}>
          <span aria-hidden>
            {paused ? (
              <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
                <path d="M4 2.5v11l10-5.5-10-5.5Z" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
                <rect x="3.5" y="2.5" width="3" height="11" />
                <rect x="9.5" y="2.5" width="3" height="11" />
              </svg>
            )}
          </span>
        </button>
      )}
    </div>
  );
}

function StageHeader({ title, aside }: { title: string; aside?: string }) {
  return (
    <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
      <p className="cf-meta cf-accent">{title}</p>
      {aside && <p className="cf-meta cf-dim text-[11px]">{aside}</p>}
    </div>
  );
}

/**
 * Layout B. Hierarchy is ACTIVE RULE → ONE LARGE PRODUCT VISUAL: inactive
 * rules are a quiet index (number + label); only the active rule shows its
 * note and the screen it maps to — inside the rail at xl, under the stage
 * below xl. The whole block is prototype evidence, so the source is stated
 * once in the header instead of under every screen.
 */
function RulesSelector({ items, label, title, locale }: { items: StageItem[]; label: string; title: string; locale: Locale }) {
  const { active, baseId, tabProps } = useStageTabs(items.length);
  const current = items[active];
  return (
    <article data-evidence-entrance>
      <StageHeader title={title} aside={SOURCE_LABEL[locale].prototype} />
      {/* 3/9 at xl keeps the product visual dominant (~880px at 1440). */}
      <div className="xl:grid xl:grid-cols-12 xl:gap-10">
        <div role="tablist" aria-label={label} aria-orientation="vertical" data-layout="rail" className="case01-tabs grid grid-cols-2 border-t cf-rule xl:col-span-3 xl:grid-cols-1 xl:self-start">
          {items.map((item, index) => (
            <button key={item.src} {...tabProps(index)} className="case01-tab text-left">
              <span className="flex items-baseline gap-3">
                <span className="cf-meta case01-tab-index">{String(index + 1).padStart(2, "0")}</span>
                <span className="case01-tab-label cf-heading text-[15px] leading-6">{item.label}</span>
              </span>
              <span className="case01-tab-detail">
                <span className="cf-dim mt-2 block text-[14px] leading-6">{item.note}</span>
                <span className="cf-meta cf-accent mt-3 block">→ {item.screen}</span>
              </span>
            </button>
          ))}
        </div>
        <div className="mt-6 xl:col-span-9 xl:mt-0">
          <Stage items={items} active={active} baseId={baseId} locale={locale} sizes="(min-width: 1280px) 68vw, (min-width: 640px) 100vw, 230vw" />
          <div className="mt-4 xl:hidden">
            <p className="cf-body text-[15px] leading-7">{current.note}</p>
            <p className="cf-meta cf-accent mt-2">→ {current.screen}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

/** Layout C. Four quiet columns (label + note at lg+) over one large stage. */
function CoverageSelector({ items, label, title, locale }: { items: StageItem[]; label: string; title: string; locale: Locale }) {
  const { active, baseId, tabProps } = useStageTabs(items.length);
  const current = items[active];
  return (
    <article data-evidence-entrance>
      <StageHeader title={title} />
      <div role="tablist" aria-label={label} aria-orientation="horizontal" data-layout="row" className="case01-tabs grid grid-cols-2 border-t cf-rule lg:grid-cols-4">
        {items.map((item, index) => (
          <button key={item.src} {...tabProps(index)} className="case01-tab text-left">
            <span className="flex items-baseline gap-3">
              <span className="cf-meta case01-tab-index">{String(index + 1).padStart(2, "0")}</span>
              <span className="case01-tab-label cf-heading text-[15px] leading-6">{item.label}</span>
            </span>
            <span className="case01-tab-note cf-dim mt-2 hidden text-[14px] leading-6 lg:block">{item.note}</span>
          </button>
        ))}
      </div>
      <figure className="mt-6 lg:mt-8">
        <Stage items={items} active={active} baseId={baseId} locale={locale} sizes="(min-width: 1024px) 88vw, (min-width: 640px) 100vw, 230vw" />
        <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <span className="cf-figure-caption cf-meta">{current.screen}</span>
          <span className="cf-meta cf-dim text-[11px]">{SOURCE_LABEL[locale][current.source]}</span>
        </figcaption>
        <p className="cf-body mt-4 text-[15px] leading-7 lg:hidden">{current.note}</p>
      </figure>
    </article>
  );
}

const PROTO = "/images/case01/prototype";
const EVIDENCE = "/images/case01/evidence";

/** Layout B — the Section 03 rules, each shown as the prototype screen that carries it. */
export function CaseOneRulesToProduct({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  const items: StageItem[] = zh
    ? [
        { label: "倉庫驗收", note: "到貨商品經掃描點數後，才計入可售庫存。", screen: "掃描入庫", source: "prototype", src: `${PROTO}/case01-rule-scan-end.webp`, focus: "36%", video: { webm: `/videos/case01/rules/case01-rule-scan.webm`, mp4: `/videos/case01/rules/case01-rule-scan.mp4`, poster: `${PROTO}/case01-rule-scan-poster.webp` }, alt: "後台原型：開啟新增庫存、切換為掃描入庫並掃描，偵測到的數量與更新後庫存隨即顯示" },
        { label: "低庫存", note: "庫存狀態篩選，讓共享庫存中的低庫存商品一眼可見。", screen: "庫存狀態篩選 · 低庫存", source: "prototype", src: `${PROTO}/case01-rule-low-end.webp`, focus: "10%", video: { webm: `/videos/case01/rules/case01-rule-low.webm`, mp4: `/videos/case01/rules/case01-rule-low.mp4`, poster: `${PROTO}/case01-rule-low-poster.webp` }, alt: "後台原型：點選低庫存卡片，庫存列表由 20 項篩選為 2 項低庫存商品" },
        { label: "可控超賣", note: "超賣數量獨立呈現，不與可售庫存混在一起。", screen: "超賣狀態", source: "prototype", src: `${PROTO}/case01-rule-oversold-end.webp`, focus: "68%", video: { webm: `/videos/case01/rules/case01-rule-oversold.webm`, mp4: `/videos/case01/rules/case01-rule-oversold.mp4`, poster: `${PROTO}/case01-rule-oversold-poster.webp` }, alt: "後台原型：點選超賣卡片，列出三項超賣商品，可售數量與未規劃的超賣數量分開顯示" },
        { label: "庫存異動紀錄", note: "每一筆異動都保留操作者、原因與時間。", screen: "商品庫存異動紀錄", source: "prototype", src: `${PROTO}/case01-rule-log-end.webp`, focus: "35%", video: { webm: `/videos/case01/rules/case01-rule-log.webm`, mp4: `/videos/case01/rules/case01-rule-log.mp4`, poster: `${PROTO}/case01-rule-log-poster.webp` }, alt: "後台原型：從商品操作選單開啟庫存異動紀錄，列出建立、定價、更新、補貨入庫與盤點調整，並標示操作者與時間" },
      ]
    : [
        { label: "Warehouse verification", note: "Received stock is counted by scan before it becomes available inventory.", screen: "Add stock by scan", source: "prototype", src: `${PROTO}/case01-rule-scan-end.webp`, focus: "36%", video: { webm: `/videos/case01/rules/case01-rule-scan.webm`, mp4: `/videos/case01/rules/case01-rule-scan.mp4`, poster: `${PROTO}/case01-rule-scan-poster.webp` }, alt: "Admin prototype: opening Add stock, switching to Add Stock by Scan and scanning; the detected quantity and resulting stock appear" },
        { label: "Low-stock conditions", note: "Stock-health filters surface low-stock items in the shared inventory.", screen: "Stock health filter · Low Stock", source: "prototype", src: `${PROTO}/case01-rule-low-end.webp`, focus: "10%", video: { webm: `/videos/case01/rules/case01-rule-low.webm`, mp4: `/videos/case01/rules/case01-rule-low.mp4`, poster: `${PROTO}/case01-rule-low-poster.webp` }, alt: "Admin prototype: selecting the Low Stock card filters the inventory from 20 products to 2 low-stock items" },
        { label: "Controlled overselling", note: "Oversold quantity is shown as its own state, separate from available stock.", screen: "Oversold state", source: "prototype", src: `${PROTO}/case01-rule-oversold-end.webp`, focus: "68%", video: { webm: `/videos/case01/rules/case01-rule-oversold.webm`, mp4: `/videos/case01/rules/case01-rule-oversold.mp4`, poster: `${PROTO}/case01-rule-oversold-poster.webp` }, alt: "Admin prototype: selecting the Oversold card lists three oversold products, with available units and unplanned oversold quantities shown separately" },
        { label: "Inventory history", note: "Every change keeps who made it, why, and when.", screen: "Product Inventory Log", source: "prototype", src: `${PROTO}/case01-rule-log-end.webp`, focus: "35%", video: { webm: `/videos/case01/rules/case01-rule-log.webm`, mp4: `/videos/case01/rules/case01-rule-log.mp4`, poster: `${PROTO}/case01-rule-log-poster.webp` }, alt: "Admin prototype: opening the inventory history from a product row menu, listing creation, pricing, update, restock and stocktake entries with operator and time" },
      ];
  return <RulesSelector items={items} title={zh ? "商業規則 → 產品介面" : "Business rules → Product UI"} label={zh ? "商業規則" : "Business rules"} locale={locale} />;
}

/** Layout C — the remaining operational scope, one screen at a time. */
export function CaseOneSystemCoverage({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  const items: StageItem[] = zh
    ? [
        { label: "訂單管理", note: "在同一營運視圖中整合訂單狀態、銷售來源與待處理操作。", screen: "訂單管理", source: "prototype", src: `${PROTO}/case01-proto-orders.webp`, focus: "37%", alt: "後台原型的訂單管理列表，呈現付款狀態、Agent／直播主／直接購買來源與訂單狀態" },
        { label: "售後狀態處理", note: "退貨結果會重新影響庫存與履約狀態，包括重新入庫、報廢、退款與重新出貨。", screen: "退貨詳情", source: "design", src: `${EVIDENCE}/case01-figma-after-sales.webp`, phoneSrc: `${EVIDENCE}/case01-figma-after-sales-phone.webp`, zoomSrc: `${EVIDENCE}/case01-after-sales-states.webp`, alt: "退貨詳情，呈現退貨商品的 Restock 與 Disposed 狀態，以及退款方式與重新出貨追蹤欄位" },
        { label: "Agent 與 Streamer 協作", note: "協作狀態讓 Agent 快速理解 Streamer 目前是可邀請、已送出邀請、合作中或已結束合作。", screen: "直播主名單", source: "design", src: `${EVIDENCE}/case01-figma-streamer.webp`, phoneSrc: `${EVIDENCE}/case01-figma-streamer-phone.webp`, zoomSrc: `${EVIDENCE}/case01-streamer-collaboration.webp`, alt: "直播主名單卡片，呈現送出合作邀請、已送出邀請、合作中與結束合作等狀態" },
        { label: "消費者結帳狀態", note: "當商品在結帳時已無法購買，前台會提示缺貨、將商品數量歸零並停用 Checkout。", screen: "缺貨提示 · 停用的 Checkout", source: "design", src: `${EVIDENCE}/case01-figma-checkout.webp`, phoneSrc: `${EVIDENCE}/case01-figma-checkout-phone.webp`, alt: "結帳確認頁的缺貨警告，以及數量歸零的缺貨商品與停用的 Checkout 按鈕" },
      ]
    : [
        { label: "Order Management", note: "Order states, seller source, and required actions are brought together in one operational view.", screen: "Order Management", source: "prototype", src: `${PROTO}/case01-proto-orders.webp`, focus: "37%", alt: "Admin prototype order list showing payment status, Agent / Streamer / Direct source, and order status" },
        { label: "After-sales State Handling", note: "Return outcomes feed back into inventory and fulfillment states, including restock, disposal, refund and reshipment.", screen: "Return detail", source: "design", src: `${EVIDENCE}/case01-figma-after-sales.webp`, phoneSrc: `${EVIDENCE}/case01-figma-after-sales-phone.webp`, zoomSrc: `${EVIDENCE}/case01-after-sales-states.webp`, alt: "Return detail showing Restock and Disposed item states, refund type and method, and reshipment tracking" },
        { label: "Agent–Streamer Collaboration", note: "Collaboration states help Agents understand whether a Streamer is available, invited, active or no longer collaborating.", screen: "Streamer list", source: "design", src: `${EVIDENCE}/case01-figma-streamer.webp`, phoneSrc: `${EVIDENCE}/case01-figma-streamer-phone.webp`, zoomSrc: `${EVIDENCE}/case01-streamer-collaboration.webp`, alt: "Streamer list cards showing Send Cooperation Request, Request Sent, In Collaboration, and End Collaboration states" },
        { label: "Consumer Checkout State", note: "When an item is unavailable at checkout, the storefront warns the user, sets the quantity to zero, and disables Checkout.", screen: "Out-of-stock warning · Disabled Checkout", source: "design", src: `${EVIDENCE}/case01-figma-checkout.webp`, phoneSrc: `${EVIDENCE}/case01-figma-checkout-phone.webp`, alt: "Checkout confirmation out-of-stock warning, plus the out-of-stock item at quantity 0 and the disabled Checkout button" },
      ];
  return <CoverageSelector items={items} title={zh ? "系統涵蓋範圍" : "System coverage"} label={zh ? "系統涵蓋範圍" : "System coverage"} locale={locale} />;
}
