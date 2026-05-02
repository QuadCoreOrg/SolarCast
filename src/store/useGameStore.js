import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import {
  BATTERIES_BY_KEY,
  BATTERY_DEF_BY_TYPE_ID,
  HUB_SLOT_UNLOCK_COST,
  LEGACY_RESEARCH_KEY_TO_ID,
  PANELS_BY_KEY,
  PANEL_CLEAN_COST,
  PANEL_DEF_BY_TYPE_ID,
  RESEARCHES_BY_KEY,
  RESEARCH_ID_TO_LEGACY_KEY,
} from '../constants/gameData'
import GAME_CONFIG from '../config/gameConfig'
import { calculateGameDayProduction } from '../services/production'

const GAME_STORAGE_KEY = 'solarcast_game_store'
const GAME_STORE_VERSION = 5

const ONBOARDING_SCREENS = new Set(['how_to', 'city_select'])
const VALID_SCREENS = new Set([
  'how_to',
  'city_select',
  'dashboard',
  'market',
  'power_center',
  'storage_area',
  'research',
  'settings',
])

const spawnId = () =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `id_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`

const createInitialResearch = () => ({
  temperedThermalGlass: false,
  enrichedWafer: false,
  processedCobalt: false,
  superconductivePolymer: false,
})

const syncResearchFromUnlocks = (unlockedResearchIds, baseResearch = createInitialResearch()) => {
  const next = { ...baseResearch }
  for (const rid of unlockedResearchIds || []) {
    const legacyKey = RESEARCH_ID_TO_LEGACY_KEY[rid]
    if (legacyKey) next[legacyKey] = true
  }
  return next
}

const buildUnlocksFromResearchObject = (researchObj) => {
  const ids = []
  if (!researchObj) return ids
  for (const [legacyKey, unlocked] of Object.entries(researchObj)) {
    if (!unlocked) continue
    const rid = LEGACY_RESEARCH_KEY_TO_ID[legacyKey]
    if (rid) ids.push(rid)
  }
  return ids
}

function endDaySlice(stateBefore) {
  return {
    isDayActive: false,
    hour: 0,
    day: stateBefore.day + 1,
    activePanels: stateBefore.activePanels.map((p) => ({
      ...p,
      daysSinceCleaned: (p.daysSinceCleaned ?? 0) + 1,
    })),
    lastUpdatedAt: new Date().toISOString(),
  }
}

const createInitialGameState = () => ({
  currentScreen: 'how_to',
  hasStartedGame: false,
  selectedCity: '',
  startedAt: null,
  lastUpdatedAt: null,

  level: 1,
  experience: 0,

  coins: 2000,
  currentEnergy: 0,

  day: 1,
  hour: 0,
  isDayActive: false,
  gameLoopMode: 'play',
  activePanels: [],
  activeBatteries: [],
  unlockedResearches: [],
  dailyForecast: [],

  solarPanels: [],
  batteries: [],
  upgrades: [],
  inventory: GAME_CONFIG.powerHub.initialInventory,
  maxSlots: GAME_CONFIG.powerHub.maxSlots,
  unlockedSlots: GAME_CONFIG.powerHub.initialUnlockedSlots,

  dailyGoal: 80,
  currentProgress: 0,
  research: createInitialResearch(),
})

const touch = () => ({ lastUpdatedAt: new Date().toISOString() })

const normalizePersistedState = (state) => {
  let currentScreen = VALID_SCREENS.has(state.currentScreen) ? state.currentScreen : 'how_to'

  if (state.hasStartedGame && state.selectedCity && ONBOARDING_SCREENS.has(currentScreen)) {
    currentScreen = 'dashboard'
  }

  if (state.hasStartedGame && state.selectedCity && !ONBOARDING_SCREENS.has(currentScreen)) {
    return {
      ...state,
      currentScreen: 'dashboard',
    };
  }

  if (!state.hasStartedGame && !state.selectedCity && !ONBOARDING_SCREENS.has(currentScreen)) {
    currentScreen = 'how_to'
  }

  const coins =
    typeof state.coins === 'number'
      ? state.coins
      : typeof state.credits === 'number'
        ? state.credits
        : 2000

  const currentEnergy =
    typeof state.currentEnergy === 'number'
      ? state.currentEnergy
      : typeof state.energy === 'number'
        ? state.energy
        : 0

  const researchBase = {
    ...createInitialResearch(),
    ...(state.research || {}),
  }

  let unlockedResearches = Array.isArray(state.unlockedResearches)
    ? [...new Set(state.unlockedResearches)]
    : []

  if (unlockedResearches.length === 0) {
    unlockedResearches = [...new Set(buildUnlocksFromResearchObject(researchBase))]
  }

  const researchMerged = syncResearchFromUnlocks(unlockedResearches, researchBase)

  return {
    ...state,
    currentScreen,
    coins,
    currentEnergy,
    day: typeof state.day === 'number' ? state.day : 1,
    hour: typeof state.hour === 'number' ? state.hour : 0,
    isDayActive: Boolean(state.isDayActive),
    gameLoopMode:
      state.gameLoopMode === 'pause' || state.gameLoopMode === 'fast' || state.gameLoopMode === 'play'
        ? state.gameLoopMode
        : state.autoAdvanceDay
          ? 'fast'
          : 'play',
    activePanels: Array.isArray(state.activePanels) ? state.activePanels : [],
    activeBatteries: Array.isArray(state.activeBatteries) ? state.activeBatteries : [],
    unlockedResearches,
    dailyForecast: Array.isArray(state.dailyForecast) ? state.dailyForecast : [],
    research: researchMerged,
    solarPanels: Array.isArray(state.solarPanels) ? state.solarPanels : [],
    batteries: Array.isArray(state.batteries) ? state.batteries : [],
    upgrades: Array.isArray(state.upgrades) ? state.upgrades : [],
  }
}

const persistedStateKeys = [
  'currentScreen',
  'hasStartedGame',
  'selectedCity',
  'startedAt',
  'lastUpdatedAt',
  'level',
  'experience',

  'coins',
  'currentEnergy',
  'day',
  'hour',
  'isDayActive',
  'gameLoopMode',
  'activePanels',
  'activeBatteries',
  'unlockedResearches',
  'dailyForecast',

  'solarPanels',
  'batteries',
  'upgrades',
  'inventory',
  'maxSlots',
  'unlockedSlots',
  'dailyGoal',
  'currentProgress',
  'research',
]

const pickPersistedState = (state) =>
  persistedStateKeys.reduce((persistedState, key) => {
    persistedState[key] = state[key]
    return persistedState
  }, {})

const useGameStore = create(
  persist(
    (set, get) => ({
      ...createInitialGameState(),

      setScreen: (screen) =>
        set((state) => {
          if (!VALID_SCREENS.has(screen)) return {}
          if (state.hasStartedGame && state.selectedCity && ONBOARDING_SCREENS.has(screen)) {
            return { currentScreen: 'dashboard', ...touch() }
          }
          return { currentScreen: screen, ...touch() }
        }),

      setSelectedCity: (city) =>
        set({
          selectedCity: city,
          ...touch(),
        }),

      startGame: (city) =>
        set((state) => {
          const selectedCity = city || state.selectedCity
          if (!selectedCity) return {}

          const now = new Date().toISOString()

          return {
            selectedCity,
            hasStartedGame: true,
            currentScreen: 'dashboard',
            startedAt: state.startedAt || now,
            lastUpdatedAt: now,
          }
        }),

      startDay: async () => {
        const { selectedCity, isDayActive } = get()
        if (isDayActive) return

        let dailyForecast
        try {
          dailyForecast = await calculateGameDayProduction(selectedCity || 'Ankara')
        } catch (e) {
          console.error('[startDay]', e)
          try {
            dailyForecast = await calculateGameDayProduction('Ankara')
          } catch (e2) {
            console.error('[startDay] fallback', e2)
            return
          }
        }

        set({
          dailyForecast,
          hour: 0,
          isDayActive: true,
          ...touch(),
        })
      },

      endDay: () =>
        set((state) => {
          if (!state.isDayActive) return {}
          return {
            ...endDaySlice(state),
          }
        }),

      setGameLoopMode: (mode) =>
        set({
          gameLoopMode: mode === 'pause' || mode === 'fast' ? mode : 'play',
          ...touch(),
        }),

      tickProductionHour: () =>
        set((state) => {
          if (!state.isDayActive || state.dailyForecast.length < 24) return {}

          const slot = state.dailyForecast[state.hour]
          const gtiUsed = typeof slot?.gti_used === 'number' ? slot.gti_used : 0

          let totalKw = 0

          for (const panel of state.activePanels) {
            const def = PANEL_DEF_BY_TYPE_ID[panel.type]
            if (!def) continue
            const dirty = (panel.daysSinceCleaned ?? 0) >= def.dirtyDaysLimit
            const effMult = dirty ? 0.25 : 1
            // Oyun dengesi: baz verimlilik 1 kabul edilir, kirli panel %75 düşer.
            const kwHour = def.area * effMult * (gtiUsed / 1000)
            totalKw += kwHour
          }

          let maxCapacity = 0
          for (const batt of state.activeBatteries) {
            const bdef = BATTERY_DEF_BY_TYPE_ID[batt.type]
            if (bdef) maxCapacity += bdef.capacity
          }

          // Batarya yoksa depolama yok: üretim birikmez (şebekeye kaçar / boşa gider).
          const nextEnergy =
            maxCapacity > 0
              ? Math.min(maxCapacity, state.currentEnergy + totalKw)
              : 0

          const workedState = {
            ...state,
            currentEnergy: nextEnergy,
          }

          if (state.hour + 1 >= 24) {
            return {
              ...workedState,
              ...endDaySlice(workedState),
              ...touch(),
            }
          }

          return {
            currentEnergy: nextEnergy,
            hour: state.hour + 1,
            ...touch(),
          }
        }),

      cleanPanel: (panelId, costCoins = PANEL_CLEAN_COST) =>
        set((state) => {
          const idx = state.activePanels.findIndex((p) => p.id === panelId)
          if (idx === -1) return {}
          if (state.coins < costCoins) return {}

          const nextPanels = state.activePanels.map((p) =>
            p.id === panelId ? { ...p, daysSinceCleaned: 0 } : p,
          )

          return {
            coins: state.coins - costCoins,
            activePanels: nextPanels,
            ...touch(),
          }
        }),

      /**
       * Panel ve depolama için ortak yuva kilidini açar (fiyat gameData).
       * @returns {{ ok: true } | { ok: false, reason: string }}
       */
      unlockHubSlot: () => {
        const state = get()
        if (state.unlockedSlots >= state.maxSlots) {
          return { ok: false, reason: 'Tüm yuvalar zaten açık' }
        }
        if (state.coins < HUB_SLOT_UNLOCK_COST) {
          return { ok: false, reason: 'Yetersiz coin' }
        }
        set({
          coins: state.coins - HUB_SLOT_UNLOCK_COST,
          unlockedSlots: state.unlockedSlots + 1,
          ...touch(),
        })
        return { ok: true }
      },

      /**
       * @param {'panel' | 'battery' | 'research'} type
       * @param {string} itemKey PANELS / BATTERIES / RESEARCHES anahtarı (örn. STANDARD, BASIC, GLASS)
       * @returns {{ ok: true } | { ok: false, reason: string }}
       */
      buyItem: (type, itemKey) => {
        const state = get()
        const key = itemKey

        if (type === 'research') {
          const def = RESEARCHES_BY_KEY[key]
          if (!def) return { ok: false, reason: 'Geçersiz araştırma' }
          if (state.unlockedResearches.includes(def.id)) {
            return { ok: false, reason: 'Zaten açık' }
          }
          if (state.coins < def.price) {
            return { ok: false, reason: 'Yetersiz coin' }
          }

          const legacyKey = RESEARCH_ID_TO_LEGACY_KEY[def.id]
          set({
            coins: state.coins - def.price,
            unlockedResearches: [...state.unlockedResearches, def.id],
            research:
              legacyKey != null ? { ...state.research, [legacyKey]: true } : state.research,
            ...touch(),
          })
          return { ok: true }
        }

        if (type === 'panel') {
          const def = PANELS_BY_KEY[key]
          if (!def) return { ok: false, reason: 'Geçersiz panel' }
          if (state.activePanels.length >= state.unlockedSlots) {
            return { ok: false, reason: 'Boş panel yuvası yok — önce yuva aç' }
          }
          if (def.reqLevel != null && state.level < def.reqLevel) {
            return { ok: false, reason: 'Seviye yetersiz' }
          }
          if (def.reqResearch && !state.unlockedResearches.includes(def.reqResearch)) {
            return { ok: false, reason: 'Araştırma gerekli' }
          }
          if (state.coins < def.price) {
            return { ok: false, reason: 'Yetersiz coin' }
          }

          const newPanel = {
            id: spawnId(),
            type: def.id,
            daysSinceCleaned: 0,
          }

          set({
            coins: state.coins - def.price,
            activePanels: [...state.activePanels, newPanel],
            ...touch(),
          })
          return { ok: true }
        }

        if (type === 'battery') {
          const def = BATTERIES_BY_KEY[key]
          if (!def) return { ok: false, reason: 'Geçersiz batarya' }
          if (state.activeBatteries.length >= state.unlockedSlots) {
            return { ok: false, reason: 'Boş depolama yuvası yok — önce yuva aç' }
          }
          if (def.reqLevel != null && state.level < def.reqLevel) {
            return { ok: false, reason: 'Seviye yetersiz' }
          }
          if (def.reqResearch && !state.unlockedResearches.includes(def.reqResearch)) {
            return { ok: false, reason: 'Araştırma gerekli' }
          }
          if (state.coins < def.price) {
            return { ok: false, reason: 'Yetersiz coin' }
          }

          const newBatt = {
            id: spawnId(),
            type: def.id,
          }

          set({
            coins: state.coins - def.price,
            activeBatteries: [...state.activeBatteries, newBatt],
            ...touch(),
          })
          return { ok: true }
        }

        return { ok: false, reason: 'Geçersiz tip' }
      },

      addCoins: (amount) =>
        set((state) => ({
          coins: state.coins + amount,
          ...touch(),
        })),

      spendCoins: (amount) =>
        set((state) => ({
          coins: Math.max(0, state.coins - amount),
          ...touch(),
        })),

      addExperience: (amount) =>
        set((state) => {
          const newExp = state.experience + amount
          const expNeeded = state.level * 100

          if (newExp >= expNeeded) {
            return {
              experience: newExp - expNeeded,
              level: state.level + 1,
              ...touch(),
            }
          }

          return {
            experience: newExp,
            ...touch(),
          }
        }),

      setDailyGoal: (goal) => set({ dailyGoal: goal, ...touch() }),
      updateProgress: (progress) => set({ currentProgress: progress, ...touch() }),

      addSolarPanel: (panel) =>
        set((state) => ({
          solarPanels: [...state.solarPanels, panel],
          ...touch(),
        })),

      addBattery: (battery) =>
        set((state) => ({
          batteries: [...state.batteries, battery],
          ...touch(),
        })),

      addUpgrade: (upgrade) =>
        set((state) => ({
          upgrades: [...state.upgrades, upgrade],
          ...touch(),
        })),

      unlockResearch: (researchKey) =>
        set((state) => {
          const rid = LEGACY_RESEARCH_KEY_TO_ID[researchKey]
          let nextUnlocks = state.unlockedResearches
          if (rid && !state.unlockedResearches.includes(rid)) {
            nextUnlocks = [...state.unlockedResearches, rid]
          }
          return {
            research: {
              ...state.research,
              [researchKey]: true,
            },
            unlockedResearches: nextUnlocks,
            ...touch(),
          }
        }),

      resetGame: () => set(createInitialGameState()),
    }),
    {
      name: GAME_STORAGE_KEY,
      version: GAME_STORE_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: pickPersistedState,
      migrate: (persistedState, version) => {
        if (!persistedState || version >= GAME_STORE_VERSION) {
          return persistedState
        }
        const migrated = {
          ...persistedState,
          coins: persistedState.coins ?? persistedState.credits ?? 2000,
          currentEnergy:
            persistedState.currentEnergy ?? persistedState.energy ?? 0,
          day: persistedState.day ?? 1,
          hour: persistedState.hour ?? 0,
          isDayActive: Boolean(persistedState.isDayActive),
          gameLoopMode:
            persistedState.gameLoopMode === 'pause' ||
            persistedState.gameLoopMode === 'fast' ||
            persistedState.gameLoopMode === 'play'
              ? persistedState.gameLoopMode
              : persistedState.autoAdvanceDay
                ? 'fast'
                : 'play',
          activePanels: persistedState.activePanels ?? [],
          activeBatteries: persistedState.activeBatteries ?? [],
          dailyForecast: persistedState.dailyForecast ?? [],
          unlockedResearches: persistedState.unlockedResearches ?? [],
        }
        delete migrated.credits
        delete migrated.energy
        return migrated
      },
      merge: (persistedState, currentState) =>
        normalizePersistedState({
          ...currentState,
          ...(persistedState || {}),
        }),
    },
  ),
)

export default useGameStore
