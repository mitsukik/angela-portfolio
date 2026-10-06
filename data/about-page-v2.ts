import { aboutV2Content } from "./about-v2";
import { v2Contact, v2Ui, type V2Shell } from "./home-v2";
import type { Locale } from "./locale";

/**
 * About V2 view-model. Copy is READ from data/about-v2.ts (the source the
 * production /about already renders); the only new strings are the V2
 * section headings, the hub label, UI hints and the hero facts approved for
 * V2 — all marked NEW below. Skills come from the existing skill groups only.
 */

export type HeroFact = { label: string; value: string; count?: { prefix: string; value: number; suffix: string } };
export type Capability = { title: string; description: string; links: number[] };
export type MethodStep = { number: string; tag: string; title: string; description: string; accent: string };

export type AboutPageContent = V2Shell & {
  hero: {
    eyebrow: string;
    headline: { before: string; key: string; after: string };
    lede: string;
    facts: HeroFact[];
  };
  background: { label: string; text: string; highlight: string; closing: string };
  graph: {
    eyebrow: string;
    heading: string;
    hintHover: string;
    hintTouch: string;
    inputsLabel: string;
    inputs: string[];
    capabilities: Capability[];
  };
  method: { eyebrow: string; heading: string; hub: string; pause: string; play: string; stageLabel: string; steps: MethodStep[] };
  tools: { eyebrow: string; heading: string; groups: { label: string; items: string[] }[] };
  beyond: {
    eyebrow: string;
    heading: string;
    paragraph: string;
    chain: string[];
    ai: string;
    image: { src: string; alt: string; width: number; height: number };
    caption: string;
    enlargeHint: string;
    zoom: string;
    lightboxHint: string;
    close: string;
  };
};

// Handoff link map (editorial structure): capability index -> input indexes
// (inputs: 需求, 資訊, 流程, 角色, 狀態, 限制).
const CAPABILITY_LINKS = [
  [0, 1, 3],
  [1, 2, 3, 4, 5],
  [0, 2, 4],
  [1, 4, 5],
];

const STEP_ACCENTS = ["#f4f1ea", "#d4f04a", "#a98bf0", "#d4f04a"];

// The headline's emphasised phrase — a design emphasis inside the existing
// headline copy, not new text.
const KEY_PHRASE: Record<Locale, string> = { zh: "產品如何運作", en: "how products work" };
// The background paragraph's closing key phrase (already in that paragraph).
const BIO_HIGHLIGHT: Record<Locale, string> = {
  zh: "「產品如何被理解與使用」",
  en: "how products are structured, understood, and used",
};

const NEW: Record<
  Locale,
  {
    eyebrow: string;
    facts: HeroFact[];
    background: string;
    graphHeading: string;
    hintHover: string;
    hintTouch: string;
    methodHeading: string;
    hub: string;
    pause: string;
    play: string;
    stageLabel: string;
    toolsHeading: string;
    beyondHeading: string;
    caption: string;
    enlargeHint: string;
    zoom: string;
    lightboxHint: string;
    close: string;
  }
> = {
  zh: {
    eyebrow: "關於 — SENIOR UI/UX DESIGNER",
    facts: [
      { label: "經驗", value: "近 9 年", count: { prefix: "近 ", value: 9, suffix: " 年" } },
      { label: "據點", value: "台中，台灣" },
      { label: "專長重點", value: "複雜系統 · B2B · 企業產品" },
    ],
    background: "背景",
    graphHeading: "六種輸入，收斂成四種能力",
    hintHover: "滑過任一項，看它們如何連結",
    hintTouch: "點選任一項，看它們如何連結",
    methodHeading: "同一組元素，從混亂走到可用",
    hub: "產品結構",
    pause: "暫停自動播放",
    play: "繼續自動播放",
    stageLabel: "工作方式示意",
    toolsHeading: "從體驗到實作",
    beyondHeading: "插畫教會我的，也用在介面上。",
    caption: "PERSONAL ILLUSTRATION",
    enlargeHint: "點擊放大",
    zoom: "放大",
    lightboxHint: "ESC / 點擊關閉",
    close: "關閉",
  },
  en: {
    eyebrow: "ABOUT — SENIOR UI/UX DESIGNER",
    facts: [
      { label: "EXPERIENCE", value: "~9 yrs", count: { prefix: "~", value: 9, suffix: " yrs" } },
      { label: "BASED IN", value: "Taichung, Taiwan" },
      { label: "FOCUS", value: "Complex Systems · B2B · Enterprise" },
    ],
    background: "BACKGROUND",
    graphHeading: "Six inputs, four capabilities",
    hintHover: "Hover any item to see how they connect",
    hintTouch: "Tap any item to see how they connect",
    methodHeading: "Same elements, from mess to usable",
    hub: "Structure",
    pause: "Pause autoplay",
    play: "Resume autoplay",
    stageLabel: "How I work, illustrated",
    toolsHeading: "From experience to build",
    beyondHeading: "What illustration taught me, I bring to interfaces.",
    caption: "PERSONAL ILLUSTRATION",
    enlargeHint: "CLICK TO ENLARGE",
    zoom: "Zoom",
    lightboxHint: "ESC / CLICK TO CLOSE",
    close: "Close",
  },
};

function splitHeadline(text: string, key: string) {
  const at = text.indexOf(key);
  if (at < 0) return { before: text, key: "", after: "" };
  return { before: text.slice(0, at), key, after: text.slice(at + key.length) };
}

export function getAboutPageContent(locale: Locale): AboutPageContent {
  const source = aboutV2Content[locale];
  const copy = NEW[locale];
  const headline = source.headlineLines.map((line) => line.map((segment) => segment.text).join("")).join("");

  return {
    locale,
    ui: v2Ui(locale),
    contact: v2Contact(locale),
    hero: {
      eyebrow: copy.eyebrow,
      headline: splitHeadline(headline, KEY_PHRASE[locale]),
      lede: source.introParagraphs[0],
      facts: copy.facts,
    },
    background: {
      label: copy.background,
      text: source.introParagraphs[1],
      highlight: BIO_HIGHLIGHT[locale],
      closing: source.introParagraphs[2],
    },
    graph: {
      eyebrow: source.whatIDoHeading,
      heading: copy.graphHeading,
      hintHover: copy.hintHover,
      hintTouch: copy.hintTouch,
      inputsLabel: source.inputsLabel,
      inputs: source.inputs.map((input) => input.label),
      capabilities: source.capabilities.map((capability, index) => ({
        title: capability.title,
        description: capability.description,
        links: CAPABILITY_LINKS[index] ?? [],
      })),
    },
    method: {
      eyebrow: source.howIWorkHeading,
      heading: copy.methodHeading,
      hub: copy.hub,
      pause: copy.pause,
      play: copy.play,
      stageLabel: copy.stageLabel,
      steps: source.stages.map((stage, index) => {
        const [number, ...rest] = stage.tag.split(" ");
        return { number, tag: rest.join(" "), title: stage.title, description: stage.description, accent: STEP_ACCENTS[index] };
      }),
    },
    tools: { eyebrow: source.skillsHeading, heading: copy.toolsHeading, groups: source.skillGroups },
    beyond: {
      eyebrow: source.beyondHeading,
      heading: copy.beyondHeading,
      paragraph: source.beyondParagraphs[0],
      chain: source.illustrationChain,
      ai: source.beyondParagraphs[1],
      image: {
        src: "/images/about/about-personalwork01.png",
        alt: locale === "zh" ? "個人插畫作品" : "Personal illustration artwork",
        width: 1518,
        height: 1036,
      },
      caption: copy.caption,
      enlargeHint: copy.enlargeHint,
      zoom: copy.zoom,
      lightboxHint: copy.lightboxHint,
      close: copy.close,
    },
  };
}
