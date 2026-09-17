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

/**
 * Emphasis line reused verbatim from the closing-statement role every
 * other Case Final chapter already uses (see CaseThreeFinalContent's
 * Reflection) — the shared "pull quote" role this brief calls for
 * already exists under this name, so it's reused rather than a new
 * lavender-blockquote style (that treatment belongs to the older,
 * pre-cf- case-study template and isn't part of this design system).
 */
function PullQuote({ children }: { children: ReactNode }) {
  return (
    <p className="cf-heading mt-8 max-w-[46ch] text-[clamp(1.05rem,2vw,1.35rem)] font-medium leading-snug">
      {children}
    </p>
  );
}

type EvidenceAsset = { src: string; alt: string };

/**
 * Single mobile-screen evidence tile — portrait phone-capture aspect,
 * not the 16:9 landscape frame the shared Evidence/EvidenceImage helpers
 * in Case Two/Three assume. The source already includes the device edge;
 * its transparent outer pixels intentionally blend into the case surface.
 */
function PhoneEvidence({
  asset,
  caption,
  className = "",
  frameClassName = "",
  priority = false,
}: {
  asset: EvidenceAsset;
  caption: string;
  className?: string;
  frameClassName?: string;
  priority?: boolean;
}) {
  return (
    <figure className={className}>
      <div className={`relative aspect-[1236/2803] w-full overflow-hidden bg-transparent ${frameClassName}`}>
        <Image
          src={asset.src}
          alt={asset.alt}
          fill
          unoptimized
          priority={priority}
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 42vw, 72vw"
          className="object-contain"
        />
      </div>
      <figcaption className="cf-figure-caption cf-meta mt-3">{caption}</figcaption>
    </figure>
  );
}

/**
 * Hero — one restrained composition (current Home / Today, not-yet-
 * generated state), same "one image, not a gallery" restraint as
 * CASE03's hero. Product identity is withheld per the confidentiality
 * pass below — the wordmark visible in the raw capture has been masked
 * out of this exported asset (see design-source/case04's originals for
 * the unmasked source); everything else in the screen is untouched,
 * real evidence.
 */
export function CaseFourHeroEvidence({ locale }: { locale: Locale }) {
  const zhHant = locale === "zh";
  return (
    <figure className="mt-12 md:mt-16">
      <Reveal className="block">
        <div className="grid grid-cols-2 items-end gap-5 md:grid-cols-12 md:gap-6 lg:gap-8">
          <PhoneEvidence
            className="col-span-1 row-start-2 md:col-span-3 md:col-start-2 md:row-start-1 md:translate-y-10"
            asset={{
              src: "/images/case04/case04-generating.webp",
              alt: "Generating state for a confidential mobile wellness product",
            }}
            caption={zhHant ? "生成中" : "GENERATING"}
            priority
          />
          <PhoneEvidence
            className="relative z-[1] col-span-2 row-start-1 mx-auto w-full max-w-[300px] md:col-span-4 md:col-start-5 md:max-w-none"
            frameClassName="shadow-[0_28px_80px_rgb(0_0_0/0.32)]"
            asset={{
              src: "/images/case04/case04-hero-home-v2.webp",
              alt: "Home screen of a confidential mobile wellness product, with brand identity masked",
            }}
            caption={zhHant ? "首頁／今日" : "HOME / TODAY"}
            priority
          />
          <PhoneEvidence
            className="col-span-1 row-start-2 md:col-span-3 md:col-start-9 md:row-start-1 md:translate-y-16"
            asset={{
              src: "/images/case04/case04-player.webp",
              alt: "Listening player for a confidential mobile wellness product",
            }}
            caption={zhHant ? "聆聽中" : "LISTENING"}
            priority
          />
        </div>
      </Reveal>
      <p className="cf-dim mt-20 max-w-[62ch] text-[13px] leading-6 md:mt-24">
        {zhHant
          ? "產品名稱、品牌與客戶識別資訊已匿名處理；畫面反映目前開發階段，介面與細節可能持續調整。"
          : "Product name, brand, and client-identifying information have been anonymized; screens reflect the current development stage and details may continue to change."}
      </p>
    </figure>
  );
}

const PRINCIPLES_ZH = [
  ["降低認知負擔", "每個步驟只呈現當下決策真正需要的資訊。"],
  ["減少手動輸入", "能用選擇完成的任務，就不要求使用者重複輸入。"],
  ["拆解過長任務", "把高資訊量流程拆成短而有方向的步驟。"],
  ["為非同步狀態設計", "等待、失敗、重試與完成都是核心產品狀態。"],
  ["保留使用者控制權", "允許離開、返回與恢復，不用等待綁住使用者。"],
] as const;

const PRINCIPLES_EN = [
  ["Reduce Cognitive Load", "Each step shows only the information that decision actually needs."],
  ["Minimize Manual Input", "If a choice can complete the task, don't ask users to type it instead."],
  ["Break Down Long Tasks", "Break information-heavy flows into short, directional steps."],
  ["Design for Async States", "Waiting, failing, retrying, and completing are all core product states."],
  ["Preserve User Control", "Let users leave, return, and recover — waiting shouldn't trap them."],
] as const;

/** Compact principle grid — a deliberately terser composition than the
 * numbered-row/description treatment other chapters use, so this
 * section reads fast rather than repeating the same rhythm as every
 * other section (Angela's explicit "avoid identical spacing/rhythm"
 * direction). Still built from existing tokens only: .cf-rule border,
 * .cf-meta/.cf-accent index, .cf-heading label — no new role. */
function PrincipleFramework({ items }: { items: readonly (readonly [string, string])[] }) {
  return (
    <div className="grid gap-px bg-[color:var(--cf-hairline)] md:grid-cols-12">
      {items.map(([label, body], i) => (
        <div
          key={label}
          className={`bg-[color:var(--cf-bg)] p-6 md:p-8 ${i < 2 ? "md:col-span-6" : "md:col-span-4"}`}
        >
          <p className="cf-meta cf-accent">0{i + 1}</p>
          <p className="cf-heading mt-6 text-[clamp(1.15rem,2vw,1.65rem)] font-medium leading-tight">{label}</p>
          <p className="cf-body body-tc mt-4 max-w-[28ch]">{body}</p>
        </div>
      ))}
    </div>
  );
}

const IMG = "/images/case04";

/**
 * CASE04 ZH V1 — public identity anonymized as "Confidential Mobile
 * Wellness Product" per Angela's explicit direction (do not expose the
 * real product name, logo, or client-identifying branding). Evidence
 * assets are the same real screens as before; the four that showed the
 * product wordmark have had it masked out in place (public/images/case04
 * itself, not just at render time) — see design-source/case04 for the
 * unmasked originals, which stay out of the publicly-served tree.
 *
 * Narrative order (Angela's restructure): Team & Role -> Takeover ->
 * Challenge -> Principles -> Guided Input -> Async States -> Product
 * Continuity -> Brand/System -> Reflection. This moves team/ownership
 * context to the front (recruiters read "who did what" before "what
 * was wrong"), and reaches real product evidence by chapter 05 instead
 * of chapter 04 buried under three paragraphs of preamble.
 *
 * Locale-aware: `zhHant` branches every hardcoded string below, following
 * the same convention as Case One/Two/Three. English copy is a faithful
 * meaning-for-meaning localization of the frozen ZH copy above — not a
 * literal translation — reviewed against the same confidentiality rules
 * (no confidential product identity, no client identity, no commercial/
 * pricing detail).
 */
export function CaseFourFinalContent({ register, locale }: { register: RegisterSection; locale: Locale }) {
  const zhHant = locale === "zh";
  return (
    <>
      {/* 01 — The Team & My Role */}
      <Section index={0} register={register} divider={false}>
        <Reveal>
          <SectionHeading
            label={zhHant ? "01 — 團隊與我的角色" : "01 — THE TEAM & MY ROLE"}
            title={zhHant ? "三人團隊裡的設計與工程協作" : "Design and Engineering on a Three-Person Team"}
          />
        </Reveal>
        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="border-t cf-rule">
              {(zhHant
                ? [
                    ["PM", "需求、範疇與專案協調"],
                    ["Full-stack Engineer", "早期功能流程、既有技術基礎與產品實作"],
                    ["UI/UX 設計師／我", "UX 檢視、關鍵流程重整、互動／狀態設計與 UI 系統"],
                  ]
                : [
                    ["PM", "Requirements, scope, and project coordination"],
                    ["Full-stack Engineer", "Early functional flow, existing technical foundation, and product implementation"],
                    ["UI/UX Designer / Me", "UX review, restructuring key flows, interaction / state design, and the UI system"],
                  ]
              ).map(([role, desc], index) => (
                <div
                  key={role}
                  className={`grid gap-2 border-b cf-rule sm:grid-cols-[3rem_11rem_1fr] sm:items-start sm:gap-5 ${
                    index === 2
                      ? "border-l-2 border-l-[color:var(--cf-accent)] py-8 pl-5 sm:-ml-5 sm:pl-[calc(1.25rem-2px)]"
                      : "py-5"
                  }`}
                >
                  <p className="cf-meta cf-accent">0{index + 1}</p>
                  <p className={`cf-heading font-medium leading-7 ${index === 2 ? "text-[20px] text-[color:var(--cf-accent)]" : "text-[18px]"}`}>
                    {role}
                  </p>
                  <p className="cf-body body-tc">{desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5">
            <p className="cf-meta cf-dim">{zhHant ? "在開發進行中同步設計" : "DESIGN IN ACTIVE DEVELOPMENT"}</p>
            <p className="cf-body body-tc mt-5 max-w-[38ch]">
              {zhHant
                ? "產品已在開發，設計決策必須同時回應 UX 問題與實作可行性。我優先處理真正影響體驗的部分，並持續與工程確認可行性。"
                : "The product was already in development, so every design decision had to answer both the UX problem and implementation feasibility. I prioritized the changes that genuinely affected the experience and checked feasibility with engineering continuously."}
            </p>
            <p className="cf-heading mt-8 max-w-[22ch] text-[clamp(1.25rem,2.4vw,1.9rem)] font-medium leading-tight">
              {zhHant ? "改善核心體驗，同時讓產品繼續前進。" : "Improve the core experience without slowing the product down."}
            </p>
          </div>
        </div>
      </Section>

      {/* 02 — Taking Over an Active Product */}
      <Section index={1} register={register}>
        <Reveal>
          <SectionHeading
            label={zhHant ? "02 — 接手開發中的產品" : "02 — TAKING OVER AN ACTIVE PRODUCT"}
            title={zhHant ? "產品已經開始做，我不是從零開始" : "The Product Had Already Started — I Wasn't Building From Zero"}
          />
        </Reveal>
        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-10">
          <div className="lg:col-span-10">
            <div className="grid bg-[color:var(--cf-hairline)] sm:grid-cols-2 sm:gap-px lg:grid-cols-4">
              {(zhHant
                ? [
                    ["客戶概念", "產品概念與商業方向"],
                    ["早期功能版本", "工程端建立第一版功能流程與初步實作"],
                    ["UX/UI 接手", "檢視摩擦點，重整關鍵流程、狀態與資訊層級"],
                    ["迭代", "與工程確認可行性，逐步落實一致的行動裝置 UI 系統"],
                  ]
                : [
                    ["CLIENT CONCEPT", "Product concept and business direction"],
                    ["EARLY FUNCTIONAL BUILD", "Engineering built the first functional flow and an early implementation"],
                    ["UX/UI TAKEOVER", "Reviewed friction points and restructured key flows, states, and information hierarchy"],
                    ["ITERATION", "Validated feasibility with engineering while rolling out a consistent mobile UI system"],
                  ]
              ).map(([label, body], index) => (
                <div
                  key={label}
                  className={`relative min-h-44 p-6 md:p-8 lg:min-h-60 ${
                    index === 2 ? "bg-[color:var(--cf-accent)] text-[color:var(--cf-bg)]" : "bg-[color:var(--cf-bg)]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className={`cf-meta ${index === 2 ? "text-[color:var(--cf-bg)]" : "cf-accent"}`}>0{index + 1}</p>
                    {index < 3 && <span aria-hidden className={`text-xl ${index === 2 ? "text-[color:var(--cf-bg)]" : "cf-accent"}`}>→</span>}
                  </div>
                  <p className={`cf-meta mt-8 ${index === 2 ? "text-[color:var(--cf-bg)]" : "cf-accent"}`}>{label}</p>
                  <p className={`body-tc mt-5 max-w-[30ch] ${index === 2 ? "text-[color:var(--cf-bg)]" : "cf-body"}`}>{body}</p>
                </div>
              ))}
            </div>
            <p className="cf-dim mt-5 max-w-[60ch] text-[14px] leading-6">
              {zhHant
                ? "此時間線用於說明工作接手脈絡，不代表畫面中的任何截圖是經驗證的改版前版本。"
                : "This timeline explains the context of the handover — it does not imply that any screen shown here is a verified “before” version."}
            </p>
          </div>
          <div className="mx-auto w-full max-w-[220px] lg:col-span-2 lg:mx-0 lg:mt-8">
            <PhoneEvidence
              asset={{
                src: `${IMG}/case04-context-login-v2.webp`,
                alt: "Login context from an early stage of the confidential mobile wellness product, with brand identity masked",
              }}
              caption={zhHant ? "登入情境 / 僅作產品背景說明" : "Login context / for product background only"}
            />
          </div>
        </div>
      </Section>

      {/* 03 — The UX Challenge */}
      <Section index={2} register={register}>
        <Reveal>
          <SectionHeading
            label={zhHant ? "03 — UX 挑戰" : "03 — THE UX CHALLENGE"}
            title={zhHant ? "複雜需求，不應變成複雜操作" : "Complex Requirements Shouldn't Mean Complex Interactions"}
          />
        </Reveal>
        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="cf-body body-tc max-w-[42ch]">
              {zhHant
                ? "個人化生成需要出生資料、當下狀態、改善方向與多種偏好。系統也包含內部對應與生成邏輯，但使用者不需要理解這些複雜機制。"
                : "Generating a personalized result needs birth data, current state, desired outcome, and several preferences. The system also runs its own internal mapping and generation logic — none of which the user needs to understand."}
            </p>
            <PullQuote>
              {zhHant
                ? "在不拿掉必要資訊的前提下，讓複雜需求感覺更輕、更清楚。"
                : "Make complex requirements feel lighter and clearer, without removing the information the system still needs."}
            </PullQuote>
          </div>
          <div className="space-y-px bg-[color:var(--cf-hairline)] lg:col-span-7">
            {(zhHant
              ? [
                  ["高輸入負擔", "高輸入負擔", "需要提供多類個人資料與偏好，容易讓手機任務變得沉重。"],
                  ["過長的線性流程", "過長的線性流程", "若一次呈現全部需求，閱讀、填寫與捲動成本會持續累積。"],
                  ["非同步狀態不完整", "非同步狀態不完整", "生成、離開、失敗、斷線與返回都需要清楚的回應與恢復路徑。"],
                ]
              : [
                  ["HIGH INPUT BURDEN", "High Input Burden", "Multiple categories of personal data and preferences are required, which can make a mobile task feel heavy."],
                  ["LONG LINEAR FLOWS", "Long Linear Flows", "Presenting every requirement at once stacks up reading, filling, and scrolling costs."],
                  ["INCOMPLETE ASYNC STATES", "Incomplete Async States", "Generating, leaving, failing, going offline, and returning all need clear feedback and a way back."],
                ]
            ).map(([label, title, body]) => (
              <article key={label} className="grid gap-4 bg-[color:var(--cf-bg)] p-6 sm:grid-cols-[10rem_1fr] md:p-8">
                <p className="cf-meta cf-accent">{label}</p>
                <div>
                  <h3 className="cf-heading text-[clamp(1.15rem,2vw,1.5rem)] font-medium">{title}</h3>
                  <p className="cf-body body-tc mt-3 max-w-[38ch]">{body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="mt-12 grid items-center gap-4 border-y cf-rule py-7 sm:grid-cols-[1fr_auto_1fr]">
          <p className="cf-heading text-[clamp(1.2rem,2.5vw,1.8rem)] font-medium">{zhHant ? "複雜的需求" : "Complex requirements"}</p>
          <span aria-hidden className="cf-accent text-2xl">→</span>
          <p className="cf-heading text-[clamp(1.2rem,2.5vw,1.8rem)] font-medium sm:text-right">{zhHant ? "引導式的行動體驗" : "Guided mobile experience"}</p>
        </div>
      </Section>

      {/* 04 — Design Principles (compact grid — deliberately terser than
          the surrounding sections' full paragraphs) */}
      <Section index={3} register={register}>
        <Reveal>
          <SectionHeading
            label={zhHant ? "04 — 設計原則" : "04 — DESIGN PRINCIPLES"}
            title={zhHant ? "把複雜度留在系統裡，把清楚留給使用者" : "Keep the Complexity in the System, Not in Front of the User"}
          />
        </Reveal>
        <div className="mt-10">
          <PrincipleFramework items={zhHant ? PRINCIPLES_ZH : PRINCIPLES_EN} />
        </div>
      </Section>

      {/* 05 — Guided Input (visual core) */}
      <Section index={4} register={register}>
        <Reveal>
          <SectionHeading
            label={zhHant ? "05 — 引導式輸入" : "05 — GUIDED INPUT"}
            title={zhHant ? "把高資訊量流程拆成可理解的步驟" : "Turning a Dense Flow Into Understandable Steps"}
          />
        </Reveal>
        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <p className="cf-body body-tc max-w-[42ch]">
              {zhHant
                ? "我把大量資訊拆成較短的步驟，讓使用者每次只專注一個決定。首次資料建立被整理為：出生日期 → 時區 → 性別 → 確認。"
                : "I broke a large amount of information into shorter steps, so users focus on one decision at a time. First-time profile setup became: Birth Date → Time Zone → Gender → Confirmation."}
            </p>
            <p className="cf-heading mt-8 max-w-[24ch] text-[clamp(1.25rem,2.4vw,1.9rem)] font-medium leading-tight">
              {zhHant ? "不是拿掉複雜度，而是把複雜度分配到正確的步驟。" : "Not removing the complexity — placing it in the right step."}
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-12 sm:items-end lg:col-span-8 lg:gap-7">
            <PhoneEvidence
              className="mx-auto w-full max-w-[330px] sm:col-span-6 sm:max-w-none"
              asset={{ src: `${IMG}/case04-profile-birthdate.webp`, alt: "Guided profile setup with birth date input" }}
              caption={zhHant ? "出生日期 / 聚焦單一任務" : "Birth date / one task at a time"}
            />
            <PhoneEvidence
              className="mx-auto w-full max-w-[300px] sm:col-span-3 sm:max-w-none"
              asset={{ src: `${IMG}/case04-profile-gender.webp`, alt: "Guided profile setup with gender selection" }}
              caption={zhHant ? "性別 / 選擇取代輸入" : "Gender / selection instead of typing"}
            />
            <PhoneEvidence
              className="mx-auto w-full max-w-[300px] sm:col-span-3 sm:max-w-none"
              asset={{ src: `${IMG}/case04-profile-completed.webp`, alt: "Completed state for guided profile setup" }}
              caption={zhHant ? "確認 / 清楚完成" : "Confirmation / a clear finish"}
            />
          </div>
        </div>

        <div className="mt-20 border-t cf-rule pt-10 md:mt-24 md:pt-12">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-4">
              <p className="cf-meta cf-accent">{zhHant ? "選擇式問卷" : "CHOICE-BASED QUESTIONNAIRE"}</p>
              <h3 className="cf-heading mt-4 max-w-[16ch] text-[clamp(1.5rem,3vw,2.25rem)] font-medium leading-tight">
                {zhHant ? "用選擇降低每日輸入負擔" : "Using Choices to Lower Daily Input Effort"}
              </h3>
              <p className="cf-body body-tc mt-6 max-w-[38ch]">
                {zhHant
                  ? "每日狀態問卷優先使用選擇式互動，減少鍵盤輸入與長時間捲動。"
                  : "The daily check-in prioritizes choice-based interaction to cut down on typing and long scrolling."}
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-12 sm:items-end lg:col-span-8 lg:gap-7">
              <PhoneEvidence
                className="mx-auto w-full max-w-[330px] sm:col-span-6 sm:max-w-none"
                asset={{ src: `${IMG}/case04-questionnaire-improve.webp`, alt: "Daily questionnaire with multi-select choices for today's focus" }}
                caption={zhHant ? "目標 / 多選" : "Goal / multi-select"}
              />
              <PhoneEvidence
                className="mx-auto w-full max-w-[300px] sm:col-span-3 sm:max-w-none sm:-translate-y-8"
                asset={{ src: `${IMG}/case04-questionnaire-scene.webp`, alt: "Daily questionnaire with scene selection" }}
                caption={zhHant ? "場景 / 單選" : "Scene / single-select"}
              />
              <PhoneEvidence
                className="mx-auto w-full max-w-[300px] sm:col-span-3 sm:max-w-none"
                asset={{ src: `${IMG}/case04-questionnaire-generate.webp`, alt: "Final questionnaire step with instrument choice and generation action" }}
                caption={zhHant ? "偏好 / 生成今日聲景" : "Preference / generate today's soundscape"}
              />
            </div>
          </div>
        </div>
      </Section>

      {/* 06 — Async States & Recovery (visual core) */}
      <Section index={5} register={register}>
        <Reveal>
          <SectionHeading
            label={zhHant ? "06 — 非同步狀態與復原" : "06 — ASYNC STATES & RECOVERY"}
            title={zhHant ? "把等待與失敗也納入產品體驗" : "Designing Waiting and Failure Into the Experience"}
          />
        </Reveal>
        <div className="mt-10 grid gap-8 border-y cf-rule py-7 sm:grid-cols-5 sm:items-center">
          {(zhHant ? ["生成中", "離開／等待", "失敗／離線", "重試", "完成"] : ["Generating", "Leave / Wait", "Failed / Offline", "Retry", "Ready"]).map((state, index) => (
            <div key={state} className="flex items-center gap-4 sm:block">
              <span className="cf-meta cf-accent">0{index + 1}</span>
              <p className="cf-heading text-[16px] font-medium sm:mt-3">{state}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <p className="cf-body body-tc max-w-[42ch]">
              {zhHant
                ? "個人化音樂需要生成時間，因此體驗不能只有提交 → 成功。使用者可以離開等待，之後回來查看結果；斷線或生成失敗時，也有清楚的原因與恢復方向。"
                : "Generating personalized audio takes time, so the experience can't just be Submit → Success. Users can leave while it generates and come back to check the result; if the connection drops or generation fails, they get a clear reason and a way to recover."}
            </p>
            <PullQuote>
              {zhHant
                ? "降低等待時間不一定總是可能，但降低不確定感可以。"
                : "We cannot always reduce the wait, but we can reduce the uncertainty."}
            </PullQuote>
          </div>
          <div className="grid gap-8 sm:grid-cols-12 sm:items-end lg:col-span-8 lg:gap-7">
            <PhoneEvidence
              className="mx-auto w-full max-w-[360px] sm:col-span-6 sm:max-w-none"
              asset={{ src: `${IMG}/case04-generating.webp`, alt: "Generating today's soundscape with guidance that the user can leave and return" }}
              caption={zhHant ? "生成中／可離開等待" : "GENERATING / leave and come back"}
            />
            <PhoneEvidence
              className="mx-auto w-full max-w-[300px] sm:col-span-3 sm:max-w-none"
              asset={{ src: `${IMG}/case04-generation-failed.webp`, alt: "Generation failed state with a retry action" }}
              caption={zhHant ? "失敗／重新嘗試" : "FAILED / retry"}
            />
            <PhoneEvidence
              className="mx-auto w-full max-w-[300px] sm:col-span-3 sm:max-w-none"
              asset={{ src: `${IMG}/case04-offline.webp`, alt: "Offline state with a retry action" }}
              caption={zhHant ? "離線／恢復路徑" : "OFFLINE / recovery path"}
            />
            <PhoneEvidence
              className="mx-auto w-full max-w-[320px] sm:col-span-4 sm:col-start-5 sm:max-w-none"
              asset={{ src: `${IMG}/case04-home-ready-v2.webp`, alt: "Ready state with today's generated soundscape available to play, brand identity masked" }}
              caption={zhHant ? "完成／回到首頁查看結果" : "READY / back to Home to view the result"}
            />
          </div>
        </div>
      </Section>

      {/* 07 — Product Continuity (visual core) */}
      <Section index={6} register={register}>
        <Reveal>
          <SectionHeading
            label={zhHant ? "07 — 產品連續性" : "07 — PRODUCT CONTINUITY"}
            title={zhHant ? "讓一次操作變成完整使用流程" : "Turning a Single Action Into a Complete Usage Loop"}
          />
        </Reveal>
        <div
          className="cf-scroll-region mt-10 overflow-x-auto pb-3"
          tabIndex={0}
          role="group"
          aria-label="Product loop: Home, Generate, Listen, Complete or History, Return"
        >
          <div className="grid min-w-[50rem] grid-cols-5 border-y cf-rule">
            {(zhHant ? ["首頁", "生成", "聆聽", "完成／歷史紀錄", "返回"] : ["Home", "Generate", "Listen", "Complete / History", "Return"]).map((step, index) => (
              <div key={step} className="relative flex min-h-24 items-center px-5 py-6">
                <span className="cf-meta cf-accent mr-4">0{index + 1}</span>
                <span className="cf-heading text-[16px] font-medium">{step}</span>
                {index < 4 && <span aria-hidden className="absolute right-0 cf-accent">→</span>}
                {index === 4 && <span aria-hidden className="ml-auto text-xl cf-accent">↺</span>}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-4">
            <p className="cf-body body-tc max-w-[42ch]">
              {zhHant
                ? "產品體驗不在生成完成時停止。我把首頁、生成、播放器、完成／回饋與聆聽紀錄串成一個可以再次返回的使用循環。"
                : "The product experience doesn't end when generation finishes. I connected Home, generation, the player, completion / feedback, and listening history into a loop users can return to."}
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-12 sm:items-center sm:gap-7 lg:col-span-8">
            <PhoneEvidence
              className="mx-auto w-full max-w-[280px] sm:col-span-3 sm:max-w-none"
              asset={{ src: `${IMG}/case04-hero-home-v2.webp`, alt: "Home entry point for today's soundscape, with brand identity masked" }}
              caption={zhHant ? "首頁／今日入口" : "HOME / today's entry point"}
            />
            <PhoneEvidence
              className="mx-auto w-full max-w-[340px] sm:col-span-5 sm:max-w-none"
              frameClassName="shadow-[0_28px_80px_rgb(0_0_0/0.3)]"
              asset={{ src: `${IMG}/case04-player.webp`, alt: "Player for listening to a generated soundscape" }}
              caption={zhHant ? "播放器／聆聽與完成" : "PLAYER / listening and completion"}
            />
            <PhoneEvidence
              className="mx-auto w-full max-w-[280px] sm:col-span-4 sm:max-w-none sm:translate-y-8"
              asset={{ src: `${IMG}/case04-history.webp`, alt: "Listening history supporting repeat use" }}
              caption={zhHant ? "歷史紀錄／再次回來" : "HISTORY / coming back again"}
            />
          </div>
        </div>
      </Section>

      {/* 08 — Stable System, Flexible Brand Layer (lighter — the brand/
          system story supports the case, it doesn't need to dominate
          it, so this stays intentionally shorter than the visual-core
          sections above). */}
      <Section index={7} register={register}>
        <Reveal>
          <SectionHeading
            label={zhHant ? "08 — 穩定系統，彈性品牌層" : "08 — STABLE SYSTEM, FLEXIBLE BRAND LAYER"}
            title={zhHant ? "在品牌仍在調整時，先穩定產品系統" : "Stabilizing the Product System While the Brand Was Still Evolving"}
          />
        </Reveal>
        <div className="mt-10 grid lg:grid-cols-12 lg:grid-rows-[auto_auto]">
          <div className="border cf-rule bg-[color:var(--cf-bg)] p-7 md:p-10 lg:col-span-12 lg:row-start-2 lg:pt-14">
            <p className="cf-meta cf-accent">{zhHant ? "穩定的產品系統" : "STABLE PRODUCT SYSTEM"}</p>
            <div className="mt-7 grid grid-cols-2 gap-px bg-[color:var(--cf-hairline)] lg:grid-cols-4">
              {(zhHant ? ["結構", "狀態", "元件", "設計變數"] : ["Structure", "States", "Components", "Tokens"]).map((item) => (
                <p key={item} className="cf-heading bg-[color:var(--cf-bg)] py-6 pr-5 text-[clamp(1.25rem,2.6vw,2.2rem)] font-medium leading-tight lg:py-8">
                  {item}
                </p>
              ))}
            </div>
            <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-4 border-t cf-rule pt-6 sm:grid-cols-3">
              {(zhHant ? ["UX 架構", "互動模式", "狀態", "設計變數", "元件", "版面規則"] : ["UX structure", "Interaction patterns", "States", "Tokens", "Components", "Layout rules"]).map((item) => (
                <p key={item} className="cf-body text-[15px] leading-6">{item}</p>
              ))}
            </div>
          </div>
          <div className="border border-b-0 cf-rule bg-[color:var(--cf-bg)] p-7 md:p-10 lg:col-span-5 lg:col-start-8 lg:row-start-1">
            <p className="cf-meta cf-dim">{zhHant ? "彈性的品牌層" : "FLEXIBLE BRAND LAYER"}</p>
            <div className="mt-6 space-y-3">
              {(zhHant ? ["插畫", "裝飾視覺", "品牌表現"] : ["Illustration", "Decorative visuals", "Brand expression"]).map((item) => (
                <p key={item} className="cf-heading border-t cf-rule pt-3 text-[clamp(1.15rem,2vw,1.55rem)] font-medium leading-tight">{item}</p>
              ))}
            </div>
            <p className="cf-body body-tc mt-8 max-w-[36ch]">
              {zhHant
                ? "品牌與美術方向持續發展時，視覺層可以調整，核心產品結構不需要跟著重做。"
                : "While the brand and art direction keep evolving, the visual layer can change without reworking the core product structure."}
            </p>
          </div>
        </div>
        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-end">
          <p className="cf-body body-tc max-w-[62ch] lg:col-span-7">
            {zhHant
              ? "為了配合開發速度，AI 生成視覺只作為暫時起點，之後仍經過人工檢視、修改與整理，才進入現階段的 UI 系統。"
              : "To keep pace with development, AI-generated visuals were used only as a provisional starting point — each one was manually reviewed, edited, and refined before entering the current UI system."}
          </p>
          <p className="cf-heading max-w-[24ch] text-[clamp(1.15rem,2vw,1.5rem)] font-medium leading-snug lg:col-span-5">
            {zhHant ? "產品結構先穩定，品牌表現保留調整空間。" : "Stabilize the product structure first; leave room for the brand to keep evolving."}
          </p>
        </div>
      </Section>

      {/* Reflection — unnumbered, matching this case's own copy. */}
      <Section index={8} register={register}>
        <Reveal>
          <SectionHeading
            label={zhHant ? "反思" : "REFLECTION"}
            title={zhHant ? "不重新開始，持續改善" : "Improving Without Restarting"}
          />
        </Reveal>
        <div className="mt-10 grid gap-10 border-t cf-rule pt-10 lg:grid-cols-12 lg:items-end lg:gap-16">
          <p className="cf-body body-tc max-w-[62ch] lg:col-span-6">
            {zhHant
              ? "這個專案讓我更確認，接手正在開發中的產品，重點不是重新開始，而是先理解限制，再找出最值得改善的地方。在需求、品牌與工程都持續變動時，先穩定核心體驗，才能讓產品持續往前。"
              : "This project confirmed something for me: taking over an active product isn't about starting over. It's about understanding the constraints first, then finding the changes that matter most. With requirements, branding, and engineering all still evolving, stabilizing the core experience is what lets the product keep moving forward."}
          </p>
          <p className="cf-heading max-w-[20ch] text-[clamp(1.8rem,4vw,3.4rem)] font-medium leading-[1.05] lg:col-span-6">
            {zhHant ? "把力氣放在真正重要的地方，讓產品持續前進。" : "Improve what matters. Keep the product moving."}
          </p>
        </div>
      </Section>
    </>
  );
}
