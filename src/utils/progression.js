/**
 * Seviye başına gereken XP: mevcut Lv.N iken dolan bar için N × 100.
 * @returns {{ experience: number, level: number }}
 */
export function applyExperienceGain(experienceBefore, levelBefore, gained) {
  const g = typeof gained === 'number' && gained > 0 ? Math.round(gained) : 0
  if (g <= 0) {
    return { experience: experienceBefore, level: levelBefore }
  }
  let xp = experienceBefore + g
  let lvl = Math.max(1, levelBefore)
  while (xp >= lvl * 100) {
    xp -= lvl * 100
    lvl += 1
  }
  return { experience: xp, level: lvl }
}

/** Ana seviye atlaması için gereken XP (bir sonraki seviye) */
export function xpRequiredForLevel(level) {
  return Math.max(1, level) * 100
}

/** Bar doluluk yüzdesi 0–100 */
export function levelProgressPercent(experience, level) {
  const need = xpRequiredForLevel(level)
  if (need <= 0) return 0
  return Math.min(100, Math.round((experience / need) * 1000) / 10)
}
