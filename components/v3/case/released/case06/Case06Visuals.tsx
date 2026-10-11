"use client";

import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import type { Locale } from "@/data/locale";
import { EvidenceTrigger } from "@/components/design-samples/case-final/CaseEvidenceViewer";
import { VideoEvidence } from "@/components/design-samples/case-final/VideoEvidence";

/*
 * CASE06 — LUDOVIK Visual Polish visuals (LOCAL DEVELOPMENT ONLY; reached
 * only through the legacy case route, gated out of production).
 *
 * Source: Angela's "LUDOVIK app visual polish" file (portfolio UI refresh of
 * the 2020 LUDOVIK project; brand photography from LUDOVIK). Screens are 3x
 * (phones) / 2x (CMS) captures of that file, cropped to content; the
 * unsupported 紅利點數 tile is hidden in the account capture (the spec has
 * coupons only). The shopping-flow clip is the existing walkthrough recording
 * of the same file (made 2026-10-08) — a screen walkthrough, not the
 * original 2020 prototype and not production footage. The feature-
 * architecture diagram is Angela's own (ZH/EN, corrected to the spec).
 * Files live in the non-public legacy-assets/case06/ folder, served only by
 * the dev route app/legacy-assets/[...path] (404 in production).
 *
 * One visual per decision, no repeats: hero (App home + CMS dashboard),
 * D1 discovery (architecture + category list), D2 shopping-flow recording
 * (+ login still), D3 App ⇄ CMS pairs (product, orders).
 */

const SRC = (name: string) => `/legacy-assets/case06/case06-ldvk-${name}.webp`;

type Shot = { name: string; w: number; h: number; alt: Record<Locale, string> };

const SHOTS = {
  home: { name: "home", w: 1080, h: 2346, alt: { zh: "LUDOVIK App 首頁：分類圓形入口、LUDOVIK TRAINING 活動橫幅與熱賣產品", en: "LUDOVIK app home: category shortcuts, a LUDOVIK TRAINING campaign banner and best sellers" } },
  category: { name: "category", w: 900, h: 1956, alt: { zh: "女款全系列：全部／TOPS／BOTTOM／JACKETS 分類標籤與商品列表", en: "Women's range: All / TOPS / BOTTOM / JACKETS tabs and the product list" } },
  product: { name: "product", w: 1080, h: 2346, alt: { zh: "商品頁：商品照片、定價與售價、尺寸選擇、收藏與加入購物車", en: "Product page: photo, list and sale price, size options, favourite and Add to cart" } },
  productInfo: { name: "product-info", w: 1080, h: 588, alt: { zh: "商品頁資訊區：分類、商品名稱、定價與售價、尺寸與加入購物車", en: "Product page details: category, name, list and sale price, sizes and Add to cart" } },
  login: { name: "login", w: 900, h: 1956, alt: { zh: "會員登入：帳號、密碼、忘記密碼、註冊帳號與登入", en: "Member sign-in: account, password, forgot password, register and sign in" } },
  account: { name: "account", w: 840, h: 1824, alt: { zh: "我的帳號：會員帳號、優惠券與待出貨數量、訂單查詢與帳號功能", en: "My account: member email, coupon and awaiting-shipment counts, order lookup and account menu" } },
  accountTop: { name: "account-top", w: 840, h: 640, alt: { zh: "我的帳號上半部：優惠券與待出貨數量", en: "Top of My account: coupon and awaiting-shipment counts" } },
  cmsDashboard: { name: "cms-dashboard", w: 3200, h: 1840, alt: { zh: "LUDOVIK CMS 首頁：訂單、待審事項、商品資訊、會員相關與會員消費數據分析（示意資料）", en: "LUDOVIK CMS home: orders, items to review, product and member summaries, and member purchase analytics (sample data)" } },
  cmsDashboardMobile: { name: "cms-dashboard-mobile", w: 1328, h: 544, alt: { zh: "CMS 首頁局部：訂單與商品資訊", en: "CMS home detail: order and product summaries" } },
  cmsProducts: { name: "cms-products", w: 3336, h: 1080, alt: { zh: "CMS 商品管理：商品圖片、名稱、分類、商品編號、售價與上架開關（示意資料）", en: "CMS product management: image, name, category, product code, price and listing toggle (sample data)" } },
  cmsProductsMobile: { name: "cms-products-mobile", w: 1334, h: 840, alt: { zh: "CMS 商品管理局部", en: "CMS product management detail" } },
  cmsOrders: { name: "cms-orders", w: 3336, h: 1180, alt: { zh: "CMS 訂單管理：訂單狀態、付款方式與建立日期篩選，以及訂單狀態與出貨狀態欄位（示意資料）", en: "CMS order management: filters for order status, payment method and date, with order and shipping status columns (sample data)" } },
  cmsOrdersMobile: { name: "cms-orders-mobile", w: 1507, h: 739, alt: { zh: "CMS 訂單管理局部：付款方式、訂單狀態與出貨狀態", en: "CMS order management detail: payment method, order status and shipping status" } },
} satisfies Record<string, Shot>;

const ratio = (shot: Shot): CSSProperties => ({ aspectRatio: `${shot.w} / ${shot.h}` });
const isPhone = (shot: Shot) => shot.h / shot.w > 2;

/** One inspectable image. Full phone screens get device-like corners; crops
 * and CMS screens use the shared figure frame. */
function Frame({ shot, locale, sizes, eager = false, viewer = shot, className = "" }: {
  shot: Shot; locale: Locale; sizes: string; eager?: boolean; viewer?: Shot; className?: string;
}) {
  return (
    <div className={`relative w-full ${isPhone(shot) ? "overflow-hidden rounded-[1.6rem]" : "cf-figure-frame"} ${className}`} style={ratio(shot)}>
      <EvidenceTrigger asset={{ src: SRC(viewer.name), alt: viewer.alt[locale] }}>
        <Image src={SRC(shot.name)} alt="" fill unoptimized loading={eager ? "eager" : "lazy"} sizes={sizes} className="object-contain" />
      </EvidenceTrigger>
    </div>
  );
}

function Caption({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <figcaption className={`cf-dim mt-4 max-w-[62ch] text-[13px] leading-6 ${className}`}>{children}</figcaption>;
}

/** Small label above one visual (App / CMS). Phones sit left-aligned under
 * it at every width, so the label and the screen share one edge. */
function Tag({ children }: { children: ReactNode }) {
  return <p className="cf-meta cf-accent mb-3">{children}</p>;
}

/* 01 — consumer-entry (opening visual): one platform, two users ---------- */

export function Case06ConsumerEntry({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  return (
    <figure className="grid gap-10 md:grid-cols-12 md:items-start md:gap-8">
      <div className="max-w-[16rem] md:col-span-4 md:max-w-none lg:col-span-3 lg:col-start-2">
        <Tag>{zh ? "消費者 App" : "Consumer app"}</Tag>
        <Frame shot={SHOTS.home} locale={locale} eager sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 70vw" />
      </div>
      <div className="md:col-span-8 lg:col-span-7">
        <Tag>{zh ? "營運後台 CMS" : "Admin CMS"}</Tag>
        <Frame shot={SHOTS.cmsDashboard} locale={locale} eager sizes="(min-width: 1024px) 55vw, 66vw" className="hidden md:block" />
        <Frame shot={SHOTS.cmsDashboardMobile} viewer={SHOTS.cmsDashboard} locale={locale} sizes="100vw" className="md:hidden" />
      </div>
    </figure>
  );
}

/* Decision 01 — discovery: feature architecture + category list -------- */

export function Case06Discovery({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  const ia: Shot = {
    name: `ia-${locale}`,
    w: 1536,
    h: 1024,
    alt: {
      zh: "App 功能架構圖：功能選單（主題活動、商品分類、主題搭配、訂閱服務、品牌故事、聯絡我們）、首頁（輪播、商品推薦、其他）與快速選單（首頁、我的收藏、訂單、購物車、會員專區）三組入口；商品分類展開為人氣商品推薦、全部商品、TOPS、BOTTOM、JACKETS",
      en: "App feature architecture: three entry groups — the feature menu (campaigns, product categories, styling picks, subscription, brand story, contact), Home (carousel, product picks, more) and the quick menu (home, favourites, orders, cart, member centre); product categories open into best sellers, all products, TOPS, BOTTOMS and JACKETS",
    },
  };
  return (
    <figure>
      <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-10">
        <div className="lg:col-span-9 lg:col-start-4 lg:row-start-1">
          <Tag>{zh ? "商品探索與導覽 · App 功能架構" : "Product Discovery & Navigation · Feature architecture"}</Tag>
          {/* ia-*.webp is a light diagram; the -ia- prefix differs from the
              LUDOVIK screens, so it keeps its own path. */}
          <div className="cf-figure-frame relative w-full" style={ratio(ia)}>
            <EvidenceTrigger asset={{ src: `/legacy-assets/case06/case06-ia-${locale}.webp`, alt: ia.alt[locale] }}>
              <Image src={`/legacy-assets/case06/case06-ia-${locale}.webp`} alt="" fill unoptimized loading="lazy" sizes="(min-width: 1024px) 66vw, 100vw" className="object-contain" />
            </EvidenceTrigger>
          </div>
        </div>
        <div className="max-w-[15rem] lg:col-span-3 lg:col-start-1 lg:row-start-1 lg:max-w-none">
          <Tag>{zh ? "分類列表" : "Category list"}</Tag>
          <Frame shot={SHOTS.category} locale={locale} sizes="(min-width: 1024px) 20vw, 60vw" />
        </div>
      </div>
      <Caption>
        {zh ? "分類頁以全部／TOPS／BOTTOM／JACKETS 標籤切換，讓使用者在同一頁縮小範圍。" : "The category page switches between All / TOPS / BOTTOM / JACKETS tabs, so shoppers narrow down without leaving the page."}
        <span className="lg:hidden">{zh ? " 點擊架構圖可放大。" : " Tap the diagram to enlarge it."}</span>
      </Caption>
    </figure>
  );
}

/* Decision 02 — shopping-flow recording ------------------------------- */

const flowSteps = (): Record<Locale, string>[] => [
  { zh: "首頁瀏覽 — 分類入口、活動橫幅與熱賣產品", en: "Home — category shortcuts, campaign banner, best sellers" },
  { zh: "下拉選單 — 首頁、分類、帳號與服務", en: "Menu — home, categories, account and services" },
  { zh: "搜尋 — 熱門搜尋標籤", en: "Search — popular search tags" },
  { zh: "搜尋結果 — 全部／女款／男款切換", en: "Results — All / Women / Men" },
  { zh: "商品頁 — 尺寸、收藏與加入購物車", en: "Product — size, favourite and Add to cart" },
  { zh: "購物車 — 品項、規格與小計", en: "Cart — items, options and subtotal" },
  { zh: "確認訂單 — 收件資料、付款方式與金額", en: "Order review — recipient, payment method and total" },
];

export function Case06PrototypeFlow({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  // v2: copy trimmed to 11.5 s, ending on order review; the prototype
  // footnote is painted out (originals kept alongside). Poster unchanged.
  const loop = "/legacy-assets/case06/case06-ldvk-loop-flow";
  const clip = `${loop}-v2`;
  return (
    <figure className="grid gap-10 md:grid-cols-12 md:items-start md:gap-10">
      <div className="max-w-[17rem] md:col-span-5 md:max-w-[19rem] lg:col-span-4 lg:col-start-2">
        <div className="overflow-hidden rounded-[1.6rem]">
          <VideoEvidence
            ratio="720 / 1560"
            surface="light"
            holdPosterUntilPlaying
            mp4First
            zhHant={zh}
            asset={{
              webm: `${clip}.webm`,
              mp4: `${clip}.mp4`,
              poster: `${loop}-poster.webp`,
              alt: zh
                ? "購物流程錄影：首頁 → 下拉選單 → 搜尋 → 搜尋結果 → 商品頁 → 購物車 → 確認訂單"
                : "Shopping-flow recording: home → menu → search → results → product → cart → order review",
            }}
          />
        </div>
      </div>
      <div className="md:col-span-7 lg:col-span-6 lg:col-start-7">
        <p className="cf-meta cf-accent">Shopping Flow</p>
        <ol className="mt-4 grid">
          {flowSteps().map((step, i) => (
            <li key={step.en} className="cf-rule grid grid-cols-[2.25rem_1fr] gap-3 border-t py-2.5">
              <span className="cf-meta cf-dim pt-0.5">{String(i + 1).padStart(2, "0")}</span>
              <span className="cf-body text-[15px] leading-6">{step[locale]}</span>
            </li>
          ))}
        </ol>
        {/* Sign-in is a spec requirement but is not in the recording. */}
        <div className="cf-rule mt-1 grid grid-cols-[4.5rem_1fr] items-center gap-4 border-t pt-4">
          <Frame shot={SHOTS.login} locale={locale} sizes="72px" />
          <p className="cf-body text-[15px] leading-6">
            {zh ? "會員登入 — 依規格，結帳前須先登入；此步驟未包含在錄影中。" : "Sign-in — the spec requires it before checkout; this step is not in the recording."}
          </p>
        </div>
        <Caption className="mt-6">
          {zh
            ? "從瀏覽、搜尋、選擇商品到購物車與確認訂單，呈現主要操作與頁面轉換。"
            : "From browsing and search through product choice and cart to order review: the main actions and page transitions."}
        </Caption>
      </div>
    </figure>
  );
}

/* Decision 03 — App ⇄ CMS: product, then orders ------------------------ */

function Pair({ app, appViewer, cms, cmsMobile, tags, note, locale }: {
  app: Shot; appViewer?: Shot; cms: Shot; cmsMobile: Shot; tags: [string, string]; note: string; locale: Locale;
}) {
  return (
    <div className="grid gap-8 md:grid-cols-12 md:items-start md:gap-8">
      <div className="max-w-[18rem] md:col-span-4 md:max-w-none lg:col-span-3">
        <Tag>{tags[0]}</Tag>
        <Frame shot={app} viewer={appViewer ?? app} locale={locale} sizes="(min-width: 768px) 26vw, 70vw" />
      </div>
      <div className="md:col-span-8 lg:col-span-9">
        <Tag>{tags[1]}</Tag>
        <Frame shot={cms} locale={locale} sizes="(min-width: 768px) 66vw, 100vw" className="hidden md:block" />
        <Frame shot={cmsMobile} viewer={cms} locale={locale} sizes="100vw" className="md:hidden" />
        <p className="cf-body mt-4 max-w-[62ch] text-[15px] leading-6">{note}</p>
      </div>
    </div>
  );
}

export function Case06ConsumerCms({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  return (
    <figure>
      <div className="grid gap-14 md:gap-16">
        <Pair
          locale={locale}
          app={SHOTS.productInfo}
          appViewer={SHOTS.product}
          cms={SHOTS.cmsProducts}
          cmsMobile={SHOTS.cmsProductsMobile}
          tags={zh ? ["App · 商品頁", "CMS · 商品管理"] : ["App · Product page", "CMS · Product management"]}
          note={zh
            ? "商品頁的分類、名稱與售價，對應後台的商品名稱、分類、商品編號、售價與上架開關；後台下架的商品，就不會出現在 App。"
            : "The product page’s category, name and price map to the CMS name, category, product code, price and listing toggle; an unlisted product does not appear in the app."}
        />
        <Pair
          locale={locale}
          app={SHOTS.accountTop}
          appViewer={SHOTS.account}
          cms={SHOTS.cmsOrders}
          cmsMobile={SHOTS.cmsOrdersMobile}
          tags={zh ? ["App · 我的帳號", "CMS · 訂單管理"] : ["App · My account", "CMS · Order management"]}
          note={zh
            ? "後台依訂單狀態與出貨狀態處理訂單；會員在「我的帳號」看到的待出貨，與後台使用同一組狀態名稱。"
            : "Staff process orders by order and shipping status; the Awaiting shipment count members see in My account uses the same state name as the CMS."}
        />
      </div>
      <Caption className="md:mt-8">
        {zh ? "訂單與會員為示意資料。" : "Orders and members shown are sample data."}
        <span className="md:hidden">{zh ? " 點擊後台局部可檢視完整 CMS。" : " Tap a CMS detail to view the full screen."}</span>
      </Caption>
    </figure>
  );
}
