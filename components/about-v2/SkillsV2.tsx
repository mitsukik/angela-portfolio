import type { V2SkillGroup } from "@/data/about-v2";
import type { Locale } from "@/data/locale";

// Deliberately secondary — a compact technical strip, not a card grid or
// skill-bar chart. No percentages, no icon wall; just the real groups and
// items from VER1, read quickly and left behind.
export function SkillsV2({ locale, heading, skillGroups }: { locale: Locale; heading: string; skillGroups: V2SkillGroup[] }) {
  const lang = locale === "zh" ? "zh-Hant" : "en";
  return (
    <div>
      <p className="type-v3-label cf-section-label text-lavender">{heading}</p>
      <dl className="mt-8">
        {skillGroups.map((group) => (
          <div
            key={group.label}
            className="grid grid-cols-1 gap-2 border-t scene-rule py-4 md:grid-cols-[220px_minmax(0,1fr)] md:items-baseline md:gap-6"
          >
            <dt lang={lang} className="type-v3-label scene-dim-text text-[1rem]">
              {group.label}
            </dt>
            <dd className="type-v3-body scene-text">{group.items.join(" · ")}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
