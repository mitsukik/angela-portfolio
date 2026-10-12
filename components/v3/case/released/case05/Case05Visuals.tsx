"use client";

import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import type { Locale } from "@/data/locale";
import { EvidenceTrigger } from "@/components/design-samples/case-final/CaseEvidenceViewer";
import { VideoEvidence } from "@/components/design-samples/case-final/VideoEvidence";

/*
 * CASE05 — reconstructed visuals.
 *
 * Images are 2x captures of Angela's polished Ops UI prototype (Claude
 * Design, 2026-10-08) of the 2023 screens: same fields, flows and states,
 * sample data, clock fixed to a 2023 sample time. Loops are recordings of
 * real interactions in that prototype.
 * All images open in the shared evidence viewer for full-size inspection.
 */

// Served from public/legacy-assets/case05/.
const SRC = (name: string) => `/legacy-assets/case05/case05-${name}.webp`;

type Shot = { name: string; w: number; h: number; alt: Record<Locale, string> };

const SHOTS = {
  board: { name: "v2-board", w: 3840, h: 2162, alt: { zh: "生產批次總表（16:9 現場看板）：九個批次依攪拌、分割、整形、發酵、出爐分段，成對顯示開始／結束時間，超出標準以紅點標示；下方為待辦事項、人員批次與口味統計（示意數據）", en: "Production batch board (16:9 floor display): nine batches grouped by mixing, dividing, shaping, proofing and baking stages, with paired start / end times and out-of-standard values marked in red; notes, staff and flavour statistics below (sample data)" } },
  boardMobile: { name: "v2-board-mobile", w: 1520, h: 1800, alt: { zh: "生產批次總表左側局部：批次、口味、製造數、攪拌與分割時間", en: "Left portion of the production batch board: batches, flavours, quantities, mixing and dividing times" } },
  proofing: { name: "v2-station-proofing", w: 2388, h: 1670, alt: { zh: "發酵室站台：批次、口味、製造數、人員、發酵（入）／（出）時間與發酵時長，上方為待辦事項、統計數據、操作歷程與新增發酵時間", en: "Fermentation Room station: batches, flavours, quantities, staff, proof-in / proof-out times and proofing duration, with notes, statistics, operation history and add proofing time" } },
  schedule: { name: "v2-admin-schedule", w: 2880, h: 1802, alt: { zh: "排程 CMS：當日各口味配貨數量與已排程數量（不符者標紅），以及含人員分工的批次排程表與編輯中的一列", en: "Scheduling CMS: allocated vs scheduled quantity per flavour (mismatches in red), and the batch schedule with role assignments and a row being edited" } },
  /* Distance-reading detail of the board (clock, legend, stage headers,
     one row) — cropped so Decision 02 does not repeat the full board. */
  boardDistance: { name: "v2-board-distance", w: 1330, h: 985, alt: { zh: "大型生產看板局部：大字級時鐘、標準內／超出標準圖例、製程分段標頭，以及大字級的時間數值", en: "Large production dashboard detail: a large clock, the in-standard / out-of-standard legend, stage headers and large time values" } },
  stateUnconfirmed: { name: "v2-state-unconfirmed", w: 468, h: 186, alt: { zh: "實際介面中的「未確認」狀態標籤", en: "The “Unconfirmed” state label in the actual UI" } },
  stateConfirmed: { name: "v2-state-confirmed", w: 468, h: 186, alt: { zh: "實際介面中的「已確認」狀態標籤", en: "The “Confirmed” state label in the actual UI" } },
  stateProducing: { name: "v2-state-producing", w: 468, h: 186, alt: { zh: "實際介面中的「生產中」狀態標籤", en: "The “In production” state label in the actual UI" } },
  stateView: { name: "v2-state-view", w: 468, h: 186, alt: { zh: "實際介面中的「檢視」狀態標籤", en: "The “View” state label in the actual UI" } },
  calendar: { name: "v2-admin-calendar", w: 2880, h: 1802, alt: { zh: "生產工作排程月曆：以顏色區分檢視、已確認、未確認、生產中四種狀態", en: "Production schedule calendar, colour-coding the View, Confirmed, Unconfirmed and In production states" } },
  /* The calendar's first two weeks — the only area where the four states
     appear — enlarged; opens the full calendar in the viewer. */
  calendarStates: { name: "v2-calendar-states", w: 2239, h: 600, alt: { zh: "生產工作排程月曆局部：3 日檢視、4 日已確認、5 日未確認、6 日生產中", en: "Production schedule calendar detail: View on the 3rd, Confirmed on the 4th, Unconfirmed on the 5th, In production on the 6th" } },
  mobile: { name: "v2-admin-mobile", w: 780, h: 1690, alt: { zh: "行動版排程：生產數量分頁，配貨與已排程數量不符者標紅", en: "Mobile scheduling: quantity tab, with allocation mismatches in red" } },
} satisfies Record<string, Shot>;

const ratio = (shot: Shot): CSSProperties => ({ aspectRatio: `${shot.w} / ${shot.h}` });

/* Loops: 1x recordings of real interactions in the polished prototype
 * (scratchpad capture scripts); reduced motion shows the still. */
const LOOP = (name: string) => ({
  webm: `/legacy-assets/case05/case05-loop-${name}.webm`,
  mp4: `/legacy-assets/case05/case05-loop-${name}.mp4`,
  poster: `/legacy-assets/case05/case05-loop-${name}-poster.webp`,
});

function Loop({ name, ratio: r, still, alt, locale, surface = "dark" }: { name: string; ratio: string; still: Shot; alt: Record<Locale, string>; locale: Locale; surface?: "dark" | "light" }) {
  return (
    <VideoEvidence
      ratio={r}
      surface={surface}
      holdPosterUntilPlaying
      mp4First
      zhHant={locale === "zh"}
      asset={{ ...LOOP(name), alt: alt[locale], reducedMotion: { poster: SRC(still.name), alt: still.alt[locale] } }}
    />
  );
}

/** One inspectable image: fixed aspect box + shared evidence viewer. */
function Frame({ shot, locale, sizes, framed = false, eager = false, viewer = shot, className = "" }: {
  shot: Shot;
  locale: Locale;
  sizes: string;
  framed?: boolean;
  eager?: boolean;
  /** Asset opened in the viewer (e.g. the full board behind a mobile crop). */
  viewer?: Shot;
  className?: string;
}) {
  return (
    <div className={`relative w-full ${framed ? "cf-figure-frame" : ""} ${className}`} style={ratio(shot)}>
      <EvidenceTrigger asset={{ src: SRC(viewer.name), alt: viewer.alt[locale] }}>
        <Image src={SRC(shot.name)} alt="" fill unoptimized loading={eager ? "eager" : "lazy"} sizes={sizes} className="object-contain" />
      </EvidenceTrigger>
    </div>
  );
}

function Caption({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <figcaption className={`cf-dim mt-4 max-w-[62ch] text-[13px] leading-6 ${className}`}>{children}</figcaption>;
}

/* 01 — hero-production-board ---------------------------------------- */

export function Case05HeroBoard({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  return (
    <figure>
      <Frame shot={SHOTS.board} locale={locale} eager sizes="(min-width: 1024px) 80vw, 100vw" className="hidden md:block" />
      <Frame shot={SHOTS.boardMobile} viewer={SHOTS.board} locale={locale} framed eager sizes="100vw" className="md:hidden" />
      <Caption className="md:hidden">{zh ? "點擊檢視完整看板" : "Tap to view the full board"}</Caption>
    </figure>
  );
}

/* Decision 01 — board-hierarchy ------------------------------------ */

const legend = (): { mark: ReactNode; text: Record<Locale, string> }[] => [
  { mark: <span className="rounded-[4px] bg-[#f0ae3e] px-1.5 text-[11px] font-bold text-[#111]">分割</span>, text: { zh: "依製程分段的欄位標頭", en: "Column headers grouped by stage" } },
  { mark: <span className="font-mono text-[12px] leading-[1.1] text-[#7fb2f0]">09:30<br />09:50</span>, text: { zh: "開始／結束時間成對", en: "Start and end times paired" } },
  { mark: <span className="size-2.5 rounded-full bg-[#ff7a6e]" />, text: { zh: "紅點＝超出標準", en: "Red marker = out of standard" } },
];

export function Case05BoardHierarchy({ locale }: { locale: Locale }) {
  return (
    <figure>
      <div className="lg:w-[86%]">
        <Loop
          name="board"
          ratio="1920 / 1080"
          still={SHOTS.board}
          locale={locale}
          alt={{
            zh: "操作錄影：依序聚焦分割、整形 1、發酵三個製程段，其他欄位淡出；接著沿著可可批次的一列追蹤",
            en: "Recording: the dividing, shaping 1 and proofing stages are isolated in turn while other columns fade; then the cocoa batch is followed along its row",
          }}
        />
      </div>
      <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
        {legend().map((l) => (
          <li key={l.text.en} className="flex items-center gap-3 text-[14px] leading-6">
            <span className="grid min-w-9 place-items-center">{l.mark}</span>
            <span className="cf-body">{l.text[locale]}</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}

/* Decision 02 — three-contexts --------------------------------------- */

function Context({ n, title, note, children, className = "" }: { n: string; title: string; note: string; children: ReactNode; className?: string }) {
  return (
    <figure className={className}>
      {children}
      <figcaption className="mt-3 flex items-baseline gap-3">
        <span className="cf-meta cf-accent">{n}</span>
        <span className="text-[14px] leading-6"><span className="cf-heading font-medium">{title}</span><span className="cf-dim"> · {note}</span></span>
      </figcaption>
    </figure>
  );
}

export function Case05ThreeContexts({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-12">
      <Context className="lg:col-span-6 lg:self-end" n="01" title={zh ? "大型生產看板" : "Large production dashboard"} note={zh ? "大字級時間與狀態，遠距查看" : "large times and states, read at a distance"}>
        <Frame shot={SHOTS.boardDistance} viewer={SHOTS.board} locale={locale} framed sizes="(min-width: 1024px) 42vw, 100vw" />
      </Context>
      <Context className="lg:col-span-6 lg:self-end" n="02" title={zh ? "生產站台" : "Production station"} note={zh ? "依區域、近距觸控輸入" : "touch entry by area"}>
        <Loop
          name="proofing"
          ratio="1194 / 834"
          still={SHOTS.proofing}
          locale={locale}
          alt={{ zh: "操作錄影：發酵室站台開啟「新增發酵時間」，按下確定後變為已確認；再開啟統計數據與操作歷程", en: "Recording: on the Fermentation Room station, “Add proofing time” opens and Confirm turns into a check; then statistics and operation history open" }}
        />
      </Context>
      <Context className="lg:col-span-9" n="03" title={zh ? "管理後台" : "Admin backend"} note={zh ? "排程、配置與設定" : "scheduling, setup and settings"}>
        <Frame shot={SHOTS.schedule} locale={locale} framed sizes="(min-width: 1024px) 60vw, 100vw" />
      </Context>
      <Context className="mx-auto w-[62%] max-w-[15rem] lg:col-span-3 lg:w-full lg:max-w-none lg:self-end" n="03" title={zh ? "後台手機版" : "Admin on mobile"} note={zh ? "數量與排程列表" : "quantities and batch list"}>
        <Loop
          name="admin-mobile"
          ratio="780 / 1688"
          still={SHOTS.mobile}
          surface="light"
          locale={locale}
          alt={{ zh: "操作錄影：行動版排程切換到排程列表，開啟清除排程並勾選欄位後取消，再開啟新增，最後回到生產數量", en: "Recording: mobile scheduling switches to the batch list, opens Clear schedule and selects fields before cancelling, opens Add, then returns to quantities" }}
        />
      </Context>
    </div>
  );
}

/* Decision 03 — states-safeguards ------------------------------------ */

/** Labelled reconstruction (not an original screen) of two documented
 * safeguards in the P2 specification: past shipping records are view-only,
 * and switching products with unsaved changes prompts a save. Same light
 * admin palette as the polished backend screens. */
function SafeguardReconstruction({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  const rows = zh ? [["原味2斤", "465", "465"], ["可可", "124", "124"]] : [["Plain 2 jin", "465", "465"], ["Cocoa", "124", "124"]];
  return (
    <div className="grid gap-4 rounded-[14px] bg-[#f4f2ee] p-4 text-[#1d1e22] sm:grid-cols-2 sm:items-start sm:p-5" aria-label={zh ? "依規格重建示意：唯讀紀錄與未儲存提醒" : "Reconstruction from the specification: view-only record and unsaved-change reminder"} role="img">
      <div className="rounded-[10px] border border-[#e4e1da] bg-white p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[15px] font-bold">{zh ? "出貨配置" : "Shipping setup"}</span>
          <span className="font-mono text-[13px] text-[#6b6e78]">2023-01-30</span>
          <span className="ml-auto flex items-center gap-2"><span className="inline-flex items-center gap-1.5 rounded-[6px] bg-[#ece8f8] px-2.5 py-0.5 text-[12px] font-semibold text-[#3b3460]"><span className="size-1.5 rounded-full bg-[#6a52c8]" />{zh ? "檢視 · 僅可查看" : "View · read-only"}</span>
          <Marker n={4} /></span>
        </div>
        <div className="mt-3 grid grid-cols-[1fr_auto_auto] gap-x-4 gap-y-1.5 text-[13px]">
          <span className="text-[#6b6e78]">{zh ? "產品" : "Product"}</span><span className="text-[#6b6e78]">{zh ? "可販售" : "Sellable"}</span><span className="text-[#6b6e78]">{zh ? "出貨" : "Shipped"}</span>
          {rows.map(([p, a, b]) => [
            <span key={p}>{p}</span>,
            <span key={p + "a"} className="font-mono">{a}</span>,
            <span key={p + "b"} className="rounded-[6px] bg-[#f4f2ee] px-2 font-mono text-[#9a9ca4]">{b}</span>,
          ])}
        </div>
        <p className="mt-3 text-[12px] text-[#6b6e78]">{zh ? "已過去的日期僅可檢視，不可編輯。" : "Past dates can be viewed, not edited."}</p>
      </div>
      <div className="rounded-[10px] border border-[#e4e1da] bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
        <p className="text-[15px] font-bold">{zh ? "尚未儲存" : "Unsaved changes"}</p>
        <p className="mt-1.5 text-[13px] leading-5 text-[#4b4e57]">{zh ? "切換產品前，請先儲存目前的出貨配置。" : "Save this shipping setup before switching products."}</p>
        <div className="mt-3 flex justify-end gap-2 text-[13px] font-semibold">
          <span className="rounded-full border border-[#d6d3cc] px-4 py-1.5">{zh ? "取消" : "Cancel"}</span>
          <span className="rounded-full bg-[#f0ae3e] px-4 py-1.5">{zh ? "儲存" : "Save"}</span>
        </div>
      </div>
    </div>
  );
}

function Tag({ children, tone }: { children: ReactNode; tone: "actual" | "rebuilt" }) {
  return <p className={`cf-meta mb-3 ${tone === "actual" ? "cf-accent" : "cf-dim"}`}>{children}</p>;
}

/** Number badge shared by the calendar highlights, the state key and the
 * reconstruction, so the three read as one system. Dark-edged so it holds
 * on the light admin UI and on the page. */
function Marker({ n, className = "" }: { n: number; className?: string }) {
  return (
    <span aria-hidden className={`inline-grid size-6 shrink-0 place-items-center rounded-full border-2 border-[#111] bg-[var(--v3-lime)] font-mono text-[11px] font-bold leading-none text-[#111] ${className}`}>
      {String(n).padStart(2, "0")}
    </span>
  );
}

/* Lifecycle order (spec), with each chip's box in the calendar crop (%). */
const states = (): { shot: Shot; def: Record<Locale, string>; box: [number, number, number, number] }[] => [
  { shot: SHOTS.stateUnconfirmed, def: { zh: "未完成生產配置", en: "Setup not finished" }, box: [0.85, 83.3, 12.6, 9.2] },
  { shot: SHOTS.stateConfirmed, def: { zh: "已完成配置，尚未開始生產", en: "Set up, not yet started" }, box: [85.7, 41.5, 12.6, 9.2] },
  { shot: SHOTS.stateProducing, def: { zh: "已有批次開始生產", en: "A batch has started" }, box: [15.0, 83.3, 12.6, 9.2] },
  { shot: SHOTS.stateView, def: { zh: "已生產完成，僅可查看", en: "Completed, view-only" }, box: [71.5, 41.5, 12.7, 9.2] },
];

export function Case05StatesSafeguards({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  return (
    <div className="grid gap-12">
      {/* Actual UI: the calendar area where the four states live, enlarged,
          each state outlined and numbered in lifecycle order; the key below
          repeats the real chips at full size with the spec's meaning. */}
      <figure>
        <Tag tone="actual">{zh ? "實際介面 · 生產工作排程月曆（局部）" : "Actual UI · production schedule calendar (detail)"}</Tag>
        <div className="relative">
          <Frame shot={SHOTS.calendarStates} viewer={SHOTS.calendar} locale={locale} framed sizes="(min-width: 1024px) 80vw, 100vw" />
          {states().map((st, i) => {
            const [x, y, w, h] = st.box;
            return (
              <span key={st.shot.name} aria-hidden className="pointer-events-none absolute rounded-[6px] outline outline-2 outline-offset-2 outline-[#111]" style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }}>
                <Marker n={i + 1} className="absolute right-[4%] top-1/2 -translate-y-1/2 scale-[0.6] sm:scale-90 lg:scale-100" />
              </span>
            );
          })}
        </div>
        <ol className="mt-6 grid grid-cols-2 gap-x-5 gap-y-6 md:grid-cols-4 md:gap-x-8">
          {states().map((st, i) => (
            <li key={st.shot.name}>
              <div className="flex items-center gap-3">
                <Marker n={i + 1} />
                {i < 3 ? <span aria-hidden className="cf-rule hidden h-px flex-1 border-t md:block" /> : null}
              </div>
              <div className="mt-3 max-w-[15rem]">
                <Frame shot={st.shot} locale={locale} framed sizes="(min-width: 768px) 16vw, 45vw" />
              </div>
              <p className="cf-body mt-3 text-[14px] leading-6">{st.def[locale]}</p>
            </li>
          ))}
        </ol>
      </figure>
      {/* Reconstruction: the same read-only rule as state 04, applied to
          past shipping records, plus the unsaved-change prompt. */}
      <figure className="grid gap-6 lg:grid-cols-12 lg:items-start lg:gap-8">
        <div className="lg:col-span-4">
          <Tag tone="rebuilt">{zh ? "依規格重建 · 非原始畫面" : "Reconstructed from the specification · not an original screen"}</Tag>
          <figcaption className="cf-dim flex max-w-[62ch] gap-3 text-[13px] leading-6">
            <Marker n={4} className="mt-0.5" />
            <span>{zh ? "與狀態 04 相同的唯讀原則，也套用在已過去的出貨紀錄；切換產品前，提醒先儲存。" : "The read-only rule of state 04 also applies to past shipping records; switching products prompts a save first."}</span>
          </figcaption>
        </div>
        <div className="lg:col-span-8">
          <SafeguardReconstruction locale={locale} />
        </div>
      </figure>
    </div>
  );
}
