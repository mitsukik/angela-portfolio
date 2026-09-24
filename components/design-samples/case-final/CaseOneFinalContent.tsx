import Image from "next/image";
import type { ReactNode } from "react";
import type { Locale } from "@/data/locale";
import { EvidenceHeading } from "./EvidenceHeading";
import { EvidenceMotion } from "./EvidenceMotion";
import { FlowEvidence } from "./FlowEvidence";
import { FlowTabs } from "./FlowTabs";
import { ReadingSection } from "./ReadingSection";

type RegisterSection = (index: number, element: HTMLElement | null) => void;
/*
 * One screenshot. Below lg the frame scrolls horizontally at a legible
 * minimum width (the existing CASE01 inspectable-evidence pattern); at lg+
 * it fits its column. Aspect ratio comes from the asset's real pixels.
 */
function Shot({ src, alt, size, minW, caption, scrollHint }: { src: string; alt: string; size: [number, number]; minW: string; caption?: string; scrollHint?: string }) {
  return <figure className="min-w-0 max-w-full">
    <div className="cf-figure-frame min-w-0 max-w-full overflow-x-auto" tabIndex={0} role="group" aria-label={alt}>
      <div className={`relative ${minW} lg:min-w-0`} style={{ aspectRatio: `${size[0]} / ${size[1]}` }}><Image src={src} alt={alt} fill sizes="(max-width: 1023px) 960px, 1210px" className="object-contain" /></div>
    </div>
    {caption && <figcaption className="cf-figure-caption cf-meta mt-3">{caption}</figcaption>}
    {scrollHint && <p className="cf-dim mt-2 text-[12px] lg:hidden">{scrollHint}</p>}
  </figure>;
}

function Section({ index, register, children, divider = true }: { index: number; register: RegisterSection; children: ReactNode; divider?: boolean }) {
  return <div ref={(element) => register(index, element)} className={`cf-section${divider ? " cf-section-divider" : ""}`}>{children}</div>;
}

/*
 * Curated evidence group: label + one sentence + the screenshot(s). Each
 * group proves one capability; widths are set per group by the caller so
 * no screenshot becomes another full-width hero.
 */
const GROUP_SPLIT = {
  stacked: ["", "mt-6"],
  "4/8": ["lg:col-span-4", "mt-6 lg:col-span-8 lg:mt-0"],
  "3/9": ["lg:col-span-3", "mt-6 lg:col-span-9 lg:mt-0"],
} as const;

function EvidenceGroup({ label, note, split = "stacked", children }: { label: string; note: string; split?: keyof typeof GROUP_SPLIT; children: ReactNode }) {
  const [textCol, mediaCol] = GROUP_SPLIT[split];
  return <article data-evidence-entrance className={`border-t cf-rule pt-8 ${split === "stacked" ? "" : "lg:grid lg:grid-cols-12 lg:gap-12"}`}>
    <div className={textCol}>
      <p className="cf-meta cf-accent">{label}</p>
      <p className="cf-dim mt-3 max-w-[70ch] text-[14px] leading-6">{note}</p>
    </div>
    <div className={mediaCol}>{children}</div>
  </article>;
}

/*
 * CASE01 dual CTA. The two destinations are deliberately different things
 * and must stay labelled as such: the Original Engineering Demo is the
 * engineers' real implementation from the project (used by the PM and
 * Client to review requirements); the Portfolio Prototype is a separate
 * reconstruction made for portfolio presentation, not the original UI.
 * The prototype is the public case01-admin deployment (supporting
 * implementation evidence, not the shipped product). Reuses the existing
 * .case-link / cf-meta roles; both destinations are live, so both links
 * share cf-accent while their notes stay cf-dim.
 */
const ENGINEERING_DEMO_URL = "https://sc-demo.sdxdevelop.com/zh-tw";
const PORTFOLIO_PROTOTYPE_URL: string | null = "https://case01-admin.vercel.app/";

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
      label: zh ? "操作後台原型 ↗" : "Open Admin Prototype ↗",
      // Without a URL the item renders non-clickable and the note says why.
      note: zh
        ? `為作品集展示重新建構${PORTFOLIO_PROTOTYPE_URL ? "" : " · 製作中"}`
        : `Reconstructed for portfolio presentation${PORTFOLIO_PROTOTYPE_URL ? "" : " · In development"}`,
      tone: "cf-accent",
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
        <FlowEvidence src={zh ? "/images/case01/case01_CE_chi02.webp" : "/images/case01/case01_CE_eng02.webp"} alt={zh ? "跨境直播電商生態系統，呈現供應、銷售與消費端的角色及流程" : "Cross-border live commerce ecosystem diagram showing the roles and flow across supply, sales, and consumer touchpoints"} caption={zh ? "FIG. 01 — 跨境直播電商生態系" : "FIG. 01 — Cross-border Live Commerce Ecosystem"} scrollHint={zh ? "→ 左右滑動查看完整流程圖" : "→ Scroll to see the full diagram"} />
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
          <FlowTabs
            label={zh ? "系統流程" : "System flows"}
            slides={[
              {
                label: zh ? "庫存狀態流程" : "Inventory Status Flow",
                src: zh ? "/images/case01/case01_ISF_chi02.webp" : "/images/case01/case01_ISF_eng02.webp",
                alt: zh ? "庫存狀態流程，呈現實體到貨、驗收、數位庫存決策與消費端影響" : "Inventory status flow showing physical arrival, verification, digital inventory decisions, and consumer-facing impact",
                caption: zh ? "FIG. 02 — 庫存狀態流程" : "FIG. 02 — Inventory Status Flow",
                note: zh ? "商品經倉庫驗收後才進入可售庫存，可控超賣則作為系統支援的商業規則。" : "Warehouse verification before stock goes live, with controlled overselling as a business rule.",
                scrollHint: zh ? "→ 左右滑動查看完整流程圖" : "→ Scroll to see the full diagram",
              },
              {
                label: zh ? "定價與收益邏輯" : "Pricing & Revenue Logic",
                src: zh ? "/images/case01/case01_PRL_chi02.webp" : "/images/case01/case01_PRL_eng02.webp",
                alt: zh ? "已移除敏感數值的定價與收益邏輯圖，呈現最低售價規則、價格驗證與多方結算" : "Sanitized pricing and revenue logic diagram showing the minimum-price rule, price validation, and multi-party settlement",
                caption: zh ? "FIG. 03 — 定價與收益邏輯 · 已移除敏感資訊" : "FIG. 03 — Pricing & Revenue Logic · Sanitized",
                note: zh ? "Supplier 最低售價、銷售端定價彈性，以及已移除敏感數值的多方結算邏輯。" : "Supplier minimum price, seller flexibility above it, and sanitized multi-party settlement logic.",
                scrollHint: zh ? "→ 左右滑動查看完整流程圖" : "→ Scroll to see the full diagram",
              },
            ]}
          />
          <div className="space-y-12">
            <EvidenceGroup label={zh ? "庫存管理" : "Inventory Management"} note={zh ? "目前庫存與超賣數量，搭配可追溯的異動紀錄。" : "Current stock and oversold quantity, with a traceable change history."}>
              <div className="space-y-8">
                <Shot src="/images/case01/evidence/case01-inventory-list.webp" size={[1330, 467]} minW="min-w-[56rem]" alt={zh ? "商品庫存列表，呈現庫存、超賣數量與商品狀態" : "Product inventory list showing stock, oversold quantity, and product status"} caption={zh ? "目前庫存狀態" : "Current inventory state"} scrollHint={zh ? "→ 左右滑動查看完整內容" : "→ Scroll to see the full evidence"} />
                <div className="lg:w-5/6">
                  <Shot src="/images/case01/evidence/case01-inventory-log-focused.png" size={[2500, 920]} minW="min-w-[56rem]" alt={zh ? "商品庫存異動紀錄，呈現狀態、操作者、角色、異動內容與時間" : "Product Inventory Log showing status, Changed By, Role, change details, and Timestamp"} caption={zh ? "庫存異動紀錄" : "Operational history"} scrollHint={zh ? "→ 左右滑動查看 Role 與 Timestamp" : "→ Scroll to see Role and Timestamp"} />
                </div>
              </div>
            </EvidenceGroup>
            <EvidenceGroup label={zh ? "Agent 與 Streamer 協作" : "Agent–Streamer Collaboration"} note={zh ? "協作狀態讓 Agent 快速理解 Streamer 目前是可邀請、已送出邀請、合作中或已結束合作。" : "Collaboration states help Agents understand whether a Streamer is available, invited, active or no longer collaborating."} split="4/8">
              <div>
                <Shot src="/images/case01/evidence/case01-streamer-collaboration.webp" size={[1652, 1542]} minW="min-w-[40rem]" alt={zh ? "直播主名單卡片，呈現送出合作邀請、已送出邀請、合作中與結束合作等狀態" : "Streamer list cards showing Send Cooperation Request, Request Sent, In Collaboration, and End Collaboration states"} scrollHint={zh ? "→ 左右滑動查看完整內容" : "→ Scroll to see the full evidence"} />
              </div>
            </EvidenceGroup>
            <EvidenceGroup label={zh ? "訂單管理" : "Order Management"} note={zh ? "在同一營運視圖中整合訂單狀態、銷售來源與待處理操作。" : "Order states, seller source, and required actions are brought together in one operational view."} split="4/8">
              <div>
                <Shot src="/images/case01/evidence/case01-order-list.webp" size={[2048, 1565]} minW="min-w-[48rem]" alt={zh ? "平台訂單管理列表，呈現訂單與付款狀態、Agent／直播主來源與列操作" : "Platform order list showing order and payment states, Agent / Streamer source, and row actions"} scrollHint={zh ? "→ 左右滑動查看 Payment、Source 與操作" : "→ Scroll to see Payment, Source, and Actions"} />
              </div>
            </EvidenceGroup>
            <EvidenceGroup label={zh ? "售後狀態處理" : "After-sales State Handling"} note={zh ? "退貨結果會重新影響庫存與履約狀態，包括重新入庫、報廢、退款與重新出貨。" : "Return outcomes feed back into inventory and fulfillment states, including restock, disposal, refund and reshipment."} split="3/9">
              <div>
                <Shot src="/images/case01/evidence/case01-after-sales-states.webp" size={[1722, 1143]} minW="min-w-[48rem]" alt={zh ? "退貨詳情，呈現退貨商品的 Restock 與 Disposed 狀態，以及退款方式與重新出貨追蹤欄位" : "Return detail showing Restock and Disposed item states, refund type and method, and reshipment tracking"} scrollHint={zh ? "→ 左右滑動查看完整內容" : "→ Scroll to see the full evidence"} />
              </div>
            </EvidenceGroup>
            <EvidenceGroup label={zh ? "消費者結帳狀態" : "Consumer Checkout State"} note={zh ? "當商品在結帳時已無法購買，前台會提示缺貨、將商品數量歸零並停用 Checkout。" : "When an item is unavailable at checkout, the storefront warns the user, sets the quantity to zero, and disables Checkout."} split="4/8">
              <div className="space-y-6">
                <Shot src="/images/case01/evidence/case01-checkout-warning.webp" size={[3510, 748]} minW="min-w-[40rem]" alt={zh ? "結帳確認頁的缺貨警告：所選商品剛剛售完，請先更新購物車" : "Checkout confirmation warning that a selected item just went out of stock and the cart must be updated"} caption={zh ? "缺貨提示" : "Out-of-stock warning"} />
                <Shot src="/images/case01/evidence/case01-checkout-blocked.webp" size={[3510, 1920]} minW="min-w-[40rem]" alt={zh ? "數量歸零的缺貨商品，以及停用的 Checkout 按鈕" : "Out-of-stock item at quantity 0 and the disabled Checkout button"} caption={zh ? "數量歸零與停用的 Checkout" : "Zero quantity and disabled Checkout"} scrollHint={zh ? "→ 左右滑動查看完整內容" : "→ Scroll to see the full evidence"} />
              </div>
            </EvidenceGroup>
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
        media={<CaseOneDemoLinks locale={locale} />}
        mediaFullBleed
      />
    </Section>
  </></EvidenceMotion>;
}
