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

function DecisionBlock({ label, title, body, principle, children }: { label: string; title: string; body: string; principle: string; children: ReactNode }) {
  return <article className="border-t cf-rule pt-8">
    <div className="max-w-[70ch]"><p className="cf-meta cf-accent">{label}</p><h3 className="cf-heading mt-3 text-[clamp(1.35rem,2.4vw,2rem)] font-medium">{title}</h3><p className="cf-body body-tc mt-4">{body}</p></div>
    <div className="mt-8 space-y-8">{children}</div>
    <p className="mt-8 border-t cf-rule pt-5"><span className="cf-heading text-[clamp(1rem,1.7vw,1.3rem)] font-medium">{principle}</span></p>
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

export function CaseOneFinalContent({ register, locale }: { register: RegisterSection; locale: Locale }) {
  const zh = locale === "zh";
  return <EvidenceMotion><>
    <Section index={0} register={register} divider={false}>
      <ReadingSection
        label={zh ? "01 — 專案背景與我的角色" : "01 — PROJECT BACKGROUND & MY ROLE"}
        title={zh ? "把零散需求整理成可開發的多角色產品系統" : "Turning Fragmented Requirements into a Buildable Multi-role Product System"}
        paragraphs={zh ? [
          "這不是單一後台，而是一套串連台灣供應商、越南平台／倉庫、代理公司、直播主與消費者的跨境商業系統。商品、庫存、價格、訂單與售後彼此連動，也需要依角色提供不同權限與資訊。",
          "我擔任 Lead Product Designer，主導 Product Architecture、Information Architecture、UX Flow、Interaction Design、State Design、Business Rules 定義與 Developer Handoff，並直接與 2 位工程師協作。後台系統的 UI Design 在既有 UI template 與元件架構下進行；Consumer Web Storefront 則另外進行前台體驗與介面設計。PM 後期加入，主要支援 QA 與協調。",
          "後台開發端採用既有 UI template 與元件架構，因此後台設計的重點不是建立高度客製化的視覺系統，而是定義產品架構、操作流程、資訊層級、System States、Validation 與 Edge Cases，並透過 Figma 提供工程團隊可直接理解並用於實作的 UX/UI specification。",
          "我親自設計 Platform Backend、Supplier Backend、Agent Backend 與 Consumer Web Storefront；另一位 UI Designer 後續沿用既有架構、Interaction Patterns 與設計方向，延伸 Consumer Mobile 與 Streamer Backend。",
        ] : [
          "This wasn't a single admin backend — it was a cross-border commerce system connecting Taiwan Suppliers, a Vietnam Platform / Warehouse, Agents, Streamers, and Consumers. Products, inventory, pricing, orders, and after-sales were all interdependent, with role-specific permissions and information needs.",
          "As Lead Product Designer, I led the product architecture, information architecture, UX flows, interaction design, state design, business rules, and developer handoff, working directly with two engineers. UI design for the backend systems followed an existing UI template and component framework; the Consumer Web Storefront was designed separately as a consumer-facing UX/UI experience. The PM joined later, mainly supporting QA and coordination.",
          "Because the backend ran on an existing UI template and component framework, the design effort focused on product structure, workflows, information hierarchy, system states, validation, and edge cases — and on delivering implementation-ready UX/UI specifications in Figma — rather than a bespoke visual system.",
          "I personally designed the Platform, Supplier, and Agent backends, as well as the Consumer Web Storefront. Another UI Designer later extended the established architecture, interaction patterns, and design direction to the Consumer Mobile experience and Streamer Backend.",
        ]}
        points={["Product Architecture", "System & State Design", "Multi-role Workflows", "Responsive Web", "Engineer Collaboration"]}
        supporting={zh ? "核心挑戰：如何把跨境實體商品、共享庫存與多角色銷售流程，整合成一套清楚、可操作的網頁系統？" : "Core challenge: How might we bring cross-border physical goods, shared inventory, and multi-role sales workflows into one clear, operable web system?"}
        composition="background-role"
      />
    </Section>

    <Section index={1} register={register}>
      <EvidenceHeading label={zh ? "02 — 跨境商業流程" : "02 — CROSS-BORDER COMMERCE WORKFLOW"} title={zh ? "從台灣供貨到越南履約，先釐清完整商業鏈" : "Mapping the Full Business Chain, from Taiwan Suppliers to Vietnam Fulfillment"}>
        <FlowEvidence src={zh ? "/images/case01/case01_CE_chi01.webp" : "/images/case01/case01_CE_eng01.webp"} alt={zh ? "跨境直播電商生態系統，呈現供應、銷售與消費端的角色及流程" : "Cross-border live commerce ecosystem diagram showing the roles and flow across supply, sales, and consumer touchpoints"} caption={zh ? "FIG. 01 — 跨境直播電商生態系" : "FIG. 01 — Cross-border Live Commerce Ecosystem"} scrollHint={zh ? "→ 左右滑動查看完整流程圖" : "→ Scroll to see the full diagram"} />
        <p data-evidence-entrance className="cf-body body-tc mt-8 max-w-[70ch] border-t cf-rule pt-6">{zh ? "供應商 → 跨境運輸 → 越南倉庫 → 驗收／掃描 → 商品啟用 → 共享庫存 → 代理公司／直播主 → 銷售活動／商店頁 → 消費者 → 訂單 → 履約" : "Supplier → Cross-border Shipment → Vietnam Warehouse → Receive / Count / Scan → Active Product → Shared Inventory → Agent / Streamer → Campaign / Storefront → Consumer → Order → Fulfillment"}</p>
      </EvidenceHeading>
    </Section>

    <Section index={2} register={register}>
      <EvidenceHeading label={zh ? "03 — 系統架構與關鍵狀態" : "03 — SYSTEM ARCHITECTURE & KEY STATES"} title={zh ? "用共享資料模型，連結角色權限、實體庫存與數位狀態" : "Connecting Role Permissions, Physical Inventory, and Digital States through a Shared Data Model"}>
        <div className="space-y-12">
          <div data-evidence-entrance className="max-w-[70ch] space-y-4"><p className="cf-body body-tc">{zh ? "所有角色共用 Product / Inventory / Order 資料，但責任與操作權限不同。Supplier 可查看商品表現、庫存與合作狀態；商品啟用與實體庫存異動則由越南 Platform / Warehouse 控制。" : "Every role uses the same product, inventory, and order data, but with different responsibilities and permissions. Suppliers can review performance, inventory, and collaboration status, while the Vietnam Platform / Warehouse controls activation and physical inventory changes."}</p><p className="cf-body body-tc">{zh ? "商品只有在實際到貨、驗收與掃描後，才會進入共享庫存。系統也要表達有庫存、低庫存、售罄、超賣、預購、預計到貨與補貨等狀態。" : "Products enter shared inventory only after physical arrival, inspection, and scanning. The system also communicates In Stock, Low Stock, Sold Out, Oversold, Pre-order, Expected Arrival, and Restock states."}</p></div>
          <FlowEvidence src={zh ? "/images/case01/case01_ISF_chi01.webp" : "/images/case01/case01_ISF_eng01.webp"} alt={zh ? "庫存狀態流程，呈現實體到貨、驗收、數位庫存與消費端影響" : "Inventory status flow showing physical arrival, inspection, digital inventory, and consumer-facing impact"} caption={zh ? "FIG. 02 — 實體入庫與數位庫存狀態" : "FIG. 02 — Physical Receiving and Digital Inventory States"} scrollHint={zh ? "→ 左右滑動查看完整流程圖" : "→ Scroll to see the full diagram"} />
        </div>
      </EvidenceHeading>
    </Section>

    <Section index={3} register={register}>
      <EvidenceHeading label={zh ? "04 — 核心 UX 決策與介面證據" : "04 — CORE UX DECISIONS & INTERFACE EVIDENCE"} title={zh ? "讓營運資訊、角色協作與定價規則直接可操作" : "Making Operational Data, Collaboration, and Pricing Rules Actionable"}>
        <div className="space-y-16">
          <DecisionBlock label="04A — MULTI-ROLE COLLABORATION" title={zh ? "多角色協作" : "Multi-role Collaboration"} body={zh ? "直播主名單不是單純資料表；搜尋、直播時段、專長、合作狀態與多條件篩選共同支援 Supplier 與營運端找到合適合作對象。" : "The Streamer list is more than a data table. Search and filters for schedule, specialty, and collaboration status help Suppliers and operators identify suitable partners."} principle="Shared data, role-specific actions.">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
              <TopCropEvidence src="/images/case01/evidence/case01-streamer-list.webp" alt={zh ? "直播主名單與合作狀態" : "Streamer list and collaboration status"} caption={zh ? "CONTEXT — 直播主名單 · 搜尋、狀態與合作脈絡" : "CONTEXT — Streamer List · Discovery, Status, and Collaboration"} className="lg:col-span-8" />
              <TopCropEvidence src="/images/case01/evidence/case01-streamer-filter.webp" alt={zh ? "直播主名單的展開篩選狀態" : "Expanded streamer filters"} caption={zh ? "DETAIL — 多條件篩選與合作狀態" : "DETAIL — Multi-filter Controls and Collaboration State"} aspect="aspect-[4/5]" className="lg:col-span-4 lg:mt-12" />
            </div>
          </DecisionBlock>
          <DecisionBlock label="04B — PHYSICAL INVENTORY × DIGITAL COMMERCE" title={zh ? "實體庫存 × 數位商務" : "Physical Inventory × Digital Commerce"} body={zh ? "Inventory Management 呈現目前可操作的庫存狀態；Inventory Log 則記錄每次異動、Changed By、Role 與 Timestamp，讓實體庫存與數位商品狀態保持可追蹤。" : "Inventory Management makes the current stock state clear. The Inventory Log records every change with Changed By, Role, and Timestamp, keeping physical inventory and digital product states traceable."} principle={zh ? "目前狀態必須清楚，每次異動也必須可追溯。" : "The current state must be clear, and every change must remain traceable."}>
            <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
              <Evidence src="/images/case01/case01_inventory_showcase_sample.webp" alt={zh ? "庫存管理後台介面，包含商品列表、庫存狀態與篩選" : "Inventory management interface including product list, inventory status, and filters"} caption={zh ? "OPERATIONAL EVIDENCE — Inventory Management · 目前庫存狀態" : "OPERATIONAL EVIDENCE — Inventory Management · Current State"} className="lg:col-span-7" />
              <InspectableEvidence src="/images/case01/evidence/case01-inventory-log-focused.png" alt={zh ? "商品庫存異動紀錄，呈現狀態、操作者、角色、異動內容與時間" : "Product Inventory Log showing status, Changed By, Role, change details, and Timestamp"} caption={zh ? "SYSTEM STATE — Product Inventory Log · 異動歷史與可追蹤性" : "SYSTEM STATE — Product Inventory Log · Traceability"} aspect="aspect-[2500/920]" className="lg:col-span-5 lg:mt-10" scrollHint={zh ? "→ 左右滑動查看 Role 與 Timestamp" : "→ Scroll to see Role and Timestamp"} />
            </div>
          </DecisionBlock>
          <DecisionBlock label="04C — FLEXIBLE PRICING × BUSINESS RULES" title={zh ? "彈性定價 × 商業規則" : "Flexible Pricing × Business Rules"} body={zh ? "直播主可自行設定售價，但售價不得低於供應商設定的最低售價（可等於最低售價），且須符合價格區間與獲利限制。介面把成本、SRP、預估利潤、調價紀錄與即時驗證放在同一決策脈絡中。" : "Streamers can set their own selling price, but it cannot fall below the Supplier-defined minimum. Matching the minimum is allowed, and the price must also stay within the configured range and profitability constraints. The interface brings cost, SRP, Estimated Profit, pricing history, and real-time validation into a single decision context."} principle={zh ? "在不破壞商業模式的前提下，保留使用彈性。" : "Give users flexibility without breaking the business model."}>
            <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-8"><InspectableEvidence src="/images/case01/evidence/case01-pricing-detail.webp" alt={zh ? "商品定價頁面" : "Product pricing page"} caption={zh ? "OPERATIONAL EVIDENCE — 商品定價 · 成本、SRP、預估利潤與調價紀錄" : "OPERATIONAL EVIDENCE — Product Pricing · Decision Context"} aspect="aspect-[2600/2313]" className="lg:col-span-8" scrollHint={zh ? "→ 左右滑動查看完整內容" : "→ Scroll to see the full evidence"} /><Evidence src="/images/case01/evidence/case01-pricing-invalid-state.webp" alt={zh ? "定價試算的無效狀態" : "Invalid pricing calculation state"} caption={zh ? "VALIDATION — 即時定價驗證 · 已移除敏感資訊" : "VALIDATION — Real-time Pricing Validation · Sanitized"} aspect="aspect-[1600/2666]" className="mt-8 lg:col-span-4 lg:mt-0" /></div>
            <Evidence src={zh ? "/images/case01/case01_PRL_chi01.webp" : "/images/case01/case01_PRL_eng01.webp"} alt={zh ? "已移除敏感參數的定價與收益邏輯圖" : "Sanitized pricing and revenue logic diagram"} caption={zh ? "CONTEXT — 定價與收益邏輯 · 已移除敏感資訊" : "CONTEXT — Pricing & Revenue Logic · Sanitized"} className="lg:w-2/3" />
          </DecisionBlock>
          <DecisionBlock label="04D — DATA-HEAVY OPERATIONAL WORKFLOW" title={zh ? "資料密集的營運流程" : "Data-heavy Operational Workflow"} body={zh ? "Search、Filter、Status View、Payment、Shipping、Source 與 Row Actions 共同把高密度訂單表格轉化為可執行的營運工作流程。" : "Search, filters, status, payment, shipping, source, and row-level actions turn a dense order table into an operational workflow."} principle={zh ? "高密度資料必須直接支持判斷與操作。" : "Dense data must directly support decisions and actions."}>
            <ScrollSkipEvidence src="/images/case01/evidence/case01-order-list.webp" alt={zh ? "平台訂單管理列表" : "Platform order management list"} caption={zh ? "OPERATIONAL EVIDENCE — Order List · 搜尋、篩選、狀態與列操作" : "OPERATIONAL EVIDENCE — Order List · Search, Filters, States, and Actions"} aspect="aspect-[2048/1565]" initialScrollPx={165} scrollHint={zh ? "→ 左右滑動查看 Payment、Shipping、Source 與操作" : "→ Scroll to see Payment, Shipping, Source, and Actions"} />
            <ScrollSkipEvidence src="/images/case01/evidence/case01-supplier-dashboard.webp" alt={zh ? "供應商營運儀表板" : "Supplier operations dashboard"} caption={zh ? "CONTEXT — Supplier Dashboard · 次要營運總覽" : "CONTEXT — Supplier Dashboard · Management Overview"} aspect="aspect-[1900/1700]" className="lg:ml-auto lg:w-2/3" initialScrollPx={160} scrollHint={zh ? "→ 左右滑動查看完整內容" : "→ Scroll to see the full evidence"} />
          </DecisionBlock>
        </div>
      </EvidenceHeading>
    </Section>

    <Section index={4} register={register}>
      <EvidenceHeading label={zh ? "05 — 跨端狀態與例外處理" : "05 — CROSS-TOUCHPOINT STATES & EXCEPTION HANDLING"} title={zh ? "把後台狀態轉譯成消費者可理解、可恢復的下一步" : "Turning Backend State Changes into Clear Recovery Paths for Consumers"}>
        <div className="space-y-10">
          <p className="cf-body body-tc max-w-[70ch]">{zh ? "共享庫存可能在消費者結帳期間改變。介面必須同步後台與前台狀態，說明發生了什麼、為什麼不能繼續，以及下一步可以做什麼；退換貨也必須把數量、處理方式與後續訂單／庫存狀態連結起來。" : "Shared inventory can change while a consumer is checking out. The experience must synchronize backend and storefront states, explain what happened, why the user cannot continue, and what they can do next. Returns and exchanges must also connect quantity validation, case resolution, and the resulting order and inventory states."}</p>
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
      </EvidenceHeading>
    </Section>

    <Section index={5} register={register}>
      <ReadingSection
        label={zh ? "06 — 結果與收穫" : "06 — RESULTS & TAKEAWAYS"}
        title={zh ? "完成可開發的系統，並讓複雜關係變得可理解" : "Delivering a Buildable System and Making Complex Relationships Understandable"}
        paragraphs={zh ? [
          "完成 Platform Backend、Supplier Backend、Agent Backend 與 Consumer Web Storefront 的核心設計，涵蓋產品架構、主要流程、系統狀態、Responsive Web 與跨角色介面，並與工程團隊完成主要功能開發。",
          "產品已完成設計與開發，但公司後續調整商業策略，因此未正式進入商業營運。本案例不主張上線後 KPI，而以真實的產品架構、設計決策與開發成果為證據。",
          "這個專案的核心設計挑戰，不是替後台系統建立一套高度客製化的視覺介面，而是將模糊的跨境商業需求轉化為工程可以理解、使用者可以操作的產品架構、Workflow、System States 與 Business Rules。",
          "最大的收穫是：複雜系統設計不是隱藏複雜性，而是先釐清角色、規則、狀態與連動關係，再讓每個使用者知道自己在哪裡、能做什麼，以及接下來會發生什麼。",
        ] : [
          "Delivered the core design for the Platform Backend, Supplier Backend, Agent Backend, and Consumer Web Storefront, covering product architecture, key workflows, system states, Responsive Web, and cross-role interfaces. I worked directly with engineering through handoff and implementation of the primary product flows.",
          "The product was fully designed and developed, but did not formally enter commercial operation after the company changed its business strategy. This case therefore makes no post-launch KPI claims and focuses on real product architecture, design decisions, and implementation evidence.",
          "The core design challenge wasn't creating a highly customized visual interface for the backend — it was turning ambiguous, cross-border business requirements into a product architecture, workflows, system states, and business rules that engineering could implement and users could operate effectively.",
          "My key takeaway: complex-system design is not about hiding complexity. It begins by clarifying roles, rules, states, and dependencies, then helping each user understand where they are, what they can do, and what will happen next.",
        ]}
        media={<ScopeSummary />}
        mediaFullBleed
      />
    </Section>
  </></EvidenceMotion>;
}
