"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import type { Project } from "@/data/projects";
import type { Locale } from "@/data/locale";
import { MixedText } from "@/components/site/MixedText";
import { ProjectVisual } from "@/components/site/ProjectVisual";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { ChapterRegister, type Chapter } from "./ChapterRegister";
import { useActiveChapter } from "./useActiveChapter";
import { ReadingSection } from "./ReadingSection";
import { EvidenceFigure } from "./EvidenceFigure";
import { ShowcaseMedia } from "./ShowcaseMedia";
import { SectionMarquee } from "./SectionMarquee";
import { CaseTransitionLink } from "./CaseTransitionLink";
import { getDecisionFigure, getOverviewFigure, getShowcaseFigure } from "./caseFinalMedia";
import { CaseOneFinalContent } from "./CaseOneFinalContent";
import { CaseTwoFinalContent, CaseTwoHeroEvidence } from "./CaseTwoFinalContent";
import { CaseThreeFinalContent, CaseThreeHeroEvidence } from "./CaseThreeFinalContent";
import { CaseFourFinalContent, CaseFourHeroEvidence } from "./CaseFourFinalContent";

/**
 * Section body copy is authored as either a pre-split string[] (Complex
 * System's real content) or a single string with "\n\n" paragraph breaks
 * (every placeholder-content project — see placeholderSections in
 * data/projects.ts). Round 8: this component previously force-cast every
 * "array-shaped" field with `as string[]`, which only happened to work
 * for Complex System; rendering any other project crashed at
 * `paragraphs.map` since their body is a plain string. Same normalizer
 * CaseA.tsx already uses for the same reason.
 */
function paragraphsOf(body: string | string[]): string[] {
  return Array.isArray(body) ? body : body.split("\n\n");
}

/*
 * Round 4: one main-section-label grammar across all five chapters —
 * "NN — <heading>" on the ReadingSection label that opens the chapter
 * (reusing the existing .cf-meta.cf-section-label.cf-accent role, no
 * new class). Chapters with more than one ReadingSection (03: role +
 * workflow; 05: finalUI + outcome + learnings) number only the first —
 * the rest keep their own plain heading, same relationship as Section
 * 04's per-decision "決策 0X" internal numbering to its own "04 — ..."
 * chapter label: the main section number is not repeated on internal
 * sub-labels. ChapterRegister's numerals-only rail is unrelated and
 * untouched — Angela's own prior correction there (see
 * ChapterRegister.tsx) was about not duplicating the label in the nav,
 * not about whether the content's own label carries a number.
 */
const MOTION_QUERY = "(prefers-reduced-motion: no-preference)";
const CHAPTER_COUNT = 5;
const CHAPTERS: Chapter[] = Array.from({ length: CHAPTER_COUNT }, (_, i) => ({
  number: String(i + 1).padStart(2, "0"),
}));

/**
 * One shared architecture, two theme configurations (per composition-
 * patterns guidance): `theme` sets a single data-attribute on the
 * outer .case-final wrapper; every sub-component below stays theme-
 * agnostic and reads color from the CSS custom properties that
 * attribute switches (see .case-final rules in globals.css). No
 * component here branches on `theme` in JS. SiteHeader's own `variant`
 * prop is set from the same `theme` value, so the header register
 * always matches the case it's on top of.
 *
 * Round 3: the content container now matches the header's own
 * (max-w-[1520px] px-6/10/14) so the grid genuinely aligns with the nav
 * above it, instead of two slightly different containers. The chapter
 * register is numerals-only (see ChapterRegister.tsx) — the descriptive
 * label lives with its section's own content, not duplicated in the nav.
 *
 * A per-project theme mapping for the eventual production system
 * (case01/03 dark, case02/04 light) exists in caseTheme.ts — not wired
 * in here yet; these prototype routes still pass theme explicitly so
 * both registers can be reviewed against the same real content.
 */
export function CaseStudyPrototype({
  theme,
  project,
  nextProject,
  previousProject,
  locale,
  contentVersion = "default",
}: {
  theme: "dark" | "light";
  project: Project;
  nextProject: Project;
  previousProject: Project;
  locale: Locale;
  contentVersion?: "default" | "case01-v2" | "case01-v3" | "case02-v1" | "case03-v1" | "case04-v1";
}) {
  // Round 11: the ONE place that makes this component locale-aware. Every
  // existing `caseStudy.xxx` reference below now automatically resolves
  // to the right language — real English content when it exists
  // (currently only Complex System's `caseStudyEn`), or a graceful
  // fallback to the same zh object when it doesn't (Cases 02-04, whose
  // placeholder section copy already happens to be English text, so it
  // isn't silently showing Chinese to an English visitor even without a
  // dedicated caseStudyEn — see data/projects.ts's placeholderSections).
  const caseStudy = locale === "en" ? (project.caseStudyEn ?? project.caseStudy) : project.caseStudy;
  const isCaseOneV2 = contentVersion === "case01-v2" || contentVersion === "case01-v3";
  const isCaseOneV3 = contentVersion === "case01-v3";
  const isCaseTwoV1 = contentVersion === "case02-v1";
  const isCaseThreeV1 = contentVersion === "case03-v1";
  const isCaseFourV1 = contentVersion === "case04-v1";
  const displayTitle = isCaseOneV2
    ? isCaseOneV3
      ? (locale === "zh" ? "跨境寄賣與直播\u2060電商\u2060平台" : "Cross-border Live Commerce Platform")
      : (locale === "zh" ? "複雜系統設計" : "Complex System Design")
    : isCaseTwoV1
      ? (locale === "zh" ? "品牌與網站體驗" : "Brand & Web Experience")
      : isCaseThreeV1
        ? (locale === "zh" ? "工廠生產與營運管理系統" : "Confidential Manufacturing Operations System")
        : isCaseFourV1
          ? (locale === "zh" ? "行動療癒產品" : "Mobile Wellness Product")
          : (caseStudy.displayTitle ?? project.title);
  const zhHant = locale === "zh";
  const openingRef = useRef<HTMLDivElement | null>(null);
  // V4 restructure (2026-09-23): CASE04's own copy now numbers exactly
  // six content chapters (01-06, The Challenge & My Role through
  // Delivery) — the old 01-08 + unnumbered Reflection (9 chapters) is
  // gone; Reflection was folded into Delivery. See CaseFourFinalContent.tsx.
  const chapterCount = isCaseOneV3 ? 6 : isCaseOneV2 ? 11 : isCaseTwoV1 ? 7 : isCaseThreeV1 ? 6 : isCaseFourV1 ? 6 : CHAPTER_COUNT;
  const chapters: Chapter[] = isCaseOneV3
    ? Array.from({ length: 6 }, (_, i) => ({ number: String(i + 1).padStart(2, "0") }))
    : isCaseOneV2
    ? Array.from({ length: 11 }, (_, i) => ({ number: String(i + 2).padStart(2, "0") }))
    : isCaseTwoV1
      ? Array.from({ length: 7 }, (_, i) => ({ number: String(i + 2).padStart(2, "0") }))
      : isCaseThreeV1
        ? Array.from({ length: 6 }, (_, i) => ({ number: String(i + 1).padStart(2, "0") }))
        : isCaseFourV1
          ? Array.from({ length: 6 }, (_, i) => ({ number: String(i + 1).padStart(2, "0") }))
          : CHAPTERS;
  const { active, registerChapter } = useActiveChapter(chapterCount);
  const chapterSectionRefs = useRef<Array<HTMLElement | null>>([]);

  useLayoutEffect(() => {
    const opening = openingRef.current;
    if (!opening) return;
    const mm = gsap.matchMedia();
    const context = gsap.context(() => {
      mm.add(MOTION_QUERY, () => {
        const eyebrow = opening.querySelector<HTMLElement>("[data-open-eyebrow]");
        const title = opening.querySelector<HTMLElement>("[data-open-title]");
        const summary = opening.querySelector<HTMLElement>("[data-open-summary]");
        const stats = opening.querySelector<HTMLElement>("[data-open-stats]");
        const targets = [eyebrow, title, summary, stats].filter((el): el is HTMLElement => Boolean(el));
        if (!targets.length) return;
        gsap.set(targets, { autoAlpha: 0, y: 18 });
        const timeline = gsap.timeline({ defaults: { ease: "power2.out" } });
        targets.forEach((el, i) => {
          timeline.to(el, { autoAlpha: 1, y: 0, duration: 0.5 }, i === 0 ? 0 : "-=0.28");
        });
        return () => {
          timeline.kill();
          gsap.set(targets, { clearProps: "opacity,visibility,transform" });
        };
      });
    }, opening);
    return () => {
      mm.revert();
      context.revert();
    };
  }, []);

  const decisions = caseStudy.decisions;
  // Same zh/en join convention already used by Selected Work's
  // ProjectScene.tsx: zh sentences concatenate with no separator,
  // English sentences join with a space.
  const nextDescription = (zhHant ? nextProject.description : nextProject.descriptionEn).join(zhHant ? "" : " ");
  // CASE01 EN localization: the shared Next Project blurb (nextProject.descriptionEn)
  // is global copy used elsewhere (Home, /work/[slug]) and differs by one word from
  // the copy approved specifically for this case's Next Project CTA — overridden
  // here only, without touching the shared data file or affecting other routes.
  const nextDescriptionDisplay =
    isCaseOneV2 && !zhHant
      ? "Bringing brand positioning, content structure, and visual design together to create a clear, consistent digital experience."
      : nextDescription;
  // Previous Case nav (cyclic, same shared project-order data.ts already
  // uses for Next) — title only, no per-project override or description:
  // unlike Next Project, this is a new, generic addition (see
  // getPreviousProject), so there's no existing frozen copy to preserve
  // or extend here.
  const previousDisplayTitle = zhHant ? previousProject.chineseTitle : previousProject.title;
  // Real Case01 evidence (caseFinalMedia.ts) is diagram/screenshot content
  // specific to Complex System's own story — showing it for another
  // project would be fabricated evidence. Cases without their own
  // dedicated diagrams get a plain, clearly-marked temp visual (the same
  // ProjectVisual/showTempTag treatment already used on Selected Work)
  // for the one representative media beat (Final UI) instead of nothing,
  // and no media at all on Overview rather than a duplicate of it.
  const hasCaseOneEvidence = project.slug === "complex-system";
  // Project Information (Case Opening, right column) — existing data only:
  // category/year from the project record, then whatever the case's own
  // metadata dict already defines (角色/平台/範疇/狀態 for this project).
  // No field is invented; a project without extra metadata just shows
  // fewer rows rather than fabricated ones.
  const openingInfoRows = isCaseOneV2
    ? zhHant
      ? [
          { label: "角色", value: "UI/UX Designer" },
          { label: "團隊", value: "1 UI Designer · 2 Engineers · PM" },
          { label: "平台", value: "Responsive Web" },
          { label: "狀態", value: "Designed & Developed" },
        ]
      : [
          { label: "Role", value: "UI/UX Designer" },
          { label: "Team", value: "1 UI Designer · 2 Engineers · PM" },
          { label: "Platform", value: "Responsive Web" },
          { label: "Status", value: "Designed & Developed" },
        ]
    : isCaseTwoV1
      ? zhHant
        ? [
            { label: "案例", value: "SDX · Charming Clinic · NATEX" },
            { label: "策略", value: "資訊架構" },
            { label: "設計", value: "UX/UI 設計 · 品牌溝通" },
            { label: "交付", value: "響應式網頁" },
          ]
        : [
            { label: "Projects", value: "SDX · Charming Clinic · NATEX" },
            { label: "Strategy", value: "Information Architecture" },
            { label: "Design", value: "UX/UI Design · Brand Communication" },
            { label: "Delivery", value: "Responsive Web" },
          ]
      : isCaseThreeV1
        ? zhHant
          ? [
              { label: "角色", value: "UI/UX & Frontend Designer" },
              { label: "平台", value: "Web · Industrial Tablet" },
              { label: "客戶", value: "機密製造業客戶" },
            ]
          : [
              { label: "Role", value: "UI/UX & Frontend Designer" },
              { label: "Platform", value: "Web · Industrial Tablet" },
              { label: "Client", value: "Confidential Manufacturing Client" },
            ]
        : isCaseFourV1
          ? zhHant
            ? [
                { label: "角色", value: "UI/UX Designer" },
                { label: "團隊", value: "PM · Full-stack Engineer · UI/UX Designer" },
                { label: "平台", value: "Android 優先（iOS 共用核心方向）" },
                { label: "週期", value: "約 1–2 個月" },
                { label: "狀態", value: "上架準備中" },
              ]
            : [
                { label: "Role", value: "UI/UX Designer" },
                { label: "Team", value: "PM · Full-stack Engineer · UI/UX Designer" },
                { label: "Platform", value: "Android-first (shared core direction with iOS)" },
                { label: "Timeline", value: "Approx. 1–2 months" },
                { label: "Status", value: "Preparing for release" },
              ]
          : [
              { label: zhHant ? "類別" : "Category", value: zhHant ? project.category.zh : project.category.en },
              { label: zhHant ? "年份" : "Year", value: project.year },
              ...Object.entries(caseStudy.metadata).map(([label, value]) => ({ label, value })),
            ];

  return (
    <div className="min-h-screen">
      <SiteHeader locale={locale} page="case" variant={theme} />

      <main className="case-final" data-theme={theme} data-content-version={contentVersion}>
        {/* Case Opening — Round 7 rebuild. Angela's "header needs more
            context" feedback was about THIS region, not SiteHeader (see
            Round 4-6, reverted). Editorial two-column composition: left
            is the dominant project introduction (eyebrow/title/subtitle/
            summary, unchanged content, rebalanced scale — cf-opening-title
            replaces display-xl, which was literally the Home Hero's own
            scale and overwhelmed a two-column layout); right is a
            compact Project Information list (existing category/year +
            the existing caseStudy.metadata entries, nothing invented).
            border-b at the very end is the divider Angela annotated
            between the opening and Section 01 — Round 3 had deliberately
            left this seam bare (see the .cf-section comment) because
            Section 01 sat directly under a single-column opening; this
            named exception reverses that now that there's a two-column
            block above it that needs its own closing edge. Stacks
            naturally on mobile: left content, then the info list, then
            the same divider, in DOM order. */}
        <div
          ref={openingRef}
          className="mx-auto max-w-[1520px] border-b cf-rule px-6 pb-14 pt-16 md:px-10 md:pb-16 md:pt-24 lg:px-14"
        >
          <div className="md:grid md:grid-cols-12 md:gap-10 lg:gap-16">
            <div className="md:col-span-7">
              <p data-open-eyebrow className="cf-meta cf-accent">
                {isCaseOneV2
                  ? isCaseOneV3
                    ? zhHant ? "00 — 專案總覽" : "00 — PROJECT SNAPSHOT"
                    : "01 / COMPLEX SYSTEM"
                  : isCaseTwoV1
                    ? "02 / BRAND & WEB EXPERIENCE"
                    : isCaseThreeV1
                      ? "03 / CONFIDENTIAL MANUFACTURING OPERATIONS SYSTEM"
                      : isCaseFourV1
                        ? "04 / MOBILE WELLNESS PRODUCT"
                        : `${project.number} / ${caseStudy.eyebrowTitle ?? displayTitle}`}
              </p>
              <h1 data-open-title className="cf-heading cf-opening-title mt-5">
                {isCaseOneV3 && zhHant ? <><span className="block">跨境寄賣與</span><span className="block">直播電商平台</span></> : displayTitle}
              </h1>
              <p lang={zhHant ? "zh-Hant" : "en"} className="cf-dim mt-4 text-[1.05rem]">
                <MixedText
                  text={
                    isCaseOneV2
                      ? isCaseOneV3
                        ? "Complex Web System · B2B · Multi-role Workflows"
                        : (zhHant ? "跨境寄賣與直播電商平台" : "Cross-Border Consignment & Live Commerce Platform")
                      : isCaseTwoV1
                        ? "Shun De Xing · Charming Clinic · NATEX"
                        : isCaseThreeV1
                          ? zhHant
                            ? "將複雜的製造需求，轉化為清楚、一致的現場與管理操作介面。"
                            : "Turning complex manufacturing specifications into clear, consistent interfaces for shop-floor and management operations."
                          : isCaseFourV1
                            ? zhHant
                              ? "在產品已進入開發的階段接手 UX/UI，重新整理流程、狀態與介面，讓體驗更清楚、更輕量，也更符合行動應用的使用方式。"
                              : "Took over UX/UI after development was already underway, restructuring flows, states, and interfaces into a clearer, lighter, more app-native experience."
                            : (caseStudy.projectName ?? (zhHant ? project.chineseTitle : project.title))
                  }
                />
              </p>
              {/* CASE01 responsive QA: the opening summary is the page's one
                  true lead paragraph — distinct from every other body-tc
                  paragraph that follows it — so it gets the 17-18px lead
                  tier instead of body-tc's shared 16px. Scoped to
                  isCaseOneV2 specifically (not a change to body-tc, and not
                  applied to Cases 02-04's opening, which this task doesn't
                  touch). */}
              {isCaseThreeV1 ? (
                <div data-open-summary className="mt-6 max-w-[56ch]">
                  <p className="cf-body body-tc">
                    {zhHant
                      ? "供工廠管理人員與現場人員使用的內部作業系統，涵蓋生產、物料、庫存與品檢等日常營運。"
                      : "An internal operations system for factory management and shop-floor teams, covering production, materials, inventory, and quality inspection."}
                  </p>
                </div>
              ) : isCaseFourV1 ? (
                <div data-open-summary className="mt-6 max-w-[56ch] space-y-4">
                  {zhHant ? (
                    <>
                      <p className="cf-body body-tc">
                        這是一款根據個人資料與每日輸入內容，產生個人化聲音體驗的行動產品。
                      </p>
                      <p className="cf-body body-tc">
                        我加入專案時，工程師已完成一版可運作的早期產品。我接手後負責 UX/UI 重整，重新梳理核心流程、定義互動與錯誤恢復狀態，並建立可重複使用的介面規則，作為 Android-first 行動體驗的設計基礎。
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="cf-body body-tc">
                        A mobile wellness product that generates personalized audio experiences from personal profile information and daily inputs.
                      </p>
                      <p className="cf-body body-tc">
                        When I joined, an early functional version had already been built by the engineer. I took over the UX/UI redesign, restructuring the core journey, defining interaction and recovery states, and establishing a reusable interface system for an Android-first mobile experience.
                      </p>
                    </>
                  )}
                  {/* Angela explicitly approved this narrow confidentiality
                      exception (see HANDOFF.md CASE04 section): these two
                      URLs carry the real product name in their domain, but
                      the portfolio's own copy/metadata stay anonymized —
                      only the outbound href exposes it. App Prototype gets
                      cf-accent (stronger) vs Landing Page's cf-dim
                      (secondary) to express emphasis with existing text-
                      color roles rather than inventing a new CTA style. */}
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
                    <a
                      href="https://labo65-app.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="case-link cf-meta cf-accent"
                    >
                      {zhHant ? "操作 App 原型 ↗" : "Open App Prototype ↗"}
                    </a>
                    <a
                      href="https://labo65-landing.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="case-link cf-meta cf-dim"
                    >
                      {zhHant ? "查看 Landing Page 原型 ↗" : "View Landing Page Prototype ↗"}
                    </a>
                  </div>
                </div>
              ) : (
                <>
                  <p
                    data-open-summary
                    className={`cf-body body-tc mt-6 max-w-[56ch] ${isCaseOneV2 ? "text-[17px] md:text-[18px]" : ""}`}
                  >
                    {isCaseOneV2
                      ? zhHant
                        ? "將台灣供應商、越南倉庫、代理公司、直播主與消費者串連在同一套商業流程中，建立從跨境入庫、共享庫存、選品銷售到訂單履約的完整產品體驗。"
                        : "A multi-sided commerce platform connecting Taiwan Suppliers, a Vietnam Warehouse, Agents (streamer agencies), Streamers, and Consumers — from cross-border receiving and shared inventory to selling, orders, fulfillment, and settlement."
                      : isCaseTwoV1
                        ? zhHant
                          ? "為企業服務、醫療美容與科技產業品牌，打造清楚且值得信任的數位體驗。"
                          : "Designing clear, credible digital experiences across corporate, healthcare, and technology brands."
                        : caseStudy.summary}
                  </p>
                  {isCaseOneV3 && (
                    <a
                      href="https://sc-demo.sdxdevelop.com/zh-tw"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="case-link cf-meta cf-dim mt-6 inline-block"
                    >
                      {zhHant ? "互動 Demo ↗" : "Interactive Demo ↗"}
                    </a>
                  )}
                </>
              )}
            </div>

            <div data-open-stats className="mt-12 md:col-span-4 md:col-start-9 md:mt-0">
              <dl className="border-t cf-rule">
                {openingInfoRows.map((row) => (
                  <div key={row.label} className="grid grid-cols-[6rem_1fr] gap-4 border-b cf-rule py-4">
                    <dt className="cf-meta cf-dim">{row.label}</dt>
                    <dd className="cf-heading text-[15px] leading-6">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          {isCaseTwoV1 && <CaseTwoHeroEvidence locale={locale} />}
          {isCaseThreeV1 && <CaseThreeHeroEvidence locale={locale} />}
          {isCaseFourV1 && <CaseFourHeroEvidence locale={locale} />}
        </div>

        {/* pt matches cf-section-divider's own padding-top exactly (see
            globals.css) — the same rhythm as every later section-to-
            section seam, now also used once here for the opening's new
            divider-to-Section-01 gap. */}
        <div className="mx-auto max-w-[1520px] px-6 pt-[clamp(3rem,6vw,5rem)] md:px-10 lg:px-14">
          <div className="md:grid md:grid-cols-[3rem_minmax(0,1fr)] md:gap-8 lg:grid-cols-[3.5rem_minmax(0,1fr)] lg:gap-12">
            <ChapterRegister chapters={chapters} active={active} sectionRefs={chapterSectionRefs} locale={locale} />

            {/* Main column: section meta + content + media all belong to
                this one composed system (Round 3 grid principle) — the
                chapter rail is the only other zone. */}
            <div>
              {isCaseOneV2 ? (
                <CaseOneFinalContent
                  locale={locale}
                  register={(index, element) => {
                    registerChapter(index)(element);
                    chapterSectionRefs.current[index] = element;
                  }}
                />
              ) : isCaseTwoV1 ? (
                <CaseTwoFinalContent
                  locale={locale}
                  register={(index, element) => {
                    registerChapter(index)(element);
                    chapterSectionRefs.current[index] = element;
                  }}
                />
              ) : isCaseThreeV1 ? (
                <CaseThreeFinalContent
                  locale={locale}
                  register={(index, element) => {
                    registerChapter(index)(element);
                    chapterSectionRefs.current[index] = element;
                  }}
                />
              ) : isCaseFourV1 ? (
                <CaseFourFinalContent
                  locale={locale}
                  register={(index, element) => {
                    registerChapter(index)(element);
                    chapterSectionRefs.current[index] = element;
                  }}
                />
              ) : (
                <>
              {/* Chapter 01 — Overview */}
              <div
                className="cf-section"
                ref={(el) => {
                  registerChapter(0)(el);
                  chapterSectionRefs.current[0] = el;
                }}
              >
                <ReadingSection
                  label={`01 — ${caseStudy.overview.heading}`}
                  title={caseStudy.overview.title}
                  paragraphs={paragraphsOf(caseStudy.overview.body)}
                  supporting={caseStudy.overview.supportingLine}
                  media={hasCaseOneEvidence ? <EvidenceFigure figure={getOverviewFigure(locale)} /> : undefined}
                  mediaFullBleed
                />
              </div>

              {/* Chapter 02 — Challenge */}
              <div
                className="cf-section cf-section-divider"
                ref={(el) => {
                  registerChapter(1)(el);
                  chapterSectionRefs.current[1] = el;
                }}
              >
                <ReadingSection
                  label={`02 — ${caseStudy.challenge.heading}`}
                  title={caseStudy.challenge.title}
                  paragraphs={paragraphsOf(caseStudy.challenge.body)}
                  points={caseStudy.challenge.points}
                  supporting={caseStudy.challenge.supportingLine}
                />
              </div>

              <SectionMarquee zh="系統邏輯" en="SYSTEM LOGIC" direction="rtl" />

              {/* Chapter 03 — Role + Workflow */}
              <div
                className="cf-section cf-section-divider space-y-20 md:space-y-24"
                ref={(el) => {
                  registerChapter(2)(el);
                  chapterSectionRefs.current[2] = el;
                }}
              >
                <ReadingSection
                  label={`03 — ${caseStudy.role.heading}`}
                  title={caseStudy.role.title}
                  paragraphs={paragraphsOf(caseStudy.role.body)}
                  points={caseStudy.role.points}
                />
                <ReadingSection
                  label={caseStudy.workflow.heading}
                  title={caseStudy.workflow.title}
                  paragraphs={paragraphsOf(caseStudy.workflow.body)}
                  supporting={caseStudy.workflow.supportingLine}
                />
              </div>

              <SectionMarquee zh="設計決策" en="DESIGN DECISIONS" direction="ltr" />

              {/* Chapter 04 — Decisions */}
              <div
                className="cf-section cf-section-divider"
                ref={(el) => {
                  registerChapter(3)(el);
                  chapterSectionRefs.current[3] = el;
                }}
              >
                <p className="cf-meta cf-section-label cf-accent mb-10 whitespace-nowrap">
                  04 — {caseStudy.decisionsHeading ?? (zhHant ? "關鍵設計決策" : "Key Design Decisions")}
                </p>
                <div className="space-y-20 md:space-y-24">
                  {decisions.map((decision, i) => {
                    const figure = hasCaseOneEvidence ? getDecisionFigure(locale, i) : undefined;
                    return (
                      <ReadingSection
                        key={decision.heading}
                        label={zhHant ? `決策 0${i + 1}` : `Decision 0${i + 1}`}
                        title={decision.heading}
                        paragraphs={paragraphsOf(decision.body)}
                        supporting={decision.principle}
                        media={figure ? <EvidenceFigure figure={figure} /> : undefined}
                        mediaFullBleed
                      />
                    );
                  })}
                </div>
              </div>

              <SectionMarquee zh="結果與學習" en="RESULT & LEARNING" direction="rtl" />

              {/* Chapter 05 — Final UI, Outcome, Learnings */}
              <div
                className="cf-section cf-section-divider space-y-20 md:space-y-24"
                ref={(el) => {
                  registerChapter(4)(el);
                  chapterSectionRefs.current[4] = el;
                }}
              >
                <ReadingSection
                  label={`05 — ${caseStudy.finalUI.heading}`}
                  title={caseStudy.finalUI.title}
                  paragraphs={paragraphsOf(caseStudy.finalUI.body)}
                  points={caseStudy.finalUI.points}
                  media={
                    hasCaseOneEvidence ? (
                      <ShowcaseMedia figure={getShowcaseFigure(locale)} />
                    ) : (
                      <div className="cf-figure-frame relative aspect-[16/9] w-full">
                        <ProjectVisual project={project} showTempTag className="absolute inset-0" />
                      </div>
                    )
                  }
                  mediaFullBleed
                />
                <ReadingSection
                  label={caseStudy.outcome.heading}
                  title={caseStudy.outcome.title}
                  paragraphs={paragraphsOf(caseStudy.outcome.body)}
                />
                {caseStudy.learnings && (
                  <ReadingSection
                    label={caseStudy.learnings.heading}
                    title={caseStudy.learnings.title}
                    paragraphs={paragraphsOf(caseStudy.learnings.body)}
                  />
                )}
              </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Previous / Next Case — cyclic two-way nav (getPreviousProject /
            getNextProject, both wrap on data/projects.ts's shared 01-04
            order). Previous is a new, generic addition: no per-project
            copy exists for it yet, so it's title-only, unlike Next below.
            Next project — Round 3 rebuild matching the connected Lovable
            Case Study A's actual reference pattern exactly: a modest
            title on one side and a real labeled CTA (reusing the site's
            existing .case-link underline+arrow-travel interaction, not a
            bespoke effect) on the other — not a giant clickable block,
            not an isolated arrow. "返回精選作品" removed entirely, no
            replacement. Untouched by the Previous addition, including its
            per-project nextProjectLabel/nextProjectTitle override (see
            CASE01's own approved copy in data/projects.ts) — only its
            internal row/column breakpoint moved from md: to lg: so its
            title+CTA don't crowd each other once they share the row with
            Previous at tablet width. */}
        {/* Round 4: border-b closes the .case-final region's own bottom
            edge before the shared (always-dark) Closing scene begins —
            without it, on the light-theme route the seam between this
            block and Closing had no separating line, just an abrupt
            color change. Same cf-rule divider already used for the
            border-t above and throughout the page, not a new role. */}
        <div className="border-t border-b cf-rule px-6 py-20 md:px-10 md:py-28 lg:px-14">
          <div className="mx-auto grid max-w-[1520px] gap-12 md:grid-cols-2 md:gap-16">
            <CaseTransitionLink
              href={zhHant ? `/design-samples/case-final-${previousProject.number}` : `/en/design-samples/case-final-${previousProject.number}`}
              className="case-link group inline-flex flex-col items-start gap-3"
            >
              <span className="cf-meta cf-dim label-mono inline-flex items-center gap-2">
                <span aria-hidden className="transition-transform duration-300 group-hover:-translate-x-2">←</span>
                {zhHant ? "上一個專案" : "PREVIOUS PROJECT"}
              </span>
              <span className="cf-heading text-[clamp(1.4rem,2.2vw,1.9rem)]">{previousDisplayTitle}</span>
            </CaseTransitionLink>

            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-[46ch]">
                <p className="cf-meta cf-accent">{caseStudy.nextProjectLabel ?? (zhHant ? "下一個專案" : "Next Project")}</p>
                <h2 className="cf-heading cf-h3 mt-5 text-[clamp(1.75rem,3vw,2.5rem)]">
                  {caseStudy.nextProjectTitle ?? (zhHant ? nextProject.chineseTitle : nextProject.title)}
                </h2>
                {nextDescriptionDisplay && <p className="cf-dim body-tc mt-4">{nextDescriptionDisplay}</p>}
              </div>
              {/* Round 8: routes into the numbered prototype sequence
                  (01→02→03→04→01, via data/projects.ts's own wraparound
                  getNextProject) rather than the production /work/[slug]
                  route, so the experience pass is actually navigable
                  end to end across all four cases. Round 11: locale-
                  prefixed (same /en convention Home/About already use) so
                  Next Project preserves the current language instead of
                  always landing on the zh case. */}
              <CaseTransitionLink
                href={zhHant ? `/design-samples/case-final-${nextProject.number}` : `/en/design-samples/case-final-${nextProject.number}`}
                className="case-link group inline-flex shrink-0 items-center gap-3 pb-2 label-mono cf-heading"
              >
                {zhHant ? "查看案例" : "View case study"}
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-2">→</span>
              </CaseTransitionLink>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter locale={locale} backToTopLabel="BACK TO TOP" />
    </div>
  );
}
