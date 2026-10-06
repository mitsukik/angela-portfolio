import type { Locale } from "./locale";

export const CONTACT_EMAIL = "angelayyu.cu@gmail.com";
export const RESUME_URL_EN = "https://drive.google.com/uc?export=download&id=1QYBxpqwk4jBXRLlWesG4J78O4CsP-bVZ";
export const RESUME_URL_ZH = "https://drive.google.com/uc?export=download&id=1um1vszVCmhPuvDMM7QBVRdW07BnYY1s8";

export const resumeUrl = (locale: Locale) => (locale === "zh" ? RESUME_URL_ZH : RESUME_URL_EN);

/** Closing / contact copy shared by the site footer and the Home closing
 * section, so the two can never drift apart. The address itself stays in the
 * mailto destination only — it is never printed. */
export const closingBody: Record<Locale, string> = {
  zh: "正在尋找能一起處理複雜問題的團隊。如果你的產品需要有人把混亂的流程整理成清楚的體驗，歡迎聊聊。",
  en: "Looking for a team that tackles complex problems together. If your product needs someone to turn messy workflows into a clear experience, let's talk.",
};

export const contactLabels: Record<Locale, { contact: string; resume: string }> = {
  zh: { contact: "聯絡我", resume: "履歷" },
  en: { contact: "CONTACT ME", resume: "Resume" },
};
