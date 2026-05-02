import cities from '../data/cities.json'

/**
 * Oyundaki seçili güne ilişkin saat başı güneş paneli irradiance ve güç özeti — Open-Meteo Archive (`global_tilted_irradiance`, `temperature_2m`).
 * Oyun içi yıl nerede olursa olsun arşiv sorgusu 2024 aynı ay-gününe sabittir (29 Şubat → 28 Şubat).
 *
 * Üretilen her eleman: `{ hour: 0..23, gti_used, power_watts, temp_used, cloud_cover, sunshine_duration_s }`.
 * `power_watts` için: `panelArea * efficiency * GTI`; sıcaklık >25°C ise her derece için %0.4 oranında ham güç düşüşü.
 *
 * // TODO(Zustand): panelArea ve efficiency için store varsayılanlarını oluşturup options ile birleştir.
 *
 * @param {string | null | undefined} cityName
 * @param {{
 *   gameDate?: Date | string | number,
 *   panelArea?: number,
 *   efficiency?: number,
 * }} [options]
 * @returns {Promise<Array<{ hour: number, gti_used: number, power_watts: number, temp_used: number, cloud_cover: number, sunshine_duration_s: number }>>}
 */
export async function calculateGameDayProduction(cityName, options = {}) {
  const panelArea = options.panelArea ?? 1
  const efficiency = options.efficiency ?? 0.2

  const city = typeof cityName === 'string' ? cities.find((c) => c.il === cityName) : undefined
  const lat = typeof city?.enlem === 'number' ? city.enlem : 39.9208
  const lon = typeof city?.boylam === 'number' ? city.boylam : 32.8541

  const baseDate = options.gameDate ? new Date(options.gameDate) : new Date()
  let month = String(baseDate.getMonth() + 1).padStart(2, '0')
  let day = String(baseDate.getDate()).padStart(2, '0')
  if (month === '02' && day === '29') day = '28'
  const targetDate = `2024-${month}-${day}`

  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    start_date: targetDate,
    end_date: targetDate,
    hourly: 'temperature_2m,global_tilted_irradiance,cloud_cover,sunshine_duration',
    timezone: 'auto',
  })
  const url = `https://archive-api.open-meteo.com/v1/archive?${params.toString()}`

  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`API Hatası: ${response.status}`)
    const data = await response.json()

    const gtiArr = data?.hourly?.global_tilted_irradiance
    const tempArr = data?.hourly?.temperature_2m
    const cloudArr = data?.hourly?.cloud_cover
    const sunArr = data?.hourly?.sunshine_duration

    if (!Array.isArray(gtiArr) || !Array.isArray(tempArr)) {
      throw new Error('API yanıtında hourly sıraları eksik')
    }

    /** @type {Array<{ hour: number, gti_used: number, power_watts: number, temp_used: number, cloud_cover: number, sunshine_duration_s: number }>} */
    const hourly = []

    for (let h = 0; h < 24; h += 1) {
      const rawGti = gtiArr[h]
      const rawTemp = tempArr[h]
      const rawCloud = Array.isArray(cloudArr) ? cloudArr[h] : null
      const rawSun = Array.isArray(sunArr) ? sunArr[h] : null

      const gti = typeof rawGti === 'number' && Number.isFinite(rawGti) ? rawGti : 0
      const temp =
        typeof rawTemp === 'number' && Number.isFinite(rawTemp) ? rawTemp : 25

      const cloud =
        typeof rawCloud === 'number' && Number.isFinite(rawCloud)
          ? Math.max(0, Math.min(100, rawCloud))
          : 50
      const sunshineS =
        typeof rawSun === 'number' && Number.isFinite(rawSun) ? Math.max(0, rawSun) : 0

      let power = panelArea * efficiency * gti
      if (temp > 25) {
        const lossFactor = (temp - 25) * 0.004
        power *= 1 - lossFactor
      }

      hourly.push({
        hour: h,
        gti_used: Math.round(gti * 10) / 10,
        power_watts: parseFloat(power.toFixed(2)),
        temp_used: temp,
        cloud_cover: Math.round(cloud * 10) / 10,
        sunshine_duration_s: Math.round(sunshineS * 100) / 100,
      })
    }

    return hourly
  } catch (error) {
    console.error(`[${cityName}] hava durumu çekilemedi:`, error)
    return []
  }
}
