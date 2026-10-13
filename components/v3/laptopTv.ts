/*
 * INDEX / ABOUT desktop TV board — Laptop TV layout (F-01, Angela 2026-10-13).
 *
 * The approved board is a 1920×1080 composition scaled to the viewport. With
 * no lower bound, laptops rendered body copy at 8.5–12px. The board now never
 * scales below READABLE_SCALE (16px body → 14px); below that the logical
 * canvas shrinks instead and the TV composition adapts to it:
 *
 *   original  scale ≥ 0.875 (≈ ≥1680×945): unchanged — no variables are set
 *   laptop    fluid margins, Remote column 264–300px, TV height follows the
 *             viewport (≤ 740), Remote panel extends beside the channel strip
 *   docked    logical width < 1560 (viewport < 1365): the Remote column becomes
 *             the Nemu head in its own gutter beside the strip; the head opens
 *             the full Remote panel above it
 *   compact   short canvases tighten the chrome (header, tab row, gaps, footer)
 *   page scroll  when even the compact TV would be shorter than the page's
 *             content needs, the canvas keeps that height and the page scrolls
 *             vertically (wheel scrolls the page first, then the board)
 *
 * Only display type scales (the INDEX wordmark). Body, Remote, nav and meta
 * text keep their board size × 0.875 or more. Dark/Light are unaffected.
 */

export const BOARD_W = 1920;
export const BOARD_H = 1080;
export const READABLE_SCALE = 0.875;
/** ABOUT keeps the TV only from this viewport width; narrower uses the tablet layout. */
export const ABOUT_TV_MIN_WIDTH = 1181;

type Page = "index" | "about";

/** Smallest TV height (logical px) at which each page's TV content fits.
 *  The INDEX hero is taller in EN (longer statement, two-line fact labels)
 *  and on a narrow TV (< 1100), where the fact values wrap; ABOUT's chapter
 *  copy gains a line on its narrowest TVs (< 1200, EN chapter 03). */
const tvNeed = (page: Page, tvW: number, lang: "zh" | "en") =>
  page === "about" ? 680 + (tvW < 1200 ? 30 : 0) : (lang === "en" ? 650 : 580) + (tvW < 1100 ? 70 : 0);
/** Below this TV height (with full chrome) the chrome goes compact. */
const TV_COMFORT: Record<Page, number> = { index: 600, about: 680 };

const FULL = { hdr: 72, pt: 28, tabs: 48, colGap: 16, foot: 44 };
// foot: the INDEX channel thumbnails + labels run ~14px past the 116px strip row
const COMPACT = { hdr: 56, pt: 16, tabs: 40, colGap: 12, foot: 36 };
const STRIP = 116;
const DOCK_GUTTER = 120;
/** "ANGELA" width ÷ font-size in Archivo 900, letter-spacing −.03em. */
const MARK_RATIO = 4.36;

export type LaptopTv = {
  mode: "original" | "laptop" | "docked";
  k: number;
  /** logical canvas */
  w: number;
  h: number;
  /** the page scrolls vertically (canvas taller than the viewport) */
  pageScroll: boolean;
  dock: boolean;
  /** CSS custom properties for `.v3-index-board` (none in original mode) */
  vars: Record<string, string>;
};

const px = (n: number) => `${Math.round(n * 100) / 100}px`;

export function laptopTv(vw: number, vh: number, page: Page, lang: "zh" | "en" = "zh"): LaptopTv {
  const fit = Math.min(vw / BOARD_W, vh / BOARD_H);
  if (fit >= READABLE_SCALE) return { mode: "original", k: fit, w: BOARD_W, h: BOARD_H, pageScroll: false, dock: false, vars: {} };

  const k = READABLE_SCALE;
  const w = Math.min(BOARD_W, vw / k);
  const vhL = vh / k;
  const dock = w < 1560;
  const remoteW = dock ? 0 : w >= 1700 ? 300 : 264;
  const gap = dock ? 0 : w >= 1700 ? 56 : 48;
  const pad = Math.max(40, Math.min(162, (w - 1240 - 56 - 264) / 2));
  const tvW = Math.min(1240, w - 2 * pad - gap - remoteW - (dock ? DOCK_GUTTER : 0));

  const compact = Math.min(BOARD_H, vhL) - chrome(FULL) < TV_COMFORT[page];
  const c = compact ? COMPACT : FULL;
  const minH = tvNeed(page, tvW, lang) + chrome(c);
  const h = Math.min(BOARD_H, Math.max(vhL, minH));
  const pageScroll = vhL < minH - 0.5;
  const tvH = Math.min(740, h - chrome(c));
  const colLeft = dock ? (w - tvW - DOCK_GUTTER) / 2 : (w - tvW - gap - remoteW) / 2;

  const vars: Record<string, string> = {
    "--tv-w": px(w),
    "--tv-h": px(h),
    "--tv-pad": px(colLeft),
    "--tv-hdr-h": px(c.hdr),
    "--tv-pt": px(c.pt),
    "--tv-gap": px(gap),
    "--tv-col": px(tvW),
    "--tv-colgap": px(c.colGap),
    "--tv-tabs-h": px(c.tabs),
    "--tv-tv-h": px(tvH),
    "--tv-scr-h": px(tvH - 60),
    "--tv-in-h": px(tvH - 72),
    "--tv-glow-l": px(colLeft),
    "--tv-glow-t": px(c.hdr + c.pt + c.tabs + 2 * c.colGap + tvH - 8),
    "--tv-foot-b": px(compact ? 6 : 14),
  };

  if (dock) {
    // Nemu head in the gutter beside the channel strip; Remote panel opens above it
    // the open panel and the head fit in the viewport together
    const panelH = Math.min(648, c.tabs + c.colGap + tvH - 12, vhL - DOCK_GUTTER - 32);
    Object.assign(vars, {
      "--tv-jc": "flex-start",
      "--tv-pl": px(colLeft),
      "--tv-aside-pos": "absolute",
      "--tv-aside-r": px(colLeft),
      "--tv-aside-b": px(c.foot - 2),
      "--tv-aside-z": "5",
      "--tv-aside-w": px(DOCK_GUTTER),
      "--tv-aside-h": px(DOCK_GUTTER),
      "--tv-panel-l": px(DOCK_GUTTER - 300),
      "--tv-panel-t": px(-(panelH + 12)),
      "--tv-panel-h": px(panelH),
      "--tv-head-t": px((DOCK_GUTTER - 202) / 2),
      "--tv-head-s": "0.55",
      "--tv-dock": "block",
    });
  } else {
    // Remote column: alongside the TV and, when the TV is short, the channel strip too
    const asideH = c.tabs + c.colGap + tvH + (tvH < 700 ? c.colGap + STRIP : 0);
    Object.assign(vars, { "--tv-aside-w": px(remoteW), "--tv-aside-h": px(asideH), "--tv-panel-h": px(asideH - 156) });
  }

  if (page === "about" && tvW < 1240) vars["--tv-h1"] = px(Math.max(38, 46 * (tvW / 1240) * 0.97));

  if (page === "index") {
    const heroX = compact ? 40 : 56;
    if (compact) Object.assign(vars, { "--tv-hero-pad": `18px ${heroX}px 18px`, "--tv-hero-gp": "12px 0 12px" });
    const inner = tvW - 44 - 2 * heroX;
    const right = Math.max(340, Math.min(404, (inner - 64) * 0.44));
    const left = inner - 64 - right;
    const byHeight = 136 * Math.max(0.6, Math.min(1, (tvH - 343) / 228));
    vars["--tv-hero-r"] = px(right);
    vars["--tv-mark"] = px(Math.min(136, left / MARK_RATIO, byHeight));
  }

  return { mode: dock ? "docked" : "laptop", k, w, h, pageScroll, dock, vars };
}

function chrome(c: typeof FULL) {
  return c.hdr + c.pt + c.tabs + 2 * c.colGap + STRIP + c.foot;
}
