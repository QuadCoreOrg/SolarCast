import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { BatteryCharging, ShoppingCart, SunMedium } from 'lucide-react'
import useGameStore from '../store/useGameStore'
import Header from '../components/Header'
import Modal from '../components/Modal'
import PowerHub from '../components/PowerHub'
import TabBar from '../components/TabBar'
import SHOP_PRODUCTS from '../constants/shopProducts'

function PowerCenterScreen() {
  const setScreen = useGameStore((s) => s.setScreen)
  const coins = useGameStore((s) => s.coins)
  const level = useGameStore((s) => s.level)
  const research = useGameStore((s) => s.research)
  const inventory = useGameStore((s) => s.inventory)
  const maxSlots = useGameStore((s) => s.maxSlots)
  const unlockedSlots = useGameStore((s) => s.unlockedSlots)
  const filledSlots = inventory.length
  const [selectedItemId, setSelectedItemId] = useState(null)
  const [emptySlotModalIndex, setEmptySlotModalIndex] = useState(null)
  const [selectedEquipmentKey, setSelectedEquipmentKey] = useState(null)

  const equipmentOptions = useMemo(
    () =>
      SHOP_PRODUCTS.map((product) => {
        const isLocked = Boolean(product.requiredResearch && !research?.[product.requiredResearch])
        return {
          key: product.id,
          name: product.name,
          sub:
            product.category === 'panel'
              ? `+${product.productionPerSec}⚡/sn`
              : `Depolama ${product.capacityKwh} kWh`,
          price: `${product.price.toLocaleString('tr-TR')} Coin`,
          bg: product.category === 'panel' ? 'bg-sunlit' : 'bg-sprout',
          Icon: product.category === 'panel' ? SunMedium : BatteryCharging,
          isLocked,
        }
      }).filter((product) => !product.isLocked),
    [research],
  )

  const openUpgradeModal = (itemId) => {
    setSelectedItemId(itemId)
  }

  const openMarketModal = () => {
    setScreen('market')
  }

  const openEmptySlotPurchaseModal = (slotIndex) => {
    const firstAvailable = equipmentOptions.find((item) => !item.isLocked) || equipmentOptions[0]
    setEmptySlotModalIndex(slotIndex)
    setSelectedEquipmentKey(firstAvailable?.key ?? null)
  }

  const closeEmptySlotPurchaseModal = () => {
    setEmptySlotModalIndex(null)
  }

  const selectedItem = useMemo(
    () => inventory.find((item) => item.id === selectedItemId) || null,
    [inventory, selectedItemId],
  )
  const selectedEquipment = useMemo(
    () => equipmentOptions.find((item) => item.key === selectedEquipmentKey) || null,
    [equipmentOptions, selectedEquipmentKey],
  )

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
          <article className="rounded-2xl border-4 border-slate-900 bg-background p-4 shadow-[4px_4px_0px_0px_var(--shade)]">
            <div className="flex items-center justify-between mb-3">
              <h1 className="font-black text-2xl">Güç Merkezi</h1>
              <span className="rounded-full border-2 border-slate-900 bg-breeze px-3 py-1 text-xs font-black">
                {filledSlots}/{unlockedSlots} Dolu - Toplam {maxSlots} Yuva
              </span>
            </div>
            <PowerHub
              openUpgradeModal={openUpgradeModal}
              openMarketModal={openMarketModal}
              onEmptySlotClick={openEmptySlotPurchaseModal}
            />
          </article>
        </section>
      </motion.main>

      <Modal
        isOpen={Boolean(selectedItem)}
        onClose={() => setSelectedItemId(null)}
        title={selectedItem ? selectedItem.name : 'Eşya Detayı'}
      >
        {selectedItem && (
          <div className="space-y-2 font-bold text-shade">
            <p className="text-sm text-shade-2">Tip: {selectedItem.type === 'panel' ? 'Güneş Paneli' : 'Batarya'}</p>
            {selectedItem.type === 'panel' && (
              <p className="text-base">Üretim: +{selectedItem.outputPerSec ?? 0}⚡/sn</p>
            )}
            {selectedItem.type === 'battery' && (
              <p className="text-base">Doluluk: %{selectedItem.chargePct ?? 0}</p>
            )}
            <p className="text-sm text-shade-soft">Yükseltme ve detay aksiyonları yakında burada olacak.</p>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={emptySlotModalIndex !== null}
        onClose={closeEmptySlotPurchaseModal}
        title="Ekipman Satın Al"
      >
        <div className="space-y-4 font-bold text-shade">
          <p className="text-sm text-shade-2">
            {emptySlotModalIndex !== null
              ? `${emptySlotModalIndex + 1}. boş yuva için ekipman seç`
              : 'Boş yuva için ekipman seç'}
          </p>

          <div className="grid grid-cols-1 gap-2">
            {equipmentOptions.map((option) => {
              const isSelected = selectedEquipmentKey === option.key
              const Icon = option.Icon
              return (
                <motion.button
                  key={option.key}
                  type="button"
                  onClick={() => setSelectedEquipmentKey(option.key)}
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ y: 0, scale: 0.98 }}
                  className={`rounded-2xl border-4 p-3 text-left shadow-[4px_4px_0px_0px_var(--shade)] transition-colors ${
                    isSelected ? `border-slate-900 ${option.bg}` : 'border-slate-900 bg-background'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-11 h-11 rounded-xl border-4 border-slate-900 bg-background flex items-center justify-center">
                      <Icon className="w-5 h-5" strokeWidth={2.25} />
                    </div>
                    <span className="rounded-full border-3 border-slate-900 bg-background px-2 py-0.5 text-[11px] font-black">
                      {option.price}
                    </span>
                  </div>
                  <p className="text-sm font-black leading-tight">{option.name}</p>
                  <p className="text-xs text-shade-2 mt-1">{option.sub}</p>
                </motion.button>
              )
            })}
            {equipmentOptions.length === 0 && (
              <div className="rounded-2xl border-4 border-slate-900 bg-background p-3 text-center">
                <p className="text-sm font-black">Henüz secilebilir ekipman yok</p>
                <p className="text-xs text-shade-soft mt-1">Arastirma acildikca burada ekipmanlar gorunecek.</p>
              </div>
            )}
          </div>

          <div className="rounded-2xl border-3 border-slate-900 bg-breeze/40 p-3">
            <p className="text-xs text-shade-soft">Seçilen Ekipman</p>
            <p className="text-base font-black">{selectedEquipment ? `${selectedEquipment.name} - ${selectedEquipment.price}` : '-'}</p>
          </div>
          <p className="text-xs text-shade-soft">Bu modal sadece UI tasarımıdır, gerçek satın alma işlemi çalışmaz.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              disabled={!selectedEquipment}
              className="rounded-2xl border-4 border-slate-900 bg-sunlit-deep px-4 py-2 font-black shadow-[3px_3px_0px_0px_var(--shade)] active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0"
            >
              <ShoppingCart className="w-4 h-4" />
              Seçili Ekipmanı Satın Al
            </button>
            <button
              type="button"
              onClick={closeEmptySlotPurchaseModal}
              className="rounded-2xl border-4 border-slate-900 bg-background px-4 py-2 font-black shadow-[3px_3px_0px_0px_var(--shade)] active:translate-y-1 active:shadow-none"
            >
              Kapat
            </button>
          </div>
        </div>
      </Modal>

      <TabBar activeScreen="power_center" onChange={setScreen} />
    </div>
  )
}

export default PowerCenterScreen
