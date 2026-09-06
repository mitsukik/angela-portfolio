import { aboutContent } from "@/data/about";
import { CONTACT_EMAIL } from "@/data/contact";
import { Reveal } from "./Reveal";

/**
 * ABOUT A — Statement-led / editorial spatial.
 *
 * One large identity statement opens the page, then content unfolds as a
 * slow, quiet editorial read: service areas and process as plain mono
 * lists rather than a fan of cards, generous negative space, minimal
 * motion (entrance reveals only, no pinning, no scroll-scrub) — deliberately
 * calmer than Home. Uses only real content from data/about.ts.
 */
export function AboutA({ locale }: { locale: "zh" | "en" }) {
  const content = aboutContent[locale];
  const lang = locale === "zh" ? "zh-Hant" : "en";
  const plainStatement = content.headlineLines
    .map((line) => line.map((segment) => segment.text).join(""))
    .join(locale === "zh" ? "" : " ");

  return (
    <main className="scene-dark min-h-screen">
      {/* Opening: one statement, no eyebrow — the page itself is the
          context, so a redundant "About" label above it adds nothing. */}
      <section className="mx-auto flex min-h-[90svh] max-w-[1600px] flex-col justify-center px-5 py-24 md:px-10">
        <Reveal>
          <h1 lang={lang} className="display-xl max-w-[14ch]">
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
        <Reveal delay={0.1} className="mt-12 max-w-[62ch] space-y-6">
          {content.introParagraphs.map((paragraph, i) => (
            <p key={i} lang={lang} className="body-tc scene-dim-text">
              {paragraph}
            </p>
          ))}
        </Reveal>
      </section>

      {/* What I do — a plain mono-led list, not cards. */}
      <section className="border-t scene-rule px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1600px]">
          <Reveal>
            <h2 lang={lang} className="label-mono">
              {content.servicesHeading}
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-x-10 gap-y-12 md:mt-16 md:grid-cols-2">
            {content.serviceAreas.map((area, i) => (
              <Reveal key={area.title} delay={i * 0.05} className="border-t scene-rule pt-6">
                <p className="label-mono scene-dim-text">{String(i + 1).padStart(2, "0")}</p>
                <h3 lang={lang} className="display-l mt-3 text-[clamp(1.5rem,2.4vw,2rem)]">
                  {area.title}
                </h3>
                <p lang={lang} className="body-tc mt-4 max-w-[46ch] scene-dim-text">
                  {area.description}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How I work — vertical numbered flow, reusing real process data. */}
      <section className="border-t scene-rule px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1600px] md:grid md:grid-cols-12 md:gap-10">
          <Reveal className="md:col-span-3">
            <h2 lang={lang} className="label-mono">
              {content.processHeading}
            </h2>
          </Reveal>
          <div className="mt-10 md:col-span-8 md:col-start-5 md:mt-0">
            <ol>
              {content.processStages.map((stage, i) => (
                <Reveal key={stage.title} delay={i * 0.04} as="div" className="grid gap-3 border-t scene-rule py-8 first:border-t-0 first:pt-0 sm:grid-cols-[4rem_minmax(0,1fr)] sm:gap-6">
                  <p className="label-mono scene-dim-text">{String(i + 1).padStart(2, "0")}</p>
                  <div>
                    <h3 lang={lang} className="display-l text-[clamp(1.35rem,2vw,1.75rem)]">
                      {stage.title}
                    </h3>
                    <p lang={lang} className="body-tc mt-3 max-w-[52ch] scene-dim-text">
                      {stage.description}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ol>
            <Reveal delay={0.2}>
              <p lang={lang} className="body-tc mt-8 max-w-[56ch] scene-dim-text">
                {content.processClosing}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Skills — quiet grouped mono columns, no cards. */}
      <section className="border-t scene-rule px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1600px] md:grid md:grid-cols-12 md:gap-10">
          <Reveal className="md:col-span-3">
            <h2 lang={lang} className="label-mono">
              {content.skillsHeading}
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-10 sm:grid-cols-2 md:col-span-8 md:col-start-5 md:mt-0">
            {content.skillGroups.map((group, i) => (
              <Reveal key={group.label} delay={i * 0.04}>
                <h3 lang={lang} className="label-mono text-lavender">
                  {group.label}
                </h3>
                <ul className="body-tc mt-4 space-y-2">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Beyond — one quiet full-width statement. */}
      <section className="border-t scene-rule px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1600px]">
          <Reveal>
            <h2 lang={lang} className="label-mono">
              {content.beyondHeading}
            </h2>
            <div className="mt-8 max-w-[62ch] space-y-4">
              {content.beyondParagraphs.map((paragraph, i) => (
                <p key={i} lang={lang} className="body-tc scene-dim-text">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Contact handoff */}
      <section id="about-contact" className="border-t scene-rule px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1600px]">
          <Reveal>
            <h2 lang={lang} className="display-l max-w-[20ch]">
              {content.contactHeading}
            </h2>
            <p lang={lang} className="body-tc mt-6 max-w-[52ch] scene-dim-text">
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
        </div>
      </section>
    </main>
  );
}
