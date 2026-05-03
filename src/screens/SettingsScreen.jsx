import { motion } from 'framer-motion'
import { Bug, Mail, RotateCcw, Settings } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import GAME_CONFIG from '../config/gameConfig'
import useGameStore from '../store/useGameStore'
import Header from '../components/Header'
import TabBar from '../components/TabBar'
import useSoundStore from '../store/useSoundStore'

function SettingsScreen() {
  const setScreen = useGameStore((s) => s.setScreen)
  const resetGame = useGameStore((s) => s.resetGame)
  const addCoins = useGameStore((s) => s.addCoins)
  const addExperience = useGameStore((s) => s.addExperience)
  const debugMsPerSimHourOverride = useGameStore((s) => s.debugMsPerSimHourOverride)
  const setDebugMsPerSimHourOverride = useGameStore((s) => s.setDebugMsPerSimHourOverride)
  const coins = useGameStore((s) => s.coins)
  const level = useGameStore((s) => s.level)
  const masterVolume = useSoundStore((s) => s.masterVolume)
  const setMasterVolume = useSoundStore((s) => s.setMasterVolume)

  const [searchParams] = useSearchParams()
  const debugParam = searchParams.get('debug')
  const showDebugTools = debugParam != null && debugParam.toLowerCase() === 'true'

  const { msPerSimulatedHour, debugMsPerSimHourMin, debugMsPerSimHourMax } =
    GAME_CONFIG.gameLoop
  const lo = debugMsPerSimHourMin ?? 200
  const hi = debugMsPerSimHourMax ?? 12000
  const sliderMs =
    typeof debugMsPerSimHourOverride === 'number' ? debugMsPerSimHourOverride : msPerSimulatedHour
  const approxDaySec = Math.round(((sliderMs * 24) / 1000) * 10) / 10
  const defaultDaySec = Math.round(((msPerSimulatedHour * 24) / 1000) * 10) / 10

  const handleResetGame = () => {
    const ok = window.confirm(
      'Tüm ilerlemen silinecek; oyun en baştan (şehir seçimi dahil) başlayacak. Emin misin?',
    )
    if (!ok) return
    resetGame()
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
        <section className="max-w-5xl mx-auto space-y-4">
          <article className="rounded-2xl border-4 border-slate-900 bg-blossom p-4 sm:p-5 shadow-[5px_5px_0px_0px_var(--shade)]">
            <div className="flex items-center gap-2">
              <Settings className="w-6 h-6" strokeWidth={2.25} />
              <h1 className="text-2xl font-black">Ayarlar</h1>
            </div>
            <p className="mt-2 text-sm font-bold text-shade-2">
              Oyun sesini tek merkezden kolayca yönet.
            </p>
          </article>

          <article className="rounded-2xl border-4 border-slate-900 bg-background p-4 sm:p-5 shadow-[5px_5px_0px_0px_var(--shade)]">
            <h2 className="font-black text-lg mb-3">Ses Ayarları</h2>
            <div className="rounded-xl border-3 border-slate-900 bg-background p-3">
              <div className="mb-2 flex items-center justify-between text-sm font-black">
                <span>Global Ses</span>
                <span>%{masterVolume}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={masterVolume}
                onChange={(event) => setMasterVolume(Number(event.target.value))}
                className="w-full h-3 cursor-pointer appearance-none rounded-full border-2 border-slate-900"
                aria-label="Global Ses"
                style={{
                  background: `linear-gradient(to right, #f6c944 0%, #f6c944 ${masterVolume}%, #fffdf7 ${masterVolume}%, #fffdf7 100%)`,
                }}
              />
            </div>
          </article>

          <article className="rounded-2xl border-4 border-slate-900 bg-sunlit/30 p-4 sm:p-5 shadow-[5px_5px_0px_0px_var(--shade)]">
            <h2 className="font-black text-lg mb-2 flex items-center gap-2">
              <RotateCcw className="w-5 h-5" aria-hidden />
              Oyunu sıfırla
            </h2>
            <p className="text-sm font-bold text-shade-2 mb-3">
              Coin, seviye, envanter ve ilerlemen silinir; karşılama ve şehir seçiminden yeniden başlarsın.
            </p>
            <button
              type="button"
              onClick={handleResetGame}
              className="w-full sm:w-auto rounded-xl border-3 border-slate-900 bg-blossom px-4 py-2.5 text-sm font-black shadow-[4px_4px_0px_0px_var(--shade)] hover:bg-[#ffb3b8] transition-colors"
            >
              Oyunu sıfırla
            </button>
          </article>

          {showDebugTools ? (
            <article className="rounded-2xl border-4 border-dashed border-amber-800 bg-amber-50 p-4 sm:p-5 shadow-[5px_5px_0px_0px_var(--shade)]">
              <h2 className="font-black text-lg mb-2 flex items-center gap-2 text-amber-950">
                <Bug className="w-5 h-5 shrink-0" aria-hidden />
                Debug
              </h2>
              <p className="text-xs font-bold text-amber-900/80 mb-3">
                Bu bölüm yalnızca adres çubuğunda{' '}
                <code className="rounded bg-white/70 px-1">?debug=true</code> olduğunda görünür (örn.{' '}
                <code className="rounded bg-white/70 px-1">/play?debug=true</code>).
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => addCoins(2500)}
                  className="rounded-xl border-3 border-slate-900 bg-background px-3 py-2 text-sm font-black shadow-[3px_3px_0px_0px_var(--shade)] hover:bg-white transition-colors"
                >
                  +2500 coin
                </button>
                <button
                  type="button"
                  onClick={() => addExperience(750)}
                  className="rounded-xl border-3 border-slate-900 bg-background px-3 py-2 text-sm font-black shadow-[3px_3px_0px_0px_var(--shade)] hover:bg-white transition-colors"
                >
                  +750 XP
                </button>
              </div>

              <div className="mt-4 rounded-xl border-3 border-slate-900/50 bg-white/60 p-3">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-sm font-black text-amber-950">
                  <span>Oyun günü süresi (sim hızı)</span>
                  <span className="text-xs font-black text-amber-900/85">
                    ~{approxDaySec} sn/gün (1 sim saat = {sliderMs} ms)
                  </span>
                </div>
                <p className="mb-3 text-xs font-bold text-amber-900/75">
                  Normal oyun: varsayılan{' '}
                  <span className="whitespace-nowrap">~{defaultDaySec} sn/gün</span>. Kaydırıcıyı sola çekince
                  gün daha hızlı geçer, sağa çekince daha yavaşlar.
                </p>
                <input
                  type="range"
                  min={lo}
                  max={hi}
                  step={100}
                  value={sliderMs}
                  onChange={(e) => setDebugMsPerSimHourOverride(Number(e.target.value))}
                  className="mb-3 w-full h-3 cursor-pointer appearance-none rounded-full border-2 border-slate-900"
                  aria-label="Simülasyon saati süresi milisaniye"
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setDebugMsPerSimHourOverride(null)}
                    className="rounded-xl border-3 border-slate-900 bg-background px-3 py-2 text-xs font-black shadow-[3px_3px_0px_0px_var(--shade)] hover:bg-white transition-colors"
                  >
                    Varsayılan ({defaultDaySec} sn/gün)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDebugMsPerSimHourOverride(3000)}
                    className="rounded-xl border-3 border-slate-900 bg-background px-3 py-2 text-xs font-black shadow-[3px_3px_0px_0px_var(--shade)] hover:bg-white transition-colors"
                  >
                    Yavaşlat (72 sn/gün)
                  </button>
                </div>
              </div>
            </article>
          ) : null}

          <article className="rounded-2xl border-4 border-slate-900 bg-breeze p-4 sm:p-5 shadow-[5px_5px_0px_0px_var(--shade)]">
            <h2 className="font-black text-lg mb-2">Bize Ulaşın</h2>
            <p className="text-sm font-bold text-shade-2 mb-3">
              Öneri ve destek taleplerini ekibimize iletebilirsin.
            </p>
            <div className="grid grid-cols-1 gap-2">
              <a
                href="mailto:recepdr1906@gmail.com"
                className="flex items-center gap-2 rounded-xl border-3 border-slate-900 bg-background px-3 py-2 font-black text-sm shadow-[3px_3px_0px_0px_var(--shade)] hover:bg-sunlit transition-colors"
              >
                <Mail className="w-4 h-4" />
                recepdr1906@gmail.com
              </a>
            </div>
          </article>
        </section>
      </motion.main>

      <TabBar activeScreen="settings" onChange={setScreen} />
    </div>
  )
}

export default SettingsScreen
