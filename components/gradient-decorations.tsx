"use client"

import { useEffect, useState } from "react"

/** Reusable neat ECG / heartbeat trace */
function EcgLine({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 600 80"
      fill="none"
      preserveAspectRatio="none"
    >
      <path
        d="M0 40 H120 l10 0 6 -22 8 44 7 -52 6 60 7 -30 H210 l8 0 5 -12 5 12 H600"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function GradientDecorations() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Delay rendering until after LCP (idle callback or timeout)
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      ;(window as Window & { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(() => {
        setIsVisible(true)
      })
    } else {
      // Fallback for browsers without requestIdleCallback
      const timeout = setTimeout(() => setIsVisible(true), 100)
      return () => clearTimeout(timeout)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Subtle dot grid - primary, very light */}
      <svg className="absolute inset-0 h-full w-full text-primary/[0.04]">
        <defs>
          <pattern
            id="dot-grid"
            x="0"
            y="0"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1.5" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dot-grid)" />
      </svg>

      {/* ECG trace - top, primary */}
      <EcgLine className="absolute left-0 top-[14%] h-12 w-full text-primary/[0.06] md:h-16" />

      {/* ECG trace - middle, teal accent */}
      <EcgLine className="absolute left-0 top-1/2 h-10 w-full -translate-y-1/2 text-accent/[0.05] md:h-14" />

      {/* ECG trace - lower area, primary */}
      <EcgLine className="absolute left-0 top-[82%] h-12 w-full text-primary/[0.05] md:h-16" />

      {/* Subtle brand logo watermark - bottom right */}
      <img
        src="/images/logo.jpg"
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute -right-6 bottom-[6%] h-24 w-auto opacity-[0.05] md:h-32"
      />

      {/* Subtle brand logo watermark - top left */}
      <img
        src="/images/logo.jpg"
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute -left-4 top-[8%] h-16 w-auto opacity-[0.04] md:h-20"
      />
    </div>
  )
}
