"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { QuestionDialog } from "@/components/question-dialog"

const faqs = [
  {
    question: "После установки приложения нужно ли платить за подписку, чтобы получать автоматическую расшифровку ЭКГ?",
    answer: (
      <>
        <p className="mb-3"><strong>Нет.</strong></p>
        <p className="mb-3">
          Приложение <strong>СмартКардио®</strong> уже включает встроенную систему{" "}
          <strong>автоматической интерпретации ЭКГ</strong> на основе алгоритмов искусственного интеллекта.
        </p>
        <p>
          Дополнительных подписок или платных функций <strong>не требуется.</strong>
        </p>
      </>
    ),
  },
  {
    question: "Как прибор записывает 6 отведений ЭКГ без проводов и геля?",
    answer: (
      <>
        <p className="mb-3">
          <strong>СмартКардио®</strong> работает на основе закона Эйнтховена. Во время контакта с кожей
          устройство регистрирует разность потенциалов между конечностями (классические отведения I, II,
          III и усиленные от конечностей aVR, aVL, aVF).
        </p>
        <p>
          Благодаря использованию <strong>«сухих» электродов</strong> и продуманной схемотехники,
          регистрация проходит <strong>без геля, липких электродов или проводов</strong> — удобно как в
          домашних, так и в клинических условиях.
        </p>
      </>
    ),
  },
  {
    question: "Какие параметры ЭКГ можно изменить в приложении?",
    answer: (
      <>
        <p className="mb-3">В настройках вы можете выбрать:</p>
        <ul className="list-none space-y-2">
          <li><strong>Скорость записи:</strong> 25 или 50 мм/сек</li>
          <li><strong>Длительность:</strong> от 5 сек до нескольких минут</li>
          <li><strong>Амплитуду сигнала:</strong> 10 или 20 мм/мВ</li>
          <li><strong>Отображение дополнительных параметров:</strong> пульсовой волны, графика дыхания</li>
        </ul>
      </>
    ),
  },
  {
    question: "Работает ли СмартКардио® с iPhone?",
    answer: (
      <>
        <p className="mb-3"><strong>Да.</strong></p>
        <p>
          Приложение совместимо <strong>со всеми современными смартфонами</strong> на базе iOS и Android.
          Загрузка доступна в магазинах приложений.
        </p>
      </>
    ),
  },
  {
    question: "Можно ли использовать СмартКардио® для длительного мониторинга, как холтер?",
    answer: (
      <>
        <p className="mb-3"><strong>Нет.</strong></p>
        <p>
          <strong>СмартКардио®</strong> предназначен для регистрации по требованию —{" "}
          <strong>в момент жалоб или при регулярном мониторинге,</strong> что не требует длительного
          ношения и репрезентативно <strong>для выявления нарушений.</strong>
        </p>
      </>
    ),
  },
  {
    question: "На какое время хватает аккумулятора прибора без подзарядки?",
    answer: (
      <p>
        При среднем режиме использования (до 10 измерений в день) устройство работает{" "}
        <strong>до 3 месяцев без подзарядки.</strong>
      </p>
    ),
  },
  {
    question: "Как проверяется точность прибора?",
    answer: (
      <p>
        Каждое устройство проходит индивидуальное тестирование на сертифицированном медицинском
        оборудовании. Результаты откалиброваны в соответствии с нормативами, на все приборы
        распространяется <strong>гарантия производителя.</strong>
      </p>
    ),
  },
  {
    question: "Заменяет ли автоматический анализ ЭКГ прием у врача?",
    answer: (
      <>
        <p className="mb-3"><strong>Нет.</strong></p>
        <p>
          Прибор помогает записывать нарушения сердечного ритма для последующей консультации с врачом.
          Все записи сохраняются в формате PDF в приложении (независимо от результатов автоматического
          анализа). Автоматический анализ (на основе ИИ) служит вспомогательным средством для
          акцентирования внимания на возможных проблемах и сокращения времени до обращения к специалисту.
        </p>
      </>
    ),
  },
] as const

export function FaqSection() {
  const { ref, style } = useScrollAnimation({ direction: "bottom" })

  return (
    <section
      id="faq"
      ref={ref as React.RefObject<HTMLElement>}
      style={style}
      className="relative overflow-x-hidden py-8 md:py-10"
    >
      <div className="mx-auto max-w-4xl px-4 md:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground ring-1 ring-inset ring-primary/30">
            Полезная информация
          </span>
          <h2 className="mt-6 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Частые вопросы и обратная связь
          </h2>
        </div>

        {/* Accordion with decorative corners */}
        <div className="relative mt-12 px-4 py-6 md:px-8 md:py-8">
          {/* Decorative corner accents - only around questions */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-2 -top-2 h-20 w-20 rounded-tr-[2.5rem] border-r-4 border-t-4 border-primary/50 sm:-right-4 sm:-top-4 sm:h-32 sm:w-32"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-2 -left-2 h-20 w-20 rounded-bl-[2.5rem] border-b-4 border-l-4 border-primary/50 sm:-bottom-4 sm:-left-4 sm:h-32 sm:w-32"
          />

          <Accordion type="single" collapsible className="flex w-full flex-col gap-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-2xl border border-border/50 bg-card px-5 shadow-sm transition-shadow hover:shadow-md data-[state=open]:shadow-md"
              >
                <AccordionTrigger className="py-5 text-left text-base font-medium text-foreground hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-5 leading-relaxed text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Ask Question Button */}
          <div className="mt-10 flex justify-center">
            <QuestionDialog
              trigger={
                <Button
                  size="lg"
                  className="h-10 rounded-full px-6 text-sm font-semibold whitespace-nowrap sm:h-12 sm:px-8 sm:text-base"
                >
                  Задать вопрос
                </Button>
              }
            />
          </div>
        </div>
      </div>
    </section>
  )
}
