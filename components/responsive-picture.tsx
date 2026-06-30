/**
 * ResponsivePicture
 *
 * Renders a <picture> element that serves WebP from /images/r/<w>/ for each
 * breakpoint and falls back to the original src.
 *
 * IMPORTANT: <picture> is block-level. All layout/sizing classes (w-*, h-*, 
 * object-cover, etc.) should be passed via `className` — they are applied to
 * BOTH the wrapping <picture> and the inner <img> so the visual result is
 * identical to dropping a plain <img> in the same place.
 *
 * For cases that need `fill` layout (position:absolute inside a relative
 * container), pass `fill={true}`. The component will add the necessary
 * absolute-fill styles automatically.
 */

import React from "react"

const BREAKPOINTS = [360, 480, 576, 768, 1024, 1140, 1200, 1440, 1560, 3840] as const

interface ResponsivePictureProps {
  /** Original image src used as fallback, e.g. "/images/generations.png" */
  src: string
  alt: string
  /** Base name without extension, e.g. "generations". Defaults to filename from src. */
  name?: string
  /** Override the WebP directory. Defaults to "/images/r". E.g. "/images/r/patents" */
  webpDir?: string
  /** CSS classes forwarded to both <picture> and <img> */
  className?: string
  /** Inline styles forwarded to <img> only (e.g. objectPosition) */
  imgStyle?: React.CSSProperties
  /** If true, renders like Next.js fill — absolute inset-0 w-full h-full */
  fill?: boolean
  /** Standard img attributes */
  width?: number
  height?: number
  loading?: "lazy" | "eager"
  fetchPriority?: "high" | "low" | "auto"
  decoding?: "async" | "sync" | "auto"
}

export function ResponsivePicture({
  src,
  alt,
  name,
  webpDir = "/images/r",
  className = "",
  imgStyle,
  fill = false,
  width,
  height,
  loading = "lazy",
  fetchPriority,
  decoding = "async",
}: ResponsivePictureProps) {
  // Derive the base filename from src if name not provided
  const baseName = name ?? src.split("/").pop()?.replace(/\.[^.]+$/, "") ?? "image"

  // <picture> is inline by default in some contexts — always force block so it
  // behaves identically to a replaced element and doesn't add unwanted baseline space.
  const fillClass = fill ? "absolute inset-0 w-full h-full" : ""
  const pictureClass = ["block", fillClass, className].filter(Boolean).join(" ")
  // Only apply object-cover by default when imgStyle doesn't specify objectFit
  const defaultObjectFit = imgStyle?.objectFit ? "" : "object-cover"
  const imgClass = [
    defaultObjectFit,
    fill ? "absolute inset-0 w-full h-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ")

  // Build srcset per breakpoint: each entry points to the webp for that width
  // media queries: max-width for all except the largest
  const sources = BREAKPOINTS.slice(0, -1).map((w, i) => {
    const next = BREAKPOINTS[i + 1]
    return (
      <source
        key={w}
        media={`(max-width: ${next - 1}px)`}
        srcSet={`${webpDir}/${w}/${baseName}.webp`}
        type="image/webp"
      />
    )
  })

  // Largest breakpoint — no max-width constraint (acts as default for big screens)
  const largest = BREAKPOINTS[BREAKPOINTS.length - 1]
  sources.push(
    <source
      key={largest}
      srcSet={`${webpDir}/${largest}/${baseName}.webp`}
      type="image/webp"
    />
  )

  return (
    <picture className={pictureClass}>
      {sources}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={imgClass}
        style={imgStyle}
        width={width}
        height={height}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding={decoding}
      />
    </picture>
  )
}
