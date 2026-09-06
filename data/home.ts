import type { Locale } from "./locale";

type HeroSegment = { text: string; highlight?: boolean };

type HeroContent = {
  eyebrow: { primary: string; secondary: string };
  headlineLines: HeroSegment[][];
  supportLines: string[];
};

export const heroContent: Record<Locale, HeroContent> = {
  zh: {
    eyebrow: { primary: "Product Designer", secondary: "Based In Taiwan" },
    headlineLines: [
      [{ text: "將" }, { text: "複雜", highlight: true }, { text: "的系統，" }],
      [{ text: "設計得清晰而" }, { text: "直覺", highlight: true }, { text: "。" }],
    ],
    supportLines: [
      "從不確定到產品上線，我與團隊一起完成",
      "策略、UX 設計與研究的完整合作。",
    ],
  },
  en: {
    eyebrow: { primary: "Product Designer", secondary: "Based In Taiwan" },
    headlineLines: [
      [{ text: "Turning " }, { text: "complex", highlight: true }, { text: " systems into" }],
      [{ text: "clear, " }, { text: "intuitive", highlight: true }, { text: " products." }],
    ],
    supportLines: [
      "From ambiguity to launch, I collaborate with teams",
      "across strategy, UX design, and research.",
    ],
  },
};
