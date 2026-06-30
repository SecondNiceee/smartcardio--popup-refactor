"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { CityAutocomplete } from "./city-autocomplete"
import { cn } from "@/lib/utils"
import type { FormData } from "./types"

// Нормализует номер для хранения и отправки в СДЭК: +79991234567 (без пробелов)
function normalizeRuPhone(value: string): string {
  let digits = value.replace(/\D/g, "")
  if (digits.startsWith("8")) digits = "7" + digits.slice(1)
  if (!digits.startsWith("7")) digits = "7" + digits
  digits = digits.slice(0, 11)
  return "+" + digits
}

// Форматирует отображение в поле ввода: +7 123 452 34 55
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
  // Должно быть ровно 11 цифр и начинаться с 7
  const digits = value.replace(/\D/g, "")
  return digits.length === 11 && digits.startsWith("7")
}

export function StepForm({
  data,
  onChange,
  onNext,
}: {
  data: FormData
  onChange: (patch: Partial<FormData>) => void
  onNext: () => void
}) {
  const [phoneError, setPhoneError] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Debounce: после остановки ввода проверяем номер и подсвечиваем ошибку
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    // Пустое поле не подсвечиваем как ошибку
    if (!data.phone) {
      setPhoneError(false)
      return
    }
    debounceRef.current = setTimeout(() => {
      setPhoneError(!isValidRuPhone(data.phone))
    }, 700)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [data.phone])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!isValidRuPhone(data.phone)) {
      setPhoneError(true)
      return
    }
    setPhoneError(false)
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex items-center justify-center rounded-xl border border-green-500/40 bg-green-50/60 px-4 py-2.5 dark:bg-green-950/20">
        <span className="text-sm font-medium text-green-700 dark:text-green-400">
          Оплата заказа при получении
        </span>
      </div>
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
            className={cn(
              phoneError && "border-destructive focus-visible:ring-destructive",
            )}
            required
          />
          {phoneError && (
            <p className="text-sm text-destructive">Неверный формат телефона</p>
          )}
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

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="cdek-comment">Комментарий к заказу</Label>
        <Input
          id="cdek-comment"
          value={data.comment}
          onChange={(e) => onChange({ comment: e.target.value })}
          placeholder="Особые пожелания..."
        />
      </div>

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

      <Button type="submit" className="mt-1 w-full" disabled={!data.consent || !data.cityCode}>
        Выбрать способ доставки
        <ChevronRight className="ml-1 h-4 w-4" />
      </Button>
    </form>
  )
}
