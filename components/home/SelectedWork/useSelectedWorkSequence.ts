"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Project } from "@/data/projects";

const DESKTOP_MOTION_QUERY =
  "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

export function useSelectedWorkSequence(projects: Project[]) {
  const [activeProject, setActiveProject] = useState(projects[0]);
  const [projectAnnouncement, setProjectAnnouncement] = useState("");
  const activeProjectRef = useRef<Project>(projects[0]);
  const sequenceRef = useRef<HTMLElement | null>(null);
  // ProjectVisual forwards its ref to its wrapping <div>, not the <img>
  // inside it — GSAP only ever applies transform/opacity/zIndex here, all
  // of which work identically on any element.
  const imageRefs = useRef<Array<HTMLDivElement | null>>([]);
  const textRefs = useRef<Array<HTMLDivElement | null>>([]);
  const stepRefs = useRef<Array<HTMLDivElement | null>>([]);

  const updateActiveProject = useCallback((project: Project) => {
    if (activeProjectRef.current.id === project.id) return;

    activeProjectRef.current = project;
    setActiveProject(project);
  }, []);

  useLayoutEffect(() => {
    const sequence = sequenceRef.current;
    if (!sequence) return;

    gsap.registerPlugin(ScrollTrigger);

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add(DESKTOP_MOTION_QUERY, () => {
        const imageLayers = imageRefs.current.filter(
          (layer): layer is HTMLImageElement => Boolean(layer),
        );
        const steps = stepRefs.current.filter(
          (step): step is HTMLDivElement => Boolean(step),
        );
        const textPanels = textRefs.current.filter(
          (panel): panel is HTMLDivElement => Boolean(panel),
        );

        if (
          imageLayers.length !== projects.length ||
          textPanels.length !== projects.length ||
          steps.length !== projects.length
        ) {
          return;
        }

        const getTextParts = (panel: HTMLDivElement) => ({
          meta: panel.querySelector<HTMLElement>(".project-text-meta"),
          title: panel.querySelector<HTMLElement>(".project-text-title-group"),
          tags: panel.querySelector<HTMLElement>(".project-text-tags"),
          description: panel.querySelector<HTMLElement>(
            ".project-text-description",
          ),
          cta: panel.querySelector<HTMLElement>(".project-text-cta"),
        });
        const textParts = textPanels.map(getTextParts);

        if (
          textParts.some(
            ({ meta, title, tags, description, cta }) =>
              !meta || !title || !tags || !description || !cta,
          )
        ) {
          return;
        }

        gsap.set(imageLayers, {
          yPercent: 100,
          opacity: 0.7,
          scale: 1.01,
          zIndex: 0,
        });
        gsap.set(imageLayers[0], {
          yPercent: 0,
          opacity: 1,
          scale: 1,
          zIndex: 1,
        });

        textPanels.forEach((panel, index) => {
          const parts = textParts[index];
          const isFirst = index === 0;

          gsap.set(panel, {
            opacity: 1,
            visibility: "visible",
            zIndex: isFirst ? 1 : 0,
          });
          gsap.set(parts.meta, {
            opacity: isFirst ? 1 : 0,
            y: isFirst ? 0 : 12,
          });
          gsap.set(parts.title, {
            opacity: isFirst ? 1 : 0,
            y: isFirst ? 0 : 32,
          });
          gsap.set(parts.tags, {
            opacity: isFirst ? 1 : 0,
            y: isFirst ? 0 : 11,
          });
          gsap.set(parts.description, {
            opacity: isFirst ? 1 : 0,
            y: isFirst ? 0 : 14,
          });
          gsap.set(parts.cta, {
            opacity: isFirst ? 1 : 0,
            y: isFirst ? 0 : 10,
          });
        });

        const timeline = gsap.timeline({
          defaults: { duration: 1, ease: "none" },
          paused: true,
        });
        const syncActiveProject = () => {
          const intervalProgress = timeline.progress() * (projects.length - 1);
          const projectIndex = Math.min(
            projects.length - 1,
            Math.floor(intervalProgress + 0.4),
          );
          const project = projects[projectIndex];

          if (project) updateActiveProject(project);
        };

        timeline.eventCallback("onUpdate", syncActiveProject);

        for (let index = 0; index < imageLayers.length - 1; index += 1) {
          const outgoingText = textParts[index];
          const incomingText = textParts[index + 1];

          timeline
            .set(imageLayers[index + 1], { zIndex: index + 2 }, index)
            .to(
              imageLayers[index],
              { yPercent: -100, opacity: 0.7, scale: 1 },
              index,
            )
            .fromTo(
              imageLayers[index + 1],
              { yPercent: 100, opacity: 0.7, scale: 1.01 },
              { yPercent: 0, opacity: 1, scale: 1 },
              index,
            )
            .to(
              outgoingText.meta,
              { y: -12, opacity: 0, duration: 0.14, ease: "power1.inOut" },
              index + 0.34,
            )
            .to(
              outgoingText.title,
              { y: -32, opacity: 0, duration: 0.18, ease: "power1.inOut" },
              index + 0.37,
            )
            .to(
              outgoingText.tags,
              { y: -11, opacity: 0, duration: 0.14, ease: "power1.inOut" },
              index + 0.41,
            )
            .to(
              outgoingText.description,
              { y: -14, opacity: 0, duration: 0.16, ease: "power1.inOut" },
              index + 0.43,
            )
            .to(
              outgoingText.cta,
              { y: -10, opacity: 0, duration: 0.12, ease: "power1.inOut" },
              index + 0.47,
            )
            .set(textPanels[index + 1], { zIndex: index + 2 }, index + 0.43)
            .to(
              incomingText.meta,
              { y: 0, opacity: 1, duration: 0.17, ease: "power1.out" },
              index + 0.43,
            )
            .to(
              incomingText.title,
              { y: 0, opacity: 1, duration: 0.22, ease: "power1.out" },
              index + 0.46,
            )
            .to(
              incomingText.tags,
              { y: 0, opacity: 1, duration: 0.16, ease: "power1.out" },
              index + 0.51,
            )
            .to(
              incomingText.description,
              { y: 0, opacity: 1, duration: 0.16, ease: "power1.out" },
              index + 0.54,
            )
            .to(
              incomingText.cta,
              { y: 0, opacity: 1, duration: 0.11, ease: "power1.out" },
              index + 0.59,
            );
        }

        const scrollTrigger = ScrollTrigger.create({
          id: "selected-work-reel",
          trigger: sequence,
          start: "top top",
          end: () => {
            const firstStep = steps[0];
            const lastStep = steps[steps.length - 1];
            const firstCenter = firstStep.offsetTop + firstStep.offsetHeight / 2;
            const lastCenter = lastStep.offsetTop + lastStep.offsetHeight / 2;

            return `+=${lastCenter - firstCenter}`;
          },
          animation: timeline,
          scrub: 0.55,
          invalidateOnRefresh: true,
        });

        const refreshFrame = window.requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });

        return () => {
          window.cancelAnimationFrame(refreshFrame);
          scrollTrigger.kill();
          timeline.kill();
          gsap.set(imageLayers, {
            clearProps: "transform,opacity,zIndex",
          });
          gsap.set(textPanels, {
            clearProps: "opacity,visibility,zIndex",
          });
          textParts.forEach(({ meta, title, tags, description, cta }) => {
            gsap.set([meta, title, tags, description, cta], {
              clearProps: "transform,opacity",
            });
          });
        };
      });
    }, sequence);

    return () => {
      media.revert();
      context.revert();
    };
  }, [projects, updateActiveProject]);

  const selectProject = useCallback(
    (project: Project, index: number) => {
      setProjectAnnouncement(
        `Project ${project.number}: ${project.title} selected`,
      );

      const desktopMotionQuery = window.matchMedia(DESKTOP_MOTION_QUERY);
      const step = stepRefs.current[index];

      if (!desktopMotionQuery.matches || !step) {
        updateActiveProject(project);
        return;
      }

      const stepBounds = step.getBoundingClientRect();
      const stepCenter =
        window.scrollY + stepBounds.top + stepBounds.height / 2;
      window.scrollTo({
        top: Math.max(0, stepCenter - window.innerHeight / 2),
        behavior: "auto",
      });
    },
    [updateActiveProject],
  );

  return {
    sequenceRef,
    imageRefs,
    textRefs,
    stepRefs,
    activeProject,
    projectAnnouncement,
    selectProject,
  };
}
