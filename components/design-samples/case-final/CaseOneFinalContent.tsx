import Image from "next/image";
import type { ReactNode } from "react";
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

function Slot({ reference, purpose, aspect = "aspect-[3/2]" }: { reference: string; purpose: string; aspect?: string }) {
  return (
    <figure>
      <div className={`cf-figure-frame ${aspect} flex w-full items-center justify-center px-6 text-center`}>
        <div className="max-w-[36rem]">
          <p className="cf-meta cf-accent">REAL UI EVIDENCE NEEDED</p>
          <p className="cf-heading mt-4 text-[clamp(1.15rem,2vw,1.65rem)]">{purpose}</p>
          <p className="cf-dim mt-3 font-mono text-[14px] leading-6">{reference}</p>
        </div>
      </div>
    </figure>
  );
}

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
      <div className="cf-figure-frame min-w-0 max-w-full overflow-x-auto">
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
      <div className="cf-figure-frame min-w-0 max-w-full overflow-x-auto">
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
      <h3 className="cf-heading cf-h3 mt-4 max-w-[70ch]">{title}</h3>
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
          <p className="cf-body body-tc mt-4 text-[16px] leading-[1.7]">{body}</p>
        </li>
      ))}
    </ol>
  );
}

function DecisionMedia({ principle, children }: { principle: string; children: ReactNode }) {
  return <div className="space-y-8">{children}<p className="border-t cf-rule pt-5"><span className="cf-heading text-[clamp(1rem,1.7vw,1.3rem)] font-medium">{principle}</span></p></div>;
}

export function CaseOneFinalContent({ register }: { register: RegisterSection }) {
  return (
    <EvidenceMotion><>
      <Section index={0} register={register} divider={false}>
        <ReadingSection label="02 — PROJECT OVERVIEW" title="從台灣商品到越南消費者的跨境銷售平台" paragraphs={["以越南市場為核心的跨境寄賣與直播電商平台。台灣供應商將商品運往越南，由當地平台／倉庫點貨入庫，再提供 Agent 與 Streamer 從共享庫存選品銷售。消費者透過平台或直播主 Storefront 購買，由越南倉庫負責履約與售後。"]} points={["Supplier", "Warehouse / Platform", "Agent", "Streamer", "Consumer"]} />
      </Section>

      <Section index={1} register={register}>
        <EvidenceSection label="03 — SYSTEM / ECOSYSTEM" title="一套從實體入庫延伸到消費者履約的系統">
          <FlowEvidence src="/images/case01/case01_CE_chi01.png" alt="跨境直播電商生態系統，呈現供應、銷售與消費端的角色及流程" caption="FIG. 01 — Cross-border Live Commerce Ecosystem" />
          <p className="cf-body body-tc mt-8 max-w-[70ch] border-t cf-rule pt-6">Supplier → Cross-border Shipping → Vietnam Warehouse → Inspect / Scan → Active Product → Shared Inventory → Agent / Streamer → Campaign / Storefront → Consumer → Order → Fulfillment</p>
        </EvidenceSection>
      </Section>

      <Section index={2} register={register}>
        <ReadingSection label="04 — CHALLENGE" title="設計的不是單一後台，而是一套彼此相依的商業系統" paragraphs={[]} points={["01 多角色協作｜同一份商業資料，需要依角色提供不同的資訊與操作權限。", "02 實體 × 數位庫存｜線上商品狀態必須反映越南倉庫真正收到與確認的實體商品。", "03 彼此連動的商業規則｜庫存、價格、Campaign、訂單與售後並不是彼此獨立的功能。"]} supporting="如何將跨境實體商品、共享庫存與多角色銷售流程，整合成一套可操作的 Web System？" />
      </Section>

      <Section index={3} register={register}>
        <ReadingSection label="05 — MY ROLE" title="Lead Product Designer" paragraphs={["我主導產品從早期需求梳理到開發落地的 UX/UI Design，負責建立整體 Product Architecture、核心 Workflow、Interaction 與設計方向。", "專案初期許多實際流程、System States、Validation 與 Edge Cases 尚未完整定義，因此我的工作不只是把需求畫成畫面，而是需要補足產品操作邏輯，再與工程團隊確認並落實。"]} points={["Product Architecture", "System Thinking", "UX Flow", "Interaction Design", "State Design", "UI Design", "Developer Handoff"]} />
      </Section>

      <Section index={4} register={register}>
        <ReadingSection
          label="06 — KEY DESIGN DECISION 01"
          title="建立多角色協作的產品模型"
          paragraphs={["Supplier、Platform / Warehouse、Agent、Streamer 與 Consumer 使用同一套 Product / Inventory / Order data，但不同角色擁有不同的資訊與操作權限。", "Supplier 可以查看商品表現、庫存與 Streamer 合作狀態；實體庫存的啟用與異動則由越南 Platform / Warehouse 控制，因為商品必須先完成實際驗收。"]}
          media={<DecisionMedia principle="Shared system. Role-specific responsibilities.">
            <TopCropEvidence src="/images/case01/evidence/case01-streamer-list.png" alt="直播主名單，呈現搜尋、直播時段、專長與合作狀態等營運資訊" caption="FIG. 02 — Streamer List · Discovery, status and collaboration context" />
            <TopCropEvidence src="/images/case01/evidence/case01-streamer-filter.png" alt="直播主名單的展開篩選狀態，呈現多條件篩選與名單內容的關係" caption="FIG. 03 — Expanded Streamer Filter · Multi-filter decision support" className="lg:ml-auto lg:w-4/5" />
          </DecisionMedia>}
          mediaFullBleed
        />
      </Section>

      <Section index={5} register={register}>
        <ReadingSection
          label="07 — KEY DESIGN DECISION 02"
          title="連結實體庫存與數位商品狀態"
          paragraphs={["商品經實際到貨、倉庫驗收與 Scan 後才成為 Active，並進入 Shared Inventory。系統也需要表達 In Stock、Low Stock、Sold Out、Oversold、Pre-order、Expected Arrival 與 Restock。"]}
          media={<DecisionMedia principle="Inventory is not just a number — it is a changing system state.">
            <FlowEvidence src="/images/case01/case01_ISF_chi01.png" alt="庫存狀態流程，呈現實體到貨、驗收、數位庫存與消費端影響" caption="FIG. 04 — Inventory Status Flow" />
            <Evidence src="/images/case01/case01_inventory_showcase_sample.png" alt="共享庫存後台介面，包含商品列表、庫存狀態與篩選" caption="FIG. 05 — Shared Inventory UI" />
          </DecisionMedia>}
          mediaFullBleed
        />
      </Section>

      <Section index={6} register={register}>
        <ReadingSection
          label="08 — KEY DESIGN DECISION 03"
          title="在彈性定價與商業規則之間取得平衡"
          paragraphs={["Streamer 可以自行選擇銷售價格，但 Selling Price 必須大於或等於系統設定的 Suggested / Minimum Price。介面需要同時提供彈性、限制與即時驗證。"]}
          media={<DecisionMedia principle="Give users flexibility without breaking the business model.">
            <Evidence src="/images/case01/case01_PRL_chi01.png" alt="已移除敏感參數的定價與收益邏輯圖" caption="FIG. 06 — Pricing & Revenue Logic · Sanitized" />
            <Slot reference="Pricing UI · sanitized crop required" purpose="Real UI — selling price constraint and validation" aspect="aspect-[16/9]" />
          </DecisionMedia>}
          mediaFullBleed
        />
      </Section>

      <Section index={7} register={register}>
        <ReadingSection
          label="09 — KEY DESIGN DECISION 04"
          title="設計 Happy Path 之外的系統狀態"
          paragraphs={["當共享庫存在 Consumer Checkout 過程中改變，介面必須說明發生了什麼、為什麼不能繼續，以及使用者下一步可以做什麼。"]}
          media={<DecisionMedia principle="Backend / system state → consumer impact.">
            <Evidence src="/images/case01/case01_BE_chi01.png" alt="後台庫存狀態如何影響消費者結帳流程" caption="FIG. 07 — How Backend State Impacts the Consumer Experience" />
            <Sequence items={[["What happened?", "商品庫存已在 Checkout 過程中改變。"], ["Why can’t I continue?", "目前訂單內容已不再有效。"], ["What next?", "更新 Cart 後重新確認可購買商品。"]]} />
            <TopCropEvidence src="/images/case01/evidence/case01-checkout-out-of-stock.png" alt="消費者結帳確認頁的缺貨狀態，呈現警告訊息、數量歸零商品與停用的 Checkout 按鈕" caption="FIG. 08 — Checkout Out-of-stock · Blocked state and recovery guidance" aspect="aspect-[6/7]" className="mx-auto max-w-[70rem]" />
            <InspectableEvidence src="/images/case01/evidence/case01-order-list.png" alt="平台訂單管理列表，呈現搜尋、篩選、訂單與付款狀態、配送方式、來源、日期及列操作" caption="FIG. 09 — Order Management · Search, filters, states and row actions" aspect="aspect-[2048/1565]" />
          </DecisionMedia>}
          mediaFullBleed
        />
      </Section>

      <Section index={8} register={register}>
        <EvidenceSection label="10 — FINAL PRODUCT / UI EVIDENCE" title="One ecosystem, from operations to consumer purchase">
          <div className="space-y-10">
            <InspectableEvidence src="/images/case01/evidence/case01-order-list.png" alt="平台營運端訂單管理列表，呈現訂單處理所需的搜尋、篩選、狀態與操作資訊" caption="PLATFORM OPERATIONS — Order Management" aspect="aspect-[2048/1565]" />
            <div className="lg:grid lg:grid-cols-12">
              <InspectableEvidence src="/images/case01/evidence/case01-supplier-dashboard.png" alt="供貨商營運儀表板，呈現收益、訂單、庫存提醒、餘額、商品、圖表與通知" caption="SUPPLIER — Dashboard hierarchy and operational priorities" aspect="aspect-[1900/1700]" className="lg:col-span-8" />
            </div>
            <div className="grid gap-8 lg:grid-cols-2">
              <TopCropEvidence src="/images/case01/evidence/case01-streamer-filter.png" alt="直播主名單的多條件篩選介面" caption="SALES / COLLABORATION — Expanded Streamer Filter" />
              <TopCropEvidence src="/images/case01/evidence/case01-checkout-out-of-stock.png" alt="消費者結帳流程中的缺貨與 Checkout 停用狀態" caption="CONSUMER — Out-of-stock checkout state" />
            </div>
          </div>
        </EvidenceSection>
      </Section>

      <Section index={9} register={register}>
        <ReadingSection label="11 — OUTCOME" title="從模糊需求建立到完整產品開發" paragraphs={["完成平台營運、Supplier、Agent 與 Consumer Web Storefront 的核心產品設計，並與工程團隊協作完成開發。", "產品後續因公司商業策略調整，未正式進入商業營運。"]} />
      </Section>

      <Section index={10} register={register}>
        <ReadingSection label="12 — LEARNINGS" title="複雜系統設計的核心，是讓關係變得可以理解" paragraphs={["在進入畫面設計之前，我會先確認角色、System State、Business Rules，以及每個操作會對其他角色與流程造成什麼影響。"]} supporting="好的複雜系統設計，不是隱藏複雜性，而是讓使用者清楚知道自己在哪裡、能做什麼，以及接下來會發生什麼。" />
      </Section>
    </></EvidenceMotion>
  );
}
