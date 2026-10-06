/**
 * Home V2 pointer + reveal engine.
 *
 * One requestAnimationFrame loop drives everything that follows the
 * pointer — floating preview, hero spotlight, magnetic buttons. It writes straight to element styles/attributes
 * (never React state), runs only while something is still moving, and
 * stops itself once settled. The marquee is pure CSS and not part of this.
 *
 * Everything pointer-driven is gated to a fine hover pointer and switched
 * off under prefers-reduced-motion; touch devices get none of it.
 */

const FINE_QUERY = "(hover: hover) and (pointer: fine)";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

const EPSILON = 0.15;

export function initHomeMotion(root: HTMLElement): () => void {
  const hero = root.querySelector<HTMLElement>("[data-hv2-hero]");
  const preview = root.querySelector<HTMLElement>("[data-hv2-preview]");
  const layers = preview ? Array.from(preview.querySelectorAll<HTMLElement>("[data-hv2-layer]")) : [];
  const list = root.querySelector<HTMLElement>("[data-hv2-list]");

  const fineQuery = window.matchMedia(FINE_QUERY);
  const reducedQuery = window.matchMedia(REDUCED_QUERY);

  let mx = 0;
  let my = 0;
  let hasPointer = false;
  let target: Element | null = null;
  let needsHitTest = false;

  let px = 0;
  let py = 0;
  let previewVisible = false;
  let previewW = 0;
  let previewH = 0;

  let magnet: HTMLElement | null = null;
  let raf = 0;

  const schedule = () => {
    if (!raf) raf = requestAnimationFrame(frame);
  };

  const measurePreview = () => {
    if (!preview) return;
    previewW = preview.offsetWidth;
    previewH = preview.offsetHeight;
  };

  const frame = () => {
    raf = 0;
    const fine = fineQuery.matches;
    const reduced = reducedQuery.matches;

    if (needsHitTest && hasPointer) {
      target = document.elementFromPoint(mx, my);
      needsHitTest = false;
    }
    // A modal drawer owns the pointer: nothing underneath may react.
    const drawerOpen = root.dataset.drawer === "open";
    const el = hasPointer && fine && !drawerOpen ? target : null;
    let moving = false;

    // Hero spotlight.
    if (hero) {
      if (el && !reduced && hero.contains(el)) {
        const rect = hero.getBoundingClientRect();
        const x = mx - rect.left;
        const y = my - rect.top;
        hero.style.setProperty("--hv2-mx", `${x.toFixed(1)}px`);
        hero.style.setProperty("--hv2-my", `${y.toFixed(1)}px`);
      }
    }
    // Floating work preview: eased follow (snaps on first show), clamped to
    // the viewport so it never hangs off an edge.
    if (preview) {
      const row = el && list?.contains(el) ? el.closest<HTMLElement>("[data-hv2-row]") : null;
      const index = row ? row.dataset.hv2Row ?? "" : "";
      const visible = index !== "";
      if (visible && !previewVisible) {
        measurePreview();
        px = mx;
        py = my;
      }
      previewVisible = visible;
      if (visible) {
        const k = reduced ? 1 : 0.1;
        px += (mx - px) * k;
        py += (my - py) * k;
        const x = Math.min(px + 28, window.innerWidth - previewW - 12);
        const y = Math.max(12, Math.min(py - 140, window.innerHeight - previewH - 12));
        preview.style.transform = `translate3d(${Math.max(12, x).toFixed(1)}px,${y.toFixed(1)}px,0)`;
        if (Math.abs(mx - px) > EPSILON || Math.abs(my - py) > EPSILON) moving = true;
      }
      const state = visible ? "true" : "false";
      if (preview.dataset.visible !== state) preview.dataset.visible = state;
      layers.forEach((layer, i) => {
        const on = String(visible && String(i) === index);
        if (layer.dataset.on !== on) layer.dataset.on = on;
      });
    }

    // Magnetic buttons/links.
    const magnetEl = el?.closest<HTMLElement>("[data-magnetic]") ?? null;
    if (magnetEl !== magnet) {
      if (magnet) magnet.style.transform = "";
      magnet = magnetEl;
    }
    if (magnet && !reduced) {
      const rect = magnet.getBoundingClientRect();
      const dx = (mx - rect.left - rect.width / 2) * 0.3;
      const dy = (my - rect.top - rect.height / 2) * 0.3;
      magnet.style.transform = `translate(${dx.toFixed(1)}px,${dy.toFixed(1)}px)`;
    }

    if (moving) schedule();
  };

  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType === "touch" || !fineQuery.matches) return;
    mx = event.clientX;
    my = event.clientY;
    target = event.target as Element | null;
    hasPointer = true;
    schedule();
  };

  const releasePointer = () => {
    hasPointer = false;
    target = null;
    schedule();
  };
  const onScroll = () => {
    if (!hasPointer) return;
    needsHitTest = true;
    schedule();
  };
  const onVisibility = () => {
    if (document.hidden) releasePointer();
  };

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", measurePreview, { passive: true });
  window.addEventListener("blur", releasePointer);
  document.documentElement.addEventListener("pointerleave", releasePointer);
  document.addEventListener("visibilitychange", onVisibility);
  // A drawer opening (or a media-query flip) must also clear any live state.
  const onDrawerChange = () => {
    needsHitTest = true;
    schedule();
  };
  const drawerObserver = new MutationObserver(onDrawerChange);
  drawerObserver.observe(root, { attributes: true, attributeFilter: ["data-drawer"] });
  const mql = () => releasePointer();
  fineQuery.addEventListener("change", mql);
  reducedQuery.addEventListener("change", mql);
  measurePreview();

  return () => {
    if (raf) cancelAnimationFrame(raf);
    drawerObserver.disconnect();
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", measurePreview);
    window.removeEventListener("blur", releasePointer);
    document.documentElement.removeEventListener("pointerleave", releasePointer);
    document.removeEventListener("visibilitychange", onVisibility);
    fineQuery.removeEventListener("change", mql);
    reducedQuery.removeEventListener("change", mql);
    if (magnet) magnet.style.transform = "";
  };
}

/**
 * Scroll reveal. Content is fully visible in the server HTML;
 * only elements below the fold at mount are hidden, then revealed as they
 * enter (threshold .15), staggered 70ms × (index mod 4). Skipped entirely
 * under prefers-reduced-motion.
 */
export function initReveal(root: HTMLElement): () => void {
  if (window.matchMedia(REDUCED_QUERY).matches || !("IntersectionObserver" in window)) return () => {};

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        el.dataset.reveal = "shown";
        observer.unobserve(el);
      });
    },
    { threshold: 0.15 },
  );

  root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el, index) => {
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    el.style.transitionDelay = `${(index % 4) * 70}ms`;
    el.dataset.reveal = "pending";
    observer.observe(el);
  });

  return () => {
    observer.disconnect();
    // Anything still waiting must not stay hidden if this effect re-runs.
    root.querySelectorAll<HTMLElement>('[data-reveal="pending"]').forEach((el) => {
      el.dataset.reveal = "";
      el.style.transitionDelay = "";
    });
  };
}
