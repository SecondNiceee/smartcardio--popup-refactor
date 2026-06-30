"use client"

import { useState, useCallback, useEffect, useRef, type ReactNode } from "react"
import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/my-ui/dialog"

export type GalleryImage = {
  src: string
  caption?: string
}

type GalleryDialogProps = {
  trigger: ReactNode
  images: GalleryImage[]
  initialIndex?: number
  title?: string
}

const MIN_ZOOM = 1
const MAX_ZOOM = 4
const ZOOM_STEP = 0.5

export function GalleryDialog({
  trigger,
  images,
  initialIndex = 0,
  title = "Галерея изображений",
}: GalleryDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(initialIndex)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })

  // Keep a ref so the watchDrag callback always reads the latest zoom
  // without Embla needing reInit
  const zoomRef = useRef(1)

  // Ref for the zoom/pan container — used to attach a non-passive touchmove
  // listener so we can call preventDefault() and stop page scroll
  const panContainerRef = useRef<HTMLDivElement>(null)

  // Pan tracking refs — no state to avoid stale closures in event handlers
  const panRef = useRef({ startX: 0, startY: 0, panX: 0, panY: 0, dragging: false })
  const touchRef = useRef({ startX: 0, startY: 0, panX: 0, panY: 0 })

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    containScroll: false,
    startIndex: initialIndex,
    // watchDrag is evaluated by Embla on every pointer-down event.
    // By reading zoomRef.current here (a function form), Embla always
    // gets the live value — no reInit required, no reset loop possible.
    watchDrag: () => zoomRef.current === 1,
  })

  // Sync zoom state → ref together so both are always in agreement
  const applyZoom = useCallback((next: number) => {
    zoomRef.current = next
    setZoom(next)
    if (next === 1) setPan({ x: 0, y: 0 })
  }, [])

  const resetZoom = useCallback(() => applyZoom(1), [applyZoom])

  // Attach a non-passive touchmove listener to the pan container so we can
  // call preventDefault() — React synthetic handlers are passive and cannot
  // prevent the default page scroll gesture
  useEffect(() => {
    const el = panContainerRef.current
    if (!el) return
    const handleTouchMove = (e: TouchEvent) => {
      // Only block page scroll when zoomed in
      if (zoomRef.current > 1) {
        e.preventDefault()
      }
    }
    el.addEventListener("touchmove", handleTouchMove, { passive: false })
    return () => el.removeEventListener("touchmove", handleTouchMove)
  }, [])

  // On open: scroll to initial slide, reset zoom
  useEffect(() => {
    if (open && emblaApi) {
      emblaApi.scrollTo(initialIndex, true)
      setSelectedIndex(initialIndex)
      resetZoom()
    }
  }, [open, initialIndex, emblaApi, resetZoom])

  // Track selected slide — reset zoom on slide change
  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
    resetZoom()
  }, [emblaApi, resetZoom])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    // NOTE: intentionally NOT listening to "reInit" — doing so caused
    // the zoom-reset loop in the previous implementation.
    return () => {
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi, onSelect])

  // Navigation — blocked when zoomed
  const scrollPrev = useCallback(() => {
    if (zoomRef.current > 1) return
    emblaApi?.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (zoomRef.current > 1) return
    emblaApi?.scrollNext()
  }, [emblaApi])

  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi])

  // Zoom controls
  const zoomIn = useCallback(() => {
    const next = Math.min(zoomRef.current + ZOOM_STEP, MAX_ZOOM)
    applyZoom(next)
  }, [applyZoom])

  const zoomOut = useCallback(() => {
    const next = Math.max(zoomRef.current - ZOOM_STEP, MIN_ZOOM)
    applyZoom(next)
  }, [applyZoom])

  // Keyboard shortcuts
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") scrollPrev()
      else if (e.key === "ArrowRight") scrollNext()
      else if (e.key === "+" || e.key === "=") zoomIn()
      else if (e.key === "-") zoomOut()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, scrollPrev, scrollNext, zoomIn, zoomOut])

  // --- Mouse pan ---
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoomRef.current <= 1) return
    e.preventDefault()
    panRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      panX: pan.x,
      panY: pan.y,
      dragging: true,
    }
  }, [pan])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!panRef.current.dragging) return
    const dx = e.clientX - panRef.current.startX
    const dy = e.clientY - panRef.current.startY
    setPan({ x: panRef.current.panX + dx, y: panRef.current.panY + dy })
  }, [])

  const onMouseUp = useCallback(() => {
    panRef.current.dragging = false
  }, [])

  // --- Touch pan ---
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (zoomRef.current <= 1) return
    const t = e.touches[0]
    touchRef.current = { startX: t.clientX, startY: t.clientY, panX: pan.x, panY: pan.y }
  }, [pan])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (zoomRef.current <= 1) return
    e.stopPropagation()
    const t = e.touches[0]
    const dx = t.clientX - touchRef.current.startX
    const dy = t.clientY - touchRef.current.startY
    setPan({ x: touchRef.current.panX + dx, y: touchRef.current.panY + dy })
  }, [])

  const currentImage = images[selectedIndex]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger onClick={() => setOpen(true)} asChild>{trigger}</DialogTrigger>
      <DialogContent className="p-0">
        {/* Close button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 z-30 flex cursor-pointer items-center gap-2.5 rounded-full bg-white/10 px-5 py-3 text-base font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20 md:right-6 md:top-6 md:px-6 md:py-3.5 md:text-lg"
        >
          <svg className="h-6 w-6 md:h-7 md:w-7" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="hidden sm:inline">Закрыть</span>
        </button>

        {/* Zoom controls */}
        <div className="absolute left-1/2 top-4 z-30 flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/50 px-2 py-1.5 backdrop-blur-sm md:top-6">
          <button
            onClick={zoomOut}
            disabled={zoom <= MIN_ZOOM}
            aria-label="Уменьшить"
            className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
            </svg>
          </button>

          <span className="min-w-[3rem] text-center text-sm font-semibold tabular-nums text-white">
            {Math.round(zoom * 100)}%
          </span>

          <button
            onClick={zoomIn}
            disabled={zoom >= MAX_ZOOM}
            aria-label="Увеличить"
            className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>

        {/* Main container */}
        <div ref={panContainerRef} className="relative flex h-[100dvh] w-[100vw] flex-col">
          {/* Embla carousel */}
          <div className="relative flex-1 overflow-hidden" ref={emblaRef}>
            <div className="flex h-full touch-pan-y">
              {images.map((image, i) => (
                <div key={i} className="relative min-w-0 shrink-0 grow-0 basis-full">
                  <div
                    className="flex h-full items-center justify-center overflow-hidden px-4 py-16 md:px-16 md:py-20"
                    style={i === selectedIndex ? { cursor: zoom > 1 ? "grab" : "default" } : {}}
                    onMouseDown={i === selectedIndex ? onMouseDown : undefined}
                    onMouseMove={i === selectedIndex ? onMouseMove : undefined}
                    onMouseUp={i === selectedIndex ? onMouseUp : undefined}
                    onMouseLeave={i === selectedIndex ? onMouseUp : undefined}
                    onTouchStart={i === selectedIndex ? onTouchStart : undefined}
                    onTouchMove={i === selectedIndex ? onTouchMove : undefined}
                  >
                    <Image
                      src={image.src}
                      alt={image.caption || `Изображение ${i + 1}`}
                      width={1920}
                      height={1080}
                      className="h-screen w-auto max-w-[95vw] select-none object-contain"
                      style={
                        i === selectedIndex
                          ? {
                              transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                              transition: zoom === 1 ? "transform 0.2s ease-out" : "none",
                            }
                          : {}
                      }
                      sizes="95vw"
                      priority={i === initialIndex}
                      draggable={false}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation arrows — hidden when zoomed */}
          {images.length > 1 && zoom === 1 && (
            <>
              <button
                onClick={scrollPrev}
                aria-label="Предыдущее изображение"
                className="absolute left-2 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 md:left-4 md:h-16 md:w-16"
              >
                <svg className="h-7 w-7 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button
                onClick={scrollNext}
                aria-label="Следующее изображение"
                className="absolute right-2 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 md:right-4 md:h-16 md:w-16"
              >
                <svg className="h-7 w-7 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </>
          )}

          {/* Caption and dots */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-6 pb-6 pt-12">
            {currentImage?.caption && (
              <p className="mb-3 text-center text-base font-medium text-white md:text-lg">
                {currentImage.caption}
              </p>
            )}
            {images.length > 1 && (
              <div className="flex items-center justify-center gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollTo(i)}
                    aria-label={`Перейти к изображению ${i + 1}`}
                    className={[
                      "h-2.5 cursor-pointer rounded-full transition-all duration-300",
                      i === selectedIndex ? "w-6 bg-white" : "w-2.5 bg-white/40 hover:bg-white/60",
                    ].join(" ")}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
