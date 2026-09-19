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
 * Player unchanged.
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

// V3: replaces the old four-conclusion "Synthesis" section. These three
// statements are deliberately scoped to what the evidence in Sections
// 01-07 actually shows — coverage and consistency, not impact. No launch,
// retention, conversion, completion-rate, or satisfaction claim belongs
// here until real data exists (see HANDOFF.md's Current Outcome note).
const OUTCOME_ZH = [
  "重新設計已從核心生成流程，延伸到首頁生命週期、播放、紀錄與例外狀態。",
  "核心體驗不只涵蓋成功路徑；生成失敗、網路中斷與播放錯誤，也有清楚的狀態與復原方式。",
  "從輸入、生成、播放、回饋到紀錄，產品逐步形成完整且連續的行動體驗，而不是彼此獨立的功能畫面。",
] as const;

// EN: approved recruiter-facing localization (see HANDOFF.md CASE04 V3
// EN pass) — same scope discipline as ZH: coverage and consistency only,
// no launch/retention/conversion/satisfaction claim.
const OUTCOME_EN = [
  "The redesign now extends from the core generation flow to Home's lifecycle, playback, history, and exception states.",
  "The core experience no longer covers only the success path — generation failure, connection loss, and playback error all have explicit states and a way to recover.",
  "From input through generation, playback, feedback, and history, the product now forms one connected loop instead of a set of separate feature screens.",
] as const;

const STATUS_ZH = "目前狀態：設計與開發持續進行中。";
const STATUS_EN = "Current status: design and development are ongoing.";

const IMG = "/images/case04";

/**
 * CASE04 V3 — restructured around confirmed Sep19 product evidence
 * (previous evidence base was Sep16), audited section-by-section against
 * the Sep19 export before this pass (see HANDOFF.md for the full
 * audit, provenance, and confidentiality trail). Public identity remains
 * anonymized as "Mobile Wellness Product" — no product/brand wordmark, no
 * quota/generation-allowance, no membership/subscription content, and no
 * chakra/Five-Element personalization-mechanism content anywhere in this
 * file (Sep19 added a "chakra result" step and expanded Home/Account
 * screens that do expose this — deliberately not used here; see the
 * Section 03 and Section 04 comments below).
 *
 * Narrative order (V3): Context & Role -> From Existing Version to a
 * Guided Flow (Before/After) -> Interaction Decisions -> State-Aware
 * Product -> State & Recovery Design -> Product Continuity -> Reusable
 * Patterns & Key Trade-offs -> Current Outcome -> Closing. Section count
 * and numbering are unchanged from V2 (01-08 + an unnumbered Closing);
 * only content within a handful of sections changed — this is a content
 * update, not a rebuild. Friends & Family is confirmed NOT part of this
 * public narrative (ownership unconfirmed, third-party personal data);
 * it stays interview-only material, per HANDOFF.md.
 *
 * Locale-aware: `zhHant` branches every hardcoded string below, following
 * the same convention as Case One/Two/Three. ZH is the approved V3 copy
 * (final ZH release review passed — see HANDOFF.md). EN below is the
 * approved recruiter-facing localization pass on top of it — not a
 * literal translation: written for a senior recruiter / hiring manager /
 * lead product designer audience, same factual boundaries as ZH (early
 * functional product already existed; Angela's contribution is the UX/UI
 * redesign and product-design layer on top of it, not the original
 * concept), no unevidenced "intuitive/seamless/frictionless/delightful/
 * user-centric" language, and no research/testing/KPI/launch/retention/
 * conversion claim anywhere — see HANDOFF.md CASE04 V3 EN pass note.
 */
export function CaseFourFinalContent({ register, locale }: { register: RegisterSection; locale: Locale }) {
  const zhHant = locale === "zh";
  return (
    <>
      {/* 01 — Context & My Role (merges the old Team & My Role + Taking
          Over an Active Product into one section: state ownership once,
          clearly, early, without repeating the disclaimer later). */}
      <Section index={0} register={register} divider={false}>
        <Reveal>
          <SectionHeading
            label={zhHant ? "01 — 專案背景與我的角色" : "01 — CONTEXT & MY ROLE"}
            title={zhHant ? "在既有功能基礎上，重新整理產品體驗" : "Reorganizing the Product Experience on an Existing Foundation"}
            intro={
              zhHant
                ? "加入專案時，工程團隊已經做出一版可以運作的功能流程。以下是當時的團隊分工，以及我實際負責的範圍。"
                : "When I joined, engineering had already built a working functional flow. Below is the team split at that point, and exactly what I was responsible for."
            }
          />
        </Reveal>
        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="border-t cf-rule">
              {(zhHant
                ? [
                    ["PM", "需求、範疇與專案協調"],
                    ["Full-stack Engineer", "早期功能流程、既有技術基礎與產品實作"],
                    ["UI/UX 設計師／我", "檢視既有體驗、重整關鍵流程、設計互動與狀態、建立可重用的介面模式，並持續與工程確認可行性"],
                  ]
                : [
                    ["PM", "Requirements, scope, and project coordination"],
                    ["Full-stack Engineer", "Early functional flow, existing technical foundation, and product implementation"],
                    ["UI/UX Designer / Me", "Reviewed the existing experience, restructured key flows, designed interaction and states, built reusable interface patterns, and kept checking feasibility with engineering"],
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
                ? "我加入時，產品已有可運作的早期版本；我的工作從既有基礎出發，重整 UX/UI、互動與狀態設計，並持續與工程確認實作可行性。"
                : "When I joined, the product already had a functional early version. I worked from that foundation to restructure the UX/UI, interaction, and state design, while continuously validating feasibility with engineering."}
            </p>
          </div>
        </div>
      </Section>

      {/* 02 — From Existing Version to a Guided Flow. The main Before/After
          moment: confirmed Sep8 engineer-built questionnaire (stacked
          composite, not a fabricated continuous scroll — see HANDOFF.md
          provenance note) vs. the current Sep19 guided flow (contact-sheet
          overview only; individual steps are explained in Section 03, not
          repeated here). V3: the title/caption/body deliberately no longer
          state an exact step count — Sep16 was six steps, Sep19 is seven,
          and a hardcoded number broke once already. "分階段的引導式流程"
          keeps the claim (staged decisions, explicit progress, controlled
          density) true regardless of how the product's step count changes
          next. The overview image itself was also regenerated (-v2) from
          Sep19 with the per-step progress counter cropped out, for the
          same reason. The "before" composite also moved to -v2: the full
          public-directory audit found its intro line legibly read "我們會
          把你的能量結構...編成一段聲景" — missed in the earlier freeze
          because it's small intro text on a long reference screenshot, not
          the main subject. Cropped out via the same flat-color-match
          technique (the surrounding background is a solid fill, so the
          removal is exact, not a visible patch) — see HANDOFF.md CASE04 V3
          final-review note. */}
      <Section index={1} register={register}>
        <Reveal>
          <SectionHeading
            label={zhHant ? "02 — 從既有版本到引導式體驗" : "02 — FROM THE EXISTING VERSION TO A GUIDED EXPERIENCE"}
            title={zhHant ? "從一個長頁面，到分階段的引導式流程" : "From One Long Page to a Staged, Guided Flow"}
            intro={
              zhHant
                ? "既有工程版本的每日問卷把所有題目放在同一個頁面上。這裡想說明的不是視覺風格的差異，而是資訊結構本身的改變。"
                : "The existing engineering version's daily questionnaire put every question on one page. The point here isn't a visual style difference — it's a change in the information structure itself."
            }
          />
        </Reveal>
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
            ? "改變的是結構：一個長頁面，變成循序、分階段的步驟；集中呈現的大量選項，變成每一步各自可控的資訊量。各步驟實際用了哪些互動方式，會在下一節逐一說明。"
            : "What changed is the structure: one long page became a sequence of staged steps; a large set of options shown all at once became a controlled amount of information per step. The next section walks through what interaction each step actually uses."}
        </p>
      </Section>

      {/* 03 — Interaction Decisions (renamed from "Guided Decision Flow" —
          same underlying evidence, but the label now matches what the
          section actually argues: the interaction reasoning, not the flow
          itself). V3 evidence swap: the Sep19 category/radar step (step 1)
          is deliberately NOT shown here — its Low/Mid/High-per-category
          interaction has an open usability/rationale question that hasn't
          been resolved (see HANDOFF.md), so it isn't ready as "clearest
          evidence" either in its old Sep16 form (now stale — the product
          no longer works that way) or its new Sep19 form (unresolved).
          Scene selection (Sep19 step 5) replaces it instead — a fourth,
          visually distinct interaction type (image-card carousel) that
          keeps the section from thinning to two examples. Sep19 step 4
          (the chakra/Five-Element intermediate result) is excluded
          entirely, per the confidentiality decision — not shown, not
          referenced, not the "if useful" case anywhere in this file. */}
      <Section index={2} register={register}>
        <Reveal>
          <SectionHeading
            label={zhHant ? "03 — 互動設計決策" : "03 — INTERACTION DECISIONS"}
            title={zhHant ? "依照問題的性質，設計對應的互動方式" : "Matching the Interaction to What Each Question Actually Asks"}
            intro={
              zhHant
                ? "流程裡的每一步問的不是同一種問題，因此沒有用同一種介面回答每一步。"
                : "The steps in this flow aren't asking the same kind of question, so they aren't answered with the same interface."
            }
          />
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="cf-meta cf-accent">{zhHant ? "滑桿＋視覺狀態指示＋具體情緒選擇" : "SLIDER + VISUAL STATE INDICATOR + SPECIFIC EMOTION CHOICES"}</p>
            <p className="cf-body body-tc mt-4 max-w-[42ch]">
              {zhHant
                ? "滑桿用來表達整體狀態的強弱，下方的情緒選項則是在需要時，補充更具體的描述——兩者對應的是強度與內容這兩個不同層面。"
                : "The slider expresses the overall intensity of a state; the emotion choices below it add a more specific description when needed — the two map to intensity and content, two different layers, not the same question twice."}
            </p>
          </div>
          <div className="lg:col-span-7">
            <PhoneEvidence
              className="mx-auto w-full max-w-[300px]"
              asset={{ src: `${IMG}/case04-guided-step02-slider.webp`, alt: "A step in the guided daily flow: a slider with a reactive visual state indicator, plus specific emotion choices" }}
              caption={zhHant ? "滑桿選擇" : "Slider choice"}
            />
          </div>
        </div>

        <div className="mt-16 grid gap-10 border-t cf-rule pt-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="cf-meta cf-accent">{zhHant ? "環狀選擇" : "RADIAL SELECTION"}</p>
            <p className="cf-body body-tc mt-4 max-w-[42ch]">
              {zhHant
                ? "這一題的選項沒有明確先後順序，因此用環狀排列維持相近的視覺層級，讓使用者直接從目標狀態中選擇。"
                : "This question's options have no inherent order, so a radial layout keeps them at a similar visual level, letting people pick directly from the set of desired states."}
            </p>
          </div>
          <div className="lg:col-span-7">
            <PhoneEvidence
              className="mx-auto w-full max-w-[300px]"
              asset={{ src: `${IMG}/case04-guided-step03-radial.webp`, alt: "A step in the guided daily flow: a radial constellation picker for desired outcomes" }}
              caption={zhHant ? "環狀選擇" : "Radial choice"}
            />
          </div>
        </div>

        <div className="mt-16 grid gap-10 border-t cf-rule pt-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="cf-meta cf-accent">{zhHant ? "場景卡片" : "SCENE CARDS"}</p>
            <p className="cf-body body-tc mt-4 max-w-[42ch]">
              {zhHant
                ? "選擇聆聽場景是偏好直覺的判斷，用可滑動的圖像卡片取代文字選項，讓使用者用視覺直接感受再決定。"
                : "Choosing a listening scene is a preference-led decision, not an analytical one, so it uses swipeable image cards instead of text options — letting people judge by feel, not by reading."}
            </p>
          </div>
          <div className="lg:col-span-7">
            <PhoneEvidence
              className="mx-auto w-full max-w-[300px]"
              asset={{ src: `${IMG}/case04-guided-scene.webp`, alt: "A step in the guided daily flow: a swipeable image-card carousel for choosing a listening scene" }}
              caption={zhHant ? "場景選擇" : "Scene choice"}
            />
          </div>
        </div>

        <div className="mt-16 grid gap-10 border-t cf-rule pt-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="cf-meta cf-accent">{zhHant ? "相同的互動模式" : "THE SAME INTERACTION PATTERN"}</p>
            <p className="cf-body body-tc mt-4 max-w-[42ch]">
              {zhHant
                ? "「自然聲」與「偏好樂器」內容不同，但都是可略過、最多選 3 項的低壓力補充選擇，因此採用相同的互動模式。"
                : "“Natural sounds” and “preferred instruments” are different content, but both are optional, low-pressure choices capped at 3 selections — so they use the same interaction pattern."}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 lg:col-span-7">
            <PhoneEvidence
              className="mx-auto w-full max-w-[280px]"
              asset={{ src: `${IMG}/case04-guided-step05-naturalsounds.webp`, alt: "A step in the guided daily flow: an optional, skippable multi-select for natural sounds" }}
              caption={zhHant ? "自然聲" : "Natural sounds"}
            />
            <PhoneEvidence
              className="mx-auto w-full max-w-[280px]"
              asset={{ src: `${IMG}/case04-guided-step06-instruments.webp`, alt: "A step in the guided daily flow: the same optional, skippable multi-select pattern applied to preferred instruments" }}
              caption={zhHant ? "偏好樂器" : "Preferred instruments"}
            />
          </div>
        </div>
      </Section>

      {/* 04 — State-Aware Product (V3 evidence swap). Ready / Listening /
          Completed — one playback lifecycle on the same Home screen,
          sourced together from Sep19 for visual/copy consistency, plus
          Guest as a fourth optional state. Quota Exhausted and Monthly
          are deliberately excluded — both would require explaining a
          quota/entitlement or a free-vs-paid tier to make sense, which
          is exactly the commercial content this case must not expose.
          case04-home-ready-v5 reuses the same -v5 derivative the Hero
          uses (see its own comment); Listening/Completed are new Sep19
          crops with matching treatment: wordmark row blurred, quota
          counter neutral-filled (small, sits on the photo — matches
          existing precedent), "我的能量結構" card removed via slice-and-
          stitch crop rather than a fill box, precisely matched to the
          card's own background-color edges — masking/cropping/reframing
          only, no generative edit, per HANDOFF.md's Sep19 confidentiality
          hotfix and the final-review note that a visible fill box reads
          as censorship where a clean crop does not. */}
      <Section index={3} register={register}>
        <Reveal>
          <SectionHeading
            label={zhHant ? "04 — 依產品狀態調整的介面" : "04 — A STATE-AWARE PRODUCT"}
            title={zhHant ? "同一個首頁，會依使用者當下的產品狀態改變" : "The Same Home Screen Changes With the User's Product State"}
            intro={
              zhHant
                ? "首頁不是單一固定畫面。內容的優先順序與主要行動，會隨著使用者當下所處的狀態改變。"
                : "Home isn't one fixed screen. Content priority and the primary action change with whatever state the user is currently in."
            }
          />
        </Reveal>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
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
        <p className="cf-body body-tc mt-10 max-w-[62ch]">
          {zhHant
            ? "同一張卡片，會依聆聽狀態改變主要行動與文案：尚未開始時是「開始」，聆聽中是進度與「暫停」，完成後是「再聽一次」——版位不變，但畫面清楚反映使用者現在在流程的哪一步。"
            : "The same card changes its primary action and copy with the listening state: “start” when nothing has played yet, progress and “pause” while listening, “play again” once finished — the slot stays the same, but the screen makes it clear where the user currently is in the flow."}
        </p>
      </Section>

      {/* 05 — State & Recovery Design (broadened from "Async States &
          Recovery"). V3: this is now built explicitly as two parallel
          examples, per the approved plan — generation failure protects
          INPUT effort, playback failure protects LISTENING progress,
          same principle at two different product stages. Playback Error
          is new Sep19 evidence (crop-only, no masking needed — no
          wordmark/quota/personalization content in that screen). Offline
          stays as smaller supporting evidence under the generation
          column, not a third parallel column, so the two-example
          structure the recruiter needs to read stays legible. Buffering
          is intentionally not used — it's a loading state, not a
          recovery moment, and doesn't add to either column's point. */}
      <Section index={4} register={register}>
        <Reveal>
          <SectionHeading
            label={zhHant ? "05 — 狀態與復原設計" : "05 — STATE & RECOVERY DESIGN"}
            title={zhHant ? "發生錯誤時，優先保護使用者已經投入的時間與進度" : "When Something Fails, Protect What the User Already Put In First"}
            intro={
              zhHant
                ? "個人化音樂的生成不是即時完成，體驗不能只設計「送出後成功」這一種結果；播放同樣可能中斷。兩種情境用的是同一套復原原則，保護的東西不同。"
                : "Generating personalized audio isn't instant, so the experience can't only be designed for the “submit then succeed” outcome — and playback can fail too. Both situations follow the same recovery principle; what they protect is different."
            }
          />
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="cf-meta cf-accent">{zhHant ? "生成失敗 — 保護輸入" : "GENERATION FAILURE — PROTECTS INPUT"}</p>
            <p className="cf-body body-tc mt-4 max-w-[46ch]">
              {zhHant
                ? "生成需要時間，使用者不需要守著畫面——可以先離開，完成後系統會通知。若失敗，問卷答案已保留，可以直接再試一次，不需要重新填寫。"
                : "Generation takes time, and the user doesn't need to stay on the screen — they can leave, and the system notifies them when it's done. If it fails, the questionnaire answers are preserved, so they can retry directly without filling anything in again."
              }
            </p>
            <div className="mt-6 grid grid-cols-2 gap-5">
              <PhoneEvidence
                asset={{ src: `${IMG}/case04-generating-v2.webp`, alt: "Generating today's soundscape with guidance that the user can leave and return" }}
                caption={zhHant ? "生成中，可離開此頁" : "Generating — safe to leave"}
              />
              <PhoneEvidence
                asset={{ src: `${IMG}/case04-generation-failed-v2.webp`, alt: "Generation failed state; the user's questionnaire answers have been preserved, with retry and defer actions" }}
                caption={zhHant ? "失敗，答案已保留" : "Failed — answers preserved"}
              />
            </div>
            <p className="cf-dim mt-5 max-w-[46ch] text-[13px] leading-6">
              {zhHant
                ? "網路中斷時沿用同一套邏輯：答案保留，並提供立即重試與稍後再試兩種選擇。"
                : "The same logic applies when the connection drops: answers stay preserved, with both a retry-now and a try-later option."}
            </p>
          </div>

          <div>
            <p className="cf-meta cf-accent">{zhHant ? "播放錯誤 — 保護聆聽進度" : "PLAYBACK ERROR — PROTECTS LISTENING PROGRESS"}</p>
            <p className="cf-body body-tc mt-4 max-w-[46ch]">
              {zhHant
                ? "播放中斷不會清空已經聽到的進度。畫面直接說明：聲景與播放進度都不會被刪除，重試就能從原本的狀態繼續。"
                : "A playback interruption doesn't reset how far the user already listened. The screen says so directly: neither the soundscape nor the playback progress is deleted, so retrying picks up from the same state."
              }
            </p>
            <div className="mt-6">
              <PhoneEvidence
                className="mx-auto w-full max-w-[300px]"
                asset={{ src: `${IMG}/case04-playback-error.webp`, alt: "Playback error state; the soundscape and playback progress are preserved, with a retry action" }}
                caption={zhHant ? "「你的聲景與播放進度不會被刪除」" : "“Your soundscape and playback progress won't be deleted.”"}
              />
            </div>
          </div>
        </div>

        <p className="cf-body body-tc mt-12 max-w-[62ch] border-t cf-rule pt-10">
          {zhHant
            ? "生成失敗保護的是輸入的努力；播放錯誤保護的是聆聽的進度。發生的階段不同，但背後是同一個復原原則。"
            : "Generation failure protects the effort someone put into answering; playback error protects how far they got listening. Different stages, same recovery principle underneath."}
        </p>
      </Section>

      {/* 06 — Product Continuity. V3: simplified to Input -> Generate ->
          Listen -> Feedback -> History per the approved plan — Home is no
          longer its own node (it's already the subject of Section 04),
          and Friends & Family is deliberately not represented here, kept
          out of the public loop entirely (see HANDOFF.md). History
          derivative already has expiry/download/quota content removed
          at the asset level — copy here stays on continuity only. */}
      <Section index={5} register={register}>
        <Reveal>
          <SectionHeading
            label={zhHant ? "06 — 產品的使用循環" : "06 — PRODUCT CONTINUITY"}
            title={zhHant ? "生成不是流程的終點" : "Generating Isn't Where the Flow Ends"}
            intro={
              zhHant
                ? "一次生成不是流程的終點；播放、回饋與紀錄讓體驗形成可重複使用的產品循環。"
                : "A single generation isn't the end of the flow — playback, feedback, and history extend it into a connected product loop."
            }
          />
        </Reveal>
        <div
          className="cf-scroll-region mt-10 overflow-x-auto pb-3"
          tabIndex={0}
          role="group"
          aria-label="Product loop: Input, Generate, Listen, Feedback, History"
        >
          <div className="grid min-w-[46rem] grid-cols-5 border-y cf-rule">
            {(zhHant
              ? ["輸入", "生成", "聆聽", "回饋", "歷史紀錄"]
              : ["Input", "Generate", "Listen", "Feedback", "History"]
            ).map((step, index) => (
              <div key={step} className="relative flex min-h-24 items-center px-5 py-6">
                <span className="cf-meta cf-accent mr-4">0{index + 1}</span>
                <span className="cf-heading text-[15px] font-medium">{step}</span>
                {index < 4 && <span aria-hidden className="absolute right-0 cf-accent">→</span>}
                {index === 4 && <span aria-hidden className="ml-auto text-xl cf-accent">↺</span>}
              </div>
            ))}
          </div>
        </div>
        <p className="cf-body body-tc mt-10 max-w-[62ch]">
          {zhHant
            ? "從引導輸入開始，生成完成後進入播放與回饋，最後串進聆聽紀錄——紀錄同時呈現最近 7、30、60 天的使用狀況，讓單次的生成結果，變成可以回顧的個人紀錄。"
            : "Starting from guided input, then into playback and feedback once generation finishes, and finally into listening history — history covers recent 7/30/60-day activity, turning a single generation into a record with continuity."}
        </p>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <PhoneEvidence
            asset={{ src: `${IMG}/case04-generating-v2.webp`, alt: "Generating today's soundscape from the guided input just submitted" }}
            caption={zhHant ? "生成" : "Generate"}
          />
          <PhoneEvidence
            frameClassName="shadow-[0_28px_80px_rgb(0_0_0/0.3)]"
            asset={{ src: `${IMG}/case04-player.webp`, alt: "Player for listening to a generated soundscape" }}
            caption={zhHant ? "聆聽" : "Listen"}
          />
          <PhoneEvidence
            asset={{ src: `${IMG}/case04-listening-complete.webp`, alt: "Post-listening feedback state" }}
            caption={zhHant ? "回饋" : "Feedback"}
          />
          <PhoneEvidence
            asset={{ src: `${IMG}/case04-history-v2.webp`, alt: "Listening history showing recent activity and per-track summaries" }}
            caption={zhHant ? "歷史紀錄" : "History"}
          />
        </div>
      </Section>

      {/* 07 — Reusable Patterns & Key Trade-offs (renamed from "Reusable
          Interaction Patterns" to also hold the trade-offs the plan asked
          for). Patterns section is unchanged from V2 — still only the
          two claims actual evidence supports, no token/component-library
          claim, and no destructive-confirm pattern added: it would need
          its own evidence pair to stand up next to these two, and this
          section is already at a good length without it. Trade-offs below
          are evidence-supported, not invented — each links back to a
          section already shown above rather than asserting new rationale. */}
      <Section index={6} register={register}>
        <Reveal>
          <SectionHeading
            label={zhHant ? "07 — 可重用的模式與關鍵取捨" : "07 — REUSABLE PATTERNS & KEY TRADE-OFFS"}
            title={zhHant ? "重複出現的互動需求，不必每次重新發明" : "Recurring Interaction Needs Don't Need Reinventing Each Time"}
            intro={
              zhHant
                ? "幾個畫面其實在處理結構相似的問題——需要清楚的進度感，或是需要低壓力的可略過選擇。相似的問題，可以用一致的模式處理。"
                : "Several screens are really solving structurally similar problems — needing a clear sense of progress, or needing a low-pressure, skippable choice. Similar problems can be handled with a consistent pattern."
            }
          />
        </Reveal>

        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          <PhoneEvidence
            className="mx-auto w-full max-w-[280px]"
            asset={{ src: `${IMG}/case04-profile-birthdate-v2.webp`, alt: "Profile setup step 1 of 4, showing a step-progress indicator" }}
            caption={zhHant ? "個人資料設定（1/4）" : "Profile setup (1/4)"}
          />
          <PhoneEvidence
            className="mx-auto w-full max-w-[280px]"
            asset={{ src: `${IMG}/case04-guided-step01-categories.webp`, alt: "Daily questionnaire, showing the same step-progress indicator pattern" }}
            caption={zhHant ? "每日問卷" : "Daily questionnaire"}
          />
        </div>
        <p className="cf-body body-tc mt-6 max-w-[62ch]">
          {zhHant ? "不同流程採用一致的步驟進度模式。" : "Different flows use a consistent step-progress pattern."}
        </p>

        <div className="mt-16 grid gap-8 border-t cf-rule pt-12 sm:grid-cols-2">
          <PhoneEvidence
            className="mx-auto w-full max-w-[280px]"
            asset={{ src: `${IMG}/case04-guided-step05-naturalsounds.webp`, alt: "Optional multi-select for natural sounds" }}
            caption={zhHant ? "自然聲" : "Natural sounds"}
          />
          <PhoneEvidence
            className="mx-auto w-full max-w-[280px]"
            asset={{ src: `${IMG}/case04-guided-step06-instruments.webp`, alt: "The same optional multi-select pattern applied to preferred instruments" }}
            caption={zhHant ? "偏好樂器" : "Preferred instruments"}
          />
        </div>
        <p className="cf-body body-tc mt-6 max-w-[62ch]">
          {zhHant ? "不同內容沿用相同的可略過多選模式。" : "Different content reuses the same skippable multi-select pattern."}
        </p>

        <div className="mt-16 border-t cf-rule pt-12">
          <p className="cf-meta cf-dim">{zhHant ? "關鍵取捨" : "KEY TRADE-OFFS"}</p>
          <div className="mt-6 grid gap-px bg-[color:var(--cf-hairline)] sm:grid-cols-3">
            {(zhHant
              ? [
                  ["單一長頁面 vs. 分階段引導", "選擇分階段：單一頁面資訊量大、缺乏進度感；分階段步驟較多，但每一步都可控（見 02、03）。"],
                  ["強迫等待 vs. 允許離開", "選擇允許離開：生成可能需要一些時間，強迫停留會放大等待的煩躁；允許先離開，完成後再通知（見 05）。"],
                  ["失敗即清空 vs. 保留輸入與進度", "選擇保留：清空輸入或播放進度會讓使用者重做一次；保留原本的努力，只需要重試（見 05）。"],
                ]
              : [
                  ["A single long page vs. a staged, guided flow", "Chose staged: one page holds a lot at once with no sense of progress; more steps, but each one stays controlled (see Sections 02, 03)."],
                  ["Force the user to wait vs. allow leaving mid-generation", "Chose allowing: generation can take a moment, and forcing users to stay only amplifies the wait; leaving and getting notified later works better (see Section 05)."],
                  ["Reset on failure vs. preserve input and progress", "Chose preserving: clearing input or playback progress on failure means redoing work; keeping it means only a retry is needed (see Section 05)."],
                ]
            ).map(([label, body]) => (
              <div key={label} className="bg-[color:var(--cf-bg)] p-6">
                <p className="cf-heading text-[15px] font-medium leading-snug">{label}</p>
                <p className="cf-body body-tc mt-3 text-[13.5px] leading-6">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* 08 — Current Outcome (replaces the old generic "Synthesis").
          Scoped to what Sections 01-07 actually demonstrate — coverage
          and consistency of the redesign so far, not release impact. The
          status line is deliberately plain text, not a badge/pill that
          could read as a shipped-product indicator. */}
      <Section index={7} register={register}>
        <Reveal>
          <SectionHeading
            label={zhHant ? "08 — 目前成果" : "08 — CURRENT OUTCOME"}
            title={zhHant ? "這次重新設計，目前涵蓋了什麼範圍" : "What This Redesign Currently Covers"}
          />
        </Reveal>
        <div className="mt-10 grid gap-px bg-[color:var(--cf-hairline)] sm:grid-cols-3">
          {(zhHant ? OUTCOME_ZH : OUTCOME_EN).map((statement, i) => (
            <div key={statement} className="bg-[color:var(--cf-bg)] p-6 md:p-8">
              <p className="cf-meta cf-accent">0{i + 1}</p>
              <p className="cf-body body-tc mt-4">{statement}</p>
            </div>
          ))}
        </div>
        <p className="cf-dim mt-8 max-w-[62ch] border-t cf-rule pt-8 text-[13px] leading-6">
          {zhHant ? STATUS_ZH : STATUS_EN}
        </p>
      </Section>

      {/* Closing — unnumbered, matching this case's own copy. */}
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
              ? "這次重新設計沒有改變產品原本要解決的問題，而是把既有功能流程整理成更清楚、更能處理等待與失敗，也更具連續性的行動產品體驗。"
              : "This redesign didn't change the problem the product originally set out to solve — it turned the existing functional flow into a clearer mobile product experience, one that handles waiting and failure better and has more continuity."}
          </p>
        </div>
      </Section>
    </>
  );
}
