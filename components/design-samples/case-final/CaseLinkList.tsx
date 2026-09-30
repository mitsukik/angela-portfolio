/*
 * Shared case CTA link list — the approved CASE01 Demo CTA grammar: a
 * compact, unbordered list of accent links (.case-link supplies hover
 * underline + focus), each with a short dim note beneath. Cases reuse this
 * instead of styling their own prototype/demo CTA sections.
 */
export type CaseLinkItem = { href: string | null; label: string; note: string };

export function CaseLinkList({ items, className = "", stacked = false }: { items: CaseLinkItem[]; className?: string; stacked?: boolean }) {
  return <ul className={`flex flex-col gap-5 ${stacked ? "" : "sm:flex-row sm:gap-10"} ${className}`}>
    {items.map((item) => <li key={item.label}>
      {item.href
        ? <a href={item.href} target="_blank" rel="noopener noreferrer" className="case-link cf-meta sm:whitespace-nowrap cf-accent">{item.label}</a>
        : <span className="cf-meta sm:whitespace-nowrap cf-accent">{item.label}</span>}
      <p className="cf-dim mt-2 text-[13px] leading-5">{item.note}</p>
    </li>)}
  </ul>;
}
