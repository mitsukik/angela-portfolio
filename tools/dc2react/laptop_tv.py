"""
F-01 Laptop TV layout (Angela, approved 2026-10-13) — source patches for the
INDEX / ABOUT desktop boards, applied by build_v3.py after its own patches.

The 1920×1080 board keeps its approved composition. Every dimension that has
to flex on laptop screens becomes a CSS custom property whose fallback is the
original value, so with no variables set (≥ ~1680×945, scale ≥ 0.875) the
board is unchanged. components/v3/laptopTv.ts computes the variables per
viewport (smaller logical canvas instead of smaller type) and the page wrappers
set them on `.v3-index-board`.

Docked Nemu (narrow laptops): the Remote column becomes the Nemu head in its
own gutter beside the channel strip; a button on the head opens the full
Remote panel above it (Escape / outside click / the head close it; focus moves
into the panel and back to the head).
"""
import re


def _sub(src, old, new, count=1):
    n = src.count(old)
    if n != count:
        raise SystemExit(f"laptop_tv: expected {count}× {old[:70]!r}, found {n}")
    return src.replace(old, new)


def _split(src):
    i = src.index('<script type="text/x-dc"')
    return src[:i], src[i:]


# shared board frame — identical markup in INDEX and ABOUT
FRAME = (
    ('style="position:relative;width:1920px;height:1080px;flex:none;background:#0b0c0e;',
     'style="position:relative;width:var(--tv-w,1920px);height:var(--tv-h,1080px);flex:none;background:#0b0c0e;'),
    ('<div ref="{{ scroller }}" onScroll="{{ onScroll }}" style="',
     '<div ref="{{ scroller }}" onScroll="{{ onScroll }}" data-tv="scroller" style="'),
    ('position:sticky;top:0;height:1080px;',
     'position:sticky;top:0;height:var(--tv-h,1080px);'),
    ('position:absolute;left:0;right:0;bottom:14px;display:flex;justify-content:center;pointer-events:none;',
     'position:absolute;left:0;right:0;bottom:var(--tv-foot-b,14px);display:flex;justify-content:center;pointer-events:none;'),
    ('position:absolute;left:162px;width:1240px;top:912px;height:110px;',
     'position:absolute;left:var(--tv-glow-l,162px);width:var(--tv-col,1240px);top:var(--tv-glow-t,912px);height:110px;'),
    ('<header style="position:relative;height:72px;flex:none;display:flex;justify-content:space-between;align-items:center;padding:0 162px;',
     '<header style="position:relative;height:var(--tv-hdr-h,72px);flex:none;display:flex;justify-content:space-between;align-items:center;padding:0 var(--tv-pad,162px);'),
    ('<main style="position:relative;flex:1;min-height:0;display:flex;gap:56px;justify-content:center;align-items:flex-start;padding-top:28px">',
     '<main style="position:relative;flex:1;min-height:0;display:flex;gap:var(--tv-gap,56px);justify-content:var(--tv-jc,center);align-items:flex-start;padding-top:var(--tv-pt,28px);padding-left:var(--tv-pl,0px)">'),
    ('<div style="width:1240px;flex:none;display:flex;flex-direction:column;gap:16px',
     '<div style="width:var(--tv-col,1240px);flex:none;display:flex;flex-direction:column;gap:var(--tv-colgap,16px)'),
    ('position:relative;height:740px;padding:16px 16px 0;border-radius:30px;',
     'position:relative;height:var(--tv-tv-h,740px);padding:16px 16px 0;border-radius:30px;'),
    ('<div style="height:680px;padding:6px;border-radius:21px;',
     '<div style="height:var(--tv-scr-h,680px);padding:6px;border-radius:21px;'),
    ('position:relative;height:668px;border-radius:15px;overflow:hidden;',
     'position:relative;height:var(--tv-in-h,668px);border-radius:15px;overflow:hidden;'),
    # Nemu: Remote column, or docked head + on-demand panel
    ('style="position:relative;width:300px;height:804px;flex:none;transform:{{ remoteTf }};',
     'style="position:var(--tv-aside-pos,relative);right:var(--tv-aside-r,auto);bottom:var(--tv-aside-b,auto);z-index:var(--tv-aside-z,auto);width:var(--tv-aside-w,300px);height:var(--tv-aside-h,804px);flex:none;transform:{{ remoteTf }};'),
    ('<div style="position:absolute;left:0;right:0;top:156px;height:648px;border-radius:40px 40px 38px 38px;',
     '<div id="v3-remote" data-tv="panel" style="display:{{ panelDisp }};position:absolute;left:var(--tv-panel-l,0px);right:0;top:var(--tv-panel-t,156px);height:var(--tv-panel-h,648px);border-radius:40px 40px 38px 38px;'),
    ('<div style="position:absolute;left:50%;top:-30px;width:202px;height:202px;margin-left:-101px;z-index:2;animation:{{ floatAnim }}">',
     '<div style="position:absolute;left:50%;top:var(--tv-head-t,-30px);width:202px;height:202px;margin-left:-101px;z-index:2;scale:var(--tv-head-s,1);animation:{{ floatAnim }}">'),
    ('</aside>',
     '<button type="button" data-tv="dock" onClick="{{ dockToggle }}" aria-expanded="{{ dockExp }}" aria-controls="v3-remote" aria-label="{{ dockL }}" '
     'style="display:var(--tv-dock,none);position:absolute;left:0;right:0;bottom:0;height:var(--tv-aside-h,804px);z-index:3;padding:0;border:0;border-radius:50%;background:transparent;cursor:pointer"></button>\n</aside>'),
)

# the panel's own `display:flex` is replaced by {{ panelDisp }} (flex / none)
PANEL_FLEX = 'padding:24px 16px 14px;display:flex;flex-direction:column;gap:12px">'

INDEX_HERO = (
    ('<div style="height:48px;display:grid">', '<div style="height:var(--tv-tabs-h,48px);display:grid">'),
    ('padding:34px 56px 34px;display:flex;flex-direction:column;transform:{{ heroTf }};',
     'padding:var(--tv-hero-pad,34px 56px 34px);display:flex;flex-direction:column;transform:{{ heroTf }};'),
    ('grid-template-columns:minmax(0,1fr) 404px;gap:64px;align-items:end;padding:28px 0 30px">',
     'grid-template-columns:minmax(0,1fr) var(--tv-hero-r,404px);gap:64px;align-items:end;padding:var(--tv-hero-gp,28px 0 30px)">'),
    ('<h1 style="margin:0;font:900 136px/.84 Archivo,sans-serif;',
     '<h1 data-tv="mark" style="margin:0;font:900 var(--tv-mark,136px)/.84 Archivo,sans-serif;'),
    ('<div style="height:1560px">', '<div style="height:calc(var(--tv-h,1080px) + 480px)">'),
)

ABOUT_ROWS = (
    ('<div style="height:48px;display:flex;justify-content:space-between;align-items:center;font:500 13px \'JetBrains Mono\'',
     '<div style="height:var(--tv-tabs-h,48px);display:flex;justify-content:space-between;align-items:center;font:500 13px \'JetBrains Mono\''),
    ('<div style="height:3680px">', '<div style="height:calc(var(--tv-h,1080px) + 2600px)">'),
    # chapter 01 headline is display type: it follows a narrower TV
    ('<h1 style="margin:0;font:900 46px/1.22 \'Noto Sans TC\';', '<h1 style="margin:0;font:900 var(--tv-h1,46px)/1.22 \'Noto Sans TC\';'),
)

DOCK_LOGIC = """  dockSet = open => {
    if (!!this.state.dockOpen === open) return;
    this.setState({ dockOpen: open }, () => {
      const r = this.board.current; if (!r) return;
      if (open) { const pn = r.querySelector('#v3-remote'), a = r.querySelector('aside'); if (pn && a && (pn.getBoundingClientRect().top < 0 || a.getBoundingClientRect().bottom > innerHeight)) window.scrollBy(0, pn.getBoundingClientRect().top < 0 ? pn.getBoundingClientRect().top - 8 : a.getBoundingClientRect().bottom - innerHeight + 8); const f = r.querySelector('#v3-remote a, #v3-remote button'); if (f) f.focus({ preventScroll: true }); }
      else if (r.contains(document.activeElement) || document.activeElement === document.body) { const d = r.querySelector('[data-tv="dock"]'); if (d) d.focus({ preventScroll: true }); }
    });
  };
  dockKey = e => { if (e.key === 'Escape' && this.state.dockOpen) { e.stopPropagation(); this.dockSet(false); } };
  dockAway = e => { if (!this.state.dockOpen) return; const a = this.board.current && this.board.current.querySelector('aside'); if (a && !a.contains(e.target)) this.dockSet(false); };
  componentDidMount() {
    document.addEventListener('keydown', this.dockKey, true); document.addEventListener('pointerdown', this.dockAway, true);"""

DOCK_UNMOUNT = "  componentWillUnmount() {\n    document.removeEventListener('keydown', this.dockKey, true); document.removeEventListener('pointerdown', this.dockAway, true);\n"


def _dock_vals(lang_expr):
    return ("panelDisp: this.props.dock && !s.dockOpen ? 'none' : 'flex', dockExp: s.dockOpen ? 'true' : 'false', "
            "dockToggle: () => this.dockSet(!s.dockOpen), "
            f"dockL: {lang_expr} ? (s.dockOpen ? 'Close Nemu remote' : 'Open Nemu remote') : (s.dockOpen ? '關閉 Nemu 遙控器' : '打開 Nemu 遙控器'), ")


def _frame(src):
    tpl, logic = _split(src)
    for old, new in FRAME:
        tpl = _sub(tpl, old, new)
    a = tpl.index('id="v3-remote"')
    b = tpl.index(PANEL_FLEX, a)
    tpl = tpl[:b] + PANEL_FLEX.replace('display:flex;', '') + tpl[b + len(PANEL_FLEX):]
    logic = _sub(logic, "  componentDidMount() {", DOCK_LOGIC)
    logic = _sub(logic, "  componentWillUnmount() {\n", DOCK_UNMOUNT)
    return tpl, logic


def laptop_index(src):
    tpl, logic = _frame(src)
    for old, new in INDEX_HERO:
        tpl = _sub(tpl, old, new)
    logic = _sub(logic, "showHome: () => this.scrollTo(0),", _dock_vals("this.props.lang === 'en'") + "showHome: () => this.scrollTo(0),")
    return tpl + logic


def laptop_about(src):
    tpl, logic = _frame(src)
    for old, new in ABOUT_ROWS:
        tpl = _sub(tpl, old, new)
    logic = _sub(logic, "toggleLang: (e) =>", _dock_vals("s.lang === 'en'") + "toggleLang: (e) =>")
    return tpl + logic
