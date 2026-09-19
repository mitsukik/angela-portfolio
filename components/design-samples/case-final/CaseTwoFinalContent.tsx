import Image from "next/image";
import type { ReactNode } from "react";
import type { Locale } from "@/data/locale";
import { Reveal } from "../Reveal";
import { HeroEvidenceReveal } from "./HeroEvidenceReveal";
import { CaseEvidenceViewerProvider, EvidenceTrigger } from "./CaseEvidenceViewer";
import { VideoEvidence, type VideoEvidenceAsset } from "./VideoEvidence";

type RegisterSection = (index: number, element: HTMLElement | null) => void;

const projects = {
  sdx: {
    name: "Shun De Xing / SDX",
    role: "UX/UI Designer · Frontend Support",
    focus: "Information Architecture · Content Hierarchy · Corporate Communication",
    url: "https://sdxdevelop.com/",
  },
  charming: {
    name: "Charming Clinic",
    role: "UX/UI Designer · Frontend Support",
    focus: "Service Discovery · Brand Trust · User Flow",
    url: "https://charmingvip.com/",
  },
  natex: {
    name: "NATEX",
    role: "UX/UI Designer · Frontend",
    focus: "B2B Communication · Technical Content Hierarchy · Responsive Execution",
    url: "https://www.natex.com.tw/",
  },
} as const;

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

function ProjectMeta({
  name,
  role,
  focus,
  url,
  zhHant,
}: {
  name: string;
  role: string;
  focus: string;
  url: string;
  zhHant: boolean;
}) {
  const localizedFocus = zhHant
    ? ({
        "Information Architecture · Content Hierarchy · Corporate Communication": "資訊架構 · 內容層級 · 企業溝通",
        "Service Discovery · Brand Trust · User Flow": "服務探索 · 品牌信任 · 使用流程",
        "B2B Communication · Technical Content Hierarchy · Responsive Execution": "B2B 溝通 · 技術內容層級 · 響應式實作",
      } as Record<string, string>)[focus] ?? focus
    : focus;
  return (
    <>
      <dl className="mt-8 border-t cf-rule">
        <div className="grid gap-2 border-b cf-rule py-4 sm:grid-cols-[7rem_1fr] sm:gap-5">
          <dt className="cf-meta cf-dim">{zhHant ? "專案" : "Project"}</dt>
          <dd className="cf-heading text-[16px] leading-7">{name}</dd>
        </div>
        <div className="grid gap-2 border-b cf-rule py-4 sm:grid-cols-[7rem_1fr] sm:gap-5">
          <dt className="cf-meta cf-dim">{zhHant ? "角色" : "Role"}</dt>
          <dd className="cf-body text-[15px] leading-7">{role}</dd>
        </div>
        <div className="grid gap-2 border-b cf-rule py-4 sm:grid-cols-[7rem_1fr] sm:gap-5">
          <dt className="cf-meta cf-dim">{zhHant ? "專注領域" : "Focus"}</dt>
          <dd className="cf-body text-[15px] leading-7">{localizedFocus}</dd>
        </div>
      </dl>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="case-link cf-meta cf-dim mt-5 inline-block"
      >
        {zhHant ? "前往網站 ↗" : "Visit Website ↗"}
      </a>
    </>
  );
}

type EvidenceAsset = {
  src: string;
  alt: string;
};

function EvidenceImage({
  asset,
  format = "landscape",
}: {
  asset: EvidenceAsset;
  format?: "landscape" | "portrait" | "crop";
}) {
  const aspect = {
    landscape: "aspect-[16/10]",
    portrait: "aspect-[4/5]",
    crop: "aspect-[4/3]",
  }[format];

  return (
    <div className={`cf-figure-frame relative ${aspect} overflow-hidden bg-white`}>
      <EvidenceTrigger asset={asset}>
        <Image
          src={asset.src}
          alt=""
          fill
          unoptimized
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="object-contain"
        />
      </EvidenceTrigger>
    </div>
  );
}

function EvidenceComposition({
  primary,
  primaryVideo,
  secondary,
  caption,
  className = "",
  zhHant = false,
}: {
  primary?: EvidenceAsset;
  primaryVideo?: VideoEvidenceAsset;
  secondary: EvidenceAsset;
  caption: string;
  className?: string;
  zhHant?: boolean;
}) {
  return (
    <figure className={className}>
      <div className="space-y-3">
        {primaryVideo ? (
          <VideoEvidence asset={primaryVideo} zhHant={zhHant} />
        ) : primary ? (
          <EvidenceImage asset={primary} />
        ) : null}
        <div className="ml-auto w-[86%] sm:w-[72%]">
          <EvidenceImage asset={secondary} format="crop" />
        </div>
      </div>
      <figcaption className="cf-figure-caption cf-meta mt-4">
        {caption}
      </figcaption>
    </figure>
  );
}

function DetailEvidence({
  asset,
  caption,
}: {
  asset: EvidenceAsset;
  caption: string;
}) {
  return (
    <figure>
      <EvidenceImage asset={asset} format="crop" />
      <figcaption className="cf-figure-caption cf-meta mt-4">{caption}</figcaption>
    </figure>
  );
}

// V2: optional per-device annotation lists (Section 06's "what changed and
// why" callouts) — additive only, existing/future callers that don't pass
// them render exactly as before.
function ResponsiveEvidence({
  project,
  desktop,
  mobile,
  desktopNotes,
  mobileNotes,
  caption,
  zhHant,
}: {
  project: string;
  desktop: EvidenceAsset;
  mobile: EvidenceAsset;
  desktopNotes?: string[];
  mobileNotes?: string[];
  caption: string;
  zhHant: boolean;
}) {
  return (
    <article className="border-t cf-rule pt-7">
      <div className="mb-5 flex items-baseline justify-between gap-5">
        <h3 className="cf-heading text-[18px] font-medium">{project}</h3>
        <p className="cf-meta cf-dim">{zhHant ? "桌面／行動裝置" : "Desktop / Mobile"}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_16rem] sm:items-start lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div>
          <EvidenceImage asset={desktop} />
          {desktopNotes && desktopNotes.length > 0 && (
            <ul className="mt-3 space-y-1">
              {desktopNotes.map((note) => (
                <li key={note} className="cf-dim text-[13px] leading-5">— {note}</li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <EvidenceImage asset={mobile} format="portrait" />
          {mobileNotes && mobileNotes.length > 0 && (
            <ul className="mt-3 space-y-1">
              {mobileNotes.map((note) => (
                <li key={note} className="cf-dim text-[13px] leading-5">— {note}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <p className="cf-figure-caption cf-meta mt-4">{caption}</p>
    </article>
  );
}

export function CaseTwoHeroEvidence({ locale }: { locale: Locale }) {
  const zhHant = locale === "zh";
  return (
    <figure className="mt-12 md:mt-16">
      <div className="cf-figure-frame relative aspect-[4/5] overflow-hidden bg-black/[0.035] sm:aspect-[16/8]">
        <HeroEvidenceReveal>
          <div className="absolute left-[3%] top-[4%] h-[42%] w-[88%] overflow-hidden border cf-rule bg-white sm:h-[68%] sm:w-[56%]">
            <Image
              src="/images/case02/evidence/sdx-home-desktop.webp"
              alt="Shun De Xing corporate website homepage"
              fill
              priority
              sizes="(min-width: 640px) 48vw, 88vw"
              className="object-cover object-top"
            />
            <span className="cf-meta absolute bottom-3 left-3 bg-white px-2 py-1 text-[#111]">SDX</span>
          </div>
          <div className="absolute right-[3%] top-[31%] h-[35%] w-[76%] overflow-hidden border cf-rule bg-white sm:top-[12%] sm:h-[54%] sm:w-[38%]">
            <Image
              src="/images/case02/evidence/charming-home-desktop.webp"
              alt="Charming Clinic website homepage"
              fill
              priority
              sizes="(min-width: 640px) 34vw, 76vw"
              className="object-cover object-top"
            />
            <span className="cf-meta absolute bottom-3 left-3 bg-white px-2 py-1 text-[#111]">Charming Clinic</span>
          </div>
          <div className="absolute bottom-[4%] left-[8%] h-[35%] w-[84%] overflow-hidden border cf-rule bg-white sm:bottom-[4%] sm:left-auto sm:right-[8%] sm:h-[48%] sm:w-[44%]">
            <Image
              src="/images/case02/evidence/natex-home-desktop.webp"
              alt="NATEX technology company website homepage"
              fill
              priority
              sizes="(min-width: 640px) 40vw, 84vw"
              className="object-cover object-top"
            />
            <span className="cf-meta absolute bottom-3 left-3 bg-white px-2 py-1 text-[#111]">NATEX</span>
          </div>
        </HeroEvidenceReveal>
      </div>
      <figcaption className="cf-figure-caption cf-meta mt-4">
        {zhHant ? "三種產業，對應三種不同的資訊與信任策略。" : "Three industries, three different approaches to information and trust."}
      </figcaption>
    </figure>
  );
}

function ProjectStoryHeading({ index, title }: { index: string; title: string }) {
  return (
    <div>
      <p className="cf-meta cf-accent">{index}</p>
      <h3 className="cf-heading mt-4 text-[clamp(1.75rem,3.2vw,3rem)] font-medium leading-[1.08]">
        {title}
      </h3>
    </div>
  );
}

// Small inline lead-in used inside 04A-C's body copy to make the
// Problem -> Design Decision -> Result structure explicit without a new
// component — reuses the same cf-meta/cf-dim label language already used
// everywhere else in this file (ProjectMeta's <dt>, DetailEvidence's
// captions), not a new visual language.
function StoryBeat({ label, children }: { label: string; children: ReactNode }) {
  return (
    <p className="cf-body body-tc">
      <span className="cf-meta cf-dim mr-2 align-middle">{label}</span>
      {children}
    </p>
  );
}

const contributionRows = [
  ["Requirements", "Yes", "Yes", "Yes"],
  ["Information Architecture / Flow", "Yes", "Yes", "Yes"],
  ["UX/UI Design", "Yes", "Yes", "Yes"],
  ["Content Direction", "Yes", "Yes", "Yes"],
  ["Content Production", "Partial", "No", "No"],
  ["Responsive Design", "Yes", "Yes", "Yes"],
  ["Frontend", "Partial", "Partial", "Yes"],
] as const;

const CONTRIBUTION_VALUE_ZH: Record<string, string> = { Yes: "是", No: "否", Partial: "部分" };
const CONTRIBUTION_LABEL_ZH: Record<string, string> = {
  Requirements: "需求釐清",
  "Information Architecture / Flow": "資訊架構／流程",
  "UX/UI Design": "UX/UI 設計",
  "Content Direction": "內容方向",
  "Content Production": "內容製作",
  "Responsive Design": "響應式設計",
  Frontend: "前端實作",
};

// V2: one reusable cross-project comparison table, used by both 02 (business
// context) and 05 (UX principle comparison) — same visual language as the
// existing contribution-matrix table below (cf-scroll-region/cf-rule/
// cf-meta/cf-heading/cf-body), not a new pattern.
type ComparisonRow = { label: string; values: readonly [string, string, string] };

function ComparisonTable({
  rows,
  rowHeaderLabel,
  ariaLabel,
}: {
  rows: readonly ComparisonRow[];
  rowHeaderLabel: string;
  ariaLabel: string;
}) {
  return (
    <div
      className="cf-scroll-region mt-10 w-full min-w-0 max-w-full overflow-x-auto"
      tabIndex={0}
      role="group"
      aria-label={ariaLabel}
    >
      <table className="w-full min-w-[46rem] border-collapse text-left">
        <thead>
          <tr className="border-y cf-rule">
            <th className="cf-meta py-4 pr-6 font-normal">{rowHeaderLabel}</th>
            <th className="cf-meta py-4 pr-6 font-normal">SDX</th>
            <th className="cf-meta py-4 pr-6 font-normal">Charming Clinic</th>
            <th className="cf-meta py-4 font-normal">NATEX</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b cf-rule">
              <th scope="row" className="cf-heading py-4 pr-6 text-[15px] font-medium">{row.label}</th>
              {row.values.map((value, index) => (
                <td key={index} className="cf-body py-4 pr-6 text-[15px]">{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CaseTwoFinalContent({ register, locale }: { register: RegisterSection; locale: Locale }) {
  const zhHant = locale === "zh";

  // 02 — business-context comparison. Every value is drawn from copy that
  // already existed in the pre-V2 "business needs" section and ProjectMeta's
  // focus fields — nothing new is asserted here.
  const businessComparisonRows: ComparisonRow[] = zhHant
    ? [
        { label: "商業情境", values: ["服務橫跨多個業務領域與市場", "涵蓋多樣的醫療與美容服務", "技術能力涵蓋軟體、IoT、資料與工業服務"] },
        { label: "受眾需求", values: ["快速理解服務範圍與適合的聯絡入口", "找到合適的療程並理解服務", "理解技術能力與應用方向"] },
        { label: "UX 重點", values: ["服務分類與導覽", "服務探索與信任建立", "技術轉譯與商業可信度"] },
        { label: "主要行動", values: ["商務洽詢", "預約／聯絡", "B2B 洽詢"] },
      ]
    : [
        { label: "Business Context", values: ["Services span multiple business lines and markets", "A wide range of medical and aesthetic services", "Technical capability across software, IoT, data, and industrial services"] },
        { label: "Audience Need", values: ["Quickly understand the service scope and find the right contact point", "Find the right treatment and understand the service", "Understand the technical capabilities and where they apply"] },
        { label: "UX Priority", values: ["Service categorization and navigation", "Service discovery and trust", "Technical translation and business credibility"] },
        { label: "Primary Action", values: ["Business inquiry", "Booking / contact", "B2B inquiry"] },
      ];

  // 05 — UX-principle comparison, values as specified.
  const principleComparisonRows: ComparisonRow[] = zhHant
    ? [
        { label: "受眾", values: ["企業 / 商務", "消費者 / 顧客", "B2B / 技術決策者"] },
        { label: "主要複雜度", values: ["服務範圍廣", "選擇與不確定感", "技術資訊密度高"] },
        { label: "信任機制", values: ["公司規模 / 企業可信度", "專業 / 安心感", "技術能力 / 專業證明"] },
        { label: "UX 重點", values: ["分類與導覽", "探索與決策", "理解與判斷"] },
        { label: "主要行動", values: ["商務洽詢", "預約 / 聯絡", "B2B 洽詢"] },
      ]
    : [
        { label: "Audience", values: ["Corporate / business", "Consumers / patients", "B2B / technical decision-makers"] },
        { label: "Main Complexity", values: ["Broad service range", "Choice and uncertainty", "High technical information density"] },
        { label: "Trust Mechanism", values: ["Company scale / corporate credibility", "Expertise / reassurance", "Technical capability / proven expertise"] },
        { label: "UX Emphasis", values: ["Categorization and navigation", "Exploration and decision-making", "Comprehension and judgment"] },
        { label: "Primary Action", values: ["Business inquiry", "Booking / contact", "B2B inquiry"] },
      ];

  return (
    <CaseEvidenceViewerProvider>
      {/* 01 — My Role. Moved from its previous position near the end (see
          HANDOFF) so the verified contribution/responsibility data reads
          before the individual project stories, not after them. Table and
          footnote content unchanged from the pre-V2 version. */}
      <Section index={0} register={register} divider={false}>
        <Reveal>
          <SectionHeading
            label={zhHant ? "01 — 我的角色" : "01 — MY ROLE"}
            title={zhHant ? "三個專案，不同的交付範圍" : "Three Projects, Different Delivery Scopes"}
            intro={
              zhHant
                ? "在進入各專案之前，先說明我在三個專案中實際負責的工作範圍。"
                : "Before diving into the individual projects, here’s what I was responsible for in each."
            }
          />
        </Reveal>
        <div
          className="cf-scroll-region mt-10 w-full min-w-0 max-w-full overflow-x-auto"
          tabIndex={0}
          role="group"
          aria-label={zhHant ? "跨專案貢獻範圍表格" : "Contribution table across projects"}
        >
          <table className="w-full min-w-[46rem] border-collapse text-left">
            <thead>
              <tr className="border-y cf-rule">
                <th className="cf-meta py-4 pr-6 font-normal">{zhHant ? "貢獻項目" : "Contribution"}</th>
                <th className="cf-meta py-4 pr-6 font-normal">SDX</th>
                <th className="cf-meta py-4 pr-6 font-normal">Charming Clinic</th>
                <th className="cf-meta py-4 font-normal">NATEX</th>
              </tr>
            </thead>
            <tbody>
              {contributionRows.map(([contribution, sdx, charming, natex]) => (
                <tr key={contribution} className="border-b cf-rule">
                  <th scope="row" className="cf-heading py-4 pr-6 text-[15px] font-medium">{zhHant ? CONTRIBUTION_LABEL_ZH[contribution] : contribution}</th>
                  {[sdx, charming, natex].map((value, index) => (
                    <td key={`${contribution}-${index}`} className="cf-body py-4 pr-6 text-[15px]">
                      {zhHant ? CONTRIBUTION_VALUE_ZH[value] : value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="cf-dim mt-5 max-w-[62ch] text-[14px] leading-6">
          {zhHant
            ? "內容方向指辨識體驗所需資訊，並與 PM 或客戶協調取得內容。SDX 另包含部分內容製作——我整理、調整並實際編排了客戶提供的素材與文案，但並非所有內容的原始撰寫者；Charming Clinic 與 NATEX 則不包含內容製作。"
            : "Content Direction means identifying what information the experience needs and coordinating with the PM or client to get it. SDX also included partial Content Production — I organized, refined, and assembled the copy and materials the client provided, though I wasn’t the original writer of all of it; Content Production wasn’t part of the role for Charming Clinic or NATEX."}
        </p>
      </Section>

      {/* 02 — the strategic thesis: three websites, three different
          problems. New comparison table; every value is already-verified
          copy from the pre-V2 business-needs section, restructured. */}
      <Section index={1} register={register}>
        <Reveal>
          <SectionHeading
            label={zhHant ? "02 — 相同是網站，不同的是問題" : "02 — SAME MEDIUM, DIFFERENT PROBLEMS"}
            title={zhHant ? "三個都是網站，但要解決的問題不同" : "Same Medium, Different Problems"}
            intro={
              zhHant
                ? "三個專案面對不同的受眾、資訊複雜度與信任需求，因此網站的資訊策略與主要行動也不同。"
                : "Each project faced a different audience, level of complexity, and set of trust requirements — so each site needed its own information strategy and primary action."
            }
          />
        </Reveal>
        <ComparisonTable
          rows={businessComparisonRows}
          rowHeaderLabel={zhHant ? "面向" : "Dimension"}
          ariaLabel={zhHant ? "跨專案商業情境比較表格" : "Cross-project business context comparison table"}
        />
      </Section>

      {/* 03 — the logic chain from business need to structure. Content
          (goal + ordered steps per project) is unchanged from the pre-V2
          "business needs" section — this is a relocation + reframed intro,
          not new research. */}
      <Section index={2} register={register}>
        <Reveal>
          <SectionHeading
            label={zhHant ? "03 — 從商業需求到資訊架構" : "03 — FROM BUSINESS NEEDS TO INFORMATION ARCHITECTURE"}
            title={zhHant ? "不同的業務，需要不同的資訊優先順序" : "Different Businesses, Different Information Priorities"}
            intro={
              zhHant
                ? "從商業情境出發，先確認使用者最需要理解什麼、在哪些節點需要建立信任，再決定資訊架構與畫面上的優先順序，最後導向明確的下一步。"
                : "I start with the business context: what does the audience need to understand first, and where does trust need to be established? From there, I shape the information architecture and page hierarchy, then guide users toward a clear next step."
            }
          />
        </Reveal>
        <div className="mt-12 grid border-t cf-rule lg:grid-cols-3">
          {(zhHant
            ? [
                ["SDX", "理解企業業務", ["廣泛的跨境服務", "清楚的服務架構", "企業可信度", "聯絡窗口"]],
                ["Charming Clinic", "找到合適的療程", ["療程需求", "服務資訊", "信任感", "預約"]],
                ["NATEX", "理解技術能力", ["解決方案", "專業能力", "商業可信度", "詢問"]],
              ]
            : [
                ["SDX", "Understand the business", ["Broad cross-border services", "Clear service structure", "Corporate credibility", "Contact"]],
                ["Charming Clinic", "Discover the right service", ["Treatment needs", "Service information", "Trust", "Booking"]],
                ["NATEX", "Understand technical capability", ["Solutions", "Expertise", "Business credibility", "Inquiry"]],
              ]
          ).map(([name, goal, steps], index) => (
            <article
              key={name as string}
              className="border-b cf-rule py-8 lg:border-r lg:px-7 lg:first:pl-0 lg:last:border-r-0"
            >
              <p className="cf-meta cf-accent">0{index + 1} / {name as string}</p>
              <h3 className="cf-heading mt-5 text-[clamp(1.35rem,2vw,1.8rem)] font-medium leading-tight">{goal as string}</h3>
              <ol className="mt-8 space-y-4">
                {(steps as string[]).map((step, stepIndex) => (
                  <li key={step} className="grid grid-cols-[2rem_1fr] items-start gap-3">
                    <span className="cf-meta cf-dim">{String(stepIndex + 1).padStart(2, "0")}</span>
                    <span className="cf-body text-[15px] leading-6">{step}</span>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </Section>

      {/* 04 — project stories. Structure, evidence components, videos, and
          stills are all unchanged. Body copy restructured into explicit
          Problem -> Design Decision -> Result beats; Evidence stays the
          existing video + supporting still (unchanged). */}
      <Section index={3} register={register}>
        <p className="cf-meta cf-section-label cf-accent md:whitespace-nowrap">{zhHant ? "04 — 專案故事" : "04 — PROJECT STORIES"}</p>
        <div className="mt-10">
        <ProjectStoryHeading index="04A / SDX" title={zhHant ? "整理龐大的企業服務內容" : "Organizing a Complex Corporate Offering"} />
        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <ProjectMeta {...projects.sdx} zhHant={zhHant} />
            <div className="mt-8 space-y-4">
              {zhHant ? (
                <>
                  <StoryBeat label="問題">Shun De Xing 的服務橫跨多個業務領域與市場，資訊量大，容易讓訪客難以快速掌握全貌。</StoryBeat>
                  <StoryBeat label="設計判斷">我先向客戶釐清服務內容與優先順序，再重新整理頁面流程與資訊層級，把廣泛的業務拆成較容易理解的服務入口，同時保留企業規模與可信度的呈現。</StoryBeat>
                  <StoryBeat label="設計結果">網站讓訪客可以先理解服務範圍，再逐步找到適合的內容與聯絡入口，而不需要先理解企業內部的組織方式。</StoryBeat>
                </>
              ) : (
                <>
                  <StoryBeat label="Problem">Shun De Xing&rsquo;s services span multiple business lines and markets, making the full offering difficult to grasp at a glance.</StoryBeat>
                  <StoryBeat label="Design Decision">I worked with the client to clarify priorities, then restructured the page flow and information hierarchy — breaking a broad service offering into clear entry points while still conveying the company&rsquo;s scale and credibility.</StoryBeat>
                  <StoryBeat label="Design Result">Visitors can first grasp the scope of services, then move toward the right content and contact point without needing to understand the company&rsquo;s internal structure.</StoryBeat>
                </>
              )}
            </div>
          </div>
          <Reveal className="lg:col-span-7">
            <EvidenceComposition
              zhHant={zhHant}
              primaryVideo={{
                webm: "/videos/case02/sdx-walkthrough.webm",
                mp4: "/videos/case02/sdx-walkthrough.mp4",
                poster: "/images/case02/evidence/sdx-walkthrough-poster.jpg",
                alt: zhHant
                  ? "Shun De Xing 官網實際瀏覽紀錄：從首頁滾動至服務架構區塊，再到跨國據點與合作實績。"
                  : "Live walkthrough of the Shun De Xing website scrolling from the homepage into its service structure, then into its cross-border presence and track record.",
              }}
              secondary={{
                src: "/images/case02/evidence/sdx-services-desktop.webp",
                alt: "Shun De Xing services page showing grouped business services and enterprise landing flow",
              }}
              caption={
                zhHant
                  ? "首頁先建立跨國商務定位；服務頁再將廣泛業務拆成可理解的入口與企業落地流程。"
                  : "The homepage establishes cross-border business positioning; the services page then breaks a wide offering into approachable entry points and an enterprise inquiry flow."
              }
            />
          </Reveal>
        </div>

        <div className="mt-14 border-t cf-rule pt-10 md:mt-16 md:pt-12">
        <ProjectStoryHeading index="04B / CHARMING CLINIC" title={zhHant ? "把服務轉化為清楚的顧客旅程" : "Turning Services into a Clear Customer Journey"} />
        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:items-start">
          <Reveal className="lg:col-span-7">
            <EvidenceComposition
              zhHant={zhHant}
              primaryVideo={{
                webm: "/videos/case02/charming-walkthrough.webm",
                mp4: "/videos/case02/charming-walkthrough.mp4",
                poster: "/images/case02/evidence/charming-walkthrough-poster.jpg",
                alt: zhHant
                  ? "Charming Clinic 官網實際瀏覽紀錄：從首頁滾動至熱門療程區塊，再到診所環境與信任資訊。"
                  : "Live walkthrough of the Charming Clinic website scrolling from the homepage into its treatment categories, then into the clinic environment and trust information.",
              }}
              secondary={{
                src: "/images/case02/evidence/charming-services-desktop.webp",
                alt: "Charming Clinic services page showing treatment categories and booking access",
              }}
              caption={
                zhHant
                  ? "首頁以診所環境與專業語氣建立信任；服務頁把療程分群，並保留直接預約入口。"
                  : "The homepage uses the clinic environment and a professional tone to put visitors at ease; the services page groups treatments and keeps a direct booking entry point."
              }
            />
          </Reveal>
          <div className="lg:col-span-5">
            <ProjectMeta {...projects.charming} zhHant={zhHant} />
            <div className="mt-8 space-y-4">
              {zhHant ? (
                <>
                  <StoryBeat label="問題">Charming Clinic 的醫療與美容服務項目多樣，需要在專業感與親近感之間取得平衡，同時幫助使用者找到合適的療程。</StoryBeat>
                  <StoryBeat label="設計判斷">我把原本容易形成服務清單的內容，重新整理成「探索療程 → 理解服務 → 建立信任 → 預約」的路徑，並透過資訊層級與明確入口降低選擇時的不確定感。</StoryBeat>
                  <StoryBeat label="設計結果">使用者可以從療程探索逐步理解服務內容，並在適合的節點直接進入預約。</StoryBeat>
                </>
              ) : (
                <>
                  <StoryBeat label="Problem">Charming Clinic offers a wide range of medical and aesthetic services. The site needed to feel both professional and approachable while still helping visitors find the right treatment.</StoryBeat>
                  <StoryBeat label="Design Decision">I restructured what could easily have become a flat service list into a clear path — explore treatments, understand the service, build trust, then book — using information hierarchy and clear entry points to reduce uncertainty during service selection.</StoryBeat>
                  <StoryBeat label="Design Result">The experience guides users from treatment discovery to service understanding, with clear opportunities to book at the right points.</StoryBeat>
                </>
              )}
            </div>
          </div>
        </div>
        </div>

        <div className="mt-14 border-t cf-rule pt-10 md:mt-16 md:pt-12">
        <ProjectStoryHeading index="04C / NATEX" title={zhHant ? "把技術專業轉譯給商務受眾" : "Translating Technical Expertise for Business Users"} />
        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-4">
            <ProjectMeta {...projects.natex} zhHant={zhHant} />
            <div className="mt-8 space-y-4">
              {zhHant ? (
                <>
                  <StoryBeat label="問題">NATEX 涵蓋軟體、IoT、資料與工業服務等技術能力，挑戰在於呈現技術深度，同時不讓商務受眾難以理解或導航。</StoryBeat>
                  <StoryBeat label="設計判斷">我將技術內容依能力與應用情境重新分層，先讓商務受眾理解 NATEX 能解決什麼問題，再進一步呈現技術能力、實際應用與專業證明。</StoryBeat>
                  <StoryBeat label="設計結果">網站讓商務受眾可以先掌握 NATEX 的能力範圍與應用方向，再依需要深入了解技術細節或提出洽詢。</StoryBeat>
                </>
              ) : (
                <>
                  <StoryBeat label="Problem">NATEX&rsquo;s capabilities span software, IoT, data, and industrial services. The challenge was to communicate that depth without overwhelming business audiences or making the site difficult to navigate.</StoryBeat>
                  <StoryBeat label="Design Decision">I restructured the technical content by capability and use case, leading with the business problems NATEX can solve before introducing technical depth, real applications, and proof of expertise.</StoryBeat>
                  <StoryBeat label="Design Result">The experience lets business visitors understand NATEX&rsquo;s range of capabilities and application areas first, then explore technical details or make an inquiry as needed.</StoryBeat>
                </>
              )}
            </div>
          </div>
          <Reveal className="lg:col-span-8">
            <EvidenceComposition
              zhHant={zhHant}
              primaryVideo={{
                webm: "/videos/case02/natex-walkthrough.webm",
                mp4: "/videos/case02/natex-walkthrough.mp4",
                poster: "/images/case02/evidence/natex-walkthrough-poster.jpg",
                alt: zhHant
                  ? "NATEX 官網實際瀏覽紀錄：從首頁滾動至專業服務分類，再到系統開發流程。"
                  : "Live walkthrough of the NATEX website scrolling from the homepage into its professional service categories, then into its system development workflow.",
              }}
              secondary={{
                src: "/images/case02/evidence/natex-showcase-desktop.webp",
                alt: "NATEX solution detail page connecting service categories with an implemented management system",
              }}
              caption={
                zhHant
                  ? "服務總覽先建立技術範圍；方案頁再用實際系統畫面連接能力與應用情境。"
                  : "The services overview sets the technical scope; the solutions page then connects that capability to real system screens and use cases."
              }
            />
          </Reveal>
        </div>
        </div>
        </div>
      </Section>

      {/* 05 — cross-project UX-principle comparison, then the three shared
          principles. The 3 existing stills (originally one per project,
          each its own "principle") are repositioned as supporting evidence
          under principle 02 specifically (they are all trust-at-decision-
          point evidence) rather than forced across all three principles. */}
      <Section index={4} register={register}>
        <Reveal>
          <SectionHeading
            label={zhHant ? "05 — 不同情境，不同設計判斷" : "05 — DIFFERENT CONTEXTS, DIFFERENT DESIGN DECISIONS"}
            title={zhHant ? "不同的設計方案，共同的 UX 原則" : "Different Design Decisions, Shared UX Principles"}
            intro={
              zhHant
                ? "把三個專案並排比較，可以看出不同產業如何影響資訊架構、信任建立方式與主要行動；但底層仍有幾個一致的 UX 原則。"
                : "Side by side, the three projects show how industry shapes information architecture, trust signals, and primary actions. Underneath those differences, a few UX principles remain consistent."
            }
          />
        </Reveal>
        <ComparisonTable
          rows={principleComparisonRows}
          rowHeaderLabel={zhHant ? "面向" : "Dimension"}
          ariaLabel={zhHant ? "跨專案 UX 原則比較表格" : "Cross-project UX principle comparison table"}
        />

        <div className="mt-16 space-y-12">
          <article>
            <p className="cf-meta cf-accent">01</p>
            <h3 className="cf-heading mt-3 text-[20px] font-medium">{zhHant ? "清楚的資訊優先順序" : "Clear Information Priorities"}</h3>
            <p className="cf-body body-tc mt-3 max-w-[62ch]">
              {zhHant
                ? "先決定使用者此刻最需要理解什麼，再依照決策需要安排資訊層級。"
                : "Decide what the user most needs to understand right now, then structure the information hierarchy around that."}
            </p>
          </article>

          <article>
            <p className="cf-meta cf-accent">02</p>
            <h3 className="cf-heading mt-3 text-[20px] font-medium">{zhHant ? "在決策點建立信任" : "Build Trust at the Decision Point"}</h3>
            <p className="cf-body body-tc mt-3 max-w-[62ch]">
              {zhHant
                ? "不同產業需要不同的信任訊號，但可信度資訊都應該出現在使用者真正需要它的位置。"
                : "Different industries call for different trust signals, but those signals should appear where they matter most in the decision process."}
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              <Reveal>
                <DetailEvidence
                  asset={{
                    src: "/images/case02/evidence/sdx-context-desktop.webp",
                    alt: "Shun De Xing page showing multi-country office locations and established business cooperation",
                  }}
                  caption={
                    zhHant
                      ? "多國據點與長期合作紀錄，具體呈現跨市場的營運規模。"
                      : "Multiple office locations and an established partner history make the cross-market scale of the business concrete."
                  }
                />
              </Reveal>
              <Reveal>
                <DetailEvidence
                  asset={{
                    src: "/images/case02/evidence/charming-booking-desktop.webp",
                    alt: "Charming Clinic contact section showing clinic location, opening hours, and booking action",
                  }}
                  caption={
                    zhHant
                      ? "診所位置、營業資訊與直接預約入口共同支撐信任與行動。"
                      : "Location, hours, and a direct booking link work together to make the next step easy."
                  }
                />
              </Reveal>
              <Reveal>
                <DetailEvidence
                  asset={{
                    src: "/images/case02/evidence/natex-credentials-desktop.webp",
                    alt: "NATEX company section showing expertise, certification, and business credibility",
                  }}
                  caption={
                    zhHant
                      ? "公司能力、資安認證與合作脈絡建立 B2B 可信度。"
                      : "Company background, security certifications, and partnership history give B2B visitors reason to take the company seriously."
                  }
                />
              </Reveal>
            </div>
          </article>

          <article>
            <p className="cf-meta cf-accent">03</p>
            <h3 className="cf-heading mt-3 text-[20px] font-medium">{zhHant ? "讓下一步清楚可見" : "Make the Next Step Visible"}</h3>
            <p className="cf-body body-tc mt-3 max-w-[62ch]">
              {zhHant
                ? "每個重要頁面都應該讓使用者知道下一步可以做什麼——洽詢、預約，或進一步了解。"
                : "Every key page should make the next step clear — get in touch, book, or learn more."}
            </p>
          </article>
        </div>
      </Section>

      {/* 06 — responsive, kept deliberately compact and SDX-only. Charming
          and NATEX's recovered mobile assets exist (see HANDOFF) but are
          not used here: their only available mobile shots are the home
          page, not the services page SDX is shown on, and mixing page
          types would weaken rather than strengthen this evidence. */}
      <Section index={5} register={register}>
        <Reveal>
          <SectionHeading
            label={zhHant ? "06 — 響應式資訊優先順序" : "06 — RESPONSIVE INFORMATION PRIORITIES"}
            title={zhHant ? "響應式設計不是把桌面版縮小" : "Responsive Design Isn't Just a Scaled-Down Desktop"}
            intro={
              zhHant
                ? "在較小的螢幕中，我會重新判斷資訊層級、閱讀順序、內容密度與主要行動的位置，而不是單純縮放桌面版面。"
                : "On smaller screens, I rethink the information hierarchy, reading order, content density, and placement of the primary action rather than simply scaling down the desktop layout."
            }
          />
        </Reveal>
        <div className="mt-10">
          <Reveal>
            <ResponsiveEvidence
              zhHant={zhHant}
              project={projects.sdx.name}
              desktop={{ src: "/images/case02/evidence/sdx-service-desktop.webp", alt: "Shun De Xing services page on desktop" }}
              mobile={{ src: "/images/case02/evidence/sdx-service-mobile.webp", alt: "Shun De Xing services page on mobile" }}
              desktopNotes={zhHant ? ["較多資訊可以同時比較"] : ["More information visible for side-by-side comparison"]}
              mobileNotes={
                zhHant
                  ? ["重新建立閱讀順序", "降低同時出現的資訊密度", "保留主要行動"]
                  : ["Reading order rebuilt for a single column", "Less information visible at once", "Primary action stays in place"]
              }
              caption={
                zhHant
                  ? "版面依螢幕尺寸重新安排資訊層級與順序，而不是單純縮放。"
                  : "The layout reorganizes hierarchy and reading order for each screen size rather than simply scaling down."
              }
            />
          </Reveal>
        </div>
      </Section>

      {/* 07 — new. Connects the design decisions above to how each project
          actually reached production, reusing the same verified delivery
          facts already stated in 04's stories and 01's contribution table
          (SDX: partial frontend support / Charming: partial-initial frontend
          support / NATEX: full frontend) — no new claim is made here. */}
      <Section index={6} register={register}>
        <Reveal>
          <SectionHeading
            label={zhHant ? "07 — 從設計到實際網站" : "07 — FROM DESIGN TO LIVE WEBSITE"}
            title={zhHant ? "設計決策如何落地，因專案而不同" : "Different Paths from Design to Launch"}
            intro={
              zhHant
                ? "三個專案都從需求與資訊架構開始，但從設計到實際上線，我參與的交付範圍並不相同。"
                : "All three projects started with requirements and information architecture, but my implementation involvement varied from project to project."
            }
          />
        </Reveal>
        <div className="mt-12 grid border-t cf-rule md:grid-cols-3">
          <article className="border-b cf-rule py-6 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0">
            <p className="cf-meta cf-accent">01 / SDX</p>
            <p className="cf-heading mt-4 text-[16px] font-medium leading-6">
              {zhHant ? "內容編排與部分前端，協助設計落地" : "Content assembly and partial frontend involvement"}
            </p>
            <p className="cf-body mt-3 text-[14px] leading-6">
              {zhHant
                ? "我規劃各頁內容需求與資訊結構，向客戶取得所需素材與文案後進行整理、調整與頁面編排，並實際建立網站內容，同時參與部分前端實作。"
                : "I defined the content requirements and structure for each page, gathered source materials from the client, organized and refined the copy, assembled the page content, and supported part of the frontend implementation."}
            </p>
          </article>
          <article className="border-b cf-rule py-6 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0">
            <p className="cf-meta cf-accent">02 / CHARMING CLINIC</p>
            <p className="cf-heading mt-4 text-[16px] font-medium leading-6">
              {zhHant ? "參與初期前端，協助設計落地" : "UX/UI design with initial frontend support"}
            </p>
            <p className="cf-body mt-3 text-[14px] leading-6">
              {zhHant
                ? "除了 UX/UI 設計，我也支援初期前端實作，協助將設計轉化為實際頁面。"
                : "Beyond UX/UI design, I also supported the initial frontend build, helping turn the design into real pages."}
            </p>
          </article>
          <article className="border-b cf-rule py-6 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0">
            <p className="cf-meta cf-accent">03 / NATEX</p>
            <p className="cf-heading mt-4 text-[16px] font-medium leading-6">
              {zhHant ? "從設計到前端實作全程參與" : "End-to-end from IA through frontend implementation"}
            </p>
            <p className="cf-body mt-3 text-[14px] leading-6">
              {zhHant
                ? "從資訊架構、UX/UI 設計、響應式版型到前端實作，我皆有參與，是三個專案中交付範圍最完整的一個。"
                : "I was involved end-to-end — from information architecture and UX/UI design through responsive layouts and frontend implementation. This was the broadest delivery scope of the three."}
            </p>
          </article>
        </div>
      </Section>

      {/* 08 — Takeaway. Replaces the previous longer reflection with the
          explicit Business Context -> Information Structure -> Digital
          Experience chain, stated once, concisely. Capabilities list kept
          unchanged. */}
      <Section index={7} register={register}>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Reveal>
              <SectionHeading
                label={zhHant ? "08 — 結語" : "08 — TAKEAWAY"}
                title={zhHant ? "商業情境 → 資訊架構 → 數位體驗" : "Business Context → Information Structure → Digital Experience"}
              />
            </Reveal>
            {zhHant ? (
              <div className="mt-8 max-w-[62ch] space-y-4">
                <p className="cf-body body-tc">
                  這三個專案共同呈現了一件事：網站不應從套用版型開始，而是先理解企業需要傳達什麼、使用者需要先知道什麼，再把這些判斷轉化為資訊架構與介面的優先順序。
                </p>
                <p className="cf-body body-tc">
                  不同的商業情境，自然會形成不同的數位體驗。
                </p>
              </div>
            ) : (
              <div className="mt-8 max-w-[62ch] space-y-4">
                <p className="cf-body body-tc">
                  All three projects point to the same idea: a website shouldn&rsquo;t start with a template. It should start with understanding what the business needs to communicate and what users need to know first, then translating those decisions into information architecture and interface priorities.
                </p>
                <p className="cf-body body-tc">
                  Different business contexts naturally produce different digital experiences.
                </p>
              </div>
            )}
          </div>

          <aside className="border-t cf-rule pt-7 lg:col-span-4 lg:mt-0">
            <p className="cf-meta cf-accent">{zhHant ? "能力" : "CAPABILITIES"}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {(zhHant ? ["資訊架構", "客戶溝通", "UX/UI 設計", "品牌溝通", "響應式網頁", "前端實作"] : ["Information Architecture", "Client Communication", "UX/UI Design", "Brand Communication", "Responsive Web", "Frontend Implementation"]).map((item) => (
                <li key={item} className="cf-tag">{item}</li>
              ))}
            </ul>
          </aside>
        </div>
      </Section>
    </CaseEvidenceViewerProvider>
  );
}
