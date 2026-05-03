import { motion } from 'framer-motion'
import { BatteryCharging, CirclePlus, Lock, SunMedium } from 'lucide-react'
import useGameStore from '../store/useGameStore'
import PanelThumbnail from './PanelThumbnail'

function PowerHub({
  openUpgradeModal,
  onCleanPanel,
  onEmptySlotClick,
  onLockedSlotClick,
  unlockedSlots: unlockedSlotsProp,
  inventoryItems,
}) {
  const storeInventory = useGameStore((s) => s.inventory)
  const maxSlots = useGameStore((s) => s.maxSlots)
  const storeUnlockedSlots = useGameStore((s) => s.unlockedPanelSlots)
  const unlockedSlots = unlockedSlotsProp ?? storeUnlockedSlots
  const inventory = inventoryItems ?? storeInventory

  const slots = Array.from({ length: maxSlots }, (_, index) => inventory[index] || null)

  return (
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
                onClick={() => onLockedSlotClick?.(slotIndex)}
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ y: 0, scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 360, damping: 26 }}
                className="rounded-3xl border-4 border-dashed border-slate-900 bg-shade/10 p-4 shadow-[inset_0_0_0_2px_rgba(42,42,51,0.18)] text-shade flex flex-col items-center justify-center min-h-[172px] cursor-pointer hover:bg-blossom/50"
              >
                <div className="w-14 h-14 rounded-full border-4 border-slate-900 bg-background flex items-center justify-center mb-2">
                  <Lock className="w-6 h-6" strokeWidth={2.25} />
                </div>
                <p className="font-black text-base text-shade-2">Kilitli Yuva</p>
                <p className="font-bold text-xs text-shade-soft mt-1">Açmak için kilidi kaldır</p>
              </motion.button>
            )
          }

          if (item) {
            const isPanel = item.type === 'panel'
            const panelOutput = item.outputPerSec ?? 0
            const statusText = isPanel ? `+${panelOutput} kWh` : `%${item.chargePct ?? 0} Full`
            const Icon = isPanel ? SunMedium : BatteryCharging
            const iconBoxClass = isPanel ? 'bg-breeze' : 'bg-sprout'
            const equipmentImageSrc = item.imageSrc ?? null
            const panelCardTone = item.needsCleaning
              ? 'bg-rose-100 border-rose-700'
              : 'bg-background border-slate-900'

            return (
              <motion.button
                key={item.id}
                type="button"
                onClick={() => openUpgradeModal(item.id)}
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ y: 0, scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 420, damping: 24 }}
                className={`rounded-3xl border-4 p-4 shadow-[4px_4px_0px_0px_var(--shade)] text-shade cursor-pointer ${panelCardTone}`}
              >
                {item.needsCleaning && (
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="rounded-full border-2 border-slate-900 bg-rose-200 px-2 py-0.5 text-[10px] font-black text-rose-900">
                      Temizlenmeli
                    </span>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        onCleanPanel?.(item.id)
                      }}
                      className="rounded-full border-2 border-slate-900 bg-background px-2 py-0.5 text-[10px] font-black hover:bg-breeze"
                    >
                      Temizle
                    </button>
                  </div>
                )}
                <div className="mx-auto mb-3 w-16 h-16 rounded-2xl border-4 border-slate-900 flex items-center justify-center bg-background overflow-hidden p-1">
                  {equipmentImageSrc ? (
                    <PanelThumbnail src={equipmentImageSrc} alt={item.name} className="w-full h-full" />
                  ) : (
                    <div className={`w-11 h-11 rounded-xl border-3 border-slate-900 flex items-center justify-center ${iconBoxClass}`}>
                      <Icon className="w-6 h-6" strokeWidth={2.25} />
                    </div>
                  )}
                </div>
                <p className="font-black text-lg leading-tight">{item.name}</p>
                <p className="font-black text-sm text-shade-2 mt-1">{statusText}</p>
                {item.needsCleaning && (
                  <p className="font-black text-xs text-rose-800 mt-1">Verim %25 (-%75 kayıp)</p>
                )}
              </motion.button>
            )
          }

          return (
            <motion.button
              key={`empty-${slotIndex}`}
              type="button"
              onClick={() => onEmptySlotClick?.(slotIndex)}
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
  )
}

export default PowerHub
