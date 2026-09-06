import { aboutContent } from "@/data/about";
import { CONTACT_EMAIL } from "@/data/contact";
import { Reveal } from "./Reveal";

/**
 * ABOUT B — Modular scene sequence.
 *
 * About composed as a sequence of distinct full-height scenes (Identity,
 * Capability, Approach, Skills+Beyond, Contact) — same rhythm-of-scenes
 * idea as Home's project stages, but non-pinned (each scene resolves once
 * on scroll-in, no scrub) and always on the dark register per Angela's
 * standing About decision. The capability list reuses the same "moving
 * surface" hover principle as Home's Closing contact rows for interaction
 * consistency across the site. Uses only real content from data/about.ts.
 */
export function AboutB({ locale }: { locale: "zh" | "en" }) {
  const content = aboutContent[locale];
  const lang = locale === "zh" ? "zh-Hant" : "en";
  const plainStatement = content.headlineLines
    .map((line) => line.map((segment) => segment.text).join(""))
    .join(locale === "zh" ? "" : " ");

  return (
    <main className="scene-dark min-h-screen">
      {/* Scene 1 — Identity */}
      <section className="flex min-h-[100svh] flex-col justify-end border-b scene-rule px-5 pb-20 pt-24 md:px-10 md:pb-24">
        <div className="mx-auto w-full max-w-[1600px]">
          <Reveal className="label-mono scene-dim-text">
            {locale === "zh" ? "產品設計師" : "Product Designer"}
          </Reveal>
          <Reveal delay={0.08}>
            <h1 lang={lang} className="display-xl mt-5 max-w-[16ch]">
              <span aria-hidden="true">
                {content.headlineLines.map((line, i) => (
                  <span key={i} className="block">
                    {line.map((segment, j) =>
                      segment.highlight ? (
                        <span key={j} className="text-acid">
                          {segment.text}
                        </span>
                      ) : (
                        segment.text
                      ),
                    )}
                  </span>
                ))}
              </span>
              <span className="sr-only">{plainStatement}</span>
            </h1>
          </Reveal>
          <Reveal delay={0.16} className="mt-8 max-w-[58ch]">
            <p lang={lang} className="body-tc scene-dim-text">
              {content.introParagraphs[0]}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Scene 2 — Capability index: hover-reveal rows, not cards. */}
      <section className="min-h-[100svh] border-b scene-rule px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1600px]">
          <Reveal>
            <h2 lang={lang} className="label-mono">
              {content.servicesHeading}
            </h2>
          </Reveal>
          <ul className="mt-10 md:mt-16">
            {content.serviceAreas.map((area, i) => (
              <Reveal key={area.title} delay={i * 0.04} as="div">
                <div className="contact-row group relative grid gap-3 overflow-hidden border-t scene-rule px-3 py-8 -mx-3 md:grid-cols-12 md:items-baseline md:gap-10">
                  <span aria-hidden className="contact-row-surface absolute inset-0 -z-10 bg-paper" />
                  <p className="contact-row-text label-mono md:col-span-1">{String(i + 1).padStart(2, "0")}</p>
                  <h3 lang={lang} className="contact-row-text display-l md:col-span-4 text-[clamp(1.5rem,2.6vw,2.2rem)]">
                    {area.title}
                  </h3>
                  <p lang={lang} className="contact-row-text body-tc md:col-span-7 max-w-[52ch]">
                    {area.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Scene 3 — Approach: spatial vertical timeline. */}
      <section className="min-h-[100svh] border-b scene-rule px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1600px]">
          <Reveal>
            <h2 lang={lang} className="label-mono">
              {content.processHeading}
            </h2>
          </Reveal>
          <div className="relative mt-14 md:ml-[20%] md:mt-20">
            <span aria-hidden className="absolute left-[1.9rem] top-2 bottom-2 hidden w-px bg-hairline md:block" />
            <ol className="space-y-12 md:space-y-16">
              {content.processStages.map((stage, i) => (
                <Reveal key={stage.title} delay={i * 0.05} as="div" className="relative md:pl-16">
                  <span aria-hidden className="absolute left-0 top-0 hidden h-[3.8rem] w-[3.8rem] items-center justify-center border scene-rule label-mono md:flex">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="label-mono scene-dim-text md:hidden">{String(i + 1).padStart(2, "0")}</p>
                  <h3 lang={lang} className="display-l mt-2 text-[clamp(1.5rem,2.4vw,2rem)] md:mt-0">
                    {stage.title}
                  </h3>
                  <p lang={lang} className="body-tc mt-3 max-w-[54ch] scene-dim-text">
                    {stage.description}
                  </p>
                </Reveal>
              ))}
            </ol>
          </div>
          <Reveal delay={0.2}>
            <p lang={lang} className="body-tc mt-14 max-w-[56ch] scene-dim-text md:ml-[20%]">
              {content.processClosing}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Scene 4 — Skills + Beyond, one combined quiet scene. */}
      <section className="min-h-[100svh] border-b scene-rule px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-[1600px] gap-14 md:grid-cols-12">
          <div className="md:col-span-6">
            <Reveal>
              <h2 lang={lang} className="label-mono">
                {content.skillsHeading}
              </h2>
              <div className="mt-8 grid gap-8 sm:grid-cols-2">
                {content.skillGroups.map((group) => (
                  <div key={group.label}>
                    <h3 lang={lang} className="label-mono text-lavender">
                      {group.label}
                    </h3>
                    <ul className="body-tc mt-3 space-y-1.5">
                      {group.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <Reveal delay={0.1}>
              <h2 lang={lang} className="label-mono">
                {content.beyondHeading}
              </h2>
              <div className="mt-8 space-y-4">
                {content.beyondParagraphs.map((paragraph, i) => (
                  <p key={i} lang={lang} className="body-tc scene-dim-text">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Scene 5 — Contact, matching Home Closing's exact grammar. */}
      <section id="about-contact" className="flex min-h-[100svh] flex-col justify-between px-5 py-16 md:px-10 md:py-20">
        <p className="label-mono scene-dim-text">{locale === "zh" ? "聯絡" : "Contact"}</p>
        <Reveal>
          <h2 lang={lang} className="display-xl max-w-[18ch]">
            {content.contactHeading}
          </h2>
          <p lang={lang} className="body-tc mt-8 max-w-[48ch] scene-dim-text">
            {content.contactBody}
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="case-link group mt-8 inline-flex items-center gap-3 border-b border-current/50 pb-2 label-mono"
          >
            {content.contactCta.replace(/\s*→\s*$/, "")}
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
        </Reveal>
        <div />
      </section>
    </main>
  );
}
