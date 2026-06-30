"use client"

import { useState, useEffect, useCallback, type ReactNode } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ResponsivePicture } from "@/components/responsive-picture"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const uniqueSlides = [
  {
    src: "/images/howto-applic-ankle.png",
    title: "Лодыжка левой ноги",
    description: "Приложите прибор к лодыжке для быстрой регистрации показателей.",
  },
  {
    src: "/images/howto-applic-knee.png",
    title: "Колено левой ноги",
    description: "Для комфортной записи из положения сидя разместите прибор на колене левой ноги.",
  },
  {
    src: "/images/howto-applic-stomach.png",
    title: "Левая область живота",
    description:
      "Положение прибора в левой области живота позволяет измерять не только основные показатели, но и дыхательные движения.",
  },
]

// Duplicate slides to create 6 total (3 unique + 3 duplicates)
const slides = [...uniqueSlides, ...uniqueSlides]

export function PlacementDialog({ trigger }: { trigger: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    containScroll: false,
    skipSnaps: false,
    startIndex: 2,
  })
  const [selectedIndex, setSelectedIndex] = useState(0)

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

  // Re-measure the carousel once the dialog is actually visible.
  // Embla can't measure slide widths while the dialog is display:none,
  // which causes slides to overlap/overflow until a resize occurs.
  useEffect(() => {
    if (!open || !emblaApi) return
    const timer = setTimeout(() => emblaApi.reInit(), 50)
    return () => clearTimeout(timer)
  }, [open, emblaApi])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[95vh] overflow-hidden sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl md:text-2xl">Куда именно приложить прибор</DialogTitle>
          <DialogDescription className="text-center">
            Прибор можно использовать в нескольких удобных положениях. Выберите то, что подходит именно вам.
          </DialogDescription>
        </DialogHeader>

        {/* Embla carousel */}
        <div className="relative mx-auto mt-2 w-full overflow-hidden px-2 py-2">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex touch-pan-y">
              {slides.map((slide, i) => {
                const isActive = i === selectedIndex
                return (
                  <div key={i} className="min-w-0 shrink-0 grow-0 basis-[80%] pl-4 sm:basis-[60%]">
                    <div
                      className={[
                        "overflow-hidden rounded-2xl bg-background transition-all duration-500 ease-out",
                        isActive
                          ? "scale-100 opacity-100 shadow-2xl ring-2 ring-primary/20"
                          : "scale-[0.88] opacity-40",
                      ].join(" ")}
                    >
                      <div className="relative h-[18rem] w-full sm:h-[24rem]">
                        <ResponsivePicture
                          src={slide.src}
                          alt={slide.title}
                          fill
                          webpDir="/images/r"
                          imgStyle={{ objectPosition: "top" }}
                          fetchPriority={i === 0 ? "high" : undefined}
                          loading={i === 0 ? "eager" : "lazy"}
                        />
                      </div>
                      <div className="bg-foreground/90 px-5 py-4">
                        <p className="text-center text-base font-semibold text-background md:text-lg">{slide.title}</p>
                        <p className="mt-1.5 text-pretty text-center text-sm leading-relaxed text-background/70">
                          {slide.description}
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
            aria-label="Предыдущее положение"
            className="absolute left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 shadow backdrop-blur-sm transition-colors hover:bg-background md:left-4"
          >
            <svg
              className="h-5 w-5 text-foreground"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={scrollNext}
            aria-label="Следующее положение"
            className="absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 shadow backdrop-blur-sm transition-colors hover:bg-background md:right-4"
          >
            <svg
              className="h-5 w-5 text-foreground"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>


      </DialogContent>
    </Dialog>
  )
}
