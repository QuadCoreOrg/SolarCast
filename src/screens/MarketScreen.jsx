import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { BatteryCharging, Compass, FlaskConical, Lock, ShoppingCart, SunMedium } from 'lucide-react'
import Modal from '../components/Modal'
import Header from '../components/Header'
import TabBar from '../components/TabBar'
import {
  BATTERIES,
  PANELS,
  RESEARCHES,
} from '../constants/gameData'
import useGameStore from '../store/useGameStore'

const researchLabelById = Object.fromEntries(
  Object.values(RESEARCHES).map((r) => [r.id, r.name]),
)

function lockState(def, level, unlockedResearchIds) {
  const lacksLevel = def.reqLevel != null && level < def.reqLevel
  const lacksResearch =
    Boolean(def.reqResearch) && !unlockedResearchIds.includes(def.reqResearch)
  const isLocked = lacksLevel || lacksResearch
  return {
    isLocked,
    researchLabel: def.reqResearch ? researchLabelById[def.reqResearch] ?? def.reqResearch : null,
    levelLabel: def.reqLevel != null ? `En az Lv.${def.reqLevel}` : null,
  }
}

function MarketScreen() {
  const setScreen = useGameStore((s) => s.setScreen)
  const coins = useGameStore((s) => s.coins)
  const level = useGameStore((s) => s.level)
  const unlockedResearches = useGameStore((s) => s.unlockedResearches)
  const buyItem = useGameStore((s) => s.buyItem)

  const [selectedProduct, setSelectedProduct] = useState(null)
  const [buyError, setBuyError] = useState('')

  const panelProducts = useMemo(
    () =>
      Object.entries(PANELS).map(([gameKey, def]) => {
        const locks = lockState(def, level, unlockedResearches)
        const outputKwhRounded = Math.round(def.area * 100) / 100
        return {
          id: def.id,
          category: 'panel',
          gameKey,
          name: def.name,
          price: def.price,
          isLocked: locks.isLocked,
          requiredResearchLabel: locks.researchLabel,
          reqLevelLabel: locks.levelLabel,
          description:
            `${def.area} m² panel yüzeyi; tepe güneşte yaklaşık +${outputKwhRounded.toLocaleString('tr-TR')} kWh.` +
            ' Kirliyken üretim %75 düşer.',
          displayOutput: `${outputKwhRounded.toLocaleString('tr-TR')} kWh (tepe güneş)`,
        }
      }),
    [level, unlockedResearches],
  )

  const batteryProducts = useMemo(
    () =>
      Object.entries(BATTERIES).map(([gameKey, def]) => {
        const locks = lockState(def, level, unlockedResearches)
        return {
          id: def.id,
          category: 'battery',
          gameKey,
          name: def.name,
          price: def.price,
          capacityKwh: def.capacity,
          isLocked: locks.isLocked,
          requiredResearchLabel: locks.researchLabel,
          reqLevelLabel: locks.levelLabel,
          description:
            `${def.capacity.toLocaleString('tr-TR')} kWh depolama. Birden fazla batarya kapasiteniz toplanır.`,
        }
      }),
    [level, unlockedResearches],
  )

  const researchProducts = useMemo(
    () =>
      Object.entries(RESEARCHES).map(([gameKey, def]) => {
        const alreadyOwned = unlockedResearches.includes(def.id)
        const needsLevel = def.reqLevel != null && level < def.reqLevel
        return {
          id: def.id,
          category: 'research',
          gameKey,
          name: def.name,
          price: def.price,
          alreadyOwned,
          isLocked: needsLevel,
          reqLevelLabel: def.reqLevel != null ? `En az Lv.${def.reqLevel}` : null,
          description:
            'Laboratuvar lisansı: ilgili panel ve batarya teknolojilerini Pazarda kullanılabilir hale getirir.',
        }
      }),
    [level, unlockedResearches],
  )

  const handleOpenProduct = (product) => {
    setBuyError('')
    setSelectedProduct(product)
  }

  const handlePurchase = () => {
    if (!selectedProduct || selectedProduct.isLocked) return
    let result
    if (selectedProduct.category === 'research') {
      result = buyItem('research', selectedProduct.gameKey)
    } else {
      const category = selectedProduct.category === 'panel' ? 'panel' : 'battery'
      result = buyItem(category, selectedProduct.gameKey)
    }
    if (!result.ok) {
      setBuyError(result.reason || 'Satın alma başarısız.')
      return
    }
    setSelectedProduct(null)
    setBuyError('')
  }

  return (
    <div className="h-screen bg-breeze flex flex-col font-['Nunito'] text-shade overflow-hidden">
      <Header coins={coins} level={level} />

      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="max-w-6xl w-full mx-auto flex-1 min-h-0 flex flex-col gap-4 p-4 sm:p-6"
      >
        <div className="shrink-0 flex items-center justify-between rounded-2xl border-4 border-slate-900 bg-breeze p-4 shadow-[4px_4px_0px_0px_var(--shade)]">
          <div>
            <h1 className="font-black text-2xl">Mağaza</h1>
            <p className="font-bold text-sm text-shade-2 leading-relaxed">
              Paneller, depolar ve araştırma fiyatları tek kaynak:{' '}
              <span className="font-black">gameData.js</span>
            </p>
          </div>
          <span className="rounded-full border-2 border-slate-900 bg-background px-3 py-1 text-xs font-black">
            Market Fiyatları Güncel
          </span>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-1">
          <section className="rounded-2xl border-4 border-slate-900 bg-background p-4 shadow-[4px_4px_0px_0px_var(--shade)]">
            <h2 className="font-black text-xl mb-3">Güneş Panelleri</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {panelProducts.map((product) => (
                <motion.button
                  key={product.id}
                  type="button"
                  onClick={() => handleOpenProduct(product)}
                  whileHover={{ y: -3, scale: 1.01 }}
                  whileTap={{ y: 0, scale: 0.98 }}
                  className={`relative overflow-hidden rounded-2xl border-4 p-4 text-left shadow-[4px_4px_0px_0px_var(--shade)] transition-colors cursor-pointer ${
                    product.isLocked
                      ? 'border-slate-900 bg-border/80'
                      : 'border-slate-900 bg-sunlit'
                  }`}
                >
                  {product.isLocked && (
                    <div className="absolute inset-0 bg-shade/25 pointer-events-none" />
                  )}
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl border-4 border-slate-900 bg-background flex items-center justify-center">
                      <SunMedium className="w-6 h-6" strokeWidth={2.25} />
                    </div>
                    {product.isLocked && (
                      <span className="inline-flex items-center gap-1 rounded-full border-3 border-slate-900 bg-blossom px-2.5 py-1 text-xs font-black shadow-[2px_2px_0px_0px_var(--shade)]">
                        <Lock className="w-3.5 h-3.5" />
                        Kilitli
                      </span>
                    )}
                  </div>
                  <p className="font-black text-lg leading-tight">{product.name}</p>
                  <p className="font-bold text-sm text-shade-2 mt-1">
                    Güç göstergesi: +{product.displayOutput}
                  </p>
                  <p className="font-black text-base mt-3">
                    {product.price.toLocaleString('tr-TR')} Coin
                  </p>
                  {product.isLocked && (
                    <div className="mt-3 rounded-lg border-2 border-slate-900 bg-background/95 px-2.5 py-1.5 space-y-1">
                      <p className="text-xs font-black text-shade">Kilit Nedeni</p>
                      {product.reqLevelLabel && (
                        <p className="text-[11px] font-bold text-shade-2">{product.reqLevelLabel}</p>
                      )}
                      {product.requiredResearchLabel && (
                        <p className="text-[11px] font-bold text-shade-2">
                          Araştırma: {product.requiredResearchLabel}
                        </p>
                      )}
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border-4 border-slate-900 bg-background p-4 shadow-[4px_4px_0px_0px_var(--shade)]">
            <h2 className="font-black text-xl mb-3">Araştırma Lisansları</h2>
            <p className="font-bold text-xs text-shade-2 mb-3">
              Seviye uygun olduğunda Coin ile satın al; aynı lisansları Araştırma sekmesinden de alabilirsin.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
              {researchProducts.map((product) => (
                <motion.button
                  key={product.id}
                  type="button"
                  onClick={() => handleOpenProduct(product)}
                  whileHover={{ y: -3, scale: 1.01 }}
                  whileTap={{ y: 0, scale: 0.98 }}
                  className={`relative overflow-hidden rounded-2xl border-4 p-4 text-left shadow-[4px_4px_0px_0px_var(--shade)] transition-colors cursor-pointer ${
                    product.alreadyOwned
                      ? 'border-slate-900 bg-sprout/45'
                      : product.isLocked
                        ? 'border-slate-900 bg-border/80'
                        : 'border-slate-900 bg-blossom'
                  }`}
                >
                  {(product.isLocked || product.alreadyOwned) && (
                    <div className="absolute inset-0 bg-shade/15 pointer-events-none" />
                  )}
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl border-4 border-slate-900 bg-background flex items-center justify-center">
                      <FlaskConical className="w-6 h-6" strokeWidth={2.25} />
                    </div>
                    {product.alreadyOwned ? (
                      <span className="inline-flex items-center gap-1 rounded-full border-3 border-slate-900 bg-sprout-deep px-2.5 py-1 text-xs font-black shadow-[2px_2px_0px_0px_var(--shade)]">
                        Aktif
                      </span>
                    ) : (
                      product.isLocked && (
                        <span className="inline-flex items-center gap-1 rounded-full border-3 border-slate-900 bg-blossom px-2.5 py-1 text-xs font-black shadow-[2px_2px_0px_0px_var(--shade)]">
                          <Lock className="w-3.5 h-3.5" />
                          Kilitli
                        </span>
                      )
                    )}
                  </div>
                  <p className="font-black text-lg leading-tight">{product.name}</p>
                  <p className="font-bold text-sm text-shade-2 mt-1 leading-snug">Laboratuvar lisansı</p>
                  <p className="font-black text-base mt-3">
                    {product.price.toLocaleString('tr-TR')} Coin
                  </p>
                  {product.isLocked && product.reqLevelLabel && (
                    <div className="mt-3 rounded-lg border-2 border-slate-900 bg-background/95 px-2.5 py-1.5">
                      <p className="text-xs font-black text-shade">Kilit Nedeni</p>
                      <p className="text-[11px] font-bold text-shade-2">{product.reqLevelLabel}</p>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border-4 border-slate-900 bg-background p-4 shadow-[4px_4px_0px_0px_var(--shade)]">
            <h2 className="font-black text-xl mb-3">Depolama Üniteleri</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {batteryProducts.map((product) => (
                <motion.button
                  key={product.id}
                  type="button"
                  onClick={() => handleOpenProduct(product)}
                  whileHover={{ y: -3, scale: 1.01 }}
                  whileTap={{ y: 0, scale: 0.98 }}
                  className={`relative overflow-hidden rounded-2xl border-4 p-4 text-left shadow-[4px_4px_0px_0px_var(--shade)] transition-colors cursor-pointer ${
                    product.isLocked
                      ? 'border-slate-900 bg-border/80'
                      : 'border-slate-900 bg-sprout'
                  }`}
                >
                  {product.isLocked && (
                    <div className="absolute inset-0 bg-shade/25 pointer-events-none" />
                  )}
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl border-4 border-slate-900 bg-background flex items-center justify-center">
                      <BatteryCharging className="w-6 h-6" strokeWidth={2.25} />
                    </div>
                    {product.isLocked && (
                      <span className="inline-flex items-center gap-1 rounded-full border-3 border-slate-900 bg-blossom px-2.5 py-1 text-xs font-black shadow-[2px_2px_0px_0px_var(--shade)]">
                        <Lock className="w-3.5 h-3.5" />
                        Kilitli
                      </span>
                    )}
                  </div>
                  <p className="font-black text-lg leading-tight">{product.name}</p>
                  <p className="font-bold text-sm text-shade-2 mt-1">
                    Kapasite: {product.capacityKwh} kWh
                  </p>
                  <p className="font-black text-base mt-3">
                    {product.price.toLocaleString('tr-TR')} Coin
                  </p>
                  {product.isLocked && (
                    <div className="mt-3 rounded-lg border-2 border-slate-900 bg-background/95 px-2.5 py-1.5 space-y-1">
                      <p className="text-xs font-black text-shade">Kilit Nedeni</p>
                      {product.reqLevelLabel && (
                        <p className="text-[11px] font-bold text-shade-2">{product.reqLevelLabel}</p>
                      )}
                      {product.requiredResearchLabel && (
                        <p className="text-[11px] font-bold text-shade-2">
                          Araştırma: {product.requiredResearchLabel}
                        </p>
                      )}
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </section>
        </div>
      </motion.main>

      <Modal
        isOpen={Boolean(selectedProduct)}
        onClose={() => {
          setSelectedProduct(null)
          setBuyError('')
        }}
        title={selectedProduct?.name}
      >
        {selectedProduct && (
          <div className="space-y-3">
            <p className="font-bold text-sm text-shade-2">{selectedProduct.description}</p>
            <div className="rounded-xl border-3 border-slate-900 bg-background p-3">
              <p className="font-black text-sm text-shade-2">Kategori</p>
              <p className="font-black">
                {selectedProduct.category === 'panel'
                  ? 'Güneş Paneli'
                  : selectedProduct.category === 'battery'
                    ? 'Depolama Ünitesi'
                    : 'Araştırma Lisansı'}
              </p>
            </div>
            <div className="rounded-xl border-3 border-slate-900 bg-background p-3">
              <p className="font-black text-sm text-shade-2">
                {selectedProduct.category === 'research' ? 'Koşullar' : 'Performans'}
              </p>
              <p className="font-black">
                {selectedProduct.category === 'panel'
                  ? `Güç: +${selectedProduct.displayOutput}`
                  : selectedProduct.category === 'battery'
                    ? `Kapasite: ${selectedProduct.capacityKwh} kWh`
                    : selectedProduct.reqLevelLabel ?? 'Uygun seviyede Coin ile satın alınır.'}
              </p>
            </div>
            <div className="rounded-xl border-3 border-slate-900 bg-background p-3">
              <p className="font-black text-sm text-shade-2">Fiyat</p>
              <p className="font-black">{selectedProduct.price.toLocaleString('tr-TR')} Coin</p>
            </div>

            {buyError && <p className="text-xs font-bold text-rose-700">{buyError}</p>}

            {selectedProduct.category === 'research' && unlockedResearches.includes(selectedProduct.id) ? (
              <div className="rounded-xl border-3 border-slate-900 bg-sprout px-3 py-3 font-black text-sm text-center">
                Bu araştırma lisansı zaten aktif.
              </div>
            ) : selectedProduct.isLocked ? (
              <div className="space-y-2">
                <div className="rounded-xl border-3 border-slate-900 bg-blossom p-3 space-y-1">
                  <p className="font-black text-sm text-shade-2">Durum</p>
                  {selectedProduct.reqLevelLabel && (
                    <p className="font-black text-xs">{selectedProduct.reqLevelLabel}</p>
                  )}
                  {selectedProduct.requiredResearchLabel && (
                    <p className="font-black text-xs">Araştırma: {selectedProduct.requiredResearchLabel}</p>
                  )}
                </div>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedProduct(null)
                    setScreen('research')
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border-4 border-slate-900 bg-blossom-deep py-3 font-black shadow-[4px_4px_0px_0px_var(--shade)] cursor-pointer"
                >
                  <Compass className="w-5 h-5" />
                  Araştırmaya Git
                </motion.button>
              </div>
            ) : (
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePurchase}
                className="w-full flex items-center justify-center gap-2 rounded-xl border-4 border-slate-900 bg-sunlit-deep py-3 font-black shadow-[4px_4px_0px_0px_var(--shade)] cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5" />
                Satın Al
              </motion.button>
            )}
          </div>
        )}
      </Modal>

      <TabBar activeScreen="market" onChange={setScreen} />
    </div>
  )
}

export default MarketScreen
