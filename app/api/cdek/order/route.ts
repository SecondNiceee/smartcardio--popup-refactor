import { NextRequest, NextResponse } from "next/server"
import { createOrder, type CdekOrderRequest } from "@/lib/cdek"
import { getShipmentPoint } from "@/lib/cdek-config"
import { logerr2 } from 'lib/utils'

export async function POST(req: NextRequest) {
  let body: CdekOrderRequest
  try {
    body = (await req.json()) as CdekOrderRequest
  } catch {
    return NextResponse.json({ error: "Некорректный JSON" }, { status: 400 })
  }

  // Basic validation — either delivery_point (PVZ→PVZ) or to_location (PVZ→door) must be present
  if ((!body.delivery_point && !body.to_location) || !body.recipient?.phones?.length || !body.packages?.length) {
    return NextResponse.json(
      { error: "Не переданы обязательные поля: delivery_point или to_location, recipient.phones, packages" },
      { status: 422 },
    )
  }

  // Подставляем shipment_point из env — код ПВЗ СДЭК, с которого отправляется посылка.
  // Клиент не имеет доступа к env, поэтому добавляем здесь.
  let shipmentPoint: string
  try {
    shipmentPoint = getShipmentPoint()
  } catch {
    return NextResponse.json({ error: "CDEK_SHIPMENT_POINT не задан на сервере" }, { status: 500 })
  }

  const payload: CdekOrderRequest = {
    ...body,
    shipment_point: shipmentPoint,
  }

  try {
    const result = await createOrder(payload)
    const hasErrors = result.requests?.some((r) => r.errors?.length)
    if (hasErrors) {
      const msgs = result.requests
        ?.flatMap((r) => r.errors ?? [])
        .map((e) => e.message)
        .join("; ")
      return NextResponse.json({ error: msgs }, { status: 422 })
    }
    return NextResponse.json({ uuid: result.entity?.uuid })
  } catch (err) {
    logerr2("[cdek/order]", err)
    return NextResponse.json(
      { error: "Не удалось создать заказ в СДЭК" },
      { status: 500 },
    )
  }
}
