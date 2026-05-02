import { BATTERIES, BATTERIES_BY_KEY, PANELS, PANELS_BY_KEY, RESEARCHES } from './gameData'

/** Panel tip kimliği → oyun içi anahtar (örn. p_std → STANDARD) */
export const PANEL_ID_TO_GAME_KEY = Object.fromEntries(
  Object.entries(PANELS).map(([gameKey, def]) => [def.id, gameKey]),
)

/** Batarya tip kimliği → oyun içi anahtar */
export const BATTERY_ID_TO_GAME_KEY = Object.fromEntries(
  Object.entries(BATTERIES).map(([gameKey, def]) => [def.id, gameKey]),
)

/**
 * Mevcut tipten yükseltme: Coin maliyeti (yeni kart almaktan daha ucuza getirilir) + araştırma bağları hedef panele göre.
 */
export const EQUIPMENT_UPGRADE_ROUTE = {
  panel: {
    STANDARD: { nextKey: 'MEGA', coinCost: 1380 },
    MEGA: { nextKey: 'ULTRA', coinCost: 1880 },
  },
  battery: {
    BASIC: { nextKey: 'HIGH', coinCost: 1520 },
    HIGH: { nextKey: 'MEGA', coinCost: 2080 },
  },
}

function researchLabelById(researchId) {
  const entry = Object.values(RESEARCHES).find((r) => r.id === researchId)
  return entry?.name ?? researchId
}

/**
 * @param {string} currentGameKey
 * @param {number} level
 * @param {string[]} unlockedResearchIds
 */
export function getPanelUpgradeProjection(currentGameKey, level, unlockedResearchIds) {
  const step = EQUIPMENT_UPGRADE_ROUTE.panel[currentGameKey]
  if (!step) return null
  const target = PANELS[step.nextKey]
  if (!target) return null

  const blockers = []
  if (target.reqLevel != null && level < target.reqLevel) {
    blockers.push(`Seviye: en az Lv.${target.reqLevel}`)
  }
  if (target.reqResearch != null && !unlockedResearchIds.includes(target.reqResearch)) {
    blockers.push(`${researchLabelById(target.reqResearch)} araştırması gerekli`)
  }

  return {
    nextKey: step.nextKey,
    coinCost: step.coinCost,
    targetDef: target,
    canPurchase: blockers.length === 0,
    blockerLines: blockers,
    isAlreadyMax: false,
  }
}

/**
 * @param {string} currentGameKey
 * @param {number} level
 * @param {string[]} unlockedResearchIds
 */
export function getBatteryUpgradeProjection(currentGameKey, level, unlockedResearchIds) {
  const step = EQUIPMENT_UPGRADE_ROUTE.battery[currentGameKey]
  if (!step) return null
  const target = BATTERIES[step.nextKey]
  if (!target) return null

  const blockers = []
  if (target.reqLevel != null && level < target.reqLevel) {
    blockers.push(`Seviye: en az Lv.${target.reqLevel}`)
  }
  if (target.reqResearch != null && !unlockedResearchIds.includes(target.reqResearch)) {
    blockers.push(`${researchLabelById(target.reqResearch)} araştırması gerekli`)
  }

  return {
    nextKey: step.nextKey,
    coinCost: step.coinCost,
    targetDef: target,
    canPurchase: blockers.length === 0,
    blockerLines: blockers,
    isAlreadyMax: false,
  }
}

/** @param {string} typeId */
export function getPanelGameKeyFromTypeId(typeId) {
  return PANEL_ID_TO_GAME_KEY[typeId] ?? null
}

/** @param {string} typeId */
export function getBatteryGameKeyFromTypeId(typeId) {
  return BATTERY_ID_TO_GAME_KEY[typeId] ?? null
}

export { PANELS_BY_KEY, BATTERIES_BY_KEY }
