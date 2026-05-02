import { create } from 'zustand';

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
  inventory: [
    { id: 'panel-ultra-1', type: 'panel', name: 'Ultra Panel', outputPerSec: 15 },
    { id: 'panel-standard-1', type: 'panel', name: 'Standart Panel', outputPerSec: 9 },
    { id: 'battery-mega-1', type: 'battery', name: 'Mega Batarya', chargePct: 100 },
  ],
  maxSlots: 6,

  dailyGoal: 80,
  currentProgress: 0,
  selectedCity: '',

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

  resetGame: () => set({
    energy: 100,
    coins: 0,
    level: 1,
    experience: 0,
    solarPanels: [],
    batteries: [],
    upgrades: [],
    currentProgress: 0,
    selectedCity: ''
  })
}));

export default useGameStore;