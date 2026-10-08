import type { Locale } from "./locale";

export const CONTACT_EMAIL = "angelayyu.cu@gmail.com";
export const RESUME_URL_EN = "https://drive.google.com/uc?export=download&id=1QYBxpqwk4jBXRLlWesG4J78O4CsP-bVZ";
export const RESUME_URL_ZH = "https://drive.google.com/uc?export=download&id=1um1vszVCmhPuvDMM7QBVRdW07BnYY1s8";

export const resumeUrl = (locale: Locale) => (locale === "zh" ? RESUME_URL_ZH : RESUME_URL_EN);

/** Closing / contact copy shared by the site footer and the Home closing
 * section, so the two can never drift apart. The address itself stays in the
 * mailto destination only — it is never printed. */
export const closingBody: Record<Locale, string> = {
  zh: "開放 Senior Product Designer／Senior UI/UX Designer 機會，聚焦 B2B、企業產品與複雜系統。現居台中，也開放遠端工作。",
  en: "Open to Senior Product Designer and Senior UI/UX Designer opportunities in B2B, enterprise, and complex systems. Based in Taichung and open to remote work.",
};

export const contactLabels: Record<Locale, { contact: string; resume: string }> = {
  zh: { contact: "聯絡我", resume: "履歷" },
  en: { contact: "CONTACT ME", resume: "Resume" },
};
