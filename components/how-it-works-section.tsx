"use client"

import { ResponsivePicture } from "@/components/responsive-picture"
import { Button } from "@/components/ui/button"
import { DownloadDialog } from "@/components/download-dialog"
import { PlacementDialog } from "@/components/placement-dialog"
import { VideoDialog } from "@/components/video-dialog"
import { AppInfoDialog } from "@/components/app-info-dialog"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const steps = [
  {
    number: "1",
    title: "Установите приложение",
    image: "/images/step3.jpg",
    imageAlt: "Девушка открывает приложение СмартКардио® на смартфоне",
    action: { label: "Скачать", href: "#contact", download: true },
  },
  {
    number: "2",
    title: "Снимите ЭКГ за 20 секунд",
    image: "/images/step1.jpg",
    imageAlt: "Женщина прикладывает прибор СмартКардио к телу",
    action: { label: "Куда именно приложить прибор?", href: "#recordings", scrollTo: true },
  },
  {
    number: "3",
    title: "Запись сохраняется в личном архиве",
    image: "/images/step2.jpg",
    imageAlt: "Смартфон с готовой ЭКГ на столе",
    action: { label: "Как приложение анализирует запись?" },
  },
] as const

export function HowItWorksSection() {
  const { ref, style } = useScrollAnimation({ direction: "right" })

  return (
    <section id="how" ref={ref as React.RefObject<HTMLElement>} style={style} className="overflow-x-hidden py-8 md:py-8">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20">
            Просто и быстро
          </span>
          <h2 className="mt-6 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Как это работает
          </h2>
        </div>

        {/* Numbers + arrows row aligned to grid columns */}
        <div className="mt-6 hidden grid-cols-3 gap-6 md:grid">
          {steps.map((step, index) => (
            <div key={step.number} className="relative flex items-center justify-center">
              {/* Arrow from this step to the next (right half of current + left half of next) */}
              {index < steps.length - 1 && (
                <div className="pointer-events-none absolute left-1/2 right-0 top-1/2 w-[90%] flex -translate-y-1/2 items-center">
                  {/* line from center of circle to edge */}
                  <div className="ml-7 flex w-full items-center">
                    <div className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-gradient-to-r from-primary via-accent to-primary">
                      <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                    </div>
                    <div className="relative -ml-1 flex h-8 w-8 shrink-0 items-center justify-center">
                      <div className="absolute inset-0 rounded-full bg-accent/15" />
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-5 w-5 text-accent"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
              {/* Number circle */}
              <div className="group relative z-10">
                <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-accent text-xl font-bold text-accent-foreground shadow ring-1 ring-brand-teal/40 transition-transform duration-300 hover:scale-110">
                  {step.number}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cards row */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col">
              {/* Mobile number badge */}
              <div className="mb-4 flex justify-center md:hidden">
                <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-accent text-lg font-bold text-accent-foreground shadow ring-1 ring-brand-teal/40">
                  {step.number}
                </div>
              </div>

              {/* Card */}
              <div className="flex flex-1 flex-col overflow-hidden rounded-2xl bg-background shadow-sm ring-1 ring-black/5">

                {/* Image */}
                <div className="relative mx-5 mt-5 h-52 overflow-hidden rounded-xl bg-muted">
                  <ResponsivePicture
                    src={step.image}
                    alt={step.imageAlt}
                    fill
                  />
                </div>

                {/* Text content */}
                <div className="flex flex-1 flex-col items-center p-5 text-center">
                  <h3 className="text-balance text-lg font-semibold leading-snug text-foreground">
                    {step.title}
                  </h3>
                  <div className="mt-auto pt-5">
                    {step.number === "1" ? (
                      <DownloadDialog
                        trigger={
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-auto whitespace-normal text-pretty border-primary/30 px-4 py-2 text-xs leading-snug text-primary hover:bg-primary hover:text-primary-foreground sm:text-sm"
                          >
                            {step.action.label}
                          </Button>
                        }
                      />
                    ) : step.number === "3" ? (
                      <AppInfoDialog
                        trigger={
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-auto whitespace-normal text-pretty border-primary/30 px-4 py-2 text-xs leading-snug text-primary hover:bg-primary hover:text-primary-foreground sm:text-sm"
                          >
                            {step.action.label}
                          </Button>
                        }
                      />
                    ) : step.number === "2" ? (
                      <PlacementDialog
                        trigger={
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-auto whitespace-normal text-pretty border-primary/30 px-4 py-2 text-xs leading-snug text-primary hover:bg-primary hover:text-primary-foreground sm:text-sm"
                          >
                            {step.action.label}
                          </Button>
                        }
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Video CTA */}
        <div className="mt-10 flex justify-center">
          <VideoDialog
            src="/videos/how-to-use.mp4"
            title="Как пользоваться СмартКардио®"
            trigger={
              <Button
                size="lg"
                className="h-10 gap-2 rounded-full px-5 text-sm font-semibold whitespace-nowrap sm:h-12 sm:gap-2 sm:px-7 sm:text-base md:h-14 md:px-12 md:text-lg"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-6 w-6 sm:h-8 sm:w-8"
                  aria-hidden="true"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                Смотреть видео
              </Button>
            }
          />
        </div>
      </div>
    </section>
  )
}
