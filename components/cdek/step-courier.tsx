"use client"

import { useState, useEffect } from "react"
import { Loader2, Package, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { CourierLocation, Tariff } from "./types"

// Tariff 137 = Посылка склад-дверь (ПВЗ→дверь)
const COURIER_TARIFF_CODE = 137

export function StepCourier({
  cityCode,
  cityName,
  courierLocation,
  onChange,
  onBack,
  onNext,
}: {
  cityCode: string
  cityName: string
  courierLocation: CourierLocation | null
  onChange: (loc: CourierLocation) => void
  onBack: () => void
  onNext: (deliverySum: number, tariffCode: number) => void
}) {
  const [address, setAddress] = useState(courierLocation?.address ?? "")
  const [tariffs, setTariffs] = useState<Tariff[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!cityCode) return
    setLoading(true)
    fetch(`/api/cdek/calc?city_code=${cityCode}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        setTariffs(Array.isArray(data) ? data : [])
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [cityCode])

  // Use tariff 139 (door-to-door) if available, otherwise cheapest non-PVZ tariff
  const courierTariff =
    tariffs.find((t) => t.tariff_code === COURIER_TARIFF_CODE) ??
    tariffs
      .filter((t) => t.tariff_code !== 136 && t.tariff_code !== 137)
      .reduce<Tariff | null>((best, t) => (!best || t.delivery_sum < best.delivery_sum ? t : best), null)

  function handleNext() {
    if (!address.trim() || !courierTariff) return
    onChange({ address: address.trim() })
    onNext(courierTariff.delivery_sum, courierTariff.tariff_code)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Delivery cost banner */}
      {!loading && courierTariff && (
        <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Package className="h-4 w-4 text-primary" />
            <span>
              Доставка курьером в {cityName}:{" "}
              <span className="font-semibold text-primary">от {courierTariff.delivery_sum} ₽</span>
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {courierTariff.period_min}–{courierTariff.period_max} дн.
          </span>
        </div>
      )}

      {loading && (
        <div className="flex h-16 items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="cdek-courier-address">
          Адрес доставки <span className="text-destructive">*</span>
        </Label>
        <Input
          id="cdek-courier-address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="ул. Пушкина, д. 10, кв. 5"
          required
        />
        <p className="text-xs text-muted-foreground">
          Улица, дом, квартира — город указан выше
        </p>
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Назад
        </Button>
        <Button
          type="button"
          className="flex-1"
          disabled={!address.trim() || !courierTariff}
          onClick={handleNext}
        >
          Подтвердить
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
