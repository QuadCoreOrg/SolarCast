import { useEffect, useRef, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Gift, Sparkles, X } from 'lucide-react'
import useGameStore from '../store/useGameStore'

function celebrationSoundUrl() {
  const base = (import.meta.env.BASE_URL ?? '/').replace(/\/?$/, '')
  const path = `${base}/sounds/level_up.mp3`.replace(/^\/+/g, '/')
  return path.startsWith('/') ? path : `/${path}`
}

function playCelebrationSound() {
  try {
    const audio = new Audio(celebrationSoundUrl())
    audio.volume = 0.38
    void audio.play()
  } catch {
    /* autoplay veya yükleme kısıtı */
  }
}

/**
 * Günlük görev tamamlanınca CastAI kredisi kutlaması (seviye atlama kartına benzer).
 */
export default function QuestRewardCelebration() {
  const toast = useGameStore((s) => s.dailyQuestRewardToast)
  const clearToast = useGameStore((s) => s.clearDailyQuestRewardToast)
  const hasStartedGame = useGameStore((s) => s.hasStartedGame)

  const autoCloseRef = useRef(null)

  const clearAutoClose = useCallback(() => {
    if (autoCloseRef.current != null) {
      window.clearTimeout(autoCloseRef.current)
      autoCloseRef.current = null
    }
  }, [])

  const close = useCallback(() => {
    clearAutoClose()
    clearToast()
  }, [clearAutoClose, clearToast])

  useEffect(() => {
    if (!hasStartedGame || !toast) {
      clearAutoClose()
      return undefined
    }
    playCelebrationSound()
    clearAutoClose()
    autoCloseRef.current = window.setTimeout(() => {
      clearToast()
      autoCloseRef.current = null
    }, 4800)
    return () => clearAutoClose()
  }, [hasStartedGame, toast, clearAutoClose, clearToast])

  const multi = toast && toast.titles?.length > 1

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.key}
          role="dialog"
          aria-modal="true"
          aria-labelledby="quest-reward-title"
          className="fixed inset-0 z-[88] flex items-center justify-center p-4 pointer-events-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.button
            type="button"
            className="absolute inset-0 bg-shade/50 backdrop-blur-sm border-0 w-full h-full cursor-default"
            aria-label="Arka planı kapat"
            onClick={close}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.82, rotate: 1.5, y: 28 }}
            animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 14 }}
            transition={{ type: 'spring', stiffness: 320, damping: 21 }}
            className="relative w-full max-w-sm rounded-[2rem] border-4 border-slate-900 bg-gradient-to-b from-breeze-deep to-sprout-deep p-6 shadow-[12px_12px_0px_0px_var(--shade)] overflow-hidden pointer-events-auto"
          >
            <button
              type="button"
              onClick={close}
              className="absolute top-3 right-3 rounded-full border-4 border-slate-900 bg-background p-2 shadow-[2px_2px_0px_0px_var(--shade)] hover:bg-breeze transition-colors active:translate-y-px z-10"
              aria-label="Kapat"
            >
              <X className="w-4 h-4" strokeWidth={2.5} />
            </button>

            <div
              aria-hidden="true"
              className="absolute -right-14 -top-12 h-48 w-48 rounded-full border-4 border-slate-900/15 bg-sunlit/40"
            />
            <div
              aria-hidden="true"
              className="absolute -left-16 bottom-[-2rem] h-40 w-40 rounded-full border-4 border-slate-900/15 bg-blossom-deep/25"
            />

            <div className="relative text-center font-['Nunito'] font-black text-shade">
              <div className="mx-auto mb-3 flex justify-center">
                <div className="rounded-2xl border-3 border-slate-900 bg-background/90 p-2.5 shadow-[3px_3px_0px_0px_var(--shade)]">
                  <Gift className="w-9 h-9 text-blossom-deep" strokeWidth={2.25} aria-hidden />
                </div>
              </div>

              <p id="quest-reward-title" className="text-xl sm:text-2xl uppercase tracking-wide">
                {multi ? 'Görevler tamamlandı!' : 'Görev tamamlandı!'}
              </p>

              <div className="mt-4 flex items-center justify-center gap-2 text-blossom-deep">
                <Sparkles className="w-7 h-7" strokeWidth={2.25} />
                <p className="text-[4rem] sm:text-[4.5rem] leading-none tracking-tighter tabular-nums drop-shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">
                  +{toast.credits}
                </p>
                <Sparkles className="w-7 h-7 -scale-x-100" strokeWidth={2.25} />
              </div>

              <p className="mt-2 text-sm font-bold text-shade-2">CastAI kredisi kazandın</p>

              <ul className="mt-4 text-left rounded-2xl border-3 border-slate-900 bg-background/80 px-3 py-2 space-y-1.5 max-h-36 overflow-y-auto shadow-[2px_2px_0px_0px_var(--shade)]">
                {toast.titles.map((t, i) => (
                  <li key={`${toast.key}-${i}`} className="text-xs font-bold text-shade leading-snug flex gap-2">
                    <span className="text-emerald-800 shrink-0" aria-hidden>
                      ✓
                    </span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>

              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={close}
                className="mt-5 w-full rounded-2xl border-4 border-slate-900 bg-background py-3 text-base uppercase tracking-wide shadow-[4px_4px_0px_0px_var(--shade)] active:translate-y-1 active:shadow-none"
              >
                Süper
              </motion.button>

              <p className="mt-2 text-[11px] font-bold text-shade-2 opacity-85">
                Pencere birkaç saniye içinde kapanır.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
