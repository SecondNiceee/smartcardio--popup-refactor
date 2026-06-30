"use client"

import { MapPin, Truck, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { DeliveryType } from "./types"

const OPTIONS = [
  {
    type: "pvz" as DeliveryType,
    Icon: MapPin,
    title: "В пункт выдачи",
    description: "Получите заказ в ближайшем ПВЗ СДЭК",
  },
  {
    type: "courier" as DeliveryType,
    Icon: Truck,
    title: "Курьером",
    description: "Доставим по указанному адресу",
  },
]

export function DeliveryTypePicker({
  selected,
  onSelect,
  onBack,
  onNext,
}: {
  selected: DeliveryType | null
  onSelect: (type: DeliveryType) => void
  onBack: () => void
  onNext: () => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {OPTIONS.map(({ type, Icon, title, description }) => {
          const isSelected = selected === type
          return (
            <button
              key={type}
              type="button"
              onClick={() => onSelect(type)}
              className={[
                "flex flex-col items-center gap-3 rounded-xl border-2 p-5 text-center transition-all",
                isSelected
                  ? "border-primary bg-primary/5 text-foreground"
                  : "border-border hover:border-primary/40 hover:bg-muted/50",
              ].join(" ")}
            >
              <div
                className={[
                  "flex h-12 w-12 items-center justify-center rounded-full",
                  isSelected ? "bg-primary/10" : "bg-muted",
                ].join(" ")}
              >
                <Icon
                  className={["h-6 w-6", isSelected ? "text-primary" : "text-muted-foreground"].join(" ")}
                />
              </div>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
              </div>
            </button>
          )
        })}
      </div>

      <div className="mt-2 flex gap-3">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Назад
        </Button>
        <Button type="button" className="flex-1" disabled={!selected} onClick={onNext}>
          Продолжить
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
