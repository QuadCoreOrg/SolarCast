import { motion } from 'framer-motion'
import { Compass, Gauge, Mail, Settings, Store, Zap } from 'lucide-react'
import useGameStore from '../store/useGameStore'
import Header from '../components/Header'
import useSoundStore from '../store/useSoundStore'

function SettingsScreen() {
  const setScreen = useGameStore((s) => s.setScreen)
  const coins = useGameStore((s) => s.coins)
  const level = useGameStore((s) => s.level)
  const masterVolume = useSoundStore((s) => s.masterVolume)
  const setMasterVolume = useSoundStore((s) => s.setMasterVolume)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-screen bg-background flex flex-col font-['Nunito'] text-shade overflow-hidden"
    >
      <Header coins={coins} level={level} />

      <main className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6">
        <section className="max-w-5xl mx-auto space-y-4">
          <article className="rounded-2xl border-4 border-slate-900 bg-blossom p-4 sm:p-5 shadow-[5px_5px_0px_0px_var(--shade)]">
            <div className="flex items-center gap-2">
              <Settings className="w-6 h-6" strokeWidth={2.25} />
              <h1 className="text-2xl font-black">Ayarlar</h1>
            </div>
            <p className="mt-2 text-sm font-bold text-shade-2">
              Oyun sesini tek merkezden kolayca yonet.
            </p>
          </article>

          <article className="rounded-2xl border-4 border-slate-900 bg-background p-4 sm:p-5 shadow-[5px_5px_0px_0px_var(--shade)]">
            <h2 className="font-black text-lg mb-3">Ses Ayarlari</h2>
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

          <article className="rounded-2xl border-4 border-slate-900 bg-breeze p-4 sm:p-5 shadow-[5px_5px_0px_0px_var(--shade)]">
            <h2 className="font-black text-lg mb-2">Bize Ulasin</h2>
            <p className="text-sm font-bold text-shade-2 mb-3">
              Oneri ve destek taleplerini ekibimize iletebilirsin.
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
      </main>

      <nav className="shrink-0 border-t-4 border-slate-900 bg-background p-3">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setScreen('dashboard')}
            className="shrink-0 flex items-center justify-center gap-2 rounded-2xl border-4 border-slate-900 bg-sunlit px-4 py-2.5 font-black text-shade shadow-[4px_4px_0px_0px_var(--shade)] cursor-pointer whitespace-nowrap transition-colors hover:bg-sunlit-deep"
          >
            <Gauge className="w-5 h-5 text-current" strokeWidth={2.25} />
            Gosterge Paneli
          </button>
          <button
            type="button"
            onClick={() => setScreen('power_center')}
            className="shrink-0 flex items-center justify-center gap-2 rounded-2xl border-4 border-slate-900 bg-breeze-deep px-4 py-2.5 font-black text-shade shadow-[4px_4px_0px_0px_var(--shade)] cursor-pointer whitespace-nowrap transition-colors hover:brightness-95"
          >
            <Zap className="w-5 h-5 text-current" fill="currentColor" strokeWidth={0} />
            Guc Merkezi
          </button>
          <button
            type="button"
            onClick={() => setScreen('market')}
            className="shrink-0 flex items-center justify-center gap-2 rounded-2xl border-4 border-slate-900 bg-sprout px-4 py-2.5 font-black text-shade shadow-[4px_4px_0px_0px_var(--shade)] cursor-pointer whitespace-nowrap transition-colors hover:bg-sprout-deep"
          >
            <Store className="w-5 h-5 text-current" strokeWidth={2.25} />
            Magaza
          </button>
          <button
            type="button"
            className="shrink-0 flex items-center justify-center gap-2 rounded-2xl border-4 border-slate-900 bg-blossom px-4 py-2.5 font-black text-shade shadow-[4px_4px_0px_0px_var(--shade)] cursor-pointer whitespace-nowrap transition-colors hover:bg-blossom-deep"
          >
            <Compass className="w-5 h-5 text-current" strokeWidth={2.25} />
            Kesif
          </button>
          <button
            type="button"
            onClick={() => setScreen('settings')}
            className="shrink-0 flex items-center justify-center gap-2 rounded-2xl border-4 border-slate-900 bg-sunlit-deep px-4 py-2.5 font-black text-shade shadow-[4px_4px_0px_0px_var(--shade)] cursor-pointer whitespace-nowrap transition-colors hover:brightness-105"
          >
            <Settings className="w-5 h-5 text-current" strokeWidth={2.25} />
            Ayarlar
          </button>
        </div>
      </nav>
    </motion.div>
  )
}

export default SettingsScreen
