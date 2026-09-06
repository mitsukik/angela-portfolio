import Link from "next/link";
import { MixedText } from "@/components/site/MixedText";
import type { Locale } from "@/data/locale";
import type { Project } from "@/data/projects";

export function ProjectDetails({
  project,
  locale,
  className,
  hidden = false,
  panelRef,
}: {
  project: Project;
  locale: Locale;
  className: string;
  hidden?: boolean;
  panelRef?: (element: HTMLDivElement | null) => void;
}) {
  const description = locale === "zh" ? project.description : project.descriptionEn;
  return (
    <div
      ref={panelRef}
      aria-hidden={hidden ? true : undefined}
      inert={hidden ? true : undefined}
      className={className}
    >
      <div className="project-text-meta mb-6 flex items-center gap-3 text-[16px] uppercase tracking-[0.18em] text-primary/60">
        <span className="text-accent-yellow">{project.number}</span>
        <span aria-hidden="true" className="text-primary/30">/</span>
        <span className="sr-only">of</span>
        <span>04</span>
      </div>

      <div className="project-text-title-group">
        <h3 className="text-[1.8rem] font-medium leading-[1.1] tracking-[-0.01em] text-primary sm:text-[2.2rem] lg:text-[2.7rem]">
          {project.title}
        </h3>

        <p lang="zh-Hant" className="mt-4 text-[1.1rem] tracking-[0.12em] leading-7 text-primary/75">
          <MixedText text={project.chineseTitle} />
        </p>
      </div>

      <div className="project-text-support">
        <div className="project-text-tags mt-6 flex flex-wrap gap-2 text-[12px] uppercase tracking-[0.12em] text-primary/60">
          {project.tags.map((tag) => (
            <span key={tag} className="border border-primary/20 px-2 py-1">
              {tag}
            </span>
          ))}
        </div>

        <p lang={locale === "zh" ? "zh-Hant" : "en"} className="project-text-description mt-8 max-w-[28rem] text-[16px] leading-7 text-primary/60 sm:text-[16px]">
          {description[0]}
          <br className="hidden sm:block" />
          {description[1]}
        </p>
      </div>

      <Link
        href={`/work/${project.slug}`}
        className="project-text-cta link-cta link-cta-inverse mt-8 gap-2 text-[12px] uppercase tracking-[0.18em] text-accent-yellow"
      >
        <span className="link-cta-label">VIEW CASE STUDY</span>
        <span aria-hidden="true" className="link-cta-marker-right text-[14px]">→</span>
      </Link>
    </div>
  );
}
