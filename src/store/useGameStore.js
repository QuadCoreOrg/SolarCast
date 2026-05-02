import { GAME_CONFIG } from '../constants/gameConfig';
import { LEVELS_CONFIG } from '../constants/levelsConfig';
import citiesData from '../data/cities.json';
import { fetchLiveWeatherData } from '../services/weatherApi';
import { generateDailyEnergyPrices } from '../services/energyMarketApi';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useGameStore = create(
  persist(
    (set, get) => ({
      energy: GAME_CONFIG.INITIAL_ENERGY,
  coins: GAME_CONFIG.INITIAL_COINS,
  level: GAME_CONFIG.INITIAL_LEVEL,
  experience: 0,

  solarPanels: [],
  batteries: [],
  upgrades: [],

  dailyGoal: GAME_CONFIG.BASE_DAILY_GOAL,
  currentProgress: 0,

  timeIndex: 0,
  isGameOver: false,
  selectedCityName: 'Adana', // Varsayılan şehir
  cityInventories: {}, // Diğer şehirlerdeki GES'leri dondurup saklamak için
  liveWeatherData: [], // Canlı API verisi
  isFetchingWeather: false,
  dailyMarketData: { prices: [], marketTrend: 1.0, trendName: 'Durgun (Normal)', trendColor: 'text-slate-500' }, // Dinamik Borsa

  money: GAME_CONFIG.INITIAL_MONEY,
  panel: GAME_CONFIG.INITIAL_PANELS,
  battery: GAME_CONFIG.INITIAL_BATTERIES,
  batteryHealth: 100, // Batarya sağlığı %100

  fetchWeatherForCity: async (city) => {
    set({ isFetchingWeather: true });
    const data = await fetchLiveWeatherData(city.enlem, city.boylam);
    if (data) {
      set({ liveWeatherData: data, isFetchingWeather: false });
    } else {
      set({ isFetchingWeather: false });
    }
  },

  setSelectedCity: (cityName) => {
    set((state) => {
      // Eğer aynı şehri seçtiyse bir şey yapma
      if (state.selectedCityName === cityName) return state;

      // 1. Mevcut şehrin durumunu cityInventories içine kaydet
      const currentCity = state.selectedCityName;
      const updatedInventories = {
        ...state.cityInventories,
        [currentCity]: {
          panel: state.panel,
          battery: state.battery,
          batteryHealth: state.batteryHealth,
          energy: state.energy
        }
      };

      // 2. Yeni şehrin durumunu yükle (Yoksa sıfırdan başlat)
      const newInventory = updatedInventories[cityName] || { 
        panel: 0, 
        battery: 0, 
        batteryHealth: 100, 
        energy: 0 
      };

      return {
        selectedCityName: cityName,
        cityInventories: updatedInventories,
        panel: newInventory.panel,
        battery: newInventory.battery,
        batteryHealth: newInventory.batteryHealth,
        energy: newInventory.energy
      };
    });

    const city = citiesData.find(c => c.il === cityName);
    if (city) {
      get().fetchWeatherForCity(city);
    }
  },

  sellEnergy: () => set((state) => {
    if (state.energy <= 0) return state;
    
    // Canlı veri yoksa satma
    if (!state.liveWeatherData || state.liveWeatherData.length === 0) return state;
    if (!state.dailyMarketData.prices.length) return state;
    
    const currentData = state.liveWeatherData[state.timeIndex % state.liveWeatherData.length];
    const currentPrice = state.dailyMarketData.prices[currentData.hour_of_day] || 1.2;
    
    const energySold = state.energy;
    const moneyEarned = energySold * currentPrice;
    
    // XP Hesaplama (Satılan her 1 enerji = 1 XP)
    let newExp = state.experience + Math.floor(energySold);
    let newLevel = state.level;
    let expNeeded = newLevel * LEVELS_CONFIG.BASE_XP_REQUIREMENT;
    
    while (newExp >= expNeeded) {
      newExp -= expNeeded;
      newLevel += 1;
      expNeeded = newLevel * LEVELS_CONFIG.BASE_XP_REQUIREMENT;
    }

    const newMoney = state.money + moneyEarned;
    const stillBankrupt = newMoney < 0;

    return {
      money: newMoney,
      energy: 0,
      experience: newExp,
      level: newLevel,
      isGameOver: stillBankrupt ? state.isGameOver : false
    };
  }),

  addEnergy: (amount) => set((state) => {
    const maxEnergy = GAME_CONFIG.BASE_MAX_ENERGY + (state.battery * GAME_CONFIG.BATTERY_CAPACITY_BONUS);
    return { energy: Math.min(maxEnergy, state.energy + amount) };
  }),
  consumeEnergy: (amount) => set((state) => ({ energy: Math.max(0, state.energy - amount) })),
  
  addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
  spendCoins: (amount) => set((state) => ({ coins: Math.max(0, state.coins - amount) })),

  addExperience: (amount) => set((state) => {
    const newExp = state.experience + amount;
    const expNeeded = state.level * LEVELS_CONFIG.BASE_XP_REQUIREMENT;
    if (newExp >= expNeeded) {
      return { experience: newExp - expNeeded, level: state.level + 1 };
    }
    return { experience: newExp };
  }),

  setDailyGoal: (goal) => set({ dailyGoal: goal }),
  updateProgress: (progress) => set({ currentProgress: progress }),

  addSolarPanel: (panel) => set((state) => ({
    solarPanels: [...state.solarPanels, panel]
  })),

  addBattery: (battery) => set((state) => ({
    batteries: [...state.batteries, battery]
  })),

  addUpgrade: (upgrade) => set((state) => ({
    upgrades: [...state.upgrades, upgrade]
  })),

  repairBatteries: () => set((state) => {
    if (state.battery <= 0 || state.batteryHealth >= 100) return state;
    
    const lostHealth = 100 - state.batteryHealth;
    // Maliyet = Batarya Sayısı * Temel Maliyet * Kayıp Oranı
    const repairCost = state.battery * GAME_CONFIG.BATTERY_REPAIR_COST_PER_UNIT * (lostHealth / 100);
    
    if (state.money >= repairCost) {
      return {
        batteryHealth: 100,
        money: state.money - repairCost
      };
    }
    return state;
  }),

  resetGame: () => set({
    energy: GAME_CONFIG.INITIAL_ENERGY,
    coins: GAME_CONFIG.INITIAL_COINS,
    money: GAME_CONFIG.INITIAL_MONEY,
    panel: GAME_CONFIG.INITIAL_PANELS,
    battery: GAME_CONFIG.INITIAL_BATTERIES,
    batteryHealth: 100,
    timeIndex: 0,
    isGameOver: false,
    level: GAME_CONFIG.INITIAL_LEVEL,
    experience: 0,
    solarPanels: [],
    batteries: [],
    upgrades: [],
    currentProgress: 0,
    cityInventories: {} // İflas edince tüm şehirler sıfırlanır
  }),

  tick: () => set((state) => {
    if (state.isGameOver) return state;
    if (!state.liveWeatherData || state.liveWeatherData.length === 0) return state; // Veri yüklenmeden dönme

    let newMarketData = state.dailyMarketData;
    // Her yeni günde (24 saatte bir) VEYA borsa verisi hiç yoksa piyasayı güncelle
    if (state.timeIndex % 24 === 0 || !newMarketData.prices.length) {
      newMarketData = generateDailyEnergyPrices();
    }

    // Batarya Yıpranması
    const newBatteryHealth = state.battery > 0 
      ? Math.max(10, state.batteryHealth - GAME_CONFIG.BATTERY_DEGRADATION_RATE) 
      : 100;

    // Maksimum enerji batarya sağlığına göre düşer
    const maxEnergy = GAME_CONFIG.BASE_MAX_ENERGY + (state.battery * GAME_CONFIG.BATTERY_CAPACITY_BONUS * (newBatteryHealth / 100));
    
    const dataIndex = state.timeIndex % state.liveWeatherData.length;
    const currentData = state.liveWeatherData[dataIndex];

    // Gerçek API'den gelen üretim baz değeri
    const sunPower = currentData.sun_power_w_m2;
    let baseProduction = (sunPower / 10);

    // Şehre özel hava durumu ve enlem algoritması
    const city = citiesData.find(c => c.il === state.selectedCityName);
    let cityMultiplier = 1;
    
    if (city) {
      // API'den gelen canlı hava kodu (weathercode)
      const code = currentData.weathercode;
      let weatherMod = 1.0;
      if (code === 0 || code === 1) weatherMod = 1.2; // Açık/Güneşli (+%20)
      else if (code === 2) weatherMod = 0.9; // Parçalı Bulutlu (-%10)
      else if (code === 3) weatherMod = 0.7; // Bulutlu (-%30)
      else if (code >= 50 && code < 70) weatherMod = 0.4; // Yağmur (-%60)
      else if (code >= 70 && code < 90) weatherMod = 0.2; // Kar (-%80)
      else if (code >= 90) weatherMod = 0.1; // Fırtına (-%90)

      // Enlem çarpanı (Ekvatora/Güneye yakınlık verimi artırır)
      // Örn: Sinop (42 enlem) = 1.0 çarpan, Antalya (36 enlem) = ~1.12 çarpan
      const latMod = 1 + ((42 - city.enlem) * 0.02);

      cityMultiplier = weatherMod * latMod;
    }

    const generatedEnergy = state.panel * baseProduction * cityMultiplier;
    
    // Enerji Kaçağı (Bataryalar %100 verimli değil)
    const energyAfterLeak = state.energy * (1 - GAME_CONFIG.ENERGY_LEAKAGE_RATE);
    const newEnergy = Math.min(maxEnergy, energyAfterLeak + generatedEnergy);

    // Bakım Masrafları (İşletme Gideri)
    const maintenanceCost = (state.panel * GAME_CONFIG.MAINTENANCE_COST_PANEL) + (state.battery * GAME_CONFIG.MAINTENANCE_COST_BATTERY);
    const newMoney = state.money - maintenanceCost;

    // İflas Kontrolü
    if (newMoney < 0) {
      return { isGameOver: true, money: newMoney };
    }

    return { 
      timeIndex: state.timeIndex + 1,
      energy: newEnergy,
      money: newMoney,
      batteryHealth: newBatteryHealth,
      dailyMarketData: newMarketData
    };
  })
    }),
    {
      name: 'solarcast-storage', // localStorage key name
    }
  )
);

export default useGameStore;