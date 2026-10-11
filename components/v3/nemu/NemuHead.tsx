/*
 * Nemu head — one asset (provisional nemu-master-head-v4.png, handoff §6)
 * plus a CSS face overlay. DOM shape mirrors the prototype exactly
 * (box > img + screen > [eyes row (2 spans), mouth span, LED bar]) because
 * the Nemu V1 motion layer (nemuMotion.ts) locates the eyes and mouth by
 * that structure.
 */

// 512px WebP of the 1024px master PNG (kept in /public/v3 for rollback);
// the "nemu-master-head-v4" stem is what nemuMotion.ts selects on.
export const NEMU_HEAD_SRC = "/v3/nemu-master-head-v4.webp";

export type NemuExpression = "idle" | "blink" | "happy" | "looking" | "sleep" | "switching";

const W = "#F8F8FB";
const NONE = "0px solid transparent";

type Face = {
  eyeW: string; eyeH: string; eyeR: string; eyeBg: string; eyeBt: string; eyeBb: string; eyeSh: string;
  eyeTf: string; eyeOp: number; mW: string; mH: string; mR: string; mOp: number; barOp: number; head: string; sleep?: boolean;
};

const IDLE: Face = {
  eyeW: "12px", eyeH: "20px", eyeR: "6px", eyeBg: W, eyeBt: NONE, eyeBb: NONE, eyeSh: "0 0 8px rgba(175,203,255,.85)",
  eyeTf: "none", eyeOp: 1, mW: "14px", mH: "7px", mR: "0 0 10px 10px", mOp: 1, barOp: 0, head: "none",
};

const FACES: Record<NemuExpression, Partial<Face>> = {
  idle: {},
  blink: { eyeH: "2px" },
  happy: { eyeW: "20px", eyeH: "11px", eyeR: "20px 20px 0 0", eyeBg: "transparent", eyeBt: `3.5px solid ${W}`, eyeSh: "none", mW: "18px", mH: "9px", head: "translateY(-2px)" },
  looking: { eyeTf: "translate(-4px,-4px)", head: "rotate(-2deg)" },
  sleep: { eyeW: "16px", eyeH: "8px", eyeR: "0 0 16px 16px", eyeBg: "transparent", eyeBb: `3px solid ${W}`, eyeSh: "none", eyeOp: 0.8, mOp: 0, head: "translateY(2px)", sleep: true },
  switching: { eyeOp: 0, mOp: 0, barOp: 1 },
};

export function NemuHead({ expression }: { expression: NemuExpression }) {
  const face = { ...IDLE, ...FACES[expression] };
  const eye = (
    <span
      className="nemu-eye"
      style={{ width: face.eyeW, height: face.eyeH, borderRadius: face.eyeR, background: face.eyeBg, borderTop: face.eyeBt, borderBottom: face.eyeBb, boxShadow: face.eyeSh }}
    />
  );
  return (
    <div className="nemu-head" style={{ transform: face.head }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- fixed-size layered character art; the motion layer targets this exact <img> */}
      <img src={NEMU_HEAD_SRC} alt="" draggable={false} className="nemu-head-img" />
      <div aria-hidden="true" className="nemu-screen">
        <div className="nemu-eyes" style={{ opacity: face.eyeOp, transform: face.eyeTf }}>
          {eye}
          {eye}
        </div>
        <span className="nemu-mouth" style={{ width: face.mW, height: face.mH, borderRadius: face.mR, opacity: face.mOp, transform: face.eyeTf }} />
        <div className="nemu-bar" style={{ opacity: face.barOp }} />
      </div>
      {face.sleep ? <span aria-hidden="true" className="nemu-z">zZ</span> : null}
    </div>
  );
}
