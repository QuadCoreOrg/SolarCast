import {
  SPOT_ENERGY_BASE_COIN_PER_KWH,
  SPOT_ENERGY_HOURLY_SWING_COIN,
} from '../constants/gameData'

/** @returns {number} Anlık spot fiyatı (Coin / kWh) — gün/saat/şehir ile deterministik */
export function getSpotEnergyPriceCoinPerKwh({ day = 1, hour = 0, cityName = '' } = {}) {
  const hWrapped = ((((hour ?? 0) % 24) + 24) % 24) + Number(day ?? 1) * 0.041
  const citySalt =
    [...String(cityName || '')].reduce((acc, char) => acc + char.charCodeAt(0), 0) * 0.001
  const wave =
    Math.sin(hWrapped * 0.55 + citySalt + Number(day ?? 1) * 0.07) *
    SPOT_ENERGY_HOURLY_SWING_COIN
  const value = SPOT_ENERGY_BASE_COIN_PER_KWH + wave
  return Math.round(Math.max(0.5, value) * 100) / 100
}

/**
 * Önceki saat fiyatına göre kaba trend etiketi.
 * @returns {string}
 */
export function getSpotEnergyTrendLabel({ day = 1, hour = 0, cityName = '' } = {}) {
  const now = getSpotEnergyPriceCoinPerKwh({ day, hour, cityName })
  const prevHour = hour > 0 ? hour - 1 : 23
  const prevDay = hour > 0 ? day : Math.max(1, day - 1)
  const prev = getSpotEnergyPriceCoinPerKwh({ day: prevDay, hour: prevHour, cityName })
  if (prev <= 0) return '±%0'
  const pctRaw = ((now - prev) / prev) * 100
  const rounded = Math.round(pctRaw * 10) / 10
  if (rounded > 0) return `+%${rounded}`
  if (rounded < 0) return `−%${Math.abs(rounded)}`
  return '±%0'
}
