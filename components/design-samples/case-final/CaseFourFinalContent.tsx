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

// V4 restructure: section LABELS (the small eyebrow-style meta line, e.g.
// "01 — THE CHALLENGE & MY ROLE") are intentionally NOT locale-branched —
// same convention already used by this file's own Hero eyebrow
// ("04 / MOBILE WELLNESS PRODUCT", unbranched in CaseStudyPrototype.tsx).
// Headings (H2) and body copy below each label remain fully localized.
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
 * V2: for the two Section 02 composite assets (a stacked long-scroll
 * "before" capture and a 3x2 contact sheet), which are not phone-shaped
 * screenshots and so don't fit PhoneEvidence's fixed portrait aspect —
 * this renders any evidence image at its own true aspect ratio instead.
 */
function ComposedEvidence({
  asset,
  aspectClassName,
  caption,
  className = "",
}: {
  asset: EvidenceAsset;
  aspectClassName: string;
  caption: string;
  className?: string;
}) {
  return (
    <figure className={className}>
      <div className={`relative w-full overflow-hidden bg-transparent ${aspectClassName}`}>
        <Image
          src={asset.src}
          alt={asset.alt}
          fill
          unoptimized
          sizes="(min-width: 1024px) 480px, 90vw"
          className="object-contain object-top"
        />
      </div>
      <figcaption className="cf-figure-caption cf-meta mt-3">{caption}</figcaption>
    </figure>
  );
}

/**
 * Hero — one restrained composition (Home / Generating / Listening),
 * same "one image, not a gallery" restraint as CASE03's hero. V3 final
 * pass: hero-home now uses the -v5 derivative. -v4 (a flat neutral-fill
 * box over the "我的能量結構" card) fixed the confidentiality problem but
 * still read as a visible censored block. -v5 instead removes that exact
 * band via a slice-and-stitch crop (top of the card container to its
 * bottom edge, precisely matched by background-color transition, not
 * estimated) and rejoins the card directly to the bottom nav — a real
 * crop/reframe, not a mask, so nothing reads as redacted. Generating/
 * Player unchanged. V4 restructure kept this composition as-is per
 * instruction ("keep the existing 3-phone Hero visual").
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
              src: "/images/case04/case04-generating-v2.webp",
              alt: "Generating state for a mobile wellness product",
            }}
            caption={zhHant ? "生成中" : "GENERATING"}
            priority
          />
          <PhoneEvidence
            className="relative z-[1] col-span-2 row-start-1 mx-auto w-full max-w-[300px] md:col-span-4 md:col-start-5 md:max-w-none"
            frameClassName="shadow-[0_28px_80px_rgb(0_0_0/0.32)]"
            asset={{
              src: "/images/case04/case04-hero-home-v5.webp",
              alt: "Home screen of a mobile wellness product, with brand identity and personalization-mechanism details removed",
            }}
            caption={zhHant ? "首頁／今日" : "HOME / TODAY"}
            priority
          />
          <PhoneEvidence
            className="col-span-1 row-start-2 md:col-span-3 md:col-start-9 md:row-start-1 md:translate-y-16"
            asset={{
              src: "/images/case04/case04-player.webp",
              alt: "Listening player for a mobile wellness product",
            }}
            caption={zhHant ? "聆聽中" : "LISTENING"}
            priority
          />
        </div>
      </Reveal>
      <p className="cf-dim mt-20 max-w-[62ch] text-[13px] leading-6 md:mt-24">
        {zhHant
          ? "畫面反映目前開發階段，介面與細節可能持續調整。"
          : "Screens reflect the current development stage; interface and details may continue to change."}
      </p>
    </figure>
  );
}

const IMG = "/images/case04";

/**
 * CASE04 V4 — restructured from a 9-chapter (01-08 + Reflection) project
 * archive into a 6-chapter senior-curated case study, per Angela's
 * explicit restructure brief (2026-09-23, uncommitted — see HANDOFF.md).
 * Narrative order: The Challenge & My Role -> From Long Form to Guided
 * Input -> Designing a State-Aware Product (merges the old State-Aware
 * Home + State & Recovery sections) -> Connecting the Product Journey
 * (new flow diagram replaces the old Input/Generate/Listen/Feedback/
 * History grid) -> Reusable System & Mobile Constraints (merges the old
 * Reusable Patterns + Key Trade-offs, adds real mobile-constraint copy)
 * -> Delivery (merges the old Current Outcome + the standalone
 * Reflection section, which no longer exists on its own).
 *
 * Confidentiality unchanged from V3: no LABO65, no Five-Element/chakra/
 * frequency content, no 7/21-day healing-plan detail, no generation
 * algorithm, no pricing/quota/commercial logic — see HANDOFF.md CASE04
 * confidentiality rules. The internal design slogan ("少讀、少打、少滑、
 * 少等、不強迫") and any close rewrite of it are deliberately excluded
 * from this public copy, per explicit instruction.
 *
 * Image reuse: `case04-generating-v2.webp` appears once, in Section 03
 * (recovery evidence) — deliberately not repeated in Section 04's
 * supporting strip, per instruction. Natural Sounds / Preferred
 * Instruments screenshots are not used anywhere in this restructure
 * (omitted from Section 02 to keep it from growing long, so Section 05
 * has nothing to duplicate).
 *
 * Locale-aware: `zhHant` branches every hardcoded string below, following
 * the same convention as Case One/Two/Three. Section LABELS are the one
 * exception — see the SectionHeading comment above.
 */
export function CaseFourFinalContent({ register, locale }: { register: RegisterSection; locale: Locale }) {
  const zhHant = locale === "zh";
  return (
    <>
      {/* 01 — The Challenge & My Role. Merges the old Context & Role
          section with essential challenge framing — one section, not a
          separate problem list. The old right-column "design in active
          development" side note was removed: the Hero now states that
          fact directly, so repeating it here was redundant. */}
      <Section index={0} register={register} divider={false}>
        <Reveal>
          <SectionHeading
            label="01 — THE CHALLENGE & MY ROLE"
            title={zhHant ? "在既有產品上重新建立完整體驗" : "Redesigning an Existing Product Without Starting Over"}
          />
        </Reveal>
        <div className="mt-8 max-w-[62ch] space-y-5">
          {zhHant ? (
            <>
              <p className="cf-body body-tc">我接手時，產品已經具備可操作的核心功能，但不同功能之間還沒有形成一致的完整體驗。</p>
              <p className="cf-body body-tc">
                原有問卷是一個連續往下滑的長表單；個人化內容需要實際生成時間；失敗與網路中斷需要更完整的恢復方式；首頁、播放器與歷史紀錄之間，也需要重新整理彼此的關係。
              </p>
              <p className="cf-body body-tc">我的工作不是重新開始，而是在既有產品與技術基礎上，把這些功能重新整理成一套較清楚的行動產品流程。</p>
            </>
          ) : (
            <>
              <p className="cf-body body-tc">The early version already supported the product&apos;s core functionality, but several parts of the experience had developed independently.</p>
              <p className="cf-body body-tc">
                The questionnaire relied on a long scrolling form. Personalized content required meaningful generation time. Failure and connectivity issues needed clearer recovery paths, while Home, playback and history needed to work as one continuous experience.
              </p>
              <p className="cf-body body-tc">My role was to reorganize those existing functions into a clearer mobile product journey while working within the product and engineering foundation already in place.</p>
            </>
          )}
        </div>
        <div className="mt-10 border-t cf-rule">
          {(zhHant
            ? [
                ["PM", "需求、範疇與專案協調"],
                ["Full-stack Engineer", "早期功能流程、既有技術基礎與產品實作"],
                ["UI/UX 設計師／我", "檢視既有體驗、重整流程、互動與狀態設計、建立可重用的介面系統與原型，並與工程確認可行性"],
              ]
            : [
                ["PM", "Requirements, scope, and coordination"],
                ["Full-stack Engineer", "Early functional flow, existing technical foundation, and implementation"],
                ["UI/UX Designer / Me", "Reviewed existing experience, restructured flows, interaction and state design, built a reusable UI system and prototype, and worked with engineering on feasibility"],
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
      </Section>

      {/* 02 — From Long Form to Guided Input. Condensed from the old
          02 (Before/After) + 03 (Interaction Decisions): keeps the
          primary Before/After evidence, then only 2 representative
          interaction examples (slider, radial) at full weight plus scene
          cards as smaller supporting evidence. Natural Sounds / Preferred
          Instruments deliberately omitted here (and therefore not
          duplicated in Section 05) to keep this section from growing
          long, per instruction. */}
      <Section index={1} register={register}>
        <Reveal>
          <SectionHeading
            label="02 — FROM LONG FORM TO GUIDED INPUT"
            title={zhHant ? "把一個連續問卷重新整理成分階段流程" : "Turning One Continuous Questionnaire Into a Staged Experience"}
          />
        </Reveal>
        <div className="mt-8 max-w-[62ch] space-y-5">
          <p className="cf-body body-tc">
            {zhHant
              ? "原本的問卷把多組問題集中在單一長頁面，並重複使用相近的選取方式。"
              : "The original questionnaire placed multiple groups of questions on one long page using repeated selection patterns."}
          </p>
          <p className="cf-body body-tc">
            {zhHant
              ? "我將流程重新設計成具明確進度的分步式體驗，並依照不同問題的內容，選擇更適合的互動方式。"
              : "I redesigned it as a guided multi-step flow with explicit progress and interaction patterns selected according to what each question needed."}
          </p>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:items-start lg:gap-14">
          <div>
            <p className="cf-meta cf-dim mb-4">{zhHant ? "既有工程版本・改版前" : "EXISTING ENGINEERING VERSION · BEFORE"}</p>
            <ComposedEvidence
              asset={{
                src: `${IMG}/case04-questionnaire-before-v2.webp`,
                alt: "Engineer-built daily questionnaire shown as two separate long-scroll captures, stacked with a visible gap",
              }}
              aspectClassName="aspect-[1080/4736] max-h-[720px]"
              caption={
                zhHant
                  ? "多個分類與大量選項集中在同一個長頁面中，沒有分段，也缺少清楚的進度提示。"
                  : "Multiple categories and a large number of options are packed onto one long page, with no segmentation and no clear sense of progress."
              }
            />
          </div>
          <div>
            <p className="cf-meta cf-accent mb-4">{zhHant ? "重新設計後" : "REDESIGNED"}</p>
            <ComposedEvidence
              asset={{
                src: `${IMG}/case04-questionnaire-after-overview-v2.webp`,
                alt: "Guided daily questionnaire shown as a contact sheet overview, one panel per step",
              }}
              aspectClassName="aspect-[1340/1932]"
              caption={
                zhHant
                  ? "拆成多個階段，每一步只問一件事，並用明確的進度取代不確定要填多久的長表單。"
                  : "Split into staged steps, each asking one thing, with explicit progress replacing a long form of uncertain length."
              }
            />
          </div>
        </div>

        <p className="cf-body body-tc mt-12 max-w-[62ch]">
          {zhHant
            ? "重點不只是把一張長表單拆成數個畫面，而是讓不同類型的輸入有更合適的操作方式，同時維持整段流程在導覽與選取狀態上的一致性。"
            : "Rather than treating every input as the same type of control, the redesign uses more appropriate interaction models for different kinds of decisions while keeping navigation and selected states consistent throughout the flow."}
        </p>

        <div className="mt-12 grid gap-10 border-t cf-rule pt-12 sm:grid-cols-[minmax(0,280px)_minmax(0,280px)_minmax(0,200px)]">
          <div>
            <p className="cf-meta cf-accent">{zhHant ? "滑桿＋視覺狀態指示" : "SLIDER + VISUAL STATE INDICATOR"}</p>
            <PhoneEvidence
              className="mt-4"
              asset={{ src: `${IMG}/case04-guided-step02-slider.webp`, alt: "A step in the guided daily flow: a slider with a reactive visual state indicator, plus specific emotion choices" }}
              caption={zhHant ? "滑桿選擇" : "Slider choice"}
            />
          </div>
          <div>
            <p className="cf-meta cf-accent">{zhHant ? "環狀選擇" : "RADIAL SELECTION"}</p>
            <PhoneEvidence
              className="mt-4"
              asset={{ src: `${IMG}/case04-guided-step03-radial.webp`, alt: "A step in the guided daily flow: a radial constellation picker for desired outcomes" }}
              caption={zhHant ? "環狀選擇" : "Radial choice"}
            />
          </div>
          <div className="sm:opacity-90">
            <p className="cf-meta cf-dim">{zhHant ? "場景卡片" : "SCENE CARDS"}</p>
            <PhoneEvidence
              className="mt-4 max-w-[200px]"
              asset={{ src: `${IMG}/case04-guided-scene.webp`, alt: "A step in the guided daily flow: a swipeable image-card carousel for choosing a listening scene" }}
              caption={zhHant ? "場景選擇" : "Scene choice"}
            />
          </div>
        </div>
      </Section>

      {/* 03 — Designing a State-Aware Product. Merges the old 04
          (State-Aware Home) + 05 (State & Recovery) into one section —
          the strongest senior-UX evidence in this case, per instruction.
          Recovery evidence (generation failure / playback error) leads,
          Home's state-driven redesign follows. */}
      <Section index={2} register={register}>
        <Reveal>
          <SectionHeading
            label="03 — DESIGNING A STATE-AWARE PRODUCT"
            title={zhHant ? "不只設計成功流程，也處理等待、失敗與返回" : "The Experience Had to Work Beyond the Happy Path"}
          />
        </Reveal>
        <div className="mt-8 max-w-[62ch] space-y-5">
          <p className="cf-body body-tc">
            {zhHant
              ? "個人化內容需要一定時間生成，因此不能只依賴一個會卡住整個畫面的載入畫面。"
              : "Personalized content takes time to generate, so a blocking loading screen was not enough."}
          </p>
          <p className="cf-body body-tc">
            {zhHant
              ? "我重新定義生成、失敗、重試、已完成生成、聆聽中與完成等主要狀態，以及使用者在不同狀態下可以採取的下一步操作。"
              : "I defined how the product should behave across key states including generation, failure, retry, ready, listening and completion."}
          </p>
          <p className="cf-body body-tc">
            {zhHant
              ? "生成期間可以離開畫面，之後再從對應狀態返回；若遇到生成失敗或網路中斷，原先已完成的輸入也會保留，讓使用者可以重試，而不需要重新走完整段問卷。"
              : "Users can leave while generation continues and return later through the appropriate state. If generation fails or connectivity is interrupted, previously entered information is preserved so the user can retry instead of restarting the questionnaire."}
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="grid grid-cols-2 gap-5">
            <PhoneEvidence
              asset={{ src: `${IMG}/case04-generating-v2.webp`, alt: "Generating today's soundscape with guidance that the user can leave and return" }}
              caption={zhHant ? "生成中，可離開此頁" : "Generating — safe to leave"}
            />
            <PhoneEvidence
              asset={{ src: `${IMG}/case04-generation-failed-v2.webp`, alt: "Generation failed state; the user's questionnaire answers have been preserved, with retry and defer actions" }}
              caption={zhHant ? "失敗，答案已保留" : "Failed — answers preserved"}
            />
          </div>
          <PhoneEvidence
            className="mx-auto w-full max-w-[300px] sm:max-w-none"
            asset={{ src: `${IMG}/case04-playback-error.webp`, alt: "Playback error state; the soundscape and playback progress are preserved, with a retry action" }}
            caption={zhHant ? "「你的聲景與播放進度不會被刪除」" : "“Your soundscape and playback progress won't be deleted.”"}
          />
        </div>

        <p className="cf-body body-tc mt-12 max-w-[62ch] border-t cf-rule pt-10">
          {zhHant
            ? "首頁也依照同一套狀態邏輯重新整理。主要內容與 CTA 會依使用者目前所在階段改變，而不是把所有功能以相同權重一起呈現。"
            : "Home was redesigned around the same state model. Its primary content and action change according to where the user currently is in the experience rather than presenting every function with equal priority."}
        </p>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <PhoneEvidence
            className="mx-auto w-full max-w-[260px] sm:max-w-none"
            asset={{ src: `${IMG}/case04-home-guest.webp`, alt: "Guest Home state, brand identity masked" }}
            caption={zhHant ? "訪客" : "Guest"}
          />
          <PhoneEvidence
            className="mx-auto w-full max-w-[260px] sm:max-w-none"
            asset={{ src: `${IMG}/case04-home-ready-v5.webp`, alt: "Home state with today's soundscape ready to start, brand identity and personalization-mechanism details removed" }}
            caption={zhHant ? "尚未開始" : "Ready"}
          />
          <PhoneEvidence
            className="mx-auto w-full max-w-[260px] sm:max-w-none"
            asset={{ src: `${IMG}/case04-home-listening.webp`, alt: "Home state while today's soundscape is playing, with playback progress and a pause action, brand identity and personalization-mechanism details removed" }}
            caption={zhHant ? "聆聽中" : "Listening"}
          />
          <PhoneEvidence
            className="mx-auto w-full max-w-[260px] sm:max-w-none"
            asset={{ src: `${IMG}/case04-home-completed.webp`, alt: "Home state after today's soundscape has finished playing, with a replay action, brand identity and personalization-mechanism details removed" }}
            caption={zhHant ? "已完成" : "Completed"}
          />
        </div>
      </Section>

      {/* 04 — Connecting the Product Journey. Replaces the old
          Input/Generate/Listen/Feedback/History grid with a two-tier
          diagram: a primary six-node journey (equal visual weight,
          horizontally scrollable on small screens, same pattern as the
          old single-row diagram) plus a smaller, dimmer secondary block
          showing Generate's own lifecycle underneath — main journey =
          primary hierarchy, generation lifecycle = secondary hierarchy,
          per instruction. Plain text/rule/arrow treatment, matching this
          file's existing diagram language — no new chart library, no
          decorative effects. */}
      <Section index={3} register={register}>
        <Reveal>
          <SectionHeading
            label="04 — CONNECTING THE PRODUCT JOURNEY"
            title={zhHant ? "把不同功能串成一套連續產品流程" : "Connecting the Experience Into One Continuous Journey"}
          />
        </Reveal>
        <p className="cf-body body-tc mt-8 max-w-[62ch]">
          {zhHant ? "我將核心使用體驗整理成一條連續流程：" : "I reorganized the core experience into one continuous journey:"}
        </p>

        {/* Right-edge fade signals "more content this way" on touch
            screens without instructional copy and without shrinking the
            diagram — native scrollbars don't stay visible at rest on
            mobile, so this is the only affordance a first-time mobile
            visitor sees before they touch it. Hidden at `lg`+, where the
            row already fits without scrolling. */}
        <div className="relative mt-8">
          <div
            className="cf-scroll-region overflow-x-auto pb-3"
            tabIndex={0}
            role="group"
            aria-label="Product journey: Profile Setup, Guided Input, Generate, Listen, History, Return"
          >
            <div className="grid min-w-[52rem] grid-cols-6 border-y cf-rule">
              {(zhHant
                ? ["個人資料", "引導式輸入", "生成", "聆聽", "歷史紀錄", "再次返回"]
                : ["Profile Setup", "Guided Input", "Generate", "Listen", "History", "Return"]
              ).map((step, index) => (
                <div key={step} className="relative flex min-h-24 items-center px-5 py-6">
                  <span className="cf-meta cf-accent mr-4">0{index + 1}</span>
                  <span className="cf-heading text-[15px] font-medium">{step}</span>
                  {index < 5 && <span aria-hidden className="absolute right-0 cf-accent">→</span>}
                  {index === 5 && <span aria-hidden className="ml-auto text-xl cf-accent">↺</span>}
                </div>
              ))}
            </div>
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[color:var(--cf-bg)] to-transparent lg:hidden"
          />
        </div>

        {/* Secondary hierarchy: Generate's own lifecycle, deliberately
            smaller/dimmer and positioned below the primary journey. */}
        <div className="mt-6 max-w-[36rem] border-l-2 border-l-[color:var(--cf-hairline)] pl-5">
          <p className="cf-meta cf-dim">{zhHant ? "生成的狀態" : "GENERATE — LIFECYCLE"}</p>
          <div className="mt-3 space-y-2 text-[13px] leading-6 cf-dim">
            <p>
              {zhHant ? "生成中" : "Generating"} <span aria-hidden>→</span> {zhHant ? "已完成生成" : "Ready"}
            </p>
            <p>
              {zhHant ? "失敗" : "Failed"} <span aria-hidden>→</span> {zhHant ? "重試／繼續" : "Retry / Resume"}{" "}
              <span aria-hidden>↩</span> {zhHant ? "生成" : "Generate"}
            </p>
          </div>
        </div>

        <p className="cf-body body-tc mt-10 max-w-[62ch]">
          {zhHant
            ? "這套結構把首次設定、每日輸入、非同步生成、播放與再次使用串在同一套操作邏輯裡，而不是讓每個功能各自形成獨立流程。"
            : "This structure connects first-time setup, repeated daily input, asynchronous generation, playback and return use without requiring a separate interaction model for every feature."}
        </p>
        <p className="cf-dim mt-4 max-w-[62ch] text-[13px] leading-6">
          {zhHant
            ? "把輸入、生成、恢復、聆聽到再次使用串成完整流程。"
            : "A state-aware product journey connecting guided input, asynchronous generation, recovery, listening and return use."}
        </p>

        <div className="mt-10 flex gap-5 border-t cf-rule pt-10">
          <PhoneEvidence
            className="w-full max-w-[180px]"
            frameClassName="shadow-[0_20px_60px_rgb(0_0_0/0.28)]"
            asset={{ src: `${IMG}/case04-player.webp`, alt: "Player for listening to a generated soundscape" }}
            caption={zhHant ? "聆聽" : "Listen"}
          />
          <PhoneEvidence
            className="w-full max-w-[180px]"
            asset={{ src: `${IMG}/case04-history-v2.webp`, alt: "Listening history showing recent activity and per-track summaries" }}
            caption={zhHant ? "歷史紀錄" : "History"}
          />
        </div>
      </Section>

      {/* 05 — Reusable System & Mobile Constraints. Merges the old 07
          (Reusable Patterns + Key Trade-offs) with new mobile-constraint
          copy. Natural Sounds / Preferred Instruments are not repeated
          here — they weren't used in Section 02 either, so there is
          nothing to duplicate. Trade-offs condensed to 3 compact
          before/after cards, no explanatory sentence per card. */}
      <Section index={4} register={register}>
        <Reveal>
          <SectionHeading
            label="05 — REUSABLE SYSTEM & MOBILE CONSTRAINTS"
            title={zhHant ? "從實際行動裝置限制建立可重複使用的設計規則" : "Reusable Rules Shaped by Real Mobile Constraints"}
          />
        </Reveal>
        <div className="mt-8 max-w-[62ch] space-y-5">
          <p className="cf-body body-tc">
            {zhHant
              ? "隨著重新設計的範圍擴大，我將重複出現的互動方式整理成共用 UI 規則，包括導覽、選取狀態、字體層級、間距、圖示，以及不同產品狀態的呈現方式。"
              : "As the redesign expanded, repeated interaction patterns were consolidated into shared UI rules covering navigation, selection states, typography, spacing, icon usage and recurring status behavior."}
          </p>
          <p className="cf-body body-tc">
            {zhHant ? "一些實際的行動裝置限制，也直接改變了設計。" : "Several mobile constraints directly affected those decisions."}
          </p>
          <p className="cf-body body-tc">
            {zhHant
              ? "內容生成需要較長等待時間，因此使用者不能被限制在單一畫面；手機鍵盤會影響表單與主要操作的位置；生成失敗或網路中斷則需要能重新嘗試，同時保留先前完成的輸入。"
              : "Long generation times required an experience that could continue without keeping the user on one screen. Mobile keyboard behavior affected form structure and primary-action placement. Failure and network interruption required retry and resume behavior that protected previously completed input."}
          </p>
          <p className="cf-body body-tc">
            {zhHant
              ? "另外也建立了互動原型，用來呈現完整流程與不同狀態之間的實際轉換。"
              : "An interactive prototype was also created to demonstrate the redesigned flow and state transitions beyond static screens."}
          </p>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 sm:max-w-[36rem]">
          <PhoneEvidence
            className="mx-auto w-full max-w-[240px]"
            asset={{ src: `${IMG}/case04-profile-birthdate-v2.webp`, alt: "Profile setup step 1 of 4, showing a step-progress indicator" }}
            caption={zhHant ? "個人資料設定（1/4）" : "Profile setup (1/4)"}
          />
          <PhoneEvidence
            className="mx-auto w-full max-w-[240px]"
            asset={{ src: `${IMG}/case04-guided-step01-categories.webp`, alt: "Daily questionnaire, showing the same step-progress indicator pattern" }}
            caption={zhHant ? "每日問卷" : "Daily questionnaire"}
          />
        </div>
        <p className="cf-body body-tc mt-6 max-w-[62ch]">
          {zhHant ? "不同流程沿用同一套步驟進度模式。" : "Different flows reuse the same step-progress pattern."}
        </p>

        <div className="mt-14 border-t cf-rule pt-12">
          <p className="cf-meta cf-dim">{zhHant ? "關鍵取捨" : "KEY TRADE-OFFS"}</p>
          <div className="mt-6 grid gap-px bg-[color:var(--cf-hairline)] sm:grid-cols-3">
            {(zhHant
              ? [
                  ["單一長頁面", "分階段引導式流程"],
                  ["強迫使用者等待", "允許離開後再返回"],
                  ["失敗後清空重來", "保留輸入並可重試"],
                ]
              : [
                  ["Single long page", "Staged guided flow"],
                  ["Force user to wait", "Allow leaving and returning"],
                  ["Reset after failure", "Preserve input and retry"],
                ]
            ).map(([before, after]) => (
              <div key={before} className="bg-[color:var(--cf-bg)] p-6">
                <p className="cf-dim text-[13.5px] leading-6">{before}</p>
                <p aria-hidden className="cf-accent my-1 text-[13px]">↓</p>
                <p className="cf-heading text-[15px] font-medium leading-snug">{after}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* 06 — Delivery. Merges the old 08 (Current Outcome) + the
          standalone Reflection section, which no longer exists as its
          own chapter. Plain prose, no card grid, no status badge. */}
      <Section index={5} register={register}>
        <Reveal>
          <SectionHeading
            label="06 — DELIVERY"
            title={zhHant ? "這次重新設計完成了什麼" : "What the Redesign Delivered"}
          />
        </Reveal>
        <div className="mt-8 max-w-[62ch] space-y-5 border-t cf-rule pt-10">
          <p className="cf-body body-tc">
            {zhHant
              ? "我完成既有行動產品的端到端 UX/UI 重整，涵蓋核心流程、引導式輸入、生成生命週期、錯誤與恢復狀態、首頁、播放器、歷史紀錄、可重複使用的 UI 規則，以及互動原型。"
              : "I delivered an end-to-end UX/UI redesign covering the core mobile journey, guided input, generation lifecycle, failure and recovery states, Home, Player, History, reusable UI patterns, and an interactive prototype."}
          </p>
          <p className="cf-body body-tc">
            {zhHant
              ? "目前設計與開發持續進行中，並朝上架準備推進。"
              : "Design and development are ongoing as the product moves toward release readiness."}
          </p>
          <p className="cf-body body-tc">
            {zhHant
              ? "由於產品尚未完成正式公開上線週期，因此本案例不宣稱轉換率、留存率或使用率等上線後成效，而是以實際可展示的流程、互動決策、狀態設計與設計交付作為成果證據。"
              : "Because the product has not completed its public release cycle, this case does not claim post-launch conversion, retention or engagement metrics. The case instead focuses on the product structure, interaction decisions and design output that can be directly demonstrated."}
          </p>
        </div>
      </Section>
    </>
  );
}
