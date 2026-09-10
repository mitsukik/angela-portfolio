import Image from "next/image";
import type { ReactNode } from "react";
import type { Locale } from "@/data/locale";
import { Reveal } from "../Reveal";

type RegisterSection = (index: number, element: HTMLElement | null) => void;

function Section({
  index,
  register,
  children,
  divider = true,
}: {
  index: number;
  register: RegisterSection;
  children: ReactNode;
  divider?: boolean;
}) {
  return (
    <div
      ref={(element) => register(index, element)}
      className={`cf-section min-w-0${divider ? " cf-section-divider" : ""}`}
    >
      {children}
    </div>
  );
}

function SectionHeading({
  label,
  title,
  intro,
}: {
  label: string;
  title: string;
  intro?: string;
}) {
  return (
    <header className="max-w-[70ch]">
      <p className="cf-meta cf-section-label cf-accent md:whitespace-nowrap">{label}</p>
      <h2 className="cf-heading cf-h3 mt-4">{title}</h2>
      {intro && <p className="cf-body body-tc mt-8 max-w-[62ch]">{intro}</p>}
    </header>
  );
}

type EvidenceAsset = {
  src: string;
  alt: string;
};

function EvidenceImage({
  asset,
  aspect = "aspect-[16/9]",
}: {
  asset: EvidenceAsset;
  aspect?: string;
}) {
  return (
    <div className={`cf-figure-frame relative ${aspect} overflow-hidden bg-white`}>
      <Image
        src={asset.src}
        alt={asset.alt}
        fill
        unoptimized
        sizes="(min-width: 1024px) 70vw, 100vw"
        className="object-contain"
      />
    </div>
  );
}

function Evidence({
  asset,
  caption,
  aspect,
  className = "",
}: {
  asset: EvidenceAsset;
  caption: string;
  aspect?: string;
  className?: string;
}) {
  return (
    <figure className={className}>
      <EvidenceImage asset={asset} aspect={aspect} />
      <figcaption className="cf-figure-caption cf-meta mt-4">{caption}</figcaption>
    </figure>
  );
}

/**
 * Hero — one restrained image (management desktop + tablet quick-action
 * menu), not a multi-thumbnail composition like CASE02's hero. The NDA
 * note lives here since it applies to the whole case, and this is the
 * first thing a reader sees before any evidence.
 */
export function CaseThreeHeroEvidence() {
  return (
    <figure className="mt-12 md:mt-16">
      <Reveal>
        <EvidenceImage
          asset={{
            src: "/images/case03/case03-hero-desktop-tablet.webp",
            alt: "Management desktop dashboard with a tablet-style quick action menu overlaid for shop-floor operations",
          }}
        />
      </Reveal>
      <p className="cf-dim mt-4 max-w-[62ch] text-[13px] leading-6">
        Certain client details, production data, and interface content have been anonymized or withheld due to confidentiality requirements.
      </p>
    </figure>
  );
}

function FlowStage({
  label,
  items,
  emphasize = false,
}: {
  label: string;
  items: string[];
  emphasize?: boolean;
}) {
  return (
    <div className="lg:flex-1">
      <p className={`cf-meta ${emphasize ? "cf-accent" : "cf-dim"}`}>{label}</p>
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item} className="cf-body text-[15px] leading-6">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FlowArrow() {
  return (
    <span aria-hidden className="hidden cf-dim pt-8 text-xl lg:flex lg:items-start lg:justify-center">
      →
    </span>
  );
}

export function CaseThreeFinalContent({ register, locale }: { register: RegisterSection; locale: Locale }) {
  const zhHant = locale === "zh";
  return (
    <>
      {/* 02 — A System Used Across the Factory */}
      <Section index={0} register={register} divider={false}>
        <Reveal>
          <SectionHeading
            label="02 — A SYSTEM USED ACROSS THE FACTORY"
            title={zhHant ? "一套同時服務管理端與現場作業的系統" : "A System Used Across the Factory"}
            intro={
              zhHant
                ? "工廠內不同角色需要處理不同工作：管理人員查看與管理資料，現場人員透過平板完成日常作業，部分畫面則用來快速掌握設備與生產狀態。"
                : "Different users needed different views of the same operation. Management staff reviewed and managed information, production-floor workers completed daily tasks on tablets, and monitoring screens surfaced current production and equipment status."
            }
          />
        </Reveal>
        <p className="cf-body body-tc mt-4 max-w-[62ch]">
          {zhHant
            ? "系統功能很多，但對使用者而言，重點不是理解背後有多複雜，而是能夠快速找到資訊並完成當下的工作。"
            : "The system was complex behind the scenes, but the interface needed to help people find what mattered and complete the task in front of them."}
        </p>
        <div className="mt-10 grid border-t cf-rule sm:grid-cols-3">
          {[
            ["Management", zhHant ? "查看與管理資訊" : "Review and manage information"],
            ["Shop Floor", zhHant ? "執行日常作業" : "Complete daily operational tasks"],
            ["Monitoring", zhHant ? "掌握生產與設備狀態" : "Track production and equipment status"],
          ].map(([role, desc], index) => (
            <div
              key={role}
              className="border-b cf-rule py-6 sm:border-r sm:px-6 sm:first:pl-0 sm:last:border-r-0"
            >
              <p className="cf-meta cf-accent">0{index + 1}</p>
              <p className="cf-heading mt-4 text-[18px] font-medium leading-7">{role}</p>
              <p className="cf-body mt-2 text-[15px] leading-6">{desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 03 — Turning Detailed Requirements into Usable Screens */}
      <Section index={1} register={register}>
        <Reveal>
          <SectionHeading
            label="03 — TURNING DETAILED REQUIREMENTS INTO USABLE SCREENS"
            title={zhHant ? "把詳細規格轉化成實際可操作的介面" : "Turning Detailed Requirements into Usable Screens"}
            intro={
              zhHant
                ? "這個專案的需求、商業邏輯與生產流程已由 PM / System Analyst 定義。"
                : "The requirements, workflows, and business rules were already defined in detailed specifications."
            }
          />
        </Reveal>
        <p className="cf-body body-tc mt-4 max-w-[62ch]">
          {zhHant
            ? "我的工作是進一步思考這些規則應該如何出現在畫面上：哪些資訊需要先被看見、操作應該放在哪裡、不同狀態如何呈現，以及大量相似的工作頁面要如何保持一致。"
            : "My responsibility was to determine how those rules should appear on screen — what users needed to see first, where actions should live, how different states should be presented, and how similar tasks could remain consistent across the system."}
        </p>
        {/* Portfolio explanatory diagram only — not a reproduction of the
            PM/SA's original project flowcharts. */}
        <div className="mt-12 flex flex-col gap-10 border-t cf-rule pt-10 lg:flex-row lg:items-start lg:gap-6">
          <FlowStage label="PM / SYSTEM ANALYST" items={["Requirements", "Workflows", "Business Rules"]} />
          <FlowArrow />
          <FlowStage
            label="MY ROLE"
            emphasize
            items={["Information Presentation", "Interaction Hierarchy", "UI/UX", "Visual System", "Frontend"]}
          />
          <FlowArrow />
          <FlowStage label="OPERATIONAL INTERFACE" items={["Management", "Tablet", "Monitoring"]} />
        </div>
      </Section>

      {/* 04 — Many Tasks, Shared Patterns */}
      <Section index={2} register={register}>
        <Reveal>
          <SectionHeading
            label="04 — MANY TASKS, SHARED PATTERNS"
            title={zhHant ? "不同工作內容，共用熟悉的操作方式" : "Many Tasks, Shared Patterns"}
          />
        </Reveal>
        <div className="cf-body body-tc mt-8 max-w-[62ch] space-y-4">
          {zhHant ? (
            <>
              <p>系統包含大量日常作業頁面。</p>
              <p>雖然每個功能處理的資料不同，但使用者不應該每進入一個新功能，就重新學習一次操作方式。</p>
              <p>因此我讓相似任務盡量沿用一致的表格結構、篩選方式、表單、操作按鈕、彈出視窗與狀態回饋。</p>
              <p>目標不是讓所有畫面看起來完全一樣，而是讓使用者可以把已經學會的操作方式帶到下一個任務。</p>
            </>
          ) : (
            <>
              <p>The system contained many operational screens handling different types of work.</p>
              <p>Rather than making users relearn the interface for every function, similar tasks reused familiar patterns for tables, filters, forms, actions, dialogs, and status feedback.</p>
              <p>The goal was not to make every screen identical, but to make learned interactions transferable across the system.</p>
            </>
          )}
        </div>
        <Reveal className="mt-10 block">
          <Evidence
            asset={{
              src: "/images/case03/case03-operations-collage.webp",
              alt: "Collage of multiple operational task screens sharing consistent table, form, and status patterns",
            }}
            caption={
              zhHant
                ? "不同功能的工作頁面，沿用相同的表格、表單與狀態呈現方式。"
                : "Different functional screens reuse the same table, form, and status patterns."
            }
          />
        </Reveal>
      </Section>

      {/* 05 — Bringing Physical Storage into the Interface (strongest visual moment) */}
      <Section index={3} register={register}>
        <Reveal>
          <SectionHeading
            label="05 — BRINGING PHYSICAL STORAGE INTO THE INTERFACE"
            title={zhHant ? "把真實空間轉化成可以操作的數位介面" : "Bringing Physical Storage into the Interface"}
            intro={
              zhHant
                ? "部分庫存資訊不適合只用表格呈現。"
                : "Some inventory information was easier to understand spatially than through tables alone."
            }
          />
        </Reveal>
        <div className="cf-body body-tc mt-4 max-w-[62ch] space-y-4">
          {zhHant ? (
            <>
              <p>為了讓使用者更直覺地理解物品實際位於哪個區域，我將真實的儲存空間重新繪製成 vector floorplan，並以 SVG 製作互動呈現。</p>
              <p>使用者不需要只靠位置名稱或編號理解資料，而能直接從空間關係判斷所在位置。</p>
            </>
          ) : (
            <>
              <p>I redrew the physical storage area as a vector floorplan and implemented an SVG-based interface that connected location data with the real layout of the warehouse.</p>
              <p>This gave users a more direct way to understand where inventory was positioned.</p>
            </>
          )}
        </div>
        <p className="cf-meta cf-accent mt-8">PHYSICAL SPACE → DIGITAL REPRESENTATION</p>
        <Reveal className="mt-6 block">
          <Evidence
            asset={{
              src: "/images/case03/case03-warehouse-floorplan.webp",
              alt: "Interactive vector floorplan of the physical warehouse, showing shelf zones, aisles, and storage status",
            }}
            caption={
              zhHant
                ? "倉儲空間重新繪製成互動式 vector floorplan，取代單純依賴位置編號的表格。"
                : "The storage area redrawn as an interactive vector floorplan, replacing a table that relied only on location codes."
            }
          />
        </Reveal>
      </Section>

      {/* 06 — Making Status Easy to Scan */}
      <Section index={4} register={register}>
        <Reveal>
          <SectionHeading
            label="06 — MAKING STATUS EASY TO SCAN"
            title={zhHant ? "讓正在發生的狀態更容易被看見" : "Making Status Easy to Scan"}
            intro={
              zhHant
                ? "監控畫面和一般資料輸入頁面的使用目的不同。"
                : "Monitoring screens served a different purpose from data-entry interfaces."
            }
          />
        </Reveal>
        <div className="cf-body body-tc mt-4 max-w-[62ch] space-y-4">
          {zhHant ? (
            <>
              <p>在這類畫面中，使用者更需要快速知道目前是否正常、工作進行到哪裡，以及是否有需要注意的狀態。</p>
              <p>因此畫面會把狀態、進度與重要數值放在比詳細輸入資訊更高的視覺層級。</p>
            </>
          ) : (
            <>
              <p>Users needed to quickly understand what was running normally, what was in progress, and which conditions required attention.</p>
              <p>The visual hierarchy therefore prioritised status, progress, and key operational values over detailed input controls.</p>
            </>
          )}
        </div>
        <Reveal className="mt-10 block">
          <Evidence
            asset={{
              src: "/images/case03/case03-monitoring-dashboard.webp",
              alt: "Dark real-time monitoring dashboard showing machine status, progress, and production values at a glance"
            }}
            caption={
              zhHant
                ? "狀態、進度與重要數值優先於詳細輸入資訊，讓使用者能快速掌握現況。"
                : "Status, progress, and key values are prioritized over detailed input fields, so users can scan current conditions quickly."
            }
          />
        </Reveal>
      </Section>

      {/* 07 — My Role Across the System */}
      <Section index={5} register={register}>
        <Reveal>
          <SectionHeading
            label="07 — MY ROLE ACROSS THE SYSTEM"
            title={zhHant ? "我在這套系統中的角色" : "My Role Across the System"}
          />
        </Reveal>
        <div className="mt-10 grid gap-10 border-t cf-rule pt-10 sm:grid-cols-2">
          <div>
            <p className="cf-meta cf-dim">PM / SYSTEM ANALYST</p>
            <ul className="mt-4 space-y-3">
              {["Requirements", "Manufacturing workflows", "Business rules", "System logic"].map((item) => (
                <li key={item} className="cf-body text-[15px] leading-6">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="cf-meta cf-accent">MY ROLE</p>
            <ul className="mt-4 space-y-3">
              {(zhHant
                ? [
                    "UI/UX Design",
                    "Translating specifications into screens",
                    "Information and interaction hierarchy",
                    "Visual system",
                    "Desktop / tablet UI",
                    "Frontend implementation",
                    "Vector floorplan & SVG interaction",
                  ]
                : [
                    "UI/UX design",
                    "Translating specifications into screens",
                    "Information and interaction hierarchy",
                    "Visual system",
                    "Desktop and tablet UI",
                    "Frontend implementation",
                    "Vector floorplan and SVG interaction",
                  ]
              ).map((item) => (
                <li key={item} className="cf-body text-[15px] leading-6">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="cf-dim mt-8 max-w-[62ch] border-t cf-rule pt-6 text-[14px] leading-6">
          {zhHant
            ? "我的工作是在既有流程與技術限制中，找出最清楚、一致，而且能實際被使用的呈現方式。"
            : "My responsibility was to find the clearest and most consistent way to present an already-defined operational system within real technical constraints."}
        </p>
      </Section>

      {/* 08 — Reflection */}
      <Section index={6} register={register}>
        <Reveal>
          <SectionHeading label="08 — REFLECTION" title="Making Complexity Feel Simpler" />
        </Reveal>
        <p className="cf-body body-tc mt-8 max-w-[62ch]">
          {zhHant
            ? "這個專案讓我更理解，複雜系統的 UX 不一定是重新發明流程。很多時候，更重要的設計工作，是把大量規則、資訊與操作需求整理成使用者每天都能理解並重複使用的介面。"
            : "This project reinforced that complex operational UX is not always about inventing new workflows. Often, the harder design task is turning dense rules, information, and operational requirements into interfaces people can understand and reuse every day."}
        </p>
        <p className="cf-heading mt-8 text-[clamp(1.1rem,2vw,1.4rem)] font-medium">
          Complex requirements. Clear everyday interactions.
        </p>
      </Section>
    </>
  );
}
