import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";

/**
 * Legacy pre-freeze review route. AboutV2 (the component this page used to
 * render directly) is no longer an "isolated prototype separate from
 * production /about" — the production `/about` and `/en/about` routes both
 * render this exact same component (see app/about/page.tsx). A public-release
 * audit (2026-09) found this route still reachable at a second guessable
 * URL, duplicating the live page under stale "VER2 (Prototype)" framing.
 * Same treatment as app/work/[slug]/page.tsx: a permanent redirect to the
 * real route instead of a 404, in case anything still links here.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AboutV2SamplePage(): never {
  permanentRedirect("/about");
}
