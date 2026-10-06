"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { AboutPageContent } from "@/data/about-page-v2";

/**
 * Beyond Product Design (cream band). The illustration keeps its natural
 * ratio at half the column width, tilts with a fine pointer, carries the
 * cursor's "放大 / Zoom" label, and opens the lightbox. The tag chain fills
 * up to the hovered tag; idle, only PRODUCT DESIGN is filled.
 */
export function BeyondSection({ content, onZoom }: { content: AboutPageContent; onZoom: (trigger: HTMLElement) => void }) {
  const { beyond, locale } = content;
  const lang = locale === "zh" ? "zh-Hant" : "en";
  const tiltRef = useRef<HTMLButtonElement>(null);
  const [chain, setChain] = useState<number | null>(null);

  useEffect(() => {
    const el = tiltRef.current;
    if (!el) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    let tx = 0;
    let ty = 0;
    let targetX = 0;
    let targetY = 0;
    let raf = 0;
    const frame = () => {
      raf = 0;
      tx += (targetX - tx) * 0.08;
      ty += (targetY - ty) * 0.08;
      el.style.transform = `rotateY(${tx.toFixed(3)}deg) rotateX(${ty.toFixed(3)}deg)`;
      if (Math.abs(targetX - tx) > 0.01 || Math.abs(targetY - ty) > 0.01) raf = requestAnimationFrame(frame);
      else if (!targetX && !targetY) el.style.transform = "";
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
      targetY = -((event.clientY - rect.top) / rect.height - 0.5) * 9;
      wake();
    };
    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      wake();
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = "";
    };
  }, []);

  const last = beyond.chain.length - 1;

  return (
    <section className="av2-beyond" aria-labelledby="av2-beyond-title">
      <div className="av2-beyond-inner">
        <figure className="av2-art">
          <div className="av2-art-stage">
            <button
              ref={tiltRef}
              type="button"
              className="av2-art-button"
              data-cursor="view"
              data-cursor-label={beyond.zoom}
              aria-haspopup="dialog"
              aria-label={`${beyond.image.alt} — ${beyond.enlargeHint}`}
              onClick={(event) => onZoom(event.currentTarget)}
            >
              <Image
                src={beyond.image.src}
                alt={beyond.image.alt}
                width={beyond.image.width}
                height={beyond.image.height}
                sizes="(min-width: 1024px) 320px, 50vw"
                className="av2-art-img"
              />
            </button>
          </div>
          <figcaption className="av2-art-caption">
            <span lang="en">{beyond.caption}</span>
            <span lang={lang} aria-hidden>{beyond.enlargeHint}</span>
          </figcaption>
        </figure>

        <div className="av2-beyond-copy">
          <p className="av2-eyebrow av2-eyebrow-deep" lang={lang} data-reveal="">{beyond.eyebrow}</p>
          <h2 id="av2-beyond-title" className="av2-h2" lang={lang} data-reveal="">{beyond.heading}</h2>
          <p className="av2-beyond-p" lang={lang} data-reveal="">{beyond.paragraph}</p>
          <ol className="av2-chain" lang="en" data-reveal="" onPointerLeave={() => setChain(null)}>
            {beyond.chain.map((label, i) => {
              const lit = chain !== null && i <= chain;
              const state = lit ? (i === last ? "end" : "on") : chain === null && i === last ? "on" : undefined;
              return (
                <li key={label} className="av2-chain-item">
                  <span className="av2-chain-tag" data-state={state} onPointerEnter={() => setChain(i)}>
                    {label}
                  </span>
                  {i < last && (
                    <span className="av2-chain-arrow" data-on={(chain !== null && i < chain) || undefined} aria-hidden>
                      →
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
          <p className="av2-beyond-ai" lang={lang} data-reveal="">{beyond.ai}</p>
        </div>
      </div>
    </section>
  );
}
