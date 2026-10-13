"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { CaseChannelContext } from "./CaseChannel";
import type { Locale } from "@/data/locale";
import type { Project } from "@/data/projects";
import { SkipLink } from "@/components/site/SkipLink";
import { getLenisInstance } from "@/components/site/lenisInstance";
import { v3Title } from "@/data/v3/titles";
import { finishLanguageFade } from "@/components/home-v2/languageFade";
import { CaseEvidenceViewerProvider } from "@/components/design-samples/case-final/CaseEvidenceViewer";
import { CaseTransitionLink } from "@/components/design-samples/case-final/CaseTransitionLink";
import { NemuHead, type NemuExpression } from "../nemu/NemuHead";
import { attachNemuMotion } from "../nemu/nemuMotion";
import { Typer } from "../nemu/Typer";
import { V3Header } from "../V3Header";
import { CaseV3Closing } from "./CaseV3Closing";
import { CASE_V3_UI, DESKTOP_QUERY, MOBILE_QUERY, READING_PREF_KEY, SHORT_DESKTOP_QUERY } from "./caseV3Ui";

/*
 * Portfolio V3 CASE frame — rebuilt from the approved CaseV3Screen design.
 * Shared by every V3 case: the chapter registry, Nemu lines and case
 * content come from the case itself, so chapter count/order is never
 * forced into CASE03's shape.
 *
 * Production adaptations of the prototype runtime:
 * - scrolling is the WINDOW (Lenis on fine-pointer desktop), not an inner
 *   scroller; section tracking, jumps and the reading-mode anchor use
 *   document coordinates;
 * - layout modes come from CSS media queries (mirrored here for behavior):
 *   desktop ≥1200×700 = Remote / Reading Mode; 1024–1199 = compact
 *   Floating Head; <1024 (Tablet P / phones) = the prototype's tablet /
 *   mobile layout with Floating Head;
 * - a short desktop viewport (≥1200 wide, <700 tall) starts collapsed
 *   (Nemu head + Expand, like Reading Mode) and Expand opens a height-fitted
 *   Remote; that toggle is per-session and never writes the saved preference
 *   instead of a clipped Remote, and — like the <1200 switch — never
 *   overwrites the saved Reading Mode preference.
 */

export type CaseV3Chapter = { id: string; no: string; label: string; line: string };

type Mode = "desktop" | "short" | "compact" | "mobile";
type Anim = null | "collapse" | "headIn" | "expand" | "remIn";

const pad2 = (n: number) => String(n).padStart(2, "0");

function useMode(): Mode | null {
  const [mode, setMode] = useState<Mode | null>(null);
  useEffect(() => {
    const desk = window.matchMedia(DESKTOP_QUERY);
    const short = window.matchMedia(SHORT_DESKTOP_QUERY);
    const mob = window.matchMedia(MOBILE_QUERY);
    const update = () => setMode(desk.matches ? "desktop" : short.matches ? "short" : mob.matches ? "mobile" : "compact");
    update();
    [desk, short, mob].forEach((q) => q.addEventListener("change", update));
    return () => [desk, short, mob].forEach((q) => q.removeEventListener("change", update));
  }, []);
  return mode;
}

function useReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(q.matches);
    update();
    q.addEventListener("change", update);
    return () => q.removeEventListener("change", update);
  }, []);
  return reduce;
}

type OptAction = { type: "sec"; id: string; autoClose: boolean } | { type: "menu"; menu: "main" | "toc" } | { type: "top" };
type Opt = { key: string; label: string; glyph: string; primary?: boolean; current?: boolean; size?: "sec"; href?: string; external?: boolean; action?: OptAction };

/** One Remote / Conversation Card option: link (route or external) or button. */
function OptItem({ o, onPress, onAction }: { o: Opt; onPress: () => void; onAction: (a: OptAction) => void }) {
  const inner = (
    <>
      <span aria-hidden="true" className="cv3-opt-dot" />
      <span>{o.label}</span>
      <span aria-hidden="true" className="cv3-opt-glyph">{o.glyph}</span>
    </>
  );
  const common = { className: "cv3-opt", "data-primary": o.primary ? "true" : undefined, "data-size": o.size };
  return (
    <li>
      {o.href ? (
        o.external ? (
          <a {...common} href={o.href} target="_blank" rel="noopener noreferrer" onClick={onPress}>{inner}</a>
        ) : (
          <Link {...common} href={o.href} onClick={onPress}>{inner}</Link>
        )
      ) : (
        <button {...common} type="button" aria-current={o.current ? "true" : undefined} onClick={() => o.action && onAction(o.action)}>
          {inner}
        </button>
      )}
    </li>
  );
}

/** Mirror the Reading Mode preference on <html> — the attribute CSS reads. */
function markReading(v: boolean) {
  if (v) document.documentElement.setAttribute("data-case-reading", "1");
  else document.documentElement.removeAttribute("data-case-reading");
}

const docTop = (el: Element) => el.getBoundingClientRect().top + window.scrollY;

export function CaseV3Shell({
  locale,
  caseNumber,
  channelNo,
  previousChannelNo,
  nextChannelNo,
  switchHref,
  chapters: caseChapters,
  moreLine,
  askLine,
  prototypeHref,
  prototypeLabel,
  project,
  previousProject,
  nextProject,
  publishedCount,
  nextDescriptionOverride,
  children,
}: {
  locale: Locale;
  caseNumber: string;
  /** Visible channel slot of this case / of the Next case (data/v3/order.ts); CASE numbers stay permanent IDs. */
  channelNo: string;
  previousChannelNo: string;
  nextChannelNo: string;
  switchHref: string;
  /** Ordered chapter registry; index 0 is the overview. Built from the case's own content. */
  chapters: CaseV3Chapter[];
  moreLine: string;
  /** Chapter-directory prompt (CASE System §6); defaults to the CASE03 line. */
  askLine?: string;
  prototypeHref?: string;
  /** Remote's third option = the case's primary hero CTA label (CASE System §5). */
  prototypeLabel?: string;
  project: Project;
  previousProject: Project;
  nextProject: Project;
  /** Visible channel count — published cases only. */
  publishedCount: number;
  /** Case-specific approved Next Case blurb (production override, e.g. CASE01 EN). */
  nextDescriptionOverride?: string;
  children: ReactNode;
}) {
  const ui = CASE_V3_UI[locale];
  const zh = locale === "zh";
  // Copy names the case by its channel ("This is CH03"): show the visible slot, not the CASE number.
  const chapters = useMemo(
    () => caseChapters.map((c) => ({ ...c, line: c.line.replace(new RegExp(`CH${caseNumber}(?!\\d)`, "g"), `CH${channelNo}`) })),
    [caseChapters, caseNumber, channelNo],
  );
  const prefix = zh ? "" : "/en";
  const allChannelsHref = `${prefix || "/"}#selected-work`;
  const caseHref = (p: Project) => `${prefix}/design-samples/case-final-${p.number}`;

  const mode = useMode();
  const reduce = useReducedMotion();
  const desktop = mode === "desktop";
  const short = mode === "short";
  const cardMode = mode === "compact" || mode === "mobile";

  const [reading, setReadingState] = useState(false);
  // Short desktop only: Remote expanded for this visit (not persisted).
  const [shortOpen, setShortOpen] = useState(false);
  // false for the server render and the hydration pass: the Remote, Dock and
  // Floating Head are then all in the DOM and CSS (html[data-case-reading] +
  // the layout media queries) shows the right one at first paint.
  const [mounted, setMounted] = useState(false);
  const [anim, setAnim] = useState<Anim>(null);
  const [articleSwitch, setArticleSwitch] = useState<"" | "reading" | "remote">("");
  const [sec, setSec] = useState(chapters[0].id);
  const [menu, setMenu] = useState<"main" | "toc">("main");
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [happy, setHappy] = useState(false);
  const [blink, setBlink] = useState(false);
  const [sleep, setSleep] = useState(false);
  const [sw, setSw] = useState(false);
  const [led, setLed] = useState(false);
  const [bump, setBump] = useState(false);
  const [headHover, setHeadHover] = useState(false);
  const [bubbleHover, setBubbleHover] = useState(false);

  const progressRef = useRef<HTMLDivElement>(null);
  const remoteScrollRef = useRef<HTMLDivElement>(null);
  const [optsScroll, setOptsScroll] = useState(false);
  const [optsOverflow, setOptsOverflow] = useState(false);
  const articleRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const timers = useRef<Record<string, number>>({});
  const progScroll = useRef(false);
  const suppress = useRef(false);
  const pendingAnchor = useRef<{ el: Element; off: number } | null>(null);
  const sleepRef = useRef(false);
  useEffect(() => {
    sleepRef.current = sleep;
  }, [sleep]);

  const later = useCallback((key: string, ms: number, fn: () => void) => {
    window.clearTimeout(timers.current[key]);
    timers.current[key] = window.setTimeout(fn, ms);
  }, []);

  useEffect(() => {
    const t = timers.current;
    return () => Object.values(t).forEach((id) => window.clearTimeout(id));
  }, []);

  const hdr = () => (window.matchMedia(MOBILE_QUERY).matches ? 52 : 72);

  /* -------------------------------------------------- Nemu liveliness */
  const wake = useCallback(() => {
    if (sleepRef.current) setSleep(false);
    later("sleep", 30000, () => setSleep(true));
  }, [later]);

  const press = useCallback(() => {
    wake();
    setLed(true);
    setBump(true);
    later("bump", 90, () => setBump(false));
    later("led", 160, () => setLed(false));
  }, [later, wake]);

  // Nemu V1 reactions (same vocabulary as INDEX / ABOUT): a blink when a menu
  // opens, a short smile when an action lands. Never delays the action itself.
  const reactBlink = useCallback(() => {
    setBlink(true);
    later("rblink", 170, () => setBlink(false));
  }, [later]);
  const reactHappy = useCallback(
    (ms = 1200) => {
      setHappy(true);
      later("happy", ms, () => setHappy(false));
    },
    [later],
  );

  useEffect(() => attachNemuMotion(), []);

  useEffect(() => {
    let stop = false;
    let blinkT = 0;
    const loop = () => {
      blinkT = window.setTimeout(() => {
        if (stop) return;
        if (!sleepRef.current) {
          setBlink(true);
          window.setTimeout(() => setBlink(false), 170);
        }
        loop();
      }, 3000 + Math.random() * 3000);
    };
    loop();
    let last = 0;
    const onAct = () => {
      const n = Date.now();
      if (sleepRef.current || n - last > 1000) {
        last = n;
        wake();
      }
    };
    wake();
    window.addEventListener("pointermove", onAct, { passive: true });
    window.addEventListener("wheel", onAct, { passive: true });
    window.addEventListener("keydown", onAct);
    window.addEventListener("touchstart", onAct, { passive: true });
    return () => {
      stop = true;
      window.clearTimeout(blinkT);
      window.removeEventListener("pointermove", onAct);
      window.removeEventListener("wheel", onAct);
      window.removeEventListener("keydown", onAct);
      window.removeEventListener("touchstart", onAct);
    };
  }, [wake]);

  /* -------------------------------------------------- language fade-in + <html lang>
     Same as V2 Home/About: the root layout's guard only runs on first load,
     so client-side 中/EN switches set the document language here. */
  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-Hant" : "en";
    finishLanguageFade();
  }, [locale]);

  /* -------------------------------------------------- reading preference
     The root layout's inline <head> guard already marked <html> before first
     paint; this syncs React state to it (and re-marks <html> after a client
     navigation), before paint, so nothing visible changes. */
  useLayoutEffect(() => {
    let saved = false;
    try {
      saved = window.localStorage.getItem(READING_PREF_KEY) === "1";
    } catch {}
    markReading(saved);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration of a persisted preference
    setReadingState(saved);
    setMounted(true);
  }, []);

  const captureAnchor = useCallback(() => {
    const art = articleRef.current;
    if (!art) return;
    const line = window.scrollY + hdr();
    const el = Array.from(art.querySelectorAll("h1,h2,h3,p,figure,ol,dl")).find((x) => docTop(x) + (x as HTMLElement).offsetHeight > line);
    pendingAnchor.current = el ? { el, off: docTop(el) - window.scrollY } : null;
  }, []);

  const setReading = useCallback(
    (v: boolean) => {
      captureAnchor();
      try {
        window.localStorage.setItem(READING_PREF_KEY, v ? "1" : "0");
      } catch {}
      markReading(v);
      press();
      reactHappy(900);
      setReadingState(v);
      if (!reduce) {
        setArticleSwitch(v ? "reading" : "remote");
        later("artSwitch", 460, () => setArticleSwitch(""));
      }
    },
    [captureAnchor, later, press, reactHappy, reduce],
  );

  // Short desktop: collapse/expand without touching the saved preference.
  const setShortCollapsed = useCallback(
    (collapsed: boolean) => {
      captureAnchor();
      press();
      reactHappy(900);
      setShortOpen(!collapsed);
      if (!reduce) {
        setArticleSwitch(collapsed ? "reading" : "remote");
        later("artSwitch", 460, () => setArticleSwitch(""));
      }
    },
    [captureAnchor, later, press, reactHappy, reduce],
  );

  // Keep the reader's place when the column width changes.
  useLayoutEffect(() => {
    const p = pendingAnchor.current;
    if (!p) return;
    pendingAnchor.current = null;
    if (!p.el.isConnected) return;
    const target = docTop(p.el) - p.off;
    const lenis = getLenisInstance();
    if (lenis) lenis.scrollTo(target, { immediate: true, force: true });
    else window.scrollTo({ top: target, behavior: "auto" });
  }, [reading, shortOpen]);

  const toggleMode = (v: boolean) => {
    const apply = short ? setShortCollapsed : setReading;
    if (reduce || !(desktop || short) || anim) {
      apply(v);
      return;
    }
    if (v) {
      setAnim("collapse");
      later("anim", 300, () => {
        apply(true);
        setAnim("headIn");
        later("anim", 800, () => setAnim(null));
      });
    } else {
      setAnim("expand");
      setHeadHover(false);
      setBubbleHover(false);
      later("anim", 220, () => {
        apply(false);
        setAnim("remIn");
        later("anim", 500, () => setAnim(null));
      });
    }
  };

  /* -------------------------------------------------- conversation card */
  const closeCard = useCallback(() => {
    if (!open || closing) return;
    if (reduce) {
      setOpen(false);
      setMenu("main");
      return;
    }
    setClosing(true);
    later("close", 220, () => {
      setOpen(false);
      setClosing(false);
      setMenu("main");
    });
  }, [closing, later, open, reduce]);

  const openCard = () => {
    window.clearTimeout(timers.current.close);
    setClosing(false);
    setOpen(true);
  };

  // Leaving card mode (e.g. resizing to desktop) closes the card.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset transient UI when the layout mode changes
    if (!cardMode) setOpen(false);
  }, [cardMode]);

  // First outside tap closes the card only; its click is swallowed for 600ms.
  useEffect(() => {
    if (!open || closing) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (cardRef.current?.contains(t) || headRef.current?.contains(t)) return;
      suppress.current = true;
      later("suppress", 600, () => {
        suppress.current = false;
      });
      closeCard();
    };
    const onClick = (e: MouseEvent) => {
      if (!suppress.current) return;
      suppress.current = false;
      e.stopPropagation();
      e.preventDefault();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      closeCard();
      headRef.current?.focus();
    };
    document.addEventListener("pointerdown", onDown, true);
    document.addEventListener("click", onClick, true);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown, true);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("keydown", onKey);
    };
  }, [closeCard, closing, later, open]);

  /* -------------------------------------------------- section navigation */
  const goSec = useCallback(
    (id: string) => {
      const el = document.querySelector<HTMLElement>(`[data-sec="${id}"]`);
      if (!el) return;
      setSw(true);
      setMenu("main");
      later("sw", 320, () => {
        setSw(false);
        setHappy(true);
      });
      later("happy", 1500, () => setHappy(false));
      progScroll.current = true;
      later("prog", 900, () => {
        progScroll.current = false;
      });
      const top = id === chapters[0].id ? 0 : Math.max(0, docTop(el) - hdr() + 1);
      const lenis = getLenisInstance();
      if (lenis) lenis.scrollTo(top, { duration: reduce ? 0 : 1.1, immediate: reduce, force: true });
      else window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
      el.focus({ preventScroll: true });
    },
    [chapters, later, reduce],
  );

  /* -------------------------------------------------- scroll: progress + active section */
  useEffect(() => {
    let raf = 0;
    const ids = [...chapters.map((c) => c.id), "more"];
    const run = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      if (progressRef.current) progressRef.current.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
      const line = y + hdr() + 140;
      let cur = chapters[0].id;
      for (const id of ids) {
        const el = document.querySelector(`[data-sec="${id}"]`);
        if (el && docTop(el) <= line) cur = id;
      }
      if (y >= max - 4) cur = "more";
      setSec((prev) => (prev === cur ? prev : cur));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(run);
    };
    run();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [chapters]);

  // Scrolling the article closes the card (scrolling inside the card does not:
  // it is overscroll-contained and never scrolls the window).
  useEffect(() => {
    if (!open || closing) return;
    const startY = window.scrollY;
    const onScroll = () => {
      if (progScroll.current) return;
      if (Math.abs(window.scrollY - startY) > 4) closeCard();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [closeCard, closing, open]);

  /* -------------------------------------------------- one V3 reveal (desktop only) */
  useEffect(() => {
    if (reduce || !(desktop || short) || !("IntersectionObserver" in window)) return;
    const root = articleRef.current?.closest(".cv3");
    if (!root) return;
    const els = Array.from(
      root.querySelectorAll<HTMLElement>('[data-sec^="c"] > *, [data-sec^="c"] > .cv3-decision > *, [data-sec-media], .cv3-contact [data-reveal]'),
    ).filter((el) => !el.classList.contains("cv3-decision") && el.getBoundingClientRect().top > window.innerHeight);
    els.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(18px)";
      el.style.transition = "opacity .6s ease, transform .7s cubic-bezier(.2,.7,.2,1)";
    });
    const show = (el: HTMLElement) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    };
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          show(entry.target as HTMLElement);
          io.unobserve(entry.target);
        }),
      { rootMargin: "0px 0px -40px 0px" },
    );
    els.forEach((el) => io.observe(el));
    const fallback = window.setTimeout(() => els.forEach(show), 8000);
    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
      els.forEach((el) => {
        el.style.opacity = "";
        el.style.transform = "";
        el.style.transition = "";
      });
    };
  }, [desktop, short, reduce]);

  // Every menu opens at its first row (the first chapter is always fully
  // visible; the active row is marked, never auto-scrolled into the middle).
  useLayoutEffect(() => {
    const el = remoteScrollRef.current;
    if (el) el.scrollTop = 0;
  }, [menu]);

  // Mark the Remote screen's scroll area (message + options) when it overflows (fade cue + chevron).
  useEffect(() => {
    const el = remoteScrollRef.current;
    if (!el) return;
    const check = () => {
      const over = el.scrollHeight > el.clientHeight + 1;
      setOptsOverflow(over);
      setOptsScroll(over && el.scrollTop + el.clientHeight < el.scrollHeight - 1);
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    // The area keeps its size while its content changes (typed message, labels).
    for (const child of Array.from(el.children)) ro.observe(child);
    el.addEventListener("scroll", check, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", check);
    };
  }, [menu, mode, shortOpen]);

  /* -------------------------------------------------- derived view state */
  const si = Math.max(0, chapters.findIndex((c) => c.id === sec));
  const atMore = sec === "more";
  const cs = atMore ? { id: "more", no: "—", label: ui.more, line: moreLine } : chapters[si];
  const nextChapter = chapters[Math.min(chapters.length - 1, si + 1)];
  const lastNo = chapters[chapters.length - 1].no;
  // "Collapsed" desktop states: Reading Mode, or a short desktop not expanded.
  const deskRead = (desktop && reading) || (short && !shortOpen);
  const remoteOn = (desktop && !reading) || (short && shortOpen);

  let expression: NemuExpression = "idle";
  if (sleep) expression = "sleep";
  else if (sw) expression = "switching";
  else if (happy) expression = "happy";
  else if (cardMode && open) expression = "looking";
  else if (deskRead && headHover) expression = "happy";
  else if (deskRead && bubbleHover) expression = "looking";
  else if (blink) expression = "blink";

  const msgText = menu === "toc" ? (askLine ?? ui.ask) : cs.line;
  const msgKey = `${menu}-${cs.id}`;
  const ctxL = menu === "toc" ? ui.chaptersShort : `${cs.no} · ${cs.label}`;
  const ctxR = menu === "toc" ? pad2(chapters.length) : `CH${channelNo}`;

  const secOpt = (c: CaseV3Chapter, autoClose: boolean): Opt => ({
    key: c.id,
    label: `${c.no} ${c.label}`,
    glyph: "",
    current: sec === c.id,
    size: "sec",
    action: { type: "sec", id: c.id, autoClose },
  });

  const onAction = (a: OptAction) => {
    if (a.type === "menu") {
      press();
      reactBlink();
      setMenu(a.menu);
      return;
    }
    press();
    if (a.type === "top") {
      closeCard();
      goSec(chapters[0].id);
      return;
    }
    if (a.autoClose) closeCard();
    goSec(a.id);
  };

  const onLinkPress = () => {
    press();
    reactHappy();
  };

  const nextCaseOpt: Opt = { key: "next-case", label: `${ui.next} · CH${nextChannelNo}`, glyph: "→", primary: true, href: caseHref(nextProject) };
  const lastChapter = nextChapter.id === cs.id;
  const deskOpts: Opt[] =
    menu === "toc"
      ? [...chapters.map((c) => secOpt(c, false)), { key: "back", label: ui.back, glyph: "‹", size: "sec", action: { type: "menu", menu: "main" } }]
      : [
          atMore
            ? nextCaseOpt
            : { key: "next-sec", label: `${ui.nextSection} · ${lastChapter ? ui.more : nextChapter.label}`, glyph: "↓", primary: true, action: { type: "sec", id: lastChapter ? "more" : nextChapter.id, autoClose: false } },
          { key: "toc", label: ui.chapters, glyph: "›", action: { type: "menu", menu: "toc" } },
          ...(prototypeHref ? [{ key: "proto", label: (prototypeLabel ?? ui.prototype).replace(/\s*↗$/, ""), glyph: "↗", href: prototypeHref, external: true }] : []),
          { key: "all", label: ui.allChannels, glyph: "⌂", href: allChannelsHref },
        ];
  const cardOpts: Opt[] = [
    ...chapters.map((c) => secOpt(c, true)),
    { key: "top", label: ui.backToTop, glyph: "↑", action: { type: "top" } },
    { key: "all", label: ui.allChannels, glyph: "⌂", primary: true, href: allChannelsHref },
  ];

  // Previous / Next hooks: the projects' approved description (production's
  // Next Case blurb source; CASE01 EN keeps its verbatim override). Titles: v3Title.
  const prevDescription = (zh ? previousProject.description : previousProject.descriptionEn).join(zh ? "" : " ");
  const nextDescription = nextDescriptionOverride ?? (zh ? nextProject.description : nextProject.descriptionEn).join(zh ? "" : " ");

  return (
    <div className="v3 cv3" data-reading={reading ? "true" : "false"} data-short-open={shortOpen ? "true" : undefined} lang={zh ? "zh-Hant" : "en"}>
      <SkipLink locale={locale} />
      <div aria-hidden="true" className="cv3-glow" />
      <V3Header locale={locale} current="work" switchHref={switchHref} progressRef={progressRef} />

      <CaseEvidenceViewerProvider locale={locale}>
        <main id="main-content" tabIndex={-1} className="cv3-fade">
          <div className="cv3-row">
            <article ref={articleRef} className="cv3-article" data-switch={articleSwitch || undefined}>
              <CaseChannelContext.Provider value={channelNo}>{children}</CaseChannelContext.Provider>
            </article>

            <aside className="cv3-remote" aria-label={ui.guide} data-anim={anim === "collapse" ? "out" : undefined} data-bump={bump ? "true" : undefined} data-menu={menu}>
              <div className="cv3-remote-body">
                <div aria-hidden="true" className="cv3-remote-shade" />
                <div aria-hidden="true" className="cv3-remote-led-line" />
                <div className="cv3-remote-top">
                  <span className="cv3-remote-id" lang="en">
                    <span aria-hidden="true" className="cv3-led" data-on={led ? "true" : "false"} />
                    CH {channelNo}
                  </span>
                  <button type="button" className="cv3-collapse" aria-label={ui.collapseAria} onClick={() => toggleMode(true)}>
                    {ui.collapse}
                    <span aria-hidden="true" className="cv3-collapse-glyph">⌄</span>
                  </button>
                </div>
                <div className="cv3-screen-well">
                  <div className="cv3-screen" data-menu={menu} data-dense={chapters.length > 7 ? "true" : undefined}>
                    <div className="cv3-ctx">
                      <span>{ctxL}</span>
                      <span lang="en">{ctxR}</span>
                    </div>
                    <div ref={remoteScrollRef} className="cv3-screen-scroll" data-scrolls={optsScroll ? "true" : undefined} data-overflow={optsOverflow ? "true" : undefined} data-lenis-prevent>
                      <div className="cv3-msg" aria-live="polite">
                        {remoteOn ? <Typer key={msgKey} text={msgText} reduce={reduce} className="v3-type-remote" /> : null}
                      </div>
                      <div className="cv3-spacer" />
                      <ul className="cv3-opts">{deskOpts.map((o) => <OptItem key={o.key} o={o} onPress={onLinkPress} onAction={onAction} />)}</ul>
                    </div>
                    <span aria-hidden="true" className="cv3-opts-more" data-on={optsScroll ? "true" : undefined}>⌄</span>
                    {/* Channel row (INDEX Remote's integrated 上一台 · CH · 下一台): the last
                        control row on the screen, below the actions; previous / next CASE in
                        channel order, wrapping CH01 ↔ CH07. The option list above scrolls on
                        short screens, so this row never covers an option. */}
                    <nav className="cv3-chnav" aria-label={ui.chNav}>
                      <Link href={caseHref(previousProject)} className="cv3-chnav-btn" data-dir="prev" aria-label={`${ui.chPrevAria} · CH ${previousChannelNo} ${v3Title(previousProject, locale)}`} onClick={onLinkPress}>
                        <span aria-hidden="true" className="cv3-chnav-glyph">←</span>
                        {ui.chPrev}
                      </Link>
                      <span className="cv3-chnav-now" lang="en">CH {channelNo}</span>
                      <Link href={caseHref(nextProject)} className="cv3-chnav-btn" data-dir="next" aria-label={`${ui.chNextAria} · CH ${nextChannelNo} ${v3Title(nextProject, locale)}`} onClick={onLinkPress}>
                        {ui.chNext}
                        <span aria-hidden="true" className="cv3-chnav-glyph">→</span>
                      </Link>
                    </nav>
                  </div>
                </div>
                <div className="cv3-remote-foot">
                  <span aria-hidden="true" className="cv3-grille" />
                  <span className="cv3-remote-count" lang="en">
                    {atMore ? lastNo : cs.no} / {lastNo}
                  </span>
                </div>
              </div>
              <div className="cv3-remote-head">{!mounted || remoteOn ? <NemuHead expression={expression} /> : null}</div>
            </aside>
          </div>

          {/* CaseBottomNavigation (CASE_SYSTEM.md §2 #9): Previous · All channels ·
              Next with its hook — three single-link cards, titles = INDEX. */}
          <nav data-sec="more" tabIndex={-1} aria-label={ui.more} className="cv3-more">
            <CaseTransitionLink href={caseHref(previousProject)} className="cv3-more-card cv3-navcard cv3-more-prev" data-dir="prev">
              <span className="cv3-more-kicker">
                <span><span aria-hidden="true" className="cv3-navcard-arrow">←</span> {ui.previous} · CH {previousChannelNo}</span>
              </span>
              <span className="cv3-more-title">{v3Title(previousProject, locale)}</span>
              {prevDescription ? <span className="cv3-next-desc">{prevDescription}</span> : null}
            </CaseTransitionLink>
            <Link href={allChannelsHref} className="cv3-more-card cv3-more-all">
              <span className="cv3-more-kicker" lang="en">CH 01–{pad2(publishedCount)}</span>
              <span className="cv3-more-title">{ui.allChannels}</span>
            </Link>
            <CaseTransitionLink href={caseHref(nextProject)} className="cv3-more-card cv3-navcard cv3-next" data-dir="next">
              <span className="cv3-more-kicker">
                <span>{ui.next} · CH {nextChannelNo}</span>
                <span aria-hidden="true" className="cv3-navcard-arrow">→</span>
              </span>
              <span className="cv3-more-title">{v3Title(nextProject, locale)}</span>
              {nextDescription ? <span className="cv3-next-desc">{nextDescription}</span> : null}
            </CaseTransitionLink>
          </nav>
        </main>
      </CaseEvidenceViewerProvider>

      <div className="cv3-fade">
        <CaseV3Closing locale={locale} />
        <footer className="cv3-footer" lang="en">
          <p>© ANGELA YU 2026</p>
          <button type="button" className="cv3-backtop" onClick={() => goSec(chapters[0].id)}>
            BACK TO TOP ↑
          </button>
        </footer>
      </div>

      {!mounted || cardMode ? (
        <>
          <div aria-hidden="true" className="cv3-fhead-shade" />
          <button
            ref={headRef}
            type="button"
            className="cv3-fhead"
            aria-label={open && !closing ? ui.closeChat : ui.openChat}
            aria-expanded={open && !closing}
            onClick={() => {
              press();
              if (open && !closing) closeCard();
              else openCard();
            }}
          >
            <div className="cv3-fhead-float">
              <div className="cv3-fhead-scale">
                <NemuHead expression={expression} />
              </div>
            </div>
          </button>
          {open ? (
            <div ref={cardRef} role="dialog" aria-label="Nemu" className="cv3-card" data-closing={closing ? "true" : undefined} data-bump={bump ? "true" : undefined} data-lenis-prevent>
              <div className="cv3-card-head">
                <div className="cv3-card-titles" lang="en">
                  <span className="cv3-card-kicker">NEMU · COMPANION</span>
                  <span className="cv3-card-sub">CH {channelNo} · <span lang={zh ? "zh-Hant" : "en"}>{cs.label}</span></span>
                </div>
                <button
                  type="button"
                  className="cv3-card-x"
                  aria-label={ui.closeX}
                  onClick={() => {
                    closeCard();
                    headRef.current?.focus();
                  }}
                >
                  ×
                </button>
              </div>
              <div aria-live="polite">
                <Typer key={msgKey} text={cs.line} reduce={reduce} className="v3-type-card" />
              </div>
              <ul className="cv3-opts">{cardOpts.map((o) => <OptItem key={o.key} o={o} onPress={onLinkPress} onAction={onAction} />)}</ul>
            </div>
          ) : null}
        </>
      ) : null}

      {!mounted || deskRead || anim === "expand" ? (
        <div className="cv3-dock" data-anim={anim === "expand" ? "out" : undefined}>
          <button
            type="button"
            className="cv3-bubble"
            hidden={atMore}
            aria-label={ui.expandAria}
            onClick={() => toggleMode(false)}
            onMouseEnter={() => setBubbleHover(true)}
            onMouseLeave={() => setBubbleHover(false)}
          >
            <span className="cv3-bubble-top">
              <span lang="en">NEMU</span>
              <span>{cs.label}</span>
            </span>
            <Typer key={`b-${cs.id}`} text={cs.line} reduce={reduce} className="v3-type-bubble" />
            <span aria-hidden="true" className="cv3-bubble-tail" />
          </button>
          <div className="cv3-dock-headwrap">
            <div className="cv3-dock-headbox">
              <div aria-hidden="true" className="cv3-dock-shade" />
              <button
                type="button"
                className="cv3-dock-head"
                aria-label={ui.expandAria}
                data-hover={headHover && !reduce ? "true" : undefined}
                onClick={() => toggleMode(false)}
                onMouseEnter={() => setHeadHover(true)}
                onMouseLeave={() => setHeadHover(false)}
              >
                <div className="cv3-dock-hover">
                  <div className="cv3-fhead-float">
                    <div className="cv3-fhead-scale">
                      <NemuHead expression={expression} />
                    </div>
                  </div>
                </div>
              </button>
            </div>
            <button type="button" className="cv3-expand" onClick={() => toggleMode(false)}>
              {ui.expand}
              <span aria-hidden="true" className="cv3-expand-glyph">⌃</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
