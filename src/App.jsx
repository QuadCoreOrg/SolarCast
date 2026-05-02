import React from "react";
import useGameStore from "./store/useGameStore";
import { motion } from "framer-motion";
import StatCard from "./components/StatCard";
import InventoryItem from "./components/InventoryItem";
import ToastContainer from "./components/ToastContainer";
import useToastStore from "./hooks/useToast";
import useGameLoop from "./hooks/useGameLoop";
import { GAME_CONFIG } from "./constants/gameConfig";
import citiesData from "./data/cities.json";
import cityProfiles from "./data/city_profiles.json";
import { Sun, Coins, Zap, Star, Battery, DollarSign, Clock, MapPin, CloudRain, Sun as SunIcon, Cloud, TrendingUp } from "lucide-react";

function App() {
  const { 
    energy, level, experience,
    sellEnergy,
    selectedCityName, setSelectedCity,
    money, panel, battery, timeIndex, isGameOver, resetGame,
    liveWeatherData, isFetchingWeather, dailyMarketData,
    batteryHealth, repairBatteries
  } = useGameStore();

  useGameLoop();

  const { addToast } = useToastStore();

  React.useEffect(() => {
    // Component yüklendiğinde eğer veri yoksa çek
    if (!liveWeatherData || liveWeatherData.length === 0) {
      setSelectedCity(selectedCityName);
    }
  }, []);

  if (isFetchingWeather || !liveWeatherData || liveWeatherData.length === 0) {
    return (
      <div className="min-h-screen bg-pure-white flex flex-col items-center justify-center font-bold text-2xl text-slate-800">
        <Sun className="w-16 h-16 animate-spin text-sunny-yellow mb-4" />
        Canlı Hava Durumu Yükleniyor...
      </div>
    );
  }

  const currentData = liveWeatherData[timeIndex % liveWeatherData.length];
  
  // Eğer borsa fiyatları henüz yüklenmediyse güvenli değer ata
  const currentPrice = dailyMarketData.prices[currentData.hour_of_day] || 1.2;
  
  const currentSunPower = currentData.sun_power_w_m2;

  const cityData = citiesData.find(c => c.il === selectedCityName);
  let cityMultiplier = 1;
  if (cityData) {
    const code = currentData.weathercode; // API'den gelen canlı kod
    let weatherMod = 1.0;
    if (code === 0 || code === 1) weatherMod = 1.2;
    else if (code === 2) weatherMod = 0.9;
    else if (code === 3) weatherMod = 0.7;
    else if (code >= 50 && code < 70) weatherMod = 0.4;
    else if (code >= 70 && code < 90) weatherMod = 0.2;
    else if (code >= 90) weatherMod = 0.1;
    const latMod = 1 + ((42 - cityData.enlem) * 0.02);
    cityMultiplier = weatherMod * latMod;
  }

  const currentProductionPerPanel = ((currentSunPower / 10) * cityMultiplier).toFixed(1);

  const maxEnergy = GAME_CONFIG.BASE_MAX_ENERGY + (battery * GAME_CONFIG.BATTERY_CAPACITY_BONUS);
  const hourlyCost = (panel * GAME_CONFIG.MAINTENANCE_COST_PANEL) + (battery * GAME_CONFIG.MAINTENANCE_COST_BATTERY);

  // Fiyat Hesaplamaları (Tycoon mantığı: Aldıkça pahalanır)
  const panelPrice = Math.floor(GAME_CONFIG.BASE_PANEL_PRICE * Math.pow(GAME_CONFIG.PRICE_MULTIPLIER, panel - 1));
  const batteryPrice = Math.floor(GAME_CONFIG.BASE_BATTERY_PRICE * Math.pow(GAME_CONFIG.PRICE_MULTIPLIER, battery));
  
  const lostHealth = 100 - batteryHealth;
  const repairCost = battery * GAME_CONFIG.BATTERY_REPAIR_COST_PER_UNIT * (lostHealth / 100);

  // Buy actions
  const buyPanel = () => {
    if (money >= panelPrice) {
      useGameStore.setState({ money: money - panelPrice, panel: panel + 1 });
      addToast('Yeni panel alındı!', 'success', 3000, 'top-right');
    } else {
      addToast('Yetersiz Para!', 'error', 3000, 'top-right');
    }
  };

  const buyBattery = () => {
    if (money >= batteryPrice) {
      useGameStore.setState({ money: money - batteryPrice, battery: battery + 1 });
      addToast('Yeni batarya alındı!', 'success', 3000, 'top-right');
    } else {
      addToast('Yetersiz Para!', 'error', 3000, 'top-right');
    }
  };

  const handleSellEnergy = () => {
    if (energy > 0) {
      const earned = Math.floor(energy) * currentPrice;
      sellEnergy();
      addToast(`Enerji satıldı! +${earned.toFixed(1)} 🪙`, 'success', 2000, 'bottom-center');
    } else {
      addToast('Satılacak enerji yok!', 'warning', 2000, 'bottom-center');
    }
  };

  const handleRepair = () => {
    if (money >= repairCost) {
      repairBatteries();
      addToast('Bataryalar yenilendi!', 'success', 3000, 'top-right');
    } else {
      addToast('Yetersiz Para!', 'error', 3000, 'top-right');
    }
  };

  return (
    <div className="min-h-screen bg-pure-white font-['Nunito'] text-slate-900 p-6">
      <div className="max-w-md mx-auto space-y-6 pb-20">
        
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <motion.h1 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="text-4xl font-black text-center"
          >
            ☀️ SolarCast
          </motion.h1>
          <div className="bg-slate-800 text-white border-4 border-slate-900 rounded-2xl px-4 py-2 font-bold shadow-[4px_4px_0px_0px_#0f172a] flex flex-col items-center">
            <span className="text-xs text-slate-300">Gün: {Math.floor(timeIndex / 24) + 1}</span>
            <span className="text-[#FFD166] flex items-center gap-1"><Clock className="w-4 h-4"/> {currentData.time}</span>
          </div>
        </div>

        {/* CITY SELECTOR & WEATHER */}
        <div className="bg-white border-4 border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0px_0px_#0f172a] flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="font-bold flex items-center gap-2 text-slate-700">
              <MapPin className="w-5 h-5 text-red-500" /> Şehir Seçimi
            </span>
            <select 
              value={selectedCityName}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-slate-100 border-2 border-slate-900 rounded-lg px-2 py-1 font-bold text-slate-900 focus:outline-none"
            >
              {citiesData.map(c => <option key={c.il} value={c.il}>{c.il}</option>)}
            </select>
          </div>
          <div className="flex justify-between items-center bg-slate-50 border-2 border-slate-200 rounded-lg p-2">
            <div className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-blue-500"/>
              <span className="font-bold text-sm">Sıcaklık: {currentData.temperature}°C</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg text-slate-700">Güneş Şiddeti: {currentData.sun_power_w_m2} W/m²</span>
            </div>
          </div>
        </div>

        {/* CITY PROFILE CARD (Neo-Brutalist) */}
        {(() => {
          const profile = cityProfiles.find(p => p.il === selectedCityName);
          if (!profile) return null;
          
          let tierColor = "bg-slate-200 text-slate-800";
          if (profile.tier === "High Solar") tierColor = "bg-orange-400 text-white";
          else if (profile.tier === "Good Solar") tierColor = "bg-sunny-yellow text-slate-900";
          else if (profile.tier === "Medium Solar") tierColor = "bg-blue-400 text-white";
          else if (profile.tier === "Low Solar") tierColor = "bg-slate-400 text-white";

          return (
            <div className="bg-white border-4 border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0px_0px_#0f172a] flex flex-col gap-3">
              <div className="flex justify-between items-center mb-1">
                <span className="font-black text-xl uppercase">{profile.il} Profili</span>
                <span className={`px-2 py-1 rounded-md font-bold text-xs uppercase border-2 border-slate-900 ${tierColor}`}>
                  {profile.tier}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-slate-100 border-2 border-slate-900 p-2 rounded-lg flex flex-col">
                  <span className="text-slate-500 font-bold text-xs uppercase">Sun Hours/Day</span>
                  <span className="font-black text-lg">{profile.sunHours}</span>
                </div>
                <div className="bg-slate-100 border-2 border-slate-900 p-2 rounded-lg flex flex-col">
                  <span className="text-slate-500 font-bold text-xs uppercase">Efficiency</span>
                  <span className="font-black text-lg">{profile.efficiency}</span>
                </div>
                <div className="col-span-2 bg-slate-100 border-2 border-slate-900 p-2 rounded-lg flex justify-between items-center">
                  <span className="text-slate-500 font-bold text-xs uppercase">Est. Setup Cost</span>
                  <span className="font-black text-lg text-red-600">{profile.setupCost} 🪙</span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* TOP STATS */}
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-4">
            <StatCard icon={Coins} label="Para" value={money.toFixed(1)} color="yellow" />
            <StatCard icon={Zap} label="Enerji" value={`${Math.floor(energy)} / ${maxEnergy}`} color="mint" />
          </div>
          <div className="text-center text-sm font-bold text-red-500 bg-red-50 border-2 border-red-200 rounded-xl py-1">
            İşletme Gideri: -{hourlyCost.toFixed(1)} 🪙 / saat
          </div>
        </div>

        {/* LEVEL & XP */}
        <div className="bg-slate-100 border-4 border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0px_0px_#0f172a]">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold flex items-center gap-2"><Star className="w-5 h-5 text-sunny-yellow"/> Seviye {level}</span>
            <span className="font-bold text-slate-500">{experience} XP</span>
          </div>
          <div className="w-full h-4 bg-white border-2 border-slate-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-400"
              style={{ width: `${Math.min((experience / (level * 100)) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* MAIN ACTION */}
        <div className="flex flex-col gap-2 mt-4">
          <div className="bg-slate-100 border-4 border-slate-900 rounded-2xl p-3 shadow-[4px_4px_0px_0px_#0f172a] flex justify-between items-center">
            <span className="font-bold flex items-center gap-2 text-slate-700">
              <TrendingUp className="w-5 h-5 text-purple-600" /> Borsa Piyasası
            </span>
            <span className={`font-black ${dailyMarketData.trendColor}`}>
              {dailyMarketData.trendName}
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95, y: 4 }}
            onClick={handleSellEnergy}
            className="w-full bg-sunny-yellow border-4 border-slate-900 rounded-3xl font-black text-slate-900 px-6 py-8 shadow-[6px_6px_0px_0px_#0f172a] active:translate-y-2 active:shadow-none transition-all text-2xl flex flex-col items-center gap-2"
          >
            <DollarSign className="w-12 h-12" />
            <span>Enerjiyi Sat</span>
            <span className="text-sm font-bold opacity-75">Güncel Borsa Kuru: {currentPrice} 🪙/⚡</span>
          </motion.button>
        </div>
        
        {/* SHOP AREA */}
        <div className="border-t-4 border-slate-900 pt-6 mt-6">
          <h2 className="font-black text-2xl mb-4 flex items-center gap-2">🛒 Market</h2>
          <div className="flex flex-col gap-4">
            <InventoryItem 
              icon={Sun} 
              name="Güneş Paneli" 
              detail={`Mevcut: ${panel} (Şu an: +${currentProductionPerPanel}⚡/sn)`} 
              price={panelPrice}
              onBuy={buyPanel}
            />
            <InventoryItem 
              icon={Battery} 
              name="Batarya" 
              detail={`Mevcut: ${battery} (+${GAME_CONFIG.BATTERY_CAPACITY_BONUS} Kapasite)`} 
              price={batteryPrice}
              onBuy={buyBattery}
            />
            
            {/* BATTERY HEALTH UI */}
            {battery > 0 && (
              <div className={`border-2 rounded-xl p-3 flex justify-between items-center ${batteryHealth < 50 ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex flex-col">
                  <span className={`text-sm font-bold ${batteryHealth < 50 ? 'text-red-600' : 'text-slate-700'}`}>
                    Batarya Sağlığı: %{batteryHealth.toFixed(1)}
                  </span>
                  {batteryHealth < 100 && (
                    <span className="text-xs text-slate-500">Kapasite düşüyor...</span>
                  )}
                </div>
                <button 
                  onClick={handleRepair}
                  disabled={batteryHealth >= 100 || money < repairCost}
                  className={`font-bold px-4 py-2 rounded-lg transition-all ${
                    batteryHealth >= 100 
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                      : money < repairCost 
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-red-500 text-white hover:bg-red-600 active:scale-95'
                  }`}
                >
                  Yenile (-{repairCost.toFixed(1)} 🪙)
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
      <ToastContainer />

      {/* BANKRUPTCY MODAL */}
      {isGameOver && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        >
          <motion.div
            initial={{ scale: 0.5, y: 100 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 12, stiffness: 100 }}
            className="bg-red-600 border-4 border-slate-900 rounded-3xl p-8 max-w-sm w-full shadow-[8px_8px_0px_0px_#0f172a] flex flex-col items-center text-center gap-6"
          >
            <h2 className="font-black text-4xl text-white uppercase">İFLAS ETTİNİZ!</h2>
            <p className="text-white font-bold">Bakım masraflarını karşılayamadığınız için şirketiniz battı. (Kasa: {money.toFixed(1)} 🪙)</p>
            
            {energy > 0 ? (
              (money + (Math.floor(energy) * currentPrice)) >= 0 ? (
                <div className="bg-orange-500 border-4 border-slate-900 rounded-2xl p-4 w-full shadow-[4px_4px_0px_0px_#0f172a]">
                  <p className="text-white font-bold mb-3">Depoda satılmayı bekleyen {Math.floor(energy)} ⚡ var! Bunu satarsan { (Math.floor(energy) * currentPrice).toFixed(1) } 🪙 kazanıp şirketi kurtarabilirsin!</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      sellEnergy();
                      addToast('Şirketi kıl payı kurtardınız!', 'success', 3000, 'bottom-center');
                    }}
                    className="w-full bg-sunny-yellow border-4 border-slate-900 rounded-full font-black text-lg text-slate-900 py-3 shadow-[2px_2px_0px_0px_#0f172a] active:translate-y-1 active:shadow-none transition-all"
                  >
                    Acil Satış Yap & Kurtul
                  </motion.button>
                </div>
              ) : (
                <div className="bg-red-800 border-4 border-slate-900 rounded-2xl p-4 w-full shadow-[4px_4px_0px_0px_#0f172a]">
                  <p className="text-white font-bold mb-3">Depoda {Math.floor(energy)} ⚡ var ama satsan bile zararı kurtarmıyor... (+{ (Math.floor(energy) * currentPrice).toFixed(1) } 🪙 getirecek)</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={sellEnergy}
                    className="w-full bg-soft-peach border-4 border-slate-900 rounded-full font-black text-lg text-slate-900 py-3 shadow-[2px_2px_0px_0px_#0f172a] active:translate-y-1 active:shadow-none transition-all"
                  >
                    Yine de Sat (İflas devam eder)
                  </motion.button>
                </div>
              )
            ) : (
              <div className="bg-red-800 border-4 border-slate-900 rounded-2xl p-4 w-full shadow-[4px_4px_0px_0px_#0f172a]">
                <p className="text-white font-bold">Malesef depoda satacak hiç enerji kalmamış. Yapacak bir şey yok.</p>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={resetGame}
              className="mt-2 w-full bg-white border-4 border-slate-900 rounded-full font-black text-xl text-slate-900 py-4 shadow-[4px_4px_0px_0px_#0f172a] active:translate-y-1 active:shadow-none transition-all"
            >
              Şirketi Kapat / Baştan Başla
            </motion.button>
          </motion.div>
        </motion.div>
      )}

    </div>
  );
}

export default App;