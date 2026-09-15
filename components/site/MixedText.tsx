import type { ReactNode } from "react";

const LATIN_NUMERIC_RUN = /[A-Za-z0-9]+/g;

/**
 * Renders Chinese copy while keeping embedded Latin/numeric runs (e.g. "IoT")
 * in the Latin font stack instead of inheriting the Chinese font from :lang(zh-Hant).
 */
export function MixedText({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(LATIN_NUMERIC_RUN)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      parts.push(text.slice(lastIndex, index));
    }
    parts.push(
      <span key={index} lang="en" className="font-sans">
        {match[0]}
      </span>,
    );
    lastIndex = index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <>{parts}</>;
}
