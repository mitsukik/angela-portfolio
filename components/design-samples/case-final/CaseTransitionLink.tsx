"use client";

import Link, { type LinkProps } from "next/link";
import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";

/**
 * Case-navigation link with a local departure cue (a quick, restrained
 * dip on the clicked element itself — feedback, not spatial transition)
 * before the route actually changes.
 *
 * Deliberately does NOT build a second full-screen curtain: the site
 * already has one global route-transition layer (RouteTransition.tsx,
 * mounted once in the root layout, cover/reveal on every pathname
 * change). Adding a second, Case-specific curtain here would compete
 * with it — two overlays firing on the same navigation. A true
 * Case-specific transition treatment (a paper/dark surface wipe that
 * differs by destination, a chapter-field expansion) would need to be
 * built INTO that shared global layer, which is out of scope for this
 * prototype pass per "don't modify Home/shared dependencies unless
 * absolutely necessary." Flagged as deferred in the final report.
 */
export function CaseTransitionLink({
  href,
  children,
  className,
  ...rest
}: LinkProps & { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLAnchorElement | null>(null);

  const handleClick = () => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(el, { autoAlpha: 1 }, { autoAlpha: 0.55, duration: 0.12, yoyo: true, repeat: 1, ease: "power1.inOut" });
  };

  return (
    <Link ref={ref} href={href} onClick={handleClick} className={className} {...rest}>
      {children}
    </Link>
  );
}
