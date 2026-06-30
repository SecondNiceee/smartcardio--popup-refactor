"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { CdekOrderDialog } from "@/components/cdek-order-dialog"

export function AppSection() {
  const { ref, style } = useScrollAnimation({ direction: "left" })

  return (
    <section id="app" ref={ref as React.RefObject<HTMLElement>} style={style} className="relative overflow-x-hidden py-8 md:py-10">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-1/4 h-64 w-64 rotate-12 rounded-[42%_58%_70%_30%/45%_45%_55%_55%] bg-primary/5 blur-3xl" />
        <div className="absolute -right-32 bottom-1/4 h-64 w-64 -rotate-12 rounded-[63%_37%_30%_70%/57%_58%_42%_43%] bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20">
            Описание
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            СмартКардио®
          </h2>
        </div>

        {/* Main content block — product intro + measurements combined */}
        <div className="mt-8 overflow-hidden rounded-2xl bg-background shadow-2xl ring-1 ring-black/10">
          {/* Top: product description + video */}
          <div className="px-4 py-6 sm:px-8 sm:py-8 md:px-12">
            <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">

              {/* Text content with hero-style corner accents */}
              <div className="relative max-w-xl px-12 py-8 lg:flex-1">
                {/* Top-left corner accent */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-2 -top-2 h-16 w-16 rounded-tl-[2rem] border-l-2 border-t-2 border-primary/40"
                />
                {/* Bottom-right corner accent */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-2 -right-2 h-16 w-16 rounded-br-[2rem] border-b-2 border-r-2 border-primary/40"
                />

                <h3 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  Портативный Кардиомонитор
                </h3>

                <p className="mt-5 text-lg leading-relaxed text-foreground md:text-xl">
                  Прибор для регистрации данных о работе сердца. Все записи автоматически
                  сохраняются и отображаются в мобильном приложении.
                </p>

                {/* Indicators list */}
                <div className="mt-8">
                  <p className="text-base font-semibold uppercase tracking-wide text-accent">Что регистрирует?</p>
                  <ul className="mt-4 space-y-3">
                    {[
                      "ЭКГ в шести отведениях (I, II, III, aVL, aVR, aVF)",
                      "Пульсовую волну с расчетом сатурации крови кислородом",
                      "Дыхательные движения (график дыхания)",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent ring-1 ring-inset ring-accent/20"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        </span>
                        <span className="text-base font-medium text-foreground md:text-lg">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Order button */}
                <CdekOrderDialog
                  trigger={
                    <button className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 whitespace-nowrap sm:px-6 sm:py-3 sm:text-base">
                      Заказать за 15 600 ₽
                    </button>
                  }
                />
              </div>

              {/* Video container - 25% width, no decoration */}
              <div className="mx-auto w-full max-w-xs lg:w-[25%] lg:max-w-none lg:shrink-0">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="h-auto w-full"
                >
                  <source src="/videos/chuck.webm" type="video/webm" />
                  Ваш браузер не поддерживает воспроизведение видео.
                </video>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
