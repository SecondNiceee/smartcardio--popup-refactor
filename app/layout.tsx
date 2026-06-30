import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { StructuredData } from '@/components/structured-data'
import { CookieBanner } from '@/components/cookie-banner'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://smartcardio.ru'

const yandexMetrikaScript = `
    (function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
    })(window, document,'script','https://mc.yandex.ru/metrika/tag.js', 'ym');
    ym(91617395, 'init', {webvisor:true, clickmap:true, referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
`;

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: 'СмартКардио® — портативный кардиограф для ЭКГ дома и в клинике',
        template: '%s | СмартКардио®',
    },
    description:
        'СмартКардио® — портативный кардиограф, который позволяет снять ЭКГ за 20 секунд без гелей и проводов. Запись 6 отведений с медицинской точностью, мгновенная расшифровка ЭКГ на основе ИИ и пульсоксиметрия. Кардиология и дистанционная диагностика сердца дома.',
    keywords: [
        'кардиограф',
        'портативный кардиограф',
        'снять ЭКГ',
        'ЭКГ дома',
        'сделать ЭКГ',
        'ЭКГ онлайн',
        'кардиология',
        'дистанционная ЭКГ',
        'электрокардиограмма',
        'расшифровка ЭКГ',
        'ЭКГ 6 отведений',
        'портативный ЭКГ прибор',
        'диагностика сердца',
        'мониторинг сердца',
        'кардиомонитор',
        'пульсоксиметрия',
        'аритмия',
        'прибор для ЭКГ',
        'СмартКардио',
        'SmartCardio',
    ],
    authors: [{ name: 'СмартКардио®' }],
    creator: 'СмартКардио®',
    publisher: 'СмартКардио®',
    applicationName: 'СмартКардио®',
    category: 'Бытовые приборы для здоровья',
    alternates: {
        canonical: '/',
    },
    formatDetection: {
        telephone: true,
        email: true,
        address: true,
    },
    openGraph: {
        type: 'website',
        locale: 'ru_RU',
        url: siteUrl,
        siteName: 'СмартКардио®',
        title: 'СмартКардио® — портативный кардиограф для ЭКГ дома и в клинике',
        description:
            'Снимите ЭКГ за 20 секунд без гелей и проводов. Запись 6 отведений с медицинской точностью и мгновенная расшифровка на основе ИИ.',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
        },
    },
    icons: {
        icon: [
            { url: "favicon.ico" },
        ],
        apple: [
            { url: "/images/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
        ],
    },
    manifest: "/manifest.json",
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="ru" className="bg-background overflow-x-hidden">
        <head>
            {/* Preload video poster to avoid duplicate fetch on hydration */}
            <link rel="preload" as="image" href="/images/smartcardioStart.webp" />
        </head>
        <body className="font-sans antialiased overflow-x-hidden max-w-full">
        <StructuredData />
        {children}
        <CookieBanner />

        <script dangerouslySetInnerHTML={{__html : `
        function getUserId() {
        let sc_UserId = localStorage.getItem('sc_UserId');
        if (!sc_UserId) {
          sc_UserId = crypto.randomUUID();
          localStorage.setItem('sc_UserId', sc_UserId);
            }
            return sc_UserId;
          }
          let data = {
            sc_UserId: getUserId()
          };
          fetch("/uid/" + getUserId(), {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          }).then(res => {
            console.log("Resp:", res);
          });
          `}} />

        <script dangerouslySetInnerHTML={{__html : `
          const fpPromise = import('https://openfpcdn.io/fingerprintjs/v4')
    .then(FingerprintJS => FingerprintJS.load())

  // Get the visitor identifier when you need it.
  fpPromise
    .then(fp => fp.get())
    .then(result => {
      // This is the visitor identifier:
      const visitorId = result.visitorId
      console.log(visitorId)
      fetch("/uid/" + getUserId() + "/fp/" + visitorId, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

    })
    .catch(error => console.error(error))
          `}} />


        <script
            dangerouslySetInnerHTML={{
                __html: yandexMetrikaScript
            }}
        />

        </body>
        </html>
    )
}
