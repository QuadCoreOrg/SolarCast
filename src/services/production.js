import cities from '../data/cities.json'

/**
 * Güne göre güneş hattı irradiance modeli — `gti_used` W/m² (oyun matematiği).
 * Gerçek saat başı meteoroloji yerine seçili şehir `cities.json` tahmin özeti ile sentezlenir (harici endpoint gerekmez).
 *
 * Üretilen her eleman: `{ hour: 0..23, gti_used: number }`.
 *
 * Elektrik gücü (kW): (panel_alanı_m²) × verim × (gti_used / 1000)
 *
 * @param {string | null | undefined} cityName
 * @param {{ forecastDayIndex?: number }} [options]
 * @returns {Promise<Array<{ hour: number, gti_used: number }>>}
 */
export async function calculateGameDayProduction(cityName, options = {}) {
  const forecastDayIndex = options.forecastDayIndex ?? 0
  await Promise.resolve()

  const city = typeof cityName === 'string'
    ? cities.find((c) => c.il === cityName)
    : undefined

  const day = city?.tahmin_3_gun?.[forecastDayIndex]

  /** @type {Date} */
  let sunrise
  /** @type {Date} */
  let sunset

  if (day?.['gün_doğumu'] && day?.['gün_batımı']) {
    sunrise = new Date(day['gün_doğumu'])
    sunset = new Date(day['gün_batımı'])
  } else {
    const base = new Date()
    sunrise = new Date(base.getFullYear(), base.getMonth(), base.getDate(), 6, 0, 0)
    sunset = new Date(base.getFullYear(), base.getMonth(), base.getDate(), 19, 0, 0)
  }

  const rainMm = typeof day?.yagis_mm === 'number' ? day.yagis_mm : 0
  const havaCode = typeof day?.hava_kodu === 'number' ? day.hava_kodu : 0
  const precipitationPenalty = Math.min(0.75, rainMm / 42)
  const cloudPenalty =
    havaCode >= 95
      ? 0.14
      : havaCode >= 80
        ? 0.1
        : havaCode >= 70
          ? 0.07
          : havaCode >= 60
            ? 0.05
            : havaCode >= 51
              ? 0.04
              : 0

  /** Enlem ile tepeye göre yaklaşım (W/m²) */
  const lat = typeof city?.enlem === 'number' ? city.enlem : 39
  const latitudeFactor = 1 + Math.cos(((lat - 36) / 45) * Math.PI) * 0.12
  const clearnessIndex = Math.max(0.18, 1 - precipitationPenalty - cloudPenalty)

  const riseH = sunrise.getHours() + sunrise.getMinutes() / 60
  const setH = sunset.getHours() + sunset.getMinutes() / 60

  /** Tepe sıcak ortam daha iyi yüzey sıcaklığı — çok küçük modül sıcaklık kaydırması */
  const temp = typeof day?.maks_sicaklik_c === 'number' ? day.maks_sicaklik_c : 22
  const thermalFactor = Math.max(0.92, 1 - Math.max(0, temp - 24) * 0.008)

  const peakGti = Math.min(980, 820 * latitudeFactor * clearnessIndex * thermalFactor)

  const hourly = []

  for (let hour = 0; hour < 24; hour += 1) {
    let gti_used = 0
    const h = hour + 0.5

    if (h > riseH && h < setH) {
      const u = (h - riseH) / Math.max(0.5, setH - riseH)
      const shape = Math.sin(Math.PI * u)
      const edgeSoft = riseH <= h && h <= riseH + 0.85 ? Math.min(1, (h - riseH) / 0.85)
        : setH >= h && h >= setH - 0.85 ? Math.min(1, (setH - h) / 0.85) : 1
      gti_used = peakGti * shape * edgeSoft
    }

    hourly.push({
      hour,
      gti_used: Math.round(gti_used * 10) / 10,
    })
  }

  return hourly
}
