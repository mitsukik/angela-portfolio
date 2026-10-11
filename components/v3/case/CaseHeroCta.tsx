"use client";

import { getLenisInstance } from "@/components/site/lenisInstance";

/*
 * The CASE03 hero CTA row as one shared component for every CASE (.cv3-cta /
 * .cv3-cta-row / .cv3-cta-note). An item is either an original external link
 * (prototype, live site — opens a new tab, ↗) or an in-page jump to one of
 * the case's own chapters (same page, ↓, smooth scroll via Lenis). The first
 * item is the primary lime CTA; the rest use the secondary outline variant.
 */
export type CaseHeroCtaItem = { label: string; note?: string } & ({ href: string; sec?: never } | { sec: string; href?: never });

function jump(sec: string) {
  const el = document.querySelector<HTMLElement>(`[data-sec="${sec}"]`);
  if (!el) return;
  const hdr = window.matchMedia("(max-width: 1023px)").matches ? 52 : 72;
  const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY - hdr + 1);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lenis = getLenisInstance();
  if (lenis) lenis.scrollTo(top, { duration: reduce ? 0 : 1.1, immediate: reduce, force: true });
  else window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  el.focus({ preventScroll: true });
}

export function CaseHeroCta({ items, allSecondary = false, note, compact = false }: { items: CaseHeroCtaItem[]; allSecondary?: boolean; /** Support text for the whole row (13px · .55 · max 520). */ note?: string; /** Compact secondary link (CASE02 story 前往網站 ↗): no glyph disc. */ compact?: boolean }) {
  if (!items.length) return null;
  const row = (
    <ul className="cv3-cta-row cv3-cta-list">
      {items.map((item, i) => {
        const variant = i === 0 && !allSecondary ? undefined : "secondary";
        const label = item.label.replace(/\s*[↗→↓]$/, "");
        return (
          <li key={item.href ?? item.sec}>
            {item.href ? (
              <a href={item.href} target="_blank" rel="noopener noreferrer" className="cv3-cta" data-variant={variant} data-size={compact ? "compact" : undefined}>
                {label}
                <span aria-hidden="true" className="cv3-cta-arrow">↗</span>
              </a>
            ) : (
              <a
                href={`#${item.sec}`}
                data-no-transition="1"
                className="cv3-cta"
                data-variant={variant}
                onClick={(e) => {
                  e.preventDefault();
                  jump(item.sec!);
                }}
              >
                {label}
                <span aria-hidden="true" className="cv3-cta-arrow">↓</span>
              </a>
            )}
            {item.note ? <p className="cv3-cta-note">{item.note}</p> : null}
          </li>
        );
      })}
    </ul>
  );
  return note ? (
    <div className="cv3-cta-block">
      {row}
      <p className="cv3-cta-note">{note}</p>
    </div>
  ) : row;
}
