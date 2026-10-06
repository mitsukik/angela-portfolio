"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { AboutPageContent } from "@/data/about-page-v2";
import { getLenisInstance } from "@/components/site/lenisInstance";

/**
 * Illustration lightbox — a modal dialog: page behind is inert, focus
 * stays on the close control, Esc / click anywhere closes, scroll is
 * locked, focus returns to the illustration.
 */
export function Lightbox({
  content,
  open,
  onClose,
  pageRef,
  triggerRef,
}: {
  content: AboutPageContent;
  open: boolean;
  onClose: () => void;
  pageRef: React.RefObject<HTMLDivElement | null>;
  triggerRef: React.RefObject<HTMLElement | null>;
}) {
  const { beyond } = content;
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const page = pageRef.current;
    const trigger = triggerRef.current;
    if (page) page.inert = true;
    document.documentElement.classList.add("hv2-drawer-open");
    getLenisInstance()?.stop();
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      } else if (event.key === "Tab") {
        // Single control: keep focus on it.
        event.preventDefault();
        closeRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (page) page.inert = false;
      document.documentElement.classList.remove("hv2-drawer-open");
      getLenisInstance()?.start();
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [open, onClose, pageRef, triggerRef]);

  return (
    <div
      className="av2-lightbox"
      data-open={open}
      role="dialog"
      aria-modal="true"
      aria-label={beyond.image.alt}
      inert={!open}
      onClick={onClose}
    >
      <button ref={closeRef} type="button" className="av2-lightbox-close" lang={content.locale === "zh" ? "zh-Hant" : "en"}>
        <span className="hv2-sr">{beyond.close}</span>
        <span aria-hidden>{beyond.lightboxHint}</span>
      </button>
      {open && (
        <Image
          src={beyond.image.src}
          alt={beyond.image.alt}
          width={beyond.image.width}
          height={beyond.image.height}
          sizes="100vw"
          className="av2-lightbox-img"
        />
      )}
    </div>
  );
}
