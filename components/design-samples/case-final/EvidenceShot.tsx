import Image from "next/image";

/*
 * One screenshot. Below lg the frame scrolls horizontally at a legible
 * minimum width (the shared case-final inspectable-evidence pattern); at
 * lg+ it fits its column. Aspect ratio comes from the asset's real pixels.
 */
export function Shot({ src, alt, size, minW, caption, scrollHint }: { src: string; alt: string; size: [number, number]; minW: string; caption?: string; scrollHint?: string }) {
  return <figure className="min-w-0 max-w-full">
    <div className="cf-figure-frame min-w-0 max-w-full overflow-x-auto" tabIndex={0} role="group" aria-label={alt}>
      <div className={`relative ${minW} lg:min-w-0`} style={{ aspectRatio: `${size[0]} / ${size[1]}` }}><Image src={src} alt={alt} fill sizes="(max-width: 1023px) 960px, 1210px" className="object-contain" /></div>
    </div>
    {caption && <figcaption className="cf-figure-caption cf-meta mt-3">{caption}</figcaption>}
    {scrollHint && <p className="cf-dim mt-2 text-[12px] lg:hidden">{scrollHint}</p>}
  </figure>;
}
