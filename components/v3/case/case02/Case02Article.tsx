"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import type { Locale } from "@/data/locale";
import type { Project } from "@/data/projects";
import { CASE_OPENINGS } from "@/data/case-studies/openings";
import { CASE_SYSTEM_CHAPTERS, chapterEyebrow } from "@/data/case-studies/chapters";
import { EvidenceTrigger } from "@/components/design-samples/case-final/CaseEvidenceViewer";
import { VideoEvidence } from "@/components/design-samples/case-final/VideoEvidence";
import {
  CASE02_PROJECTS,
  CONTRIBUTION_LABEL_ZH,
  CONTRIBUTION_VALUE_ZH,
  EvidenceImage,
  contributionRows,
} from "@/components/design-samples/case-final/CaseTwoFinalContent";
import { CaseHeroCta } from "../CaseHeroCta";
import {
  CaseCard,
  CaseContentGrid,
  CaseDecision,
  CaseHero,
  CaseMedia,
  CaseMetadata,
  CaseOriginalModule,
  CaseSection,
  CaseSectionHeader,
} from "../system/CaseSystem";

/*
 * CASE02 in the unified CASE System V3 (CASE_SYSTEM.md §2, §4, §5; visual
 * reference "CASE System V3.dc.html" → CASE02). Chapters renumbered 00–07
 * without a gap and the three stories 04A–C → 03A–C; content and order are
 * unchanged. Every string is verbatim from production (openings.ts ←
 * CaseStudyPrototype, CaseTwoFinalContent.tsx); every screenshot and
 * walkthrough renders through the original EvidenceImage / VideoEvidence
 * (evidence viewer, pause control, reduced-motion poster). No hero CTA
 * (§5): each story keeps its own original 前往網站 ↗ link.
 */

const CH = CASE_SYSTEM_CHAPTERS["02"];
const VERSION = "case02-v1";
const P = CASE02_PROJECTS;

const FOCUS_ZH: Record<string, string> = {
  "Information Architecture · Content Hierarchy · Corporate Communication": "資訊架構 · 內容層級 · 企業溝通",
  "Service Discovery · Brand Trust · User Flow": "服務探索 · 品牌信任 · 使用流程",
  "B2B Communication · Technical Content Hierarchy · Responsive Execution": "B2B 溝通 · 技術內容層級 · 響應式實作",
};

type ProjectKey = keyof typeof P;

function Story({
  locale,
  label,
  title,
  project,
  paragraphs,
  video,
  secondary,
  caption,
}: {
  locale: Locale;
  label: string;
  title: string;
  project: ProjectKey;
  paragraphs: string[];
  video: { webm: string; mp4: string; poster: string; alt: string };
  secondary: { src: string; alt: string };
  caption: string;
}) {
  const zh = locale === "zh";
  const p = P[project];
  return (
    <CaseDecision label={label} title={title}>
      <CaseMetadata
        keepOrder
        rows={[
          { label: zh ? "專案" : "Project", value: p.name },
          { label: zh ? "角色" : "Role", value: p.role },
          { label: zh ? "專注領域" : "Focus", value: zh ? FOCUS_ZH[p.focus] ?? p.focus : p.focus },
        ]}
      />
      {paragraphs.map((t) => <p key={t} className="cv3-p">{t}</p>)}
      <CaseHeroCta allSecondary compact items={[{ href: p.url, label: zh ? "前往網站 ↗" : "Visit Website ↗" }]} />
      <figure className="cv3-figure">
        <CaseOriginalModule locale={locale} version={VERSION}>
          <div className="cv3-grid cv3-story-media" data-variant="media-2">
            <div className="cv3-media">
              <VideoEvidence asset={video} zhHant={zh} />
            </div>
            <EvidenceImage asset={secondary} format="crop" />
          </div>
        </CaseOriginalModule>
        <figcaption className="cv3-caption">{caption}</figcaption>
      </figure>
    </CaseDecision>
  );
}

function Mark({ value, zh }: { value: "Yes" | "No" | "Partial"; zh: boolean }) {
  return (
    <span className="cv3-mark" data-value={value}>
      <span aria-hidden="true" className="cv3-mark-glyph" />
      <span className="cv3-mark-text">{zh ? CONTRIBUTION_VALUE_ZH[value] : value}</span>
    </span>
  );
}

export function Case02Article({ locale, project }: { locale: Locale; project: Project }) {
  const zh = locale === "zh";
  const o = CASE_OPENINGS["02"][locale];
  const eb = (i: number) => chapterEyebrow(CH[i], locale);
  const homes = [
    { src: "/images/case02/evidence/sdx-home-desktop.webp", alt: "Shun De Xing corporate website homepage", tag: "SDX" },
    { src: "/images/case02/evidence/charming-home-desktop.webp", alt: "Charming Clinic website homepage", tag: "Charming Clinic" },
    { src: "/images/case02/evidence/natex-home-desktop.webp", alt: "NATEX technology company website homepage", tag: "NATEX" },
  ];
  const projectsByCol: ProjectKey[] = ["sdx", "charming", "natex"];

  return (
    <>
      <CaseHero
        caseNumber={project.number}
        category={zh ? project.category.zh : project.category.en}
        period={project.year}
        label={eb(0)}
        title={o.title}
        titleLines={o.titleLines}
        subline={o.subtitle}
        lead={o.summary[0]}
      >
        {o.summary.slice(1).map((p) => <p key={p} className="cv3-summary">{p}</p>)}
        <CaseMetadata rows={o.infoRows} />
      </CaseHero>

      <CaseMedia frame="hero" heroFirst caption={zh ? "三種產業，各自轉化為不同的資訊與信任策略。" : "Three industries, each translated into a distinct information and trust strategy."}>
        <div className="cv3-grid cv3-hero-homes" data-variant="media-3">
          {homes.map((h, i) => (
            <div key={h.src} className="cv3-home-item">
              <div className="cv3-home">
                <div className="cv3-ratio" style={{ aspectRatio: "1440 / 900" }}>
                  <EvidenceTrigger asset={{ src: h.src, alt: h.alt }}>
                    <Image src={h.src} alt="" fill priority={i === 0} unoptimized sizes="(min-width: 1200px) 22vw, (min-width: 768px) 45vw, 90vw" className="object-contain" />
                  </EvidenceTrigger>
                </div>
              </div>
              <span className="cv3-home-tag" lang="en">{h.tag}</span>
            </div>
          ))}
        </div>
      </CaseMedia>

      {/* 01 — 總覽 (was 02): cards-3 — project + role */}
      <CaseSection id={CH[1].anchor}>
        <CaseSectionHeader
          eyebrow={eb(1)}
          title={zh ? "三個網站，三種不同的商業情境。" : "Three websites. Three different business contexts."}
          paragraphs={[
            zh
              ? "三個專案橫跨企業服務、醫療美容與科技產業。我從商業需求出發，依各自的受眾與溝通目標整理資訊架構、使用流程與介面層級。"
              : "Three projects across corporate services, healthcare, and technology. In each case, I started from the business needs and shaped the information architecture, flow, and interface around the audience and communication goals.",
          ]}
        />
        <CaseContentGrid variant="cards-3" as="ul">
          {projectsByCol.map((k, i) => (
            <CaseCard key={k} as="li" kicker={`0${i + 1}`} title={<span lang="en">{P[k].name}</span>}>
              <p className="cv3-p" lang="en">{P[k].role}</p>
            </CaseCard>
          ))}
        </CaseContentGrid>
      </CaseSection>

      {/* 02 — 從商業需求到網站架構 (was 03): cards-3, each with a 4-step list */}
      <CaseSection id={CH[2].anchor}>
        <CaseSectionHeader
          eyebrow={eb(2)}
          title={zh ? "不同的業務，需要不同的資訊優先順序" : "Different Businesses, Different Information Priorities"}
          paragraphs={[
            zh
              ? "我沒有把同一套網站公式套用在三個品牌上，而是先確認使用者需要理解什麼、信任什麼，以及最終要採取什麼行動。"
              : "Rather than applying one website formula to all three brands, I started by identifying what each audience needed to understand, what would earn their confidence, and what action they were ultimately meant to take.",
          ]}
        />
        <CaseContentGrid variant="cards-3">
          {(zh
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
          ).map(([name, goal, steps], i) => (
            <CaseCard key={name as string} tone="accent" kicker={`0${i + 1} / ${name as string}`} title={goal as string}>
              <ol className="cv3-steps">
                {(steps as string[]).map((step, s) => (
                  <li key={step}>
                    <span lang="en">{String(s + 1).padStart(2, "0")}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </CaseCard>
          ))}
        </CaseContentGrid>
      </CaseSection>

      {/* 03 — 專案故事 (was 04): three identical story blocks 03A–03C, text first (§2 #4: no H2) */}
      <CaseSection id={CH[3].anchor}>
        <CaseSectionHeader eyebrow={eb(3)} />
        <Story
          locale={locale}
          label="03A / SDX"
          title={zh ? "整理龐大的企業服務內容" : "Organizing a Complex Corporate Offering"}
          project="sdx"
          paragraphs={zh ? [
            "Shun De Xing 的服務橫跨多個業務領域與市場，因此資訊清晰度與結構尤其重要。",
            "我直接向客戶釐清需求、定義頁面流程與資訊層級、完成 UX/UI，並與 PM 協調補齊各區塊所需素材，讓廣泛服務更容易理解。",
          ] : [
            "Shun De Xing’s services span multiple business lines and markets, which made how the information was organized especially important.",
            "I worked directly with the client to clarify requirements, defined the page flow and information structure, and designed the UI/UX. I also identified where content was missing and coordinated with the PM to fill those gaps, making the broad service offering easier to follow.",
          ]}
          video={{
            webm: "/videos/case02/sdx-walkthrough.webm",
            mp4: "/videos/case02/sdx-walkthrough.mp4",
            poster: "/images/case02/evidence/sdx-walkthrough-poster.jpg",
            alt: zh
              ? "Shun De Xing 官網實際瀏覽紀錄：從首頁滾動至服務架構區塊，再到跨國據點與合作實績。"
              : "Live walkthrough of the Shun De Xing website scrolling from the homepage into its service structure, then into its cross-border presence and track record.",
          }}
          secondary={{ src: "/images/case02/evidence/sdx-services-desktop.webp", alt: "Shun De Xing services page showing grouped business services and enterprise landing flow" }}
          caption={zh
            ? "首頁先建立跨國商務定位；服務頁再將廣泛業務拆成可理解的入口與企業落地流程。"
            : "The homepage establishes cross-border business positioning; the services page then breaks a wide offering into approachable entry points and an enterprise inquiry flow."}
        />
        <Story
          locale={locale}
          label="03B / CHARMING CLINIC"
          title={zh ? "把服務轉化為清楚的顧客旅程" : "Turning Services into a Clear Customer Journey"}
          project="charming"
          paragraphs={zh ? [
            "Charming Clinic 需要把多樣的醫療與美容服務，整理成容易理解、專業且親近的資訊體驗。",
            "我直接與客戶確認需求、建立服務探索流程、完成 UX/UI 並支援初期前端，讓使用者從找到療程、理解服務逐步前往預約。",
          ] : [
            "Charming Clinic needed its many medical and aesthetic services organized into an experience that felt professional, approachable, and easy to follow.",
            "I confirmed requirements directly with the client, built the service-discovery flow, designed the UX/UI, and supported the initial frontend build — guiding users from finding a treatment to booking it.",
          ]}
          video={{
            webm: "/videos/case02/charming-walkthrough.webm",
            mp4: "/videos/case02/charming-walkthrough.mp4",
            poster: "/images/case02/evidence/charming-walkthrough-poster.jpg",
            alt: zh
              ? "Charming Clinic 官網實際瀏覽紀錄：從首頁滾動至熱門療程區塊，再到診所環境與信任資訊。"
              : "Live walkthrough of the Charming Clinic website scrolling from the homepage into its treatment categories, then into the clinic environment and trust information.",
          }}
          secondary={{ src: "/images/case02/evidence/charming-services-desktop.webp", alt: "Charming Clinic services page showing treatment categories and booking access" }}
          caption={zh
            ? "首頁以診所環境與專業語氣建立信任；服務頁把療程分群，並保留直接預約入口。"
            : "The homepage uses the clinic environment and a professional tone to put visitors at ease; the services page groups treatments and keeps a direct booking entry point."}
        />
        <Story
          locale={locale}
          label="03C / NATEX"
          title={zh ? "把技術專業轉譯給商務受眾" : "Translating Technical Expertise for Business Users"}
          project="natex"
          paragraphs={zh ? [
            "NATEX 涵蓋軟體、IoT、資料與工業服務等技術能力，主要挑戰是呈現技術深度，同時不讓商務受眾難以理解或導航。",
            "除內容製作外，我負責需求、資訊架構、UX flow、介面設計、responsive layouts 與 frontend implementation，是 CASE02 中交付範圍最完整的專案。",
          ] : [
            "NATEX’s technical capabilities span software, IoT, data, and industrial services. The main challenge was presenting that depth without losing business audiences in the navigation.",
            "Outside of content production, I owned requirements, information architecture, UX flow, interface design, responsive layouts, and frontend implementation — the broadest delivery scope across the three projects.",
          ]}
          video={{
            webm: "/videos/case02/natex-walkthrough.webm",
            mp4: "/videos/case02/natex-walkthrough.mp4",
            poster: "/images/case02/evidence/natex-walkthrough-poster.jpg",
            alt: zh
              ? "NATEX 官網實際瀏覽紀錄：從首頁滾動至專業服務分類，再到系統開發流程。"
              : "Live walkthrough of the NATEX website scrolling from the homepage into its professional service categories, then into its system development workflow.",
          }}
          secondary={{ src: "/images/case02/evidence/natex-showcase-desktop.webp", alt: "NATEX solution detail page connecting service categories with an implemented management system" }}
          caption={zh
            ? "服務總覽先建立技術範圍；方案頁再用實際系統畫面連接能力與應用情境。"
            : "The services overview sets the technical scope; the solutions page then connects that capability to real system screens and use cases."}
        />
      </CaseSection>

      {/* 04 — 同一原則，不同表現 (was 05): media-3 — screenshot → H3 → sentence → caption */}
      <CaseSection id={CH[4].anchor}>
        <CaseSectionHeader
          eyebrow={eb(4)}
          title={zh ? "同一個設計原則，依品牌目標形成不同表達" : "Shared Principles, Different Expressions"}
          paragraphs={[
            zh
              ? "我沒有把同一套視覺公式套用在每個專案上，而是依各自的受眾、產業與溝通目標形塑網站。"
              : "Rather than applying the same visual formula across projects, each website was shaped around its audience, industry, and communication goals.",
          ]}
        />
        <div className="cv3-grid" data-variant="media-3">
          {[
            { src: "/images/case02/evidence/sdx-context-desktop.webp", alt: "Shun De Xing page showing multi-country office locations and established business cooperation", h: zh ? "清楚的架構" : "Clear Structure", s: zh ? "協助使用者理解廣泛且跨領域的企業服務。" : "Helps users make sense of a broad, cross-industry set of corporate services.", c: zh ? "多國據點與長期合作紀錄，具體呈現跨市場的營運規模。" : "Multiple office locations and an established partner history make the cross-market scale of the business concrete." },
            { src: "/images/case02/evidence/charming-booking-desktop.webp", alt: "Charming Clinic contact section showing clinic location, opening hours, and booking action", h: zh ? "建立信任" : "Build Trust", s: zh ? "在服務資訊與安心、專業的品牌感受之間取得平衡。" : "Balances service information with a reassuring, professional brand feel.", c: zh ? "診所位置、營業資訊與直接預約入口共同支撐信任與行動。" : "Location, hours, and a direct booking link work together to make the next step easy." },
            { src: "/images/case02/evidence/natex-credentials-desktop.webp", alt: "NATEX company section showing expertise, certification, and business credibility", h: zh ? "傳達專業" : "Communicate Expertise", s: zh ? "呈現技術能力，同時避免讓商務受眾承受過多資訊。" : "Presents technical capability without overwhelming a business audience with detail.", c: zh ? "公司能力、資安認證與合作脈絡建立 B2B 可信度。" : "Company background, security certifications, and partnership history give B2B visitors reason to take the company seriously." },
          ].map((it) => (
            <article key={it.src} className="cv3-principle">
              <CaseOriginalModule locale={locale} version={VERSION}>
                <EvidenceImage asset={{ src: it.src, alt: it.alt }} format="crop" />
              </CaseOriginalModule>
              <h3 className="cv3-h3 cv3-principle-h">{it.h}</h3>
              <p className="cv3-p">{it.s}</p>
              <p className="cv3-caption">{it.c}</p>
            </article>
          ))}
        </div>
      </CaseSection>

      {/* 05 — 跨裝置設計 (was 06): compare 3 : 1 (desktop + mobile), bottom-aligned */}
      <CaseSection id={CH[5].anchor}>
        <CaseSectionHeader
          eyebrow={eb(5)}
          title={zh ? "跨裝置保留正確的資訊順序與行動" : "Designing Beyond Desktop"}
          paragraphs={[
            zh
              ? "版面不是單純把桌面版縮小，而是依螢幕尺寸重新安排內容層級、閱讀節奏與主要行動，讓每個品牌在較小畫面上仍能傳達正確資訊。"
              : "These layouts aren’t the desktop version scaled down — content, reading order, and key actions were rearranged for each screen size, so every brand still communicates the right information on a smaller display.",
          ]}
        />
        <div className="cv3-compare-head">
          <h3 className="cv3-card-title" lang="en">{P.sdx.name}</h3>
          <p className="cv3-card-kicker">{zh ? "桌面／行動裝置" : "Desktop / Mobile"}</p>
        </div>
        <figure className="cv3-figure">
          <CaseOriginalModule locale={locale} version={VERSION}>
            <div className="cv3-grid" data-variant="compare" style={{ "--cv3-grid-cols": "minmax(0, 3fr) minmax(0, 1fr)" } as CSSProperties}>
              <EvidenceImage asset={{ src: "/images/case02/evidence/sdx-service-desktop.webp", alt: "Shun De Xing services page on desktop" }} />
              <EvidenceImage asset={{ src: "/images/case02/evidence/sdx-service-mobile.webp", alt: "Shun De Xing services page on mobile" }} format="portrait" />
            </div>
          </CaseOriginalModule>
          <figcaption className="cv3-caption">
            {zh ? "版面調整保留了內容層級與可讀性，適應不同螢幕尺寸。" : "The layout adjusts to different screen sizes while keeping content order and readability intact."}
          </figcaption>
        </figure>
      </CaseSection>

      {/* 06 — 我在各專案中的角色 (was 07): matrix; per-project cards on phones */}
      <CaseSection id={CH[6].anchor}>
        <CaseSectionHeader eyebrow={eb(6)} title={zh ? "相同的設計責任，不同的交付範圍" : "My Role Across the Projects"} />
        <table className="cv3-matrix" aria-label={zh ? "跨專案貢獻範圍表格" : "Contribution table across projects"}>
          <thead>
            <tr>
              <th scope="col">{zh ? "貢獻項目" : "Contribution"}</th>
              <th scope="col" lang="en">SDX</th>
              <th scope="col" lang="en">Charming Clinic</th>
              <th scope="col" lang="en">NATEX</th>
            </tr>
          </thead>
          <tbody>
            {contributionRows.map(([contribution, sdx, charming, natex]) => (
              <tr key={contribution}>
                <th scope="row">{zh ? CONTRIBUTION_LABEL_ZH[contribution] : contribution}</th>
                {[sdx, charming, natex].map((v, i) => (
                  <td key={i}><Mark value={v} zh={zh} /></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="cv3-matrix-cards">
          {(["SDX", "Charming Clinic", "NATEX"] as const).map((name, col) => (
            <details key={name} className="cv3-matrix-card" open={col === 0}>
              <summary>
                <span lang="en">{name}</span>
                <span aria-hidden="true" className="cv3-matrix-chev">⌄</span>
              </summary>
              <dl>
                {contributionRows.map((row) => (
                  <div key={row[0]}>
                    <dt>{zh ? CONTRIBUTION_LABEL_ZH[row[0]] : row[0]}</dt>
                    <dd><Mark value={row[col + 1] as "Yes" | "No" | "Partial"} zh={zh} /></dd>
                  </div>
                ))}
              </dl>
            </details>
          ))}
        </div>
        <p className="cv3-caption">
          {zh
            ? "內容方向指辨識體驗所需資訊，並與 PM 或客戶協調取得內容。SDX 另包含部分內容製作——我整理、調整並實際編排了客戶提供的素材與文案，但並非所有內容的原始撰寫者；Charming Clinic 與 NATEX 則不包含內容製作。"
            : "Content Direction refers to identifying the information required for the experience and coordinating with the PM or client to obtain it. SDX also included partial Content Production — I organized, refined, and assembled the copy and materials the client provided, though I wasn’t the original writer of all of it; Content Production was not part of the role for Charming Clinic or NATEX."}
        </p>
      </CaseSection>

      {/* 07 — 反思 (was 08): CaseClosing — capability chips */}
      <CaseSection id={CH[7].anchor}>
        <CaseSectionHeader
          eyebrow={eb(7)}
          title={zh ? "有效的網頁設計，不是把同一種視覺風格套用在所有地方。" : "Effective web design isn’t about applying one visual style everywhere."}
          paragraphs={[
            zh
              ? "在這些專案中，設計方式隨著商業情境調整——從整理龐大的企業服務，到引導使用者找到合適的療程，再到傳達技術專業。"
              : "Across these projects, the design approach changed with the business context — from structuring broad corporate services, to guiding treatment discovery, to communicating technical expertise.",
          ]}
        />
        <dl className="cv3-delivered">
          <dt>{zh ? "能力" : "CAPABILITIES"}</dt>
          <dd>
            <ul className="cv3-chips cv3-list-reset">
              {(zh ? ["資訊架構", "客戶溝通", "UX/UI 設計", "品牌適配", "響應式網頁", "前端實作"] : ["Information Architecture", "Client Communication", "UX/UI Design", "Brand Adaptation", "Responsive Web", "Frontend Execution"]).map((item) => (
                <li key={item}><span className="cv3-chip">{item}</span></li>
              ))}
            </ul>
          </dd>
        </dl>
      </CaseSection>
    </>
  );
}
