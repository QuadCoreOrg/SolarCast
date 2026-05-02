/**
 * Toplam enerjiyi depolar sırasıyla (1 → 2 → 3…) doldurarak böler — yalnızca gösterim / UI modeli.
 * Oyun fiziği hâlâ tek bir `currentEnergy` havuzu kullanır; bu fonksiyon tutarlı bir kart gösterimi sağlar.
 *
 * @param {number} currentEnergyKwh
 * @param {Array<{ id: string, capacityKwh: number }>} batteriesOrdered aktivasyon sırasıyla
 * @returns {Array<{ id: string, capacityKwh: number, orderIndex: number, storedKwh: number, chargePct: number, isFull: boolean }>}
 */
export function allocateSequentialBatteryDisplay(currentEnergyKwh, batteriesOrdered) {
  let remaining = Math.max(0, Number(currentEnergyKwh) || 0)
  const list = batteriesOrdered ?? []

  return list.map((b, idx) => {
    const cap = Math.max(0, Number(b.capacityKwh) || 0)
    const storedRaw = Math.min(remaining, cap)
    remaining -= storedRaw
    const storedKwh = Math.round(storedRaw * 1000) / 1000
    const pct = cap > 0 ? Math.min(100, Math.round((storedKwh / cap) * 100)) : 0
    const isFull = cap > 0 && storedKwh >= cap

    return {
      id: b.id,
      capacityKwh: cap,
      orderIndex: idx + 1,
      storedKwh,
      chargePct: pct,
      isFull,
    }
  })
}
