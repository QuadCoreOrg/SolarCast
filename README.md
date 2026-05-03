# SolarCast

**[CodeXEnergy](https://duhackathon.com)** — DÜ Hackathon kapsamında geliştirilen enerji temalı bir web deneyimi.

SolarCast, güneş enerjisi üretimini oyunlaştırılmış bir simülasyonda keşfetmenizi sağlar: şehir seçimi, hava ve güneş radyasyonu verileriyle günlük üretim, panel ve batarya yönetimi, spot fiyat benzeri enerji satışı, günlük görevler ve **Cast AI** (Google Gemini) ile enerji odaklı öneriler.

## Sunum (Drive)


|                  |                                                                                                                                                         |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Google Drive** | *[https://drive.google.com/drive/folders/13OJiq-1Lid-icB1FzPCgicxxy9oHGZRs](https://drive.google.com/drive/folders/13OJiq-1Lid-icB1FzPCgicxxy9oHGZRs)* |


## Özellikler

- **Landing:** Ürün tanıtımı, problem/çözüm ve özellik özetleri (`/`)
- **Oyun akışı** (`/play`): Şehir seçimi, kontrol paneli, pazar, güç merkezi, depolama, keşif ve ayarlar
- **Gerçekçi bağlam:** Open-Meteo tabanlı hava ve güneş radyasyonu ile günlük üretim ve özetler
- **Ekonomi:** Enerji satışı, seviye ve coin sistemi, günlük görevler
- **Cast AI:** Gemini API ile yerel geliştirmede AI önerileri (API anahtarı gerekir)

## Teknolojiler

- React 19, Vite 8, React Router 7  
- Zustand (durum), Framer Motion (animasyon)  
- Tailwind CSS 4  
- `@google/genai` (Gemini), Axios, `react-simple-maps`  
- Lucide React ikonları

## Kurulum

```bash
npm install
```

### Ortam değişkenleri

`.env.example` dosyasını kopyalayıp `.env.local` oluşturun:

```bash
cp .env.example .env.local
```

`VITE_GEMINI_API_KEY` alanına [Google AI Studio](https://aistudio.google.com/apikey) üzerinden aldığınız anahtarı yazın. Anahtar istemci paketine gömülür; üretimde güvenlik için ara sunucu kullanmayı değerlendirin.

## Çalıştırma

```bash
npm run dev
```

Varsayılan olarak Vite geliştirme sunucusu (genelde `http://localhost:5173`) açılır.

## Diğer komutlar


| Komut             | Açıklama                                            |
| ----------------- | --------------------------------------------------- |
| `npm run build`   | Üretim derlemesi (`dist/`)                          |
| `npm run preview` | Derlemeyi yerelde önizleme                          |
| `npm run deploy`  | `gh-pages` ile `dist` yayını (yapılandırmaya bağlı) |
| `npm run lint`    | ESLint                                              |


## Lisans

MIT

---

*CodeXEnergy · Duhackathon — SolarCast*