"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Locale } from "@/data/locale";
import { getLenisInstance } from "@/components/site/lenisInstance";
import styles from "./CaseEvidenceViewer.module.css";

export type EvidenceAsset = {
  src: string;
  alt: string;
  caption?: string;
};

type ViewerContextValue = {
  open: (asset: EvidenceAsset, trigger: HTMLElement) => void;
  locale: Locale;
};

const ViewerContext = createContext<ViewerContextValue | null>(null);

const FOCUSABLE_SELECTOR = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const COPY = {
  zh: { dialog: "放大檢視", close: "關閉", fit: "符合視窗", actual: "原始尺寸", enlarge: "放大檢視" },
  en: { dialog: "Evidence viewer", close: "Close", fit: "Fit to screen", actual: "Actual size", enlarge: "View larger" },
} as const;

/**
 * Global case-study evidence enlargement (P0.1 — one pattern for every
 * dense screenshot across CASE01–04, grown from CASE02's original viewer).
 *
 * Native <dialog> supplies top-layer stacking, Escape-to-close and inert
 * page content; focus is still restored explicitly to the exact trigger.
 * Two inspection modes: "fit" (whole image inside the viewport) and
 * "actual" (the asset's own pixels, panned with native scroll) — the
 * toggle only appears when the image is genuinely larger than the fitted
 * view, so small assets never show a control that does nothing. The
 * enlarged view always loads the original /public source, never an
 * optimized thumbnail, so nothing is lost in inspection.
 *
 * Motion is inspection-first: a short fade/0.98 scale in, no exit
 * choreography, nothing under reduced motion (see the module CSS).
 */
export function CaseEvidenceViewerProvider({ children, locale = "en" }: { children: ReactNode; locale?: Locale }) {
  const [asset, setAsset] = useState<EvidenceAsset | null>(null);
  const [mode, setMode] = useState<"fit" | "actual">("fit");
  const [canZoom, setCanZoom] = useState(false);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const copy = COPY[locale];

  const open = useCallback((nextAsset: EvidenceAsset, trigger: HTMLElement) => {
    triggerRef.current = trigger;
    setMode("fit");
    setCanZoom(false);
    setAsset(nextAsset);
  }, []);

  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !asset || dialog.open) return;
    dialog.showModal();
    // The page behind must not scroll while inspecting: Lenis owns wheel
    // input on desktop, the root overflow lock covers native scrolling.
    getLenisInstance()?.stop();
    document.documentElement.classList.add("evidence-viewer-open");
  }, [asset]);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => {
      setAsset(null);
      getLenisInstance()?.start();
      document.documentElement.classList.remove("evidence-viewer-open");
      triggerRef.current?.focus({ preventScroll: true });
      triggerRef.current = null;
    };
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, []);

  const measure = useCallback(() => {
    const img = imageRef.current;
    const stage = stageRef.current;
    if (!img || !stage || !img.naturalWidth) return;
    setCanZoom(img.naturalWidth > img.clientWidth + 8 || img.naturalHeight > img.clientHeight + 8);
  }, []);

  // Toggle between fit and actual size. Zooming in from a click keeps the
  // clicked point centred, so the reader lands on the detail they aimed at
  // instead of the image's top-left corner.
  const toggle = (point?: { x: number; y: number }) => {
    const stage = stageRef.current;
    const img = imageRef.current;
    if (!canZoom || !stage || !img) return;
    if (mode === "actual") {
      setMode("fit");
      return;
    }
    const rect = img.getBoundingClientRect();
    const fx = point ? (point.x - rect.left) / rect.width : 0.5;
    const fy = point ? (point.y - rect.top) / rect.height : 0.5;
    setMode("actual");
    requestAnimationFrame(() => {
      stage.scrollLeft = fx * img.naturalWidth - stage.clientWidth / 2;
      stage.scrollTop = fy * img.naturalHeight - stage.clientHeight / 2;
    });
  };

  const handleDialogClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    // Clicks on the backdrop or the empty stage around the image close;
    // clicks on the image itself or the toolbar never do.
    if (event.target === dialogRef.current || event.target === stageRef.current) close();
  };

  // Focus-trap backstop: Chromium's native <dialog> containment can let
  // Tab escape to <body> with very few focusable elements.
  const handleDialogKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== "Tab") return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
      (el) => !el.hasAttribute("disabled"),
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const current = document.activeElement;
    if (event.shiftKey) {
      if (current === first || !dialog.contains(current)) {
        event.preventDefault();
        last.focus();
      }
    } else if (current === last || !dialog.contains(current)) {
      event.preventDefault();
      first.focus();
    }
  };

  const caption = asset?.caption ?? asset?.alt;

  return (
    <ViewerContext.Provider value={{ open, locale }}>
      {children}
      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-label={copy.dialog}
        data-lenis-prevent
        onClick={handleDialogClick}
        onKeyDown={handleDialogKeyDown}
      >
        {asset && (
          <div className={styles.content}>
            <div className={styles.toolbar}>
              <p className={styles.caption}>{caption}</p>
              <div className={styles.actions}>
                {canZoom && (
                  <button type="button" className={styles.control} onClick={() => toggle()} aria-pressed={mode === "actual"}>
                    {copy.actual}
                  </button>
                )}
                <button type="button" className={styles.close} onClick={close} aria-label={copy.close} autoFocus>
                  <span aria-hidden="true">✕</span>
                </button>
              </div>
            </div>
            <div ref={stageRef} className={styles.stage} data-mode={mode}>
              {/* eslint-disable-next-line @next/next/no-img-element -- the
                  enlarged view needs the original /public asset at its real
                  intrinsic size; next/image would serve a resized derivative. */}
              <img
                ref={imageRef}
                src={asset.src}
                alt={asset.alt}
                className={styles.image}
                data-mode={mode}
                data-zoomable={canZoom}
                onLoad={measure}
                onClick={(event) => toggle({ x: event.clientX, y: event.clientY })}
                draggable={false}
              />
            </div>
          </div>
        )}
      </dialog>
    </ViewerContext.Provider>
  );
}

/**
 * Wraps one evidence image as a real, keyboard-activatable trigger. Fills
 * the frame it sits in (absolute inset-0), so there is no layout change
 * versus the plain image. The wrapped image's own alt should be "" — this
 * button's label already carries the accessible name. Outside a viewer
 * provider it degrades to the plain image rather than throwing.
 */
export function EvidenceTrigger({ asset, children }: { asset: EvidenceAsset; children: ReactNode }) {
  const ctx = useContext(ViewerContext);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  if (!ctx) {
    return (
      <span role="img" aria-label={asset.alt} className="absolute inset-0 block">
        {children}
      </span>
    );
  }
  const label = `${COPY[ctx.locale].enlarge} — ${asset.alt}`;

  return (
    <button
      type="button"
      ref={buttonRef}
      className={styles.trigger}
      aria-label={label}
      aria-haspopup="dialog"
      onClick={() => {
        if (buttonRef.current) ctx.open(asset, buttonRef.current);
      }}
    >
      {children}
      <span aria-hidden="true" className={styles.hint}>
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9.5 2.5h4v4M6.5 13.5h-4v-4M13.5 2.5 9 7M2.5 13.5 7 9" />
        </svg>
      </span>
    </button>
  );
}
