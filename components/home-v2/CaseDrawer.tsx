"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { HomeV2Content } from "@/data/home-v2";
import { getLenisInstance } from "@/components/site/lenisInstance";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Case preview drawer — a lightweight look before the full Case Study (it
 * never replaces the case routes). A modal dialog: the page behind is
 * `inert`, Tab is trapped, Esc / overlay / close button dismiss it, body
 * scroll is locked (Lenis stopped), and focus returns to the trigger.
 */
export function CaseDrawer({
  content,
  open,
  index,
  onClose,
  pageRef,
  triggerRef,
}: {
  content: HomeV2Content;
  open: boolean;
  index: number;
  onClose: () => void;
  pageRef: React.RefObject<HTMLDivElement | null>;
  triggerRef: React.RefObject<HTMLElement | null>;
}) {
  const { work, ui, locale } = content;
  const item = work[index];
  const lang = locale === "zh" ? "zh-Hant" : "en";
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const page = pageRef.current;
    const panel = panelRef.current;
    const trigger = triggerRef.current;
    if (page) page.inert = true;
    document.documentElement.classList.add("hv2-drawer-open");
    getLenisInstance()?.stop();
    if (panel) panel.scrollTop = 0;
    closeRef.current?.focus({ preventScroll: true });

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panel) return;
      const nodes = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !panel.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !panel.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      if (page) page.inert = false;
      document.documentElement.classList.remove("hv2-drawer-open");
      getLenisInstance()?.start();
      if (trigger && trigger.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [open, onClose, pageRef, triggerRef]);

  return (
    <>
      <div className="hv2-overlay" data-open={open} aria-hidden onClick={onClose} />
      <div
        ref={panelRef}
        className="hv2-drawer"
        data-open={open}
        data-lenis-prevent
        role="dialog"
        aria-modal="true"
        aria-labelledby="hv2-drawer-title"
        inert={!open}
      >
        <div className="hv2-drawer-bar">
          <span className="hv2-drawer-count" aria-label={`${index + 1} / ${work.length}`}>
            {item.number} / {String(work.length).padStart(2, "0")}
          </span>
          <button
            ref={closeRef}
            type="button"
            className="hv2-drawer-close"
            data-magnetic
            aria-label={ui.drawer.close}
            onClick={onClose}
          >
            <span aria-hidden>×</span>
          </button>
        </div>

        <div className="hv2-drawer-media">
          <Image
            key={item.id}
            src={item.image.src}
            alt={item.title}
            fill
            unoptimized
            sizes="640px"
            style={{ objectPosition: item.image.crop }}
          />
        </div>

        <div className="hv2-drawer-body" lang={lang}>
          <p className="hv2-drawer-kicker">
            {item.category} · {item.year}
          </p>
          <h2 id="hv2-drawer-title" className="hv2-drawer-title">{item.title}</h2>
          <p className="hv2-drawer-desc">{item.description}</p>

          {item.meta.length > 0 && (
            <dl className="hv2-drawer-meta">
              {item.meta.map((entry) => (
                <div key={entry.label}>
                  <dt>{entry.label}</dt>
                  <dd>{entry.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {/* No prefetch: the drawer is always mounted, so a prefetching link would
            pull the default case route (and its CSS) in on every Home load. */}
          <Link href={item.href} prefetch={false} className="hv2-btn hv2-btn-dark" data-magnetic>
            {ui.drawer.read} <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </>
  );
}
