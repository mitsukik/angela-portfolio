"use client";

import { useEffect, useRef, useState } from "react";
import { CONTACT_EMAIL } from "@/data/contact";
import Link from "next/link";
import type { V2Shell } from "@/data/home-v2";
import { scrollToTop } from "./scroll";

/**
 * Closing contact + footer row. The address itself is never printed: the
 * primary action is the same mailto link V1 used, and a secondary button
 * copies the address (the reference's copy interaction) without showing it.
 */
export function HomeContact({ content }: { content: V2Shell }) {
  const { contact, ui, locale } = content;
  const lang = locale === "zh" ? "zh-Hant" : "en";
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
    } catch {
      // Clipboard API unavailable (insecure context / permissions): legacy path.
      const field = document.createElement("textarea");
      field.value = CONTACT_EMAIL;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      try {
        document.execCommand("copy");
      } finally {
        field.remove();
      }
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section id="contact" className="hv2-contact" aria-labelledby="hv2-contact-title" tabIndex={-1}>
      <h2 id="hv2-contact-title" lang="en" className="hv2-contact-title" data-reveal="">
        {contact.heading[0]}
        <br />
        <span className="hv2-contact-title-2">{contact.heading[1]}</span>
      </h2>
      <p lang={lang} className="hv2-contact-body" data-reveal="">{contact.body}</p>
      <div className="hv2-contact-actions" data-reveal="">
        <a href={`mailto:${CONTACT_EMAIL}`} className="hv2-btn hv2-btn-lime hv2-btn-lg" data-magnetic lang={lang}>
          {contact.contactLabel} <span aria-hidden>→</span>
        </a>
        <a
          href={contact.resumeHref}
          className="hv2-btn hv2-btn-outline hv2-btn-lg"
          data-magnetic
          target="_blank"
          rel="noopener noreferrer"
          lang={lang}
        >
          {contact.resumeLabel} <span aria-hidden>↓</span>
        </a>
        <button
          type="button"
          className="hv2-btn hv2-btn-ghost"
          data-magnetic
          onClick={copyEmail}
          lang={lang}
        >
          {copied ? ui.copied : ui.copyEmail}
        </button>
        <span className="hv2-sr" role="status">{copied ? ui.copied : ""}</span>
      </div>
    </section>
  );
}

/** Home ends with "back to top"; inner pages (About) link home instead. */
export function HomeFooter({ content, variant = "top" }: { content: V2Shell; variant?: "top" | "home" }) {
  return (
    <footer className="hv2-footer">
      <p lang="en">© ANGELA YU 2026</p>
      {variant === "top" ? (
        <button type="button" className="hv2-backtop" lang="en" onClick={scrollToTop}>
          {content.ui.backToTop} <span aria-hidden>↑</span>
        </button>
      ) : (
        <Link href={content.locale === "en" ? "/en" : "/"} className="hv2-backtop">
          {content.ui.homeLink}
        </Link>
      )}
    </footer>
  );
}
