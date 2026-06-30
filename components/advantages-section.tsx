"use client"

import { MousePointerClick, Activity, Stethoscope, Layers, BatteryCharging, Wallet } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const advantages = [
  {
    icon: MousePointerClick,
    title: "Простота использования",
    description: "Приложить прибор к себе и подождать... Всего 20 секунд неподвижно.",
  },
  {
    icon: Activity,
    title: "Шесть отведений ЭКГ",
    description:
      "Это портативный прибор, но он регистрирует все 6 отведений с медицинской точностью, как это делают стационарные Кардиомониторы.",
  },
  {
    icon: Stethoscope,
    title: "На связи с врачом",
    description:
      "Удобный формат записи и возможность оперативной передачи данных для онлайн-консультаций или очного приёма у врача.",
  },
  {
    icon: Layers,
    title: "Несколько функций в одном приборе",
    description:
      "Объединяет ЭКГ и пульсоксиметрию. Комплексные показатели помогают в диагностике заболеваний.",
  },
  {
    icon: BatteryCharging,
    title: "Автономность",
    description: "Работает как со смартфоном, так и в автономном режиме.",
  },
  {
    icon: Wallet,
    title: "Экономит деньги",
    description:
      "Отсутствие расходных материалов (электроды, гели, провода, переходники) не требует дополнительных или скрытых затрат.",
  },
] as const

export function AdvantagesSection() {
  const { ref, style } = useScrollAnimation({ direction: "bottom" })

  return (
    <section id="advantages" ref={ref as React.RefObject<HTMLElement>} style={style} className="relative overflow-x-hidden bg-slate-900 py-8 md:py-10">
      {/* Background blobs */}
      <div className="pointer-events-none absolute -left-32 top-1/4 h-72 w-72 rounded-full bg-brand-cyan/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-1/3 h-72 w-72 rounded-full bg-brand-teal/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground ring-1 ring-inset ring-primary/30">
            {"СмартКардио\u00AE"}
          </span>
          <h2 className="mt-6 text-balance text-3xl font-bold tracking-tight text-white md:text-4xl">
            Наши преимущества
          </h2>
        </div>

        {/* Cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {advantages.map((item, index) => (
            <div
              key={item.title}
              className="group flex flex-col rounded-2xl bg-white/5 backdrop-blur-sm p-7 ring-1 ring-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_4px_12px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:ring-brand-teal/40 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_8px_20px_rgba(0,0,0,0.4)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent ring-1 ring-brand-teal/40 text-accent-foreground">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-balance text-xl font-semibold leading-snug text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-pretty leading-relaxed text-slate-300">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
