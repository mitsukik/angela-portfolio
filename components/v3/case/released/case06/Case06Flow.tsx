"use client";

import type { Locale } from "@/data/locale";
import { EvidenceTrigger } from "@/components/design-samples/case-final/CaseEvidenceViewer";

/*
 * CASE06 — App × CMS cross-system flow (LOCAL DEVELOPMENT ONLY; reached only
 * through the legacy case route). Same pattern as Case05Flow: one data
 * source, two layouts —
 *   - lg+: a 1920×1080 two-lane SVG (opens a 2x WebP export in the viewer);
 *   - below lg: the same lanes as readable vertical lists.
 * Every relationship is documented in the NATEX work statement (2019-10-28):
 * CMS add / edit listed products → app product list; login before checkout;
 * order statuses changed in the CMS; app member area shows order status
 * and a push on status updates. It is a system interaction overview, not a
 * technical architecture. Data is built on demand for production isolation.
 */

type L = Record<Locale, string>;
type Node = { title: Record<Locale, string[]>; sub: Record<Locale, string[]> };

const flow = () => ({
  app: {
    label: { zh: "消費者 App", en: "CONSUMER APP" } as L,
    steps: [
      { title: { zh: ["商品探索"], en: ["Product", "discovery"] }, sub: { zh: ["首頁、分類、", "搜尋"], en: ["Home, search,", "categories"] } },
      { title: { zh: ["商品頁"], en: ["Product", "details"] }, sub: { zh: ["顏色、尺寸、", "數量"], en: ["Colour, size,", "quantity"] } },
      { title: { zh: ["購物車"], en: ["Cart"] }, sub: { zh: ["確認與調整品項"], en: ["Review and", "adjust items"] } },
      { title: { zh: ["登入／註冊"], en: ["Sign in /", "join"] }, sub: { zh: ["結帳前必須登入"], en: ["Required before", "checkout"] } },
      { title: { zh: ["結帳"], en: ["Checkout"] }, sub: { zh: ["配送方式、", "收件資料"], en: ["Delivery method,", "recipient"] } },
      { title: { zh: ["付款"], en: ["Payment"] }, sub: { zh: ["選擇付款方式"], en: ["Choose a", "payment method"] } },
      { title: { zh: ["訂單確認"], en: ["Order", "confirmation"] }, sub: { zh: ["商品、優惠券、", "金額"], en: ["Items, coupon,", "total"] } },
      { title: { zh: ["訂單查詢"], en: ["Order", "tracking"] }, sub: { zh: ["會員專區・", "訂單狀態"], en: ["Member area ·", "order status"] } },
    ] as Node[],
  },
  cms: {
    label: { zh: "營運後台 CMS", en: "ADMIN CMS" } as L,
    // Column positions under the app lane: products under 0–1, orders under 5–7.
    steps: [
      { at: 0, title: { zh: ["商品管理"], en: ["Product", "management"] }, sub: { zh: ["新增、編輯商品"], en: ["Add and edit", "products"] } },
      { at: 1, title: { zh: ["上架與更新"], en: ["Listing &", "updates"] }, sub: { zh: ["價格、規格、", "庫存、上下架"], en: ["Price, variants,", "stock, status"] } },
      { at: 5, title: { zh: ["收到訂單"], en: ["Orders", "received"] }, sub: { zh: ["訂單列表"], en: ["Order list"] } },
      { at: 6, title: { zh: ["訂單管理"], en: ["Order", "management"] }, sub: { zh: ["篩選、查詢"], en: ["Filter and", "review"] } },
      { at: 7, title: { zh: ["更新狀態"], en: ["Status", "update"] }, sub: { zh: ["如：已出貨、", "已送達"], en: ["e.g. Shipped,", "Delivered"] } },
    ] as (Node & { at: number })[],
    other: { zh: ["後台也管理活動、優惠券、", "會員與訂閱服務（本圖未展開）"], en: ["The CMS also manages campaigns,", "coupons, members and subscriptions", "(not expanded here)"] },
  },
  links: [
    { n: 1, text: { zh: ["商品出現在 App"], en: ["Products appear", "in the app"] } },
    { n: 2, text: { zh: ["建立訂單"], en: ["Order created"] } },
    { n: 3, text: { zh: ["審核並更新狀態"], en: ["Staff review and", "update status"] } },
    { n: 4, text: { zh: ["狀態顯示於 App", "（含推播通知）"], en: ["Status shown in", "the app (+ push)"] } },
  ],
  legend: {
    lane: { zh: "角色內的操作流程", en: "Flow within a role" } as L,
    link: { zh: "前台與後台之間的關係", en: "Relationship between app and CMS" } as L,
    source: { zh: "依原始需求規格整理 · 系統互動概覽，非技術架構圖", en: "Based on the original requirements specification · an interaction overview, not a technical architecture" } as L,
  },
});

const C = {
  bg: "#0f1014",
  node: "#191a20",
  stroke: "rgba(255,255,255,0.12)",
  app: "#B9A7FF",
  appSoft: "rgba(185,167,255,0.07)",
  cms: "#E7F34B",
  cmsSoft: "rgba(231,243,75,0.06)",
  link: "#F2F0EC",
  text: "#f2f2f4",
  sub: "#a7abb7",
  dim: "#7f8394",
};

const M = 80;
const NW = 192;
const STEP = 224;
const nx = (i: number) => M + i * STEP;
const ncx = (i: number) => nx(i) + NW / 2;
const AY = 168; // app node top
const BY = 724; // cms node top
const NH = 184;

function Lines({ x, y, lines, size, weight = 400, fill, lh = 1.3, anchor = "start", mono = false }: {
  x: number; y: number; lines: string[]; size: number; weight?: number; fill: string; lh?: number; anchor?: "start" | "middle" | "end"; mono?: boolean;
}) {
  return (
    <text x={x} y={y} fontSize={size} fontWeight={weight} fill={fill} textAnchor={anchor} fontFamily={mono ? "var(--font-mono, ui-monospace), monospace" : "inherit"}>
      {lines.map((line, i) => <tspan key={line + i} x={x} dy={i ? size * lh : 0}>{line}</tspan>)}
    </text>
  );
}

function Badge({ x, y, n }: { x: number; y: number; n: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={15} fill={C.bg} stroke={C.link} strokeWidth={2} />
      <text x={x} y={y + 6} fontSize={17} fontWeight={700} fill={C.link} textAnchor="middle" fontFamily="var(--font-mono, ui-monospace), monospace">{n}</text>
    </g>
  );
}

function Box({ x, y, node, tag, color, zh }: { x: number; y: number; node: Node; tag: string; color: string; zh: boolean; }) {
  const two = node.title[zh ? "zh" : "en"].length > 1;
  const loc = zh ? "zh" : "en";
  return (
    <g>
      <rect x={x} y={y} width={NW} height={NH} rx={18} fill={C.node} stroke={C.stroke} strokeWidth={2} />
      <rect x={x} y={y + 22} width={4} height={26} fill={color} />
      <Lines x={x + 22} y={y + 42} lines={[tag]} size={17} weight={600} fill={color} mono />
      <Lines x={x + 22} y={y + 84} lines={node.title[loc]} size={zh ? 29 : 25} weight={700} fill={C.text} lh={1.18} />
      <Lines x={x + 22} y={y + (two ? 146 : 120)} lines={node.sub[loc]} size={zh ? 22 : 20} fill={C.sub} lh={1.3} />
    </g>
  );
}

/** The 1920×1080 diagram. Exported so the WebP zoom asset is captured from
 * the same drawing. */
export function Case06FlowSvg({ locale, title }: { locale: Locale; title?: string }) {
  const f = flow();
  const zh = locale === "zh";
  const mid = AY + NH / 2;
  const bmid = BY + NH / 2;
  const cms = f.cms.steps;
  const link = { stroke: C.link, strokeWidth: 2.5, strokeDasharray: "9 8", fill: "none", markerEnd: "url(#c06-arrow-link)" } as const;
  return (
    <svg viewBox="0 0 1920 1080" role="img" aria-label={title} className="block h-auto w-full" style={{ background: C.bg }}>
      <defs>
        {[["app", C.app], ["cms", C.cms], ["link", C.link]].map(([id, fill]) => (
          <marker key={id} id={`c06-arrow-${id}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
            <path d="M0 0 10 5 0 10z" fill={fill} />
          </marker>
        ))}
      </defs>

      {/* Lane A — consumer app */}
      <rect x={48} y={96} width={1824} height={296} rx={26} fill={C.appSoft} stroke="rgba(185,167,255,0.28)" strokeWidth={2} />
      <Lines x={M} y={142} lines={[f.app.label[locale]]} size={zh ? 24 : 20} weight={700} fill={C.app} mono={!zh} />
      {f.app.steps.map((s, i) => (
        <g key={s.title.en.join(" ")}>
          <Box x={nx(i)} y={AY} node={s} tag={`A${i + 1}`} color={C.app} zh={zh} />
          {i < 7 ? <line x1={nx(i) + NW + 4} y1={mid} x2={nx(i + 1) - 6} y2={mid} stroke={C.app} strokeWidth={3} markerEnd="url(#c06-arrow-app)" /> : null}
        </g>
      ))}

      {/* Lane B — admin CMS */}
      <rect x={48} y={648} width={1824} height={296} rx={26} fill={C.cmsSoft} stroke="rgba(231,243,75,0.24)" strokeWidth={2} />
      <Lines x={nx(2) + 8} y={694} lines={[f.cms.label[locale]]} size={zh ? 24 : 20} weight={700} fill={C.cms} mono={!zh} />
      <rect x={nx(2) + 8} y={BY + 12} width={3 * STEP - 48} height={NH - 24} rx={16} fill="none" stroke={C.stroke} strokeWidth={2} strokeDasharray="4 8" />
      <Lines x={nx(2) + 36} y={BY + 72} lines={f.cms.other[locale]} size={zh ? 21 : 19} fill={C.dim} lh={1.45} />
      {cms.map((s, k) => (
        <g key={s.title.en.join(" ")}>
          <Box x={nx(s.at)} y={BY} node={s} tag={`B${k + 1}`} color={C.cms} zh={zh} />
          {k < cms.length - 1 && cms[k + 1].at === s.at + 1 ? (
            <line x1={nx(s.at) + NW + 4} y1={bmid} x2={nx(s.at + 1) - 6} y2={bmid} stroke={C.cms} strokeWidth={3} markerEnd="url(#c06-arrow-cms)" />
          ) : null}
        </g>
      ))}

      {/* ① CMS listing → app catalogue */}
      <path d={`M ${ncx(1)} ${BY - 6} V 520 H ${ncx(0)} V ${AY + NH + 10}`} {...link} />
      <Badge x={ncx(0) + 36} y={zh ? 498 : 472} n={1} />
      <Lines x={ncx(0) + 62} y={zh ? 506 : 478} lines={f.links[0].text[locale]} size={zh ? 22 : 19} weight={600} fill={C.link} lh={1.3} />

      {/* ② order created in the app → CMS */}
      <path d={`M ${ncx(6)} ${AY + NH + 6} V 560 H ${ncx(5)} V ${BY - 10}`} {...link} />
      <Badge x={ncx(5) - 36} y={604} n={2} />
      <Lines x={ncx(5) - 62} y={612} lines={f.links[1].text[locale]} size={zh ? 22 : 19} weight={600} fill={C.link} anchor="end" />

      {/* ③ staff review and update — sits on the CMS order chain */}
      <Badge x={ncx(6) + STEP / 2} y={BY + NH + 34} n={3} />
      <Lines x={ncx(6) + STEP / 2 - 26} y={BY + NH + 41} lines={[f.links[2].text[locale].join(zh ? "" : " ")]} size={zh ? 20 : 17} weight={600} fill={C.cms} anchor="end" />

      {/* ④ status → app order tracking */}
      <path d={`M ${ncx(7)} ${BY - 6} V ${AY + NH + 10}`} {...link} />
      <Badge x={ncx(7) - 34} y={442} n={4} />
      <Lines x={ncx(7) - 60} y={zh ? 450 : 436} lines={f.links[3].text[locale]} size={zh ? 20 : 18} weight={600} fill={C.link} anchor="end" lh={1.3} />

      {/* Legend */}
      <line x1={M} y1={1022} x2={M + 56} y2={1022} stroke={C.app} strokeWidth={3} />
      <line x1={M} y1={1030} x2={M + 56} y2={1030} stroke={C.cms} strokeWidth={3} />
      <Lines x={M + 72} y={1033} lines={[f.legend.lane[locale]]} size={21} fill={C.sub} />
      <line x1={M + 330} y1={1026} x2={M + 386} y2={1026} stroke={C.link} strokeWidth={2.5} strokeDasharray="9 8" />
      <Lines x={M + 402} y={1033} lines={[f.legend.link[locale]]} size={21} fill={C.sub} />
      <Lines x={1920 - M} y={1033} lines={[f.legend.source[locale]]} size={zh ? 20 : 18} fill={C.dim} anchor="end" />
    </svg>
  );
}

/* Below lg: the same lanes as vertical lists, relationships inline. ------- */

function Row({ tag, title, sub, color, note }: { tag: string; title: string; sub: string; color: "app" | "cms"; note?: { n: number; text: string } }) {
  return (
    <li className="list-none">
      <div className="grid grid-cols-[2.5rem_1fr] gap-3 rounded-[14px] border border-[rgba(255,255,255,0.12)] bg-[#191a20] px-4 py-3">
        <span className={`cf-meta pt-0.5 ${color === "app" ? "text-[#B9A7FF]" : "text-[#E7F34B]"}`}>{tag}</span>
        <span>
          <span className="block text-[17px] font-bold leading-6 text-[#f2f2f4]">{title}</span>
          <span className="mt-0.5 block text-[14px] leading-[1.45rem] text-[#a7abb7]">{sub}</span>
        </span>
      </div>
      {note ? (
        <p className="ml-3 flex items-start gap-2 border-l-2 border-dashed border-[#F2F0EC]/60 py-2 pl-4 text-[14px] leading-[1.45rem] text-[#f2f2f4]">
          <span aria-hidden className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border border-[#F2F0EC] font-mono text-[11px]">{note.n}</span>
          {note.text}
        </p>
      ) : null}
    </li>
  );
}

function FlowVertical({ locale }: { locale: Locale }) {
  const f = flow();
  const zh = locale === "zh";
  const join = (lines: string[]) => lines.join(zh ? "" : " ");
  const lt = (i: number) => join(f.links[i].text[locale]);
  const appNote: Record<number, { n: number; text: string }> = {
    0: { n: 1, text: zh ? `${lt(0)}：來自後台 B2 上架與更新` : `${lt(0)}: from CMS B2, listing & updates` },
    6: { n: 2, text: zh ? `${lt(1)}：後台 B3 收到訂單` : `${lt(1)}: received in CMS B3` },
    7: { n: 4, text: zh ? `${lt(3)}：由後台 B5 更新` : `${lt(3)}: updated in CMS B5` },
  };
  // ①②④ are told once, on the app lane; the CMS lane only carries ③.
  const cmsNote: Record<number, { n: number; text: string }> = { 3: { n: 3, text: lt(2) } };
  return (
    <div className="grid gap-6 rounded-[18px] bg-[#0f1014] p-4 sm:p-6">
      <div>
        <p className={`text-[13px] font-semibold tracking-[0.06em] text-[#B9A7FF] ${zh ? "" : "font-mono"}`}>{f.app.label[locale]}</p>
        <ol className="mt-3 grid gap-2">
          {f.app.steps.map((s, i) => <Row key={i} tag={`A${i + 1}`} title={join(s.title[locale])} sub={join(s.sub[locale])} color="app" note={appNote[i]} />)}
        </ol>
      </div>
      <div>
        <p className={`text-[13px] font-semibold tracking-[0.06em] text-[#E7F34B] ${zh ? "" : "font-mono"}`}>{f.cms.label[locale]}</p>
        <ol className="mt-3 grid gap-2">
          {f.cms.steps.map((s, k) => <Row key={k} tag={`B${k + 1}`} title={join(s.title[locale])} sub={join(s.sub[locale])} color="cms" note={cmsNote[k]} />)}
        </ol>
        <p className="mt-3 text-[14px] leading-[1.45rem] text-[#7f8394]">{join(f.cms.other[locale])}</p>
      </div>
    </div>
  );
}

export function Case06CrossSystemFlow({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  const alt = zh
    ? "App × CMS 跨系統流程圖。消費者 App：商品探索 → 商品頁 → 購物車 → 登入／註冊 → 結帳 → 付款 → 訂單確認 → 訂單查詢。營運後台：商品管理 → 上架與更新，商品出現在 App 的商品探索；訂單確認後建立訂單，後台收到訂單 → 訂單管理 → 更新訂單狀態，狀態顯示於 App 的訂單查詢並推播通知。"
    : "App × CMS cross-system flow. Consumer app: product discovery → product details → cart → sign in / join → checkout → payment → order confirmation → order tracking. Admin CMS: product management → listing & updates, which feed product discovery in the app; order confirmation creates an order the CMS receives → order management → status update, which shows in the app's order tracking with a push notification.";
  const asset = { src: `/legacy-assets/case06/case06-flow-${locale}.webp`, alt };
  return (
    <figure>
      <div className="hidden lg:block">
        <div className="relative overflow-hidden rounded-[18px]" style={{ aspectRatio: "1920 / 1080" }}>
          <Case06FlowSvg locale={locale} title={alt} />
          <EvidenceTrigger asset={asset}><span className="block h-full w-full" /></EvidenceTrigger>
        </div>
      </div>
      <div className="lg:hidden">
        <FlowVertical locale={locale} />
        <div className="relative mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-[rgba(255,255,255,0.24)] px-4 text-[14px] font-medium text-[#f2f2f4]">
          <span aria-hidden>{zh ? "查看完整流程圖" : "View the full diagram"}</span>
          <span aria-hidden className="text-[#E7F34B]">↗</span>
          <EvidenceTrigger asset={asset}><span className="block h-full w-full" /></EvidenceTrigger>
        </div>
      </div>
      {/* The SVG carries this note in its legend; only the list layout needs it. */}
      <figcaption className="cf-dim mt-4 max-w-[62ch] text-[13px] leading-6 lg:hidden">
        {zh
          ? "依原始需求規格整理的前後台關係：系統互動概覽，不是技術架構圖。"
          : "App–CMS relationships based on the original requirements specification: an interaction overview, not a technical architecture."}
      </figcaption>
    </figure>
  );
}
