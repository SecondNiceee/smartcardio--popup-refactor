"use client"

import { type ReactNode } from "react"
import { ResponsivePicture } from "@/components/responsive-picture"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function AppInfoDialog({ trigger }: { trigger: ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Удобное приложение</DialogTitle>
        </DialogHeader>

        <div className="mt-2 flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:gap-10">
          {/* Image */}
          <div className="mx-auto w-full max-w-xs lg:w-[45%] lg:max-w-none lg:shrink-0">
            <img
              src="/images/phones.png"
              alt="Три смартфона с приложением СмартКардио, показывающие цветовую индикацию результатов: зеленый — норма, жёлтый — экстрасистолия, красный — фибрилляция предсердий"
              className="h-auto w-full"
              width={900}
              height={700}
            />
          </div>

          {/* Text content */}
          <div className="lg:flex-1">
            <h3 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
              Удобное приложение с распознаванием на основе ИИ
            </h3>
            <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
              Приложение автоматически анализирует ЭКГ и помогает обратить внимание на возможные нарушения ритма. Анализ может использоваться как дополнительный инструмент наблюдения. Результат не заменяет консультацию врача.
            </p>

            {/* Color indicators */}
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100">
                  <div className="h-4 w-4 rounded-full bg-green-500" />
                </div>
                <p className="font-semibold text-foreground">Норма</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-yellow-100">
                  <div className="h-4 w-4 rounded-full bg-yellow-500" />
                </div>
                <p className="font-semibold text-foreground">Внимание</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100">
                  <div className="h-4 w-4 rounded-full bg-red-500" />
                </div>
                <p className="font-semibold text-foreground">Тревога</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
