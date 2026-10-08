import type { Locale } from "@/data/locale";

export function SkipLink({ locale }: { locale: Locale }) {
  const label = locale === "zh" ? "跳至主要內容" : "Skip to main content";

  return (
    <a href="#main-content" className="skip-link" lang={locale === "zh" ? "zh-Hant" : "en"}>
      {label}
    </a>
  );
}
