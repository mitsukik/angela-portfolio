import type { ReactNode } from "react";
import type { Locale } from "@/data/locale";
import { CaseChannelLabel } from "../CaseChannel";

/*
 * CASE System V3 — the ten shared CASE components (CASE_SYSTEM.md §2), named
 * wrappers over the CASE03 V3 role classes in components/v3/v3.css. They only
 * decide structure, appearance and spacing; every label, heading and body
 * string is passed in verbatim from the case's own source. CaseHeroCTA lives
 * in ../CaseHeroCta.tsx, CaseRemote / CaseBottomNavigation in the shell
 * (../CaseV3Shell.tsx) and CaseContact in ../CaseV3Closing.tsx.
 */

/* ------------------------------------------------------------ 1 CaseHero */
export function CaseHero({
  caseNumber,
  category,
  period,
  label,
  title,
  titleLines,
  lead,
  subline,
  mobileCtaFirst,
  children,
}: {
  caseNumber: string;
  category: string;
  period: string;
  /** "00 — 專案總覽" */
  label: string;
  title: string;
  titleLines?: string[] | null;
  lead: ReactNode;
  /** Small mono line between H1 and lead (CASE02: project names). */
  subline?: ReactNode;
  /** Mobile artboards (CASE01/04): CTA row before the metadata on phones. */
  mobileCtaFirst?: boolean;
  /** Body paragraphs, CaseMetadata and CaseHeroCTA, in that order. */
  children?: ReactNode;
}) {
  return (
    <section data-sec="ov" tabIndex={-1} className="cv3-hero" aria-labelledby="cv3-title" data-cta-first={mobileCtaFirst ? "true" : undefined}>
      <p className="cv3-hero-meta">
        <span className="cv3-ch-chip" lang="en">
          <span aria-hidden="true" className="cv3-ch-chip-dot" />
          CH <CaseChannelLabel fallback={caseNumber} />
        </span>
        <span>{category}</span>
        <span aria-hidden="true" className="cv3-meta-dash" />
        <span lang="en">{period}</span>
        <span aria-hidden="true" className="cv3-meta-dash" />
        <span>{label}</span>
      </p>
      <h1 id="cv3-title" className="cv3-h1">
        {titleLines ? titleLines.map((line) => <span key={line} className="cv3-h1-line">{line}</span>) : title}
      </h1>
      {subline ? <p className="cv3-subline">{subline}</p> : null}
      <p className="cv3-lead">{lead}</p>
      {children}
    </section>
  );
}

/* -------------------------------------------------------- 2 CaseMetadata */
export type MetaRow = { label: string; value: string; accent?: boolean };

const KEY_ORDER: string[][] = [
  ["角色", "Role"],
  ["團隊", "Team"],
  ["平台", "Platform"],
  ["期間", "專案期間", "時程", "週期", "Timeline"],
  ["狀態", "Status"],
];

const rank = (label: string) => {
  const i = KEY_ORDER.findIndex((keys) => keys.includes(label));
  return i === -1 ? KEY_ORDER.length : i;
};

/** Fixed key order (角色 → 團隊 → 平台 → 期間 → 狀態, then case keys); long values span the row. */
export function CaseMetadata({ rows, wide = [], keepOrder = false }: { rows: MetaRow[]; wide?: string[]; /** Story meta keeps its own order (專案 → 角色 → 專注領域). */ keepOrder?: boolean }) {
  const ordered = keepOrder ? rows : rows.map((r, i) => ({ r, i })).sort((a, b) => rank(a.r.label) - rank(b.r.label) || a.i - b.i).map(({ r }) => r);
  // §2 #2 grid: auto-fit minmax(200px,1fr); data-n (short-key count) lets the
  // stylesheet use exactly n columns once all n keys fit on one row.
  const short = ordered.filter((r) => !wide.includes(r.label)).length;
  return (
    <dl className="cv3-info" data-n={short}>
      {ordered.map((row) => (
        <div key={row.label} data-wide={wide.includes(row.label) ? "true" : undefined}>
          <dt>{row.label}</dt>
          <dd data-accent={row.accent ? "true" : undefined}>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ---------------------------------------------------------- CaseSection */
export function CaseSection({ id, children, className = "" }: { id: string; children: ReactNode; className?: string }) {
  return (
    <section data-sec={id} tabIndex={-1} className={`cv3-sec ${className}`.trim()}>
      {children}
    </section>
  );
}

/* --------------------------------------------------- 4 CaseSectionHeader */
export function CaseSectionHeader({ eyebrow, title, paragraphs = [] }: { eyebrow: string; title?: string; paragraphs?: ReactNode[] }) {
  return (
    <>
      <p className="cv3-eyebrow">{eyebrow}</p>
      {title ? <h2 className="cv3-h2">{title}</h2> : null}
      {paragraphs.map((p, i) => (
        <p key={i} className="cv3-p">{p}</p>
      ))}
    </>
  );
}

/* ----------------------------------------------------- 5 CaseContentGrid */
export type GridVariant = "text" | "cards-2" | "cards-3" | "media-2" | "media-3" | "media-4" | "compare" | "matrix";

export function CaseContentGrid({ variant, children, label, as = "div" }: { variant: GridVariant; children: ReactNode; label?: string; as?: "div" | "ol" | "ul" }) {
  const Tag = as;
  return (
    <Tag className={`cv3-grid${as !== "div" ? " cv3-list-reset" : ""}`} data-variant={variant} aria-label={label}>
      {children}
    </Tag>
  );
}

/** A surface card for cards-2 / cards-3 grids. */
export function CaseCard({ kicker, title, children, tone, as = "div" }: { kicker?: ReactNode; title?: ReactNode; children?: ReactNode; tone?: "accent" | "secondary" | "muted"; as?: "div" | "li" }) {
  const Tag = as;
  return (
    <Tag className="cv3-card-s" data-tone={tone}>
      {kicker ? <p className="cv3-card-kicker">{kicker}</p> : null}
      {title ? <h3 className="cv3-card-title">{title}</h3> : null}
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------ 6 CaseMedia */
export function CaseMedia({
  frame = "inline",
  caption,
  ratio,
  children,
  heroFirst,
}: {
  frame?: "hero" | "inline" | "phone" | "plain";
  caption?: ReactNode;
  /** CSS aspect-ratio, e.g. "1600 / 900" — never crops (contents use object-contain). */
  ratio?: string;
  children: ReactNode;
  /** Hero media is the first exhibit after the hero (data-sec-media). */
  heroFirst?: boolean;
}) {
  const body = ratio ? <div className="cv3-ratio" style={{ aspectRatio: ratio }}>{children}</div> : children;
  if (frame === "hero") {
    return (
      <figure data-sec-media={heroFirst ? "1" : undefined} className="cv3-figure cv3-figure-hero">
        <div className="cv3-bezel">
          <div className="cv3-bezel-screen">
            {body}
            <div aria-hidden="true" className="cv3-bezel-sheen" />
          </div>
        </div>
        {caption ? <figcaption className="cv3-caption">{caption}</figcaption> : null}
      </figure>
    );
  }
  return (
    <figure className="cv3-figure" data-frame={frame}>
      <div className={frame === "plain" ? "cv3-media-plain" : frame === "phone" ? "cv3-media cv3-media-phone" : "cv3-media"}>{body}</div>
      {caption ? <figcaption className="cv3-caption">{caption}</figcaption> : null}
    </figure>
  );
}

/* --------------------------------------------------- 7 CaseDecision */
export function CaseDecision({ label, title, children }: { label: ReactNode; title?: ReactNode; children?: ReactNode }) {
  return (
    <article className="cv3-decision">
      <p className="cv3-decision-no">{label}</p>
      {title ? <h3 className="cv3-h3">{title}</h3> : null}
      {children}
    </article>
  );
}

/** State card: number + title + body + lime protection tag. */
export function CaseStateCard({ no, title, body, protects, active }: { no: string; title: string; body: string; protects: string; active?: boolean }) {
  return (
    <div className="cv3-state" data-active={active ? "true" : undefined}>
      <p className="cv3-state-no" lang="en">{no}</p>
      <p className="cv3-state-title">{title}</p>
      <p className="cv3-state-body">{body}</p>
      <p className="cv3-state-tag">{protects}</p>
    </div>
  );
}

/** CASE03 pipeline row (numbered nodes). */
export function CasePipeline({ label, steps, numbered = true, lang = "en" }: { label: string; steps: { title: string; note?: string; n?: string }[]; numbered?: boolean; lang?: string }) {
  return (
    <ol aria-label={label} className="cv3-pipe cv3-list-reset" lang={lang}>
      {steps.map((step, i) => (
        <li key={step.title}>
          <span aria-hidden="true" className="cv3-pipe-mark">
            <span className="cv3-pipe-dot" />
            <span className="cv3-pipe-line" />
          </span>
          {numbered ? <span aria-hidden="true" className="cv3-pipe-n">{step.n ?? String(i + 1).padStart(2, "0")}</span> : null}
          <span className="cv3-pipe-l">{step.title}</span>
          {step.note ? <span className="cv3-pipe-note">{step.note}</span> : null}
        </li>
      ))}
    </ol>
  );
}

/** Flow chips (grey = others, lime = mine, violet = the decision step). */
export function CaseChips({ items, tone, label }: { items: string[]; tone?: "mine" | "decision"; label?: string }) {
  return (
    <ol aria-label={label} className="cv3-chips cv3-list-reset" data-tone={tone} lang="en">
      {items.map((step, i) => (
        <li key={step}>
          {i > 0 ? <span aria-hidden="true" className="cv3-arrow">→</span> : null}
          <span className="cv3-chip">{step}</span>
        </li>
      ))}
    </ol>
  );
}

/* --------------------------------------------------------- 10 CaseClosing */
export function CaseClosingPanel({ label, children }: { label?: ReactNode; children: ReactNode }) {
  return (
    <div className="cv3-note-card">
      {label ? <p className="cv3-note-label">{label}</p> : null}
      {children}
    </div>
  );
}

export function CaseDelivered({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <dl className="cv3-delivered">
      <dt>{label}</dt>
      <dd lang="en">{value}</dd>
    </dl>
  );
}

/** Wraps an ORIGINAL V2 module (FlowTabs, viewers, scrubber…) so its case-final roles map to V3 tokens. */
export function CaseOriginalModule({ locale, children, version }: { locale: Locale; children: ReactNode; version?: string }) {
  return (
    <div className="case-final cv3-original cv3-module" data-theme="v3" data-content-version={version} lang={locale === "zh" ? "zh-Hant" : "en"}>
      {children}
    </div>
  );
}
