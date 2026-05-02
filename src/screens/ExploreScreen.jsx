import { motion } from 'framer-motion'
import { BatteryCharging, Compass, Gauge, Lock, Settings, Store, SunMedium, Zap } from 'lucide-react'
import Header from '../components/Header'
import RESEARCH_UPGRADES from '../constants/researchUpgrades'
import useGameStore from '../store/useGameStore'

function ExploreScreen() {
  const setScreen = useGameStore((s) => s.setScreen)
  const coins = useGameStore((s) => s.coins)
  const level = useGameStore((s) => s.level)
  const research = useGameStore((s) => s.research)
  const unlockResearch = useGameStore((s) => s.unlockResearch)

  const renderUpgradeCard = (upgrade, type) => {
    const isUnlocked = Boolean(research?.[upgrade.key])
    const meetsLevel = level >= upgrade.requiredLevel
    const isLocked = !isUnlocked && !meetsLevel
    const Icon = type === 'panel' ? SunMedium : BatteryCharging

    return (
      <article
        key={upgrade.key}
        className={`relative overflow-hidden rounded-2xl border-4 p-4 shadow-[4px_4px_0px_0px_var(--shade)] ${
          isUnlocked ? 'bg-sprout border-slate-900' : isLocked ? 'bg-border border-slate-900' : 'bg-sunlit border-slate-900'
        }`}
      >
        {isLocked && <div className="absolute inset-0 bg-shade/25 pointer-events-none" />}

        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="w-12 h-12 rounded-xl border-4 border-slate-900 bg-background flex items-center justify-center shrink-0">
            <Icon className="w-6 h-6" strokeWidth={2.25} />
          </div>
          {isUnlocked ? (
            <span className="rounded-full border-2 border-slate-900 bg-sprout-deep px-2.5 py-1 text-xs font-black">
              Aktif
            </span>
          ) : (
            <span className="rounded-full border-2 border-slate-900 bg-background px-2.5 py-1 text-xs font-black">
              Lv. {upgrade.requiredLevel}
            </span>
          )}
        </div>

        <p className="font-black text-lg leading-tight">{upgrade.name}</p>
        <p className="font-bold text-sm text-shade-2 mt-2 min-h-[58px]">{upgrade.benefit}</p>

        <div className="mt-3">
          {isUnlocked ? (
            <div className="rounded-xl border-3 border-slate-900 bg-background px-3 py-2 text-center font-black text-sm">
              Araştırma Tamamlandı
            </div>
          ) : isLocked ? (
            <div className="rounded-xl border-3 border-slate-900 bg-background px-3 py-2">
              <p className="font-black text-sm flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Kilitli
              </p>
              <p className="font-bold text-xs text-shade-2 mt-1">Açmak için en az Lv. {upgrade.requiredLevel} olmalısın.</p>
            </div>
          ) : (
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => unlockResearch(upgrade.key)}
              className="w-full rounded-xl border-4 border-slate-900 bg-sunlit-deep px-3 py-2.5 font-black text-sm shadow-[3px_3px_0px_0px_var(--shade)] cursor-pointer"
            >
              Araştırmayı Aç
            </motion.button>
          )}
        </div>
      </article>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      className="h-screen bg-breeze flex flex-col font-['Nunito'] text-shade overflow-hidden"
    >
      <Header coins={coins} level={level} />

      <main className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6">
        <section className="max-w-6xl mx-auto space-y-4">
          <article className="rounded-3xl border-4 border-slate-900 bg-background p-5 shadow-[6px_6px_0px_0px_var(--shade)]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="font-black text-xs text-shade-2">Araştırma Laboratuvarı</p>
                <h1 className="font-black text-3xl">Araştırma Geliştirmeleri</h1>
                <p className="font-bold text-sm text-shade-2 mt-1">
                  Yeni teknolojileri açarak panel ve batarya verimini artır.
                </p>
              </div>
              <span className="rounded-full border-3 border-slate-900 bg-breeze px-4 py-2 font-black text-sm">
                Mevcut Seviye: Lv. {level}
              </span>
            </div>
          </article>

          <section className="rounded-2xl border-4 border-slate-900 bg-background p-4 shadow-[4px_4px_0px_0px_var(--shade)]">
            <h2 className="font-black text-xl mb-3">Panel Geliştirmeleri</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {RESEARCH_UPGRADES.panel.map((upgrade) => renderUpgradeCard(upgrade, 'panel'))}
            </div>
          </section>

          <section className="rounded-2xl border-4 border-slate-900 bg-background p-4 shadow-[4px_4px_0px_0px_var(--shade)]">
            <h2 className="font-black text-xl mb-3">Batarya Geliştirmeleri</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {RESEARCH_UPGRADES.battery.map((upgrade) => renderUpgradeCard(upgrade, 'battery'))}
            </div>
          </section>
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
            onClick={() => setScreen('research')}
            className="shrink-0 flex items-center justify-center gap-2 rounded-2xl border-4 border-slate-900 bg-blossom px-4 py-2.5 font-black text-shade shadow-[4px_4px_0px_0px_var(--shade)] cursor-pointer whitespace-nowrap transition-colors hover:bg-blossom-deep"
          >
            <Compass className="w-5 h-5 text-current" strokeWidth={2.25} />
            Araştırma
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

export default ExploreScreen
