/** @typedef {{ id: string, name: string, area: number, efficiency: number, price: number, dirtyDaysLimit: number, reqLevel?: number, reqResearch?: string }} PanelDef */
/** @typedef {{ id: string, name: string, capacity: number, price: number, reqLevel?: number, reqResearch?: string }} BatteryDef */
/** @typedef {{ id: string, name: string, price: number, reqLevel?: number }} ResearchDef */

export const PANELS = {
  STANDARD: {
    id: 'p_std',
    name: 'Standart Panel',
    area: 8,
    efficiency: 0.2,
    price: 1200,
    dirtyDaysLimit: 7,
  },
  MEGA: {
    id: 'p_mega',
    name: 'Mega Panel',
    area: 15,
    efficiency: 0.22,
    price: 2600,
    dirtyDaysLimit: 14,
    reqLevel: 3,
    reqResearch: 'r_glass',
  },
  ULTRA: {
    id: 'p_ultra',
    name: 'Ultra Panel',
    area: 24,
    efficiency: 0.25,
    price: 4200,
    dirtyDaysLimit: 30,
    reqLevel: 5,
    reqResearch: 'r_wafer',
  },
}

export const BATTERIES = {
  BASIC: {
    id: 'b_basic',
    name: 'Temel Depolama',
    capacity: 200,
    price: 800,
  },
  HIGH: {
    id: 'b_high',
    name: 'Yüksek Kapasiteli Hücre',
    capacity: 420,
    price: 2200,
    reqLevel: 3,
    reqResearch: 'r_cobalt',
  },
  MEGA: {
    id: 'b_mega',
    name: 'Mega Enerji İstasyonu',
    capacity: 800,
    price: 4100,
    reqLevel: 5,
    reqResearch: 'r_polymer',
  },
}

/**
 * Coin ile satın alınan araştırma lisansları (panels/battery’ye göre cüzi, ama öğrenme maliyeti hissi verir).
 * Yuva açma 1200 Coin; başlangıç paneli 1200. Lv.3 araştırma ~%40 yuva fiyatı, Lv.5 ~%62.
 */
export const RESEARCHES = {
  GLASS: { id: 'r_glass', name: 'Temperli Termal Cam', price: 520, reqLevel: 3 },
  WAFER: { id: 'r_wafer', name: 'Zenginleştirilmiş Wafer', price: 780, reqLevel: 5 },
  COBALT: { id: 'r_cobalt', name: 'İşlenmiş Kobalt', price: 560, reqLevel: 3 },
  POLYMER: { id: 'r_polymer', name: 'Süperiletken Polimer', price: 820, reqLevel: 5 },
}

/** @type {{ [legacyKey: string]: string }} */
export const LEGACY_RESEARCH_KEY_TO_ID = {
  temperedThermalGlass: 'r_glass',
  enrichedWafer: 'r_wafer',
  processedCobalt: 'r_cobalt',
  superconductivePolymer: 'r_polymer',
}

/** Persist’taki legacy key → mağaza / buyItem('research') anahtarı (GLASS, WAFER…) */
export const RESEARCH_LEGACY_KEY_TO_STORE_KEY = {
  temperedThermalGlass: 'GLASS',
  enrichedWafer: 'WAFER',
  processedCobalt: 'COBALT',
  superconductivePolymer: 'POLYMER',
}

/** @type {{ [researchId: string]: string }} */
export const RESEARCH_ID_TO_LEGACY_KEY = Object.fromEntries(
  Object.entries(LEGACY_RESEARCH_KEY_TO_ID).map(([legacy, id]) => [id, legacy]),
)

export const ALL_PANEL_IDS = new Set(Object.values(PANELS).map((p) => p.id))
export const ALL_BATTERY_IDS = new Set(Object.values(BATTERIES).map((b) => b.id))

export const PANELS_BY_KEY = Object.fromEntries(
  Object.entries(PANELS).map(([key, def]) => [key, def]),
)

export const BATTERIES_BY_KEY = Object.fromEntries(
  Object.entries(BATTERIES).map(([key, def]) => [key, def]),
)

export const RESEARCHES_BY_KEY = Object.fromEntries(
  Object.entries(RESEARCHES).map(([key, def]) => [key, def]),
)

/** @type {Record<string, PanelDef>} */
export const PANEL_DEF_BY_TYPE_ID = Object.fromEntries(
  Object.values(PANELS).map((p) => [p.id, p]),
)

/** @type {Record<string, BatteryDef>} */
export const BATTERY_DEF_BY_TYPE_ID = Object.fromEntries(
  Object.values(BATTERIES).map((b) => [b.id, b]),
)

/** Panel temizlik maliyeti (coin) */
export const PANEL_CLEAN_COST = 50

/** Anlık enerji spot piyasası: taban Coin / kWh (oyun ekonomisi ile tutarlı) */
export const SPOT_ENERGY_BASE_COIN_PER_KWH = 2.86
/** Güne göre +/- salınım (Coin cinsinden, sinüs ile modüle edilir) */
export const SPOT_ENERGY_HOURLY_SWING_COIN = 0.55

/** Panel ve depolama yuvalarını ortak açma maliyeti (coin) */
export const HUB_SLOT_UNLOCK_COST = 1200
