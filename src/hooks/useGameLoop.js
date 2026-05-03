import { useEffect, useRef } from 'react'
import GAME_CONFIG from '../config/gameConfig'
import useGameStore from '../store/useGameStore'

function resolveMsPerSimHour(debugOverride) {
  const base = GAME_CONFIG.gameLoop.msPerSimulatedHour
  const lo = GAME_CONFIG.gameLoop.debugMsPerSimHourMin ?? 200
  const hi = GAME_CONFIG.gameLoop.debugMsPerSimHourMax ?? 12000
  const ms =
    typeof debugOverride === 'number' && Number.isFinite(debugOverride) ? debugOverride : base
  return Math.min(hi, Math.max(lo, ms))
}

/**
 * Aktif bir gün varken her simülasyon saati için gerçek dünyada bekleme (`GAME_CONFIG.gameLoop`).
 * Varsayılan: ~24 sn tam gün (24 × 1000 ms). Debug’da `debugMsPerSimHourOverride` ile değiştirilebilir.
 */
export default function useGameLoop() {
  const isStartingRef = useRef(false)

  useEffect(() => {
    let timeoutId

    const loop = () => {
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

      const scheduleNext = () => {
        const delayMs = resolveMsPerSimHour(useGameStore.getState().debugMsPerSimHourOverride)
        timeoutId = window.setTimeout(loop, delayMs)
      }

      if (!hasStartedGame) {
        scheduleNext()
        return
      }

      const shouldStartInitialDay =
        !isDayActive && day === 1 && hour === 0 && dailyForecast.length === 0

      if (shouldStartInitialDay && gameLoopMode !== 'pause' && !isStartingRef.current) {
        isStartingRef.current = true
        Promise.resolve(startDay()).finally(() => {
          isStartingRef.current = false
        })
        scheduleNext()
        return
      }

      if (!isDayActive) {
        if (gameLoopMode === 'fast' && !isStartingRef.current) {
          isStartingRef.current = true
          Promise.resolve(startDay()).finally(() => {
            isStartingRef.current = false
          })
        }
        scheduleNext()
        return
      }

      if (gameLoopMode === 'pause') {
        scheduleNext()
        return
      }

      tickProductionHour()
      scheduleNext()
    }

    timeoutId = window.setTimeout(
      loop,
      resolveMsPerSimHour(useGameStore.getState().debugMsPerSimHourOverride),
    )

    return () => {
      if (timeoutId != null) window.clearTimeout(timeoutId)
    }
  }, [])
}
