# 🤖 AI Master Prompt: GES Simülatörü (Enerji Karar-Destek)

**Görev:** Güneş Enerjisi Karar-Destek Simülatörü için yüksek performanslı, **çok sayfalı (multi-page routing içeren)** bir React (Vite) uygulaması geliştir. Kullanıcı arayüzü (UI) kesinlikle **"Çizgi Film Vari Retro-Fütüristik" (Cartoon Retro-Futurism)** veya **Neo-Brütalist** tasarım diline uymalıdır. Standart Material UI veya Bootstrap stilleri KESİNLİKLE KULLANILMAYACAK.

---

## 🛠️ 1. Teknoloji Yığını ve Kurulum (Tech Stack)

Yapay zeka, lütfen aşağıdaki teknolojileri kullanarak projeyi inşa et:

*   **Çatı (Framework):** React (Vite) + TypeScript
*   **Yönlendirme (Routing):** `react-router-dom` (Çok sayfalı yapı için)
*   **Stil (Styling):** Tailwind CSS
*   **Durum Yönetimi (State Management):** Zustand (Bütçe, batarya, saat ve kullanıcı verilerini sayfalar arası taşımak için)
*   **Animasyonlar:** Framer Motion (Sayfa geçişleri ve çizgi film hissiyatı için)
*   **İkonlar:** Lucide React (Kalın ve dolgun görünecek şekilde özelleştirilmiş)
*   **Grafikler:** Recharts (Eski bilgisayar terminali tarzında)

---

## 🏗️ 2. Çok Sayfalı Mimari (Multi-Page Architecture)

Uygulamayı `react-router-dom` kullanarak aşağıdaki sayfa (route) yapısında inşa et:

### 🏠 `/` (Ana Sayfa - Landing Page)
*   **İşlev:** Kullanıcıyı karşılayan, oyunun amacını anlatan giriş sayfası.
*   **Görsel:** Devasa, neo-brütalist bir "SİMÜLASYONU BAŞLAT" butonu. Arka planda dönen retro-fütüristik güneş paneli ve bulut animasyonları.
*   **Yönlendirme:** Butona tıklayınca `/oyun` sayfasına yönlendirir.

### 🎮 `/oyun` (Simülasyon/Oyun Sayfası)
*   **İşlev:** Asıl 24 saatlik döngünün ve karar mekanizmasının işlediği sayfa (Sat / Depola / Kullan).
*   **Bileşenler:** 
    *   `HourCard`: O anki saatin verilerini (üretim, fiyat) ve aksiyon butonlarını içerir.
    *   `StatusPanels`: Batarya doluluk oranı ve anlık bütçe göstergeleri.
    *   `AiAdvisorBubble`: Kullanıcı yanlış karar verdiğinde uyarı veren yapay zeka danışmanı. Sadece bu sayfada çalışır.

### 📊 `/dashboard` (İstatistik ve Performans Sayfası)
*   **İşlev:** Kullanıcının geçmiş oyunlarındaki genel kâr/zarar oranını, AI'dan aldığı uyarı sayısını ve skorunu gördüğü analiz ekranı.
*   **Görsel:** `Recharts` kullanılarak eski terminal ekranlarına benzeyen grafikler.

---

## 🎨 3. Tasarım Dili Kuralları (KESİN KURALLAR)

**(DİKKAT: Projedeki tüm sayfalarda ve bileşenlerde bu kurallara harfiyen uyulmalıdır.)**

1.  **Kenarlıklar:** Tüm etkileşimli elemanların (kartlar, butonlar, paneller) kalın, kesintisiz siyah bir çerçevesi **olmak zorunda** (`border-2 border-black` veya `border-4 border-black`). Köşeler hafif yuvarlatılmış olmalı (`rounded-xl`).
2.  **Gölgeler:** Asla yumuşak geçişli (soft) gölge kullanma. **Sert 2D gölgeler** (Neo-brütalizm tarzı) kullan. Örnek: `shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`. Hover (üzerine gelme) durumunda buton basılıyormuş gibi bu gölge kaybolmalı.
3.  **Renk Paleti (Yüksek Kontrast):**
    *   **Arka Plan:** Kırık beyaz / Açık bej (`#FDF6E3`)
    *   **Ana Renk (Güneş/Enerji):** Parlak Sarı (`#FFD700`)
    *   **İkincil Renk (Batarya):** Retro Camgöbeği (`#00CED1`)
    *   **Vurgu (Satış/Kâr):** Neon Yeşil (`#32CD32`)
    *   **Uyarı/Zarar:** Parlak Turuncu / Kırmızı (`#FF4500`)
    *   **Metin/Kenarlık:** Tam Siyah (`#000000`)
4.  **Tipografi:** Başlıklarda kalın retro-fütüristik bir font (Örn: `Poppins` Black/800), verilerde temiz bir monospace font (Örn: `Space Mono`). BÜYÜK HARF kullanımı zorunlu.
5.  **Animasyonlar:** Elemanlar ekrana gelirken yaylanarak gelmeli (`Framer Motion`, `type: "spring"`). Sayfa geçişlerinde "sağa kayarak gelme" efektleri kullanılmalı.

---

## 🚀 4. Uygulama Planı (Step-by-Step Execution)

Lütfen projeyi şu adımları izleyerek oluştur:

1.  **Adım 1:** Vite, React-Router-Dom, Tailwind CSS, Zustand, Framer Motion ve Lucide-React paketlerini kur. Tailwind yapılandırmasını (renkler ve sert gölgeler) ayarla.
2.  **Adım 2:** Sayfalar arası global verileri (saat, toplam kâr, batarya seviyesi, geçmiş hamleler) tutmak için Zustand mağazasını (`store/useGameStore.ts`) oluştur.
3.  **Adım 3:** `App.tsx` içinde `react-router-dom` ile Ana Sayfa (`/`), Oyun (`/oyun`) ve Dashboard (`/dashboard`) yönlendirmelerini (routes) ayarla. Framer Motion ile sayfa geçiş animasyonlarını ekle.
4.  **Adım 4:** Neo-brütalist tasarım kurallarına uyarak UI bileşenlerini (Header, Butonlar, Kartlar) oluştur.
5.  **Adım 5:** Oyun içi döngüyü (saat ilerlemesi), Yapay Zeka danışman tetikleyicilerini ve optimizasyon mantığını (Sat/Depola/Kullan) `/oyun` sayfasına entegre et.
