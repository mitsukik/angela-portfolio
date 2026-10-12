"use client";

import type { CSSProperties } from "react";
import type { Locale } from "@/data/locale";
import type { Project } from "@/data/projects";
import { CASE_OPENINGS } from "@/data/case-studies/openings";
import { CASE_SYSTEM_CHAPTERS, chapterEyebrow } from "@/data/case-studies/chapters";
import { CaseFourHeroPhones, ComposedEvidence, PhoneEvidence } from "@/components/design-samples/case-final/CaseFourFinalContent";
import { StateScrubber } from "@/components/design-samples/case-final/StateScrubber";
import { CaseHeroCta, type CaseHeroCtaItem } from "../CaseHeroCta";
import { Case04Journey } from "./Case04Journey";
import { CASE04_V2, CASE04_V2_ASPECT, homeStates, inputPatterns, journeyChapters, systemPatterns } from "./case04Media";
import {
  CaseCard,

  CaseClosingPanel,
  CaseContentGrid,
  CaseHero,
  CaseMedia,
  CaseMetadata,
  CaseOriginalModule,
  CaseSection,
  CaseSectionHeader,
  CaseStateCard,
} from "../system/CaseSystem";

/*
 * CASE04 in the unified CASE System V3 (CASE_SYSTEM.md §2, §4, §5; visual
 * reference "CASE System V3.dc.html" → CASE04). Every string is copied
 * verbatim from production (openings.ts ← CaseStudyPrototype,
 * CaseFourFinalContent.tsx); every screen renders through the original
 * PhoneEvidence / ComposedEvidence tiles (evidence viewer kept). §03's
 * recovery states use the spec's State cards (number · title · body · lime
 * protection tag) with their three screens as media-3 phones — the same
 * three states, copy and images the V2 State Scrubber stepped through.
 *
 * Evidence V2 (2026-10-12): every screen is a capture of the LABO65 V2
 * prototype (live build, real states via its own screen list, see
 * case04Media.ts); the V1 screenshots are archived. §03 Home states and
 * §02 / §05 patterns use the existing StateScrubber; §04 adds the recorded
 * journey (Case04Journey). Disclosure (2026-10-12): LABO65 branding, the
 * employer name, Five-Element, chakra, Hz and quota UI are approved and shown
 * unaltered; all seven generate steps appear (see case04Media.ts).
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
  const phone = (src: string, alt: string, caption: string, className = "") => (
    <CaseOriginalModule locale={locale} version={VERSION}>
      <PhoneEvidence className={className} asset={{ src, alt }} caption={caption} />
    </CaseOriginalModule>
  );

  const states = zh
    ? [
        { name: "生成中，可離開此頁", detail: "生成期間可以離開畫面，之後再從對應狀態返回，不必停在會卡住整個畫面的載入畫面。", protects: "不必停留等待", src: CASE04_V2.recovery.generating.src, alt: "生成今日聲景中的畫面，提示使用者可以先離開、稍後再返回" },
        { name: "生成失敗，答案已保留", detail: "生成失敗或網路中斷時，原先已完成的輸入會保留，使用者可以直接重試或稍後再試，不需要重新走完整段問卷。", protects: "保護：已完成的輸入", src: CASE04_V2.recovery.failed.src, alt: "生成失敗狀態，問卷答案已保留，並提供重試與稍後再試的操作" },
        { name: "播放錯誤，進度已保留", detail: "「你的聲景與播放進度不會被刪除」——播放中斷時保留聲景與聆聽進度，並提供重試。", protects: "保護：聆聽進度", src: CASE04_V2.recovery.playback.src, alt: "播放錯誤狀態，聲景與播放進度已保留，並提供重試操作" },
      ]
    : [
        { name: "Generating — safe to leave", detail: "Users can leave while generation continues and return later through the appropriate state, instead of waiting on a blocking loading screen.", protects: "No blocking wait", src: CASE04_V2.recovery.generating.src, alt: CASE04_V2.recovery.generating.alt },
        { name: "Failed — answers preserved", detail: "If generation fails or connectivity is interrupted, previously entered information is preserved so the user can retry instead of restarting the questionnaire.", protects: "Protects: input effort", src: CASE04_V2.recovery.failed.src, alt: CASE04_V2.recovery.failed.alt },
        { name: "Playback error — progress preserved", detail: "“Your soundscape and playback progress won't be deleted.” The soundscape and listening progress survive the error, with a retry action.", protects: "Protects: listening progress", src: CASE04_V2.recovery.playback.src, alt: CASE04_V2.recovery.playback.alt },
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
        <CaseMetadata rows={meta} />
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

      {/* 01 — The Challenge & My Role: text · 3 role rows (CASE03 §02 style, "me" lime) */}
      <CaseSection id={CH[1].anchor}>
        <CaseSectionHeader
          eyebrow={eb(1)}
          title={zh ? "在既有產品上重新建立完整體驗" : "Redesigning an Existing Product Without Starting Over"}
          paragraphs={zh ? [
            "我接手時，產品已經具備可操作的核心功能，但不同功能之間還沒有形成一致的完整體驗。",
            "原有問卷是一個連續往下滑的長表單；個人化內容需要實際生成時間；失敗與網路中斷需要更完整的恢復方式；首頁、播放器與歷史紀錄之間，也需要重新整理彼此的關係。",
            "我的工作不是重新開始，而是在既有產品與技術基礎上，把這些功能重新整理成一套較清楚的行動產品流程。",
          ] : [
            "The early version already supported the product's core functionality, but several parts of the experience had developed independently.",
            "The questionnaire relied on a long scrolling form. Personalized content required meaningful generation time. Failure and connectivity issues needed clearer recovery paths, while Home, playback and history needed to work as one continuous experience.",
            "My role was to reorganize those existing functions into a clearer mobile product journey while working within the product and engineering foundation already in place.",
          ]}
        />
        <CaseContentGrid variant="cards-3" as="ol">
          {(zh
            ? [["PM", "需求、範疇與專案協調"], ["Full-stack Engineer", "早期功能流程、既有技術基礎與產品實作"], ["UI/UX 設計師／我", "檢視既有體驗、重整流程、互動與狀態設計、建立可重用的介面系統與原型，與工程確認可行性"]]
            : [["PM", "Requirements, scope, and coordination"], ["Full-stack Engineer", "Early functional flow, existing technical foundation, and implementation"], ["UI/UX Designer / Me", "Reviewed the existing experience, restructured flows, designed interactions and states, built a reusable UI system and prototype, and confirmed feasibility with engineering"]]
          ).map(([role, desc], i) => (
            <CaseCard key={role} as="li" tone={i === 2 ? "accent" : i === 0 ? "muted" : undefined} kicker={`0${i + 1}`} title={role}>
              <p className="cv3-p">{desc}</p>
            </CaseCard>
          ))}
        </CaseContentGrid>
      </CaseSection>

      {/* 02 — From Long Form to Guided Input: compare (before dashed / after lime) · media-3 phones */}
      <CaseSection id={CH[2].anchor}>
        <CaseSectionHeader
          eyebrow={eb(2)}
          title={zh ? "把一個連續問卷重新整理成分階段流程" : "Turning One Continuous Questionnaire Into a Staged Experience"}
          paragraphs={zh ? [
            "原本的問卷把多組問題集中在單一長頁面，並重複使用相近的選取方式。",
            "我將流程重新設計成具明確進度的分步式體驗，並依照不同問題的內容，選擇更適合的互動方式。",
          ] : [
            "The original questionnaire placed multiple groups of questions on one long page using repeated selection patterns.",
            "I redesigned it as a guided multi-step flow with explicit progress and interaction patterns selected according to what each question needed.",
          ]}
        />
        <div className="cv3-grid" data-variant="compare" style={{ "--cv3-grid-cols": "minmax(0, 1fr) minmax(0, 2fr)" } as CSSProperties}>
          <div className="cv3-compare" data-tone="before">
            <p className="cv3-card-kicker">{zh ? "既有工程版本・改版前" : "EXISTING ENGINEERING VERSION · BEFORE"}</p>
            <CaseOriginalModule locale={locale} version={VERSION}>
              <ComposedEvidence
                matted
                asset={{ src: `${IMG}/case04-questionnaire-before-v2.webp`, alt: "Engineer-built daily questionnaire shown as two separate long-scroll captures, stacked with a visible gap" }}
                aspectClassName="aspect-[1080/4736] max-h-[520px]"
                caption={zh ? "多個分類與大量選項集中在同一個長頁面中，沒有分段，也缺少清楚的進度提示。" : "Multiple categories and a large number of options are packed onto one long page, with no segmentation and no clear sense of progress."}
              />
            </CaseOriginalModule>
          </div>
          <div className="cv3-compare" data-tone="after">
            <p className="cv3-card-kicker">{zh ? "重新設計後" : "REDESIGNED"}</p>
            <CaseOriginalModule locale={locale} version={VERSION}>
              <ComposedEvidence
                matted
                asset={CASE04_V2.stepsOverview}
                aspectClassName="aspect-[2544/2620] max-h-[520px]"
                caption={zh ? "拆成多個階段，每一步只問一件事，並用明確的進度取代不確定要填多久的長表單。" : "Split into staged steps, each asking one thing, with explicit progress replacing a long form of uncertain length."}
              />
            </CaseOriginalModule>
          </div>
        </div>
        <p className="cv3-p">
          {zh
            ? "重點不只是把一張長表單拆成數個畫面，而是讓不同類型的輸入有更合適的操作方式，同時維持整段流程在導覽與選取狀態上的一致性。"
            : "Rather than treating every input as the same type of control, the redesign uses more appropriate interaction models for different kinds of decisions while keeping navigation and selected states consistent throughout the flow."}
        </p>
        <p className="cv3-card-kicker">{zh ? "依問題選擇的輸入方式" : "INPUT PATTERNS, CHOSEN PER QUESTION"}</p>
        <CaseOriginalModule locale={locale} version={VERSION}>
          <StateScrubber
            label={zh ? "引導式輸入的互動方式" : "Guided input interaction patterns"}
            states={inputPatterns(locale)}
            aspect={CASE04_V2_ASPECT}
            mobileStageFirst
          />
        </CaseOriginalModule>
      </CaseSection>

      {/* 03 — Designing a State-aware Product: State cards ×3 + media-3 phones · media-4 Home states */}
      <CaseSection id={CH[3].anchor}>
        <CaseSectionHeader
          eyebrow={eb(3)}
          title={zh ? "不只設計成功流程，也處理等待、失敗與返回" : "The Experience Had to Work Beyond the Happy Path"}
          paragraphs={zh ? [
            "個人化內容需要一定時間生成，因此不能只依賴一個會卡住整個畫面的載入畫面。",
            "我重新定義生成、失敗、重試、已完成生成、聆聽中與完成等主要狀態，以及使用者在不同狀態下可以採取的下一步操作。",
            "生成期間可以離開畫面，之後再從對應狀態返回；若遇到生成失敗或網路中斷，原先已完成的輸入也會保留，讓使用者可以重試，而不需要重新走完整段問卷。",
          ] : [
            "Personalized content takes time to generate, so a blocking loading screen was not enough.",
            "I defined how the product should behave across key states including generation, failure, retry, ready, listening and completion.",
            "Users can leave while generation continues and return later through the appropriate state. If generation fails or connectivity is interrupted, previously entered information is preserved so the user can retry instead of restarting the questionnaire.",
          ]}
        />
        <p className="cv3-card-kicker">{zh ? "生成與播放的恢復狀態" : "Generation and playback recovery states"}</p>
        <CaseContentGrid variant="cards-3" as="ol" label={zh ? "生成與播放的恢復狀態" : "Generation and playback recovery states"}>
          {states.map((s, i) => (
            <li key={s.name} className="cv3-state-col">
              <CaseStateCard no={`0${i + 1}`} title={s.name} body={s.detail} protects={s.protects} />
            </li>
          ))}
        </CaseContentGrid>
        {/* The three screens, in the same order as their state cards (captions = state names). */}
        <div className="cv3-grid cv3-state-phones" data-variant="media-3" data-phones="true">
          {states.map((s) => (
            <div key={s.src} className="cv3-phone-col">{phone(s.src, s.alt, s.name)}</div>
          ))}
        </div>
        <p className="cv3-caption">{zh ? "發生錯誤時，優先保護使用者已經投入的時間與進度。" : "Recovery should protect effort the user has already invested."}</p>
        <p className="cv3-p">
          {zh
            ? "首頁也依照同一套狀態邏輯重新整理。主要內容與 CTA 會依使用者目前所在階段改變，而不是把所有功能以相同權重一起呈現。"
            : "Home was redesigned around the same state model. Its primary content and action change according to where the user currently is in the experience rather than presenting every function with equal priority."}
        </p>
        <p className="cv3-card-kicker">{zh ? "同一個首頁，六種狀態" : "ONE HOME, SIX STATES"}</p>
        <CaseOriginalModule locale={locale} version={VERSION}>
          <StateScrubber
            label={zh ? "首頁狀態" : "Home states"}
            states={homeStates(locale)}
            aspect={CASE04_V2_ASPECT}
            mobileStageFirst
          />
        </CaseOriginalModule>
      </CaseSection>

      {/* 04 — Connecting the Product Journey: 6-step flow chips + generation sub-flow · media-2 phones */}
      <CaseSection id={CH[4].anchor}>
        <CaseSectionHeader
          eyebrow={eb(4)}
          title={zh ? "把不同功能串成一套連續產品流程" : "Connecting the Experience Into One Continuous Journey"}
          paragraphs={[zh ? "我將核心使用體驗整理成一條連續流程：" : "I reorganized the core experience into one continuous journey:"]}
        />
        <ol className="cv3-journey cv3-list-reset" aria-label="Product journey: Profile Setup, Guided Input, Generate, Listen, History, Return">
          {(zh ? ["個人資料", "引導式輸入", "生成", "聆聽", "歷史紀錄", "再次返回"] : ["Profile Setup", "Guided Input", "Generate", "Listen", "History", "Return"]).map((step, i) => (
            <li key={step}>
              <span className="cv3-journey-n" lang="en">0{i + 1}</span>
              <span className="cv3-journey-l">{step}</span>
              <span aria-hidden="true" className="cv3-journey-a">{i < 5 ? "→" : "↺"}</span>
            </li>
          ))}
        </ol>
        <div className="cv3-subflow">
          <p className="cv3-card-kicker">{zh ? "生成的狀態" : "GENERATE — LIFECYCLE"}</p>
          <p>{zh ? "生成中" : "Generating"} <span aria-hidden>→</span> {zh ? "已完成生成" : "Ready"}</p>
          <p>{zh ? "失敗" : "Failed"} <span aria-hidden>→</span> {zh ? "重試／繼續" : "Retry / Resume"} <span aria-hidden>↩</span> {zh ? "生成" : "Generate"}</p>
        </div>
        <p className="cv3-p">
          {zh
            ? "這套結構把首次設定、每日輸入、非同步生成、播放與再次使用串在同一套操作邏輯裡，而不是讓每個功能各自形成獨立流程。"
            : "This structure connects first-time setup, repeated daily input, asynchronous generation, playback and return use without requiring a separate interaction model for every feature."}
        </p>
        <p className="cv3-caption">
          {zh ? "把輸入、生成、恢復、聆聽到再次使用串成完整流程。" : "A state-aware product journey connecting guided input, asynchronous generation, recovery, listening and return use."}
        </p>
        <p className="cv3-card-kicker cv3-kicker-accent">{zh ? "實際操作錄影・從首頁到聆聽紀錄" : "RECORDED WALKTHROUGH · HOME TO HISTORY"}</p>
        <CaseOriginalModule locale={locale} version={VERSION}>
          <Case04Journey
            src={CASE04_V2.journey.src}
            poster={CASE04_V2.journey.poster}
            duration={CASE04_V2.journey.duration}
            chapters={journeyChapters(locale)}
            label={zh ? "操作錄影章節" : "Walkthrough chapters"}
            videoLabel={zh
              ? "LABO65 V2 互動原型的實際操作錄影（無聲）：從首頁開始生成今日聲景，依序完成 7 個引導步驟（含第 4 步今天的脈輪），等待生成、開始聆聽，再回到首頁與聆聽紀錄。"
              : "Silent screen recording of the LABO65 V2 interactive prototype: starting from Home, completing all seven guided steps (including step 4, today's chakra), waiting for generation, listening, then returning to Home and history."}
            zh={zh}
          />
        </CaseOriginalModule>
        <p className="cv3-caption">
          {zh
            ? "LABO65 V2 互動原型的單次連續操作錄影，以原速呈現，7 個引導步驟完整收錄、中間未剪接。登入、生成與下載皆為模擬，播放使用示意音檔；錄影無聲。"
            : "One continuous, real-time recording of the LABO65 V2 interactive prototype, with all seven guided steps and no cuts in between. Sign-in, generation and downloads are simulated, and playback uses a placeholder track; the recording is silent."}
        </p>
        <p className="cv3-card-kicker">{zh ? "輔助畫面・聆聽與歷史紀錄" : "SUPPORTING EVIDENCE · PLAYER & HISTORY"}</p>
        <div className="cv3-grid cv3-phones-narrow" data-variant="media-2">
          {phone(CASE04_V2.player.src, CASE04_V2.player.alt, zh ? "聆聽" : "Listen")}
          {phone(CASE04_V2.history.src, CASE04_V2.history.alt, zh ? "歷史紀錄" : "History")}
        </div>
      </CaseSection>

      {/* 05 — Reusable System & Mobile Constraints: text · media-2 phones · key trade-offs compare ×3 */}
      <CaseSection id={CH[5].anchor}>
        <CaseSectionHeader
          eyebrow={eb(5)}
          title={zh ? "從實際行動裝置限制建立可重複使用的設計規則" : "Reusable Rules Shaped by Real Mobile Constraints"}
          paragraphs={zh ? [
            "隨著重新設計的範圍擴大，我將重複出現的互動方式整理成共用 UI 規則，包括導覽、選取狀態、字體層級、間距、圖示，以及不同產品狀態的呈現方式。",
            "一些實際的行動裝置限制，也直接改變了設計。",
            "內容生成需要較長等待時間，因此使用者不能被限制在單一畫面；手機鍵盤會影響表單與主要操作的位置；生成失敗或網路中斷則需要能重新嘗試，同時保留先前完成的輸入。",
            "另外也建立了互動原型，用來呈現完整流程與不同狀態之間的實際轉換。",
          ] : [
            "As the redesign expanded, repeated interaction patterns were consolidated into shared UI rules covering navigation, selection states, typography, spacing, icon usage and recurring status behavior.",
            "Several mobile constraints directly affected those decisions.",
            "Long generation times required an experience that could continue without keeping the user on one screen. Mobile keyboard behavior affected form structure and primary-action placement. Failure and network interruption required retry and resume behavior that protected previously completed input.",
            "An interactive prototype was also created to demonstrate the redesigned flow and state transitions beyond static screens.",
          ]}
        />
        <p className="cv3-card-kicker">{zh ? "共用步驟進度模式" : "SHARED STEP-PROGRESS PATTERN"}</p>
        <div className="cv3-grid cv3-phones-narrow" data-variant="media-2">
          {phone(CASE04_V2.stepProgress.profile.src, CASE04_V2.stepProgress.profile.alt, zh ? "個人資料設定（1/4）" : "Profile setup (1/4)")}
          {phone(CASE04_V2.stepProgress.daily.src, CASE04_V2.stepProgress.daily.alt, zh ? "每日問卷" : "Daily questionnaire")}
        </div>
        <p className="cv3-caption">{zh ? "不同流程沿用同一套步驟進度模式。" : "Different flows reuse the same step-progress pattern."}</p>
        <p className="cv3-card-kicker">{zh ? "共用的回饋、載入與恢復模式" : "SHARED FEEDBACK, LOADING & RECOVERY PATTERNS"}</p>
        <CaseOriginalModule locale={locale} version={VERSION}>
          <StateScrubber
            label={zh ? "共用的回饋、載入與恢復模式" : "Shared feedback, loading and recovery patterns"}
            states={systemPatterns(locale)}
            aspect={CASE04_V2_ASPECT}
            mobileStageFirst
          />
        </CaseOriginalModule>
        <p className="cv3-card-kicker">{zh ? "關鍵取捨" : "KEY TRADE-OFFS"}</p>
        <CaseContentGrid variant="cards-3" as="ol">
          {(zh
            ? [["單一長頁面", "分階段引導式流程"], ["強迫使用者等待", "允許離開後再返回"], ["失敗後清空重來", "保留輸入並可重試"]]
            : [["Single long page", "Staged guided flow"], ["Force user to wait", "Allow leaving and returning"], ["Reset after failure", "Preserve input and retry"]]
          ).map(([before, after]) => (
            <li key={before} className="cv3-tradeoff">
              <p className="cv3-tradeoff-before">{before}</p>
              <p aria-hidden className="cv3-tradeoff-arrow">↓</p>
              <p className="cv3-tradeoff-after">{after}</p>
            </li>
          ))}
        </CaseContentGrid>
      </CaseSection>

      {/* 06 — Delivery: CaseClosing — outcome statement panel (not launched, no claimed metrics) */}
      <CaseSection id={CH[6].anchor}>
        <CaseSectionHeader
          eyebrow={eb(6)}
          title={zh ? "這次重新設計完成了什麼" : "What the Redesign Delivered"}
          paragraphs={[
            zh
              ? "我完成既有行動產品的端到端 UX/UI 重整，涵蓋核心流程、引導式輸入、生成生命週期、錯誤與恢復狀態、首頁、播放器、歷史紀錄、可重複使用的 UI 規則，以及互動原型。"
              : "I delivered an end-to-end UX/UI redesign covering the core mobile journey, guided input, generation lifecycle, failure and recovery states, Home, Player, History, reusable UI patterns, and an interactive prototype.",
            zh ? "目前已有可操作的 Web staging 版本，App 則持續進行上架準備。" : "A functional Web staging build is now available, while the App continues toward release.",
          ]}
        />
        <CaseClosingPanel>
          <p className="cv3-p">
            {zh
              ? "由於產品尚未完成 App 的正式公開上線週期，因此本案例不宣稱轉換率、留存率或使用率等上線後成效，而是以實際可展示的流程、互動決策、狀態設計與設計交付作為成果證據。"
              : "Because the App has not completed its public release cycle, this case does not claim post-launch conversion, retention, or engagement metrics. The case instead focuses on the product structure, interaction decisions, implementation evidence, and design output that can be directly demonstrated."}
          </p>
        </CaseClosingPanel>
      </CaseSection>
    </>
  );
}
