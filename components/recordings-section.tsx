"use client"

import { useState, useEffect, useCallback } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ResponsivePicture } from "@/components/responsive-picture"
import { GalleryDialog, type GalleryImage } from "@/components/gallery-dialog"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { log, logerr, logerr2, logwarn } from 'lib/utils'

const slides: GalleryImage[] = [
  {
    src: "/images/recording-01-atrial-tachycardia.webp",
    caption: "Эпизод предсердной тахикардии",
  },
  {
    src: "/images/recording-02-sinus-norm.webp",
    caption: "Синусовый ритм, вариант нормы",
  },
  {
    src: "/images/recording-03-bigeminy.webp",
    caption: "Желудочковая бигеминия с дефицитом пульса",
  },
  {
    src: "/images/recording-04-ivr.png",
    caption: "Эпизод ускоренного идиовентрикулярного ритма",
  },
  {
    src: "/images/recording-05-avb.png",
    caption: "Полная атриовентрикулярная блокада",
  },
  {
    src: "/images/recording-06-tachycardia.png",
    caption: "Синусовая тахикардия",
  },
  {
    src: "/images/recording-07-ischemia.png",
    caption: "Острая ишемия миокарда",
  },
  {
    src: "/images/recording-08-ves.png",
    caption: "Частая желудочковая экстрасистолия",
  },
]

export function RecordingsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    containScroll: false,
    skipSnaps: false,
    startIndex: 1,
  })
  const [selectedIndex, setSelectedIndex] = useState(1)
  const { ref, style } = useScrollAnimation({ direction: "right" })

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("reInit", onSelect)
    }
  }, [emblaApi, onSelect])

  return (
    <section id="recordings" ref={ref as React.RefObject<HTMLElement>} style={style} className="relative overflow-hidden py-8 md:py-8">
      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20">
            Более 20 000 записей снято
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Примеры записей с прибора
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
            Все записи сохраняются в личном архиве в формате PDF. Данные доступны для просмотра, печати или передачи специалисту
          </p>
        </div>

        {/* Embla carousel */}
        <div className="relative mt-10">
          {/* Left fade */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-background to-transparent sm:w-28 md:w-40" />
          {/* Right fade */}
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-background to-transparent sm:w-28 md:w-40" />
          <div className="overflow-hidden px-16 sm:px-20 md:px-24" ref={emblaRef}>
            <div className="flex touch-pan-y">
              {slides.map((slide, i) => {
                const isActive = i === selectedIndex
                return (
                  <div
                    key={i}
                    className="min-w-0 shrink-0 grow-0 basis-[80%] pl-4 sm:basis-[62%] md:basis-[52%]"
                  >
                    <div
                      className={[
                        "overflow-hidden rounded-2xl transition-all duration-500 ease-out",
                        isActive
                          ? "scale-100 opacity-100 shadow-2xl ring-2 ring-primary/20"
                          : "scale-[0.88] opacity-40",
                      ].join(" ")}
                    >
                      {isActive ? (
                        <GalleryDialog
                          trigger={
                            <div className="group relative cursor-pointer">
                              <div className="relative aspect-[4/3] w-full">
                                  <img
                                      src={slide.src}
                                      alt={slide.caption || ""}
                                      className="transition-transform duration-300 group-hover:scale-105"
                                      loading={i === 0 ? "eager" : "lazy"}
                                      fetchPriority={i === 0 ? "high" : undefined}
                                  />
                                  {/* Magnifying glass overlay */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/40">
                                  <div className="flex h-14 w-14 scale-0 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform duration-300 group-hover:scale-100">
                                    <svg
                                      className="h-6 w-6 text-foreground"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth={2}
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6"
                                      />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                          }
                          images={slides}
                          initialIndex={i}
                          title="Примеры записей с прибора"
                        />
                      ) : (
                        <div className="relative aspect-[4/3] w-full">
                            <img
                                src={slide.src}
                                alt={slide.caption || ""}
                            />
                        </div>
                      )}
                      <div className="flex items-center justify-center bg-foreground/90 px-4 py-3">
                        <p className="truncate text-center text-sm font-semibold text-background md:text-base">
                          {slide.caption}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Nav arrows */}
          <button
            onClick={scrollPrev}
            aria-label="Предыдущая запись"
            className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-background shadow-md ring-1 ring-border backdrop-blur-sm transition-colors hover:bg-muted sm:left-6 md:left-8"
          >
            <svg className="h-5 w-5 text-foreground" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={scrollNext}
            aria-label="Следующая запись"
            className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-background shadow-md ring-1 ring-border backdrop-blur-sm transition-colors hover:bg-muted sm:right-6 md:right-8"
          >
            <svg className="h-5 w-5 text-foreground" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        {/* Dot indicators */}
        <div className="mt-6 flex items-center justify-center gap-2" role="tablist" aria-label="Слайды">
          {slides.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === selectedIndex}
              aria-label={`Запись ${i + 1}`}
              onClick={() => scrollTo(i)}
              className={[
                "h-2.5 rounded-full transition-all duration-300",
                i === selectedIndex
                  ? "w-6 bg-primary"
                  : "w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/60",
              ].join(" ")}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
