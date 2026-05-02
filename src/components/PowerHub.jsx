import { motion } from 'framer-motion'
import { BatteryCharging, CirclePlus, SunMedium } from 'lucide-react'
import useGameStore from '../store/useGameStore'

function PowerHub({ openUpgradeModal, openMarketModal }) {
  const inventory = useGameStore((s) => s.inventory)
  const maxSlots = useGameStore((s) => s.maxSlots)

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
          if (item) {
            const isPanel = item.type === 'panel'
            const statusText = isPanel ? `+${item.outputPerSec ?? 0}⚡/sn` : `%${item.chargePct ?? 0} Full`
            const Icon = isPanel ? SunMedium : BatteryCharging
            const iconBoxClass = isPanel ? 'bg-breeze' : 'bg-sprout'

            return (
              <motion.button
                key={item.id}
                type="button"
                onClick={() => openUpgradeModal(item.id)}
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ y: 0, scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 420, damping: 24 }}
                className="rounded-3xl border-4 border-slate-900 bg-background p-4 shadow-[4px_4px_0px_0px_var(--shade)] text-shade cursor-pointer"
              >
                <div className="mx-auto mb-3 w-16 h-16 rounded-2xl border-4 border-slate-900 flex items-center justify-center bg-background">
                  <div className={`w-11 h-11 rounded-xl border-3 border-slate-900 flex items-center justify-center ${iconBoxClass}`}>
                    <Icon className="w-6 h-6" strokeWidth={2.25} />
                  </div>
                </div>
                <p className="font-black text-lg leading-tight">{item.name}</p>
                <p className="font-black text-sm text-shade-2 mt-1">{statusText}</p>
              </motion.button>
            )
          }

          return (
            <motion.button
              key={`empty-${slotIndex}`}
              type="button"
              onClick={openMarketModal}
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
