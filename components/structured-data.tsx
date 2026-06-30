// ─────────────────────────────────────────────────────────────────────────────
// Shared constants
// ─────────────────────────────────────────────────────────────────────────────

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://smartcardio.ru"

// ─────────────────────────────────────────────────────────────────────────────
// Reviews data (used in Product schema)
// ─────────────────────────────────────────────────────────────────────────────

const reviews = [
  { author: "Ольга Е.", date: "2024-03-10", rating: 5, text: "Прибор очень понравился, мне как врачу очень важно, что шесть отведений, и есть дополнительная информация с пульсовой волной и сатурацией. В целом интуитивно понятно, как пользоваться." },
  { author: "Сергей Овчинников", date: "2024-04-02", rating: 5, text: "Купил прибор папе для контроля аритмии — это было лучшее вложение средств за последние месяцы. Полностью ушла тревога и неизвестность по поводу его ритма, а также проблемы с тем, как записать плёнку для врача." },
  { author: "Виктор С.", date: "2024-05-14", rating: 5, text: "СмартКардио® приятно удивил своей точностью. Уже несколько раз сверял результаты с больничным ЭКГ — данные совпадают! Очень простое управление, всё понятно и интуитивно. Пять звёзд!" },
  { author: "Геннадий В.", date: "2024-06-01", rating: 5, text: "Аппарат прекрасен. Отлично снимает кардиограмму. Куплен на маркете у продавца СмартКардио®. Рекомендую." },
  { author: "Вероника Юрьевна", date: "2024-06-20", rating: 5, text: "Лёгкий, удобный, быстрый, результат сразу в телефоне! Для меня это мега удобно, я ещё не встречала такого прибора в онлайн-магазинах. Недостатков нет." },
  { author: "Михаил А.", date: "2024-07-08", rating: 5, text: "Отличный, очень нужный прибор. Внучке посоветовали в НИИ педиатрии приобрести смарт-кардио. Прибор оказался очень удобным и простым в использовании. Никаких присосок и проводов не нужно." },
  { author: "Дарья К.", date: "2024-08-15", rating: 5, text: "Пользоваться прибором очень удобно, он компактный, всегда под рукой, долго держит зарядку. Огромное спасибо службе поддержки, которая оперативно помогла установить приложение." },
  { author: "Наталья П.", date: "2024-09-03", rating: 5, text: "Использую уже полгода. Прибор компактный, заряда хватает надолго. Очень удобно брать с собой в дорогу. Показания совпадают с результатами стационарного ЭКГ в поликлинике." },
  { author: "Андрей М.", date: "2024-09-22", rating: 5, text: "Отличный гаджет для домашнего контроля сердца. Простое подключение к смартфону, приложение понятное. За два месяца использования ни одного сбоя. Рекомендую всем, кто следит за здоровьем." },
  { author: "Тамара Г.", date: "2024-10-11", rating: 5, text: "Купила маме на 70-летие. Она сама разобралась за 15 минут — говорит, что всё очень просто. Теперь снимает ЭКГ каждое утро и показывает результаты кардиологу на приёме. Врач доволен." },
  { author: "Игорь Н.", date: "2024-11-05", rating: 5, text: "Занимаюсь спортом и слежу за сердечным ритмом. СмартКардио® даёт полноценное ЭКГ, а не просто пульс, как обычные фитнес-браслеты. Это совсем другой уровень информации о состоянии сердца." },
  { author: "Светлана Р.", date: "2024-11-18", rating: 5, text: "После перенесённой болезни врач порекомендовал регулярно проверять ЭКГ. Этот прибор — находка. Не нужно каждый раз ехать в больницу, всё можно сделать дома за пару минут. Результат сохраняется в PDF." },
  { author: "Валентина К.", date: "2024-12-02", rating: 5, text: "Внешне компактный и красивый. В работе — надёжный и точный. Дочка помогла установить приложение, и теперь я сама снимаю ЭКГ и отправляю врачу через мессенджер. Очень современно и удобно!" },
  { author: "Роман Д.", date: "2024-12-19", rating: 5, text: "Отличная альтернатива походу в поликлинику. Результаты сравнимы с профессиональным оборудованием. Прибор держу в кармане пиджака — небольшой и лёгкий. Пользуюсь уже больше года." },
  { author: "Людмила Ф.", date: "2025-01-07", rating: 5, text: "Купила после того, как стало пошаливать сердце. Очень рада покупке: теперь вижу, когда аритмия, а когда всё в норме. Спокойнее стало на душе. Приложение понятное, поддержка отвечает быстро." },
  { author: "Павел С.", date: "2025-01-25", rating: 5, text: "Использую для ежедневного мониторинга. Данные за несколько месяцев видны в истории — удобно отслеживать динамику и показывать врачу сразу архив, а не один снимок. Функция сатурации тоже пригодилась." },
  { author: "Елена В.", date: "2025-02-10", rating: 5, text: "Заказала для отца, который живёт в другом городе. Теперь он присылает мне результаты ЭКГ, и я сразу вижу, как у него дела с сердцем. Это очень успокаивает. Прибор прост в использовании даже для пожилых." },
  { author: "Денис А.", date: "2025-02-28", rating: 5, text: "Как человек с мерцательной аритмией, я очень ценю возможность снять ЭКГ прямо в момент приступа. Прибор реально помог поймать эпизод, который врач увидел и скорректировал лечение. Это бесценно." },
  { author: "Ирина Б.", date: "2025-03-15", rating: 5, text: "Прибор маленький, но очень функциональный. Качество ЭКГ отличное — кардиолог сразу признал, что запись чёткая и пригодна для диагностики. Заряжается быстро, аккумулятора хватает надолго." },
  { author: "Константин Л.", date: "2025-04-01", rating: 5, text: "Долго выбирал между разными приборами. Остановился на СмартКардио® из-за 6 отведений — это не игрушка, а полноценный кардиограф. За три месяца использования полностью доволен покупкой." },
  { author: "Марина О.", date: "2025-04-20", rating: 5, text: "Мой кардиолог сам посоветовал этот прибор. Говорит, что качество записи у него на уровне стационарного оборудования. Теперь прихожу на приём уже с готовой историей ЭКГ за месяц — врач очень доволен." },
  { author: "Алексей Т.", date: "2025-05-08", rating: 5, text: "Купил себе и жене. Пользуемся каждый вечер. Удобно, что приложение хранит все записи и можно сравнивать. После нагрузки, после кофе, в покое — видно всё. Очень познавательно и полезно для здоровья." },
]

// ─────────────────────────────────────────────────────────────────────────────
// Schema blocks (each exported so they can be tested or extended individually)
// ─────────────────────────────────────────────────────────────────────────────

export const schemaOrganization = {
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: "СмартКардио®",
  alternateName: "SmartCardio",
  url: siteUrl,
  logo: {
    "@type": "ImageObject",
    url: `${siteUrl}/images/logo.jpg`,
    width: 200,
    height: 60,
  },
  description: "Производитель портативного кардиографа СмартКардио® для домашнего контроля сердечного ритма.",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "info@smartcardio.ru",
    availableLanguage: "Russian",
  },
  sameAs: [
    "https://www.rustore.ru/catalog/app/com.arytmed.smartcardio",
    "https://play.google.com/store/apps/details?id=com.arytmed.smartcardio",
    "https://appgallery.huawei.com/app/C111299787",
    "https://testflight.apple.com/join/ku8iGLOm",
  ],
}

export const schemaWebSite = {
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: siteUrl,
  name: "СмартКардио®",
  description: "Портативный кардиограф для снятия ЭКГ за 20 секунд без гелей и проводов с мгновенной расшифровкой на основе ИИ.",
  publisher: { "@id": `${siteUrl}/#organization` },
  inLanguage: "ru-RU",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteUrl}/?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
}

export const schemaWebPage = {
  "@type": "WebPage",
  "@id": `${siteUrl}/#webpage`,
  url: siteUrl,
  name: "СмартКардио® — портативный кардиограф для ЭКГ дома и в клинике",
  description: "Снимите ЭКГ за 20 секунд без гелей и проводов. Запись 6 отведений с медицинской точностью и мгновенная расшифровка на основе ИИ.",
  isPartOf: { "@id": `${siteUrl}/#website` },
  about: { "@id": `${siteUrl}/#product` },
  inLanguage: "ru-RU",
  breadcrumb: { "@id": `${siteUrl}/#breadcrumb` },
  datePublished: "2024-01-01",
  dateModified: new Date().toISOString().split("T")[0],
}

export const schemaBreadcrumb = {
  "@type": "BreadcrumbList",
  "@id": `${siteUrl}/#breadcrumb`,
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Главная",
      item: siteUrl,
    },
  ],
}

export const schemaProduct = {
  "@type": "Product",
  "@id": `${siteUrl}/#product`,
  name: "СмартКардио®",
  alternateName: ["Портативный ЭКГ прибор СмартКардио", "SmartCardio кардиограф"],
  image: {
    "@type": "ImageObject",
    url: `${siteUrl}/images/for-users.png`,
    width: 800,
    height: 600,
  },
  description: "Портативный кардиограф для снятия ЭКГ за 20 секунд без гелей и проводов. Регистрирует 6 отведений ЭКГ, выполняет пульсоксиметрию и мгновенную автоматическую расшифровку на основе ИИ. Компактное устройство для домашнего мониторинга сердца.",
  brand: { "@id": `${siteUrl}/#organization` },
  manufacturer: { "@id": `${siteUrl}/#organization` },
  sku: "SMARTCARDIO-V1",
  mpn: "SC-V1",
  category: "Бытовые приборы для здоровья / Кардиограф",
  offers: {
    "@type": "Offer",
    url: `${siteUrl}/#order`,
    priceCurrency: "RUB",
    price: "15600",
    priceValidUntil: "2027-12-31",
    availability: "https://schema.org/InStock",
    itemCondition: "https://schema.org/NewCondition",
    seller: { "@id": `${siteUrl}/#organization` },
    shippingDetails: {
      "@type": "OfferShippingDetails",
      shippingRate: {
        "@type": "MonetaryAmount",
        currency: "RUB",
      },
      shippingDestination: {
        "@type": "DefinedRegion",
        addressCountry: "RU",
      },
      deliveryTime: {
        "@type": "ShippingDeliveryTime",
        handlingTime: {
          "@type": "QuantitativeValue",
          minValue: 1,
          maxValue: 3,
          unitCode: "DAY",
        },
        transitTime: {
          "@type": "QuantitativeValue",
          minValue: 1,
          maxValue: 14,
          unitCode: "DAY",
        },
      },
    },
    hasMerchantReturnPolicy: {
      "@type": "MerchantReturnPolicy",
      applicableCountry: "RU",
      returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
      merchantReturnDays: 14,
      returnMethod: "https://schema.org/ReturnByMail",
      returnFees: "https://schema.org/FreeReturn",
    },
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    bestRating: "5",
    worstRating: "1",
    ratingCount: String(reviews.length),
    reviewCount: String(reviews.length),
  },
  review: reviews.map((r) => ({
    "@type": "Review",
    author: { "@type": "Person", name: r.author },
    datePublished: r.date,
    reviewRating: {
      "@type": "Rating",
      ratingValue: String(r.rating),
      bestRating: "5",
      worstRating: "1",
    },
    reviewBody: r.text,
    inLanguage: "ru-RU",
  })),
}

export const schemaSoftwareApp = {
  "@type": "SoftwareApplication",
  "@id": `${siteUrl}/#app`,
  name: "СмартКардио®",
  operatingSystem: ["iOS", "Android"],
  applicationCategory: "HealthApplication",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "RUB",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    bestRating: "5",
    worstRating: "1",
    ratingCount: String(reviews.length),
  },
  url: "https://play.google.com/store/apps/details?id=com.arytmed.smartcardio",
  downloadUrl: [
    "https://play.google.com/store/apps/details?id=com.arytmed.smartcardio",
    "https://www.rustore.ru/catalog/app/com.arytmed.smartcardio",
    "https://appgallery.huawei.com/app/C111299787",
    "https://testflight.apple.com/join/ku8iGLOm",
  ],
}

export const schemaFaq = {
  "@type": "FAQPage",
  "@id": `${siteUrl}/#faq`,
  mainEntity: [
    {
      "@type": "Question",
      name: "Нужно ли платить за подписку, чтобы получать автоматическую расшифровку ЭКГ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Нет. Приложение СмартКардио® уже включает встроенную систему автоматической интерпретации ЭКГ на основе алгоритмов искусственного интеллекта. Дополнительных подписок или платных функций не требуется.",
      },
    },
    {
      "@type": "Question",
      name: "Как прибор записывает 6 отведений ЭКГ без проводов и геля?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "СмартКардио® работает на основе закона Эйнтховена. Во время контакта с кожей устройство регистрирует разность потенциалов между конечностями (отведения I, II, III и усиленные aVR, aVL, aVF). Благодаря «сухим» электродам регистрация проходит без геля, липких электродов или проводов.",
      },
    },
    {
      "@type": "Question",
      name: "Работает ли СмартКардио® с iPhone?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Да. Приложение совместимо со всеми современными смартфонами на базе iOS и Android. Загрузка доступна в магазинах приложений.",
      },
    },
    {
      "@type": "Question",
      name: "Можно ли использовать СмартКардио® для длительного мониторинга, как холтер?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Нет. СмартКардио® предназначен для регистрации по требованию — в момент жалоб или при регулярном мониторинге, что не требует длительного ношения и репрезентативно для выявления нарушений.",
      },
    },
    {
      "@type": "Question",
      name: "На какое время хватает аккумулятора прибора без подзарядки?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "При среднем режиме использования (до 10 измерений в день) устройство работает до 3 месяцев без подзарядки.",
      },
    },
    {
      "@type": "Question",
      name: "Заменяет ли автоматический анализ ЭКГ прием у врача?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Нет. Прибор помогает записывать нарушения сердечного ритма для последующей консультации с врачом. Все записи сохраняются в формате PDF. Автоматический анализ на основе ИИ служит вспомогательным средством и не заменяет приём у специалиста.",
      },
    },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// Single @graph payload — all schemas combined
// ─────────────────────────────────────────────────────────────────────────────

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    schemaOrganization,
    schemaWebSite,
    schemaWebPage,
    schemaBreadcrumb,
    schemaProduct,
    schemaSoftwareApp,
    schemaFaq,
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// Component — inject into <head> via layout.tsx
// ─────────────────────────────────────────────────────────────────────────────

export function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
