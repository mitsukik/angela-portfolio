"use client";

import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import type { Locale } from "@/data/locale";
import { chapterEyebrow } from "@/data/case-studies/chapters";
import { EvidenceTrigger } from "@/components/design-samples/case-final/CaseEvidenceViewer";
import { CONTRIBUTION_LABEL_ZH, CONTRIBUTION_VALUE_ZH } from "@/components/design-samples/case-final/CaseTwoFinalContent";
import { CaseHeroCta } from "../CaseHeroCta";
import {
  CaseCard,
  CaseClosingPanel,
  CaseContentGrid,
  CaseDecision,
  CaseHero,
  CaseMedia,
  CaseMetadata,
  CasePipeline,
  CaseSection,
  CaseSectionHeader,
} from "../system/CaseSystem";
import { CaseStageSelector, type CaseStageItem } from "../system/CaseStageSelector";
import { CASE09_CATALOG, CASE09_LINKS } from "./catalog";
import { CASE09_CHAPTERS as CH } from "./chapters";
import "./case09.css";

/*
 * CASE09 (CH08) — 遠見房屋 Foresight Realtors, website + App, in the unified
 * CASE System V3 with CASE02's chapter structure (00–07). Facts come only from
 * ch-08-foresight-plan.md. Story body copy and captions are the handoff
 * mockup's draft wording (pending Angela's approval); every EN string is a
 * draft translation of the ZH. Website screenshots were captured from the live
 * site (2022 design); App screenshots were supplied by Angela.
 */

const EV = "/images/case09/evidence";
const LOOP = "/images/case09/loops";
const DESKTOP = "1440 / 900";
const PHONE = "804 / 1748";
const MOBILE_WEB = "390 / 844";

type Shot = { src: string; alt: string; ratio: string; tag?: string; /** Show only part of the image (frame ratio ≠ image ratio): object-position of the cover crop. */ crop?: string };

/** One captured screen in the shared CASE02 tile roles (.cv3-home-item / .cv3-home / .cv3-home-tag). */
function ShotTile({ shot, priority }: { shot: Shot; priority?: boolean }) {
  return (
    <div className="cv3-home-item">
      <div className="cv3-home">
        <div className="cv3-ratio" style={{ aspectRatio: shot.ratio }}>
          <EvidenceTrigger asset={{ src: shot.src, alt: shot.alt }}>
            <Image src={shot.src} alt="" fill priority={priority} unoptimized sizes="(min-width: 1200px) 40vw, 90vw" className={shot.crop ? "object-cover" : "object-contain"} style={shot.crop ? { objectPosition: shot.crop } : undefined} />
          </EvidenceTrigger>
        </div>
      </div>
      {shot.tag ? <span className="cv3-home-tag" lang={/^[\x20-\x7E]+$/.test(shot.tag) ? "en" : undefined}>{shot.tag}</span> : null}
    </div>
  );
}

function Story({
  locale,
  label,
  title,
  meta,
  paragraphs,
  children,
}: {
  locale: Locale;
  label: string;
  title: string;
  /** 專案 + 專注領域 (role, team and timeline are header facts). */
  meta: [string, string];
  paragraphs: string[];
  /** Everything after the paragraphs, in order: story structure, link, figure. */
  children?: ReactNode;
}) {
  const zh = locale === "zh";
  return (
    <CaseDecision label={label} title={title}>
      <CaseMetadata
        keepOrder
        rows={[
          { label: zh ? "專案" : "Project", value: meta[0] },
          { label: zh ? "專注領域" : "Focus", value: meta[1] },
        ]}
      />
      {paragraphs.map((t) => <p key={t} className="cv3-p">{t}</p>)}
      {children}
    </CaseDecision>
  );
}

function Chips({ items, label, lang }: { items: string[]; label?: string; lang?: string }) {
  return (
    <ol aria-label={label} className="cv3-chips cv3-list-reset" lang={lang}>
      {items.map((step, i) => (
        <li key={step}>
          {i > 0 ? <span aria-hidden="true" className="cv3-arrow">→</span> : null}
          <span className="cv3-chip">{step}</span>
        </li>
      ))}
    </ol>
  );
}

type Mark = "Yes" | "No" | "NA";

function MarkCell({ value, note, zh }: { value: Mark; note?: string; zh: boolean }) {
  const text = value === "NA" ? "—" : zh ? CONTRIBUTION_VALUE_ZH[value] : value;
  // EN N/A reads as words, without the dash mark (ZH keeps 「—（不適用）」).
  const label = value === "NA" && !zh ? "Not applicable" : note ? (zh ? `${text}（${note}）` : `${text} (${note})`) : text;
  return (
    <span className="cv3-mark" data-value={value}>
      <span aria-hidden="true" className="cv3-mark-glyph" />
      <span className="cv3-mark-text">{label}</span>
    </span>
  );
}

export function Case09Article({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  const eb = (i: number) => chapterEyebrow(CH[i], locale);
  const website = { href: CASE09_LINKS.website, label: zh ? "前往網站 ↗" : "Visit Website ↗" };

  const appScreens: Shot[] = [
    { src: `${EV}/foresight-app-home.webp`, alt: zh ? "遠見房屋 App 首頁：地圖找屋、委託售屋、委託租屋與精選物件" : "Foresight App home: map search, sell, rent and featured listings", ratio: PHONE, tag: zh ? "首頁" : "Home" },
    { src: `${EV}/foresight-app-map.webp`, alt: zh ? "遠見房屋 App 地圖找屋：物件數量標記，下方有圈選與訂閱條件" : "Foresight App map search with listing-count markers and Draw Area / Subscribe actions", ratio: PHONE, tag: zh ? "地圖找屋" : "Map" },
    { src: `${EV}/foresight-app-results.webp`, alt: zh ? "遠見房屋 App 搜尋結果：地圖上方、物件列表在下" : "Foresight App search results: map above, listings below", ratio: PHONE, tag: zh ? "搜尋結果" : "Results" },
    { src: `${EV}/foresight-app-detail.webp`, alt: zh ? "遠見房屋 App 物件詳細頁：照片、價格、格局、屋況特色與預約看屋" : "Foresight App listing detail: photos, price, layout, features and Book a Viewing", ratio: PHONE, tag: zh ? "物件詳細" : "Detail" },
  ];

  // 02A / 02B stages: loops recorded from the live website (1440 × 900 at 2×).
  const loop = (name: string, label: string, note: string, alt: string): CaseStageItem => ({
    label,
    note,
    alt,
    src: `${LOOP}/foresight-loop-${name}-end.webp`,
    video: { webm: `/videos/case09/foresight-loop-${name}.webm`, mp4: `/videos/case09/foresight-loop-${name}.mp4`, poster: `${LOOP}/foresight-loop-${name}-poster.webp` },
  });
  const searchStage: CaseStageItem[] = zh
    ? [
        loop("district", "行政區", "從台中各行政區開始：選定區域，再輸入社區、路名等關鍵字。", "官網首頁快速搜尋：展開行政區選單、選擇西屯區，再輸入關鍵字"),
        loop("advanced", "進階搜尋", "勾選售價與格局，符合條件的物件數量即時更新。", "進階搜尋頁：勾選 2000萬-3000萬與 3房，物件數量由 1718 筆更新為 69 筆，再捲動到結果"),
        loop("map", "地圖搜尋", "地圖依行政區聚合物件，點選區域即放大並更新物件列表。", "地圖搜尋頁：點選台中市聚合標記展開各行政區，再點選西屯區放大，右側物件列表隨之更新"),
      ]
    : [
        loop("district", "District", "Search starts from Taichung’s districts: pick an area, then add a community or street keyword.", "Homepage quick search: opening the district menu, choosing Xitun District, then typing a keyword"),
        loop("advanced", "Advanced search", "Ticking price and layout filters updates the number of matching listings instantly.", "Advanced search: ticking NT$20–30M and 3 bedrooms updates the count from 1,718 to 69 listings, then scrolling to the results"),
        loop("map", "Map search", "The map groups listings by district; selecting one zooms in and updates the listing list.", "Map search: selecting the Taichung cluster splits it into districts, then selecting Xitun zooms in and updates the listings beside the map"),
      ];
  const listingStage: CaseStageItem[] = zh
    ? [
        loop("categories", "分類", "首頁依豪宅、小資、透天、平價、收租五個分類排列精選物件。", "官網首頁依序捲動豪宅精選、小資首選、透天別墅、平價好宅與收租精選"),
        loop("card", "物件卡片", "每張卡片在相同位置呈現價格、坪數、房型與屋齡，點選後進入物件詳細頁。", "官網豪宅精選物件卡片，點選其中一張進入物件詳細頁"),
        loop("detail", "物件詳細頁", "詳細頁延續卡片的層級，再依序展開照片、屋況特色、格局圖與生活機能。", "物件詳細頁：由標題、售價與基本資訊往下捲動到照片、屋況特色、格局圖與生活機能"),
      ]
    : [
        loop("categories", "Categories", "The homepage arranges featured listings in five categories: luxury, starter, townhouse, budget and rental income.", "Scrolling the homepage through the luxury, starter, townhouse, budget and rental-income sections"),
        loop("card", "Listing card", "Every card shows price, floor area, layout and building age in the same place; selecting one opens the listing detail.", "Luxury featured listing cards; selecting one opens the listing detail page"),
        loop("detail", "Listing detail", "The detail page keeps the card’s hierarchy, then unfolds photos, features, floor plan and neighborhood amenities.", "Listing detail page scrolling from the title, price and key facts to photos, features, the floor plan and nearby amenities"),
      ];

  const roles: [string, [Mark, string?], [Mark, string?]][] = [
    ["Requirements", ["Yes", zh ? "與 PM 共同" : "with the PM"], ["Yes", zh ? "與 PM 共同" : "with the PM"]],
    ["Information Architecture / Flow", ["Yes"], ["Yes"]],
    ["UX/UI Design", ["Yes"], ["Yes"]],
    ["Content Direction", ["Yes"], ["Yes"]],
    ["Content Production", ["Yes"], ["Yes"]],
    ["Responsive Design", ["Yes"], ["NA", zh ? "不適用" : "not applicable"]],
    ["Frontend", ["Yes", zh ? "整站切版" : "full-site build"], ["No", zh ? "由後端工程師開發" : "built by the back-end developer"]],
  ];
  const cols = zh ? ["官網", "App"] : ["Website", "App"];

  return (
    <>
      <CaseHero
        caseNumber={CASE09_CATALOG.number}
        category={CASE09_CATALOG.category[locale]}
        period={CASE09_CATALOG.year}
        label={eb(0)}
        title={zh ? "不動產官網與找屋 App" : "Real Estate Website & Home-Search App"}
        lead={(zh
          ? ["把大量物件資訊，", "整理成跨平台一致、好搜尋、好比較的找屋體驗。"]
          : ["Turning a large volume of listings", "into one consistent, searchable, comparable home search."]
        ).map((line, i) => <span key={line}>{i > 0 ? <br /> : null}{line}</span>)}
      >
        {/* Header spec = CH06: lead → summary → 角色 / 團隊 / 平台 / 時程 + 範疇 → CTA. The project
            facts live here only; the chapters below do not repeat them. */}
        <p className="cv3-summary">
          {zh
            ? "遠見房屋是台中在地房仲，同時經營官網與 iOS / Android 找屋 App。我負責兩個平台的 UX/UI 設計：需求整理、資訊架構、介面與 RWD，並完成官網的前端切版。5 個月內，兩個平台皆已正式上線。"
            : "Foresight Realtors is a real estate agency in Taichung with a website and an iOS / Android app. I designed the UX/UI for both platforms, from requirements and information architecture to the interface and responsive layouts. I also built the website front end. Both went live within five months."}
        </p>
        <CaseMetadata
          wide={["範疇", "Scope"]}
          rows={
            zh
              ? [
                  { label: "角色", value: "UI/UX Front-end Designer" },
                  { label: "團隊", value: "PM（兼 SA）· UI/UX Front-end Designer · Back-end Developer · QA" },
                  { label: "平台", value: "Website · iOS / Android App" },
                  { label: "時程", value: "2022.04 – 2022.08" },
                  { label: "範疇", value: "首頁搜尋 · 物件卡片與詳細頁 · 會員與物件通知 · App UI · 官網前端切版" },
                ]
              : [
                  { label: "Role", value: "UI/UX Front-end Designer" },
                  { label: "Team", value: "PM (also SA) · UI/UX Front-end Designer · Back-end Developer · QA" },
                  { label: "Platform", value: "Website · iOS / Android App" },
                  { label: "Timeline", value: "2022.04 – 2022.08" },
                  { label: "Scope", value: "Homepage Search · Listing Cards & Detail · Membership & Alerts · App UI · Website Front-end" },
                ]
          }
        />
        <CaseHeroCta
          items={[
            website,
            { href: CASE09_LINKS.appStore, label: zh ? "前往 App Store ↗" : "View on the App Store ↗" },
          ]}
        />
      </CaseHero>

      <CaseMedia frame="hero" heroFirst caption={zh ? "同一個品牌，兩種使用情境。" : "One brand, website and app."}>
        <div className="cv3-grid cv3-hero-homes case09-hero-media">
          <ShotTile priority shot={{ src: `${EV}/foresight-home-desktop.webp`, alt: zh ? "遠見房屋官網桌面版首頁與快速搜尋" : "Foresight Realtors website homepage on desktop with quick search", ratio: DESKTOP, tag: zh ? "官網 · 桌面版" : "Website · Desktop" }} />
          {[appScreens[0], appScreens[1], appScreens[3]].map((s) => <ShotTile key={s.src} shot={s} />)}
        </div>
      </CaseMedia>

      {/* 01 — 使用者與入口 (was 01 總覽 + 02 架構): one card set — audience → goal → 4 steps */}
      <CaseSection id={CH[1].anchor}>
        <CaseSectionHeader
          eyebrow={eb(1)}
          title={zh ? "一個品牌，同時服務找屋者、屋主與經紀人。" : "One brand serving home seekers, property owners and agents."}
          paragraphs={[
            zh
              ? "房仲官網不只是展示物件，還要讓想買屋、想委託、想加入的人各自快速找到入口。我和 PM（兼 SA）先釐清三種使用者各自要完成什麼，再決定導覽和首頁的資訊順序。委託屋主與經紀人的流程較單純，透過表單留下資料，再由業務聯繫；因此設計重心放在找屋者的搜尋與比較。"
              : "A real estate website is not only for showing listings. Buyers, property owners and job applicants all need to find their way quickly. I worked with the PM (also the SA) to define what each group needed to do, then planned the navigation and homepage order. Property owners and agent applicants only need to fill in a form, and a sales agent contacts them. So I focused the design on how home seekers search and compare.",
          ]}
        />
        <CaseContentGrid variant="cards-3">
          {(zh
            ? [
                ["找屋者", "快速縮小範圍", ["區域", "條件", "比較", "聯絡"]],
                ["委託屋主", "放心交付物件", ["了解", "信任", "委託", "聯絡"]],
                ["經紀人", "認識公司與機會", ["品牌", "制度", "門市", "應徵"]],
              ]
            : [
                ["Home seekers", "Narrow it down fast", ["Area", "Criteria", "Compare", "Contact"]],
                ["Property owners", "List with confidence", ["Understand", "Trust", "List", "Contact"]],
                ["Agents", "Discover the company", ["Brand", "Policies", "Branches", "Apply"]],
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

      {/* 02 — 設計決策 (was 03 專案故事 + 05 跨平台): story blocks 02A–02E (§2 #4: no H2) */}
      <CaseSection id={CH[2].anchor}>
        <CaseSectionHeader eyebrow={eb(2)} />

        <Story
          locale={locale}
          label="02A / LISTING SEARCH"
          title={zh ? "讓找屋從「區域」開始" : "Starting the Search from the District"}
          meta={zh ? ["首頁快速搜尋", "搜尋入口 · 資訊架構"] : ["Homepage quick search", "Search entry · Information architecture"]}
          paragraphs={zh ? [
            "找屋的第一個問題，通常是「想住哪一區」。因此首頁搜尋以台中各行政區作為起點。",
            "我把搜尋分成三層：行政區快捷連結、進階條件搜尋，以及地圖搜尋，讓需求明確程度不同的使用者，都有適合的入口。",
          ] : [
            "The first question in a home search is usually “which district?”, so the homepage search starts from Taichung’s districts.",
            "I split search into three layers: district shortcuts, advanced search and map search. Users with clear or unclear needs can each find a suitable starting point.",
          ]}
        >
          <CaseStageSelector locale={locale} label={zh ? "三層搜尋入口" : "Three search layers"} items={searchStage} />
        </Story>

        <Story
          locale={locale}
          label="02B / LISTING CARDS & DETAIL"
          title={zh ? "把物件資訊排成可以快速比較的卡片" : "Listing Cards Built for Quick Comparison"}
          meta={zh ? ["精選物件、物件卡片、物件詳細頁", "資訊層級 · 元件一致性"] : ["Featured listings, listing cards, listing detail", "Information hierarchy · Component consistency"]}
          paragraphs={zh ? [
            "精選物件依豪宅、小資、透天、平價、收租分類，讓使用者先選類型，再在同類物件之間比較。",
            "找屋者通常帶著預算來看物件，所以卡片把價格放大並排在最前面，讓使用者先判斷價格和地區是否符合預算，再看坪數、房型與屋齡。每張卡片在相同位置呈現相同資訊；物件詳細頁延續同一套層級，再展開完整資訊。",
          ] : [
            "Featured listings are grouped into luxury, starter, townhouse, budget and rental-income categories, so visitors choose a type first and then compare within it.",
            "Most home seekers have a budget in mind. So I made the price large and put it first on the card. Users can quickly check if the price and area fit their budget, then look at floor area, layout and building age. Every card shows the same information in the same place. The detail page follows the same order and adds the full details.",
          ]}
        >
          <CaseContentGrid variant="cards-2">
            <CaseCard kicker={zh ? "分類" : "Categories"}>
              <ul className="cv3-chips cv3-list-reset">
                {(zh ? ["豪宅", "小資", "透天", "平價", "收租"] : ["Luxury", "Starter", "Townhouse", "Budget", "Rental income"]).map((c) => (
                  <li key={c}><span className="cv3-chip">{c}</span></li>
                ))}
              </ul>
            </CaseCard>
            <CaseCard tone="accent" kicker={zh ? "卡片資訊順序" : "Card information order"}>
              <Chips items={(zh ? ["價格", "坪數", "房型", "屋齡"] : ["Price", "Floor area", "Layout", "Building age"]).map((t, i) => `0${i + 1} ${t}`)} label={zh ? "卡片資訊順序" : "Card information order"} />
            </CaseCard>
          </CaseContentGrid>
          <CaseStageSelector locale={locale} label={zh ? "從分類到物件詳細頁" : "From categories to listing detail"} items={listingStage} />
        </Story>

        <Story
          locale={locale}
          label="02C / MEMBER & NOTIFICATION"
          title={zh ? "用會員與訂閱留住找屋者" : "Keeping Home Seekers Coming Back"}
          meta={zh ? ["會員登入註冊與物件通知", "表單流程 · 狀態設計"] : ["Member sign-in, sign-up and listing alerts", "Form flow · State design"]}
          paragraphs={zh ? [
            "會員機制讓找屋者可以訂閱物件通知，有符合條件的物件時再回到網站。",
            "登入與註冊在同一個彈窗內切換；驗證碼加入重寄倒數狀態，讓使用者清楚知道何時可以再次寄送。",
          ] : [
            "Membership lets home seekers subscribe to listing alerts and come back when a matching property appears.",
            "Sign-in and sign-up switch within one modal, and the verification code has a resend countdown state, so users know exactly when they can request it again.",
          ]}
        >
          <CasePipeline
            label={zh ? "會員流程狀態" : "Membership flow states"}
            lang={zh ? "zh-Hant" : "en"}
            steps={zh ? [{ title: "登入／註冊切換" }, { title: "驗證碼重寄倒數" }, { title: "訂閱物件通知" }] : [{ title: "Sign-in / sign-up switch" }, { title: "Code resend countdown" }, { title: "Listing alert subscription" }]}
          />
          <figure className="cv3-figure">
            <div className="cv3-grid cv3-story-media">
              <ShotTile shot={{ src: `${EV}/foresight-login-desktop.webp`, alt: zh ? "官網會員登入彈窗：登入與註冊分頁、帳號密碼欄位與 Facebook 登入" : "Member sign-in modal: sign-in and sign-up tabs, account and password fields, Facebook sign-in", ratio: DESKTOP }} />
            </div>
            <figcaption className="cv3-caption">{zh ? "官網會員登入彈窗。" : "The website’s member sign-in modal."}</figcaption>
          </figure>
        </Story>

        <Story
          locale={locale}
          label="02D / FORESIGHT APP"
          title={zh ? "把找屋帶進口袋，讓使用者持續回訪" : "An App That Brings Users Back"}
          meta={zh ? ["遠見房屋 App（iOS / Android）", "App UI · 物件瀏覽 · 篩選與訂閱"] : ["Foresight App (iOS / Android)", "App UI · Listing browsing · Filters & subscriptions"]}
          paragraphs={zh ? ["App 和官網有明確分工：官網負責品牌與分流，App 則偏重篩選、訂閱、預約這些「回訪」行為。"] : ["The website and the app have different jobs. The website shows the brand and directs visitors to the right place. The app is for users who come back to filter, subscribe and book viewings."]}
        >
          <ol aria-label={zh ? "官網與 App 的分工" : "Website and App roles"} className="cv3-groups cv3-list-reset">
            {[
              { owner: zh ? "官網" : "WEBSITE", steps: zh ? ["品牌", "分流"] : ["Brand", "Routing"] },
              { owner: zh ? "APP · 回訪行為" : "APP · RETURN VISITS", steps: zh ? ["篩選", "訂閱", "預約"] : ["Filter", "Subscribe", "Book"], mine: true },
            ].map((g) => (
              <li key={g.owner} className="cv3-group" data-mine={g.mine ? "true" : undefined}>
                <p className="cv3-group-owner">{g.owner}</p>
                <ul className="cv3-chips cv3-list-reset">
                  {g.steps.map((s) => <li key={s}><span className="cv3-chip">{s}</span></li>)}
                </ul>
              </li>
            ))}
          </ol>
          <p className="cv3-p">{zh ? "我負責 App 的 UX/UI 設計，涵蓋以下功能：" : "I designed the App’s UX/UI, covering these features:"}</p>
          <ol className="cv3-steps case09-features">
            {(zh
              ? ["條件篩選與新物件訂閱", "地圖與物件瀏覽", "3D／720° 看屋（串接客戶既有服務，設計瀏覽入口）", "預約看屋", "委託售屋、實價登錄與行情", "線上客服、經紀人媒合"]
              : ["Criteria filters and new-listing alerts", "Map and listing browsing", "3D / 720° viewing (the client’s existing service; I designed the entry point)", "Book a viewing", "Listing a property, actual-price records and market prices", "Online support and agent matching"]
            ).map((f, i) => (
              <li key={f}>
                <span lang="en">{String(i + 1).padStart(2, "0")}</span>
                <span>{f}</span>
              </li>
            ))}
          </ol>
          <figure className="cv3-figure">
            <div className="cv3-grid cv3-story-media" data-variant="media-4">
              {appScreens.map((s) => <ShotTile key={s.src} shot={s} />)}
            </div>
            <figcaption className="cv3-caption">{zh ? "遠見房屋 App 實際畫面（iOS）。" : "Screens from the live Foresight App (iOS)."}</figcaption>
          </figure>
        </Story>

        <Story
          locale={locale}
          label="02E / CROSS-PLATFORM"
          title={zh ? "官網、手機網頁與 App，保留一致的找屋邏輯" : "One Home-Search Logic Across Website, Mobile Web and App"}
          meta={zh ? ["跨平台設計", "跨平台一致性 · RWD"] : ["Cross-platform design", "Cross-platform consistency · RWD"]}
          paragraphs={zh ? [
            "客戶希望手機網頁和桌機版保持一致，因此手機網頁以 RWD 延續官網的結構與資訊順序。三個介面共用同一套物件資訊層級（價格、坪數、房型、屋齡），App 則在這套層級上強化篩選、訂閱與預約等回訪功能。",
          ] : [
            "The client wanted the mobile site to match the desktop site, so I used responsive design to keep the same structure and information order. All three platforms use the same listing order: price, floor area, layout and building age. The app adds features that bring users back, such as filters, alerts and viewing bookings.",
          ]}
        >
          <div className="cv3-compare-head">
            <h3 className="cv3-card-title">{zh ? "物件卡片 · 三個平台" : "Listing Card · Three Platforms"}</h3>
            <p className="cv3-card-kicker">{zh ? "桌面／行動網頁／App" : "Desktop / Mobile Web / App"}</p>
          </div>
          <figure className="cv3-figure">
            <div className="cv3-grid case09-compare" data-variant="compare" style={{ "--cv3-grid-cols": "minmax(0, 3.4fr) minmax(0, 1fr) minmax(0, 1fr)" } as CSSProperties}>
              <ShotTile shot={{ src: `${EV}/foresight-cards-desktop.webp`, alt: zh ? "物件卡片：官網桌面版" : "Listing cards on the desktop website", ratio: DESKTOP, tag: zh ? "官網 · 分流" : "Website · Routing" }} />
              <ShotTile shot={{ src: `${EV}/foresight-cards-mobile.webp`, alt: zh ? "物件卡片：手機網頁" : "Listing cards on mobile web", ratio: MOBILE_WEB, tag: zh ? "手機網頁 · RWD 延續" : "Mobile web · RWD" }} />
              <ShotTile shot={{ ...appScreens[2], ratio: MOBILE_WEB, crop: "50% 100%", tag: zh ? "App · 重回訪" : "App · Return visits" }} />
            </div>
            <figcaption className="cv3-caption">{zh ? "左起：官網桌面版、手機網頁、App。" : "From left: desktop website, mobile web, App."}</figcaption>
          </figure>
        </Story>
      </CaseSection>


      {/* 03 — 我的角色與方法 (was 06 角色 + 04 原型驗證): matrix, then the prototype loop. No AI (2022). */}
      <CaseSection id={CH[3].anchor}>
        <CaseSectionHeader eyebrow={eb(3)} title={zh ? "從需求到設計一手負責，並完成官網前端切版" : "From Requirements to Design, Plus the Website Front End"} />
        <table className="cv3-matrix" aria-label={zh ? "官網與 App 貢獻範圍表格" : "Contribution table for the website and App"}>
          <thead>
            <tr>
              <th scope="col">{zh ? "貢獻項目" : "Contribution"}</th>
              {cols.map((c) => <th key={c} scope="col">{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {roles.map(([k, web, app]) => (
              <tr key={k}>
                <th scope="row">{zh ? CONTRIBUTION_LABEL_ZH[k] : k}</th>
                {[web, app].map(([v, note], i) => <td key={i}><MarkCell value={v} note={note} zh={zh} /></td>)}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="cv3-matrix-cards">
          {cols.map((name, col) => (
            <details key={name} className="cv3-matrix-card" open={col === 0}>
              <summary>
                <span>{name}</span>
                <span aria-hidden="true" className="cv3-matrix-chev">⌄</span>
              </summary>
              <dl>
                {roles.map((row) => {
                  const [v, note] = row[col + 1] as [Mark, string?];
                  return (
                    <div key={row[0]}>
                      <dt>{zh ? CONTRIBUTION_LABEL_ZH[row[0]] : row[0]}</dt>
                      <dd><MarkCell value={v} note={note} zh={zh} /></dd>
                    </div>
                  );
                })}
              </dl>
            </details>
          ))}
        </div>
        <CaseClosingPanel label={zh ? "註解" : "NOTE"}>
          <p className="cv3-p">
            {zh
              ? "後端功能與 App 開發由後端工程師負責，QA 負責測試。內容方向指辨識體驗所需資訊，並與 PM 或客戶協調取得內容；內容製作指整理、調整並編排頁面上的素材與文案。"
              : "Back-end features and App development were handled by the back-end developer, and QA handled testing. Content Direction means identifying the information the experience needs and coordinating with the PM or client to obtain it; Content Production means organizing, refining and assembling the copy and materials on the pages."}
          </p>
        </CaseClosingPanel>
        <CaseDecision label={zh ? "方法 / PROTOTYPE LOOP" : "APPROACH / PROTOTYPE LOOP"} title={zh ? "讓客戶實際操作原型，在反覆修改中把需求收斂清楚" : "Letting the Client Use a Working Prototype, and Refining Until Requirements Were Clear"}>
          <p className="cv3-p">
            {zh
              ? "需求一開始並不完整。先上網研究同業參考，做成可操作的原型讓客戶實際試用，再依回饋修改；這個循環來回了非常多次，直到客戶確認後才交給後端開發與 QA。其中修改最多的是物件詳細頁的排版，透過原型反覆試用與調整，才確定最終的資訊編排。"
              : "The requirements were incomplete at the start. I researched comparable sites online, built a working prototype for the client to try, and revised it based on their feedback. That loop went round many times before the client signed off and the work moved to back-end development and QA. Most of the revisions were to the layout of the listing detail page, which we tested and adjusted through the prototype until the final layout was confirmed."}
          </p>
          <div className="cv3-grid" data-variant="media-3">
            {(zh
              ? [
                  ["RESEARCH", "參考研究", "研究同業網站與 App，整理適合的找屋流程與版型", ["同業網站", "同業 App", "找屋流程與版型"]],
                  ["PROTOTYPE", "原型試用", "做成可操作的原型，讓客戶實際點擊、試用", ["可操作原型", "客戶點擊", "試用"]],
                  ["ITERATE", "反覆修改", "根據回饋多次調整，確認後交付給開發與 QA", ["回饋", "修改 ↺ 多次", "確認", "開發 · QA"]],
                ]
              : [
                  ["RESEARCH", "Reference Research", "Studied comparable websites and apps to shape a suitable home-search flow and layout", ["Comparable sites", "Comparable apps", "Search flow & layout"]],
                  ["PROTOTYPE", "Prototype Trials", "Built a working prototype the client could click through and try", ["Working prototype", "Client clicks", "Trial"]],
                  ["ITERATE", "Repeated Revisions", "Adjusted it many times from feedback, then handed it to development and QA once confirmed", ["Feedback", "Revise ↺ many times", "Confirm", "Dev · QA"]],
                ]
            ).map(([en, h, s, chips], i) => (
              <article key={en as string} className="cv3-principle">
                <CaseCard>
                  <div className="case09-process-top">
                    <span className="case09-process-no" lang="en">{`0${i + 1}`}</span>
                    <span className="cv3-card-kicker" lang="en">{en as string}</span>
                  </div>
                  <Chips items={chips as string[]} />
                </CaseCard>
                <h3 className="cv3-h3 cv3-principle-h">{h as string}</h3>
                <p className="cv3-p">{s as string}</p>
              </article>
            ))}
          </div>
        </CaseDecision>
      </CaseSection>


      {/* 04 — 反思: heading + one paragraph (no capability chips — Angela 2026-11-03) */}
      <CaseSection id={CH[4].anchor}>
        <CaseSectionHeader
          eyebrow={eb(4)}
          title={zh ? "好的找屋體驗，是讓人在任何平台都能更快做出比較與決定。" : "A good home-search experience helps people compare and decide faster, on any platform."}
          paragraphs={[
            zh
              ? "在需求不完整的情況下，用可操作的原型和客戶反覆溝通，比一次做完整的設計稿更有效。這個專案也讓我學到，如何在資訊密度、搜尋效率與跨平台一致性之間取得平衡。"
              : "When requirements are unclear, a working prototype the client can try works better than a full set of design files. This project also taught me to balance information density, search speed and consistency across platforms.",
          ]}
        />
      </CaseSection>
    </>
  );
}
