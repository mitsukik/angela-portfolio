import { aboutContent } from "@/data/about";
import { CONTACT_EMAIL } from "@/data/contact";
import { AboutHero } from "./AboutHero";
import { CapabilityCards } from "./CapabilityCards";
import type { Locale } from "@/data/locale";

export function AboutSections({ locale }: { locale: Locale }) {
  const content = aboutContent[locale];
  const lang = locale === "zh" ? "zh-Hant" : "en";

  // Chinese body copy reads small at the English-tuned 15px; bumped to 18px
  // for Chinese only, keeping leading-7 (matches the existing .type-body-zh
  // line-height convention in globals.css). English sizes are unchanged.
  const introTextClassName =
    locale === "zh"
      ? "text-[18px] leading-8 text-primary/68"
      : "text-[17px] leading-8 text-primary/68 sm:text-[18px]";
  const bodyCopyClassName =
    locale === "zh" ? "text-[18px] leading-7 text-primary/58" : "text-[15px] leading-7 text-primary/58";

  // Chinese section/category labels: 18px with an explicit 0.2rem
  // letter-spacing (intentional, approved treatment — not .type-meta-zh's
  // "normal" tracking, and .type-meta-zh itself is left untouched). Scoped
  // to these specific labels only, via Tailwind's arbitrary tracking value
  // rather than a new/modified global class.
  const sectionHeadingClassName =
    locale === "zh"
      ? "text-[18px] font-medium tracking-[0.2rem] text-accent-yellow"
      : "text-[12px] font-medium uppercase tracking-[0.22em] text-accent-yellow";
  const skillGroupLabelClassName =
    locale === "zh"
      ? "text-[18px] tracking-[0.2rem] text-accent-lavender"
      : "text-[12px] uppercase tracking-[0.18em] text-accent-lavender";

  return (
    <>
      <AboutHero
        locale={locale}
        headlineLines={content.headlineLines}
        introParagraphs={content.introParagraphs}
        introClassName={introTextClassName}
      />

      {/* relative + z-10 + solid background: this is what makes What I Do
          (and everything after it) visually rise and cover the sticky Hero
          above as the user scrolls, rather than the two blending together. */}
      <div className="relative z-10 mx-auto max-w-[1600px] bg-background px-6 sm:px-8 lg:px-10">
        <section aria-labelledby="services-heading" className="border-t border-primary/12 py-16 sm:py-20 lg:py-24">
          <h2 lang={lang} id="services-heading" className={sectionHeadingClassName}>
            {content.servicesHeading}
          </h2>
          <div className="mt-10 lg:mt-14">
            <CapabilityCards
              serviceAreas={content.serviceAreas}
              lang={lang}
              bodyClassName={bodyCopyClassName}
            />
          </div>
        </section>

        <section aria-labelledby="process-heading" className="border-t border-primary/12 py-16 sm:py-20 lg:py-24">
          <h2 lang={lang} id="process-heading" className={sectionHeadingClassName}>
            {content.processHeading}
          </h2>
          <ol className="mt-10 lg:ml-[38%] lg:mt-14">
            {content.processStages.map((stage, index) => (
              <li key={stage.title} className="grid gap-3 border-t border-primary/12 py-7 first:border-t-0 first:pt-0 sm:grid-cols-[4rem_minmax(0,0.7fr)_minmax(0,1fr)] sm:items-baseline sm:gap-6">
                <div className="flex items-baseline gap-4 sm:contents">
                  <span className="type-step-number text-accent-lavender">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 lang={lang} className="type-step-title">
                    {stage.title}
                  </h3>
                </div>
                <p lang={lang} className="type-step-body max-w-[30rem] text-primary/58">
                  {stage.description}
                </p>
              </li>
            ))}
          </ol>
          <p lang={lang} className="type-step-body mt-8 max-w-[36rem] text-primary/58 lg:ml-[38%]">
            {content.processClosing}
          </p>
        </section>

        <section aria-labelledby="skills-heading" className="border-t border-primary/12 py-16 sm:py-20 lg:grid lg:grid-cols-[minmax(0,38fr)_minmax(0,62fr)] lg:gap-10 lg:py-24">
          <h2 lang={lang} id="skills-heading" className={sectionHeadingClassName}>
            {content.skillsHeading}
          </h2>
          <div className="mt-10 grid gap-12 sm:grid-cols-2 lg:mt-0">
            {content.skillGroups.map((group) => (
              <div key={group.label}>
                <h3 lang={lang} className={skillGroupLabelClassName}>{group.label}</h3>
                <ul className="mt-6 space-y-3 text-[1.35rem] tracking-[-0.01em] text-primary/78">
                  {group.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="beyond-heading" className="border-t border-primary/12 py-16 sm:py-20 lg:py-24">
          <h2 lang={lang} id="beyond-heading" className={sectionHeadingClassName}>
            {content.beyondHeading}
          </h2>
          <div className="mt-10 max-w-[36rem] lg:ml-[38%] lg:mt-14">
            {content.beyondParagraphs.map((paragraph, index) => (
              <p
                key={index}
                lang={lang}
                className={`${bodyCopyClassName} ${index > 0 ? "mt-4" : ""}`}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        <section aria-labelledby="contact-heading" className="border-t border-primary/12 py-16 sm:py-20 lg:py-24">
          <h2 lang={lang} id="contact-heading" className={sectionHeadingClassName}>
            {content.contactHeading}
          </h2>
          <div className="mt-10 max-w-[36rem] lg:ml-[38%] lg:mt-14">
            <p lang={lang} className={bodyCopyClassName}>
              {content.contactBody}
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="link-cta link-cta-inverse mt-6 min-h-11 gap-2 text-[12px] uppercase tracking-[0.18em] text-accent-yellow"
            >
              <span className="link-cta-label">{content.contactCta.replace(/\s*→\s*$/, "")}</span>
              <span aria-hidden="true" className="link-cta-marker-right">→</span>
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
