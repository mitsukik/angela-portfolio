"use client";

import type { Locale } from "@/data/locale";
import { projects } from "@/data/projects";
import { ProjectVisual } from "@/components/site/ProjectVisual";
import { ProjectDetails } from "./ProjectDetails";
import { useSelectedWorkSequence } from "./useSelectedWorkSequence";
import "./SelectedWork.css";

export function SelectedWork({ locale }: { locale: Locale }) {
  const {
    sequenceRef,
    imageRefs,
    textRefs,
    stepRefs,
    activeProject,
    projectAnnouncement,
    selectProject,
  } = useSelectedWorkSequence(projects);

  return (
    <section
      ref={sequenceRef}
      id="selected-work"
      aria-labelledby="selected-work-heading"
      className="selected-work-sequence relative z-10 border-t border-primary/12 bg-background pb-[80px]"
    >
      <div className="selected-work-sticky relative mx-auto max-w-[1600px] bg-background px-6 py-16 sm:px-8 lg:px-10 lg:py-20">
        {/* AmbientField disabled per Angela's review — see AboutHero.tsx
            for the same note. */}
        <h2 id="selected-work-heading" className="mb-10 text-[12px] font-medium uppercase tracking-[0.22em] text-primary sm:text-[12px]">
          SELECTED WORK
        </h2>

        <p aria-live="polite" aria-atomic="true" className="sr-only">
          {projectAnnouncement}
        </p>

        <div className="border-t border-primary/12 pt-8 lg:pt-10">
          <div className="selected-work-row flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,38fr)_minmax(0,62fr)] lg:items-end lg:gap-10">
            <div className="project-text-slot w-full">
              <ProjectDetails
                project={projects[0]}
                locale={locale}
                hidden
                className="project-text-reference"
              />
              {projects.map((project, index) => {
                const isActive = project.id === activeProject.id;

                return (
                  <ProjectDetails
                    key={project.id}
                    panelRef={(panel) => {
                      textRefs.current[index] = panel;
                    }}
                    project={project}
                    locale={locale}
                    hidden={!isActive}
                    className={`project-text-panel ${
                      isActive
                        ? "project-text-panel-active project-text-transition"
                        : "project-text-panel-inactive"
                    }`}
                  />
                );
              })}
            </div>

            <div className="w-full">
              <div className="media-hover-frame relative flex min-h-[340px] overflow-hidden border border-primary/12 bg-surface sm:min-h-[430px] lg:min-h-[520px]">
                {projects.map((project, index) => {
                  const isActive = project.id === activeProject.id;

                  return (
                    <ProjectVisual
                      key={project.id}
                      ref={(panel) => {
                        imageRefs.current[index] = panel;
                      }}
                      project={project}
                      priority={index === 0}
                      aria-hidden={!isActive}
                      scanOnRowHover
                      sizes="(max-width: 1024px) 100vw, 62vw"
                      className={`project-image-layer absolute inset-0 ${
                        isActive
                          ? "project-image-layer-active"
                          : "project-image-layer-inactive"
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-10 flex items-center justify-center gap-6 pt-6 text-[16px] uppercase tracking-[0.18em] text-primary/40 sm:gap-8 lg:justify-start">
            {projects.map((project, index) => (
              <button
                key={project.id}
                type="button"
                aria-label={`View ${project.title}`}
                aria-pressed={project.id === activeProject.id}
                onClick={() => selectProject(project, index)}
                className={`project-selector -mx-3 inline-flex min-h-11 min-w-11 items-center justify-center ${
                  project.id === activeProject.id ? "text-accent-yellow" : "text-primary/50"
                }`}
              >
                {project.number}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="selected-work-steps" aria-hidden="true">
        {projects.map((project, index) => (
          <div
            key={project.id}
            ref={(step) => {
              stepRefs.current[index] = step;
            }}
            data-project-index={index}
            className="selected-work-step"
          />
        ))}
      </div>
    </section>
  );
}
