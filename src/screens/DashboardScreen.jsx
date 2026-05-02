import { motion } from 'framer-motion'
import {
  BatteryCharging,
  CloudSun,
  FastForward,
  Gauge,
  MapPin,
  Pause,
  Play,
  SunMedium,
  Wallet,
} from 'lucide-react'
import { BATTERY_DEF_BY_TYPE_ID } from '../constants/gameData'
import useGameStore from '../store/useGameStore'
import Header from '../components/Header'
import TabBar from '../components/TabBar'
import { getCitySolarStats } from '../utils/citySolarStats'

const MONTHS_TR = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık',
]

function DashboardScreen() {
  const setScreen = useGameStore((s) => s.setScreen)
  const credits = useGameStore((s) => s.credits)
  const level = useGameStore((s) => s.level)
  const selectedCity = useGameStore((s) => s.selectedCity)
  const hasStartedGame = useGameStore((s) => s.hasStartedGame)
  const startDay = useGameStore((s) => s.startDay)
  const endDay = useGameStore((s) => s.endDay)
  const gameLoopMode = useGameStore((s) => s.gameLoopMode)
  const setGameLoopMode = useGameStore((s) => s.setGameLoopMode)
  const day = useGameStore((s) => s.day)
  const hour = useGameStore((s) => s.hour)
  const isDayActive = useGameStore((s) => s.isDayActive)
  const currentEnergy = useGameStore((s) => s.currentEnergy)
  const activePanels = useGameStore((s) => s.activePanels)
  const activeBatteries = useGameStore((s) => s.activeBatteries)

  const batteryCapacity = activeBatteries.reduce((sum, b) => {
    const def = BATTERY_DEF_BY_TYPE_ID[b.type]
    return sum + (def?.capacity ?? 0)
  }, 0)

  const batteryFillPct =
    batteryCapacity > 0
      ? Math.min(100, Math.round((currentEnergy / batteryCapacity) * 100))
      : 0

  const calendarDate = new Date(2026, 0, day)
  const calendarLabel = `${calendarDate.getDate()} ${MONTHS_TR[calendarDate.getMonth()]}`

  const headerSlot =
    hasStartedGame ? (
      <div className="flex flex-wrap items-center gap-2">
        <div className="rounded-full border-3 border-slate-900 bg-background p-1 shadow-[2px_2px_0px_0px_var(--shade)] flex items-center gap-1">
          <button
            type="button"
            onClick={() => setGameLoopMode('pause')}
            className={`rounded-full border-2 px-2 py-1 transition-colors ${
              gameLoopMode === 'pause'
                ? 'border-slate-900 bg-blossom'
                : 'border-transparent bg-transparent hover:bg-breeze'
            }`}
            title="Duraklat"
            aria-label="Duraklat"
          >
            <Pause className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setGameLoopMode('play')}
            className={`rounded-full border-2 px-2 py-1 transition-colors ${
              gameLoopMode === 'play'
                ? 'border-slate-900 bg-sprout'
                : 'border-transparent bg-transparent hover:bg-breeze'
            }`}
            title="Normal hız"
            aria-label="Normal hız"
          >
            <Play className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setGameLoopMode('fast')}
            className={`rounded-full border-2 px-2 py-1 transition-colors ${
              gameLoopMode === 'fast'
                ? 'border-slate-900 bg-sunlit'
                : 'border-transparent bg-transparent hover:bg-breeze'
            }`}
            title="Hızlandır / otomatik gün atla"
            aria-label="Hızlandır / otomatik gün atla"
          >
            <FastForward className="w-3.5 h-3.5" />
          </button>
        </div>
        <span className="rounded-full border-2 border-slate-900 bg-blossom px-2.5 py-1 text-[11px] font-black whitespace-nowrap">
          {calendarLabel}
        </span>
        <span className="rounded-full border-2 border-slate-900 bg-breeze px-2.5 py-1 text-[11px] font-black whitespace-nowrap">
          Gün {day} • Saat {String(hour).padStart(2, '0')}:00
        </span>
        {!isDayActive ? (
          <button
            type="button"
            onClick={() => {
              void startDay()
            }}
            className="rounded-full border-3 border-slate-900 bg-sunlit px-3 py-1 text-[11px] font-black uppercase tracking-wide shadow-[2px_2px_0px_0px_var(--shade)] active:translate-y-px whitespace-nowrap"
          >
            Yeni Güne Geç
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => endDay()}
              className="rounded-full border-3 border-slate-900 bg-background px-3 py-1 text-[11px] font-black shadow-[2px_2px_0px_0px_var(--shade)] active:translate-y-px whitespace-nowrap"
            >
              Günü Bitir
            </button>
          </>
        )}
      </div>
    ) : null

  const cityName = selectedCity || 'Konya'
  const cityStats = getCitySolarStats(cityName)

  const dashboardData = {
    inventory: {
      panelCount: activePanels.length,
      totalProductionKw: Math.round(currentEnergy),
      batteryFillPct,
      credits,
    },
    city: {
      name: cityName,
      potentialProductionKw: cityStats ? Math.round(cityStats.sunHoursPerDay * 155) : 1160,
      sunHours: cityStats ? cityStats.sunHoursPerDay : 7.5,
      weather: 'Parçalı bulutlu',
      temperature: 24,
      efficiencyPct: cityStats ? cityStats.efficiencyPct : 72,
    },
    market: {
      instantPrice: 2.86,
      trend: '+%3.4',
      volatility: 'Orta',
    },
    game: {
      time: isDayActive ? `${String(hour).padStart(2, '0')}:00` : '—',
      cycle: isDayActive
        ? 'Simülasyon günü (1 sn ≈ 1 saat)'
        : gameLoopMode === 'fast'
          ? 'Beklemede — otomatik yeni gün'
          : gameLoopMode === 'pause'
            ? 'Duraklatıldı'
            : 'Beklemede — yeni güne geç',
      day: `${day}. Gün`,
    },
  }

  return (
    <div className="h-screen bg-breeze flex flex-col font-['Nunito'] text-shade overflow-hidden">
      <Header credits={credits} level={level} headerSlot={headerSlot} />

      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6"
      >
        <section className="max-w-6xl mx-auto space-y-4">
          <article className="rounded-3xl border-4 border-slate-900 bg-sunlit p-4 sm:p-5 shadow-[6px_6px_0px_0px_var(--shade)]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-xs font-black text-shade-2">Enerji Çiftliği Kontrol Merkezi</p>
                <h1 className="text-2xl sm:text-3xl font-black">Günlük Operasyon Özeti</h1>
                <div className="mt-2 inline-flex items-center gap-2 rounded-full border-3 border-slate-900 bg-background px-3 py-1.5 shadow-[2px_2px_0px_0px_var(--shade)]">
                  <MapPin className="w-4 h-4" strokeWidth={2.25} />
                  <span className="text-xs font-black text-shade-2">Aktif Şehir:</span>
                  <span className="text-base font-black">{dashboardData.city.name}</span>
                </div>
              </div>
              <div className="rounded-2xl border-4 border-slate-900 bg-background px-3 py-2 shadow-[3px_3px_0px_0px_var(--shade)]">
                <p className="text-xs font-black text-shade-2">Anlık Üretim Verim Skoru</p>
                <p className="text-xl font-black">%{dashboardData.city.efficiencyPct}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs font-black mb-1">
                <span>Batarya seviyesi</span>
                <span>%{dashboardData.inventory.batteryFillPct}</span>
              </div>
              <div className="h-4 rounded-full border-3 border-slate-900 bg-background overflow-hidden">
                <div
                  className="h-full bg-sprout-deep"
                  style={{ width: `${dashboardData.inventory.batteryFillPct}%` }}
                />
              </div>
            </div>
          </article>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            <article className="rounded-2xl border-4 border-slate-900 bg-sunlit p-4 shadow-[4px_4px_0px_0px_var(--shade)] hover:-translate-y-0.5 transition-transform">
              <div className="flex items-center gap-2 mb-1.5 font-black text-sm text-shade-2">
                <SunMedium className="w-4 h-4" />
                Toplam Üretim
              </div>
              <p className="text-2xl font-black">{dashboardData.inventory.totalProductionKw} kW</p>
              <p className="text-xs font-black mt-1">Son 24s: +84 kW</p>
            </article>
            <article className="rounded-2xl border-4 border-slate-900 bg-breeze p-4 shadow-[4px_4px_0px_0px_var(--shade)] hover:-translate-y-0.5 transition-transform">
              <div className="flex items-center gap-2 mb-1.5 font-black text-sm text-shade-2">
                <BatteryCharging className="w-4 h-4" />
                Batarya Doluluğu
              </div>
              <p className="text-2xl font-black">%{dashboardData.inventory.batteryFillPct}</p>
              <p className="text-xs font-black mt-1">Kritik eşik: %20</p>
            </article>
            <article className="rounded-2xl border-4 border-slate-900 bg-sprout p-4 shadow-[4px_4px_0px_0px_var(--shade)] hover:-translate-y-0.5 transition-transform">
              <div className="flex items-center gap-2 mb-1.5 font-black text-sm text-shade-2">
                <Wallet className="w-4 h-4" />
                Krediler
              </div>
              <p className="text-2xl font-black">{dashboardData.inventory.credits.toLocaleString('tr-TR')}</p>
              <p className="text-xs font-black mt-1">Bugün: +320 kredi</p>
            </article>
            <article className="rounded-2xl border-4 border-slate-900 bg-blossom p-4 shadow-[4px_4px_0px_0px_var(--shade)] hover:-translate-y-0.5 transition-transform">
              <div className="flex items-center gap-2 mb-1.5 font-black text-sm text-shade-2">
                <Gauge className="w-4 h-4" />
                Envanter Özeti
              </div>
              <p className="text-2xl font-black">{dashboardData.inventory.panelCount} panel</p>
              <p className="text-xs font-black mt-1">Aktif: 16 / Bakım: 2</p>
            </article>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
            <article className="xl:col-span-2 rounded-2xl border-4 border-slate-900 bg-background p-4 shadow-[4px_4px_0px_0px_var(--shade)]">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-black text-lg">{dashboardData.city.name} - Şehir Bilgisi</h2>
                <span className="rounded-full border-2 border-slate-900 bg-sunlit px-3 py-1 text-xs font-black">
                  Üretim için uygun
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="rounded-xl border-3 border-slate-900 bg-sunlit/70 px-3 py-2">
                  <p className="text-xs font-black text-shade-2">Potansiyel Üretim</p>
                  <p className="text-lg font-black">{dashboardData.city.potentialProductionKw} kW/gün</p>
                </div>
                <div className="rounded-xl border-3 border-slate-900 bg-breeze/70 px-3 py-2">
                  <p className="text-xs font-black text-shade-2">Günlük Güneş Saati</p>
                  <p className="text-lg font-black">{dashboardData.city.sunHours} saat</p>
                </div>
                <div className="rounded-xl border-3 border-slate-900 bg-sprout/70 px-3 py-2">
                  <p className="text-xs font-black text-shade-2">Sıcaklık</p>
                  <p className="text-lg font-black">{dashboardData.city.temperature}°C</p>
                </div>
                <div className="rounded-xl border-3 border-slate-900 bg-blossom/70 px-3 py-2">
                  <p className="text-xs font-black text-shade-2">Güncel Hava Durumu</p>
                  <p className="text-lg font-black flex items-center gap-2">
                    <CloudSun className="w-5 h-5" />
                    {dashboardData.city.weather}
                  </p>
                </div>
                <div className="rounded-xl border-3 border-slate-900 bg-background px-3 py-2 sm:col-span-2">
                  <p className="text-xs font-black text-shade-2">Verimlilik</p>
                  <p className="text-lg font-black">%{dashboardData.city.efficiencyPct}</p>
                </div>
              </div>
            </article>

            <div className="space-y-3">
              <article className="rounded-2xl border-4 border-slate-900 bg-sunlit-deep p-4 shadow-[4px_4px_0px_0px_var(--shade)]">
                <h2 className="font-black text-base mb-2">Anlık Enerji Piyasası</h2>
                <p className="text-2xl font-black">{dashboardData.market.instantPrice.toFixed(2)} ₺/kWh</p>
                <p className="text-sm font-black mt-1">Trend: {dashboardData.market.trend}</p>
                <p className="text-xs font-black mt-1">Volatilite: {dashboardData.market.volatility}</p>
              </article>
              <article className="rounded-2xl border-4 border-slate-900 bg-breeze-deep p-4 shadow-[4px_4px_0px_0px_var(--shade)]">
                <h2 className="font-black text-base mb-2">Oyun İçi Zaman / Döngü</h2>
                <p className="text-2xl font-black">{dashboardData.game.time}</p>
                <p className="text-sm font-black mt-1">{dashboardData.game.cycle}</p>
                <p className="text-xs font-black mt-1">{dashboardData.game.day}</p>
              </article>
            </div>
          </div>
        </section>
      </motion.main>

      <TabBar activeScreen="dashboard" onChange={setScreen} />
    </div>
  )
}

export default DashboardScreen
