import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { BatteryCharging, CirclePlus, ShoppingCart } from 'lucide-react'
import PanelThumbnail from '../components/PanelThumbnail'
import { BATTERIES, BATTERY_DEF_BY_TYPE_ID, HUB_SLOT_UNLOCK_COST } from '../constants/gameData'
import {
  getBatteryGameKeyFromTypeId,
  getBatteryUpgradeProjection,
} from '../constants/equipmentUpgrade'
import useGameStore from '../store/useGameStore'
import { allocateSequentialBatteryDisplay } from '../utils/sequentialBatteryAllocation'
import EquipmentUpgradeSection from '../components/EquipmentUpgradeSection'
import { sfxError } from '../utils/soundManager'
import Header from '../components/Header'
import Modal from '../components/Modal'
import TabBar from '../components/TabBar'

function lockBattery(def, level, unlockedResearchIds) {
  const lacksLevel = def.reqLevel != null && level < def.reqLevel
  const lacksResearch =
    Boolean(def.reqResearch) && !unlockedResearchIds.includes(def.reqResearch)
  return !lacksLevel && !lacksResearch
}

function StorageAreaScreen() {
  const setScreen = useGameStore((s) => s.setScreen)
  const coins = useGameStore((s) => s.coins)
  const level = useGameStore((s) => s.level)
  const maxSlots = useGameStore((s) => s.maxSlots)
  const unlockedSlots = useGameStore((s) => s.unlockedSlots)
  const unlockedResearches = useGameStore((s) => s.unlockedResearches)
  const activeBatteries = useGameStore((s) => s.activeBatteries)
  const currentEnergy = useGameStore((s) => s.currentEnergy)
  const buyItem = useGameStore((s) => s.buyItem)
  const unlockHubSlot = useGameStore((s) => s.unlockHubSlot)
  const upgradeBattery = useGameStore((s) => s.upgradeBattery)

  const [batteryUpgradeError, setBatteryUpgradeError] = useState('')

  const batteryCapacityTotal = useMemo(
    () =>
      activeBatteries.reduce((sum, b) => {
        const def = BATTERY_DEF_BY_TYPE_ID[b.type]
        return sum + (def?.capacity ?? 0)
      }, 0),
    [activeBatteries],
  )

  const warehouseFull =
    batteryCapacityTotal > 0 &&
    Math.min(currentEnergy, batteryCapacityTotal) >= batteryCapacityTotal - 1e-6

  const aggregateFillPct =
    batteryCapacityTotal > 0
      ? Math.min(100, Math.round((currentEnergy / batteryCapacityTotal) * 100))
      : 0

  const batteriesDisplay = useMemo(() => {
    const units = activeBatteries.map((b) => ({
      id: b.id,
      capacityKwh: BATTERY_DEF_BY_TYPE_ID[b.type]?.capacity ?? 0,
    }))
    const alloc = allocateSequentialBatteryDisplay(currentEnergy, units)

    return activeBatteries.map((b, idx) => {
      const def = BATTERY_DEF_BY_TYPE_ID[b.type]
      const slice = alloc[idx]
      const cap = def?.capacity ?? 0

      return {
        id: b.id,
        name: def?.name ?? 'Batarya',
        gameKey: getBatteryGameKeyFromTypeId(b.type),
        capacityKwh: cap,
        chargePct: slice?.chargePct ?? 0,
        storedKwh: slice?.storedKwh ?? 0,
        orderIndex: slice?.orderIndex ?? idx + 1,
        isFull: Boolean(slice?.isFull && cap > 0),
        imageSrc: def?.imageSrc,
      }
    })
  }, [activeBatteries, currentEnergy])

  const filledSlots = batteriesDisplay.length

  const [selectedBatteryId, setSelectedBatteryId] = useState(null)
  const [emptySlotModalIndex, setEmptySlotModalIndex] = useState(null)
  const [selectedBatteryKey, setSelectedBatteryKey] = useState(null)
  const [lockedSlotModalIndex, setLockedSlotModalIndex] = useState(null)
  const [purchaseError, setPurchaseError] = useState('')
  const [unlockError, setUnlockError] = useState('')

  const unlockPrice = HUB_SLOT_UNLOCK_COST
  const canAffordUnlock = coins >= unlockPrice

  const batteryOptions = useMemo(() => {
    const items = []
    for (const [gameKey, def] of Object.entries(BATTERIES)) {
      if (!lockBattery(def, level, unlockedResearches)) continue
      items.push({
        gameKey,
        id: def.id,
        name: def.name,
        sub: `Depolama ${def.capacity} kWh`,
        price: `${def.price.toLocaleString('tr-TR')} Coin`,
        rawPrice: def.price,
        imageSrc: def.imageSrc,
      })
    }
    return items
  }, [level, unlockedResearches])

  const selectedBattery = useMemo(
    () => batteriesDisplay.find((item) => item.id === selectedBatteryId) || null,
    [batteriesDisplay, selectedBatteryId],
  )

  const batteryUpgradeProjection = useMemo(() => {
    if (!selectedBattery?.gameKey) return null
    return getBatteryUpgradeProjection(selectedBattery.gameKey, level, unlockedResearches)
  }, [selectedBattery, level, unlockedResearches])

  const selectedEquipment = useMemo(
    () => batteryOptions.find((item) => item.id === selectedBatteryKey) ?? null,
    [batteryOptions, selectedBatteryKey],
  )

  const slots = useMemo(
    () => Array.from({ length: maxSlots }, (_, index) => batteriesDisplay[index] || null),
    [batteriesDisplay, maxSlots],
  )

  const openEmptySlotPurchaseModal = (slotIndex) => {
    if (slotIndex >= unlockedSlots) return
    if (activeBatteries.length >= unlockedSlots) return
    const first = batteryOptions[0]
    setEmptySlotModalIndex(slotIndex)
    setSelectedBatteryKey(first?.id ?? null)
    setPurchaseError('')
  }

  const closeEmptySlotPurchaseModal = () => {
    setEmptySlotModalIndex(null)
    setSelectedBatteryKey(null)
    setPurchaseError('')
  }

  const handleBatteryPurchase = () => {
    if (!selectedEquipment) return
    if (activeBatteries.length >= unlockedSlots) {
      setPurchaseError('Önce yeni yuva aç.')
      return
    }
    const result = buyItem('battery', selectedEquipment.gameKey)
    if (!result.ok) {
      setPurchaseError(result.reason || 'Satın alma başarısız.')
      return
    }
    closeEmptySlotPurchaseModal()
  }

  const handleBatteryUpgrade = () => {
    if (!selectedBattery) return
    setBatteryUpgradeError('')
    const result = upgradeBattery(selectedBattery.id)
    if (!result.ok) setBatteryUpgradeError(result.reason || 'Yükseltme başarısız.')
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
                {filledSlots}/{unlockedSlots} Dolu - Toplam {maxSlots} Yuva
              </span>
            </div>
            <p className="text-xs font-bold text-shade-2 mb-3 leading-relaxed">
              Toplam depolama:{' '}
              <span className="font-black text-shade">
                {batteryCapacityTotal > 0 ? `${batteryCapacityTotal.toLocaleString('tr-TR')} kWh` : '0 kWh'}
              </span>
              {' · '}
              Toplam dolu:{' '}
              <span className={`font-black ${warehouseFull ? 'text-rose-700' : 'text-shade'}`}>
                {batteryCapacityTotal > 0
                  ? `${Math.min(currentEnergy, batteryCapacityTotal).toLocaleString('tr-TR', { maximumFractionDigits: 1 })} kWh`
                  : '—'}
              </span>
              {' · '}
              Genel doluluk:{' '}
              <span className={`font-black ${warehouseFull ? 'text-rose-700' : 'text-shade'}`}>
                {batteryCapacityTotal > 0 ? `%${aggregateFillPct}` : '—'}
              </span>
              {batteryCapacityTotal > 0 && (
                <span className="block mt-2 font-black text-[11px] text-shade-2">
                  Dolum sırası: önce 1. depo dolacak şekilde dolar; taşan enerji 2. ve sonraki depolara sırayla yazar.
                  Her kartın yüzdesi o deponun kendi doluluğudur; %100 uyarı olarak kırmızı görünür.
                </span>
              )}
              {batteryCapacityTotal === 0 && ' (henüz batarya yok)'}
            </p>

            <div
              className="rounded-3xl border-4 border-slate-900 bg-background p-4 shadow-[6px_6px_0px_0px_var(--shade)]"
              style={{
                backgroundImage: 'radial-gradient(var(--shade-soft) 1.25px, transparent 1.25px)',
                backgroundSize: '14px 14px',
              }}
            >
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {slots.map((item, slotIndex) => {
                  const isLocked = slotIndex >= unlockedSlots

                  if (isLocked) {
                    return (
                      <motion.button
                        key={`locked-${slotIndex}`}
                        type="button"
                        onClick={() => {
                          setUnlockError('')
                          setLockedSlotModalIndex(slotIndex)
                        }}
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
                    const full = item.isFull || item.chargePct >= 100
                    return (
                      <motion.button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedBatteryId(item.id)}
                        whileHover={{ y: -3, scale: 1.02 }}
                        whileTap={{ y: 0, scale: 0.97 }}
                        transition={{ type: 'spring', stiffness: 420, damping: 24 }}
                        className={`rounded-3xl border-4 p-4 shadow-[4px_4px_0px_0px_var(--shade)] cursor-pointer relative ${
                          full
                            ? 'border-rose-700 bg-rose-50/60 text-shade ring-2 ring-rose-400/70'
                            : 'border-slate-900 bg-background text-shade'
                        }`}
                      >
                        <span
                          className={`absolute left-3 top-3 rounded-full border-2 px-2 py-0.5 text-[10px] font-black ${
                            full
                              ? 'border-rose-800 bg-rose-600 text-white'
                              : 'border-slate-900 bg-background text-shade'
                          }`}
                        >
                          Depo {item.orderIndex}
                        </span>
                        <div className="mx-auto mb-3 mt-6 w-16 h-16 rounded-2xl border-4 border-slate-900 flex items-center justify-center bg-background overflow-hidden p-1">
                          {item.imageSrc ? (
                            <PanelThumbnail src={item.imageSrc} alt={item.name} className="w-full h-full" />
                          ) : (
                            <div
                              className={`w-11 h-11 rounded-xl border-3 border-slate-900 flex items-center justify-center ${
                                full ? 'bg-rose-200' : 'bg-sprout'
                              }`}
                            >
                              <BatteryCharging className="w-6 h-6" strokeWidth={2.25} />
                            </div>
                          )}
                        </div>
                        <p className="font-black text-lg leading-tight">{item.name}</p>
                        <p className="font-black text-sm text-shade-2 mt-1">
                          Kapasite {item.capacityKwh} kWh
                        </p>
                        <p className={`font-black text-xs mt-1 tabular-nums ${full ? 'text-rose-800' : 'text-shade-soft'}`}>
                          Bu depoda: {item.storedKwh.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} kWh · %
                          {item.chargePct}
                          {full ? ' — dolu' : ''}
                        </p>
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
        onClose={() => {
          setSelectedBatteryId(null)
          setBatteryUpgradeError('')
        }}
        title={selectedBattery ? selectedBattery.name : 'Batarya Detayı'}
      >
        {selectedBattery && (
          <div className="space-y-3 font-bold text-shade">
            <div className="rounded-2xl border-3 border-slate-900 bg-background p-3 shadow-[inset_0_0_0_1px_rgba(42,42,51,0.06)]">
              {selectedBattery.imageSrc && (
                <div className="mb-3 mx-auto max-w-[180px] rounded-xl border-3 border-slate-900 bg-breeze/30 p-2">
                  <PanelThumbnail src={selectedBattery.imageSrc} alt={selectedBattery.name} className="w-full h-24" />
                </div>
              )}
              <p className="text-[11px] font-black uppercase tracking-wide text-shade-soft">Depo detayı</p>
              <p className="text-sm text-shade-2 mt-2">Sıra: Depo {selectedBattery.orderIndex}</p>
              <p className="text-sm mt-1">Nominal kapasite: {selectedBattery.capacityKwh} kWh</p>
              <p className={`text-base mt-2 ${selectedBattery.chargePct >= 100 ? 'text-rose-700' : ''}`}>
                Bu depoda saklı:{' '}
                {selectedBattery.storedKwh.toLocaleString('tr-TR', {
                  maximumFractionDigits: 2,
                })}{' '}
                kWh · %{selectedBattery.chargePct}
                {selectedBattery.chargePct >= 100 ? ' — depo dolu' : ''}
              </p>
              <p className="text-[11px] font-bold text-shade-soft mt-3 leading-snug">
                Retrofit daha yüksek kapasiteli hücre demektir; depodaki güncel kWh yüzdelikleri sistemdeki sıra kurallarına göre yeniden dağıtılır.
              </p>
            </div>

            <EquipmentUpgradeSection
              variant="battery"
              projection={batteryUpgradeProjection}
              coins={coins}
              onUpgrade={handleBatteryUpgrade}
              error={batteryUpgradeError}
            />
          </div>
        )}
      </Modal>

      <Modal
        isOpen={lockedSlotModalIndex !== null}
        onClose={() => {
          setLockedSlotModalIndex(null)
          setUnlockError('')
        }}
        title="Kilit Açma"
      >
        <div className="space-y-4 font-bold text-shade">
          <p className="text-sm text-shade-2">
            {lockedSlotModalIndex !== null ? `${lockedSlotModalIndex + 1}. yuva kilitli.` : 'Bu yuva kilitli.'}
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
            <p className="text-xs text-rose-700">Yeterli coin yok.</p>
          )}
          {unlockError && <p className="text-xs text-rose-700">{unlockError}</p>}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={() => {
                if (!canAffordUnlock) {
                  sfxError()
                  return
                }
                const result = unlockHubSlot()
                if (!result.ok) {
                  setUnlockError(result.reason || 'Yuva açılamadı.')
                  return
                }
                setLockedSlotModalIndex(null)
                setUnlockError('')
              }}
              disabled={!canAffordUnlock}
              className="flex-1 rounded-2xl border-4 border-slate-900 bg-sprout px-4 py-2 font-black shadow-[3px_3px_0px_0px_var(--shade)] active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 disabled:active:translate-y-0 disabled:active:shadow-[3px_3px_0px_0px_var(--shade)]"
            >
              {unlockPrice.toLocaleString('tr-TR')} Coin Öde ve Aç
            </button>
            <button
              type="button"
              onClick={() => {
                setLockedSlotModalIndex(null)
                setUnlockError('')
              }}
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
        title="Batarya Satın Al"
      >
        <div className="space-y-4 font-bold text-shade">
          <p className="text-sm text-shade-2">
            {emptySlotModalIndex !== null ? `${emptySlotModalIndex + 1}. boş yuva için batarya seç` : 'Batarya seç'}
          </p>

          <div className="grid grid-cols-1 gap-2">
            {batteryOptions.map((option) => {
              const isSelected = selectedBatteryKey === option.id
              return (
                <motion.button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedBatteryKey(option.id)}
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ y: 0, scale: 0.98 }}
                  className={`rounded-2xl border-4 p-3 text-left shadow-[4px_4px_0px_0px_var(--shade)] transition-colors ${
                    isSelected ? 'border-slate-900 bg-sprout' : 'border-slate-900 bg-background'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-11 h-11 rounded-xl border-4 border-slate-900 bg-background flex items-center justify-center overflow-hidden p-0.5">
                      <PanelThumbnail src={option.imageSrc} alt={option.name} className="w-full h-full" />
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
                <p className="text-sm font-black">Seçilebilir batarya yok</p>
                <p className="text-xs text-shade-soft mt-1">
                  Seviye veya araştırma şartlarını sağla
                </p>
              </div>
            )}
          </div>

          <div className="rounded-2xl border-3 border-slate-900 bg-breeze/40 p-3">
            <p className="text-xs text-shade-soft">Seçilen Batarya</p>
            <p className="text-base font-black">
              {selectedEquipment ? `${selectedEquipment.name} - ${selectedEquipment.price}` : '-'}
            </p>
          </div>

          {purchaseError && <p className="text-xs text-rose-700">{purchaseError}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleBatteryPurchase}
              disabled={!selectedEquipment}
              className="rounded-2xl border-4 border-slate-900 bg-sunlit-deep px-4 py-2 font-black shadow-[3px_3px_0px_0px_var(--shade)] active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0"
            >
              <ShoppingCart className="w-4 h-4" />
              Satın Al
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
