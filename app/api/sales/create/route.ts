import { NextRequest, NextResponse } from "next/server"
import { log, logerr, logerr2, logwarn } from "lib/utils"

export async function POST(req: NextRequest) {
  const promocodeId = req.nextUrl.searchParams.get("promocodeId")

  if (!promocodeId) {
    return NextResponse.json({ error: "promocodeId не указан" }, { status: 400 })
  }

  const partnerApi = process.env.PARTNER_API
  const apiKey = process.env.X_API_KEY

  log("[sales/create] PARTNER_API set: " + !!partnerApi + " | X_API_KEY set: " + !!apiKey)

  if (!partnerApi || !apiKey) {
    logerr("[sales/create] PARTNER_API or X_API_KEY is not set")
    return NextResponse.json({ error: "Сервис продаж не настроен" }, { status: 503 })
  }

  try {
    const url = `${partnerApi}/sales/create?promocodeId=${encodeURIComponent(promocodeId)}`
    log("[sales/create] POST " + url)

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
      },
      cache: "no-store",
    })

    log("[sales/create] Partner API response status: " + res.status)

    if (!res.ok) {
      logwarn("[sales/create] Partner API returned non-OK status: " + res.status)
      return NextResponse.json({ error: "Ошибка при регистрации продажи" }, { status: res.status })
    }

    const data = await res.json().catch(() => ({}))
    log("[sales/create] Partner API response body: " + JSON.stringify(data))

    return NextResponse.json({ ok: true, ...data })
  } catch (err) {
    logerr2("[sales/create] Exception:", err)
    return NextResponse.json({ error: "Ошибка соединения с партнёрским API" }, { status: 500 })
  }
}
