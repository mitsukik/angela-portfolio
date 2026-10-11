"use client";
import type { ReactNode } from 'react';
import type { Locale } from '@/data/locale';
import { CaseChannelLabel } from '@/components/v3/case/CaseChannel';
import { CASE05_SOURCE } from './data';
import { legacyCases } from '../legacy-cases';
import { v3Labels } from '../labels';
import { CaseHeroCta } from '@/components/v3/case/CaseHeroCta';
import { CaseMetadata } from '@/components/v3/case/system/CaseSystem';
import { resolveSectionLabel } from '@/components/design-samples/case-final/SectionLabelContext';

const ROW = legacyCases.find((c) => c.number === '05')!;
import type { LegacyCasePage } from './types';
import { Case05HeroBoard, Case05BoardHierarchy, Case05ThreeContexts, Case05StatesSafeguards } from './Case05Visuals';
import { Case05SystemFlow } from './Case05Flow';

export function Case05Article({ locale }: { locale: Locale }) {
  const page = CASE05_SOURCE as unknown as LegacyCasePage;
  const visuals: Record<string, () => ReactNode> = {
  "hero-production-board": () => <Case05HeroBoard locale={locale} />,
  "board-hierarchy": () => <Case05BoardHierarchy locale={locale} />,
  "system-flow": () => <Case05SystemFlow locale={locale} />,
  "three-contexts": () => <Case05ThreeContexts locale={locale} />,
  "states-safeguards": () => <Case05StatesSafeguards locale={locale} />,
  };
  const visual = (id: string) => {
    if (!visuals[id]) throw new Error('Unmapped CASE05 visual slot: ' + id);
    return visuals[id]();
  };
  const heroSlot = page.sections[0].slot;
  return <>
    <section data-sec="ov" tabIndex={-1} className="cv3-hero" aria-labelledby="cv3-title">
      <p className="cv3-hero-meta"><span className="cv3-ch-chip" lang="en"><span aria-hidden="true" className="cv3-ch-chip-dot" />CH <CaseChannelLabel fallback="05" /></span><span>{ROW.category[locale]}</span><span aria-hidden="true" className="cv3-meta-dash" /><span lang="en">{ROW.year}</span><span aria-hidden="true" className="cv3-meta-dash" /><span>{locale === 'zh' ? '00 — 專案總覽' : '00 — Case Overview'}</span></p>
      <h1 id="cv3-title" className="cv3-h1">{locale === 'zh' ? page.zhTitleLines.map(line => <span key={line} className="cv3-h1-line">{line}</span>) : page.title.en}</h1>
      <p className="cv3-lead">{page.headline[locale].map((line, i) => <span key={line}>{i > 0 ? <br /> : null}{line}</span>)}</p>
      <p className="cv3-summary">{page.intro[locale]}</p>
      <CaseMetadata rows={page.metadata[locale].map(row => ({ ...row, accent: /^(狀態|Status)$/.test(row.label) }))} wide={["範疇", "Scope"]} />
      {'client' in page && page.client ? <p className="cv3-p"><span className="cv3-note-label">{page.client.label[locale]}</span> {page.client.text[locale]}</p> : null}
      <CaseHeroCta items={'prototype' in page && page.prototype ? [{ href: page.prototype.href, label: page.prototype.label[locale], note: page.prototype.note?.[locale] }] : [{ sec: 'c3', label: locale === 'zh' ? '查看系統流程' : 'View System Flow' }]} />
    </section>
    {heroSlot ? <div data-sec-media="1" className="cv3-figure cv3-figure-hero">{visual(heroSlot.id)}</div> : null}
    {'disclosure' in page && page.disclosure === null ? null : <p className="cv3-caption">{'disclosure' in page && page.disclosure ? <><span className="cv3-note-label">{page.disclosure.label[locale]}</span> {page.disclosure.text[locale]}</> : locale === 'zh' ? '介面依原始專案規格、畫面與互動證據重新整理，以供作品集展示。' : 'Interface visually reconstructed for portfolio presentation based on the original project specifications, screens, and interaction evidence.'}</p>}
    {page.sections.map((rawSection, index) => {
      const section = rawSection as Section;
      return <section key={index} data-sec={'c' + (index + 1)} tabIndex={-1} className="cv3-sec">
        <p className="cv3-eyebrow">{resolveSectionLabel(section.label[locale], v3Labels("05", locale))}</p>
        <h2 className="cv3-h2">{section.heading[locale]}</h2>
        {section.body[locale].map(p => <p key={p} className="cv3-p">{p}</p>)}
        {section.decisions?.map((decision, i) => <article className="cv3-decision" key={i}>
          <p className="cv3-decision-no">{locale === 'zh' ? '決策' : 'Decision'} {String(i + 1).padStart(2, '0')}</p>
          <h3 className="cv3-h3">{decision.title[locale]}</h3>
          {decision.body[locale].map(p => <p key={p} className="cv3-p">{p}</p>)}
          {decision.rationale ? <dl className="cv3-info">{(['constraint', 'decision', 'value'] as const).map((key, i) => <div key={key}><dt>{locale === 'zh' ? ['限制', '做法', '價值'][i] : ['Constraint', 'Decision', 'Value'][i]}</dt><dd>{decision.rationale![key][locale]}</dd></div>)}</dl> : null}
          <div className="cv3-figure">{visual(decision.slot.id)}</div>
        </article>)}
        {section.points ? <ol className="cv3-groups cv3-list-reset">{section.points[locale].map((item, i) => { const [head, detail, answers] = item.split('｜'); return <li className="cv3-group" key={item}><span className="cv3-decision-no">{String(i + 1).padStart(2, '0')}</span>{answers ? <p className="cv3-note-label">{answers}</p> : null}<h3 className="cv3-h3">{head}</h3>{detail ? <p className="cv3-p">{detail}</p> : null}</li>; })}</ol> : section.slot && index > 0 ? <div className="cv3-figure">{visual(section.slot.id)}</div> : null}
      </section>;
    })}
  </>;
}
type Localized<T> = Record<Locale, T>;
type Decision = { title: Localized<string>; body: Localized<readonly string[]>; slot: { id: string }; rationale?: { constraint: Localized<string>; decision: Localized<string>; value: Localized<string> } };
type Section = { label: Localized<string>; heading: Localized<string>; body: Localized<readonly string[]>; slot?: { id: string }; decisions?: readonly Decision[]; points?: Localized<readonly string[]> };

