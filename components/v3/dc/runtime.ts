/*
 * Minimal production host for components compiled by tools/dc2react from the
 * approved Claude Design references. Re-implements only the semantics those
 * components rely on (support.js is NOT shipped):
 * - DCLogic base class (state, props, lifecycle, renderVals)
 * - setState merges SYNCHRONOUSLY into logic.state, then re-renders the host
 *   (prototype logic reads this.state right after setState)
 * - template values = { ...defaults, ...props, ...renderVals() }
 * - the host renders a `.sc-host` wrapper carrying an import's position style
 */
import React from "react";

export const h = React.createElement;
export const F = React.Fragment;

export class DCLogic {
  props: Record<string, unknown> = {};
  state: Record<string, unknown> = {};
  __host: { __setLogicState: (u: unknown, cb?: () => void) => void; forceUpdate: () => void } | null = null;
  constructor(props?: Record<string, unknown>) {
    this.props = props || {};
  }
  setState(update: unknown, cb?: () => void) {
    this.__host?.__setLogicState(update, cb);
  }
  forceUpdate() {
    this.__host?.forceUpdate();
  }
  componentDidMount() {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  componentDidUpdate(_prev: Record<string, unknown>) {}
  componentWillUnmount() {}
  renderVals(): Record<string, unknown> {
    return {};
  }
}

/** Resolve a dotted path (a.b.c, a[0]) against the template scope. */
export function r(vals: unknown, path: string): unknown {
  let cur: unknown = vals;
  for (const seg of path.trim().split(/\.|\[|\]/).filter(Boolean)) {
    if (cur == null) return undefined;
    cur = (cur as Record<string, unknown>)[seg];
  }
  return cur;
}

/** Interpolate inside a mixed attribute string. */
export function s(v: unknown): string {
  return v == null || typeof v === "boolean" ? "" : String(v);
}

/** Interpolate in text: elements/arrays render as-is; null/boolean render nothing. */
export function t(v: unknown): React.ReactNode {
  if (v === undefined || v === null || typeof v === "boolean") return null;
  if (React.isValidElement(v) || Array.isArray(v)) return v as React.ReactNode;
  return String(v);
}

const camel = (p: string) => (p.startsWith("--") ? p : p.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase()));

/** Inline style string → React style object (support.js cssToObj). */
export function css(style: unknown): React.CSSProperties | undefined {
  if (style == null) return undefined;
  if (typeof style !== "string") return style as React.CSSProperties;
  const o: Record<string, string> = {};
  for (const decl of style.split(";")) {
    const i = decl.indexOf(":");
    if (i < 0) continue;
    const prop = decl.slice(0, i).trim();
    if (!prop) continue;
    o[camel(prop)] = decl.slice(i + 1).trim();
  }
  return o as React.CSSProperties;
}

const HOST_STYLE_PROPS = ["position", "left", "right", "top", "bottom", "inset", "width", "height", "z-index", "transform"];

function hostPositionStyle(style: unknown): React.CSSProperties | undefined {
  const all = typeof style === "string" ? css(style) : (style as Record<string, unknown> | null);
  if (!all) return undefined;
  const o: Record<string, unknown> = {};
  for (const k of HOST_STYLE_PROPS.map(camel)) if ((all as Record<string, unknown>)[k] !== undefined) o[k] = (all as Record<string, unknown>)[k];
  return o as React.CSSProperties;
}

type LogicCtor = new (props: Record<string, unknown>) => DCLogic;

export function dcComponent(
  Logic: LogicCtor,
  render: (vals: Record<string, unknown>) => React.ReactNode,
  name: string,
  defaults: Record<string, unknown>,
  rootClass: string,
) {
  class Host extends React.Component<Record<string, unknown>, { __v: number }> {
    static displayName = name;
    logic: DCLogic;
    constructor(props: Record<string, unknown>) {
      super(props);
      this.state = { __v: 0 };
      this.logic = new Logic(this.userProps());
      this.logic.__host = this;
    }
    userProps() {
      const { __hostStyle, __className, ...rest } = this.props;
      void __hostStyle;
      void __className;
      return { ...defaults, ...rest };
    }
    __setLogicState(update: unknown, cb?: () => void) {
      const prev = this.logic.state;
      const patch = typeof update === "function" ? (update as (p: unknown) => object)(prev) : update;
      this.logic.state = { ...prev, ...(patch as object) };
      this.setState((st) => ({ __v: st.__v + 1 }), cb);
    }
    componentDidMount() {
      this.logic.componentDidMount();
    }
    componentDidUpdate(prevProps: Record<string, unknown>) {
      this.logic.componentDidUpdate(prevProps);
    }
    componentWillUnmount() {
      this.logic.componentWillUnmount();
    }
    render() {
      const userProps = this.userProps();
      this.logic.props = userProps;
      const vals = { ...userProps, ...(this.logic.renderVals() || {}) };
      const hostStyle = hostPositionStyle(this.props.__hostStyle);
      return h(
        "div",
        { className: `sc-host ${rootClass}${this.props.__className ? " " + this.props.__className : ""}`, style: hostStyle, "data-sc-name": name },
        render(vals),
      );
    }
  }
  return Host;
}
