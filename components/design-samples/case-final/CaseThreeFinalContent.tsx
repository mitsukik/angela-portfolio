import Image from "next/image";
import type { ReactNode } from "react";
import type { Locale } from "@/data/locale";
import { Reveal } from "../Reveal";
import { CaseLinkList } from "./CaseLinkList";
import { EvidenceMotion } from "./EvidenceMotion";
import { EvidenceTrigger } from "./CaseEvidenceViewer";
import { Shot } from "./EvidenceShot";
import { ReadingSection } from "./ReadingSection";

type RegisterSection = (index: number, element: HTMLElement | null) => void;

/*
 * CASE03 production rewrite (2026-09-27). Positioning: CASE01 carries the
 * product/system-logic story; CASE03 carries real enterprise delivery —
 * existing factory requirements (defined by the SA and client) translated
 * into interfaces, implemented as a working HTML/CSS/JS frontend, tested
 * with the client in stages, then integrated, QA'd and deployed.
 *
 * Evidence is limited to the three verified CASE03 assets (hero, operations
 * collage, warehouse floorplan). The former case03-monitoring-dashboard
 * image belonged to an unrelated client and must never return here.
 */

function Section({ index, register, children, divider = true }: { index: number; register: RegisterSection; children: ReactNode; divider?: boolean }) {
  return <div ref={(element) => register(index, element)} className={`cf-section min-w-0${divider ? " cf-section-divider" : ""}`}>{children}</div>;
}

const PROTOTYPE_URL = "/demos/case03/demo01/demo_01.html";

/** Prototype CTA — CASE01's Demo CTA grammar via the shared CaseLinkList.
 * Rendered in the hero summary column (CaseStudyPrototype), the same slot
 * and spacing as CASE01's CaseOneDemoLinks: below the intro copy, above
 * the hero evidence image. */
export function CaseThreeDemoLinks({ locale, className = "" }: { locale: Locale; className?: string }) {
  const zh = locale === "zh";
  return (
    <CaseLinkList
      className={className}
      items={[{
        href: PROTOTYPE_URL,
        label: zh ? "查看可操作 Prototype ↗" : "View Interactive Prototype ↗",
        note: zh
          ? "原系統中經去識別化處理的部分可操作 Prototype；其餘工作流程因保密需求，以真實專案畫面呈現。"
          : "Selected sanitized prototype from the original system. Additional workflows are shown through real project screens due to confidentiality.",
      }]}
    />
  );
}

/** Hero — one image proving both operating contexts (management desktop +
 * shop-floor tablet menu) and the confidentiality note. The prototype CTA
 * sits above it in the hero copy column (CaseThreeDemoLinks). */
export function CaseThreeHeroEvidence({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  return (
    <figure className="mt-10 md:mt-12">
      <Reveal>
        <div className="cf-figure-frame relative aspect-[16/9] overflow-hidden bg-white">
          <EvidenceTrigger asset={{ src: "/images/case03/case03-hero-desktop-tablet.webp", alt: zh ? "管理端 Desktop 儀表板，旁邊是現場工業平板的作業選單" : "Management desktop dashboard alongside the shop-floor industrial tablet's task menu" }}>
            <Image
              src="/images/case03/case03-hero-desktop-tablet.webp"
              alt=""
              fill
              unoptimized
              loading="eager"
              sizes="(min-width: 1024px) 70vw, 100vw"
              className="object-contain"
            />
          </EvidenceTrigger>
        </div>
      </Reveal>
      <figcaption className="cf-dim mt-4 max-w-[62ch] text-[13px] leading-6">
        {zh
          ? "因專案保密需求，本案例不公開客戶與工廠名稱，並已移除敏感營運資料。"
          : "Client and facility identities are withheld, and sensitive operational data has been removed due to project confidentiality."}
      </figcaption>
    </figure>
  );
}

/** 01 — the two operating contexts, side by side. */
function OperatingContexts({ zh }: { zh: boolean }) {
  const contexts = [
    { label: "Shop Floor", device: zh ? "工業平板" : "Industrial tablet", items: "Production · Material · Quality · Packaging · Inbound" },
    { label: "Management", device: "Desktop", items: "Work Orders · Production · Inventory · Reports · Permissions" },
  ];
  return (
    <dl data-evidence-entrance className="grid border-t cf-rule sm:grid-cols-2">
      {contexts.map((context) => (
        <div key={context.label} className="border-b cf-rule py-6 sm:px-6 sm:first:border-r sm:first:pl-0">
          <dt className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="cf-meta cf-accent">{context.label}</span>
            <span className="cf-meta cf-dim">{context.device}</span>
          </dt>
          <dd className="cf-body mt-3 text-[16px] leading-7">{context.items}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Inline step sequence. Each arrow is attached to the step it leads into,
 * so a wrapped line always starts with "→ step" instead of ending on a
 * dangling arrow. */
function InlineFlow({ steps, label, className = "" }: { steps: string[]; label: string; className?: string }) {
  return (
    <ol aria-label={label} className={`flex flex-wrap items-baseline gap-x-3 gap-y-2 ${className}`}>
      {steps.map((step, i) => (
        <li key={step} className="whitespace-nowrap">
          {i > 0 && <span aria-hidden className="cf-dim mr-3">→</span>}
          {step}
        </li>
      ))}
    </ol>
  );
}

/** 02 — the delivery flow, grouped by who owned each stage so the
 * ownership boundary is readable at a glance: requirements came from the
 * SA and client; structure, UI/UX and the working frontend were mine;
 * testing, integration, QA and production were shared with the team. */
function DeliveryFlow({ zh }: { zh: boolean }) {
  const groups = [
    { owner: zh ? "SA 與客戶定義" : "Defined by SA & client", steps: ["Requirements"], mine: false },
    { owner: zh ? "由我負責" : "Owned by me", steps: ["Structure & Flow", "UI/UX", "Working Frontend"], mine: true },
    { owner: zh ? "與團隊協作" : "With the team", steps: ["Client Testing", "Backend / QA", "Production"], mine: false },
  ];
  return (
    <ol
      data-evidence-entrance
      aria-label={zh ? "交付流程" : "Delivery flow"}
      className="grid border-t cf-rule lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)_minmax(0,1.6fr)]"
    >
      {groups.map((group, groupIndex) => (
        <li key={group.owner} className="border-b cf-rule py-6 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0">
          <p className={`cf-meta ${group.mine ? "cf-accent" : "cf-dim"}`}>{group.owner}</p>
          <ol className={`mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-2 ${group.mine ? "cf-heading" : "cf-body"} text-[17px] leading-7`}>
            {group.steps.map((step, i) => (
              <li key={step} className="whitespace-nowrap">
                {(i > 0 || groupIndex > 0) && <span aria-hidden className="cf-dim mr-3">→</span>}
                {step}
              </li>
            ))}
          </ol>
        </li>
      ))}
    </ol>
  );
}

function Decision({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return (
    <article className="border-t cf-rule pt-10 first:border-t-0 first:pt-0">
      <p className="cf-meta cf-dim">{number}</p>
      <h3 className="cf-heading cf-h3 mt-4 max-w-[70ch]">{title}</h3>
      <div className="mt-8">{children}</div>
    </article>
  );
}

function Paragraphs({ items }: { items: string[] }) {
  return <div className="max-w-[70ch] space-y-4">{items.map((paragraph) => <p key={paragraph} className="cf-body body-tc">{paragraph}</p>)}</div>;
}

export function CaseThreeFinalContent({ register, locale }: { register: RegisterSection; locale: Locale }) {
  const zh = locale === "zh";
  return <EvidenceMotion><>
    <Section index={0} register={register} divider={false}>
      <ReadingSection
        label={zh ? "01 — The Challenge" : "01 — THE CHALLENGE"}
        title={zh ? "同一套系統，兩種不同的操作情境" : "One system, two operating contexts"}
        paragraphs={zh ? [
          "管理人員透過 Desktop 掌握工單、生產與庫存等資訊；現場人員則使用工業平板完成物料、生產紀錄、品檢、包裝與入庫等日常作業。",
          "SA 與客戶已定義作業需求與系統規則。我的任務不是重新設計工廠的營運方式，而是把既有規則轉成在兩種工作情境下都能清楚理解、實際操作的介面。",
        ] : [
          "Management staff used desktop interfaces to monitor work orders, production, inventory, and other operational information. Shop-floor staff used industrial tablets for day-to-day tasks such as material handling, production records, quality inspection, packaging, and inbound storage.",
          "The SA and client had already defined the operational requirements and system rules. My role was not to redesign how the factory operated, but to translate those existing rules into interfaces that were clear and practical in two very different working environments.",
        ]}
        media={<OperatingContexts zh={zh} />}
        mediaFullBleed
      />
    </Section>

    <Section index={1} register={register}>
      <ReadingSection
        label={zh ? "02 — My Role & Approach" : "02 — MY ROLE & APPROACH"}
        title={zh ? "從需求，做到可以真正操作的介面" : "Turning requirements into something people could actually use"}
        paragraphs={zh ? [
          "專案沒有專職 Frontend Engineer，因此我的工作不只停在 UI 設計。",
          "我把 SA 與客戶提出的需求整理成頁面結構、任務順序與操作流程，再以 HTML / CSS / JavaScript 做成可操作介面，讓客戶能在 Backend 整合前分階段測試並回饋。",
        ] : [
          "There was no dedicated frontend engineer on the project, so my work did not stop at UI design.",
          "I translated requirements from the SA and client into page structure, task sequence, and interaction flows, then implemented the interface in HTML, CSS, and JavaScript. This gave the client something they could operate and review in stages before backend integration.",
        ]}
        media={<DeliveryFlow zh={zh} />}
        mediaFullBleed
      />
    </Section>

    <Section index={2} register={register}>
      <section>
        <p className="cf-meta cf-section-label cf-accent md:whitespace-nowrap">{zh ? "03 — Key Design Decisions" : "03 — KEY DESIGN DECISIONS"}</p>
        <h2 className="sr-only">{zh ? "關鍵設計決策" : "Key design decisions"}</h2>
        <div className="mt-10 space-y-16 md:space-y-20">
          <Decision number={zh ? "決策 01" : "Decision 01"} title={zh ? "不同工序，共用一致的操作邏輯" : "One interaction pattern across different tasks"}>
            <div className="lg:grid lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-5">
                <Paragraphs items={zh ? [
                  "不同現場任務處理的資料並不相同。如果每個功能都有自己的操作方式，使用者在切換工作時就需要重新理解介面。",
                  "因此我讓核心操作維持一致：",
                ] : [
                  "Shop-floor tasks handled very different types of data. If every function introduced a different interaction model, users would have to relearn the interface each time they switched tasks.",
                  "I therefore kept the core interaction pattern consistent:",
                ]} />
                <InlineFlow
                  label={zh ? "核心操作模式" : "Core interaction pattern"}
                  steps={["Filter", "Table / List", "Form", "Confirm"]}
                  className="cf-heading my-6 border-y cf-rule py-4 text-[17px] leading-7"
                />
                <Paragraphs items={[zh
                  ? "內容可以不同，但篩選、閱讀資料、輸入與確認的方式保持一致，讓使用者已經理解的操作模式可以延續到其他任務。"
                  : "The content changed, but filtering, reading data, entering information, and confirming actions followed the same basic logic across workflows."]} />
              </div>
              <figure data-evidence-entrance className="mt-10 lg:col-span-7 lg:mt-0">
                <div className="cf-figure-frame relative aspect-[16/9]">
                  <EvidenceTrigger asset={{ src: "/images/case03/case03-operations-collage.webp", alt: zh ? "多個現場作業畫面，共用相同的篩選、表格、表單與確認模式" : "Several shop-floor task screens sharing the same filter, table, form, and confirmation patterns" }}>
                    <Image
                      src="/images/case03/case03-operations-collage.webp"
                      alt=""
                      fill
                      unoptimized
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-contain"
                    />
                  </EvidenceTrigger>
                </div>
                <figcaption className="cf-figure-caption cf-meta mt-3">
                  {zh ? "不同作業畫面沿用相同的篩選、表格、表單與確認模式。" : "Different operational screens reuse the same filtering, table, form, and confirmation patterns."}
                </figcaption>
              </figure>
            </div>
          </Decision>

          <Decision number={zh ? "決策 02" : "Decision 02"} title={zh ? "把儲位代碼轉成空間介面" : "Turning storage codes into a spatial interface"}>
            <Paragraphs items={zh ? [
              "倉儲位置原本主要以代碼識別；對系統而言足夠，但現場人員仍必須把編號轉換成實際空間位置。",
              "我將實體儲存區域重新繪製成視覺化平面配置，並做成可直接選取的介面。",
              "使用者不需要只靠代碼判斷，而能從畫面理解並選擇對應的實體儲位。",
            ] : [
              "Storage locations were primarily identified by codes. That worked for the system, but shop-floor staff still had to translate those codes into physical locations.",
              "I redrew the storage area as a visual floor plan and implemented it as an interactive location-selection interface.",
              "Instead of relying only on codes, users could understand and select the corresponding physical storage position directly on screen.",
            ]} />
            <div data-evidence-entrance className="mt-10">
              <Shot
                src="/images/case03/case03-warehouse-floorplan.webp"
                size={[1920, 1080]}
                minW="min-w-[44rem]"
                alt={zh ? "入庫作業中的儲位選擇視窗：以實體倉儲平面圖呈現貨架、走道與樓層分頁，可直接點選儲位" : "Storage-location selector in the inbound flow: the physical warehouse drawn as a floor plan with shelves, aisles, and floor tabs, selectable directly on screen"}
                caption={zh ? "將實體倉儲空間轉為可直接操作的數位位置選擇。" : "Translating the physical warehouse layout into a directly operable digital location selector."}
                scrollHint={zh ? "→ 左右滑動查看完整平面圖" : "→ Scroll to see the full floor plan"}
              />
            </div>
          </Decision>
        </div>
      </section>
    </Section>

    <Section index={3} register={register}>
      <ReadingSection
        label={zh ? "04 — From Prototype to Production" : "04 — FROM PROTOTYPE TO PRODUCTION"}
        title={zh ? "設計必須能真正進入實作" : "The design had to work in implementation"}
        paragraphs={zh ? [
          "可操作的 HTML / CSS / JavaScript frontend 先用於客戶分階段測試，再依操作回饋調整，之後才進入 Backend 整合與 QA。",
          "這讓 interaction 問題能在完整系統整合前被發現，也讓設計決策從一開始就必須面對實際 implementation，而不只是靜態畫面。",
        ] : [
          "The working HTML / CSS / JavaScript frontend was used for staged client testing before backend integration. Feedback from those sessions was incorporated before the interface moved into backend integration and QA.",
          "This allowed interaction issues to surface before full system integration and meant that design decisions had to hold up in a working implementation, not only in static screens.",
        ]}
        media={<InlineFlow
          label={zh ? "從 Prototype 到 Production" : "From prototype to production"}
          steps={["Prototype", "Client Testing", "Revision", "Backend Integration", "QA"]}
          className="cf-heading border-y cf-rule py-5 text-[17px] leading-7"
        />}
        mediaFullBleed
      />
    </Section>

    <Section index={4} register={register}>
      <ReadingSection
        label={zh ? "05 — Production & Iteration" : "05 — PRODUCTION & ITERATION"}
        title={zh ? "系統上線後，設計工作沒有停止" : "The design work continued after launch"}
        paragraphs={zh ? [
          "系統完成 Backend 整合與 QA 後正式導入工廠，並用於日常生產與營運。上線後，我仍持續依實際操作情境與客戶回饋調整介面與流程。",
          "本案例不主張沒有驗證資料支持的效率或營運 KPI；可以確認的成果，是一套從需求、UI/UX、可操作 frontend、客戶測試一路走到正式 production 的真實系統。",
        ] : [
          "After backend integration and QA, the system was deployed into the factory and used in day-to-day production and operations. I continued refining interfaces and workflows based on real operating conditions and client feedback after launch.",
          "This case does not claim efficiency or operational KPIs without verified measurement data. The verifiable outcome is a real system that moved from requirements and UI/UX through working frontend implementation, client testing, integration, QA, and production use.",
        ]}
        media={<div className="space-y-10">
          <div data-evidence-entrance className="max-w-[70ch] border-l cf-rule pl-5">
            <p className="cf-meta cf-dim">{zh ? "上線後調整" : "Post-launch example"}</p>
            <p className="cf-body mt-3 text-[16px] leading-7">
              {zh
                ? "導入後，現場以平板操作時發現部分按鈕位置不順手。我依回饋重新調整主要操作按鈕的位置，並將原流程拆分、新增頁面，讓每一步的操作更單純。"
                : "After deployment, tablet use on the shop floor showed that some action buttons were awkwardly placed. Based on that feedback, I repositioned the primary actions and split the original flow across an additional page so each step was simpler."}
            </p>
          </div>
          <dl data-evidence-entrance className="grid gap-3 border-t cf-rule pt-6 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-6">
            <dt className="cf-meta cf-accent">{zh ? "交付" : "Delivered"}</dt>
            <dd className="cf-heading text-[16px] leading-7">Frontend Implementation · Backend Integration · QA · Production Deployment</dd>
          </dl>
        </div>}
        mediaFullBleed
      />
    </Section>
  </></EvidenceMotion>;
}
