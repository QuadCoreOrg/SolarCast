import cities from '../data/cities.json'

/**
 * Seçilen il için kart istatistikleri (tahmin gününden gün doğumu / batımı).
 */
export function getCitySolarStats(cityName) {
  if (!cityName) return null

  const row = cities.find((c) => c.il === cityName)

  const fallback = {
    sunHoursPerDay: 7.5,
    efficiencyPct: 72,
    setupCost: 2200,
    badge: 'Orta güneş',
  }

  if (!row?.tahmin_3_gun?.[0]) {
    return { cityName, ...fallback }
  }

  const day = row.tahmin_3_gun[0]
  const rise = day['gün_doğumu']
  const set = day['gün_batımı']

  let daylightHours = fallback.sunHoursPerDay
  if (rise && set) {
    const ms = new Date(set).getTime() - new Date(rise).getTime()
    daylightHours = Math.max(0, Math.round((ms / 3600000) * 10) / 10)
  }

  // Panel “efektif güneş saati” kabaca günışığının bir kısmı (mock’taki ~9h bandına yakın)
  const sunHoursPerDay = Math.round(daylightHours * 0.72 * 10) / 10

  const latFactor = Math.max(0, 1 - Math.abs(39 - row.enlem) / 25)
  const efficiencyPct = Math.min(
    94,
    Math.round(56 + sunHoursPerDay * 2.6 + latFactor * 14),
  )

  const setupCost = Math.round(
    1200 + sunHoursPerDay * 110 + row.enlem * 14 + efficiencyPct * 6,
  )

  let badge = 'Daha az güneş'
  if (sunHoursPerDay >= 8.5) badge = 'Yüksek güneş'
  else if (sunHoursPerDay >= 7) badge = 'Orta güneş'

  return {
    cityName,
    sunHoursPerDay,
    efficiencyPct,
    setupCost,
    badge,
  }
}
