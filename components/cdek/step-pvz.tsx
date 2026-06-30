"use client"

import { useState, useEffect } from "react"
import { CheckCircle2, Loader2, MapPin, Package, ChevronRight, ChevronLeft, Search, HelpCircle, Mail, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { PvzLocation, Tariff } from "./types"

interface RawPvz {
  code: string
  name: string
  nearest_metro_station?: string
  nearest_station?: string
  address_comment?: string
  location: { address_full: string; address: string }
  work_time: string
}

interface FormData {
  name: string
  phone: string
  email: string
  comment: string
}

export function StepPvz({
  cityCode,
  regionCode,
  cityName,
  selectedPvz,
  formData,
  onSelect,
  onBack,
  onNext,
  onSwitchToCourier,
}: {
  cityCode: string
  regionCode: number
  cityName: string
  selectedPvz: PvzLocation | null
  formData: FormData
  onSelect: (pvz: PvzLocation) => void
  onBack: () => void
  onNext: (deliverySum: number) => void
  onSwitchToCourier: () => void
}) {
  const [pvzList, setPvzList] = useState<RawPvz[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tariffs, setTariffs] = useState<Tariff[]>([])
  const [showNoPvz, setShowNoPvz] = useState(false)
  const [noPvzSending, setNoPvzSending] = useState(false)
  const [noPvzSent, setNoPvzSent] = useState(false)
  const [noPvzError, setNoPvzError] = useState<string | null>(null)

  useEffect(() => {
    if (!cityCode) return
    setLoading(true)
    setError(null)

    // Step 1: get region_code from /settlements, then fetch PVZ by region_code.
    // Fall back to city_code if region_code is unavailable.
    fetch(`/api/cdek/settlements?code=${cityCode}`)
      .then((r) => r.json())
      .then(({ region_code }: { region_code: number }) => {
        const pvzQuery =
          region_code > 0
            ? `/api/cdek/pvz?region_code=${region_code}`
            : `/api/cdek/pvz?city_code=${cityCode}`

        return Promise.all([
          fetch(pvzQuery).then((r) => r.json()),
          fetch(`/api/cdek/calc?city_code=${cityCode}`).then((r) => r.json()),
        ])
      })
      .then(([pvzData, calcData]) => {
        if (pvzData.error) throw new Error(pvzData.error)
        setPvzList(pvzData)
        if (!calcData.error) setTariffs(calcData)
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [cityCode])

  async function handleNoPvzNotify() {
    setNoPvzSending(true)
    setNoPvzError(null)
    try {
      const res = await fetch("/api/cdek/no-pvz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          city: cityName,
          comment: formData.comment,
        }),
      })
      if (!res.ok) throw new Error("Ошибка отправки")
      setNoPvzSent(true)
    } catch {
      setNoPvzError("Не удалось отправить запрос. Попробуйте ещё раз.")
    } finally {
      setNoPvzSending(false)
    }
  }

  // Tariff 136 = Посылка склад-склад (ПВЗ→ПВЗ)
  const PVZ_TARIFF_CODE = 136
  const cheapestTariff =
    tariffs.find((t) => t.tariff_code === PVZ_TARIFF_CODE) ??
    tariffs.reduce<Tariff | null>(
      (best, t) => (!best || t.delivery_sum < best.delivery_sum ? t : best),
      null,
    )

  const filteredPvz = search.trim()
    ? pvzList.filter((pvz) => {
        const q = search.toLowerCase()
        return (
          pvz.name.toLowerCase().includes(q) ||
          (pvz.location.address_full ?? pvz.location.address).toLowerCase().includes(q) ||
          (pvz.nearest_metro_station ?? "").toLowerCase().includes(q) ||
          (pvz.nearest_station ?? "").toLowerCase().includes(q) ||
          (pvz.address_comment ?? "").toLowerCase().includes(q)
        )
      })
    : pvzList

  return (
    <div className="flex flex-col gap-4">
      {cheapestTariff && (
        <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Package className="h-4 w-4 text-primary" />
            <span>
              Доставка до {cityName}:{" "}
              <span className="font-semibold text-primary">от {cheapestTariff.delivery_sum} ₽</span>
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {cheapestTariff.period_min}–{cheapestTariff.period_max} дн.
          </span>
        </div>
      )}

      {loading && (
        <div className="flex h-56 items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-medium text-foreground">
              Начните писать адрес (метро, улицу, поселок или район)
            </p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Например: Арбат, Тверская, Химки..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 pl-10 text-base"
              />
            </div>
          </div>

          <div className="max-h-72 overflow-y-auto rounded-xl border border-border">
            {filteredPvz.length === 0 && (
              <p className="px-4 py-6 text-center text-sm text-muted-foreground">Ничего не найдено</p>
            )}
            {filteredPvz.map((pvz) => {
              const isSelected = selectedPvz?.code === pvz.code
              return (
                <button
                  key={pvz.code}
                  type="button"
                  onClick={() =>
                    onSelect({
                      code: pvz.code,
                      name: pvz.name,
                      address: pvz.location.address_full ?? pvz.location.address,
                      workTime: pvz.work_time,
                    })
                  }
                  className={[
                    "flex w-full items-start gap-3 border-b border-border px-4 py-3 text-left transition-colors last:border-b-0",
                    isSelected ? "bg-primary/5 text-foreground" : "hover:bg-muted/50",
                  ].join(" ")}
                >
                  <MapPin
                    className={[
                      "mt-0.5 h-4 w-4 shrink-0",
                      isSelected ? "text-primary" : "text-muted-foreground",
                    ].join(" ")}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{pvz.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {pvz.location.address_full ?? pvz.location.address}
                    </p>
                    {(pvz.nearest_metro_station || pvz.nearest_station) && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        м. {pvz.nearest_metro_station ?? pvz.nearest_station}
                      </p>
                    )}
                    {pvz.work_time && (
                      <p className="mt-0.5 text-xs text-muted-foreground">{pvz.work_time}</p>
                    )}
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="ml-auto mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  )}
                </button>
              )
            })}
          </div>
        </>
      )}

      {/* "Нет вашего района?" block */}
      {!showNoPvz ? (
        <button
          type="button"
          onClick={() => setShowNoPvz(true)}
          className="flex items-center gap-1.5 self-start text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          <HelpCircle className="h-4 w-4" />
          Нет вашего района?
        </button>
      ) : (
        <div className="rounded-xl border border-border bg-muted/40 p-4">
          {noPvzSent ? (
            <div className="flex items-center gap-2 text-sm text-foreground">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
              <span>Мы получили ваш запрос и свяжемся с вами в ближайшее время.</span>
            </div>
          ) : (
            <>
              <p className="mb-3 text-sm font-medium text-foreground">
                Выберите, как вам удобно:
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 justify-start gap-2"
                  onClick={onSwitchToCourier}
                >
                  <Truck className="h-4 w-4 shrink-0" />
                  Доставка курьером
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 justify-start gap-2"
                  disabled={noPvzSending}
                  onClick={handleNoPvzNotify}
                >
                  {noPvzSending ? (
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                  ) : (
                    <Mail className="h-4 w-4 shrink-0" />
                  )}
                  Сообщить нам
                </Button>
              </div>
              {noPvzError && (
                <p className="mt-2 text-xs text-destructive">{noPvzError}</p>
              )}
              <p className="mt-2 text-xs text-muted-foreground">
                «Сообщить нам» — отправит ваши контактные данные, и мы найдём решение.
              </p>
            </>
          )}
        </div>
      )}

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Назад
        </Button>
        <Button
          type="button"
          className="flex-1"
          disabled={!selectedPvz}
          onClick={() => onNext(cheapestTariff?.delivery_sum ?? 0)}
        >
          Подтвердить
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
