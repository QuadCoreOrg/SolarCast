export const fetchLiveWeatherData = async (latitude, longitude) => {
  // Open-Meteo API (Ücretsiz ve API Key gerektirmez)
  // 3 günlük saatlik hava durumu ve güneş radyasyonu (W/m²) verisi çekiyoruz.
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weathercode,direct_radiation&timezone=auto&forecast_days=3`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    // Veriyi oyunun formatına dönüştür
    const formattedData = data.hourly.time.map((timeStr, index) => {
      return {
        time: new Date(timeStr).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        hour_of_day: new Date(timeStr).getHours(),
        temperature: data.hourly.temperature_2m[index],
        weathercode: data.hourly.weathercode[index],
        sun_power_w_m2: data.hourly.direct_radiation[index]
      };
    });
    
    return formattedData;
  } catch (error) {
    console.error("Hava durumu çekilemedi:", error);
    return null;
  }
};
