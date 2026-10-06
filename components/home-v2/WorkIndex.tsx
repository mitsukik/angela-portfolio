"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { HomeV2Content } from "@/data/home-v2";

/**
 * Compact Work Index: one button per case, normal document scroll. Hover
 * dimming/shift is pure CSS (fine pointers only); the floating preview is
 * driven by motion.ts and the cursor label by the global CustomCursor. Every
 * row opens the case drawer, with or without hover.
 */
export function WorkIndex({
  content,
  onOpen,
}: {
  content: HomeV2Content;
  onOpen: (index: number, trigger: HTMLElement) => void;
}) {
  const { work, ui, locale } = content;
  const lang = locale === "zh" ? "zh-Hant" : "en";

  return (
    <section id="selected-work" className="hv2-work" aria-labelledby="hv2-work-title" tabIndex={-1}>
      <div className="hv2-work-head" data-reveal="">
        <h2 id="hv2-work-title" lang={lang} className="hv2-section-title">
          {ui.workHeading}
        </h2>
        <p className="hv2-hint">
          <span className="hv2-hint-hover">{ui.hintHover}</span>
          <span className="hv2-hint-touch">{ui.hintTouch}</span>
        </p>
      </div>

      <ul className="hv2-list" data-hv2-list>
        {work.map((item, index) => (
          <li key={item.id} data-reveal="">
            <button
              type="button"
              className="hv2-row"
              data-hv2-row={index}
              data-cursor="view"
              data-cursor-label={ui.cursorView}
              aria-haspopup="dialog"
              onClick={(event) => onOpen(index, event.currentTarget)}
            >
              <span className="hv2-row-no">{item.number}</span>
              <span className="hv2-row-title" lang={lang}>{item.title}</span>
              <span className="hv2-row-cat" lang={lang}>
                {item.category} · {item.year}
              </span>
              {item.status && (
                <span className="hv2-row-status" lang={lang} data-live={item.live}>
                  <span className="hv2-dot" aria-hidden />
                  {item.status}
                </span>
              )}
              <span className="hv2-row-arrow" aria-hidden>↗</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Floating image stack that follows the pointer over the list (desktop only). */
export function WorkPreview({ content }: { content: HomeV2Content }) {
  const [ready, setReady] = useState(false);

  // Only fetch the four preview images once a fine-pointer visitor is
  // approaching the list — touch devices never load them.
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const section = document.getElementById("selected-work");
    if (!section || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setReady(true);
        observer.disconnect();
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="hv2-preview" data-hv2-preview data-visible="false" aria-hidden>
      <div className="hv2-preview-card">
        {content.work.map((item) => (
          <div key={item.id} className="hv2-preview-layer" data-hv2-layer data-on="false">
            {ready && (
              <Image
                src={item.image.src}
                alt={item.title}
                fill
                unoptimized
                sizes="380px"
                style={{ objectPosition: item.image.crop }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
