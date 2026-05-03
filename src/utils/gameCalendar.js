import { getGameSimulationDate } from '../services/production'

const MONTHS_TR = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık',
]

/**
 * Kampanya `startedAt` + oyun günü ile Türkçe "15 Mayıs" biçiminde etiket (üretim API’si ile aynı takvim).
 *
 * @param {number} gameDay
 * @param {string | null | undefined} startedAtIso
 */
export function formatGameCalendarDayMonthTr(gameDay, startedAtIso) {
  const d = getGameSimulationDate(gameDay, startedAtIso)
  return `${d.getDate()} ${MONTHS_TR[d.getMonth()]}`
}
