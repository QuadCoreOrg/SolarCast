import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import GAME_CONFIG from '../config/gameConfig';

const GAME_STORAGE_KEY = 'solarcast_game_store';
const GAME_STORE_VERSION = 1;

const ONBOARDING_SCREENS = new Set(['how_to', 'city_select']);
const VALID_SCREENS = new Set([
  'how_to',
  'city_select',
  'dashboard',
  'market',
  'power_center',
  'research',
  'settings',
]);

const createInitialResearch = () => ({
  temperedThermalGlass: false,
  enrichedWafer: false,
  processedCobalt: false,
  superconductivePolymer: false,
});

const createInitialGameState = () => ({
  currentScreen: 'how_to',
  hasStartedGame: false,
  selectedCity: '',
  startedAt: null,
  lastUpdatedAt: null,

  energy: 100,
  coins: 0,
  level: 1,
  experience: 0,

  solarPanels: [],
  batteries: [],
  upgrades: [],
  inventory: GAME_CONFIG.powerHub.initialInventory,
  maxSlots: GAME_CONFIG.powerHub.maxSlots,
  unlockedSlots: GAME_CONFIG.powerHub.initialUnlockedSlots,

  dailyGoal: 80,
  currentProgress: 0,
  research: createInitialResearch(),
});

const touch = () => ({ lastUpdatedAt: new Date().toISOString() });

const normalizePersistedState = (state) => {
  const currentScreen = VALID_SCREENS.has(state.currentScreen)
    ? state.currentScreen
    : 'how_to';

  if (state.hasStartedGame && state.selectedCity && ONBOARDING_SCREENS.has(currentScreen)) {
    return {
      ...state,
      currentScreen: 'dashboard',
    };
  }

  if (!state.hasStartedGame && !state.selectedCity && !ONBOARDING_SCREENS.has(currentScreen)) {
    return {
      ...state,
      currentScreen: 'how_to',
    };
  }

  return {
    ...state,
    currentScreen,
  };
};

const persistedStateKeys = [
  'currentScreen',
  'hasStartedGame',
  'selectedCity',
  'startedAt',
  'lastUpdatedAt',
  'energy',
  'coins',
  'level',
  'experience',
  'solarPanels',
  'batteries',
  'upgrades',
  'inventory',
  'maxSlots',
  'unlockedSlots',
  'dailyGoal',
  'currentProgress',
  'research',
];

const pickPersistedState = (state) =>
  persistedStateKeys.reduce((persistedState, key) => {
    persistedState[key] = state[key];
    return persistedState;
  }, {});

const useGameStore = create(
  persist(
    (set) => ({
      ...createInitialGameState(),

      setScreen: (screen) =>
        set((state) => {
          if (!VALID_SCREENS.has(screen)) return {};
          if (state.hasStartedGame && state.selectedCity && ONBOARDING_SCREENS.has(screen)) {
            return { currentScreen: 'dashboard', ...touch() };
          }
          return { currentScreen: screen, ...touch() };
        }),

      setSelectedCity: (city) =>
        set({
          selectedCity: city,
          ...touch(),
        }),

      startGame: (city) =>
        set((state) => {
          const selectedCity = city || state.selectedCity;
          if (!selectedCity) return {};

          const now = new Date().toISOString();

          return {
            selectedCity,
            hasStartedGame: true,
            currentScreen: 'dashboard',
            startedAt: state.startedAt || now,
            lastUpdatedAt: now,
          };
        }),

      addEnergy: (amount) =>
        set((state) => ({
          energy: state.energy + amount,
          ...touch(),
        })),
      consumeEnergy: (amount) =>
        set((state) => ({
          energy: Math.max(0, state.energy - amount),
          ...touch(),
        })),

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
          const newExp = state.experience + amount;
          const expNeeded = state.level * 100;

          if (newExp >= expNeeded) {
            return {
              experience: newExp - expNeeded,
              level: state.level + 1,
              ...touch(),
            };
          }

          return {
            experience: newExp,
            ...touch(),
          };
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
        set((state) => ({
          research: {
            ...state.research,
            [researchKey]: true,
          },
          ...touch(),
        })),

      resetGame: () => set(createInitialGameState()),
    }),
    {
      name: GAME_STORAGE_KEY,
      version: GAME_STORE_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: pickPersistedState,
      merge: (persistedState, currentState) =>
        normalizePersistedState({
          ...currentState,
          ...(persistedState || {}),
          research: {
            ...createInitialResearch(),
            ...(persistedState?.research || {}),
          },
        }),
    },
  ),
);

export default useGameStore;
