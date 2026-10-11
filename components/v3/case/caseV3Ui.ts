import type { Locale } from "@/data/locale";

/*
 * V3 CASE frame UI labels. ZH = approved V3 prototype labels
 * (CaseV3Screen.dc.html); EN = concise translations of those labels
 * (approved). "查看案例 / View case study" is the original
 * production Next Case CTA, kept verbatim.
 */
export const CASE_V3_UI: Record<Locale, {
  nextSection: string;
  chapters: string;
  chaptersShort: string;
  prototype: string;
  allChannels: string;
  back: string;
  backToTop: string;
  collapse: string;
  expand: string;
  ask: string;
  next: string;
  previous: string;
  viewCase: string;
  more: string;
  collapseAria: string;
  expandAria: string;
  openChat: string;
  closeChat: string;
  closeX: string;
  guide: string;
}> = {
  zh: {
    nextSection: "下一段",
    chapters: "章節目錄",
    chaptersShort: "章節",
    prototype: "查看 Prototype",
    allChannels: "所有頻道",
    back: "返回",
    backToTop: "回到頂部",
    collapse: "收合",
    expand: "展開",
    ask: "想跳到哪一段？",
    next: "下一個",
    previous: "上一個",
    viewCase: "查看案例",
    more: "其他案例",
    collapseAria: "收合遙控器，進入閱讀模式",
    expandAria: "展開 Nemu 遙控器",
    openChat: "開啟 Nemu 對話",
    closeChat: "關閉 Nemu 對話",
    closeX: "關閉對話",
    guide: "Nemu 導覽小幫手",
  },
  en: {
    nextSection: "Next section",
    chapters: "Chapters",
    chaptersShort: "Chapters",
    prototype: "View Prototype",
    allChannels: "All channels",
    back: "Back",
    backToTop: "Back to top",
    collapse: "Collapse",
    expand: "Expand",
    ask: "Jump to a section?",
    next: "Next",
    previous: "Previous",
    viewCase: "View case study",
    more: "Other cases",
    collapseAria: "Collapse the Nemu remote and enter reading mode",
    expandAria: "Expand the Nemu remote",
    openChat: "Open Nemu conversation",
    closeChat: "Close Nemu conversation",
    closeX: "Close conversation",
    guide: "Nemu guide",
  },
};

/** Saved Desktop Reading Mode preference ('1' = reading), shared across CASE pages. */
export const READING_PREF_KEY = "ay-case-reading";

export const DESKTOP_QUERY = "(min-width: 1200px) and (min-height: 600px)";
export const SHORT_DESKTOP_QUERY = "(min-width: 1200px) and (max-height: 599px)";
export const MOBILE_QUERY = "(max-width: 1023px)";
