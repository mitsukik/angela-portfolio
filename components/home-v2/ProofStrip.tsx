import type { HomeV2Content } from "@/data/home-v2";

/** Cream proof band: four ruled columns, each a headline and a sub-line. */
export function ProofStrip({ content }: { content: HomeV2Content }) {
  const { proof, ui, locale } = content;
  const lang = locale === "zh" ? "zh-Hant" : "en";

  return (
    <section className="hv2-proof" aria-label={ui.proofLabel}>
      <ul className="hv2-proof-grid" lang={lang}>
        {proof.map((cell) => (
          <li key={cell.title} className="hv2-proof-cell" data-reveal="">
            <p className="hv2-proof-title">{cell.title}</p>
            <ul className="hv2-proof-items">
              {cell.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}
