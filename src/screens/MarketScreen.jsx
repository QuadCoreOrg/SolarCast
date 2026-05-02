import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { BatteryCharging, Compass, Gauge, Lock, Settings, ShoppingCart, Store, SunMedium, Zap } from 'lucide-react'
import Modal from '../components/Modal'
import Header from '../components/Header'
import SHOP_PRODUCTS from '../constants/shopProducts'
import useGameStore from '../store/useGameStore'

function MarketScreen() {
  const setScreen = useGameStore((s) => s.setScreen)
  const coins = useGameStore((s) => s.coins)
  const level = useGameStore((s) => s.level)
  const research = useGameStore((s) => s.research)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const products = useMemo(
    () =>
      SHOP_PRODUCTS.map((product) => {
        const isLocked = Boolean(product.requiredResearch && !research?.[product.requiredResearch])
        return { ...product, isLocked }
      }),
    [research],
  )

  const handleOpenProduct = (product) => {
    setSelectedProduct(product)
  }

  const panelProducts = products.filter((p) => p.category === 'panel')
  const batteryProducts = products.filter((p) => p.category === 'battery')

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      className="h-screen bg-breeze flex flex-col font-['Nunito'] text-shade overflow-hidden"
    >
      <Header coins={coins} level={level} />

      <div className="max-w-6xl w-full mx-auto flex-1 min-h-0 flex flex-col gap-4 p-4 sm:p-6">
        <div className="shrink-0 flex items-center justify-between rounded-2xl border-4 border-slate-900 bg-breeze p-4 shadow-[4px_4px_0px_0px_var(--shade)]">
          <div>
            <h1 className="font-black text-2xl">Mağaza</h1>
            <p className="font-bold text-sm text-shade-2">Panelleri ve depolama ünitelerini buradan satın al.</p>
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
                  <p className="font-bold text-sm text-shade-2 mt-1">Üretim: +{product.productionPerSec}⚡/sn</p>
                  <p className="font-black text-base mt-3">{product.price.toLocaleString('tr-TR')} kredi</p>
                  {product.isLocked && (
                    <div className="mt-3 rounded-lg border-2 border-slate-900 bg-background/95 px-2.5 py-1.5">
                      <p className="text-xs font-black text-shade">Araştırma Gerekli</p>
                      <p className="text-[11px] font-bold text-shade-2">{product.requiredResearchLabel}</p>
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
                  <p className="font-bold text-sm text-shade-2 mt-1">Kapasite: {product.capacityKwh} kWh</p>
                  <p className="font-black text-base mt-3">{product.price.toLocaleString('tr-TR')} kredi</p>
                  {product.isLocked && (
                    <div className="mt-3 rounded-lg border-2 border-slate-900 bg-background/95 px-2.5 py-1.5">
                      <p className="text-xs font-black text-shade">Araştırma Gerekli</p>
                      <p className="text-[11px] font-bold text-shade-2">{product.requiredResearchLabel}</p>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </section>
        </div>
      </div>

      <Modal
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        title={selectedProduct?.name}
      >
        {selectedProduct && (
          <div className="space-y-3">
            <p className="font-bold text-sm text-shade-2">{selectedProduct.description}</p>
            <div className="rounded-xl border-3 border-slate-900 bg-background p-3">
              <p className="font-black text-sm text-shade-2">Kategori</p>
              <p className="font-black">{selectedProduct.category === 'panel' ? 'Güneş Paneli' : 'Depolama Ünitesi'}</p>
            </div>
            <div className="rounded-xl border-3 border-slate-900 bg-background p-3">
              <p className="font-black text-sm text-shade-2">Performans</p>
              <p className="font-black">
                {selectedProduct.category === 'panel'
                  ? `Üretim: +${selectedProduct.productionPerSec}⚡/sn`
                  : `Kapasite: ${selectedProduct.capacityKwh} kWh`}
              </p>
            </div>
            <div className="rounded-xl border-3 border-slate-900 bg-background p-3">
              <p className="font-black text-sm text-shade-2">Fiyat</p>
              <p className="font-black">{selectedProduct.price.toLocaleString('tr-TR')} kredi</p>
            </div>

            {selectedProduct.isLocked ? (
              <div className="space-y-2">
                <div className="rounded-xl border-3 border-slate-900 bg-blossom p-3">
                  <p className="font-black text-sm text-shade-2">Durum</p>
                  <p className="font-black">Kilitli - Gerekli araştırma: {selectedProduct.requiredResearchLabel}</p>
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
                className="w-full flex items-center justify-center gap-2 rounded-xl border-4 border-slate-900 bg-sunlit-deep py-3 font-black shadow-[4px_4px_0px_0px_var(--shade)] cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5" />
                Satın Al
              </motion.button>
            )}
          </div>
        )}
      </Modal>

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

export default MarketScreen
