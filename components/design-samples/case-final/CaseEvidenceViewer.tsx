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
import styles from "./CaseEvidenceViewer.module.css";

type EvidenceAsset = {
  src: string;
  alt: string;
};

type ViewerContextValue = {
  open: (asset: EvidenceAsset, trigger: HTMLElement) => void;
};

const ViewerContext = createContext<ViewerContextValue | null>(null);

/**
 * CASE02-only evidence enlargement. Native <dialog> supplies top-layer
 * stacking, focus containment, and Escape-to-close for free — no lightbox
 * dependency needed. Focus restoration is still handled explicitly (not
 * left to the browser alone) per the approved plan: the trigger element
 * is captured on open and re-focused in the `close` handler.
 */
const FOCUSABLE_SELECTOR = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function CaseEvidenceViewerProvider({ children }: { children: ReactNode }) {
  const [asset, setAsset] = useState<EvidenceAsset | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const open = useCallback((nextAsset: EvidenceAsset, trigger: HTMLElement) => {
    triggerRef.current = trigger;
    setAsset(nextAsset);
  }, []);

  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  // Mirrors `asset` state onto the imperative dialog API. Covers every
  // open path (trigger click) uniformly; close paths (button, Escape,
  // backdrop) all go through the native `close` event below instead, so
  // there is exactly one place that clears state and restores focus.
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (asset && !dialog.open) {
      dialog.showModal();
    }
  }, [asset]);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => {
      setAsset(null);
      // Explicit focus restoration — do not rely solely on native <dialog>
      // behavior for this; return focus to the exact thumbnail that was
      // clicked, then release the ref.
      triggerRef.current?.focus();
      triggerRef.current = null;
    };
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, []);

  const handleDialogClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    // A click landing on the <dialog> element itself (not a descendant)
    // means the backdrop/empty area was clicked, not the image or close
    // button — the standard native-<dialog> backdrop-click technique.
    if (event.target === dialogRef.current) {
      close();
    }
  };

  // Explicit focus-trap backstop: Chromium's native <dialog> focus
  // containment has a real edge case when the dialog holds only one
  // focusable element (currently just the close button here) — Tab can
  // escape to <body> instead of looping back. Verified in QA. This keeps
  // Tab/Shift+Tab cycling strictly within the dialog regardless of that
  // native quirk, without depending on a focus-trap library.
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

  return (
    <ViewerContext.Provider value={{ open }}>
      {children}
      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-label="Evidence viewer"
        onClick={handleDialogClick}
        onKeyDown={handleDialogKeyDown}
      >
        {asset && (
          <div className={styles.content}>
            <button type="button" className={styles.close} onClick={close} aria-label="Close">
              <span aria-hidden="true">✕</span>
            </button>
            <div className={styles.imageWrap}>
              {/* eslint-disable-next-line @next/next/no-img-element -- plain
                  <img> lets the enlarged view size to the asset's real
                  intrinsic aspect ratio; these sources are already served
                  unoptimized from /public, so nothing is lost by not
                  routing through next/image here. */}
              <img src={asset.src} alt={asset.alt} className={styles.image} />
            </div>
          </div>
        )}
      </dialog>
    </ViewerContext.Provider>
  );
}

function useCaseEvidenceViewer() {
  const ctx = useContext(ViewerContext);
  if (!ctx) {
    throw new Error("useCaseEvidenceViewer must be used within a CaseEvidenceViewerProvider");
  }
  return ctx;
}

/**
 * Wraps one evidence thumbnail as a real, keyboard-activatable trigger.
 * Visual footprint is identical to the frame it fills (absolute inset-0)
 * — no layout change versus the plain image it replaces. The wrapped
 * thumbnail's own alt is expected to be "" (decorative) since this
 * button's aria-label already carries the accessible name, avoiding a
 * redundant double-announcement in screen readers.
 */
export function EvidenceTrigger({ asset, children }: { asset: EvidenceAsset; children: ReactNode }) {
  const { open } = useCaseEvidenceViewer();
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  return (
    <button
      type="button"
      ref={buttonRef}
      className={styles.trigger}
      aria-label={`View larger — ${asset.alt}`}
      onClick={() => {
        if (buttonRef.current) open(asset, buttonRef.current);
      }}
    >
      {children}
    </button>
  );
}
