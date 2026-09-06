import type { Locale } from "./locale";

type HeroSegment = { text: string; highlight?: boolean; noBreak?: boolean };

type HeroContent = {
  eyebrow: { primary: string; secondary: string };
  /** Big identity typography — "ANGELA" / "YU", not a headline sentence.
   * Kept as two lines so each can be revealed/compressed independently
   * during the Hero -> Work handoff. */
  identityLines: [string, string];
  /** Single-sentence positioning statement. Segmented so specific runs can
   * carry an accent color (highlight) and/or be locked from ever breaking
   * across lines (noBreak) — e.g. "體驗" must stay one visual unit. */
  statement: HeroSegment[];
  supportLines: string[];
};

export const heroContent: Record<Locale, HeroContent> = {
  zh: {
    eyebrow: { primary: "Product Designer", secondary: "Based In Taiwan" },
    identityLines: ["ANGELA", "YU"],
    statement: [
      { text: "我把" },
      { text: "複雜", highlight: true },
      { text: "的系統，轉譯成清晰、可延展、" },
      { text: "直覺", highlight: true },
      { text: "的產品" },
      { text: "體驗", noBreak: true },
      { text: "。" },
    ],
    supportLines: [
      "從不確定到產品上線，我與團隊一起完成",
      "策略、UX 設計與研究的完整合作。",
    ],
  },
  en: {
    eyebrow: { primary: "Product Designer", secondary: "Based In Taiwan" },
    identityLines: ["ANGELA", "YU"],
    statement: [
      { text: "I turn " },
      { text: "complex", highlight: true },
      { text: " systems into clear, scalable, " },
      { text: "intuitive", highlight: true },
      { text: " product " },
      { text: "experiences", noBreak: true },
      { text: "." },
    ],
    supportLines: [
      "From ambiguity to launch, I collaborate with teams",
      "across strategy, UX design, and research.",
    ],
  },
};
