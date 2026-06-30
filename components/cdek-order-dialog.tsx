"use client"

import { useState, type ReactNode, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { StepBar } from "@/components/cdek/step-bar"
import { StepForm } from "@/components/cdek/step-form"
import { DeliveryTypePicker } from "@/components/cdek/delivery-type-picker"
import { StepPvz } from "@/components/cdek/step-pvz"
import { StepCourier } from "@/components/cdek/step-courier"
import { StepConfirm } from "@/components/cdek/step-confirm"
import type { FormData, PvzLocation, CourierLocation, DeliveryType, Step } from "@/components/cdek/types"
// shipment_point берётся из env CDEK_SHIPMENT_POINT через API route

import { log, logerr, logerr2, logwarn } from 'lib/utils'
import { ResponsivePicture } from "./responsive-picture"


// ─── Constants ────────────────────────────────────────────────────────────────

const DEVICE_PRICE = 15600   // цена прибора (платит покупатель)
const COMMISSION = 0.06      // комиссия СДЭК 6%
const SELLER_AMOUNT = Math.round(DEVICE_PRICE * (1 - COMMISSION) * 100) / 100

// Тарифы: ПВЗ→ПВЗ = 136, ПВЗ→дверь = 137
const TARIFF_PVZ_TO_PVZ = 136
const TARIFF_PVZ_TO_DOOR = 137

const INITIAL_FORM: FormData = {
  name: "",
  phone: "",
  email: "",
  city: "",
  cityCode: "",
  regionCode: 0,
  comment: "",
  consent: true,
}

const STEP_TITLE: Partial<Record<Step, string>> = {
  form: "Оформление заказа",
  "delivery-type": "Способ доставки",
  pvz: "Выберите пункт выдачи",
  courier: "Адрес доставки",
  confirm: "Подтверждение заказа",
}

// ─── Main component ───────────────────────────────────────────────────────────

export function CdekOrderDialog({
  trigger,
  open: openProp,
  onOpenChange: onOpenChangeProp,
}: {
  trigger?: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const isControlled = openProp !== undefined
  const [openInternal, setOpenInternal] = useState(false)
  const open = isControlled ? openProp : openInternal
  const setOpen = (next: boolean) => {
    if (!isControlled) setOpenInternal(next)
    onOpenChangeProp?.(next)
  }
  const [step, setStep] = useState<Step>("form")
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM)
  const [deliveryType, setDeliveryType] = useState<DeliveryType | null>(null)
  const [selectedPvz, setSelectedPvz] = useState<PvzLocation | null>(null)
  const [courierLocation, setCourierLocation] = useState<CourierLocation | null>(null)
  const [deliverySum, setDeliverySum] = useState(0)
  const [deliveryTariffCode, setDeliveryTariffCode] = useState(TARIFF_PVZ_TO_PVZ)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)


  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      setTimeout(() => {
        setStep("form")
        setFormData(INITIAL_FORM)
        setDeliveryType(null)
        setSelectedPvz(null)
        setCourierLocation(null)
        setDeliverySum(0)
        setDeliveryTariffCode(138)
        setSubmitting(false)
        setSubmitError(null)
      }, 300)
    }
  }

  function handleDeliveryTypeNext() {
    if (!deliveryType) return
    setStep(deliveryType)
  }

  async function handleSubmitOrder(withCase: boolean, discountPercent = 0, promocodeId: string | null = null) {
    setSubmitting(true)
    setSubmitError(null)

    const CASE_PRICE = 300
    const fullPrice = DEVICE_PRICE + (withCase ? CASE_PRICE : 0)
    // Цена с учётом промокода — именно её платит покупатель (payment.value в СДЭК)
    const discount = discountPercent > 0 ? discountPercent : 0
    const itemPrice = Math.round(fullPrice * (1 - discount / 100) * 100) / 100
    const itemName = withCase
      ? "Прибор СмартКардио® с чехлом для хранения"
      : "СмартКардио® прибор"
    // Комиссия СДЭК (6%) удерживается в любом случае — считаем от цены со скидкой
    const sellerAmount = Math.round(itemPrice * (1 - COMMISSION) * 100) / 100
    const deliveryCost = Math.round(deliverySum * 100) / 100

    log("[order] discountPercent: " + discount + " | fullPrice: " + fullPrice + "| itemPrice (с учётом скидки):" + itemPrice + "| sellerAmount (после комиссии):" + sellerAmount)

    const basePayload = {
      tariff_code: deliveryTariffCode,
      // Тарифы 136/137: отправитель сдаёт посылку на ПВЗ → shipment_point (код ПВЗ из env)
      // from_location НЕ передаём — он нужен только при вызове курьера от двери
      sum: itemPrice,
      delivery_recipient_cost: { value: deliveryCost },
      recipient: {
        name: formData.name,
        phones: [{ number: formData.phone }],
        ...(formData.email ? { email: formData.email } : {}),
      },
      packages: [
        {
          number: "1",
          weight: 500,
          length: 33,
          width: 24,
          height: withCase ? 6 : 5,
          items: [
            {
              name: itemName,
              ware_key: withCase ? "SMARTCARDIO-001-CASE" : "SMARTCARDIO-001",
              payment: { value: itemPrice, vat_sum: 0, vat_rate: 0 },
              cost: sellerAmount,
              weight: 500,
              amount: 1,
            },
          ],
        },
      ],
      ...(formData.comment ? { comment: formData.comment } : {}),
    }

    // Append delivery-type-specific fields
    // Тариф 136 (ПВЗ→ПВЗ): delivery_point = код ПВЗ получателя
    // Тариф 137 (ПВЗ→дверь): to_location = город+адрес получателя
    const deliveryFields =
      deliveryType === "pvz" && selectedPvz
        ? { delivery_point: selectedPvz.code }
        : {
            to_location: {
              code: Number(formData.cityCode),
              address: courierLocation?.address ?? "",
            },
          }

    try {
      const res = await fetch("/api/cdek/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...basePayload, ...deliveryFields }),
      })

      const json = (await res.json()) as { uuid?: string; error?: string }

      if (!res.ok || json.error) {
        setSubmitError(json.error ?? "Неизвестная ошибка при создании заказа")
        return
      }

      if (promocodeId !== null) {
        try {
          const saleRes = await fetch(`/api/sales/create?promocodeId=${promocodeId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          })
          if (!saleRes.ok) {
            logwarn("[order] sales/create returned non-OK: " + saleRes.status)
          } else {
            log("[order] sales/create OK for promocodeId: " + promocodeId)
          }
        } catch (saleErr) {
          logerr2("[order] sales/create failed:", saleErr)
        }
      }

      window.location.href = "/congratulation"
    } catch {
      setSubmitError("Ошибка соединения с сервером. Попробуйте ещё раз.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger ? <span onClick={() => setOpen(true)}>{trigger}</span> : null}

      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <>
            <DialogHeader>
            <div className="md:w-[45%] w-[70%] overflow-hidden mx-auto rounded-xl mb-3" style={{ height: 200 }}>
                <ResponsivePicture              
                  src="/images/deviceWithCase.png"
                  alt="Прибор СмартКардио® с чехлом"
                  name="deviceWithCase"
                  width={480}
                  height={320}
                  className="w-full h-full object-cover object-center"
                  loading="eager"
                  fetchPriority="high"
                />
            </div>
              <DialogTitle className="text-center text-xl">
                {STEP_TITLE[step] ?? "Оформление заказа"}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Оформление заказа СмартКардио® через СДЭК
              </DialogDescription>
            </DialogHeader>

            <StepBar step={step} />

            <div className="mt-1">
              {step === "form" && (
                <StepForm
                  data={formData}
                  onChange={(patch) => setFormData((prev) => ({ ...prev, ...patch }))}
                  onNext={() => setStep("delivery-type")}
                />
              )}

              {step === "delivery-type" && (
                <DeliveryTypePicker
                  selected={deliveryType}
                  onSelect={setDeliveryType}
                  onBack={() => setStep("form")}
                  onNext={handleDeliveryTypeNext}
                />
              )}

              {step === "pvz" && (
                <StepPvz
                  cityCode={formData.cityCode}
                  regionCode={formData.regionCode}
                  cityName={formData.city}
                  selectedPvz={selectedPvz}
                  formData={{
                    name: formData.name,
                    phone: formData.phone,
                    email: formData.email,
                    comment: formData.comment,
                  }}
                  onSelect={setSelectedPvz}
                  onBack={() => setStep("delivery-type")}
                  onNext={(sum) => {
                    setDeliverySum(sum)
                    setDeliveryTariffCode(TARIFF_PVZ_TO_PVZ)
                    setStep("confirm")
                  }}
                  onSwitchToCourier={() => setStep("courier")}
                />
              )}

              {step === "courier" && (
                <StepCourier
                  cityCode={formData.cityCode}
                  cityName={formData.city}
                  courierLocation={courierLocation}
                  onChange={setCourierLocation}
                  onBack={() => setStep("delivery-type")}
                  onNext={(sum, tariffCode) => {
                    setDeliverySum(sum)
                    setDeliveryTariffCode(tariffCode)
                    setStep("confirm")
                  }}
                />
              )}

              {step === "confirm" && (
                <StepConfirm
                  data={formData}
                  deliveryType={deliveryType ?? "pvz"}
                  pvz={selectedPvz}
                  courierLocation={courierLocation}
                  deliverySum={deliverySum}
                  onBack={() => setStep(deliveryType ?? "pvz")}
                  onSubmit={(withCase, discountPercent, promocodeId) => handleSubmitOrder(withCase, discountPercent, promocodeId)}
                  loading={submitting}
                  error={submitError}
                />
              )}
            </div>
          </>
      </DialogContent>
    </Dialog>
  )
}
