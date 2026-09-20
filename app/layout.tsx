import type { Metadata } from "next";
import { Archivo, Geist, Geist_Mono, IBM_Plex_Mono, Noto_Sans_TC } from "next/font/google";
import Script from "next/script";
import { RouteTransition } from "@/components/site/RouteTransition";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import "./globals.css";

// Every route is statically generated from one shared root layout (no
// per-locale layout.tsx, no [locale] dynamic segment), so the server has
// no per-request way to know whether it's rendering "/" (zh) or "/en"
// (en) at the point <html> is emitted — reading the incoming path via
// headers()/middleware would work, but forces this layout (and every
// page under it) out of static generation just to fix one attribute.
// Matching SiteHeader.tsx's own locale-from-pathname convention
// ("/en" or "/en/..." = en, everything else = zh) in a beforeInteractive
// script keeps every route static and corrects <html lang> before the
// page becomes interactive — same tradeoff Next's own dark-mode/theme
// beforeInteractive examples accept: not visible in a view-source/no-JS
// fetch, but correct for every real browser before first paint settles.
const LOCALE_LANG_GUARD = `(() => {
  try {
    var path = window.location.pathname;
    var isEn = path === "/en" || path.indexOf("/en/") === 0;
    document.documentElement.lang = isEn ? "en" : "zh-Hant";
  } catch (e) {}
})();`;

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
      // "/" (this app's root route) is zh — the beforeInteractive script
      // below corrects this to "en" specifically on /en routes, so the
      // no-JS/pre-hydration default matches this site's actual primary
      // locale instead of the other way around.
      lang="zh-Hant"
      className={`${geistSans.variable} ${geistMono.variable} ${notoSansTC.variable} ${archivo.variable} ${ibmPlexMono.variable} h-full antialiased`}
      // The beforeInteractive scripts below legitimately mutate this
      // element's attributes (lang on every route; data-about-hero-motion
      // on /about routes) before hydration — React has no way to know
      // that's expected, so without this it reports a hydration mismatch
      // on <html> on every fresh load. This is the same pattern (and same
      // reason) Next.js's own docs use for a dark-mode/theme
      // beforeInteractive script; it only suppresses the warning for this
      // element's own attributes, not for anything inside it.
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Script
          id="locale-lang-guard"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: LOCALE_LANG_GUARD }}
        />
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
