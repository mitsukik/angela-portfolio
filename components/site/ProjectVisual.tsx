import { forwardRef } from "react";
import type { PointerEvent } from "react";
import Image from "next/image";
import type { Project } from "@/data/projects";

/**
 * Temporary, clearly art-directed placeholder imagery for project visuals.
 *
 * Real project screens/photography are not ready yet (see data/projects.ts —
 * three of four projects are still on placeholder case-study copy). Rather
 * than show the same stock photo for every project (the previous state:
 * every project pointed at /work/case-01.jpeg), this tints that one real
 * asset with a distinct duotone per project number, pulled from the exact
 * four-color set already approved on the About page's CapabilityCards
 * (lavender / off-white / acid-yellow / plum) — so the temp state still
 * reads as "this site" rather than generic filler, and every project is
 * visually distinguishable while real content is pending.
 *
 * This never claims to be real UI evidence: no chrome, no fake screens,
 * just a number and a tint. Swapping in a real screenshot later is a
 * one-line change (pass a project whose data no longer needs the tint, or
 * render <Image> directly).
 */

const PROJECT_TONES: Record<string, { tint: string; label: string }> = {
  "01": { tint: "#B9A7FF", label: "lavender" },
  "02": { tint: "#E7F34B", label: "acid yellow" },
  "03": { tint: "#2A2140", label: "plum" },
  "04": { tint: "#F2F0EC", label: "off-white" },
};

function getTone(project: Project) {
  return PROJECT_TONES[project.id] ?? PROJECT_TONES["01"];
}

type ProjectVisualProps = {
  project: Project;
  priority?: boolean;
  className?: string;
  sizes?: string;
  showTempTag?: boolean;
  "aria-hidden"?: boolean;
  /** Adds a one-time scan-line sweep + number emphasis, triggered by an
   * ancestor ".selected-work-row" hover/focus-within — an intentional
   * discovery event, not a looping effect (see globals.css). */
  scanOnRowHover?: boolean;
  /** Depth zoom + restrained perspective warp that follows pointer
   * position — mouse/trackpad only (gated by (hover: hover) and
   * (pointer: fine) in CSS); touch gets a simple press-scale instead of
   * a faked hover. A distinct, more premium/spatial treatment than the
   * scan sweep, reserved for a section's single hero-weight image. */
  depthOnHover?: boolean;
};

export const ProjectVisual = forwardRef<HTMLDivElement, ProjectVisualProps>(
  function ProjectVisual(
    {
      project,
      priority = false,
      className = "",
      sizes,
      showTempTag = false,
      "aria-hidden": ariaHidden,
      scanOnRowHover = false,
      depthOnHover = false,
    },
    ref,
  ) {
    const tone = getTone(project);

    const handlePointerMove = depthOnHover
      ? (event: PointerEvent<HTMLDivElement>) => {
          const rect = event.currentTarget.getBoundingClientRect();
          const px = (event.clientX - rect.left) / rect.width - 0.5;
          const py = (event.clientY - rect.top) / rect.height - 0.5;
          event.currentTarget.style.setProperty("--depth-ry", `${(px * 8).toFixed(2)}deg`);
          event.currentTarget.style.setProperty("--depth-rx", `${(-py * 8).toFixed(2)}deg`);
        }
      : undefined;

    const handlePointerLeave = depthOnHover
      ? (event: PointerEvent<HTMLDivElement>) => {
          event.currentTarget.style.removeProperty("--depth-rx");
          event.currentTarget.style.removeProperty("--depth-ry");
        }
      : undefined;

    return (
      // No position utility is hardcoded here — every call site passes
      // "absolute inset-0" and relies on its own parent for the positioned
      // ancestor. That div itself still becomes a valid containing block
      // for the <Image fill> below (any non-static position establishes
      // one), so this stays correct however the caller positions it.
      <div
        ref={ref}
        aria-hidden={ariaHidden}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className={`overflow-hidden bg-surface ${depthOnHover ? "depth-hover" : ""} ${className}`}
      >

        <Image
          src={project.image}
          alt=""
          fill
          priority={priority}
          sizes={sizes ?? "100vw"}
          className="media-hover-target object-cover grayscale contrast-125 brightness-[0.55]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 mix-blend-color"
          style={{ backgroundColor: tone.tint }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10"
        />
        {scanOnRowHover && <span aria-hidden="true" className="scan-line" />}
        <span
          aria-hidden="true"
          className="project-visual-number absolute bottom-4 right-5 text-[13px] uppercase tracking-[0.2em] text-primary/70 sm:bottom-6 sm:right-7 sm:text-[15px]"
        >
          {project.number}
        </span>
        {showTempTag && (
          <span className="case-temp-tag">Temp visual — final UI pending</span>
        )}
      </div>
    );
  },
);
