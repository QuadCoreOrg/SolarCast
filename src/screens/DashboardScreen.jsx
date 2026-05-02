import { motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { BatteryCharging, CloudSun, Gauge, MapPin, SunMedium, Wallet, ZapOff } from 'lucide-react'
import { BATTERY_DEF_BY_TYPE_ID, PANEL_DEF_BY_TYPE_ID } from '../constants/gameData'
import useGameStore from '../store/useGameStore'
import Header from '../components/Header'
import TabBar from '../components/TabBar'
import Modal from '../components/Modal'
import PercentSellSelector from '../components/PercentSellSelector'
import { getCitySolarStats } from '../utils/citySolarStats'
import { getSpotEnergyPriceCoinPerKwh, getSpotEnergyTrendLabel } from '../utils/spotEnergyPrice'

function clampSellPct(p) {
  const snapped = Math.round(Number(p) / 5) * 5
  return Math.min(100, Math.max(5, snapped))
}

function DashboardScreen() {
  const setScreen = useGameStore((s) => s.setScreen)
  const coins = useGameStore((s) => s.coins)
  const level = useGameStore((s) => s.level)
  const selectedCity = useGameStore((s) => s.selectedCity)
  const gameLoopMode = useGameStore((s) => s.gameLoopMode)
  const setGameLoopMode = useGameStore((s) => s.setGameLoopMode)
  const sellSpotEnergy = useGameStore((s) => s.sellSpotEnergy)
  const day = useGameStore((s) => s.day)
  const hour = useGameStore((s) => s.hour)
  const isDayActive = useGameStore((s) => s.isDayActive)
  const currentEnergy = useGameStore((s) => s.currentEnergy)
  const activePanels = useGameStore((s) => s.activePanels)
  const activeBatteries = useGameStore((s) => s.activeBatteries)
  const dailyForecast = useGameStore((s) => s.dailyForecast)

  const batteryCapacity = activeBatteries.reduce((sum, b) => {
    const def = BATTERY_DEF_BY_TYPE_ID[b.type]
    return sum + (def?.capacity ?? 0)
  }, 0)

  const hasBatteryStorage = batteryCapacity > 0
  const batteryFillPct = hasBatteryStorage
    ? Math.min(100, Math.round((currentEnergy / batteryCapacity) * 100))
    : 0
  const batteryFull = hasBatteryStorage && currentEnergy >= batteryCapacity

  const hourForecast = dailyForecast[hour]
  const gtiUsed = typeof hourForecast?.gti_used === 'number' ? hourForecast.gti_used : 0
  const currentProductionKw = activePanels.reduce((sum, panel) => {
    const def = PANEL_DEF_BY_TYPE_ID[panel.type]
    if (!def) return sum
    const dirty = (panel.daysSinceCleaned ?? 0) >= def.dirtyDaysLimit
    const effMult = dirty ? 0.25 : 1
    return sum + def.area * effMult * (gtiUsed / 1000)
  }, 0)
  const dirtyPanelCount = activePanels.filter((panel) => {
    const def = PANEL_DEF_BY_TYPE_ID[panel.type]
    return def ? (panel.daysSinceCleaned ?? 0) >= def.dirtyDaysLimit : false
  }).length

  const cityName = selectedCity || 'Konya'
  const cityStats = getCitySolarStats(cityName)

  const liveSpotCoinPerKwh = getSpotEnergyPriceCoinPerKwh({
    day,
    hour,
    cityName,
  })
  const liveTrend = getSpotEnergyTrendLabel({ day, hour, cityName })

  const [sellModalOpen, setSellModalOpen] = useState(false)
  const [sellPct, setSellPct] = useState(40)
  const [frozenSpotCoinPerKwh, setFrozenSpotCoinPerKwh] = useState(null)
  const [sellError, setSellError] = useState('')
  const loopModeBeforeSellRef = useRef(null)

  const closeSellModal = useCallback(() => {
    setSellModalOpen(false)
    setFrozenSpotCoinPerKwh(null)
    setSellError('')
    const restore = loopModeBeforeSellRef.current
    loopModeBeforeSellRef.current = null
    if (restore === 'pause' || restore === 'play' || restore === 'fast') {
      setGameLoopMode(restore)
    }
  }, [setGameLoopMode])

  const openSellModal = useCallback(() => {
    if (!hasBatteryStorage || currentEnergy <= 0) return
    setSellError('')
    const spot = getSpotEnergyPriceCoinPerKwh({
      day,
      hour,
      cityName,
    })
    loopModeBeforeSellRef.current = gameLoopMode
    setFrozenSpotCoinPerKwh(spot)
    setGameLoopMode('pause')
    setSellPct((prev) => clampSellPct(prev))
    setSellModalOpen(true)
  }, [
    cityName,
    currentEnergy,
    day,
    gameLoopMode,
    hasBatteryStorage,
    hour,
    setGameLoopMode,
  ])

  useEffect(
    () => () => {
      const restore = loopModeBeforeSellRef.current
      loopModeBeforeSellRef.current = null
      if (restore === 'pause' || restore === 'play' || restore === 'fast') {
        setGameLoopMode(restore)
      }
    },
    [setGameLoopMode],
  )

  const previewKwhSold =
    hasBatteryStorage && currentEnergy > 0 ? Math.round((currentEnergy * (sellPct / 100)) * 1000) / 1000 : 0
  const previewCoinsEarned =
    frozenSpotCoinPerKwh != null && previewKwhSold > 0
      ? Math.round(previewKwhSold * frozenSpotCoinPerKwh)
      : 0

  const handleConfirmSell = () => {
    if (frozenSpotCoinPerKwh == null) return
    const result = sellSpotEnergy({
      percentSold: sellPct,
      lockedPriceCoinPerKwh: frozenSpotCoinPerKwh,
    })
    if (!result.ok) {
      setSellError(result.reason || 'Satış gerçekleşmedi.')
      return
    }
    closeSellModal()
  }

  const canOpenSellModal = hasBatteryStorage && currentEnergy > 0

  const dashboardData = {
    inventory: {
      panelCount: activePanels.length,
      totalProductionKw: Math.round(currentProductionKw * 100) / 100,
      batteryFillPct,
      coins,
      batteryCount: activeBatteries.length,
      dirtyPanelCount,
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
      instantPrice: liveSpotCoinPerKwh,
      trend: liveTrend,
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
      <Header coins={coins} level={level} />

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
                <span>
                  {hasBatteryStorage ? `%${dashboardData.inventory.batteryFillPct}` : '—'}
                </span>
              </div>
              <div className="h-4 rounded-full border-3 border-slate-900 bg-background overflow-hidden">
                <div
                  className={`h-full ${hasBatteryStorage ? 'bg-sprout-deep' : 'bg-shade/15'}`}
                  style={{ width: hasBatteryStorage ? `${dashboardData.inventory.batteryFillPct}%` : '0%' }}
                />
              </div>
              {!hasBatteryStorage && (
                <p className="text-[11px] font-bold text-shade-2 mt-1">
                  Batarya yok — üretim depolanmıyor. Depolama için batarya satın al.
                </p>
              )}
              {batteryFull && (
                <p className="text-[11px] font-bold text-rose-700 mt-1">
                  Depo dolu — yeni batarya alın ya da enerjilerinizi satın.
                </p>
              )}
            </div>
          </article>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            <article className="rounded-2xl border-4 border-slate-900 bg-sunlit p-4 shadow-[4px_4px_0px_0px_var(--shade)] hover:-translate-y-0.5 transition-transform">
              <div className="flex items-center gap-2 mb-1.5 font-black text-sm text-shade-2">
                <SunMedium className="w-4 h-4" />
                Toplam Üretim
              </div>
              <p className="text-2xl font-black">{dashboardData.inventory.totalProductionKw} kWh</p>
              <p className="text-xs font-black mt-1">Kirli panelde üretim %75 azalır</p>
            </article>
            <article className="rounded-2xl border-4 border-slate-900 bg-breeze p-4 shadow-[4px_4px_0px_0px_var(--shade)] hover:-translate-y-0.5 transition-transform">
              <div className="flex items-center gap-2 mb-1.5 font-black text-sm text-shade-2">
                <BatteryCharging className="w-4 h-4" />
                Batarya Doluluğu
              </div>
              <p className="text-2xl font-black">
                {hasBatteryStorage ? `%${dashboardData.inventory.batteryFillPct}` : '—'}
              </p>
              <p className="text-xs font-black mt-1">
                {hasBatteryStorage
                  ? 'Kritik eşik: %20'
                  : 'Batarya yok — doluluk yalnızca depolama varken anlamlıdır.'}
              </p>
            </article>
            <article className="rounded-2xl border-4 border-slate-900 bg-sprout p-4 shadow-[4px_4px_0px_0px_var(--shade)] hover:-translate-y-0.5 transition-transform">
              <div className="flex items-center gap-2 mb-1.5 font-black text-sm text-shade-2">
                <Wallet className="w-4 h-4" />
                Coin
              </div>
              <p className="text-2xl font-black">{dashboardData.inventory.coins.toLocaleString('tr-TR')}</p>
              <p className="text-xs font-black mt-1">Bugün: +320 Coin</p>
            </article>
            <article className="rounded-2xl border-4 border-slate-900 bg-blossom p-4 shadow-[4px_4px_0px_0px_var(--shade)] hover:-translate-y-0.5 transition-transform">
              <div className="flex items-center gap-2 mb-1.5 font-black text-sm text-shade-2">
                <Gauge className="w-4 h-4" />
                Envanter Özeti
              </div>
              <p className="text-2xl font-black">{dashboardData.inventory.panelCount} panel</p>
              <p className="text-xs font-black mt-1">
                Batarya: {dashboardData.inventory.batteryCount} / Kirli panel: {dashboardData.inventory.dirtyPanelCount}
              </p>
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
                <h2 className="font-black text-base mb-2">Anlık enerji piyasası</h2>
                <p className="text-[11px] font-bold text-shade-2 mb-1">
                  {isDayActive
                    ? `Gün içi kotasyon · simülasyon saati ${String(hour).padStart(2, '0')}:00`
                    : 'Satış modalında süre beklerken fiyat kilitlenecek'}
                </p>
                <p className="text-2xl font-black">{dashboardData.market.instantPrice.toFixed(2)} Coin/kWh</p>
                <p className="text-sm font-black mt-1">Trend: {dashboardData.market.trend}</p>
                <p className="text-xs font-black mt-1">Volatilite: {dashboardData.market.volatility}</p>
                <button
                  type="button"
                  disabled={!canOpenSellModal}
                  onClick={openSellModal}
                  className="mt-3 w-full rounded-2xl border-4 border-slate-900 bg-background px-3 py-2 text-sm font-black shadow-[4px_4px_0px_0px_var(--shade)] active:translate-y-1 active:shadow-none hover:bg-sunlit/70 transition-colors disabled:cursor-not-allowed disabled:opacity-45 disabled:active:translate-y-0 disabled:active:shadow-[4px_4px_0px_0px_var(--shade)]"
                >
                  Enerji sat
                </button>
                {!hasBatteryStorage && (
                  <p className="text-[11px] font-bold text-shade-2 mt-2">Depolama yok — önce batarya takın.</p>
                )}
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

      <Modal
        isOpen={sellModalOpen}
        onClose={closeSellModal}
        title="Enerji satışı"
        className="max-w-lg"
      >
        {frozenSpotCoinPerKwh != null ? (
          <div className="space-y-4 font-bold text-shade">
            <div className="rounded-2xl border-3 border-slate-900 bg-breeze/50 p-3 space-y-3">
              <div>
                <p className="text-xs font-black text-shade-2 uppercase tracking-wide">Enerji başı maliyet</p>
                <p className="text-xl font-black mt-1">
                  {frozenSpotCoinPerKwh.toLocaleString('tr-TR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{' '}
                  Coin/kWh
                </p>
              </div>
            </div>

            <div className="rounded-2xl border-3 border-slate-900 bg-background p-3 space-y-1">
              <p className="text-xs font-black text-shade-2">Şu an depoda</p>
              <p className="text-lg font-black">
                {currentEnergy.toLocaleString('tr-TR', { maximumFractionDigits: 1 })} kWh
              </p>
              <div className="h-3 rounded-full border-2 border-slate-900 bg-breeze overflow-hidden mt-2">
                <div
                  className="h-full bg-sprout-deep"
                  style={{
                    width: batteryCapacity > 0 ? `${Math.min(100, Math.round((currentEnergy / batteryCapacity) * 100))}%` : '0%',
                  }}
                />
              </div>
            </div>

            <PercentSellSelector valuePct={sellPct} onChangePct={setSellPct} />

            <div className="rounded-2xl border-3 border-slate-900 bg-sprout/50 p-3 space-y-1">
              <p className="text-xs font-black text-shade-2">Özet</p>
              <p className="text-sm font-black">
                ≈{' '}
                {previewKwhSold.toLocaleString('tr-TR', {
                  maximumFractionDigits: 2,
                })}{' '}
                kWh → ≈{' '}
                {previewCoinsEarned.toLocaleString('tr-TR')} Coin
              </p>
            </div>

            {sellError && (
              <p className="text-xs font-bold text-rose-700 flex items-center gap-1">
                <ZapOff className="w-3.5 h-3.5 shrink-0" />
                {sellError}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={closeSellModal}
                className="rounded-2xl border-4 border-slate-900 bg-background px-4 py-2 font-black shadow-[3px_3px_0px_0px_var(--shade)] active:translate-y-1 active:shadow-none"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleConfirmSell}
                disabled={previewKwhSold <= 0}
                className="rounded-2xl border-4 border-slate-900 bg-sunlit-deep px-4 py-2 font-black shadow-[3px_3px_0px_0px_var(--shade)] active:translate-y-1 active:shadow-none disabled:opacity-45 disabled:cursor-not-allowed"
              >
                Satışı onayla
              </button>
            </div>
          </div>
        ) : null}
      </Modal>

      <TabBar activeScreen="dashboard" onChange={setScreen} />
    </div>
  )
}

export default DashboardScreen
