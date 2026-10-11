"use client";

import Link, { type LinkProps } from "next/link";
import type { ReactNode } from "react";

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
  // V3: Page Transition 01 (components/v3/transition) now owns every
  // cross-page transition. The former local departure "dip" is retired so
  // two transition effects never run on the same navigation.
  return (
    <Link href={href} className={className} {...rest}>
      {children}
    </Link>
  );
}
