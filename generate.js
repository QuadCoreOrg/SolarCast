import fs from 'fs';

const regions = {
  high: {
    cities: ["Adana", "Antalya", "Burdur", "Hatay", "Isparta", "Kahramanmaraş", "Mersin", "Osmaniye", "Adıyaman", "Batman", "Diyarbakır", "Gaziantep", "Kilis", "Mardin", "Siirt", "Şanlıurfa", "Şırnak"],
    sun: [8.5, 10.5], eff: [80, 85], cost: [2500, 3000], tier: "High Solar"
  },
  good: {
    cities: ["Afyonkarahisar", "Aksaray", "Ankara", "Çankırı", "Eskişehir", "Karaman", "Kayseri", "Kırıkkale", "Kırşehir", "Konya", "Nevşehir", "Niğde", "Sivas", "Yozgat", "Aydın", "Denizli", "İzmir", "Kütahya", "Manisa", "Muğla", "Uşak"],
    sun: [7.0, 8.5], eff: [85, 90], cost: [1800, 2400], tier: "Good Solar"
  },
  medium: {
    cities: ["Balıkesir", "Bilecik", "Bursa", "Çanakkale", "Edirne", "İstanbul", "Kırklareli", "Kocaeli", "Sakarya", "Tekirdağ", "Yalova", "Ağrı", "Ardahan", "Bingöl", "Bitlis", "Elazığ", "Erzincan", "Erzurum", "Hakkari", "Iğdır", "Kars", "Malatya", "Muş", "Tunceli", "Van"],
    sun: [5.5, 7.0], eff: [90, 95], cost: [1200, 1800], tier: "Medium Solar"
  },
  low: {
    cities: ["Amasya", "Artvin", "Bartın", "Bayburt", "Bolu", "Çorum", "Düzce", "Giresun", "Gümüşhane", "Karabük", "Kastamonu", "Ordu", "Rize", "Samsun", "Sinop", "Tokat", "Trabzon", "Zonguldak"],
    sun: [3.5, 5.5], eff: [95, 98], cost: [800, 1200], tier: "Low Solar"
  }
};

const randomInRange = (min, max, isFloat = false) => {
  const val = Math.random() * (max - min) + min;
  return isFloat ? val.toFixed(1) : Math.floor(val);
};

const profiles = [];
for (const [key, data] of Object.entries(regions)) {
  for (const city of data.cities) {
    profiles.push({
      il: city,
      sunHours: `${randomInRange(data.sun[0], data.sun[1], true)}h`,
      efficiency: `${randomInRange(data.eff[0], data.eff[1])}%`,
      setupCost: randomInRange(data.cost[0], data.cost[1]),
      tier: data.tier
    });
  }
}

// Alfabetik sıralama
profiles.sort((a, b) => a.il.localeCompare(b.il, 'tr'));

fs.writeFileSync('src/data/city_profiles.json', JSON.stringify(profiles, null, 2));
console.log("city_profiles.json başarıyla oluşturuldu!");
