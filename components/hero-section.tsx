"use client"

import { Button } from "@/components/ui/button"
import { Activity, ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-x-hidden">
      {/* Background video */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="/images/smartcardioStart.webp"
      >
        <source src="/videos/smartcardio.mp4" type="video/mp4" />
      </video>

      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-4 text-center md:px-8">
        <div className="relative flex max-w-3xl flex-col items-center px-8 sm:px-16">
          {/* Decorative corner accents */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-tr-[3rem] border-r-2 border-t-2 border-white/40 sm:-right-10 sm:-top-10 sm:h-28 sm:w-28"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-4 -left-4 h-20 w-20 rounded-bl-[3rem] border-b-2 border-l-2 border-white/40 sm:-bottom-10 sm:-left-10 sm:h-28 sm:w-28"
          />
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
            <Activity className="h-4 w-4" />
            Дистанционная диагностика сердца
          </div>

          <h1 className="text-balance text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Измеряйте ЭКГ не выходя из дома
          </h1>

          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-white/85 md:text-xl">
            СмартКардио® записывает многоканальную ЭКГ без гелей и проводов, все
            данные сохраняются в личном архиве.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-white font-semibold text-foreground hover:bg-white/90 text-base"
            >
              <a href="#app">
                Читать далее
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/5 font-semibold text-white backdrop-blur-sm hover:bg-white/15 hover:text-white text-base"
            >
              <a href="#how">Как это работает</a>
            </Button>
          </div>


        </div>
      </div>
    </section>
  )
}
