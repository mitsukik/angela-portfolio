"use client";

import { useEffect, useRef, useState } from "react";
import { v2Contact, v2Ui } from "@/data/home-v2";
import { CONTACT_EMAIL } from "@/data/contact";
import type { Locale } from "@/data/locale";
import { initHomeMotion } from "@/components/home-v2/motion";

/*
 * CaseContact (CASE_SYSTEM.md §2 #10b) — the closing shared by every CASE,
 * CASE03 included. Page order: last chapter → CaseBottomNavigation →
 * CaseContact → footer, each exactly once (the frame renders the footer).
 *
 * Content is the V2 copy source (data/home-v2 v2Contact / v2Ui): headline,
 * availability paragraph, 聯絡我 (primary, mailto) · 履歷 ↓ (secondary,
 * per-language résumé) · 複製 Email (text button; if the clipboard is not
 * available it falls back to mailto). The address is never printed.
 * Buttons use the CaseHeroCTA roles; the V2 pointer engine keeps the
 * approved magnetic effect (fine pointers only, off under reduced motion).
 */
export function CaseV3Closing({ locale }: { locale: Locale }) {
  const contact = v2Contact(locale);
  const ui = v2Ui(locale);
  const lang = locale === "zh" ? "zh-Hant" : "en";
  const rootRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const stop = initHomeMotion(root);
    const t = timer;
    return () => {
      stop();
      window.clearTimeout(t.current);
    };
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
    } catch {
      window.location.href = `mailto:${CONTACT_EMAIL}`;
      return;
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section ref={rootRef} id="contact" className="cv3-contact" aria-labelledby="cv3-contact-title" tabIndex={-1} lang={lang}>
      <div className="cv3-contact-copy">
        <h2 id="cv3-contact-title" lang="en" className="cv3-contact-title" data-reveal="">
          {contact.heading[0]}
          <br />
          {contact.heading[1]}
        </h2>
        <p className="cv3-contact-body" data-reveal="">{contact.body}</p>
      </div>
      <div className="cv3-contact-actions" data-reveal="">
        <a href={`mailto:${CONTACT_EMAIL}`} className="cv3-cta" data-magnetic>
          {contact.contactLabel}
          <span aria-hidden="true" className="cv3-cta-arrow">→</span>
        </a>
        <a href={contact.resumeHref} className="cv3-cta" data-variant="secondary" data-magnetic target="_blank" rel="noopener noreferrer">
          {contact.resumeLabel}
          <span aria-hidden="true" className="cv3-cta-arrow">↓</span>
        </a>
        <button type="button" className="cv3-contact-copy-btn" data-magnetic onClick={copyEmail}>
          {copied ? ui.copied : ui.copyEmail}
        </button>
        <span className="cv3-sr" role="status">{copied ? ui.copied : ""}</span>
      </div>
    </section>
  );
}
