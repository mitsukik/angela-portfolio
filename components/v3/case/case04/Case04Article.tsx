"use client";

import type { CSSProperties } from "react";
import type { Locale } from "@/data/locale";
import type { Project } from "@/data/projects";
import { CASE_OPENINGS } from "@/data/case-studies/openings";
import { CASE_SYSTEM_CHAPTERS, chapterEyebrow } from "@/data/case-studies/chapters";
import { CaseFourHeroPhones, ComposedEvidence } from "@/components/design-samples/case-final/CaseFourFinalContent";
import { StateScrubber } from "@/components/design-samples/case-final/StateScrubber";
import { CaseHeroCta, type CaseHeroCtaItem } from "../CaseHeroCta";
import { Case04Journey } from "./Case04Journey";
import { CASE04_V2, CASE04_V2_ASPECT, homeStates, inputPatterns, journeyChapters } from "./case04Media";
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
 * CASE04 (LABO65) in the unified CASE System V3 — five sections (Angela,
 * 2026-10-12): 00 Project Overview · 01 The Challenge · 02 My Role & Approach
 * · 03 Key Design Decisions · 04 Outcome. Labels, anchors and Nemu lines come
 * from data/case-studies/chapters.ts (one source for eyebrows, Remote/TOC,
 * mobile menu and scroll targets).
 *
 * Evidence rule: one design decision = one primary evidence block — A the
 * input-pattern switcher, B the Home State Explorer, C the recorded journey.
 * The hero phones are not reused as standalone evidence; the long-form
 * "before" questionnaire appears once (§01). Every screen is a capture of the
 * LABO65 V2 prototype (case04Media.ts); LABO65 branding, the employer name,
 * Five-Element, chakra, Hz and quota UI are approved and shown unaltered.
 * Earlier, longer versions of this page (and their media) live in Git history
 * and private-archive/.
 */

const CH = CASE_SYSTEM_CHAPTERS["04"];
const IMG = "/images/case04";
const VERSION = "case04-v2";

export function Case04Article({ locale, project }: { locale: Locale; project: Project }) {
  const zh = locale === "zh";
  const o = CASE_OPENINGS["04"][locale];
  const eb = (i: number) => chapterEyebrow(CH[i], locale);
  const links = o.links ?? [];
  const isApp = (l: { href: string }) => l.href === "https://labo65-app.vercel.app/auth/login";
  // §5: primary = App prototype; secondary = Web Staging Build, Landing Page prototype (original order).
  const ctas: CaseHeroCtaItem[] = [...links.filter(isApp), ...links.filter((l) => !isApp(l))];
  // §2 #2: Web / App are status values (lime).
  const meta = o.infoRows.map((r) => (r.label === "Web" || r.label === "App" ? { ...r, accent: true } : r));

  const challenges = zh
    ? [
        ["資訊量大的長問卷", "多組問題集中在單一長頁面，選取方式重複，也缺少進度提示。"],
        ["片段化的產品體驗", "個人資料、生成、聆聽與歷史紀錄各自發展，缺少連貫的流程。"],
        ["非同步生成與恢復", "生成需要等待；失敗與斷線要能保留輸入並重試，同時受行動裝置限制。"],
      ]
    : [
        ["A long, information-heavy questionnaire", "Many question groups on one page, repeated selection controls and no sense of progress."],
        ["A fragmented experience", "Onboarding, generation, listening and history had developed separately, without one continuous flow."],
        ["Asynchronous generation and recovery", "Generation takes time; failures and lost connections must keep input and allow retry, within mobile constraints."],
      ];

  const led = zh
    ? ["LABO65 的 UX/UI 重整與資訊架構", "核心使用流程、互動與狀態設計", "可重複使用的元件與介面規則", "互動原型"]
    : ["LABO65's UX/UI redesign and information architecture", "Core user flows, interactions and states", "Reusable components and interface rules", "The interactive prototype"];
  const collaborated = zh
    ? ["與另一位 UI Designer 協調設計分工與產出", "與前端／後端工程師確認可行性、交付與實作對齊", "與 PM 確認需求與範疇"]
    : ["Coordinated design work with another UI Designer", "Worked with front-end and back-end engineers on feasibility, handoff and implementation alignment", "Aligned requirements and scope with the PM"];
  const approach = zh
    ? [
        { title: "理解", note: "檢視既有可運作版本與需求" },
        { title: "結構", note: "重整流程、資訊架構與狀態" },
        { title: "設計", note: "互動、介面與可重用元件" },
        { title: "驗證與交付", note: "以互動原型呈現流程與狀態轉換，與工程確認可行性後交付" },
      ]
    : [
        { title: "Understand", note: "Review the working version and requirements" },
        { title: "Structure", note: "Restructure flows, IA and states" },
        { title: "Design", note: "Interactions, UI and reusable components" },
        { title: "Validate & Handoff", note: "Prototype the flow and state transitions; confirm feasibility with engineering and hand off" },
      ];
  const journey = zh ? ["個人資料", "引導式輸入", "生成", "聆聽", "歷史紀錄", "再次返回"] : ["Profile Setup", "Guided Input", "Generate", "Listen", "History", "Return"];
  const deliverables = zh
    ? [
        ["串連的 UX 流程與狀態規格", "核心流程、生成生命週期，以及錯誤與恢復狀態。"],
        ["可重複使用的 UI 規則", "導覽、選取狀態、字體、間距與狀態呈現的共用 Design System。"],
        ["考量行動限制的設計交付", "等待、鍵盤與斷線等限制反映在流程與操作位置，並與工程確認可行性。"],
        ["可操作的互動原型", "呈現完整流程與狀態轉換，作為設計證據。"],
      ]
    : [
        ["Connected UX flows and state specs", "Core flows, the generation lifecycle, and error and recovery states."],
        ["Reusable UI patterns", "A shared design system for navigation, selection, type, spacing and state presentation."],
        ["Implementation-oriented handoff", "Waiting, the keyboard and lost connections shaped flows and action placement, with feasibility confirmed by engineering."],
        ["A working interactive prototype", "Shows the full flow and state transitions, as design evidence."],
      ];

  return (
    <>
      <CaseHero
        caseNumber={project.number}
        category={zh ? project.category.zh : project.category.en}
        period={project.year}
        label={eb(0)}
        title={o.title}
        titleLines={o.titleLines}
        lead={o.subtitle}
        mobileCtaFirst
      >
        {o.summary.map((p) => <p key={p} className="cv3-summary">{p}</p>)}
        <CaseMetadata rows={meta} wide={["範疇", "Scope"]} />
        <CaseHeroCta
          items={ctas}
          note={zh
            ? "互動原型以模擬資料運作：登入、聲景生成與下載皆為模擬，播放使用示意音檔，未連接正式後端。"
            : "The interactive prototype runs on simulated data: sign-in, soundscape generation and downloads are simulated, playback uses a placeholder track, and it is not connected to a production backend."}
        />
      </CaseHero>

      <CaseMedia frame="hero" heroFirst caption={zh ? "畫面反映目前開發階段，介面與細節可能持續調整。" : "Screens reflect the current development stage; interface and details may continue to change."}>
        <CaseOriginalModule locale={locale} version={VERSION}>
          <div className="cv3-hero-phones">
            <CaseFourHeroPhones locale={locale} assets={CASE04_V2.hero} />
          </div>
        </CaseOriginalModule>
      </CaseMedia>

      {/* 01 — The Challenge: the engineer-built long form (the case's only "before" image) · three problems */}
      <CaseSection id={CH[1].anchor}>
        <CaseSectionHeader
          eyebrow={eb(1)}
          title={zh ? "既有產品可以運作，但體驗沒有串起來" : "The Product Worked, but the Experience Didn't Hold Together"}
          paragraphs={[zh ? "我加入時，產品已可運作，但存在三個設計問題：" : "When I joined, the product already worked, but it had three design problems:"]}
        />
        <div className="cv3-grid case04-challenge" data-variant="compare" style={{ "--cv3-grid-cols": "minmax(0, 0.8fr) minmax(0, 1.4fr)" } as CSSProperties}>
          <div className="cv3-compare" data-tone="before">
            <p className="cv3-card-kicker">{zh ? "改版前・既有工程版本" : "BEFORE · EXISTING ENGINEERING VERSION"}</p>
            <CaseOriginalModule locale={locale} version={VERSION}>
              <ComposedEvidence
                matted
                asset={{ src: `${IMG}/case04-questionnaire-before-v2.webp`, alt: "Engineer-built daily questionnaire shown as two separate long-scroll captures, stacked with a visible gap" }}
                aspectClassName="aspect-[1080/4736] max-h-[480px]"
                caption={zh ? "每日問卷：改版前的單一長頁面。" : "Daily questionnaire: the single long page before the redesign."}
              />
            </CaseOriginalModule>
          </div>
          <ol className="case04-challenge-list cv3-list-reset">
            {challenges.map(([title, body], i) => (
              <CaseCard key={title} as="li" kicker={`0${i + 1}`} title={title}>
                <p className="cv3-p">{body}</p>
              </CaseCard>
            ))}
          </ol>
        </div>
      </CaseSection>

      {/* 02 — My Role & Approach: led vs collaborated · four-step approach */}
      <CaseSection id={CH[2].anchor}>
        <CaseSectionHeader
          eyebrow={eb(2)}
          title={zh ? "主導 UX/UI 重整，與設計和工程協作完成" : "Leading the Redesign, Working With Design and Engineering"}
        />
        <CaseContentGrid variant="cards-2">
          <CaseCard tone="accent" kicker={zh ? "我主導" : "I LED"}>
            <ul className="case04-bullets">{led.map((t) => <li key={t} className="cv3-p">{t}</li>)}</ul>
          </CaseCard>
          <CaseCard kicker={zh ? "我協作" : "I COLLABORATED ON"}>
            <ul className="case04-bullets">{collaborated.map((t) => <li key={t} className="cv3-p">{t}</li>)}</ul>
          </CaseCard>
        </CaseContentGrid>
        <p className="cv3-card-kicker">{zh ? "做法" : "APPROACH"}</p>
        <CasePipeline label={zh ? "做法：理解、結構、設計、驗證與交付" : "Approach: Understand, Structure, Design, Validate & Handoff"} steps={approach} lang={zh ? "zh-Hant" : "en"} />
      </CaseSection>

      {/* 03 — Key Design Decisions: A switcher · B State Explorer · C recorded journey (one evidence block each) */}
      <CaseSection id={CH[3].anchor}>
        <CaseSectionHeader eyebrow={eb(3)} title={zh ? "三個關鍵設計決策" : "Three Key Design Decisions"} />

        <CaseDecision label={zh ? "決策 A・引導式輸入" : "DECISION A · GUIDED INPUT"} title={zh ? "把長問卷拆成一步一題的引導流程" : "Turning the Long Questionnaire Into One-Question Steps"}>
          <p className="cv3-p">
            {zh
              ? "我把長問卷拆成 7 個具明確進度的步驟，每一步只問一件事，並依問題內容選用合適的操作方式；導覽與選取狀態在整段流程中保持一致。"
              : "I split the long questionnaire into seven steps with explicit progress, each asking one thing, and chose each question's control by what it needed, while keeping navigation and selected states consistent across the flow."}
          </p>
          <CaseOriginalModule locale={locale} version={VERSION}>
            <StateScrubber
              label={zh ? "引導式輸入的互動方式" : "Guided input interaction patterns"}
              states={inputPatterns(locale)}
              aspect={CASE04_V2_ASPECT}
              mobileStageFirst
            />
          </CaseOriginalModule>
        </CaseDecision>

        <CaseDecision label={zh ? "決策 B・狀態導向首頁" : "DECISION B · STATE-AWARE HOME"} title={zh ? "首頁依使用者狀態改變主要內容與操作" : "A Home That Changes With the User's State"}>
          <p className="cv3-p">
            {zh
              ? "個人化內容需要時間生成，不能只靠會卡住畫面的載入。首頁主卡依目前階段切換內容與主要操作：生成時可以離開；失敗或斷線時保留輸入、直接重試；播放中斷也保留進度。"
              : "Generation takes time, so a blocking loading screen wasn't enough. Home's hero card changes its content and primary action with the user's state: users can leave while it generates; failures and lost connections keep their input for a direct retry; playback errors keep listening progress."}
          </p>
          <CaseOriginalModule locale={locale} version={VERSION}>
            <StateScrubber
              label={zh ? "首頁狀態" : "Home states"}
              states={homeStates(locale)}
              aspect={CASE04_V2_ASPECT}
              variant="explorer"
            />
          </CaseOriginalModule>
        </CaseDecision>

        <CaseDecision label={zh ? "決策 C・連續的產品旅程" : "DECISION C · CONNECTED JOURNEY"} title={zh ? "把輸入、生成、聆聽與紀錄串成一條流程" : "One Continuous Journey, From Input to History"}>
          <p className="cv3-p">
            {zh
              ? "首次設定、每日輸入、非同步生成、聆聽與再次使用共用同一套操作邏輯，而不是各自形成獨立流程。"
              : "First-time setup, daily input, asynchronous generation, listening and return use share one interaction model instead of each becoming a separate flow."}
          </p>
          <ol className="cv3-journey cv3-list-reset" aria-label={zh ? `產品旅程：${journey.join("、")}` : `Product journey: ${journey.join(", ")}`}>
            {journey.map((step, i) => (
              <li key={step}>
                <span className="cv3-journey-n" lang="en">0{i + 1}</span>
                <span className="cv3-journey-l">{step}</span>
                <span aria-hidden="true" className="cv3-journey-a">{i < journey.length - 1 ? "→" : "↺"}</span>
              </li>
            ))}
          </ol>
          <CaseOriginalModule locale={locale} version={VERSION}>
            <Case04Journey
              src={CASE04_V2.journey.src}
              poster={CASE04_V2.journey.poster}
              duration={CASE04_V2.journey.duration}
              chapters={journeyChapters(locale)}
              label={zh ? "操作錄影章節" : "Walkthrough chapters"}
              railLabel={zh ? "6 個章節・點選即跳轉" : "6 CHAPTERS · SELECT TO JUMP"}
              videoLabel={zh
                ? "LABO65 V2 互動原型的實際操作錄影（無聲）：從首頁開始生成今日聲景，依序完成 7 個引導步驟（含第 4 步今天的脈輪），等待生成、開始聆聽，再回到首頁與聆聽紀錄。"
                : "Silent screen recording of the LABO65 V2 interactive prototype: starting from Home, completing all seven guided steps (including step 4, today's chakra), waiting for generation, listening, then returning to Home and history."}
              zh={zh}
            />
          </CaseOriginalModule>
          <p className="cv3-caption">
            {zh
              ? "LABO65 V2 互動原型的單次連續操作錄影，以原速呈現，7 個引導步驟完整收錄、中間未剪接；登入與生成為模擬，播放使用示意音檔，錄影無聲。"
              : "One continuous, real-time recording of the LABO65 V2 interactive prototype, with all seven guided steps and no cuts; sign-in and generation are simulated, playback uses a placeholder track, and the recording is silent."}
          </p>
        </CaseDecision>
      </CaseSection>

      {/* 04 — Outcome: four deliverables · real status (no claimed metrics) · takeaway */}
      <CaseSection id={CH[4].anchor}>
        <CaseSectionHeader eyebrow={eb(4)} title={zh ? "交付了什麼" : "What Was Delivered"} />
        <CaseContentGrid variant="cards-2" as="ol">
          {deliverables.map(([title, body], i) => (
            <CaseCard key={title} as="li" kicker={`0${i + 1}`} title={title}>
              <p className="cv3-p">{body}</p>
            </CaseCard>
          ))}
        </CaseContentGrid>
        <CaseClosingPanel>
          <p className="cv3-p">
            {zh
              ? "Web staging 版本已可使用，App 持續準備上架。公開的 V2 互動原型為獨立展示：登入、生成與相關服務皆為模擬，播放使用示意音檔。App 尚未完成正式上線，因此本案例不宣稱轉換率、留存率等上線後成效。"
              : "A Web staging build is available and the App is preparing for release. The public V2 prototype is a standalone demo: sign-in, generation and related services are simulated, and playback uses a placeholder track. As the App has not launched, this case claims no post-launch conversion or retention results."}
          </p>
        </CaseClosingPanel>
        <p className="cv3-h3 case04-takeaway">
          {zh
            ? "這個專案的重點，是把多個各自發展的複雜功能，整理成一套連貫、可重複使用的產品體驗。"
            : "The core of this project was turning several separately built, complex functions into one coherent, reusable product experience."}
        </p>
      </CaseSection>
    </>
  );
}
