#!/usr/bin/env python3
"""
dc2react — compile an approved Claude Design `.dc.html` component into a
production React class component (+ scoped CSS), WITHOUT shipping the
prototype runtime (support.js).

Faithfulness rules (mirrors support.js semantics):
- template values = {...defaults(data-props), ...props, ...logic.renderVals()}
- {{ path }} bindings are plain paths; whole-attr bindings pass raw values
  (refs, handlers, elements); mixed strings interpolate
- <sc-if value>, <sc-for list as> (+ $index), <dc-import name ...>
- style-hover / style-active / style-before / style-after → generated
  classes; hover rules gated to fine pointers (handoff §3 interaction rule)
- logic class body copied verbatim; setState merges synchronously into
  logic.state then re-renders (runtime behavior)
- helmet <style>: keyframes renamed per component; global element rules
  scoped to the component root; fonts mapped to the V3 next/font vars

Usage: dc2react.py <src.dc.html> <OutName> <outdir> [--root-id ID] [--map JSON]
"""
import html
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"}
ATTR_MAP = {
    "class": "className", "for": "htmlFor", "tabindex": "tabIndex", "readonly": "readOnly",
    "maxlength": "maxLength", "autoplay": "autoPlay", "playsinline": "playsInline",
    "crossorigin": "crossOrigin", "srcset": "srcSet", "colspan": "colSpan", "rowspan": "rowSpan",
    "frameborder": "frameBorder", "allowfullscreen": "allowFullScreen", "autocomplete": "autoComplete",
    "stroke-width": "strokeWidth", "stroke-linecap": "strokeLinecap", "stroke-linejoin": "strokeLinejoin",
    "stroke-dasharray": "strokeDasharray", "stroke-dashoffset": "strokeDashoffset", "stroke-opacity": "strokeOpacity",
    "stroke-miterlimit": "strokeMiterlimit", "fill-rule": "fillRule", "clip-rule": "clipRule", "fill-opacity": "fillOpacity",
    "stop-color": "stopColor", "stop-opacity": "stopOpacity", "font-size": "fontSize", "font-family": "fontFamily",
    "font-weight": "fontWeight", "text-anchor": "textAnchor", "dominant-baseline": "dominantBaseline",
    "clip-path": "clipPath", "letter-spacing": "letterSpacing", "xlink:href": "xlinkHref", "xml:space": "xmlSpace",
    "shape-rendering": "shapeRendering", "vector-effect": "vectorEffect", "paint-order": "paintOrder",
}
BOOL_ATTRS = {"muted", "autoplay", "playsinline", "loop", "hidden", "disabled", "checked", "controls", "allowfullscreen", "readonly"}
EVENT_MAP = {"onclick": "onClick"}

CAMEL = "sc-camel-"


def encode_camel(src):
    src = re.sub(r"<(dc-import)((?:[^>\"']|\"[^\"]*\"|'[^']*')*)/>", r"<\1\2></\1>", src)
    return re.sub(r"(\s)([a-z]+[A-Z][A-Za-z0-9]*)(\s*=)", lambda m: m.group(1) + CAMEL + re.sub(r"[A-Z]", lambda c: "-" + c.group(0).lower(), m.group(2)) + m.group(3), src)


def kebab_to_camel(s):
    return re.sub(r"-([a-z])", lambda m: m.group(1).upper(), s)


class Node:
    def __init__(self, tag, attrs):
        self.tag, self.attrs, self.children = tag, attrs, []


class P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node("#root", [])
        self.stack = [self.root]

    def handle_starttag(self, tag, attrs):
        n = Node(tag, attrs)
        self.stack[-1].children.append(n)
        if tag not in VOID:
            self.stack.append(n)

    def handle_startendtag(self, tag, attrs):
        self.stack[-1].children.append(Node(tag, attrs))

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i].tag == tag:
                del self.stack[i:]
                return

    def handle_data(self, data):
        self.stack[-1].children.append(data)


def js(s):
    return json.dumps(s, ensure_ascii=False)


def compile_attr(raw):
    """→ JS expression evaluated against scope `v`."""
    whole = re.fullmatch(r"\s*\{\{([\s\S]+?)\}\}\s*", raw)
    if whole:
        return f"r(v, {js(whole.group(1).strip())})"
    if "{{" in raw:
        parts = re.split(r"\{\{([\s\S]+?)\}\}", raw)
        out = []
        for i, p in enumerate(parts):
            out.append(js(p) if i % 2 == 0 else f"s(r(v, {js(p.strip())}))")
        return "(" + " + ".join(out) + ")"
    return js(raw)


class Gen:
    def __init__(self, prefix, imports):
        self.prefix = prefix
        self.pseudo = {}
        self.imports = imports  # name -> local identifier
        self.used_imports = set()

    def pseudo_class(self, kind, css):
        k = (kind, css)
        if k not in self.pseudo:
            self.pseudo[k] = f"{self.prefix}-p{len(self.pseudo):x}"
        return self.pseudo[k]

    def children(self, node, ind):
        out = []
        for c in node.children:
            e = self.node(c, ind)
            if e is not None:
                out.append(e)
        return out

    def node(self, n, ind):
        pad = "  " * ind
        if isinstance(n, str):
            if "{{" not in n:
                if not n.strip() and " " not in n:
                    return None
                return js(n)
            parts = re.split(r"\{\{([\s\S]+?)\}\}", n)
            items = [js(p) if i % 2 == 0 else f"t(r(v, {js(p.strip())}))" for i, p in enumerate(parts) if not (i % 2 == 0 and p == "")]
            return "h(F, null, " + ", ".join(items) + ")"
        tag = n.tag
        attrs = dict((a, b if b is not None else "") for a, b in n.attrs)
        kids = self.children(n, ind + 1)
        kid_src = (",\n" + pad + "  ").join(kids)
        if tag == "sc-if":
            return f"(r(v, {js(attrs.get('value','').replace('{{','').replace('}}','').strip())}) ? h(F, null,\n{pad}  {kid_src}) : null)" if kids else "null"
        if tag == "sc-for":
            lst = attrs.get("list", "").replace("{{", "").replace("}}", "").strip()
            as_ = attrs.get("as", "item")
            return (f"h(F, null, (Array.isArray(r(v, {js(lst)})) ? r(v, {js(lst)}) : []).map((it, i) => {{ const v0 = v; {{ const v = {{ ...v0, {js(as_)}: it, $index: i }};\n"
                    f"{pad}  return h(F, {{ key: i }},\n{pad}  {kid_src}); }} }}))")
        if tag == "dc-import":
            name = attrs.pop("name", attrs.pop("component", ""))
            ident = self.imports.get(name)
            if not ident:
                raise SystemExit(f"dc-import {name!r} has no mapping (--map)")
            self.used_imports.add(name)
            props = []
            host_style = None
            for k, val in attrs.items():
                if k.startswith(CAMEL):
                    k = kebab_to_camel(k[len(CAMEL):])
                if k.startswith("hint-"):
                    continue
                if k == "style":
                    host_style = compile_attr(val)
                    continue
                if "-" in k and not (k.startswith("aria-") or k.startswith("data-")):
                    k = kebab_to_camel(k)
                props.append(f"{js(k)}: {compile_attr(val)}")
            if host_style:
                props.append(f"__hostStyle: {host_style}")
            return f"h({ident}, {{ {', '.join(props)} }})"
        if tag in ("sc-helmet", "helmet", "script", "style"):
            return None
        props = []
        classes = []
        for k, val in n.attrs:
            val = val if val is not None else ""
            if k.startswith(CAMEL):
                k = kebab_to_camel(k[len(CAMEL):])
            if k.startswith("hint-") or k in ("sc-name", "data-dc-tpl"):
                continue
            if k.startswith("style-"):
                classes.append(js(self.pseudo_class(k[6:], val)))
                continue
            kk = ATTR_MAP.get(k, k)
            if kk.startswith("on") and kk == kk.lower():
                kk = EVENT_MAP.get(kk, "on" + kk[2].upper() + kk[3:])
            if kk == "style":
                props.append(f"style: css({compile_attr(val)})")
            elif k in BOOL_ATTRS and val == "":
                props.append(f"{js(kk)}: true")
            else:
                expr = compile_attr(val)
                if kk in ("value", "checked") and expr.startswith("r("):
                    expr = f"({expr} ?? {'false' if kk == 'checked' else js('')})"
                props.append(f"{js(kk)}: {expr}")
        if classes:
            existing = next((p for p in props if p.startswith('"className"')), None)
            parts = classes
            if existing:
                props.remove(existing)
                parts = [existing.split(": ", 1)[1]] + classes
            props.append('"className": [' + ", ".join(parts) + '].filter(Boolean).join(" ")')
        prop_src = "{ " + ", ".join(props) + " }" if props else "null"
        if kids:
            return f"h({js(tag)}, {prop_src},\n{pad}  {kid_src})"
        return f"h({js(tag)}, {prop_src})"


def find_by_id(node, ident):
    if isinstance(node, Node):
        if dict(node.attrs).get("id") == ident:
            return node
        for c in node.children:
            f = find_by_id(c, ident)
            if f:
                return f
    return None


def main():
    src_path, out_name, out_dir = sys.argv[1], sys.argv[2], Path(sys.argv[3])
    root_id = None
    mapping = {}
    imports = {}
    args = sys.argv[4:]
    while args:
        a = args.pop(0)
        if a == "--root-id":
            root_id = args.pop(0)
        elif a == "--map":
            mapping = json.loads(args.pop(0))
        elif a == "--import":
            k, v = args.pop(0).split("=")
            imports[k] = v
    raw = Path(src_path).read_text()
    prefix = "dc" + re.sub(r"[^a-z0-9]", "", out_name.lower())[:10]

    helmet = re.search(r"<helmet>([\s\S]*?)</helmet>", raw)
    helmet_src = helmet.group(1) if helmet else ""
    tpl = raw[raw.index("<x-dc>") + 6: raw.index("<script type=\"text/x-dc\"")]
    tpl = re.sub(r"<helmet>[\s\S]*?</helmet>", "", tpl)
    tpl = tpl.replace("</x-dc>", "")
    script = re.search(r'<script type="text/x-dc" data-dc-script data-props="([^"]*)">([\s\S]*?)</script>', raw)
    props_meta = json.loads(html.unescape(script.group(1)))
    logic = script.group(2)
    defaults = {k: v.get("default") for k, v in props_meta.items() if not k.startswith("$") and isinstance(v, dict) and "default" in v}

    # --- keyframes / global css from helmet
    css_blocks = "\n".join(re.findall(r"<style>([\s\S]*?)</style>", helmet_src))
    kf_names = re.findall(r"@keyframes\s+([\w-]+)", css_blocks)
    ren = {k: f"{prefix}_{k}" for k in kf_names}

    def apply_maps(s):
        for k, v in ren.items():
            s = re.sub(r"(?<![\w-])" + re.escape(k) + r"(?![\w-])", v, s)
        for a, b in mapping.items():
            s = s.replace(a, b)
        s = s.replace("'JetBrains Mono'", "var(--v3-mono)").replace('"JetBrains Mono"', "var(--v3-mono)")
        s = s.replace("'Noto Sans TC'", "var(--v3-sans)").replace('"Noto Sans TC"', "var(--v3-sans)")
        s = re.sub(r"(?<![\w-])Archivo(?![\w-])", "var(--v3-display)", s)
        return s

    tpl = apply_maps(tpl)
    logic = apply_maps(logic)
    css_blocks = apply_maps(css_blocks)

    p = P()
    p.feed(encode_camel(tpl))
    root = p.root
    if root_id:
        found = find_by_id(root, root_id)
        if not found:
            raise SystemExit(f"root id {root_id} not found")
        root = Node("#root", [])
        root.children = [found]
        # the artboard's own id would collide with nothing in production; drop it
        found.attrs = [(a, b) for a, b in found.attrs if a != "id"]
    g = Gen(prefix, imports)
    kids = g.children(root, 2)
    body = kids[0] if len(kids) == 1 else "h(F, null,\n    " + ",\n    ".join(kids) + ")"

    # --- CSS: keyframes + scoped element rules + pseudo classes
    css_out = [f"/* GENERATED by tools/dc2react from {Path(src_path).name} — do not edit by hand. */"]
    for m in re.finditer(r"@keyframes\s+[\w-]+\s*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}", css_blocks):
        css_out.append(m.group(0))
    rest = re.sub(r"@keyframes\s+[\w-]+\s*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}", "", css_blocks)
    for sel, decl in re.findall(r"([^{}]+)\{([^{}]*)\}", rest):
        sel = sel.strip()
        if sel in ("body", "html", "html,body"):
            continue
        scoped = ", ".join(f".{prefix}-root {s.strip()}" if s.strip() != "*" else f".{prefix}-root *" for s in sel.split(","))
        if re.search(r":hover", sel):
            css_out.append(f"@media (hover: hover) and (pointer: fine) {{ {scoped} {{{decl}}} }}")
        else:
            css_out.append(f"{scoped} {{{decl}}}")
    for (kind, css), cls in g.pseudo.items():
        decl = apply_maps(css)
        if kind in ("before", "after"):
            css_out.append(f".{cls}::{kind} {{{decl}}}")
            continue
        decl_i = ";".join(d.strip() + (" !important" if d.strip() and "!important" not in d else "") for d in decl.split(";") if d.strip())
        rule = f".{cls}:{kind} {{{decl_i}}}"
        css_out.append(f"@media (hover: hover) and (pointer: fine) {{ {rule} }}" if kind == "hover" else rule)
    (out_dir / f"{out_name}.css").write_text("\n".join(css_out) + "\n")

    logic_cls = re.sub(r"class\s+Component\s+extends\s+DCLogic", "class Logic extends DCLogic", logic, count=1)
    import_lines = "".join(f'import {imports[n]} from "./{imports[n]}";\n' for n in sorted(g.used_imports))
    tsx = f'''/* eslint-disable */
// @ts-nocheck
/*
 * GENERATED by tools/dc2react from the approved Claude Design reference
 * `{Path(src_path).name}` (Portfolio V3 handoff). Do not edit by hand —
 * change the reference/map and regenerate. The template, timings, easings,
 * copy and logic are the approved prototype's; only asset/route URLs and
 * font families are mapped to production.
 */
"use client";
import React from "react";
import {{ DCLogic, dcComponent, r, s, t, css, F, h }} from "./runtime";
{import_lines}
{logic_cls.strip()}

const DEFAULTS = {json.dumps(defaults, ensure_ascii=False)};

const render = (v) => {body};

export default dcComponent(Logic, render, {js(out_name)}, DEFAULTS, {js(prefix + "-root")});
'''
    (out_dir / f"{out_name}.tsx").write_text(tsx)
    print(f"{out_name}: {len(g.pseudo)} pseudo classes, {len(kf_names)} keyframes, defaults={defaults}")


if __name__ == "__main__":
    main()
