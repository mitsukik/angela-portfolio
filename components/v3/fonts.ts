import { JetBrains_Mono, Noto_Sans_TC } from "next/font/google";

/*
 * Portfolio V3 type stack (handoff §3): Archivo 900 display, JetBrains Mono
 * meta/OSD/labels, Noto Sans TC 400–900 body (zh + en).
 *
 * Imported once by the root layout (variables on <html>), preload:false:
 * V2 pages keep their own Geist / IBM Plex Mono / Noto Sans TC 400–500 stack
 * untouched and never fetch these files. Archivo already exists site-wide
 * (`--font-archivo`, weights up to 900), so it is reused.
 */
export const v3Mono = JetBrains_Mono({
  variable: "--font-v3-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  // Declared in the ROOT layout (one global sheet, like the V2 fonts) so V2
  // pages that prefetch a V3 route never preload an unused font/CSS chunk.
  // preload:false — files download only where V3 text actually uses them.
  preload: false,
});

export const v3Sans = Noto_Sans_TC({
  variable: "--font-v3-sans",
  weight: ["400", "500", "700", "900"],
  // CJK families ship as unicode-range chunks with no preloadable
  // chinese-traditional subset (same reason as the root layout's Noto).
  preload: false,
});

export const v3FontVariables = `${v3Mono.variable} ${v3Sans.variable}`;
