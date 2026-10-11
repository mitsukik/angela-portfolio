"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { CONSENT_REGIONS, GA_HOSTS, GA_MEASUREMENT_ID } from "@/data/analytics";
import { RESUME_URL_EN, RESUME_URL_ZH } from "@/data/contact";

/*
 * GA4 for Portfolio V3 — rendered by the root layout only in Vercel
 * production builds (data/analytics.ts), and inert on any other host.
 *
 * Page views are sent here, once per committed pathname (config uses
 * send_page_view: false), so Page Transition 01 / client navigation can
 * neither drop nor duplicate them; hash changes (#channels) are not page
 * views. Interactions are read from clicks (no component changes) plus the
 * INDEX channel switch, which announces itself with a `v3:track` event.
 *
 * Privacy: no email address, link text, form value or query string other
 * than utm_* is ever sent; advertising features are off.
 */

type Params = Record<string, string | number | boolean | undefined>;
type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

const RESUMES = new Set([RESUME_URL_ZH, RESUME_URL_EN]);
const CASE_PATH = /^(?:\/en)?\/design-samples\/case-final-(\d{2})\/?$/;

const lang = (path: string) => (path === "/en" || path.startsWith("/en/") ? "en" : "zh");
const pageType = (path: string) => {
  const p = path.replace(/^\/en(?=\/|$)/, "") || "/";
  if (p === "/") return "index";
  if (p.startsWith("/about")) return "about";
  if (CASE_PATH.test(path)) return "case";
  return "other";
};
const caseOf = (path: string) => {
  const m = path.match(CASE_PATH);
  return m ? `CASE${m[1]}` : undefined;
};
const area = (el: Element) =>
  el.closest("#contact") ? "contact" : el.closest(".cv3-navcard, .cv3-more-all") ? "prev_next" : el.closest("header, nav") ? "header" : "page";

/** Keep campaign attribution, drop every other query value. */
const location = (path: string) => {
  const q = new URLSearchParams(window.location.search);
  const keep = new URLSearchParams();
  q.forEach((v, k) => {
    if (k.startsWith("utm_")) keep.set(k, v);
  });
  const s = keep.toString();
  return `${window.location.origin}${path}${s ? `?${s}` : ""}`;
};

let active = false;
const send = (name: string, params: Params = {}) => {
  if (!active || !window.gtag) return;
  const path = window.location.pathname;
  window.gtag("event", name, { page_type: pageType(path), page_language: lang(path), ...params });
};

export function Analytics() {
  const pathname = usePathname();
  const last = useRef<string | null>(null);
  const [load, setLoad] = useState(false);

  // Consent defaults + config, before any hit.
  useEffect(() => {
    if (!GA_HOSTS.includes(window.location.hostname)) return;
    window.dataLayer = window.dataLayer || [];
    // eslint-disable-next-line prefer-rest-params -- gtag requires the arguments object
    window.gtag = window.gtag || function gtag() { window.dataLayer!.push(arguments); };
    const gpc = (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
    const noAds = { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" };
    window.gtag("consent", "default", { ...noAds, analytics_storage: gpc ? "denied" : "granted" });
    window.gtag("consent", "default", { ...noAds, analytics_storage: "denied", region: CONSENT_REGIONS });
    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false });
    active = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the host is only known in the browser
    setLoad(true);
  }, []);

  // One page view per pathname.
  useEffect(() => {
    if (!active || last.current === pathname) return;
    const referrer = last.current ? `${window.location.origin}${last.current}` : undefined;
    last.current = pathname;
    // after the commit, so document.title belongs to the new route
    const id = requestAnimationFrame(() =>
      send("page_view", { page_location: location(pathname), page_title: document.title, ...(referrer ? { page_referrer: referrer } : {}) }),
    );
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  // Interactions.
  useEffect(() => {
    if (!active) return;
    const onClick = (e: MouseEvent) => {
      const t = e.target as Element | null;
      if (!t || !t.closest) return;
      const a = t.closest("a[href]") as HTMLAnchorElement | null;
      if (a) {
        const raw = a.getAttribute("href") || "";
        if (raw.startsWith("mailto:")) return send("contact_click", { method: "email_link", link_location: area(a) });
        if (RESUMES.has(a.href)) return send("resume_download", { resume_language: a.href === RESUME_URL_EN ? "en" : "zh", link_location: area(a) });
        let url: URL;
        try {
          url = new URL(a.href);
        } catch {
          return;
        }
        if (url.origin === window.location.origin) {
          const m = url.pathname.match(CASE_PATH);
          if (m && url.pathname !== window.location.pathname) send("case_open", { case_id: `CASE${m[1]}`, link_location: area(a) });
          return;
        }
        if (url.protocol === "http:" || url.protocol === "https:") {
          send("project_link_click", {
            case_id: caseOf(window.location.pathname),
            link_domain: url.hostname,
            link_type: url.hostname.endsWith(".vercel.app") ? "prototype" : "website",
            link_location: area(a),
          });
        }
        return;
      }
      const b = t.closest("button");
      if (b && (b.classList.contains("cv3-contact-copy-btn") || /^(複製 Email|Copy email)/i.test((b.textContent || "").trim()))) {
        send("contact_click", { method: "copy_email", link_location: area(b) });
      }
    };
    const onTrack = (e: Event) => {
      const d = (e as CustomEvent<{ name?: string; params?: Params }>).detail;
      if (d && d.name === "select_channel") send("select_channel", d.params);
    };
    document.addEventListener("click", onClick, true);
    window.addEventListener("v3:track", onTrack);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("v3:track", onTrack);
    };
  }, []);

  if (!load) return null;
  return <Script id="ga4" src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />;
}
