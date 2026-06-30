import { NextRequest, NextResponse } from "next/server"
import { log, logerr, logerr2, logwarn } from 'lib/utils'

export interface PromoCode {
  id: string
  code: string
  sales: number
  ownerId: string
  discountPercent: number
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")?.trim().toUpperCase()
  if (!code) {
    return NextResponse.json({ error: "Промокод не указан" }, { status: 400 })
  }

  const partnerApi = process.env.PARTNER_API
  const apiKey = process.env.X_API_KEY

  log("[promocodes/check] PARTNER_API set: " + !!partnerApi + "| X_API_KEY set:" + !!apiKey)

  if (!partnerApi || !apiKey) {
    logerr("[promocodes/check] PARTNER_API or X_API_KEY is not set")
    return NextResponse.json({ error: "Сервис промокодов не настроен" }, { status: 503 })
  }

  try {
    const url = `${partnerApi}/promocodes/findByCode?code=${encodeURIComponent(code)}`
    log("[promocodes/check] Fetching: " + url)

    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
      },
      cache: "no-store",
    })

    log("[promocodes/check] Partner API response status: " + res.status)

    if (!res.ok) {
      logwarn("[promocodes/check] Partner API returned non-OK status: " +  res.status)
      return NextResponse.json({ valid: false })
    }

    const data = (await res.json()) as Partial<PromoCode>
    log("[promocodes/check] Partner API response body: " + JSON.stringify(data))

    // Пустой объект {} — промокод не найден
    if (!data || !data.id) {
      log("[promocodes/check] Promo not found (empty response)")
      return NextResponse.json({ valid: false })
    }

    log("[promocodes/check] Valid promo: " + data.code + ", discount: " + data.discountPercent + "%, id: " + data.id)
    return NextResponse.json({
      valid: true,
      id: data.id,
      discountPercent: data.discountPercent,
      code: data.code,
    })
  } catch (err) {
    logerr2("[promocodes/check] Exception:", err)
    return NextResponse.json({ error: "Ошибка при проверке промокода" }, { status: 500 })
  }
}
