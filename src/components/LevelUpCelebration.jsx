import { useEffect, useRef, useCallback, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles, X } from 'lucide-react'
import useGameStore from '../store/useGameStore'

function levelUpSoundUrl() {
  const base = (import.meta.env.BASE_URL ?? '/').replace(/\/?$/, '')
  const path = `${base}/sounds/level_up.mp3`.replace(/^\/+/g, '/')
  return path.startsWith('/') ? path : `/${path}`
}

function playLevelUpSound() {
  try {
    const audio = new Audio(levelUpSoundUrl())
    audio.volume = 0.42
    void audio.play()
  } catch {
    /* autoplay veya yükleme kısıtı */
  }
}

/**
 * Oyunda `level` arttığında kutlama arayüzü ve `level_up` sesi.
 */
export default function LevelUpCelebration() {
  const hasStartedGame = useGameStore((s) => s.hasStartedGame)

  const [payload, setPayload] = useState(null)
  const prevLevelRef = useRef(useGameStore.getState().level)
  const autoCloseTimerRef = useRef(null)

  const clearAutoClose = useCallback(() => {
    if (autoCloseTimerRef.current != null) {
      window.clearTimeout(autoCloseTimerRef.current)
      autoCloseTimerRef.current = null
    }
  }, [])

  const close = useCallback(() => {
    clearAutoClose()
    setPayload(null)
  }, [clearAutoClose])

  useEffect(() => {
    if (!hasStartedGame) {
      prevLevelRef.current = useGameStore.getState().level
      return undefined
    }

    prevLevelRef.current = useGameStore.getState().level

    const unsub = useGameStore.subscribe((state) => {
      const curr = state.level
      const prev = prevLevelRef.current
      prevLevelRef.current = curr
      if (curr > prev) {
        clearAutoClose()
        playLevelUpSound()
        setPayload({ level: curr, gained: curr - prev })
        autoCloseTimerRef.current = window.setTimeout(() => {
          setPayload(null)
          autoCloseTimerRef.current = null
        }, 4500)
      }
    })

    return () => {
      unsub()
      clearAutoClose()
    }
  }, [hasStartedGame, clearAutoClose])

  return (
    <AnimatePresence>
      {payload && (
        <motion.div
          key="levelup"
          role="dialog"
          aria-modal="true"
          aria-labelledby="levelup-title"
          className="fixed inset-0 z-[90] flex items-center justify-center p-4 pointer-events-auto"
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
            initial={{ opacity: 0, scale: 0.82, rotate: -2, y: 24 }}
            animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 12 }}
            transition={{ type: 'spring', stiffness: 340, damping: 22 }}
            className="relative w-full max-w-sm rounded-[2rem] border-4 border-slate-900 bg-gradient-to-b from-sunlit to-blossom-deep p-6 shadow-[12px_12px_0px_0px_var(--shade)] overflow-hidden pointer-events-auto"
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
              className="absolute -right-16 -top-16 h-52 w-52 rounded-full border-4 border-slate-900/20 bg-background/35"
            />
            <div
              aria-hidden="true"
              className="absolute -left-20 bottom-[-3rem] h-44 w-44 rounded-full border-4 border-slate-900/15 bg-sprout-deep/35"
            />

            <div className="relative text-center font-['Nunito'] font-black text-shade">
              <div className="mx-auto mb-4 flex justify-center gap-2 text-blossom-deep">
                <Sparkles className="w-8 h-8" strokeWidth={2.25} />
                <Sparkles className="w-8 h-8 -scale-x-100" strokeWidth={2.25} />
              </div>
              <p id="levelup-title" className="text-xl sm:text-2xl uppercase tracking-wide">
                Seviye atlama
              </p>
              <p className="mt-5 text-[4.25rem] sm:text-[5rem] leading-none tracking-tighter tabular-nums drop-shadow-[2px_2px_0px_rgba(0,0,0,0.12)]">
                Lv. {payload.level}
              </p>
              {payload.gained > 1 && (
                <p className="mt-3 text-sm font-bold text-shade-2">
                  Tek seferde +{payload.gained} seviye
                </p>
              )}
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={close}
                className="mt-6 w-full rounded-2xl border-4 border-slate-900 bg-background py-3 text-base uppercase tracking-wide shadow-[4px_4px_0px_0px_var(--shade)] active:translate-y-1 active:shadow-none"
              >
                Devam
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
