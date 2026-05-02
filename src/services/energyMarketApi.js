export const generateDailyEnergyPrices = () => {
  // Piyasada günlük genel bir trend belirle (0.7 Bear Market ile 1.6 Bull Market arası)
  // Bu trend tüm günün fiyatlarını etkiler.
  const marketTrend = 0.7 + (Math.random() * 0.9);
  let trendName = "Durgun (Normal)";
  let trendColor = "text-slate-500";
  
  if (marketTrend >= 1.3) {
    trendName = "Boğa Piyasası (Yüksek Fiyatlar 🚀)";
    trendColor = "text-green-500";
  } else if (marketTrend <= 0.9) {
    trendName = "Ayı Piyasası (Düşük Fiyatlar 📉)";
    trendColor = "text-red-500";
  }

  const prices = [];
  
  for (let hour = 0; hour < 24; hour++) {
    let basePrice = 1.0;

    // Gerçek dünya tüketim eğrisi simülasyonu
    if (hour >= 0 && hour <= 6) {
      // Gece herkes uyuyor, sanayi kapalı, elektrik ucuz
      basePrice = 1.0 + (Math.random() * 0.5);
    } else if (hour >= 7 && hour <= 16) {
      // Gündüz sanayi ve iş yerleri çalışıyor
      basePrice = 3.0 + (Math.random() * 1.0);
    } else if (hour >= 17 && hour <= 21) {
      // Akşam puant saati (Eve dönüş, tüm ışıklar ve aletler açık)
      basePrice = 5.0 + (Math.random() * 2.0);
    } else {
      // Gece yarısına doğru düşüş
      basePrice = 2.0 + (Math.random() * 1.0);
    }

    // Trend ve saatlik dalgalanma uygulanır
    const finalPrice = parseFloat((basePrice * marketTrend).toFixed(2));
    prices.push(finalPrice);
  }

  return { prices, marketTrend, trendName, trendColor };
};
