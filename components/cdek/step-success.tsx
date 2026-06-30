"use client"

import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DialogTitle, DialogDescription } from "@/components/ui/dialog"

export function StepSuccess({ uuid, onClose }: { uuid: string; onClose: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <CheckCircle2 className="h-8 w-8 text-primary" />
      </div>
      <div>
        <DialogTitle className="text-xl">Заказ оформлен!</DialogTitle>
        <DialogDescription className="mt-2 text-pretty">
          Ваш заказ зарегистрирован в СДЭК. Менеджер свяжется с вами для подтверждения и оплаты.
        </DialogDescription>
      </div>
      {uuid && (
        <p className="rounded-lg bg-muted px-4 py-2 font-mono text-sm text-muted-foreground">
          ID заказа: {uuid}
        </p>
      )}
      <Button className="mt-2 w-full sm:w-auto" onClick={onClose}>
        Закрыть
      </Button>
    </div>
  )
}
