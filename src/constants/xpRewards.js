/**
 * Aksiyon başına XP ödülleri (denge için tek yer).
 */

export const XP_REWARDS = {
  /** Satılan her kWh için (üstüne min eklenir) */
  energySellPerKwh: 0.45,
  energySellMin: 6,

  panelPurchase: {
    STANDARD: 14,
    MEGA: 24,
    ULTRA: 34,
    default: 12,
  },
  batteryPurchase: {
    BASIC: 12,
    HIGH: 20,
    MEGA: 28,
    default: 10,
  },
  /** Pazardan araştırma satın alma: taban + fiyat göre bonus */
  researchBuyBase: 16,
  researchBuyPriceQuotient: 100,

  exploreResearchUnlock: 22,

  hubSlotUnlock: 18,

  /** Panel temizliği (“performans yükseltmesi”) */
  panelClean: 7,
}

export function xpForEnergySold(kwhSold) {
  const k = typeof kwhSold === 'number' ? kwhSold : 0
  if (!(k > 0)) return 0
  const scaled = Math.round(k * XP_REWARDS.energySellPerKwh)
  return Math.max(XP_REWARDS.energySellMin, scaled)
}

export function xpForPanelPurchase(panelKey) {
  return XP_REWARDS.panelPurchase[panelKey] ?? XP_REWARDS.panelPurchase.default
}

export function xpForBatteryPurchase(batteryKey) {
  return XP_REWARDS.batteryPurchase[batteryKey] ?? XP_REWARDS.batteryPurchase.default
}

export function xpForResearchPurchase(priceCoins) {
  const p = typeof priceCoins === 'number' ? priceCoins : 0
  return XP_REWARDS.researchBuyBase + Math.max(0, Math.floor(p / XP_REWARDS.researchBuyPriceQuotient))
}
