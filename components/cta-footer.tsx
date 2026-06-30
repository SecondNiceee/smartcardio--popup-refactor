import Image from "next/image"

export function CtaFooter() {
  return (
    <footer id="contact" className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <Image
              src="/images/logo.jpg"
              alt="Логотип СмартКардио"
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
            <span className="text-base font-semibold tracking-tight text-foreground">
              СмартКардио®
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} СмартКардио®. Все права защищены.
          </p>
        </div>

        <div className="border-t border-border py-6">
          <div className="text-sm leading-relaxed text-muted-foreground">
            <div>
              <p className="text-foreground">
                ООО «АРИТМЕД»
              </p>
              <p>ОГРН 1227700287330 · ИНН 9726013334 · г. Москва</p>
                <p className="text-foreground">
                    ООО «СМАРТКАРДИО»
                </p>
            </div>
          </div>
          <p className="mt-6 text-pretty text-xs leading-relaxed text-muted-foreground">
            Не является медицинским устройством, перед применением проконсультируйтесь со специалистом.
            Для расшифровки результата также обратитесь к специалисту. Обращаем Ваше внимание, что согласно
            действующему российскому законодательству технически сложный товар надлежащего качества возврату
            и обмену не подлежит.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="/pdf/oferta.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-border px-4 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
            >
              Договор оферты
            </a>
            <a
              href="/pdf/confidential.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-border px-4 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
            >
              Политика конфиденциальности
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
