"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import {
  Loader2,
  MapPin,
  Truck,
  Package,
  Tag,
  CheckCircle2,
  XCircle,
  Search,
  HelpCircle,
  Mail,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { CityAutocomplete } from "./city-autocomplete"
import { cn } from "@/lib/utils"
import type { FormData, PvzLocation, CourierLocation, DeliveryType, Tariff } from "./types"
import { log, logerr2, logwarn } from "lib/utils"

const DEVICE_PRICE = 15600
const CASE_PRICE = 300
const PVZ_TARIFF_CODE = 136 // ПВЗ→ПВЗ
const COURIER_TARIFF_CODE = 137 // ПВЗ→дверь

interface RawPvz {
  code: string
  name: string
  nearest_metro_station?: string
  nearest_station?: string
  address_comment?: string
  location: { address_full: string; address: string }
  work_time: string
}

type PromoState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "valid"; discountPercent: number; code: string; id: string }
  | { status: "invalid" }
  | { status: "error"; message: string }

// ─── Phone helpers (сохранены из step-form) ────────────────────────────────────

function normalizeRuPhone(value: string): string {
  let digits = value.replace(/\D/g, "")
  if (digits.startsWith("8")) digits = "7" + digits.slice(1)
  if (!digits.startsWith("7")) digits = "7" + digits
  digits = digits.slice(0, 11)
  return "+" + digits
}

function formatRuPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11)
  if (!digits.startsWith("7")) return value
  const rest = digits.slice(1)
  let out = "+7"
  if (rest.length > 0) out += " " + rest.slice(0, 3)
  if (rest.length > 3) out += " " + rest.slice(3, 6)
  if (rest.length > 6) out += " " + rest.slice(6, 8)
  if (rest.length > 8) out += " " + rest.slice(8, 10)
  return out
}

function isValidRuPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "")
  return digits.length === 11 && digits.startsWith("7")
}

// ─── Component ──────────────────────────────────────────────────────────────

export function StepSingle({
  data,
  onChange,
  deliveryType,
  onDeliveryTypeChange,
  selectedPvz,
  onSelectPvz,
  courierLocation,
  onCourierChange,
  onDeliveryChange,
  onSubmit,
  loading,
  error,
}: {
  data: FormData
  onChange: (patch: Partial<FormData>) => void
  deliveryType: DeliveryType | null
  onDeliveryTypeChange: (type: DeliveryType) => void
  selectedPvz: PvzLocation | null
  onSelectPvz: (pvz: PvzLocation | null) => void
  courierLocation: CourierLocation | null
  onCourierChange: (loc: CourierLocation | null) => void
  // Сообщает родителю итоговую стоимость и тариф доставки
  onDeliveryChange: (sum: number, tariffCode: number) => void
  onSubmit: (withCase: boolean, discountPercent: number, promocodeId: string | null) => void
  loading: boolean
  error: string | null
}) {
  // Validation
  const [phoneError, setPhoneError] = useState(false)
  const phoneDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Delivery data
  const [pvzList, setPvzList] = useState<RawPvz[]>([])
  const [tariffs, setTariffs] = useState<Tariff[]>([])
  const [deliveryLoading, setDeliveryLoading] = useState(false)
  const [deliveryError, setDeliveryError] = useState<string | null>(null)
  const [pvzSearch, setPvzSearch] = useState("")
  const [courierAddress, setCourierAddress] = useState(courierLocation?.address ?? "")

  // "Нет вашего района?"
  const [showNoPvz, setShowNoPvz] = useState(false)
  const [noPvzSending, setNoPvzSending] = useState(false)
  const [noPvzSent, setNoPvzSent] = useState(false)
  const [noPvzError, setNoPvzError] = useState<string | null>(null)

  // Upsell + promo
  const [withCase, setWithCase] = useState(true)
  const [promoCode, setPromoCode] = useState("")
  const [promo, setPromo] = useState<PromoState>({ status: "idle" })
  const promoDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Phone error debounce ──
  useEffect(() => {
    if (phoneDebounceRef.current) clearTimeout(phoneDebounceRef.current)
    if (!data.phone) {
      setPhoneError(false)
      return
    }
    phoneDebounceRef.current = setTimeout(() => {
      setPhoneError(!isValidRuPhone(data.phone))
    }, 700)
    return () => {
      if (phoneDebounceRef.current) clearTimeout(phoneDebounceRef.current)
    }
  }, [data.phone])

  // ── Fetch PVZ + tariffs when city changes ──
  useEffect(() => {
    if (!data.cityCode) {
      setPvzList([])
      setTariffs([])
      return
    }
    setDeliveryLoading(true)
    setDeliveryError(null)
    // сбрасываем прежний выбор доставки при смене города
    onSelectPvz(null)
    setPvzSearch("")

    fetch(`/api/cdek/settlements?code=${data.cityCode}`)
      .then((r) => r.json())
      .then(({ region_code }: { region_code: number }) => {
        const pvzQuery =
          region_code > 0
            ? `/api/cdek/pvz?region_code=${region_code}`
            : `/api/cdek/pvz?city_code=${data.cityCode}`
        return Promise.all([
          fetch(pvzQuery).then((r) => r.json()),
          fetch(`/api/cdek/calc?city_code=${data.cityCode}`).then((r) => r.json()),
        ])
      })
      .then(([pvzData, calcData]) => {
        if (pvzData.error) throw new Error(pvzData.error)
        setPvzList(Array.isArray(pvzData) ? pvzData : [])
        if (!calcData.error) setTariffs(Array.isArray(calcData) ? calcData : [])
      })
      .catch((e: Error) => setDeliveryError(e.message))
      .finally(() => setDeliveryLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.cityCode])

  // Tariff resolution (логика сохранена из step-pvz / step-courier)
  const pvzTariff =
    tariffs.find((t) => t.tariff_code === PVZ_TARIFF_CODE) ??
    tariffs.reduce<Tariff | null>(
      (best, t) => (!best || t.delivery_sum < best.delivery_sum ? t : best),
      null,
    )

  const courierTariff =
    tariffs.find((t) => t.tariff_code === COURIER_TARIFF_CODE) ??
    tariffs
      .filter((t) => t.tariff_code !== 136 && t.tariff_code !== 137)
      .reduce<Tariff | null>(
        (best, t) => (!best || t.delivery_sum < best.delivery_sum ? t : best),
        null,
      )

  const activeTariff = deliveryType === "courier" ? courierTariff : pvzTariff
  const deliverySum = activeTariff?.delivery_sum ?? 0
  const activeTariffCode =
    deliveryType === "courier"
      ? (courierTariff?.tariff_code ?? COURIER_TARIFF_CODE)
      : PVZ_TARIFF_CODE

  // Сообщаем родителю стоимость/тариф доставки
  useEffect(() => {
    onDeliveryChange(deliverySum, activeTariffCode)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliverySum, activeTariffCode, deliveryType])

  // ── No-PVZ notify ──
  async function handleNoPvzNotify() {
    setNoPvzSending(true)
    setNoPvzError(null)
    try {
      const res = await fetch("/api/cdek/no-pvz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          email: data.email,
          city: data.city,
          comment: data.comment,
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

  // ── Promo check (логика сохранена из step-confirm) ──
  async function checkPromo(code: string) {
    const trimmed = code.trim()
    if (!trimmed) {
      setPromo({ status: "idle" })
      return
    }
    setPromo({ status: "loading" })
    log("[promo] Checking code: " + trimmed)
    try {
      const url = `/api/promocodes/check?code=${encodeURIComponent(trimmed)}`
      const res = await fetch(url)
      const json = await res.json()
      log("[promo] Response status:" + res.status + " | body: " + JSON.stringify(json))
      if (!res.ok) {
        logwarn("[promo] Request failed: " + json.error)
        setPromo({ status: "error", message: json.error ?? "Ошибка проверки промокода" })
        return
      }
      if (json.valid) {
        setPromo({ status: "valid", discountPercent: json.discountPercent, code: json.code, id: json.id })
      } else {
        setPromo({ status: "invalid" })
      }
    } catch (err) {
      logerr2("[promo] Fetch error:", err)
      setPromo({ status: "error", message: "Ошибка соединения с сервером" })
    }
  }

  function handlePromoInput(value: string) {
    setPromoCode(value)
    if (promoDebounceRef.current) clearTimeout(promoDebounceRef.current)
    if (!value.trim()) {
      setPromo({ status: "idle" })
      return
    }
    promoDebounceRef.current = setTimeout(() => checkPromo(value), 600)
  }

  // ── PVZ list filter ──
  const filteredPvz = pvzSearch.trim()
    ? pvzList.filter((pvz) => {
        const q = pvzSearch.toLowerCase()
        return (
          pvz.name.toLowerCase().includes(q) ||
          (pvz.location.address_full ?? pvz.location.address).toLowerCase().includes(q) ||
          (pvz.nearest_metro_station ?? "").toLowerCase().includes(q) ||
          (pvz.nearest_station ?? "").toLowerCase().includes(q) ||
          (pvz.address_comment ?? "").toLowerCase().includes(q)
        )
      })
    : pvzList

  // ── Pricing ──
  const isValid = promo.status === "valid"
  const isInvalid = promo.status === "invalid"
  const isChecking = promo.status === "loading"
  const isError = promo.status === "error"
  const discountPercent = isValid ? promo.discountPercent : 0
  const deviceBase = DEVICE_PRICE + (withCase ? CASE_PRICE : 0)
  const discountAmount = Math.round((deviceBase * discountPercent) / 100)
  const deviceTotal = deviceBase - discountAmount
  const totalPrice = deviceTotal + Math.round(deliverySum)
  const itemName = withCase
    ? "Прибор СмартКардио® с чехлом для хранения"
    : "Прибор СмартКардио®"

  // ── Readiness for submit ──
  const deliveryReady =
    (deliveryType === "pvz" && !!selectedPvz) ||
    (deliveryType === "courier" && courierAddress.trim().length > 0)

  const canSubmit =
    !!data.name.trim() &&
    isValidRuPhone(data.phone) &&
    !!data.cityCode &&
    !!deliveryType &&
    deliveryReady &&
    data.consent &&
    !loading &&
    !isChecking

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!isValidRuPhone(data.phone)) {
      setPhoneError(true)
      return
    }
    if (deliveryType === "courier") {
      onCourierChange({ address: courierAddress.trim() })
    }
    onSubmit(withCase, discountPercent, promo.status === "valid" ? promo.id : null)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Контактные данные */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cdek-name">
            Имя и фамилия <span className="text-destructive">*</span>
          </Label>
          <Input
            id="cdek-name"
            value={data.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="Иван Петров"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cdek-phone">
            Телефон <span className="text-destructive">*</span>
          </Label>
          <Input
            id="cdek-phone"
            type="tel"
            inputMode="tel"
            value={formatRuPhone(data.phone)}
            onChange={(e) => onChange({ phone: normalizeRuPhone(e.target.value) })}
            placeholder="+7 123 452 34 55"
            aria-invalid={phoneError}
            className={cn(phoneError && "border-destructive focus-visible:ring-destructive")}
            required
          />
          {phoneError && <p className="text-sm text-destructive">Неверный формат телефона</p>}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="cdek-email">E-mail</Label>
        <Input
          id="cdek-email"
          type="email"
          value={data.email}
          onChange={(e) => onChange({ email: e.target.value })}
          placeholder="you@example.com"
        />
      </div>

      {/* Город */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="cdek-city">
          Город <span className="text-destructive">*</span>
        </Label>
        <CityAutocomplete
          value={data.city}
          onSelect={(city) =>
            onChange({
              city: city.city,
              cityCode: String(city.city_code),
              regionCode: city.region_code,
            })
          }
        />
      </div>

      {/* Способ доставки — появляется после выбора города */}
      {!!data.cityCode && (
        <div className="flex flex-col gap-1.5">
          <Label>
            Способ доставки <span className="text-destructive">*</span>
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                { type: "pvz" as DeliveryType, Icon: MapPin, title: "Пункт выдачи" },
                { type: "courier" as DeliveryType, Icon: Truck, title: "Курьером" },
              ]
            ).map(({ type, Icon, title }) => {
              const isSelected = deliveryType === type
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => onDeliveryTypeChange(type)}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all",
                    isSelected
                      ? "border-primary bg-primary/5 text-foreground"
                      : "border-border text-muted-foreground hover:border-primary/40 hover:bg-muted/50",
                  )}
                >
                  <Icon className={cn("h-5 w-5", isSelected ? "text-primary" : "text-muted-foreground")} />
                  {title}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Стоимость доставки */}
      {!!deliveryType && !!data.cityCode && (
        <>
          {deliveryLoading && (
            <div className="flex h-14 items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          )}

          {deliveryError && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              {deliveryError}
            </div>
          )}

          {!deliveryLoading && !deliveryError && activeTariff && (
            <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Package className="h-4 w-4 text-primary" />
                <span>
                  Доставка {deliveryType === "courier" ? "курьером" : "до ПВЗ"} в {data.city}:{" "}
                  <span className="font-semibold text-primary">от {activeTariff.delivery_sum} ₽</span>
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {activeTariff.period_min}–{activeTariff.period_max} дн.
              </span>
            </div>
          )}
        </>
      )}

      {/* Строка ПВЗ — выпадающий список */}
      {deliveryType === "pvz" && !!data.cityCode && !deliveryLoading && !deliveryError && (
        <div className="flex flex-col gap-1.5">
          <Label>
            Пункт выдачи <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Например: Арбат, Тверская, Химки..."
              value={pvzSearch}
              onChange={(e) => setPvzSearch(e.target.value)}
              className="h-12 pl-10 text-base"
            />
          </div>
          <div className="max-h-64 overflow-y-auto rounded-xl border border-border">
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
                    onSelectPvz({
                      code: pvz.code,
                      name: pvz.name,
                      address: pvz.location.address_full ?? pvz.location.address,
                      workTime: pvz.work_time,
                    })
                  }
                  className={cn(
                    "flex w-full items-start gap-3 border-b border-border px-4 py-3 text-left transition-colors last:border-b-0",
                    isSelected ? "bg-primary/5 text-foreground" : "hover:bg-muted/50",
                  )}
                >
                  <MapPin
                    className={cn(
                      "mt-0.5 h-4 w-4 shrink-0",
                      isSelected ? "text-primary" : "text-muted-foreground",
                    )}
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

          {/* "Нет вашего района?" */}
          {!showNoPvz ? (
            <button
              type="button"
              onClick={() => setShowNoPvz(true)}
              className="mt-1 flex items-center gap-1.5 self-start text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              <HelpCircle className="h-4 w-4" />
              Нет вашего района?
            </button>
          ) : (
            <div className="mt-1 rounded-xl border border-border bg-muted/40 p-4">
              {noPvzSent ? (
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                  <span>Мы получили ваш запрос и свяжемся с вами в ближайшее время.</span>
                </div>
              ) : (
                <>
                  <p className="mb-3 text-sm font-medium text-foreground">Выберите, как вам удобно:</p>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 justify-start gap-2"
                      onClick={() => onDeliveryTypeChange("courier")}
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
                  {noPvzError && <p className="mt-2 text-xs text-destructive">{noPvzError}</p>}
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Строка адреса — курьер */}
      {deliveryType === "courier" && !!data.cityCode && !deliveryLoading && !deliveryError && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cdek-courier-address">
            Адрес доставки <span className="text-destructive">*</span>
          </Label>
          <Input
            id="cdek-courier-address"
            value={courierAddress}
            onChange={(e) => {
              setCourierAddress(e.target.value)
              onCourierChange({ address: e.target.value.trim() })
            }}
            placeholder="ул. Пушкина, д. 10, кв. 5"
            required
          />
          <p className="text-xs text-muted-foreground">Улица, дом, квартира — город указан выше</p>
        </div>
      )}

      {/* Комментарий */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="cdek-comment">Комментарий к заказу</Label>
        <Input
          id="cdek-comment"
          value={data.comment}
          onChange={(e) => onChange({ comment: e.target.value })}
          placeholder="Особые пожелания..."
        />
      </div>

      {/* Промокод */}
      <div
        className={cn(
          "rounded-xl border px-4 py-3 transition-colors",
          isValid
            ? "border-green-500/50 bg-green-50/60 dark:bg-green-950/20"
            : isInvalid || isError
              ? "border-destructive/30 bg-destructive/5"
              : "border-border bg-muted/40",
        )}
      >
        <div className="mb-2 flex items-center gap-2">
          <Tag className={cn("h-4 w-4", isValid ? "text-green-600" : "text-muted-foreground")} />
          <span className={cn("text-sm font-medium", isValid && "text-green-700 dark:text-green-400")}>
            Промокод
          </span>
        </div>
        <div className="relative flex items-center gap-2">
          <Input
            placeholder="Введите промокод"
            value={promoCode}
            onChange={(e) => handlePromoInput(e.target.value)}
            className={cn(
              "h-9 pr-9 uppercase tracking-wider transition-colors",
              isValid
                ? "border-green-500 bg-white text-green-700 focus-visible:ring-green-500 dark:bg-transparent dark:text-green-400"
                : (isInvalid || isError) && "border-destructive focus-visible:ring-destructive",
            )}
          />
          <div className="absolute right-2.5 flex items-center">
            {isChecking && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            {isValid && <CheckCircle2 className="h-4 w-4 text-green-500" />}
            {(isInvalid || isError) && <XCircle className="h-4 w-4 text-destructive" />}
          </div>
        </div>
        {isValid && (
          <p className="mt-1.5 text-xs font-medium text-green-600 dark:text-green-400">
            Скидка {promo.discountPercent}% применена
          </p>
        )}
        {isInvalid && (
          <p className="mt-1.5 text-xs text-destructive">Промокод не найден или недействителен</p>
        )}
        {isError && (
          <p className="mt-1.5 text-xs text-destructive">
            {(promo as { status: "error"; message: string }).message}
          </p>
        )}
      </div>

      {/* Итоги */}
      <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 px-4 py-3">
        <span className="text-sm text-muted-foreground">{itemName}</span>
        <div className="flex flex-col items-end">
          {isValid && (
            <span className="text-xs text-muted-foreground line-through">
              {deviceBase.toLocaleString("ru-RU")} ₽
            </span>
          )}
          <span className={cn("text-sm font-medium", isValid && "text-green-600 dark:text-green-400")}>
            {deviceTotal.toLocaleString("ru-RU")} ₽
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 px-4 py-3">
        <span className="text-sm text-muted-foreground">Доставка</span>
        <span className="text-sm font-medium">
          {deliveryType && deliverySum > 0 ? `${Math.round(deliverySum).toLocaleString("ru-RU")} ₽` : "—"}
        </span>
      </div>

      {/* Чехол */}
      <label
        htmlFor="add-case"
        className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3 transition-colors hover:bg-muted/70 has-[[data-state=checked]]:border-primary/40 has-[[data-state=checked]]:bg-primary/5"
      >
        <Checkbox
          id="add-case"
          checked={withCase}
          onCheckedChange={(v) => setWithCase(!!v)}
          className="mt-0.5 shrink-0"
        />
        <div className="flex flex-1 items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="text-sm font-medium">Добавить чехол для хранения прибора</span>
          </div>
          <span className="shrink-0 text-sm font-semibold text-primary">+{CASE_PRICE} ₽</span>
        </div>
      </label>

      <div
        className={cn(
          "flex items-center justify-between rounded-xl border px-4 py-3 transition-colors",
          isValid ? "border-green-500/40 bg-green-50/60 dark:bg-green-950/20" : "border-primary/30 bg-primary/5",
        )}
      >
        <span className="text-base font-semibold">
          Итого к оплате{" "}
          <span className="font-medium text-green-600 dark:text-green-400">(при получении)</span>
        </span>
        <span className={cn("text-base font-bold", isValid ? "text-green-600 dark:text-green-400" : "text-primary")}>
          {totalPrice.toLocaleString("ru-RU")} ₽
        </span>
      </div>

      {/* Согласие */}
      <div className="flex items-start gap-3">
        <Checkbox
          id="cdek-consent"
          checked={data.consent}
          onCheckedChange={(v) => onChange({ consent: v === true })}
          className="mt-0.5"
        />
        <Label
          htmlFor="cdek-consent"
          className="text-sm font-normal leading-relaxed text-muted-foreground"
        >
          Даю согласие на обработку персональных данных
        </Label>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={!canSubmit}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Оформление...
          </>
        ) : (
          "Оформить заказ"
        )}
      </Button>
    </form>
  )
}
