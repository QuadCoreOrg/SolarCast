import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { ShoppingCart, SunMedium } from 'lucide-react'
import { HUB_SLOT_UNLOCK_COST, PANELS, PANEL_CLEAN_COST, PANEL_DEF_BY_TYPE_ID } from '../constants/gameData'
import useGameStore from '../store/useGameStore'
import Header from '../components/Header'
import Modal from '../components/Modal'
import PowerHub from '../components/PowerHub'
import TabBar from '../components/TabBar'

function PowerCenterScreen() {
  const setScreen = useGameStore((s) => s.setScreen)
  const coins = useGameStore((s) => s.coins)
  const level = useGameStore((s) => s.level)
  const activePanels = useGameStore((s) => s.activePanels)
  const unlockedResearches = useGameStore((s) => s.unlockedResearches)
  const maxSlots = useGameStore((s) => s.maxSlots)
  const unlockedSlots = useGameStore((s) => s.unlockedSlots)
  const buyItem = useGameStore((s) => s.buyItem)
  const cleanPanel = useGameStore((s) => s.cleanPanel)
  const unlockHubSlot = useGameStore((s) => s.unlockHubSlot)

  const [selectedItemId, setSelectedItemId] = useState(null)
  const [emptySlotModalIndex, setEmptySlotModalIndex] = useState(null)
  const [selectedEquipmentKey, setSelectedEquipmentKey] = useState(null)
  const [purchaseError, setPurchaseError] = useState('')
  const [unlockSlotIndex, setUnlockSlotIndex] = useState(null)
  const [unlockError, setUnlockError] = useState('')

  const equipmentOptions = useMemo(
    () =>
      Object.entries(PANELS)
        .map(([panelKey, panel]) => {
          const lacksLevel = panel.reqLevel != null && level < panel.reqLevel
          const lacksResearch =
            panel.reqResearch != null && !unlockedResearches.includes(panel.reqResearch)
          const isLocked = lacksLevel || lacksResearch
          return {
            key: panel.id,
            panelKey,
            type: 'panel',
            name: panel.name,
            sub: `Alan ${panel.area}m² · Verim ${(panel.efficiency * 100).toFixed(0)}%`,
            outputLabel: `~${panel.area.toLocaleString('tr-TR')} kWh (1000 W/m²)`,
            price: `${panel.price.toLocaleString('tr-TR')} Coin`,
            rawPrice: panel.price,
            bg: 'bg-sunlit',
            Icon: SunMedium,
            outputPerSec: panel.area,
            isLocked,
          }
        })
        .filter((product) => !product.isLocked),
    [level, unlockedResearches],
  )

  const panelInventory = useMemo(
    () =>
      activePanels.map((panel) => {
        const def = PANEL_DEF_BY_TYPE_ID[panel.type]
        const dirtyDaysLimit = def?.dirtyDaysLimit ?? 0
        const daysSinceCleaned = panel.daysSinceCleaned ?? 0
        return {
          id: panel.id,
          name: def?.name ?? 'Panel',
          type: 'panel',
          outputPerSec: def?.area ?? 0,
          daysSinceCleaned,
          dirtyDaysLimit,
          needsCleaning: dirtyDaysLimit > 0 && daysSinceCleaned >= dirtyDaysLimit,
        }
      }),
    [activePanels],
  )

  const filledSlots = panelInventory.length
  const unlockPrice = HUB_SLOT_UNLOCK_COST
  const canAffordUnlock = coins >= unlockPrice

  const openUpgradeModal = (itemId) => {
    setSelectedItemId(itemId)
  }

  const openEmptySlotPurchaseModal = (slotIndex) => {
    if (slotIndex >= unlockedSlots || activePanels.length >= unlockedSlots) return

    const firstAvailable = equipmentOptions[0]
    setEmptySlotModalIndex(slotIndex)
    setSelectedEquipmentKey(firstAvailable?.key ?? null)
    setPurchaseError('')
  }

  const closeEmptySlotPurchaseModal = () => {
    setEmptySlotModalIndex(null)
    setSelectedEquipmentKey(null)
    setPurchaseError('')
  }

  const openUnlockModal = (slotIndex) => {
    setUnlockError('')
    setUnlockSlotIndex(slotIndex)
  }

  const closeUnlockModal = () => {
    setUnlockSlotIndex(null)
    setUnlockError('')
  }

  const handleUnlockPurchase = () => {
    if (!canAffordUnlock) return
    const result = unlockHubSlot()
    if (!result.ok) {
      setUnlockError(result.reason || 'Yuva açılamadı.')
      return
    }
    closeUnlockModal()
  }

  const handlePanelPurchase = () => {
    if (emptySlotModalIndex === null || !selectedEquipment) return

    if (activePanels.length >= unlockedSlots) {
      setPurchaseError('Önce yeni yuva açmalısın.')
      return
    }

    const result = buyItem('panel', selectedEquipment.panelKey)
    if (!result?.ok) {
      setPurchaseError(result?.reason || 'Satın alma başarısız.')
      return
    }

    closeEmptySlotPurchaseModal()
  }

  const handleCleanPanel = (panelId) => {
    cleanPanel(panelId, PANEL_CLEAN_COST)
  }

  const selectedItem = useMemo(
    () => panelInventory.find((item) => item?.id === selectedItemId) || null,
    [panelInventory, selectedItemId],
  )

  const selectedEquipment =
    selectedEquipmentKey != null
      ? equipmentOptions.find((item) => item.key === selectedEquipmentKey) ?? null
      : null

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
              onCleanPanel={handleCleanPanel}
              onEmptySlotClick={openEmptySlotPurchaseModal}
              onLockedSlotClick={openUnlockModal}
              unlockedSlots={unlockedSlots}
              inventoryItems={panelInventory}
            />
          </article>
        </section>
      </motion.main>

      <Modal
        isOpen={Boolean(selectedItem)}
        onClose={() => setSelectedItemId(null)}
        title={selectedItem ? selectedItem.name : 'Panel Detayı'}
      >
        {selectedItem && (
          <div className="space-y-2 font-bold text-shade">
            <p className="text-sm text-shade-2">Tip: Güneş Paneli</p>
            <p className="text-base">Üretim: +{selectedItem.outputPerSec ?? 0} kWh (1000 W/m²)</p>
            <p className="text-sm text-shade-2">Son temizlikten beri: {selectedItem.daysSinceCleaned ?? 0} gün</p>
            {selectedItem.needsCleaning && (
              <p className="text-xs text-rose-800">Kirli panelde üretim %75 azalır (verim %25'e düşer).</p>
            )}
            {selectedItem.needsCleaning && (
              <button
                type="button"
                onClick={() => handleCleanPanel(selectedItem.id)}
                className="rounded-xl border-3 border-slate-900 bg-sunlit px-3 py-1 text-xs font-black shadow-[2px_2px_0px_0px_var(--shade)]"
              >
                {PANEL_CLEAN_COST} Coin ile Temizle
              </button>
            )}
            <p className="text-sm text-shade-soft">Yükseltme ve detay aksiyonları yakında burada olacak.</p>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={emptySlotModalIndex !== null}
        onClose={closeEmptySlotPurchaseModal}
        title="Panel Satın Al"
      >
        <div className="space-y-4 font-bold text-shade">
          <p className="text-sm text-shade-2">
            {emptySlotModalIndex !== null
              ? `${emptySlotModalIndex + 1}. boş yuva için panel seç`
              : 'Boş yuva için panel seç'}
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
                  <p className="text-xs text-shade-soft mt-1">{option.outputLabel}</p>
                </motion.button>
              )
            })}
            {equipmentOptions.length === 0 && (
              <div className="rounded-2xl border-4 border-slate-900 bg-background p-3 text-center">
                <p className="text-sm font-black">Henüz seçilebilir panel yok</p>
                <p className="text-xs text-shade-soft mt-1">Araştırmalar açıldıkça burada panel seçenekleri görünecek.</p>
              </div>
            )}
          </div>

          <div className="rounded-2xl border-3 border-slate-900 bg-breeze/40 p-3">
            <p className="text-xs text-shade-soft">Seçilen Panel</p>
            <p className="text-base font-black">
              {selectedEquipment ? `${selectedEquipment.name} - ${selectedEquipment.price}` : '-'}
            </p>
          </div>

          {purchaseError && <p className="text-xs text-rose-700">{purchaseError}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handlePanelPurchase}
              disabled={!selectedEquipment}
              className="rounded-2xl border-4 border-slate-900 bg-sunlit-deep px-4 py-2 font-black shadow-[3px_3px_0px_0px_var(--shade)] active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0"
            >
              <ShoppingCart className="w-4 h-4" />
              Seçili Paneli Satın Al
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

      <Modal isOpen={unlockSlotIndex !== null} onClose={closeUnlockModal} title="Kilit Açma Satın Alımı">
        <div className="space-y-4 font-bold text-shade">
          <p className="text-sm text-shade-2">
            {unlockSlotIndex !== null ? `${unlockSlotIndex + 1}. yuva kilitli.` : 'Bu yuva kilitli.'}
          </p>
          <div className="rounded-2xl border-3 border-slate-900 bg-breeze/50 p-3">
            <p className="text-xs text-shade-soft">Açma Bedeli</p>
            <p className="text-xl font-black">{unlockPrice.toLocaleString('tr-TR')} Coin</p>
          </div>
          <div className="rounded-2xl border-3 border-slate-900 bg-background p-3">
            <p className="text-xs text-shade-soft">Mevcut Coin</p>
            <p className="text-xl font-black">{coins.toLocaleString('tr-TR')} Coin</p>
          </div>
          {!canAffordUnlock && (
            <p className="text-xs text-rose-700">Yeterli coin yok. Bu yuvayı açmak için daha fazla coin gerekli.</p>
          )}
          {unlockError && <p className="text-xs text-rose-700">{unlockError}</p>}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={handleUnlockPurchase}
              disabled={!canAffordUnlock}
              className="flex-1 rounded-2xl border-4 border-slate-900 bg-sprout px-4 py-2 font-black shadow-[3px_3px_0px_0px_var(--shade)] active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 disabled:active:translate-y-0 disabled:active:shadow-[3px_3px_0px_0px_var(--shade)]"
            >
              {unlockPrice.toLocaleString('tr-TR')} Coin Öde ve Aç
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
