"use client";

import { useEffect, useMemo, useRef } from "react";
import type { AboutPageContent } from "@/data/about-page-v2";

/**
 * Background: the bio paragraph "fills in" as it scrolls through view —
 * characters in ZH, words in EN; the closing key phrase lights lime. The
 * text is fully lit without JS and under reduced motion. Only spans whose
 * state actually changes are touched on each scroll frame.
 */
export function AboutBackground({ content }: { content: AboutPageContent }) {
  const { background, locale } = content;
  const lang = locale === "zh" ? "zh-Hant" : "en";
  const textRef = useRef<HTMLParagraphElement>(null);

  const tokens = useMemo(() => {
    const parts = locale === "en" ? background.text.split(/(?<=\s)/) : Array.from(background.text);
    const start = background.text.indexOf(background.highlight);
    const end = start + background.highlight.length;
    const out: { text: string; key: boolean }[] = [];
    for (let i = 0, at = 0; i < parts.length; at += parts[i].length, i += 1) {
      out.push({ text: parts[i], key: start >= 0 && at >= start && at < end });
    }
    return out;
  }, [background, locale]);

  useEffect(() => {
    const el = textRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const spans = Array.from(el.children) as HTMLElement[];
    const total = spans.length;
    let lit = total;
    let raf = 0;
    el.dataset.fill = "on";

    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.max(0, Math.min(1, (vh * 0.8 - rect.top) / (rect.height + vh * 0.3)));
      const next = Math.ceil(p * total);
      if (next === lit) return;
      const [from, to] = next > lit ? [lit, next] : [next, lit];
      for (let i = from; i < to; i += 1) spans[i].classList.toggle("is-lit", i < next);
      lit = next;
    };
    // Start from "all lit" bookkeeping, then settle to the real position.
    spans.forEach((span) => span.classList.add("is-lit"));
    update();
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      delete el.dataset.fill;
    };
  }, [tokens]);

  return (
    <section className="av2-section av2-background" aria-labelledby="av2-background-label">
      <h2 id="av2-background-label" className="av2-eyebrow" lang={lang}>{background.label}</h2>
      <div className="av2-background-body">
        <p ref={textRef} className="av2-fill" lang={lang}>
          {tokens.map((token, index) => (
            <span key={index} data-key={token.key || undefined}>{token.text}</span>
          ))}
        </p>
        <p className="av2-background-closing" lang={lang} data-reveal="">{background.closing}</p>
      </div>
    </section>
  );
}
