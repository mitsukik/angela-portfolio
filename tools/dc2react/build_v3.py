#!/usr/bin/env python3
"""
Build the Portfolio V3 INDEX / ABOUT components from the approved Claude
Design references. Every source patch below is deliberate and listed:

  * URLs / assets   → production routes and local files (no hotlinks)
  * channel data    → `channels` prop from data/projects.ts (verified facts,
                      published cases only; CH numbers never renumbered)
  * placeholders    → the "社群 · 待提供" socials placeholder is removed (no
                      approved social links exist); case hook/link
                      placeholders stay but are unreachable for published cases
  * language        → INDEX had no EN: every ZH string is routed through the
                      `L` prop (data/v3/indexStrings.ts). ABOUT keeps its own
                      zh/en tables; its localStorage toggle becomes a route switch.
  * positioning     → no "Senior" self-title: the INDEX/ABOUT eyebrows read
                      `UI/UX DESIGNER` (Angela, 2026-10-11; see drop_senior).

Run:  python3 -I tools/dc2react/build_v3.py <reference-dir>
"""
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
REF = Path(sys.argv[1])
WORK = ROOT / "tools/dc2react/.work"
OUT = ROOT / "components/v3/dc"
WORK.mkdir(exist_ok=True)
OUT.mkdir(exist_ok=True)

URL_MAP = {
    "https://angela-portfolio-phi.vercel.app/images/": "/images/",
    "assets/nemu-master-head-v4.png": "/v3/nemu-master-head-v4.png",
}

# id → zh source string (EN lives in data/v3/indexStrings.ts)
INDEX_STRINGS = {k: v["zh"] for k, v in json.loads((ROOT / "data/v3/index-strings.json").read_text()).items() if not k.startswith("_")}


# Q02 (P1 QA 2026-10-10): confirm a copy only after the clipboard write
# resolves; otherwise say it failed (localized). The address is never shown.
def copy_body(ok_msg, fail_msg):
    return ("const done = ok => { this.setState({ toast: ok ? " + ok_msg + " : " + fail_msg + ", happy: ok, copyOk: ok, copyFail: !ok }); "
            "clearTimeout(this.toastT); this.toastT = setTimeout(() => this.setState({ toast: '', happy: false, copyOk: false, copyFail: false }), ok ? 2000 : 3200); };\n"
            "    try { navigator.clipboard.writeText(this.email).then(() => done(true), () => done(false)); } catch (e) { done(false); }")


OLD_COPY = ("navigator.clipboard && navigator.clipboard.writeText(this.email).catch(() => {});\n"
            "    this.setState({ toast: %s, happy: true });\n"
            "    clearTimeout(this.toastT); this.toastT = setTimeout(() => this.setState({ toast: '', happy: false }), 2000);")

# Q03: the inactive layer (Hero vs Channels) is inert, and when a switch
# strands keyboard focus the active layer's first control receives it.
FOCUS_HANDOFF = """  handoff = mode => {
    const a = document.activeElement;
    if (!a || a === document.body) return;
    clearTimeout(this.focusT);
    this.focusT = setTimeout(() => {
      const b = document.activeElement;
      const lost = !b || b === document.body || (b.closest && b.closest('[inert]')) || (b.checkVisibility && !b.checkVisibility({ visibilityProperty: true }));
      if (!lost) return;
      const el = document.querySelector(mode === 'ch' ? '[data-v3-focus="ch"]' : '[data-v3-layer="home"] a, [data-v3-layer="home"] button');
      if (el) el.focus({ preventScroll: true });
    }, 60);
  };
  componentDidMount() {"""


def tag_header_nav(tpl):
    """Top-nav interaction role (v3.css .v3-navfx-*): the header's first link is
    the brand, the language toggle is `lang`, every other link/button is a nav
    item. Language segments get data-active from the route language."""
    def one(m):
        h = m.group(0)
        items = list(re.finditer(r'<(a|button)\b', h))
        if not items:
            return h
        out, last = [], 0
        for k, it in enumerate(items):
            end = h.index('>', it.start())
            tag = h[it.start():end]
            if k == 0:
                cls = "v3-navfx-brand"
            elif re.search(r'onSwitchLang|toggleLang|切換語言|switchLang', tag):
                cls = "v3-navfx-lang"
            else:
                cls = "v3-navfx v3-navfx--gen"
            out.append(h[last:it.end()] + f' class="{cls}"')
            last = it.end()
        h = "".join(out) + h[last:]
        # brand parts: the LED square and the name
        b0 = h.index('class="v3-navfx-brand"')
        b1 = h.index('ANGELA YU', b0)
        brand = h[b0:b1]
        brand = brand.replace('<span style="width:', '<span class="v3-navfx-led" style="width:', 1)
        k = brand.rfind('<span style="')
        brand = brand[:k] + '<span class="v3-navfx-name" style="' + brand[k + len('<span style="'):]
        h = h[:b0] + brand + h[b1:]
        # language segments
        h = re.sub(r'<span style="\{\{ (zh|en)Seg(D?) \}\}">', r'<span data-active="{{ \1Active }}" style="{{ \1Seg\2 }}">', h)
        h = re.sub(r'<span style="([^"]*background:\{\{ (zh|en)Bg \}\}[^"]*)">', r'<span data-active="{{ \2Active }}" style="\1">', h)
        return h
    tpl, n = re.subn(r'<header\b[\s\S]*?</header>', one, tpl)
    if n < 1:
        raise SystemExit("header not found for nav interaction tagging")
    return tpl


def sub_exact(src, old, new, count=None, must=True):
    n = src.count(old)
    if must and n == 0:
        raise SystemExit(f"patch target not found: {old[:80]!r}")
    if count is not None and n != count:
        raise SystemExit(f"expected {count}× {old[:60]!r}, found {n}")
    return src.replace(old, new)


def split(src):
    i = src.index('<script type="text/x-dc"')
    return src[:i], src[i:]


def i18n_index(src):
    tpl, logic = split(src)
    for key, zh in sorted(INDEX_STRINGS.items(), key=lambda kv: -len(kv[1])):
        # template text nodes and attribute values
        tpl = tpl.replace(f">{zh}<", f">{{{{ L.{key} }}}}<")
        tpl = tpl.replace(f'="{zh}"', f'="{{{{ L.{key} }}}}"')
        # logic string literals
        logic = logic.replace(f"'{zh}'", f"this.props.L.{key}")
    return tpl + logic


def patch_index(src, mobile):
    tpl, logic = split(src)
    # --- Q02: copy feedback only after a successful clipboard write
    logic = sub_exact(logic, OLD_COPY % "`Email 已複製：${this.email}`", copy_body("this.props.L.emailCopied", "this.props.L.copyFailed"), count=1)
    # --- GA4: announce a user channel change (components/site/Analytics.tsx
    #     forwards it as select_channel; a no-op when analytics is off)
    TRACK = "try { const tc = this.cases.find(x => x.no === no); window.dispatchEvent(new CustomEvent('v3:track', { detail: { name: 'select_channel', params: { channel_id: 'CH' + (tc ? tc.ch : no), case_id: 'CASE' + no } } })); } catch (e) {}"
    logic = sub_exact(logic, "    if (!force && (no === this.state.no || this.busy)) return;\n    this.clear(); this.busy = true;\n",
                      "    if (!force && (no === this.state.no || this.busy)) return;\n    this.clear(); this.busy = true;\n    " + TRACK + "\n", count=1)
    if mobile:
        logic = sub_exact(logic, "  jump = no => { const c", "  jump = no => { " + TRACK + " const c", count=1)
    else:
        logic = sub_exact(logic, "  jump = no => {\n    this.press();\n", "  jump = no => {\n    " + TRACK + "\n    this.press();\n", count=1)
    # --- Q03: hidden layer is inert; focus is handed to the active layer
    tpl = sub_exact(tpl, '<a href="{{ cur.url }}" target="_blank"', '<a href="{{ cur.url }}" target="_blank" inert="{{ chInert }}" data-v3-focus="ch"', count=1)
    tpl = re.sub(r'<div style="(position:absolute;inset:0;background:radial-gradient[^"]*pointer-events:\{\{ heroPE \}\}[^"]*)">', r'<div inert="{{ heroInert }}" data-v3-layer="home" style="\1">', tpl, count=1)
    if 'data-v3-layer="home"' not in tpl:
        raise SystemExit("hero layer not found")
    logic = sub_exact(logic, "heroOp: ch ? 0 : 1, heroPE:", "heroInert: ch, chInert: !ch, heroOp: ch ? 0 : 1, heroPE:", count=1)
    logic = sub_exact(logic, "  componentDidMount() {", FOCUS_HANDOFF, count=1)
    logic = sub_exact(logic, "  enterCh = () => {\n    if (this.state.mode === 'ch') return;\n", "  enterCh = () => {\n    if (this.state.mode === 'ch') return;\n    this.handoff('ch');\n", count=1)
    if mobile:
        logic = sub_exact(logic, "  enterHome = () => { if (this.state.mode === 'home') return;", "  enterHome = () => { if (this.state.mode === 'home') return; this.handoff('home');", count=1)
    else:
        logic = sub_exact(logic, "  enterHome = () => {\n    if (this.state.mode === 'home') return;\n", "  enterHome = () => {\n    if (this.state.mode === 'home') return;\n    this.handoff('home');\n", count=1)
    # --- Q01: hooks for the short-landscape rule in components/v3/v3.css
    if mobile:
        tpl = sub_exact(tpl, '<main style="position:relative;flex:1;min-height:0;min-width:0;', '<main data-v3m="main" style="position:relative;flex:1;min-height:0;min-width:0;', count=1)
        tpl = sub_exact(tpl, '<div style="flex:1;min-height:0;display:flex;flex-direction:column;padding:8px 8px 0;border-radius:26px;', '<div data-v3m="tv" style="flex:1;min-height:0;display:flex;flex-direction:column;padding:8px 8px 0;border-radius:26px;', count=1)
        tpl = sub_exact(tpl, '<h1 style="margin:0;font:900 19cqw/.84', '<h1 data-v3m="name" style="margin:0;font:900 19cqw/.84', count=1)
    # --- brand group = one Home link (Angela 2026-10-10). INDEX is Home: the
    #     link keeps its href for semantics / new-tab, but a plain click runs
    #     the in-page Home action (no reload, no transition).
    if mobile:
        tpl = sub_exact(tpl, '<button onClick="{{ goHome }}" aria-label="回到首頁" style="border:0;background:none;cursor:pointer;display:flex;gap:10px;align-items:center;height:44px;padding:0;color:#f4f1ea"><span style="width:9px;height:9px;border-radius:3px;background:#d4f04a;animation:abBreath 1.8s ease-in-out infinite"></span><span style="font:700 13px \'JetBrains Mono\';letter-spacing:.2em">ANGELA YU</span></button>',
                        '<a href="{{ homeHref }}" onClick="{{ brandHome }}" aria-label="{{ L.brandHome }}" style="border:0;background:none;cursor:pointer;display:flex;gap:10px;align-items:center;height:44px;padding:0;color:#f4f1ea"><span style="width:9px;height:9px;border-radius:3px;background:#d4f04a;animation:abBreath 1.8s ease-in-out infinite"></span><span style="font:700 13px \'JetBrains Mono\';letter-spacing:.2em">ANGELA YU</span></a>', count=1)
        logic = sub_exact(logic, "goHome: () => this.enterHome(),", "goHome: () => this.enterHome(), brandHome: e => { if (e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; e.preventDefault(); this.enterHome(); },", count=1)
    else:
        brand = '<span style="display:flex;gap:14px;align-items:center"><span style="width:10px;height:10px;border-radius:3px;background:#d4f04a;animation:abBreath 1.8s ease-in-out infinite"></span><span style="font:700 15px \'JetBrains Mono\';letter-spacing:.22em;color:#f4f1ea">ANGELA YU</span><span style="width:1px;height:14px;background:rgba(244,241,234,.2)"></span><span style="font:500 12px \'JetBrains Mono\';letter-spacing:.18em;color:rgba(244,241,234,.5)">PORTFOLIO</span></span>'
        tpl = sub_exact(tpl, brand, '<a href="{{ homeHref }}" onClick="{{ brandHome }}" aria-label="{{ L.brandHome }}" style="display:flex;gap:14px;align-items:center;color:#f4f1ea"' + brand[len('<span style="display:flex;gap:14px;align-items:center"'):-len('</span>')] + '</a>', count=1)
        logic = sub_exact(logic, "showHome: () => this.scrollTo(0),", "showHome: () => this.scrollTo(0), brandHome: e => { if (e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; e.preventDefault(); this.scrollTo(0); },", count=1)
    # --- verified, published-only channel data from props
    logic = re.sub(r"cases = \[[\s\S]*?\]\.map\(c => \(\{ \.\.\.c,", "cases = (this.props.channels || []).map(c => ({ ...c,", logic, count=1)
    logic = sub_exact(logic, "url(https://angela-portfolio-phi.vercel.app/images/home/case${c.no}-home-visual.webp)",
                      "url(${c.img || '/images/home/case' + c.no + '-home-visual.webp'})")
    # per-channel focal point (data/v3/channels.ts CHANNEL_POS); default center
    logic = sub_exact(logic, "-home-visual.webp'}) center/cover", "-home-visual.webp'}) ${c.pos || 'center'}/cover", count=1)
    if mobile:
        # phone-portrait TV framing (data/v3/channels.ts CHANNEL_PHONE_FRAME);
        # the strip thumbnails keep `bg`
        logic = sub_exact(logic, "    url: c.pub ?", "    bgPhone: c.pub ? `url(${c.img || '/images/home/case' + c.no + '-home-visual.webp'}) ${c.mpos || c.pos || 'center'}/${c.msize || 'cover'} no-repeat, #15161b` : '',\n    url: c.pub ?", count=1)
        logic = sub_exact(logic, "heroInert: ch, chInert: !ch,", "tvBg: Number(this.props.vw) < 600 && cur.bgPhone ? cur.bgPhone : cur.bg, heroInert: ch, chInert: !ch,", count=1)
        tpl = sub_exact(tpl, '<div style="position:absolute;inset:0;background:{{ cur.bg }};transform:{{ fx.zoom }};', '<div style="position:absolute;inset:0;background:{{ tvBg }};transform:{{ fx.zoom }};', count=1)
    logic = sub_exact(logic, "`https://angela-portfolio-phi.vercel.app/design-samples/case-final-${c.no}`",
                      "`${this.props.prefix || ''}/design-samples/case-final-${c.no}`")
    logic = sub_exact(logic, "resume = 'https://drive.google.com/uc?export=download&id=1um1vszVCmhPuvDMM7QBVRdW07BnYY1s8';",
                      "resume = this.props.resumeHref;")
    logic = sub_exact(logic, "'About Page v2.dc.html'", "this.props.aboutHref", must=False)
    # --- digit keys pick a channel BY NUMBER (only published channels exist;
    #     indexing the array would crash on unpublished numbers and renumber)
    if mobile:
        logic = sub_exact(logic, "else if (/^[1-8]$/.test(e.key)) { const c = C[+e.key - 1];",
                          "else if (/^[1-8]$/.test(e.key) && C.some(x => +x.no === +e.key)) { const c = C.find(x => +x.no === +e.key);")
        # production renders no device chrome (prototype phone frame / status bar)
        logic = sub_exact(logic, "const phoneF = Number(this.props.vw ?? 390) < 600;", "const phoneF = false;")
        logic = re.sub(r"frameR: phoneF \? '46px' : '6px', frameSh: phoneF \? '[^']*' : '[^']*'", "frameR: '0px', frameSh: 'none'", logic, count=1)
    else:
        logic = sub_exact(logic, "else if (/^[1-8]$/.test(e.key)) { const c = this.cases[+e.key - 1];",
                          "else if (/^[1-8]$/.test(e.key) && this.cases.some(x => +x.no === +e.key)) { const c = this.cases.find(x => +x.no === +e.key);")
        # the email address is never printed (standing release rule) — the
        # button keeps copy-to-clipboard and shows the Copy Email label
        logic = sub_exact(logic, "emailLabel: s.toast ? '已複製 ✓' : this.email,", "emailLabel: s.toast ? '已複製 ✓' : '複製 Email',")
        tpl = sub_exact(tpl, "← → · 1–8", "← → · 1–{{ chMaxDigit }}")
    # --- the "view case" CTA is internal navigation: same tab (+ Page Transition 01);
    #     the prototype opened the deployed case in a new tab
    tpl = sub_exact(tpl, '<a href="{{ cur.url }}" target="_blank"', '<a href="{{ cur.url }}"', count=1)
    # --- template: links, résumé, channel range, socials placeholder, language pill
    tpl = sub_exact(tpl, 'href="https://drive.google.com/uc?export=download&amp;id=1um1vszVCmhPuvDMM7QBVRdW07BnYY1s8"', 'href="{{ resumeHref }}"')
    tpl = sub_exact(tpl, 'href="About Page v2.dc.html"', 'href="{{ aboutHref }}"')
    tpl = tpl.replace("CH 01–08", "CH 01–{{ chMax }}")
    if mobile:
        tpl = re.sub(r'<sc-if value="\{\{ showSocial \}\}"[^>]*>[\s\S]*?社群 · 待提供</span></sc-if>', "", tpl, count=1)
        if "社群 · 待提供" in tpl:
            raise SystemExit("mobile socials placeholder not removed")
        tpl = sub_exact(tpl, '<button aria-label="切換語言"', '<button onClick="{{ onSwitchLang }}" aria-label="切換語言"', count=1)
        tpl = sub_exact(tpl, '<span style="background:#f4f1ea;color:#0d0e11;border-radius:999px;padding:4px 8px">中</span><span style="padding:4px 8px;color:rgba(244,241,234,.6)">EN</span>',
                        '<span style="{{ zhSeg }}">中</span><span style="{{ enSeg }}">EN</span>')
    else:
        tpl = re.sub(r'<span style="[^"]*border:1px dashed[^"]*">社群連結 · 待提供</span>', "", tpl, count=1)
        if "社群連結 · 待提供" in tpl:
            raise SystemExit("desktop socials placeholder not removed")
        tpl = sub_exact(tpl, '<span style="display:flex;gap:2px;padding:3px;margin-left:10px;border:1px solid rgba(244,241,234,.2);border-radius:999px;font:500 12px \'JetBrains Mono\'"><span style="background:#f4f1ea;color:#0d0e11;border-radius:999px;padding:4px 10px">中</span><span style="padding:4px 10px;color:rgba(244,241,234,.6)">EN</span></span>',
                        '<a href="{{ switchHref }}" data-no-transition="1" onClick="{{ onSwitchLang }}" aria-label="{{ L.switchLang }}" style="display:flex;gap:2px;padding:3px;margin-left:10px;border:1px solid rgba(244,241,234,.2);border-radius:999px;font:500 12px \'JetBrains Mono\'"><span style="{{ zhSegD }}">中</span><span style="{{ enSegD }}">EN</span></a>')
    if not mobile:
        # Channel strip (approved layout, 7 published channels): the strip lives in
        # an auto-sized grid track, so its 12.5%-wide thumbnails resolved against
        # the strip's own max-content (long EN titles) and pushed it past the TV
        # into the Remote column. Constrain the track to the TV column and size
        # every slot (and the selection bar) by the real channel count.
        tpl = sub_exact(tpl, '<div style="position:relative;height:116px;display:grid">', '<div style="position:relative;height:116px;display:grid;grid-template-columns:minmax(0,1fr);min-width:0">', count=1)
        tpl = sub_exact(tpl, '<div style="grid-area:1/1;position:relative;display:flex;opacity:{{ chOp }};', '<div style="grid-area:1/1;position:relative;display:flex;min-width:0;opacity:{{ chOp }};', count=1)
        tpl = sub_exact(tpl, 'aria-label="{{ g.aria }}" aria-current="{{ g.curAttr }}" style="width:12.5%;flex:none;', 'aria-label="{{ g.aria }}" title="{{ g.aria }}" aria-current="{{ g.curAttr }}" style="width:{{ gW }};min-width:0;flex:none;', count=1)
        tpl = sub_exact(tpl, 'left:{{ gLeft }};top:0;width:12.5%;', 'left:{{ gLeft }};top:0;width:{{ gW }};', count=1)
        logic = sub_exact(logic, "gLeft: `${vIdx * 12.5}%`,", "gLeft: `${vIdx * (100 / Math.max(C.length, 1))}%`, gW: `${100 / Math.max(C.length, 1)}%`,", count=1)
    # template-literal strings (Nemu / Remote copy with live values)
    logic = sub_exact(logic, "`CH${cur.no} 訊號清晰。正在播放：${cur.t}。`", "this.props.L.tuned.replace('{no}', cur.no).replace('{t}', cur.t)")
    logic = sub_exact(logic, "`換分類 · ${tab.l}`", "this.props.L.switchTab.replace('{tab}', tab.l)")
    logic = sub_exact(logic, "`直接選台：CH${c.no} ${c.t}`", "this.props.L.jumpTo.replace('{no}', c.no).replace('{t}', c.t)")
    tpl = tpl.replace("> / 08<", "> / {{ chMax }}<")
    # --- presentation order (data/v3/order.ts): `no` stays the permanent CASE
    #     number (routes, images, state); every VISIBLE "CH NN" and the digit
    #     keys use the channel slot `ch`. Attribute bindings (data-no) keep `no`.
    tpl, k = re.subn(r'(?<!=")\{\{ (cur|g|u)\.no \}\}', r'{{ \1.ch }}', tpl)
    if k < 5:
        raise SystemExit(f"channel slot labels: only {k} template replacements")
    logic = sub_exact(logic, "aria: `CH${c.no} ${c.t}`", "aria: `CH${c.ch} ${c.t}`", count=1)
    logic = sub_exact(logic, "upnext: C.map(c => ({ no: c.no,", "upnext: C.map(c => ({ no: c.no, ch: c.ch,", count=1)
    logic, k = re.subn(r"\.replace\('\{no\}', (c|cur)\.no\)", r".replace('{no}', \1.ch)", logic)
    if k < 2:
        raise SystemExit(f"slot label in L strings: {k}")
    logic, k = re.subn(r"`CH \$\{cur\.no\}`", "`CH ${cur.ch}`", logic)
    if k < 1:
        raise SystemExit("Remote context slot label not found")
    logic = sub_exact(logic, "`CH ${s.no}`", "`CH ${cur.ch}`", count=1)  # TV readout
    logic, k = re.subn(r"\+x\.no === \+e\.key", "+x.ch === +e.key", logic)
    if k < 2:
        raise SystemExit(f"digit keys by slot: {k}")
    # --- Channel strip input (iPhone drag-drift bug, 2026-10-11).
    # (1) Busy CRT switch: a channel requested while a switch is running was
    #     dropped (taps 60–500 ms apart were ignored). Remember the latest
    #     request and apply it when the switch finishes.
    logic = sub_exact(logic, "    if (!force && (no === this.state.no || this.busy)) return;\n",
                      "    if (!force && this.busy && no !== this.state.no) { this.queued = no; return; }\n    if (!force && (no === this.state.no || this.busy)) return;\n    this.queued = null;\n", count=1)
    logic = sub_exact(logic, "this.busy = false;", "this.busy = false; this.flushQueued();")
    logic = sub_exact(logic, "  componentDidMount() {", "  flushQueued = () => { const q = this.queued; this.queued = null; if (q && q !== this.state.no) this.zap(q); };\n  componentDidMount() {", count=1)
    if mobile:
        # (2) Centering after a selection wrote scrollLeft every frame for
        #     320 ms from a stale start position, overriding the user's finger
        #     (drags swallowed or reversed; jumps after a fling). Use the
        #     browser's smooth scroll, which user scrolling cancels natively,
        #     and drop a pending centre as soon as the user touches the strip.
        logic = sub_exact(logic, """    cancelAnimationFrame(this.scrRaf);
    if (this.reduce || Math.abs(to - from) < 2) { st.scrollLeft = to; return; }
    const t0 = performance.now(), D = 320;
    const tick = now => { const p = Math.min(1, (now - t0) / D), e = 1 - Math.pow(1 - p, 3); st.scrollLeft = from + (to - from) * e; if (p < 1) this.scrRaf = requestAnimationFrame(tick); };
    this.scrRaf = requestAnimationFrame(tick);
  };""", """    if (Math.abs(to - from) < 2) return;
    st.scrollTo({ left: to, behavior: this.reduce ? 'auto' : 'smooth' });
  };""", count=1)
        # (3) Strip stability on iPhone (2026-10-11, follow-up). overflow-x:auto
        #     made the strip a two-axis scroller, so iOS let diagonal swipes
        #     move the thumbnails vertically, and the edges rubber-banded.
        #     Make it horizontal-only with no edge bounce (the page still
        #     scrolls vertically). While a finger is down or the strip is
        #     coasting, never centre it, and a tap that stops a fling does not
        #     select a channel. A touch whose end event never arrives stops
        #     counting as held after 1 s without touch or scroll activity.
        tpl = sub_exact(tpl, "overflow-x:auto;scrollbar-width:none;padding:6px 2px 0;", "overflow-x:auto;overflow-y:hidden;overscroll-behavior-x:none;scrollbar-width:none;padding:6px 2px 0;", count=1)
        logic = sub_exact(logic, "    const st = this.strip.current; if (!st) return;\n", "    if (this.stripCoast || (this.stripHeld && performance.now() - Math.max(this.stripTouchAt || 0, this.userScrollAt || 0) < 1000)) return;\n    const st = this.strip.current; if (!st) return;\n", count=1)
        logic = sub_exact(logic, "        on: () => { this.press(); this.zap(c.no); } }; }),", "        on: () => { if (performance.now() < (this.catchUntil || 0)) return; this.press(); this.zap(c.no); } }; }),", count=1)
        logic = sub_exact(logic, "      stripScroll: () => { if (this.state.open) close(); },\n", """      stripTouch: e => {
        if (e && e.type === 'pointerdown' && e.pointerType === 'touch') return;
        clearTimeout(this.ctrT);
        if (!this.stripHeld || (e && e.type === 'touchstart' && e.touches && e.touches.length === 1)) { this.stripCatch = performance.now() - (this.userScrollAt || 0) < 120; this.stripMoved = false; }
        this.stripHeld = true; this.stripTouchAt = performance.now();
      },
      stripRelease: e => {
        if (!this.stripHeld || (e && e.type.startsWith('pointer') && e.pointerType === 'touch')) return;
        this.stripHeld = false; this.catchUntil = this.stripCatch ? performance.now() + 350 : 0; this.stripCatch = false;
        this.stripCoast = this.stripMoved; if (this.stripCoast) this.stripIdle();
      },
      stripWheel: () => { clearTimeout(this.ctrT); this.stripCoast = true; this.userScrollAt = performance.now(); this.stripIdle(); },
      stripScroll: () => { if (this.stripHeld || this.stripCoast) { this.stripMoved = true; this.userScrollAt = performance.now(); this.stripIdle(); } if (this.state.open) close(); },
""", count=1)
        logic = sub_exact(logic, "  flushQueued = () =>", "  stripIdle = () => { clearTimeout(this.coastT); this.coastT = setTimeout(() => { if (!this.stripHeld) this.stripCoast = false; }, 160); };\n  flushQueued = () =>", count=1)
        tpl = sub_exact(tpl, '<div ref="{{ strip }}" onScroll="{{ stripScroll }}"', '<div ref="{{ strip }}" onScroll="{{ stripScroll }}" onPointerDown="{{ stripTouch }}" onTouchStart="{{ stripTouch }}" onPointerUp="{{ stripRelease }}" onPointerCancel="{{ stripRelease }}" onTouchEnd="{{ stripRelease }}" onTouchCancel="{{ stripRelease }}" onWheel="{{ stripWheel }}"', count=1)
    tpl = tag_header_nav(tpl)
    out = i18n_index(tpl + logic)
    # Q02: the button reads "Copied" only after a successful write
    return sub_exact(out, "emailLabel: s.toast ? this.props.L.copied :", "emailLabel: s.copyOk ? this.props.L.copied : s.copyFail ? this.props.L.copyFailedShort :", count=1)


def patch_about(src):
    tpl, logic = split(src)
    # language comes from the route (/about vs /en/about), not localStorage
    logic = re.sub(r"state = \{ lang: 'zh',", "state = { lang: (this.props.lang === 'en' ? 'en' : 'zh'),", logic, count=1)
    logic = sub_exact(logic, "try { const l = localStorage.getItem('ay-lang'); if (l === 'en' || l === 'zh') this.setState({ lang: l }); } catch (e) {}", "")
    n = len(re.findall(r"toggleLang: \(\) => \{[^\n]*?180\); \},", logic))
    if n != 1:
        raise SystemExit(f"toggleLang pattern found {n}x")
    logic = re.sub(r"toggleLang: \(\) => \{[^\n]*?180\); \},", "toggleLang: (e) => { this.props.onSwitchLang && this.props.onSwitchLang(e); },", logic, count=1)
    # the email address is never printed (release rule): the copy button shows
    # the approved V2 label; copy-to-clipboard + "Copied" confirmation unchanged
    logic = sub_exact(logic, "emailLabel: s.toast ? t.copied : this.email,", "emailLabel: s.copyOk ? t.copied : s.copyFail ? (s.lang === 'en' ? 'Couldn\\'t copy' : '無法複製') : (s.lang === 'en' ? 'Copy email' : '複製 Email'),", count=1)
    # Q02: confirm only after the clipboard write succeeds (localized failure)
    fail = "(this.state.lang === 'en' ? 'Couldn\\'t copy the email — clipboard unavailable.' : '無法存取剪貼簿，Email 未複製。')"
    if OLD_COPY % "this.T[this.state.lang].copiedMsg" in logic:
        logic = sub_exact(logic, OLD_COPY % "this.T[this.state.lang].copiedMsg", copy_body("this.T[this.state.lang].copiedMsg", fail), count=1)
    else:
        logic = sub_exact(logic, "const copy = () => { navigator.clipboard && navigator.clipboard.writeText(this.email).catch(() => {}); this.setState({ toast: t.copiedMsg, happy: true }); clearTimeout(this.toastT); this.toastT = setTimeout(() => this.setState({ toast: '', happy: false }), 2000); };",
                          "const copy = () => { " + copy_body("t.copiedMsg", fail).replace("\n    ", " ") + " };", count=1)
        # Q13: the Nemu chat close button is labelled in the page language
        tpl = sub_exact(tpl, 'aria-label="關閉對話"', 'aria-label="{{ closeChatL }}"', count=1)
        logic = sub_exact(logic, "copyEmail: copy,", "copyEmail: copy, closeChatL: s.lang === 'en' ? 'Close conversation' : '關閉對話',", count=1)
    # active language segment uses the V3 brand lime (token) with dark text
    logic = sub_exact(logic, "zhBg: s.lang === 'zh' ? INK : 'transparent', zhFg: s.lang === 'zh' ? '#0d0e11' :", "zhBg: s.lang === 'zh' ? 'var(--v3-lime)' : 'transparent', zhFg: s.lang === 'zh' ? 'var(--v3-on-lime)' :", count=1)
    logic = sub_exact(logic, "enBg: s.lang === 'en' ? INK : 'transparent', enFg: s.lang === 'en' ? '#0d0e11' :", "enBg: s.lang === 'en' ? 'var(--v3-lime)' : 'transparent', enFg: s.lang === 'en' ? 'var(--v3-on-lime)' :", count=1)
    # Remote chapter menu (Angela 2026-10-10): the list starts right under
    # 「想跳到哪一段？」 — no bottom-pushing spacer and no reserved prompt height in
    # the chapters menu; the main menu keeps its layout. Desktop Remote only.
    spacer = '<div aria-live="polite" style="min-height:{{ msgMin }};padding:0 4px">{{ msg }}</div>\n<div style="flex:1"></div>'
    if spacer in tpl:
        tpl = sub_exact(tpl, spacer, spacer.replace('<div style="flex:1"></div>', '<div style="flex:1;display:{{ spacerDisp }}"></div>'), count=1)
        logic = sub_exact(logic, "const msgMin = s.menu === 'toc' ? '52px' : '112px';", "const msgMin = s.menu === 'toc' ? '0px' : '112px', spacerDisp = s.menu === 'toc' ? 'none' : 'block';", count=1)
        logic = sub_exact(logic, "      msgMin,", "      msgMin, spacerDisp,", count=1)
    # ABOUT Chapter 03 (Process) motion pacing (Angela 2026-10-11): the four-stage
    # cycle 01→02→03→04 runs ~8.6 s instead of 11.4 s (2.0 s ×3 + 2.6 s hold on 04,
    # was 2.6 s ×3 + 3.6 s). In-stage stagger shortened so every stage still
    # completes inside its shorter window (line draw, particles, ring, 7-node
    # scan). Stages, graphics, text and manual selection (resets the timer,
    # immediate) unchanged; reduced motion still disables autoplay and motion.
    if "STEP_MS = 2600;" in logic:
        for a, b, n in (
            ("STEP_MS = 2600;", "STEP_MS = 2000;", 1),
            ("(step === 3 ? 3600 : this.STEP_MS)", "(step === 3 ? 2600 : this.STEP_MS)", 2),
            ("const delay = step === 2 ? (i >= 3 ? 380 : 120) : 80 + i * 60, p = mo && lt ? ez(cl((v - delay) / 420)) : 1;",
             "const delay = step === 2 ? (i >= 3 ? 240 : 80) : 60 + i * 40, p = mo && lt ? ez(cl((v - delay) / 340)) : 1;", 1),
            ("if (!mo || !lt || v < 700)", "if (!mo || !lt || v < 450)", 1),
            ("q = ((v - 700) / 1100 + i * 0.13) % 1;", "q = ((v - 450) / 900 + i * 0.13) % 1;", 1),
            ("q = ((v - 700) / 1300 + (i >= 3 ? 0.5 : 0) + (i % 3) * 0.08) % 1;", "q = ((v - 450) / 1000 + (i >= 3 ? 0.5 : 0) + (i % 3) * 0.08) % 1;", 1),
            ("if (step === 1 && mo && v > 600) { const q = ((v - 600) % 1100) / 1100", "if (step === 1 && mo && v > 400) { const q = ((v - 400) % 900) / 900", 1),
            ("step === 2 && mo && v > 700 ? Math.floor((v - 700) / 260) % 7", "step === 2 && mo && v > 450 ? Math.floor((v - 450) / 180) % 7", 1),
        ):
            logic = sub_exact(logic, a, b, count=n)
    # production renders no device chrome (prototype phone frame / status bar)
    logic = logic.replace("isPhone: phone,", "isPhone: false,")
    logic = re.sub(r"frameR: phone \? '46px' : '6px', frameSh: phone \? '[^']*' : '[^']*',", "frameR: '0px', frameSh: 'none',", logic)
    logic = logic.replace("scTop: phone ? '47px' : '0px',", "scTop: '0px',")
    # Remote "Explore work" options (logic code) → INDEX Channels
    logic = logic.replace("href: 'Index V3.dc.html'", "href: this.props.workHref")
    # links to INDEX: Work → Channels, everything else → Home
    tpl = re.sub(r'href="Index V3\.dc\.html"(?=[^>]*>\s*\{\{ t\.(?:navWork|toWork) \}\})', 'href="{{ workHref }}"', tpl)
    tpl = tpl.replace('href="Index V3.dc.html"', 'href="{{ homeHref }}"')

    # brand group = Home link with an accessible name (Angela 2026-10-10)
    brand_hits = 0
    for a in ('<a href="{{ homeHref }}" style="display:flex;gap:14px;align-items:center;color:#f4f1ea">',
              '<a href="{{ homeHref }}" style="display:flex;gap:12px;align-items:center;color:#f4f1ea;height:44px">'):
        if a in tpl:
            brand_hits += 1
            tpl = sub_exact(tpl, a, a.replace('<a href="{{ homeHref }}"', '<a href="{{ homeHref }}" aria-label="{{ brandL }}"'), count=1)
            logic = sub_exact(logic, "toggleLang: (e) =>", "brandL: s.lang === 'en' ? 'Back to Home' : '返回首頁', toggleLang: (e) =>", count=1)
    if '<header' in tpl and brand_hits == 0:
        raise SystemExit("ABOUT brand link not found for its accessible name")
    # nav interaction role — after the brand label patch above (it matches the bare <a href>)
    if '<header' in tpl:
        tpl = tag_header_nav(tpl)
        logic = sub_exact(logic, "toggleLang: (e) =>", "zhActive: s.lang === 'zh' ? 'true' : 'false', enActive: s.lang === 'en' ? 'true' : 'false', toggleLang: (e) =>", count=1)
    # Chapter 05 illustration viewer is a real modal (Stage 3 P1, 2026-10-11):
    # aria-modal; everything outside it is inert while open, so Tab and Enter
    # can't reach the chapter controls; focus moves to the existing
    # "ESC / 點擊關閉" hint, now a button styled exactly as before; Escape,
    # that button and a click anywhere close it, and focus returns to the
    # image trigger. Hidden (visibility) once its fade-out ends.
    # Desktop and tablet only; the phone layout has no viewer.
    if 'role="dialog" aria-label="{{ t.artAlt }}"' in tpl:
        tpl = sub_exact(tpl, '<div role="dialog" aria-label="{{ t.artAlt }}" onClick="{{ closeArt }}" style="',
                        '<div ref="{{ lbRef }}" role="dialog" aria-modal="true" aria-label="{{ t.artAlt }}" onClick="{{ closeArt }}" style="', count=1)
        tpl = sub_exact(tpl, "opacity:{{ lbOp }};pointer-events:{{ lbPE }};transition:opacity .3s;cursor:zoom-out",
                        "opacity:{{ lbOp }};pointer-events:{{ lbPE }};visibility:{{ lbVis }};transition:opacity .3s,visibility 0s linear {{ lbVisDelay }};cursor:zoom-out", count=1)
        tpl = sub_exact(tpl, "<span style=\"font:500 12px 'JetBrains Mono';letter-spacing:.16em;color:rgba(244,241,234,.6)\">{{ t.lbHint }}</span>",
                        "<button ref=\"{{ lbCloseRef }}\" type=\"button\" style=\"border:0;background:none;padding:0;cursor:pointer;font:500 12px 'JetBrains Mono';letter-spacing:.16em;color:rgba(244,241,234,.6)\">{{ t.lbHint }}</button>", count=1)
        logic = sub_exact(logic, "tiltRef = React.createRef();", "tiltRef = React.createRef(); lbRef = React.createRef(); lbCloseRef = React.createRef();", count=1)
        logic = sub_exact(logic, "tiltRef: this.tiltRef,", "tiltRef: this.tiltRef, lbRef: this.lbRef, lbCloseRef: this.lbCloseRef,", count=1)
        logic = sub_exact(logic, "      openArt: () => { this.press(); this.setState({ lb: true }); }, closeArt: () => this.setState({ lb: false }),",
                          "      openArt: () => { this.press(); this.lbOpen(); }, closeArt: () => this.lbClose(),\n"
                          "      lbVis: s.lb ? 'visible' : 'hidden', lbVisDelay: s.lb ? '0s' : '.3s',", count=1)
        logic = sub_exact(logic, "      if (e.key === 'Escape' && this.state.lb) { this.setState({ lb: false }); return; }\n      if (this.state.lb) return;",
                          "      if (e.key === 'Escape' && this.state.lb) { this.lbClose(); return; }\n"
                          "      if (this.state.lb) { if (e.key === 'Tab') { e.preventDefault(); this.lbCloseRef.current && this.lbCloseRef.current.focus(); } return; }", count=1)
        logic = sub_exact(logic, "  componentWillUnmount() {\n",
                          "  lbOpen = () => {\n"
                          "    if (this.lbOn) return; this.lbOn = true; this.inerted = [];\n"
                          "    this.setState({ lb: true }, () => {\n"
                          "      if (!this.lbOn) return;\n"
                          "      for (let n = this.lbRef.current; n && n !== document.body; n = n.parentElement) for (const sib of n.parentElement ? n.parentElement.children : []) if (sib !== n && !sib.inert) { sib.inert = true; this.inerted.push(sib); }\n"
                          "      this.lbCloseRef.current && this.lbCloseRef.current.focus({ preventScroll: true });\n"
                          "    });\n"
                          "  };\n"
                          "  lbClose = () => {\n"
                          "    if (!this.lbOn) return; this.lbOn = false;\n"
                          "    (this.inerted || []).forEach(n => { n.inert = false; }); this.inerted = [];\n"
                          "    this.setState({ lb: false }, () => { if (!this.lbOn && this.tiltRef.current) this.tiltRef.current.focus({ preventScroll: true }); });\n"
                          "  };\n"
                          "  componentWillUnmount() {\n"
                          "    (this.inerted || []).forEach(n => { n.inert = false; });\n", count=1)
    return tpl + logic


# Angela (2026-10-11): no Senior self-positioning anywhere on the site.
# Applied to every reference before the other patches; fails loudly if the
# references change so the wording can't silently come back.
SENIOR_FIXES = (
    ("ABOUT — SENIOR UI/UX DESIGNER", "ABOUT — UI/UX DESIGNER"),
    ("SENIOR UI/UX DESIGNER", "UI/UX DESIGNER"),
)


def drop_senior(src, name):
    for old, new in SENIOR_FIXES:
        src = src.replace(old, new)
    if re.search(r"senior|資深", src, re.I):
        raise SystemExit(f"{name}: unmapped Senior / 資深 wording left in the reference")
    return src


def compile_one(name, src, root_id=None, imports=None):
    path = WORK / f"{name}.dc.html"
    path.write_text(src)
    cmd = [sys.executable, "-I", str(ROOT / "tools/dc2react/dc2react.py"), str(path), name, str(OUT), "--map", json.dumps(URL_MAP)]
    if root_id:
        cmd += ["--root-id", root_id]
    for k, v in (imports or {}).items():
        cmd += ["--import", f"{k}={v}"]
    subprocess.run(cmd, check=True)
    gen = (OUT / f"{name}.tsx").read_text()
    body = gen.split("\"use client\";", 1)[1]
    leaks = re.findall(r"[^'\"`\s]*\.dc\.html|angela-portfolio-phi\.vercel\.app[^'\"`\s]*", body)
    if leaks:
        raise SystemExit(f"{name}: prototype-only references left in generated code: {sorted(set(leaks))}")
    left = sorted(set(re.findall(r"[\"']([^\"'\n]*[一-鿿][^\"'\n]*)[\"']", gen)))
    return left


def main():
    idx = drop_senior((REF / "Index V3.dc.html").read_text(), "Index V3")
    mob = drop_senior((REF / "IndexV3MobileScreen.dc.html").read_text(), "IndexV3MobileScreen")
    for name, src, rid in (("IndexV3Desktop", patch_index(idx, False), "2a"), ("IndexV3Mobile", patch_index(mob, True), None)):
        left = compile_one(name, src, rid)
        print(f"  {name}: ZH literals left (must be language-neutral or unreachable): {left}")
    about_desk = drop_senior((REF / "About V3 Desktop TV.dc.html").read_text(), "About V3 Desktop TV")
    about_scr = drop_senior((REF / "AboutV3Screen.dc.html").read_text(), "AboutV3Screen")
    about_tab = drop_senior((REF / "AboutV3TabletMotion.dc.html").read_text(), "AboutV3TabletMotion")
    for name, src, rid, imp in (
        ("AboutV3Desktop", patch_about(about_desk), "3a", None),
        ("AboutV3TabletMotion", patch_about(about_tab), None, None),
        ("AboutV3Screen", patch_about(about_scr), None, {"AboutV3TabletMotion": "AboutV3TabletMotion"}),
    ):
        left = compile_one(name, src, rid, imp)
        print(f"  {name}: ZH literals in generated file: {len(left)} (ABOUT ships its own zh/en tables)")
    css_files = sorted(x.name for x in OUT.glob("*.css") if x.name != "generated.css")
    (OUT / "generated.css").write_text("/* GENERATED — imports every compiled V3 component stylesheet. */\n" + "".join(f'@import "./{c}";\n' for c in css_files))


if __name__ == "__main__":
    main()
