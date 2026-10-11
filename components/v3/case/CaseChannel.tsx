"use client";

import { createContext, useContext } from "react";

/*
 * The visible channel slot of the current CASE ("02" for CASE03), provided by
 * CaseV3Shell from the published sequence (data/v3/order.ts). Every in-page
 * "CH NN" label reads it here, so no article derives a channel from its
 * permanent CASE number.
 */
export const CaseChannelContext = createContext<string | null>(null);

/** Renders the current channel slot; `fallback` only outside a CASE shell. */
export function CaseChannelLabel({ fallback }: { fallback: string }) {
  return <>{useContext(CaseChannelContext) ?? fallback}</>;
}
