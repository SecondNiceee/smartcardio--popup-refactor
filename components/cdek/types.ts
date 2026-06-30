export interface FormData {
  name: string
  phone: string
  email: string
  city: string
  cityCode: string
  regionCode: number
  comment: string
  consent: boolean
}

export interface PvzLocation {
  code: string
  name: string
  address: string
  workTime: string
}

export interface CourierLocation {
  address: string
}

export interface Tariff {
  tariff_code: number
  tariff_name: string
  delivery_sum: number
  period_min: number
  period_max: number
}

export type DeliveryType = "pvz" | "courier"

export type Step = "form" | "delivery-type" | "pvz" | "courier" | "confirm"

export interface CdekCity {
  city: string
  full_name: string
  city_code: number
  region_code: number
  country_code: string
}
