import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import useGameStore from '../store/useGameStore'
import Header from '../components/Header'
import Modal from '../components/Modal'
import PowerHub from '../components/PowerHub'
import TabBar from '../components/TabBar'

function PowerCenterScreen() {
  const setScreen = useGameStore((s) => s.setScreen)
  const coins = useGameStore((s) => s.coins)
  const level = useGameStore((s) => s.level)
  const inventory = useGameStore((s) => s.inventory)
  const maxSlots = useGameStore((s) => s.maxSlots)
  const unlockedSlots = useGameStore((s) => s.unlockedSlots)
  const [selectedItemId, setSelectedItemId] = useState(null)
  // UI-only unlock flow: store değerlerini değiştirmeden ekranda kilit açılmış gibi gösterir.
  const [uiUnlockedSlots, setUiUnlockedSlots] = useState(unlockedSlots)
  const [unlockSlotIndex, setUnlockSlotIndex] = useState(null)

  const filledSlots = inventory.length
  const unlockPrice = 1200
  const canAffordUnlock = coins >= unlockPrice

  const openUpgradeModal = (itemId) => {
    setSelectedItemId(itemId)
  }

  const openMarketModal = () => {
    setScreen('market')
  }

  const openUnlockModal = (slotIndex) => {
    setUnlockSlotIndex(slotIndex)
  }

  const closeUnlockModal = () => {
    setUnlockSlotIndex(null)
  }

  const handleUnlockPurchase = () => {
    if (!canAffordUnlock) {
      return
    }
    setUiUnlockedSlots((prev) => Math.min(prev + 1, maxSlots))
    closeUnlockModal()
  }

  const selectedItem = useMemo(
    () => inventory.find((item) => item.id === selectedItemId) || null,
    [inventory, selectedItemId],
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
                {filledSlots}/{uiUnlockedSlots} Dolu - Toplam {maxSlots} Yuva
              </span>
            </div>
            <PowerHub
              openUpgradeModal={openUpgradeModal}
              openMarketModal={openMarketModal}
              onLockedSlotClick={openUnlockModal}
              unlockedSlots={uiUnlockedSlots}
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

      <Modal isOpen={unlockSlotIndex !== null} onClose={closeUnlockModal} title="Kilit Açma Satın Alımı">
        <div className="space-y-4 font-bold text-shade">
          <p className="text-sm text-shade-2">
            {unlockSlotIndex !== null ? `${unlockSlotIndex + 1}. yuva kilitli.` : 'Bu yuva kilitli.'}
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
              onClick={handleUnlockPurchase}
              disabled={!canAffordUnlock}
              className="flex-1 rounded-2xl border-4 border-slate-900 bg-sprout px-4 py-2 font-black shadow-[3px_3px_0px_0px_var(--shade)] active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 disabled:active:translate-y-0 disabled:active:shadow-[3px_3px_0px_0px_var(--shade)]"
            >
              {unlockPrice} Coin Öde ve Aç
            </button>
            <button
              type="button"
              onClick={closeUnlockModal}
              className="flex-1 rounded-2xl border-4 border-slate-900 bg-background px-4 py-2 font-black shadow-[3px_3px_0px_0px_var(--shade)] active:translate-y-1 active:shadow-none"
            >
              Vazgeç
            </button>
          </div>
        </div>
      </Modal>

      <TabBar activeScreen="power_center" onChange={setScreen} />
    </div>
  )
}

export default PowerCenterScreen
