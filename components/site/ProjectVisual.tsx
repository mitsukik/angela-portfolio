import { forwardRef } from "react";
import type { PointerEvent } from "react";
import Image from "next/image";
import type { Project } from "@/data/projects";

/** Home / Selected Work uses approved real evidence from each frozen case.
 * Multi-project and mobile cases keep their case-opening image hierarchy
 * instead of forcing one screenshot into the same crop as every project. */

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
  /** Uses the approved production visual reserved for Home / Selected Work. */
  useHomeImage?: boolean;
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
      useHomeImage = false,
    },
    ref,
  ) {
    const homeImages = project.homeImages ?? [project.image];

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

        {useHomeImage && project.homeImage ? (
          <Image
            src={project.homeImage}
            alt=""
            fill
            priority={priority}
            unoptimized
            sizes={sizes ?? "(min-width: 768px) 50vw, 100vw"}
            className="media-hover-target object-contain object-center"
          />
        ) : project.homeVisual === "system-cover" ? (
          <div className="media-hover-target absolute inset-0 bg-[#202322]">
            <div className="absolute left-[5%] top-1/2 aspect-[4/3] w-[88%] -translate-y-1/2 overflow-hidden border border-white/20 bg-white shadow-[0_22px_60px_rgb(0_0_0/0.3)]">
              <Image src={project.image} alt="" fill priority={priority} sizes="44vw" className="object-cover object-top" />
            </div>
            <div className="absolute right-[2%] top-[6%] z-[2] aspect-[16/9] w-[42%] overflow-hidden border border-white/35 bg-white shadow-[0_14px_36px_rgb(0_0_0/0.28)]">
              <Image src={project.image} alt="" fill sizes="22vw" className="scale-[2.2] object-cover object-[70%_21%]" />
            </div>
            <div className="absolute bottom-[6%] left-[8%] z-[2] aspect-[2/1] w-[48%] overflow-hidden border border-white/35 bg-white shadow-[0_14px_36px_rgb(0_0_0/0.28)]">
              <Image src={project.image} alt="" fill sizes="25vw" className="scale-[2.15] object-cover object-[48%_48%]" />
            </div>
          </div>
        ) : project.homeVisual === "web-collage" ? (
          <div className="media-hover-target absolute inset-0 bg-[#e7e3dc]">
            <div className="absolute left-[5%] top-[7%] h-[62%] w-[76%] overflow-hidden border border-black/15 bg-white shadow-[0_18px_48px_rgb(0_0_0/0.12)]">
              <Image src={homeImages[0]} alt="" fill priority={priority} sizes="38vw" className="object-cover object-top" />
            </div>
            <div className="absolute right-[4%] top-[27%] z-[1] h-[46%] w-[50%] overflow-hidden border border-black/20 bg-white shadow-[0_18px_48px_rgb(0_0_0/0.16)]">
              <Image src={homeImages[1]} alt="" fill sizes="26vw" className="object-cover object-top" />
            </div>
            <div className="absolute bottom-[5%] left-[15%] z-[2] h-[40%] w-[58%] overflow-hidden border border-black/20 bg-white shadow-[0_18px_48px_rgb(0_0_0/0.2)]">
              <Image src={homeImages[2]} alt="" fill sizes="30vw" className="object-cover object-top" />
            </div>
          </div>
        ) : project.homeVisual === "operations-cover" ? (
          <div className="media-hover-target absolute inset-0 bg-[#172221]">
            <div className="absolute left-[4%] top-1/2 aspect-[16/10] w-[82%] -translate-y-1/2 overflow-hidden border border-white/20 bg-[#8db5b0] shadow-[0_22px_60px_rgb(0_0_0/0.32)]">
              <Image src={homeImages[0]} alt="" fill priority={priority} sizes="40vw" className="object-cover" />
            </div>
            <div className="absolute right-[3%] top-[5%] z-[2] aspect-video w-[40%] overflow-hidden border border-white/25 bg-[#111] shadow-[0_16px_42px_rgb(0_0_0/0.3)]">
              <Image src={homeImages[2]} alt="" fill sizes="21vw" className="object-cover object-top" />
            </div>
            <div className="absolute bottom-[4%] right-[7%] z-[1] aspect-video w-[52%] overflow-hidden border border-white/25 bg-[#8db5b0] shadow-[0_16px_42px_rgb(0_0_0/0.32)]">
              <Image src={homeImages[1]} alt="" fill sizes="27vw" className="object-cover" />
            </div>
          </div>
        ) : project.homeVisual === "phone-triptych" ? (
          <div className="media-hover-target absolute inset-0 flex items-end justify-center gap-[1.5%] bg-[#F2F0EC] px-[5%] py-[4%]">
            <span aria-hidden className="absolute bottom-[8%] left-[8%] right-[8%] h-px bg-black/15" />
            <span aria-hidden className="absolute right-[10%] top-[8%] h-[68%] w-[38%] bg-[#B9A7FF]/35" />
            {homeImages.map((src, index) => (
              <div
                key={src}
                className={`relative aspect-[1236/2803] drop-shadow-[0_18px_28px_rgb(0_0_0/0.2)] ${
                  index === 1 ? "z-[2] w-[40%]" : index === 0 ? "z-[1] w-[27%] translate-y-[6%]" : "z-[1] w-[29%] translate-y-[3%]"
                }`}
              >
                <Image src={src} alt="" fill priority={priority && index === 1} sizes="20vw" className="object-contain" />
              </div>
            ))}
          </div>
        ) : (
          <Image
            src={project.image}
            alt=""
            fill
            priority={priority}
            sizes={sizes ?? "(min-width: 768px) 50vw, 100vw"}
            className="media-hover-target object-cover object-top"
          />
        )}
        {(project.homeVisual === "system-cover" || project.homeVisual === "operations-cover") && (
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/5" />
        )}
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
