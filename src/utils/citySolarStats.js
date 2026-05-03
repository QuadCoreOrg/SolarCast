import cityProfiles from '../data/city_profiles.json'

/** @typedef {{ il: string, sunHours: string, efficiency: string, setupCost: number, tier: string }} CityProfileRow */

const TIER_TO_BADGE_TR = {
  'High Solar': 'Yüksek güneş',
  'Good Solar': 'İyi güneş',
  'Medium Solar': 'Orta güneş',
  'Low Solar': 'Daha az güneş',
}

function parseSunHours(s) {
  if (typeof s !== 'string') return null
  const n = Number.parseFloat(s.replace(/h/gi, '').trim())
  return Number.isFinite(n) ? Math.round(n * 10) / 10 : null
}

function parseEfficiencyPct(s) {
  if (typeof s !== 'string') return null
  const n = Number.parseInt(String(s).replace(/%/g, '').trim(), 10)
  return Number.isFinite(n) ? n : null
}

/**
 * Seçilen il için kart istatistikleri — `city_profiles.json` içindeki hazır profil değerleri.
 */
export function getCitySolarStats(cityName) {
  if (!cityName) return null

  const fallback = {
    sunHoursPerDay: 7.5,
    efficiencyPct: 72,
    setupCost: 2200,
    badge: 'Orta güneş',
  }

  /** @type {CityProfileRow | undefined} */
  const row = cityProfiles.find((c) => c.il === cityName)

  if (!row) {
    return { cityName, ...fallback }
  }

  const sunHoursPerDay = parseSunHours(row.sunHours) ?? fallback.sunHoursPerDay
  const efficiencyPct = parseEfficiencyPct(row.efficiency) ?? fallback.efficiencyPct
  const setupCost =
    typeof row.setupCost === 'number' && Number.isFinite(row.setupCost)
      ? row.setupCost
      : fallback.setupCost

  const badge =
    (row.tier && TIER_TO_BADGE_TR[row.tier]) || fallback.badge

  return {
    cityName,
    sunHoursPerDay,
    efficiencyPct,
    setupCost,
    badge,
  }
}
