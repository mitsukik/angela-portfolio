"use client";

import type { ReactNode } from "react";
import type { Locale } from "@/data/locale";
import { EvidenceTrigger } from "@/components/design-samples/case-final/CaseEvidenceViewer";

/*
 * CASE05 — System Flow (LOCAL DEVELOPMENT ONLY; reached only through the
 * legacy case route). One data source, two layouts:
 *   - lg+: a 1920×1080 SVG (scales with the column), opens a 2x WebP export
 *     of itself in the shared evidence viewer;
 *   - below lg: a vertical, readable list of the same steps.
 * Flow per the P2 specification: goals → allocation → configuration and
 * staffing → station records → packaging and shipping → reports, which feed
 * the next goals. The large production dashboard is a parallel monitoring
 * view; LINE notifications are event-based support. Neither is a step.
 * Data is built on demand (no module-level arrays) for production isolation.
 */

type L = Record<Locale, string>;
type Step = { title: Record<Locale, string[]>; sub: Record<Locale, string[]>; /** Long list (station names): smaller EN sub. */ dense?: boolean };

const flow = () => ({
  groups: [
    { span: [0, 2], label: { zh: "管理後台 · 規劃", en: "ADMIN BACKEND · PLANNING" } as L },
    { span: [3, 3], label: { zh: "生產站台", en: "PRODUCTION STATIONS" } as L },
    { span: [4, 5], label: { zh: "管理後台 · 配出貨與報表", en: "ADMIN BACKEND · DISTRIBUTION" } as L },
  ],
  steps: [
    { title: { zh: ["營運目標"], en: ["Operating goals"] }, sub: { zh: ["對照去年同期營業額，", "設定各店目標"], en: ["Set per store against", "last year’s sales"] } },
    { title: { zh: ["業績配置預估"], en: ["Performance", "allocation"] }, sub: { zh: ["依日期、節慶等條件，", "參考歷史銷售分配"], en: ["Based on dates, holidays", "and past sales"] } },
    { title: { zh: ["生產配置", "與人員排班"], en: ["Production setup", "& staffing"] }, sub: { zh: ["確認各店生產數量，", "排定包裝人員"], en: ["Quantities per store,", "packaging rota"] } },
    { title: { zh: ["各區生產紀錄"], en: ["Production", "records by area"] }, sub: { zh: ["攪拌區、作業區、", "發酵室、烤箱區、", "脆餅房、包裝區"], en: ["Mixing Area, Work Area,", "Fermentation Room,", "Oven Area,", "Cracker Room,", "Packaging Area"] }, dense: true },
    { title: { zh: ["包裝與", "出貨配置"], en: ["Packaging", "& shipping"] }, sub: { zh: ["可販售數量＝", "生產數量－耗損"], en: ["Sellable =", "produced − loss"] } },
    { title: { zh: ["報表與", "營運決策"], en: ["Reports", "& decisions"] }, sub: { zh: ["產品銷售統計"], en: ["Product sales", "statistics"] } },
  ] as Step[],
  dashboard: {
    title: { zh: "大型生產看板", en: "Large Production Dashboard" } as L,
    sub: { zh: "同步呈現每日生產進度與數據 · 監看用，不是流程步驟", en: "Mirrors daily production progress · a monitoring view, not a step" } as L,
  },
  loop: { zh: "銷售結果回饋下一期營運目標", en: "Sales results feed the next operating goals" } as L,
  line: {
    title: { zh: "LINE 通知", en: "LINE notifications" } as L,
    sub: { zh: ["依事件提醒相關人員，", "不是流程步驟"], en: ["Event-based reminders", "to the right people,", "not a step"] },
    chips: [
      { at: 0, text: { zh: ["營運目標設置提醒"], en: ["Goal-setting", "reminder"] } },
      { at: 1, text: { zh: ["業績配置提醒"], en: ["Allocation", "reminder"] } },
      { at: 2, text: { zh: ["排程／配貨", "未完成提醒"], en: ["Scheduling /", "allocation overdue"] } },
      { at: 2, text: { zh: ["完成排程通知"], en: ["Schedule", "completed"] }, second: true },
    ],
  },
});

const C = {
  bg: "#0f1014",
  node: "#191a20",
  stroke: "rgba(255,255,255,0.12)",
  amber: "#f0ae3e",
  amberSoft: "rgba(240,174,62,0.10)",
  text: "#f2f2f4",
  sub: "#a7abb7",
  dim: "#7f8394",
  line: "#5b5f6b",
};

const M = 96;
const NW = 248;
const GAP = 48;
const NY = 404;
const NH = 272;
const nx = (i: number) => M + i * (NW + GAP);
const ncx = (i: number) => nx(i) + NW / 2;

function Lines({ x, y, lines, size, weight = 400, fill, lh = 1.3, anchor = "start", mono = false }: {
  x: number; y: number; lines: string[]; size: number; weight?: number; fill: string; lh?: number; anchor?: "start" | "middle"; mono?: boolean;
}) {
  return (
    <text x={x} y={y} fontSize={size} fontWeight={weight} fill={fill} textAnchor={anchor} fontFamily={mono ? "var(--font-mono, ui-monospace), monospace" : "inherit"}>
      {lines.map((line, i) => <tspan key={line + i} x={x} dy={i ? size * lh : 0}>{line}</tspan>)}
    </text>
  );
}

/** The 1920×1080 diagram. Exported so the WebP zoom asset is captured from
 * the same drawing. */
export function Case05FlowSvg({ locale, title }: { locale: Locale; title?: string }) {
  const f = flow();
  const zh = locale === "zh";
  const dashX = nx(2) - 150;
  const dashW = nx(3) + NW + 150 - dashX;
  return (
    <svg viewBox="0 0 1920 1080" role="img" aria-label={title} className="block h-auto w-full" style={{ background: C.bg }}>
      <defs>
        <marker id="c05-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse">
          <path d="M0 0 10 5 0 10z" fill={C.amber} />
        </marker>
        <marker id="c05-arrow-dim" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M0 0 10 5 0 10z" fill={C.line} />
        </marker>
      </defs>

      {/* Parallel monitoring layer */}
      <rect x={dashX} y={132} width={dashW} height={128} rx={18} fill={C.amberSoft} stroke={C.amber} strokeDasharray="10 8" strokeWidth={2} />
      <Lines x={dashX + 32} y={184} lines={[f.dashboard.title[locale]]} size={30} weight={700} fill={C.text} />
      <Lines x={dashX + 32} y={230} lines={[f.dashboard.sub[locale]]} size={zh ? 23 : 21} fill={C.sub} />
      {[2, 3].map((i) => (
        <line key={i} x1={ncx(i)} y1={NY - 4} x2={ncx(i)} y2={268} stroke={C.amber} strokeWidth={2} strokeDasharray="6 7" markerEnd="url(#c05-arrow)" />
      ))}

      {/* Groups */}
      {f.groups.map((g) => {
        const x1 = nx(g.span[0]);
        const x2 = nx(g.span[1]) + NW;
        return (
          <g key={g.label.en}>
            <line x1={x1} y1={368} x2={x2} y2={368} stroke={C.line} strokeWidth={2} />
            <rect x={x1} y={330} width={zh ? 16 + g.label.zh.length * 24 : 16 + g.label.en.length * 12} height={30} fill={C.bg} />
            <Lines x={x1} y={352} lines={[g.label[locale]]} size={zh ? 22 : 18} weight={600} fill={C.amber} mono={!zh} />
          </g>
        );
      })}

      {/* Main flow */}
      {f.steps.map((s, i) => (
        <g key={s.title.en.join(" ")}>
          <rect x={nx(i)} y={NY} width={NW} height={NH} rx={20} fill={C.node} stroke={i === 3 ? "rgba(240,174,62,0.45)" : C.stroke} strokeWidth={2} />
          <Lines x={nx(i) + 26} y={NY + 46} lines={[String(i + 1).padStart(2, "0")]} size={20} weight={600} fill={C.amber} mono />
          <Lines x={nx(i) + 26} y={NY + 92} lines={s.title[locale]} size={zh ? 32 : 28} weight={700} fill={C.text} lh={1.2} />
          <Lines x={nx(i) + 26} y={NY + (s.title[locale].length > 1 ? (s.dense && !zh ? 166 : 176) : 142)} lines={s.sub[locale]} size={zh ? 22 : s.dense ? 18 : 20} fill={C.sub} lh={s.dense && !zh ? 1.3 : 1.36} />
          {i < 5 ? <line x1={nx(i) + NW + 6} y1={NY + NH / 2} x2={nx(i + 1) - 8} y2={NY + NH / 2} stroke={C.amber} strokeWidth={3} markerEnd="url(#c05-arrow)" /> : null}
        </g>
      ))}

      {/* Feedback loop: reports → next goals */}
      <path d={`M ${ncx(5)} ${NY + NH + 4} V 716 H ${ncx(0)} V ${NY + NH + 10}`} fill="none" stroke={C.amber} strokeWidth={2.5} strokeDasharray="2 0" markerEnd="url(#c05-arrow)" opacity={0.85} />
      <rect x={960 - 270} y={696} width={540} height={40} fill={C.bg} />
      <Lines x={960} y={725} lines={[f.loop[locale]]} size={zh ? 23 : 21} fill={C.amber} anchor="middle" />

      {/* Supporting layer: LINE notifications */}
      <rect x={M} y={790} width={1920 - 2 * M} height={190} rx={20} fill="none" stroke={C.stroke} strokeWidth={2} />
      {f.line.chips.map((c) => {
        const x = nx(c.at) + 18;
        const y = c.second ? 892 : 818;
        return (
          <g key={c.text.en.join(" ")}>
            {!c.second ? <line x1={ncx(c.at)} y1={NY + NH + 6} x2={ncx(c.at)} y2={y - 2} stroke={C.line} strokeWidth={2} strokeDasharray="3 7" /> : null}
            <rect x={x} y={y} width={NW - 36} height={66} rx={12} fill="#15161b" stroke={C.stroke} strokeWidth={1.5} />
            <Lines x={x + 18} y={y + (c.text[locale].length > 1 ? 28 : 42)} lines={c.text[locale]} size={zh ? 21 : 19} fill={C.text} lh={1.25} />
          </g>
        );
      })}
      <Lines x={nx(3) + 26} y={850} lines={[f.line.title[locale]]} size={30} weight={700} fill={C.text} />
      <Lines x={nx(3) + 26} y={894} lines={f.line.sub[locale]} size={zh ? 22 : 20} fill={C.sub} lh={1.4} />
      <circle cx={nx(3) + 8} cy={840} r={7} fill="#06c755" />
    </svg>
  );
}

function Item({ n, title, sub, line, accent = false }: { n: string; title: string; sub: string; line?: string; accent?: boolean }) {
  return (
    <div className={`grid grid-cols-[2.25rem_1fr] gap-3 rounded-[14px] border px-4 py-4 ${accent ? "border-[rgba(240,174,62,0.45)]" : "border-[rgba(255,255,255,0.12)]"} bg-[#191a20]`}>
      <span className="cf-meta pt-0.5 text-[#f0ae3e]">{n}</span>
      <span>
        <span className="block text-[17px] font-bold leading-6 text-[#f2f2f4]">{title}</span>
        <span className="mt-1 block text-[14px] leading-[1.45rem] text-[#a7abb7]">{sub}</span>
        {line ? <span className="mt-2 flex items-start gap-2 text-[13px] leading-5 text-[#d6d8de]"><span aria-hidden className="mt-1.5 size-2 shrink-0 rounded-full bg-[#06c755]" />{line}</span> : null}
      </span>
    </div>
  );
}

function Note({ children, tone }: { children: ReactNode; tone: "dash" | "line" }) {
  return (
    <div className={`rounded-[14px] px-4 py-3 text-[14px] leading-[1.45rem] ${tone === "dash" ? "border-2 border-dashed border-[#f0ae3e] bg-[rgba(240,174,62,0.10)] text-[#f2f2f4]" : "border border-[rgba(255,255,255,0.12)] text-[#a7abb7]"}`}>
      {children}
    </div>
  );
}

/** Below lg: the same flow as a vertical, readable sequence. */
function FlowVertical({ locale }: { locale: Locale }) {
  const f = flow();
  const zh = locale === "zh";
  const join = (lines: string[]) => lines.join(zh ? "" : " ");
  const arrow = <span aria-hidden className="block py-1 pl-[1.1rem] text-[#f0ae3e]">↓</span>;
  const chipsFor = (i: number) => f.line.chips.filter((c) => c.at === i).map((c) => join(c.text[locale]));
  const step = (i: number) => {
    const s = f.steps[i];
    const chips = chipsFor(i);
    return (
      <div key={i}>
        <Item n={String(i + 1).padStart(2, "0")} title={join(s.title[locale])} sub={join(s.sub[locale])} line={chips.length ? `LINE${zh ? "：" : ": "}${chips.join(zh ? "、" : ", ")}` : undefined} accent={i === 3} />
      </div>
    );
  };
  return (
    <div className="rounded-[18px] bg-[#0f1014] p-4 sm:p-6">
      {f.groups.map((g, gi) => (
        <div key={g.label.en} className={gi ? "mt-2" : ""}>
          <p className={`text-[13px] font-semibold tracking-[0.06em] text-[#f0ae3e] ${zh ? "" : "font-mono"}`}>{g.label[locale]}</p>
          <ol className="mt-2 grid">
            {Array.from({ length: g.span[1] - g.span[0] + 1 }, (_, k) => g.span[0] + k).map((i, k, all) => (
              <li key={i} className="list-none">
                {step(i)}
                {i < 5 && k === all.length - 1 && i === 2 ? (
                  <div className="my-2"><Note tone="dash"><b>{f.dashboard.title[locale]}</b>　{f.dashboard.sub[locale]}</Note></div>
                ) : null}
                {i < 5 ? arrow : null}
              </li>
            ))}
          </ol>
        </div>
      ))}
      <p className="mt-3 text-[14px] text-[#f0ae3e]">↺ {f.loop[locale]}</p>
      <div className="mt-3"><Note tone="line"><b className="text-[#f2f2f4]">{f.line.title[locale]}</b>　{join(f.line.sub[locale])}</Note></div>
    </div>
  );
}

export function Case05SystemFlow({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  const alt = zh
    ? "營運流程圖：營運目標 → 業績配置預估 → 生產配置與人員排班 → 各區生產紀錄 → 包裝與出貨配置 → 報表與營運決策，並回饋下一期目標；大型生產看板同步呈現生產配置與站台紀錄的進度；LINE 通知在目標、配置與排程階段依事件提醒"
    : "Operational flow: operating goals → performance allocation → production setup and staffing → production records by area → packaging and shipping → reports and decisions, feeding the next goals; the large production dashboard mirrors progress from setup and station records; LINE notifications remind people at the goal, allocation and scheduling stages";
  const asset = { src: `/legacy-assets/case05/case05-flow-${locale}.webp`, alt };
  return (
    <figure>
      <div className="hidden lg:block">
        <div className="relative overflow-hidden rounded-[18px]" style={{ aspectRatio: "1920 / 1080" }}>
          <Case05FlowSvg locale={locale} title={alt} />
          <EvidenceTrigger asset={asset}><span className="block h-full w-full" /></EvidenceTrigger>
        </div>
      </div>
      <div className="lg:hidden">
        <FlowVertical locale={locale} />
        <div className="relative mt-4 w-[46%] max-w-[16rem] overflow-hidden rounded-[10px] border border-[rgba(255,255,255,0.12)]" style={{ aspectRatio: "1920 / 1080" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- static zoom export */}
          <img src={asset.src} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          <EvidenceTrigger asset={asset}><span className="block h-full w-full" /></EvidenceTrigger>
        </div>
      </div>
      <figcaption className="cf-dim mt-4 max-w-[62ch] text-[13px] leading-6">
        {zh ? "依原始需求規格整理的營運流程。看板與 LINE 通知是輔助層，不是流程步驟。" : "Operational flow based on the original requirements specification. The dashboard and LINE notifications are supporting layers, not steps."}
        <span className="lg:hidden">{zh ? "點擊縮圖可放大完整流程圖。" : " Tap the thumbnail to open the full diagram."}</span>
      </figcaption>
    </figure>
  );
}
