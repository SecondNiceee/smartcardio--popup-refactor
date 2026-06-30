"use client"

import { useState, useRef } from "react"
import { Loader2, ChevronLeft, Package, Tag, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import type { FormData, PvzLocation, CourierLocation, DeliveryType } from "./types"
import { log, logerr, logerr2, logwarn } from 'lib/utils'

const DEVICE_PRICE = 15600
const CASE_PRICE = 300

type PromoState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "valid"; discountPercent: number; code: string; id: string }
  | { status: "invalid" }
  | { status: "error"; message: string }

export function StepConfirm({
  data,
  deliveryType,
  pvz,
  courierLocation,
  deliverySum,
  onBack,
  onSubmit,
  loading,
  error,
}: {
  data: FormData
  deliveryType: DeliveryType
  pvz: PvzLocation | null
  courierLocation: CourierLocation | null
  deliverySum: number
  onBack: () => void
  onSubmit: (withCase: boolean, discountPercent: number, promocodeId: string | null) => void
  loading: boolean
  error: string | null
}) {
  const [withCase, setWithCase] = useState(true)
  const [promoCode, setPromoCode] = useState("")
  const [promo, setPromo] = useState<PromoState>({ status: "idle" })
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const deliveryRows =
    deliveryType === "pvz" && pvz
      ? [
          { label: "Способ доставки", value: "Пункт выдачи" },
          { label: "Пункт выдачи", value: pvz.name },
          { label: "Адрес ПВЗ", value: pvz.address },
          ...(pvz.workTime ? [{ label: "График работы", value: pvz.workTime }] : []),
        ]
      : courierLocation
        ? [
            { label: "Способ доставки", value: "Курьером" },
            { label: "Адрес доставки", value: `${data.city}, ${courierLocation.address}` },
          ]
        : []

  const discountPercent = promo.status === "valid" ? promo.discountPercent : 0
  const deviceBase = DEVICE_PRICE + (withCase ? CASE_PRICE : 0)
  const discountAmount = Math.round(deviceBase * discountPercent / 100)
  const deviceTotal = deviceBase - discountAmount
  const totalPrice = deviceTotal + Math.round(deliverySum)

  const itemName = withCase
    ? "Прибор СмартКардио® с чехлом для хранения"
    : "Прибор СмартКардио®"

  const rows = [
    { label: "Получатель", value: data.name },
    { label: "Телефон", value: data.phone },
    ...(data.email ? [{ label: "E-mail", value: data.email }] : []),
    { label: "Город", value: data.city },
    ...deliveryRows,
    ...(data.comment ? [{ label: "Комментарий", value: data.comment }] : []),
  ]

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
      log("[promo] Fetching: " + url)
      const res = await fetch(url)
      const json = await res.json()
      log("[promo] Response status:" + res.status + " | body: " + JSON.stringify(json))
      if (!res.ok) {
        logwarn("[promo] Request failed: " + json.error)
        setPromo({ status: "error", message: json.error ?? "Ошибка проверки промокода" })
        return
      }
      if (json.valid) {
        log("[promo] Valid! discountPercent: " + json.discountPercent + " id: " + json.id)
        setPromo({ status: "valid", discountPercent: json.discountPercent, code: json.code, id: json.id })
      } else {
        log("[promo] Invalid promo code")
        setPromo({ status: "invalid" })
      }
    } catch (err) {
      logerr2("[promo] Fetch error:", err)
      setPromo({ status: "error", message: "Ошибка соединения с сервером" })
    }
  }

  function handlePromoInput(value: string) {
    setPromoCode(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!value.trim()) {
      setPromo({ status: "idle" })
      return
    }
    debounceRef.current = setTimeout(() => checkPromo(value), 600)
  }

  const isValid = promo.status === "valid"
  const isInvalid = promo.status === "invalid"
  const isChecking = promo.status === "loading"
  const isError = promo.status === "error"

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-center rounded-xl border border-green-500/40 bg-green-50/60 px-4 py-2.5 dark:bg-green-950/20">
        <span className="text-sm font-medium text-green-700 dark:text-green-400">
          Оплата заказа при получении
        </span>
      </div>
      <div className="overflow-hidden rounded-xl border border-border">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex gap-3 border-b border-border px-4 py-3 last:border-b-0"
          >
            <span className="w-36 shrink-0 text-sm text-muted-foreground">{row.label}</span>
            <span className="text-sm font-medium text-foreground">{row.value}</span>
          </div>
        ))}
      </div>

      {/* Case upsell */}
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

      {/* Promo code */}
      <div
        className={[
          "rounded-xl border px-4 py-3 transition-colors",
          isValid
            ? "border-green-500/50 bg-green-50/60 dark:bg-green-950/20"
            : isInvalid || isError
              ? "border-destructive/30 bg-destructive/5"
              : "border-border bg-muted/40",
        ].join(" ")}
      >
        <div className="mb-2 flex items-center gap-2">
          <Tag className={["h-4 w-4", isValid ? "text-green-600" : "text-muted-foreground"].join(" ")} />
          <span className={["text-sm font-medium", isValid ? "text-green-700 dark:text-green-400" : ""].join(" ")}>
            Промокод
          </span>
        </div>
        <div className="relative flex items-center gap-2">
          <Input
            placeholder="Введите промокод"
            value={promoCode}
            onChange={(e) => handlePromoInput(e.target.value)}
            className={[
              "h-9 pr-9 uppercase tracking-wider transition-colors",
              isValid
                ? "border-green-500 bg-white text-green-700 focus-visible:ring-green-500 dark:bg-transparent dark:text-green-400"
                : isInvalid || isError
                  ? "border-destructive focus-visible:ring-destructive"
                  : "",
            ].join(" ")}
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
          <p className="mt-1.5 text-xs text-destructive">{(promo as { status: "error"; message: string }).message}</p>
        )}
      </div>

      {/* Price rows */}
      <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 px-4 py-3">
        <span className="text-sm text-muted-foreground">{itemName}</span>
        <div className="flex flex-col items-end">
          {isValid && (
            <span className="text-xs text-muted-foreground line-through">
              {deviceBase.toLocaleString("ru-RU")} ₽
            </span>
          )}
          <span className={["text-sm font-medium", isValid ? "text-green-600 dark:text-green-400" : ""].join(" ")}>
            {deviceTotal.toLocaleString("ru-RU")} ₽
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 px-4 py-3">
        <span className="text-sm text-muted-foreground">Доставка</span>
        <span className="text-sm font-medium">{Math.round(deliverySum).toLocaleString("ru-RU")} ₽</span>
      </div>
      <div
        className={[
          "flex items-center justify-between rounded-xl border px-4 py-3 transition-colors",
          isValid ? "border-green-500/40 bg-green-50/60 dark:bg-green-950/20" : "border-primary/30 bg-primary/5",
        ].join(" ")}
      >
        <span className="text-base font-semibold">Итого к оплате</span>
        <span className={["text-base font-bold", isValid ? "text-green-600 dark:text-green-400" : "text-primary"].join(" ")}>
          {totalPrice.toLocaleString("ru-RU")} ₽
        </span>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1" disabled={loading}>
          <ChevronLeft className="mr-1 h-4 w-4" />
          Назад
        </Button>
        <Button
          type="button"
          className="flex-1"
          onClick={() => onSubmit(withCase, discountPercent, promo.status === "valid" ? promo.id : null)}
          disabled={loading || isChecking}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Оформление...
            </>
          ) : (
            "Оформить заказ"
          )}
        </Button>
      </div>
    </div>
  )
}
