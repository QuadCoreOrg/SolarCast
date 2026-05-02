import { create } from 'zustand';
import GAME_CONFIG from '../config/gameConfig';

const useGameStore = create((set) => ({
  currentScreen: 'how_to',
  setScreen: (screen) => set({ currentScreen: screen }),

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
  selectedCity: '',
  research: {
    temperedThermalGlass: false,
    enrichedWafer: false,
    processedCobalt: false,
    superconductivePolymer: false,
  },

  addEnergy: (amount) => set((state) => ({ energy: state.energy + amount })),
  consumeEnergy: (amount) => set((state) => ({ energy: Math.max(0, state.energy - amount) })),
  
  addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
  spendCoins: (amount) => set((state) => ({ coins: Math.max(0, state.coins - amount) })),

  addExperience: (amount) => set((state) => {
    const newExp = state.experience + amount;
    const expNeeded = state.level * 100;
    if (newExp >= expNeeded) {
      return { experience: newExp - expNeeded, level: state.level + 1 };
    }
    return { experience: newExp };
  }),

  setDailyGoal: (goal) => set({ dailyGoal: goal }),
  updateProgress: (progress) => set({ currentProgress: progress }),
  setSelectedCity: (city) => set({ selectedCity: city }),

  addSolarPanel: (panel) => set((state) => ({
    solarPanels: [...state.solarPanels, panel]
  })),

  addBattery: (battery) => set((state) => ({
    batteries: [...state.batteries, battery]
  })),

  addUpgrade: (upgrade) => set((state) => ({
    upgrades: [...state.upgrades, upgrade]
  })),
  unlockResearch: (researchKey) =>
    set((state) => ({
      research: {
        ...state.research,
        [researchKey]: true,
      },
    })),

  resetGame: () => set({
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
    currentProgress: 0,
    selectedCity: '',
    research: {
      temperedThermalGlass: false,
      enrichedWafer: false,
      processedCobalt: false,
      superconductivePolymer: false,
    },
  })
}));

export default useGameStore;