"use client";

import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import type { Locale } from "@/data/locale";
import { EvidenceTrigger } from "@/components/design-samples/case-final/CaseEvidenceViewer";
import { VideoEvidence } from "@/components/design-samples/case-final/VideoEvidence";

/*
 * CASE07 visuals (LOCAL DEVELOPMENT ONLY; reached only through the legacy
 * case route, gated out of production).
 *
 * Source: the UnMe iOS interactive prototype (legacy-prototypes/case07, a
 * 2026 redesign on sample data — Angela, 2026-10-08). Stills are
 * 2x captures of its screens; the loops are 2x recordings of real taps
 * through it (scratchpad capture scripts). Files live in the non-public
 * legacy-assets/case07/ folder (dev route only).
 */

const SRC = (name: string) => `/legacy-assets/case07/case07-${name}.webp`;
const LOOP = (name: string) => ({
  webm: `/legacy-assets/case07/case07-loop-${name}.webm`,
  mp4: `/legacy-assets/case07/case07-loop-${name}.mp4`,
  poster: `/legacy-assets/case07/case07-loop-${name}-poster.webp`,
});

type Shot = { name: string; w: number; h: number; alt: Record<Locale, string> };
const PHONE = { w: 780, h: 1688 };

const SHOTS = {
  home: { name: "home", ...PHONE, alt: { zh: "地圖首頁：書包在地圖上的位置，下方列表顯示每個書包是否在安全範圍內、是否連線與電量", en: "Map home: bag positions on the map, with a list showing each bag’s safe-zone, connection and battery status" } },
  timeline: { name: "timeline", ...PHONE, alt: { zh: "時間軸：依時間排列的在家、學校與安親班紀錄，學校那一段標示 16:05 離開電子圍籬範圍", en: "History: home, school and after-school stops in time order, with the school segment marking that the bag left the safe zone at 16:05" } },
  alerts: { name: "alerts", ...PHONE, alt: { zh: "通知：未讀的「離開學校範圍」與「電量剩 8%」排在最上方，下方是已讀的抵達與 SOS 測試通知", en: "Alerts: unread “left the school zone” and “battery at 8%” at the top, with read arrival and SOS-test notices below" } },
  zoneList: { name: "zone-list", ...PHONE, alt: { zh: "電子圍籬列表：學校（啟用）與安親班（未啟用、淡化），各自顯示上午／下午時段、星期與範圍", en: "Safe-zone list: School (on) and After-school (off, dimmed), each with its a.m./p.m. time range, weekdays and radius" } },
  report: { name: "report", ...PHONE, alt: { zh: "回報頻率：每 10 到 60 分鐘的選項與預估電池續航，建議 20 分鐘", en: "Report frequency: 10–60 minute options with estimated battery life; 20 minutes recommended" } },
  zoneEdit: { name: "zone-edit", ...PHONE, alt: { zh: "編輯電子圍籬：標籤、上午／下午時段、重複的星期與安全範圍在同一頁", en: "Editing a safe zone: label, a.m./p.m. time range, repeat days and radius on one screen" } },
  timelineEmpty: { name: "timeline-empty", ...PHONE, alt: { zh: "時間軸空狀態：7月16日週六「這天沒有移動紀錄」，並說明假日或書包未開機時不會產生紀錄", en: "Timeline empty state: Saturday 16 July shows “No movement records this day”, explaining that holidays or a switched-off bag produce no records" } },
  offlineDetail: { name: "offline-detail", ...PHONE, alt: { zh: "離線書包的詳情頁：無法顯示目前位置、更新於 3 小時前，並說明可能電量不足或不在訊號範圍內", en: "Offline bag detail: current location unavailable, last updated 3 hours ago, with likely causes (low battery or out of signal range)" } },
} satisfies Record<string, Shot>;

const ratio = (shot: Shot): CSSProperties => ({ aspectRatio: `${shot.w} / ${shot.h}` });
/* iPhone display corners (Angela, 2026-10-08): 46px on a 390×844 screen,
 * as percentages so the curve scales with the column. Full phone screens
 * only — the map detail crop stays square like other evidence. */
const SCREEN_RADIUS: CSSProperties = { borderRadius: "11.8% / 5.45%" };
const isScreen = (shot: Shot) => shot.h / shot.w > 2;

function Frame({ shot, locale, sizes, framed = false, eager = false, className = "" }: {
  shot: Shot; locale: Locale; sizes: string; framed?: boolean; eager?: boolean; className?: string;
}) {
  return (
    <div className={`relative w-full ${framed ? "cf-figure-frame" : ""} ${isScreen(shot) ? "overflow-hidden [&_*]:[border-radius:inherit] [&_*::after]:[border-radius:inherit]" : ""} ${className}`} style={{ ...ratio(shot), ...(isScreen(shot) ? SCREEN_RADIUS : {}) }}>
      <EvidenceTrigger asset={{ src: SRC(shot.name), alt: shot.alt[locale] }}>
        <Image src={SRC(shot.name)} alt="" fill unoptimized loading={eager ? "eager" : "lazy"} sizes={sizes} className="object-contain" />
      </EvidenceTrigger>
    </div>
  );
}

function Label({ n, children }: { n: string; children: ReactNode }) {
  return (
    <p className="mt-4 flex items-baseline gap-3">
      <span className="cf-meta cf-accent">{n}</span>
      <span className="cf-heading text-[15px] font-medium">{children}</span>
    </p>
  );
}

function Loop({ name, locale, alt, still }: { name: string; locale: Locale; alt: Record<Locale, string>; still?: Shot }) {
  return (
    <div className="overflow-hidden" style={SCREEN_RADIUS}>
    <VideoEvidence
      format="phone"
      holdPosterUntilPlaying
      mp4First
      zhHant={locale === "zh"}
      asset={{ ...LOOP(name), alt: alt[locale], reducedMotion: still ? { poster: SRC(still.name), alt: still.alt[locale] } : undefined }}
    />
    </div>
  );
}

/* Overview (above the fold) — the three parent questions, one screen each. */

export function Case07Overview({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  const items: { shot: Shot; q: string }[] = [
    { shot: SHOTS.home, q: zh ? "人在哪裡" : "Where is my child?" },
    { shot: SHOTS.timeline, q: zh ? "發生過什麼" : "What has happened?" },
    { shot: SHOTS.alerts, q: zh ? "需不需要處理" : "Does anything need attention?" },
  ];
  return (
    <figure>
      <div className="mx-auto grid max-w-[60rem] grid-cols-3 gap-3 sm:gap-6 md:gap-10">
        {items.map((item, i) => (
          <div key={item.shot.name}>
            <Frame shot={item.shot} locale={locale} eager sizes="(min-width: 768px) 26vw, 31vw" />
            <Label n={String(i + 1).padStart(2, "0")}>{item.q}</Label>
          </div>
        ))}
      </div>
    </figure>
  );
}

/* Decision visuals ------------------------------------------------------ */

function Phone({ children, caption }: { children: ReactNode; caption?: string }) {
  return (
    <div>
      {children}
      {caption ? <p className="cf-dim mt-3 text-[13px] leading-5">{caption}</p> : null}
    </div>
  );
}

/** Decision 01: "now" (map) and "what happened" (history), side by side. */
export function Case07DecisionNowHistory({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  return (
    <div className="mx-auto grid max-w-[19rem] gap-8 md:max-w-[38rem] md:grid-cols-2 md:items-start md:gap-8">
      <Phone caption={zh ? "現在：點選書包，地圖直接移到它；離線時說明原因" : "Now: tap a bag and the map moves to it; offline bags explain why"}>
        <Loop
          name="map"
          locale={locale}
          still={SHOTS.home}
          alt={{
            zh: "操作錄影：點選小晴與阿哲的書包，地圖平移到各自位置；再點一次離線的阿哲書包，跳出「無法顯示目前位置」說明，最後回到小安的書包",
            en: "Recording: tapping two other bags pans the map to each; tapping the offline bag again explains why its current location can’t be shown, then the first bag is selected again",
          }}
        />
      </Phone>
      <div className="md:mt-[18%]">
        <Phone caption={zh ? "發生過什麼：選取一段，地圖標出對應路線" : "What happened: select a segment to highlight its route"}>
          <Loop
            name="timeline"
            locale={locale}
            still={SHOTS.timeline}
            alt={{
              zh: "操作錄影：時間軸上點選在家、安親班與中正國小，地圖同步標示對應路段；切換到前兩天再回到今天",
              en: "Recording: selecting each stop in the history highlights its route segment on the map; switching back two days and returning to today",
            }}
          />
        </Phone>
      </div>
    </div>
  );
}

/** Decision B: list → editor → unsaved prompt, and editor → validation →
 * saved, side by side. */
export function Case07DecisionSafety({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  return (
    <div className="mx-auto grid max-w-[19rem] gap-8 md:max-w-[38rem] md:grid-cols-2 md:items-start md:gap-8">
      <Phone caption={zh ? "列表看出哪些規則生效；範圍在地圖上即時變化，未儲存離開先確認" : "The list shows which rules are on; the radius redraws live, and leaving unsaved asks first"}>
        <Loop
          name="zone"
          locale={locale}
          still={SHOTS.zoneList}
          alt={{
            zh: "操作錄影：電子圍籬列表中學校啟用、安親班未啟用並淡化；進入編輯，範圍由 1 公里改為 2 公里再改為 500 公尺、加選週六，按取消後出現「修改尚未儲存」確認，選擇放棄變更",
            en: "Recording: the safe-zone list shows School on and After-school off and dimmed; editing changes the range from 1 km to 2 km to 500 m and adds Saturday; cancelling shows the unsaved-changes prompt, and the changes are discarded",
          }}
        />
      </Phone>
      <div className="md:mt-[18%]">
        <Phone caption={zh ? "儲存前檢查：至少選一天；儲存後提示完成" : "Checked before saving — at least one day — then confirmed"}>
          <Loop
            name="zonesave"
            locale={locale}
            still={SHOTS.zoneEdit}
            alt={{
              zh: "操作錄影：編輯學校圍籬時取消所有星期並按完成，出現「請選擇重複的日子」；重新選擇週一、三、五後儲存，回到列表並顯示「已儲存「學校」」",
              en: "Recording: clearing every weekday on the School zone and tapping Done shows “Choose at least one day”; after picking Monday, Wednesday and Friday it saves, returning to the list with a “Saved” confirmation",
            }}
          />
        </Phone>
      </div>
    </div>
  );
}

/** Decision C: offline → last-report dialog → detail → refresh fails, plus
 * the timeline's empty state. All real prototype states (sample data). */
export function Case07DecisionStates({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  return (
    <div className="mx-auto grid max-w-[19rem] gap-8 md:max-w-[38rem] md:grid-cols-2 md:items-start md:gap-8">
      <Phone caption={zh ? "離線：說明這是幾小時前的最後位置；重新整理失敗也會告知" : "Offline: says the map shows the last report and when; a failed refresh says so too"}>
        <Loop
          name="offline"
          locale={locale}
          still={SHOTS.offlineDetail}
          alt={{
            zh: "操作錄影：點選離線的阿哲書包兩次，出現「無法顯示目前位置」說明最後回報時間；開啟詳情後按重新整理，提示「仍無法連線，稍後再試」",
            en: "Recording: tapping the offline bag twice explains its location can’t be shown and when it last reported; opening its details and refreshing shows “Still can’t connect, try again later”",
          }}
        />
      </Phone>
      <div className="md:mt-[18%]">
        <Phone caption={zh ? "沒有紀錄的日子：顯示空狀態與原因" : "A day with no records: an empty state with the reason"}>
          <Frame shot={SHOTS.timelineEmpty} locale={locale} sizes="(min-width: 768px) 30vw, 80vw" />
        </Phone>
      </div>
    </div>
  );
}

/* App structure & user flow (HTML, selectable text) ------------------ */

/*
 * One diagram: entry → three tabs (the prototype's bottom navigation) →
 * screens / actions under each tab, plus two secondary state branches.
 * Only what the 2026 reconstruction actually does: alerts are marked read
 * in the list (no detail page); other profile rows answer "not available in
 * the prototype"; login, location, alerts and devices are all mock.
 *
 * Node kinds: "screen" (screen / navigation), "action" (user action),
 * "state" (state / exception). One left spine per column (x = SPINE) keeps
 * every connector aligned at all widths.
 */

type L10n = Record<Locale, string>;
type NodeKind = "screen" | "action" | "state";
type IconName =
  | "login" | "phone" | "backpack" | "bell" | "user" | "map" | "pointer" | "details" | "history" | "shield"
  | "clock" | "refresh" | "pencil" | "plus" | "check" | "logout" | "wifiOff" | "alert";
type FlowNode = { kind: NodeKind; icon: IconName; t: L10n; s?: L10n; children?: FlowNode[]; note?: L10n };
type Column = { key: string; letter: string; icon: IconName; tab: L10n; nodes: FlowNode[] };

const RED = "#a22b2f";
const ALERT = "#e02627";
const INK = "#342c2a";
const LINE = "rgba(162,43,47,0.38)";

const ICONS: Record<IconName, ReactNode> = {
  login: <><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><path d="m10 17 5-5-5-5" /><path d="M15 12H3" /></>,
  logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></>,
  phone: <><rect width="14" height="20" x="5" y="2" rx="2" /><path d="M5 17h14" /></>,
  backpack: <><path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" /><path d="M8 22v-6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6" /><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /></>,
  bell: <><path d="M10.27 21a2 2 0 0 0 3.46 0" /><path d="M3.26 15.33A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.67C19.41 13.96 18 12.5 18 8A6 6 0 0 0 6 8c0 4.5-1.41 5.96-2.74 7.33" /></>,
  user: <><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
  map: <><path d="M14.1 5.55a2 2 0 0 0 1.8 0l3.65-1.83A1 1 0 0 1 21 4.62v12.76a1 1 0 0 1-.55.9l-4.55 2.27a2 2 0 0 1-1.8 0L9.9 18.45a2 2 0 0 0-1.8 0l-3.65 1.83A1 1 0 0 1 3 19.38V6.62a1 1 0 0 1 .55-.9L8.1 3.45a2 2 0 0 1 1.8 0z" /><path d="M15 5.76v15" /><path d="M9 3.24v15" /></>,
  pointer: <><path d="M9.04 9.69a.5.5 0 0 1 .65-.65l11 4.5a.5.5 0 0 1-.07.95l-4.35 1.04a1 1 0 0 0-.74.74l-1.04 4.35a.5.5 0 0 1-.95.07z" /><path d="M7.2 2.2 8 5.1" /><path d="m5.1 8-2.9-.8" /><path d="M14 4.1 12 6" /></>,
  details: <><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M7 8h10" /><path d="M7 12h10" /><path d="M7 16h6" /></>,
  history: <><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l4 2" /></>,
  shield: <><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /></>,
  clock: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
  refresh: <><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" /></>,
  pencil: <><path d="M21.17 6.81a1 1 0 0 0-3.99-3.99L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5z" /></>,
  plus: <><path d="M5 12h14" /><path d="M12 5v14" /></>,
  check: <><path d="M18 6 7 17l-5-5" /><path d="m22 10-7.5 7.5L13 16" /></>,
  wifiOff: <><path d="M12 20h.01" /><path d="M8.5 16.43a5 5 0 0 1 7 0" /><path d="M5 12.86a10 10 0 0 1 5.17-2.69" /><path d="M19 12.86a10 10 0 0 0-2-1.52" /><path d="M2 8.82a15 15 0 0 1 4.18-2.64" /><path d="M22 8.82a15 15 0 0 0-11.29-3.76" /><path d="m2 2 20 20" /></>,
  alert: <><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" /><path d="M12 9v4" /><path d="M12 17h.01" /></>,
};

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      {ICONS[name]}
    </svg>
  );
}

const appStructure = (): { entry: FlowNode[]; columns: Column[]; branches: { icon: IconName; title: L10n; steps: { t: L10n; error?: boolean }[] }[] } => ({
  entry: [
    { kind: "screen", icon: "login", t: { zh: "登入", en: "Sign in" }, s: { zh: "原型中為示意登入", en: "Mock sign-in in the prototype" } },
    { kind: "screen", icon: "phone", t: { zh: "底部分頁", en: "Tab bar" }, s: { zh: "預設進入書包分頁", en: "Opens on the Bags tab" } },
  ],
  columns: [
    {
      key: "bags", letter: "A", icon: "backpack", tab: { zh: "書包", en: "Bags" },
      nodes: [
        {
          kind: "screen", icon: "map", t: { zh: "地圖／我的書包", en: "Map / My bags" }, s: { zh: "首頁：位置與連線狀態", en: "Home: location and connection" },
          children: [{ kind: "action", icon: "plus", t: { zh: "新增書包", en: "Add a bag" }, s: { zh: "以序號加入", en: "By serial number" } }],
        },
        { kind: "action", icon: "pointer", t: { zh: "選擇書包", en: "Select a bag" }, s: { zh: "地圖移到該書包", en: "The map moves to it" } },
        {
          kind: "screen", icon: "details", t: { zh: "書包詳情", en: "Bag details" }, s: { zh: "狀態、電量與功能入口", en: "Status, battery and actions" },
          children: [
            { kind: "screen", icon: "history", t: { zh: "時間軸", en: "Timeline" }, s: { zh: "移動紀錄", en: "Movement history" } },
            { kind: "screen", icon: "shield", t: { zh: "電子圍籬", en: "Safe zones" }, s: { zh: "安全範圍規則", en: "Zone rules" } },
            { kind: "screen", icon: "clock", t: { zh: "回報頻率", en: "Reporting frequency" } },
            { kind: "action", icon: "refresh", t: { zh: "重新整理位置", en: "Refresh location" } },
            { kind: "action", icon: "pencil", t: { zh: "變更名稱／SOS／移除", en: "Rename / SOS / Remove" } },
          ],
        },
      ],
    },
    {
      key: "alerts", letter: "B", icon: "bell", tab: { zh: "通知", en: "Alerts" },
      nodes: [
        { kind: "screen", icon: "bell", t: { zh: "通知列表", en: "Alert list" }, s: { zh: "未讀置頂標示", en: "Unread marked" } },
        { kind: "action", icon: "pointer", t: { zh: "查看通知", en: "View an alert" }, s: { zh: "在列表中標為已讀", en: "Marked read in the list" } },
        { kind: "action", icon: "check", t: { zh: "全部已讀", en: "Mark all as read" } },
      ],
    },
    {
      key: "profile", letter: "C", icon: "user", tab: { zh: "個人", en: "Profile" },
      nodes: [
        {
          kind: "screen", icon: "user", t: { zh: "個人／設定", en: "Profile / settings" }, s: { zh: "帳號與設定列表", en: "Account and settings list" },
          note: { zh: "其他設定列在原型中顯示「尚未開放」", en: "Other settings rows show “not available in the prototype”" },
        },
        { kind: "action", icon: "logout", t: { zh: "登出", en: "Sign out" }, s: { zh: "先確認再登出", en: "Asks to confirm" } },
      ],
    },
  ],
  branches: [
    {
      icon: "wifiOff",
      title: { zh: "離線狀態", en: "Offline state" },
      steps: [
        { t: { zh: "書包離線", en: "Bag is offline" } },
        { t: { zh: "地圖／列表：說明這是最後回報的位置與時間", en: "Map / list: shows this is the last reported location and time" } },
        { t: { zh: "書包詳情：重新整理失敗時提示稍後再試", en: "Bag details: a failed refresh says to try again later" }, error: true },
      ],
    },
    {
      icon: "shield",
      title: { zh: "編輯電子圍籬", en: "Editing a safe zone" },
      steps: [
        { t: { zh: "書包詳情 › 開啟電子圍籬", en: "Bag details › open safe zones" } },
        { t: { zh: "新增／編輯電子圍籬", en: "Add / edit a safe zone" } },
        { t: { zh: "檢查", en: "Validate" } },
        { t: { zh: "儲存，或顯示錯誤", en: "Save, or show an error" }, error: true },
      ],
    },
  ],
});

/* Spine geometry: node padding 12px + icon box 32px → icon centre at 28px. */
const SPINE = 28;

function Connector({ h = 20 }: { h?: number }) {
  return (
    <span aria-hidden className="relative block" style={{ height: h, marginLeft: SPINE - 1 }}>
      <span className="absolute inset-y-0 left-0 w-0.5" style={{ background: LINE }} />
      <svg width="10" height="6" viewBox="0 0 10 6" className="absolute -bottom-px" style={{ left: -4 }}><path d="M0 0 5 6 10 0" fill={LINE} /></svg>
    </span>
  );
}

function NodeCard({ node, locale, compact = false }: { node: FlowNode; locale: Locale; compact?: boolean }) {
  const action = node.kind === "action";
  const box = action
    ? "rounded-full border bg-[#fbf3f1]"
    : node.kind === "state"
      ? "rounded-[12px] border-2 border-dashed bg-transparent"
      : "rounded-[12px] border bg-white shadow-[0_1px_2px_rgba(52,44,42,0.05)]";
  return (
    <div className={`flex items-center gap-3 px-3 ${compact ? "py-2" : "py-2.5"} ${box}`} style={{ borderColor: action ? "rgba(162,43,47,0.28)" : node.kind === "state" ? "rgba(224,38,39,0.5)" : "#e6dcd6" }}>
      <span className={`grid size-8 shrink-0 place-items-center ${action ? "rounded-full bg-white" : "rounded-[9px] bg-[#f7e6e5]"}`} style={{ color: node.kind === "state" ? ALERT : RED }}>
        <Icon name={node.icon} />
      </span>
      <span className="min-w-0">
        <span className={`block text-[15px] leading-5 ${action ? "font-medium" : "font-semibold"}`} style={{ color: action ? RED : INK }}>{node.t[locale]}</span>
        {node.s ? <span className="mt-0.5 block text-[13px] leading-[18px] text-[#6f625e]">{node.s[locale]}</span> : null}
      </span>
    </div>
  );
}

/** Children hang off the parent's spine as a tree (same at every width). */
function Children({ nodes, locale }: { nodes: FlowNode[]; locale: Locale }) {
  return (
    <ul className="relative mt-0 pt-3" style={{ marginLeft: SPINE - 1 }}>
      {nodes.map((child, i) => (
        <li key={child.t.en} className="relative pb-2.5 pl-5 last:pb-0">
          {/* vertical rail (stops at the last child's tick) + horizontal tick */}
          <span aria-hidden className="absolute left-0 w-0.5" style={{ background: LINE, top: i === 0 ? -12 : 0, height: i === nodes.length - 1 ? (i === 0 ? 12 : 0) + 25 : `calc(100% + ${i === 0 ? 12 : 0}px)` }} />
          <span aria-hidden className="absolute left-0 top-[23px] h-0.5 w-5" style={{ background: LINE }} />
          <NodeCard node={child} locale={locale} compact />
        </li>
      ))}
    </ul>
  );
}

function NodeList({ nodes, locale }: { nodes: FlowNode[]; locale: Locale }) {
  return (
    <ol>
      {nodes.map((node, i) => (
        <li key={node.t.en}>
          <NodeCard node={node} locale={locale} />
          {node.children ? <Children nodes={node.children} locale={locale} /> : null}
          {node.note ? <p className="mt-2 text-[13px] leading-[18px] text-[#6f625e]" style={{ marginLeft: SPINE + 20 }}>{node.note[locale]}</p> : null}
          {i < nodes.length - 1 ? <Connector h={node.children || node.note ? 16 : 20} /> : null}
        </li>
      ))}
    </ol>
  );
}

function TabHeader({ col, locale }: { col: Column; locale: Locale }) {
  return (
    <p className="flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-white" style={{ background: RED }}>
      <span className="grid size-8 shrink-0 place-items-center rounded-[9px] bg-white/15"><Icon name={col.icon} /></span>
      <span className="text-[15px] font-semibold leading-5">
        <span className="mr-2 opacity-70">{col.letter}</span>
        {locale === "zh" ? `${col.tab.zh}分頁` : `${col.tab.en} tab`}
      </span>
    </p>
  );
}

function Legend({ zh }: { zh: boolean }) {
  const item = (cls: string, style: CSSProperties, label: string) => (
    <span className="flex items-center gap-2"><span aria-hidden className={`block h-3.5 w-6 ${cls}`} style={style} />{label}</span>
  );
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-[#6f625e]">
      {item("rounded-[4px] border bg-white", { borderColor: "#d9cdc7" }, zh ? "畫面／導覽" : "Screen / navigation")}
      {item("rounded-full border bg-[#fbf3f1]", { borderColor: "rgba(162,43,47,0.35)" }, zh ? "使用者操作" : "User action")}
      {item("rounded-[4px] border-2 border-dashed", { borderColor: "rgba(224,38,39,0.55)" }, zh ? "狀態／例外" : "State / exception")}
    </div>
  );
}

function StateBranch({ b, locale }: { b: ReturnType<typeof appStructure>["branches"][number]; locale: Locale }) {
  return (
    <div className="rounded-[14px] border-2 border-dashed p-4" style={{ borderColor: "rgba(224,38,39,0.4)" }}>
      <p className="flex items-center gap-2 text-[14px] font-semibold" style={{ color: ALERT }}>
        <Icon name={b.icon} size={16} />
        {b.title[locale]}
      </p>
      <ol className="mt-3 grid gap-2">
        {b.steps.map((st, i) => (
          <li key={st.t.en} className="flex items-center gap-2 text-[14px] leading-5" style={{ color: INK }}>
            <span aria-hidden className="grid size-5 shrink-0 place-items-center rounded-full text-[11px] font-semibold" style={st.error ? { color: ALERT, border: `1.5px solid ${ALERT}` } : { color: RED, background: "#f7e6e5" }}>
              {st.error ? "!" : i + 1}
            </span>
            {st.t[locale]}
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Key interaction states — both hang off Bags › Bag details. A dashed
 * connector continues the Bag details rail (x = SPINE) down to the header,
 * so the relationship reads at every width. */
function KeyStates({ branches, locale }: { branches: ReturnType<typeof appStructure>["branches"]; locale: Locale }) {
  const zh = locale === "zh";
  return (
    <div>
      <span aria-hidden className="relative block h-6" style={{ marginLeft: SPINE - 1 }}>
        <span className="absolute bottom-0 left-0 border-l-2 border-dashed" style={{ top: -26, borderColor: "rgba(224,38,39,0.5)" }} />
      </span>
      <div className="flex w-fit max-w-full items-center gap-3 rounded-[12px] border-2 border-dashed bg-white py-2.5 pl-3 pr-5" style={{ borderColor: "rgba(224,38,39,0.5)" }}>
        <span className="grid size-8 shrink-0 place-items-center rounded-[9px] bg-[#fdeaea]" style={{ color: ALERT }}><Icon name="alert" /></span>
        <span className="min-w-0">
          <span className="block text-[15px] font-semibold leading-5" style={{ color: ALERT }}>{zh ? "主要互動狀態" : "Key interaction states"}</span>
          <span className="mt-0.5 block text-[13px] leading-[18px] text-[#6f625e]">{zh ? "皆屬於「A 書包」流程" : "Both within the A Bags flow"}</span>
        </span>
      </div>
      <span aria-hidden className="block h-4" />
      <div className="grid gap-4 md:grid-cols-2">
        {branches.map((b) => <StateBranch key={b.title.en} b={b} locale={locale} />)}
      </div>
    </div>
  );
}

/** Slot "user-flow" (section 03 — App Structure & User Flow). */
export function Case07UserFlow({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  const f = appStructure();
  return (
    <figure>
      <div className="flex flex-col rounded-[18px] border border-[#ece4df] bg-[#faf7f4] p-4 sm:p-6 xl:grid xl:grid-cols-[1.4fr_1fr_1fr] xl:p-8" style={{ color: INK }}>
        {/* Legend: first below xl; top-right beside the entry at xl+. */}
        <div className="order-first mb-6 xl:order-none xl:col-span-2 xl:col-start-2 xl:row-start-1 xl:mb-0 xl:flex xl:self-start xl:justify-end xl:pl-4 xl:pt-1">
          <Legend zh={zh} />
        </div>

        {/* Entry: same width and spine as column A, so its connector lands
            on the tab rail. */}
        <div className="xl:col-start-1 xl:row-start-1 xl:pr-4">
          <NodeList nodes={f.entry} locale={locale} />
          <Connector h={18} />
        </div>

        {/* Tabs. xl+: three columns joined by one rail at the spine.
            Below xl: stacked, each tab hanging off a shared rail. */}
        <ol role="list" className="flex flex-col gap-6 xl:contents">
          {f.columns.map((col, ci) => (
            <li key={col.key} className={`relative pl-12 xl:row-start-2 ${ci === 0 ? "xl:pl-0" : "xl:pl-4"} ${ci < 2 ? "xl:pr-4" : ""}`}>
              {/* xl+: horizontal rail segment + drop into this column */}
              <span aria-hidden className="absolute top-0 hidden h-0.5 xl:block" style={{ background: LINE, left: ci === 0 ? SPINE - 1 : 0, right: ci === 2 ? undefined : 0, width: ci === 2 ? 16 + SPINE + 1 : undefined }} />
              <span aria-hidden className="hidden xl:block"><Connector h={20} /></span>
              {/* below xl: a shared rail at the entry spine (one segment per
                  tab, ending at the last tab's tick) + a tick into the tab */}
              <span aria-hidden className="absolute w-0.5 xl:hidden" style={{ left: SPINE - 1, top: 0, height: ci === 2 ? 26 : "calc(100% + 24px)", background: LINE }} />
              <span aria-hidden className="absolute top-[25px] h-0.5 xl:hidden" style={{ left: SPINE - 1, width: 48 - SPINE + 1, background: LINE }} />
              <TabHeader col={col} locale={locale} />
              <Connector h={16} />
              <NodeList nodes={col.nodes} locale={locale} />
              {/* below xl: the states sit inside Bags, right under Bag details */}
              {ci === 0 ? <div className="xl:hidden"><KeyStates branches={f.branches} locale={locale} /></div> : null}
            </li>
          ))}
        </ol>

        {/* xl+: one full-width row under the navigation, joined to Bag
            details by the dashed connector (display:none below xl, so it is
            never read twice). */}
        <div className="hidden xl:col-span-3 xl:row-start-3 xl:block">
          <KeyStates branches={f.branches} locale={locale} />
        </div>
      </div>
      <figcaption className="cf-dim mt-4 max-w-[62ch] text-[13px] leading-6">
        {zh
          ? "依 2026 年重建原型整理的 App 結構與流程，使用示意資料；不代表實際的定位、推播、裝置配對或後端連線。"
          : "App structure and flow from the 2026 reconstructed prototype, using mock data. It doesn’t represent live location, push notifications, device pairing or a working back end."}
      </figcaption>
    </figure>
  );
}
