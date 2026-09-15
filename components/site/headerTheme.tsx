"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type HeaderVariant = "dark" | "light";

/**
 * Lets a page-specific section (currently: Home's Selected Work) drive the
 * shared SiteHeader's variant from its own already-computed state, instead
 * of SiteHeader owning a second copy of "what theme is active right now."
 * Absent everywhere else (About, Case Study) — SiteHeader falls back to its
 * plain `variant` prop when no provider is present, so this is additive
 * only for the one page that opts in.
 */
const HeaderThemeContext = createContext<{
  variant: HeaderVariant;
  setVariant: (variant: HeaderVariant) => void;
} | null>(null);

export function HeaderThemeProvider({
  children,
  initialVariant = "dark",
}: {
  children: ReactNode;
  initialVariant?: HeaderVariant;
}) {
  const [variant, setVariant] = useState<HeaderVariant>(initialVariant);
  return <HeaderThemeContext.Provider value={{ variant, setVariant }}>{children}</HeaderThemeContext.Provider>;
}

export function useHeaderThemeContext() {
  return useContext(HeaderThemeContext);
}

/** Reports `nextVariant` up to an ancestor HeaderThemeProvider, if any. No-op outside one. */
export function useSyncHeaderVariant(nextVariant: HeaderVariant) {
  const ctx = useContext(HeaderThemeContext);
  const setVariant = ctx?.setVariant;
  useEffect(() => {
    setVariant?.(nextVariant);
  }, [setVariant, nextVariant]);
}
