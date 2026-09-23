import type { Metadata } from "next";
import { Archivo, Geist, Geist_Mono, IBM_Plex_Mono, Noto_Sans_TC } from "next/font/google";
import Script from "next/script";
import { RouteTransition } from "@/components/site/RouteTransition";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import "./globals.css";

// Must match the reduced-motion query AboutHero.tsx's own gsap.matchMedia
// uses, and the /about path check must match every locale variant that
// route can be reached under (/about, /en/about).
const ABOUT_HERO_MOTION_GUARD = `(() => {
  try {
    if (!/\\/about(?:$|\\/)/.test(window.location.pathname)) return;
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
    document.documentElement.setAttribute("data-about-hero-motion", "pending");
    window.setTimeout(() => document.documentElement.removeAttribute("data-about-hero-motion"), 2000);
  } catch (e) {}
})();`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// V3 (VER B port): display/label typefaces matched to the Lovable source
// of truth's --font-display / --font-mono. Additive — Geist stays the
// existing body font for pages not in scope this pass (About/Case Study).
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  weight: ["400", "500"],
  // Google serves CJK families as ~100+ unicode-range chunks with no
  // preloadable "chinese-traditional" subset (only latin/latin-ext/cyrillic/
  // vietnamese are listed) — preloading would only prioritize the Latin
  // chunk we don't want, so it's disabled and the browser lazy-loads the
  // CJK ranges it actually needs.
  preload: false,
});

export const metadata: Metadata = {
  title: "Angela Yu | Senior UI/UX Designer",
  description: "Minimal senior UI/UX designer portfolio landing page.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${notoSansTC.variable} ${archivo.variable} ${ibmPlexMono.variable} h-full antialiased`}
      // The beforeInteractive script above legitimately mutates this
      // element's attributes (data-about-hero-motion) before hydration on
      // /about routes — React has no way to know that's expected, so
      // without this it reports a hydration mismatch on <html> on every
      // fresh load of /about. This is the same pattern (and same reason)
      // Next.js's own docs use for a dark-mode/theme beforeInteractive
      // script; it only suppresses the warning for this element's own
      // attributes, not for anything inside it.
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Script
          id="about-hero-motion-guard"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: ABOUT_HERO_MOTION_GUARD }}
        />
        <SmoothScroll />
        <RouteTransition />
        {children}
      </body>
    </html>
  );
}
