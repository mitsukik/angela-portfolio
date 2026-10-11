/*
 * Nemu V1 motion layer — port of the approved `nemu-motion.js`.
 * Keyframes, easings, durations and cooldowns are copied unchanged.
 *
 * Attaches once (ref-counted) to every rendered Nemu head
 * (img[src*="nemu-master-head-v4"]): hover bounce (1800ms cooldown, 1150ms),
 * tap dip, press squash, and the talking mouth that follows any typewriter
 * inside an aria-live region. Never preventDefault / stopPropagation.
 * Reduced Motion: smile only.
 */

const COOL = 1800;
const D = 1150;
const W = "#F8F8FB";

const BOUNCE: Keyframe[] = [
  { transform: "translateY(0) rotate(0deg) scale(1,1)", easing: "cubic-bezier(.3,0,.3,1)" },
  { transform: "translateY(.5px) rotate(-2deg) scale(1.025,.995)", offset: 0.13, easing: "cubic-bezier(.4,0,.6,1)" },
  { transform: "translateY(5px) rotate(-.5deg) scale(1.045,.95)", offset: 0.3, easing: "cubic-bezier(.2,0,.2,1)" },
  { transform: "translateY(-10px) rotate(1deg) scale(.975,1.035)", offset: 0.54, easing: "cubic-bezier(.3,0,.4,1)" },
  { transform: "translateY(-12px) rotate(.3deg) scale(1,1)", offset: 0.68, easing: "cubic-bezier(.45,0,.35,1)" },
  { transform: "translateY(1.5px) rotate(0deg) scale(1.012,.988)", offset: 0.88, easing: "cubic-bezier(.3,0,.3,1)" },
  { transform: "translateY(0) rotate(0deg) scale(1,1)" },
];
const TAP: Keyframe[] = [
  { transform: "translateY(0) scale(1,1)", easing: "cubic-bezier(.3,0,.3,1)" },
  { transform: "translateY(4px) scale(1.04,.95)", offset: 0.35, easing: "cubic-bezier(.2,0,.2,1)" },
  { transform: "translateY(-1.5px) scale(.99,1.02)", offset: 0.7, easing: "cubic-bezier(.3,0,.3,1)" },
  { transform: "translateY(0) scale(1,1)" },
];
const PRESS: Keyframe[] = [{ transform: "scale(1)" }, { transform: "scale(.95)", offset: 0.3 }, { transform: "scale(1.02)", offset: 0.7 }, { transform: "scale(1)" }];

type HeadState = { last: number; busy: boolean; in: boolean; smile: Animation[]; img?: HTMLImageElement };

let users = 0;
let teardown: (() => void) | null = null;

export function attachNemuMotion(): () => void {
  users += 1;
  if (users === 1) teardown = start();
  return () => {
    users -= 1;
    if (users === 0 && teardown) {
      teardown();
      teardown = null;
    }
  };
}

function start(): () => void {
  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const heads = new Map<HTMLImageElement, HeadState>();

  const parts = (img: HTMLImageElement) => {
    const box = img.parentElement as HTMLElement | null;
    if (!box) return null;
    const row = Array.from(box.querySelectorAll("div")).find((d) => d.children.length === 2 && Array.from(d.children).every((c) => c.tagName === "SPAN"));
    return { box, eyes: row ? (Array.from(row.children) as HTMLElement[]) : [], mouth: (row?.nextElementSibling as HTMLElement | null) ?? null };
  };
  const scan = () =>
    document.querySelectorAll<HTMLImageElement>('img[src*="nemu-master-head-v4"]').forEach((img) => {
      if (!heads.has(img)) heads.set(img, { last: -1e9, busy: false, in: false, smile: [] });
    });
  const smileOn = (h: HeadState) => {
    if (!h.img) return;
    const p = parts(h.img);
    if (!p || h.smile.length) return;
    p.eyes.forEach((e) =>
      h.smile.push(e.animate({ width: "20px", height: "11px", borderRadius: "20px 20px 0 0", backgroundColor: "transparent", borderTopWidth: "3.5px", borderTopStyle: "solid", borderTopColor: W, boxShadow: "none" }, { duration: 200, fill: "forwards", easing: "ease-out" })),
    );
    if (p.mouth) h.smile.push(p.mouth.animate({ width: "18px", height: "9px" }, { duration: 200, fill: "forwards", easing: "ease-out" }));
  };
  const smileOff = (h: HeadState) => {
    const a = h.smile;
    h.smile = [];
    a.forEach((x) => {
      x.reverse();
      x.onfinish = () => x.cancel();
    });
  };
  const react = (img: HTMLImageElement, h: HeadState, kind: "hover" | "tap") => {
    const now = performance.now();
    if (h.busy || now - h.last < COOL) return;
    const p = parts(img);
    if (!p) return;
    h.img = img;
    smileOn(h);
    if (reduced()) {
      h.last = now;
      window.setTimeout(() => { if (!h.in) smileOff(h); }, 900);
      return;
    }
    h.busy = true;
    const dur = kind === "tap" ? 700 : D;
    p.box.animate(kind === "tap" ? TAP : BOUNCE, { duration: dur, composite: "add" });
    window.setTimeout(() => {
      h.busy = false;
      h.last = performance.now();
      if (!h.in || kind === "tap") window.setTimeout(() => smileOff(h), kind === "tap" ? 300 : 0);
    }, dur);
  };
  const hit = (img: HTMLImageElement, x: number, y: number) => {
    const r = img.getBoundingClientRect();
    if (!r.width || !img.isConnected) return false;
    if (getComputedStyle(img).visibility === "hidden") return false;
    return x >= r.left + r.width * 0.12 && x <= r.right - r.width * 0.12 && y >= r.top + r.height * 0.15 && y <= r.bottom - r.height * 0.1;
  };

  let raf = 0;
  let lx = 0;
  let ly = 0;
  let ltype = "mouse";
  const onMove = (e: PointerEvent) => {
    lx = e.clientX;
    ly = e.clientY;
    ltype = e.pointerType;
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      if (ltype !== "mouse") return;
      scan();
      heads.forEach((h, img) => {
        const inside = hit(img, lx, ly);
        if (inside && !h.in) {
          h.in = true;
          h.img = img;
          react(img, h, "hover");
        } else if (!inside && h.in) {
          h.in = false;
          if (!h.busy) smileOff(h);
        }
      });
    });
  };
  const onDown = (e: PointerEvent) => {
    scan();
    heads.forEach((h, img) => {
      if (!hit(img, e.clientX, e.clientY)) return;
      const p = parts(img);
      if (!p) return;
      h.img = img;
      if (!reduced()) p.box.animate(PRESS, { duration: 280, easing: "cubic-bezier(.3,.7,.3,1)", composite: "add" });
      if (e.pointerType !== "mouse") react(img, h, "tap");
    });
  };

  // Talking mouth: follow any typewriter inside aria-live regions.
  let talkT = 0;
  let talking = false;
  let mAnims: Animation[] = [];
  const talkStart = () => {
    if (talking || reduced()) return;
    talking = true;
    scan();
    heads.forEach((_, img) => {
      const p = parts(img);
      if (!p || !p.mouth || !img.getBoundingClientRect().width) return;
      mAnims.push(
        p.mouth.animate(
          [
            { width: "14px", height: "7px", borderRadius: "0 0 10px 10px" },
            { width: "10px", height: "8px", borderRadius: "50%", borderTopColor: W, borderLeftColor: W, borderRightColor: W },
            { width: "12px", height: "4px", borderRadius: "50%", borderTopColor: W, borderLeftColor: W, borderRightColor: W },
            { width: "14px", height: "7px", borderRadius: "0 0 10px 10px" },
          ],
          { duration: 260, iterations: Infinity, easing: "steps(3,end)" },
        ),
      );
    });
  };
  const talkStop = () => {
    talking = false;
    mAnims.forEach((a) => a.cancel());
    mAnims = [];
  };
  const observer = new MutationObserver((ms) => {
    if (!ms.some((m) => {
      const t = m.target.nodeType === 3 ? m.target.parentElement : (m.target as Element);
      return t?.closest?.("[aria-live]");
    })) return;
    talkStart();
    window.clearTimeout(talkT);
    talkT = window.setTimeout(talkStop, 160);
  });
  observer.observe(document.documentElement, { subtree: true, childList: true, characterData: true });
  const prune = window.setInterval(() => heads.forEach((_, img) => { if (!img.isConnected) heads.delete(img); }), 2000);

  document.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("pointerdown", onDown, { capture: true, passive: true });

  return () => {
    observer.disconnect();
    window.clearInterval(prune);
    window.clearTimeout(talkT);
    if (raf) cancelAnimationFrame(raf);
    talkStop();
    document.removeEventListener("pointermove", onMove);
    document.removeEventListener("pointerdown", onDown, { capture: true });
    heads.clear();
  };
}
