import { aboutV2Content } from "@/data/about-v2";
import type { Locale } from "@/data/locale";
import { OpeningV2 } from "./OpeningV2";
import { WhatIDoV2 } from "./WhatIDoV2";
import { HowIWorkV2 } from "./HowIWorkV2";
import { SkillsV2 } from "./SkillsV2";
import { BeyondV2 } from "./BeyondV2";

// About VER2 — isolated prototype assembler. Six regions per the approved
// concept: Opening, What I Do, How I Work, Skills/Tools, Beyond Product
// Design, and the existing shared Closing (SiteFooter, composed by the
// route itself, not here — VER2 has no About-specific contact section).
export function AboutV2({ locale }: { locale: Locale }) {
  const content = aboutV2Content[locale];

  return (
    <div className="scene-dark">
      <OpeningV2 locale={locale} headlineLines={content.headlineLines} introParagraphs={content.introParagraphs} />

      <section className="site-frame border-t scene-rule py-16 md:py-24 lg:py-32" aria-labelledby="v2-what-i-do">
        <h2 id="v2-what-i-do" className="sr-only">
          {content.whatIDoHeading}
        </h2>
        <WhatIDoV2
          locale={locale}
          heading={content.whatIDoHeading}
          inputsLabel={content.inputsLabel}
          inputs={content.inputs}
          capabilities={content.capabilities}
        />
      </section>

      <section className="border-t scene-rule py-16 md:py-24 lg:motion-safe:py-0" aria-labelledby="v2-how-i-work">
        <div className="site-frame lg:motion-safe:pt-16">
          <h2 id="v2-how-i-work" className="type-v3-label cf-section-label text-lavender">
            {content.howIWorkHeading}
          </h2>
        </div>
        <HowIWorkV2 locale={locale} stages={content.stages} />
      </section>

      <section className="site-frame border-t scene-rule py-16 md:py-24" aria-labelledby="v2-skills">
        <h2 id="v2-skills" className="sr-only">
          {content.skillsHeading}
        </h2>
        <SkillsV2 locale={locale} heading={content.skillsHeading} skillGroups={content.skillGroups} />
      </section>

      <section className="site-frame border-t scene-rule py-16 md:py-24" aria-labelledby="v2-beyond">
        <h2 id="v2-beyond" className="sr-only">
          {content.beyondHeading}
        </h2>
        <BeyondV2
          locale={locale}
          heading={content.beyondHeading}
          paragraphs={content.beyondParagraphs}
          illustrationChain={content.illustrationChain}
        />
      </section>
    </div>
  );
}
