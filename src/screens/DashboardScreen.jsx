import { useCallback, useEffect, useRef, useState } from 'react'
import { BatteryCharging, CloudSun, Cpu, Gauge, MapPin, SunMedium, Zap, ZapOff } from 'lucide-react'
import { BATTERY_DEF_BY_TYPE_ID, PANEL_DEF_BY_TYPE_ID } from '../constants/gameData'
import useGameStore from '../store/useGameStore'
import Header from '../components/Header'
import TabBar from '../components/TabBar'
import Modal from '../components/Modal'
import PercentSellSelector from '../components/PercentSellSelector'
import CastAiEnergyModal from '../components/CastAiEnergyModal'
import DailyQuestsPanel from '../components/DailyQuestsPanel'
import AnimatedNumber, { AnimatedPctFill } from '../components/AnimatedMetric'
import { getCitySolarStats } from '../utils/citySolarStats'
import { getSpotEnergyPriceCoinPerKwh, getSpotEnergyTrendLabel } from '../utils/spotEnergyPrice'
import { CAST_AI_REQUEST_CREDITS } from '../constants/castAi'

function clampSellPct(p) {
  const snapped = Math.round(Number(p) / 5) * 5
  return Math.min(100, Math.max(5, snapped))
}

/** Open-Meteo saat dilimindeki görünür güne göre Türkçe hava özeti */
function forecastWeatherTurkish(cloudCover, gtiUsed) {
  const cloud = typeof cloudCover === 'number' ? cloudCover : 50
  const gti = typeof gtiUsed === 'number' ? gtiUsed : 0
  if (gti < 5) return 'Gece'
  if (cloud >= 88) return 'Kapalı gökyüzü'
  if (cloud >= 65) return 'Çok bulutlu'
  if (cloud >= 40) return 'Bulutlu'
  if (cloud >= 18) return 'Parçalı bulutlu'
  return 'Açık / güneşli'
}

/** Güne göre yaklaşık “gökyüzü açıklığı” skoru (%) */
function clearnessPctFromForecast(cloudCover, gtiUsed) {
  const cloud = typeof cloudCover === 'number' ? cloudCover : 50
  const gti = typeof gtiUsed === 'number' ? gtiUsed : 0
  if (gti < 5) return Math.round(Math.max(12, 100 - cloud * 0.65))
  return Math.round(Math.max(15, Math.min(100, 100 - cloud * 0.92 + Math.min(18, gti / 45))))
}

function summarizeDailyForecast(slots) {
  if (!Array.isArray(slots) || slots.length < 24) return null

  let sumTemp = 0
  let sumCloud = 0
  let sumGti = 0
  let sumPowWh = 0
  let sumSunSec = 0
  let n = 0

  for (let i = 0; i < 24; i += 1) {
    const s = slots[i]
    if (!s) continue
    n += 1
    const t = typeof s.temp_used === 'number' ? s.temp_used : 25
    const c = typeof s.cloud_cover === 'number' ? s.cloud_cover : 50
    const g = typeof s.gti_used === 'number' ? s.gti_used : 0
    const p = typeof s.power_watts === 'number' ? s.power_watts : 0
    const sd = typeof s.sunshine_duration_s === 'number' ? s.sunshine_duration_s : 0
    sumTemp += t
    sumCloud += c
    sumGti += g
    sumPowWh += p
    sumSunSec += sd
  }

  if (n === 0) return null

  return {
    avgTemp: Math.round((sumTemp / n) * 10) / 10,
    avgCloud: Math.round((sumCloud / n) * 10) / 10,
    avgGti: Math.round((sumGti / n) * 10) / 10,
    dailyRefKwh: Math.round((sumPowWh / 1000) * 100) / 100,
    sunshineHoursDay: Math.round((sumSunSec / 3600) * 10) / 10,
  }
}

function DashboardScreen() {
  const setScreen = useGameStore((s) => s.setScreen)
  const coins = useGameStore((s) => s.coins)
  const level = useGameStore((s) => s.level)
  const selectedCity = useGameStore((s) => s.selectedCity)
  const gameLoopMode = useGameStore((s) => s.gameLoopMode)
  const setGameLoopMode = useGameStore((s) => s.setGameLoopMode)
  const geminiCredits = useGameStore((s) => s.geminiCredits)
  const spendGeminiCredits = useGameStore((s) => s.spendGeminiCredits)
  const hasStartedGame = useGameStore((s) => s.hasStartedGame)
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

  const hasFullForecast = Array.isArray(dailyForecast) && dailyForecast.length >= 24
  const dayForecastSummary = summarizeDailyForecast(dailyForecast)

  let liveCitySlot = null
  if (hasFullForecast && dayForecastSummary) {
    liveCitySlot = isDayActive
      ? hourForecast
      : {
          temp_used: dayForecastSummary.avgTemp,
          cloud_cover: dayForecastSummary.avgCloud,
          gti_used: dayForecastSummary.avgGti,
        }
  }

  const cityTemperature =
    typeof liveCitySlot?.temp_used === 'number'
      ? liveCitySlot.temp_used
      : cityStats
        ? Math.round((((cityStats.sunHoursPerDay / 12) * 18 + 8) * 10) / 10)
        : 24

  const cityWeatherLabel = liveCitySlot
    ? forecastWeatherTurkish(liveCitySlot.cloud_cover, liveCitySlot.gti_used)
    : 'Parçalı bulutlu'

  const cityEfficiencyPctLive = liveCitySlot
    ? clearnessPctFromForecast(liveCitySlot.cloud_cover, liveCitySlot.gti_used)
    : cityStats
      ? cityStats.efficiencyPct
      : 72

  const cityPotentialKwhDay = dayForecastSummary
    ? dayForecastSummary.dailyRefKwh
    : cityStats
      ? Math.round(cityStats.sunHoursPerDay * 155)
      : 1160

  const citySunHoursDisplay = dayForecastSummary
    ? dayForecastSummary.sunshineHoursDay
    : cityStats
      ? cityStats.sunHoursPerDay
      : 7.5

  const cityProductionBadge = liveCitySlot
    ? liveCitySlot.gti_used >= 80 && liveCitySlot.cloud_cover < 70
      ? 'Üretim için uygun'
      : liveCitySlot.gti_used >= 25
        ? 'Orta düzey ışınım'
        : 'Düşük ışınım'
    : 'Üretim için uygun'

  const liveSpotCoinPerKwh = getSpotEnergyPriceCoinPerKwh({
    day,
    hour,
    cityName,
  })
  const liveTrend = getSpotEnergyTrendLabel({ day, hour, cityName })

  const [sellModalOpen, setSellModalOpen] = useState(false)
  const [castAiModalOpen, setCastAiModalOpen] = useState(false)
  const [castAiNonce, setCastAiNonce] = useState(0)
  const [sellPct, setSellPct] = useState(100)
  const [frozenSpotCoinPerKwh, setFrozenSpotCoinPerKwh] = useState(null)
  const [sellError, setSellError] = useState('')
  const loopModeBeforeSellRef = useRef(null)
  const loopModeBeforeCastAiRef = useRef(null)

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

  const openSellModal = useCallback((options = {}) => {
    if (!hasBatteryStorage || currentEnergy <= 0) return
    const pctOverride =
      typeof options.sellPct === 'number' && Number.isFinite(options.sellPct) ? options.sellPct : undefined
    setSellError('')
    const spot = getSpotEnergyPriceCoinPerKwh({
      day,
      hour,
      cityName,
    })
    loopModeBeforeSellRef.current = useGameStore.getState().gameLoopMode
    setFrozenSpotCoinPerKwh(spot)
    setGameLoopMode('pause')
    setSellPct((prev) =>
      pctOverride != null ? clampSellPct(pctOverride) : clampSellPct(prev),
    )
    setSellModalOpen(true)
  }, [cityName, currentEnergy, day, hasBatteryStorage, hour, setGameLoopMode, setSellPct])

  const closeCastAiModal = useCallback(() => {
    setCastAiModalOpen(false)
    const restore = loopModeBeforeCastAiRef.current
    loopModeBeforeCastAiRef.current = null
    if (restore === 'pause' || restore === 'play' || restore === 'fast') {
      setGameLoopMode(restore)
    }
  }, [setGameLoopMode])

  const openCastAiModal = useCallback(() => {
    if (!hasStartedGame) return
    loopModeBeforeCastAiRef.current = useGameStore.getState().gameLoopMode
    setGameLoopMode('pause')
    setCastAiNonce((n) => n + 1)
    setCastAiModalOpen(true)
  }, [hasStartedGame, setGameLoopMode])

  const navigateSellFromCastAi = useCallback(
    (suggestedPct) => {
      closeCastAiModal()
      window.requestAnimationFrame(() => {
        if (typeof suggestedPct === 'number' && Number.isFinite(suggestedPct)) {
          openSellModal({ sellPct: suggestedPct })
        } else {
          openSellModal()
        }
      })
    },
    [closeCastAiModal, openSellModal],
  )

  useEffect(
    () => () => {
      const restoreSell = loopModeBeforeSellRef.current
      loopModeBeforeSellRef.current = null
      if (restoreSell === 'pause' || restoreSell === 'play' || restoreSell === 'fast') {
        setGameLoopMode(restoreSell)
      }
      const restoreAi = loopModeBeforeCastAiRef.current
      loopModeBeforeCastAiRef.current = null
      if (restoreAi === 'pause' || restoreAi === 'play' || restoreAi === 'fast') {
        setGameLoopMode(restoreAi)
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

  const castAiSnapshot = {
    lang: 'tr',
    scenario: 'solarcast_energy_sale_advice_v1',
    cityName,
    gameDay: day,
    simulatedHourLocal: hour,
    simulationRunning: isDayActive,
    inventory: {
      hasBatteryStorage,
      batteryCount: activeBatteries.length,
      panelCount: activePanels.length,
      batteryCapacityKwh: Math.round(batteryCapacity * 100) / 100,
      batteryFillPct,
      storedEnergyKwh: Math.round(currentEnergy * 1000) / 1000,
      dirtyPanelCount,
    },
    economics: {
      spotCoinPerKwhNow: Math.round(liveSpotCoinPerKwh * 100) / 100,
      spotCoinPerKwhNextSimHour: Math.round(
        getSpotEnergyPriceCoinPerKwh({
          day,
          hour: hour + 1,
          cityName,
        }) * 100,
      ) / 100,
      spotTrendHintVsPrevHour: liveTrend,
    },
    physicsHint: {
      forecastSlotAvailable24h: hasFullForecast,
      currentHourGti: typeof hourForecast?.gti_used === 'number' ? hourForecast.gti_used : null,
      weatherPhraseTr: cityWeatherLabel,
      tempApproxC: cityTemperature,
    },
  }

  const dashboardData = {
    inventory: {
      panelCount: activePanels.length,
      instantProductionKwh: Math.round(currentProductionKw * 100) / 100,
      batteryFillPct,
      storedEnergyKwh:
        Math.round(currentEnergy * 1000) / 1000,
      batteryCapacityKwh: batteryCapacity,
      batteryCount: activeBatteries.length,
      dirtyPanelCount,
    },
    city: {
      name: cityName,
      /** Referans panel (1 m² · %20): günlük toplam kWh (Open-Meteo eğimi); yoksa eski oyuncu yaklaşımı */
      potentialProductionLabel: dayForecastSummary ? 'Günlük ref. enerji (1 m²)' : 'Potansiyel üretim (tahmini)',
      potentialProductionKw: cityPotentialKwhDay,
      potentialProductionUnit: dayForecastSummary ? 'kWh' : 'kW/gün',
      sunHours: citySunHoursDisplay,
      sunHoursLabel: dayForecastSummary ? 'Güneşlenme (arşiv günü)' : 'Günlük güneş saati',
      weather: cityWeatherLabel,
      temperature: cityTemperature,
      efficiencyPct: cityEfficiencyPctLive,
      dataHint: hasFullForecast && dayForecastSummary
        ? isDayActive
          ? `Open-Meteo verisi`
          : `Open-Meteo verisi`
        : null,
      productionBadge: cityProductionBadge,
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

      <main className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6">
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
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs font-black mb-1">
                <span>Batarya seviyesi</span>
                <span>
                  {hasBatteryStorage ? (
                    <AnimatedNumber
                      value={dashboardData.inventory.batteryFillPct}
                      prefix="%"
                      integer
                      variant="tween"
                    />
                  ) : (
                    '—'
                  )}
                </span>
              </div>
              <div className="h-4 rounded-full border-3 border-slate-900 bg-background overflow-hidden">
                <AnimatedPctFill
                  active={hasBatteryStorage}
                  pct={dashboardData.inventory.batteryFillPct}
                  className={`h-full ${hasBatteryStorage ? 'bg-sprout-deep' : 'bg-shade/15'}`}
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
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
              <div className="rounded-xl border-3 border-slate-900 bg-background px-3 py-2 shadow-[2px_2px_0px_0px_var(--shade)]">
                <p className="text-xs font-black text-shade-2">{dashboardData.city.potentialProductionLabel}</p>
                <p className="text-lg font-black">
                  <AnimatedNumber value={dashboardData.city.potentialProductionKw} maxFractionDigits={2} />{' '}
                  {dashboardData.city.potentialProductionUnit}
                </p>
              </div>
              <div className="rounded-xl border-3 border-slate-900 bg-breeze/75 px-3 py-2 shadow-[2px_2px_0px_0px_var(--shade)]">
                <p className="text-xs font-black text-shade-2">{dashboardData.city.sunHoursLabel}</p>
                <p className="text-lg font-black">
                  <AnimatedNumber value={dashboardData.city.sunHours} maxFractionDigits={1} /> saat
                </p>
              </div>
              <div className="rounded-xl border-3 border-slate-900 bg-sprout/75 px-3 py-2 shadow-[2px_2px_0px_0px_var(--shade)]">
                <p className="text-xs font-black text-shade-2">Sıcaklık</p>
                <p className="text-lg font-black">
                  <AnimatedNumber value={dashboardData.city.temperature} maxFractionDigits={1} suffix="°C" />
                </p>
              </div>
              <div className="rounded-xl border-3 border-slate-900 bg-blossom/75 px-3 py-2 shadow-[2px_2px_0px_0px_var(--shade)]">
                <p className="text-xs font-black text-shade-2">Güncel hava</p>
                <p className="text-base font-black flex items-center gap-2 leading-tight">
                  <CloudSun className="w-5 h-5 shrink-0" />
                  {dashboardData.city.weather}
                </p>
              </div>
              <div className="rounded-xl border-3 border-slate-900 bg-sunlit-deep/90 px-3 py-2 shadow-[2px_2px_0px_0px_var(--shade)]">
                <p className="text-xs font-black text-shade-2">Verimlilik</p>
                <p className="text-lg font-black">
                  <AnimatedNumber value={dashboardData.city.efficiencyPct} prefix="%" integer variant="tween" />
                </p>
              </div>
            </div>
          </article>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            <article className="rounded-2xl border-4 border-slate-900 bg-sunlit p-4 shadow-[4px_4px_0px_0px_var(--shade)] hover:-translate-y-0.5 transition-transform duration-200 ease-out">
              <div className="flex items-center gap-2 mb-1.5 font-black text-sm text-shade-2">
                <SunMedium className="w-4 h-4" />
                Anlık üretim
              </div>
              <p className="text-2xl font-black">
                <AnimatedNumber value={dashboardData.inventory.instantProductionKwh} maxFractionDigits={2} /> kWh
              </p>
              <p className="text-xs font-black mt-1">
                Kirli panelde üretim ciddi düşer.
              </p>
            </article>
            <article className="rounded-2xl border-4 border-slate-900 bg-breeze p-4 shadow-[4px_4px_0px_0px_var(--shade)] hover:-translate-y-0.5 transition-transform duration-200 ease-out">
              <div className="flex items-center gap-2 mb-1.5 font-black text-sm text-shade-2">
                <BatteryCharging className="w-4 h-4" />
                Batarya doluluğu
              </div>
              <p className="text-2xl font-black">
                {hasBatteryStorage ? (
                  <AnimatedNumber
                    value={dashboardData.inventory.batteryFillPct}
                    prefix="%"
                    integer
                    variant="tween"
                  />
                ) : (
                  '—'
                )}
              </p>
              <p className="text-xs font-black mt-1">
                {hasBatteryStorage
                  ? `Toplam kapasite ${dashboardData.inventory.batteryCapacityKwh.toLocaleString('tr-TR')} kWh`
                  : 'Batarya yok — doluluk yalnızca depolama varken anlamlıdır.'}
              </p>
            </article>
            <article className="rounded-2xl border-4 border-slate-900 bg-sprout p-4 shadow-[4px_4px_0px_0px_var(--shade)] hover:-translate-y-0.5 transition-transform duration-200 ease-out">
              <div className="flex items-center gap-2 mb-1.5 font-black text-sm text-shade-2">
                <Zap className="w-4 h-4" />
                Depodaki enerji
              </div>
              <p className="text-2xl font-black">
                {hasBatteryStorage ? (
                  <>
                    <AnimatedNumber value={dashboardData.inventory.storedEnergyKwh} maxFractionDigits={2} /> kWh
                  </>
                ) : (
                  '—'
                )}
              </p>
              <p className="text-xs font-black mt-1">
                {hasBatteryStorage
                  ? 'Depolarda tutulan elektrik enerjisi'
                  : 'Depolama yok — üretilen enerji bataryaya yazılmaz.'}
              </p>
            </article>
            <article className="rounded-2xl border-4 border-slate-900 bg-blossom p-4 shadow-[4px_4px_0px_0px_var(--shade)] hover:-translate-y-0.5 transition-transform duration-200 ease-out">
              <div className="flex items-center gap-2 mb-1.5 font-black text-sm text-shade-2">
                <Gauge className="w-4 h-4" />
                Envanter özeti
              </div>
              <p className="text-2xl font-black">
                <AnimatedNumber value={dashboardData.inventory.panelCount} integer /> panel
              </p>
              <p className="text-xs font-black mt-1">
                Batarya:{' '}
                <AnimatedNumber value={dashboardData.inventory.batteryCount} integer className="font-black" /> / Kirli
                panel:{' '}
                <AnimatedNumber value={dashboardData.inventory.dirtyPanelCount} integer className="font-black" />
              </p>
            </article>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 xl:items-start">
            <div className="xl:col-span-8 space-y-3 min-w-0">
              <article className="rounded-2xl border-4 border-slate-900 bg-background p-4 shadow-[4px_4px_0px_0px_var(--shade)] min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="shrink-0 rounded-xl border-3 border-slate-900 bg-breeze p-2 shadow-[2px_2px_0px_0px_var(--shade)]">
                      <Cpu className="h-5 w-5" strokeWidth={2.25} aria-hidden />
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-black text-lg">Şehir Bilgisayarı</h2>
                      <p className="text-[11px] font-bold text-shade-2 mt-0.5">
                        {dashboardData.city.name} ağı · {dashboardData.city.dataHint || 'yerel güneş profili'}
                      </p>
                    </div>
                  </div>
                  <span className="self-start sm:self-auto rounded-full border-2 border-slate-900 bg-sunlit px-3 py-1 text-xs font-black text-center leading-tight">
                    {dashboardData.city.productionBadge}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="rounded-xl border-3 border-slate-900 bg-sunlit/70 px-3 py-2">
                    <p className="text-xs font-black text-shade-2">Aktif şehir</p>
                    <p className="text-lg font-black">{dashboardData.city.name}</p>
                  </div>
                  <div className="rounded-xl border-3 border-slate-900 bg-breeze/70 px-3 py-2">
                    <p className="text-xs font-black text-shade-2">Simülasyon saati</p>
                    <p className="text-lg font-black">{dashboardData.game.time}</p>
                  </div>
                  <div className="rounded-xl border-3 border-slate-900 bg-sprout/70 px-3 py-2">
                    <p className="text-xs font-black text-shade-2">Gün</p>
                    <p className="text-lg font-black">{dashboardData.game.day}</p>
                  </div>
                </div>
              </article>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <article className="rounded-2xl border-4 border-slate-900 bg-sunlit-deep p-4 shadow-[4px_4px_0px_0px_var(--shade)] min-w-0">
                  <h2 className="font-black text-base mb-2">Anlık enerji piyasası</h2>
                  <p className="text-[11px] font-bold text-shade-2 mb-1">
                    {isDayActive
                      ? `Gün içi kotasyon · ${String(hour).padStart(2, '0')}:00`
                      : 'Satış modalında fiyat kilitlenir'}
                  </p>
                  <p className="text-2xl font-black">
                    <AnimatedNumber
                      value={dashboardData.market.instantPrice}
                      minFractionDigits={2}
                      maxFractionDigits={2}
                    />{' '}
                    Coin/kWh
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div className="rounded-xl border-3 border-slate-900 bg-background/80 px-3 py-2">
                      <p className="text-[10px] font-black text-shade-2">Trend</p>
                      <p className="text-sm font-black">{dashboardData.market.trend}</p>
                    </div>
                    <div className="rounded-xl border-3 border-slate-900 bg-background/80 px-3 py-2">
                      <p className="text-[10px] font-black text-shade-2">Volatilite</p>
                      <p className="text-sm font-black">{dashboardData.market.volatility}</p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      disabled={!hasStartedGame}
                      onClick={openCastAiModal}
                      className="w-full rounded-2xl border-4 border-slate-900 bg-blossom/80 px-3 py-2 text-sm font-black shadow-[4px_4px_0px_0px_var(--shade)] transition-colors duration-150 active:translate-y-1 active:shadow-none hover:bg-blossom disabled:opacity-45 disabled:pointer-events-none"
                    >
                      CastAI’den sor ({CAST_AI_REQUEST_CREDITS} kredi)
                    </button>
                    <button
                      type="button"
                      disabled={!canOpenSellModal}
                      onClick={() => openSellModal()}
                      className="w-full rounded-2xl border-4 border-slate-900 bg-background px-3 py-2 text-sm font-black shadow-[4px_4px_0px_0px_var(--shade)] transition-colors duration-150 active:translate-y-1 active:shadow-none hover:bg-sunlit/70 disabled:cursor-not-allowed disabled:opacity-45 disabled:active:translate-y-0 disabled:active:shadow-[4px_4px_0px_0px_var(--shade)]"
                    >
                      Enerji sat
                    </button>
                  </div>
                  {!hasBatteryStorage && (
                    <p className="text-[11px] font-bold text-shade-2 mt-2">Depolama yok — önce batarya takın.</p>
                  )}
                </article>

                <article className="rounded-2xl border-4 border-slate-900 bg-breeze-deep p-4 shadow-[4px_4px_0px_0px_var(--shade)] min-w-0">
                  <h2 className="font-black text-base mb-2">Oyun İçi Zaman / Döngü</h2>
                  <p className="text-3xl font-black">
                    {isDayActive ? (
                      <AnimatedNumber
                        value={hour}
                        integer
                        padStartDigits={2}
                        suffix=":00"
                        variant="spring"
                        className="font-black"
                      />
                    ) : (
                      dashboardData.game.time
                    )}
                  </p>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                    <div className="rounded-xl border-3 border-slate-900 bg-background/75 px-3 py-2">
                      <p className="text-[10px] font-black text-shade-2">Döngü</p>
                      <p className="text-sm font-black">{dashboardData.game.cycle}</p>
                    </div>
                    <div className="rounded-xl border-3 border-slate-900 bg-sunlit/75 px-3 py-2">
                      <p className="text-[10px] font-black text-shade-2">Takvim</p>
                      <p className="text-sm font-black">{dashboardData.game.day}</p>
                    </div>
                  </div>
                </article>
              </div>
            </div>

            <DailyQuestsPanel className="xl:col-span-4 xl:sticky xl:top-24" />
          </div>
        </section>
      </main>

      <CastAiEnergyModal
        key={castAiNonce}
        isOpen={castAiModalOpen}
        onClose={closeCastAiModal}
        gameSnapshot={castAiSnapshot}
        geminiCredits={geminiCredits}
        spendGeminiCredits={spendGeminiCredits}
        canNavigateToSellFlow={canOpenSellModal}
        onNavigateToSell={navigateSellFromCastAi}
      />

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
                  <AnimatedNumber
                    value={frozenSpotCoinPerKwh}
                    minFractionDigits={2}
                    maxFractionDigits={2}
                  />{' '}
                  Coin/kWh
                </p>
              </div>
            </div>

            <div className="rounded-2xl border-3 border-slate-900 bg-background p-3 space-y-1">
              <p className="text-xs font-black text-shade-2">Şu an depoda</p>
              <p className="text-lg font-black">
                <AnimatedNumber value={currentEnergy} maxFractionDigits={1} /> kWh
              </p>
              <div className="h-3 rounded-full border-2 border-slate-900 bg-breeze overflow-hidden mt-2">
                <AnimatedPctFill
                  active={batteryCapacity > 0}
                  pct={
                    batteryCapacity > 0
                      ? Math.min(100, Math.round((currentEnergy / batteryCapacity) * 100))
                      : 0
                  }
                  className="h-full bg-sprout-deep"
                />
              </div>
            </div>

            <PercentSellSelector valuePct={sellPct} onChangePct={setSellPct} />

            <div className="rounded-2xl border-3 border-slate-900 bg-background/90 p-2 text-[10px] font-bold text-shade-2 leading-snug">
              İstersen gösterge panelinden önce CastAI’ye sor; sonra burada ne kadar satacağına yüzdeyle karar ver.
            </div>

            <div className="rounded-2xl border-3 border-slate-900 bg-sprout/50 p-3 space-y-1">
              <p className="text-xs font-black text-shade-2">Özet</p>
              <p className="text-sm font-black">
                ≈ <AnimatedNumber value={previewKwhSold} maxFractionDigits={2} /> kWh → ≈{' '}
                <AnimatedNumber value={previewCoinsEarned} integer /> Coin
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
