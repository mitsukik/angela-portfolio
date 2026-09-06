import type { CSSProperties } from "react";

/**
 * A restrained ambient background layer of small geometric fragments
 * (lines, squares, dots, arcs) that drift very slowly — background life,
 * not animated wallpaper. Server-rendered: positions come from a seeded
 * pseudo-random generator so the same seed always produces the same
 * static layout (no client/server hydration mismatch, no JS needed just
 * to place decoration), and the actual drift is pure CSS animation with
 * no RAF loop. Reduced motion keeps the fragments visible as a static
 * layer (see globals.css) rather than removing them — ambient presence
 * isn't itself motion that needs to be gated, only its drift is.
 */

type FragmentKind = "line" | "square" | "dot" | "arc";
type Tone = "lavender" | "yellow" | "foreground";

type Fragment = {
  kind: FragmentKind;
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  tone: Tone;
  rotate: number;
  dx: number;
  dy: number;
};

function mulberry32(seed: number) {
  let a = seed;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Rounded to a fixed, low precision (not left as raw floats) before ever
// reaching a style object. This isn't just cosmetic: a hydration mismatch
// was reproduced in-browser here (server and client rendering the same
// deterministic seed to visually-identical but string-different float
// precision — e.g. 92.3348% vs 92.33483509160578%), which is exactly the
// class of "harmless-looking React warning that isn't actually harmless
// for a review session" this whole task exists to eliminate. Rounding
// both environments to the same few decimal places makes the rendered
// string byte-identical regardless of where any residual float noise
// originates, without needing to track down the exact source.
function round(value: number, precision = 3) {
  return Number(value.toFixed(precision));
}

function buildFragments(seed: number, count: number): Fragment[] {
  const random = mulberry32(seed);
  const kinds: FragmentKind[] = ["line", "square", "dot", "arc"];
  const tones: Tone[] = ["lavender", "yellow", "foreground"];

  return Array.from({ length: count }, () => {
    const angle = random() * Math.PI * 2;
    const distance = 10 + random() * 14;
    return {
      kind: kinds[Math.floor(random() * kinds.length)],
      left: round(random() * 100),
      top: round(random() * 100),
      size: round(4 + random() * 12),
      duration: round(20 + random() * 26, 1),
      delay: round(-(random() * 30), 1),
      opacity: round(0.05 + random() * 0.09),
      tone: tones[Math.floor(random() * tones.length)],
      rotate: round(random() * 40 - 20, 1),
      dx: round(Math.cos(angle) * distance),
      dy: round(Math.sin(angle) * distance),
    };
  });
}

const TONE_VAR: Record<Tone, string> = {
  lavender: "var(--accent-lavender)",
  yellow: "var(--accent-yellow)",
  foreground: "var(--foreground)",
};

const DENSITY_COUNT = {
  high: 16,
  low: 9,
  quiet: 5,
  footer: 10,
} as const;

export function AmbientField({
  seed,
  density = "high",
  className = "",
}: {
  seed: number;
  density?: keyof typeof DENSITY_COUNT;
  className?: string;
}) {
  const fragments = buildFragments(seed, DENSITY_COUNT[density]);

  return (
    <div
      aria-hidden="true"
      className={`ambient-field pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {fragments.map((f, i) => (
        <span
          key={i}
          className={`ambient-fragment ambient-fragment-${f.kind}`}
          style={
            {
              left: `${f.left}%`,
              top: `${f.top}%`,
              width: f.kind === "line" ? `${f.size * 2.2}px` : `${f.size}px`,
              height: f.kind === "line" ? "1px" : `${f.size}px`,
              color: TONE_VAR[f.tone],
              "--ambient-opacity": `${f.opacity}`,
              "--ambient-rotate": `${f.rotate}deg`,
              "--ambient-dx": `${f.dx}px`,
              "--ambient-dy": `${f.dy}px`,
              "--ambient-duration": `${f.duration}s`,
              "--ambient-delay": `${f.delay}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
