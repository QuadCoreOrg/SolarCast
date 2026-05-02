import { useEffect, useRef } from 'react'
import useGameStore from '../store/useGameStore'

/**
 * Oyunda aktif bir gün varken her 1 saniyede bir bir “simülasyon saati” ilerletir (`tickProductionHour`).
 */
export default function useGameLoop() {
  const isStartingRef = useRef(false)

  useEffect(() => {
    const id = window.setInterval(() => {
      const {
        hasStartedGame,
        day,
        hour,
        dailyForecast,
        isDayActive,
        gameLoopMode,
        tickProductionHour,
        startDay,
      } = useGameStore.getState()

      if (!hasStartedGame) return

      // Oyun başlar başlamaz ilk günü otomatik başlat.
      const shouldStartInitialDay = !isDayActive && day === 1 && hour === 0 && dailyForecast.length === 0
      if (shouldStartInitialDay && gameLoopMode !== 'pause' && !isStartingRef.current) {
        isStartingRef.current = true
        Promise.resolve(startDay()).finally(() => {
          isStartingRef.current = false
        })
        return
      }

      if (!isDayActive) {
        if (gameLoopMode === 'fast' && !isStartingRef.current) {
          isStartingRef.current = true
          Promise.resolve(startDay()).finally(() => {
            isStartingRef.current = false
          })
        }
        return
      }

      if (gameLoopMode === 'pause') return
      tickProductionHour()
    }, 1000)

    return () => window.clearInterval(id)
  }, [])
}
