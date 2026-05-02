import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { BatteryCharging, CirclePlus, ShoppingCart } from 'lucide-react'
import useGameStore from '../store/useGameStore'
import Header from '../components/Header'
import Modal from '../components/Modal'
import TabBar from '../components/TabBar'
import SHOP_PRODUCTS from '../constants/shopProducts'

function StorageAreaScreen() {
  const setScreen = useGameStore((s) => s.setScreen)
  const coins = useGameStore((s) => s.coins)
  const level = useGameStore((s) => s.level)
  const inventory = useGameStore((s) => s.inventory)
  const maxSlots = useGameStore((s) => s.maxSlots)
  const unlockedSlots = useGameStore((s) => s.unlockedSlots)
  const research = useGameStore((s) => s.research)

  const batteries = useMemo(() => inventory.filter((item) => item.type === 'battery'), [inventory])
  const filledSlots = batteries.length

  const [selectedBatteryId, setSelectedBatteryId] = useState(null)
  const [emptySlotModalIndex, setEmptySlotModalIndex] = useState(null)
  const [selectedEquipmentKey, setSelectedEquipmentKey] = useState(null)
  const [lockedSlotModalIndex, setLockedSlotModalIndex] = useState(null)
  const [uiUnlockedSlots, setUiUnlockedSlots] = useState(unlockedSlots)
  const unlockPrice = 1200
  const canAffordUnlock = coins >= unlockPrice

  const batteryOptions = useMemo(
    () =>
      SHOP_PRODUCTS.filter((product) => product.category === 'battery')
        .map((product) => {
          const isLocked = Boolean(product.requiredResearch && !research?.[product.requiredResearch])
          return {
            key: product.id,
            name: product.name,
            sub: `Depolama ${product.capacityKwh} kWh`,
            price: `${product.price.toLocaleString('tr-TR')} Coin`,
            isLocked,
          }
        })
        .filter((product) => !product.isLocked),
    [research],
  )

  const selectedBattery = useMemo(
    () => batteries.find((item) => item.id === selectedBatteryId) || null,
    [batteries, selectedBatteryId],
  )
  const selectedEquipment = useMemo(
    () => batteryOptions.find((item) => item.key === selectedEquipmentKey) || null,
    [batteryOptions, selectedEquipmentKey],
  )

  const slots = useMemo(
    () => Array.from({ length: maxSlots }, (_, index) => batteries[index] || null),
    [batteries, maxSlots],
  )

  const openEmptySlotPurchaseModal = (slotIndex) => {
    const firstAvailable = batteryOptions[0]
    setEmptySlotModalIndex(slotIndex)
    setSelectedEquipmentKey(firstAvailable?.key ?? null)
  }

  const closeEmptySlotPurchaseModal = () => {
    setEmptySlotModalIndex(null)
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
          <article className="rounded-2xl border-4 border-slate-900 bg-background p-4 shadow-[4px_4px_0px_0px_var(--shade)]">
            <div className="flex items-center justify-between mb-3">
              <h1 className="font-black text-2xl">Depolama Alanı</h1>
              <span className="rounded-full border-2 border-slate-900 bg-breeze px-3 py-1 text-xs font-black">
                {filledSlots}/{uiUnlockedSlots} Dolu - Toplam {maxSlots} Yuva
              </span>
            </div>

            <div
              className="rounded-3xl border-4 border-slate-900 bg-background p-4 shadow-[6px_6px_0px_0px_var(--shade)]"
              style={{
                backgroundImage: 'radial-gradient(var(--shade-soft) 1.25px, transparent 1.25px)',
                backgroundSize: '14px 14px',
              }}
            >
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {slots.map((item, slotIndex) => {
                  const isLocked = slotIndex >= uiUnlockedSlots

                  if (isLocked) {
                    return (
                      <motion.button
                        key={`locked-${slotIndex}`}
                        type="button"
                        onClick={() => setLockedSlotModalIndex(slotIndex)}
                        whileHover={{ y: -2, scale: 1.01 }}
                        whileTap={{ y: 0, scale: 0.98 }}
                        transition={{ type: 'spring', stiffness: 360, damping: 26 }}
                        className="rounded-3xl border-4 border-dashed border-slate-900 bg-shade/10 p-4 shadow-[inset_0_0_0_2px_rgba(42,42,51,0.18)] text-shade flex flex-col items-center justify-center min-h-[172px] cursor-pointer hover:bg-blossom/50"
                      >
                        <div className="w-14 h-14 rounded-full border-4 border-slate-900 bg-background flex items-center justify-center mb-2">
                          <BatteryCharging className="w-6 h-6" strokeWidth={2.25} />
                        </div>
                        <p className="font-black text-base text-shade-2">Kilitli Yuva</p>
                        <p className="font-bold text-xs text-shade-soft mt-1">Açmak için kilidi kaldır</p>
                      </motion.button>
                    )
                  }

                  if (item) {
                    return (
                      <motion.button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedBatteryId(item.id)}
                        whileHover={{ y: -3, scale: 1.02 }}
                        whileTap={{ y: 0, scale: 0.97 }}
                        transition={{ type: 'spring', stiffness: 420, damping: 24 }}
                        className="rounded-3xl border-4 border-slate-900 bg-background p-4 shadow-[4px_4px_0px_0px_var(--shade)] text-shade cursor-pointer"
                      >
                        <div className="mx-auto mb-3 w-16 h-16 rounded-2xl border-4 border-slate-900 flex items-center justify-center bg-background">
                          <div className="w-11 h-11 rounded-xl border-3 border-slate-900 flex items-center justify-center bg-sprout">
                            <BatteryCharging className="w-6 h-6" strokeWidth={2.25} />
                          </div>
                        </div>
                        <p className="font-black text-lg leading-tight">{item.name}</p>
                        <p className="font-black text-sm text-shade-2 mt-1">%{item.chargePct ?? 0} Full</p>
                      </motion.button>
                    )
                  }

                  return (
                    <motion.button
                      key={`empty-${slotIndex}`}
                      type="button"
                      onClick={() => openEmptySlotPurchaseModal(slotIndex)}
                      whileHover={{ y: -2, scale: 1.01 }}
                      whileTap={{ y: 0, scale: 0.98 }}
                      transition={{ type: 'spring', stiffness: 380, damping: 26 }}
                      className="rounded-3xl border-4 border-dashed border-slate-900 bg-border/70 p-4 shadow-[inset_0_0_0_2px_rgba(42,42,51,0.08)] text-shade flex flex-col items-center justify-center min-h-[172px] cursor-pointer hover:bg-breeze/35"
                    >
                      <div className="w-14 h-14 rounded-full border-4 border-slate-900 bg-background flex items-center justify-center mb-2">
                        <CirclePlus className="w-7 h-7" strokeWidth={2.25} />
                      </div>
                      <p className="font-black text-base text-shade-soft">Boş Yuva</p>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </article>
        </section>
      </motion.main>

      <Modal
        isOpen={Boolean(selectedBattery)}
        onClose={() => setSelectedBatteryId(null)}
        title={selectedBattery ? selectedBattery.name : 'Batarya Detayı'}
      >
        {selectedBattery && (
          <div className="space-y-2 font-bold text-shade">
            <p className="text-sm text-shade-2">Tip: Batarya</p>
            <p className="text-base">Doluluk: %{selectedBattery.chargePct ?? 0}</p>
            <p className="text-sm text-shade-soft">Yükseltme ve detay aksiyonları yakında burada olacak.</p>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={lockedSlotModalIndex !== null}
        onClose={() => setLockedSlotModalIndex(null)}
        title="Kilit Açma Satın Alımı"
      >
        <div className="space-y-4 font-bold text-shade">
          <p className="text-sm text-shade-2">
            {lockedSlotModalIndex !== null ? `${lockedSlotModalIndex + 1}. yuva kilitli.` : 'Bu yuva kilitli.'}
          </p>
          <div className="rounded-2xl border-3 border-slate-900 bg-breeze/50 p-3">
            <p className="text-xs text-shade-soft">Açma Bedeli</p>
            <p className="text-xl font-black">{unlockPrice} Coin</p>
          </div>
          <div className="rounded-2xl border-3 border-slate-900 bg-background p-3">
            <p className="text-xs text-shade-soft">Mevcut Coin</p>
            <p className="text-xl font-black">{coins} Coin</p>
          </div>
          {!canAffordUnlock && (
            <p className="text-xs text-rose-700">Yeterli coin yok. Bu yuvayı açmak için daha fazla coin gerekli.</p>
          )}
          <p className="text-xs text-shade-soft">
            Bu akış sadece UI gösterimidir. Satın alma ve coin düşümü gerçek oyun verisini etkilemez.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={() => {
                if (!canAffordUnlock) return
                setUiUnlockedSlots((prev) => Math.min(prev + 1, maxSlots))
                setLockedSlotModalIndex(null)
              }}
              disabled={!canAffordUnlock}
              className="flex-1 rounded-2xl border-4 border-slate-900 bg-sprout px-4 py-2 font-black shadow-[3px_3px_0px_0px_var(--shade)] active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 disabled:active:translate-y-0 disabled:active:shadow-[3px_3px_0px_0px_var(--shade)]"
            >
              {unlockPrice} Coin Öde ve Aç
            </button>
            <button
              type="button"
              onClick={() => setLockedSlotModalIndex(null)}
              className="flex-1 rounded-2xl border-4 border-slate-900 bg-background px-4 py-2 font-black shadow-[3px_3px_0px_0px_var(--shade)] active:translate-y-1 active:shadow-none"
            >
              Vazgeç
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={emptySlotModalIndex !== null}
        onClose={closeEmptySlotPurchaseModal}
        title="Depolama Ekipmanı Satın Al"
      >
        <div className="space-y-4 font-bold text-shade">
          <p className="text-sm text-shade-2">
            {emptySlotModalIndex !== null
              ? `${emptySlotModalIndex + 1}. boş yuva için depolama ekipmanı seç`
              : 'Boş yuva için depolama ekipmanı seç'}
          </p>

          <div className="grid grid-cols-1 gap-2">
            {batteryOptions.map((option) => {
              const isSelected = selectedEquipmentKey === option.key
              return (
                <motion.button
                  key={option.key}
                  type="button"
                  onClick={() => setSelectedEquipmentKey(option.key)}
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ y: 0, scale: 0.98 }}
                  className={`rounded-2xl border-4 p-3 text-left shadow-[4px_4px_0px_0px_var(--shade)] transition-colors ${
                    isSelected ? 'border-slate-900 bg-sprout' : 'border-slate-900 bg-background'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-11 h-11 rounded-xl border-4 border-slate-900 bg-background flex items-center justify-center">
                      <BatteryCharging className="w-5 h-5" strokeWidth={2.25} />
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
            {batteryOptions.length === 0 && (
              <div className="rounded-2xl border-4 border-slate-900 bg-background p-3 text-center">
                <p className="text-sm font-black">Henüz secilebilir depolama ekipmani yok</p>
                <p className="text-xs text-shade-soft mt-1">Arastirma acildikca burada bataryalar gorunecek.</p>
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

      <TabBar activeScreen="storage_area" onChange={setScreen} />
    </div>
  )
}

export default StorageAreaScreen
