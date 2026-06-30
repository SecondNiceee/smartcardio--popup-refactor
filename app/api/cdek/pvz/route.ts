import { NextRequest, NextResponse } from "next/server"
import { getPvzList } from "@/lib/cdek"
import { log, logerr, logerr2, logwarn } from 'lib/utils'

export async function GET(req: NextRequest) {
  const cityCodeParam = req.nextUrl.searchParams.get("city_code")
  const regionCodeParam = req.nextUrl.searchParams.get("region_code")

  if (cityCodeParam === null && regionCodeParam === null) {
    return NextResponse.json({ error: "city_code or region_code is required" }, { status: 400 })
  }

  const cityCode = cityCodeParam !== null ? Number(cityCodeParam) : null
  const regionCode = regionCodeParam !== null ? Number(regionCodeParam) : null

  try {
    const pvz = await getPvzList(cityCode, regionCode)
    return NextResponse.json(pvz)
  } catch (err) {
    logerr2("[cdek/pvz]", err)
    return NextResponse.json(
      { error: "Не удалось загрузить пункты выдачи" },
      { status: 500 },
    )
  }
}
