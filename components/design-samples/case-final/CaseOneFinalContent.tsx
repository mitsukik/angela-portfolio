import Image from "next/image";
import type { ReactNode } from "react";
import type { Locale } from "@/data/locale";
import { EvidenceHeading } from "./EvidenceHeading";
import { EvidenceMotion } from "./EvidenceMotion";
import { FlowEvidence } from "./FlowEvidence";
import { ReadingSection } from "./ReadingSection";
import { ScrollSkipEvidence } from "./ScrollSkipEvidence";
import { SequenceReveal } from "./SequenceReveal";

type RegisterSection = (index: number, element: HTMLElement | null) => void;
type EvidenceProps = { src: string; alt: string; caption: string; aspect?: string; className?: string };

function Evidence({ src, alt, caption, aspect = "aspect-[3/2]", className = "" }: EvidenceProps) {
  return <figure data-evidence-entrance className={className}>
    <div className={`cf-figure-frame relative ${aspect} w-full`}><Image src={src} alt={alt} fill sizes="(max-width: 1024px) 100vw, 1600px" className="object-contain" /></div>
    <figcaption className="cf-figure-caption cf-meta mt-4">{caption}</figcaption>
  </figure>;
}

function InspectableEvidence({ src, alt, caption, aspect, className = "", scrollHint }: EvidenceProps & { aspect: string; scrollHint?: string }) {
  return <figure data-evidence-entrance className={`min-w-0 max-w-full ${className}`}>
    <div className="cf-figure-frame min-w-0 max-w-full overflow-x-auto" tabIndex={0} role="group" aria-label={alt}>
      <div className={`relative ${aspect} min-w-[70rem] lg:min-w-0`}><Image src={src} alt={alt} fill sizes="(max-width: 1023px) 1120px, 1600px" className="object-contain" /></div>
    </div>
    <figcaption className="cf-figure-caption cf-meta mt-4">{caption}</figcaption>
    {scrollHint && <p className="cf-dim mt-2 text-[12px] lg:hidden">{scrollHint}</p>}
  </figure>;
}

function TopCropEvidence({ src, alt, caption, aspect = "aspect-[16/10]", className = "" }: EvidenceProps) {
  return <figure data-evidence-entrance className={`min-w-0 max-w-full ${className}`}>
    <div className="cf-figure-frame min-w-0 max-w-full overflow-x-auto" tabIndex={0} role="group" aria-label={alt}>
      <div className={`relative ${aspect} min-w-[64rem] lg:min-w-0`}><Image src={src} alt={alt} fill sizes="(max-width: 1023px) 1024px, 1600px" className="object-cover object-top" /></div>
    </div>
    <figcaption className="cf-figure-caption cf-meta mt-4">{caption}</figcaption>
  </figure>;
}

function Section({ index, register, children, divider = true }: { index: number; register: RegisterSection; children: ReactNode; divider?: boolean }) {
  return <div ref={(element) => register(index, element)} className={`cf-section${divider ? " cf-section-divider" : ""}`}>{children}</div>;
}

function DecisionBlock({ label, title, body, principle, children }: { label: string; title: string; body: string; principle?: string; children: ReactNode }) {
  return <article className="border-t cf-rule pt-8">
    <div className="max-w-[70ch]"><p className="cf-meta cf-accent">{label}</p><h3 className="cf-heading mt-3 text-[clamp(1.35rem,2.4vw,2rem)] font-medium">{title}</h3><p className="cf-body body-tc mt-4">{body}</p></div>
    <div className="mt-8 space-y-8">{children}</div>
    {principle && <p className="mt-8 border-t cf-rule pt-5"><span className="cf-heading text-[clamp(1rem,1.7vw,1.3rem)] font-medium">{principle}</span></p>}
  </article>;
}

function ScopeSummary() {
  const groups = [
    ["Platform / Warehouse", "Operations · Inventory · Orders · Fulfillment"],
    ["Supplier", "Dashboard · Product Management · Pricing"],
    ["Agent / Streamer", "Selection · Collaboration · Sales Workflow"],
    ["Consumer", "Storefront · Checkout · Order Experience"],
  ];
  return <ul className="grid border-t cf-rule sm:grid-cols-2 lg:grid-cols-4">{groups.map(([label, items]) => <li key={label} className="border-b cf-rule py-6 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0"><p className="cf-meta cf-accent">{label}</p><p className="cf-dim mt-3 text-[14px] leading-6">{items}</p></li>)}</ul>;
}

/*
 * CASE01 dual CTA. The two destinations are deliberately different things
 * and must stay labelled as such: the Original Engineering Demo is the
 * engineers' real implementation from the project (used by the PM and
 * Client to review requirements); the Portfolio Prototype is a separate
 * reconstruction made for portfolio presentation, not the original UI.
 * The prototype has no verified public URL yet, so it renders without an
 * href rather than a guessed one — add PORTFOLIO_PROTOTYPE_URL once the
 * deployment exists. Reuses the existing .case-link / cf-meta roles (same
 * accent-vs-dim emphasis grammar as CASE04's prototype links).
 */
const ENGINEERING_DEMO_URL = "https://sc-demo.sdxdevelop.com/zh-tw";
const PORTFOLIO_PROTOTYPE_URL: string | null = null;

export function CaseOneDemoLinks({ locale, className = "" }: { locale: Locale; className?: string }) {
  const zh = locale === "zh";
  const items = [
    {
      href: ENGINEERING_DEMO_URL,
      label: zh ? "查看原始工程 Demo →" : "View Original Engineering Demo →",
      note: zh ? "專案期間使用的原始工程實作" : "Original engineering implementation used during the project",
      tone: "cf-accent",
    },
    {
      href: PORTFOLIO_PROTOTYPE_URL,
      label: zh ? "查看作品集 Prototype →" : "View Portfolio Prototype →",
      // No deployed URL yet: the note states the non-clickable reason
      // explicitly. Drop the suffix once PORTFOLIO_PROTOTYPE_URL is set.
      note: zh
        ? `為作品集展示重新建構${PORTFOLIO_PROTOTYPE_URL ? "" : " · 製作中"}`
        : `Reconstructed for portfolio presentation${PORTFOLIO_PROTOTYPE_URL ? "" : " · In development"}`,
      tone: "cf-dim",
    },
  ];
  return <ul className={`flex flex-col gap-5 sm:flex-row sm:gap-10 ${className}`}>
    {items.map((item) => <li key={item.label}>
      {item.href
        ? <a href={item.href} target="_blank" rel="noopener noreferrer" className={`case-link cf-meta whitespace-nowrap ${item.tone}`}>{item.label}</a>
        : <span className={`cf-meta whitespace-nowrap ${item.tone}`}>{item.label}</span>}
      <p className="cf-dim mt-2 text-[13px] leading-5">{item.note}</p>
    </li>)}
  </ul>;
}

function Timeline({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  const milestones = zh ? [
    ["2025.05", "Consumer Web 前台設計完成"],
    ["2025.06", "主要管理後台設計完成"],
    ["2025.10", "PM 加入，協助後期專案協調與 QA"],
    ["2026.04", "前後台系統完成開發並交付"],
  ] : [
    ["May 2025", "Consumer Web design completed"],
    ["Jun 2025", "Core administration systems completed"],
    ["Oct 2025", "PM joined for later-stage coordination and QA"],
    ["Apr 2026", "Working frontend + backend system completed and delivered"],
  ];
  return <div>
    <p className="cf-meta cf-dim mb-4">{zh ? "專案時程" : "Project Timeline"}</p>
    <ol className="grid border-t cf-rule sm:grid-cols-2 lg:grid-cols-4">{milestones.map(([date, text]) => <li key={date} className="border-b cf-rule py-6 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0"><p className="cf-meta cf-accent">{date}</p><p className="cf-dim mt-3 text-[14px] leading-6">{text}</p></li>)}</ol>
  </div>;
}

function SurfaceScope({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  const rows: Array<[string, string[]]> = [
    [zh ? "由我設計" : "Designed by me", ["Platform Backend", "Supplier Backend", "Agent Backend", "Consumer Web Storefront"]],
    [zh ? "另一位 UI Designer 依既有系統延伸" : "Extended by another UI Designer from the established system", ["Consumer Mobile", "Streamer Backend"]],
  ];
  return <div className="space-y-4">{rows.map(([label, items]) => <div key={label} className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
    <span className="cf-meta cf-dim">{label}</span>
    <ul className="flex flex-wrap gap-2">{items.map((item) => <li key={item} className="cf-tag">{item}</li>)}</ul>
  </div>)}</div>;
}

export function CaseOneFinalContent({ register, locale }: { register: RegisterSection; locale: Locale }) {
  const zh = locale === "zh";
  return <EvidenceMotion><>
    <Section index={0} register={register} divider={false}>
      <EvidenceHeading label={zh ? "01 — The Challenge" : "01 — THE CHALLENGE"} title={zh ? "不只是一個線上商店" : "More than an online store"}>
        <div className="space-y-10">
          <div data-evidence-entrance className="max-w-[70ch] space-y-4">
            {(zh ? [
              "專案已有明確的商業方向，但許多實際營運規則與產品細節仍需要進一步定義。",
              "商品從台灣供應商送往越南倉庫，完成實際驗收後進入共享庫存，再由 Agent 或 Streamer 選品與販售。",
              "因此，庫存、定價、訂單、履約與結算，都必須在不同角色與不同流程階段之間維持一致。",
              "核心挑戰是將這套商業模式，轉換成使用者能理解、工程端也能實際開發的產品系統。",
            ] : [
              "The business direction was established, but many operational rules and product details still needed to be defined.",
              "Products moved from Taiwanese suppliers into a Vietnam-based warehouse, were verified into shared inventory, and could then be selected and sold by Agents or Streamers.",
              "This meant inventory, pricing, orders, fulfillment, and settlement had to remain consistent across multiple roles and stages.",
              "The challenge was turning that business model into a system that users could understand and engineering could implement.",
            ]).map((paragraph) => <p key={paragraph} className="cf-body body-tc">{paragraph}</p>)}
          </div>
          <div>
        <FlowEvidence src={zh ? "/images/case01/case01_CE_chi01.webp" : "/images/case01/case01_CE_eng01.webp"} alt={zh ? "跨境直播電商生態系統，呈現供應、銷售與消費端的角色及流程" : "Cross-border live commerce ecosystem diagram showing the roles and flow across supply, sales, and consumer touchpoints"} caption={zh ? "FIG. 01 — 跨境直播電商生態系" : "FIG. 01 — Cross-border Live Commerce Ecosystem"} scrollHint={zh ? "→ 左右滑動查看完整流程圖" : "→ Scroll to see the full diagram"} />
        <p data-evidence-entrance className="cf-body body-tc mt-8 max-w-[70ch] border-t cf-rule pt-6">{zh ? "供應商 → 跨境運輸 → 越南倉庫 → 驗收／掃描 → 商品啟用 → 共享庫存 → 代理公司／直播主 → 銷售活動／商店頁 → 消費者 → 訂單 → 履約" : "Supplier → Cross-border Shipment → Vietnam Warehouse → Receive / Count / Scan → Active Product → Shared Inventory → Agent / Streamer → Campaign / Storefront → Consumer → Order → Fulfillment"}</p>
          </div>
        </div>
      </EvidenceHeading>
    </Section>

    <Section index={1} register={register}>
      <ReadingSection
        label={zh ? "02 — The Approach" : "02 — THE APPROACH"}
        title={zh ? "先建立產品邏輯，再進入介面設計" : "From business rules to product structure"}
        paragraphs={zh ? [
          "專案前期，我直接與工程團隊合作，將 Client 在會議中提出的需求逐步整理成完整產品流程。",
          "我沒有直接從單一畫面開始，而是從五個層次建立系統：",
        ] : [
          "Early in the project, I worked directly with the engineering team to translate requirements from client meetings into complete product flows.",
          "Rather than starting from individual screens, I structured the system across five layers:",
        ]}
        points={zh ? [
          "01 Ecosystem｜釐清不同角色、責任與彼此關係。",
          "02 Product Architecture｜定義不同使用角色所需要的主要功能。",
          "03 Core Flows｜整理商品、庫存、定價、Checkout、訂單與履約流程。",
          "04 Business Rules & States｜定義權限、驗證、系統狀態、例外情況與 Edge Cases。",
          "05 Interface Design｜最後將確認過的產品邏輯轉換成可操作的流程與介面。",
        ] : [
          "01 Ecosystem｜Roles, responsibilities, and relationships.",
          "02 Product Architecture｜Functions required by each user type.",
          "03 Core Flows｜Product, inventory, pricing, checkout, order, and fulfillment journeys.",
          "04 Business Rules & States｜Permissions, validation, system states, exceptions, and edge cases.",
          "05 Interface Design｜Turning confirmed logic into usable workflows and UI.",
        ]}
        media={<div className="space-y-10">
          <p className="cf-body body-tc">{zh ? "Consumer Web 前台於 2025 年 5 月完成設計，主要管理後台則於 6 月完成。" : "The consumer-facing Web experience was completed in May 2025, followed by the core administration systems in June."}</p>
          <SurfaceScope locale={locale} />
        </div>}
      />
    </Section>

    <Section index={2} register={register}>
      <EvidenceHeading label={zh ? "03 — Designing the System" : "03 — DESIGNING THE SYSTEM"} title={zh ? "讓複雜的營運規則變得容易理解" : "Making complex operations understandable"}>
        <div className="space-y-12">
          <div data-evidence-entrance className="max-w-[70ch] space-y-4">
            {(zh ? [
              "共享庫存是這套系統的重要挑戰之一。",
              "商品從台灣運往越南後，不會直接成為可售庫存，而是需要由當地倉庫實際收貨、點貨與確認後才正式啟用。",
              "Agent 與 Streamer 共用同一批實體庫存，因此系統除了顯示一般庫存狀態，也必須處理低庫存、可控超賣、預計到貨與庫存異動紀錄。",
              "定價則有另一層商業規則：Supplier 可以設定最低售價，而銷售角色仍保有高於最低售價的定價彈性。",
              "這些規則最後被轉換成 Product、Inventory、Pricing、Order 與日常營運所需要的操作介面。",
            ] : [
              "Shared inventory was one of the key system challenges.",
              "Products shipped from Taiwan only became active inventory after the Vietnam warehouse physically received, counted, and verified them.",
              "Agents and Streamers then sold from the same shared stock, while the system also needed to support low-stock conditions, controlled overselling, expected arrivals, and inventory history.",
              "Pricing added another layer of rules: Suppliers could define a minimum selling price while sellers retained flexibility above that threshold.",
              "These rules were translated into the Product, Inventory, Pricing, Order, and operational interfaces used across the platform.",
            ]).map((paragraph) => <p key={paragraph} className="cf-body body-tc">{paragraph}</p>)}
          </div>
          <FlowEvidence src={zh ? "/images/case01/case01_ISF_chi01.webp" : "/images/case01/case01_ISF_eng01.webp"} alt={zh ? "庫存狀態流程，呈現實體到貨、驗收、數位庫存與消費端影響" : "Inventory status flow showing physical arrival, inspection, digital inventory, and consumer-facing impact"} caption={zh ? "FIG. 02 — 實體入庫與數位庫存狀態" : "FIG. 02 — Physical Receiving and Digital Inventory States"} scrollHint={zh ? "→ 左右滑動查看完整流程圖" : "→ Scroll to see the full diagram"} />
          <div className="space-y-16">
          <DecisionBlock label="03A — MULTI-ROLE COLLABORATION" title={zh ? "多角色協作" : "Multi-role Collaboration"} body={zh ? "直播主名單不是單純資料表；搜尋、直播時段、專長、合作狀態與多條件篩選共同支援 Supplier 與營運端找到合適合作對象。" : "The Streamer list is more than a data table. Search and filters for schedule, specialty, and collaboration status help Suppliers and operators identify suitable partners."} principle="Shared data, role-specific actions.">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
              <TopCropEvidence src="/images/case01/evidence/case01-streamer-list.webp" alt={zh ? "直播主名單與合作狀態" : "Streamer list and collaboration status"} caption={zh ? "CONTEXT — 直播主名單 · 搜尋、狀態與合作脈絡" : "CONTEXT — Streamer List · Discovery, Status, and Collaboration"} className="lg:col-span-8" />
              <TopCropEvidence src="/images/case01/evidence/case01-streamer-filter.webp" alt={zh ? "直播主名單的展開篩選狀態" : "Expanded streamer filters"} caption={zh ? "DETAIL — 多條件篩選與合作狀態" : "DETAIL — Multi-filter Controls and Collaboration State"} aspect="aspect-[4/5]" className="lg:col-span-4 lg:mt-12" />
            </div>
          </DecisionBlock>
          <DecisionBlock label="03B — PHYSICAL INVENTORY × DIGITAL COMMERCE" title={zh ? "實體庫存 × 數位商務" : "Physical Inventory × Digital Commerce"} body={zh ? "Inventory Management 呈現目前可操作的庫存狀態；Inventory Log 則記錄每次異動、Changed By、Role 與 Timestamp，讓實體庫存與數位商品狀態保持可追蹤。" : "Inventory Management makes the current stock state clear. The Inventory Log records every change with Changed By, Role, and Timestamp, keeping physical inventory and digital product states traceable."} principle={zh ? "目前狀態必須清楚，每次異動也必須可追溯。" : "The current state must be clear, and every change must remain traceable."}>
            <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
              <Evidence src="/images/case01/case01_inventory_showcase_sample.webp" alt={zh ? "庫存管理後台介面，包含商品列表、庫存狀態與篩選" : "Inventory management interface including product list, inventory status, and filters"} caption={zh ? "OPERATIONAL EVIDENCE — Inventory Management · 目前庫存狀態" : "OPERATIONAL EVIDENCE — Inventory Management · Current State"} className="lg:col-span-7" />
              <InspectableEvidence src="/images/case01/evidence/case01-inventory-log-focused.png" alt={zh ? "商品庫存異動紀錄，呈現狀態、操作者、角色、異動內容與時間" : "Product Inventory Log showing status, Changed By, Role, change details, and Timestamp"} caption={zh ? "SYSTEM STATE — Product Inventory Log · 異動歷史與可追蹤性" : "SYSTEM STATE — Product Inventory Log · Traceability"} aspect="aspect-[2500/920]" className="lg:col-span-5 lg:mt-10" scrollHint={zh ? "→ 左右滑動查看 Role 與 Timestamp" : "→ Scroll to see Role and Timestamp"} />
            </div>
          </DecisionBlock>
          <DecisionBlock label="03C — FLEXIBLE PRICING × BUSINESS RULES" title={zh ? "彈性定價 × 商業規則" : "Flexible Pricing × Business Rules"} body={zh ? "直播主可自行設定售價，但售價不得低於供應商設定的最低售價（可等於最低售價），且須符合價格區間與獲利限制。介面把成本、SRP、預估利潤、調價紀錄與即時驗證放在同一決策脈絡中。" : "Streamers can set their own selling price, but it cannot fall below the Supplier-defined minimum. Matching the minimum is allowed, and the price must also stay within the configured range and profitability constraints. The interface brings cost, SRP, Estimated Profit, pricing history, and real-time validation into a single decision context."} principle={zh ? "在不破壞商業模式的前提下，保留使用彈性。" : "Give users flexibility without breaking the business model."}>
            <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-8"><InspectableEvidence src="/images/case01/evidence/case01-pricing-detail.webp" alt={zh ? "商品定價頁面" : "Product pricing page"} caption={zh ? "OPERATIONAL EVIDENCE — 商品定價 · 成本、SRP、預估利潤與調價紀錄" : "OPERATIONAL EVIDENCE — Product Pricing · Decision Context"} aspect="aspect-[2600/2313]" className="lg:col-span-8" scrollHint={zh ? "→ 左右滑動查看完整內容" : "→ Scroll to see the full evidence"} /><Evidence src="/images/case01/evidence/case01-pricing-invalid-state.webp" alt={zh ? "定價試算的無效狀態" : "Invalid pricing calculation state"} caption={zh ? "VALIDATION — 即時定價驗證 · 已移除敏感資訊" : "VALIDATION — Real-time Pricing Validation · Sanitized"} aspect="aspect-[1600/2666]" className="mt-8 lg:col-span-4 lg:mt-0" /></div>
            <Evidence src={zh ? "/images/case01/case01_PRL_chi01.webp" : "/images/case01/case01_PRL_eng01.webp"} alt={zh ? "已移除敏感參數的定價與收益邏輯圖" : "Sanitized pricing and revenue logic diagram"} caption={zh ? "CONTEXT — 定價與收益邏輯 · 已移除敏感資訊" : "CONTEXT — Pricing & Revenue Logic · Sanitized"} className="lg:w-2/3" />
          </DecisionBlock>
          <DecisionBlock label="03D — DATA-HEAVY OPERATIONAL WORKFLOW" title={zh ? "資料密集的營運流程" : "Data-heavy Operational Workflow"} body={zh ? "訂單資料量大、狀態多變。Search、Filter 與 Status View 放在同一層級，讓使用者先縮小範圍；Payment、Shipping 與 Source 同時可見，Row Actions 則讓使用者確認狀態後就地處理。" : "Orders are high-volume and change state often. Search, Filter, and Status View sit at the same level so users can narrow the set first; Payment, Shipping, and Source stay visible together, and Row Actions let users act in place once the state is clear."} principle={zh ? "高密度資料必須直接支持判斷與操作。" : "Dense data must directly support decisions and actions."}>
            <ScrollSkipEvidence src="/images/case01/evidence/case01-order-list.webp" alt={zh ? "平台訂單管理列表" : "Platform order management list"} caption={zh ? "OPERATIONAL EVIDENCE — Order List · 搜尋、篩選、狀態與列操作" : "OPERATIONAL EVIDENCE — Order List · Search, Filters, States, and Actions"} aspect="aspect-[2048/1565]" initialScrollPx={165} scrollHint={zh ? "→ 左右滑動查看 Payment、Shipping、Source 與操作" : "→ Scroll to see Payment, Shipping, Source, and Actions"} />
            <ScrollSkipEvidence src="/images/case01/evidence/case01-supplier-dashboard.webp" alt={zh ? "供應商營運儀表板" : "Supplier operations dashboard"} caption={zh ? "CONTEXT — Supplier Dashboard · 次要營運總覽" : "CONTEXT — Supplier Dashboard · Management Overview"} aspect="aspect-[1900/1700]" className="lg:ml-auto lg:w-2/3" initialScrollPx={160} scrollHint={zh ? "→ 左右滑動查看完整內容" : "→ Scroll to see the full evidence"} />
          </DecisionBlock>
            <DecisionBlock label="03E — STATE CHANGES ACROSS ROLES" title={zh ? "跨端狀態與例外處理" : "Cross-touchpoint States & Exceptions"} body={zh ? "共享庫存可能在消費者結帳期間改變；退換貨也必須把數量、處理方式與後續訂單／庫存狀態連結起來。" : "Shared inventory can change while a consumer is checking out, and returns and exchanges must connect quantity, resolution, and the resulting order and inventory states."}>
              <div className="space-y-10">
          <div className="max-w-[70ch] border-t cf-rule pt-8"><p className="cf-meta cf-accent">CASE 01 — STOCK CHANGE DURING CHECKOUT</p></div>
          <InspectableEvidence src="/images/case01/evidence/case01-checkout-out-of-stock-focused.png" alt={zh ? "消費者結帳確認頁的缺貨狀態，呈現警告訊息、數量歸零商品與停用的 Checkout 按鈕" : "Consumer checkout confirmation page in an out-of-stock state, showing a warning, a zeroed-out product quantity, and a disabled Checkout button"} caption={zh ? "SYSTEM STATE — 真實 Checkout 缺貨狀態 · 警告與阻擋" : "SYSTEM STATE — Real Checkout Out-of-stock · Warning and Blocked Action"} aspect="aspect-[4320/5500]" className="lg:mx-auto lg:w-4/5" scrollHint={zh ? "→ 左右滑動查看完整內容" : "→ Scroll to see the full evidence"} />
          <Evidence src={zh ? "/images/case01/case01_BE_chi01.webp" : "/images/case01/case01_BE_eng01.webp"} alt={zh ? "後台庫存狀態如何影響消費者結帳流程" : "How backend inventory state affects consumer checkout"} caption={zh ? "CONTEXT — 後台狀態如何影響消費者體驗" : "CONTEXT — How Backend State Impacts the Consumer Experience"} className="lg:w-2/3" />
          <SequenceReveal items={zh ? [["發生了什麼？", "商品庫存已在結帳過程中改變。"], ["為什麼不能繼續？", "目前訂單內容已不再有效。"], ["下一步怎麼做？", "更新購物車後重新確認可購買商品。"]] : [["What happened?", "Product availability changed during Checkout."], ["Why can’t I continue?", "The current order is no longer valid."], ["What can I do next?", "Update the cart and confirm available products before continuing."]]} />
          <div className="max-w-[70ch] border-t cf-rule pt-8"><p className="cf-meta cf-accent">CASE 02 — RETURN / EXCHANGE</p><p className="cf-body body-tc mt-4">{zh ? "退換貨流程驗證申請數量，依商品狀況決定 Restock / Disposed，並以 Refund / Reshipment 完成處理，同步更新 Order 與 Inventory 狀態。" : "The return and exchange flow validates quantity, determines Restock / Disposed based on item condition, resolves the case through Refund / Reshipment, and updates the resulting order and inventory states."}</p></div>
          <InspectableEvidence src="/images/case01/evidence/case01-return-exchange-main-focused.png" alt={zh ? "退換貨管理介面，呈現退貨追蹤資訊、退貨日期與退貨商品清單" : "Return and exchange management showing tracking information, return date, and returned items"} caption={zh ? "OPERATIONAL EVIDENCE — Return / Exchange Detail" : "OPERATIONAL EVIDENCE — Return / Exchange Detail"} aspect="aspect-[28/13]" scrollHint={zh ? "→ 左右滑動查看完整內容" : "→ Scroll to see the full evidence"} />
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
            <InspectableEvidence src="/images/case01/evidence/case01-return-exchange-validation.png" alt={zh ? "換貨商品與數量驗證介面，提示換貨數量不得超過原訂單數量" : "Exchange item and quantity validation stating that the exchange quantity cannot exceed the original order quantity"} caption={zh ? "VALIDATION — Exchange Quantity · 原訂單數量限制" : "VALIDATION — Exchange Quantity · Original-order Limit"} aspect="aspect-[2550/1650]" scrollHint={zh ? "→ 左右滑動查看完整內容" : "→ Scroll to see the full evidence"} />
            <InspectableEvidence src="/images/case01/evidence/case01-return-exchange-consequence.png" alt={zh ? "退貨商品的 Restock 或 Disposed 狀態，以及 Refund 與 Reshipment 處理欄位" : "Returned items showing Restock or Disposed status plus Refund and Reshipment controls"} caption={zh ? "SYSTEM STATE — Restock / Disposed · Refund / Reshipment" : "SYSTEM STATE — Restock / Disposed · Refund / Reshipment"} aspect="aspect-[28/15]" scrollHint={zh ? "→ 左右滑動查看完整內容" : "→ Scroll to see the full evidence"} />
          </div>
              </div>
            </DecisionBlock>
          </div>
        </div>
      </EvidenceHeading>
    </Section>

    <Section index={3} register={register}>
      <ReadingSection
        label={zh ? "04 — From Design to Delivery" : "04 — FROM DESIGN TO DELIVERY"}
        title={zh ? "從主要設計完成，一路支援到產品交付" : "Supporting the product through implementation"}
        paragraphs={zh ? [
          "主要前台與管理系統完成設計後，我持續與工程團隊合作進入實作階段。",
          "後續工作包含補足缺少的狀態與規則、確認實際操作行為、處理開發過程中的 UX 問題，以及依照實作狀況調整設計。",
          "PM 於 2025 年 10 月加入專案，主要協助後期的專案協調與 QA。",
          "專案期間也受到外部條件影響。當地金流合作方的處理時程較長，使部分整合工作與整體交付時間延後。",
          "Client 最後也完成了當地 Online Shop 所需的相關登記，但因商品類型受到限制，實際可上架的品項範圍需要縮減；核心系統架構則維持不變。",
        ] : [
          "After the main storefront and administration systems were designed, I continued working directly with the engineering team during implementation.",
          "My role included clarifying missing states and rules, reviewing implementation behavior, resolving UX questions, and adjusting designs when development exposed additional constraints.",
          "A PM joined in October 2025 to support later-stage coordination and QA.",
          "External dependencies also affected delivery. Work involving the local payment provider progressed more slowly than expected, which extended the project timeline.",
          "The Client also completed the local registration required to operate the online shop. Product-category restrictions reduced the range of items that could ultimately be listed, without changing the core system architecture.",
        ]}
        media={<Timeline locale={locale} />}
        mediaFullBleed
      />
    </Section>

    <Section index={4} register={register}>
      <ReadingSection
        label={zh ? "05 — Outcome" : "05 — OUTCOME"}
        title={zh ? "完成可運作的產品，而不是概念作品" : "A working product, without fabricated metrics"}
        paragraphs={zh ? [
          "最終完成可運作的 Consumer 前台與管理後台系統，並交付 Client。",
          "當年的工程實作亦留下可操作 Demo，並曾供 PM 與 Client 確認需求與產品行為。",
          "Client 後續因商業策略調整，產品沒有正式進入商業營運。",
          "因此，本案例不主張不存在的上線後 KPI，而是以實際完成的產品架構、跨角色流程、UX/UI 設計決策、工程實作與可操作系統作為成果證據。",
        ] : [
          "The project resulted in a working frontend and backend system and was delivered to the Client.",
          "The original engineering implementation was also used by the PM and Client to review requirements and product behavior during the project.",
          "The Client later changed its business strategy, so the product did not formally enter commercial operation.",
          "For that reason, this case does not claim post-launch KPIs. The evidence is the completed product architecture, multi-role workflows, UX/UI decisions, working engineering implementation, and delivered system.",
        ]}
        media={<div className="space-y-12"><CaseOneDemoLinks locale={locale} /><ScopeSummary /></div>}
        mediaFullBleed
      />
    </Section>
  </></EvidenceMotion>;
}
