"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { ResponsivePicture } from "@/components/responsive-picture"
import { ShieldCheck } from "lucide-react"
import { GalleryDialog, type GalleryImage } from "@/components/gallery-dialog"

const patents = [
  {
    src: "/images/sertificate2.webp",
    alt: "Патент на полезную модель №206009 - Автономное устройство для регистрации жизненноважных показателей",
    title: "Патент на полезную модель",
    number: "№206009",
  },
  {
    src: "/images/sertificate1.webp",
    alt: "Патент на изобретение №2766759 - Многофункциональное портативное устройство для регистрации и анализа жизненно важных показателей",
    title: "Патент на изобретение",
    number: "№2766759",
  },
  {
    src: "/images/sertificate3.webp",
    alt: "Свидетельство о государственной регистрации программы для ЭВМ №2022663045 - Cardioxium Backend",
    title: "Свидетельство ПО",
    number: "№2022663045",
  },
  {
    src: "/images/sertificate4.webp",
    alt: "Свидетельство на товарный знак №989247 - SMARTCARDIO",
    title: "Товарный знак",
    number: "№989247",
  },
]

const galleryImages: GalleryImage[] = patents.map((p) => ({
  src: p.src,
  caption: `${p.title} ${p.number}`,
}))

export function PatentsSection() {
  const { ref, style } = useScrollAnimation({ direction: "bottom" })

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      style={style}
      className="relative overflow-hidden py-8 md:py-10"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20">
            <ShieldCheck className="h-4 w-4" />
            Защищено законом
          </span>
          <h2 className="mt-6 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Уникальность продукции защищена патентами Российской Федерации
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Прибор СмартКардио® создан российскими разработчиками при участии практикующих врачей кардиологов.
          </p>
        </div>

        {/* Patents Grid */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-8">
          {patents.map((patent, index) => (
            <GalleryDialog
              key={patent.number}
              images={galleryImages}
              initialIndex={index}
              title="Патенты и свидетельства"
              trigger={
                <div className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-card/50 p-3 ring-1 ring-border/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:ring-primary/30 hover:shadow-xl sm:p-4">
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-muted/30">
                      <img
                          src={patent.src}
                          alt={patent.alt}
                          className="p-2 transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* Magnifying glass overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/30">
                      <div className="flex h-12 w-12 scale-0 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform duration-300 group-hover:scale-100">
                        <svg
                          className="h-5 w-5 text-foreground"
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

                  {/* Caption */}
                  <div className="mt-3 text-center sm:mt-4">
                    <p className="text-xs font-medium text-muted-foreground sm:text-sm">
                      {patent.title}
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-foreground sm:text-base">
                      {patent.number}
                    </p>
                  </div>
                </div>
              }
            />
          ))}
        </div>
      </div>
    </section>
  )
}
