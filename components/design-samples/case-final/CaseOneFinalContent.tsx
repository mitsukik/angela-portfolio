import Image from "next/image";
import type { ReactNode } from "react";
import type { Locale } from "@/data/locale";
import { EvidenceMotion } from "./EvidenceMotion";
import { FlowEvidence } from "./FlowEvidence";
import { ReadingSection } from "./ReadingSection";

type RegisterSection = (index: number, element: HTMLElement | null) => void;
type EvidenceProps = {
  src: string;
  alt: string;
  caption: string;
  aspect?: string;
  className?: string;
};

function Caption({ children }: { children: ReactNode }) {
  return <figcaption className="cf-figure-caption cf-meta mt-4">{children}</figcaption>;
}

function Evidence({ src, alt, caption, aspect = "aspect-[3/2]", className = "" }: EvidenceProps) {
  return (
    <figure data-evidence-entrance className={className}>
      <div className={`cf-figure-frame relative ${aspect} w-full`}>
        <Image src={src} alt={alt} fill sizes="(max-width: 1024px) 100vw, 1600px" className="object-contain" />
      </div>
      <Caption>{caption}</Caption>
    </figure>
  );
}

function InspectableEvidence({ src, alt, caption, aspect, className = "" }: EvidenceProps & { aspect: string }) {
  return (
    <figure data-evidence-entrance className={`min-w-0 max-w-full ${className}`}>
      <div
        className="cf-figure-frame min-w-0 max-w-full overflow-x-auto"
        tabIndex={0}
        role="group"
        aria-label={alt}
      >
        <div className={`relative ${aspect} min-w-[70rem] lg:min-w-0`}>
          <Image src={src} alt={alt} fill sizes="(max-width: 1023px) 1120px, 1600px" className="object-contain" />
        </div>
      </div>
      <Caption>{caption}</Caption>
    </figure>
  );
}

function TopCropEvidence({ src, alt, caption, aspect = "aspect-[16/10]", className = "" }: EvidenceProps) {
  return (
    <figure data-evidence-entrance className={`min-w-0 max-w-full ${className}`}>
      <div
        className="cf-figure-frame min-w-0 max-w-full overflow-x-auto"
        tabIndex={0}
        role="group"
        aria-label={alt}
      >
        <div className={`relative ${aspect} min-w-[64rem] lg:min-w-0`}>
          <Image src={src} alt={alt} fill sizes="(max-width: 1023px) 1024px, 1600px" className="object-cover object-top" />
        </div>
      </div>
      <Caption>{caption}</Caption>
    </figure>
  );
}

function Section({ index, register, children, divider = true }: { index: number; register: RegisterSection; children: ReactNode; divider?: boolean }) {
  return <div ref={(element) => register(index, element)} className={`cf-section${divider ? " cf-section-divider" : ""}`}>{children}</div>;
}

function EvidenceSection({ label, title, children }: { label: string; title: string; children: ReactNode }) {
  return (
    <section>
      <p className="cf-meta cf-section-label cf-accent whitespace-nowrap">{label}</p>
      {/* Semantic fix only: every numbered section in this case study is a
          top-level sibling under the page's own <h1> (matching CASE02/03/04's
          existing <h2> pattern for the same role) — this was rendering <h3>,
          skipping heading level 2 entirely. The cf-h3 class name is a visual
          size token, not a semantic level — CaseStudyPrototype.tsx already
          uses that exact class on a genuine <h2> elsewhere, so this keeps
          the identical rendered appearance. */}
      <h2 className="cf-heading cf-h3 mt-4 max-w-[70ch]">{title}</h2>
      <div className="mt-10">{children}</div>
    </section>
  );
}

function Sequence({ items }: { items: Array<[string, string]> }) {
  return (
    <ol className="grid border-t cf-rule md:grid-cols-3">
      {items.map(([label, body], index) => (
        <li key={label} className="border-b cf-rule py-6 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0">
          <p className="cf-meta cf-accent">{String(index + 1).padStart(2, "0")} / {label}</p>
          <p className="cf-body body-tc mt-4">{body}</p>
        </li>
      ))}
    </ol>
  );
}

// Section 10 scope summary: reuses Sequence's own divider/label/body
// grammar (top rule, per-cell bottom+right rules, no boxes/shadows) at 4
// columns instead of 3 — a lightweight editorial list, not a feature-card
// grid, deliberately quieter than the Supplier Dashboard it sits under.
// Role/product-area names stay in English in both locales, matching this
// case study's own established convention for domain terms (e.g. "UX/UI",
// "Edge Cases", "Platform / Warehouse" already appear as-is in the ZH
// copy elsewhere on this page) — so there is nothing to translate here,
// and ZH/EN render identically by construction rather than by coincidence.
const SCOPE_SUMMARY_GROUPS: Array<{ label: string; items: string }> = [
  { label: "Platform / Warehouse", items: "Operations · Inventory · Orders · Fulfillment" },
  { label: "Supplier", items: "Dashboard · Product Management · Pricing" },
  { label: "Agent / Streamer", items: "Selection · Collaboration · Sales Workflow" },
  { label: "Consumer", items: "Storefront · Checkout · Order Experience" },
];

function ScopeSummary() {
  return (
    <ul className="grid border-t cf-rule sm:grid-cols-2 lg:grid-cols-4">
      {SCOPE_SUMMARY_GROUPS.map((group) => (
        <li key={group.label} className="border-b cf-rule py-6 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0">
          <p className="cf-meta cf-accent">{group.label}</p>
          <p className="cf-dim mt-3 text-[14px] leading-6">{group.items}</p>
        </li>
      ))}
    </ul>
  );
}

function DecisionMedia({ principle, children }: { principle: string; children: ReactNode }) {
  return <div className="space-y-8">{children}<p className="border-t cf-rule pt-5"><span className="cf-heading text-[clamp(1rem,1.7vw,1.3rem)] font-medium">{principle}</span></p></div>;
}

export function CaseOneFinalContent({ register, locale }: { register: RegisterSection; locale: Locale }) {
  const zhHant = locale === "zh";

  return (
    <EvidenceMotion><>
      <Section index={0} register={register} divider={false}>
        <ReadingSection
          label={zhHant ? "02 — 專案總覽" : "02 — PROJECT OVERVIEW"}
          title={zhHant ? "從台灣商品到越南消費者的跨境銷售平台" : "A Cross-Border Sales Platform Connecting Taiwanese Products with Vietnamese Consumers"}
          paragraphs={[
            zhHant
              ? "以越南市場為核心的跨境寄賣與直播電商平台。台灣供應商將商品運往越南，由當地平台／倉庫點貨入庫，再提供代理商與直播主從共享庫存中選品銷售。消費者透過平台或直播主的商店頁購買，由越南倉庫負責履約與售後。"
              : "A cross-border consignment and live-commerce platform built around the Vietnamese market. Taiwanese Suppliers ship products to Vietnam, where the local Platform / Warehouse receives and verifies them. Agents and Streamers then select products from Shared Inventory to sell, while Consumers purchase through the Platform or a Streamer’s Storefront. The Vietnamese Warehouse handles fulfillment and after-sales support.",
          ]}
          points={zhHant ? ["供貨商", "倉庫／平台", "代理商", "直播主", "消費者"] : ["Supplier", "Warehouse / Platform", "Agent", "Streamer", "Consumer"]}
        />
      </Section>

      <Section index={1} register={register}>
        <EvidenceSection
          label={zhHant ? "03 — 系統 / 生態系" : "03 — SYSTEM / ECOSYSTEM"}
          title={zhHant ? "一套從實體入庫延伸到消費者履約的系統" : "One System, from Physical Receiving to Consumer Fulfillment"}
        >
          <FlowEvidence
            src={zhHant ? "/images/case01/case01_CE_chi01.webp" : "/images/case01/case01_CE_eng01.webp"}
            alt={zhHant ? "跨境直播電商生態系統，呈現供應、銷售與消費端的角色及流程" : "Cross-border live commerce ecosystem diagram, showing the roles and flow across supply, sales, and consumer touchpoints"}
            caption={zhHant ? "FIG. 01 — 跨境直播電商生態系" : "FIG. 01 — Cross-Border Live Commerce Ecosystem"}
          />
          <p className="cf-body body-tc mt-8 max-w-[70ch] border-t cf-rule pt-6">{zhHant ? "供貨商 → 跨境運輸 → 越南倉庫 → 驗收／掃描 → 商品啟用 → 共享庫存 → 代理商／直播主 → 銷售活動／商店頁 → 消費者 → 訂單 → 履約" : "Supplier → Cross-border Shipping → Vietnam Warehouse → Inspect / Scan → Active Product → Shared Inventory → Agent / Streamer → Campaign / Storefront → Consumer → Order → Fulfillment"}</p>
        </EvidenceSection>
      </Section>

      <Section index={2} register={register}>
        <ReadingSection
          label={zhHant ? "04 — 挑戰" : "04 — CHALLENGE"}
          title={zhHant ? "設計的不是單一後台，而是一套彼此相依的商業系統" : "Designing an Interdependent Business System—not a Standalone Backend"}
          paragraphs={[]}
          points={
            zhHant
              ? [
                  "01 多角色協作｜同一套商品、庫存與訂單資料，需要依不同角色提供對應的資訊與操作權限。",
                  "02 實體 × 數位庫存｜線上商品狀態必須反映越南倉庫真正收到與確認的實體商品。",
                  "03 彼此連動的商業規則｜庫存、價格、Campaign、訂單與售後並不是彼此獨立的功能。",
                ]
              : [
                  "01 Multi-role collaboration｜The same Product, Inventory, and Order data must support different information needs and permissions for each role.",
                  "02 Physical × digital Inventory｜Online Product states must reflect the physical goods actually received and verified by the Vietnamese Warehouse.",
                  "03 Interdependent business rules｜Inventory, Pricing, Campaigns, Orders, and after-sales workflows do not operate independently.",
                ]
          }
          supporting={
            zhHant
              ? "如何將跨境實體商品、共享庫存與多角色銷售流程，整合成一套可操作的網頁系統？"
              : "How might we bring cross-border physical goods, Shared Inventory, and multi-role sales workflows into one operable Web System?"
          }
        />
      </Section>

      <Section index={3} register={register}>
        <ReadingSection
          label={zhHant ? "05 — 我的角色" : "05 — MY ROLE"}
          title={zhHant ? "Lead Product Designer · 端到端產品設計" : "Lead Product Designer · End-to-end Product Design"}
          paragraphs={
            zhHant
              ? [
                  "我主導產品從早期需求梳理、產品架構到 UX/UI 設計與開發交付，負責定義跨角色核心流程、系統狀態、互動邏輯與整體介面方向。",
                  "專案初期許多商業流程、權限關係、驗證條件與 Edge Cases 尚未完整定義。我需要將零散需求整理成可執行的產品邏輯，釐清不同角色與系統狀態之間的關係，再與 PM／工程團隊確認技術與商業限制，持續推進至實際開發。",
                ]
              : [
                  "I led the product design from early requirement definition and product architecture through UX/UI design and implementation handoff. I was responsible for defining the core cross-role workflows, system states, interaction logic, and overall interface direction.",
                  "Many business processes, permission relationships, validation rules, and edge cases were still undefined at the beginning of the project. My role involved turning fragmented requirements into actionable product logic, clarifying how different roles and system states interacted, and working closely with PMs and engineers to validate business and technical constraints through implementation.",
                ]
          }
          points={[
            "Product Architecture",
            "Cross-role User Flows",
            "Information Architecture",
            "System & State Design",
            "Interaction Design",
            "UI / Responsive Design",
            "Design System / Reusable Patterns",
            "Developer Handoff & Implementation Review",
          ]}
        />
      </Section>

      <Section index={4} register={register}>
        <ReadingSection
          label={zhHant ? "06 — 關鍵設計決策 01" : "06 — KEY DESIGN DECISION 01"}
          title={zhHant ? "建立多角色協作的產品模型" : "Building a Product Model for Multi-Role Collaboration"}
          paragraphs={
            zhHant
              ? [
                  "Supplier、Platform / Warehouse、Agent、Streamer 與 Consumer 使用同一套 Product / Inventory / Order 資料，但不同角色擁有不同的資訊與操作權限。",
                  "Supplier 可以查看商品表現、庫存與 Streamer 合作狀態；實體庫存的啟用與異動則由越南 Platform / Warehouse 控制，因為商品必須先完成實際驗收。",
                ]
              : [
                  "Supplier, Platform / Warehouse, Agent, Streamer, and Consumer all work with the same Product, Inventory, and Order data, but each role has different responsibilities, permissions, and information needs.",
                  "Suppliers can review product performance, Inventory, and Streamer collaboration status. Product activation and physical Inventory changes remain under the control of the Vietnamese Platform / Warehouse because products must first pass physical verification.",
                ]
          }
          media={<DecisionMedia principle={zhHant ? "共用一套系統，各角色承擔不同責任。" : "Shared system. Role-specific responsibilities."}>
            <TopCropEvidence
              src="/images/case01/evidence/case01-streamer-list.webp"
              alt={zhHant ? "直播主名單，呈現搜尋、直播時段、專長與合作狀態等營運資訊" : "Streamer list showing search, streaming schedule, specialty, and collaboration status"}
              caption={zhHant ? "FIG. 02 — 直播主名單 · 搜尋、狀態與合作脈絡" : "FIG. 02 — Streamer List · Discovery, status, and collaboration context"}
            />
            <TopCropEvidence
              src="/images/case01/evidence/case01-streamer-filter.webp"
              alt={zhHant ? "直播主名單的展開篩選狀態，呈現多條件篩選與名單內容的關係" : "Expanded filter state of the streamer list, showing the relationship between multi-criteria filtering and list content"}
              caption={zhHant ? "FIG. 03 — 展開直播主篩選 · 多條件決策支援" : "FIG. 03 — Expanded Streamer Filter · Multi-filter decision support"}
              className="lg:ml-auto lg:w-4/5"
            />
          </DecisionMedia>}
          mediaFullBleed
        />
      </Section>

      <Section index={5} register={register}>
        <ReadingSection
          label={zhHant ? "07 — 關鍵設計決策 02" : "07 — KEY DESIGN DECISION 02"}
          title={zhHant ? "連結實體庫存與數位商品狀態" : "Connecting Physical Inventory with Digital Product States"}
          paragraphs={[
            zhHant
              ? "商品經實際到貨、倉庫驗收與掃描後，才會成為啟用狀態並進入共享庫存。系統也需要表達有庫存、低庫存、售罄、超賣、預購、預計到貨與補貨等狀態。"
              : "Products enter Shared Inventory as Active only after arriving in Vietnam and completing Warehouse inspection and Scan. The system must also communicate In Stock, Low Stock, Sold Out, Oversold, Pre-order, Expected Arrival, and Restock states.",
          ]}
          media={<DecisionMedia principle={zhHant ? "庫存不只是一個數字，而是持續變動的系統狀態。" : "Inventory is not just a number—it is a changing system state."}>
            <FlowEvidence
              src={zhHant ? "/images/case01/case01_ISF_chi01.webp" : "/images/case01/case01_ISF_eng01.webp"}
              alt={zhHant ? "庫存狀態流程，呈現實體到貨、驗收、數位庫存與消費端影響" : "Inventory status flow, showing physical arrival, inspection, digital inventory, and consumer-facing impact"}
              caption={zhHant ? "FIG. 04 — 庫存狀態流程" : "FIG. 04 — Inventory Status Flow"}
            />
            <Evidence
              src="/images/case01/case01_inventory_showcase_sample.webp"
              alt={zhHant ? "共享庫存後台介面，包含商品列表、庫存狀態與篩選" : "Shared inventory backend interface, including product list, inventory status, and filters"}
              caption={zhHant ? "FIG. 05 — 共享庫存介面" : "FIG. 05 — Shared Inventory UI"}
            />
          </DecisionMedia>}
          mediaFullBleed
        />
      </Section>

      <Section index={6} register={register}>
        <ReadingSection
          label={zhHant ? "08 — 關鍵設計決策 03" : "08 — KEY DESIGN DECISION 03"}
          title={zhHant ? "在彈性定價與商業規則之間取得平衡" : "Balancing Pricing Flexibility with Business Rules"}
          paragraphs={[
            zhHant
              ? "直播主可以自行選擇銷售價格，但售價必須符合系統設定的建議售價（SRP）與價格區間限制。介面需要同時提供彈性、限制與即時驗證。"
              : "Streamers can set their own selling prices, but the Selling Price must comply with the system-defined Suggested Retail Price (SRP) and price-range constraints. The interface must communicate flexibility, constraints, and validation in real time.",
          ]}
          media={<DecisionMedia principle={zhHant ? "在不破壞商業模式的前提下，保留使用彈性。" : "Give users flexibility without breaking the business model."}>
            <Evidence
              src={zhHant ? "/images/case01/case01_PRL_chi01.webp" : "/images/case01/case01_PRL_eng01.webp"}
              alt={zhHant ? "已移除敏感參數的定價與收益邏輯圖" : "Pricing and revenue logic diagram with sensitive parameters removed"}
              caption={zhHant ? "FIG. 06 — 定價與收益邏輯 · 已移除敏感資訊" : "FIG. 06 — Pricing & Revenue Logic · Sanitized"}
            />
            <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-8">
              <InspectableEvidence
                src="/images/case01/evidence/case01-pricing-detail.webp"
                alt={zhHant ? "商品定價頁面，顯示 Unit Cost、Suggested Retail Price、Estimated Profit 與已移除敏感數值的定價調整紀錄" : "Product pricing page showing Unit Cost, Suggested Retail Price, Estimated Profit, and a pricing adjustment record with sensitive values removed"}
                caption={zhHant ? "FIG. 06a — 商品定價 · 單位成本、SRP、預估利潤與調價紀錄" : "FIG. 06a — Product Pricing · Unit Cost, SRP, Estimated Profit, and Pricing Adjustment Record"}
                aspect="aspect-[2600/2313]"
                className="lg:col-span-8"
              />
              <Evidence
                src="/images/case01/evidence/case01-pricing-invalid-state.webp"
                alt={zhHant ? "定價試算結果，呈現利潤池為負時方案不可用的即時驗證警示，已移除敏感參數與數值" : "Pricing calculation result showing a real-time validation warning when the profit margin is negative, with sensitive parameters and values removed"}
                caption={zhHant ? "FIG. 06b — 定價驗證 · 無效狀態，已移除敏感資訊" : "FIG. 06b — Pricing Validation · Invalid state, sanitized"}
                aspect="aspect-[1600/2666]"
                className="mt-8 lg:col-span-4 lg:mt-0"
              />
            </div>
          </DecisionMedia>}
          mediaFullBleed
        />
      </Section>

      <Section index={7} register={register}>
        <ReadingSection
          label={zhHant ? "09 — 關鍵設計決策 04" : "09 — KEY DESIGN DECISION 04"}
          title={zhHant ? "設計順利流程之外的系統狀態" : "Designing System States Beyond the Happy Path"}
          paragraphs={[
            zhHant
              ? "當消費者結帳過程中的共享庫存發生變化，介面必須說明發生了什麼、為什麼不能繼續，以及使用者下一步可以做什麼。"
              : "When Shared Inventory changes during Consumer Checkout, the interface must explain what happened, why the user cannot continue, and what they can do next.",
          ]}
          media={<DecisionMedia principle={zhHant ? "後台／系統狀態 → 消費者端影響" : "Backend / system state → consumer impact."}>
            <Evidence
              src={zhHant ? "/images/case01/case01_BE_chi01.webp" : "/images/case01/case01_BE_eng01.webp"}
              alt={zhHant ? "後台庫存狀態如何影響消費者結帳流程" : "How backend inventory state affects the consumer checkout flow"}
              caption={zhHant ? "FIG. 07 — 後台狀態如何影響消費者體驗" : "FIG. 07 — How Backend State Impacts the Consumer Experience"}
            />
            <Sequence
              items={
                zhHant
                  ? [
                      ["發生了什麼？", "商品庫存已在結帳過程中改變。"],
                      ["為什麼不能繼續？", "目前訂單內容已不再有效。"],
                      ["下一步怎麼做？", "更新購物車後重新確認可購買商品。"],
                    ]
                  : [
                      ["What happened?", "Product availability changed during Checkout."],
                      ["Why can’t I continue?", "The current Order is no longer valid."],
                      ["What can I do next?", "Update the Cart and confirm the available products before continuing."],
                    ]
              }
            />
            <InspectableEvidence
              src="/images/case01/evidence/case01-order-list.webp"
              alt={zhHant ? "平台訂單管理列表，呈現搜尋、篩選、訂單與付款狀態、配送方式、來源、日期及列操作" : "Platform order management list, showing search, filters, order and payment status, shipping method, source, date, and row actions"}
              caption={zhHant ? "FIG. 08 — 訂單管理 · 搜尋、篩選、狀態與列操作" : "FIG. 08 — Order Management · Search, filters, states, and row actions"}
              aspect="aspect-[2048/1565]"
            />
          </DecisionMedia>}
          mediaFullBleed
        />
      </Section>

      <Section index={8} register={register}>
        <EvidenceSection
          label={zhHant ? "10 — 跨角色產品介面" : "10 — CROSS-ROLE EXPERIENCE"}
          title={zhHant ? "從營運到銷售的一體化產品體驗" : "One Ecosystem, from Operations to Sales"}
        >
          {/* Section 10 revision: previously repeated Order Management and
              Expanded Streamer Filter verbatim from Sections 09/06, then a
              second pass reused the Section 03 ecosystem diagram as a
              "bookend" — still a repeated visual. The full asset library
              has no unused Platform/Warehouse, Consumer, or Agent-specific
              screenshot (verified: every real CASE01 image file is already
              placed somewhere in this case study), so rather than force a
              multi-image gallery, this keeps only the one genuinely
              unique, unused image (Supplier Dashboard) as the section's
              visual focus, paired with a lightweight text summary of scope
              — not another screenshot — to communicate ecosystem breadth
              without repeating imagery or re-explaining what Section 03
              already covers. */}
          <div className="space-y-10">
            <div className="lg:grid lg:grid-cols-12">
              <InspectableEvidence
                src="/images/case01/evidence/case01-supplier-dashboard.webp"
                alt={zhHant ? "供貨商營運儀表板，呈現收益、訂單、庫存提醒、餘額、商品、圖表與通知" : "Supplier operations dashboard showing revenue, orders, inventory alerts, balance, products, charts, and notifications"}
                caption={zhHant ? "供貨商 — 儀表板層級與營運重點" : "SUPPLIER — Dashboard hierarchy and operational priorities"}
                aspect="aspect-[1900/1700]"
                className="lg:col-span-8"
              />
            </div>
            <ScopeSummary />
          </div>
        </EvidenceSection>
      </Section>

      <Section index={9} register={register}>
        <ReadingSection
          label={zhHant ? "11 — 交付成果" : "11 — DELIVERY OUTCOME"}
          title={zhHant ? "從模糊需求到可開發的完整產品系統" : "From Ambiguous Requirements to an Implementation-Ready Product System"}
          paragraphs={
            zhHant
              ? [
                  "完成 Platform / Warehouse、Supplier、Agent 與 Consumer Web Storefront 的核心產品設計，涵蓋產品架構、主要使用流程、系統狀態與跨角色介面，並與工程團隊協作完成主要功能的開發落地。",
                  "產品後續因公司商業策略調整，未正式進入商業營運，因此本案例聚焦於產品架構、系統設計與開發交付成果。",
                ]
              : [
                  "Delivered the core product experience across Platform / Warehouse, Supplier, Agent, and Consumer Web Storefront, covering product architecture, key workflows, system states, and cross-role interfaces. Worked closely with the engineering team to bring the primary product flows into implementation.",
                  "The product did not proceed to commercial launch following a shift in business strategy. This case therefore focuses on product architecture, system design, and implementation delivery rather than post-launch metrics.",
                ]
          }
        />
      </Section>

      <Section index={10} register={register}>
        <ReadingSection
          label={zhHant ? "12 — 學習與反思" : "12 — LEARNINGS"}
          title={zhHant ? "複雜系統設計的核心，是讓關係變得可以理解" : "The Core of Complex-System Design Is Making Relationships Understandable"}
          paragraphs={[
            zhHant
              ? "在進入畫面設計之前，我會先確認角色、系統狀態、商業規則，以及每個操作會如何影響其他角色與流程。"
              : "Before moving into interface design, I first clarify the roles involved, the current system state, the applicable Business Rules, and how each action affects other roles and workflows.",
          ]}
          supporting={
            zhHant
              ? "好的複雜系統設計，不是隱藏複雜性，而是讓使用者清楚知道自己在哪裡、能做什麼，以及接下來會發生什麼。"
              : "Good complex-system design does not hide complexity. It helps users understand where they are, what they can do, and what will happen next."
          }
        />
      </Section>
    </></EvidenceMotion>
  );
}
