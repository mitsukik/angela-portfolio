import type { Locale } from "./locale";
import { aboutContent } from "./about";

// About VER2 — isolated prototype content, kept in its own file so the
// production /about page (data/about.ts) can never be affected by this
// route's edits. Every string below is either copied verbatim from
// data/about.ts or is a new *presentational* label the task brief itself
// specified (stage tags, input names, concept-chain labels) — no invented
// companies, metrics, or claims.

export type HeadlineSegment = { text: string; highlight?: boolean };

export type V2Input = { id: string; label: string };
export type V2Capability = { title: string; description: string; inputIds: string[] };
export type V2Stage = { tag: string; title: string; description: string };
export type V2SkillGroup = { label: string; items: string[] };

export type AboutV2Content = {
  headlineLines: HeadlineSegment[][];
  introParagraphs: string[];
  whatIDoHeading: string;
  inputsLabel: string;
  inputs: V2Input[];
  capabilities: V2Capability[];
  howIWorkHeading: string;
  stages: V2Stage[];
  skillsHeading: string;
  skillGroups: V2SkillGroup[];
  beyondHeading: string;
  beyondParagraphs: string[];
  illustrationChain: string[];
  productChain: string[];
};

// Positional 1:1 mapping onto VER1's four real service areas — order is
// preserved so the substantive copy (title/description) stays exactly
// what VER1 already says; only the input↔capability relationships below
// are new editorial structure, derived by reading each VER1 description's
// own vocabulary (e.g. Complex Systems' own text already names roles/
// states/rules).
const CAPABILITY_INPUT_MAP: string[][] = [
  ["requirements", "information", "flows"], // Product & UX Design
  ["roles", "states", "constraints"], // Complex Systems
  ["flows", "information", "requirements"], // Interaction & Prototyping
  ["constraints", "flows", "states"], // Web Design & Build
];

const STAGE_TAGS = ["01 UNSTRUCTURED", "02 RELATIONSHIPS", "03 STRUCTURE", "04 PRODUCT EXPERIENCE"];

const INPUT_LABELS: Record<Locale, string[]> = {
  zh: ["需求", "資訊", "流程", "角色", "狀態", "限制"],
  en: ["Requirements", "Information", "Flows", "Roles", "States", "Constraints"],
};

const INPUT_IDS = ["requirements", "information", "flows", "roles", "states", "constraints"];

function buildInputs(locale: Locale): V2Input[] {
  return INPUT_IDS.map((id, index) => ({ id, label: INPUT_LABELS[locale][index] }));
}

function buildCapabilities(locale: Locale): V2Capability[] {
  return aboutContent[locale].serviceAreas.map((area, index) => ({
    title: area.title,
    description: area.description,
    inputIds: CAPABILITY_INPUT_MAP[index],
  }));
}

function buildStages(locale: Locale): V2Stage[] {
  return aboutContent[locale].processStages.map((stage, index) => ({
    tag: STAGE_TAGS[index],
    title: stage.title,
    description: stage.description,
  }));
}

// VER2-only trim: drop "After Effects" from the Design Tools group. Built
// via .map()/.filter() (never mutating VER1's arrays) so data/about.ts —
// and production /about — are untouched.
function buildSkillGroups(locale: Locale): V2SkillGroup[] {
  return aboutContent[locale].skillGroups.map((group) => ({
    ...group,
    items: group.items.filter((item) => item !== "After Effects"),
  }));
}

// VER2-only English copy — concise, natural adaptations rather than
// VER1's originals (or a literal translation), written directly for this
// page rather than reused from data/about.ts. Straight apostrophes only.
const EN_HEADLINE_LINES: HeadlineSegment[][] = [
  [{ text: "I design more than screens —" }],
  [{ text: "I care about how products " }, { text: "work", highlight: true }, { text: "." }],
];

const EN_INTRO_PARAGRAPHS: string[] = [
  "I'm Angela, a Product Designer based in Taichung with 9+ years of experience across UI/UX, web, and digital products.",
  "I started in web design and front-end implementation, then moved into B2B platforms, IoT, education, and other digital products. Over time, my focus shifted from how interfaces look to how products are structured, understood, and used.",
  "For complex products, I start by clarifying the problem and mapping how information, flows, roles, and states connect. I care about the experience as a whole — not just individual screens — and whether the design can actually be built.",
];

const EN_BEYOND_PARAGRAPHS: string[] = [
  "Outside product design, I also work as an illustrator. Exploring composition, lighting, and visual storytelling has shaped how I think about hierarchy, detail, and the overall experience.",
  "I'm also interested in new tools and ways of working, including AI-assisted development and more direct ways for designers to move from design into implementation.",
];

export const aboutV2Content: Record<Locale, AboutV2Content> = {
  zh: {
    headlineLines: [[{ text: "我設計的不只是畫面，" }], [{ text: "更在意產品如何" }, { text: "運作。", highlight: true }]],
    introParagraphs: aboutContent.zh.introParagraphs,
    whatIDoHeading: "我的專長",
    inputsLabel: "INPUTS",
    inputs: buildInputs("zh"),
    capabilities: buildCapabilities("zh"),
    howIWorkHeading: "工作方式",
    stages: buildStages("zh"),
    skillsHeading: aboutContent.zh.skillsHeading,
    skillGroups: buildSkillGroups("zh"),
    beyondHeading: aboutContent.zh.beyondHeading,
    beyondParagraphs: aboutContent.zh.beyondParagraphs,
    illustrationChain: ["ILLUSTRATION", "COMPOSITION", "LIGHTING", "VISUAL STORYTELLING", "PRODUCT DESIGN"],
    productChain: ["DESIGN", "PROTOTYPE", "IMPLEMENTATION"],
  },
  en: {
    headlineLines: EN_HEADLINE_LINES,
    introParagraphs: EN_INTRO_PARAGRAPHS,
    whatIDoHeading: "What I Do",
    inputsLabel: "INPUTS",
    inputs: buildInputs("en"),
    capabilities: buildCapabilities("en"),
    howIWorkHeading: "How I Work",
    stages: buildStages("en"),
    skillsHeading: aboutContent.en.skillsHeading,
    skillGroups: buildSkillGroups("en"),
    beyondHeading: aboutContent.en.beyondHeading,
    beyondParagraphs: EN_BEYOND_PARAGRAPHS,
    illustrationChain: ["ILLUSTRATION", "COMPOSITION", "LIGHTING", "VISUAL STORYTELLING", "PRODUCT DESIGN"],
    productChain: ["DESIGN", "PROTOTYPE", "IMPLEMENTATION"],
  },
};
