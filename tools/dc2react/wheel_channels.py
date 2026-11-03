"""
Wheel / trackpad channel switching on the desktop INDEX board (prototype for
Angela's approval, 2026-11-03) — applied by build_v3.py after laptop_index.
The phone board (IndexV3Mobile) is unchanged.

In channel mode one wheel gesture changes one channel through the same
step(±1) → zap path as the Remote and the arrow keys (CRT switch, Nemu,
select_channel tracking, reduced motion). A gesture ends after 220 ms without
wheel events — the GESTURE_GAP of components/v3/useTvPageScroll.ts — and its
direction and outcome are decided by its first event:

  * a gesture that starts while a switch is running (`busy`), or within
    700 ms of tuning in, is swallowed, so a trackpad fling's momentum can't
    skip several channels
  * gaps are measured with the events' own timeStamp (input time), so a busy
    main thread can't split one gesture into two
  * no wraparound: down on the last channel does nothing
  * up on the first channel keeps the native scroll, so the board scrolls
    back and leaves channel mode (the existing onScroll threshold)
  * a gesture that starts in Home mode (the scroll that tunes in) never
    changes channel, even after it reaches channel mode
  * Laptop TV page scroll: while the page can still scroll down, a down
    gesture belongs to the page (useTvPageScroll scrolls it and swallows the
    rest of that gesture)
"""


def _sub(src, old, new, count=1):
    n = src.count(old)
    if n != count:
        raise SystemExit(f"wheel_channels: expected {count}× {old[:70]!r}, found {n}")
    return src.replace(old, new)


WHEEL_LOGIC = """  wheelCh = e => {
    if (e.ctrlKey || !e.deltaY || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
    const now = e.timeStamp, fresh = now - (this.wheelAt ?? -Infinity) >= 220;
    this.wheelAt = now;
    if (fresh) {
      const d = e.deltaY > 0 ? 1 : -1, l = this.list(), i = l.findIndex(c => c.no === this.state.no);
      const page = d > 0 && window.scrollY < document.documentElement.scrollHeight - window.innerHeight - 1;
      this.wheelHold = this.state.mode === 'ch' && !page && i >= 0 && !(d < 0 && i === 0);
      if (this.wheelHold && !this.busy && now - (this.chAt ?? -Infinity) >= 700 && l[i + d]) this.step(d);
    }
    if (this.wheelHold) e.preventDefault();
  };
  flushQueued = () =>"""


def wheel_index(src):
    src = _sub(src, "  flushQueued = () =>", WHEEL_LOGIC)
    src = _sub(src, "    this.handoff('ch');\n", "    this.handoff('ch');\n    this.chAt = performance.now();\n")
    src = _sub(src, "    window.addEventListener('keydown', this.onKey);\n",
               "    window.addEventListener('keydown', this.onKey);\n"
               "    this.wheelEl = this.scroller.current; if (this.wheelEl) this.wheelEl.addEventListener('wheel', this.wheelCh, { passive: false });\n")
    src = _sub(src, "    window.removeEventListener('keydown', this.onKey);\n",
               "    window.removeEventListener('keydown', this.onKey);\n"
               "    if (this.wheelEl) this.wheelEl.removeEventListener('wheel', this.wheelCh);\n")
    return src
