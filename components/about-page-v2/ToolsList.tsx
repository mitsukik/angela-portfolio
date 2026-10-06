import type { AboutPageContent } from "@/data/about-page-v2";

/** Skills / Tools — the existing skill groups, one ruled row per group. */
export function ToolsList({ content }: { content: AboutPageContent }) {
  const { tools, locale } = content;
  const lang = locale === "zh" ? "zh-Hant" : "en";

  return (
    <section className="av2-section av2-tools" aria-labelledby="av2-tools-title">
      <div className="av2-section-head" data-reveal="">
        <p className="av2-eyebrow" lang={lang}>{tools.eyebrow}</p>
        <h2 id="av2-tools-title" className="av2-h2" lang={lang}>{tools.heading}</h2>
      </div>
      <ul className="av2-tool-rows">
        {tools.groups.map((group, i) => (
          <li key={group.label} className="av2-tool-row" data-reveal="">
            <div className="av2-tool-head">
              <span className="av2-tool-no" aria-hidden>{String(i + 1).padStart(2, "0")}</span>
              <h3 className="av2-tool-title" lang={/[一-鿿]/.test(group.label) ? "zh-Hant" : "en"}>{group.label}</h3>
              <span className="av2-tool-count">
                <span aria-hidden>{String(group.items.length).padStart(2, "0")}</span>
                <span className="hv2-sr">{locale === "zh" ? `${group.items.length} 項` : `${group.items.length} items`}</span>
              </span>
            </div>
            <ul className="av2-chips" lang="en">
              {group.items.map((item) => (
                <li key={item} className="av2-chip">{item}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}
