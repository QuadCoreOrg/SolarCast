# 🌞 SolarCast - Ürün Gereksinim Dokümanı (PRD)

## 1. Proje Özeti

**SolarCast**, güneş enerjisi sistemlerinin (GES) verimliliğini ve enerji piyasası dinamiklerini kullanıcılara eğlenceli bir şekilde öğreten, tarayıcı tabanlı gamified (oyunlaştırılmış) bir simülasyon web uygulamasıdır. Gerçek dünya verilerini (hava durumu ve elektrik fiyatları) kullanarak bir enerji yönetimi ("Tycoon") deneyimi sunar.

## 2. Temel Oyun Döngüsü ve Mekanikler

- **Şehir Seçimi:** Kullanıcı Türkiye haritasından bir şehir seçer. Şehrin gerçek güneşlenme potansiyeli oyunun zorluğunu/kazancını belirler.
- **Enerji Üretimi:** Open-Meteo API'den çekilen (ve hızlandırılmış zaman döngüsüne uyarlanan) hava durumuna göre paneller enerji üretir.
- **Depolama:** Üretilen enerji, kapasitesi sınırlı olan bataryalarda depolanır.
- **Ekonomi ve Satış:** Depolanan enerji, EPİAŞ verilerinden simüle edilen saatlik dinamik fiyatlara göre şebekeye satılarak altın/para (₺) kazanılır.
- **Gelişim (Upgrade):** Kazanılan parayla daha çok panel alınır veya batarya kapasitesi yükseltilir.

## 3. Tasarım Dili (Retro Pastel Neo-Brutalist)

- **Tipografi:** Nunito (Kalın ve okunaklı).
- **Renkler:** Soft Peach (Arka plan), Mint Green, Soft Orange, Sunny Yellow.
- **Şekiller:** Tamamen yuvarlatılmış köşeler (`rounded-full`, `rounded-3xl`).
- **Stil:** Kalın koyu kahve/siyah kenarlıklar (`border-4`) ve sert, bulanık olmayan 3D gölgeler (`shadow-[4px_4px_0px_0px_#2D2422]`).
- **Animasyonlar:** Framer Motion ile butonlarda "bouncy" (zıplama) efektleri ve pop-up bildirimler.

## 4. Teknik Altyapı ve Vibe Coding Akışı

Hackathon hızına uygun, ajan (Cursor/Claude Code vb.) yönlendirmeli geliştirme mimarisi:

- **Frontend:** React (Vite) + TypeScript
- **Stil:** Tailwind CSS
- **State Yönetimi:** Zustand (Para, enerji, panel sayısı, zaman döngüsü)
- **Animasyon:** Framer Motion
- **Ağ İstekleri:** Axios (Open-Meteo, EPİAŞ Mock)
- **İkonlar:** Lucide React

## 5. Takım Görev Dağılımı (8 Saatlik Hackathon Planı)

1.  **Kişi 1 (Veri & API):** Open-Meteo entegrasyonu, EPİAŞ fiyat simülasyonu, verilerin anlamlı katsayılara dönüştürülmesi.
2.  **Kişi 2 (UI & Animasyon):** Tasarım sisteminin kurulması, bileşenlerin (butonlar, barlar, kartlar) Tailwind ile kodlanması ve Framer Motion animasyonları.
3.  **Kişi 3 (Oyun Mantığı & State):** Zustand store kurulumu, `useGameLoop` hook'u ile zamanın akması, üretim/satış/satın alma hesaplamalarının kodlanması.

## 6. MVP (Minimum Viable Product) Hedefleri

- [ ] Şehir seçimi ekranı.
- [ ] Gerçek hava durumu verisine dayalı enerji dolum barı.
- [ ] Değişken fiyattan enerji satma butonu.
- [ ] Panel ve Batarya satın alma (upgrade) ekranı.
- [ ] Neo-Brutalist/Cartoonish arayüzün eksiksiz uygulanması.
