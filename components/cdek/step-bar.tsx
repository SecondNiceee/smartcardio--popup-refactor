"use client"

import { CheckCircle2 } from "lucide-react"
import type { Step } from "./types"

const STEPS = [
  { label: "Данные" },
  { label: "Доставка" },
  { label: "Адрес" },
  { label: "Подтверждение" },
]

const STEP_TO_IDX: Record<Step, number> = {
  form: 0,
  "delivery-type": 1,
  pvz: 2,
  courier: 2,
  confirm: 3,
}

export function StepBar({ step }: { step: Step }) {
  const activeIdx = STEP_TO_IDX[step]

  return (
    <div className="flex items-center justify-center gap-1 py-1" aria-label="Шаги оформления">
      {STEPS.map((s, idx) => (
        <div key={s.label} className="flex items-center gap-1">
          <div
            className={[
              "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
              idx < activeIdx
                ? "bg-primary text-primary-foreground"
                : idx === activeIdx
                  ? "bg-primary text-primary-foreground ring-2 ring-primary/30 ring-offset-1"
                  : "bg-muted text-muted-foreground",
            ].join(" ")}
          >
            {idx < activeIdx ? <CheckCircle2 className="h-3.5 w-3.5" /> : idx + 1}
          </div>
          <span
            className={[
              "hidden text-xs sm:inline",
              idx === activeIdx ? "font-medium text-foreground" : "text-muted-foreground",
            ].join(" ")}
          >
            {s.label}
          </span>
          {idx < STEPS.length - 1 && (
            <div
              className={[
                "mx-1 h-px w-6 transition-colors sm:w-10",
                idx < activeIdx ? "bg-primary" : "bg-border",
              ].join(" ")}
            />
          )}
        </div>
      ))}
    </div>
  )
}
