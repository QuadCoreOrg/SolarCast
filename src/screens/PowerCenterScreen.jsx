import { motion } from 'framer-motion'
import { Compass, Gauge, Settings, Store, Zap } from 'lucide-react'
import useGameStore from '../store/useGameStore'
import Header from '../components/Header'
import PowerHub from '../components/PowerHub'

function PowerCenterScreen() {
  const setScreen = useGameStore((s) => s.setScreen)
  const coins = useGameStore((s) => s.coins)
  const level = useGameStore((s) => s.level)
  const inventory = useGameStore((s) => s.inventory)
  const maxSlots = useGameStore((s) => s.maxSlots)
  const filledSlots = inventory.length

  const openUpgradeModal = (itemId) => {
    console.log('openUpgradeModal:', itemId)
  }

  const openMarketModal = () => {
    console.log('openMarketModal')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-screen bg-breeze flex flex-col font-['Nunito'] text-shade overflow-hidden"
    >
      <Header coins={coins} level={level} />

      <main className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6">
        <section className="max-w-6xl mx-auto space-y-4">
          <article className="rounded-2xl border-4 border-slate-900 bg-background p-4 shadow-[4px_4px_0px_0px_var(--shade)]">
            <div className="flex items-center justify-between mb-3">
              <h1 className="font-black text-2xl">Güç Merkezi</h1>
              <span className="rounded-full border-2 border-slate-900 bg-breeze px-3 py-1 text-xs font-black">
                {filledSlots}/{maxSlots} Yuva Dolu
              </span>
            </div>
            <PowerHub openUpgradeModal={openUpgradeModal} openMarketModal={openMarketModal} />
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
            Gösterge Paneli
          </button>
          <button
            type="button"
            onClick={() => setScreen('power_center')}
            className="shrink-0 flex items-center justify-center gap-2 rounded-2xl border-4 border-slate-900 bg-breeze-deep px-4 py-2.5 font-black text-shade shadow-[4px_4px_0px_0px_var(--shade)] cursor-pointer whitespace-nowrap transition-colors hover:brightness-95"
          >
            <Zap className="w-5 h-5 text-current" fill="currentColor" strokeWidth={0} />
            Güç Merkezi
          </button>
          <button
            type="button"
            onClick={() => setScreen('market')}
            className="shrink-0 flex items-center justify-center gap-2 rounded-2xl border-4 border-slate-900 bg-sprout px-4 py-2.5 font-black text-shade shadow-[4px_4px_0px_0px_var(--shade)] cursor-pointer whitespace-nowrap transition-colors hover:bg-sprout-deep"
          >
            <Store className="w-5 h-5 text-current" strokeWidth={2.25} />
            Mağaza
          </button>
          <button
            type="button"
            className="shrink-0 flex items-center justify-center gap-2 rounded-2xl border-4 border-slate-900 bg-blossom px-4 py-2.5 font-black text-shade shadow-[4px_4px_0px_0px_var(--shade)] cursor-pointer whitespace-nowrap transition-colors hover:bg-blossom-deep"
          >
            <Compass className="w-5 h-5 text-current" strokeWidth={2.25} />
            Keşif
          </button>
          <button
            type="button"
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

export default PowerCenterScreen
