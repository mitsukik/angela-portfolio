"use client";

import type { Locale } from "@/data/locale";
import type { Project } from "@/data/projects";
import { CASE_OPENINGS } from "@/data/case-studies/openings";
import { CASE_SYSTEM_CHAPTERS, chapterEyebrow } from "@/data/case-studies/chapters";
import { caseOneDemoItems } from "@/components/design-samples/case-final/CaseOneFinalContent";
import { CaseOneProductPreviewMedia, CaseOneRulesToProduct, CaseOneSystemCoverage } from "@/components/design-samples/case-final/CaseOnePresentation";
import { FlowEvidence } from "@/components/design-samples/case-final/FlowEvidence";
import { CaseHeroCta, type CaseHeroCtaItem } from "../CaseHeroCta";
import {
  CaseCard,
  CaseClosingPanel,
  CaseContentGrid,
  CaseDecision,
  CaseHero,
  CaseMedia,
  CaseMetadata,
  CaseOriginalModule,
  CasePipeline,
  CaseSection,
  CaseSectionHeader,
} from "../system/CaseSystem";

/*
 * CASE01 in the unified CASE System V3 (CASE_SYSTEM.md §2, §4, §5; visual
 * reference "CASE System V3.dc.html" → CASE01). Every string is copied
 * verbatim from the production sources (CaseStudyPrototype opening →
 * data/case-studies/openings.ts, CaseOneFinalContent.tsx,
 * CaseOnePresentation.tsx); the original evidence modules render unchanged
 * (FlowEvidence diagrams, the rules → product viewer, system coverage, the
 * Working Product Preview loop through VideoEvidence).
 */

const CH = CASE_SYSTEM_CHAPTERS["01"];
const VERSION = "case01-v3";

export function Case01Article({ locale, project }: { locale: Locale; project: Project }) {
  const zh = locale === "zh";
  const o = CASE_OPENINGS["01"][locale];
  const eb = (i: number) => chapterEyebrow(CH[i], locale);
  const [demo, prototype] = caseOneDemoItems(locale, true);
  const heroCtas: CaseHeroCtaItem[] = [
    { href: prototype.href!, label: prototype.label },
    { href: demo.href!, label: demo.label },
  ];
  // Support text restates the two original link descriptions (§5).
  const ctaNote = zh
    ? "後台原型為作品集展示而重新建構；原始工程 Demo 為專案期間的部分實作，未完整依照原始 Figma 設計呈現。"
    : "The admin prototype was recreated for this portfolio. The engineering demo is a partial implementation and does not fully reflect the original Figma designs.";

  return (
    <>
      <CaseHero
        caseNumber={project.number}
        category={zh ? project.category.zh : project.category.en}
        period={project.year.replace("–", " — ")}
        label={eb(0)}
        title={o.title}
        titleLines={o.titleLines}
        lead={o.subtitle}
        mobileCtaFirst
      >
        {o.summary.map((p, i) => (
          <p key={p} className="cv3-summary" data-lead={o.leadFirst && i === 0 ? "true" : undefined}>{p}</p>
        ))}
        <CaseMetadata rows={o.infoRows} wide={["範疇", "Scope"]} />
        <CaseHeroCta items={heroCtas} note={ctaNote} />
      </CaseHero>

      <CaseMedia
        frame="hero"
        heroFirst
        caption={zh ? "為作品集展示重新建構的後台原型 · 庫存狀態 → 超賣 → 異動紀錄 → 訂單出貨" : "Admin prototype reconstructed for portfolio presentation · Stock health → Oversold → Inventory log → Order shipping"}
      >
        <CaseOriginalModule locale={locale} version={VERSION}>
          <CaseOneProductPreviewMedia locale={locale} />
        </CaseOriginalModule>
      </CaseMedia>

      {/* 01 — The Challenge: text · diagram FIG. 01 (+ text flow fallback) */}
      <CaseSection id={CH[1].anchor}>
        <CaseSectionHeader
          eyebrow={eb(1)}
          title={zh ? "不只是一個線上商店" : "More than an online store"}
          paragraphs={zh ? [
            "專案已有明確的商業方向，但許多實際營運規則與產品細節仍需要進一步定義。",
            "商品從台灣供應商送往越南倉庫，完成實際驗收後進入共享庫存，再由 Agent 或 Streamer 選品與販售。",
            "因此，庫存、定價、訂單、履約與結算，都必須在不同角色與不同流程階段之間維持一致。",
            "核心挑戰是將這套商業模式，轉換成使用者能理解、工程端也能實際開發的產品系統。",
          ] : [
            "The business direction was established, but many operational rules and product details still needed to be defined.",
            "Products moved from Taiwanese suppliers into a Vietnam-based warehouse, were verified into shared inventory, and could then be selected and sold by Agents or Streamers.",
            "This meant inventory, pricing, orders, fulfillment, and settlement had to remain consistent across multiple roles and stages.",
            "The challenge was turning that business model into a system that users could understand and engineering could implement.",
          ]}
        />
        <CaseOriginalModule locale={locale} version={VERSION}>
          <FlowEvidence
            reveal={false}
            src={zh ? "/images/case01/case01_CE_chi02.webp" : "/images/case01/case01_CE_eng02.webp"}
            alt={zh ? "跨境直播電商生態系統，呈現供應、銷售與消費端的角色及流程" : "Cross-border live commerce ecosystem diagram showing the roles and flow across supply, sales, and consumer touchpoints"}
            caption={zh ? "FIG. 01 — 跨境直播電商生態系" : "FIG. 01 — Cross-border Live Commerce Ecosystem"}
            scrollHint={zh ? "→ 左右滑動查看完整流程圖" : "→ Scroll to see the full diagram"}
          />
        </CaseOriginalModule>
        <p className="cv3-p cv3-flow-text" lang={zh ? "zh-Hant" : "en"}>
          {zh ? "供應商 → 跨境運輸 → 越南倉庫 → 驗收／掃描 → 商品啟用 → 共享庫存 → 代理公司／直播主 → 銷售活動／商店頁 → 消費者 → 訂單 → 履約" : "Supplier → Cross-border Shipment → Vietnam Warehouse → Receive / Count / Scan → Active Product → Shared Inventory → Agent / Streamer → Campaign / Storefront → Consumer → Order → Fulfillment"}
        </p>
      </CaseSection>

      {/* 02 — The Approach: five numbered layers (CASE03 pipeline row) · cards-2 */}
      <CaseSection id={CH[2].anchor}>
        <CaseSectionHeader
          eyebrow={eb(2)}
          title={zh ? "先建立產品邏輯，再進入介面設計" : "From business rules to product structure"}
          paragraphs={zh ? [
            "專案前期，我直接與工程團隊合作，將客戶在會議中提出的需求逐步整理成完整產品流程。",
            "我沒有直接從單一畫面開始，而是從五個層次建立系統：",
          ] : [
            "Early in the project, I worked directly with the engineering team to translate requirements from client meetings into complete product flows.",
            "Rather than starting from individual screens, I structured the system across five layers:",
          ]}
        />
        <CasePipeline
          label={zh ? "五個層次" : "Five layers"}
          lang={zh ? "zh-Hant" : "en"}
          steps={(zh ? [
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
          ]).map((point) => {
            const [head, note] = point.split("｜");
            const m = head.match(/^(\d{2})\s+(.*)$/)!;
            return { n: m[1], title: m[2], note };
          })}
        />
        <p className="cv3-p">{zh ? "Consumer Web 前台於 2025 年 5 月完成設計，主要管理後台則於 6 月完成。" : "The consumer-facing Web experience was completed in May 2025, followed by the core administration systems in June."}</p>
        <CaseContentGrid variant="cards-2">
          <CaseCard tone="accent" kicker={zh ? "由我設計" : "Designed by me"}>
            <ul className="cv3-chips cv3-list-reset" lang="en">
              {["Platform Backend", "Supplier Backend", "Agent Backend", "Consumer Web Storefront"].map((item) => <li key={item}><span className="cv3-chip">{item}</span></li>)}
            </ul>
          </CaseCard>
          <CaseCard tone="muted" kicker={zh ? "另一位 UI Designer 依既有系統延伸" : "Extended by another UI Designer from the established system"}>
            <ul className="cv3-chips cv3-list-reset" lang="en">
              {["Consumer Mobile", "Streamer Backend"].map((item) => <li key={item}><span className="cv3-chip">{item}</span></li>)}
            </ul>
          </CaseCard>
        </CaseContentGrid>
      </CaseSection>

      {/* 03 — Designing the System: Decision 01/02 → FIG. 02/03 · rules → product viewer · system coverage */}
      <CaseSection id={CH[3].anchor}>
        <CaseSectionHeader
          eyebrow={eb(3)}
          title={zh ? "讓複雜的營運規則變得容易理解" : "Making complex operations understandable"}
          paragraphs={zh ? [
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
          ]}
        />
        <CaseDecision label={`01 ${zh ? "庫存狀態流程" : "Inventory Status Flow"}`}>
          <p className="cv3-p">{zh ? "商品經倉庫驗收後才進入可售庫存，可控超賣則作為系統支援的商業規則。" : "Warehouse verification before stock goes live, with controlled overselling as a business rule."}</p>
          <CaseOriginalModule locale={locale} version={VERSION}>
            <FlowEvidence
              reveal={false}
              src={zh ? "/images/case01/case01_ISF_chi02.webp" : "/images/case01/case01_ISF_eng02.webp"}
              alt={zh ? "庫存狀態流程，呈現實體到貨、驗收、數位庫存決策與消費端影響" : "Inventory status flow showing physical arrival, verification, digital inventory decisions, and consumer-facing impact"}
              caption={zh ? "FIG. 02 — 庫存狀態流程" : "FIG. 02 — Inventory Status Flow"}
              scrollHint={zh ? "→ 左右滑動查看完整流程圖" : "→ Scroll to see the full diagram"}
            />
          </CaseOriginalModule>
        </CaseDecision>
        <CaseDecision label={`02 ${zh ? "定價與收益邏輯" : "Pricing & Revenue Logic"}`}>
          <p className="cv3-p">{zh ? "Supplier 最低售價、銷售端定價彈性，以及已移除敏感數值的多方結算邏輯。" : "Supplier minimum price, seller flexibility above it, and sanitized multi-party settlement logic."}</p>
          <CaseOriginalModule locale={locale} version={VERSION}>
            <FlowEvidence
              reveal={false}
              src={zh ? "/images/case01/case01_PRL_chi02.webp" : "/images/case01/case01_PRL_eng02.webp"}
              alt={zh ? "已移除敏感數值的定價與收益邏輯圖，呈現最低售價規則、價格驗證與多方結算" : "Sanitized pricing and revenue logic diagram showing the minimum-price rule, price validation, and multi-party settlement"}
              caption={zh ? "FIG. 03 — 定價與收益邏輯 · 已移除敏感資訊" : "FIG. 03 — Pricing & Revenue Logic · Sanitized"}
              scrollHint={zh ? "→ 左右滑動查看完整流程圖" : "→ Scroll to see the full diagram"}
            />
          </CaseOriginalModule>
        </CaseDecision>
        <CaseOriginalModule locale={locale} version={VERSION}>
          <div className="case01-modules cv3-case01-modules">
            <CaseOneRulesToProduct locale={locale} />
            <CaseOneSystemCoverage locale={locale} />
          </div>
        </CaseOriginalModule>
      </CaseSection>

      {/* 04 — From Design to Delivery: text · timeline as CASE03 pipeline (4 nodes) */}
      <CaseSection id={CH[4].anchor}>
        <CaseSectionHeader
          eyebrow={eb(4)}
          title={zh ? "從主要設計完成，一路支援到產品交付" : "Supporting the product through implementation"}
          paragraphs={zh ? [
            "主要前台與管理系統完成設計後，我持續與工程團隊合作進入實作階段。",
            "後續工作包含補足缺少的狀態與規則、確認實際操作行為、處理開發過程中的 UX 問題，以及依照實作狀況調整設計。",
            "PM 於 2025 年 10 月加入專案，主要協助後期的專案協調與 QA。",
            "專案期間也受到外部條件影響。當地金流合作方的處理時程較長，使部分整合工作與整體交付時間延後。",
            "客戶最後也完成了當地 Online Shop 所需的相關登記，但因商品類型受到限制，實際可上架的品項範圍需要縮減；核心系統架構則維持不變。",
          ] : [
            "After the main storefront and administration systems were designed, I continued working directly with the engineering team during implementation.",
            "My role included clarifying missing states and rules, reviewing implementation behavior, resolving UX questions, and adjusting designs when development exposed additional constraints.",
            "A PM joined in October 2025 to support later-stage coordination and QA.",
            "External dependencies also affected delivery. Work involving the local payment provider progressed more slowly than expected, which extended the project timeline.",
            "The Client also completed the local registration required to operate the online shop. Product-category restrictions reduced the range of items that could ultimately be listed, without changing the core system architecture.",
          ]}
        />
        <p className="cv3-note-label cv3-sub-label">{zh ? "專案時程" : "Project Timeline"}</p>
        <CasePipeline
          label={zh ? "專案時程" : "Project Timeline"}
          lang={zh ? "zh-Hant" : "en"}
          steps={(zh ? [
            ["2025.05", "Consumer Web 前台設計完成"],
            ["2025.06", "主要管理後台設計完成"],
            ["2025.10", "PM 加入，協助後期專案協調與 QA"],
            ["2026.04", "前後台系統完成開發並交付"],
          ] : [
            ["May 2025", "Consumer Web design completed"],
            ["Jun 2025", "Core administration systems completed"],
            ["Oct 2025", "PM joined for later-stage coordination and QA"],
            ["Apr 2026", "Working frontend + backend system completed and delivered"],
          ]).map(([date, text]) => ({ n: date, title: text }))}
        />
      </CaseSection>

      {/* 05 — Outcome: CaseClosing — outcome statement panel + 2 secondary links */}
      <CaseSection id={CH[5].anchor}>
        <CaseSectionHeader
          eyebrow={eb(5)}
          title={zh ? "完成可運作的產品，而不是概念作品" : "A working product, without fabricated metrics"}
          paragraphs={zh ? [
            "最終完成可運作的 Consumer 前台與管理後台系統，並交付客戶。",
            "當年的工程實作亦留下可操作 Demo，並曾供 PM 與客戶確認需求與產品行為。",
            "客戶後續因商業策略調整，產品沒有正式進入商業營運。",
          ] : [
            "The project resulted in a working frontend and backend system and was delivered to the Client.",
            "The original engineering implementation was also used by the PM and Client to review requirements and product behavior during the project.",
            "The Client later changed its business strategy, so the product did not formally enter commercial operation.",
          ]}
        />
        <CaseClosingPanel>
          <p className="cv3-p">
            {zh
              ? "因此，本案例不主張不存在的上線後 KPI，而是以實際完成的產品架構、跨角色流程、UX/UI 設計決策、工程實作與可操作系統作為成果證據。"
              : "For that reason, this case does not claim post-launch KPIs. The evidence is the completed product architecture, multi-role workflows, UX/UI decisions, working engineering implementation, and delivered system."}
          </p>
        </CaseClosingPanel>
        <CaseHeroCta items={[demo, prototype].map((l) => ({ href: l.href!, label: l.label, note: l.note }))} allSecondary />
      </CaseSection>
    </>
  );
}
