# SolarCast - UI Components Task List

Bu doküman, SolarCast projesinin ortak UI bileşenlerini `design-system.md` ve `game.md` kurallarına göre oluşturmak için hazırlanmış detaylı bir görev listesidir.

## 🧱 1. Faz: Temel Bileşenler (Atoms)

### 1. Button Component (`<Button />`)

- [x] `variant` prop'u alacak şekilde yapılandır (primary, secondary, icon).
- [x] **Primary:** `bg-sunny-yellow border-4 border-slate-900 rounded-full font-bold text-slate-900 px-6 py-3 shadow-[4px_4px_0px_0px_#0f172a] active:translate-y-1 active:shadow-none transition-all`
- [x] **Secondary:** `bg-mint-green` tabanlı, diğer kurallar primary ile aynı.
- [x] **Icon Button:** Sadece Lucide React ikonu barındıracak, tam yuvarlak (`p-3 rounded-full`) olacak.
- [ ] Tıklama hissiyatı için Framer Motion `whileTap={{ y: 4, boxShadow: "none" }}` (veya tailwind `active` classları) entegre edilecek.

### 2. Card Component (`<Card />`)

- [x] `variant` prop'u alacak (dashboard, accent).
- [x] **Dashboard:** `bg-white border-4 border-slate-900 rounded-3xl p-6 shadow-[6px_6px_0px_0px_#0f172a]`
- [x] **Accent:** `bg-soft-peach` tabanlı aynı tasarım.
- [x] İçerik render edebilmesi için `children` prop'u alacak.

### 3. Badge Component (`<Badge />`)

- [x] Level ve Başarım (Achievement) göstermek için ufak, hap şeklinde (pill-shaped) bileşen.
- [x] Sınıflar: `border-4 border-slate-900 rounded-full px-3 py-1 text-sm font-black text-slate-900`.
- [x] Arka plan rengi prop olarak geçilebilmeli (örn: `bg-sunny-yellow` veya `bg-mint-green`).

### 4. ProgressBar Component (`<ProgressBar />`)

- [x] Genel kullanıma uygun (Enerji, XP vb.) esnek bar.
- [x] **Container:** `w-full h-8 bg-slate-100 border-4 border-slate-900 rounded-full overflow-hidden`
- [x] **Fill:** Değere göre (`%` width) artan iç div.
- [x] Dolum efekti için Framer Motion ile `layout` veya `animate={{ width: \`\${value}%\` }}` eklenecek.

---

## 🏗️ 2. Faz: Birleşik Bileşenler (Molecules)

### 5. StatCard Component (`<StatCard />`)

- [x] `<Card variant="dashboard" />` kullanılacak ama padding daha küçük olacak (`p-3` veya `p-4`).
- [x] Lucide React ikonu (örn: Coin için `Coins`, Enerji için `Zap`), etiket (örn: "Coins") ve değer (`font-black text-xl`) yan yana veya alt alta hizalanacak.

### 6. EnergyBar Component (`<EnergyBar />`)

- [x] `<ProgressBar />` bileşeninin özelleştirilmiş hali.
- [x] Fill rengi kesinlikle `bg-mint-green` olacak.
- [x] İçinde veya üstünde anlık enerjiyi metin olarak gösterecek (örn: "450 / 1000 ⚡").

### 7. InventoryItem Component (`<InventoryItem />`)

- [x] `<Card variant="dashboard" />` içinde çalışacak.
- [x] Sol tarafta görsel/ikon, ortada isim ve üretim gücü (örn: "Solar Panel Lv.1 - +5⚡/sn").
- [x] Sağ tarafta `<Button variant="primary">Satın Al (100🪙)</Button>`.

### 8. GoalCard Component (`<GoalCard />`)

- [x] Günlük hedefleri (Daily Goals) gösterecek. `<Card variant="accent" />` kullanılacak.
- [x] Hedef başlığı, `<ProgressBar />` (hedef ilerlemesi) ve ödül bilgisi (`<Badge>+50 XP</Badge>`) içerecek.

### 9. Toast / Alert Component (`<Toast />`)

- [x] Oyun içi bildirimler (örn: "Hedef Tamamlandı!", "+100 Altın") için kullanılacak.
- [x] Ekranın altına veya üstüne `absolute/fixed` konumlandırılacak.
- [x] Framer Motion: `initial={{ opacity: 0, y: 50, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring" }}`.
- [x] Kalın kenarlıklı ve genelde `bg-sunny-yellow` veya `bg-mint-green` renklerinde olacak.

---

## 🏛️ 3. Faz: Taşıyıcı ve Layout Bileşenleri (Organisms)

### 10. Modal Component (`<Modal />`)

- [ ] Yarı saydam arka plan (backdrop).
- [ ] Ortada `<Card />` benzeri ama daha büyük bir container.
- [ ] Framer Motion: Modal açılışı `scale: 0.8` den `1` e `spring` animasyonu ile büyüyecek.
- [ ] Sağ üstte kalın kenarlıklı, kırmızı veya `bg-soft-peach` bir (X) kapatma butonu `<Button variant="icon" />` olacak.

### 11. Header Component (`<Header />`)

- [ ] Uygulamanın en üstünde yer alacak yapışkan (sticky) bar.
- [ ] Sol tarafta uygulamanın Cartoonish Logosu/İsmi (`font-black text-2xl`).
- [ ] Sağ tarafta yan yana dizilmiş `<StatCard />` veya minik bilgi barları (Level ve Coin).

### 12. TabBar Component (`<TabBar />`)

- [ ] Ekranın altında mobil benzeri gezinme (Navigation) barı.
- [ ] Paneller (Dashboard), Market (Upgrades) ve Ayarlar sekmelerini içerecek.
- [ ] Aktif sekme `bg-sunny-yellow` olup yukarı doğru hafif zıplamış (`-translate-y-2`) görünecek. Diğerleri `bg-white` olacak.
- [ ] Tüm tab bar `border-t-4 border-slate-900 shadow-[0px_-4px_0px_0px_#0f172a]` stiline sahip olacak.
