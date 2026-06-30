/**
 * Код ПВЗ СДЭК, с которого отправляется посылка (отправитель сдаёт сам).
 * Используется как shipment_point в заказах с тарифами склад→склад (136) и склад→дверь (137).
 * Берётся из переменной окружения CDEK_SHIPMENT_POINT.
 */
export function getShipmentPoint(): string {
  const val = process.env.CDEK_SHIPMENT_POINT
  if (!val) throw new Error("[cdek-config] CDEK_SHIPMENT_POINT is not set")
  return val
}

/**
 * Код города отправителя для расчёта стоимости доставки (calcDelivery).
 * Москва = 44. Захардкожено — не берётся из переменных окружения.
 */
export const CDEK_CITY_CODE = 44

export function getFromCityCode(): number {
  return CDEK_CITY_CODE
}

/** @deprecated Используй getShipmentPoint() и getFromCityCode() */
export const fromLocation = {
  address: "пер. Пуговишников, 16",
  city: "Москва",
  code: 44,
  country_code: "RU",
  fias_guid: "0c5b2444-70a0-4932-980c-b4dc0d3f02b5",
  latitude: 55.732162,
  longitude: 37.584072,
  postal_code: "119021",
  region: "Москва",
}
