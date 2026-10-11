"use client";

import { createContext, useContext, type ReactNode } from "react";

/*
 * V3 section eyebrow: inside the V3 CASE frame the chapter registry is the
 * one source for a chapter's displayed label (section header = Remote
 * chapter label = anchor). Keyed by the chapter number that starts the
 * original label ("02 — THE APPROACH" → "02"). Without a provider — or for
 * a number the registry does not list — the original label renders as is.
 */
const SectionLabels = createContext<Record<string, string> | null>(null);

export function SectionLabelProvider({ labels, children }: { labels: Record<string, string>; children: ReactNode }) {
  return <SectionLabels.Provider value={labels}>{children}</SectionLabels.Provider>;
}

export function resolveSectionLabel(raw: string, labels: Record<string, string> | null): string {
  if (!labels) return raw;
  const m = raw.match(/^(\d{2})\s+—\s+/);
  const v = m ? labels[m[1]] : undefined;
  return v ? `${m![1]} — ${v}` : raw;
}

export function SectionLabelText({ text }: { text: string }) {
  return <>{resolveSectionLabel(text, useContext(SectionLabels))}</>;
}
