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
  const filledSlots = inventory.length
  const [selectedItemId, setSelectedItemId] = useState(null)

  const openUpgradeModal = (itemId) => {
    setSelectedItemId(itemId)
  }

  const openMarketModal = () => {
    setScreen('market')
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
                {filledSlots}/{unlockedSlots} Dolu - Toplam {maxSlots} Yuva
              </span>
            </div>
            <PowerHub openUpgradeModal={openUpgradeModal} openMarketModal={openMarketModal} />
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

      <TabBar activeScreen="power_center" onChange={setScreen} />
    </div>
  )
}

export default PowerCenterScreen
