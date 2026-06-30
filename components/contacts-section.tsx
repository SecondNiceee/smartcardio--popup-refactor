import { ResponsivePicture } from "@/components/responsive-picture"

const socials = [
  {
    name: "Научно-популярная медицина",
    href: "/api/redirect?to=vk",
    network: "ВКонтакте",
    icon: "data:image/svg+xml,%3Csvg id='Capa_1' enable-background='new 0 0 512 512' viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cg%3E%3Cpath d='m0 245.333c0-115.651 0-173.477 35.928-209.405s93.754-35.928 209.405-35.928h21.333c115.651 0 173.477 0 209.405 35.928 35.929 35.928 35.929 93.754 35.929 209.405v21.333c0 115.651 0 173.477-35.929 209.405-35.927 35.929-93.753 35.929-209.404 35.929h-21.333c-115.651 0-173.477 0-209.405-35.928-35.929-35.928-35.929-93.754-35.929-209.405z' fill='%232787f5'%3E%3C/path%3E%3Cpath clip-rule='evenodd' d='m138.676 160h-37.342c-10.669 0-12.803 5.022-12.803 10.558 0 9.889 12.66 58.933 58.946 123.798 30.858 44.298 74.333 68.31 113.894 68.31 23.737 0 26.673-5.333 26.673-14.52v-33.48c0-10.667 2.249-12.796 9.764-12.796 5.539 0 15.034 2.769 37.188 24.127 25.319 25.313 29.493 36.669 43.734 36.669h37.342c10.67 0 16.004-5.333 12.927-15.858-3.368-10.49-15.456-25.71-31.497-43.75-8.704-10.284-21.759-21.358-25.715-26.896-5.538-7.119-3.956-10.284 0-16.611 0 0 45.496-64.075 50.243-85.827 2.373-7.911 0-13.724-11.293-13.724h-37.342c-9.494 0-13.872 5.022-16.246 10.558 0 0-18.989 46.276-45.89 76.336-8.704 8.701-12.66 11.47-17.408 11.47-2.373 0-5.809-2.769-5.809-10.678v-73.962c0-9.493-2.755-13.724-10.669-13.724h-58.68c-5.933 0-9.502 4.405-9.502 8.581 0 8.998 13.451 11.074 14.837 36.387v54.978c0 12.053-2.178 14.239-6.925 14.239-12.659 0-43.453-46.483-61.716-99.672-3.577-10.337-7.167-14.513-16.711-14.513z' fill='%23fff' fill-rule='evenodd'%3E%3C/path%3E%3C/g%3E%3C/svg%3E",
  },
  {
    name: "Для врачей",
    href: "/api/redirect?to=tg",
    network: "Telegram",
    icon: "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3Csvg xmlns='http://www.w3.org/2000/svg' aria-label='Telegram' role='img' viewBox='0 0 512 512'%3E%3Crect width='512' height='512' rx='15%25' fill='%2337aee2'/%3E%3Cpath fill='%23c8daea' d='M199 404c-11 0-10-4-13-14l-32-105 245-144'/%3E%3Cpath fill='%23a9c9dd' d='M199 404c7 0 11-4 16-8l45-43-56-34'/%3E%3Cpath fill='%23f6fbfe' d='M204 319l135 99c14 9 26 4 30-14l55-258c5-22-9-32-24-25L79 245c-21 8-21 21-4 26l83 26 190-121c9-5 17-3 11 4'/%3E%3C/svg%3E",
  },
  {
    name: "Наш блог",
    href: "/api/redirect?to=dzen",
    network: "Дзен",
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' enable-background='new 0 0 32 32' viewBox='0 0 32 32' id='yandex'%3E%3Cpath fill='%23F5E6FE' d='M26,32H6c-3.314,0-6-2.686-6-6V6c0-3.314,2.686-6,6-6h20c3.314,0,6,2.686,6,6v20C32,29.314,29.314,32,26,32z'%3E%3C/path%3E%3Cpath fill='%23BE63F9' d='M12.66,13.035c0,2.397,0.956,3.694,2.387,4.409L12,24h2.022l2.775-6.131h1.454V24H20V8h-2.613C14.819,8,12.657,9.679,12.66,13.035z M18.25,16.435h-0.933c-1.524,0-2.775-0.828-2.775-3.4c0-2.663,1.365-3.581,2.775-3.581h0.933V16.435z'%3E%3C/path%3E%3C/svg%3E%0A",
  },
]

export function ContactsSection() {
  return (
    <section
      id="contacts"
      className="relative bg-black py-16 md:py-24"
    >
      <ResponsivePicture
        src="/images/footerBg.png"
        alt=""
        fill
        className="object-cover object-center"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/80 pointer-events-none" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <div className="text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-white md:text-4xl">
            Наши контакты
          </h2>
          <a
            href="mailto:support@smartcardio.ru"
            className="mt-3 inline-block text-2xl font-semibold text-white/70 transition-colors hover:text-white md:text-3xl"
          >
            support@smartcardio.ru
          </a>
          <p className="mt-8 text-pretty text-xl font-medium text-white/90 md:text-2xl">
            Присоединяйтесь к нам в социальных сетях!
          </p>
        </div>

        <div className="mx-auto mt-10 flex items-start justify-center gap-12">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${social.name} — ${social.network}`}
              className="group flex w-24 flex-col items-center gap-3 sm:w-44"
            >
              <span className="flex shrink-0 items-center justify-center transition-transform duration-300 group-hover:-translate-y-1">
                <img src={social.icon} alt={social.network} className="h-12 w-12 object-contain sm:h-20 sm:w-20" />
              </span>
              <span className="text-balance text-center text-sm font-bold text-white">
                {social.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
