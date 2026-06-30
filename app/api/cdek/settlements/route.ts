import { NextRequest, NextResponse } from "next/server"
import { getCityRegionCode } from "@/lib/cdek"
import { log, logerr, logerr2, logwarn } from 'lib/utils'

/**
 * GET /api/cdek/settlements?code=<city_code>
 * Returns { region_code } for the given city code.
 */
export async function GET(req: NextRequest) {
  const codeParam = req.nextUrl.searchParams.get("code")
  if (!codeParam) {
    return NextResponse.json({ error: "code is required" }, { status: 400 })
  }

  const cityCode = Number(codeParam)
  if (isNaN(cityCode)) {
    return NextResponse.json({ error: "code must be a number" }, { status: 400 })
  }

  try {
    const region_code = await getCityRegionCode(cityCode)
    return NextResponse.json({ region_code })
  } catch (err) {
    logerr2("[cdek/settlements]", err)
    return NextResponse.json({ error: "Не удалось получить данные региона" }, { status: 500 })
  }
}
