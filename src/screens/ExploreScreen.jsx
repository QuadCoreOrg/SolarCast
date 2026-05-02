import { motion } from 'framer-motion'
import { useState } from 'react'
import { BatteryCharging, Lock, SunMedium } from 'lucide-react'
import { RESEARCHES_BY_KEY } from '../constants/gameData'
import Header from '../components/Header'
import TabBar from '../components/TabBar'
import RESEARCH_UPGRADES from '../constants/researchUpgrades'
import useGameStore from '../store/useGameStore'

function ExploreScreen() {
  const setScreen = useGameStore((s) => s.setScreen)
  const coins = useGameStore((s) => s.coins)
  const level = useGameStore((s) => s.level)
  const research = useGameStore((s) => s.research)
  const buyItem = useGameStore((s) => s.buyItem)

  const [labErrorForKey, setLabErrorForKey] = useState(null)

  const renderUpgradeCard = (upgrade, type) => {
    const def = RESEARCHES_BY_KEY[upgrade.storeKey]
    const requiredLevel = def?.reqLevel ?? 99
    const price = def?.price ?? 0
    const label = def?.name ?? 'Araştırma'

    const isUnlocked = Boolean(research?.[upgrade.key])
    const meetsLevel = level >= requiredLevel
    const isLocked = !isUnlocked && !meetsLevel
    const canAfford = coins >= price
    const Icon = type === 'panel' ? SunMedium : BatteryCharging

    const tryPurchase = () => {
      setLabErrorForKey(null)
      const result = buyItem('research', upgrade.storeKey)
      if (!result.ok) setLabErrorForKey({ key: upgrade.key, msg: result.reason || 'Satın alınamadı.' })
    }

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
            <div className="text-right shrink-0">
              <span className="rounded-full border-2 border-slate-900 bg-background px-2.5 py-1 text-xs font-black">
                En az Lv. {requiredLevel}
              </span>
              {!isLocked && (
                <p className="mt-1 text-[11px] font-black text-shade-2">{price.toLocaleString('tr-TR')} Coin</p>
              )}
            </div>
          )}
        </div>

        <p className="font-black text-lg leading-tight">{label}</p>
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
              <p className="font-bold text-xs text-shade-2 mt-1">Önce en az Lv. {requiredLevel} olmalısın.</p>
              <p className="font-bold text-[11px] text-shade-soft mt-2">
                Açılınca lisans ücreti: {price.toLocaleString('tr-TR')} Coin
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-xl border-3 border-slate-900 bg-background/95 px-3 py-2 mb-2">
                <p className="text-[11px] font-black uppercase tracking-wide text-shade-soft">Laboratuvar maliyeti</p>
                <p className="font-black text-base tabular-nums">{price.toLocaleString('tr-TR')} Coin</p>
              </div>
              {labErrorForKey?.key === upgrade.key && (
                <p className="mb-2 text-xs font-bold text-rose-800">{labErrorForKey.msg}</p>
              )}
              <motion.button
                type="button"
                disabled={!canAfford}
                whileHover={{ scale: canAfford ? 1.02 : 1 }}
                whileTap={{ scale: canAfford ? 0.98 : 1 }}
                onClick={() => tryPurchase()}
                className={`w-full rounded-xl border-4 border-slate-900 px-3 py-2.5 font-black text-sm shadow-[3px_3px_0px_0px_var(--shade)] ${
                  canAfford ? 'bg-sunlit-deep cursor-pointer' : 'bg-border text-shade-2 opacity-85 cursor-not-allowed'
                }`}
              >
                {canAfford ? `${price.toLocaleString('tr-TR')} Coin öde — Aç` : 'Yetersiz coin'}
              </motion.button>
            </>
          )}
        </div>
      </article>
    )
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
          <article className="rounded-3xl border-4 border-slate-900 bg-background p-5 shadow-[6px_6px_0px_0px_var(--shade)]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="font-black text-xs text-shade-2">Araştırma Laboratuvarı</p>
                <h1 className="font-black text-3xl">Araştırma Geliştirmeleri</h1>
                <p className="font-bold text-sm text-shade-2 mt-1 leading-relaxed">
                  Her araştırma hem seviye hem de küçük bir Coin lisansı ile açılır; fiyatlar{' '}
                  <span className="font-black">gameData.js</span> ile tutarlıdır.
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
      </motion.main>

      <TabBar activeScreen="research" onChange={setScreen} />
    </div>
  )
}

export default ExploreScreen
