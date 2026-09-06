import type { Locale } from "./locale";

type HeroSegment = { text: string; noBreak?: boolean };

type HeroContent = {
  /** Kicker line above the identity title — one line, matches the exact
   * copy in the connected Lovable "VER B" source of truth. */
  kicker: string;
  /** Big identity typography — "ANGELA" / "YU", not a headline sentence. */
  identityLines: [string, string];
  /** Single-sentence positioning statement. Segmented so a specific run
   * (體驗/experiences) can be locked from ever breaking across lines —
   * VER B does not color-highlight any words within this sentence. */
  statement: HeroSegment[];
  supportLines: string[];
};

export const heroContent: Record<Locale, HeroContent> = {
  zh: {
    kicker: "資深產品設計師 — 複雜系統 / B2B / 企業產品",
    identityLines: ["ANGELA", "YU"],
    statement: [
      { text: "我把複雜的系統，轉譯成清晰、可延展、直覺的產品" },
      { text: "體驗", noBreak: true },
      { text: "。" },
    ],
    supportLines: [
      "從資訊架構到互動細節，讓龐大的流程在畫面上有秩序，也在使用時有節奏。",
    ],
  },
  en: {
    kicker: "Senior Product Designer — Complex Systems / B2B / Enterprise",
    identityLines: ["ANGELA", "YU"],
    statement: [
      { text: "I translate complex systems into clear, scalable, and intuitive product " },
      { text: "experiences", noBreak: true },
      { text: "." },
    ],
    supportLines: [
      "From information architecture to interaction detail, I give complex workflows clarity and rhythm.",
    ],
  },
};
