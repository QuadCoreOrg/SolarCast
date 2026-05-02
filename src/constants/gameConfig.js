export const GAME_CONFIG = {
  TICK_RATE_MS: 1000,       // Normalde 1 saniye. Test için bunu değiştirebilirsiniz (örn. 50).
  MAX_TIME_INDEX: 71,       // 72 saatlik (3 günlük) oyun döngüsü
  
  // Başlangıç Değerleri
  INITIAL_MONEY: 50,
  INITIAL_ENERGY: 0,
  INITIAL_COINS: 0,
  INITIAL_PANELS: 1,
  INITIAL_BATTERIES: 0,
  INITIAL_LEVEL: 1,
  
  // Giderler ve Gerçekçilik
  MAINTENANCE_COST_PANEL: 0.5, // Saatlik panel bakım masrafı
  MAINTENANCE_COST_BATTERY: 1.0, // Saatlik batarya bakım masrafı
  ENERGY_LEAKAGE_RATE: 0.02, // Depolanan enerjinin saatlik %2'si kaybolur (ısınma vb.)
  BATTERY_DEGRADATION_RATE: 0.5, // Her saat batarya sağlığı %0.5 düşer
  BATTERY_REPAIR_COST_PER_UNIT: 50, // 1 Bataryayı %0'dan %100'e tamir etmenin temel maliyeti

  // Kapasite ve Üretim
  BASE_MAX_ENERGY: 50,
  BATTERY_CAPACITY_BONUS: 100, // Her batarya +100 kapasite
  
  // Fiyatlandırma
  BASE_PANEL_PRICE: 100,
  BASE_BATTERY_PRICE: 150,
  PRICE_MULTIPLIER: 1.15, // Her alımda fiyat %15 artar
  
  // Günlük hedefler ve sınırlar
  BASE_DAILY_GOAL: 80,
};
